import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { UserLocationProvider } from './context/UserLocationContext';

// Layouts
import { AuthLayout } from './layouts/AuthLayout';
import { PatientLayout } from './layouts/PatientLayout';
import { HospitalLayout } from './layouts/HospitalLayout';
import { DistrictAdminLayout } from './layouts/DistrictAdminLayout';

// Pages - Auth (Lazy Loaded)
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = React.lazy(() => import('./pages/auth/SignupPage').then(m => ({ default: m.SignupPage })));
const ForgotPasswordPage = React.lazy(() => import('./pages/auth/ForgotPasswordPage').then(m => ({ default: m.ForgotPasswordPage })));
const ResetPasswordPage = React.lazy(() => import('./pages/auth/ResetPasswordPage').then(m => ({ default: m.ResetPasswordPage })));
const NotFound = React.lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));

// Pages - Patient (Lazy Loaded)
const PatientDashboard = React.lazy(() => import('./pages/patient/PatientDashboard').then(m => ({ default: m.PatientDashboard })));
const PatientProfile = React.lazy(() => import('./pages/patient/PatientProfile').then(m => ({ default: m.PatientProfile })));
const PatientRecords = React.lazy(() => import('./pages/patient/PatientRecords').then(m => ({ default: m.PatientRecords })));
const PatientAppointments = React.lazy(() => import('./pages/patient/PatientAppointments').then(m => ({ default: m.PatientAppointments })));
const PatientSymptoms = React.lazy(() => import('./pages/patient/PatientSymptoms').then(m => ({ default: m.PatientSymptoms })));
const VoiceSymptomDashboard = React.lazy(() => import('./pages/patient/VoiceSymptomDashboard').then(m => ({ default: m.VoiceSymptomDashboard })));
const PatientReports = React.lazy(() => import('./pages/patient/PatientReports').then(m => ({ default: m.PatientReports })));
const PatientHealthQR = React.lazy(() => import('./pages/patient/PatientHealthQR').then(m => ({ default: m.PatientHealthQR })));
const PatientNotifications = React.lazy(() => import('./pages/patient/PatientNotifications').then(m => ({ default: m.PatientNotifications })));
const PatientSettings = React.lazy(() => import('./pages/patient/PatientSettings').then(m => ({ default: m.PatientSettings })));

// Pages - Hospital (Lazy Loaded)
const HospitalDashboard = React.lazy(() => import('./pages/hospital/HospitalDashboard').then(m => ({ default: m.HospitalDashboard })));
const HospitalPatients = React.lazy(() => import('./pages/hospital/HospitalPatients').then(m => ({ default: m.HospitalPatients })));
const HospitalAppointments = React.lazy(() => import('./pages/hospital/HospitalAppointments').then(m => ({ default: m.HospitalAppointments })));
const HospitalQueue = React.lazy(() => import('./pages/hospital/HospitalQueue').then(m => ({ default: m.HospitalQueue })));
const HospitalPrescriptions = React.lazy(() => import('./pages/hospital/HospitalPrescriptions').then(m => ({ default: m.HospitalPrescriptions })));
const HospitalReports = React.lazy(() => import('./pages/hospital/HospitalReports').then(m => ({ default: m.HospitalReports })));
const CareSetuPatientRecord = React.lazy(() => import('./pages/hospital/CareSetuPatientRecord').then(m => ({ default: m.CareSetuPatientRecord })));

// Pages - District Admin (Lazy Loaded)
const DistrictDashboard = React.lazy(() => import('./pages/district-admin/DistrictDashboard').then(m => ({ default: m.DistrictDashboard })));
const DistrictHospitals = React.lazy(() => import('./pages/district-admin/DistrictHospitals').then(m => ({ default: m.DistrictHospitals })));
const DistrictAnalytics = React.lazy(() => import('./pages/district-admin/DistrictAnalytics').then(m => ({ default: m.DistrictAnalytics })));
const DistrictReports = React.lazy(() => import('./pages/district-admin/DistrictReports').then(m => ({ default: m.DistrictReports })));
const DistrictAudit = React.lazy(() => import('./pages/district-admin/DistrictAudit').then(m => ({ default: m.DistrictAudit })));
const DistrictAlerts = React.lazy(() => import('./pages/district-admin/DistrictAlerts').then(m => ({ default: m.DistrictAlerts })));
const DoctorAuditDetail = React.lazy(() => import('./pages/district-admin/DoctorAuditDetail').then(m => ({ default: m.DoctorAuditDetail })));

