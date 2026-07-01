import { Button } from "@/components/ui/button";
import { Field, fieldControlClass } from "@/components/ui/field";
import { cn } from "@/lib/utils";

type ChildFormValues = {
  id?: string;
  name: string;
  age: number;
  language: string;
  interests: string[];
  bedtime_tone: string;
};

type ChildFormProps = {
  action: (formData: FormData) => Promise<void>;
  child?: ChildFormValues;
  title?: string;
  description?: string;
  submitLabel?: string;
  compact?: boolean;
};

export function ChildForm({
  action,
  child,
  title = "Add child profile",
  description = "These details personalize the prompt while keeping Phase 1 details minimal.",
  submitLabel = "Save child",
  compact = false,
}: ChildFormProps) {
  return (
    <form action={action} className={cn("grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-soft", compact && "border-slate-100 p-4 shadow-none")}>
      {child?.id ? <input type="hidden" name="child_id" value={child.id} /> : null}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">Child profile</p>
        <h2 className="mt-2 text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <Field label="Name" helperText="Use first-name style details only.">
        <input className={fieldControlClass} name="name" defaultValue={child?.name ?? ""} required />
      </Field>
      <Field label="Age">
        <input className={fieldControlClass} name="age" type="number" min={1} max={12} defaultValue={child?.age ?? ""} required />
      </Field>
      <Field label="Preferred language">
        <select className={fieldControlClass} name="language" defaultValue={child?.language ?? "English"}>
          <option>English</option>
          <option>Bahasa Malaysia</option>
        </select>
      </Field>
      <Field label="Interests" helperText="Separate interests with commas.">
        <input className={fieldControlClass} name="interests" placeholder="stars, cats, gentle adventures" defaultValue={child?.interests.join(", ") ?? ""} />
      </Field>
      <Field label="Bedtime tone">
        <select className={fieldControlClass} name="bedtime_tone" defaultValue={child?.bedtime_tone ?? "calm"}>
          <option value="calm">Calm</option>
          <option value="brave">Brave</option>
          <option value="playful">Playful</option>
          <option value="kind">Kind</option>
        </select>
      </Field>
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
