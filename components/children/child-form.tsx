type ChildFormProps = {
  action: (formData: FormData) => Promise<void>;
};

export function ChildForm({ action }: ChildFormProps) {
  return (
    <form action={action} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div>
        <h2 className="text-lg font-semibold">Add child profile</h2>
        <p className="mt-1 text-sm text-slate-600">Only first-name style details are needed for the MVP prompt.</p>
      </div>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Name
        <input className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-moss focus:ring-2 focus:ring-moss/20" name="name" required />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Age
        <input className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-moss focus:ring-2 focus:ring-moss/20" name="age" type="number" min={1} max={12} required />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Preferred language
        <select className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-moss focus:ring-2 focus:ring-moss/20" name="language" defaultValue="English">
          <option>English</option>
          <option>Bahasa Malaysia</option>
        </select>
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Interests
        <input className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-moss focus:ring-2 focus:ring-moss/20" name="interests" placeholder="stars, cats, gentle adventures" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-slate-700">
        Bedtime tone
        <select className="h-11 rounded-md border border-slate-300 px-3 outline-none focus:border-moss focus:ring-2 focus:ring-moss/20" name="bedtime_tone" defaultValue="calm">
          <option value="calm">Calm</option>
          <option value="brave">Brave</option>
          <option value="playful">Playful</option>
          <option value="kind">Kind</option>
        </select>
      </label>
      <button className="h-11 rounded-md bg-ink px-4 text-sm font-semibold text-white transition hover:bg-slate-700" type="submit">Save child</button>
    </form>
  );
}