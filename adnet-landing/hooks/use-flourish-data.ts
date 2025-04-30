"use client"

import { useMemo } from "react"
import { useRole } from "@/hooks/use-role"
import { useDashboardStore } from "@/store/dashboard-store"
import { useCampaigns, useLocations, useAnalytics } from "@/hooks/use-dashboard-data"

// Types for flourish data
export interface FlourishData {
  // Key metrics
  keyMetrics: {
    primary: {
      value: string
      label: string
      change: string
      isPositive: boolean
    }
    secondary: Array<{
      value: string
      label: string
      change: string
      isPositive: boolean
    }>
  }

  // Performance trends
  trends: {
    daily: number[]
    weekly: number[]
    monthly: number[]
    labels: string[]
  }

  // Top performing items
  topPerforming: Array<{
    id: string
    name: string
    value: string
    change: string
    isPositive: boolean
  }>

  // Distribution data
  distribution: {
    labels: string[]
    values: number[]
    colors: string[]
  }

  // Recent activity
  recentActivity: Array<{
    id: string
    title: string
    time: string
    description: string
  }>
}

export function useFlourishData() {
  const { role } = useRole()
  const { campaigns } = useCampaigns()
  const { locations } = useLocations()
  const { data: analyticsData, isLoading } = useAnalytics()
  const { dashboardStats } = useDashboardStore()

  // Generate flourish data based on role
  const flourishData = useMemo<FlourishData>(() => {
    if (role === "advertiser") {
      // Advertiser flourish data
      return {
        keyMetrics: {
          primary: {
            value: dashboardStats.advertiser.totalImpressions,
            label: "Total Impressions",
            change: dashboardStats.advertiser.roi,
            isPositive: dashboardStats.advertiser.roi.startsWith("+"),
          },
          secondary: [
            {
              value: `${campaigns.filter((c) => c.status === "Active").length}`,
              label: "Active Campaigns",
              change: "+2",
              isPositive: true,
            },
            {
              value: dashboardStats.advertiser.budgetSpent,
              label: "Budget Spent",
              change: "+12.5%",
              isPositive: true,
            },
            {
              value: analyticsData?.clickThroughRates
                ? `${analyticsData.clickThroughRates[analyticsData.clickThroughRates.length - 1]}%`
                : "3.8%",
              label: "Click-through Rate",
              change: "+0.7%",
              isPositive: true,
            },
          ],
        },
        trends: {
          daily: analyticsData?.impressionsOverTime || [0, 0, 0, 0, 0, 0, 0],
          weekly: [850000, 920000, 1050000, 1120000],
          monthly: [3200000, 4500000],
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        topPerforming: (analyticsData?.campaignPerformance || []).map((item) => ({
          id: item.id,
          name: item.name,
          value: item.impressions,
          change: item.change,
          isPositive: item.change.startsWith("+"),
        })),
        distribution: {
          labels: Object.keys(analyticsData?.audienceDemographics?.age || {}),
          values: Object.values(analyticsData?.audienceDemographics?.age || {}),
          colors: ["#0055FF", "#FFCC00", "#FF3366", "#00C853", "#9C27B0"],
        },
        recentActivity: dashboardStats.advertiser.recentActivity,
      }
    } else {
      // Provider flourish data
      return {
        keyMetrics: {
          primary: {
            value: dashboardStats.provider.monthlyEarnings,
            label: "Monthly Earnings",
            change: dashboardStats.provider.growth,
            isPositive: dashboardStats.provider.growth.startsWith("+"),
          },
          secondary: [
            {
              value: `${locations.filter((l) => l.status === "Active").length}`,
              label: "Active Displays",
              change: "+1",
              isPositive: true,
            },
            {
              value: dashboardStats.provider.totalImpressions,
              label: "Total Impressions",
              change: "+8.3%",
              isPositive: true,
            },
            {
              value: "99.2%",
              label: "Average Uptime",
              change: "+0.5%",
              isPositive: true,
            },
          ],
        },
        trends: {
          daily: analyticsData?.impressionsOverTime || [0, 0, 0, 0, 0, 0, 0],
          weekly: analyticsData?.earningsOverTime || [0, 0, 0, 0],
          monthly: [32000, 36000, 39000, 42000],
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        topPerforming: (analyticsData?.displayPerformance || []).map((item) => ({
          id: item.id,
          name: item.name,
          value: item.earnings,
          change: item.change,
          isPositive: item.change.startsWith("+"),
        })),
        distribution: {
          labels: Object.keys(analyticsData?.campaignDistribution?.type || {}),
          values: Object.values(analyticsData?.campaignDistribution?.type || {}),
          colors: ["#0055FF", "#FFCC00", "#FF3366", "#00C853"],
        },
        recentActivity: dashboardStats.provider.recentActivity,
      }
    }
  }, [role, campaigns, locations, analyticsData, dashboardStats])

  return {
    flourishData,
    isLoading,
    role,
  }
}
