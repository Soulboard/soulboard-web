import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

// Types for our data models
export type CampaignStatus = "Active" | "Draft" | "Ended" | "Paused"
export type LocationStatus = "Active" | "Maintenance" | "Inactive"
export type DisplayType = "Digital Billboard" | "Interactive Display" | "LED Wall" | "Projection"

export interface Campaign {
  id: string
  name: string
  status: CampaignStatus
  budget: string
  spent: string
  impressions: string
  startDate: string
  endDate: string
  description?: string
  targetAudience?: string
  roi?: string
  engagementRate?: string
  clickThroughRate?: string
  locations?: string[]
}

export interface Location {
  id: string
  name: string
  address: string
  type: DisplayType
  status: LocationStatus
  impressions: string
  earnings: string
  size?: string
  description?: string
  campaigns?: string[]
  uptime?: string
  lastMaintenance?: string
}

export interface DashboardStats {
  advertiser: {
    activeCampaigns: number
    totalImpressions: string
    budgetSpent: string
    roi: string
    recentActivity: Array<{
      id: string
      title: string
      time: string
      description: string
    }>
  }
  provider: {
    activeDisplays: number
    totalImpressions: string
    monthlyEarnings: string
    growth: string
    recentActivity: Array<{
      id: string
      title: string
      time: string
      description: string
    }>
  }
}

export interface AnalyticsData {
  advertiser: {
    impressionsOverTime: number[]
    clickThroughRates: number[]
    conversionRates: number[]
    campaignPerformance: Array<{
      id: string
      name: string
      impressions: string
      change: string
    }>
    audienceDemographics: {
      age: Record<string, number>
      interests: Record<string, number>
    }
  }
  provider: {
    impressionsOverTime: number[]
    earningsOverTime: number[]
    displayPerformance: Array<{
      id: string
      name: string
      earnings: string
      change: string
    }>
    campaignDistribution: {
      type: Record<string, number>
      duration: Record<string, number>
    }
  }
}

interface DashboardState {
  // Data
  campaigns: Campaign[]
  locations: Location[]
  dashboardStats: DashboardStats
  analyticsData: AnalyticsData

  // UI State
  isLoading: {
    campaigns: boolean
    locations: boolean
    dashboardStats: boolean
    analyticsData: boolean
  }
  error: {
    campaigns: string | null
    locations: string | null
    dashboardStats: string | null
    analyticsData: string | null
  }

  // Actions
  fetchCampaigns: () => Promise<void>
  fetchLocations: () => Promise<void>
  fetchDashboardStats: () => Promise<void>
  fetchAnalyticsData: () => Promise<void>
  updateCampaign: (id: string, data: Partial<Campaign>) => Promise<void>
  updateLocation: (id: string, data: Partial<Location>) => Promise<void>
  createCampaign: (campaign: Omit<Campaign, "id">) => Promise<string>
  createLocation: (location: Omit<Location, "id">) => Promise<string>
  deleteCampaign: (id: string) => Promise<void>
  deleteLocation: (id: string) => Promise<void>
}

// Mock data fetching functions (in a real app, these would be API calls)
const mockFetchCampaigns = async (): Promise<Campaign[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return [
    {
      id: "1",
      name: "Summer Sale Promotion",
      status: "Active",
      budget: "$2,500",
      spent: "$1,245",
      impressions: "450K",
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      description: "Promote summer discounts across high-traffic urban locations",
      targetAudience: "General Public",
      roi: "+24%",
      engagementRate: "8.2%",
      clickThroughRate: "3.8%",
      locations: ["nyc", "la", "miami"],
    },
    {
      id: "2",
      name: "New Product Launch",
      status: "Active",
      budget: "$5,000",
      spent: "$2,340",
      impressions: "780K",
      startDate: "2025-05-15",
      endDate: "2025-07-15",
      description: "Launch campaign for our newest product line",
      targetAudience: "Young Adults (18-24)",
      roi: "+18%",
      engagementRate: "9.5%",
      clickThroughRate: "4.2%",
      locations: ["nyc", "chicago", "sf"],
    },
    {
      id: "3",
      name: "Holiday Special",
      status: "Draft",
      budget: "$3,000",
      spent: "$0",
      impressions: "0",
      startDate: "2025-11-01",
      endDate: "2025-12-31",
      description: "Holiday season promotional campaign",
      targetAudience: "Families",
      locations: [],
    },
    {
      id: "4",
      name: "Spring Collection",
      status: "Ended",
      budget: "$1,800",
      spent: "$1,800",
      impressions: "620K",
      startDate: "2025-03-01",
      endDate: "2025-05-01",
      description: "Spring fashion collection showcase",
      targetAudience: "Professionals (25-40)",
      roi: "+15%",
      engagementRate: "7.8%",
      clickThroughRate: "3.5%",
      locations: ["la", "miami", "seattle"],
    },
    {
      id: "5",
      name: "Brand Awareness",
      status: "Active",
      budget: "$10,000",
      spent: "$4,230",
      impressions: "1.2M",
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      description: "Year-long brand awareness campaign",
      targetAudience: "General Public",
      roi: "+22%",
      engagementRate: "8.0%",
      clickThroughRate: "3.6%",
      locations: ["nyc", "la", "chicago", "miami", "sf", "seattle"],
    },
  ]
}

