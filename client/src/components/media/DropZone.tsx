// DropZone — full-window drag-and-drop overlay for media upload

import { useState, useCallback, useRef, DragEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaUpload } from '../../hooks/useMediaUpload';
import { ACCEPTED_MEDIA_TYPES, MAX_FILE_SIZE } from '../../utils/constants';
import { FiUploadCloud } from 'react-icons/fi';

interface Props {
  children: React.ReactNode;
}

export default function DropZone({ children }: Props) {
  const [isDragOver, setIsDragOver] = useState(false);
  const { upload } = useMediaUpload();
  const dragCounterRef = useRef(0);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.types.includes('Files')) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
    if (dragCounterRef.current === 0) {
      setIsDragOver(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    async (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      dragCounterRef.current = 0;

      const files = e.dataTransfer.files;
      if (!files.length) return;

      const file = files[0];
      if (file.size > MAX_FILE_SIZE) {
        alert('File exceeds 10MB limit');
        return;
      }
      if (!ACCEPTED_MEDIA_TYPES.includes(file.type)) {
        alert('Unsupported file type');
        return;
      }

      await upload(file);
    },
    [upload]
  );

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ position: 'relative', width: '100%', height: '100%' }}
    >
      {children}

      <AnimatePresence>
        {isDragOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="drop-zone-active"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 16,
              }}
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                  width: 80, height: 80, borderRadius: 'var(--radius-full)',
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(99,102,241,0.5)',
                }}
              >
                <FiUploadCloud size={36} color="#fff" />
              </motion.div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--text-primary)' }}>
                  Drop your media here
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Images and videos up to 10MB
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
