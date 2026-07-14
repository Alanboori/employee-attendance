# Employee Attendance System

A location-based employee attendance system using Supabase, Deno Edge Functions, and vanilla HTML/CSS/JS. Users can only check in or out when they are within a specific radius of the office location. Admins can view all attendance records.

## Features

- Supabase Edge Function Auth (signup, login, reset)
- Geolocation-based check-in and check-out (100m office radius)
- Attendance records stored in Supabase
- Admin panel to view all logs
- Real-time clock and location display
- Clean responsive frontend using HTML/CSS/JS
- Runs on Deno + Supabase Edge Functions

## Setup

1. Clone the repo
2. Set up .env with your Supabase project details
3. Login to Supabase: 
px supabase login`n4. Deploy functions: 
px supabase functions deploy auth attendance reset-password`n
## License

MIT
