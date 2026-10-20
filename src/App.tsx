import React, { useState, useEffect, useRef } from 'react';
import { 
  UserRole, 
  Student, 
  Attendance, 
  ExamRecord, 
  AssignmentRecord, 
  Invoice, 
  ClinicSchedule, 
  Consultation, 
  NotificationLog, 
  AcademyClass 
} from './types';
import { 
  loadAllData, 
  saveAllData, 
  resetAllDataToDefault, 
  exportDataAsJson, 
  AppStateData 
} from './utils/storage';
import { 
  subscribeToFirestoreState, 
  syncStateToFirestore, 
  CloudSyncStatus 
} from './utils/firebaseSync';
import { Header } from './components/Header';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { AttendanceView } from './components/AttendanceView';
import { AcademicsView } from './components/AcademicsView';
import { ParentReportView } from './components/ParentReportView';
import { BillingView } from './components/BillingView';
import { ClassScheduleView } from './components/ClassScheduleView';
import { KioskModal } from './components/KioskModal';
import { DataBackupModal } from './components/DataBackupModal';
import { NotificationModal } from './components/NotificationModal';

export default function App() {
  const [data, setData] = useState<AppStateData>(() => loadAllData());
  const [currentRole, setCurrentRole] = useState<UserRole>('director');
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Cloud sync status state
  const [cloudStatus, setCloudStatus] = useState<CloudSyncStatus>({
    isOnline: false,
    isSyncing: false,
    lastSyncedAt: null,
    error: null,
  });

  // Track if incoming update is from remote cloud to avoid echo loop
  const isRemoteUpdateRef = useRef(false);

  // Global modals
  const [isKioskOpen, setIsKioskOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Real-time Firestore Subscription
  useEffect(() => {
    const unsubscribe = subscribeToFirestoreState(
      (cloudData) => {
        isRemoteUpdateRef.current = true;
        setData(cloudData);
        saveAllData(cloudData);
      },
      (statusUpdates) => {
        setCloudStatus(prev => ({ ...prev, ...statusUpdates }));
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // Sync to local storage & propagate to Firestore when state changes
  useEffect(() => {
    saveAllData(data);

    // If change was made locally (not from remote onSnapshot listener), push to Firestore
    if (!isRemoteUpdateRef.current) {
      setCloudStatus(prev => ({ ...prev, isSyncing: true }));
      const timer = setTimeout(() => {
        syncStateToFirestore(data).then((success) => {
          setCloudStatus(prev => ({
            ...prev,
            isSyncing: false,
            isOnline: success,
            lastSyncedAt: success 
              ? new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
              : prev.lastSyncedAt,
          }));
        });
      }, 400); // 400ms debounce
      return () => clearTimeout(timer);
    } else {
      isRemoteUpdateRef.current = false;
    }
  }, [data]);

  const handleSyncToCloud = () => {
    setCloudStatus(prev => ({ ...prev, isSyncing: true }));
    syncStateToFirestore(data).then((success) => {
      setCloudStatus(prev => ({
        ...prev,
        isSyncing: false,
        isOnline: success,
        lastSyncedAt: success 
          ? new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          : prev.lastSyncedAt,
      }));
    });
  };

  // Handle role change with view restriction safeguard
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'teacher') {
      if (activeTab === 'dashboard' || activeTab === 'students' || activeTab === 'billing') {
        setActiveTab('academics');
      }
    }
  };

  // Student updates
  const handleUpdateStudent = (updatedStudent: Student) => {
    setData(prev => ({
      ...prev,
      students: prev.students.map(s => s.id === updatedStudent.id ? updatedStudent : s),
    }));
  };

  const handleAddStudent = (newStudent: Student) => {
    setData(prev => ({
      ...prev,
      students: [newStudent, ...prev.students],
    }));
  };

  const handleAddConsultation = (newConsultation: Consultation) => {
    setData(prev => ({
      ...prev,
      consultations: [newConsultation, ...prev.consultations],
    }));
  };

  // Attendance updates
  const handleUpdateAttendance = (att: Attendance, notif?: NotificationLog) => {
    setData(prev => {
      const exists = prev.attendances.some(a => a.id === att.id);
      const nextAttendances = exists 
        ? prev.attendances.map(a => a.id === att.id ? att : a)
        : [att, ...prev.attendances];
      const nextNotifs = notif ? [notif, ...prev.notifications] : prev.notifications;
      return {
        ...prev,
        attendances: nextAttendances,
        notifications: nextNotifs,
      };
    });
  };

  // Kiosk record handler
  const handleRecordAttendanceFromKiosk = (att: Attendance, notif: NotificationLog) => {
    handleUpdateAttendance(att, notif);
  };

  // Exam updates
  const handleAddExam = (exam: ExamRecord) => {
    setData(prev => ({
      ...prev,
      exams: [exam, ...prev.exams],
    }));
  };

  // Assignment updates
  const handleUpdateAssignment = (assignment: AssignmentRecord) => {
    setData(prev => ({
      ...prev,
      assignments: prev.assignments.map(a => a.id === assignment.id ? assignment : a),
    }));
  };

  const handleAddAssignment = (assignment: AssignmentRecord) => {
    setData(prev => ({
      ...prev,
      assignments: [assignment, ...prev.assignments],
    }));
  };

  // Invoice updates
  const handleUpdateInvoice = (invoice: Invoice, notif?: NotificationLog) => {
    setData(prev => ({
      ...prev,
      invoices: prev.invoices.map(i => i.id === invoice.id ? invoice : i),
      notifications: notif ? [notif, ...prev.notifications] : prev.notifications,
    }));
  };

  const handleAddInvoice = (invoice: Invoice) => {
    setData(prev => ({
      ...prev,
      invoices: [invoice, ...prev.invoices],
    }));
  };

  // Classes & Clinic updates
  const handleAddClass = (newClass: AcademyClass) => {
    setData(prev => ({
      ...prev,
      classes: [...prev.classes, newClass],
    }));
  };

  const handleAddClinic = (newClinic: ClinicSchedule) => {
    setData(prev => ({
      ...prev,
      clinics: [newClinic, ...prev.clinics],
    }));
  };

  const handleUpdateClinic = (clinic: ClinicSchedule) => {
    setData(prev => ({
      ...prev,
      clinics: prev.clinics.map(c => c.id === clinic.id ? clinic : c),
    }));
  };

  // Schedule clinic from academics view
  const handleScheduleClinicForStudent = (studentId: string, topic: string) => {
    setActiveTab('classes');
  };

  // Notifications
  const handleSendCustomNotification = (notif: NotificationLog) => {
    setData(prev => ({
      ...prev,
      notifications: [notif, ...prev.notifications],
    }));
  };

  // Backup & Import
  const handleExportData = () => {
    exportDataAsJson(data);
  };

  const handleImportData = (imported: AppStateData) => {
    setData(imported);
    saveAllData(imported);
    syncStateToFirestore(imported);
  };

  const handleResetData = () => {
    const res = resetAllDataToDefault();
    setData(res);
    syncStateToFirestore(res);
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAttendanceCount = data.attendances.filter(a => a.date === todayStr).length;
  const unpaidCount = data.invoices.filter(i => i.status !== 'paid').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 font-sans">
      {/* Top Navigation Bar */}
      <Header
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        onOpenKiosk={() => setIsKioskOpen(true)}
        onOpenNewStudent={() => {
          setActiveTab('students');
        }}
        onOpenBackup={() => setIsBackupOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        notificationCount={data.notifications.length}
        cloudStatus={cloudStatus}
        onSyncToCloud={handleSyncToCloud}
      />

      {/* Main Workspace Frame */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Nav Sidebar */}
        <Sidebar
          currentRole={currentRole}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          studentCount={data.students.filter(s => s.status === 'active').length}
          todayAttendanceCount={todayAttendanceCount}
          unpaidInvoiceCount={unpaidCount}
        />

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 max-w-7xl mx-auto w-full pb-20 md:pb-8">
          {activeTab === 'dashboard' && (
            <DashboardView
              students={data.students}
              attendances={data.attendances}
              exams={data.exams}
              assignments={data.assignments}
              invoices={data.invoices}
              clinics={data.clinics}
              consultations={data.consultations}
              currentRole={currentRole}
              onNavigate={setActiveTab}
              onOpenKiosk={() => setIsKioskOpen(true)}
              onOpenNewStudent={() => setActiveTab('students')}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              students={data.students}
              classes={data.classes}
              consultations={data.consultations}
              exams={data.exams}
              assignments={data.assignments}
              attendances={data.attendances}
              currentRole={currentRole}
              onUpdateStudent={handleUpdateStudent}
              onAddStudent={handleAddStudent}
              onAddConsultation={handleAddConsultation}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              students={data.students}
              attendances={data.attendances}
              classes={data.classes}
              currentRole={currentRole}
              onOpenKiosk={() => setIsKioskOpen(true)}
              onUpdateAttendance={handleUpdateAttendance}
            />
          )}

          {activeTab === 'academics' && (
            <AcademicsView
              students={data.students}
              units={data.units}
              exams={data.exams}
              assignments={data.assignments}
              classes={data.classes}
              onAddExam={handleAddExam}
              onUpdateAssignment={handleUpdateAssignment}
              onAddAssignment={handleAddAssignment}
              onScheduleClinicForStudent={handleScheduleClinicForStudent}
            />
          )}

          {activeTab === 'reports' && (
            <ParentReportView
              students={data.students}
              exams={data.exams}
              assignments={data.assignments}
              attendances={data.attendances}
              classes={data.classes}
            />
          )}

          {activeTab === 'billing' && (
            <BillingView
              students={data.students}
              invoices={data.invoices}
              classes={data.classes}
              currentRole={currentRole}
              onUpdateInvoice={handleUpdateInvoice}
              onAddInvoice={handleAddInvoice}
            />
          )}

          {activeTab === 'classes' && (
            <ClassScheduleView
              classes={data.classes}
              clinics={data.clinics}
              students={data.students}
              currentRole={currentRole}
              onAddClass={handleAddClass}
              onAddClinic={handleAddClinic}
              onUpdateClinic={handleUpdateClinic}
            />
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (Visible on mobile screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-20 flex justify-around py-2 px-1 text-[10px]">
        {currentRole !== 'teacher' && (
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center py-1 px-2 ${activeTab === 'dashboard' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
          >
            <span>대시보드</span>
          </button>
        )}
        {currentRole !== 'teacher' && (
          <button
            onClick={() => setActiveTab('students')}
            className={`flex flex-col items-center py-1 px-2 ${activeTab === 'students' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
          >
            <span>원생DB</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex flex-col items-center py-1 px-2 ${activeTab === 'attendance' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          <span>출결</span>
        </button>
        <button
          onClick={() => setActiveTab('academics')}
          className={`flex flex-col items-center py-1 px-2 ${activeTab === 'academics' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          <span>오답분석</span>
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center py-1 px-2 ${activeTab === 'reports' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
        >
          <span>리포트</span>
        </button>
        {currentRole !== 'teacher' && (
          <button
            onClick={() => setActiveTab('billing')}
            className={`flex flex-col items-center py-1 px-2 ${activeTab === 'billing' ? 'text-indigo-600 font-bold' : 'text-slate-500'}`}
          >
            <span>수납</span>
          </button>
        )}
      </div>

      {/* Global Tablet Check-in Kiosk Modal */}
      <KioskModal
        isOpen={isKioskOpen}
        onClose={() => setIsKioskOpen(false)}
        students={data.students}
        attendances={data.attendances}
        onRecordAttendance={handleRecordAttendanceFromKiosk}
      />

      {/* Data Backup & Edit JSON Modal */}
      <DataBackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        currentData={data}
        onExport={handleExportData}
        onImport={handleImportData}
        onResetToDefault={handleResetData}
      />

      {/* Notifications / SMS History Modal */}
      <NotificationModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={data.notifications}
        students={data.students}
        onSendCustomNotification={handleSendCustomNotification}
      />
    </div>
  );
}
