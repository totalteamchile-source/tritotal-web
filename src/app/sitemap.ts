import type { MetadataRoute } from "next";
import { nav, site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [...nav.map((n) => n.href), "/inscripcion"].map((p) => ({
    url: new URL(p, site.url).toString(),
    changeFrequency: "weekly",
    priority: p === "/" ? 1 : 0.7,
  }));
}
