import { 
  Student, 
  AcademyClass, 
  CurriculumUnit, 
  Attendance, 
  Consultation, 
  ExamRecord, 
  AssignmentRecord, 
  Invoice, 
  ClinicSchedule, 
  NotificationLog 
} from '../types';
import { 
  initialStudents, 
  initialClasses, 
  initialCurriculumUnits, 
  initialAttendances, 
  initialConsultations, 
  initialExamRecords, 
  initialAssignments, 
  initialInvoices, 
  initialClinics, 
  initialNotificationLogs 
} from './mockData';

const STORAGE_KEYS = {
  STUDENTS: 'studylabs_students_v1',
  CLASSES: 'studylabs_classes_v1',
  UNITS: 'studylabs_units_v1',
  ATTENDANCE: 'studylabs_attendance_v1',
  CONSULTATIONS: 'studylabs_consultations_v1',
  EXAMS: 'studylabs_exams_v1',
  ASSIGNMENTS: 'studylabs_assignments_v1',
  INVOICES: 'studylabs_invoices_v1',
  CLINICS: 'studylabs_clinics_v1',
  NOTIFICATIONS: 'studylabs_notifications_v1',
  CURRENT_ROLE: 'studylabs_current_role_v1',
};

export interface AppStateData {
  students: Student[];
  classes: AcademyClass[];
  units: CurriculumUnit[];
  attendances: Attendance[];
  consultations: Consultation[];
  exams: ExamRecord[];
  assignments: AssignmentRecord[];
  invoices: Invoice[];
  clinics: ClinicSchedule[];
  notifications: NotificationLog[];
}

export function loadAllData(): AppStateData {
  try {
    const studentsStr = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    const classesStr = localStorage.getItem(STORAGE_KEYS.CLASSES);
    const unitsStr = localStorage.getItem(STORAGE_KEYS.UNITS);
    const attendanceStr = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    const consultationsStr = localStorage.getItem(STORAGE_KEYS.CONSULTATIONS);
    const examsStr = localStorage.getItem(STORAGE_KEYS.EXAMS);
    const assignmentsStr = localStorage.getItem(STORAGE_KEYS.ASSIGNMENTS);
    const invoicesStr = localStorage.getItem(STORAGE_KEYS.INVOICES);
    const clinicsStr = localStorage.getItem(STORAGE_KEYS.CLINICS);
    const notificationsStr = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);

    return {
      students: studentsStr ? JSON.parse(studentsStr) : initialStudents,
      classes: classesStr ? JSON.parse(classesStr) : initialClasses,
      units: unitsStr ? JSON.parse(unitsStr) : initialCurriculumUnits,
      attendances: attendanceStr ? JSON.parse(attendanceStr) : initialAttendances,
      consultations: consultationsStr ? JSON.parse(consultationsStr) : initialConsultations,
      exams: examsStr ? JSON.parse(examsStr) : initialExamRecords,
      assignments: assignmentsStr ? JSON.parse(assignmentsStr) : initialAssignments,
      invoices: invoicesStr ? JSON.parse(invoicesStr) : initialInvoices,
      clinics: clinicsStr ? JSON.parse(clinicsStr) : initialClinics,
      notifications: notificationsStr ? JSON.parse(notificationsStr) : initialNotificationLogs,
    };
  } catch (err) {
    console.error('Error loading data from localStorage:', err);
    return {
      students: initialStudents,
      classes: initialClasses,
      units: initialCurriculumUnits,
      attendances: initialAttendances,
      consultations: initialConsultations,
      exams: initialExamRecords,
      assignments: initialAssignments,
      invoices: initialInvoices,
      clinics: initialClinics,
      notifications: initialNotificationLogs,
    };
  }
}

export function saveAllData(data: Partial<AppStateData>): void {
  try {
    if (data.students) localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(data.students));
    if (data.classes) localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(data.classes));
    if (data.units) localStorage.setItem(STORAGE_KEYS.UNITS, JSON.stringify(data.units));
    if (data.attendances) localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(data.attendances));
    if (data.consultations) localStorage.setItem(STORAGE_KEYS.CONSULTATIONS, JSON.stringify(data.consultations));
    if (data.exams) localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(data.exams));
    if (data.assignments) localStorage.setItem(STORAGE_KEYS.ASSIGNMENTS, JSON.stringify(data.assignments));
    if (data.invoices) localStorage.setItem(STORAGE_KEYS.INVOICES, JSON.stringify(data.invoices));
    if (data.clinics) localStorage.setItem(STORAGE_KEYS.CLINICS, JSON.stringify(data.clinics));
    if (data.notifications) localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(data.notifications));
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
  }
}

export function resetAllDataToDefault(): AppStateData {
  const defaultData: AppStateData = {
    students: initialStudents,
    classes: initialClasses,
    units: initialCurriculumUnits,
    attendances: initialAttendances,
    consultations: initialConsultations,
    exams: initialExamRecords,
    assignments: initialAssignments,
    invoices: initialInvoices,
    clinics: initialClinics,
    notifications: initialNotificationLogs,
  };
  saveAllData(defaultData);
  return defaultData;
}

export function exportDataAsJson(data: AppStateData): void {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
  const downloadAnchor = document.createElement('a');
  const now = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('href', jsonString);
  downloadAnchor.setAttribute('download', `StudyLabs_Academy_Backup_${now}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

/**
 * Web Audio API gentle chime for kiosk check-in / check-out
 */
export function playAttendanceChime(type: 'checkIn' | 'checkOut'): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    if (type === 'checkIn') {
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.3); // G5
    } else {
      osc.frequency.setValueAtTime(783.99, ctx.currentTime); // G5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15); // E5
      osc.frequency.exponentialRampToValueAtTime(523.25, ctx.currentTime + 0.3); // C5
    }

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.45);
  } catch {
    // AudioContext might be blocked until user interacts, safe ignore
  }
}
