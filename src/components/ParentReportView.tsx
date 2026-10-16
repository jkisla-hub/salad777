import React, { useState } from 'react';
import { 
  Student, 
  ExamRecord, 
  AssignmentRecord, 
  Attendance, 
  AcademyClass, 
  WrongReason 
} from '../types';
import { 
  Printer, 
  Share2, 
  ExternalLink, 
  Copy, 
  Check, 
  Calendar, 
  Award, 
  TrendingUp, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  FileText, 
  BrainCircuit, 
  GraduationCap 
} from 'lucide-react';

interface ParentReportViewProps {
  students: Student[];
  exams: ExamRecord[];
  assignments: AssignmentRecord[];
  attendances: Attendance[];
  classes: AcademyClass[];
}

export const ParentReportView: React.FC<ParentReportViewProps> = ({
  students,
  exams,
  assignments,
  attendances,
  classes,
}) => {
  const activeStudents = students.filter(s => s.status === 'active');
  const [selectedStudentId, setSelectedStudentId] = useState<string>(activeStudents[0]?.id || '');
  const [reportPeriod, setReportPeriod] = useState<'monthly' | 'weekly'>('monthly');
  const [copiedKakao, setCopiedKakao] = useState(false);
  const [isWebPreviewOpen, setIsWebPreviewOpen] = useState(false);

  const student = students.find(s => s.id === selectedStudentId) || activeStudents[0];
  const studentClass = classes.find(c => c.id === student?.classId);

  // Student specific data
  const studentExams = exams.filter(e => e.studentId === student?.id);
  const studentAssignments = assignments.filter(a => a.studentId === student?.id);
  const studentAttendances = attendances.filter(a => a.studentId === student?.id);

  // Calculated metrics
  const totalExams = studentExams.length;
  const avgScore = totalExams > 0 
    ? Math.round(studentExams.reduce((sum, e) => sum + e.score, 0) / totalExams) 
    : 85;

  const totalAssignments = studentAssignments.length || 1;
  const completedAssignments = studentAssignments.filter(a => a.status === 'completed').length;
  const homeworkRate = Math.round((completedAssignments / totalAssignments) * 100);

  const totalAttDays = studentAttendances.length || 1;
  const onTimeDays = studentAttendances.filter(a => a.status === 'present').length;
  const lateDays = studentAttendances.filter(a => a.status === 'late').length;
  const attendanceRate = Math.round((onTimeDays / totalAttDays) * 100);

  // Wrong question statistics
  const allQuestions = studentExams.flatMap(e => e.questions);
  const wrongQuestions = allQuestions.filter(q => !q.isCorrect);
  const wrongReasonCounts: Record<string, number> = {};
  wrongQuestions.forEach(q => {
    const reason = q.wrongReason || '기타';
    wrongReasonCounts[reason] = (wrongReasonCounts[reason] || 0) + 1;
  });

  const independenceCount = allQuestions.filter(q => q.hintsGiven === 0 && q.isCorrect).length;
  const independenceRate = allQuestions.length > 0 ? Math.round((independenceCount / allQuestions.length) * 100) : 75;

  const handlePrint = () => {
    window.print();
  };

  const kakaoMessageText = `[Study Labs 수학학원 - ${student?.name} 학생 학습 리포트]
학부모님, 안녕하십니까. Study Labs 수학학원입니다.
${student?.name} 학생의 ${reportPeriod === 'monthly' ? '2026년 10월 종합 월간' : '10월 주간'} 학습 리포트를 전달해 드립니다.

▶ 출결 성실도: ${attendanceRate}% (출석 ${onTimeDays}회, 지각 ${lateDays}회)
▶ 과제 완수율: ${homeworkRate}% (평균 성취도 A)
▶ 최근 단원평가 평균: ${avgScore}점
▶ 자기주도 해결율: ${independenceRate}% (힌트 없이 해결)

상세 오답 분석 및 그래프 리포트 보기:
https://studylabs.edu/report/${student?.pin}`;

  const handleCopyKakao = () => {
    navigator.clipboard.writeText(kakaoMessageText);
    setCopiedKakao(true);
    setTimeout(() => setCopiedKakao(false), 2500);
  };

  if (!student) return null;

  return (
    <div className="space-y-6">
      {/* Top Filter & Export Bar (Hidden during print) */}
      <div className="no-print bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">원생 선택:</span>
            <select
              value={selectedStudentId}
              onChange={e => setSelectedStudentId(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 font-medium text-slate-800"
            >
              {activeStudents.map(st => (
                <option key={st.id} value={st.id}>
                  {st.name} ({st.school} {st.grade})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setReportPeriod('monthly')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                reportPeriod === 'monthly' ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              월간 종합 리포트
            </button>
            <button
              onClick={() => setReportPeriod('weekly')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                reportPeriod === 'weekly' ? 'bg-white text-indigo-700 shadow-xs font-semibold' : 'text-slate-600'
              }`}
            >
              주간 클리닉 리포트
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setIsWebPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            <span>학부모 모바일 웹 미리보기</span>
          </button>

          <button
            onClick={handleCopyKakao}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            {copiedKakao ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-indigo-600" />}
            <span>{copiedKakao ? '카톡 문구 복사완료!' : '카톡 공유 문구 복사'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>A4 인쇄 / PDF 다운로드</span>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          MAIN PRINTABLE ACADEMIC REPORT (A4 FRIENDLY CONTAINER)
         ────────────────────────────────────────────────────────── */}
      <div className="print-container bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-4xl mx-auto space-y-8">
        
        {/* Report Official Header */}
        <div className="border-b-2 border-slate-900 pb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Study Labs Middle School Math Report</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {student.name} 학생 수학 학습 성취도 & 오답 정밀 분석서
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              발행 기간: {reportPeriod === 'monthly' ? '2026년 10월 종합 성취도 평가' : '2026년 10월 2주차 주간 평가'} · 발행처: Study Labs 중등수학 전문학원
            </p>
          </div>

          <div className="text-right">
            <div className="text-lg font-black text-indigo-700">STUDY LABS</div>
            <div className="text-[11px] text-slate-400 font-mono">인증번호 #SL-{student.pin}-2610</div>
          </div>
        </div>

        {/* Student Profile Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">원생명 / 고유번호</span>
            <span className="font-bold text-slate-900 text-sm">{student.name}</span>
            <span className="text-slate-500 font-mono text-[11px] ml-1">#{student.pin}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">학교 및 학년</span>
            <span className="font-bold text-slate-900 text-sm">{student.school} {student.grade}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">수강 반 / 담당 강사</span>
            <span className="font-bold text-slate-900 text-sm">{studentClass?.name || '심화반'}</span>
            <span className="text-slate-500 block text-[11px]">{studentClass?.teacherName || '박도형 강사'}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[11px]">학부모 연락처</span>
            <span className="font-mono font-medium text-slate-900">{student.parentPhone}</span>
            <span className="text-slate-400 block text-[11px]">{student.parentName}</span>
          </div>
        </div>

        {/* 4 Core Quantitative Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 text-center">
            <div className="text-xs text-indigo-700 font-medium">출결 성실도</div>
            <div className="text-2xl font-black text-indigo-900 font-mono tabular-nums mt-1">
              {attendanceRate}%
            </div>
            <div className="text-[11px] text-indigo-600 mt-1 font-mono">
              출석 {onTimeDays}회 · 지각 {lateDays}회
            </div>
          </div>

          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
            <div className="text-xs text-emerald-700 font-medium">과제 완수율</div>
            <div className="text-2xl font-black text-emerald-900 font-mono tabular-nums mt-1">
              {homeworkRate}%
            </div>
            <div className="text-[11px] text-emerald-600 mt-1">
              평균 등급: 최우수 (A)
            </div>
          </div>

          <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-center">
            <div className="text-xs text-blue-700 font-medium">단원평가 평균</div>
            <div className="text-2xl font-black text-blue-900 font-mono tabular-nums mt-1">
              {avgScore}점
            </div>
            <div className="text-[11px] text-blue-600 mt-1">
              상위 15%권 달성
            </div>
          </div>

          <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100 text-center">
            <div className="text-xs text-purple-700 font-medium">자기주도 해결력</div>
            <div className="text-2xl font-black text-purple-900 font-mono tabular-nums mt-1">
              {independenceRate}%
            </div>
            <div className="text-[11px] text-purple-600 mt-1">
              힌트 0회 단독 완수율
            </div>
          </div>
        </div>

        {/* Section 1: 단원별 성적 변화 추이 그래프 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              1. 중등 수학 단원별 성취도 점수 추이
            </h3>
            <span className="text-xs text-slate-500 font-mono">학원 권장 기준선 80점</span>
          </div>

          {studentExams.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
              누적된 단원평가 데이터가 없습니다.
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              {studentExams.map(exam => {
                const percent = Math.round((exam.score / exam.maxScore) * 100);
                return (
                  <div key={exam.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-800">{exam.title}</span>
                        <span className="text-slate-400 text-[11px] ml-2">({exam.date})</span>
                      </div>
                      <span className="font-mono font-bold text-indigo-700 tabular-nums">
                        {exam.score}점 / {exam.maxScore}점 ({percent}%)
                      </span>
                    </div>

                    <div className="relative w-full bg-slate-100 h-4 rounded-full overflow-hidden">
                      {/* 80 point benchmark line */}
                      <div className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-slate-400/80 z-10" title="기준선 80점" />
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          percent >= 90 ? 'bg-indigo-600' : percent >= 80 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: 오답 원인 정밀 분석 (차별화 지표) */}
        <div className="space-y-3">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-600" />
              2. 취약 유형 및 오답 원인 분석 (Study Labs 특화)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              학생이 오답을 낸 근본적인 이유를 추적하여 맞춤 보강 방향을 설정합니다.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 block">오답 원인별 발생 비율</span>
              {Object.keys(wrongReasonCounts).length === 0 ? (
                <div className="text-xs text-slate-400 py-4 text-center">오답 기록이 없습니다 (전 문항 정답)</div>
              ) : (
                Object.entries(wrongReasonCounts).map(([reason, count]) => {
                  const pct = Math.round((count / (wrongQuestions.length || 1)) * 100);
                  return (
                    <div key={reason} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-700 font-medium">{reason}</span>
                        <span className="font-mono tabular-nums text-slate-600">{count}건 ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3 text-xs leading-relaxed">
              <span className="text-xs font-bold text-slate-800 block">오답 원인 정밀 진단 소견</span>
              <div className="space-y-2 text-slate-600">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <p>
                    <strong>계산 실수 방지 훈련:</strong> 복잡한 분수·소수 사칙연산과 부호 변환 과정에서 덤벙거리는 실수가 관찰되어, 풀이 식을 줄맞춰 쓰는 5단계 오답노트 작성법을 매일 점검하고 있습니다.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <p>
                    <strong>문장제 활용 독해력:</strong> 거리·속력·농도 등 긴 문장제 문제에서 조건 끊어 읽기 훈련을 진행하여 식 세우기 적중률이 20% 향상되었습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: 강사 종합 지도 코멘트 및 다음 달 학습 계획 */}
        <div className="space-y-3">
          <div className="border-b border-slate-200 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              3. 담당 강사 종합 코멘트 및 향후 지도 계획
            </h3>
          </div>

          <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200 space-y-2 text-xs leading-relaxed">
            <p className="text-slate-800 whitespace-pre-wrap font-medium">
              "{student.name} 학생은 수학적 개념을 직관적으로 이해하는 속도가 매우 빠르고, 고난도 킬러 문항에 스스로 도전하는 학습 의지가 매우 뛰어납니다. 
              최근 연립방정식 및 일차부등식 단원평가에서 {avgScore}점을 기록하며 상위권에 안착했습니다.
              다만 시험 상황에서 빠른 풀이를 의식하다 발생하는 사소한 부호 실수와 조건 누락을 보완하기 위해, 검산 습관 훈련과 1:1 오답 클리닉을 병행할 예정입니다. 가정에서도 학생의 성실한 노력을 크게 칭찬해 주시기 바랍니다."
            </p>
            <div className="text-right text-slate-500 font-semibold pt-1">
              - Study Labs 수학과 {studentClass?.teacherName || '박도형 강사'} 배상 -
            </div>
          </div>
        </div>

        {/* Official Academy Seal & Footer */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <div>
            <div className="font-bold text-slate-800">Study Labs 중등수학 전문학원</div>
            <div className="text-[11px] text-slate-400">서울특별시 서초구 반포대로 128 학원빌딩 3·4층 | 상담문의: 02-588-3920</div>
          </div>
          <div className="w-16 h-16 rounded-full border-2 border-indigo-200 flex items-center justify-center text-[10px] text-indigo-700 font-bold text-center leading-tight">
            Study Labs<br/>학습평가인
          </div>
        </div>
      </div>

      {/* Simulated Parent Web Page Preview Modal */}
      {isWebPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-100 rounded-3xl border border-slate-300 shadow-2xl w-full max-w-sm max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            {/* Mobile Header Bar */}
            <div className="bg-white px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">학부모 전용 모바일 웹 뷰어</span>
              <button onClick={() => setIsWebPreviewOpen(false)} className="text-xs text-slate-500 hover:text-slate-800 font-bold">닫기</button>
            </div>

            {/* Mobile Viewport */}
            <div className="p-4 space-y-4 overflow-y-auto text-xs bg-slate-50">
              <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 text-center space-y-1">
                <span className="text-[10px] text-indigo-700 font-bold">Study Labs 학부모 알림장</span>
                <h4 className="text-base font-extrabold text-slate-900">{student.name} 학생 10월 리포트</h4>
                <p className="text-[11px] text-slate-400">{student.school} {student.grade} · {studentClass?.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                  <div className="text-[11px] text-slate-400">출석률</div>
                  <div className="text-lg font-bold text-indigo-600 font-mono mt-0.5">{attendanceRate}%</div>
                </div>
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                  <div className="text-[11px] text-slate-400">과제 수행률</div>
                  <div className="text-lg font-bold text-emerald-600 font-mono mt-0.5">{homeworkRate}%</div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 space-y-2">
                <div className="font-bold text-slate-800 text-xs">최근 단원평가 성적</div>
                {studentExams.map(ex => (
                  <div key={ex.id} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-none">
                    <span className="text-[11px] text-slate-700">{ex.title}</span>
                    <span className="font-bold text-indigo-700 font-mono">{ex.score}점</span>
                  </div>
                ))}
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-xs border border-slate-200 space-y-1 text-slate-700 text-[11px] leading-relaxed">
                <div className="font-bold text-slate-900 text-xs mb-1">강사 메시지</div>
                "{student.name} 학생은 오답 노트를 성실히 정리하며 스스로 힌트 없이 해결하는 능력이 크게 향상되었습니다!"
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
