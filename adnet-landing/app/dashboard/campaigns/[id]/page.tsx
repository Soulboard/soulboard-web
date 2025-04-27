"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageTransition } from "@/components/page-transition"
import { ArrowLeft, Edit, BarChart3, DollarSign, Users, Calendar, MapPin, Clock } from "lucide-react"
import { EditCampaignModal } from "@/components/edit-campaign-modal"

// Sample campaign data - in a real app, you would fetch this based on the ID
const campaignData = {
  id: "1",
  name: "Summer Sale Promotion",
  description: "Promote summer discounts across high-traffic urban locations to drive store visits and online sales.",
  status: "Active",
  budget: "$2,500",
  spent: "$1,245",
  impressions: "450K",
  startDate: "2025-06-01",
  endDate: "2025-08-31",
  targetAudience: "General Public",
  locations: [
    { id: "loc1", name: "New York City - Times Square", impressions: "120K", engagement: "High" },
    { id: "loc2", name: "Los Angeles - Santa Monica", impressions: "95K", engagement: "Medium" },
    { id: "loc3", name: "Chicago - Magnificent Mile", impressions: "85K", engagement: "High" },
    { id: "loc4", name: "Miami - South Beach", impressions: "150K", engagement: "Very High" },
  ],
  performance: {
    daily: [1200, 1500, 1800, 2200, 2100, 2400, 2300],
    weekly: [8500, 9200, 10500, 11200],
    monthly: [32000, 45000],
  },
}

export default function CampaignDetails({ params }) {
  const router = useRouter()
  const { id } = params
  const [campaign, setCampaign] = useState(campaignData)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // In a real app, you would fetch the campaign data based on the ID

  const handleSaveCampaign = (updatedCampaign) => {
    setCampaign({
      ...campaign,
      ...updatedCampaign,
    })
    // In a real app, you would make an API call to update the campaign
  }

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to campaigns
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-black dark:text-white">{campaign.name}</h1>
                <span
                  className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                    campaign.status === "Active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : campaign.status === "Draft"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {campaign.status}
                </span>
              </div>
              <p className="text-lg mt-2 dark:text-gray-300">{campaign.description}</p>
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-[#0055FF] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit Campaign
            </button>
          </div>
        </div>

        {/* Campaign Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Budget" value={campaign.budget} icon={<DollarSign className="w-6 h-6" />} color="#0055FF" />
          <StatCard title="Spent" value={campaign.spent} icon={<DollarSign className="w-6 h-6" />} color="#FFCC00" />
          <StatCard
            title="Impressions"
            value={campaign.impressions}
            icon={<Users className="w-6 h-6" />}
            color="#FF6B97"
          />
          <StatCard
            title="Duration"
            value={`${formatDate(campaign.startDate)} - ${formatDate(campaign.endDate)}`}
            icon={<Calendar className="w-6 h-6" />}
            color="#00C853"
            isLong
          />
        </div>

        {/* Performance Chart */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Performance</h2>
          <div className="h-64 w-full">
            {/* Placeholder for chart - in a real app, you would use a chart library */}
            <div className="w-full h-full bg-gray-100 dark:bg-[#252530] rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 mx-auto text-gray-400" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">Performance chart would be displayed here</p>
              </div>
            </div>
          </div>
        </div>

        {/* Campaign Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Target Audience */}
          <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Target Audience</h2>
            <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-[#252530] rounded-lg">
              <Users className="w-8 h-8 text-[#0055FF]" />
              <div>
                <h3 className="font-bold dark:text-white">{campaign.targetAudience}</h3>
                <p className="text-gray-600 dark:text-gray-300">Primary demographic focus</p>
              </div>
            </div>
          </div>

          {/* Campaign Timeline */}
          <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-[#0055FF] p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">Start Date</h3>
                  <p className="text-gray-600 dark:text-gray-300">{formatDate(campaign.startDate)}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-[#FF6B97] p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">End Date</h3>
                  <p className="text-gray-600 dark:text-gray-300">{formatDate(campaign.endDate)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Display Locations */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Display Locations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaign.locations.map((location) => (
              <div
                key={location.id}
                className="p-4 border-[3px] border-black rounded-lg hover:bg-gray-50 dark:hover:bg-[#252530]"
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#0055FF] mt-1" />
                  <div>
                    <h3 className="font-bold dark:text-white">{location.name}</h3>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Impressions</p>
                        <p className="font-bold dark:text-white">{location.impressions}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Engagement</p>
                        <p className="font-bold dark:text-white">{location.engagement}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Campaign Modal */}
        <EditCampaignModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          campaign={campaign}
          onSave={handleSaveCampaign}
        />
      </PageTransition>
    </DashboardLayout>
  )
}

interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: string
  isLong?: boolean
}

function StatCard({ title, value, icon, color, isLong = false }: StatCardProps) {
  return (
    <div
      className={`bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300 ${isLong ? "col-span-1 md:col-span-2 lg:col-span-1" : ""}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium dark:text-gray-300">{title}</p>
          <p className="text-xl font-bold mt-2 dark:text-white">{value}</p>
        </div>
        <div className="p-3 rounded-lg" style={{ backgroundColor: color }}>
          {icon}
        </div>
      </div>
    </div>
  )
}

// Helper function to format dates
function formatDate(dateString: string): string {
  if (!dateString) return ""

  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
  return date.toLocaleDateString("en-US", options)
}
