import { SectionCard } from "@/components/ui/section-card";

export default function Loading() {
  return (
    <div className="grid gap-6" aria-label="Loading page">
      <div className="h-24 animate-pulse rounded-lg bg-slate-200" />
      <div className="grid gap-4 md:grid-cols-3">
        <SectionCard><div className="h-20 animate-pulse rounded-md bg-slate-100" /></SectionCard>
        <SectionCard><div className="h-20 animate-pulse rounded-md bg-slate-100" /></SectionCard>
        <SectionCard><div className="h-20 animate-pulse rounded-md bg-slate-100" /></SectionCard>
      </div>
    </div>
  );
}
