type AudioPlayerProps = {
  narrationId: string;
  label: string;
};

export function AudioPlayer({ narrationId, label }: AudioPlayerProps) {
  return (
    <figure className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <figcaption>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-moss">Private playback</p>
        <p className="mt-1 text-sm font-semibold text-slate-800">{label}</p>
      </figcaption>
      <audio aria-label={`${label} audio`} className="mt-3 w-full" controls preload="none" src={`/api/audio/${narrationId}`} />
    </figure>
  );
}
