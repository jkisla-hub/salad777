import React from 'react';
import { 
  Student, 
  Attendance, 
  ExamRecord, 
  AssignmentRecord, 
  Invoice, 
  ClinicSchedule, 
  Consultation, 
  UserRole 
} from '../types';
import { 
  Users, 
  CalendarCheck, 
  BrainCircuit, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Tablet, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  UserPlus, 
  FileText 
} from 'lucide-react';
import { ActiveTab } from './Sidebar';

interface DashboardViewProps {
  students: Student[];
  attendances: Attendance[];
  exams: ExamRecord[];
  assignments: AssignmentRecord[];
  invoices: Invoice[];
  clinics: ClinicSchedule[];
  consultations: Consultation[];
  currentRole: UserRole;
  onNavigate: (tab: ActiveTab) => void;
  onOpenKiosk: () => void;
  onOpenNewStudent: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  attendances,
  exams,
  assignments,
  invoices,
  clinics,
  consultations,
  currentRole,
  onNavigate,
  onOpenKiosk,
  onOpenNewStudent,
}) => {
  const activeStudents = students.filter(s => s.status === 'active');
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayAttendances = attendances.filter(a => a.date === todayStr);

  const presentCount = todayAttendances.filter(a => a.status === 'present').length;
  const lateCount = todayAttendances.filter(a => a.status === 'late').length;
  const checkedInCount = presentCount + lateCount;
  const notCheckedInCount = Math.max(0, activeStudents.length - checkedInCount);

  // Revenue
  const totalBilled = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.totalAmount, 0);
  const totalUnpaid = totalBilled - totalPaid;
  const collectionRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 100;

  // Upcoming clinics
  const upcomingClinics = clinics.filter(c => c.status === 'scheduled');

  // Recent exams
  const recentExams = [...exams].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 shadow-sm border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Study Labs 학원 통합 관제 시스템</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {currentRole === 'director' ? '원장님, 오늘의 학원 운영 현황입니다.' : '데스크 행정 관리 현황판'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            재원생 {activeStudents.length}명 관리 중 · 등원 완료 {checkedInCount}명 · 미등원 {notCheckedInCount}명
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenKiosk}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
          >
            <Tablet className="w-4 h-4" />
            <span>출결 키오스크 열기</span>
          </button>
          <button
            onClick={onOpenNewStudent}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>신규 입학 등록</span>
          </button>
        </div>
      </div>

      {/* 4 Core High-Level Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Students */}
        <div 
          onClick={() => onNavigate('students')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-600">총 재원생</span>
            <Users className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-2">
            {activeStudents.length}명
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span>중1 ({students.filter(s => s.status === 'active' && s.grade === '중1').length}명) · 중2 ({students.filter(s => s.status === 'active' && s.grade === '중2').length}명) · 중3 ({students.filter(s => s.status === 'active' && s.grade === '중3').length}명)</span>
          </div>
        </div>

        {/* Metric 2: Today Attendance */}
        <div 
          onClick={() => onNavigate('attendance')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-600">오늘 출석 현황</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono tabular-nums mt-2">
            {checkedInCount}명
            <span className="text-xs font-normal text-slate-400 ml-1">/ {activeStudents.length}명</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
            <span>정상 {presentCount}명</span>
            <span>·</span>
            <span className="text-amber-600">지각 {lateCount}명</span>
            <span>·</span>
            <span className="text-rose-500">미등원 {notCheckedInCount}명</span>
          </div>
        </div>

        {/* Metric 3: Academic / Exams */}
        <div 
          onClick={() => onNavigate('academics')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-600">오답 분석 & 클리닉</span>
            <BrainCircuit className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-2">
            {upcomingClinics.length}건
            <span className="text-xs font-normal text-slate-400 ml-1">진행 예정</span>
          </div>
          <div className="text-[11px] text-indigo-600 font-medium mt-1">
            취약 오답 1:1 보강 클리닉 운영
          </div>
        </div>

        {/* Metric 4: Revenue & Collection */}
        <div 
          onClick={() => onNavigate('billing')}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-600">당월 원비 수납률</span>
            <CreditCard className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums mt-2">
            {collectionRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
            <span className="text-emerald-600 font-mono font-medium">완납 {totalPaid.toLocaleString()}원</span>
            <span className="text-rose-500 font-mono font-medium">미납 {totalUnpaid.toLocaleString()}원</span>
          </div>
        </div>
      </div>

      {/* Two-Column Activity & Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left Column: Today's Realtime Attendance Live Feed */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                오늘 실시간 등/하원 출결 피드
              </h3>
              <p className="text-xs text-slate-500">학생 키오스크 체크인 시 학부모 알림톡 즉시 발송</p>
            </div>
            <button
              onClick={() => onNavigate('attendance')}
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
            >
              전체 현황보기 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {todayAttendances.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                오늘 출결 기록이 아직 없습니다. 키오스크로 등원을 체크하세요.
              </div>
            ) : (
              todayAttendances.map(att => {
                const student = students.find(s => s.id === att.studentId);
                return (
                  <div key={att.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold font-mono text-xs ${
                        att.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {student?.name[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <span>{student?.name}</span>
                          <span className="text-[11px] text-slate-400">({student?.school} {student?.grade})</span>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          등원: {att.checkInTime} {att.checkOutTime ? `· 하원: ${att.checkOutTime}` : ''}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        att.status === 'present' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {att.status === 'present' ? '정상 출석' : '지각'}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Upcoming Clinics & Weak Point Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                오답 클리닉 & 1:1 보강 스케줄
              </h3>
              <p className="text-xs text-slate-500">강의실 중복 방지 기반 취약 단원 집중 케어</p>
            </div>
            <button
              onClick={() => onNavigate('classes')}
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-semibold"
            >
              스케줄러 보기 <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingClinics.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                예정된 클리닉 일정이 없습니다.
              </div>
            ) : (
              upcomingClinics.map(clinic => {
                const student = students.find(s => s.id === clinic.studentId);
                return (
                  <div key={clinic.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{clinic.topic}</span>
                      <span className="text-[11px] font-mono text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded">
                        {clinic.date} {clinic.time}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span>대상: {student?.name} ({student?.school}) · {clinic.room}</span>
                      <span>담당: {clinic.teacherName}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
