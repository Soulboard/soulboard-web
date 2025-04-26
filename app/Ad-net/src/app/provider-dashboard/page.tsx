"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  Bell, Menu, Activity, MapPin, DollarSign, 
  BarChart3, RefreshCw, Wallet, ChevronRight,
  Monitor, Eye, AlertTriangle, Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "@/lib/toast"
import { usePrivy } from "@privy-io/react-auth"
import { useBlockchainService, useBoothRegistry, usePerformanceOracle } from "@/hooks"
import { useRoleStore, useUserStore } from "@/lib/store"
import { Booth, BoothStatus } from "@/lib/blockchain/types"

// Import custom components
import ProviderHeader from "@/components/provider-header"
import DisplayOverview from "@/components/display-overview"
import DisplayRegistration from "@/components/display-registration"
import DisplayPerformance from "@/components/display-performance"
import VerificationManagement from "@/components/verification-management"
import EarningsPayments from "@/components/earnings-payments"

// Define timeout constants
const FETCH_TIMEOUT = 10000; // 10 seconds timeout

// Custom hook for fetching with timeout
function useFetchWithTimeout() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchWithTimeout = useCallback(async (fetchPromise: Promise<any>, timeoutMs: number = FETCH_TIMEOUT) => {
    // Create a new AbortController for this request
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      // Create a timeout promise
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Request timed out'));
          abortControllerRef.current?.abort();
        }, timeoutMs);
      });

      // Race the fetch against the timeout
      return await Promise.race([fetchPromise, timeoutPromise]);
    } catch (error) {
      if ((error as Error).message === 'Request timed out') {
        console.error('Request timed out');
        return null;
      }
      throw error;
    }
  }, []);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return fetchWithTimeout;
}

