import { and, eq, gte, isNull, sql } from "drizzle-orm";
import { db, schema } from "./db/index.js";
import { env } from "./env.js";

const lastStipendAt = new Map<string, number>();

function startOfUtcToday(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

const round6 = (n: number) => Math.round(Math.max(0, n) * 1e6) / 1e6;

/** Credit a contributor. `amountUsd` is 1:1 USDG. */
export async function creditEarning(opts: {
  userId: string;
  workerId?: string | null;
  jobId?: string | null;
  amountUsd: number;
}): Promise<number> {
  const amountUsd = round6(opts.amountUsd);
  if (amountUsd <= 0) return 0;
  await db.insert(schema.earnings).values({
    userId: opts.userId,
    workerId: opts.workerId ?? null,
    jobId: opts.jobId ?? null,
    amountUsd: amountUsd.toFixed(6),
  });
  return amountUsd;
}

/** Small USDG drip while a worker is actually connected. Capped per user/day. */
export async function maybeCreditOnlineStipend(
  userId: string,
  workerId: string,
): Promise<number> {
  const amount = env.onlineStipendUsd;
  if (amount <= 0) return 0;

  const key = `${userId}:${workerId}`;
  const now = Date.now();
  if (now - (lastStipendAt.get(key) ?? 0) < env.onlineStipendIntervalMs) {
    return 0;
  }
  lastStipendAt.set(key, now);

  if (env.onlineStipendDailyCapUsd > 0) {
    const [row] = await db
      .select({
        total: sql<string>`coalesce(sum(${schema.earnings.amountUsd}), 0)`,
      })
      .from(schema.earnings)
      .where(
        and(
          eq(schema.earnings.userId, userId),
          isNull(schema.earnings.jobId),
          gte(schema.earnings.createdAt, startOfUtcToday()),
        ),
      );
    if (Number(row?.total ?? 0) >= env.onlineStipendDailyCapUsd) return 0;
  }

  return creditEarning({ userId, workerId, amountUsd: amount });
}

export function forgetStipend(workerId: string): void {
  for (const key of lastStipendAt.keys()) {
    if (key.endsWith(`:${workerId}`)) lastStipendAt.delete(key);
  }
}
