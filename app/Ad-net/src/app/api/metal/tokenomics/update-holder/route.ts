import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress, holderAddress, name, username, role } = body;
    
    console.log("Received update request:", { walletAddress, holderAddress, role });
    
    if (!walletAddress || !holderAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: walletAddress and holderAddress', received: body },
        { status: 400 }
      );
    }

    try {
      const user = await prisma.user.upsert({
        where: { walletAddress },
        update: { 
          holderAddress 
        },
        create: {
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

      console.log("Successfully updated user:", user.id);
      return NextResponse.json({ success: true, userId: user.id });
      
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error("Prisma error:", error.code, error.meta);
        return NextResponse.json(
          { 
            error: 'Database operation failed', 
            message: error.message,
            code: error.code,
            meta: error.meta 
          },
          { status: 500 }
        );
      }
      console.error("Prisma error:", error);
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