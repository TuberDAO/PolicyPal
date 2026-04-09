"use client";

import { useEffect } from "react";

const FIRST_TOUCH_KEY = "pp_first_touch";
const SESSION_TOUCH_KEY = "pp_session_touch";

interface TouchData {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
  captured_at: string;
}

function readTouchData(): TouchData {
  const params =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  return {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_content: params.get("utm_content"),
    utm_term: params.get("utm_term"),
    referrer:
      typeof document !== "undefined" && document.referrer
        ? new URL(document.referrer).hostname
        : null,
    captured_at: new Date().toISOString(),
  };
}

function hasSignal(touch: TouchData): boolean {
  return !!(
    touch.utm_source ||
    touch.utm_medium ||
    touch.utm_campaign ||
    touch.referrer
  );
}

export function UtmCapture() {
  useEffect(() => {
    try {
      const touch = readTouchData();
      if (!hasSignal(touch)) return;

      const serialized = JSON.stringify(touch);

      // First-touch: write once and never overwrite.
      if (!localStorage.getItem(FIRST_TOUCH_KEY)) {
        localStorage.setItem(FIRST_TOUCH_KEY, serialized);
      }

      // Session-touch: always reflect current session source.
      sessionStorage.setItem(SESSION_TOUCH_KEY, serialized);
    } catch {
      // Storage blocked or unavailable — fail silently.
    }
  }, []);

  return null;
}
