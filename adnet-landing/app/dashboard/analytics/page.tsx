"use client"

import { useState, useEffect, useMemo } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageTransition } from "@/components/page-transition"
import { BarChart3, TrendingUp, Calendar, Filter } from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts'

type Role = "advertiser" | "provider"

// Generate realistic time series data
const generateTimeSeriesData = (days: number) => {
  const data = []
  // Start from May 15, 2025 since campaign just started recently
  const baseDate = new Date('2025-05-15')

  // Limit to very recent campaign data - about 7 days since campaigns just launched
  const maxDays = Math.min(days, 7) // About 1 week of campaign data

  for (let i = 0; i < maxDays; i++) {
    const date = new Date(baseDate)
    date.setDate(date.getDate() + i)

    // Since campaign started in May during vacation period, LNMIIT has reduced impressions throughout
    // May and June are vacation months at LNMIIT
    const lnmiitBase = 25 // Consistently low during vacation period
    const diwasaBase = 180 // Diwasa stores remain consistent
    const variance = 0.15 // 15% variance

    const lnmiitDaily = Math.round(lnmiitBase * (1 + (Math.random() - 0.5) * variance))
    const diwasaDaily = Math.round(diwasaBase * (1 + (Math.random() - 0.5) * variance))

    // Calculate campaign-specific impressions
    const newSummerMenu = lnmiitDaily // This campaign runs at LNMIIT during vacation
    const newSuiteCollection = Math.round(diwasaDaily * 0.67) // 67% of Diwasa traffic
    const freshMonsoon = Math.round(diwasaDaily * 0.33) // 33% of Diwasa traffic

    data.push({
      date: date.toISOString().split('T')[0],
      dateDisplay: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      totalImpressions: lnmiitDaily + diwasaDaily,
      lnmiitImpressions: lnmiitDaily,
      diwasaImpressions: diwasaDaily,
      newSummerMenu,
      newSuiteCollection,
      freshMonsoon,
      lnmiitEarnings: parseFloat((lnmiitDaily * 0.0000128).toFixed(6)), // Proportionally reduced earnings
      diwasaEarnings: parseFloat((diwasaDaily * 0.000215).toFixed(6)), // 0.0387 SOL / 180 impressions
      totalEarnings: parseFloat(((lnmiitDaily * 0.0000128) + (diwasaDaily * 0.000215)).toFixed(6)),
    })
  }

  return data
}

// Campaign distribution data
const campaignDistribution = [
  { name: 'New suite collection', value: 540, fill: '#FF6B97' }, // ~120/day × 4.5 days avg
  { name: 'Fresh Monsoon collection', value: 270, fill: '#FFCC00' }, // ~60/day × 4.5 days avg
  { name: 'New summer menu', value: 175, fill: '#0055FF' }, // ~25/day × 7 days (vacation period)
]

// Location performance data
const locationPerformance = [
  { name: 'Diwasa stores', impressions: 810, earnings: 0.0387, fill: '#FF6B97' }, // ~180/day × 4.5 days avg
  { name: 'LNMIIT Campus', impressions: 175, earnings: 0.0008, fill: '#0055FF' }, // ~25/day × 7 days (vacation)
]

