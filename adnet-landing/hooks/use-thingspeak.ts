import { useState, useEffect } from 'react';

// ThingSpeak API types
export interface ThingSpeakChannel {
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
}

export interface ThingSpeakFeed {
  created_at: string;
  entry_id: number;
  field1?: string;
  field2?: string;
}

export interface ThingSpeakResponse {
  channel: ThingSpeakChannel;
  feeds: ThingSpeakFeed[];
}

interface UseThingSpeakOptions {
  channelId: number;
  field?: number;
  results?: number;
  refreshInterval?: number;
}

/**
 * Hook to fetch data from ThingSpeak API
 */
export function useThingSpeak({
  channelId,
  field,
  results = 10,
  refreshInterval = 15000, // 15 seconds by default
}: UseThingSpeakOptions) {
  const [data, setData] = useState<ThingSpeakResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    let intervalId: NodeJS.Timeout | null = null;

    const fetchData = async () => {
      if (!isMounted) return;
      
      setIsLoading(true);
      try {
        // Construct the API URL based on the parameters
        let url = `https://api.thingspeak.com/channels/${channelId}`;
        
        if (field) {
          url += `/fields/${field}`;
        }
        
        url += `.json?results=${results}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }
        
        const responseData = await response.json();
        
        if (isMounted) {
          setData(responseData);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Fetch data immediately
    fetchData();

    // Set up interval for refreshing data
    if (refreshInterval > 0) {
      intervalId = setInterval(fetchData, refreshInterval);
    }

    // Cleanup function
    return () => {
      isMounted = false;
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [channelId, field, results, refreshInterval]);

  return { data, isLoading, error };
} 