/* -------------------------------------------------------------------------- */
/*  app/(dashboard)/locations/register/page.tsx                               */
/* -------------------------------------------------------------------------- */
"use client"

import { useState, ChangeEvent, FormEvent } from "react"

import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, Upload, Check, MapPin, DollarSign } from "lucide-react"
import BN from "bn.js"
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"

import { DashboardLayout } from "@/components/dashboard-layout"
import { PageTransition } from "@/components/page-transition"
import { TimeSlotInput } from "@/lib/SoulBoardClient"
import { useLocations } from "@/hooks/use-dashboard-data"

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const DAY_INDEX: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
}

/** get the next occurrence (future) of the given DOW */
function nextWeekday(base: Date, target: number) {
  const d = new Date(base)
  const diff = (7 + target - d.getDay()) % 7 || 7      // ensure non-zero
  d.setDate(d.getDate() + diff)
  return d
}

type UiSlot = {
  id: string
  day: string
  startTime: string
  endTime: string
  basePrice: string
}

/** Expand “Weekdays”, “Weekends”, etc. into individual days */
function expandSlot({ day, startTime, basePrice }: UiSlot): TimeSlotInput[] {
  const targets =
    day === "Weekdays"
      ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
      : day === "Weekends"
        ? ["Saturday", "Sunday"]
        : day === "All Days"
          ? ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
          : [day]

  return targets.map((d) => {
    const [h, m] = startTime.split(":").map(Number)
    const date = nextWeekday(new Date(), DAY_INDEX[d])
    date.setHours(h, m, 0, 0)

    return {
      slotId: new BN(Math.floor(date.getTime() / 1000)),                     // seconds
      price: new BN(Number(basePrice) * LAMPORTS_PER_SOL),                  // lamports
      status: { available: {} },
    }
  })
  
}

type FormDataState = {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  locationType: string
  displaySize: string
  description: string
  availableSlots: UiSlot[]
}

