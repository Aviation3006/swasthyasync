-- =============================================================================
-- SWASTHYASYNC MIGRATION: ENFORCE PATIENT-ONLY PUBLIC SIGNUP & DYNAMIC DEMOGRAPHICS
-- =============================================================================

-- 1. Ensure abha_id is optional in public.patients (CareSetu is primary)
ALTER TABLE public.patients ALTER COLUMN abha_id DROP NOT NULL;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS care_setu_id TEXT;
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS care_setu_status TEXT DEFAULT 'Active';
ALTER TABLE public.patients ADD COLUMN IF NOT EXISTS care_setu_issue_date DATE DEFAULT CURRENT_DATE;

-- 2. Secure handle_new_user() trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role user_role_enum;
  user_full_name TEXT;
  user_phone TEXT;
  user_dob DATE;
  user_age INT;
  user_gender TEXT;
  user_blood_group TEXT;
  user_state TEXT;
  user_district TEXT;
  user_city TEXT;
  user_locality TEXT;
  user_pin TEXT;
  user_height NUMERIC;
  user_weight NUMERIC;
  user_allergies JSONB;
  user_conditions JSONB;
  user_medications JSONB;
  user_em_name TEXT;
  user_em_phone TEXT;
  user_em_rel TEXT;
BEGIN
  -- CRITICAL AUTHORIZATION BOUNDARY:
  -- Public Auth Signups ALWAYS receive 'patient' role by default.
  -- Client metadata role overrides are ignored for public signups.
  assigned_role := 'patient'::user_role_enum;

  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Citizen User');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '+91 98000 00000');
  
  -- Demographics
  user_dob := (NULLIF(NEW.raw_user_meta_data->>'dob', ''))::DATE;
  user_age := (NULLIF(NEW.raw_user_meta_data->>'age', ''))::INT;
  user_gender := COALESCE(NULLIF(NEW.raw_user_meta_data->>'gender', ''), 'Male');
  user_blood_group := COALESCE(NULLIF(NEW.raw_user_meta_data->>'blood_group', ''), 'B+');
  user_state := COALESCE(NEW.raw_user_meta_data->>'state', '');
  user_district := COALESCE(NEW.raw_user_meta_data->>'district', '');
  user_city := COALESCE(NEW.raw_user_meta_data->>'city', '');
  user_locality := COALESCE(NEW.raw_user_meta_data->>'locality', '');
  user_pin := COALESCE(NEW.raw_user_meta_data->>'pin_code', '');

  -- Optional Health Data
  user_height := (NULLIF(NEW.raw_user_meta_data->>'height', ''))::NUMERIC;
  user_weight := (NULLIF(NEW.raw_user_meta_data->>'weight', ''))::NUMERIC;
  user_allergies := COALESCE(NEW.raw_user_meta_data->'allergies', '[]'::jsonb);
  user_conditions := COALESCE(NEW.raw_user_meta_data->'chronic_conditions', '[]'::jsonb);
  user_medications := COALESCE(NEW.raw_user_meta_data->'current_medications', '[]'::jsonb);
  user_em_name := COALESCE(NEW.raw_user_meta_data->>'emergency_contact_name', '');
  user_em_phone := COALESCE(NEW.raw_user_meta_data->>'emergency_contact_phone', '');
  user_em_rel := COALESCE(NEW.raw_user_meta_data->>'emergency_contact_relation', 'Next of Kin');

  -- 1. Insert into public.profiles with strictly assigned 'patient' role
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    role, 
    phone, 
    district, 
    state
  )
  VALUES (
    NEW.id,
    NEW.email,
    user_full_name,
    assigned_role,
    user_phone,
    user_district,
    user_state
  )
  ON CONFLICT (id) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      phone = EXCLUDED.phone,
      district = EXCLUDED.district,
      state = EXCLUDED.state,
      updated_at = NOW();

  -- 2. Create matching patient record with dynamic demographics and optional health information
  INSERT INTO public.patients (
    id,
    profile_id,
    name,
    email,
    phone,
    dob,
    age,
    gender,
    blood_group,
    address,
    emergency_contact,
    vitals,
    allergies,
    chronic_conditions,
    care_setu_id,
    care_setu_status,
    care_setu_issue_date,
    preferred_language
  )
  VALUES (
    NEW.id,
    NEW.id,
    user_full_name,
    NEW.email,
    user_phone,
    COALESCE(user_dob, '1990-01-01'::DATE),
    COALESCE(user_age, 36),
    user_gender,
    user_blood_group,
    jsonb_build_object(
      'village', user_locality,
      'taluka', user_city,
      'district', user_district,
      'state', user_state,
      'pincode', user_pin
    ),
    jsonb_build_object(
      'name', user_em_name,
      'relation', user_em_rel,
      'phone', user_em_phone
    ),
    jsonb_build_object(
      'height', COALESCE(user_height, 0),
      'weight', COALESCE(user_weight, 0),
      'bloodPressure', '120/80',
      'heartRate', 72,
      'bloodSugarFasting', 95,
      'spO2', 98,
      'temperature', 98.4
    ),
    user_allergies,
    user_conditions,
    'CSU-IND-' || UPPER(SUBSTRING(COALESCE(NULLIF(user_district, ''), 'IND'), 1, 3)) || '-' || LPAD(FLOOR(RANDOM() * 90000000 + 10000000)::TEXT, 8, '0'),
    'Active',
    CURRENT_DATE,
    'en'
  )
  ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name,
      phone = EXCLUDED.phone,
      address = EXCLUDED.address,
      updated_at = NOW();

  -- 3. Initialize default patient consent settings
  INSERT INTO public.consents (
    patient_id,
    allow_emergency_access,
    share_records_with_empaneled_hospitals,
    share_allergy_alerts,
    share_past_records_30_days,
    notify_on_access
  )
  VALUES (
    NEW.id,
    FALSE,
    FALSE,
    FALSE,
    FALSE,
    TRUE
  )
  ON CONFLICT (patient_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
