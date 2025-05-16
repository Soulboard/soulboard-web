"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, DollarSign, FileText, MapPin, AlertCircle } from "lucide-react"

interface Location {
  id: string
  name: string
  address: string
  type: string
  status: string
  impressions: string
  earnings: string
  slotCount: number
}

interface BookingDetails {
  startDate: string
  endDate: string
  budget: string
  notes: string
}

interface BookingConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  campaignName: string
  locations: Location[]
  bookingDetails: BookingDetails
  setBookingDetails: (details: BookingDetails) => void
  onSubmit: () => void
}

export function BookingConfirmationModal({
  isOpen,
  onClose,
  campaignName,
  locations,
  bookingDetails,
  setBookingDetails,
  onSubmit,
}: BookingConfirmationModalProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Calculate total estimated cost
  const calculateEstimatedCost = () => {
    if (!bookingDetails.startDate || !bookingDetails.endDate) return "N/A"

    const start = new Date(bookingDetails.startDate)
    const end = new Date(bookingDetails.endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    if (days <= 0) return "N/A"

    // Extract monthly rate from earnings (e.g., "$1,850/month")
    let totalMonthlyRate = 0
    locations.forEach((location) => {
      const match = location.earnings.match(/\$([0-9,]+)\/month/)
      if (match) {
        const rate = Number.parseInt(match[1].replace(/,/g, ""))
        totalMonthlyRate += rate
      }
    })

    // Calculate daily rate and multiply by days
    const dailyRate = totalMonthlyRate / 30
    const totalCost = dailyRate * days

    return `$${totalCost.toFixed(2)}`
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit()
    setIsSubmitting(false)
    setCurrentStep(1)
  }

  const nextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const isFormValid = () => {
    return (
      bookingDetails.startDate &&
      bookingDetails.endDate &&
      new Date(bookingDetails.startDate) < new Date(bookingDetails.endDate)
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] border-[6px] border-black rounded-xl p-0 overflow-hidden">
        <DialogHeader className="bg-[#0055FF] text-white p-6">
          <DialogTitle className="text-2xl font-black">Book Locations</DialogTitle>
        </DialogHeader>

        <div className="p-6">
          {/* Step indicator */}
          <div className="flex mb-6">
            <div
              className={`flex-1 h-2 rounded-l-full ${currentStep >= 1 ? "bg-[#0055FF]" : "bg-gray-200 dark:bg-gray-700"}`}
            ></div>
            <div
              className={`flex-1 h-2 rounded-r-full ${currentStep >= 2 ? "bg-[#0055FF]" : "bg-gray-200 dark:bg-gray-700"}`}
            ></div>
          </div>

          {/* Step 1: Booking Details */}
          {currentStep === 1 && (
            <div>
              <h3 className="text-xl font-bold mb-4 dark:text-white">Booking Details</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Configure when you want to display your campaign on the selected locations.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Campaign</label>
                  <div className="px-4 py-3 border-[3px] border-black rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white">
                    {campaignName}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="startDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Start Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        id="startDate"
                        value={bookingDetails.startDate}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, startDate: e.target.value })}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 pr-4 py-3 border-[3px] border-black rounded-lg focus:outline-none focus:border-[#0055FF] dark:bg-[#252530] dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="endDate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      End Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="date"
                        id="endDate"
                        value={bookingDetails.endDate}
                        onChange={(e) => setBookingDetails({ ...bookingDetails, endDate: e.target.value })}
                        min={bookingDetails.startDate || new Date().toISOString().split("T")[0]}
                        className="w-full pl-10 pr-4 py-3 border-[3px] border-black rounded-lg focus:outline-none focus:border-[#0055FF] dark:bg-[#252530] dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Budget (Optional)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      id="budget"
                      placeholder="Enter your budget"
                      value={bookingDetails.budget}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, budget: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border-[3px] border-black rounded-lg focus:outline-none focus:border-[#0055FF] dark:bg-[#252530] dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Notes (Optional)
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                    <textarea
                      id="notes"
                      placeholder="Any special requirements or notes"
                      value={bookingDetails.notes}
                      onChange={(e) => setBookingDetails({ ...bookingDetails, notes: e.target.value })}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border-[3px] border-black rounded-lg focus:outline-none focus:border-[#0055FF] dark:bg-[#252530] dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {!isFormValid() && (
                <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200 flex items-start">
                  <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Please check your dates</p>
                    <p className="text-sm">Make sure you've selected valid start and end dates.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Review and Confirm */}
          {currentStep === 2 && (
            <div>
              <h3 className="text-xl font-bold mb-4 dark:text-white">Review and Confirm</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Please review your booking details before confirming.
              </p>

              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-bold text-lg mb-2 dark:text-white">Campaign</h4>
                  <p className="dark:text-gray-300">{campaignName}</p>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-bold text-lg mb-2 dark:text-white">Booking Period</h4>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-[#0055FF]" />
                    <p className="dark:text-gray-300">
                      {new Date(bookingDetails.startDate).toLocaleDateString()} -{" "}
                      {new Date(bookingDetails.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-bold text-lg mb-2 dark:text-white">Selected Locations ({locations.length})</h4>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {locations.map((location) => (
                      <div key={location.id} className="flex items-start">
                        <MapPin className="w-5 h-5 mr-2 text-[#0055FF] mt-1" />
                        <div>
                          <p className="font-medium dark:text-white">{location.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{location.address}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <h4 className="font-bold text-lg mb-2 dark:text-white">Estimated Cost</h4>
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-[#0055FF]" />
                    <p className="dark:text-gray-300">{calculateEstimatedCost()}</p>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    This is an estimate based on the selected locations and duration.
                  </p>
                </div>

                {bookingDetails.notes && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <h4 className="font-bold text-lg mb-2 dark:text-white">Notes</h4>
                    <p className="dark:text-gray-300">{bookingDetails.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            {currentStep === 1 ? (
              <button
                onClick={onClose}
                className="px-6 py-3 border-[3px] border-black rounded-lg font-bold hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              >
                Cancel
              </button>
            ) : (
              <button
                onClick={prevStep}
                className="px-6 py-3 border-[3px] border-black rounded-lg font-bold hover:bg-gray-100 dark:text-white dark:hover:bg-gray-800"
              >
                Back
              </button>
            )}

            {currentStep === 1 ? (
              <button
                onClick={nextStep}
                disabled={!isFormValid()}
                className={`px-6 py-3 bg-[#0055FF] text-white font-bold rounded-lg border-[3px] border-black ${
                  isFormValid() ? "hover:-translate-y-1 transition-transform" : "opacity-50 cursor-not-allowed"
                }`}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#0055FF] text-white font-bold rounded-lg border-[3px] border-black hover:-translate-y-1 transition-transform flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
