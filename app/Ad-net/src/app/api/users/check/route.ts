import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // Get wallet address from query params
    const url = new URL(request.url);
    const walletAddress = url.searchParams.get('walletAddress');
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Missing required parameter: walletAddress' },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { walletAddress },
      select: { id: true }
    });
    
    return NextResponse.json({ exists: !!user });
  } catch (error) {
    console.error("Error checking user existence:", error);
    return NextResponse.json(
      { error: 'Failed to check user existence', message: String(error) },
      { status: 500 }
    );
  }
} 