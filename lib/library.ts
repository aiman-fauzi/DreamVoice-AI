type LibraryStory = {
  child_id: string;
  created_at: string;
};

export function sortStoriesNewestFirst<T extends LibraryStory>(stories: readonly T[]) {
  return [...stories].sort((first, second) => Date.parse(second.created_at) - Date.parse(first.created_at));
}

export function filterStoriesByChild<T extends LibraryStory>(stories: readonly T[], childId?: string | null) {
  if (!childId) {
    return [...stories];
  }

  return stories.filter((story) => story.child_id === childId);
}