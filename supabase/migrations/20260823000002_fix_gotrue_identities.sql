-- ========================================================================
-- SWASTHYASYNC: FIX GOTRUE SCHEMA IDENTITY & CONFIRMED TEST USERS
-- Resolves "Database error querying schema" and "Email not confirmed"
-- ========================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  p_id UUID := '11111111-1111-1111-1111-111111111111';
  h_id UUID := '22222222-2222-2222-2222-222222222222';
  a_id UUID := '33333333-3333-3333-3333-333333333333';
  pat_record_id UUID;
BEGIN
  -- ====================================================================
  -- 1. PATIENT TEST ACCOUNT (patient.test@swasthasync.com / Patient@123)
  -- ====================================================================
  DELETE FROM auth.identities WHERE user_id = p_id;
  DELETE FROM auth.users WHERE id = p_id OR email = 'patient.test@swasthasync.com';

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    is_super_admin, confirmed_at, last_sign_in_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    p_id,
    'authenticated',
    'authenticated',
    'patient.test@swasthasync.com',
    crypt('Patient@123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Rameshwar B. Jadhav","role":"patient","phone":"+91 98224 51902"}'::jsonb,
    NOW(),
    NOW(),
    '', '', '', '', FALSE, NOW(), NOW()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    p_id::text,
    p_id,
    jsonb_build_object('sub', p_id::text, 'email', 'patient.test@swasthasync.com', 'email_verified', true),
    'email',
    p_id::text,
    NOW(),
    NOW(),
    NOW()
  ) ON CONFLICT (provider, provider_id) DO UPDATE
  SET identity_data = EXCLUDED.identity_data, updated_at = NOW();

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

  -- ====================================================================
  -- 2. HOSPITAL STAFF TEST ACCOUNT (hospital.test@swasthasync.com / Hospital@123)
  -- ====================================================================
  DELETE FROM auth.identities WHERE user_id = h_id;
  DELETE FROM auth.users WHERE id = h_id OR email = 'hospital.test@swasthasync.com';

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    is_super_admin, confirmed_at, last_sign_in_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    h_id,
    'authenticated',
    'authenticated',
    'hospital.test@swasthasync.com',
    crypt('Hospital@123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Dr. Anjali Deshmukh","role":"hospital","phone":"+91 20 2728 0122","facility_name":"Aundh District Hospital, Pune"}'::jsonb,
    NOW(),
    NOW(),
    '', '', '', '', FALSE, NOW(), NOW()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    h_id::text,
    h_id,
    jsonb_build_object('sub', h_id::text, 'email', 'hospital.test@swasthasync.com', 'email_verified', true),
    'email',
    h_id::text,
    NOW(),
    NOW(),
    NOW()
  ) ON CONFLICT (provider, provider_id) DO UPDATE
  SET identity_data = EXCLUDED.identity_data, updated_at = NOW();

  INSERT INTO public.profiles (id, email, full_name, role, facility_name, phone, district, state)
  VALUES (h_id, 'hospital.test@swasthasync.com', 'Dr. Anjali Deshmukh', 'hospital', 'Aundh District Hospital, Pune', '+91 20 2728 0122', 'Pune', 'Maharashtra')
  ON CONFLICT (id) DO UPDATE SET full_name = 'Dr. Anjali Deshmukh', role = 'hospital', facility_name = 'Aundh District Hospital, Pune';

  -- ====================================================================
  -- 3. DISTRICT ADMIN TEST ACCOUNT (admin.test@swasthasync.com / Admin@123)
  -- ====================================================================
  DELETE FROM auth.identities WHERE user_id = a_id;
  DELETE FROM auth.users WHERE id = a_id OR email = 'admin.test@swasthasync.com';

  INSERT INTO auth.users (
    instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
    confirmation_token, recovery_token, email_change_token_new, email_change,
    is_super_admin, confirmed_at, last_sign_in_at
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    a_id,
    'authenticated',
    'authenticated',
    'admin.test@swasthasync.com',
    crypt('Admin@123', gen_salt('bf')),
    NOW(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Dr. Suresh Patil","role":"district_admin","phone":"+91 20 2605 1888","facility_name":"Pune District Health Directorate"}'::jsonb,
    NOW(),
    NOW(),
    '', '', '', '', FALSE, NOW(), NOW()
  );

  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
  ) VALUES (
    a_id::text,
    a_id,
    jsonb_build_object('sub', a_id::text, 'email', 'admin.test@swasthasync.com', 'email_verified', true),
    'email',
    a_id::text,
    NOW(),
    NOW(),
    NOW()
  ) ON CONFLICT (provider, provider_id) DO UPDATE
  SET identity_data = EXCLUDED.identity_data, updated_at = NOW();

  INSERT INTO public.profiles (id, email, full_name, role, facility_name, phone, district, state)
  VALUES (a_id, 'admin.test@swasthasync.com', 'Dr. Suresh Patil', 'district_admin', 'Pune District Health Directorate', '+91 20 2605 1888', 'Pune', 'Maharashtra')
  ON CONFLICT (id) DO UPDATE SET full_name = 'Dr. Suresh Patil', role = 'district_admin', facility_name = 'Pune District Health Directorate';

END $$;
