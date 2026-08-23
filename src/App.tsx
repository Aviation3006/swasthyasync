import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { UserLocationProvider } from './context/UserLocationContext';

// Layouts
import { AuthLayout } from './layouts/AuthLayout';
import { PatientLayout } from './layouts/PatientLayout';
import { HospitalLayout } from './layouts/HospitalLayout';
import { DistrictAdminLayout } from './layouts/DistrictAdminLayout';

// Pages - Auth
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/auth/ResetPasswordPage';
import { NotFound } from './pages/NotFound';

// Pages - Patient
import { PatientDashboard } from './pages/patient/PatientDashboard';
import { PatientProfile } from './pages/patient/PatientProfile';
import { PatientRecords } from './pages/patient/PatientRecords';
import { PatientAppointments } from './pages/patient/PatientAppointments';
import { PatientSymptoms } from './pages/patient/PatientSymptoms';
import { PatientReports } from './pages/patient/PatientReports';
import { PatientHealthQR } from './pages/patient/PatientHealthQR';
import { PatientNotifications } from './pages/patient/PatientNotifications';
import { PatientSettings } from './pages/patient/PatientSettings';

// Pages - Hospital
import { HospitalDashboard } from './pages/hospital/HospitalDashboard';
import { HospitalPatients } from './pages/hospital/HospitalPatients';
import { HospitalAppointments } from './pages/hospital/HospitalAppointments';
import { HospitalQueue } from './pages/hospital/HospitalQueue';
import { HospitalPrescriptions } from './pages/hospital/HospitalPrescriptions';
import { HospitalReports } from './pages/hospital/HospitalReports';
import { CareSetuPatientRecord } from './pages/hospital/CareSetuPatientRecord';

// Pages - District Admin
import { DistrictDashboard } from './pages/district-admin/DistrictDashboard';
import { DistrictHospitals } from './pages/district-admin/DistrictHospitals';
import { DistrictAnalytics } from './pages/district-admin/DistrictAnalytics';
import { DistrictReports } from './pages/district-admin/DistrictReports';
import { DistrictAudit } from './pages/district-admin/DistrictAudit';
import { DistrictAlerts } from './pages/district-admin/DistrictAlerts';
import { DoctorAuditDetail } from './pages/district-admin/DoctorAuditDetail';

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
        <UserLocationProvider>
          <ToastProvider>
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
          </ToastProvider>
        </UserLocationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
