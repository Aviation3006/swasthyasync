-- =============================================================================
-- SWASTHYASYNC MIGRATION: ENFORCE PATIENT-ONLY PUBLIC SIGNUP & DYNAMIC LOCATION
-- =============================================================================

-- Security Rule:
-- Public registration through Supabase Auth is strictly constrained to the 'patient' role.
-- Privileged roles ('hospital', 'district_admin') can ONLY be granted via administrative
-- provisioning or server-side service-role operations.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role user_role_enum;
  user_full_name TEXT;
  user_phone TEXT;
  user_state TEXT;
  user_district TEXT;
  user_city TEXT;
  user_locality TEXT;
  user_pin TEXT;
BEGIN
  -- CRITICAL AUTHORIZATION BOUNDARY:
  -- Public Auth Signups ALWAYS receive 'patient' role by default.
  -- Client metadata role overrides are ignored for public signups.
  assigned_role := 'patient'::user_role_enum;

  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Citizen User');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '+91 98000 00000');
  user_state := COALESCE(NEW.raw_user_meta_data->>'state', '');
  user_district := COALESCE(NEW.raw_user_meta_data->>'district', '');
  user_city := COALESCE(NEW.raw_user_meta_data->>'city', '');
  user_locality := COALESCE(NEW.raw_user_meta_data->>'locality', '');
  user_pin := COALESCE(NEW.raw_user_meta_data->>'pin_code', '');

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

  -- 2. Create clean matching patient record with user-selected location
  INSERT INTO public.patients (
    id,
    user_id,
    name,
    email,
    phone,
    address,
    care_setu_id,
    preferred_language
  )
  VALUES (
    NEW.id,
    NEW.id,
    user_full_name,
    NEW.email,
    user_phone,
    jsonb_build_object(
      'village', user_locality,
      'taluka', user_city,
      'district', user_district,
      'state', user_state,
      'pincode', user_pin
    ),
    'CSU-IND-' || UPPER(SUBSTRING(COALESCE(NULLIF(user_district, ''), 'IND'), 1, 3)) || '-' || LPAD(FLOOR(RANDOM() * 90000000 + 10000000)::TEXT, 8, '0'),
    'en'
  )
  ON CONFLICT (id) DO NOTHING;

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
