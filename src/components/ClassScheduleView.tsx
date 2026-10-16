import React, { useState } from 'react';
import { 
  AcademyClass, 
  ClinicSchedule, 
  Student, 
  UserRole 
} from '../types';
import { 
  CalendarRange, 
  Plus, 
  Users, 
  Clock, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  User, 
  X, 
  Check 
} from 'lucide-react';

interface ClassScheduleViewProps {
  classes: AcademyClass[];
  clinics: ClinicSchedule[];
  students: Student[];
  currentRole: UserRole;
  onAddClass: (newClass: AcademyClass) => void;
  onAddClinic: (newClinic: ClinicSchedule) => void;
  onUpdateClinic: (clinic: ClinicSchedule) => void;
}

export const ClassScheduleView: React.FC<ClassScheduleViewProps> = ({
  classes,
  clinics,
  students,
  currentRole,
  onAddClass,
  onAddClinic,
  onUpdateClinic,
}) => {
  const [activeTab, setActiveTab] = useState<'classes' | 'clinics'>('clinics');
  const [isNewClassOpen, setIsNewClassOpen] = useState(false);
  const [isNewClinicOpen, setIsNewClinicOpen] = useState(false);

  // New Class Form State
  const [newClassName, setNewClassName] = useState('');
  const [newClassGrade, setNewClassGrade] = useState<'중1' | '중2' | '중3'>('중2');
  const [newClassTeacher, setNewClassTeacher] = useState('박도형 강사');
  const [newClassCapacity, setNewClassCapacity] = useState(8);
  const [newClassTime, setNewClassTime] = useState('17:30 - 19:30');
  const [newClassRoom, setNewClassRoom] = useState('301호 (Lab 1)');
  const [newClassDays, setNewClassDays] = useState<('월' | '화' | '수' | '목' | '금' | '토')[]>(['화', '목']);

  // New Clinic Form State
  const activeStudents = students.filter(s => s.status === 'active');
  const [newClinicStudentId, setNewClinicStudentId] = useState(activeStudents[0]?.id || '');
  const [newClinicDate, setNewClinicDate] = useState(new Date().toISOString().slice(0, 10));
  const [newClinicTime, setNewClinicTime] = useState('16:30 - 17:30');
  const [newClinicRoom, setNewClinicRoom] = useState('302호 (Lab 2)');
  const [newClinicTopic, setNewClinicTopic] = useState('연립방정식 활용 오답 집중 클리닉');
  const [newClinicTeacher, setNewClinicTeacher] = useState('박도형 강사');
  const [conflictWarning, setConflictWarning] = useState('');

  // Check room conflict
  const checkRoomConflict = (date: string, time: string, room: string): boolean => {
    return clinics.some(
      c => c.status === 'scheduled' && c.date === date && c.time === time && c.room === room
    );
  };

  const handleCreateClinic = (e: React.FormEvent) => {
    e.preventDefault();
    if (checkRoomConflict(newClinicDate, newClinicTime, newClinicRoom)) {
      setConflictWarning(`⚠️ [강의실 중복 경고] 해당 일시(${newClinicDate} ${newClinicTime})에 ${newClinicRoom}에 이미 다른 클리닉이 예약되어 있습니다.`);
      return;
    }

    const student = students.find(s => s.id === newClinicStudentId);
    const newClinic: ClinicSchedule = {
      id: `cln-${Date.now()}`,
      studentId: newClinicStudentId,
      classId: student?.classId || classes[0].id,
      date: newClinicDate,
      time: newClinicTime,
      room: newClinicRoom,
      topic: newClinicTopic.trim() || '취약 오답 1:1 집중 보강',
      teacherName: newClinicTeacher,
      status: 'scheduled',
    };

    onAddClinic(newClinic);
    setIsNewClinicOpen(false);
    setConflictWarning('');
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newCls: AcademyClass = {
      id: `class-${Date.now()}`,
      name: newClassName.trim(),
      grade: newClassGrade,
      teacherName: newClassTeacher,
      maxCapacity: newClassCapacity,
      currentEnrollment: 0,
      scheduleDays: newClassDays,
      timeSlot: newClassTime,
      room: newClassRoom,
    };

    onAddClass(newCls);
    setIsNewClassOpen(false);
    setNewClassName('');
  };

  const handleCompleteClinic = (clinic: ClinicSchedule) => {
    onUpdateClinic({
      ...clinic,
      status: 'completed',
    });
  };

  return (
    <div className="space-y-6">
      {/* Sub Nav Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('clinics')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'clinics'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>오답 클리닉 & 1:1 보강 스케줄러</span>
          </button>

          <button
            onClick={() => setActiveTab('classes')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeTab === 'classes'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-indigo-600" />
            <span>개설 반 & 정원 관리 ({classes.length}개 반)</span>
          </button>
        </div>

        {activeTab === 'clinics' ? (
          <button
            onClick={() => {
              setConflictWarning('');
              setIsNewClinicOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>새 클리닉/보강 예약</span>
          </button>
        ) : (
          <button
            onClick={() => setIsNewClassOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>신규 반 개설</span>
          </button>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────
          TAB 1: CLINIC & MAKEUP SCHEDULER
         ────────────────────────────────────────────────────────── */}
      {activeTab === 'clinics' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div className="text-slate-600">
              오답 분석에서 취약점이 발견된 학생들을 위한 <strong>1:1 맞춤 클리닉 및 강의실 중복 방지 스케줄</strong>
            </div>
            <div className="font-mono text-slate-500">
              총 {clinics.length}건 (진행 예정 {clinics.filter(c => c.status === 'scheduled').length}건)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clinics.map(clinic => {
              const student = students.find(s => s.id === clinic.studentId);
              const isScheduled = clinic.status === 'scheduled';

              return (
                <div
                  key={clinic.id}
                  className={`bg-white rounded-xl border p-5 space-y-3 transition-shadow ${
                    isScheduled ? 'border-slate-200' : 'border-slate-200/60 bg-slate-50/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{clinic.topic}</span>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          isScheduled ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isScheduled ? '클리닉 예정' : '완료됨'}
                        </span>
                      </div>
                      <div className="text-xs text-indigo-700 font-semibold mt-1">
                        대상 원생: {student?.name} ({student?.school} {student?.grade})
                      </div>
                    </div>

                    {isScheduled && (
                      <button
                        onClick={() => handleCompleteClinic(clinic)}
                        className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>완료 처리</span>
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{clinic.date} ({clinic.time})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{clinic.room}</span>
                    </div>
                    <div className="flex items-center gap-1.5 col-span-2">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>담당 강사: {clinic.teacherName}</span>
                    </div>
                  </div>

                  {clinic.note && (
                    <div className="text-[11px] text-slate-500 bg-amber-50/60 p-2 rounded border border-amber-100">
                      준비 사항: {clinic.note}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          TAB 2: CLASS MANAGEMENT & CAPACITY
         ────────────────────────────────────────────────────────── */}
      {activeTab === 'classes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {classes.map(cls => {
            const enrolledStudents = students.filter(s => s.classId === cls.id && s.status === 'active');
            const occupancyRate = Math.round((enrolledStudents.length / cls.maxCapacity) * 100);

            return (
              <div key={cls.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{cls.name}</h3>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-medium">
                        {cls.grade}
                      </span>
                    </div>
                    <div className="text-xs text-indigo-700 font-medium mt-0.5">
                      담당: {cls.teacherName} · {cls.room}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-mono font-bold text-sm text-slate-900">
                      {enrolledStudents.length} / {cls.maxCapacity}명
                    </span>
                    <span className="text-slate-400 text-xs ml-1 font-mono">({occupancyRate}%)</span>
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      occupancyRate >= 90 ? 'bg-rose-500' : 'bg-indigo-600'
                    }`}
                    style={{ width: `${Math.min(100, occupancyRate)}%` }}
                  />
                </div>

                {/* Class Schedule Badges */}
                <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">수업 요일:</span>
                    <div className="flex gap-1">
                      {cls.scheduleDays.map(day => (
                        <span key={day} className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-[10px] flex items-center justify-center">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="font-mono text-slate-500 text-[11px]">{cls.timeSlot}</div>
                </div>

                {/* Enrolled Students List */}
                <div className="border-t border-slate-100 pt-2">
                  <div className="text-[11px] font-semibold text-slate-400 mb-1.5">수강생 명단 ({enrolledStudents.length}명)</div>
                  <div className="flex flex-wrap gap-1.5">
                    {enrolledStudents.map(st => (
                      <span key={st.id} className="text-xs bg-slate-50 border border-slate-200 px-2 py-0.5 rounded text-slate-700">
                        {st.name} <span className="text-[10px] text-slate-400 font-mono">#{st.pin}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Clinic Modal */}
      {isNewClinicOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">오답 클리닉 & 1:1 보강 예약</h3>
              <button onClick={() => setIsNewClinicOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateClinic} className="p-6 space-y-4 text-xs">
              {conflictWarning && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs leading-relaxed animate-shake">
                  {conflictWarning}
                </div>
              )}

              <div>
                <label className="font-medium text-slate-700 block mb-1">대상 원생 *</label>
                <select
                  value={newClinicStudentId}
                  onChange={e => setNewClinicStudentId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                >
                  {activeStudents.map(st => (
                    <option key={st.id} value={st.id}>{st.name} ({st.school} {st.grade})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">클리닉 주제 및 목표 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 일차부등식 문장제 독해 및 식세우기 1:1 코칭"
                  value={newClinicTopic}
                  onChange={e => {
                    setNewClinicTopic(e.target.value);
                    setConflictWarning('');
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">예약 일자 *</label>
                  <input
                    type="date"
                    value={newClinicDate}
                    onChange={e => {
                      setNewClinicDate(e.target.value);
                      setConflictWarning('');
                    }}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">시간대 *</label>
                  <select
                    value={newClinicTime}
                    onChange={e => {
                      setNewClinicTime(e.target.value);
                      setConflictWarning('');
                    }}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  >
                    <option value="16:00 - 17:00">16:00 - 17:00</option>
                    <option value="16:30 - 17:30">16:30 - 17:30</option>
                    <option value="17:30 - 18:30">17:30 - 18:30</option>
                    <option value="19:30 - 20:30">19:30 - 20:30</option>
                    <option value="14:00 - 15:00">토 14:00 - 15:00</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">배정 강의실 *</label>
                  <select
                    value={newClinicRoom}
                    onChange={e => {
                      setNewClinicRoom(e.target.value);
                      setConflictWarning('');
                    }}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="301호 (Lab 1)">301호 (Lab 1)</option>
                    <option value="302호 (Lab 2)">302호 (Lab 2)</option>
                    <option value="303호 세미나실">303호 세미나실</option>
                    <option value="401호 대강의실">401호 대강의실</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">담당 강사 *</label>
                  <select
                    value={newClinicTeacher}
                    onChange={e => setNewClinicTeacher(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="박도형 강사">박도형 강사</option>
                    <option value="이지수 강사">이지수 강사</option>
                    <option value="김수학 원장">김수학 원장</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewClinicOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  클리닉 일정 확정
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Class Modal */}
      {isNewClassOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">신규 수학 개설 반 등록</h3>
              <button onClick={() => setIsNewClassOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateClass} className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">반 이름 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 중2 수학 심화 M반"
                  value={newClassName}
                  onChange={e => setNewClassName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">대상 학년</label>
                  <select
                    value={newClassGrade}
                    onChange={e => setNewClassGrade(e.target.value as '중1' | '중2' | '중3')}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="중1">중1</option>
                    <option value="중2">중2</option>
                    <option value="중3">중3</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">정원 (명)</label>
                  <input
                    type="number"
                    value={newClassCapacity}
                    onChange={e => setNewClassCapacity(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">담당 강사</label>
                  <input
                    type="text"
                    value={newClassTeacher}
                    onChange={e => setNewClassTeacher(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">배정 강의실</label>
                  <input
                    type="text"
                    value={newClassRoom}
                    onChange={e => setNewClassRoom(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">수업 시간대</label>
                <input
                  type="text"
                  placeholder="예: 17:30 - 19:30"
                  value={newClassTime}
                  onChange={e => setNewClassTime(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewClassOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  개설 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
