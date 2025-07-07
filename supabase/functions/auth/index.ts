import { serve } from "https://deno.land/std@0.178.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  }

  try {
    const { email, password, action } = await req.json();

    if (!email || !password || !action) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
      });
    }

    if (action === "signup") {
      // Sign up user
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // bypass email confirm for demo - set false for production
      });
      if (error)
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
        });

      return new Response(JSON.stringify({ data }), { status: 200 });
    }

    if (action === "login") {
      // Sign in user and return JWT
      const { data, error } = await supabase.auth.admin.signInWithPassword({
        email,
        password,
      });
      if (error)
        return new Response(JSON.stringify({ error: error.message }), {
          status: 400,
        });

      return new Response(JSON.stringify({ data }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), {
      status: 400,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
    });
  }
});
