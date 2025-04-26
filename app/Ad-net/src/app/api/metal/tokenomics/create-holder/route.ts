import { NextResponse } from "next/server";
import { callMetalAPI } from "../../route";

// This endpoint creates a new holder account in Metal
export async function POST(req: Request) {
  try {
    const { userId, userType } = await req.json();
    
    console.log("Creating Metal holder for:", userId, userType);
    
    if (!userId) {
      return NextResponse.json(
        { error: "Missing required parameter: userId" },
        { status: 400 }
      );
    }
    
    // Valid user types
    const validUserTypes = ["advertiser", "display_owner"];
    if (userType && !validUserTypes.includes(userType)) {
      return NextResponse.json(
        { error: `Invalid userType. Must be one of: ${validUserTypes.join(", ")}` },
        { status: 400 }
      );
    }
    
    // Create holder in Metal
    const holderResponse = await callMetalAPI(
      `/holder/${userId}`,
      "PUT"
    );
    
    console.log("Metal API holder response:", holderResponse);
    
    // Make sure the response has the expected structure
    if (!holderResponse?.address) {
      console.error("Invalid holder response from Metal:", holderResponse);
      return NextResponse.json(
        { error: "Invalid holder response from Metal API", details: holderResponse },
        { status: 500 }
      );
    }
    
    // Transform the response to include a holder object with address
    const responseData = {
      success: true,
      message: `Successfully created ${userType || "user"} holder account`,
      holder: {
        address: holderResponse.address,
        id: holderResponse.id || userId
      }
    };
    
    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error("Error in create-holder:", error);
    return NextResponse.json(
      { error: "Failed to create holder account", details: (error as Error).message },
      { status: 500 }
    );
  }
} 