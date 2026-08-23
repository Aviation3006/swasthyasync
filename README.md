# SwasthyaSync (स्वास्थ्यसिंक)

**Maharashtra Public Healthcare Unified Full-Stack Digital Web Portal**

SwasthyaSync is a production-ready, full-stack healthcare web application designed for the Maharashtra public health ecosystem. It connects citizens, district hospitals, and district health officers with real-time data persistence, Supabase authentication, and server-side Google Gemini AI (`@google/genai`) multimodal analysis.

---

## 🏛️ System Architecture

```
swasthyasync/
├── server/                         # Server-side API layer for secure AI requests
│   └── geminiService.ts            # @google/genai integration with non-diagnostic clinical safety constraints
├── supabase/
│   └── migrations/
│       └── 20260823000000_swasthyasync_schema.sql # 13 PostgreSQL tables with Row Level Security (RLS)
├── src/
│   ├── lib/
│   │   └── supabase.ts             # Supabase client initializer with automatic Demo fallback
│   ├── types/                      # Domain interfaces (Auth, Patient, Hospital, EHR, AI, District)
│   ├── data/                       # Seed fixtures & Demo data layer
│   ├── services/                   # Service layer & repository abstraction
│   │   ├── authService.ts          # Supabase Auth & persistent session management
│   │   ├── aiService.ts            # Client interface for /api/report-simplify & /api/symptom-analysis
│   │   ├── patientService.ts       # Patient directory & profile repository
│   │   ├── appointmentService.ts   # 7-step OPD booking & queue transitions
│   │   ├── recordService.ts        # Longitudinal EHR & diagnostic reports
│   │   ├── symptomService.ts       # Symptom logger & AI preparation review
│   │   ├── prescriptionService.ts  # Multi-drug digital Rx builder
│   │   ├── hospitalService.ts      # Live Kanban triage queue & bed monitoring
│   │   ├── districtService.ts      # Public health surveillance & emergency alert dispatcher
│   │   ├── reportService.ts        # Diagnostic report summaries
│   │   └── notificationService.ts  # Category-tagged notification manager
│   ├── context/
│   │   ├── AuthContext.tsx         # Unified authentication state with session restoration
│   │   └── ToastContext.tsx        # Toast messaging
│   ├── layouts/                    # Auth, Patient, Hospital, District Admin layouts
│   └── pages/                      # 19 Functional web routes
├── .env.example                    # Documented configuration variables
├── vite.config.ts                  # Vite config with backend API plugin for Gemini
└── README.md
```

---

## ⚙️ Environment Variables Setup

Create a `.env` file in the root directory:

```env
# 1. Supabase Backend Configuration (Required for Real Database & Auth)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# 2. Google Gemini API Key (Server-Side Only)
# Get a key from Google AI Studio: https://aistudio.google.com/
GEMINI_API_KEY=your-gemini-api-key-here

# 3. Environment
NODE_ENV=development
```

> **NOTE:** If `VITE_SUPABASE_URL` or `GEMINI_API_KEY` are not provided, SwasthyaSync **automatically runs in Full Demo Mode**, enabling seamless 1-click persona logins and realistic simulated clinical templates.

---

## 🗄️ Database Setup (Supabase PostgreSQL)

1. Create a new project on [Supabase](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste and run the contents of [`supabase/migrations/20260823000000_swasthyasync_schema.sql`](supabase/migrations/20260823000000_swasthyasync_schema.sql).
4. The migration automatically provisions:
   - 13 Relational Tables (`profiles`, `patients`, `hospitals`, `hospital_staff`, `districts`, `appointments`, `medical_records`, `lab_reports`, `prescriptions`, `symptom_entries`, `notifications`, `consents`, `audit_logs`).
   - Granular **Row Level Security (RLS)** policies protecting patient records and hospital access.

---

## 🤖 Google Gemini AI Setup (`@google/genai`)

1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. Add `GEMINI_API_KEY=your-key` to `.env`.
3. The server-side API endpoints (`POST /api/report-simplify` and `POST /api/symptom-analysis`) use Google's current `gemini-2.5-flash` model.
4. **Safety Directives Enforced**:
   - The AI **never diagnoses** or prescribes drugs.
   - It outputs bilingual (English + Marathi) explanations, extracts numerical biomarkers against laboratory reference ranges, prepares questions for the patient's doctor, and flags emergency red flags (calling 108).

---

## 🚀 Running the Web Application

```bash
# Install dependencies
npm install

# Start Vite dev server with Gemini backend API
npm run dev

# Run TypeScript checks
npm run lint

# Build for production
npm run build
```

---

## 🌐 Routes & Portal Access

- **Authentication**:
  - `/login`: 1-Click Demo Persona selector or Supabase Email/Password login
  - `/signup`: New profile registration with role selection (Citizen, Hospital, Admin)
  - `/forgot-password`: Password recovery flow
  - `/reset-password`: Set new password
- **Patient Portal** (`/patient`):
  - Dashboard, Profile, Health Records, 7-Step Appointment Booking, Symptom Diary, Report Simplifier, Health QR, Notifications, Settings.
- **Hospital Clinical Portal** (`/hospital`):
  - Dashboard, 360° Patient Directory, OPD Schedule, Live Kanban Triage Board, Multi-Drug Prescription Builder, Diagnostic Sign-Off.
- **District Health Administration** (`/district-admin`):
  - Command Center, 28-Hospital Capacity Matrix, Recharts Epidemiological Analytics, DPH Reports, Emergency Alert Broadcast Dispatcher.
