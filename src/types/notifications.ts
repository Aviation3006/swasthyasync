export type NotificationCategory = 'Appointment' | 'Report' | 'Prescription' | 'System' | 'District Alert' | 'Health Scheme';

export interface NotificationItem {
  id: string;
  recipientId: string; // patientId or 'all' or 'hospital_staff' or 'district_admin'
  title: string;
  titleMarathi?: string;
  message: string;
  messageMarathi?: string;
  category: NotificationCategory;
  timestamp: string;
  isRead: boolean;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}
