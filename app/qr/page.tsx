import { fetchPublicMenu } from "@/lib/api/menu";
import { fetchPublicMenuSettings } from "@/lib/api/menu";
import type { ApiMenuSection, ApiPublicMenuSettings } from "@/lib/api/types";
import QRMenuClient from "./QRMenuClient";

export const dynamic = 'force-dynamic';

export default async function QRPage() {
  let sections: ApiMenuSection[] = [];
  let settings: ApiPublicMenuSettings | null = null;

  try {
    [sections, settings] = await Promise.all([
      fetchPublicMenu(),
      fetchPublicMenuSettings(),
    ]);
  } catch (error) {
    console.error("QR page data fetch error:", error);
  }

  return <QRMenuClient sections={sections} settings={settings} />;
}
