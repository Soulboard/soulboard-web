"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageTransition } from "@/components/page-transition"
import { ArrowLeft, Edit, MapPin, Calendar, DollarSign, Users, BarChart3, Check, Clock } from "lucide-react"
import { useDashboardStore, Location } from "@/store/dashboard-store"

interface LocationDetailsProps {
  params: { id: string }
}

export default function LocationDetails({ params }: LocationDetailsProps) {
  const router = useRouter()
  const { id } = params
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { getLocationById } = useDashboardStore()
  const [location, setLocation] = useState<Location | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLocation = async () => {
      setIsLoading(true)
      try {
        const locationData = await getLocationById(id)
        setLocation(locationData || null)
      } catch (error) {
        console.error('Error fetching location:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocation()
  }, [id, getLocationById])

  const handleSaveLocation = (updatedLocation: any) => {
    if (location) {
      setLocation({
        ...location,
        ...updatedLocation,
      })
    }
    // In a real app, you would make an API call to update the location
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <PageTransition>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B97] mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Loading location details...</p>
            </div>
          </div>
        </PageTransition>
      </DashboardLayout>
    )
  }

  if (!location) {
    return (
      <DashboardLayout>
        <PageTransition>
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 text-lg">Location not found</p>
              <button
                onClick={() => router.back()}
                className="mt-4 inline-flex items-center text-[#FF6B97] hover:underline"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to locations
              </button>
            </div>
          </div>
        </PageTransition>
      </DashboardLayout>
    )
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
                  className={`ml-4 px-3 py-1 rounded-full text-sm font-medium ${location.status === "Active"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : location.status === "Maintenance"
                      ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                    }`}
                >
                  {location.status}
                </span>
              </div>
              <p className="text-lg mt-2 dark:text-gray-300">{location.address || location.description}</p>
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
            value={location.impressions || "0/day"}
            icon={<Users className="w-6 h-6" />}
            color="#0055FF"
          />
          <StatCard
            title="Monthly Earnings"
            value={location.earnings || "0 SOL/month"}
            icon={<DollarSign className="w-6 h-6" />}
            color="#FFCC00"
          />
          <StatCard title="Display Type" value={location.type || "Unknown"} icon={<MapPin className="w-6 h-6" />} color="#FF6B97" />
          <StatCard
            title="Display Size"
            value={location.size || "Unknown"}
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
            {location.registrationDate && (
              <div className="mt-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <strong>Registered:</strong> {location.registrationDate}
                </p>
                {location.lastMaintenance && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <strong>Last Maintenance:</strong> {location.lastMaintenance}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Verification Status */}
          <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Verification</h2>
            {location.verification ? (
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
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No verification data available</p>
            )}
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
          {location.campaigns && location.campaigns.length > 0 ? (
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
                          className={`px-3 py-1 rounded-full text-sm font-medium ${campaign.status === "Active"
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
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No active campaigns are currently running at this location.</p>
          )}
        </div>

        {/* Edit Location Modal - Temporarily disabled */}
        {/* TODO: Add EditLocationModal component */}
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