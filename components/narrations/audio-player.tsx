type AudioPlayerProps = {
  narrationId: string;
  label: string;
};

export function AudioPlayer({ narrationId, label }: AudioPlayerProps) {
  return (
    <figure className="rounded-md border border-slate-200 p-3">
      <figcaption className="mb-2 text-sm font-semibold text-slate-700">{label}</figcaption>
      <audio className="w-full" controls preload="none" src={`/api/audio/${narrationId}`} />
    </figure>
  );
}