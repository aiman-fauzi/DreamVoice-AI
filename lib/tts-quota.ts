type CanUseTtsInput = {
  used: number;
  requested: number;
  limit: number;
};

export function getMonthKey(date = new Date()) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");

  return `${year}-${month}`;
}

export function canUseTts({ used, requested, limit }: CanUseTtsInput) {
  const currentRemaining = Math.max(limit - used, 0);
  const allowed = requested > 0 && used + requested < limit;

  return {
    allowed,
    remaining: allowed ? Math.max(limit - used - requested, 0) : currentRemaining,
  };
}