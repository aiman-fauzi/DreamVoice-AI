import { Button } from "@/components/ui/button";
import { Field, fieldControlClass } from "@/components/ui/field";

type ChildFormProps = {
  action: (formData: FormData) => Promise<void>;
};

export function ChildForm({ action }: ChildFormProps) {
  return (
    <form action={action} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">Child profile</p>
        <h2 className="mt-2 text-lg font-semibold">Add child profile</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">These details personalize the prompt while keeping Phase 1 details minimal.</p>
      </div>
      <Field label="Name" helperText="Use first-name style details only.">
        <input className={fieldControlClass} name="name" required />
      </Field>
      <Field label="Age">
        <input className={fieldControlClass} name="age" type="number" min={1} max={12} required />
      </Field>
      <Field label="Preferred language">
        <select className={fieldControlClass} name="language" defaultValue="English">
          <option>English</option>
          <option>Bahasa Malaysia</option>
        </select>
      </Field>
      <Field label="Interests" helperText="Separate interests with commas.">
        <input className={fieldControlClass} name="interests" placeholder="stars, cats, gentle adventures" />
      </Field>
      <Field label="Bedtime tone">
        <select className={fieldControlClass} name="bedtime_tone" defaultValue="calm">
          <option value="calm">Calm</option>
          <option value="brave">Brave</option>
          <option value="playful">Playful</option>
          <option value="kind">Kind</option>
        </select>
      </Field>
      <Button type="submit">Save child</Button>
    </form>
  );
}
