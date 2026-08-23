import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { Patient } from '../../types/patient';
import { SUPPORTED_LANGUAGES, Language } from '../../types/common';
import { useToast } from '../../context/ToastContext';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Droplet, 
  Heart, 
  AlertCircle, 
  ShieldCheck, 
  Edit3, 
  Save, 
  X, 
  Plus, 
  Trash2,
  Calendar,
  Globe,
  QrCode
} from 'lucide-react';
import { PageHeader } from '../../components/navigation/PageHeader';
import { Card, CardHeader, CardContent } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { FormField } from '../../components/forms/FormField';
import { Input } from '../../components/forms/Input';
import { Select } from '../../components/forms/Select';
import { StatusBadge } from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from '../../i18n/useTranslation';

export const PatientProfile: React.FC = () => {
  const { user } = useAuth();
  const { t, language } = useTranslation();
  const { showSuccess, showInfo } = useToast();
  const [patient, setPatient] = useState<Patient>(() => patientService.getPatientForUser(user));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Patient>(() => patientService.getPatientForUser(user));

  React.useEffect(() => {
    const current = patientService.getPatientForUser(user);
    setPatient(current);
    setFormData(current);
  }, [user]);

  const [newAllergySubstance, setNewAllergySubstance] = useState('');
  const [newAllergySeverity, setNewAllergySeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Mild');

  const handleSave = () => {
    try {
      const updated = patientService.updatePatient(patient.id, formData);
      setPatient(updated);
      setIsEditing(false);
      showSuccess(t.savedSuccessfully, t.savedSuccessfully);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = () => {
    setFormData(patient);
    setIsEditing(false);
    showInfo(t.cancel, 'Reverted');
  };

  const handleAddAllergy = () => {
    if (!newAllergySubstance.trim()) return;
    const newAlg = {
      id: `alg-${Date.now()}`,
      substance: newAllergySubstance.trim(),
      severity: newAllergySeverity,
      reaction: 'Documented sensitivity'
    };
    setFormData({
      ...formData,
      allergies: [...formData.allergies, newAlg]
    });
    setNewAllergySubstance('');
  };

  const handleRemoveAllergy = (id: string) => {
    setFormData({
      ...formData,
      allergies: formData.allergies.filter((a) => a.id !== id)
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title={t.navProfile}
        subtitle={t.profileSubtitle}
        breadcrumbs={[
          { label: t.portalPatient, path: '/patient' },
          { label: t.navProfile }
        ]}
        actions={
          isEditing ? (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel} leftIcon={<X className="w-4 h-4" />}>
                {t.cancel}
              </Button>
              <Button variant="primary" size="sm" onClick={handleSave} leftIcon={<Save className="w-4 h-4" />}>
                {t.saveChanges}
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              leftIcon={<Edit3 className="w-4 h-4" />}
            >
              {t.edit}
            </Button>
          )
        }
      />

      {/* ABHA Identity Summary Card with Action Buttons */}
      <div className="bg-gradient-to-r from-health-900 via-slate-900 to-navy-950 text-white rounded-2xl p-6 shadow-card border border-health-800">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-health-700/60 border border-health-600/60 text-white font-bold text-2xl flex items-center justify-center shadow-inner flex-shrink-0">
              {(patient.name || user?.name || 'C').charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {language === 'mr' && patient.nameMarathi ? patient.nameMarathi : (patient.name || user?.name || t.citizenPatientTab)}
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> CareSetu Active
                </span>
                {patient.abhaId && (
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center gap-1 font-semibold">
                    ABHA Linked
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-1">
                CareSetu ID: <code className="text-emerald-300 font-mono font-bold">{patient.careSetuId || 'CSU-IND-PUN-00018427'}</code> • {t.abhaAddress}: <code className="text-health-300">{patient.abhaAddress || t.notConfigured}</code>
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <div className="p-3 bg-white/10 rounded-xl border border-white/10 text-xs space-y-1 text-center sm:text-left">
              <div className="text-slate-300">{t.careSetuId || "CareSetu ID"}:</div>
              <div className="text-base font-mono font-bold text-emerald-300 tracking-wider">
                {patient.careSetuId || 'CSU-IND-PUN-00018427'}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Link to="/patient/health-qr">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<QrCode className="w-4 h-4 text-emerald-800 flex-shrink-0" />}
                  className="bg-white hover:bg-emerald-50 text-emerald-950 font-bold border-2 border-emerald-400 shadow-sm w-full sm:w-auto px-3.5 py-2"
                >
                  {t.smartHealthCardQR}
                </Button>
              </Link>
              <Link to="/patient/appointments">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<Calendar className="w-4 h-4 text-white flex-shrink-0" />}
                  className="bg-health-600 hover:bg-health-500 text-white font-bold border border-health-400/80 shadow-sm w-full sm:w-auto px-3.5 py-2"
                >
                  {t.bookOpdAppointment}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal & Contact Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader
              title={t.personalDetails}
              subtitle={t.abdmSummaryDesc}
              icon={<User className="w-5 h-5" />}
            />
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label={`${t.fullName} (English)`}>
                  <Input
                    value={formData.name}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </FormField>

                <FormField label={`${t.fullName} (मराठी)`}>
                  <Input
                    value={formData.nameMarathi || ''}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({ ...formData, nameMarathi: e.target.value })}
                  />
                </FormField>

                <FormField label={t.dateOfBirth}>
                  <Input
                    type="date"
                    value={formData.dob}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                </FormField>

                <FormField label={t.gender}>
                  <Select
                    disabled={!isEditing}
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    options={[
                      { value: 'Male', label: t.male },
                      { value: 'Female', label: t.female },
                      { value: 'Other', label: t.other }
                    ]}
                  />
                </FormField>

                <FormField label={t.bloodGroup}>
                  <Select
                    disabled={!isEditing}
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value as any })}
                    options={[
                      { value: 'A+', label: 'A+ (Positive)' },
                      { value: 'A-', label: 'A- (Negative)' },
                      { value: 'B+', label: 'B+ (Positive)' },
                      { value: 'B-', label: 'B- (Negative)' },
                      { value: 'AB+', label: 'AB+ (Positive)' },
                      { value: 'AB-', label: 'AB- (Negative)' },
                      { value: 'O+', label: 'O+ (Positive)' },
                      { value: 'O-', label: 'O- (Negative)' }
                    ]}
                  />
                </FormField>

                <FormField label={t.preferredLanguage}>
                  <Select
                    disabled={!isEditing}
                    value={formData.preferredLanguage}
                    onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value as any })}
                    options={SUPPORTED_LANGUAGES.map(l => ({
                      value: l.code,
                      label: `${l.nativeName} (${l.name})`
                    }))}
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader
              title={t.residentialAddress}
              subtitle={t.domicileDesc}
              icon={<MapPin className="w-5 h-5" />}
            />
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField label={t.phoneNumber}>
                  <Input
                    value={formData.phone}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </FormField>

                <FormField label={t.emailAddress}>
                  <Input
                    value={formData.email}
                    disabled={!isEditing}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </FormField>

                <FormField label={t.village}>
                  <Input
                    value={formData.address.village}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, village: e.target.value }
                      })
                    }
                  />
                </FormField>

                <FormField label={t.taluka}>
                  <Input
                    value={formData.address.taluka}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, taluka: e.target.value }
                      })
                    }
                  />
                </FormField>

                <FormField label={t.district}>
                  <Input
                    value={formData.address.district}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, district: e.target.value }
                      })
                    }
                  />
                </FormField>

                <FormField label="State / Union Territory">
                  <Input
                    value={formData.address.state || ''}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value }
                      })
                    }
                  />
                </FormField>

                <FormField label={t.pincode}>
                  <Input
                    value={formData.address.pincode}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        address: { ...formData.address, pincode: e.target.value }
                      })
                    }
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Emergency Contacts, Allergies, Chronic Conditions */}
        <div className="space-y-6">
          {/* Emergency Contact */}
          <Card>
            <CardHeader
              title={`${t.emergencyContact} (SOS)`}
              subtitle="Primary contact alerted during clinical triage emergencies"
              icon={<Heart className="w-5 h-5 text-rose-500" />}
            />
            <CardContent>
              <div className="space-y-3">
                <FormField label={t.emergencyContactName}>
                  <Input
                    value={formData.emergencyContact.name}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                      })
                    }
                  />
                </FormField>

                <FormField label={t.emergencyRelation}>
                  <Input
                    value={formData.emergencyContact.relationship}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, relationship: e.target.value }
                      })
                    }
                  />
                </FormField>

                <FormField label={t.emergencyPhone}>
                  <Input
                    value={formData.emergencyContact.phone}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                      })
                    }
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Allergies */}
          <Card>
            <CardHeader
              title={t.knownAllergies}
              subtitle="Critical alerts displayed to prescribing doctors"
              icon={<AlertCircle className="w-5 h-5 text-amber-500" />}
            />
            <CardContent>
              <div className="space-y-2.5">
                {formData.allergies.length > 0 ? (
                  formData.allergies.map((alg) => (
                    <div
                      key={alg.id}
                      className="p-3 rounded-lg bg-rose-50/70 border border-rose-200 flex items-start justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-rose-900">{alg.substance}</span>
                          <StatusBadge variant="error" size="sm">{alg.severity}</StatusBadge>
                        </div>
                        <p className="text-[11px] text-rose-700 mt-0.5">{alg.reaction}</p>
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveAllergy(alg.id)}
                          className="text-rose-500 hover:text-rose-700 p-1 rounded"
                          aria-label="Remove allergy"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">{t.noAllergiesRecorded}</p>
                )}

                {isEditing && (
                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-xs font-semibold text-slate-700">{t.addAllergy}</span>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Substance (e.g. Sulfa, Peanuts)"
                        value={newAllergySubstance}
                        onChange={(e) => setNewAllergySubstance(e.target.value)}
                        className="text-xs"
                      />
                      <Select
                        value={newAllergySeverity}
                        onChange={(e) => setNewAllergySeverity(e.target.value as any)}
                        options={[
                          { value: 'Mild', label: t.low },
                          { value: 'Moderate', label: t.moderate },
                          { value: 'Severe', label: t.high }
                        ]}
                        className="text-xs w-28"
                      />
                      <Button variant="outline" size="sm" onClick={handleAddAllergy}>
                        <Plus className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
