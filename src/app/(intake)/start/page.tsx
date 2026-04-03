import type { Metadata } from "next";
import { IntakeFlow } from "@/components/intake/intake-flow";

export const metadata: Metadata = { title: "Start Your Case" };

export default function StartPage() {
  return <IntakeFlow />;
}
