import { NextResponse } from "next/server";
import { callMetalAPI } from "../../route";
import { prisma } from "@/lib/prisma";

// Get ADC token address from environment
const ADC_TOKEN_ADDRESS = process.env.ADC_TOKEN_ADDRESS || "0x1234567890abcdef1234567890abcdef12345678";

// This endpoint withdraws tokens from a holder to a specified address
export async function POST(req: Request) {
  try {
    const { holderId, amount, toAddress, campaignId } = await req.json();
    
    console.log("Withdrawing tokens from holder:", holderId, "amount:", amount, "to:", toAddress);
    
    if (!holderId || !amount || !toAddress) {
      return NextResponse.json(
        { error: "Missing required parameters: holderId, amount, and toAddress are required" },
        { status: 400 }
      );
    }
    
    // If campaignId is provided, verify the campaign
    if (campaignId) {
      const campaign = await prisma.campaign.findUnique({
        where: { id: campaignId }
      });
      
      if (!campaign) {
        return NextResponse.json(
          { error: "Campaign not found" },
          { status: 404 }
        );
      }
    }
    
    // Call Metal API to withdraw tokens
    const withdrawResponse = await callMetalAPI(
      `/holder/${holderId}/withdraw`,
      "POST",
      {
        tokenAddress: ADC_TOKEN_ADDRESS,
        amount: parseFloat(amount.toString()),
        toAddress
      }
    );
    
    console.log("Metal API withdraw response:", withdrawResponse);
    
    // If campaign ID is provided, update campaign budget
    if (campaignId && withdrawResponse.success) {
      await prisma.campaign.update({
        where: { id: campaignId },
        data: { 
          totalBudget: { increment: parseFloat(amount.toString()) },
          remainingBudget: { increment: parseFloat(amount.toString()) }
        }
      });
      
      // Create a transaction record
      await prisma.transaction.create({
        data: {
          type: "CAMPAIGN_FUNDING",
          amount: parseFloat(amount.toString()),
          token: "ADC",
          status: "COMPLETED",
          txHash: withdrawResponse.transaction?.hash || null,
          userId: (await prisma.campaign.findUnique({
            where: { id: campaignId },
            select: { advertiserId: true }
          }))?.advertiserId || ""
        }
      });
    }
    
    return NextResponse.json({
      success: true,
      message: "Successfully withdrew tokens",
      transaction: withdrawResponse.transaction || null,
      amount
    });
    
  } catch (error) {
    console.error("Error in withdraw-tokens:", error);
    return NextResponse.json(
      { error: "Failed to withdraw tokens", details: (error as Error).message },
      { status: 500 }
    );
  }
} 