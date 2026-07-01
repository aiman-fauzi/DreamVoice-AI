import { Save, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, fieldControlClass } from "@/components/ui/field";

type EditableStory = {
  id: string;
  title: string;
  storyText: string;
};

type StoryEditorProps = {
  story: EditableStory;
  updateAction: (formData: FormData) => Promise<void>;
  deleteAction: (formData: FormData) => Promise<void>;
};

export function StoryEditor({ story, updateAction, deleteAction }: StoryEditorProps) {
  return (
    <section id="edit-story" className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-soft" aria-labelledby="edit-story-title">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-moss">Story management</p>
        <h2 id="edit-story-title" className="mt-2 text-lg font-semibold text-ink">Edit story</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">Adjust saved text for reading and future narration. Existing audio files stay private unless you delete the story.</p>
      </div>
      <form action={updateAction} className="grid gap-4">
        <input type="hidden" name="story_id" value={story.id} />
        <Field label="Story title">
          <input className={fieldControlClass} name="title" defaultValue={story.title} required />
        </Field>
        <Field label="Story text">
          <textarea className={`${fieldControlClass} min-h-64 py-3 leading-7`} name="story_text" defaultValue={story.storyText} required />
        </Field>
        <Button type="submit" className="w-full sm:w-fit">
          <Save className="h-4 w-4" aria-hidden="true" />
          Save story changes
        </Button>
      </form>
      <div className="rounded-md border border-red-100 bg-red-50 p-4">
        <h3 className="text-sm font-semibold text-red-950">Delete this story</h3>
        <p className="mt-1 text-sm leading-6 text-red-900">Deleting removes the saved story and its private narration files.</p>
        <form action={deleteAction} className="mt-3">
          <input type="hidden" name="story_id" value={story.id} />
          <Button type="submit" variant="ghost" className="text-red-800 hover:bg-red-100 hover:text-red-900">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete story
          </Button>
        </form>
      </div>
    </section>
  );
}
