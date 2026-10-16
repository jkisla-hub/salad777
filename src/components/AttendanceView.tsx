import React, { useState } from 'react';
import { 
  Student, 
  Attendance, 
  AcademyClass, 
  NotificationLog, 
  UserRole 
} from '../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Send, 
  Tablet, 
  Search, 
  Sparkles, 
  LogOut, 
  UserCheck 
} from 'lucide-react';

interface AttendanceViewProps {
  students: Student[];
  attendances: Attendance[];
  classes: AcademyClass[];
  currentRole: UserRole;
  onOpenKiosk: () => void;
  onUpdateAttendance: (attendance: Attendance, notification?: NotificationLog) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  students,
  attendances,
  classes,
  currentRole,
  onOpenKiosk,
  onUpdateAttendance,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [selectedClassId, setSelectedClassId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  const activeStudents = students.filter(s => s.status === 'active');

  const filteredStudents = activeStudents.filter(student => {
    if (selectedClassId !== 'all' && student.classId !== selectedClassId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return student.name.toLowerCase().includes(q) || student.pin.includes(q);
    }
    return true;
  });

  // Calculate statistics for selected date
  const dateAttendances = attendances.filter(a => a.date === selectedDate);
  const presentCount = dateAttendances.filter(a => a.status === 'present').length;
  const lateCount = dateAttendances.filter(a => a.status === 'late').length;
  const checkedOutCount = dateAttendances.filter(a => !!a.checkOutTime).length;
  const totalStudents = activeStudents.length;
  const notCheckedInCount = Math.max(0, totalStudents - dateAttendances.length);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleManualCheckIn = (student: Student, status: Attendance['status']) => {
    const timeNow = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    const existing = attendances.find(a => a.studentId === student.id && a.date === selectedDate);

    const message = `[Study Labs 수학학원] ${student.name} 학생이 ${timeNow}에 ${status === 'late' ? '지각 등원' : '등원'} 처리되었습니다.`;
    const updated: Attendance = {
      id: existing ? existing.id : `att-${Date.now()}`,
      studentId: student.id,
      date: selectedDate,
      checkInTime: existing?.checkInTime || timeNow,
      checkOutTime: existing?.checkOutTime,
      status: status,
      notificationSent: true,
      notificationMessage: message,
    };

    const notif: NotificationLog = {
      id: `notif-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      recipientPhone: student.parentPhone,
      type: '등원',
      timestamp: `${selectedDate} ${timeNow}`,
      message,
    };

    onUpdateAttendance(updated, notif);
    showToast(`${student.name} 학생 등원 처리 및 학부모 알림 발송 완료!`);
  };

  const handleManualCheckOut = (student: Student) => {
    const timeNow = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    const existing = attendances.find(a => a.studentId === student.id && a.date === selectedDate);
    if (!existing) return;

    const message = `[Study Labs 수학학원] ${student.name} 학생이 수업을 마치고 ${timeNow}에 하원하였습니다.`;
    const updated: Attendance = {
      ...existing,
      checkOutTime: timeNow,
      notificationMessage: message,
    };

    const notif: NotificationLog = {
      id: `notif-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      recipientPhone: student.parentPhone,
      type: '하원',
      timestamp: `${selectedDate} ${timeNow}`,
      message,
    };

    onUpdateAttendance(updated, notif);
    showToast(`${student.name} 학생 하원 처리 및 학부모 알림 발송 완료!`);
  };

  const handleResendNotification = (student: Student, att: Attendance) => {
    const notif: NotificationLog = {
      id: `notif-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      recipientPhone: student.parentPhone,
      type: att.checkOutTime ? '하원' : '등원',
      timestamp: `${selectedDate} ${new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}`,
      message: att.notificationMessage || `[Study Labs] ${student.name} 학생 출결 알림`,
    };

    onUpdateAttendance(att, notif);
    showToast(`학부모(${student.parentPhone}) 알림톡 재전송 완료!`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-indigo-900 text-white px-4 py-3 rounded-xl shadow-lg border border-indigo-700 flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-4 duration-200">
          <Send className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Real-time Attendance Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400 font-medium">전체 활성 원생</div>
          <div className="text-xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {totalStudents}명
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            정상 등원
          </div>
          <div className="text-xl font-bold text-emerald-700 font-mono tabular-nums mt-1">
            {presentCount}명
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-amber-600 font-medium flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            지각 등원
          </div>
          <div className="text-xl font-bold text-amber-700 font-mono tabular-nums mt-1">
            {lateCount}명
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="text-xs text-blue-600 font-medium flex items-center gap-1">
            <LogOut className="w-3.5 h-3.5" />
            하원 완료
          </div>
          <div className="text-xl font-bold text-blue-700 font-mono tabular-nums mt-1">
            {checkedOutCount}명
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
          <div className="text-xs text-rose-500 font-medium flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            미등원
          </div>
          <div className="text-xl font-bold text-rose-600 font-mono tabular-nums mt-1">
            {notCheckedInCount}명
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Date Picker */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Calendar className="w-4 h-4 text-slate-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="text-xs font-mono bg-transparent text-slate-800 focus:outline-hidden"
            />
          </div>

          {/* Class Filter */}
          <select
            value={selectedClassId}
            onChange={e => setSelectedClassId(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-700"
          >
            <option value="all">전체 수강 반</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          {/* Search box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="학생명 또는 PIN 검색..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden w-40 sm:w-48"
            />
          </div>
        </div>

        {/* Right Action: Open Tablet Kiosk */}
        <button
          onClick={onOpenKiosk}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Tablet className="w-4 h-4" />
          <span>키오스크 출결기 열기</span>
        </button>
      </div>

      {/* Attendance Log Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                <th className="py-3 px-4">PIN</th>
                <th className="py-3 px-4">학생명 / 학교</th>
                <th className="py-3 px-4">수강 반</th>
                <th className="py-3 px-4">등원 시각</th>
                <th className="py-3 px-4">하원 시각</th>
                <th className="py-3 px-4">출결 상태</th>
                <th className="py-3 px-4">학부모 알림 발송</th>
                <th className="py-3 px-4 text-right">수동 제어</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map(student => {
                const att = dateAttendances.find(a => a.studentId === student.id);
                const studentClass = classes.find(c => c.id === student.classId);

                return (
                  <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-indigo-700 tabular-nums">
                      #{student.pin}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 text-sm">{student.name}</div>
                      <div className="text-[11px] text-slate-400">{student.school} {student.grade}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-slate-700 font-medium">{studentClass?.name || '미배정'}</span>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums">
                      {att?.checkInTime ? (
                        <span className="font-semibold text-slate-800">{att.checkInTime}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums">
                      {att?.checkOutTime ? (
                        <span className="font-semibold text-blue-700">{att.checkOutTime}</span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {att ? (
                        <span className={`inline-flex items-center gap-1 font-medium ${
                          att.status === 'present' ? 'text-emerald-700' :
                          att.status === 'late' ? 'text-amber-700' : 'text-slate-500'
                        }`}>
                          {att.status === 'present' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                          {att.status === 'late' && <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />}
                          {att.status === 'present' ? '정상 출석' : att.status === 'late' ? '지각' : '결석'}
                          {att.checkOutTime && ' (하원완료)'}
                        </span>
                      ) : (
                        <span className="text-slate-400">미등원</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {att?.notificationSent ? (
                        <div className="flex items-center gap-1.5 text-indigo-600 font-medium">
                          <Send className="w-3.5 h-3.5" />
                          <span>전송 완료 ({student.parentPhone.slice(-4)})</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">미발송</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {!att ? (
                          <>
                            <button
                              onClick={() => handleManualCheckIn(student, 'present')}
                              className="px-2.5 py-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded border border-emerald-200 transition-colors"
                            >
                              등원 체크
                            </button>
                            <button
                              onClick={() => handleManualCheckIn(student, 'late')}
                              className="px-2 py-1 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded border border-amber-200 transition-colors"
                            >
                              지각
                            </button>
                          </>
                        ) : !att.checkOutTime ? (
                          <>
                            <button
                              onClick={() => handleManualCheckOut(student)}
                              className="px-2.5 py-1 text-[11px] font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                            >
                              하원 처리
                            </button>
                            <button
                              onClick={() => handleResendNotification(student, att)}
                              className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                              title="학부모 알림 재전송"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">
                            당일 출결 종료
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
