import React, { useState } from 'react';
import { 
  Student, 
  AcademyClass, 
  Consultation, 
  ExamRecord, 
  AssignmentRecord, 
  Attendance, 
  UserRole 
} from '../types';
import { 
  Search, 
  Plus, 
  GraduationCap, 
  Phone, 
  User, 
  Building, 
  Calendar, 
  FileText, 
  History, 
  Edit, 
  UserX, 
  RotateCcw, 
  MessageSquare, 
  ChevronRight, 
  X, 
  Check, 
  Sparkles, 
  AlertCircle 
} from 'lucide-react';

interface StudentsViewProps {
  students: Student[];
  classes: AcademyClass[];
  consultations: Consultation[];
  exams: ExamRecord[];
  assignments: AssignmentRecord[];
  attendances: Attendance[];
  currentRole: UserRole;
  onUpdateStudent: (student: Student) => void;
  onAddStudent: (student: Student) => void;
  onAddConsultation: (consultation: Consultation) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  students,
  classes,
  consultations,
  exams,
  assignments,
  attendances,
  currentRole,
  onUpdateStudent,
  onAddStudent,
  onAddConsultation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<'all' | '중1' | '중2' | '중3'>('all');
  const [statusFilter, setStatusFilter] = useState<'active' | 'withdrawn'>('active');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Partial<Student>>({});

  // New Consultation Form State inside detail drawer
  const [isAddingConsultation, setIsAddingConsultation] = useState(false);
  const [consultationType, setConsultationType] = useState<Consultation['type']>('정기학부모상담');
  const [consultationContent, setConsultationContent] = useState('');
  const [counselorName, setCounselorName] = useState('김수학 원장');
  const [studentPersonality, setStudentPersonality] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [testScore, setTestScore] = useState<string>('');

