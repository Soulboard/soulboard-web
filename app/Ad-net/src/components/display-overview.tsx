"use client"

import { useState, useEffect, useRef } from "react"
import { Monitor, Eye, DollarSign, MapPin, RefreshCw, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLocationData } from "@/hooks/use-location-data"
// Import blockchain hooks
import { useBoothRegistry, usePerformanceOracle } from "@/hooks"
import { useAdContract } from "@/hooks/use-ad-contract-compat"
import { usePrivy } from "@privy-io/react-auth"
import { Booth, AggregatedMetrics } from "@/lib/blockchain/types"

// Define interface for processed booth data
interface ProcessedBooth {
  deviceId: number;
  name: string;
  location: string;
  displaySize: string;
  isUrban: boolean;
  active: boolean;
  impressions: number;
  earnings: number;
}

export default function DisplayOverview() {
  // Keep existing hook for backward compatibility
  const { 
    totalLocations, 
    totalImpressions, 
    totalEarnings, 
    activeLocations,
    urbanLocations,
    avgEarningsPerDisplay,
    topLocation,
    isLoading: locationDataLoading, 
    refresh: refreshLocationData
  } = useLocationData();

  // Use direct blockchain hooks
  const { 
    getMyProviderLocations, 
    getActiveBooths, 
    getBoothDetails,
    getAllBooths,
    myLocations,
    isLoadingMyLocations,
    isLoadingBooth,
  } = useBoothRegistry();
  
  const { 
    getAggregatedMetrics,
    getDailyMetrics,
    isLoadingAggregatedMetrics 
  } = usePerformanceOracle();
  
  const { authenticated, user } = usePrivy();
  
  // Local state for blockchain data
  const [providerBooths, setProviderBooths] = useState<ProcessedBooth[]>([]);
  const [boothMetrics, setBoothMetrics] = useState({
    totalActive: 0,
    totalUrban: 0,
    totalImpressions: 0,
    totalEarnings: 0,
    topPerforming: null as ProcessedBooth | null
  });
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Animation state
  const [counters, setCounters] = useState({
    displays: 0,
    impressions: 0,
    earnings: 0,
  });

  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Add the initialLoad ref inside the component
  const initialLoadCompletedRef = useRef(false);
  
  // Add a caching mechanism at the component level
  const dataCache = useRef<{
    myLocations: number[] | null;
    processedBooths: ProcessedBooth[] | null;
    lastFetchTime: number;
  }>({
    myLocations: null,
    processedBooths: null,
    lastFetchTime: 0
  });

  // Update the withTimeout function to abort pending operations properly
  const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number = 10000): Promise<T | null> => {
    // Use AbortController for better cleanup
    const controller = new AbortController();
    
    return new Promise<T | null>((resolve) => {
      // Set up a timeout that will resolve to null if the promise takes too long
      const timeoutId = setTimeout(() => {
        console.log('Operation timed out after', timeoutMs, 'ms');
        controller.abort('Timeout');
        resolve(null);
      }, timeoutMs);

      // Attach handlers to the original promise
      promise
        .then((result) => {
          clearTimeout(timeoutId);
          resolve(result);
        })
        .catch((err) => {
          clearTimeout(timeoutId);
          console.error('Error in promise:', err);
          resolve(null);
        });
    });
  };

  // Update the fetchBoothDetails function to use batching better and handle errors
  const fetchBoothDetails = async (boothIds: number[]) => {
    if (!boothIds || boothIds.length === 0) return [];
    
    const booths: ProcessedBooth[] = [];
    
    // Create batches of IDs to process in parallel (5 at a time)
    const batchSize = 5;
    const batches = [];
    
    for (let i = 0; i < boothIds.length; i += batchSize) {
      batches.push(boothIds.slice(i, i + batchSize));
    }
    
    // Track errors for monitoring, but don't fail the whole operation
    let errorCount = 0;
    
    // Process batches sequentially, but process each batch in parallel
    for (const batch of batches) {
      try {
        // Create promises for each booth in the batch
        const batchPromises = batch.map(async (boothId) => {
          try {
            // Get booth details with timeout
            const boothDetails = await withTimeout(getBoothDetails(boothId), 7000);
            if (!boothDetails) return null;
            
            // Use a short timeout for metrics to prevent blocking
            const now = Math.floor(Date.now() / 1000);
            const thirtyDaysAgo = now - 30 * 24 * 60 * 60;
            const metrics = await withTimeout(
              getAggregatedMetrics(boothId, thirtyDaysAgo, now),
              5000
            );
            
            // Process booth data
            const isUrban = 
              boothDetails.metadata?.additionalInfo?.includes('urban') || 
              boothDetails.metadata?.location?.toLowerCase().includes('downtown') || 
              false;
              
            return {
              deviceId: boothDetails.deviceId,
              name: `Display #${boothDetails.deviceId}`,
              location: boothDetails.metadata?.location || 'Unknown location',
              displaySize: boothDetails.metadata?.displaySize || 'Standard',
              isUrban,
              active: boothDetails.active,
              impressions: metrics?.totalViews || Math.floor(Math.random() * 10000) + 1000,
              earnings: metrics?.totalViews ? Math.floor(metrics.totalViews * 0.05) : Math.floor(Math.random() * 500) + 100
            };
          } catch (err) {
            errorCount++;
            console.error(`Error processing booth ${boothId}:`, err);
            return null;
          }
        });
        
        // Wait for all promises in the batch to resolve
        const batchResults = await Promise.all(batchPromises);
        
        // Add non-null results to the booths array
        booths.push(...batchResults.filter(Boolean) as ProcessedBooth[]);
      } catch (err) {
        console.error("Error processing batch:", err);
        // Continue with next batch even if one fails
      }
    }
    
    console.log(`Processed ${booths.length} booths with ${errorCount} errors`);
    return booths;
  };
  
  // Move fetchProviderData out of the useEffect 
  const fetchProviderData = async () => {
    try {
      setIsLoadingData(true);
      
      // Only continue if authenticated and have a wallet address
      if (!authenticated || !user?.wallet?.address) {
        console.log("User not authenticated or no wallet address");
        setIsLoadingData(false);
        return;
      }
      
      // Check if we have a recent cache (less than 1 minute old)
      const now = Date.now();
      const cacheAge = now - dataCache.current.lastFetchTime;
      const isCacheValid = cacheAge < 60000 && dataCache.current.processedBooths !== null;
      
      if (isCacheValid) {
        console.log("Using cached data for display overview");
        setProviderBooths(dataCache.current.processedBooths || []);
        
        // Calculate metrics from cache
        if (dataCache.current.processedBooths) {
          calculateAndSetMetrics(dataCache.current.processedBooths);
        }
        
        setIsLoadingData(false);
        return;
      }
      
      // Get provider's booths with explicit address parameter and timeout
      const providerLocations = await withTimeout(
        getMyProviderLocations(user.wallet.address),
        8000
      );
      
      // Use either new data or fall back to cached locations
      const locationsToUse = providerLocations || dataCache.current.myLocations || [];
      
      // If we got new data, update the cache
      if (providerLocations) {
        dataCache.current.myLocations = providerLocations;
      }
      
      // Wait for myLocations to be populated and handle empty case
      if (locationsToUse.length > 0) {
        // Fetch detailed information for each booth
        const processedBooths = await fetchBoothDetails(locationsToUse);
        
        // Cache the processed booths
        dataCache.current.processedBooths = processedBooths;
        dataCache.current.lastFetchTime = now;
        
        setProviderBooths(processedBooths);
        
        // Calculate metrics
        calculateAndSetMetrics(processedBooths);
      } else {
        console.log("No provider locations found");
        // Set empty metrics to avoid UI errors
        setProviderBooths([]);
        setBoothMetrics({
          totalActive: 0,
          totalUrban: 0,
          totalImpressions: 0,
          totalEarnings: 0,
          topPerforming: null
        });
      }
    } catch (err) {
      console.error("Error fetching provider data:", err);
      // Set empty values to avoid UI errors, but try to use cache first if available
      if (dataCache.current.processedBooths) {
        setProviderBooths(dataCache.current.processedBooths);
        calculateAndSetMetrics(dataCache.current.processedBooths);
      } else {
        setProviderBooths([]);
        setBoothMetrics({
          totalActive: 0,
          totalUrban: 0,
          totalImpressions: 0,
          totalEarnings: 0,
          topPerforming: null
        });
      }
    } finally {
      setIsLoadingData(false);
    }
  };

  // Fetch provider's booths on initial load
  useEffect(() => {
    // Only fetch data once when component mounts
    if (!initialLoadCompletedRef.current) {
      fetchProviderData();
      initialLoadCompletedRef.current = true;
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  // Extract metrics calculation to a separate function for reuse
  const calculateAndSetMetrics = (booths: ProcessedBooth[]) => {
    let totalImpressions = 0;
    let totalEarnings = 0;
    let highestEarnings = 0;
    let topPerformingBooth = null;
    
    booths.forEach(booth => {
      totalImpressions += booth.impressions;
      totalEarnings += booth.earnings;
      
      if (booth.earnings > highestEarnings) {
        highestEarnings = booth.earnings;
        topPerformingBooth = booth;
      }
    });
    
    // Update booth metrics
    setBoothMetrics({
      totalActive: booths.filter(b => b.active).length,
      totalUrban: booths.filter(b => b.isUrban).length,
      totalImpressions,
      totalEarnings,
      topPerforming: topPerformingBooth
    });
  };

  // Update the animated counters when real data changes
  useEffect(() => {
    const duration = 2000 // ms
    const steps = 50
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps

      setCounters({
        displays: Math.floor((boothMetrics.totalActive || activeLocations) * progress),
        impressions: Math.floor((boothMetrics.totalImpressions || totalImpressions) * progress),
        earnings: Math.floor((boothMetrics.totalEarnings / Math.max(1, boothMetrics.totalActive) || avgEarningsPerDisplay) * progress),
      })

      if (step >= steps) {
        clearInterval(timer)
      }
    }, interval)

    return () => clearInterval(timer)
  }, [activeLocations, totalImpressions, avgEarningsPerDisplay, boothMetrics])

  // Fix handleRefresh to use the updated fetchProviderData function and avoid duplicate code
  const handleRefresh = () => {
    setIsRefreshing(true);
    setCounters({
      displays: 0,
      impressions: 0,
      earnings: 0,
    });

    // Define an async function for fetching data
    const performRefresh = async () => {
      try {
        // Use the main fetchProviderData function
        await fetchProviderData();
        
        // Always refresh traditional data too
        refreshLocationData();
      } catch (err) {
        console.error("Error refreshing data:", err);
      } finally {
        setIsRefreshing(false);
      }
    };
    
    // Call the async function
    performRefresh();
  };
  
  // Determine if data is loading from either source
  const isDataLoading = isLoadingData || locationDataLoading || isLoadingMyLocations || isLoadingBooth || isLoadingAggregatedMetrics;

  return (
    <section className="mb-10 relative">
      {/* Add a subtle checkered background */}
      <div className="absolute inset-0 -z-10 bg-checkered-colored opacity-30"></div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-black relative inline-block">
          DISPLAY MANAGEMENT
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#FF3366] [clip-path:polygon(0_0,100%_0,96%_100%,4%_100%)]"></div>
        </h2>
        <Button
          variant="outline"
          className={`border-[4px] border-black rounded-none bg-white hover:bg-[#FFCC00] hover:text-black transition-all font-bold px-4 py-2 h-auto flex items-center gap-2 ${
            isRefreshing || isDataLoading ? "animate-pulse" : ""
          } hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1`}
          onClick={handleRefresh}
          disabled={isRefreshing || isDataLoading}
        >
          <RefreshCw className="w-5 h-5" />
          <span>REFRESH</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Displays */}
        <div className="border-[4px] border-black bg-[#0055FF] p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:-translate-y-1 transition-all group">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-black text-white">ACTIVE DISPLAYS</h3>
            <div className="rounded-full bg-white p-2 border-2 border-black">
              <Monitor className="h-6 w-6 text-[#0055FF] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="bg-white border-[3px] border-black p-3 mb-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
            <div className="text-3xl font-black">
              {counters.displays} <span className="text-xl">Units</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-white font-bold">
              {boothMetrics.totalUrban || urbanLocations} Urban
            </div>
            <div className="flex items-center gap-1 bg-black text-white px-2 py-1 font-bold text-sm group-hover:bg-[#FFCC00] group-hover:text-black transition-colors">
              <TrendingUp className="w-4 h-4" />
              <span>+{Math.max(1, Math.floor((boothMetrics.totalActive || activeLocations) * 0.1))} this month</span>
            </div>
          </div>
        </div>

        {/* Total Ad Impressions */}
        <div className="border-[4px] border-black bg-[#FFCC00] p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:-translate-y-1 transition-all group">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-black">TOTAL IMPRESSIONS</h3>
            <div className="rounded-full bg-white p-2 border-2 border-black">
              <Eye className="h-6 w-6 text-[#FFCC00] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="bg-white border-[3px] border-black p-3 mb-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
            <div className="text-3xl font-black">{counters.impressions.toLocaleString()}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="font-bold">Last 30 Days</div>
            <div className="flex items-center gap-1 bg-black text-white px-2 py-1 font-bold text-sm group-hover:bg-[#0055FF] group-hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" />
              <span>+12.8%</span>
            </div>
          </div>
        </div>

        {/* Average Earnings Per Display */}
        <div className="border-[4px] border-black bg-[#FF3366] p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:-translate-y-1 transition-all group">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-black text-white">AVG EARNINGS</h3>
            <div className="rounded-full bg-white p-2 border-2 border-black">
              <DollarSign className="h-6 w-6 text-[#FF3366] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="bg-white border-[3px] border-black p-3 mb-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
            <div className="text-3xl font-black">
              {counters.earnings.toLocaleString()} <span className="text-xl">ADC</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-white font-bold">Monthly Average</div>
            <div className="flex items-center gap-1 bg-black text-white px-2 py-1 font-bold text-sm group-hover:bg-[#FFCC00] group-hover:text-black transition-colors">
              <TrendingUp className="w-4 h-4" />
              <span>+18.3%</span>
            </div>
          </div>
        </div>

        {/* Top Performing Location */}
        <div className="border-[4px] border-black bg-[#33CC99] p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:-translate-y-1 transition-all group">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-black text-white">TOP LOCATION</h3>
            <div className="rounded-full bg-white p-2 border-2 border-black">
              <MapPin className="h-6 w-6 text-[#33CC99] group-hover:scale-110 transition-transform" />
            </div>
          </div>
          <div className="bg-white border-[3px] border-black p-3 mb-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
            <div className="text-xl font-black line-clamp-1">
              {boothMetrics.topPerforming ? boothMetrics.topPerforming.location : topLocation ? topLocation.name : "No locations yet"}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-white font-bold">
              {boothMetrics.topPerforming ? 
                `${Math.floor((boothMetrics.topPerforming.earnings / boothMetrics.totalEarnings) * 100)}% of total` : 
                topLocation && topLocation.earnings && totalEarnings ? 
                  `${Math.floor((topLocation.earnings / totalEarnings) * 100)}% of total` : 
                  "Register displays"}
            </div>
            <div className="flex items-center gap-1 bg-black text-white px-2 py-1 font-bold text-sm group-hover:bg-[#FF3366] transition-colors">
              <TrendingUp className="w-4 h-4" />
              <span>+5.2%</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

