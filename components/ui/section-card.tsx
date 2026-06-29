import { cn } from "@/lib/utils";

type SectionCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({ children, className }: SectionCardProps) {
  return (
    <section className={cn("rounded-lg border border-slate-200 bg-white p-5 shadow-soft", className)}>
      {children}
    </section>
  );
}
