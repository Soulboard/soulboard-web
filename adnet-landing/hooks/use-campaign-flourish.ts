"use client"

import { useMemo } from "react"
import { useCampaigns, useLocations } from "@/hooks/use-dashboard-data"

export interface CampaignFlourishData {
  // Campaign stats
  stats: {
    totalCampaigns: number
    activeCampaigns: number
    draftCampaigns: number
    endedCampaigns: number
    totalBudget: string
    totalSpent: string
    averageROI: string
  }

  // Campaign performance
  performance: Array<{
    id: string
    name: string
    status: string
    budget: string
    spent: string
    impressions: string
    roi: string
    startDate: string
    endDate: string
    progress: number
  }>

  // Campaign distribution
  distribution: {
    byStatus: {
      labels: string[]
      values: number[]
      colors: string[]
    }
    byBudget: {
      labels: string[]
      values: number[]
      colors: string[]
    }
  }

  // Campaign locations
  locationCoverage: {
    totalLocations: number
    coveredLocations: number
    topLocations: Array<{
      id: string
      name: string
      impressions: string
      campaigns: number
    }>
  }
}

export function useCampaignFlourish() {
  const { campaigns, getActiveCampaigns, getDraftCampaigns, getEndedCampaigns, getTotalBudget, getTotalSpent } =
    useCampaigns()
  const { locations } = useLocations()

  const flourishData = useMemo<CampaignFlourishData>(() => {
    // Calculate average ROI
    const roiValues = campaigns.filter((c) => c.roi).map((c) => Number.parseFloat(c.roi.replace(/[^0-9.-]+/g, "")))

    const averageROI =
      roiValues.length > 0 ? `+${(roiValues.reduce((sum, val) => sum + val, 0) / roiValues.length).toFixed(1)}%` : "0%"

    // Calculate campaign performance with progress
    const performance = campaigns.map((campaign) => {
      // Calculate progress percentage
      let progress = 0
      if (campaign.status === "Active" && campaign.startDate && campaign.endDate) {
        const start = new Date(campaign.startDate).getTime()
        const end = new Date(campaign.endDate).getTime()
        const now = Date.now()

        if (now >= end) {
          progress = 100
        } else if (now <= start) {
          progress = 0
        } else {
          progress = Math.round(((now - start) / (end - start)) * 100)
        }
      } else if (campaign.status === "Ended") {
        progress = 100
      }

      return {
        id: campaign.id,
        name: campaign.name,
        status: campaign.status,
        budget: campaign.budget,
        spent: campaign.spent,
        impressions: campaign.impressions,
        roi: campaign.roi || "0%",
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        progress,
      }
    })

    // Calculate campaign distribution by status
    const statusCounts = {
      Active: getActiveCampaigns().length,
      Draft: getDraftCampaigns().length,
      Ended: getEndedCampaigns().length,
      Paused: campaigns.filter((c) => c.status === "Paused").length,
    }

    // Calculate campaign distribution by budget
    const budgetRanges = {
      "Under $1K": 0,
      "$1K - $5K": 0,
      "$5K - $10K": 0,
      "Over $10K": 0,
    }

    campaigns.forEach((campaign) => {
      const budget = Number.parseFloat(campaign.budget.replace(/[^0-9.-]+/g, ""))
      if (budget < 1000) {
        budgetRanges["Under $1K"]++
      } else if (budget < 5000) {
        budgetRanges["$1K - $5K"]++
      } else if (budget < 10000) {
        budgetRanges["$5K - $10K"]++
      } else {
        budgetRanges["Over $10K"]++
      }
    })

    // Calculate location coverage
    const campaignLocationIds = new Set()
    campaigns.forEach((campaign) => {
      if (campaign.locations) {
        campaign.locations.forEach((id) => campaignLocationIds.add(id))
      }
    })

    // Get top locations by campaign count
    const locationCampaignCounts = {}
    campaigns.forEach((campaign) => {
      if (campaign.locations) {
        campaign.locations.forEach((locationId) => {
          locationCampaignCounts[locationId] = (locationCampaignCounts[locationId] || 0) + 1
        })
      }
    })

    const topLocations = locations
      .filter((location) => locationCampaignCounts[location.id])
      .sort((a, b) => (locationCampaignCounts[b.id] || 0) - (locationCampaignCounts[a.id] || 0))
      .slice(0, 5)
      .map((location) => ({
        id: location.id,
        name: location.name,
        impressions: location.impressions,
        campaigns: locationCampaignCounts[location.id] || 0,
      }))

    return {
      stats: {
        totalCampaigns: campaigns.length,
        activeCampaigns: getActiveCampaigns().length,
        draftCampaigns: getDraftCampaigns().length,
        endedCampaigns: getEndedCampaigns().length,
        totalBudget: `$${getTotalBudget().toLocaleString()}`,
        totalSpent: `$${getTotalSpent().toLocaleString()}`,
        averageROI,
      },
      performance,
      distribution: {
        byStatus: {
          labels: Object.keys(statusCounts),
          values: Object.values(statusCounts),
          colors: ["#00C853", "#FFCC00", "#9E9E9E", "#FF3366"],
        },
        byBudget: {
          labels: Object.keys(budgetRanges),
          values: Object.values(budgetRanges),
          colors: ["#0055FF", "#4285F4", "#5E97F6", "#8AB4F8"],
        },
      },
      locationCoverage: {
        totalLocations: locations.length,
        coveredLocations: campaignLocationIds.size,
        topLocations,
      },
    }
  }, [campaigns, locations, getActiveCampaigns, getDraftCampaigns, getEndedCampaigns, getTotalBudget, getTotalSpent])

  return {
    flourishData,
    isLoading: false,
  }
}
