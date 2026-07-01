import { STORY_THEMES, type StoryThemeKey } from "@/lib/story-themes";
import { cn } from "@/lib/utils";

type ThemePickerProps = {
  name?: string;
  selectedTheme?: StoryThemeKey;
  disabled?: boolean;
  onThemeChange?: (theme: StoryThemeKey) => void;
};

export function ThemePicker({ name = "theme_key", selectedTheme, disabled = false, onThemeChange }: ThemePickerProps) {
  return (
    <fieldset className="grid gap-3" disabled={disabled}>
      <legend className="text-sm font-semibold text-slate-700">Story theme</legend>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {(Object.entries(STORY_THEMES) as [StoryThemeKey, (typeof STORY_THEMES)[StoryThemeKey]][]).map(([key, theme]) => {
          const selected = selectedTheme === key;
          const controlledProps = onThemeChange
            ? { checked: selected, onChange: () => onThemeChange(key) }
            : { defaultChecked: selected };

          return (
            <label
              key={key}
              className={cn(
                "group cursor-pointer rounded-lg border bg-white p-4 shadow-sm transition focus-within:ring-2 focus-within:ring-moss/20",
                selected ? "border-moss bg-moss/5 shadow-soft" : "border-slate-200 hover:border-moss hover:bg-moss/5",
                disabled ? "cursor-not-allowed opacity-60" : "",
              )}
            >
              <input
                className="sr-only peer"
                type="radio"
                name={name}
                value={key}
                required
                disabled={disabled}
                {...controlledProps}
              />
              <span className={cn("block text-sm font-semibold", selected ? "text-moss" : "text-ink peer-checked:text-moss")}>{theme.label}</span>
              <span className="mt-2 block text-xs leading-5 text-slate-600">{theme.promptFocus}</span>
              {selected ? <span className="mt-3 inline-flex rounded-md bg-moss/10 px-2 py-1 text-xs font-semibold text-moss">Tonight&apos;s pick</span> : null}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
