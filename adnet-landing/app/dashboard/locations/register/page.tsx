"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageTransition } from "@/components/page-transition"
import { ArrowLeft, Camera, Upload, Check, MapPin } from "lucide-react"

export default function RegisterLocation() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    locationType: "",
    displaySize: "",
    description: "",
  })

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState([])
  const [verificationStatus, setVerificationStatus] = useState("pending") // pending, verifying, verified

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = () => {
    // Simulate image upload
    setUploadedImages([
      { id: 1, name: "location-front.jpg" },
      { id: 2, name: "location-side.jpg" },
    ])
  }

  const startVerification = () => {
    setVerificationStatus("verifying")

    // Simulate verification process
    setTimeout(() => {
      setVerificationStatus("verified")
    }, 2000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/dashboard/locations")
    }, 1500)
  }

  const nextStep = () => setStep((prev) => prev + 1)
  const prevStep = () => setStep((prev) => prev - 1)

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
          <h1 className="text-3xl font-black dark:text-white">Register New Location</h1>
          <p className="text-lg mt-2 dark:text-gray-300">Register your display location to start earning</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto">
          <ProgressStep number={1} title="Details" active={step >= 1} completed={step > 1} />
          <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700">
            <div className="h-full bg-[#FF6B97]" style={{ width: step > 1 ? "100%" : "0%" }}></div>
          </div>
          <ProgressStep number={2} title="Verification" active={step >= 2} completed={step > 2} />
          <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700">
            <div className="h-full bg-[#FF6B97]" style={{ width: step > 2 ? "100%" : "0%" }}></div>
          </div>
          <ProgressStep number={3} title="Review" active={step >= 3} completed={step > 3} />
        </div>

        {/* Form Container */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Location Details */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">Location Details</h2>

                <div>
                  <label className="block text-sm font-bold mb-2 dark:text-white">Location Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                    placeholder="Enter location name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 dark:text-white">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                    placeholder="Enter street address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 dark:text-white">City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                      placeholder="City"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 dark:text-white">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                      placeholder="State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 dark:text-white">Zip Code</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                      placeholder="Zip Code"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold mb-2 dark:text-white">Display Type</label>
                    <select
                      name="locationType"
                      value={formData.locationType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                    >
                      <option value="">Select display type</option>
                      <option value="Digital Billboard">Digital Billboard</option>
                      <option value="Interactive Display">Interactive Display</option>
                      <option value="LED Wall">LED Wall</option>
                      <option value="Projection">Projection</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold mb-2 dark:text-white">Display Size</label>
                    <select
                      name="displaySize"
                      value={formData.displaySize}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                    >
                      <option value="">Select display size</option>
                      <option value="Small (< 10 sq ft)">Small ({"<"} 10 sq ft)</option>
                      <option value="Medium (10-50 sq ft)">Medium (10-50 sq ft)</option>
                      <option value="Large (50-100 sq ft)">Large (50-100 sq ft)</option>
                      <option value="Extra Large (> 100 sq ft)">Extra Large ({">"} 100 sq ft)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold mb-2 dark:text-white">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                    placeholder="Describe your location"
                  ></textarea>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-bold mb-2 dark:text-white">Pin Location on Map</label>
                  <div className="border-[4px] border-black rounded-lg overflow-hidden h-[300px] relative">
                    {/* Map placeholder - in a real app, you would use a map library */}
                    <div className="w-full h-full bg-gray-100 dark:bg-[#252530] flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-12 h-12 mx-auto text-[#FF6B97]" />
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Interactive map would be displayed here</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                          Click to place a pin at your display location
                        </p>
                      </div>
                    </div>

                    {/* Sample pins */}
                    <div className="absolute top-1/4 left-1/3">
                      <MapPin className="w-8 h-8 text-[#FF6B97] -mt-8" />
                    </div>

                    {/* Coordinates display */}
                    <div className="absolute bottom-2 right-2 bg-white dark:bg-[#1e1e28] px-3 py-1 rounded-lg border-2 border-black text-sm font-mono">
                      <span className="dark:text-white">40.7580° N, 73.9855° W</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 mr-1 text-green-500" />
                    <span>Location coordinates will be used for IoT device verification</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-6 py-3 bg-[#FF6B97] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Verification */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">Location Verification</h2>

                <div className="bg-gray-50 dark:bg-[#252530] p-6 rounded-xl border-[4px] border-black">
                  <h3 className="font-bold text-lg mb-4 dark:text-white">Upload Photos</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Please upload clear photos of your display location from different angles.
                  </p>

                  {uploadedImages.length === 0 ? (
                    <div
                      onClick={handleImageUpload}
                      className="border-4 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-[#FF6B97] dark:hover:border-[#FF6B97]"
                    >
                      <Upload className="w-12 h-12 mx-auto text-gray-400" />
                      <p className="mt-2 text-gray-500 dark:text-gray-400">Click to upload photos</p>
                      <p className="text-sm text-gray-400 dark:text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {uploadedImages.map((image) => (
                        <div
                          key={image.id}
                          className="flex items-center justify-between p-3 bg-white dark:bg-[#1e1e28] rounded-lg border-2 border-gray-200 dark:border-gray-700"
                        >
                          <div className="flex items-center">
                            <Camera className="w-5 h-5 mr-3 text-[#FF6B97]" />
                            <span className="dark:text-white">{image.name}</span>
                          </div>
                          <button type="button" className="text-red-500 hover:text-red-700">
                            Remove
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={handleImageUpload}
                        className="px-4 py-2 bg-white dark:bg-[#252530] text-[#FF6B97] font-medium rounded-lg border-2 border-[#FF6B97] hover:bg-[#FF6B97] hover:text-white transition-colors"
                      >
                        Upload More
                      </button>
                    </div>
                  )}
                </div>

                <div className="bg-gray-50 dark:bg-[#252530] p-6 rounded-xl border-[4px] border-black">
                  <h3 className="font-bold text-lg mb-4 dark:text-white">IoT Device Verification</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Connect your IoT device to verify your display location.
                  </p>

                  {verificationStatus === "pending" && (
                    <button
                      type="button"
                      onClick={startVerification}
                      className="px-6 py-3 bg-[#0055FF] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
                    >
                      Start Verification
                    </button>
                  )}

                  {verificationStatus === "verifying" && (
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0055FF]"></div>
                      <span className="font-medium dark:text-white">Verifying device...</span>
                    </div>
                  )}

                  {verificationStatus === "verified" && (
                    <div className="flex items-center space-x-3 text-green-600 dark:text-green-400">
                      <Check className="w-6 h-6" />
                      <span className="font-medium">Device verified successfully!</span>
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
                    type="button"
                    onClick={nextStep}
                    disabled={verificationStatus !== "verified"}
                    className="px-6 py-3 bg-[#FF6B97] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next Step
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold dark:text-white">Review Location</h2>

                <div className="bg-gray-50 dark:bg-[#252530] p-6 rounded-xl border-[4px] border-black">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">Location Name</h3>
                      <p className="font-bold dark:text-white">{formData.name || "Not specified"}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">Display Type</h3>
                      <p className="font-bold dark:text-white">{formData.locationType || "Not specified"}</p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">Address</h3>
                      <p className="font-bold dark:text-white">
                        {formData.address}, {formData.city}, {formData.state} {formData.zipCode}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">Display Size</h3>
                      <p className="font-bold dark:text-white">{formData.displaySize || "Not specified"}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">Description</h3>
                    <p className="dark:text-white">{formData.description || "No description provided."}</p>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">Verification</h3>
                    <div className="flex items-center space-x-3 text-green-600 dark:text-green-400">
                      <Check className="w-5 h-5" />
                      <span className="font-medium">Location verified</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-400">
                  <p className="text-yellow-800 dark:text-yellow-200">
                    By registering this location, you confirm that you have the legal right to use this display for
                    advertising purposes.
                  </p>
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
                    className="px-6 py-3 bg-[#FF6B97] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Registering..." : "Register Location"}
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
        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
          completed
            ? "bg-[#FF6B97] text-white"
            : active
              ? "bg-white dark:bg-[#252530] text-black dark:text-white border-[3px] border-[#FF6B97]"
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
