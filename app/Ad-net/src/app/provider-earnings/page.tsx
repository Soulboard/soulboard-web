"use client"

import { useState } from "react"
import { Calendar, Download, DollarSign, TrendingUp, Clock, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProviderPages } from "@/hooks"

export default function ProviderEarningsPage() {
  // Use our centralized provider hook
  const { isCorrectChain, serviceError, switchChain } = useProviderPages();
  
  const [dateRange, setDateRange] = useState("month")

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl md:text-4xl font-black">PROVIDER EARNINGS</h1>

        <div className="flex gap-2">
          <div className="border-[4px] border-black bg-white">
            <select
              className="h-full px-4 py-2 font-bold bg-transparent focus:outline-none"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last 365 Days</option>
            </select>
          </div>
          <Button
            variant="outline"
            className="border-[4px] border-black rounded-none bg-white hover:bg-[#f5f5f5] transition-all font-bold px-4 py-2 h-auto flex items-center gap-2 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Calendar className="w-5 h-5" />
            <span>Custom Range</span>
          </Button>
          <Button
            variant="outline"
            className="border-[4px] border-black rounded-none bg-white hover:bg-[#f5f5f5] transition-all font-bold px-4 py-2 h-auto hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <Download className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Earnings Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="border-[6px] border-black bg-[#FF3366] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all transform rotate-1 group">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-black text-white">TOTAL EARNINGS</h3>
            <DollarSign className="w-8 h-8 text-white opacity-70 group-hover:scale-125 transition-transform" />
          </div>
          <div className="bg-white border-[4px] border-black p-3 mb-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
            <div className="text-4xl font-black">24,680 ADC</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-white font-bold">≈ 10,502 USDC</div>
            <div className="flex items-center gap-1 bg-black text-white px-2 py-1 font-bold text-sm group-hover:bg-[#FFCC00] group-hover:text-black transition-colors">
              <TrendingUp className="w-4 h-4" />
              <span>+23.5%</span>
            </div>
          </div>
        </div>

        <div className="border-[6px] border-black bg-[#FFCC00] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all transform -rotate-1 group">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-black">PENDING EARNINGS</h3>
            <Clock className="w-8 h-8 opacity-70 group-hover:scale-125 transition-transform" />
          </div>
          <div className="bg-white border-[4px] border-black p-3 mb-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
            <div className="text-4xl font-black">3,450 ADC</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="font-bold">Available in 7 days</div>
            <div className="flex items-center gap-1 bg-black text-white px-2 py-1 font-bold text-sm group-hover:bg-[#0055FF] group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
              <span>Processing</span>
            </div>
          </div>
        </div>

        <div className="border-[6px] border-black bg-[#0055FF] p-5 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all transform rotate-1 group">
          <div className="flex items-start justify-between mb-3">
            <h3 className="text-xl font-black text-white">NEXT PAYOUT</h3>
            <CheckCircle className="w-8 h-8 text-white opacity-70 group-hover:scale-125 transition-transform" />
          </div>
          <div className="bg-white border-[4px] border-black p-3 mb-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
            <div className="text-4xl font-black">5,120 ADC</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-white font-bold">In 3 days</div>
            <div className="flex items-center gap-1 bg-black text-white px-2 py-1 font-bold text-sm group-hover:bg-[#FFCC00] group-hover:text-black transition-colors">
              <CheckCircle className="w-4 h-4" />
              <span>Scheduled</span>
            </div>
          </div>
        </div>
      </div>

      {/* Earnings Table */}
      <div className="border-[6px] border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all duration-300">
        <div className="p-6 border-b-[4px] border-black">
          <h2 className="text-2xl font-black">Earnings History</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-[4px] border-black">
                <th className="p-4 text-left font-black">Date</th>
                <th className="p-4 text-left font-black">Amount (ADC)</th>
                <th className="p-4 text-left font-black">Status</th>
                <th className="p-4 text-left font-black">Transaction</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  date: "Jun 15, 2023",
                  amount: 5250,
                  status: "completed",
                  txHash: "0x1a2b...3c4d",
                },
                {
                  date: "May 15, 2023",
                  amount: 4830,
                  status: "completed",
                  txHash: "0x5e6f...7g8h",
                },
                {
                  date: "Apr 15, 2023",
                  amount: 3920,
                  status: "completed",
                  txHash: "0x9i0j...1k2l",
                },
                {
                  date: "Mar 15, 2023",
                  amount: 3450,
                  status: "completed",
                  txHash: "0x3m4n...5o6p",
                },
                {
                  date: "Jul 15, 2023",
                  amount: 5120,
                  status: "pending",
                  txHash: "",
                },
              ].map((item, index) => (
                <tr key={index} className="border-b-[2px] border-black hover:bg-[#f5f5f5] transition-colors">
                  <td className="p-4 font-bold">{item.date}</td>
                  <td className="p-4 font-bold">{item.amount.toLocaleString()} ADC</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {item.status === "completed" ? (
                        <div className="px-2 py-1 bg-green-500 text-white text-xs font-bold border-[2px] border-black">
                          COMPLETED
                        </div>
                      ) : (
                        <div className="px-2 py-1 bg-[#FFCC00] text-black text-xs font-bold border-[2px] border-black">
                          PENDING
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    {item.status === "completed" ? (
                      <a
                        href={`https://etherscan.io/tx/${item.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0055FF] hover:underline font-medium"
                      >
                        {item.txHash}
                      </a>
                    ) : (
                      <span className="text-gray-400">Pending</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t-[2px] border-black bg-[#f5f5f5] flex justify-between items-center">
          <div className="font-bold">Showing 5 most recent transactions</div>
          <Button className="bg-[#FF3366] text-white border-[3px] border-black hover:bg-[#FFCC00] hover:text-black transition-all font-bold px-4 py-2 h-auto rounded-none hover:-translate-y-1 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            View All Transactions
          </Button>
        </div>
      </div>
      
      {/* Display blockchain connection status notification if there are errors */}
      {serviceError && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg border-2 border-black">
          <p className="font-bold">Blockchain Connection Error</p>
          <p>{serviceError.message || "Unable to connect to blockchain service"}</p>
          {!isCorrectChain && (
            <Button 
              className="mt-2 bg-white text-red-500 hover:bg-gray-100"
              onClick={switchChain}
            >
              Switch to Holesky
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

