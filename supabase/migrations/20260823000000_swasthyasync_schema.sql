-- ================================================================
-- SWASTHYASYNC PRODUCTION POSTGRESQL SCHEMA & RLS MIGRATION
-- Maharashtra Public Healthcare Unified Digital Ecosystem
-- ================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES (Idempotent creation)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role_enum') THEN
    CREATE TYPE user_role_enum AS ENUM ('patient', 'hospital', 'district_admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status_enum') THEN
    CREATE TYPE appointment_status_enum AS ENUM ('Upcoming', 'Checked In', 'In Consultation', 'Completed', 'Cancelled', 'No Show');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'queue_status_enum') THEN
    CREATE TYPE queue_status_enum AS ENUM ('Waiting', 'In Consultation', 'Completed', 'Urgent', 'Transferred');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'symptom_severity_enum') THEN
    CREATE TYPE symptom_severity_enum AS ENUM ('Mild', 'Moderate', 'Severe', 'Critical');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'record_type_enum') THEN
    CREATE TYPE record_type_enum AS ENUM ('Medical Visit', 'Lab Report', 'Prescription', 'Radiology / Scan', 'Discharge Summary', 'Immunization');
  END IF;
END $$;

-- 3. PROFILES TABLE (Public profile linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role user_role_enum NOT NULL DEFAULT 'patient',
  facility_name TEXT,
  district TEXT NOT NULL DEFAULT 'Pune',
  state TEXT NOT NULL DEFAULT 'Maharashtra',
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. HOSPITALS TABLE
CREATE TABLE IF NOT EXISTS public.hospitals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  facility_type TEXT NOT NULL,
  district TEXT NOT NULL DEFAULT 'Pune',
  taluka TEXT NOT NULL,
  pincode TEXT,
  contact_number TEXT,
  emergency_helpline TEXT,
  address TEXT NOT NULL,
  beds JSONB NOT NULL DEFAULT '{"generalTotal": 100, "generalOccupied": 70, "icuTotal": 15, "icuOccupied": 10, "oxygenTotal": 30, "oxygenOccupied": 20, "maternityTotal": 20, "maternityOccupied": 12, "pediatricTotal": 15, "pediatricOccupied": 8}',
  operational_status TEXT NOT NULL DEFAULT 'Normal',
  ambulance_available INT NOT NULL DEFAULT 4,
  blood_bank_units INT NOT NULL DEFAULT 50,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PATIENTS TABLE
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE,
  abha_id TEXT UNIQUE NOT NULL,
  abha_address TEXT,
  name TEXT NOT NULL,
  name_marathi TEXT,
  dob DATE NOT NULL DEFAULT '1978-05-14',
  age INT NOT NULL DEFAULT 48,
  gender TEXT NOT NULL DEFAULT 'Male',
  blood_group TEXT NOT NULL DEFAULT 'B+',
  phone TEXT NOT NULL DEFAULT '+91 98224 51902',
  email TEXT,
  aadhaar_masked TEXT DEFAULT 'XXXX-XXXX-4819',
  address JSONB NOT NULL DEFAULT '{"village": "Wagholi", "taluka": "Haveli", "district": "Pune", "state": "Maharashtra", "pincode": "412207"}',
  emergency_contact JSONB NOT NULL DEFAULT '{"name": "Sunita Jadhav", "relation": "Spouse", "phone": "+91 98224 51903"}',
  vitals JSONB NOT NULL DEFAULT '{"bloodPressure": "120/80", "heartRate": 72, "bloodSugarFasting": 95, "spO2": 98, "temperature": 98.4}',
  allergies JSONB NOT NULL DEFAULT '[]',
  chronic_conditions JSONB NOT NULL DEFAULT '["Type 2 Diabetes Mellitus", "Essential Hypertension"]',
  active_scheme TEXT NOT NULL DEFAULT 'Mahatma Jyotirao Phule Jan Arogya Yojana (MJPJAY)',
  registered_hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. HOSPITAL STAFF / DOCTORS TABLE
CREATE TABLE IF NOT EXISTS public.hospital_staff (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
  department_name TEXT NOT NULL,
  specialization TEXT NOT NULL,
  qualification TEXT NOT NULL,
  opd_timings TEXT NOT NULL DEFAULT '09:00 AM - 02:00 PM',
  room_number TEXT,
  status TEXT NOT NULL DEFAULT 'On Duty',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. DISTRICTS TABLE
CREATE TABLE IF NOT EXISTS public.districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Pune',
  state TEXT NOT NULL DEFAULT 'Maharashtra',
  total_hospitals INT NOT NULL DEFAULT 28,
  total_phcs INT NOT NULL DEFAULT 96,
  total_subcentres INT NOT NULL DEFAULT 540,
  bed_occupancy_rate NUMERIC(5,2) NOT NULL DEFAULT 81.40,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token_number TEXT NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE CASCADE,
  department_id TEXT NOT NULL,
  department_name TEXT NOT NULL,
  doctor_id UUID REFERENCES public.hospital_staff(id) ON DELETE SET NULL,
  doctor_name TEXT NOT NULL,
  date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'OPD General',
  status appointment_status_enum NOT NULL DEFAULT 'Upcoming',
  reason TEXT NOT NULL,
  symptoms TEXT[] DEFAULT '{}',
  room_number TEXT,
  cancellation_reason TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. MEDICAL RECORDS TABLE
CREATE TABLE IF NOT EXISTS public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  record_type record_type_enum NOT NULL,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  hospital_name TEXT NOT NULL,
  department TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  doctor_registration_no TEXT,
  summary TEXT NOT NULL,
  diagnosis TEXT,
  chief_complaints TEXT[] DEFAULT '{}',
  findings TEXT,
  doctor_notes TEXT,
  vital_signs_recorded JSONB,
  attachments JSONB NOT NULL DEFAULT '[]',
  biomarkers JSONB NOT NULL DEFAULT '[]',
  digital_signature_hash TEXT NOT NULL DEFAULT 'ABDM-SIG-VERIFIED',
  is_verified BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. LAB REPORTS TABLE (SIMPLIFIED / PATIENT-FACING)
CREATE TABLE IF NOT EXISTS public.lab_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID REFERENCES public.medical_records(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  test_category TEXT NOT NULL,
  report_date DATE NOT NULL,
  overall_summary TEXT NOT NULL,
  overall_summary_marathi TEXT,
  key_findings JSONB NOT NULL DEFAULT '[]',
  biomarkers JSONB NOT NULL DEFAULT '[]',
  recommended_questions TEXT[] DEFAULT '{}',
  disclaimer TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. PRESCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS public.prescriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prescription_number TEXT UNIQUE NOT NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  patient_name TEXT NOT NULL,
  doctor_id UUID REFERENCES public.hospital_staff(id) ON DELETE SET NULL,
  doctor_name TEXT NOT NULL,
  doctor_registration_no TEXT,
  hospital_id UUID REFERENCES public.hospitals(id) ON DELETE SET NULL,
  hospital_name TEXT NOT NULL,
  department TEXT NOT NULL,
  date DATE NOT NULL,
  diagnosis TEXT NOT NULL,
  chief_complaint TEXT,
  medications JSONB NOT NULL DEFAULT '[]',
  general_advice TEXT,
  follow_up_date DATE,
  dispensing_status TEXT NOT NULL DEFAULT 'Pending',
  digital_signature_hash TEXT NOT NULL DEFAULT 'ABDM-RX-SIG-0921',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. SYMPTOM ENTRIES TABLE
CREATE TABLE IF NOT EXISTS public.symptom_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  body_area TEXT NOT NULL,
  symptom_name TEXT NOT NULL,
  severity symptom_severity_enum NOT NULL,
  duration TEXT NOT NULL,
  start_date DATE NOT NULL,
  triggers_or_notes TEXT,
  associated_symptoms TEXT[] DEFAULT '{}',
  ai_analysis JSONB,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id TEXT NOT NULL,
  title TEXT NOT NULL,
  title_marathi TEXT,
  message TEXT NOT NULL,
  message_marathi TEXT,
  category TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  action_url TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. CONSENTS TABLE
CREATE TABLE IF NOT EXISTS public.consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE UNIQUE,
  allow_emergency_access BOOLEAN NOT NULL DEFAULT TRUE,
  share_records_empaneled BOOLEAN NOT NULL DEFAULT TRUE,
  share_allergy_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  share_past_records_30_days BOOLEAN NOT NULL DEFAULT TRUE,
  notify_on_access BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 15. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  target_table TEXT NOT NULL,
  target_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ================================================================
-- HELPER FUNCTIONS & AUTOMATIC USER PROVISIONING TRIGGERS
-- ================================================================

-- Helper function to inspect current user role safely from JWT claims (Zero Recursion)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role_enum AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role')::user_role_enum,
    (auth.jwt() -> 'app_metadata' ->> 'role')::user_role_enum,
    'patient'::user_role_enum
  );
$$ LANGUAGE sql STABLE;

-- Trigger: Automatically provision public.profiles & default patient data on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role user_role_enum;
  user_full_name TEXT;
  user_phone TEXT;
  user_facility TEXT;
  new_patient_id UUID;
BEGIN
  -- Safely extract and cast role (default to 'patient')
  BEGIN
    assigned_role := (LOWER(COALESCE(NEW.raw_user_meta_data->>'role', 'patient')))::user_role_enum;
  EXCEPTION WHEN OTHERS THEN
    assigned_role := 'patient'::user_role_enum;
  END;

  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Citizen User');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '+91 98224 00000');
  user_facility := NEW.raw_user_meta_data->>'facility_name';

  -- 1. Insert Profile
  INSERT INTO public.profiles (id, email, full_name, role, facility_name, phone, district, state)
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    assigned_role,
    user_facility,
    user_phone,
    'Pune',
    'Maharashtra'
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      role = EXCLUDED.role,
      phone = EXCLUDED.phone,
      facility_name = EXCLUDED.facility_name,
      updated_at = NOW();

  -- 2. If user is a patient, auto-create matching patient & consent records
  IF assigned_role = 'patient' THEN
    INSERT INTO public.patients (
      profile_id, abha_id, abha_address, name, phone, email,
      dob, age, gender, blood_group, address, emergency_contact, vitals
    )
    VALUES (
      NEW.id,
      CONCAT('91-', LPAD(FLOOR(RANDOM()*10000)::TEXT, 4, '0'), '-', LPAD(FLOOR(RANDOM()*10000)::TEXT, 4, '0'), '-', LPAD(FLOOR(RANDOM()*10000)::TEXT, 4, '0')),
      CONCAT(LOWER(REGEXP_REPLACE(user_full_name, '[^a-zA-Z0-9]', '', 'g')), '@abdm'),
      user_full_name,
      user_phone,
      NEW.email,
      '1978-05-14',
      48,
      'Male',
      'B+',
      '{"village": "Wagholi", "taluka": "Haveli", "district": "Pune", "state": "Maharashtra", "pincode": "412207"}'::jsonb,
      '{"name": "Emergency Contact", "relation": "Family", "phone": "+91 98224 00000"}'::jsonb,
      '{"bloodPressure": "120/80", "heartRate": 72, "bloodSugarFasting": 95, "spO2": 98, "temperature": 98.4}'::jsonb
    )
    ON CONFLICT (profile_id) DO NOTHING
    RETURNING id INTO new_patient_id;

    IF new_patient_id IS NOT NULL THEN
      INSERT INTO public.consents (patient_id)
      VALUES (new_patient_id)
      ON CONFLICT (patient_id) DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'handle_new_user notice: %', SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospitals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hospital_staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lab_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.symptom_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies (Non-Recursive)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id OR public.get_current_user_role() = 'district_admin');

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 2. Hospitals Policies (Public read for facilities directory)
DROP POLICY IF EXISTS "Public can view hospital directory" ON public.hospitals;
CREATE POLICY "Public can view hospital directory" ON public.hospitals
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Hospital and Admin can update hospital" ON public.hospitals;
CREATE POLICY "Hospital and Admin can update hospital" ON public.hospitals
  FOR ALL USING (public.get_current_user_role() IN ('hospital', 'district_admin'));

-- 3. Hospital Staff Policies (Public read for doctor OPD timings)
DROP POLICY IF EXISTS "Public can view doctors" ON public.hospital_staff;
CREATE POLICY "Public can view doctors" ON public.hospital_staff
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Hospital staff manage doctors" ON public.hospital_staff;
CREATE POLICY "Hospital staff manage doctors" ON public.hospital_staff
  FOR ALL USING (public.get_current_user_role() IN ('hospital', 'district_admin'));

-- 4. Districts Policies
DROP POLICY IF EXISTS "Public view district stats" ON public.districts;
CREATE POLICY "Public view district stats" ON public.districts
  FOR SELECT USING (TRUE);

DROP POLICY IF EXISTS "Admin update district stats" ON public.districts;
CREATE POLICY "Admin update district stats" ON public.districts
  FOR ALL USING (public.get_current_user_role() = 'district_admin');

-- 5. Patients Policies
DROP POLICY IF EXISTS "Patients view own data" ON public.patients;
CREATE POLICY "Patients view own data" ON public.patients
  FOR SELECT USING (
    profile_id = auth.uid() 
    OR public.get_current_user_role() IN ('hospital', 'district_admin')
  );

DROP POLICY IF EXISTS "Patients update own data" ON public.patients;
CREATE POLICY "Patients update own data" ON public.patients
  FOR UPDATE USING (
    profile_id = auth.uid()
    OR public.get_current_user_role() IN ('hospital', 'district_admin')
  );

DROP POLICY IF EXISTS "Patients insert own data" ON public.patients;
CREATE POLICY "Patients insert own data" ON public.patients
  FOR INSERT WITH CHECK (
    profile_id = auth.uid()
    OR public.get_current_user_role() IN ('hospital', 'district_admin')
  );

-- 6. Consents Policies
DROP POLICY IF EXISTS "Patients manage consents" ON public.consents;
CREATE POLICY "Patients manage consents" ON public.consents
  FOR ALL USING (
    patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid())
    OR public.get_current_user_role() IN ('hospital', 'district_admin')
  );

