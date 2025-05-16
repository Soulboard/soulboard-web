"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageTransition } from "@/components/page-transition"
import { ArrowLeft, Edit, MapPin, Calendar, DollarSign, Users, BarChart3, Check, Clock } from "lucide-react"
import { EditLocationModal } from "@/components/edit-location-modal"

// Sample location data - in a real app, you would fetch this based on the ID
const locationData = {
  id: "1",
  name: "Times Square North",
  address: "1535 Broadway, New York, NY 10036",
  type: "Digital Billboard",
  size: "Large (50-100 sq ft)",
  status: "Active",
  impressions: "120K/day",
  earnings: "$1,850/month",
  registrationDate: "Jan 15, 2025",
  lastMaintenance: "Mar 10, 2025",
  description: "Premium digital billboard located at the heart of Times Square with high visibility and foot traffic.",
  campaigns: [
    { id: "c1", name: "Summer Sale Promotion", status: "Active", impressions: "45K", earnings: "$650" },
    { id: "c2", name: "New Product Launch", status: "Active", impressions: "38K", earnings: "$520" },
    { id: "c3", name: "Brand Awareness", status: "Active", impressions: "37K", earnings: "$680" },
  ],
  verification: {
    deviceId: "IOT-12345",
    lastVerified: "Apr 5, 2025",
    status: "Verified",
  },
  availableSlots: [
    { id: "slot1", day: "Weekdays", startTime: "09:00", endTime: "17:00", basePrice: "0.25" },
    { id: "slot2", day: "Weekends", startTime: "10:00", endTime: "22:00", basePrice: "0.45" },
    { id: "slot3", day: "All Days", startTime: "00:00", endTime: "06:00", basePrice: "0.15" },
  ],
}

export default function LocationDetails({ params }) {
  const router = useRouter()
  const { id } = params
  const [location, setLocation] = useState(locationData)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // In a real app, you would fetch the location data based on the ID

  const handleSaveLocation = (updatedLocation) => {
    setLocation({
      ...location,
      ...updatedLocation,
    })
    // In a real app, you would make an API call to update the location
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
              <p className="text-lg mt-2 dark:text-gray-300">{location.address}</p>
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
            value={location.impressions}
            icon={<Users className="w-6 h-6" />}
            color="#0055FF"
          />
          <StatCard
            title="Monthly Earnings"
            value={location.earnings}
            icon={<DollarSign className="w-6 h-6" />}
            color="#FFCC00"
          />
          <StatCard title="Display Type" value={location.type} icon={<MapPin className="w-6 h-6" />} color="#FF6B97" />
          <StatCard
            title="Display Size"
            value={location.size}
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
                  <p className="text-gray-600 dark:text-gray-300">{location.verification.deviceId}</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">Last Verified</h3>
                  <p className="text-gray-600 dark:text-gray-300">{location.verification.lastVerified}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Available Time Slots */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300 mb-8">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Available Time Slots</h2>

          {location.availableSlots && location.availableSlots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {location.availableSlots.map((slot) => (
                <div key={slot.id} className="bg-gray-50 dark:bg-[#252530] p-4 rounded-xl border-[4px] border-black">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg dark:text-white">{slot.day}</h3>
                    <span className="bg-[#FF6B97] text-white px-3 py-1 rounded-full text-sm">Available</span>
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <p className="text-gray-700 dark:text-gray-300">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-500 dark:text-green-400" />
                    <p className="text-green-700 dark:text-green-300 font-medium">{slot.basePrice} SOL</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No time slots have been specified for this location.</p>
          )}
        </div>

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