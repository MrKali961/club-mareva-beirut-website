import { fetchCigarBrands } from "@/lib/api/brands";
import {
  apiBrandToLocalBrand,
  type Brand,
} from "@/lib/adapters/brands-adapter";
import CigarsClient from "./CigarsClient";

export const revalidate = 3600; // 1 hour

export default async function CigarsPage() {
  let brands: Brand[] = [];

  try {
    const apiBrands = await fetchCigarBrands(100);
    brands = apiBrands.map((b) =>
      apiBrandToLocalBrand({
        name: b.title,
        description: b.description || "",
        logoUrl: b.logo?.url || b.logoUrl || "",
      }),
    );
  } catch (error) {
    console.error("Error fetching cigar brands:", error);
  }

  return <CigarsClient brands={brands} />;
}
