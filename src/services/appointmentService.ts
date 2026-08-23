import { Appointment, AppointmentStatus, BookingFormData } from '../types/appointment';
import { initialAppointments } from '../data/appointments';
import { mockHospitals } from '../data/hospitals';
import { StorageStore } from '../utils/storage';
import { notificationService } from './notificationService';

const appointmentStore = new StorageStore<Appointment[]>('appointments', initialAppointments);

export const appointmentService = {
  getAllAppointments(): Appointment[] {
    return appointmentStore.get();
  },

  getAppointmentsByPatient(patientId: string): Appointment[] {
    return appointmentStore.get().filter((a) => a.patientId === patientId);
  },

  getAppointmentsByHospital(hospitalId: string): Appointment[] {
    return appointmentStore.get().filter((a) => a.hospitalId === hospitalId);
  },

  getAppointmentById(id: string): Appointment | undefined {
    return appointmentStore.get().find((a) => a.id === id);
  },

  bookAppointment(formData: BookingFormData, patientInfo: { id: string; name: string; phone: string }): Appointment {
    const hospital = mockHospitals.find((h) => h.id === formData.hospitalId);
    const department = hospital?.departments.find((d) => d.id === formData.departmentId);
    const doctor = hospital?.doctors.find((doc) => doc.id === formData.doctorId);

    const hospitalCode = hospital ? hospital.name.substring(0, 3).toUpperCase() : 'MH';
    const deptCode = department?.code || 'GEN';
    const randomSeq = Math.floor(Math.random() * 80) + 10;
    const tokenNumber = `${hospitalCode}-${deptCode}-${randomSeq}`;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      tokenNumber,
      patientId: patientInfo.id,
      patientName: patientInfo.name,
      patientPhone: patientInfo.phone,
      hospitalId: formData.hospitalId,
      hospitalName: hospital?.name || 'District Hospital',
      departmentId: formData.departmentId,
      departmentName: department?.name || 'General OPD',
      doctorId: formData.doctorId,
      doctorName: doctor?.name || 'Consulting Physician',
      doctorSpecialization: doctor?.specialization || 'General Medicine',
      date: formData.date,
      timeSlot: formData.timeSlot,
      type: formData.consultationType,
      status: 'Upcoming',
      reason: formData.reason,
      symptoms: formData.symptoms,
      roomNumber: doctor?.roomNumber || 'OPD Room 1',
      createdAt: new Date().toISOString()
    };

    appointmentStore.set((prev) => [newAppointment, ...prev]);

    // Send confirmation notification
    notificationService.sendNotification({
      recipientId: patientInfo.id,
      title: 'Appointment Booked Successfully',
      titleMarathi: 'भेट यशस्वीरीत्या निश्चित झाली',
      message: `Your appointment with ${newAppointment.doctorName} at ${newAppointment.hospitalName} is confirmed for ${newAppointment.date} at ${newAppointment.timeSlot}. Token: ${tokenNumber}`,
      messageMarathi: `${newAppointment.hospitalName} येथे ${newAppointment.doctorName} यांच्याकडे ${newAppointment.date} रोजी ${newAppointment.timeSlot} साठी आपली भेट निश्चित झाली आहे. टोकन: ${tokenNumber}`,
      category: 'Appointment',
      priority: 'high',
      actionUrl: '/patient/appointments'
    });

    return newAppointment;
  },

  cancelAppointment(appointmentId: string, reason: string): Appointment {
    let cancelled: Appointment | undefined;
    appointmentStore.set((prev) =>
      prev.map((a) => {
        if (a.id === appointmentId) {
          cancelled = {
            ...a,
            status: 'Cancelled',
            cancellationReason: reason
          };
          return cancelled;
        }
        return a;
      })
    );
    if (!cancelled) throw new Error('Appointment not found');

    // Notify cancellation
    notificationService.sendNotification({
      recipientId: cancelled.patientId,
      title: 'Appointment Cancelled',
      titleMarathi: 'भेट रद्द करण्यात आली',
      message: `Your appointment on ${cancelled.date} (${cancelled.tokenNumber}) has been cancelled. Reason: ${reason}`,
      messageMarathi: `तुमची ${cancelled.date} रोजीची भेट (${cancelled.tokenNumber}) रद्द झाली आहे. कारण: ${reason}`,
      category: 'Appointment',
      priority: 'medium',
      actionUrl: '/patient/appointments'
    });

    return cancelled;
  },

  updateStatus(appointmentId: string, status: AppointmentStatus, notes?: string): Appointment {
    let updated: Appointment | undefined;
    appointmentStore.set((prev) =>
      prev.map((a) => {
        if (a.id === appointmentId) {
          updated = {
            ...a,
            status,
            notes: notes !== undefined ? notes : a.notes
          };
          return updated;
        }
        return a;
      })
    );
    if (!updated) throw new Error('Appointment not found');
    return updated;
  },

  updateAppointmentStatus(appointmentId: string, status: AppointmentStatus, notes?: string): Appointment {
    return this.updateStatus(appointmentId, status, notes);
  },

  updateAppointment(appointmentId: string, updates: Partial<Appointment>): Appointment {
    let updated: Appointment | undefined;
    appointmentStore.set((prev) =>
      prev.map((a) => {
        if (a.id === appointmentId) {
          updated = { ...a, ...updates };
          return updated;
        }
        return a;
      })
    );
    if (!updated) throw new Error('Appointment not found');
    return updated;
  },

  subscribe(listener: (appointments: Appointment[]) => void): () => void {
    return appointmentStore.subscribe(listener);
  }
};
