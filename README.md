Sure! Here’s the **README.md** file content only:

```markdown
# 📊 Employee Attendance System (Supabase + Edge Functions + Geolocation)

This is a secure and location-based employee attendance system built using **Supabase**, **Deno Edge Functions**, and **Vanilla HTML/CSS/JS**. Users can only check in/out when they're within a specific location radius. Admins can view all attendance records.

---

## 🔐 Features

- 🔐 Supabase **Edge Function Auth** (secure signup/login/reset)
- 📍 **Geolocation-based** check-in/check-out (within 100m of office)
- 💾 Attendance data saved in **Supabase table**
- 📊 **Admin panel** to view all logs
- 🧭 Real-time location + clock UI
- ✨ Clean, responsive frontend using only **HTML/CSS/JS**
- ⚡ Runs on **Deno + Supabase Edge Functions**

---

## 🗂️ Folder Structure

```

employee-attendance/
├── .env.example
├── .gitignore
├── deno.json
├── README.md
│
├── .vscode/
│   └── settings.json
│
├── public/
│   ├── admin.html            # Admin panel (view all attendance)
│   ├── dashboard.html        # Main dashboard for check-in/out
│   ├── index.html            # Login/Signup
│   └── reset-password.html   # Reset password form
│
└── supabase/
├── config.toml           # Supabase local config
├── .temp/                # Supabase CLI internal files
└── functions/
├── attendance/
│   └── index.ts      # Handle attendance check-in/out
├── auth/
│   └── index.ts      # Signup/Login logic
└── reset-password/
└── reset-password.ts

````

---

## 📍 Location Logic

Employees can only check in/out when they're physically near the office.

- **Company Latitude:** `23.6650496`
- **Company Longitude:** `58.1992448`
- **Allowed Radius:** `100 meters`

This is verified on the client using the **Geolocation API** and **Haversine formula**.

---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/YOUR_USERNAME/employee-attendance.git
cd employee-attendance
````

### 2. Setup `.env`

Copy and rename `.env.example`:

```bash
cp .env.example .env
```

Fill in your Supabase details (URL, anon/public keys if needed).

### 3. Install Supabase CLI

```bash
npm install -g supabase
```

Or follow: [https://supabase.com/docs/guides/cli](https://supabase.com/docs/guides/cli)

### 4. Login & Deploy Edge Functions

```bash
supabase login
supabase functions deploy auth
supabase functions deploy attendance
supabase functions deploy reset-password
```

---

## 🧪 Admin Panel Access

The admin panel is at:

```
public/admin.html
```

Authorization is currently handled via email check or session token from Supabase. You can refactor it to use **Supabase Roles or Policies** for better security.

---

## 👨‍💻 About the Developer

This project was built by a passionate Cybersecurity student and future **Red Teamer** — focused on **secure development**, **offensive security**, and building tools that mimic real-world attack scenarios while applying strong defense principles.

---

## 📃 License

MIT License.

```

Let me know if you want it adjusted!
```
