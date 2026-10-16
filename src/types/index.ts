export type UserRole = 'director' | 'teacher' | 'desk';

export interface Student {
  id: string;
  name: string;
  pin: string; // 4-digit attendance PIN
  school: string;
  grade: '중1' | '중2' | '중3';
  birthDate: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  classId: string;
  status: 'active' | 'withdrawn'; // Soft delete
  joinedDate: string;
  withdrawnDate?: string;
  notes: string;
  monthlyTuition: number;
}

export interface Consultation {
  id: string;
  studentId: string;
  date: string;
  counselor: string;
  type: '신규입학상담' | '정기학부모상담' | '수시학습상담' | '진로및태도';
  testScore?: number;
  studentPersonality?: string;
  content: string;
  nextAction?: string;
}

export interface Attendance {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  checkInTime: string; // HH:mm
  checkOutTime?: string;
  status: 'present' | 'late' | 'absent' | 'early_leave';
  notificationSent: boolean;
  notificationMessage?: string;
}

export type WrongReason = 
  | '개념 부족' 
  | '계산 실수' 
  | '문제 독해 오류' 
  | '공식 암기 부족' 
  | '심화 응용력 부족' 
  | '시간 부족';

export interface QuestionAnalysis {
  questionNumber: number;
  concept: string; // e.g. "연립방정식의 활용", "이차함수 꼭짓점"
  isCorrect: boolean;
  score: number;
  maxScore: number;
  wrongReason?: WrongReason;
  hintsGiven: 0 | 1 | 2 | 3; // 힌트 제공 횟수 (주도성 지표)
  selfResolved: boolean; // 힌트 후 스스로 해결했는지 여부
  difficulty: '상' | '중' | '하';
}

export interface ExamRecord {
  id: string;
  studentId: string;
  unitId: string;
  unitName: string;
  date: string;
  title: string;
  score: number;
  maxScore: number;
  questions: QuestionAnalysis[];
  teacherComment: string;
}

export interface CurriculumUnit {
  id: string;
  gradeSemester: '중1-1' | '중1-2' | '중2-1' | '중2-2' | '중3-1' | '중3-2';
  title: string;
  coreConcepts: string[];
}

export interface AssignmentRecord {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  title: string;
  status: 'completed' | 'partial' | 'incomplete' | 'late';
  grade: 'A' | 'B' | 'C' | 'F';
  completionRate: number; // 0 to 100
  note: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category: '수강료' | '교재비' | '특강비' | '할인';
  amount: number;
}

export interface Invoice {
  id: string;
  studentId: string;
  invoiceNumber: string;
  billingMonth: string; // YYYY-MM
  issueDate: string;
  dueDate: string;
  items: InvoiceItem[];
  totalAmount: number;
  status: 'paid' | 'unpaid' | 'overdue';
  paidDate?: string;
  paymentMethod?: '신용카드' | '계좌이체' | '지역화폐' | '현금';
  lastReminderSentDate?: string;
}

export interface AcademyClass {
  id: string;
  name: string;
  grade: '중1' | '중2' | '중3';
  teacherName: string;
  maxCapacity: number;
  currentEnrollment: number;
  scheduleDays: ('월' | '화' | '수' | '목' | '금' | '토')[];
  timeSlot: string;
  room: string;
}

export interface ClinicSchedule {
  id: string;
  studentId: string;
  classId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  room: string;
  topic: string; // e.g. "연립방정식 오답 클리닉"
  teacherName: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  note?: string;
}

export interface NotificationLog {
  id: string;
  studentId: string;
  studentName: string;
  recipientPhone: string;
  type: '등원' | '하원' | '과제미흡' | '수납안내' | '월간리포트' | '클리닉안내';
  timestamp: string;
  message: string;
}
