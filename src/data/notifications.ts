import { NotificationItem } from '../types/notifications';

export const initialNotifications: NotificationItem[] = [
  {
    id: 'notif-001',
    recipientId: 'pat-mh-001',
    title: 'Upcoming Appointment Reminder',
    titleMarathi: 'येत्या भेटीची आठवण',
    message: 'Your follow-up consultation with Dr. Anjali Deshmukh at Aundh District Hospital is scheduled for Aug 25, 2026 at 10:30 AM (Token: P-104-08).',
    messageMarathi: 'डॉ. अंजली देशमुख यांच्यासोबत औंध जिल्हा रुग्णालयातील तुमची भेट २५ ऑगस्ट २०२६ रोजी सकाळी १०:३० वाजता आहे (टोकन: P-104-08).',
    category: 'Appointment',
    timestamp: '2026-08-23T07:30:00',
    isRead: false,
    actionUrl: '/patient/appointments',
    priority: 'high'
  },
  {
    id: 'notif-002',
    recipientId: 'pat-mh-001',
    title: 'New Pathology Report Available',
    titleMarathi: 'नवीन प्रयोगशाळा अहवाल उपलब्ध',
    message: 'Your Comprehensive Glycemic & Lipid Health Evaluation from Aundh District Hospital Pathology Lab is now available with AI simplified summary.',
    messageMarathi: 'औंध जिल्हा रुग्णालयातील तुमचा रक्त चाचणी अहवाल व सोपा सारांश आता उपलब्ध आहे.',
    category: 'Report',
    timestamp: '2026-08-20T11:45:00',
    isRead: false,
    actionUrl: '/patient/reports',
    priority: 'medium'
  },
  {
    id: 'notif-003',
    recipientId: 'pat-mh-001',
    title: 'Medication Refill Due Soon',
    titleMarathi: 'औषध संपण्याची सूचना',
    message: 'Your 90-day maintenance supply of Metformin 500mg and Telmisartan 40mg is due for refill on Aug 25.',
    messageMarathi: 'तुमची मेटफॉर्मिन आणि टेलमिसार्टन औषधे २५ ऑगस्टपर्यंत संपणार आहेत, कृपया भेट घ्या.',
    category: 'Prescription',
    timestamp: '2026-08-19T08:00:00',
    isRead: true,
    actionUrl: '/patient/records',
    priority: 'medium'
  },
  {
    id: 'notif-004',
    recipientId: 'all',
    title: 'Pune District Seasonal Health Advisory',
    titleMarathi: 'पुणे जिल्हा आरोग्य सल्लागार',
    message: 'Monsoon Vector-Borne Disease Precautions: Avoid stagnant water collection. Free Dengue and Malaria screening active at all PHCs and District Hospitals.',
    messageMarathi: 'पावसाळी आजार दक्षता: साचलेले पाणी त्वरित उपसा. सर्व प्राथमिक आरोग्य केंद्रांवर मोफत डेंग्यू व मलेरिया तपासणी सुरू आहे.',
    category: 'District Alert',
    timestamp: '2026-08-18T10:00:00',
    isRead: true,
    actionUrl: '/patient',
    priority: 'low'
  },
  {
    id: 'notif-005',
    recipientId: 'pat-mh-001',
    title: 'CareSetu Smart Health Card Active',
    titleMarathi: 'केअरसेतू स्मार्ट आरोग्य कार्ड सक्रिय',
    message: 'Your CareSetu Smart Health Card (CSU-IND-PUN-00018427) is active with encrypted health record gateway access.',
    messageMarathi: 'तुमचे केअरसेतू स्मार्ट आरोग्य कार्ड (CSU-IND-PUN-00018427) सुरक्षित आरोग्य नोंदीसह सक्रिय आहे.',
    category: 'Health Scheme',
    timestamp: '2026-08-15T14:30:00',
    isRead: true,
    actionUrl: '/patient/health-qr',
    priority: 'low'
  }
];
