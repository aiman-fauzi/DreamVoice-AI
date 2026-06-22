type Child = {
  id: string;
  name: string;
  age: number;
  language: string;
  interests: string[];
  bedtime_tone: string;
};

type ChildrenListProps = {
  childrenProfiles: Child[];
};

export function ChildrenList({ childrenProfiles }: ChildrenListProps) {
  if (childrenProfiles.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-center text-slate-600">
        Add your first child profile to unlock story generation.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {childrenProfiles.map((child) => (
        <article key={child.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-soft">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{child.name}</h2>
              <p className="mt-1 text-sm text-slate-600">Age {child.age} · {child.language} · {child.bedtime_tone}</p>
            </div>
            <span className="rounded-md bg-skywash px-2 py-1 text-xs font-semibold text-ink">Profile</span>
          </div>
          {child.interests.length > 0 ? <p className="mt-3 text-sm text-slate-700">Interests: {child.interests.join(", ")}</p> : null}
        </article>
      ))}
    </div>
  );
}