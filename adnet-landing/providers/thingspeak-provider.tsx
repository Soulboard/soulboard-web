"use client"

import React, { createContext, useContext } from 'react';
import { useThingSpeak, ThingSpeakResponse } from '@/hooks/use-thingspeak';

// ThingSpeak channel ID from the URL
const THINGSPEAK_CHANNEL_ID = 2890626;

interface ThingSpeakContextType {
  viewsData: ThingSpeakResponse | null;
  tapsData: ThingSpeakResponse | null;
  isLoading: boolean;
  error: Error | null;
}

const ThingSpeakContext = createContext<ThingSpeakContextType | undefined>(undefined);

export function ThingSpeakProvider({ children }: { children: React.ReactNode }) {
  // Fetch views data (field1)
  const {
    data: viewsData,
    isLoading: isLoadingViews,
    error: viewsError,
  } = useThingSpeak({
    channelId: THINGSPEAK_CHANNEL_ID,
    field: 1,
    results: 60, // Get more results for charts
  });

  // Fetch taps data (field2)
  const {
    data: tapsData,
    isLoading: isLoadingTaps,
    error: tapsError,
  } = useThingSpeak({
    channelId: THINGSPEAK_CHANNEL_ID,
    field: 2,
    results: 60, // Get more results for charts
  });

  // Combine loading and error states
  const isLoading = isLoadingViews || isLoadingTaps;
  const error = viewsError || tapsError;

  const value = {
    viewsData,
    tapsData,
    isLoading,
    error,
  };

  return (
    <ThingSpeakContext.Provider value={value}>
      {children}
    </ThingSpeakContext.Provider>
  );
}

export function useThingSpeakContext() {
  const context = useContext(ThingSpeakContext);
  
  if (context === undefined) {
    throw new Error('useThingSpeakContext must be used within a ThingSpeakProvider');
  }
  
  return context;
} 