-- 7. Appointments Policies
DROP POLICY IF EXISTS "Appointment access policy" ON public.appointments;
CREATE POLICY "Appointment access policy" ON public.appointments
  FOR ALL USING (
    patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid())
    OR public.get_current_user_role() IN ('hospital', 'district_admin')
  );

-- 8. Medical Records Policies
DROP POLICY IF EXISTS "Medical records read policy" ON public.medical_records;
CREATE POLICY "Medical records read policy" ON public.medical_records
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid())
    OR public.get_current_user_role() IN ('hospital', 'district_admin')
  );

DROP POLICY IF EXISTS "Hospital create medical records" ON public.medical_records;
CREATE POLICY "Hospital create medical records" ON public.medical_records
  FOR INSERT WITH CHECK (public.get_current_user_role() IN ('hospital', 'district_admin'));

DROP POLICY IF EXISTS "Hospital update medical records" ON public.medical_records;
CREATE POLICY "Hospital update medical records" ON public.medical_records
  FOR UPDATE USING (public.get_current_user_role() IN ('hospital', 'district_admin'));

-- 9. Lab Reports Policies
DROP POLICY IF EXISTS "Lab reports read policy" ON public.lab_reports;
CREATE POLICY "Lab reports read policy" ON public.lab_reports
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid())
    OR public.get_current_user_role() IN ('hospital', 'district_admin')
  );

