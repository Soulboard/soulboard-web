"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageTransition } from "@/components/page-transition"
import { ArrowLeft, Edit, MapPin, Calendar, DollarSign, Users, BarChart3, Check, Clock } from "lucide-react"
import { EditLocationModal } from "@/components/edit-location-modal"
import { useEffect } from "react"
import { useLocations } from "@/hooks/use-dashboard-data"
import { Location } from "@/store/dashboard-store"
import { useThingSpeakContext } from "@/providers/thingspeak-provider"


// Sample location data - in a real app, you would fetch this based on the ID


export default function LocationDetails({ params }) {
  const router = useRouter()
  const { id } = React.use(params)
  const [location, setLocation] = useState<Location>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { getLocationById } = useLocations()
    const { viewsData, tapsData, isLoading } = useThingSpeakContext();
   const latestViews =
    viewsData?.feeds && viewsData.feeds.length > 0
      ? viewsData.feeds[viewsData.feeds.length - 1].field1
      : "0";

  const latestTaps =
    tapsData?.feeds && tapsData.feeds.length > 0
      ? tapsData.feeds[tapsData.feeds.length - 1].field2
      : "0";

  // Calculate total views and taps
  const totalViews =
    viewsData?.feeds?.reduce((sum, feed) => {
      return sum + (feed.field1 ? parseInt(feed.field1) : 0);
    }, 0) || 0;

  const totalTaps =
    tapsData?.feeds?.reduce((sum, feed) => {
      return sum + (feed.field2 ? parseInt(feed.field2) : 0);
    }, 0) || 0;

  // In a real app, you would fetch the location data based on the ID

  const handleSaveLocation = (updatedLocation) => {
    setLocation({
      ...location,
      ...updatedLocation,
    })
    // In a real app, you would make an API call to update the location
  }

  useEffect(() => {
      let isMounted = true
      getLocationById(id).then((data) => {
        if (isMounted) setLocation(data)
      })
  
      return () => {
        isMounted = false
      }
    }, [id, getLocationById])

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:underline mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to locations
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center">
                <h1 className="text-3xl font-black dark:text-white">{location.name}</h1>
                <span
                  className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${
                    location.status === "Active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : location.status === "Maintenance"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                  }`}
                >
                  {location.status}
                </span>
              </div>
             
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-[#FF6B97] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
            >
              <Edit className="w-5 h-5 mr-2" />
              Edit Location
            </button>
          </div>
        </div>

        {/* Location Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Daily Impressions"
            value={latestViews}
            icon={<Users className="w-6 h-6" />}
            color="#0055FF"
          />
          <StatCard
            title="Monthly Earnings"
            value={"$" + }
            icon={<DollarSign className="w-6 h-6" />}
            color="#FFCC00"
          />
          <StatCard title="Display Type" value={"Standee"} icon={<MapPin className="w-6 h-6" />} color="#FF6B97" />
          <StatCard
            title="Display Size"
            value={"10m x 5m"}
            icon={<BarChart3 className="w-6 h-6" />}
            color="#00C853"
          />
        </div>

        {/* Location Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Description */}
          <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Description</h2>
            <p className="text-gray-700 dark:text-gray-300">{location.description}</p>
          </div>

          {/* Verification Status */}
          <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Verification</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">Device ID</h3>
                  <p className="text-gray-600 dark:text-gray-300">{"1"}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                
              </div>
            </div>
          </div>
        </div>

        {/* Available Time Slots */}
        

        {/* Active Campaigns */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Active Campaigns</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-[#252530]">
                  <th className="px-6 py-3 text-left font-bold dark:text-white">Campaign</th>
                  <th className="px-6 py-3 text-left font-bold dark:text-white">Status</th>
                  <th className="px-6 py-3 text-left font-bold dark:text-white">Impressions</th>
                  <th className="px-6 py-3 text-left font-bold dark:text-white">Earnings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {location.campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-[#252530]">
                    <td className="px-6 py-4 dark:text-white font-medium">{campaign.name}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          campaign.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                      >
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 dark:text-white">{campaign.impressions}</td>
                    <td className="px-6 py-4 dark:text-white">{campaign.earnings}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Edit Location Modal */}
        <EditLocationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          location={location}
          onSave={handleSaveLocation}
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
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
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
