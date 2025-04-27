"use client"

import { useState } from "react"
import Link from "next/link"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageTransition } from "@/components/page-transition"
import { Search, PlusCircle, Eye, Edit, Trash2 } from "lucide-react"

// Sample location data
const locationData = [
  {
    id: "1",
    name: "Times Square North",
    address: "1535 Broadway, New York, NY 10036",
    type: "Digital Billboard",
    status: "Active",
    impressions: "120K/day",
    earnings: "$1,850/month",
  },
  {
    id: "2",
    name: "Santa Monica Pier",
    address: "200 Santa Monica Pier, Santa Monica, CA 90401",
    type: "Interactive Display",
    status: "Active",
    impressions: "95K/day",
    earnings: "$1,200/month",
  },
  {
    id: "3",
    name: "Magnificent Mile",
    address: "401 N Michigan Ave, Chicago, IL 60611",
    type: "Digital Billboard",
    status: "Active",
    impressions: "85K/day",
    earnings: "$1,400/month",
  },
  {
    id: "4",
    name: "South Beach",
    address: "1001 Ocean Drive, Miami Beach, FL 33139",
    type: "Interactive Display",
    status: "Maintenance",
    impressions: "0/day",
    earnings: "$0/month",
  },
  {
    id: "5",
    name: "Union Square",
    address: "333 Post St, San Francisco, CA 94108",
    type: "Digital Billboard",
    status: "Active",
    impressions: "75K/day",
    earnings: "$1,100/month",
  },
]

export default function Locations() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  // Filter locations based on search term and status
  const filteredLocations = locationData.filter((location) => {
    const matchesSearch =
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "All" || location.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black dark:text-white">Locations</h1>
            <p className="text-lg mt-2 dark:text-gray-300">Manage your display locations</p>
          </div>
          <Link
            href="/dashboard/locations/register"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-[#FF6B97] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Register Location
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-4 mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search locations..."
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
              <option value="Maintenance">Maintenance</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Locations Table */}
        <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 dark:bg-[#252530]">
                  <th className="px-6 py-3 text-left font-bold dark:text-white">Location</th>
                  <th className="px-6 py-3 text-left font-bold dark:text-white">Type</th>
                  <th className="px-6 py-3 text-left font-bold dark:text-white">Status</th>
                  <th className="px-6 py-3 text-left font-bold dark:text-white">Impressions</th>
                  <th className="px-6 py-3 text-left font-bold dark:text-white">Earnings</th>
                  <th className="px-6 py-3 text-center font-bold dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLocations.length > 0 ? (
                  filteredLocations.map((location) => (
                    <tr key={location.id} className="hover:bg-gray-50 dark:hover:bg-[#252530]">
                      <td className="px-6 py-4 dark:text-white">
                        <Link href={`/dashboard/locations/${location.id}`} className="font-bold hover:underline">
                          {location.name}
                        </Link>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{location.address}</p>
                      </td>
                      <td className="px-6 py-4 dark:text-white">{location.type}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            location.status === "Active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : location.status === "Maintenance"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {location.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 dark:text-white">{location.impressions}</td>
                      <td className="px-6 py-4 dark:text-white">{location.earnings}</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Link
                            href={`/dashboard/locations/${location.id}`}
                            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2a3a]"
                            title="View"
                          >
                            <Eye className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          </Link>
                          <Link
                            href={`/dashboard/locations/${location.id}/edit`}
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
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                      No locations found. Try adjusting your filters or register a new location.
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
