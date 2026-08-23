export type AppointmentStatus = 'Upcoming' | 'Checked In' | 'In Consultation' | 'Completed' | 'Cancelled' | 'No Show';

export type ConsultationType = 'OPD General' | 'Specialist Consultation' | 'Follow-up' | 'Diagnostic Review' | 'Tele-Consultation';

export interface Appointment {
  id: string;
  tokenNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  hospitalId: string;
  hospitalName: string;
  departmentId: string;
  departmentName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "09:30 AM - 10:00 AM"
  type: ConsultationType;
  status: AppointmentStatus;
  reason: string;
  symptoms?: string[];
  roomNumber?: string;
  createdAt: string;
  cancellationReason?: string;
  notes?: string;
  isRated?: boolean;
  ratingId?: string;
}

export interface BookingFormData {
  hospitalId: string;
  departmentId: string;
  doctorId: string;
  date: string;
  timeSlot: string;
  consultationType: ConsultationType;
  reason: string;
  symptoms?: string[];
}
