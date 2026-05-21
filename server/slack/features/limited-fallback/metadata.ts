export interface LimitedFallbackMetadata {
  channel: string;
  channelType?: string;
  teamId?: string;
  threadTs?: string;
  ts: string;
  user: string;
}

export function encodeLimitedFallbackMetadata(
  metadata: LimitedFallbackMetadata
): string {
  return JSON.stringify(metadata);
}

export function decodeLimitedFallbackMetadata(
  raw: string | undefined
): LimitedFallbackMetadata | null {
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<LimitedFallbackMetadata>;
    if (
      typeof parsed.channel !== 'string' ||
      typeof parsed.ts !== 'string' ||
      typeof parsed.user !== 'string'
    ) {
      return null;
    }
    return {
      channel: parsed.channel,
      ts: parsed.ts,
      user: parsed.user,
      ...(typeof parsed.threadTs === 'string' ? { threadTs: parsed.threadTs } : {}),
      ...(typeof parsed.channelType === 'string'
        ? { channelType: parsed.channelType }
        : {}),
      ...(typeof parsed.teamId === 'string' ? { teamId: parsed.teamId } : {}),
    };
  } catch {
    return null;
  }
}