const mockFetchLocations = async (): Promise<Location[]> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  return [
    {
      id: "nyc",
      name: "Times Square North",
      address: "1535 Broadway, New York, NY 10036",
      type: "Digital Billboard",
      status: "Active",
      impressions: "120K/day",
      earnings: "$1,850/month",
      size: "Large (50-100 sq ft)",
      description:
        "Premium digital billboard located at the heart of Times Square with high visibility and foot traffic.",
      campaigns: ["1", "2", "5"],
      uptime: "99.8%",
      lastMaintenance: "2025-04-10",
    },
    {
      id: "la",
      name: "Santa Monica Pier",
      address: "200 Santa Monica Pier, Santa Monica, CA 90401",
      type: "Interactive Display",
      status: "Active",
      impressions: "95K/day",
      earnings: "$1,200/month",
      size: "Medium (10-50 sq ft)",
      description: "Interactive display with touch capabilities at the popular Santa Monica Pier.",
      campaigns: ["1", "4", "5"],
      uptime: "98.5%",
      lastMaintenance: "2025-03-22",
    },
    {
      id: "chicago",
      name: "Magnificent Mile",
      address: "401 N Michigan Ave, Chicago, IL 60611",
      type: "Digital Billboard",
      status: "Active",
      impressions: "85K/day",
      earnings: "$1,400/month",
      size: "Medium (10-50 sq ft)",
      description: "Digital billboard on Chicago's famous Magnificent Mile shopping district.",
      campaigns: ["2", "5"],
      uptime: "99.2%",
      lastMaintenance: "2025-04-05",
    },
    {
      id: "miami",
      name: "South Beach",
      address: "1001 Ocean Drive, Miami Beach, FL 33139",
      type: "Interactive Display",
      status: "Maintenance",
      impressions: "0/day",
      earnings: "$0/month",
      size: "Large (50-100 sq ft)",
      description: "Interactive display on Miami's vibrant South Beach, currently under maintenance.",
      campaigns: ["1", "4", "5"],
      uptime: "92.3%",
      lastMaintenance: "2025-05-01",
    },
    {
      id: "sf",
      name: "Union Square",
      address: "333 Post St, San Francisco, CA 94108",
      type: "Digital Billboard",
      status: "Active",
      impressions: "75K/day",
      earnings: "$1,100/month",
      size: "Medium (10-50 sq ft)",
      description: "Digital billboard in San Francisco's popular Union Square shopping district.",
      campaigns: ["2", "5"],
      uptime: "99.5%",
      lastMaintenance: "2025-03-15",
    },
    {
      id: "seattle",
      name: "Pike Place",
      address: "85 Pike St, Seattle, WA 98101",
      type: "LED Wall",
      status: "Active",
      impressions: "65K/day",
      earnings: "$950/month",
      size: "Medium (10-50 sq ft)",
      description: "LED wall display near the famous Pike Place Market in Seattle.",
      campaigns: ["4", "5"],
      uptime: "98.9%",
      lastMaintenance: "2025-02-28",
    },
  ]
}

