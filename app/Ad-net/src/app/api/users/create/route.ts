import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Log raw request headers 
    console.log("Request headers:", Object.fromEntries([...request.headers.entries()]));
    
    // Get the raw request body as text first
    const bodyText = await request.text();
    console.log("Raw request body:", bodyText);
    
    // Try to parse as JSON
    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (parseError) {
      console.error("Failed to parse request body as JSON:", parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    console.log("Parsed request body:", body);
    const { walletAddress, holderAddress, name, username, role } = body;
    
    console.log("Creating new user with extracted values:", { 
      walletAddress, 
      holderAddress, 
      role,
      bodyKeys: Object.keys(body) 
    });
    
    if (!walletAddress || !holderAddress) {
      return NextResponse.json(
        { 
          error: 'Missing required fields: walletAddress and holderAddress',
          received: { 
            hasWalletAddress: !!walletAddress, 
            hasHolderAddress: !!holderAddress,
            body 
          }
        },
        { status: 400 }
      );
    }

    try {
      const user = await prisma.user.create({
        data: {
          walletAddress,
          holderAddress,
          name: name || `User-${walletAddress.slice(0, 6)}`,
          username: username || `user-${walletAddress.slice(0, 6).toLowerCase()}`,
          role: role || "Advertiser",
          balances: {
            create: {
              USDC: 0,
              ADC: 0
            }
          }
        }
      });

      console.log("Successfully created user:", user.id);
      return NextResponse.json({ success: true, userId: user.id });
      
    } catch (error) {
      console.error("Database error creating user:", error);
      return NextResponse.json(
        { error: 'Database operation failed', message: String(error) },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: 'Failed to process request', message: String(error) },
      { status: 500 }
    );
  }
} 