export default function Analytics() {
  const [role, setRole] = useState<Role>("advertiser")
  const [timeRange, setTimeRange] = useState("30days")
  const [campaignFilter, setCampaignFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")

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

  const chartData = useMemo(() => {
    const days = timeRange === "7days" ? 7 : timeRange === "30days" ? 30 : timeRange === "90days" ? 90 : 365
    return generateTimeSeriesData(days)
  }, [timeRange])

  const filteredData = useMemo(() => {
    return chartData.filter((_, index) => {
      if (timeRange === "7days") return true
      if (timeRange === "30days") return index % 1 === 0 // Show all data points
      if (timeRange === "90days") return index % 3 === 0 // Show every 3rd day
      return index % 7 === 0 // Show weekly for yearly data
    })
  }, [chartData, timeRange])

  const getTotalImpressions = () => {
    return chartData.reduce((sum, day) => {
      if (role === "advertiser") {
        if (campaignFilter === "newSummerMenu") return sum + day.newSummerMenu
        if (campaignFilter === "newSuiteCollection") return sum + day.newSuiteCollection
        if (campaignFilter === "freshMonsoon") return sum + day.freshMonsoon
        return sum + day.totalImpressions
      } else {
        if (locationFilter === "lnmiit") return sum + day.lnmiitImpressions
        if (locationFilter === "diwasa") return sum + day.diwasaImpressions
        return sum + day.totalImpressions
      }
    }, 0)
  }

  const getTotalEarnings = () => {
    return chartData.reduce((sum, day) => {
      if (role === "provider") {
        if (locationFilter === "lnmiit") return sum + day.lnmiitEarnings
        if (locationFilter === "diwasa") return sum + day.diwasaEarnings
        return sum + day.totalEarnings
      }
      return sum + day.totalEarnings
    }, 0)
  }

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
              <select
                value={role === "advertiser" ? campaignFilter : locationFilter}
                onChange={(e) => role === "advertiser" ? setCampaignFilter(e.target.value) : setLocationFilter(e.target.value)}
                className="px-4 py-2 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
              >
                {role === "advertiser" ? (
                  <>
                    <option value="all">All Campaigns</option>
                    <option value="newSummerMenu">New summer menu</option>
                    <option value="newSuiteCollection">New suite collection</option>
                    <option value="freshMonsoon">Fresh Monsoon collection</option>
                  </>
                ) : (
                  <>
                    <option value="all">All Locations</option>
                    <option value="lnmiit">LNMIIT Campus canteen</option>
                    <option value="diwasa">Diwasa stores Jodhpur</option>
                  </>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">
            {role === "advertiser" ? "Campaign Performance Over Time" : "Display Performance Over Time"}
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="dateDisplay"
                  className="dark:fill-gray-300"
                  fontSize={12}
                />
                <YAxis className="dark:fill-gray-300" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgb(30, 30, 40)',
                    border: '4px solid black',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Legend />

                {role === "advertiser" ? (
                  campaignFilter === "all" ? (
                    <>
                      <Line type="monotone" dataKey="newSummerMenu" stroke="#0055FF" strokeWidth={3} name="New summer menu" />
                      <Line type="monotone" dataKey="newSuiteCollection" stroke="#FF6B97" strokeWidth={3} name="New suite collection" />
                      <Line type="monotone" dataKey="freshMonsoon" stroke="#FFCC00" strokeWidth={3} name="Fresh Monsoon collection" />
                    </>
                  ) : (
                    <Line
                      type="monotone"
                      dataKey={campaignFilter}
                      stroke="#0055FF"
                      strokeWidth={3}
                      name={
                        campaignFilter === "newSummerMenu" ? "New summer menu" :
                          campaignFilter === "newSuiteCollection" ? "New suite collection" :
                            "Fresh Monsoon collection"
                      }
                    />
                  )
                ) : (
                  locationFilter === "all" ? (
                    <>
                      <Line type="monotone" dataKey="lnmiitImpressions" stroke="#0055FF" strokeWidth={3} name="LNMIIT Campus" />
                      <Line type="monotone" dataKey="diwasaImpressions" stroke="#FF6B97" strokeWidth={3} name="Diwasa stores" />
                    </>
                  ) : (
                    <Line
                      type="monotone"
                      dataKey={locationFilter === "lnmiit" ? "lnmiitImpressions" : "diwasaImpressions"}
                      stroke="#0055FF"
                      strokeWidth={3}
                      name={locationFilter === "lnmiit" ? "LNMIIT Campus" : "Diwasa stores"}
                    />
                  )
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {role === "advertiser" ? (
            <>
              <StatCard title="Total Impressions" value={getTotalImpressions().toLocaleString()} change="+12.5%" isPositive={true} />
              <StatCard title="Click-through Rate" value="2.1%" change="+0.3%" isPositive={true} />
              <StatCard title="Cost per Impression" value="0.00012 SOL" change="-0.1%" isPositive={true} />
              <StatCard title="Engagement Rate" value="5.8%" change="+1.2%" isPositive={true} />
              <StatCard title="Conversion Rate" value="1.4%" change="-0.2%" isPositive={false} />
              <StatCard title="Total Spent" value={`${getTotalEarnings().toFixed(4)} SOL`} change="+0.008 SOL" isPositive={false} />
            </>
          ) : (
            <>
              <StatCard title="Total Impressions" value={getTotalImpressions().toLocaleString()} change="+8.3%" isPositive={true} />
              <StatCard title="Active Campaigns" value="3" change="+1" isPositive={true} />
              <StatCard title="Total Earnings" value={`${getTotalEarnings().toFixed(4)} SOL`} change="+0.002 SOL" isPositive={true} />
              <StatCard title="Average Uptime" value="98.5%" change="+0.8%" isPositive={true} />
              <StatCard title="Engagement Score" value="7.2/10" change="+0.4" isPositive={true} />
              <StatCard title="Maintenance Costs" value="0.005 SOL" change="-0.001 SOL" isPositive={true} />
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
              {role === "advertiser" ? (
                <>
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold dark:text-white">
                        1
                      </div>
                      <div className="ml-3">
                        <h3 className="font-bold dark:text-white">New summer menu</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {chartData.reduce((sum, day) => sum + day.newSummerMenu, 0).toLocaleString()} impressions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="font-medium">+15%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold dark:text-white">
                        2
                      </div>
                      <div className="ml-3">
                        <h3 className="font-bold dark:text-white">New suite collection</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {chartData.reduce((sum, day) => sum + day.newSuiteCollection, 0).toLocaleString()} impressions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="font-medium">+18%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold dark:text-white">
                        3
                      </div>
                      <div className="ml-3">
                        <h3 className="font-bold dark:text-white">Fresh Monsoon collection</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {chartData.reduce((sum, day) => sum + day.freshMonsoon, 0).toLocaleString()} impressions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="font-medium">+12%</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold dark:text-white">
                        1
                      </div>
                      <div className="ml-3">
                        <h3 className="font-bold dark:text-white">Diwasa stores Jodhpur</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {chartData.reduce((sum, day) => sum + day.diwasaEarnings, 0).toFixed(4)} SOL earnings
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="font-medium">+22%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center font-bold dark:text-white">
                        2
                      </div>
                      <div className="ml-3">
                        <h3 className="font-bold dark:text-white">LNMIIT Campus canteen</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {chartData.reduce((sum, day) => sum + day.lnmiitEarnings, 0).toFixed(4)} SOL earnings
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-green-500">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      <span className="font-medium">+15%</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              {role === "advertiser" ? "Campaign Distribution" : "Location Performance"}
            </h2>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                {role === "advertiser" ? (
                  <PieChart>
                    <Pie
                      data={campaignDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {campaignDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{
                      backgroundColor: 'rgb(30, 30, 40)',
                      border: '4px solid black',
                      borderRadius: '8px',
                      color: 'white'
                    }} />
                  </PieChart>
                ) : (
                  <BarChart data={locationPerformance}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="name" className="dark:fill-gray-300" fontSize={12} />
                    <YAxis className="dark:fill-gray-300" fontSize={12} />
                    <Tooltip contentStyle={{
                      backgroundColor: 'rgb(30, 30, 40)',
                      border: '4px solid black',
                      borderRadius: '8px',
                      color: 'white'
                    }} />
                    <Bar dataKey="impressions" fill="#0055FF" name="Impressions" />
                  </BarChart>
                )}
              </ResponsiveContainer>
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
