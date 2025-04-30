"use client"

import { useMemo } from "react"
import { useLocations } from "@/hooks/use-dashboard-data"

export interface LocationFlourishData {
  // Location stats
  stats: {
    totalLocations: number
    activeLocations: number
    maintenanceLocations: number
    inactiveLocations: number
    totalImpressions: string
    totalEarnings: string
    averageUptime: string
  }

  // Location performance
  performance: Array<{
    id: string
    name: string
    status: string
    type: string
    impressions: string
    earnings: string
    uptime: string
    campaigns: number
  }>

  // Location distribution
  distribution: {
    byType: {
      labels: string[]
      values: number[]
      colors: string[]
    }
    byStatus: {
      labels: string[]
      values: number[]
      colors: string[]
    }
  }

  // Geographic distribution
  geographicDistribution: {
    regions: Array<{
      name: string
      count: number
      percentage: number
    }>
  }
}

export function useLocationFlourish() {
  const {
    locations,
    getActiveLocations,
    getMaintenanceLocations,
    getInactiveLocations,
    getLocationsByType,
    getTotalImpressions,
    getTotalEarnings,
  } = useLocations()

  const flourishData = useMemo<LocationFlourishData>(() => {
    // Calculate average uptime
    const uptimeValues = locations
      .filter((l) => l.uptime)
      .map((l) => Number.parseFloat(l.uptime.replace(/[^0-9.-]+/g, "")))

    const averageUptime =
      uptimeValues.length > 0
        ? `${(uptimeValues.reduce((sum, val) => sum + val, 0) / uptimeValues.length).toFixed(1)}%`
        : "0%"

    // Calculate location performance
    const performance = locations.map((location) => {
      return {
        id: location.id,
        name: location.name,
        status: location.status,
        type: location.type,
        impressions: location.impressions,
        earnings: location.earnings,
        uptime: location.uptime || "N/A",
        campaigns: location.campaigns?.length || 0,
      }
    })

    // Calculate location distribution by type
    const typeDistribution = {
      "Digital Billboard": getLocationsByType("Digital Billboard").length,
      "Interactive Display": getLocationsByType("Interactive Display").length,
      "LED Wall": getLocationsByType("LED Wall").length,
      Projection: getLocationsByType("Projection").length,
    }

    // Calculate location distribution by status
    const statusDistribution = {
      Active: getActiveLocations().length,
      Maintenance: getMaintenanceLocations().length,
      Inactive: getInactiveLocations().length,
    }

    // Calculate geographic distribution
    const regionCounts = {}
    locations.forEach((location) => {
      const address = location.address
      const state = address.split(",").pop()?.trim().split(" ")[0]

      if (state) {
        regionCounts[state] = (regionCounts[state] || 0) + 1
      }
    })

    const regions = Object.entries(regionCounts)
      .map(([name, count]) => ({
        name,
        count: count as number,
        percentage: Math.round(((count as number) / locations.length) * 100),
      }))
      .sort((a, b) => b.count - a.count)

    return {
      stats: {
        totalLocations: locations.length,
        activeLocations: getActiveLocations().length,
        maintenanceLocations: getMaintenanceLocations().length,
        inactiveLocations: getInactiveLocations().length,
        totalImpressions: `${(getTotalImpressions() / 1000).toFixed(0)}K/day`,
        totalEarnings: `$${getTotalEarnings().toLocaleString()}/month`,
        averageUptime,
      },
      performance,
      distribution: {
        byType: {
          labels: Object.keys(typeDistribution),
          values: Object.values(typeDistribution),
          colors: ["#0055FF", "#FFCC00", "#FF3366", "#00C853"],
        },
        byStatus: {
          labels: Object.keys(statusDistribution),
          values: Object.values(statusDistribution),
          colors: ["#00C853", "#FFCC00", "#9E9E9E"],
        },
      },
      geographicDistribution: {
        regions,
      },
    }
  }, [
    locations,
    getActiveLocations,
    getMaintenanceLocations,
    getInactiveLocations,
    getLocationsByType,
    getTotalImpressions,
    getTotalEarnings,
  ])

  return {
    flourishData,
    isLoading: false,
  }
}
