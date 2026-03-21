import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu | Club Mareva Beirut",
  description: "View our menu, connect to WiFi, and leave a review.",
  robots: { index: false, follow: false },
};

export default function QRLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
