import React, { Suspense } from "react";
import type { ComponentType } from "react";
import { useParams } from "react-router-dom";

/** Guide pages take no props (adjust if yours do) */
type GuideComponent = ComponentType<Record<string, never>>;

/** Lazy-import signature without `any` */
type LazyImportFn = () => Promise<{ default: GuideComponent }>;

/* Vite glob — typed the whole way through */
const modules = import.meta.glob<true, string, LazyImportFn>(
  "@/pages/competition-page/competition-topic-guides/*Guide.tsx",
);

const slugTable: Record<string, LazyImportFn> = {};
for (const path in modules) {
  const file = path
    .split("/")
    .pop()!
    .replace(/Guide\.tsx$/, "");
  const slug = file
    .replace(/([a-z\d])([A-Z])/g, "$1-$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();

  slugTable[slug] = modules[path];
}

export default function TopicGuideRouter() {
  const { topicSlug = "" } = useParams();
  const importFn = slugTable[topicSlug.toLowerCase()];
  const Guide = importFn ? React.lazy(importFn) : null;

  return (
    <Suspense fallback={null}>
      {Guide ? <Guide /> : <p className="p-4">Unknown topic.</p>}
    </Suspense>
  );
}
