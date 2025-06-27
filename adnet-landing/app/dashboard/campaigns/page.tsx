"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageTransition } from "@/components/page-transition"
import { useCampaignFlourish } from "@/hooks/use-campaign-flourish"
import { useCampaigns } from "@/hooks/use-dashboard-data"
import { Search, PlusCircle, Eye, Edit, Trash2 } from "lucide-react"



export default function Campaigns() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const { campaigns } = useCampaigns()

  // Filter campaigns based on search term and status
  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || campaign.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black dark:text-white">Campaigns</h1>
            <p className="text-lg mt-2 dark:text-gray-300">Manage your advertising campaigns</p>
          </div>
          <Link
            href="/dashboard/campaigns/create"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-[#0055FF] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Create Campaign
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-4 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
              <option value="Ended">Ended</option>
            </select>
          </div>
        </div>

        {/* Campaigns Table */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-[#252530]">
                  <th className="px-6 py-3 text-left font-bold dark:text-white">Campaign</th>
                  <th className="px-6 py-3 text-left font-bold dark:text-white">Status</th>
                  <th className="px-6 py-3 text-left font-bold dark:text-white">Budget</th>
                  <th className="px-6 py-3 text-left font-bold dark:text-white">Spent</th>
                  <th className="px-6 py-3 text-left font-bold dark:text-white">Impressions</th>
                  <th className="px-6 py-3 text-left font-bold dark:text-white">Duration</th>
                  <th className="px-6 py-3 text-center font-bold dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredCampaigns.length > 0 ? (
                  filteredCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-[#252530]">
                      <td className="px-6 py-4 dark:text-white">
                        <Link href={`/dashboard/campaigns/${campaign.id}`} className="font-bold hover:underline">
                          {campaign.name}
                        </Link>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${campaign.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : campaign.status === "Paused"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            }`}
                        >
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 dark:text-white">{campaign.budgetSOL} SOL</td>
                      <td className="px-6 py-4 dark:text-white">{campaign.spentSOL} SOL</td>
                      <td className="px-6 py-4 dark:text-white">2.5K</td>
                      <td className="px-6 py-4 dark:text-white">
                        Active Campaign
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Link
                            href={`/dashboard/campaigns/${campaign.id}`}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a3a]"
                            title="View"
                          >
                            <Eye className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          </Link>
                          <Link
                            href={`/dashboard/campaigns/${campaign.id}/edit`}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a3a]"
                            title="Edit"
                          >
                            <Edit className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          </Link>
                          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a3a]" title="Delete">
                            <Trash2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No campaigns found. Try adjusting your filters or create a new campaign.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  )
}
