// app/api/test-connection/route.js
import dbConnect from "@/lib/mongoose";

export async function GET(req) {
  try {
    await dbConnect();
    return new Response(
      JSON.stringify({ message: "MongoDB connected successfully with Mongoose!" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
