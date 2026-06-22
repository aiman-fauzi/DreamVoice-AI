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
          <label key={key} className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-soft transition hover:border-moss">
            <input className="sr-only peer" type="radio" name={name} value={key} defaultChecked={selectedTheme === key} required />
            <span className="block text-sm font-semibold text-ink peer-checked:text-moss">{theme.label}</span>
            <span className="mt-2 block text-xs leading-5 text-slate-600">{theme.promptFocus}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}