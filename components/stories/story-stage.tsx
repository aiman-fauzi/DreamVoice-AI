type StoryStageProps = {
  title: string;
  themeLabel: string;
  language: string;
  savedDate: string;
  storyText: string;
};

export function StoryStage({ title, themeLabel, language, savedDate, storyText }: StoryStageProps) {
  return (
    <section aria-label="Private reading stage" className="rounded-lg border border-slate-200 bg-white shadow-soft">
      <div className="border-b border-slate-200 bg-skywash/70 px-5 py-4 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">Private reading stage</p>
        <h2 className="mt-2 text-2xl font-semibold leading-tight text-ink">{title}</h2>
        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
          <span className="rounded-md bg-white px-2.5 py-1 text-moss ring-1 ring-moss/15">{themeLabel}</span>
          <span className="rounded-md bg-white px-2.5 py-1 ring-1 ring-slate-200">{language}</span>
          <span className="rounded-md bg-white px-2.5 py-1 ring-1 ring-slate-200">{savedDate}</span>
        </div>
      </div>
      <div className="whitespace-pre-wrap px-5 py-6 text-base leading-8 text-slate-800 sm:px-7 sm:py-7">
        {storyText}
      </div>
    </section>
  );
}

