// app/api/users/last-login/route.js
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: "Email is required" 
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { lastLogin: new Date() } },
      { new: true }
    );

    if (!updatedUser) {
      console.log(`User with email ${email} not found in database`);
      return new Response(
        JSON.stringify({ 
          success: false,
          message: "User not found in database" 
        }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Last login time updated successfully",
        lastLogin: updatedUser.lastLogin.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
        timestamp: updatedUser.lastLogin
      }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (err) {
    console.error("Error updating last login:", err);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: err.message 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// GET to retrieve last login for a user
export async function GET(req) {
  try {
    await dbConnect();
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    if (!email) {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: "Email parameter is required" 
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const user = await User.findOne({ email: email.toLowerCase() })
      .select("name email lastLogin");

    if (!user) {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: "User not found" 
        }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          name: user.name,
          email: user.email,
          lastLogin: user.lastLogin 
            ? user.lastLogin.toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
            : "Never logged in",
          lastLoginRaw: user.lastLogin
        }
      }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (err) {
    console.error("Error fetching last login:", err);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: err.message 
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
}