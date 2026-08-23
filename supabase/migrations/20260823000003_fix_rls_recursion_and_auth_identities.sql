-- ========================================================================
-- SWASTHYASYNC MIGRATION: FIX RLS INFINITE RECURSION & SEED TEST USERS
-- Eliminates "Database error querying schema" and enables instant login
-- ========================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Non-recursive role resolution from JWT claims (returns user_role_enum)
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role_enum AS $$
  SELECT COALESCE(
    (auth.jwt() -> 'user_metadata' ->> 'role')::user_role_enum,
    (auth.jwt() -> 'app_metadata' ->> 'role')::user_role_enum,
    'patient'::user_role_enum
  );
$$ LANGUAGE sql STABLE;

-- 2. Clean, Non-Recursive Profiles RLS Policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (
    auth.uid() = id 
    OR public.get_current_user_role() = 'district_admin'
  );

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Robust Sign-up Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role user_role_enum;
  user_full_name TEXT;
  user_phone TEXT;
  user_facility TEXT;
  new_patient_id UUID;
BEGIN
  BEGIN
    assigned_role := (LOWER(COALESCE(NEW.raw_user_meta_data->>'role', 'patient')))::user_role_enum;
  EXCEPTION WHEN OTHERS THEN
    assigned_role := 'patient'::user_role_enum;
  END;

  user_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Citizen User');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', '+91 98224 00000');
  user_facility := NEW.raw_user_meta_data->>'facility_name';

  -- Upsert Profile
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

  -- If patient, auto-create patient & consent records
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

-- Reattach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Seed and Confirm All 3 Test Accounts with GoTrue Identities
DO $$
DECLARE
  p_id UUID := '11111111-1111-1111-1111-111111111111';
  h_id UUID := '22222222-2222-2222-2222-222222222222';
  a_id UUID := '33333333-3333-3333-3333-333333333333';
  pat_record_id UUID;
BEGIN
  -- A. Patient Test Account: patient.test@swasthasync.com / Patient@123
  DELETE FROM auth.identities WHERE user_id = p_id;
  DELETE FROM auth.users WHERE id = p_id OR email = 'patient.test@swasthasync.com';

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    is_super_admin, last_sign_in_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', p_id, 'authenticated', 'authenticated',
    'patient.test@swasthasync.com', crypt('Patient@123', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Rameshwar B. Jadhav","role":"patient","phone":"+91 98224 51902"}'::jsonb,
    NOW(), NOW(), '', '', '', '', FALSE, NOW()
  );

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (p_id, p_id, jsonb_build_object('sub', p_id::text, 'email', 'patient.test@swasthasync.com', 'email_verified', true), 'email', p_id::text, NOW(), NOW(), NOW())
  ON CONFLICT (provider, provider_id) DO UPDATE SET identity_data = EXCLUDED.identity_data, updated_at = NOW();

  INSERT INTO public.profiles (id, email, full_name, role, phone, district, state)
  VALUES (p_id, 'patient.test@swasthasync.com', 'Rameshwar B. Jadhav', 'patient', '+91 98224 51902', 'Pune', 'Maharashtra')
  ON CONFLICT (id) DO UPDATE SET full_name = 'Rameshwar B. Jadhav', role = 'patient';

  INSERT INTO public.patients (profile_id, abha_id, abha_address, name, phone, email)
  VALUES (
    p_id,
    '91-4819-2094-1182',
    'rameshwar.jadhav@abdm',
    'Rameshwar B. Jadhav',
    '+91 98224 51902',
    'patient.test@swasthasync.com'
  )
  ON CONFLICT (profile_id) DO NOTHING
  RETURNING id INTO pat_record_id;

  IF pat_record_id IS NOT NULL THEN
    INSERT INTO public.consents (patient_id) VALUES (pat_record_id) ON CONFLICT (patient_id) DO NOTHING;
  END IF;

  -- B. Hospital Staff Test Account: hospital.test@swasthasync.com / Hospital@123
  DELETE FROM auth.identities WHERE user_id = h_id;
  DELETE FROM auth.users WHERE id = h_id OR email = 'hospital.test@swasthasync.com';

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    is_super_admin, last_sign_in_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', h_id, 'authenticated', 'authenticated',
    'hospital.test@swasthasync.com', crypt('Hospital@123', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Dr. Anjali Deshmukh","role":"hospital","phone":"+91 20 2728 0122","facility_name":"Aundh District Hospital, Pune"}'::jsonb,
    NOW(), NOW(), '', '', '', '', FALSE, NOW()
  );

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (h_id, h_id, jsonb_build_object('sub', h_id::text, 'email', 'hospital.test@swasthasync.com', 'email_verified', true), 'email', h_id::text, NOW(), NOW(), NOW())
  ON CONFLICT (provider, provider_id) DO UPDATE SET identity_data = EXCLUDED.identity_data, updated_at = NOW();

  INSERT INTO public.profiles (id, email, full_name, role, facility_name, phone, district, state)
  VALUES (h_id, 'hospital.test@swasthasync.com', 'Dr. Anjali Deshmukh', 'hospital', 'Aundh District Hospital, Pune', '+91 20 2728 0122', 'Pune', 'Maharashtra')
  ON CONFLICT (id) DO UPDATE SET full_name = 'Dr. Anjali Deshmukh', role = 'hospital', facility_name = 'Aundh District Hospital, Pune';

  -- C. District Admin Test Account: admin.test@swasthasync.com / Admin@123
  DELETE FROM auth.identities WHERE user_id = a_id;
  DELETE FROM auth.users WHERE id = a_id OR email = 'admin.test@swasthasync.com';

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    is_super_admin, last_sign_in_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000', a_id, 'authenticated', 'authenticated',
    'admin.test@swasthasync.com', crypt('Admin@123', gen_salt('bf')), NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Dr. Suresh Patil","role":"district_admin","phone":"+91 20 2605 1888","facility_name":"Pune District Health Directorate"}'::jsonb,
    NOW(), NOW(), '', '', '', '', FALSE, NOW()
  );

  INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  VALUES (a_id, a_id, jsonb_build_object('sub', a_id::text, 'email', 'admin.test@swasthasync.com', 'email_verified', true), 'email', a_id::text, NOW(), NOW(), NOW())
  ON CONFLICT (provider, provider_id) DO UPDATE SET identity_data = EXCLUDED.identity_data, updated_at = NOW();

  INSERT INTO public.profiles (id, email, full_name, role, facility_name, phone, district, state)
  VALUES (a_id, 'admin.test@swasthasync.com', 'Dr. Suresh Patil', 'district_admin', 'Pune District Health Directorate', '+91 20 2605 1888', 'Pune', 'Maharashtra')
  ON CONFLICT (id) DO UPDATE SET full_name = 'Dr. Suresh Patil', role = 'district_admin', facility_name = 'Pune District Health Directorate';
END $$;