const mockFetchDashboardStats = async (): Promise<DashboardStats> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 600))

  return {
    advertiser: {
      activeCampaigns: 12,
      totalImpressions: "1.2M",
      budgetSpent: "$5,240",
      roi: "+24%",
      recentActivity: [
        {
          id: "act1",
          title: "Campaign 'Summer Sale' is live",
          time: "2 hours ago",
          description: "Your campaign is now running on 5 displays",
        },
        {
          id: "act2",
          title: "Budget update",
          time: "Yesterday",
          description: "Added $1,000 to 'New Product Launch' campaign",
        },
        {
          id: "act3",
          title: "Campaign ended",
          time: "3 days ago",
          description: "'Spring Collection' campaign has ended",
        },
        {
          id: "act4",
          title: "New analytics available",
          time: "5 days ago",
          description: "Weekly performance report for all campaigns is ready",
        },
      ],
    },
    provider: {
      activeDisplays: 8,
      totalImpressions: "850K",
      monthlyEarnings: "$3,780",
      growth: "+18%",
      recentActivity: [
        {
          id: "act1",
          title: "New campaign assigned",
          time: "1 hour ago",
          description: "'Summer Sale' campaign assigned to 2 of your displays",
        },
        {
          id: "act2",
          title: "Payment received",
          time: "Yesterday",
          description: "Received $420 for April campaigns",
        },
        {
          id: "act3",
          title: "Display verification",
          time: "2 days ago",
          description: "'Times Square North' display verified successfully",
        },
        {
          id: "act4",
          title: "Maintenance scheduled",
          time: "4 days ago",
          description: "Maintenance for 'South Beach' display scheduled for next week",
        },
      ],
    },
  }
}

const mockFetchAnalyticsData = async (): Promise<AnalyticsData> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    advertiser: {
      impressionsOverTime: [120000, 150000, 180000, 220000, 210000, 240000, 230000],
      clickThroughRates: [3.2, 3.5, 3.8, 4.0, 3.9, 4.1, 4.2],
      conversionRates: [1.8, 1.9, 2.1, 2.3, 2.0, 2.2, 2.1],
      campaignPerformance: [
        { id: "1", name: "Summer Sale", impressions: "120K", change: "+15%" },
        { id: "2", name: "New Product Launch", impressions: "95K", change: "+12%" },
        { id: "5", name: "Brand Awareness", impressions: "85K", change: "+10%" },
        { id: "4", name: "Spring Collection", impressions: "75K", change: "+8%" },
      ],
      audienceDemographics: {
        age: {
          "18-24": 25,
          "25-34": 35,
          "35-44": 20,
          "45-54": 12,
          "55+": 8,
        },
        interests: {
          Technology: 30,
          Fashion: 25,
          Sports: 15,
          Food: 20,
          Travel: 10,
        },
      },
    },
    provider: {
      impressionsOverTime: [85000, 92000, 105000, 112000, 108000, 115000, 120000],
      earningsOverTime: [3200, 3400, 3800, 4100, 3900, 4200, 4300],
      displayPerformance: [
        { id: "nyc", name: "Times Square North", earnings: "$1,850", change: "+12%" },
        { id: "la", name: "Santa Monica Pier", earnings: "$1,200", change: "+8%" },
        { id: "chicago", name: "Magnificent Mile", earnings: "$1,400", change: "+10%" },
        { id: "sf", name: "Union Square", earnings: "$1,100", change: "+7%" },
      ],
      campaignDistribution: {
        type: {
          Promotional: 40,
          "Brand Awareness": 30,
          "Product Launch": 20,
          Seasonal: 10,
        },
        duration: {
          "Short-term (< 1 month)": 25,
          "Medium-term (1-3 months)": 45,
          "Long-term (> 3 months)": 30,
        },
      },
    },
  }
}

