"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { PageTransition } from "@/components/page-transition"
import { User, Lock, Bell, CreditCard, Shield, HelpCircle, Save } from "lucide-react"

type Role = "advertiser" | "provider"

export default function Settings() {
  const [role, setRole] = useState<Role>("advertiser")
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    // Check for saved role preference
    const savedRole = localStorage.getItem("userRole") as Role | null
    if (savedRole) {
      setRole(savedRole)
    }

    // Listen for role changes
    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem("userRole") as Role | null
      if (updatedRole) {
        setRole(updatedRole)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <DashboardLayout>
      <PageTransition>
        <div className="mb-8">
          <h1 className="text-3xl font-black dark:text-white">Settings</h1>
          <p className="text-lg mt-2 dark:text-gray-300">Manage your account settings and preferences</p>
        </div>

        {/* Settings Tabs */}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-64 shrink-0">
            <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
              <nav className="p-2">
                <SettingsTab
                  icon={<User className="w-5 h-5" />}
                  title="Profile"
                  active={activeTab === "profile"}
                  onClick={() => setActiveTab("profile")}
                />
                <SettingsTab
                  icon={<Lock className="w-5 h-5" />}
                  title="Security"
                  active={activeTab === "security"}
                  onClick={() => setActiveTab("security")}
                />
                <SettingsTab
                  icon={<Bell className="w-5 h-5" />}
                  title="Notifications"
                  active={activeTab === "notifications"}
                  onClick={() => setActiveTab("notifications")}
                />
                <SettingsTab
                  icon={<CreditCard className="w-5 h-5" />}
                  title="Billing"
                  active={activeTab === "billing"}
                  onClick={() => setActiveTab("billing")}
                />
                <SettingsTab
                  icon={<Shield className="w-5 h-5" />}
                  title="Privacy"
                  active={activeTab === "privacy"}
                  onClick={() => setActiveTab("privacy")}
                />
                <SettingsTab
                  icon={<HelpCircle className="w-5 h-5" />}
                  title="Help"
                  active={activeTab === "help"}
                  onClick={() => setActiveTab("help")}
                />
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            <div className="bg-white dark:bg-[#1e1e28] border-[6px] border-black rounded-xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-colors duration-300">
              {activeTab === "profile" && (
                <div>
                  <h2 className="text-2xl font-bold mb-6 dark:text-white">Profile Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold mb-2 dark:text-white">Full Name</label>
                      <input
                        type="text"
                        defaultValue="John Doe"
                        className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 dark:text-white">Email Address</label>
                      <input
                        type="email"
                        defaultValue="john.doe@example.com"
                        className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 dark:text-white">Company</label>
                      <input
                        type="text"
                        defaultValue="Acme Inc."
                        className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 dark:text-white">Bio</label>
                      <textarea
                        rows={4}
                        defaultValue="Marketing professional with 5+ years of experience in digital advertising."
                        className="w-full px-4 py-3 border-[4px] border-black rounded-lg focus:outline-none dark:bg-[#252530] dark:text-white"
                      ></textarea>
                    </div>

                    <div className="flex justify-end">
                      <button className="inline-flex items-center px-6 py-3 bg-[#0055FF] text-white font-bold rounded-xl border-[4px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-transform">
                        <Save className="w-5 h-5 mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab !== "profile" && (
                <div className="text-center py-12">
                  <h2 className="text-2xl font-bold mb-4 dark:text-white">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">This section is under development.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageTransition>
    </DashboardLayout>
  )
}

interface SettingsTabProps {
  icon: React.ReactNode
  title: string
  active: boolean
  onClick: () => void
}

function SettingsTab({ icon, title, active, onClick }: SettingsTabProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg font-bold transition-all ${
        active
          ? "bg-[#0055FF] text-white"
          : "hover:bg-gray-100 dark:hover:bg-[#252530] text-gray-700 dark:text-gray-300"
      }`}
    >
      {icon}
      <span>{title}</span>
    </button>
  )
}
