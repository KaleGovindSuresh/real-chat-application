import { useEffect, useRef, useCallback } from "react";

export function useScrollToBottom<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const isAtBottomRef = useRef(true);

  const scrollToBottom = useCallback((smooth = true) => {
    ref.current?.scrollTo({
      top: ref.current.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onScroll = () => {
      isAtBottomRef.current =
        el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return { ref, scrollToBottom };
}
