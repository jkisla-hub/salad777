import React, { useState } from 'react';
import { 
  Student, 
  CurriculumUnit, 
  ExamRecord, 
  AssignmentRecord, 
  AcademyClass, 
  QuestionAnalysis, 
  WrongReason 
} from '../types';
import { 
  BrainCircuit, 
  CheckSquare, 
  BarChart3, 
  Plus, 
  Calendar, 
  User, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  TrendingUp, 
  Award, 
  ArrowRight, 
  Clock, 
  Filter 
} from 'lucide-react';

interface AcademicsViewProps {
  students: Student[];
  units: CurriculumUnit[];
  exams: ExamRecord[];
  assignments: AssignmentRecord[];
  classes: AcademyClass[];
  onAddExam: (exam: ExamRecord) => void;
  onUpdateAssignment: (assignment: AssignmentRecord) => void;
  onAddAssignment: (assignment: AssignmentRecord) => void;
  onScheduleClinicForStudent?: (studentId: string, topic: string) => void;
}

export const AcademicsView: React.FC<AcademicsViewProps> = ({
  students,
  units,
  exams,
  assignments,
  classes,
  onAddExam,
  onUpdateAssignment,
  onAddAssignment,
  onScheduleClinicForStudent,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'homework' | 'exams' | 'wrongAnalysis'>('wrongAnalysis');
  
  // Homework state
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || 'all');
  const [homeworkDate, setHomeworkDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [isAddHomeworkOpen, setIsAddHomeworkOpen] = useState(false);
  const [newHomeworkTitle, setNewHomeworkTitle] = useState('');

  // Exam DB state
  const [selectedGrade, setSelectedGrade] = useState<'all' | '중1' | '중2' | '중3'>('all');
  const [isNewExamOpen, setIsNewExamOpen] = useState(false);

  // Wrong Analysis state
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');

  const activeStudents = students.filter(s => s.status === 'active');
  const currentStudent = students.find(s => s.id === selectedStudentId) || activeStudents[0];

  // Helper for all questions analyzed for selected student
  const studentExams = exams.filter(e => e.studentId === (currentStudent?.id || ''));
  const allStudentQuestions: QuestionAnalysis[] = studentExams.flatMap(e => e.questions);
  const wrongQuestions = allStudentQuestions.filter(q => !q.isCorrect);

  // Group wrong reasons
  const wrongReasonCounts: Record<WrongReason, number> = {
    '개념 부족': 0,
    '계산 실수': 0,
    '문제 독해 오류': 0,
    '공식 암기 부족': 0,
    '심화 응용력 부족': 0,
    '시간 부족': 0,
  };

  wrongQuestions.forEach(q => {
    if (q.wrongReason && wrongReasonCounts[q.wrongReason] !== undefined) {
      wrongReasonCounts[q.wrongReason]++;
    }
  });

  // Calculate Independence Indicators
  const totalQuestions = allStudentQuestions.length || 1;
  const zeroHintCount = allStudentQuestions.filter(q => q.hintsGiven === 0 && q.isCorrect).length;
  const oneHintCount = allStudentQuestions.filter(q => q.hintsGiven === 1 && q.selfResolved).length;
  const multiHintOrStuckCount = allStudentQuestions.filter(q => q.hintsGiven >= 2 || !q.selfResolved).length;

  const zeroHintRate = Math.round((zeroHintCount / totalQuestions) * 100);
  const oneHintRate = Math.round((oneHintCount / totalQuestions) * 100);
  const multiHintRate = Math.round((multiHintOrStuckCount / totalQuestions) * 100);

  // New Exam Form State
  const [newExamUnitId, setNewExamUnitId] = useState<string>(units[0]?.id || '');
  const [newExamTitle, setNewExamTitle] = useState('');
  const [newExamStudentId, setNewExamStudentId] = useState<string>(students[0]?.id || '');
  const [newExamQuestions, setNewExamQuestions] = useState<QuestionAnalysis[]>([
    { questionNumber: 1, concept: '기본 개념 확인', isCorrect: true, score: 20, maxScore: 20, hintsGiven: 0, selfResolved: true, difficulty: '하' },
    { questionNumber: 2, concept: '대표 필수 유형', isCorrect: true, score: 20, maxScore: 20, hintsGiven: 0, selfResolved: true, difficulty: '중' },
    { questionNumber: 3, concept: '서술형 식 유도', isCorrect: false, score: 5, maxScore: 20, wrongReason: '계산 실수', hintsGiven: 1, selfResolved: true, difficulty: '중' },
    { questionNumber: 4, concept: '문장제 실생활 활용', isCorrect: false, score: 0, maxScore: 20, wrongReason: '문제 독해 오류', hintsGiven: 2, selfResolved: false, difficulty: '상' },
    { questionNumber: 5, concept: '최고난도 변별력 문항', isCorrect: true, score: 20, maxScore: 20, hintsGiven: 1, selfResolved: true, difficulty: '상' }
  ]);
  const [newExamComment, setNewExamComment] = useState('');

  const handleSaveNewExam = (e: React.FormEvent) => {
    e.preventDefault();
    const unit = units.find(u => u.id === newExamUnitId);
    const totalScore = newExamQuestions.reduce((acc, q) => acc + (q.isCorrect ? q.score : (q.score || 0)), 0);
    const maxScore = newExamQuestions.reduce((acc, q) => acc + q.maxScore, 0);

    const record: ExamRecord = {
      id: `exam-${Date.now()}`,
      studentId: newExamStudentId,
      unitId: newExamUnitId,
      unitName: unit?.title || '단원평가',
      date: new Date().toISOString().slice(0, 10),
      title: newExamTitle.trim() || `${unit?.title || '수학'} 단원평가`,
      score: totalScore,
      maxScore: maxScore,
      questions: newExamQuestions,
      teacherComment: newExamComment.trim() || '시험 채점 및 오답 분석 완료.',
    };

    onAddExam(record);
    setIsNewExamOpen(false);
    setSelectedStudentId(newExamStudentId);
    setActiveSubTab('wrongAnalysis');
  };

  const handleAddHomeworkBatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHomeworkTitle.trim()) return;

    const classStudents = activeStudents.filter(s => selectedClassId === 'all' || s.classId === selectedClassId);
    classStudents.forEach(st => {
      const newAsg: AssignmentRecord = {
        id: `asg-${Date.now()}-${st.id}`,
        studentId: st.id,
        classId: st.classId,
        date: homeworkDate,
        title: newHomeworkTitle.trim(),
        status: 'completed',
        grade: 'A',
        completionRate: 100,
        note: '정상 제출 완료',
      };
      onAddAssignment(newAsg);
    });

    setIsAddHomeworkOpen(false);
    setNewHomeworkTitle('');
  };

  return (
    <div className="space-y-6">
      {/* Sub Navigation Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('wrongAnalysis')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeSubTab === 'wrongAnalysis'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-600" />
            <span>오답 & 취약유형 정밀 분석기</span>
          </button>

          <button
            onClick={() => setActiveSubTab('exams')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeSubTab === 'exams'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-indigo-600" />
            <span>단원별 평가 DB</span>
          </button>

          <button
            onClick={() => setActiveSubTab('homework')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              activeSubTab === 'homework'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
            <span>일일 과제 트래커</span>
          </button>
        </div>

        {activeSubTab === 'exams' && (
          <button
            onClick={() => setIsNewExamOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>단원 평가 입력</span>
          </button>
        )}

        {activeSubTab === 'homework' && (
          <button
            onClick={() => setIsAddHomeworkOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>일괄 과제 배정</span>
          </button>
        )}
      </div>

      {/* ──────────────────────────────────────────────────────────
          SUBTAB 1: WRONG REASON & INDEPENDENCE ANALYZER (CORE)
         ────────────────────────────────────────────────────────── */}
      {activeSubTab === 'wrongAnalysis' && (
        <div className="space-y-6">
          {/* Student Selector Bar */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-700 shrink-0">분석 대상 원생:</span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-xl">
                {activeStudents.map(st => (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStudentId(st.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      currentStudent?.id === st.id
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {st.name} ({st.grade})
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              누적 평가 {studentExams.length}회 · 총 {allStudentQuestions.length}문항 분석
            </div>
          </div>

          {/* Top Metric Cards: Problem-Solving Independence */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: 0 Hints (Independent Solving) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  스스로 해결 (힌트 0회)
                </span>
                <span className="font-mono tabular-nums text-emerald-700 font-semibold">{zeroHintCount}문항</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {zeroHintRate}%
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${zeroHintRate}%` }} />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                선생님의 도움 없이 수학적 원리를 스스로 도출한 문항 비율
              </p>
            </div>

            {/* Card 2: 1 Hint (Minor Guidance) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  1회 힌트 후 해결 (발판 학습)
                </span>
                <span className="font-mono tabular-nums text-indigo-700 font-semibold">{oneHintCount}문항</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {oneHintRate}%
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${oneHintRate}%` }} />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                1회 힌트 제공 후 자기주도적으로 올바른 답안을 완성한 비율
              </p>
            </div>

            {/* Card 3: 2+ Hints or Stuck (Needs Targeted Clinic) */}
            <div className="bg-white p-5 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  클리닉 요망 (힌트 2회+ / 미해결)
                </span>
                <span className="font-mono tabular-nums text-amber-700 font-semibold">{multiHintOrStuckCount}문항</span>
              </div>
              <div className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                {multiHintRate}%
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${multiHintRate}%` }} />
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                개념 결손 또는 문제 독해 어려움으로 1:1 보강이 필요한 문항
              </p>
            </div>
          </div>

          {/* Wrong Reason Tag Breakdown Visualization */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Filter className="w-4 h-4 text-indigo-600" />
                  오답 원인 심층 태깅 분석 (누적 오답 {wrongQuestions.length}건)
                </h3>
                <p className="text-xs text-slate-500">
                  단순히 점수가 깎인 것이 아니라, '왜 틀렸는가'에 대한 체계적 원인 분류
                </p>
              </div>

              {onScheduleClinicForStudent && wrongQuestions.length > 0 && (
                <button
                  onClick={() => onScheduleClinicForStudent(currentStudent.id, `${currentStudent.name} 취약 오답 클리닉`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                >
                  <span>오답 클리닉 일정 잡기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Horizontal Distribution Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {(Object.keys(wrongReasonCounts) as WrongReason[]).map(reason => {
                const count = wrongReasonCounts[reason];
                const percentage = wrongQuestions.length > 0 ? Math.round((count / wrongQuestions.length) * 100) : 0;
                
                const reasonColor = 
                  reason === '계산 실수' ? 'bg-amber-500' :
                  reason === '개념 부족' ? 'bg-rose-500' :
                  reason === '문제 독해 오류' ? 'bg-blue-500' :
                  reason === '시간 부족' ? 'bg-purple-500' :
                  reason === '공식 암기 부족' ? 'bg-orange-500' : 'bg-slate-600';

                return (
                  <div key={reason} className="p-3 bg-slate-50/70 rounded-xl border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800">{reason}</span>
                      <span className="font-mono tabular-nums text-slate-600">
                        {count}건 ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div className={`${reasonColor} h-full rounded-full transition-all duration-300`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Question Analysis Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                최근 평가 문항별 주도성 & 오답 상세 내역
              </h4>
              <span className="text-xs text-slate-500 font-mono">
                {currentStudent.name} 학생 전용 리포트
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                    <th className="py-2.5 px-4">단원 / 시험명</th>
                    <th className="py-2.5 px-4">문항</th>
                    <th className="py-2.5 px-4">세부 개념</th>
                    <th className="py-2.5 px-4">난이도</th>
                    <th className="py-2.5 px-4">결과</th>
                    <th className="py-2.5 px-4">오답 사유 태그</th>
                    <th className="py-2.5 px-4">힌트 횟수</th>
                    <th className="py-2.5 px-4 text-right">스스로 해결</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {studentExams.flatMap(exam => 
                    exam.questions.map((q, idx) => (
                      <tr key={`${exam.id}-${idx}`} className="hover:bg-slate-50/60">
                        <td className="py-2.5 px-4 text-slate-700 font-medium max-w-xs truncate">
                          {exam.title}
                        </td>
                        <td className="py-2.5 px-4 font-mono font-semibold text-slate-800">
                          #{q.questionNumber}
                        </td>
                        <td className="py-2.5 px-4 text-slate-700">
                          {q.concept}
                        </td>
                        <td className="py-2.5 px-4">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                            q.difficulty === '상' ? 'bg-rose-50 text-rose-700' :
                            q.difficulty === '중' ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {q.difficulty}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          {q.isCorrect ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              정답 ({q.score}점)
                            </span>
                          ) : (
                            <span className="text-rose-600 font-semibold">
                              오답 ({q.score}/{q.maxScore}점)
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 font-medium text-slate-800">
                          {q.wrongReason ? (
                            <span className="text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 text-[11px]">
                              {q.wrongReason}
                            </span>
                          ) : (
                            <span className="text-slate-300">-</span>
                          )}
                        </td>
                        <td className="py-2.5 px-4 font-mono tabular-nums">
                          {q.hintsGiven === 0 ? '0회 (독립)' : `${q.hintsGiven}회 제공`}
                        </td>
                        <td className="py-2.5 px-4 text-right font-medium">
                          {q.selfResolved ? (
                            <span className="text-emerald-700 font-medium">성공</span>
                          ) : (
                            <span className="text-rose-600 font-medium">클리닉 요망</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          SUBTAB 2: UNIT EXAM DATABASE
         ────────────────────────────────────────────────────────── */}
      {activeSubTab === 'exams' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">학년 필터:</span>
              <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
                {(['all', '중1', '중2', '중3'] as const).map(gr => (
                  <button
                    key={gr}
                    onClick={() => setSelectedGrade(gr)}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      selectedGrade === gr ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-slate-600'
                    }`}
                  >
                    {gr === 'all' ? '전체' : gr}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-xs text-slate-500 font-mono">
              누적 평가 총 {exams.length}건 보관
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {exams
              .filter(exam => {
                if (selectedGrade === 'all') return true;
                const student = students.find(s => s.id === exam.studentId);
                return student?.grade === selectedGrade;
              })
              .map(exam => {
                const student = students.find(s => s.id === exam.studentId);
                const scorePercent = Math.round((exam.score / exam.maxScore) * 100);

                return (
                  <div key={exam.id} className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{exam.title}</span>
                          <span className="text-[11px] text-slate-500 font-mono tabular-nums">{exam.date}</span>
                        </div>
                        <div className="text-xs text-indigo-700 font-medium mt-0.5">
                          {student?.name} ({student?.school} {student?.grade}) · {exam.unitName}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-extrabold text-indigo-700 font-mono tabular-nums">
                          {exam.score}
                          <span className="text-xs font-normal text-slate-400">/{exam.maxScore}점</span>
                        </div>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          scorePercent >= 90 ? 'bg-emerald-50 text-emerald-700' :
                          scorePercent >= 75 ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {scorePercent >= 90 ? '최우수' : scorePercent >= 75 ? '우수' : '보충 필요'}
                        </span>
                      </div>
                    </div>

                    {/* Teacher Feedback */}
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed">
                      "{exam.teacherComment}"
                    </p>

                    {/* Question summary chips */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-100 pt-2 font-mono">
                      <span>총 {exam.questions.length}문항 중 정답 {exam.questions.filter(q => q.isCorrect).length}개</span>
                      <button
                        onClick={() => {
                          setSelectedStudentId(exam.studentId);
                          setActiveSubTab('wrongAnalysis');
                        }}
                        className="text-indigo-600 hover:underline font-semibold"
                      >
                        오답 정밀 분석 보기 →
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* ──────────────────────────────────────────────────────────
          SUBTAB 3: HOMEWORK TRACKER
         ────────────────────────────────────────────────────────── */}
      {activeSubTab === 'homework' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                <Calendar className="w-4 h-4 text-slate-500" />
                <input
                  type="date"
                  value={homeworkDate}
                  onChange={e => setHomeworkDate(e.target.value)}
                  className="text-xs font-mono bg-transparent text-slate-800"
                />
              </div>

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
            </div>

            <div className="text-xs text-slate-500">
              일일 과제 수행도 및 등급(A/B/C/F) 기록
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                    <th className="py-3 px-4">학생명</th>
                    <th className="py-3 px-4">수강 반</th>
                    <th className="py-3 px-4">과제 명</th>
                    <th className="py-3 px-4">완수율</th>
                    <th className="py-3 px-4">성취 등급</th>
                    <th className="py-3 px-4">상태</th>
                    <th className="py-3 px-4">강사 코멘트</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeStudents
                    .filter(st => selectedClassId === 'all' || st.classId === selectedClassId)
                    .map(student => {
                      const asg = assignments.find(a => a.studentId === student.id && a.date === homeworkDate) || {
                        id: `asg-tmp-${student.id}`,
                        studentId: student.id,
                        classId: student.classId,
                        date: homeworkDate,
                        title: '쎈수학/개념원리 당일 필수 문제풀이',
                        status: 'completed',
                        grade: 'A',
                        completionRate: 100,
                        note: '정상 제출 완료',
                      };
                      const studentClass = classes.find(c => c.id === student.classId);

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4">
                            <span className="font-semibold text-slate-900">{student.name}</span>
                            <span className="text-[11px] text-slate-400 block">{student.school}</span>
                          </td>
                          <td className="py-3 px-4 text-slate-700">{studentClass?.name || '-'}</td>
                          <td className="py-3 px-4 text-slate-800 font-medium">{asg.title}</td>
                          <td className="py-3 px-4 font-mono tabular-nums">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">{asg.completionRate}%</span>
                              <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${asg.completionRate}%` }} />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                              asg.grade === 'A' ? 'bg-emerald-50 text-emerald-700' :
                              asg.grade === 'B' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                            }`}>
                              {asg.grade}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-emerald-700 font-medium">제출 완료</span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                            {asg.note}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* New Exam Input Modal */}
      {isNewExamOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">단원별 평가 및 오답 원인 태깅 입력</h3>
              <button onClick={() => setIsNewExamOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleSaveNewExam} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">대상 원생 *</label>
                  <select
                    value={newExamStudentId}
                    onChange={e => setNewExamStudentId(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2"
                  >
                    {activeStudents.map(st => (
                      <option key={st.id} value={st.id}>{st.name} ({st.school} {st.grade})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700 block mb-1">수학 단원 선택 *</label>
                  <select
                    value={newExamUnitId}
                    onChange={e => setNewExamUnitId(e.target.value)}
                    className="w-full text-xs border border-slate-300 rounded-lg p-2"
                  >
                    {units.map(u => (
                      <option key={u.id} value={u.id}>[{u.gradeSemester}] {u.title}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">시험 제목</label>
                <input
                  type="text"
                  placeholder="예: 10월 연립방정식 활용 및 부등식 단원평가"
                  value={newExamTitle}
                  onChange={e => setNewExamTitle(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2"
                />
              </div>

              {/* Questions analysis list */}
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-2">
                  문항별 채점 및 오답 원인 태깅 ({newExamQuestions.length}문항)
                </label>
                <div className="space-y-2">
                  {newExamQuestions.map((q, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-12 gap-2 items-center text-xs">
                      <div className="col-span-1 font-mono font-bold text-slate-800">#{q.questionNumber}</div>
                      <div className="col-span-3">
                        <input
                          type="text"
                          value={q.concept}
                          onChange={e => {
                            const updated = [...newExamQuestions];
                            updated[idx].concept = e.target.value;
                            setNewExamQuestions(updated);
                          }}
                          placeholder="개념명"
                          className="w-full text-xs border border-slate-200 rounded p-1.5 bg-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <select
                          value={q.isCorrect ? 'O' : 'X'}
                          onChange={e => {
                            const updated = [...newExamQuestions];
                            updated[idx].isCorrect = e.target.value === 'O';
                            if (e.target.value === 'O') {
                              updated[idx].score = updated[idx].maxScore;
                              updated[idx].wrongReason = undefined;
                            } else {
                              updated[idx].score = 0;
                              updated[idx].wrongReason = '계산 실수';
                            }
                            setNewExamQuestions(updated);
                          }}
                          className={`w-full font-bold text-xs border rounded p-1.5 ${q.isCorrect ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'}`}
                        >
                          <option value="O">정답 (O)</option>
                          <option value="X">오답 (X)</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        {!q.isCorrect ? (
                          <select
                            value={q.wrongReason || '계산 실수'}
                            onChange={e => {
                              const updated = [...newExamQuestions];
                              updated[idx].wrongReason = e.target.value as WrongReason;
                              setNewExamQuestions(updated);
                            }}
                            className="w-full text-[11px] border border-amber-300 rounded p-1.5 bg-amber-50/50 text-amber-900"
                          >
                            <option value="개념 부족">개념 부족</option>
                            <option value="계산 실수">계산 실수</option>
                            <option value="문제 독해 오류">문제 독해 오류</option>
                            <option value="공식 암기 부족">공식 암기 부족</option>
                            <option value="심화 응용력 부족">심화 응용력 부족</option>
                            <option value="시간 부족">시간 부족</option>
                          </select>
                        ) : (
                          <span className="text-[11px] text-slate-400 pl-1">힌트: {q.hintsGiven}회</span>
                        )}
                      </div>
                      <div className="col-span-3 flex items-center gap-1">
                        <span className="text-[10px] text-slate-400">힌트:</span>
                        <select
                          value={q.hintsGiven}
                          onChange={e => {
                            const updated = [...newExamQuestions];
                            updated[idx].hintsGiven = Number(e.target.value) as 0 | 1 | 2 | 3;
                            setNewExamQuestions(updated);
                          }}
                          className="w-full text-[11px] border border-slate-200 rounded p-1 bg-white font-mono"
                        >
                          <option value={0}>0회(독립)</option>
                          <option value={1}>1회(가이드)</option>
                          <option value={2}>2회(다회)</option>
                          <option value={3}>3회(전면지도)</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">강사 종합 피드백 코멘트 *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="학생의 문제 해결 과정, 강점과 보완점을 기록하세요..."
                  value={newExamComment}
                  onChange={e => setNewExamComment(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewExamOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  평가 저장 및 오답 분석 갱신
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Homework Modal */}
      {isAddHomeworkOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">당일 과제 일괄 배정</h3>
              <button onClick={() => setIsAddHomeworkOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleAddHomeworkBatch} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">배정 반</label>
                <select
                  value={selectedClassId}
                  onChange={e => setSelectedClassId(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2"
                >
                  <option value="all">전체 수강 반</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">과제 날짜</label>
                <input
                  type="date"
                  value={homeworkDate}
                  onChange={e => setHomeworkDate(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-700 block mb-1">과제 명 *</label>
                <input
                  type="text"
                  required
                  placeholder="예: 쎈수학 중2-1 연립방정식 40~55페이지 30문항"
                  value={newHomeworkTitle}
                  onChange={e => setNewHomeworkTitle(e.target.value)}
                  className="w-full text-xs border border-slate-300 rounded-lg p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddHomeworkOpen(false)}
                  className="px-4 py-2 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  반 전원 과제 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
