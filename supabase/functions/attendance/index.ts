import { serve } from "https://deno.land/std@0.178.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const COMPANY_LOCATION = {
  latitude: 40.7128,
  longitude: -74.006,
  radius: 100, // meters
};

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

serve(async (req) => {
  if (req.method === "POST") {
    // POST attendance record (checkin/checkout)
    try {
      const authHeader = req.headers.get("authorization") || "";
      if (!authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      }
      const token = authHeader.split(" ")[1];

      // Verify token and get user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(token);
      if (userError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      }

      const { type, latitude, longitude } = await req.json();

      if (!type || !latitude || !longitude) {
        return new Response(JSON.stringify({ error: "Missing fields" }), {
          status: 400,
        });
      }
      if (type !== "checkin" && type !== "checkout") {
        return new Response(
          JSON.stringify({ error: "Invalid attendance type" }),
          { status: 400 }
        );
      }

      // Check location radius
      const dist = getDistance(
        latitude,
        longitude,
        COMPANY_LOCATION.latitude,
        COMPANY_LOCATION.longitude
      );
      if (dist > COMPANY_LOCATION.radius) {
        return new Response(
          JSON.stringify({ error: "You are outside the allowed location" }),
          { status: 403 }
        );
      }

      // Insert attendance record into table
      const { error: insertError } = await supabase
        .from("attendance")
        .insert({
          user_id: user.id,
          type,
          latitude,
          longitude,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 500,
        });
      }

      return new Response(JSON.stringify({ message: "Attendance recorded" }), {
        status: 200,
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
      });
    }
  } else if (req.method === "GET") {
    // Return recent attendance records for user (authenticated)
    try {
      const authHeader = req.headers.get("authorization") || "";
      if (!authHeader.startsWith("Bearer ")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      }
      const token = authHeader.split(" ")[1];

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser(token);
      if (userError || !user) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
        });
      }

      const url = new URL(req.url);
      const limitParam = url.searchParams.get("limit");
      const limit = limitParam ? parseInt(limitParam) : 10;

      const { data, error } = await supabase
        .from("attendance")
        .select("type, latitude, longitude, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
        });
      }

      return new Response(JSON.stringify({ data }), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ error: "Invalid request" }), {
        status: 400,
      });
    }
  }

  return new Response(JSON.stringify({ error: "Method not allowed" }), {
    status: 405,
  });
});
