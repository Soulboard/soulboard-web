"use client"

import { useState, useEffect } from "react"
import { X, Save } from "lucide-react"

interface Campaign {
  id: string
  name: string
  status: string
  budget: string
  startDate: string
  endDate: string
  description?: string
}

interface EditCampaignModalProps {
  isOpen: boolean
  onClose: () => void
  campaign: Campaign
  onSave: (campaign: Campaign) => void
}

export function EditCampaignModal({ isOpen, onClose, campaign, onSave }: EditCampaignModalProps) {
  const [formData, setFormData] = useState<Campaign>(campaign)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Update form data when campaign changes
    setFormData(campaign)
  }, [campaign])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
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
          <h2 className="text-2xl font-bold dark:text-white">Edit Campaign</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#252530] transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 dark:text-white">Campaign Name</label>
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
            <label className="block text-sm font-bold mb-2 dark:text-white">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Ended">Ended</option>
              <option value="Paused">Paused</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 dark:text-white">Budget</label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 dark:text-white">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 dark:text-white">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
              />
            </div>
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
              className="px-6 py-3 bg-[#0055FF] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform flex items-center disabled:opacity-70"
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
