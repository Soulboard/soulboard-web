"use client"

import type React from "react"

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageTransition } from "@/components/page-transition"
import { Calendar, DollarSign, MapPin, ArrowLeft, Search, ImageIcon, Upload, Target } from "lucide-react"
import { useCampaigns, useLocations } from "@/hooks/use-dashboard-data"
import { useSolanaWallets } from "@privy-io/react-auth"
import { useSendTransaction } from "@privy-io/react-auth/solana"
import { PublicKey } from "@solana/web3.js"
import { PinataSDK } from "pinata";


export default function CreateCampaign() {
  const router = useRouter()
  const { initialise , createCampaign   } = useCampaigns() ; 
  const { getActiveLocations  } = useLocations()
  const {wallets} = useSolanaWallets()
  const { sendTransaction } = useSendTransaction()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    budget: "",
    startDate: "",
    endDate: "",
    targetAudience: "",
    locations: [],
    timeSlots: {} as Record<string, { startTime: string; endTime: string; days: string[] }[]>, // Object to store time slots for each location
    creativeType: "image",
    creativeFile: null as File | null,
    creativePreview: null as string | null,
  })

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedLocationForSlots, setSelectedLocationForSlots] = useState(null)
  const [currentSlot, setCurrentSlot] = useState<{ startTime: string; endTime: string; days: string[] }>({
    startTime: "",
    endTime: "",
    days: [],
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({
        ...prev,
        creativeFile: file,
        creativePreview: URL.createObjectURL(file),
      }))
    }
  }

  const handleLocationToggle = (locationId: string) => {
    setSelectedLocations((prev) => {
      if (prev.includes(locationId)) {
        return prev.filter((id) => id !== locationId)
      } else {
        return [...prev, locationId]
      }
    })
  }

  const handleLocationForSlotsSelect = (location) => {
    setSelectedLocationForSlots(location)
    // Initialize time slots array for this location if it doesn't exist
    if (!formData.timeSlots[location.id]) {
      setFormData((prev) => ({
        ...prev,
        timeSlots: {
          ...prev.timeSlots,
          [location.id]: [],
        },
      }))
    }
  }

  const handleSlotChange = (field, value) => {
    setCurrentSlot((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleDayToggle = (day) => {
    setCurrentSlot((prev) => {
      const days = [...prev.days]
      if (days.includes(day)) {
        return { ...prev, days: days.filter((d) => d !== day) }
      } else {
        return { ...prev, days: [...days, day] }
      }
    })
  }

  const addTimeSlot = () => {
    if (!selectedLocationForSlots || !currentSlot.startTime || !currentSlot.endTime || currentSlot.days.length === 0) {
      return // Don't add incomplete slots
    }

    setFormData((prev) => ({
      ...prev,
      timeSlots: {
        ...prev.timeSlots,
        [selectedLocationForSlots.id]: [...(prev.timeSlots[selectedLocationForSlots.id] || []), { ...currentSlot }],
      },
    }))

    // Reset current slot
    setCurrentSlot({ startTime: "", endTime: "", days: [] })
  }

  const removeTimeSlot = (locationId, index) => {
    setFormData((prev) => {
      const updatedSlots = [...prev.timeSlots[locationId]]
      updatedSlots.splice(index, 1)

      return {
        ...prev,
        timeSlots: {
          ...prev.timeSlots,
          [locationId]: updatedSlots,
        },
      }
    })
  }

  const handleSubmit =  async  (e : FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Combine form data with selected locations and time slots
    const finalFormData = {
      ...formData,
      locations: selectedLocations,
      // Filter out locations with no time slots
      timeSlots: Object.fromEntries(Object.entries(formData.timeSlots).filter(([_, slots]) => slots.length > 0)),
    }

    try { 
      await initialise( { 
        wallet : wallets[0] , 
        publicKey : new PublicKey(wallets[0].address) , 
        sendTransaction : sendTransaction
      })

      await createCampaign({ 
        name : finalFormData.name , 
        description : finalFormData.description , 
        budgetSOL : Number(finalFormData.budget) , 
        imageUrl : finalFormData.creativeFile // to be uploaded to ipfs 
      })

      
      
      router.push("/dashboard/campaigns")
    } catch(err) { 
      console.log(err) ; 
      alert(`Failed to create campaign : ${String(err)} `)
    }finally { 
      setIsSubmitting(false)
    }
 
  }

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

  // Sample locations data
  // const availableLocations = [
  //   {
  //     id: "nyc",
  //     name: "New York City - Times Square",
  //     address: "1535 Broadway, New York, NY 10036",
  //     impressions: "120K",
  //     price: "$180",
  //   },
  //   {
  //     id: "la",
  //     name: "Los Angeles - Santa Monica",
  //     address: "200 Santa Monica Pier, Santa Monica, CA 90401",
  //     impressions: "95K",
  //     price: "$150",
  //   },
  //   {
  //     id: "chicago",
  //     name: "Chicago - Magnificent Mile",
  //     address: "401 N Michigan Ave, Chicago, IL 60611",
  //     impressions: "85K",
  //     price: "$130",
  //   },
  //   {
  //     id: "miami",
  //     name: "Miami - South Beach",
  //     address: "1001 Ocean Drive, Miami Beach, FL 33139",
  //     impressions: "150K",
  //     price: "$200",
  //   },
  //   {
  //     id: "sf",
  //     name: "San Francisco - Union Square",
  //     address: "333 Post St, San Francisco, CA 94108",
  //     impressions: "75K",
  //     price: "$120",
  //   },
  //   {
  //     id: "seattle",
  //     name: "Seattle - Pike Place",
  //     address: "85 Pike St, Seattle, WA 98101",
  //     impressions: "65K",
  //     price: "$110",
  //   },
  // ]

  const availableLocations = getActiveLocations()

  // Calculate total budget based on selected locations
  const calculateTotalBudget = () => {
    return selectedLocations
      .map((id) => {
        const location = availableLocations.find((loc) => loc.id === id)
        return location ? Number.parseInt(location.price.replace("$", "")) : 0
      })
      .reduce((sum, price) => sum + price, 0)
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
          <h1 className="text-3xl font-black dark:text-white">Create New Campaign</h1>
          <p className="text-lg mt-2 dark:text-gray-300">Set up your advertising campaign in a few simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto">
          <ProgressStep number={1} title="Details" active={step >= 1} completed={step > 1} />
          <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-[#0055FF] transition-all duration-300 ease-in-out"
              style={{ width: step > 1 ? "100%" : "0%" }}
            ></div>
          </div>
         
          <ProgressStep number={2} title="Creative" active={step >= 2} completed={step > 2} />
          <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700">
            <div
              className="h-full bg-[#0055FF] transition-all duration-300 ease-in-out"
              style={{ width: step > 2 ? "100%" : "0%" }}
            ></div>
          </div>
          <ProgressStep number={3} title="Review" active={step >= 3} completed={step > 3} />
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Campaign Details */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">Campaign Details</h2>

                <div>
                  <label className="block text-sm font-bold mb-2 dark:text-white">Campaign Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                    placeholder="Enter campaign name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 dark:text-white">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                    placeholder="Describe your campaign"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 dark:text-white">Budget</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      required
                      min="1"
                      className="w-full pl-10 pr-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                      placeholder="Enter budget amount"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 dark:text-white">Start Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 dark:text-white">End Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                        className="w-full pl-10 pr-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-[#0055FF] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Targeting */}
           

            {/* Step 3: Creative */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">Campaign Creative</h2>

                <div>
                  <label className="block text-sm font-bold mb-2 dark:text-white">Creative Type</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <CreativeTypeButton
                      type="image"
                      label="Image"
                      icon={<ImageIcon className="w-5 h-5" />}
                      selected={formData.creativeType === "image"}
                      onClick={() => setFormData((prev) => ({ ...prev, creativeType: "image" }))}
                    />
                    <CreativeTypeButton
                      type="video"
                      label="Video"
                      icon={<Upload className="w-5 h-5" />}
                      selected={formData.creativeType === "video"}
                      onClick={() => setFormData((prev) => ({ ...prev, creativeType: "video" }))}
                    />
                    <CreativeTypeButton
                      type="html"
                      label="HTML"
                      icon={<div className="text-lg font-bold">&lt;/&gt;</div>}
                      selected={formData.creativeType === "html"}
                      onClick={() => setFormData((prev) => ({ ...prev, creativeType: "html" }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 dark:text-white">Upload Creative</label>
                  <div
                    className={`border-4 border-dashed ${
                      formData.creativePreview ? "border-[#0055FF]" : "border-gray-300 dark:border-gray-600"
                    } rounded-lg p-8 text-center cursor-pointer hover:border-[#0055FF] dark:hover:border-[#0055FF] transition-colors`}
                    onClick={() => document.getElementById("creative-upload").click()}
                  >
                    {formData.creativePreview ? (
                      <div className="flex flex-col items-center">
                        <img
                          src={formData.creativePreview || "/placeholder.svg"}
                          alt="Creative preview"
                          className="max-h-64 max-w-full object-contain mb-4"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formData.creativeFile?.name} ({Math.round(formData.creativeFile?.size / 1024)} KB)
                        </p>
                        <button
                          type="button"
                          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation()
                            setFormData((prev) => ({ ...prev, creativeFile: null, creativePreview: null }))
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mx-auto text-gray-400" />
                        <p className="mt-2 text-gray-500 dark:text-gray-400">
                          Click to upload your {formData.creativeType} file
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          {formData.creativeType === "image"
                            ? "PNG, JPG, GIF up to 5MB"
                            : formData.creativeType === "video"
                              ? "MP4, WebM up to 50MB"
                              : "HTML, CSS, JS files"}
                        </p>
                      </>
                    )}
                    <input
                      id="creative-upload"
                      type="file"
                      accept={
                        formData.creativeType === "image"
                          ? "image/*"
                          : formData.creativeType === "video"
                            ? "video/*"
                            : ".html,.css,.js"
                      }
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-white dark:bg-[#252530] text-black dark:text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-[#0055FF] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">Review Campaign</h2>

                <div className="bg-gray-50 dark:bg-[#252530] p-6 rounded-xl border-[4px] border-black">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">Campaign Name</h3>
                      <p className="font-bold dark:text-white">{formData.name || "Not specified"}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">Budget</h3>
                      <p className="font-bold dark:text-white">${formData.budget || "0"}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">Duration</h3>
                      <p className="font-bold dark:text-white">
                        {formData.startDate && formData.endDate
                          ? `${formatDate(formData.startDate)} to ${formatDate(formData.endDate)}`
                          : "Not specified"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">Target Audience</h3>
                      <p className="font-bold dark:text-white">{formData.targetAudience || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">Description</h3>
                    <p className="dark:text-white">{formData.description || "No description provided."}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">Selected Locations</h3>
                    {selectedLocations.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                        {selectedLocations.map((id) => {
                          const location = availableLocations.find((loc) => loc.id === id)
                          return (
                            <div
                              key={id}
                              className="flex items-center p-2 bg-white dark:bg-[#1e1e28] rounded-lg border border-gray-200 dark:border-gray-700"
                            >
                              <MapPin className="w-4 h-4 text-[#0055FF] mr-2" />
                              <span className="text-sm dark:text-white">{location?.name}</span>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No locations selected</p>
                    )}
                  </div>

                  

                  {formData.creativePreview && (
                    <div className="mt-6">
                      <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">Creative Preview</h3>
                      <div className="mt-2 p-4 bg-white dark:bg-[#1e1e28] rounded-lg border border-gray-200 dark:border-gray-700 flex justify-center">
                        <img
                          src={formData.creativePreview || "/placeholder.svg"}
                          alt="Creative preview"
                          className="max-h-48 object-contain"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-6 py-3 bg-white dark:bg-[#252530] text-black dark:text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
                  >
                    Previous
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-[#0055FF] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Creating..." : "Create Campaign"}
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </PageTransition>
    </DashboardLayout>
  )
}

interface ProgressStepProps {
  number: number
  title: string
  active: boolean
  completed: boolean
}

function ProgressStep({ number, title, active, completed }: ProgressStepProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
          completed
            ? "bg-[#0055FF] text-white"
            : active
              ? "bg-white dark:bg-[#252530] text-black dark:text-white border-[3px] border-[#0055FF]"
              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
        }`}
      >
        {number}
      </div>
      <span
        className={`mt-2 text-sm font-medium ${
          active || completed ? "text-black dark:text-white" : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {title}
      </span>
    </div>
  )
}

interface LocationCheckboxProps {
  id: string
  name: string
  address: string
  impressions: string
  price: string
  isSelected: boolean
  onToggle: () => void
}

function LocationCheckbox({ id, name, address, impressions, price, isSelected, onToggle }: LocationCheckboxProps) {
  return (
    <label
      className={`flex items-start p-4 border-[3px] rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "bg-blue-50 dark:bg-blue-900/20 border-[#0055FF]"
          : "border-black hover:bg-gray-50 dark:hover:bg-[#252530]"
      }`}
      onClick={onToggle}
    >
      <input
        type="checkbox"
        id={id}
        className="w-5 h-5 accent-[#0055FF] mt-1 mr-3"
        checked={isSelected}
        onChange={() => {}}
      />
      <div className="flex-1">
        <div className="flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-[#0055FF]" />
          <span className="font-bold dark:text-white">{name}</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{address}</p>
        <div className="flex justify-between mt-2 text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            <strong className="text-black dark:text-white">{impressions}</strong> daily impressions
          </span>
          <span className="font-medium text-[#0055FF]">{price}/day</span>
        </div>
      </div>
    </label>
  )
}

interface CreativeTypeButtonProps {
  type: string
  label: string
  icon: React.ReactNode
  selected: boolean
  onClick: () => void
}

function CreativeTypeButton({ type, label, icon, selected, onClick }: CreativeTypeButtonProps) {
  return (
    <button
      type="button"
      className={`flex flex-col items-center justify-center p-4 border-[3px] rounded-lg transition-all ${
        selected
          ? "bg-blue-50 dark:bg-blue-900/20 border-[#0055FF]"
          : "border-black hover:bg-gray-50 dark:hover:bg-[#252530]"
      }`}
      onClick={onClick}
    >
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
          selected ? "bg-[#0055FF] text-white" : "bg-gray-100 dark:bg-[#252530] text-gray-500 dark:text-gray-400"
        }`}
      >
        {icon}
      </div>
      <span className={`font-bold ${selected ? "text-[#0055FF]" : "dark:text-white"}`}>{label}</span>
    </button>
  )
}

// Helper function to format dates
function formatDate(dateString: string): string {
  if (!dateString) return ""

  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }
  return date.toLocaleDateString("en-US", options)
}
