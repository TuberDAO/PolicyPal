import { Resend } from "resend";
import { getServerEnv } from "@/env";

let cached: Resend | null = null;

export function getResend(): Resend {
  if (!cached) {
    const { RESEND_API_KEY } = getServerEnv();
    cached = new Resend(RESEND_API_KEY);
  }
  return cached;
}
