import { STORY_THEMES, type StoryThemeKey } from "@/lib/story-themes";

type ThemePickerProps = {
  name?: string;
  selectedTheme?: StoryThemeKey;
};

export function ThemePicker({ name = "theme_key", selectedTheme }: ThemePickerProps) {
  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-semibold text-slate-700">Story theme</legend>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {(Object.entries(STORY_THEMES) as [StoryThemeKey, (typeof STORY_THEMES)[StoryThemeKey]][]).map(([key, theme]) => (
          <label key={key} className="group cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-moss hover:bg-moss/5 focus-within:border-moss focus-within:ring-2 focus-within:ring-moss/20">
            <input className="sr-only peer" type="radio" name={name} value={key} defaultChecked={selectedTheme === key} required />
            <span className="block text-sm font-semibold text-ink peer-checked:text-moss">{theme.label}</span>
            <span className="mt-2 block text-xs leading-5 text-slate-600">{theme.promptFocus}</span>
            <span className="mt-3 hidden rounded-md bg-moss/10 px-2 py-1 text-xs font-semibold text-moss peer-checked:inline-flex">Selected</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
