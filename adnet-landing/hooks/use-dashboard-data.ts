"use client"

import { useEffect } from "react"
import { useRole } from "@/hooks/use-role"
import { useDashboardStore } from "@/store/dashboard-store"

// Hook for dashboard overview data
export function useDashboardOverview() {
  const { role } = useRole()
  const { dashboardStats, isLoading, error, fetchDashboardStats } = useDashboardStore()

  useEffect(() => {
    fetchDashboardStats()
  }, [fetchDashboardStats])

  // Return role-specific data
  return {
    stats: role === "advertiser" ? dashboardStats.advertiser : dashboardStats.provider,
    isLoading: isLoading.dashboardStats,
    error: error.dashboardStats,
    refresh: fetchDashboardStats,
  }
}

// Hook for campaigns data
export function useCampaigns() {
  const { campaigns, isLoading, error, fetchCampaigns, updateCampaign, createCampaign, deleteCampaign } =
    useDashboardStore()

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  // Helper functions for campaign data
  const getActiveCampaigns = () => campaigns.filter((c) => c.status === "Active")
  const getDraftCampaigns = () => campaigns.filter((c) => c.status === "Draft")
  const getEndedCampaigns = () => campaigns.filter((c) => c.status === "Ended")
  const getPausedCampaigns = () => campaigns.filter((c) => c.status === "Paused")

  const getCampaignById = (id: string) => campaigns.find((c) => c.id === id)

  const getTotalBudget = () => {
    return campaigns.reduce((total, campaign) => {
      const budget = Number.parseFloat(campaign.budget.replace(/[^0-9.-]+/g, ""))
      return total + (isNaN(budget) ? 0 : budget)
    }, 0)
  }

  const getTotalSpent = () => {
    return campaigns.reduce((total, campaign) => {
      const spent = Number.parseFloat(campaign.spent.replace(/[^0-9.-]+/g, ""))
      return total + (isNaN(spent) ? 0 : spent)
    }, 0)
  }

  return {
    campaigns,
    isLoading: isLoading.campaigns,
    error: error.campaigns,
    refresh: fetchCampaigns,
    getActiveCampaigns,
    getDraftCampaigns,
    getEndedCampaigns,
    getPausedCampaigns,
    getCampaignById,
    getTotalBudget,
    getTotalSpent,
    updateCampaign,
    createCampaign,
    deleteCampaign,
  }
}

// Hook for locations data
export function useLocations() {
  const { locations, isLoading, error, fetchLocations, updateLocation, createLocation, deleteLocation } =
    useDashboardStore()

  useEffect(() => {
    fetchLocations()
  }, [fetchLocations])

  // Helper functions for location data
  const getActiveLocations = () => locations.filter((l) => l.status === "Active")
  const getMaintenanceLocations = () => locations.filter((l) => l.status === "Maintenance")
  const getInactiveLocations = () => locations.filter((l) => l.status === "Inactive")

  const getLocationById = (id: string) => locations.find((l) => l.id === id)

  const getLocationsByType = (type: string) => locations.filter((l) => l.type === type)

  const getTotalImpressions = () => {
    return locations.reduce((total, location) => {
      const impressions = Number.parseInt(location.impressions.replace(/[^0-9]/g, ""))
      return total + (isNaN(impressions) ? 0 : impressions)
    }, 0)
  }

  const getTotalEarnings = () => {
    return locations.reduce((total, location) => {
      const earnings = Number.parseFloat(location.earnings.replace(/[^0-9.-]+/g, ""))
      return total + (isNaN(earnings) ? 0 : earnings)
    }, 0)
  }

  return {
    locations,
    isLoading: isLoading.locations,
    error: error.locations,
    refresh: fetchLocations,
    getActiveLocations,
    getMaintenanceLocations,
    getInactiveLocations,
    getLocationById,
    getLocationsByType,
    getTotalImpressions,
    getTotalEarnings,
    updateLocation,
    createLocation,
    deleteLocation,
  }
}

// Hook for analytics data
export function useAnalytics() {
  const { role } = useRole()
  const { analyticsData, isLoading, error, fetchAnalyticsData } = useDashboardStore()

  useEffect(() => {
    fetchAnalyticsData()
  }, [fetchAnalyticsData])

  // Return role-specific analytics data
  return {
    data: role === "advertiser" ? analyticsData.advertiser : analyticsData.provider,
    isLoading: isLoading.analyticsData,
    error: error.analyticsData,
    refresh: fetchAnalyticsData,
  }
}

// Hook for combined campaign and location data
export function useCampaignLocations() {
  const { campaigns, locations, isLoading, error, fetchCampaigns, fetchLocations } = useDashboardStore()

  useEffect(() => {
    fetchCampaigns()
    fetchLocations()
  }, [fetchCampaigns, fetchLocations])

  // Get locations for a specific campaign
  const getLocationsForCampaign = (campaignId: string) => {
    const campaign = campaigns.find((c) => c.id === campaignId)
    if (!campaign || !campaign.locations) return []

    return locations.filter((location) => campaign.locations.includes(location.id))
  }

  // Get campaigns for a specific location
  const getCampaignsForLocation = (locationId: string) => {
    const location = locations.find((l) => l.id === locationId)
    if (!location || !location.campaigns) return []

    return campaigns.filter((campaign) => location.campaigns.includes(campaign.id))
  }

  // Get campaign-location performance data
  const getCampaignLocationPerformance = () => {
    const performance = []

    for (const campaign of campaigns) {
      if (!campaign.locations) continue

      for (const locationId of campaign.locations) {
        const location = locations.find((l) => l.id === locationId)
        if (!location) continue

        performance.push({
          campaignId: campaign.id,
          campaignName: campaign.name,
          locationId: location.id,
          locationName: location.name,
          impressions: location.impressions,
          status: location.status,
        })
      }
    }

    return performance
  }

  return {
    campaigns,
    locations,
    isLoading: isLoading.campaigns || isLoading.locations,
    error: error.campaigns || error.locations,
    refresh: () => {
      fetchCampaigns()
      fetchLocations()
    },
    getLocationsForCampaign,
    getCampaignsForLocation,
    getCampaignLocationPerformance,
  }
}
