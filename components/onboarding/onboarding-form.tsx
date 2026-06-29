import { Button } from "@/components/ui/button";
import { Field, fieldControlClass } from "@/components/ui/field";

type OnboardingFormProps = {
  action: (formData: FormData) => Promise<void>;
  defaultDisplayName?: string | null;
};

export function OnboardingForm({ action, defaultDisplayName }: OnboardingFormProps) {
  return (
    <form action={action} className="grid gap-6">
      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">Parent profile</p>
          <h2 className="mt-2 text-lg font-semibold text-ink">How should DreamVoice greet you?</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">This keeps the dashboard friendly without collecting more than Phase 1 needs.</p>
        </div>
        <Field label="Your name" helperText="A first name or nickname is enough.">
          <input className={fieldControlClass} name="display_name" defaultValue={defaultDisplayName ?? ""} required />
        </Field>
      </div>

      <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">Child profile</p>
          <h2 className="mt-2 text-lg font-semibold text-ink">Create the first story profile</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">These details personalize the prompt and help the story fit bedtime.</p>
        </div>
        <Field label="Child name" helperText="Use first-name style details only.">
          <input className={fieldControlClass} name="name" required />
        </Field>
        <Field label="Age" helperText="Phase 1 stories are tuned for ages 1 to 12.">
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
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <Button type="submit" size="lg">Finish setup</Button>
      </div>
    </form>
  );
}