// Lightweight, accessible fallback for lazy route transitions
const RouteLoadingFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    className="min-h-[50vh] flex items-center justify-center p-6"
  >
    <div className="flex items-center gap-3 text-slate-500">
      <div
        className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"
        aria-hidden="true"
      />
      <span className="text-sm font-medium">Loading...</span>
      <span className="sr-only">Loading page content, please wait</span>
    </div>
  </div>
);

// Protected Route Guard with Strict Role Isolation
const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles
}) => {
  const { isAuthenticated, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-health-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Verifying Session Security & Role Permissions...</p>
        </div>
      </div>
    );
  }

  // Unauthenticated users are sent to /login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Strict Role Isolation: If user attempts unauthorized role dashboard, redirect to their own dashboard
  if (allowedRoles && !allowedRoles.includes(role)) {
    if (role === 'hospital') return <Navigate to="/hospital" replace />;
    if (role === 'district_admin') return <Navigate to="/district-admin" replace />;
    return <Navigate to="/patient" replace />;
  }

  return <>{children}</>;
};

// Root Redirect component based on active authenticated role
const RootRedirect: React.FC = () => {
  const { role, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role === 'patient') return <Navigate to="/patient" replace />;
  if (role === 'hospital') return <Navigate to="/hospital" replace />;
  if (role === 'district_admin') return <Navigate to="/district-admin" replace />;
  return <Navigate to="/patient" replace />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
        <UserLocationProvider>
          <ToastProvider>
            <React.Suspense fallback={<RouteLoadingFallback />}>
              <Routes>
                {/* Root Route: Auth Gate */}
                <Route path="/" element={<RootRedirect />} />

                {/* Auth Routes */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/signup" element={<SignupPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                </Route>

                {/* Patient Portal Routes - ONLY for authenticated patients */}
                <Route
                  path="/patient"
                  element={
                    <ProtectedRoute allowedRoles={['patient']}>
                      <PatientLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<PatientDashboard />} />
                  <Route path="profile" element={<PatientProfile />} />
                  <Route path="records" element={<PatientRecords />} />
                  <Route path="appointments" element={<PatientAppointments />} />
                  <Route path="symptoms" element={<PatientSymptoms />} />
                  <Route path="symptoms/voice" element={<VoiceSymptomDashboard />} />
                  <Route path="voice-symptoms" element={<VoiceSymptomDashboard />} />
                  <Route path="reports" element={<PatientReports />} />
                  <Route path="health-qr" element={<PatientHealthQR />} />
                  <Route path="caresetu" element={<PatientHealthQR />} />
                  <Route path="notifications" element={<PatientNotifications />} />
                  <Route path="settings" element={<PatientSettings />} />
                </Route>

                {/* Hospital Portal Routes - ONLY for authenticated hospital staff */}
                <Route
                  path="/hospital"
                  element={
                    <ProtectedRoute allowedRoles={['hospital']}>
                      <HospitalLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<HospitalDashboard />} />
                  <Route path="patients" element={<HospitalPatients />} />
                  <Route path="appointments" element={<HospitalAppointments />} />
                  <Route path="queue" element={<HospitalQueue />} />
                  <Route path="prescriptions" element={<HospitalPrescriptions />} />
                  <Route path="reports" element={<HospitalReports />} />
                  <Route path="caresetu" element={<CareSetuPatientRecord />} />
                  <Route path="caresetu-record/:careSetuId" element={<CareSetuPatientRecord />} />
                </Route>

                {/* District Administrator Portal Routes - ONLY for authenticated district admins */}
                <Route
                  path="/district-admin"
                  element={
                    <ProtectedRoute allowedRoles={['district_admin']}>
                      <DistrictAdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<DistrictDashboard />} />
                  <Route path="hospitals" element={<DistrictHospitals />} />
                  <Route path="analytics" element={<DistrictAnalytics />} />
                  <Route path="audit" element={<DistrictAudit />} />
                  <Route path="audit/doctor/:doctorId" element={<DoctorAuditDetail />} />
                  <Route path="reports" element={<DistrictReports />} />
                  <Route path="alerts" element={<DistrictAlerts />} />
                </Route>

                {/* 404 Catch-All Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </React.Suspense>
          </ToastProvider>
        </UserLocationProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
