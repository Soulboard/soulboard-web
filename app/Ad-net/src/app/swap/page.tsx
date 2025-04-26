"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ArrowDown, Loader2, AlertCircle, Check, RefreshCw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { usePrivy } from "@privy-io/react-auth"
import { toast } from "@/lib/toast"
import { purchaseADCTokens } from "@/lib/services/tokenomics.service"
import { useUserStore } from "@/lib/store"

export default function SwapPage() {
  const router = useRouter()
  const { user, authenticated, ready, login } = usePrivy()
  const { connectWallet } = useUserStore()
  
  const [adcAmount, setAdcAmount] = useState<number>(0)
  const [usdcAmount, setUsdcAmount] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // ADC to USDC conversion rate (1 ADC = 2 USDC)
  const conversionRate = 2
  
  // Use state to avoid hydration mismatch
  const [mounted, setMounted] = useState(false)
  
  // Only render client-specific content after mounting
  if (typeof window !== 'undefined' && !mounted) {
    setMounted(true)
  }
  
  // Handle input change and convert between ADC and USDC
  const handleInputChange = (type: 'adc' | 'usdc', value: string) => {
    const numericValue = value === '' ? 0 : Number(value)
    
    if (type === 'adc') {
      setAdcAmount(numericValue)
      setUsdcAmount(numericValue * conversionRate)
    } else {
      setUsdcAmount(numericValue)
      setAdcAmount(numericValue / conversionRate)
    }
  }
  
  const handleConnectWallet = async () => {
    try {
      await login()
    } catch (err) {
      console.error("Login error:", err)
      toast("Login Failed", { description: "Failed to connect wallet" }, "error")
    }
  }
  
  const handlePurchase = async () => {
    if (!authenticated) {
      toast("Wallet Required", { description: "Please connect your wallet to swap tokens" }, "error")
      return
    }
    
    if (!user?.wallet?.address) {
      toast("Wallet Required", { description: "Please connect your wallet to swap tokens" }, "error")
      return
    }
    
    if (adcAmount <= 0) {
      toast("Invalid Amount", { description: "Please enter a valid amount to swap" }, "error")
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // We need the user's ID from the database
      // In a real app, this would be better managed through auth
      const userId = `user-${user.wallet.address.toLowerCase()}`
      
      // Process the swap
      const transaction = await purchaseADCTokens(
        userId,
        adcAmount,
        "USDC",
        user.wallet.address
      )
      
      if (transaction) {
        toast("Swap Successful", { 
          description: `You've successfully purchased ${adcAmount} ADC tokens!` 
        }, "success")
        
        // Reset form
        setAdcAmount(0)
        setUsdcAmount(0)
        
        // Refresh wallet data
        if (connectWallet) {
          await connectWallet(user.wallet.address, user)
        }
      }
    } catch (err) {
      console.error("Swap error:", err)
      toast("Swap Failed", { 
        description: "There was an error processing your swap. Please try again." 
      }, "error")
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Prevent hydration mismatch by not rendering values on server
  if (!mounted) {
    return <div>Loading...</div>
  }

  return (
    <div className="container px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Swap Tokens</h1>
      
      <div className="border-[6px] border-black bg-white p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Exchange USDC for ADC</h2>
        
        {/* Swap Container */}
        <div className="space-y-6">
          {/* From */}
          <div className="p-4 border-[3px] border-black bg-[#f7f7f7]">
            <div className="flex justify-between mb-2">
              <span className="font-bold">From</span>
              <span className="text-sm">
                Balance: {/* Add balance info here */}
              </span>
            </div>
            <div className="flex items-center">
              <Input
                type="number"
                value={usdcAmount || ''}
                onChange={(e) => handleInputChange('usdc', e.target.value)}
                className="border-[2px] border-black text-2xl font-bold bg-white rounded-none"
                placeholder="0.0"
              />
              <div className="ml-4 font-bold text-lg bg-blue-100 px-3 py-1 border-[2px] border-black">
                USDC
              </div>
            </div>
          </div>
          
          {/* Arrow */}
          <div className="flex justify-center">
            <div className="border-[3px] border-black rounded-full bg-white p-2">
              <ArrowDown className="h-6 w-6" />
            </div>
          </div>
          
          {/* To */}
          <div className="p-4 border-[3px] border-black bg-[#f7f7f7]">
            <div className="flex justify-between mb-2">
              <span className="font-bold">To</span>
              <span className="text-sm">
                You'll receive
              </span>
            </div>
            <div className="flex items-center">
              <Input
                type="number"
                value={adcAmount || ''}
                onChange={(e) => handleInputChange('adc', e.target.value)}
                className="border-[2px] border-black text-2xl font-bold bg-white rounded-none"
                placeholder="0.0"
              />
              <div className="ml-4 font-bold text-lg bg-green-100 px-3 py-1 border-[2px] border-black">
                ADC
              </div>
            </div>
          </div>
          
          {/* Exchange Rate */}
          <div className="bg-yellow-50 border-[3px] border-yellow-200 p-4">
            <div className="flex justify-between text-sm font-medium">
              <span>Exchange Rate</span>
              <span>1 ADC = {conversionRate} USDC</span>
            </div>
          </div>
          
          {/* Connection Status */}
          {!authenticated ? (
            <div className="bg-amber-50 border-[3px] border-amber-200 p-4 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold">Connect Your Wallet</h3>
                <p className="text-sm mb-3">You need to connect your wallet to swap tokens.</p>
                <Button
                  onClick={handleConnectWallet}
                  className="bg-[#0055FF] text-white border-[2px] border-black hover:bg-[#003cc7] transition-all font-bold px-4 py-2 h-auto rounded-none"
                >
                  Connect Wallet
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border-[3px] border-green-200 p-4 flex items-start gap-4">
              <Check className="w-6 h-6 text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-bold">Wallet Connected</h3>
                <p className="text-sm">
                  {user?.wallet?.address && (
                    <span className="font-mono">
                      {user.wallet.address.substring(0, 6)}...{user.wallet.address.substring(user.wallet.address.length - 4)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}
          
          {/* Swap Button */}
          <Button
            onClick={handlePurchase}
            disabled={isSubmitting || !authenticated || adcAmount <= 0}
            className="w-full bg-[#0055FF] text-white border-[3px] border-black hover:bg-[#003cc7] transition-all font-bold py-3 rounded-none text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
              </>
            ) : (
              'Swap Tokens'
            )}
          </Button>
        </div>
      </div>
      
      <div className="border-[3px] border-black bg-[#f7f7f7] p-6">
        <h3 className="font-bold text-lg mb-2">About ADC Tokens</h3>
        <p className="mb-4">
          ADC (AdNetwork Coin) is the native token of the AdNet advertising network. Use ADC to fund
          campaigns and earn revenue by displaying ads on your screens.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border-[2px] border-black bg-white p-3">
            <h4 className="font-bold mb-1">Advertiser Benefits</h4>
            <ul className="text-sm list-disc pl-5">
              <li>Fund campaigns with ADC tokens</li>
              <li>Lower fees than traditional advertising</li>
              <li>Real-time campaign performance</li>
            </ul>
          </div>
          
          <div className="border-[2px] border-black bg-white p-3">
            <h4 className="font-bold mb-1">Provider Benefits</h4>
            <ul className="text-sm list-disc pl-5">
              <li>Earn ADC for displaying ads</li>
              <li>Automatic payouts</li>
              <li>Revenue sharing opportunities</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