DROP POLICY IF EXISTS "Hospital manage lab reports" ON public.lab_reports;
CREATE POLICY "Hospital manage lab reports" ON public.lab_reports
  FOR ALL USING (public.get_current_user_role() IN ('hospital', 'district_admin'));

-- 10. Prescriptions Policies
DROP POLICY IF EXISTS "Prescription read policy" ON public.prescriptions;
CREATE POLICY "Prescription read policy" ON public.prescriptions
  FOR SELECT USING (
    patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid())
    OR public.get_current_user_role() IN ('hospital', 'district_admin')
  );

DROP POLICY IF EXISTS "Hospital manage prescriptions" ON public.prescriptions;
CREATE POLICY "Hospital manage prescriptions" ON public.prescriptions
  FOR ALL USING (public.get_current_user_role() IN ('hospital', 'district_admin'));

-- 11. Symptom Entries Policies
DROP POLICY IF EXISTS "Symptom entries access" ON public.symptom_entries;
CREATE POLICY "Symptom entries access" ON public.symptom_entries
  FOR ALL USING (
    patient_id IN (SELECT id FROM public.patients WHERE profile_id = auth.uid())
    OR public.get_current_user_role() IN ('hospital', 'district_admin')
  );

-- 12. Notifications Policies
DROP POLICY IF EXISTS "Notification read policy" ON public.notifications;
CREATE POLICY "Notification read policy" ON public.notifications
  FOR SELECT USING (
    recipient_id = auth.uid()::TEXT 
    OR recipient_id = 'all'
    OR (recipient_id = 'hospital_staff' AND public.get_current_user_role() = 'hospital')
    OR (recipient_id = 'district_admin' AND public.get_current_user_role() = 'district_admin')
  );

DROP POLICY IF EXISTS "Notification update policy" ON public.notifications;
CREATE POLICY "Notification update policy" ON public.notifications
  FOR UPDATE USING (
    recipient_id = auth.uid()::TEXT 
    OR recipient_id = 'all'
    OR (recipient_id = 'hospital_staff' AND public.get_current_user_role() = 'hospital')
    OR (recipient_id = 'district_admin' AND public.get_current_user_role() = 'district_admin')
  );

-- 13. Audit Logs Policies
DROP POLICY IF EXISTS "Admin view audit logs" ON public.audit_logs;
CREATE POLICY "Admin view audit logs" ON public.audit_logs
  FOR SELECT USING (public.get_current_user_role() = 'district_admin');

DROP POLICY IF EXISTS "Authenticated users insert audit logs" ON public.audit_logs;
CREATE POLICY "Authenticated users insert audit logs" ON public.audit_logs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