// Create the store
export const useDashboardStore = create<DashboardState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        campaigns: [],
        locations: [],
        dashboardStats: {
          advertiser: {
            activeCampaigns: 0,
            totalImpressions: "0",
            budgetSpent: "$0",
            roi: "0%",
            recentActivity: [],
          },
          provider: {
            activeDisplays: 0,
            totalImpressions: "0",
            monthlyEarnings: "$0",
            growth: "0%",
            recentActivity: [],
          },
        },
        analyticsData: {
          advertiser: {
            impressionsOverTime: [],
            clickThroughRates: [],
            conversionRates: [],
            campaignPerformance: [],
            audienceDemographics: {
              age: {},
              interests: {},
            },
          },
          provider: {
            impressionsOverTime: [],
            earningsOverTime: [],
            displayPerformance: [],
            campaignDistribution: {
              type: {},
              duration: {},
            },
          },
        },
        isLoading: {
          campaigns: false,
          locations: false,
          dashboardStats: false,
          analyticsData: false,
        },
        error: {
          campaigns: null,
          locations: null,
          dashboardStats: null,
          analyticsData: null,
        },

        // Actions
        fetchCampaigns: async () => {
          set((state) => ({
            isLoading: { ...state.isLoading, campaigns: true },
            error: { ...state.error, campaigns: null },
          }))

          try {
            const campaigns = await mockFetchCampaigns()
            set({ campaigns, isLoading: { ...get().isLoading, campaigns: false } })
          } catch (error) {
            set({
              isLoading: { ...get().isLoading, campaigns: false },
              error: { ...get().error, campaigns: error.message || "Failed to fetch campaigns" },
            })
          }
        },

        fetchLocations: async () => {
          set((state) => ({
            isLoading: { ...state.isLoading, locations: true },
            error: { ...state.error, locations: null },
          }))

          try {
            const locations = await mockFetchLocations()
            set({ locations, isLoading: { ...get().isLoading, locations: false } })
          } catch (error) {
            set({
              isLoading: { ...get().isLoading, locations: false },
              error: { ...get().error, locations: error.message || "Failed to fetch locations" },
            })
          }
        },

        fetchDashboardStats: async () => {
          set((state) => ({
            isLoading: { ...state.isLoading, dashboardStats: true },
            error: { ...state.error, dashboardStats: null },
          }))

          try {
            const dashboardStats = await mockFetchDashboardStats()
            set({ dashboardStats, isLoading: { ...get().isLoading, dashboardStats: false } })
          } catch (error) {
            set({
              isLoading: { ...get().isLoading, dashboardStats: false },
              error: { ...get().error, dashboardStats: error.message || "Failed to fetch dashboard stats" },
            })
          }
        },

        fetchAnalyticsData: async () => {
          set((state) => ({
            isLoading: { ...state.isLoading, analyticsData: true },
            error: { ...state.error, analyticsData: null },
          }))

          try {
            const analyticsData = await mockFetchAnalyticsData()
            set({ analyticsData, isLoading: { ...get().isLoading, analyticsData: false } })
          } catch (error) {
            set({
              isLoading: { ...get().isLoading, analyticsData: false },
              error: { ...get().error, analyticsData: error.message || "Failed to fetch analytics data" },
            })
          }
        },

        updateCampaign: async (id, data) => {
          set((state) => ({
            campaigns: state.campaigns.map((campaign) => (campaign.id === id ? { ...campaign, ...data } : campaign)),
          }))

          // In a real app, you would make an API call here
          await new Promise((resolve) => setTimeout(resolve, 500))
        },

        updateLocation: async (id, data) => {
          set((state) => ({
            locations: state.locations.map((location) => (location.id === id ? { ...location, ...data } : location)),
          }))

          // In a real app, you would make an API call here
          await new Promise((resolve) => setTimeout(resolve, 500))
        },

        createCampaign: async (campaignData) => {
          // Generate a new ID (in a real app, this would come from the backend)
          const id = `campaign-${Date.now()}`
          const newCampaign = { id, ...campaignData }

          set((state) => ({
            campaigns: [...state.campaigns, newCampaign],
          }))

          // In a real app, you would make an API call here
          await new Promise((resolve) => setTimeout(resolve, 500))

          return id
        },

        createLocation: async (locationData) => {
          // Generate a new ID (in a real app, this would come from the backend)
          const id = `location-${Date.now()}`
          const newLocation = { id, ...locationData }

          set((state) => ({
            locations: [...state.locations, newLocation],
          }))

          // In a real app, you would make an API call here
          await new Promise((resolve) => setTimeout(resolve, 500))

          return id
        },

        deleteCampaign: async (id) => {
          set((state) => ({
            campaigns: state.campaigns.filter((campaign) => campaign.id !== id),
          }))

          // In a real app, you would make an API call here
          await new Promise((resolve) => setTimeout(resolve, 500))
        },

        deleteLocation: async (id) => {
          set((state) => ({
            locations: state.locations.filter((location) => location.id !== id),
          }))

          // In a real app, you would make an API call here
          await new Promise((resolve) => setTimeout(resolve, 500))
        },
      }),
      {
        name: "dashboard-storage",
        partialize: (state) => ({
          campaigns: state.campaigns,
          locations: state.locations,
        }),
      },
    ),
  ),
)
