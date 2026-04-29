import { Router } from "express";
import type { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { cloudinary } from "../config/cloudinary";
import { config } from "../config/env";
import type { UploadResponse } from "../types";

const router = Router();
const localUploadDir = path.resolve(process.cwd(), "uploads");

function ensureUploadDir() {
  if (!fs.existsSync(localUploadDir)) {
    fs.mkdirSync(localUploadDir, { recursive: true });
  }
}

function buildLocalUploadUrl(req: Request, filename: string) {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
}

// Store file in memory (buffer) – Cloudinary handles persistence
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter(_req, file, cb) {
    const allowed = /^(image|video)\//;
    if (allowed.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only image and video files are allowed"));
    }
  },
});

// POST /api/upload
router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ message: "No file uploaded" });
    return;
  }

  const cloudinaryConfigured =
    config.cloudinary.cloudName &&
    config.cloudinary.apiKey &&
    config.cloudinary.apiSecret;

  if (!cloudinaryConfigured) {
    ensureUploadDir();
    const ext =
      path.extname(req.file.originalname) ||
      `.${req.file.mimetype.split("/")[1] ?? "bin"}`;
    const filename = `${Date.now()}-${randomUUID()}${ext}`;
    const filepath = path.join(localUploadDir, filename);
    fs.writeFileSync(filepath, req.file.buffer);

    const response: UploadResponse = {
      url: buildLocalUploadUrl(req, filename),
      publicId: filename,
      resourceType: req.file.mimetype.startsWith("video") ? "video" : "image",
      format: ext.replace(/^\./, ""),
      bytes: req.file.size,
    };
    res.json(response);
    return;
  }

  // Upload buffer to Cloudinary
  const resourceType = req.file.mimetype.startsWith("video")
    ? "video"
    : "image";

  const result = await new Promise<{
    secure_url: string;
    public_id: string;
    format: string;
    bytes: number;
  }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: "realchat" },
      (err, result) => {
        if (err || !result) reject(err ?? new Error("Upload failed"));
        else resolve(result);
      },
    );
    stream.end(req.file!.buffer);
  });

  const response: UploadResponse = {
    url: result.secure_url,
    publicId: result.public_id,
    resourceType,
    format: result.format,
    bytes: result.bytes,
  };

  res.json(response);
});

export default router;
