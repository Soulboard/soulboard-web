"use client"

import { useEffect } from "react"
import { useRole } from "@/hooks/use-role"
import { useFlourishData } from "@/hooks/use-flourish-data"
import { useCampaignFlourish } from "@/hooks/use-campaign-flourish"
import { useLocationFlourish } from "@/hooks/use-location-flourish"

export function DashboardOverview() {
  const { role } = useRole()
  const { flourishData, isLoading } = useFlourishData()
  const { flourishData: campaignFlourish } = useCampaignFlourish()
  const { flourishData: locationFlourish } = useLocationFlourish()

  useEffect(() => {
    // This effect demonstrates that the hooks are working
    console.log("Role:", role)
    console.log("Dashboard Flourish Data:", flourishData)
    console.log("Campaign Flourish Data:", campaignFlourish)
    console.log("Location Flourish Data:", locationFlourish)
  }, [role, flourishData, campaignFlourish, locationFlourish])

  if (isLoading) {
    return <div>Loading dashboard data...</div>
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{role === "advertiser" ? "Advertiser Dashboard" : "Provider Dashboard"}</h2>

      {/* Primary Metric */}
      <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium dark:text-gray-300">{flourishData.keyMetrics.primary.label}</p>
            <p className="text-3xl font-bold mt-2 dark:text-white">{flourishData.keyMetrics.primary.value}</p>
          </div>
          <div className={`p-3 rounded-lg ${role === "advertiser" ? "bg-[#0055FF]" : "bg-[#FF6B97]"}`}>
            <span className="text-white font-bold">{flourishData.keyMetrics.primary.change}</span>
          </div>
        </div>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {flourishData.keyMetrics.secondary.map((metric, index) => (
          <div
            key={index}
            className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium dark:text-gray-300">{metric.label}</p>
                <p className="text-3xl font-bold mt-2 dark:text-white">{metric.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${metric.isPositive ? "bg-[#00C853]" : "bg-[#FF3366]"}`}>
                <span className="text-white font-bold">{metric.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Role-specific stats */}
      <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-bold mb-4 dark:text-white">
          {role === "advertiser" ? "Campaign Stats" : "Location Stats"}
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {role === "advertiser" ? (
            <>
              <StatItem label="Total Campaigns" value={campaignFlourish.stats.totalCampaigns.toString()} />
              <StatItem label="Active Campaigns" value={campaignFlourish.stats.activeCampaigns.toString()} />
              <StatItem label="Total Budget" value={campaignFlourish.stats.totalBudget} />
              <StatItem label="Average ROI" value={campaignFlourish.stats.averageROI} />
            </>
          ) : (
            <>
              <StatItem label="Total Locations" value={locationFlourish.stats.totalLocations.toString()} />
              <StatItem label="Active Locations" value={locationFlourish.stats.activeLocations.toString()} />
              <StatItem label="Total Earnings" value={locationFlourish.stats.totalEarnings} />
              <StatItem label="Average Uptime" value={locationFlourish.stats.averageUptime} />
            </>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="text-xl font-bold mb-4 dark:text-white">Recent Activity</h3>

        <div className="space-y-4">
          {flourishData.recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start space-x-4 border-b border-gray-200 dark:border-gray-700 pb-4"
            >
              <div className="bg-[#f0f0f0] dark:bg-[#252530] p-2 rounded-lg">
                <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold dark:text-white">{activity.title}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-1">{activity.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-50 dark:bg-[#252530] p-4 rounded-lg">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-xl font-bold dark:text-white">{value}</p>
    </div>
  )
}
