import React, { useState, useEffect } from 'react';
import { notificationService } from '../../services/notificationService';
import { patientService } from '../../services/patientService';
import { NotificationItem, NotificationCategory } from '../../types/notifications';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Bell, 
  CheckCheck, 
  Calendar, 
  FileText, 
  Pill, 
  AlertTriangle, 
  ShieldCheck, 
  Trash2,
  Filter
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Tabs } from '../../components/common/Tabs';
import { useTranslation } from '../../i18n/useTranslation';

export const PatientNotifications: React.FC = () => {
  const { showSuccess, showInfo } = useToast();
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const patient = patientService.getPatientForUser(user);

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  useEffect(() => {
    const currentPatient = patientService.getPatientForUser(user);
    setNotifications(notificationService.getNotificationsForUser(currentPatient.id));
    const unsub = notificationService.subscribe((list) => {
      setNotifications(list.filter((n) => n.recipientId === currentPatient.id || n.recipientId === 'all'));
    });
    return unsub;
  }, [user]);

  const handleMarkAllRead = () => {
    notificationService.markAllAsRead(patient.id);
    showSuccess('Marked as Read', 'All notifications marked as read.');
  };

  const handleMarkSingleRead = (id: string) => {
    notificationService.markAsRead(id);
  };

  const handleDelete = (id: string) => {
    notificationService.deleteNotification(id);
    showInfo('Notification Dismissed', 'Item removed from list.');
  };

  const tabs = [
    { id: 'All', label: t.filterAll, count: notifications.length },
    { id: 'Appointment', label: t.filterAppointments, count: notifications.filter((n) => n.category === 'Appointment').length },
    { id: 'Report', label: t.filterRecords, count: notifications.filter((n) => n.category === 'Report').length },
    { id: 'Prescription', label: t.prescriptions, count: notifications.filter((n) => n.category === 'Prescription').length },
    { id: 'District Alert', label: t.filterPublicAlerts, count: notifications.filter((n) => n.category === 'District Alert').length },
  ];

  const filteredNotifs = notifications.filter((n) => {
    if (activeCategory === 'All') return true;
    return n.category === activeCategory;
  });

  const getCategoryIcon = (cat: NotificationCategory) => {
    switch (cat) {
      case 'Appointment':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'Report':
        return <FileText className="w-4 h-4 text-sky-600" />;
      case 'Prescription':
        return <Pill className="w-4 h-4 text-purple-600" />;
      case 'District Alert':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t.notificationsTitle}
        subtitle={t.notificationsSubtitle}
        breadcrumbs={[
          { label: t.portalPatient, path: '/patient' },
          { label: t.navNotifications }
        ]}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<CheckCheck className="w-4 h-4" />}
            onClick={handleMarkAllRead}
          >
            {t.markAllRead}
          </Button>
        }
      />

      <Tabs
        tabs={tabs}
        activeTab={activeCategory}
        onChange={setActiveCategory}
        variant="underline"
      />

      <div className="space-y-3">
        {filteredNotifs.length > 0 ? (
          filteredNotifs.map((notif) => (
            <Card
              key={notif.id}
              className={`transition-all ${
                !notif.isRead
                  ? 'bg-health-50/40 border-health-300 shadow-sm'
                  : 'bg-white border-slate-200 opacity-90'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-subtle">
                    {getCategoryIcon(notif.category)}
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">
                        {language === 'mr' && notif.titleMarathi ? notif.titleMarathi : notif.title}
                      </h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-health-600 animate-pulse" />
                      )}
                      <StatusBadge
                        variant={notif.priority === 'urgent' ? 'urgent' : notif.priority === 'high' ? 'warning' : 'neutral'}
                        size="sm"
                      >
                        {notif.category}
                      </StatusBadge>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {language === 'mr' && notif.messageMarathi ? notif.messageMarathi : notif.message}
                    </p>

                    <span className="text-[10px] text-slate-400 block pt-1">
                      {new Date(notif.timestamp).toLocaleString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {!notif.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleMarkSingleRead(notif.id)}
                      className="text-health-700 hover:text-health-900 text-xs"
                    >
                      {t.markRead}
                    </Button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                    aria-label="Delete notification"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="py-12 text-center text-slate-500 bg-white rounded-xl border border-dashed border-slate-300">
            <Bell className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">{t.noNotifications}</p>
          </div>
        )}
      </div>
    </div>
  );
};
