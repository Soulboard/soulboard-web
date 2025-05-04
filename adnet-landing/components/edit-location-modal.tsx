"use client"

import { useState, useEffect } from "react"
import { X, Save } from "lucide-react"

// Update the Location interface to include availableSlots
interface Location {
  id: string
  name: string
  address: string
  type: string
  size?: string
  status: string
  description?: string
  availableSlots?: Array<{
    id: string
    day: string
    startTime: string
    endTime: string
  }>
}

interface EditLocationModalProps {
  isOpen: boolean
  onClose: () => void
  location: Location
  onSave: (location: Location) => void
}

export function EditLocationModal({ isOpen, onClose, location, onSave }: EditLocationModalProps) {
  const [formData, setFormData] = useState<Location>(location)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Add these new states in the EditLocationModal component
  const [currentSlot, setCurrentSlot] = useState({
    day: "",
    startTime: "",
    endTime: "",
  })

  useEffect(() => {
    // Update form data when location changes
    setFormData(location)
  }, [location])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Add these functions to handle slot management
  const handleSlotChange = (e) => {
    const { name, value } = e.target
    setCurrentSlot((prev) => ({ ...prev, [name]: value }))
  }

  const addSlot = () => {
    if (!currentSlot.day || !currentSlot.startTime || !currentSlot.endTime) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      availableSlots: [...(prev.availableSlots || []), { ...currentSlot, id: Date.now().toString() }],
    }))

    setCurrentSlot({
      day: "",
      startTime: "",
      endTime: "",
    })
  }

  const removeSlot = (slotId) => {
    setFormData((prev) => ({
      ...prev,
      availableSlots: prev.availableSlots?.filter((slot) => slot.id !== slotId) || [],
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      onSave(formData)
      onClose()
    }, 800)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur effect */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Edit Location</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#252530] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 dark:text-white">Location Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 dark:text-white">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-white">Display Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
              >
                <option value="Digital Billboard">Digital Billboard</option>
                <option value="Interactive Display">Interactive Display</option>
                <option value="LED Wall">LED Wall</option>
                <option value="Projection">Projection</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 dark:text-white">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
              >
                <option value="Active">Active</option>
                <option value="Maintenance">Maintenance</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 dark:text-white">Display Size</label>
            <select
              name="size"
              value={formData.size || ""}
              onChange={handleChange}
              className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
            >
              <option value="">Select display size</option>
              <option value="Small (< 10 sq ft)">Small ({"<"} 10 sq ft)</option>
              <option value="Medium (10-50 sq ft)">Medium (10-50 sq ft)</option>
              <option value="Large (50-100 sq ft)">Large (50-100 sq ft)</option>
              <option value="Extra Large (> 100 sq ft)">Extra Large ({">"} 100 sq ft)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 dark:text-white">Description</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
            ></textarea>
          </div>

          <div>
            <h3 className="text-lg font-bold mb-4 dark:text-white">Available Time Slots</h3>

            <div className="bg-gray-50 dark:bg-[#252530] p-6 rounded-xl border-[4px] border-black mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold mb-2 dark:text-white">Day</label>
                  <select
                    name="day"
                    value={currentSlot.day}
                    onChange={handleSlotChange}
                    className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                  >
                    <option value="">Select day</option>
                    <option value="Monday">Monday</option>
                    <option value="Tuesday">Tuesday</option>
                    <option value="Wednesday">Wednesday</option>
                    <option value="Thursday">Thursday</option>
                    <option value="Friday">Friday</option>
                    <option value="Saturday">Saturday</option>
                    <option value="Sunday">Sunday</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Weekends">Weekends</option>
                    <option value="All Days">All Days</option>
                  </select>
                </div>

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
              </div>

              <button
                type="button"
                onClick={addSlot}
                disabled={!currentSlot.day || !currentSlot.startTime || !currentSlot.endTime}
                className="px-4 py-2 bg-[#FF6B97] text-white font-bold rounded-lg border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Time Slot
              </button>
            </div>

            {/* Display added slots */}
            {formData.availableSlots && formData.availableSlots.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold dark:text-white">Current Slots:</h4>
                {formData.availableSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-3 bg-white dark:bg-[#1e1e28] rounded-lg border-2 border-black"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="font-medium dark:text-white">{slot.day}:</span>
                      <span className="dark:text-gray-300">
                        {slot.startTime} - {slot.endTime}
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

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white dark:bg-[#252530] text-black dark:text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#FF6B97] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform flex items-center disabled:opacity-70"
            >
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
