"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageTransition } from "@/components/page-transition"
import { ArrowLeft, Edit, BarChart3, DollarSign, Users, Calendar, MapPin, Clock } from "lucide-react"
import { EditCampaignModal } from "@/components/edit-campaign-modal"
import { useCampaigns } from "@/hooks/use-dashboard-data"
import { useEffect } from "react"
import dynamic from "next/dynamic"

import { Campaign, Location } from "@/store/dashboard-store"
import { useThingSpeakContext } from "@/providers/thingspeak-provider"

const Map = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false });

export default function CampaignDetails({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getCampaignById, getAllCampaignLocations } = useCampaigns()
  const { viewsData, tapsData, isLoading } = useThingSpeakContext();
  const id = (params as { id: string }).id
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [locations, setLocations] = useState<Location[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)

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

  // Fetch campaign data asynchronously
  useEffect(() => {
    let isMounted = true
    getCampaignById(id).then((data) => {
      if (isMounted && data) setCampaign(data)
    }).catch((error) => {
      console.error('Error fetching campaign:', error)
    })

    getAllCampaignLocations(id).then((locations) => {
      if (isMounted) {
        setLocations(locations)
      }
    }).catch((error) => {
      console.error('Error fetching campaign locations:', error)
    })
    return () => {
      isMounted = false
    }
  }, [id, getCampaignById, getAllCampaignLocations])

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
                <h1 className="text-3xl font-black dark:text-white">{campaign?.name}</h1>

              </div>
              <p className="text-lg mt-2 dark:text-gray-300">{campaign?.description}</p>
            </div>

            {campaign && (
              <button
                onClick={() => router.push(`/dashboard/campaigns/book-locations?campaignId=${campaign.id}`)}
                className="inline-flex items-center px-6 py-3 bg-[#FFCC00] text-black font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Book Locations
              </button>
            )}

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
          <StatCard title="Budget" value={`${campaign?.budgetSOL || 0} SOL`} icon={<DollarSign className="w-6 h-6" />} color="#0055FF" />
          <StatCard title="Spent" value={`${campaign?.spentSOL || 0} SOL`} icon={<DollarSign className="w-6 h-6" />} color="#FF6B97" />
          <StatCard title="Locations" value={locations.length} icon={<MapPin className="w-6 h-6" />} color="#FFCC00" />
          <StatCard title="Impressions" value={totalViews} icon={<Users className="w-6 h-6" />} color="#00C853" />
        </div>

        {/* Performance Chart */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Performance Map</h2>
          <div className="relative h-[400px] w-full rounded-lg overflow-hidden z-0">
            <Map
              center={
                locations.length > 0
                  ? [locations[0].latitude, locations[0].longitude]
                  : [20.5937, 78.9629] // fallback to center of India
              }
              zoom={5}
              scrollWheelZoom={true}
              className="h-full w-full z-0"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
              />
              {locations.map((location) => (
                <Marker
                  key={location.id}
                  position={[location.latitude, location.longitude]}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{location.name}</h3>
                      <p>Impressions: {latestViews}</p>
                      <p>Engagement: {latestTaps}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </Map>
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
                <h3 className="font-bold dark:text-white">{"Students"}</h3>
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

                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="bg-[#FF6B97] p-2 rounded-lg">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold dark:text-white">End Date</h3>

                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Display Locations */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
          <h2 className="text-2xl font-bold mb-6 dark:text-white">Display Locations ({locations.length})</h2>
          {locations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="p-4 border-[3px] border-black rounded-lg hover:bg-gray-50 dark:hover:bg-[#252530]"
                >
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#0055FF] mt-1" />
                    <div className="flex-1">
                      <h3 className="font-bold dark:text-white">{location.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{location.city}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{location.description}</p>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Impressions</p>
                          <p className="font-bold dark:text-white">{latestViews || '0'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">Engagement</p>
                          <p className="font-bold dark:text-white">{latestTaps || '0'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-bold text-gray-500 dark:text-gray-400 mb-2">No Locations Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">This campaign is not running at any locations currently.</p>
              {campaign && (
                <button
                  onClick={() => router.push(`/dashboard/campaigns/book-locations?campaignId=${campaign.id}`)}
                  className="inline-flex items-center px-4 py-2 bg-[#FFCC00] text-black font-bold rounded-lg border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Book Locations
                </button>
              )}
            </div>
          )}
        </div>

        {/* Edit Campaign Modal */}
        {campaign && (
          <EditCampaignModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            campaign={campaign}
            onSave={handleSaveCampaign}
          />
        )}
      </PageTransition>
    </DashboardLayout>
  )
}

interface StatCardProps {
  title: string
  value: number | string
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
