export type RedisConnection = {
  host: string;
  port: number;
  password?: string;
  username?: string;
  tls?: Record<string, never>;
};

const DEFAULT_REDIS_CONNECTION: RedisConnection = {
  host: "127.0.0.1",
  port: 6379,
};

export function resolveRedisUrl(
  env: Readonly<Record<string, string | undefined>> = process.env,
): string {
  const configuredUrl = env.REDIS_URL?.trim();
  if (configuredUrl) {
    return configuredUrl;
  }

  if (env.NODE_ENV === "production") {
    throw new Error("REDIS_URL is required in production for the BullMQ review worker");
  }

  return "redis://127.0.0.1:6379";
}

export function parseRedisUrl(url: string): RedisConnection {
  const parsed = new URL(url);

  if (parsed.protocol !== "redis:" && parsed.protocol !== "rediss:") {
    throw new Error(`Unsupported Redis protocol: ${parsed.protocol}`);
  }

  const decodedUsername = parsed.username ? decodeURIComponent(parsed.username) : "";

  return {
    host: parsed.hostname || DEFAULT_REDIS_CONNECTION.host,
    port: Number(parsed.port) || DEFAULT_REDIS_CONNECTION.port,
    ...(parsed.password ? { password: decodeURIComponent(parsed.password) } : {}),
    ...(decodedUsername && decodedUsername !== "default" ? { username: decodedUsername } : {}),
    ...(parsed.protocol === "rediss:" ? { tls: {} } : {}),
  };
}
