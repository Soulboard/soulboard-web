"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageTransition } from "@/components/page-transition"
import { BarChart3, TrendingUp, Calendar, Filter } from "lucide-react"

type Role = "advertiser" | "provider"

export default function Analytics() {
  const [role, setRole] = useState<Role>("advertiser")
  const [timeRange, setTimeRange] = useState("30days")

  useEffect(() => {
    // Check for saved role preference
    const savedRole = localStorage.getItem("userRole") as Role | null
    if (savedRole) {
      setRole(savedRole)
    }

    // Listen for role changes
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem("userRole") as Role | null
      if (updatedRole) {
        setRole(updatedRole)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="mb-8">
          <h1 className="text-3xl font-black dark:text-white">Analytics</h1>
          <p className="text-lg mt-2 dark:text-gray-300">
            {role === "advertiser"
              ? "Track your campaign performance and audience engagement"
              : "Monitor your display performance and earnings"}
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-4 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-gray-500" />
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 90 days</option>
                <option value="year">Last year</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select className="px-4 py-2 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white">
                {role === "advertiser" ? (
                  <>
                    <option value="all">All Campaigns</option>
                    <option value="active">Active Campaigns</option>
                    <option value="ended">Ended Campaigns</option>
                  </>
                ) : (
                  <>
                    <option value="all">All Locations</option>
                    <option value="active">Active Locations</option>
                    <option value="maintenance">Maintenance</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">
            {role === "advertiser" ? "Campaign Performance" : "Display Performance"}
          </h2>
          <div className="h-80 w-full">
            {/* Placeholder for chart - in a real app, you would use a chart library */}
            <div className="w-full h-full bg-gray-100 dark:bg-[#252530] rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {role === "advertiser"
                    ? "Campaign impressions and engagement over time"
                    : "Display impressions and earnings over time"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {role === "advertiser" ? (
            <>
              <StatCard title="Total Impressions" value="1.2M" change="+12.5%" isPositive={true} />
              <StatCard title="Click-through Rate" value="3.8%" change="+0.7%" isPositive={true} />
              <StatCard title="Cost per Impression" value="$0.004" change="-0.2%" isPositive={true} />
              <StatCard title="Engagement Rate" value="8.2%" change="+1.5%" isPositive={true} />
              <StatCard title="Conversion Rate" value="2.1%" change="-0.3%" isPositive={false} />
              <StatCard title="ROI" value="245%" change="+15%" isPositive={true} />
            </>
          ) : (
            <>
              <StatCard title="Total Impressions" value="850K" change="+8.3%" isPositive={true} />
              <StatCard title="Active Campaigns" value="12" change="+2" isPositive={true} />
              <StatCard title="Earnings per Display" value="$472.50" change="+$45.80" isPositive={true} />
              <StatCard title="Average Uptime" value="99.2%" change="+0.5%" isPositive={true} />
              <StatCard title="Engagement Score" value="8.7/10" change="+0.3" isPositive={true} />
              <StatCard title="Maintenance Costs" value="$120" change="-$35" isPositive={true} />
            </>
          )}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              {role === "advertiser" ? "Top Performing Campaigns" : "Top Performing Locations"}
            </h2>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700"
                >
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold dark:text-white">
                      {item}
                    </div>
                    <div className="ml-3">
                      <h3 className="font-bold dark:text-white">
                        {role === "advertiser" ? `Campaign ${item}: Summer Sale` : `Location ${item}: Times Square`}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {role === "advertiser" ? "120K impressions" : "$850 earnings"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-green-500">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="font-medium">+{12 + item}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              {role === "advertiser" ? "Audience Demographics" : "Campaign Distribution"}
            </h2>
            <div className="h-64 w-full">
              {/* Placeholder for chart - in a real app, you would use a chart library */}
              <div className="w-full h-full bg-gray-100 dark:bg-[#252530] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <BarChart3 className="w-12 h-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    {role === "advertiser"
                      ? "Audience age and interest distribution"
                      : "Campaign type and duration distribution"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  )
}

interface StatCardProps {
  title: string
  value: string
  change: string
  isPositive: boolean
}

function StatCard({ title, value, change, isPositive }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1e1e28] border-[4px] border-black rounded-xl p-5 transition-colors duration-300">
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="text-2xl font-bold mt-2 dark:text-white">{value}</p>
      <div className="flex items-center mt-2">
        <TrendingUp className={`w-4 h-4 mr-1 ${isPositive ? "text-green-500" : "text-red-500"}`} />
        <span className={`text-sm font-medium ${isPositive ? "text-green-500" : "text-red-500"}`}>
          {change} vs. previous period
        </span>
      </div>
    </div>
  )
}
