"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Image from "next/image"
import { Eye, DollarSign, BarChart3, Settings, ChevronDown, TrendingUp, TrendingDown, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useLocationData } from "@/hooks/use-location-data"
import { useAdContract } from "@/hooks/use-ad-contract"
import { toast } from "@/lib/toast"
import { useBoothRegistry, usePerformanceOracle } from "@/hooks"
import { usePrivy } from "@privy-io/react-auth"
import { Skeleton } from "@/components/ui/skeleton"

// Simple display interface that matches what we need to show
interface DisplayData {
  id: number;
  name: string;
  location: string;
  city: string;
  isActive: boolean;
  impressions: number;
  earnings: number;
  campaigns: number;
  dailyMetrics: number[];
  displayType: string;
  displaySize: string;
  pricePerDay: number;
  footTraffic: number;
  imageUrl?: string;
}

// Add a custom interface for the metadata properties
interface ExtendedBoothMetadata {
  location?: string;
  city?: string;
  displayType?: string;
  displaySize?: string;
  footTraffic?: number;
  imageUrl?: string;
  [key: string]: any;
}

export default function DisplayPerformance() {
  // Keep legacy hook for backward compatibility
  const { refresh: legacyRefresh } = useLocationData();
  
  // Use blockchain hooks
  const { 
    getMyProviderLocations, 
    getBoothDetails,
    activateBooth,
    deactivateBooth
  } = useBoothRegistry();
  
  const { 
    getAggregatedMetrics,
    getDailyMetrics 
  } = usePerformanceOracle();
  
  const { operations } = useAdContract();
  const { authenticated, user } = usePrivy();
  
  // Component state
  const [activeDisplay, setActiveDisplay] = useState<number | null>(null);
  const [expandedMetrics, setExpandedMetrics] = useState(false);
  const [displayStatuses, setDisplayStatuses] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [displays, setDisplays] = useState<DisplayData[]>([]);
  
  // Safe JSON stringify to handle BigInt values
  const safeStringify = (obj: any): string => {
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    });
  };

  // 1. Fetch all locations that the provider has
  const fetchProviderLocations = useCallback(async () => {
    if (!authenticated || !user?.wallet?.address) {
      console.log("User not authenticated or wallet not connected");
      return [];
    }
    
    try {
      console.log("Fetching locations for provider:", user.wallet.address);
      const locations = await getMyProviderLocations(user.wallet.address);
      console.log("Raw provider locations:", safeStringify(locations));
      
      // Stricter filtering for IDs to avoid zeros and other invalid values
      if (!Array.isArray(locations)) {
        console.warn("Provider locations is not an array:", typeof locations);
        return [];
      }
      
      const validLocations = locations.filter(id => {
        // Convert to number if needed (in case it's a BigInt or string)
        const numId = Number(id);
        // Check if it's a valid positive number greater than zero
        const isValid = !isNaN(numId) && numId > 0 && Number.isFinite(numId);
        if (!isValid) {
          console.warn(`Filtered out invalid location ID: ${safeStringify(id)}`);
        }
        return isValid;
      });
      
      console.log(`Filtered ${locations.length} raw locations to ${validLocations.length} valid IDs`);
      return validLocations;
    } catch (err) {
      console.error("Error fetching provider locations:", err);
      return [];
    }
  }, [authenticated, user, getMyProviderLocations]);
  
  // 2. Get booth details using the IDs
  const fetchBoothDetails = useCallback(async (boothId: number) => {
    // Check if boothId is valid before even trying
    if (!boothId || boothId <= 0) {
      console.warn(`Skipping invalid booth ID: ${boothId}`);
      return null;
    }
    
    try {
      console.log(`Fetching details for booth ID: ${boothId}`);
      
      // Get booth details with explicit error handling
      let boothDetails;
      try {
        boothDetails = await getBoothDetails(boothId);
      } catch (error) {
        console.error(`getBoothDetails failed for ID ${boothId}:`, error);
        return null;
      }
      
      if (!boothDetails) {
        console.log(`No booth details found for ID: ${boothId}`);
        return null;
      }
      
      // Get metrics
      const now = Math.floor(Date.now() / 1000);
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60;
      
      let metrics;
      try {
        metrics = await getAggregatedMetrics(boothId, thirtyDaysAgo, now);
      } catch (error) {
        console.warn(`Failed to get metrics for booth ${boothId}:`, error);
        metrics = null; // Continue with null metrics
      }
      
      // Get daily metrics for the chart
      let dailyMetrics;
      try {
        const sevenDaysAgo = now - 7 * 24 * 60 * 60;
        dailyMetrics = await getDailyMetrics(boothId, sevenDaysAgo, now);
      } catch (error) {
        console.warn(`Failed to get daily metrics for booth ${boothId}:`, error);
        dailyMetrics = null; // Continue with null daily metrics
      }
      
      // Extract values from metadata with proper type assertion
      const metadata = boothDetails.metadata ? boothDetails.metadata as ExtendedBoothMetadata : {};
      
      // Create a display data object
      return {
        id: boothId,
        name: `Display #${boothId}`,
        location: metadata.location || "Unknown Location",
        city: metadata.city || "Unknown City",
        isActive: boothDetails.active || false,
        impressions: metrics?.totalViews || 0,
        earnings: metrics?.totalViews ? Math.floor(metrics.totalViews * 0.05) : 0,
        campaigns: Array.isArray((boothDetails as any).campaigns) ? (boothDetails as any).campaigns.length : 0,
        dailyMetrics: Array.isArray(dailyMetrics) 
          ? dailyMetrics.map((day: any) => day?.viewCount || 0) 
          : [40, 65, 45, 70, 55, 80, 95],
        displayType: metadata.displayType || "standard",
        displaySize: metadata.displaySize || "medium",
        pricePerDay: (boothDetails as any).pricePerDay || 50,
        footTraffic: metadata.footTraffic || 1200,
        imageUrl: metadata.imageUrl
      };
    } catch (err) {
      console.error(`Error processing booth ${boothId}:`, err);
      return null;
    }
  }, [getBoothDetails, getAggregatedMetrics, getDailyMetrics]);
  
  // Main function to load all display data
  const loadDisplayData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Step 1: Get all provider locations
      const locationIds = await fetchProviderLocations();
      
      if (!locationIds.length) {
        console.log("No valid location IDs found for this provider");
        setDisplays([]);
        setIsLoading(false);
        return;
      }
      
      console.log(`Found ${locationIds.length} valid locations, fetching details...`);
      
      // Step 2: Get booth details for each location
      const displayPromises = locationIds.map(id => fetchBoothDetails(id));
      const displayResults = await Promise.all(displayPromises);
      
      // Filter out any null results
      const validDisplays = displayResults.filter(Boolean) as DisplayData[];
      
      console.log(`Successfully loaded ${validDisplays.length} displays out of ${locationIds.length} IDs`);
      
      if (validDisplays.length === 0 && locationIds.length > 0) {
        console.warn("Found locations but couldn't load any valid displays");
        setError("Found provider locations but couldn't retrieve display details.");
      }
      
      setDisplays(validDisplays);
      
      // Set active display if we have results and none is selected
      if (validDisplays.length > 0 && !activeDisplay) {
        setActiveDisplay(validDisplays[0].id);
      }
    } catch (err) {
      console.error("Error loading display data:", err);
      setError("Failed to load display data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [fetchProviderLocations, fetchBoothDetails, activeDisplay]);
  
  // Initial load
  useEffect(() => {
    loadDisplayData();
  }, [loadDisplayData]);
  
  // Handle display status change
  const handleStatusChange = async (displayId: number, newStatus: boolean) => {
    try {
      // Update state optimistically
      setDisplayStatuses(prev => ({
        ...prev,
        [displayId]: newStatus
      }));
      
      let hash;
      if (newStatus) {
        hash = await operations.activateBooth.execute(displayId);
      } else {
        hash = await operations.deactivateBooth.execute(displayId);
      }
      
      if (hash) {
        toast(
          newStatus ? "Display Activated" : "Display Deactivated",
          { description: `The display is now ${newStatus ? "online" : "offline"}.` },
          newStatus ? "success" : "info"
        );
        
        // Refresh data after a delay
        setTimeout(() => {
          loadDisplayData();
          legacyRefresh();
        }, 2000);
      }
    } catch (err) {
      console.error("Error updating display status:", err);
      toast(
        "Status Update Failed",
        { description: err instanceof Error ? err.message : "Unknown error" },
        "error"
      );
      
      // Revert optimistic update
      setDisplayStatuses(prev => ({
        ...prev,
        [displayId]: !newStatus
      }));
    }
  };
  
  // Refresh function
  const refreshData = () => {
    setIsRefreshing(true);
    loadDisplayData().finally(() => {
      legacyRefresh();
      setIsRefreshing(false);
    });
  };
  
  // Get the selected display
  const selectedDisplay = displays.find(d => d.id === activeDisplay) || (displays.length > 0 ? displays[0] : null);
  
  // Loading state
  if (isLoading && displays.length === 0) {
    return (
      <section className="mb-10 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-black relative inline-block">
            DISPLAY PERFORMANCE
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#0055FF] [clip-path:polygon(0_0,100%_0,96%_100%,4%_100%)]"></div>
          </h2>
          <Button
            variant="outline"
            className="border-[4px] border-black rounded-none bg-white hover:bg-[#FFCC00] transition-all font-bold px-4 py-2 h-auto flex items-center gap-2 cursor-not-allowed opacity-50"
            disabled={true}
          >
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>LOADING</span>
          </Button>
        </div>
        <div className="border-[6px] border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-[4px] border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="relative mb-4 border-[4px] border-black overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="absolute top-3 right-3 px-3 py-1">
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
                <Skeleton className="h-7 w-40 mb-2" />
                <Skeleton className="h-5 w-60 mb-3" />
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="border-[3px] border-black p-2 bg-[#f5f5f5]">
                      <Skeleton className="h-4 w-16 mb-1" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Empty state
  if (!isLoading && displays.length === 0) {
    return (
      <section className="mb-10 relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-black relative inline-block">
            DISPLAY PERFORMANCE
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#0055FF] [clip-path:polygon(0_0,100%_0,96%_100%,4%_100%)]"></div>
          </h2>
          <Button
            variant="outline"
            className="border-[4px] border-black rounded-none bg-white hover:bg-[#FFCC00] hover:text-black transition-all font-bold px-4 py-2 h-auto flex items-center gap-2 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1"
            onClick={refreshData}
          >
            <RefreshCw className="w-5 h-5" />
            <span>REFRESH</span>
          </Button>
        </div>
        <div className="border-[6px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center">
          <p className="text-lg font-bold py-4">No displays registered yet.</p>
          <p className="mb-4">Register your first display to see performance metrics.</p>
        </div>
      </section>
    );
  }

  // Display data state
  return (
    <section className="mb-10 relative">
      {/* Checkered background */}
      <div className="absolute inset-0 -z-10 bg-checkered-yellow opacity-20"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-black relative inline-block">
          DISPLAY PERFORMANCE
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#0055FF] [clip-path:polygon(0_0,100%_0,96%_100%,4%_100%)]"></div>
        </h2>
        <Button
          variant="outline"
          className={`border-[4px] border-black rounded-none bg-white hover:bg-[#FFCC00] hover:text-black transition-all font-bold px-4 py-2 h-auto flex items-center gap-2 ${
            isRefreshing ? "animate-pulse" : ""
          } hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1`}
          onClick={refreshData}
          disabled={isRefreshing}
        >
          <RefreshCw className="w-5 h-5" />
          <span>REFRESH</span>
        </Button>
      </div>

      {/* Display cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {displays.map((display) => (
          <div
            key={display.id}
            className={`border-[4px] border-black bg-white p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all ${
              activeDisplay === display.id ? "ring-[4px] ring-[#0055FF] ring-offset-2" : ""
            } cursor-pointer transform ${display.id % 2 === 0 ? "rotate-1" : "-rotate-1"}`}
            onClick={() => setActiveDisplay(display.id)}
          >
            <div className="relative mb-4 border-[4px] border-black overflow-hidden bg-gray-100">
              <Image
                src={display.imageUrl || `/placeholder.svg?height=200&width=300&text=${encodeURIComponent(display.name)}`}
                alt={display.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div
                className={`absolute top-3 right-3 px-3 py-1 font-bold text-sm border-[2px] border-black ${
                  displayStatuses[display.id] ?? display.isActive ? "bg-green-500 text-white" : "bg-gray-400 text-white"
                }`}
              >
                {(displayStatuses[display.id] ?? display.isActive) ? "ACTIVE" : "INACTIVE"}
              </div>
            </div>

            <h3 className="text-xl font-black mb-1">{display.name}</h3>
            <p className="font-medium text-gray-600 mb-3">{display.location}, {display.city}</p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="border-[3px] border-black p-2 bg-[#f5f5f5]">
                <div className="text-xs font-medium">Impressions</div>
                <div className="text-lg font-black">{display.impressions.toLocaleString()}</div>
              </div>
              <div className="border-[3px] border-black p-2 bg-[#f5f5f5]">
                <div className="text-xs font-medium">Earnings</div>
                <div className="text-lg font-black">{display.earnings} ADC</div>
              </div>
              <div className="border-[3px] border-black p-2 bg-[#f5f5f5]">
                <div className="text-xs font-medium">Campaigns</div>
                <div className="text-lg font-black">{display.campaigns}</div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id={`display-status-${display.id}`}
                  checked={displayStatuses[display.id] ?? display.isActive}
                  onCheckedChange={(checked) => {
                    handleStatusChange(display.id, checked);
                  }}
                  className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-400 h-6 w-12 border-[3px] border-black"
                />
                <label htmlFor={`display-status-${display.id}`} className="font-bold">
                  {(displayStatuses[display.id] ?? display.isActive) ? "Online" : "Offline"}
                </label>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-[3px] border-black rounded-none hover:bg-[#f5f5f5] transition-all"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected display details */}
      {selectedDisplay && (
        <div className="border-[6px] border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 relative mb-8 transform rotate-0">
          <h3 className="text-2xl font-black mb-4 flex items-center justify-between">
            <span>Detailed Metrics: {selectedDisplay.name}</span>
            <Button
              variant="outline"
              className="border-[3px] border-black rounded-none bg-white hover:bg-[#f5f5f5] transition-all font-bold px-3 py-1 h-auto flex items-center gap-1"
              onClick={() => setExpandedMetrics(!expandedMetrics)}
            >
              {expandedMetrics ? "Show Less" : "Show More"}
              <ChevronDown className={`w-4 h-4 transition-transform ${expandedMetrics ? "rotate-180" : ""}`} />
            </Button>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Daily Impressions Chart */}
            <div className="border-[4px] border-black p-4 bg-[#f5f5f5]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <Eye className="w-5 h-5" /> Daily Impressions
                </h4>
                <div className="flex items-center gap-1 bg-[#0055FF] text-white px-2 py-1 font-bold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+8.3%</span>
                </div>
              </div>
              <div className="h-32 relative border-[3px] border-black bg-white p-2">
                {/* Daily metrics chart */}
                <div className="absolute inset-0 flex items-end p-2">
                  {selectedDisplay.dailyMetrics.map((value, index) => {
                    const maxValue = Math.max(...selectedDisplay.dailyMetrics);
                    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    
                    return (
                      <div key={index} className="flex-1 mx-1" style={{ height: `${height}%` }}>
                        <div className="w-full h-full bg-[#0055FF] border-[2px] border-black"></div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-between mt-2 text-xs font-medium">
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
                <div>Sun</div>
              </div>
            </div>

            {/* Engagement Rate */}
            <div className="border-[4px] border-black p-4 bg-[#f5f5f5]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" /> Engagement Rate
                </h4>
                <div className="flex items-center gap-1 bg-[#FF3366] text-white px-2 py-1 font-bold text-sm">
                  <TrendingDown className="w-4 h-4" />
                  <span>-2.1%</span>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">QR Scans</span>
                    <span className="font-bold">4.2%</span>
                  </div>
                  <div className="h-6 bg-white border-[3px] border-black">
                    <div className="h-full bg-[#0055FF] border-r-[2px] border-black" 
                         style={{ width: "42%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">NFC Taps</span>
                    <span className="font-bold">2.8%</span>
                  </div>
                  <div className="h-6 bg-white border-[3px] border-black">
                    <div className="h-full bg-[#FFCC00] border-r-[2px] border-black" 
                         style={{ width: "28%" }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">URL Visits</span>
                    <span className="font-bold">5.7%</span>
                  </div>
                  <div className="h-6 bg-white border-[3px] border-black">
                    <div className="h-full bg-[#FF3366] border-r-[2px] border-black" 
                         style={{ width: "57%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Earnings Breakdown */}
            <div className="border-[4px] border-black p-4 bg-[#f5f5f5]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5" /> Earnings Breakdown
                </h4>
                <div className="flex items-center gap-1 bg-[#0055FF] text-white px-2 py-1 font-bold text-sm">
                  <TrendingUp className="w-4 h-4" />
                  <span>+12.5%</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b-2 border-dashed border-black pb-2">
                  <span className="font-bold">Base Impressions</span>
                  <span className="font-black">{Math.round(selectedDisplay.earnings * 0.65)} ADC</span>
                </div>
                <div className="flex items-center justify-between border-b-2 border-dashed border-black pb-2">
                  <span className="font-bold">Engagement Bonus</span>
                  <span className="font-black">{Math.round(selectedDisplay.earnings * 0.15)} ADC</span>
                </div>
                <div className="flex items-center justify-between border-b-2 border-dashed border-black pb-2">
                  <span className="font-bold">Premium Location</span>
                  <span className="font-black">{Math.round(selectedDisplay.earnings * 0.20)} ADC</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-black text-lg">TOTAL</span>
                  <span className="font-black text-lg">{selectedDisplay.earnings} ADC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Extended display information */}
          {expandedMetrics && (
            <div className="pt-4 border-t-2 border-dashed border-gray-300">
              <h4 className="font-bold text-lg mb-4">Display Specifications</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="border-[3px] border-black p-3 bg-white">
                  <div className="text-sm font-medium text-gray-600">Display Type</div>
                  <div className="font-bold">{selectedDisplay.displayType.charAt(0).toUpperCase() + selectedDisplay.displayType.slice(1)}</div>
                </div>
                <div className="border-[3px] border-black p-3 bg-white">
                  <div className="text-sm font-medium text-gray-600">Size Category</div>
                  <div className="font-bold">{selectedDisplay.displaySize.charAt(0).toUpperCase() + selectedDisplay.displaySize.slice(1)}</div>
                </div>
                <div className="border-[3px] border-black p-3 bg-white">
                  <div className="text-sm font-medium text-gray-600">Daily Rate</div>
                  <div className="font-bold">{selectedDisplay.pricePerDay} ADC</div>
                </div>
                <div className="border-[3px] border-black p-3 bg-white">
                  <div className="text-sm font-medium text-gray-600">Avg. Daily Foot Traffic</div>
                  <div className="font-bold">{selectedDisplay.footTraffic.toLocaleString()}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