export default function ProviderDashboard() {
  // Use the router
  const router = useRouter();
  
  // User authentication and role state
  const { isConnected } = useUserStore();
  const { currentRole: activeRole, isProviderRegistered } = useRoleStore();
  const { authenticated, user } = usePrivy();
  
  // Blockchain service hooks
  const {
    service,
    isLoading: serviceLoading,
    error: serviceError,
    isCorrectChain,
    switchChain
  } = useBlockchainService();
  
  // Create refs for caching data
  const dataCache = useRef<{
    activeBooths: number[] | null;
    booths: Booth[] | null;
    lastFetched: number;
  }>({
    activeBooths: null,
    booths: null,
    lastFetched: 0
  });
  
  // Local state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState({
    activeBooths: 0,
    totalBooths: 0,
    availableBooths: 0,
    bookedBooths: 0,
    maintenanceBooths: 0
  });
  
  // Use custom fetch with timeout hook
  const fetchWithTimeout = useFetchWithTimeout();
  
  // Use booth registry hooks
  const { 
    getActiveBooths, 
    getAllBooths,
    myLocations,
    activeBooths,
    allBooths,
    isLoadingActiveBooths,
    isLoadingAllBooths
  } = useBoothRegistry();
  
  // Fix 1: Add a useRef to track initial load and prevent infinite fetching
  const initialLoadCompletedRef = useRef(false);
  
  // Function to load dashboard data with timeout protection
  const loadDashboardData = useCallback(async () => {
    // Only make this fetch if we're not already loading
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Check auth and permissions
      if (!isConnected || !authenticated || !service) {
        setIsLoading(false);
        return;
      }
      
      // Check if we have recent cached data (within last 60 seconds to reduce fetching)
      const now = Date.now();
      const isCacheValid = dataCache.current.lastFetched > 0 && 
                          (now - dataCache.current.lastFetched < 60000) &&
                          dataCache.current.activeBooths !== null &&
                          dataCache.current.booths !== null;
      
      let activeBoothsData = dataCache.current.activeBooths;
      let boothsData = dataCache.current.booths;
      
      // Fetch data if cache is invalid
      if (!isCacheValid) {
        try {
          // Fetch active booths with timeout protection
          if (!activeBoothsData) {
            activeBoothsData = await fetchWithTimeout(
              getActiveBooths(),
              FETCH_TIMEOUT
            );
          }
          
          // Fetch all booths with timeout protection
          if (!boothsData) {
            boothsData = await fetchWithTimeout(
              getAllBooths(),
              FETCH_TIMEOUT
            );
          }
          
          // Update cache if we got valid data
          if (activeBoothsData && boothsData) {
            dataCache.current = {
              activeBooths: activeBoothsData,
              booths: boothsData,
              lastFetched: now
            };
          }
        } catch (err) {
          console.error("Error fetching booth data:", err);
          setError("Failed to fetch provider data. Please try again later.");
          
          // Use cached data if available, even if expired
          if (dataCache.current.activeBooths && dataCache.current.booths) {
            activeBoothsData = dataCache.current.activeBooths;
            boothsData = dataCache.current.booths;
          }
        }
      }
      
      // Process data if available
      if (activeBoothsData && boothsData) {
        // Calculate stats
        const totalBooths = boothsData.length;
        const activeBoothsCount = activeBoothsData.length;
        
        // Count booths by status
        let availableCount = 0;
        let bookedCount = 0;
        let maintenanceCount = 0;
        
        boothsData.forEach(booth => {
          if (booth.active) {
            if (booth.status === BoothStatus.Unbooked) availableCount++;
            else if (booth.status === BoothStatus.Booked) bookedCount++;
            else if (booth.status === BoothStatus.UnderMaintenance) maintenanceCount++;
          }
        });
        
        // Update dashboard data
        setDashboardData({
          activeBooths: activeBoothsCount,
          totalBooths,
          availableBooths: availableCount,
          bookedBooths: bookedCount,
          maintenanceBooths: maintenanceCount
        });
      }
    } catch (err) {
      console.error("Error in loadDashboardData:", err);
      setError("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, authenticated, service, fetchWithTimeout, getActiveBooths, getAllBooths, isLoading]);
  
  // Update the useEffect for loadDashboardData to prevent infinite fetching
  useEffect(() => {
    if (!initialLoadCompletedRef.current) {
      loadDashboardData();
      initialLoadCompletedRef.current = true;
    }
  }, [loadDashboardData]);
  
  // Handle network switch
  const handleSwitchNetwork = async () => {
    try {
      await switchChain();
      toast("Network switched", { description: "Switched to the correct network" }, "success");
      
      // Reload data after network switch
      loadDashboardData();
    } catch (err) {
      console.error("Network switch error:", err);
      toast("Network switch failed", { description: "Failed to switch network" }, "error");
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      {/* Checkered Background Pattern */}
      <div className="fixed inset-0 -z-20 bg-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMCAwaDIwdjIwSDB6TTIwIDIwaDIwdjIwSDIweiIgZmlsbD0icmdiYSgwLDAsMCwwLjAzKSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')]
         opacity-70"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-32 h-32 bg-[#FFCC00] border-[6px] border-black rounded-full opacity-20 animate-pulse"></div>
        <div
          className="absolute top-[30%] left-[8%] w-48 h-48 bg-[#0055FF] border-[6px] border-black opacity-10 animate-bounce"
          style={{ animationDuration: "8s" }}
        ></div>
        <div
          className="absolute bottom-[15%] right-[15%] w-64 h-64 bg-[#FF3366] border-[6px] border-black opacity-10"
          style={{ animation: "spin 15s linear infinite" }}
        ></div>
        <div
          className="absolute top-[60%] left-[20%] w-24 h-24 bg-black opacity-5 rotate-45 animate-pulse"
          style={{ animationDuration: "4s" }}
        ></div>
        <div
          className="absolute bottom-[40%] right-[30%] w-36 h-36 bg-[#FFCC00] border-[6px] border-black opacity-10 rotate-12"
          style={{ animation: "float 6s ease-in-out infinite" }}
        ></div>
      </div>

      <main className="container mx-auto px-4 py-8 relative z-10">
        <ProviderHeader />
        
        {/* Network warning */}
        {!isCorrectChain && (
          <div className="mb-6 border-[3px] border-yellow-400 bg-yellow-50 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-600" />
              <p className="font-medium">You're connected to the wrong network</p>
            </div>
            <Button
              onClick={handleSwitchNetwork}
              size="sm"
              className="bg-yellow-500 hover:bg-yellow-600 text-black"
            >
              Switch Network
            </Button>
          </div>
        )}
        
        {/* Dashboard Quick Stats with Improved Design */}
        <section className="mb-10">
          <h2 className="text-2xl font-black mb-4 relative inline-block">
            NETWORK STATUS
            <div className="absolute -bottom-2 left-0 w-full h-1 bg-[#0055FF] [clip-path:polygon(0_0,100%_0,96%_100%,4%_100%)]"></div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              // Skeleton loading state with improved design
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="border-[4px] border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all p-5">
                    <div className="flex justify-between items-start mb-3">
                      <Skeleton className="h-7 w-24" />
                      <Skeleton className="h-10 w-10 rounded-full" />
                    </div>
                    <div className="bg-gray-100 border-[3px] border-black p-3 mb-2">
                      <Skeleton className="h-10 w-28 mb-1" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </>
            ) : error ? (
              // Error state with improved design
              <div className="border-[4px] border-black bg-[#FF3366] text-white p-6 col-span-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="h-8 w-8 mr-4" />
                  <div>
                    <h3 className="text-xl font-bold">ERROR LOADING DATA</h3>
                    <p className="text-white opacity-90">{error}</p>
                  </div>
                </div>
                <Button onClick={loadDashboardData} 
                  className="bg-black text-white hover:bg-white hover:text-black border-2 border-white transition-colors">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  RETRY
                </Button>
              </div>
            ) : (
              // Data loaded successfully with improved design
              <>
                <div className="border-[4px] border-black bg-[#0055FF] p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:-translate-y-1 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-black text-white">TOTAL DISPLAYS</h3>
                    <div className="rounded-full bg-white p-2 border-2 border-black">
                      <Monitor className="h-6 w-6 text-[#0055FF] group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="bg-white border-[3px] border-black p-3 mb-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <p className="text-3xl font-black">{dashboardData.totalBooths}</p>
                  </div>
                  <p className="text-sm text-white font-bold">Registered displays on network</p>
                </div>
                
                <div className="border-[4px] border-black bg-[#FFCC00] p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:-translate-y-1 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-black">ACTIVE DISPLAYS</h3>
                    <div className="rounded-full bg-white p-2 border-2 border-black">
                      <Zap className="h-6 w-6 text-[#FFCC00] group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="bg-white border-[3px] border-black p-3 mb-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <p className="text-3xl font-black">{dashboardData.activeBooths}</p>
                  </div>
                  <p className="text-sm font-bold">{Math.round((dashboardData.activeBooths / Math.max(1, dashboardData.totalBooths)) * 100)}% of total displays</p>
                </div>
                
                <div className="border-[4px] border-black bg-[#33CC99] p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1 hover:-translate-y-1 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-black">AVAILABLE</h3>
                    <div className="rounded-full bg-white p-2 border-2 border-black">
                      <Eye className="h-6 w-6 text-[#33CC99] group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="bg-white border-[3px] border-black p-3 mb-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <p className="text-3xl font-black">{dashboardData.availableBooths}</p>
                  </div>
                  <p className="text-sm font-bold">Ready for booking</p>
                </div>
                
                <div className="border-[4px] border-black bg-[#FF3366] p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 hover:-translate-y-1 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-black text-white">BOOKED</h3>
                    <div className="rounded-full bg-white p-2 border-2 border-black">
                      <DollarSign className="h-6 w-6 text-[#FF3366] group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="bg-white border-[3px] border-black p-3 mb-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    <p className="text-3xl font-black">{dashboardData.bookedBooths}</p>
                  </div>
                  <p className="text-sm text-white font-bold">Running active campaigns</p>
                </div>
              </>
            )}
          </div>
        </section>
        
        {/* Display overview with optimized data fetching */}
        <DisplayOverview />
        
        {/* Other components with skeleton loading handled internally */}
        <DisplayRegistration />
        <DisplayPerformance />
        <VerificationManagement />
        <EarningsPayments />
        
        {/* Display blockchain connection status notification if there are errors */}
        {serviceError && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg border-2 border-black">
            <p className="font-bold">Blockchain Connection Error</p>
            <p>{serviceError.message || "Unable to connect to blockchain service"}</p>
            {!isCorrectChain && (
              <Button 
                className="mt-2 bg-white text-red-500 hover:bg-gray-100"
                onClick={handleSwitchNetwork}
              >
                Switch to Holesky
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

