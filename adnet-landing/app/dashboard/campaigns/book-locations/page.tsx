"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ArrowLeft, MapPin, CheckCircle, Search, Calendar, Wallet } from "lucide-react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageTransition } from "@/components/page-transition"
import { useCampaigns, useLocations } from "@/hooks/use-dashboard-data"
import { useToast } from "@/hooks/use-toast"

export default function BookLocationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const campaignId = searchParams.get("campaignId")
  const { toast } = useToast()

  const { campaigns, getCampaignById } = useCampaigns()
  const { locations, isLoading } = useLocations()

  const [selectedCampaignId, setSelectedCampaignId] = useState(campaignId || "")
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filters, setFilters] = useState({
    type: "all",
    status: "active",
    minImpressions: 0,
  })

  // Get the selected campaign
  const selectedCampaign = selectedCampaignId ? getCampaignById(selectedCampaignId) : null

  // Filter locations based on search and filters
  const filteredLocations = locations.filter((location) => {
    // Search filter
    if (
      searchQuery &&
      !location.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !location.address.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false
    }

    // Type filter
    if (filters.type !== "all" && location.type !== filters.type) {
      return false
    }

    // Status filter
    if (filters.status === "active" && location.status !== "Active") {
      return false
    }

    // Impressions filter (parse the K/day format)
    if (location.impressions) {
      const impressionsMatch = location.impressions.match(/(\d+)K\/day/)
      if (impressionsMatch) {
        const impressions = Number.parseInt(impressionsMatch[1]) * 1000
        if (impressions < filters.minImpressions) {
          return false
        }
      }
    }

    return true
  })

  // Handle location selection
  const toggleLocationSelection = (locationId: string) => {
    if (selectedLocations.includes(locationId)) {
      setSelectedLocations(selectedLocations.filter((id) => id !== locationId))
    } else {
      setSelectedLocations([...selectedLocations, locationId])
    }
  }

  // Handle booking submission with toast notification
  const handleBookingSubmit = () => {
    if (!selectedCampaignId || selectedLocations.length === 0) {
      toast({
        title: "Booking Failed",
        description: "Please select a campaign and at least one location",
        variant: "destructive",
      })
      return
    }

    // In a real app, this would make an API call to book the locations
    console.log("Booking submitted:", {
      campaignId: selectedCampaignId,
      locations: selectedLocations,
    })

    // Show success toast
    toast({
      title: "Locations Booked Successfully!",
      description: `${selectedLocations.length} location${selectedLocations.length !== 1 ? "s" : ""} booked for ${selectedCampaign?.name}`,
      variant: "default",
      className: "bg-green-500 text-white border-black",
    })

    // Redirect to campaign details
    setTimeout(() => {
      router.push(`/dashboard/campaigns/${selectedCampaignId}`)
    }, 1500)
  }

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 dark:text-gray-300 hover:underline mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-black dark:text-white relative">
                Book Locations
                <span className="absolute -top-1 -right-4 w-2 h-2 bg-[#0055FF] rounded-full"></span>
              </h1>
              <p className="text-lg mt-2 dark:text-gray-300">Select display locations for your campaign</p>
            </div>
          </div>
        </div>

        {/* Campaign Selection */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 transition-colors duration-300 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern-light dark:bg-grid-pattern-dark"></div>
          </div>

          <h2 className="text-2xl font-bold mb-4 dark:text-white flex items-center">
            <span className="relative">
              Select Campaign
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#0055FF] opacity-30"></span>
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns
              .filter((campaign) => campaign.status === "Active" || campaign.status === "Draft")
              .map((campaign) => (
                <button
                  key={campaign.id}
                  onClick={() => setSelectedCampaignId(campaign.id)}
                  className={`p-4 border-[3px] rounded-lg text-left transition-all ${
                    selectedCampaignId === campaign.id
                      ? "border-[#0055FF] bg-blue-50 dark:bg-blue-900/20 shadow-[4px_4px_0px_0px_rgba(0,85,255,0.3)]"
                      : "border-black hover:border-[#0055FF] dark:hover:border-[#0055FF]"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold dark:text-white">{campaign.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Budget: {campaign.budget}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        campaign.status === "Active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {campaign.startDate} - {campaign.endDate}
                  </div>
                </button>
              ))}
          </div>
        </div>

        {selectedCampaignId && (
          <>
            {/* Search and Filters */}
            <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 transition-colors duration-300">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-[3px] border-black rounded-lg focus:outline-none focus:border-[#0055FF] dark:bg-[#252530] dark:text-white"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="px-4 py-3 border-[3px] border-black rounded-lg focus:outline-none focus:border-[#0055FF] dark:bg-[#252530] dark:text-white"
                  >
                    <option value="all">All Types</option>
                    <option value="Digital Billboard">Digital Billboard</option>
                    <option value="Interactive Display">Interactive Display</option>
                    <option value="LED Wall">LED Wall</option>
                    <option value="Projection">Projection</option>
                  </select>

                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="px-4 py-3 border-[3px] border-black rounded-lg focus:outline-none focus:border-[#0055FF] dark:bg-[#252530] dark:text-white"
                  >
                    <option value="active">Active Only</option>
                    <option value="all">All Statuses</option>
                  </select>

                  <select
                    value={filters.minImpressions}
                    onChange={(e) => setFilters({ ...filters, minImpressions: Number.parseInt(e.target.value) })}
                    className="px-4 py-3 border-[3px] border-black rounded-lg focus:outline-none focus:border-[#0055FF] dark:bg-[#252530] dark:text-white"
                  >
                    <option value="0">Any Impressions</option>
                    <option value="50000">50K+ daily</option>
                    <option value="75000">75K+ daily</option>
                    <option value="100000">100K+ daily</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Locations Grid */}
            <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 transition-colors duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-confetti-pattern-light dark:bg-confetti-pattern-dark"></div>
              </div>

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold dark:text-white flex items-center">
                  <span className="relative">
                    Available Locations
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#0055FF] opacity-30"></span>
                  </span>
                  <span className="ml-3 px-2 py-1 bg-gray-100 dark:bg-gray-800 text-sm rounded-md">
                    {filteredLocations.length} locations
                  </span>
                </h2>

                {selectedLocations.length > 0 && (
                  <button
                    onClick={handleBookingSubmit}
                    className="px-6 py-3 bg-[#0055FF] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform flex items-center"
                    disabled={!selectedCampaignId}
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Book {selectedLocations.length} Location{selectedLocations.length !== 1 ? "s" : ""}
                  </button>
                )}
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0055FF]"></div>
                </div>
              ) : filteredLocations.length === 0 ? (
                <div className="text-center py-20">
                  <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-bold dark:text-white">No locations found</h3>
                  <p className="text-gray-500 dark:text-gray-400">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredLocations.map((location) => (
                    <div
                      key={location.id}
                      className={`border-[4px] rounded-xl overflow-hidden transition-all ${
                        selectedLocations.includes(location.id)
                          ? "border-[#0055FF] shadow-[6px_6px_0px_0px_rgba(0,85,255,0.5)]"
                          : "border-black hover:border-gray-600 dark:hover:border-gray-400"
                      }`}
                    >
                      <div className="h-40 bg-gray-100 dark:bg-gray-800 relative">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-gray-400" />
                        </div>
                        <div className="absolute top-3 right-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                          <h3 className="font-bold text-white">{location.name}</h3>
                          <p className="text-xs text-white/80">{location.address}</p>
                        </div>
                      </div>

                      <div className="p-4 bg-white dark:bg-[#1e1e28]">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Type</p>
                            <p className="font-medium dark:text-white">{location.type}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Impressions</p>
                            <p className="font-medium dark:text-white">{location.impressions}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Slots</p>
                            <p className="font-medium dark:text-white">{location.slotCount}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Rate</p>
                            <p className="font-medium dark:text-white">{location.earnings}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleLocationSelection(location.id)}
                          className={`w-full py-2 rounded-lg font-bold transition-colors ${
                            selectedLocations.includes(location.id)
                              ? "bg-[#0055FF] text-white"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
                          }`}
                        >
                          {selectedLocations.includes(location.id) ? (
                            <span className="flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Selected
                            </span>
                          ) : (
                            "Select Location"
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Booking Summary */}
            {selectedLocations.length > 0 && (
              <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-8 transition-colors duration-300">
                <h2 className="text-2xl font-bold mb-4 dark:text-white flex items-center">
                  <span className="relative">
                    Booking Summary
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#0055FF] opacity-30"></span>
                  </span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center p-4 border-[3px] border-black rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Calendar className="w-6 h-6 mr-3 text-[#0055FF]" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Campaign</p>
                      <p className="font-bold dark:text-white">{selectedCampaign?.name}</p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 border-[3px] border-black rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <MapPin className="w-6 h-6 mr-3 text-[#0055FF]" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Locations Selected</p>
                      <p className="font-bold dark:text-white">
                        {selectedLocations.length} location{selectedLocations.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center p-4 border-[3px] border-black rounded-lg bg-gray-50 dark:bg-gray-800/50">
                    <Wallet className="w-6 h-6 mr-3 text-[#0055FF]" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Estimated Cost</p>
                      <p className="font-bold dark:text-white">
                        {(selectedLocations.length * 250).toLocaleString()} USDC
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleBookingSubmit}
                    className="px-8 py-4 bg-[#0055FF] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform flex items-center"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </PageTransition>
    </DashboardLayout>
  )
}
