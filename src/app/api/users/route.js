// app/api/users/route.js
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

// GET all users
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find().select("-password"); // Exclude password for security

    const usersWithBangladeshTime = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      enrolledCourses: user.enrolledCourses,
      bio: user.bio,
      socialLogin: user.socialLogin,
      lastLogin: user.lastLogin 
        ? user.lastLogin.toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
        : "Never logged in", // 👈 Add last login
      createdAt: user.createdAt.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
      updatedAt: user.updatedAt.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
    }));

    return new Response(JSON.stringify(usersWithBangladeshTime), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// POST new user
export async function POST(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { name, email, password, role, avatar, bio, socialLogin } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: "User already exists" 
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const newUser = await User.create({
      name,
      email,
      password,
      role: role || "user",
      avatar: avatar || "",
      bio: bio || "",
      socialLogin: socialLogin !== undefined ? socialLogin : false,
    });

    const userWithBangladeshTime = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      avatar: newUser.avatar,
      socialLogin: newUser.socialLogin,
      bio: newUser.bio,
      lastLogin: "Never logged in", // New users haven't logged in yet
      createdAt: newUser.createdAt.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
      updatedAt: newUser.updatedAt.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: "User created successfully",
        user: userWithBangladeshTime
      }), 
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (err) {
    console.error("Error creating user:", err);
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

// PUT to update user (including last login)
export async function PUT(req) {
  try {
    await dbConnect();
    const body = await req.json();
    const { email, lastLogin, ...updateData } = body;

    if (!email) {
      return new Response(
        JSON.stringify({ 
          success: false,
          message: "Email is required" 
        }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Build update object
    const updateObject = {};
    if (lastLogin !== undefined) {
      updateObject.lastLogin = lastLogin === "now" ? new Date() : new Date(lastLogin);
    }
    if (Object.keys(updateData).length > 0) {
      Object.assign(updateObject, updateData);
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: updateObject },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
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
        message: "User updated successfully",
        user: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          lastLogin: updatedUser.lastLogin 
            ? updatedUser.lastLogin.toLocaleString("en-US", { timeZone: "Asia/Dhaka" })
            : "Never logged in",
          updatedAt: updatedUser.updatedAt.toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
        }
      }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (err) {
    console.error("Error updating user:", err);
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