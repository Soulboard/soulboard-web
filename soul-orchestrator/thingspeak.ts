export interface ThingSpeakResponse {
  channel: {
    id: number;
    name: string;
    description: string;
    latitude: string;
    longitude: string;
    field1: string;
    field2: string;
    created_at: string;
    updated_at: string;
    last_entry_id: number;
  };
  feeds: Array<{
    created_at: string;
    entry_id: number;
    field1?: string;
    field2?: string;
  }>;
}

export interface MetricDelta {
  views: number;
  impressions: number;
  lastEntryId: number;
  samples: number;
}

const parseMetric = (value?: string): number => {
  if (!value) return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export const fetchThingSpeak = async (
  url: string
): Promise<ThingSpeakResponse> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`ThingSpeak request failed: ${response.status}`);
  }
  return (await response.json()) as ThingSpeakResponse;
};

export const computeDelta = (
  data: ThingSpeakResponse,
  lastEntryId: number
): MetricDelta => {
  const feeds = (data.feeds ?? [])
    .filter((feed) => feed.entry_id > lastEntryId)
    .sort((a, b) => a.entry_id - b.entry_id);

  if (!feeds.length) {
    return {
      views: 0,
      impressions: 0,
      lastEntryId,
      samples: 0,
    };
  }

  const views = feeds.reduce((total, feed) => total + parseMetric(feed.field1), 0);
  const impressions = feeds.reduce(
    (total, feed) => total + parseMetric(feed.field2),
    0
  );
  const newestEntry = feeds[feeds.length - 1]?.entry_id ?? lastEntryId;

  return {
    views,
    impressions,
    lastEntryId: newestEntry,
    samples: feeds.length,
  };
};
