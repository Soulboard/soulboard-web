"use client"

import { Wallet, ChevronDown, Copy, ExternalLink, LogOut, UserPlus } from "lucide-react"
import type React from "react"
import { usePrivy, useSolanaWallets } from "@privy-io/react-auth"
import { useState, useRef, useEffect } from "react"
import { useRole, type Role } from "@/hooks/use-role"
import { useDashboardStore } from "@/store/dashboard-store"
import {useSendTransaction} from '@privy-io/react-auth/solana';
import { PublicKey } from "@solana/web3.js"

export function ConnectWallet() {
  const { login, logout, authenticated } = usePrivy()
  const { wallets } = useSolanaWallets()
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const { role } = useRole()
  const { sendTransaction } = useSendTransaction()
  const {registerProvider , registerAdvertiser , initialise}  = useDashboardStore()

  // Handle clicking outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
  }

  // Handle connect/toggle dropdown
  const handleButtonClick = () => {
    if (authenticated) {
      setIsDropdownOpen(!isDropdownOpen)
    } else {
      login()
    }
  }

  // Handle disconnect
  const handleDisconnect = (e: React.MouseEvent) => {
    e.stopPropagation()
    logout()
    setIsDropdownOpen(false)
  }

  // Handle copy address
  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (wallets[0]?.address) {
      navigator.clipboard.writeText(wallets[0].address)
    }
  }

  // Handle registration
  const handleRegister = async  (e: React.MouseEvent) => {
    e.stopPropagation()
     initialise( { 
        wallet : wallets[0] , 
        publicKey : new PublicKey(wallets[0].address) , 
        sendTransaction : sendTransaction
      })
    // In a real app, this would navigate to a registration page or open a modal

    role === "advertiser"
      ? await registerAdvertiser()
      : await registerProvider()

    console.log(`Registering as ${role === "advertiser" ? "provider" : "advertiser"}`)
    // Close dropdown after clicking
    setIsDropdownOpen(false)
  }

  // Determine the opposite role for registration
  const getRegistrationRole = (): Role => {
    return role === "advertiser" ? "provider" : "advertiser"
  }

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleButtonClick}
        className={`${
          authenticated ? "bg-green-500 dark:bg-green-600" : "bg-[#FFCC00] dark:bg-[#FF6B97]"
        } text-black dark:text-white font-bold py-2 px-5 border-[6px] border-black rounded-xl hover:-translate-y-1 transition-transform flex items-center space-x-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:dark-glow`}
      >
        <Wallet className="w-5 h-5" />
        <span>{authenticated && wallets[0]?.address ? formatAddress(wallets[0].address) : "Connect Wallet"}</span>
        {authenticated && (
          <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
        )}
      </button>

      {isDropdownOpen && authenticated && wallets[0] && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1e1e28] border-[4px] border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] z-50 overflow-hidden"
        >
          <div className="p-4 border-b-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Connected Wallet</span>
              <div className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded-full">
                <span className="text-xs font-medium text-green-800 dark:text-green-200">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold dark:text-white">{formatAddress(wallets[0].address)}</span>
              <button
                onClick={handleCopyAddress}
                className="p-1 hover:bg-gray-100 dark:hover:bg-[#252530] rounded-full"
                title="Copy address"
              >
                <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          <div className="p-4 border-b-2 border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Network</span>
              <span className="font-bold dark:text-white">solana</span>
            </div>
          </div>

          <div className="p-4 space-y-2">
            <button
              onClick={handleRegister}
              className="w-full flex items-center justify-between px-3 py-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/40 transition-colors"
            >
              <span className="font-medium text-yellow-700 dark:text-yellow-400">
                Register as {getRegistrationRole() === "advertiser" ? "Advertiser" : "Provider"}
              </span>
              <UserPlus className="w-4 h-4 text-yellow-700 dark:text-yellow-400" />
            </button>

            <a
              href={`https://explorer.solana.com/address/${wallets[0].address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-[#252530] rounded-lg hover:bg-gray-200 dark:hover:bg-[#303040] transition-colors"
            >
              <span className="font-medium dark:text-white">View on Explorer</span>
              <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            </a>

            <button
              onClick={handleDisconnect}
              className="w-full flex items-center justify-between px-3 py-2 bg-red-100 dark:bg-red-900/20 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
            >
              <span className="font-medium text-red-700 dark:text-red-400">Disconnect</span>
              <LogOut className="w-4 h-4 text-red-700 dark:text-red-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