  // Filter students
  const filteredStudents = students.filter(student => {
    if (student.status !== statusFilter) return false;
    if (selectedGrade !== 'all' && student.grade !== selectedGrade) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = student.name.toLowerCase().includes(q);
      const matchSchool = student.school.toLowerCase().includes(q);
      const matchPhone = student.phone.includes(q) || student.parentPhone.includes(q);
      const matchPin = student.pin.includes(q);
      if (!matchName && !matchSchool && !matchPhone && !matchPin) return false;
    }
    return true;
  });

  // Helper stats
  const activeCount = students.filter(s => s.status === 'active').length;
  const withdrawnCount = students.filter(s => s.status === 'withdrawn').length;

  const handleOpenEdit = (student: Student) => {
    setEditingStudent({ ...student });
    setIsEditModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingStudent({
      id: `std-${Date.now()}`,
      name: '',
      pin: `${Math.floor(1000 + Math.random() * 9000)}`,
      school: '',
      grade: '중2',
      birthDate: '2012-01-01',
      phone: '010-',
      parentName: '',
      parentPhone: '010-',
      classId: classes[0]?.id || '',
      status: 'active',
      joinedDate: new Date().toISOString().slice(0, 10),
      notes: '',
      monthlyTuition: 380000,
    });
    setIsNewModalOpen(true);
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent.name || !editingStudent.school) return;

    if (isNewModalOpen) {
      onAddStudent(editingStudent as Student);
      setIsNewModalOpen(false);
    } else {
      onUpdateStudent(editingStudent as Student);
      setIsEditModalOpen(false);
      if (selectedStudent?.id === editingStudent.id) {
        setSelectedStudent(editingStudent as Student);
      }
    }
  };

  const handleToggleSoftDelete = (student: Student) => {
    const isDeactivating = student.status === 'active';
    const updated: Student = {
      ...student,
      status: isDeactivating ? 'withdrawn' : 'active',
      withdrawnDate: isDeactivating ? new Date().toISOString().slice(0, 10) : undefined,
    };
    onUpdateStudent(updated);
    if (selectedStudent?.id === student.id) {
      setSelectedStudent(updated);
    }
  };

  const handleSaveConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !consultationContent.trim()) return;

    const newCs: Consultation = {
      id: `cs-${Date.now()}`,
      studentId: selectedStudent.id,
      date: new Date().toISOString().slice(0, 10),
      counselor: counselorName,
      type: consultationType,
      studentPersonality: studentPersonality.trim() || undefined,
      content: consultationContent.trim(),
      nextAction: nextAction.trim() || undefined,
      testScore: testScore ? Number(testScore) : undefined,
    };

    onAddConsultation(newCs);
    setIsAddingConsultation(false);
    setConsultationContent('');
    setStudentPersonality('');
    setNextAction('');
    setTestScore('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="학생 이름, 학교, 연락처, 고유번호..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
            />
          </div>

          {/* Grade Segmented Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
            {(['all', '중1', '중2', '중3'] as const).map(grade => (
              <button
                key={grade}
                onClick={() => setSelectedGrade(grade)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  selectedGrade === grade
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {grade === 'all' ? '전체 학년' : grade}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Active/Withdrawn Toggle & New Student CTA */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'active'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              재원생 ({activeCount})
            </button>
            <button
              onClick={() => setStatusFilter('withdrawn')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                statusFilter === 'withdrawn'
                  ? 'bg-white text-slate-900 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              퇴소생 보관함 ({withdrawnCount})
            </button>
          </div>

          {currentRole !== 'teacher' && (
            <button
              onClick={handleOpenNew}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>신규 원생 등록</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Student Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                <th className="py-3 px-4">학생 고유번호</th>
                <th className="py-3 px-4">이름 / 학교</th>
                <th className="py-3 px-4">학년</th>
                <th className="py-3 px-4">배정 반 / 담당 강사</th>
                <th className="py-3 px-4">학부모 연락처</th>
                <th className="py-3 px-4">입학일</th>
                <th className="py-3 px-4">월 수강료</th>
                <th className="py-3 px-4 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <User className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    검색 조건에 해당하는 학생이 없습니다.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => {
                  const studentClass = classes.find(c => c.id === student.classId);
                  const isSelected = selectedStudent?.id === student.id;

                  return (
                    <tr
                      key={student.id}
                      onClick={() => setSelectedStudent(student)}
                      className={`hover:bg-slate-50/80 cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-50/50' : ''
                      }`}
                    >
                      <td className="py-3 px-4 font-mono font-semibold text-indigo-700 tabular-nums">
                        #{student.pin}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900 text-sm">{student.name}</div>
                        <div className="text-slate-400 text-[11px]">{student.school}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-700">{student.grade}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{studentClass?.name || '미배정'}</div>
                        <div className="text-slate-400 text-[11px]">{studentClass?.teacherName || '-'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                        <div>{student.parentPhone}</div>
                        <div className="text-[11px] text-slate-400">{student.parentName}</div>
                      </td>
                      <td className="py-3 px-4 text-slate-500 font-mono tabular-nums">
                        {student.joinedDate}
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-900 tabular-nums">
                        {student.monthlyTuition.toLocaleString()}원
                      </td>
                      <td className="py-3 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="상세 정보 및 상담일지"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
                            title="정보 수정"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          {currentRole !== 'teacher' && (
                            <button
                              onClick={() => handleToggleSoftDelete(student)}
                              className={`p-1.5 rounded-md transition-colors ${
                                student.status === 'active'
                                  ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                                  : 'text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title={student.status === 'active' ? '퇴소 처리 (Soft Delete)' : '재원생 복구'}
                            >
                              {student.status === 'active' ? <UserX className="w-4 h-4" /> : <RotateCcw className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Drawer (Right side overlay / detail card) */}
      {selectedStudent && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex items-start justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                {selectedStudent.name[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-slate-900">{selectedStudent.name}</h3>
                  <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 font-semibold font-mono">
                    PIN {selectedStudent.pin}
                  </span>
                  <span className={`text-[11px] px-2 py-0.5 rounded font-medium ${
                    selectedStudent.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {selectedStudent.status === 'active' ? '재원 중' : '퇴소 보관'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                  <span>{selectedStudent.school}</span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedStudent.grade}</span>
                  <span aria-hidden="true">·</span>
                  <span>입학일 {selectedStudent.joinedDate}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleOpenEdit(selectedStudent)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>수정</span>
              </button>
              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="text-xs text-slate-400">수강 반</div>
              <div className="text-sm font-semibold text-slate-800 mt-1">
                {classes.find(c => c.id === selectedStudent.classId)?.name || '미배정'}
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="text-xs text-slate-400">학부모 연락처</div>
              <div className="text-sm font-semibold text-slate-800 font-mono tabular-nums mt-1">
                {selectedStudent.parentPhone}
              </div>
              <div className="text-[11px] text-slate-400">{selectedStudent.parentName}</div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="text-xs text-slate-400">최근 단원평가 평균</div>
              {(() => {
                const studentExams = exams.filter(e => e.studentId === selectedStudent.id);
                const avg = studentExams.length > 0 
                  ? Math.round(studentExams.reduce((acc, curr) => acc + curr.score, 0) / studentExams.length)
                  : null;
                return (
                  <div className="text-sm font-semibold text-indigo-700 font-mono tabular-nums mt-1">
                    {avg !== null ? `${avg}점 (${studentExams.length}회 누적)` : '기록 없음'}
                  </div>
                );
              })()}
            </div>

            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              <div className="text-xs text-slate-400">최근 과제 완수율</div>
              {(() => {
                const studentAsg = assignments.filter(a => a.studentId === selectedStudent.id);
                const avgCompletion = studentAsg.length > 0
                  ? Math.round(studentAsg.reduce((acc, curr) => acc + curr.completionRate, 0) / studentAsg.length)
                  : 100;
                return (
                  <div className="text-sm font-semibold text-emerald-700 font-mono tabular-nums mt-1">
                    {avgCompletion}% 달성
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Student Notes */}
          {selectedStudent.notes && (
            <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-900 leading-relaxed">
              <div className="font-semibold mb-0.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                강사 특이사항 및 지도 메모
              </div>
              {selectedStudent.notes}
            </div>
          )}

          {/* Consultation Journal Section */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  상담 일지 누적 기록 ({consultations.filter(c => c.studentId === selectedStudent.id).length}건)
                </h4>
                <p className="text-xs text-slate-500">
                  신규 입학 상담(테스트 결과, 성향) 및 정기/수시 학부모 상담
                </p>
              </div>

              {!isAddingConsultation && (
                <button
                  onClick={() => setIsAddingConsultation(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>새 상담 일지 작성</span>
                </button>
              )}
            </div>

            {/* New Consultation Input Card */}
            {isAddingConsultation && (
              <form onSubmit={handleSaveConsultation} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-800">새 상담 일지 등록</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingConsultation(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    취소
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">상담 유형</label>
                    <select
                      value={consultationType}
                      onChange={e => setConsultationType(e.target.value as Consultation['type'])}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2"
                    >
                      <option value="신규입학상담">신규입학상담</option>
                      <option value="정기학부모상담">정기학부모상담</option>
                      <option value="수시학습상담">수시학습상담</option>
                      <option value="진로및태도">진로및태도</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">상담자</label>
                    <input
                      type="text"
                      value={counselorName}
                      onChange={e => setCounselorName(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-600 block mb-1">진단 테스트 점수 (선택)</label>
                    <input
                      type="number"
                      placeholder="예: 85"
                      value={testScore}
                      onChange={e => setTestScore(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">학생 성향 / 학습 태도</label>
                  <input
                    type="text"
                    placeholder="예: 개념 이해는 빠르나 서술형 정리가 미흡하고 문제 해결 의욕 높음"
                    value={studentPersonality}
                    onChange={e => setStudentPersonality(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">상담 상세 내용 *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="상담한 내용과 학부모 전달 사항을 기록하세요..."
                    value={consultationContent}
                    onChange={e => setConsultationContent(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-medium text-slate-600 block mb-1">향후 조치 계획 (Next Action)</label>
                  <input
                    type="text"
                    placeholder="예: 매주 목요일 17시 오답 클리닉 배정 및 2주 후 피드백 전화"
                    value={nextAction}
                    onChange={e => setNextAction(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg p-2"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingConsultation(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                  >
                    상담 일지 저장
                  </button>
                </div>
              </form>
            )}

            {/* Consultation Timeline List */}
            <div className="space-y-3">
              {consultations.filter(c => c.studentId === selectedStudent.id).length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  아직 등록된 상담 기록이 없습니다. 새 상담 일지를 작성해보세요.
                </div>
              ) : (
                consultations
                  .filter(c => c.studentId === selectedStudent.id)
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map(cs => (
                    <div key={cs.id} className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-800">{cs.type}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-slate-500 font-mono tabular-nums">{cs.date}</span>
                          <span className="text-slate-400">·</span>
                          <span className="text-indigo-600">{cs.counselor}</span>
                        </div>
                        {cs.testScore !== undefined && (
                          <span className="font-mono font-semibold text-indigo-700 text-xs">
                            테스트 점수: {cs.testScore}점
                          </span>
                        )}
                      </div>

                      {cs.studentPersonality && (
                        <div className="text-xs text-slate-600 bg-white/70 p-2 rounded-lg border border-slate-100">
                          <span className="font-semibold text-slate-700">학생 성향: </span>
                          {cs.studentPersonality}
                        </div>
                      )}

                      <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {cs.content}
                      </p>

                      {cs.nextAction && (
                        <div className="text-[11px] text-indigo-700 bg-indigo-50/80 p-2 rounded-lg font-medium">
                          조치 계획: {cs.nextAction}
                        </div>
                      )}
                    </div>
                  ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit / New Student Modal */}
      {(isEditModalOpen || isNewModalOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">
                {isNewModalOpen ? '신규 원생 입학 등록' : '원생 정보 수정'}
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setIsNewModalOpen(false);
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">학생 이름 *</label>
                  <input
                    type="text"
                    required
                    value={editingStudent.name || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, name: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    출결 고유번호 (4자리 PIN) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    value={editingStudent.pin || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, pin: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">재학 학교 *</label>
                  <input
                    type="text"
                    required
                    placeholder="예: 서초중학교"
                    value={editingStudent.school || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, school: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">학년 *</label>
                  <select
                    value={editingStudent.grade || '중2'}
                    onChange={e => setEditingStudent({ ...editingStudent, grade: e.target.value as Student['grade'] })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2"
                  >
                    <option value="중1">중1</option>
                    <option value="중2">중2</option>
                    <option value="중3">중3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">학생 연락처</label>
                  <input
                    type="text"
                    value={editingStudent.phone || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono tabular-nums"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">배정 반</label>
                  <select
                    value={editingStudent.classId || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, classId: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.teacherName})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">학부모 성함</label>
                  <input
                    type="text"
                    placeholder="예: 박선영 (모)"
                    value={editingStudent.parentName || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, parentName: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">
                    학부모 연락처 (알림톡 수신) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="010-0000-0000"
                    value={editingStudent.parentPhone || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, parentPhone: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono tabular-nums"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">입학일</label>
                  <input
                    type="date"
                    value={editingStudent.joinedDate || ''}
                    onChange={e => setEditingStudent({ ...editingStudent, joinedDate: e.target.value })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">월 수강료 (원)</label>
                  <input
                    type="number"
                    step={10000}
                    value={editingStudent.monthlyTuition || 380000}
                    onChange={e => setEditingStudent({ ...editingStudent, monthlyTuition: Number(e.target.value) })}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono tabular-nums"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">특이사항 / 지도 메모</label>
                <textarea
                  rows={2}
                  value={editingStudent.notes || ''}
                  onChange={e => setEditingStudent({ ...editingStudent, notes: e.target.value })}
                  placeholder="수학적 성향, 주의사항 등을 기록하세요."
                  className="w-full text-xs border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setIsNewModalOpen(false);
                  }}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  저장 완료
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