interface StepOneProps {
  formData: FormDataState
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
  currentSlot: UiSlot
  handleSlotChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  addSlot: () => void
  removeSlot: (id: string) => void
  nextStep: () => void
}
/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export default function RegisterLocation() {
  const router = useRouter()
  const {registerLocation} = useLocations()

  /* ----------------------------- form state ------------------------------ */

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    locationType: "",
    displaySize: "",
    description: "",
    availableSlots: [] as UiSlot[],
  })

  const [currentSlot, setCurrentSlot] = useState<UiSlot>({
    id: "",
    day: "",
    startTime: "",
    endTime: "",
    basePrice: "",
  })

  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<{ id: number; name: string }[]>([])
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verifying" | "verified">("pending")

  /* ------------------------------ handlers ------------------------------- */

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSlotChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setCurrentSlot((prev) => ({ ...prev, [name]: value }))
  }

  const addSlot = () => {
    const { day, startTime, endTime, basePrice } = currentSlot
    if (!day || !startTime || !endTime || !basePrice) return
    setFormData((prev) => ({
      ...prev,
      availableSlots: [...prev.availableSlots, { ...currentSlot, id: Date.now().toString() }],
    }))
    setCurrentSlot({ id: "", day: "", startTime: "", endTime: "", basePrice: "" })
  }

  const removeSlot = (slotId: string) => {
    setFormData((prev) => ({
      ...prev,
      availableSlots: prev.availableSlots.filter((s) => s.id !== slotId),
    }))
  }

  const handleImageUpload = () => {
    setUploadedImages([
      { id: 1, name: "location-front.jpg" },
      { id: 2, name: "location-side.jpg" },
    ])
  }

  const startVerification = () => {
    setVerificationStatus("verifying")
    setTimeout(() => setVerificationStatus("verified"), 2000)
  }

  /* ----------------------------- submission ----------------------------- */

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      /* transform UI → on-chain TimeSlotInput[] */
      const slotInputs: TimeSlotInput[] = formData.availableSlots.flatMap(expandSlot)

      /* call SDK */
      await registerLocation({
        idx: Date.now(),                                // just a unique client-side idx
        name: formData.name,
        description: formData.description,
        slots: slotInputs,
      })

      router.push("/dashboard/locations")
    } catch (err) {
      console.error(err)
      alert(`Failed to register: ${String(err)}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  /* ----------------------------- navigation ----------------------------- */

  const nextStep = () => setStep((s) => s + 1)
  const prevStep = () => setStep((s) => s - 1)

  /* ---------------------------------------------------------------------- */
  /*  Render                                                                */
  /* ---------------------------------------------------------------------- */

  return (
    <DashboardLayout>
      <PageTransition>
        {/* ---------- header ---------- */}
        <div className="mb-8">
          <button onClick={() => router.back()} className="flex items-center text-gray-600 dark:text-gray-300 hover:underline mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to locations
          </button>
          <h1 className="text-3xl font-black dark:text-white">Register New Location</h1>
          <p className="text-lg mt-2 dark:text-gray-300">Register your display location to start earning</p>
        </div>

        {/* ---------- progress bar ---------- */}
        <ProgressBar step={step} />

        {/* ---------- form card ---------- */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <StepOne
                formData={formData}
                handleChange={handleChange}
                currentSlot={currentSlot}
                handleSlotChange={handleSlotChange}
                addSlot={addSlot}
                removeSlot={removeSlot}
                nextStep={nextStep}
              />
            )}

            {step === 2 && (
              <StepTwo
                uploadedImages={uploadedImages}
                handleImageUpload={handleImageUpload}
                verificationStatus={verificationStatus}
                startVerification={startVerification}
                prevStep={prevStep}
                nextStep={nextStep}
              />
            )}

            {step === 3 && (
              <StepThree
                formData={formData}
                prevStep={prevStep}
                isSubmitting={isSubmitting}
              />
            )}
          </form>
        </div>
      </PageTransition>
    </DashboardLayout>
  )
}

/* -------------------------------------------------------------------------- */
/*  (Tiny) Presentational Sub-components                                      */
/* -------------------------------------------------------------------------- */

/* … ProgressBar, StepOne, StepTwo, StepThree and the small reusable parts …  */
/* (they are identical to the ones you already posted, only imports change)   */
/* For brevity they’re omitted – just keep your existing JSX for each step.   */
/* -------------------------------------------------------------------------- */

interface ProgressStepProps {
  number: number
  title: string
  active: boolean
  completed: boolean
}

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-between mb-8 max-w-3xl mx-auto">
      <ProgressStep number={1} title="Details" active={step >= 1} completed={step > 1} />
      <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700">
        <div className="h-full bg-[#FF6B97]" style={{ width: step > 1 ? "100%" : "0%" }} />
      </div>
      <ProgressStep number={2} title="Verification" active={step >= 2} completed={step > 2} />
      <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700">
        <div className="h-full bg-[#FF6B97]" style={{ width: step > 2 ? "100%" : "0%" }} />
      </div>
      <ProgressStep number={3} title="Review" active={step >= 3} completed={step > 3} />
    </div>
  )
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

/* -------------------------------------------------------------------------- */
/*  NOTE                                                                      */
/* -------------------------------------------------------------------------- */
/*  ⬧  The sub-components StepOne / StepTwo / StepThree are unchanged         */
/*     compared with your earlier code – only the submit handler              */
/*     (handleSubmit) and slot logic are new.                                 */
/*  ⬧  If you want the full JSX for those steps again, copy the blocks you    */
/*     already had; no other edits are required.                              */
/* -------------------------------------------------------------------------- */
export function StepOne({
  formData,
  handleChange,
  currentSlot,
  handleSlotChange,
  addSlot,
  removeSlot,
  nextStep,
}: StepOneProps) {
  return (
    <div className="space-y-6">
      {/* ---------- heading ---------- */}
      <h2 className="text-2xl font-bold dark:text-white">Location Details</h2>

      {/* ---------- basic inputs ---------- */}
      {/* Name */}
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

      {/* Address */}
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

      {/* City / State / ZIP */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["city", "state", "zipCode"].map((field) => (
          <div key={field}>
            <label className="block text-sm font-bold mb-2 capitalize dark:text-white">
              {field === "zipCode" ? "Zip Code" : field}
            </label>
            <input
              type="text"
              name={field}
              value={(formData as any)[field]}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
              placeholder={field === "zipCode" ? "Zip Code" : field}
            />
          </div>
        ))}
      </div>

      {/* Display type / size */}
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

      {/* Description */}
      <div>
        <label className="block text-sm font-bold mb-2 dark:text-white">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
          placeholder="Describe your location"
        />
      </div>

      {/* ---------- Time-slot section ---------- */}
      <TimeSlotSection
        currentSlot={currentSlot}
        handleSlotChange={handleSlotChange}
        addSlot={addSlot}
        formData={formData}
        removeSlot={removeSlot}
      />

      {/* ---------- Map placeholder ---------- */}
      <MapPlaceholder />

      {/* ---------- nav ---------- */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={nextStep}
          className="px-6 py-3 bg-[#FF6B97] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
        >
          Next Step
        </button>
      </div>
    </div>
  )
}


function TimeSlotSection({
  currentSlot,
  handleSlotChange,
  addSlot,
  formData,
  removeSlot,
}: {
  currentSlot: UiSlot
  handleSlotChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void
  addSlot: () => void
  formData: FormDataState
  removeSlot: (id: string) => void
}) {
  return (
    <div>
      <h3 className="text-lg font-bold mb-4 dark:text-white">Available Time Slots</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        Add the days, times, and base prices your display is available for advertisers.
      </p>

      {/* input row */}
      <div className="bg-gray-50 dark:bg-[#252530] p-6 rounded-xl border-[4px] border-black mb-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {/* Day */}
          <div>
            <label className="block text-sm font-bold mb-2 dark:text-white">Day</label>
            <select
              name="day"
              value={currentSlot.day}
              onChange={handleSlotChange}
              className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
            >
              <option value="">Select day</option>
              {["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday","Weekdays","Weekends","All Days"]
                .map((d)=>(
                  <option key={d} value={d}>{d}</option>
                ))}
            </select>
          </div>

          {/* Start */}
          <div>
            <label className="block text-sm font-bold mb-2 dark:text-white">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={currentSlot.startTime}
              onChange={handleSlotChange}
              className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
            />
          </div>

          {/* End */}
          <div>
            <label className="block text-sm font-bold mb-2 dark:text-white">End Time</label>
            <input
              type="time"
              name="endTime"
              value={currentSlot.endTime}
              onChange={handleSlotChange}
              className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-bold mb-2 dark:text-white">Base Price (SOL)</label>
            <div className="relative">
              <DollarSign className="absolute inset-y-0 left-0 ml-3 my-auto h-5 w-5 text-gray-400" />
              <input
                type="number"
                name="basePrice"
                value={currentSlot.basePrice}
                onChange={handleSlotChange}
                step="0.01"
                min="0"
                placeholder="0.00"
                className="w-full pl-10 px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={addSlot}
          disabled={!currentSlot.day || !currentSlot.startTime || !currentSlot.endTime || !currentSlot.basePrice}
          className="px-4 py-2 bg-[#FF6B97] text-white font-bold rounded-lg border-[4px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform disabled:opacity-50"
        >
          Add Time Slot
        </button>
      </div>

      {/* list of slots */}
      {formData.availableSlots.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-bold dark:text-white">Added Slots:</h4>
          {formData.availableSlots.map((slot) => (
            <div
              key={slot.id}
              className="flex items-center justify-between p-3 bg-white dark:bg-[#1e1e28] rounded-lg border-2 border-black"
            >
              <div className="flex items-center space-x-2">
                <span className="font-medium dark:text-white">{slot.day}:</span>
                <span className="dark:text-gray-300">
                  {slot.startTime} – {slot.endTime}
                </span>
                <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
                  {slot.basePrice} SOL
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeSlot(slot.id)}
                className="text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* sub-component: Fake map */
function MapPlaceholder() {
  return (
    <div>
      <label className="block text-sm font-bold mb-2 dark:text-white">Pin Location on Map</label>
      <div className="border-[4px] border-black rounded-lg overflow-hidden h-[300px] relative">
        {/* placeholder */}
        <div className="w-full h-full bg-gray-100 dark:bg-[#252530] flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto text-[#FF6B97]" />
            <p className="mt-2 text-gray-500 dark:text-gray-400">Interactive map would be displayed here</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">Click to place a pin at your display location</p>
          </div>
        </div>
        {/* demo pin */}
        <MapPin className="absolute top-1/4 left-1/3 w-8 h-8 text-[#FF6B97] -mt-8" />
        <div className="absolute bottom-2 right-2 bg-white dark:bg-[#1e1e28] px-3 py-1 rounded-lg border-2 border-black text-sm font-mono">
          <span className="dark:text-white">40.7580° N, 73.9855° W</span>
        </div>
      </div>

      <div className="mt-2 flex items-center text-sm text-gray-600 dark:text-gray-400">
        <Check className="w-4 h-4 mr-1 text-green-500" />
        <span>Location coordinates will be used for IoT device verification</span>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  STEP-2  ▸  Verification                                                   */
/* -------------------------------------------------------------------------- */


interface StepTwoProps {
  uploadedImages: { id: number; name: string }[]
  handleImageUpload: () => void
  verificationStatus: "pending" | "verifying" | "verified"
  startVerification: () => void
  prevStep: () => void
  nextStep: () => void
}

export function StepTwo({
  uploadedImages,
  handleImageUpload,
  verificationStatus,
  startVerification,
  prevStep,
  nextStep,
}: StepTwoProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">Location Verification</h2>

      {/* photo upload */}
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
            <p className="text-sm text-gray-400 dark:text-gray-500">PNG, JPG up to 10 MB</p>
          </div>
        ) : (
          <div className="space-y-4">
            {uploadedImages.map((img) => (
              <div
                key={img.id}
                className="flex items-center justify-between p-3 bg-white dark:bg-[#1e1e28] rounded-lg border-2 border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center">
                  <Camera className="w-5 h-5 mr-3 text-[#FF6B97]" />
                  <span className="dark:text-white">{img.name}</span>
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

      {/* IoT verification */}
      <div className="bg-gray-50 dark:bg-[#252530] p-6 rounded-xl border-[4px] border-black">
        <h3 className="font-bold text-lg mb-4 dark:text-white">IoT Device Verification</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Connect your IoT device to verify your display location.
        </p>

        {verificationStatus === "pending" && (
          <button
            type="button"
            onClick={startVerification}
            className="px-6 py-3 bg-[#0055FF] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
          >
            Start Verification
          </button>
        )}

        {verificationStatus === "verifying" && (
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#0055FF]" />
            <span className="font-medium dark:text-white">Verifying device…</span>
          </div>
        )}

        {verificationStatus === "verified" && (
          <div className="flex items-center space-x-3 text-green-600 dark:text-green-400">
            <Check className="w-6 h-6" />
            <span className="font-medium">Device verified successfully!</span>
          </div>
        )}
      </div>

      {/* nav */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 bg-white dark:bg-[#252530] text-black dark:text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={nextStep}
          disabled={verificationStatus !== "verified"}
          className="px-6 py-3 bg-[#FF6B97] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next Step
        </button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  STEP-3  ▸  Review & Submit                                                */
/* -------------------------------------------------------------------------- */
interface StepThreeProps {
  formData: FormDataState
  prevStep: () => void
  isSubmitting: boolean
}

export function StepThree({ formData, prevStep, isSubmitting }: StepThreeProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">Review Location</h2>

      {/* summary card */}
      <div className="bg-gray-50 dark:bg-[#252530] p-6 rounded-xl border-[4px] border-black">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            ["Location Name", formData.name || "Not specified"],
            ["Display Type", formData.locationType || "Not specified"],
            [
              "Address",
              `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
            ],
            ["Display Size", formData.displaySize || "Not specified"],
          ].map(([label, val]) => (
            <div key={label as string}>
              <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">{label}</h3>
              <p className="font-bold dark:text-white">{val}</p>
            </div>
          ))}
        </div>

        {/* description */}
        <div className="mt-6">
          <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">Description</h3>
          <p className="dark:text-white">{formData.description || "No description provided."}</p>
        </div>

        {/* verification */}
        <div className="mt-6">
          <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">Verification</h3>
          <div className="flex items-center space-x-3 text-green-600 dark:text-green-400">
            <Check className="w-5 h-5" />
            <span className="font-medium">Location verified</span>
          </div>
        </div>

        {/* slots */}
        <div className="mt-6">
          <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-1">Available Time Slots</h3>
          {formData.availableSlots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
              {formData.availableSlots.map((s) => (
                <div
                  key={s.id}
                  className="bg-white dark:bg-[#1e1e28] p-2 rounded-lg border border-gray-200 dark:border-gray-700 flex justify-between items-center"
                >
                  <div>
                    <span className="font-medium dark:text-white">{s.day}: </span>
                    <span className="dark:text-gray-300">
                      {s.startTime} – {s.endTime}
                    </span>
                  </div>
                  <span className="ml-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm">
                    {s.basePrice} SOL
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="dark:text-white">No time slots specified.</p>
          )}
        </div>
      </div>

      {/* disclaimer */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border-l-4 border-yellow-400 text-yellow-800 dark:text-yellow-200">
        By registering this location you confirm that you have the legal right to use this display for advertising
        purposes.
      </div>

      {/* nav */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={prevStep}
          className="px-6 py-3 bg-white dark:bg-[#252530] text-black dark:text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
        >
          Previous
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-[#FF6B97] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform disabled:opacity-70"
        >
          {isSubmitting ? "Registering…" : "Register Location"}
        </button>
      </div>
    </div>
  )
}