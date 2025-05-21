"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageTransition } from "@/components/page-transition"
import { BarChart3, TrendingUp, DollarSign, Users, Clock, MapPin } from "lucide-react"
import { useLocations } from "@/hooks/use-dashboard-data"
import { useCampaignFlourish } from "@/hooks/use-campaign-flourish"
import { useCampaigns } from "@/hooks/use-dashboard-data"
import { useFlourishData } from "@/hooks/use-location-flourish"


type Role = "advertiser" | "provider"

export default function Dashboard() {
  const [role, setRole] = useState<Role>("advertiser")
  const { locations, isLoading } = useLocations()
  const { flourishData } = useFlourishData()
  const { campaigns , getActiveCampaigns ,getTotalBudgetSOL   } = useCampaigns()
  const { flourishData : campaignData } = useCampaignFlourish()

  const activeCampaigns = getActiveCampaigns()
  const budget = getTotalBudgetSOL()

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
          <h1 className="text-3xl font-black dark:text-white">
            {role === "advertiser" ? "Advertiser Dashboard" : "Provider Dashboard"}
          </h1>
          <p className="text-lg mt-2 dark:text-gray-300">
            {role === "advertiser"
              ? "Manage your advertising campaigns and track performance"
              : "Manage your display locations and track earnings"}
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {role === "advertiser" ? (
            <>
              <StatCard title="Active Campaigns" value={ activeCampaigns.length.toString() } icon={<BarChart3 className="w-6 h-6" />} color="#0055FF" />
              <StatCard title="Total Impressions" value="812" icon={<Users className="w-6 h-6" />} color="#FFCC00" />
              <StatCard title="Budget Spent" value={budget.toString()} icon={<DollarSign className="w-6 h-6" />} color="#FF6B97" />
              <StatCard title="ROI" value="+24%" icon={<TrendingUp className="w-6 h-6" />} color="#00C853" />
            </>
          ) : (
            <>
              <StatCard title="Active Displays" value={flourishData.keyMetrics.primary.value} icon={<MapPin className="w-6 h-6" />} color="#FF6B97" />
              <StatCard title="Total Impressions" value="850K" icon={<Users className="w-6 h-6" />} color="#FFCC00" />
              <StatCard
                title="Monthly Earnings"
                value="$3,780"
                icon={<DollarSign className="w-6 h-6" />}
                color="#0055FF"
              />
              <StatCard title="Growth" value="+18%" icon={<TrendingUp className="w-6 h-6" />} color="#00C853" />
            </>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Recent Activity</h2>
          <div className="space-y-4">
            {role === "advertiser" ? (
              <>
                <ActivityItem
                  title="Campaign 'Summer Sale' is live"
                  time="2 hours ago"
                  description="Your campaign is now running on 5 displays"
                />
                <ActivityItem
                  title="Budget update"
                  time="Yesterday"
                  description="Added $1,000 to 'New Product Launch' campaign"
                />
                <ActivityItem
                  title="Campaign ended"
                  time="3 days ago"
                  description="'Spring Collection' campaign has ended"
                />
                <ActivityItem
                  title="New analytics available"
                  time="5 days ago"
                  description="Weekly performance report for all campaigns is ready"
                />
              </>
            ) : (
              <>
                <ActivityItem
                  title="New campaign assigned"
                  time="1 hour ago"
                  description="'Summer Sale' campaign assigned to 2 of your displays"
                />
                <ActivityItem
                  title="Payment received"
                  time="Yesterday"
                  description="Received $420 for April campaigns"
                />
                <ActivityItem
                  title="Display verification"
                  time="2 days ago"
                  description="'Times Square North' display verified successfully"
                />
                <ActivityItem
                  title="Maintenance scheduled"
                  time="4 days ago"
                  description="Maintenance for 'South Beach' display scheduled for next week"
                />
              </>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {role === "advertiser" ? (
              <>
                <ActionButton title="Create Campaign" href="/dashboard/campaigns/create" color="#0055FF" />
                <ActionButton title="View Campaigns" href="/dashboard/campaigns" color="#FFCC00" />
                <ActionButton title="Analytics" href="/dashboard/analytics" color="#FF6B97" />
              </>
            ) : (
              <>
                <ActionButton title="Register Location" href="/dashboard/locations/register" color="#0055FF" />
                <ActionButton title="View Locations" href="/dashboard/locations" color="#FFCC00" />
                <ActionButton title="Analytics" href="/dashboard/analytics" color="#FF6B97" />
              </>
            )}
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: string
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium dark:text-gray-300">{title}</p>
          <p className="text-3xl font-bold mt-2 dark:text-white">{value}</p>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: color }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

interface ActivityItemProps {
  title: string
  time: string
  description: string
}

function ActivityItem({ title, time, description }: ActivityItemProps) {
  return (
    <div className="flex items-start space-x-4 border-b border-gray-200 dark:border-gray-700 pb-4">
      <div className="bg-[#f0f0f0] dark:bg-[#252530] p-2 rounded-lg">
        <Clock className="w-5 h-5" />
      </div>
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-bold dark:text-white">{title}</h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">{time}</span>
        </div>
        <p className="text-gray-600 dark:text-gray-300 mt-1">{description}</p>
      </div>
    </div>
  )
}

interface ActionButtonProps {
  title: string
  href: string
  color: string
}

function ActionButton({ title, href, color }: ActionButtonProps) {
  return (
    <a
      href={href}
      className="inline-block w-full py-3 px-4 font-bold text-white text-center rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
      style={{ backgroundColor: color }}
    >
      {title}
    </a>
  )
}
