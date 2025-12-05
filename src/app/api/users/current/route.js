// /api/users/current/route.js
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";
import { cookies } from 'next/headers';

export async function GET(req) {
  try {
    await dbConnect();
    
    // Get email from query params
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    
    // Or get from cookies
    const cookieStore = cookies();
    const userEmailFromCookie = cookieStore.get('userEmail')?.value;
    
    const userEmail = email || userEmailFromCookie;
    
    if (!userEmail) {
      return Response.json({ 
        success: false, 
        message: "Email not provided" 
      }, { status: 400 });
    }
    
    // Find user by email
    const user = await User.findOne({ email: userEmail }).select("-password");
    
    if (!user) {
      return Response.json({ 
        success: false, 
        message: "User not found" 
      }, { status: 404 });
    }
    
    return Response.json({ 
      success: true, 
      user 
    });
    
  } catch (error) {
    console.error("Get current user error:", error);
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}