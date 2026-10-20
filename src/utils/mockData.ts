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

export const initialCurriculumUnits: CurriculumUnit[] = [
  {
    id: 'unit-m1-1-1',
    gradeSemester: '중1-1',
    title: '1. 소인수분해와 정수와 유리수',
    coreConcepts: ['소수와 합성수', '소인수분해', '최대공약수와 최소공배수', '정수와 유리수의 사칙연산']
  },
  {
    id: 'unit-m1-1-2',
    gradeSemester: '중1-1',
    title: '2. 문자의 식과 일차방정식',
    coreConcepts: ['문자의 사용과 식의 계산', '일차방정식의 풀이', '일차방정식의 활용(거리·속력·농도)']
  },
  {
    id: 'unit-m1-1-3',
    gradeSemester: '중1-1',
    title: '3. 좌표평면과 그래프',
    coreConcepts: ['순서쌍과 좌표', '그래프의 이해', '정비례와 반비례']
  },
  {
    id: 'unit-m2-1-1',
    gradeSemester: '중2-1',
    title: '1. 유리수와 순환소수 & 식의 계산',
    coreConcepts: ['유리수와 순환소수', '지수법칙', '다항식의 덧셈과 뺄셈', '단항식과 다항식의 곱셈과 나눗셈']
  },
  {
    id: 'unit-m2-1-2',
    gradeSemester: '중2-1',
    title: '2. 일차부등식과 연립일차방정식',
    coreConcepts: ['부등식의 성질', '일차부등식의 풀이 및 활용', '연립일차방정식 가감법·대입법', '연립방정식 활용']
  },
  {
    id: 'unit-m2-1-3',
    gradeSemester: '중2-1',
    title: '3. 일차함수와 그래프',
    coreConcepts: ['일차함수의 뜻과 그래프', '기울기와 절편', '일차함수 식 구하기', '일차함수와 일차방정식의 관계']
  },
  {
    id: 'unit-m2-2-1',
    gradeSemester: '중2-2',
    title: '4. 도형의 성질 (삼각형·사각형)',
    coreConcepts: ['이등변삼각형의 성질', '삼각형의 외심과 내심', '평행사변형과 여러 가지 사각형']
  },
  {
    id: 'unit-m3-1-1',
    gradeSemester: '중3-1',
    title: '1. 제곱근과 실수 & 다항식의 곱셈',
    coreConcepts: ['제곱근의 뜻과 성질', '무리수와 실수', '곱셈공식 4가지', '인수분해 기본공식']
  },
  {
    id: 'unit-m3-1-2',
    gradeSemester: '중3-1',
    title: '2. 이차방정식과 활용',
    coreConcepts: ['이차방정식 인수분해 풀이', '근의 공식', '판별식 개념', '이차방정식의 문장제 활용']
  },
  {
    id: 'unit-m3-1-3',
    gradeSemester: '중3-1',
    title: '3. 이차함수와 그래프',
    coreConcepts: ['이차함수 y=ax^2 그래프', '표준형 변형 y=a(x-p)^2+q', '이차함수의 최댓값과 최솟값']
  },
  {
    id: 'unit-m3-2-1',
    gradeSemester: '중3-2',
    title: '4. 삼각비와 원의 성질',
    coreConcepts: ['직각삼각형과 삼각비', '특수각의 삼각비 값', '삼각비의 활용(높이/넓이)', '원주각과 중심각']
  }
];

export const initialClasses: AcademyClass[] = [
  {
    id: 'class-m2-adv',
    name: '중2 수학 심화 S반',
    grade: '중2',
    teacherName: '박도형 강사',
    maxCapacity: 8,
    currentEnrollment: 6,
    scheduleDays: ['화', '목', '토'],
    timeSlot: '17:30 - 19:30 (토 13:00)',
    room: '301호 (Lab 1)'
  },
  {
    id: 'class-m2-concept',
    name: '중2 수학 개념완성 B반',
    grade: '중2',
    teacherName: '이지수 강사',
    maxCapacity: 8,
    currentEnrollment: 5,
    scheduleDays: ['월', '수', '금'],
    timeSlot: '17:30 - 19:30',
    room: '302호 (Lab 2)'
  },
  {
    id: 'class-m3-naesin',
    name: '중3 내신 1등급대비 M반',
    grade: '중3',
    teacherName: '김수학 원장',
    maxCapacity: 10,
    currentEnrollment: 7,
    scheduleDays: ['화', '목'],
    timeSlot: '19:40 - 22:00',
    room: '401호 대강의실'
  },
  {
    id: 'class-m1-starter',
    name: '중1 수학 첫걸음 K반',
    grade: '중1',
    teacherName: '이지수 강사',
    maxCapacity: 8,
    currentEnrollment: 4,
    scheduleDays: ['월', '수'],
    timeSlot: '16:00 - 17:30',
    room: '303호 세미나실'
  }
];

export const initialStudents: Student[] = [
  {
    id: 'std-1234',
    name: '김유현',
    pin: '1234',
    school: '서일중',
    grade: '중2',
    birthDate: '2012-04-12',
    phone: '010-1234-1234',
    parentName: '김유현 학부모',
    parentPhone: '010-1234-1234',
    classId: 'class-m3-naesin',
    status: 'active',
    joinedDate: '2026-10-16',
    notes: '서일중 중2 내신 대비 특별 지도 원생',
    monthlyTuition: 380000
  },
  {
    id: 'std-1001',
    name: '이민준',
    pin: '1001',
    school: '서초중학교',
    grade: '중2',
    birthDate: '2012-05-14',
    phone: '010-3849-2918',
    parentName: '박선영 (모)',
    parentPhone: '010-9182-3847',
    classId: 'class-m2-adv',
    status: 'active',
    joinedDate: '2025-01-08',
    notes: '수학적 직관은 뛰어나나 계산 실수가 잦음. 킬러 문항 도전 열의 높음.',
    monthlyTuition: 380000
  },
  {
    id: 'std-1002',
    name: '김서연',
    pin: '1002',
    school: '반포중학교',
    grade: '중2',
    birthDate: '2012-09-21',
    phone: '010-4829-1920',
    parentName: '김진호 (부)',
    parentPhone: '010-5829-1920',
    classId: 'class-m2-adv',
    status: 'active',
    joinedDate: '2025-02-15',
    notes: '풀이 과정 서술이 매우 꼼꼼함. 시간 배분 훈련이 필요함.',
    monthlyTuition: 380000
  },
  {
    id: 'std-1003',
    name: '박준서',
    pin: '1003',
    school: '서초중학교',
    grade: '중2',
    birthDate: '2012-03-04',
    phone: '010-5910-4820',
    parentName: '이지은 (모)',
    parentPhone: '010-7749-3829',
    classId: 'class-m2-concept',
    status: 'active',
    joinedDate: '2025-03-02',
    notes: '방정식 활용 단원에서 독해 오류 빈번. 1:1 오답 클리닉 효과 우수.',
    monthlyTuition: 350000
  },
  {
    id: 'std-1004',
    name: '최예은',
    pin: '1004',
    school: '신동중학교',
    grade: '중3',
    birthDate: '2011-11-12',
    phone: '010-9281-0192',
    parentName: '최상철 (부)',
    parentPhone: '010-8291-0192',
    classId: 'class-m3-naesin',
    status: 'active',
    joinedDate: '2024-07-10',
    notes: '전교 상위 5%권 유지 중. 이차함수 고난도 변별력 문항 집중 훈련 중.',
    monthlyTuition: 420000
  },
  {
    id: 'std-1005',
    name: '정우진',
    pin: '1005',
    school: '경원중학교',
    grade: '중3',
    birthDate: '2011-04-18',
    phone: '010-4719-2810',
    parentName: '한미경 (모)',
    parentPhone: '010-3819-2810',
    classId: 'class-m3-naesin',
    status: 'active',
    joinedDate: '2024-09-01',
    notes: '성실하나 시험 당일 긴장으로 인한 실수 발생. 멘탈 케어 병행 필요.',
    monthlyTuition: 420000
  },
  {
    id: 'std-1006',
    name: '윤하은',
    pin: '1006',
    school: '원촌중학교',
    grade: '중1',
    birthDate: '2013-08-30',
    phone: '010-1829-4729',
    parentName: '윤동주 (부)',
    parentPhone: '010-2910-4729',
    classId: 'class-m1-starter',
    status: 'active',
    joinedDate: '2025-03-05',
    notes: '초등 과정 연계 부드럽게 이행 중. 음수와 부호 연산 반복 훈련 중.',
    monthlyTuition: 320000
  },
  {
    id: 'std-1007',
    name: '강지호',
    pin: '1007',
    school: '반포중학교',
    grade: '중2',
    birthDate: '2012-01-19',
    phone: '010-6719-3910',
    parentName: '강태석 (부)',
    parentPhone: '010-8819-3910',
    classId: 'class-m2-adv',
    status: 'active',
    joinedDate: '2025-01-10',
    notes: '도형 단원 증명력 탁월. 연립부등식 부호 반전 주의 필요.',
    monthlyTuition: 380000
  },
  {
    id: 'std-1008',
    name: '송민재',
    pin: '1008',
    school: '신동중학교',
    grade: '중2',
    birthDate: '2012-07-07',
    phone: '010-4910-2819',
    parentName: '문정희 (모)',
    parentPhone: '010-9019-2819',
    classId: 'class-m2-concept',
    status: 'active',
    joinedDate: '2025-02-20',
    notes: '과제 제출 성실도 최상. 개념 숙지 후 문제 적용 속도 향상 중.',
    monthlyTuition: 350000
  },
  {
    id: 'std-1009',
    name: '장도윤',
    pin: '1009',
    school: '서초중학교',
    grade: '중3',
    birthDate: '2011-02-14',
    phone: '010-3918-2910',
    parentName: '장호원 (부)',
    parentPhone: '010-5810-2910',
    classId: 'class-m3-naesin',
    status: 'withdrawn', // Soft deleted student for demonstrating recovery
    joinedDate: '2024-03-01',
    withdrawnDate: '2025-02-28',
    notes: '이사로 인한 인근 학원 전원 (기록 영구 보존 모드).',
    monthlyTuition: 420000
  }
];

export const initialAttendances: Attendance[] = [
  {
    id: 'att-01',
    studentId: 'std-1001',
    date: '2026-10-15',
    checkInTime: '17:22',
    status: 'present',
    notificationSent: true,
    notificationMessage: '[Study Labs] 이민준 학생이 17:22에 안전하게 등원하였습니다.'
  },
  {
    id: 'att-02',
    studentId: 'std-1002',
    date: '2026-10-15',
    checkInTime: '17:28',
    status: 'present',
    notificationSent: true,
    notificationMessage: '[Study Labs] 김서연 학생이 17:28에 안전하게 등원하였습니다.'
  },
  {
    id: 'att-03',
    studentId: 'std-1003',
    date: '2026-10-15',
    checkInTime: '17:42',
    status: 'late',
    notificationSent: true,
    notificationMessage: '[Study Labs] 박준서 학생이 17:42에 등원하였습니다. (수업 시작 12분 지각)'
  },
  {
    id: 'att-04',
    studentId: 'std-1007',
    date: '2026-10-15',
    checkInTime: '17:15',
    status: 'present',
    notificationSent: true,
    notificationMessage: '[Study Labs] 강지호 학생이 17:15에 안전하게 등원하였습니다.'
  },
  {
    id: 'att-05',
    studentId: 'std-1008',
    date: '2026-10-15',
    checkInTime: '17:30',
    status: 'present',
    notificationSent: true,
    notificationMessage: '[Study Labs] 송민재 학생이 17:30에 안전하게 등원하였습니다.'
  }
];

export const initialConsultations: Consultation[] = [
  {
    id: 'cs-01',
    studentId: 'std-1001',
    date: '2026-10-10',
    counselor: '박도형 강사',
    type: '정기학부모상담',
    testScore: 88,
    studentPersonality: '승부욕이 강하고 난이도 있는 문제를 파고드는 것을 즐김',
    content: '어머님께 중간 점검 결과 공유. 연립방정식 단원 점수는 88점으로 상위권이나, 소문항 3번 계산 실수 2건 발견. 풀이 노트 줄 맞추기 지도 권고 드렸고 가정에서도 칭찬 격려 부탁드림.',
    nextAction: '오답노트 줄글 작성 템플릿 배부 및 10월 22일 확인'
  },
  {
    id: 'cs-02',
    studentId: 'std-1003',
    date: '2026-09-28',
    counselor: '이지수 강사',
    type: '수시학습상담',
    testScore: 65,
    studentPersonality: '성격이 온순하고 지시 사항을 잘 따르나 수학적 자신감이 다소 위축됨',
    content: '부등식 활용 문장제 문제에서 미지수 x 설정에 어려움을 겪음. 필수 유형 5선 매일 2문제씩 클리닉 지도 약속.',
    nextAction: '매주 목요일 17시 클리닉 30분 우선 배정'
  },
  {
    id: 'cs-03',
    studentId: 'std-1004',
    date: '2026-10-05',
    counselor: '김수학 원장',
    type: '진로및태도',
    testScore: 96,
    studentPersonality: '목표 의식이 뚜렷하고 자사고 진학 희망',
    content: '중3-1 이차함수 전 범위 테스트 96점 달성. 고등수학(상) 공통수학 연계 심화 선행 계획 수립 상담 진행.',
    nextAction: '겨울방학 고등 수상 심화 프리미엄반 우선 등록 안내'
  }
];

export const initialExamRecords: ExamRecord[] = [
  {
    id: 'exam-1001-1',
    studentId: 'std-1001',
    unitId: 'unit-m2-1-2',
    unitName: '2. 일차부등식과 연립일차방정식',
    date: '2026-10-08',
    title: '연립방정식 활용 및 부등식 단원평가',
    score: 84,
    maxScore: 100,
    teacherComment: '개념 이해도는 매우 우수하나, 소금물 농도 문제에서 식 정리 중 단순 부호 계산 실수가 2건 발생했습니다. 문제 해결 주도성은 상위 10%입니다.',
    questions: [
      { questionNumber: 1, concept: '연립방정식 기본 대입법', isCorrect: true, score: 10, maxScore: 10, hintsGiven: 0, selfResolved: true, difficulty: '하' },
      { questionNumber: 2, concept: '연립방정식 가감법 계수 맞추기', isCorrect: true, score: 10, maxScore: 10, hintsGiven: 0, selfResolved: true, difficulty: '하' },
      { questionNumber: 3, concept: '해의 조건이 주어진 연립방정식', isCorrect: false, score: 0, maxScore: 15, wrongReason: '계산 실수', hintsGiven: 1, selfResolved: true, difficulty: '중' },
      { questionNumber: 4, concept: '일차부등식의 성질 (음수 곱하기)', isCorrect: true, score: 15, maxScore: 15, hintsGiven: 0, selfResolved: true, difficulty: '중' },
      { questionNumber: 5, concept: '부등식 활용 (연속하는 자연수)', isCorrect: true, score: 15, maxScore: 15, hintsGiven: 0, selfResolved: true, difficulty: '중' },
      { questionNumber: 6, concept: '거리·속력·시간 터널 열차 문제', isCorrect: true, score: 15, maxScore: 15, hintsGiven: 1, selfResolved: true, difficulty: '상' },
      { questionNumber: 7, concept: '소금물 섞기 농도와 소금의 양', isCorrect: false, score: 9, maxScore: 20, wrongReason: '문제 독해 오류', hintsGiven: 2, selfResolved: false, difficulty: '상' }
    ]
  },
  {
    id: 'exam-1001-2',
    studentId: 'std-1001',
    unitId: 'unit-m2-1-3',
    unitName: '3. 일차함수와 그래프',
    date: '2026-09-24',
    title: '일차함수 기울기와 절편 종합 테스트',
    score: 92,
    maxScore: 100,
    teacherComment: '그래프 해석 능력이 탁월합니다. x절편과 y절편을 통한 도형의 넓이 구하기 문제도 스스로 잘 해결했습니다.',
    questions: [
      { questionNumber: 1, concept: '일차함수의 정의', isCorrect: true, score: 10, maxScore: 10, hintsGiven: 0, selfResolved: true, difficulty: '하' },
      { questionNumber: 2, concept: '기울기 공식과 변화량', isCorrect: true, score: 15, maxScore: 15, hintsGiven: 0, selfResolved: true, difficulty: '하' },
      { questionNumber: 3, concept: '평행과 일치 조건', isCorrect: true, score: 15, maxScore: 15, hintsGiven: 0, selfResolved: true, difficulty: '중' },
      { questionNumber: 4, concept: '두 일차함수와 축으로 둘러싸인 삼각형 넓이', isCorrect: true, score: 20, maxScore: 20, hintsGiven: 1, selfResolved: true, difficulty: '중' },
      { questionNumber: 5, concept: '일차함수 활용 (물탱크 배수 속도)', isCorrect: true, score: 20, maxScore: 20, hintsGiven: 0, selfResolved: true, difficulty: '상' },
      { questionNumber: 6, concept: '교점의 좌표와 연립방정식의 해', isCorrect: false, score: 12, maxScore: 20, wrongReason: '시간 부족', hintsGiven: 1, selfResolved: true, difficulty: '상' }
    ]
  },
  {
    id: 'exam-1002-1',
    studentId: 'std-1002',
    unitId: 'unit-m2-1-2',
    unitName: '2. 일차부등식과 연립일차방정식',
    date: '2026-10-08',
    title: '연립방정식 활용 및 부등식 단원평가',
    score: 95,
    maxScore: 100,
    teacherComment: '거의 완벽한 답안입니다. 서술형 풀이가 감점 없이 정갈하게 전개되었습니다.',
    questions: [
      { questionNumber: 1, concept: '연립방정식 기본 대입법', isCorrect: true, score: 10, maxScore: 10, hintsGiven: 0, selfResolved: true, difficulty: '하' },
      { questionNumber: 2, concept: '연립방정식 가감법 계수 맞추기', isCorrect: true, score: 10, maxScore: 10, hintsGiven: 0, selfResolved: true, difficulty: '하' },
      { questionNumber: 3, concept: '해의 조건이 주어진 연립방정식', isCorrect: true, score: 15, maxScore: 15, hintsGiven: 0, selfResolved: true, difficulty: '중' },
      { questionNumber: 4, concept: '일차부등식의 성질', isCorrect: true, score: 15, maxScore: 15, hintsGiven: 0, selfResolved: true, difficulty: '중' },
      { questionNumber: 5, concept: '부등식 활용', isCorrect: true, score: 15, maxScore: 15, hintsGiven: 0, selfResolved: true, difficulty: '중' },
      { questionNumber: 6, concept: '거리·속력·시간 터널 열차 문제', isCorrect: true, score: 15, maxScore: 15, hintsGiven: 0, selfResolved: true, difficulty: '상' },
      { questionNumber: 7, concept: '소금물 섞기 농도와 소금의 양', isCorrect: false, score: 15, maxScore: 20, wrongReason: '계산 실수', hintsGiven: 0, selfResolved: true, difficulty: '상' }
    ]
  },
  {
    id: 'exam-1003-1',
    studentId: 'std-1003',
    unitId: 'unit-m2-1-2',
    unitName: '2. 일차부등식과 연립일차방정식',
    date: '2026-10-08',
    title: '연립방정식 활용 및 부등식 단원평가',
    score: 68,
    maxScore: 100,
    teacherComment: '연립방정식의 기본 연산은 양호하나, 문장제 문제에서 식 세우기(독해) 단계에서 어려움이 있습니다. 집중 클리닉을 추천합니다.',
    questions: [
      { questionNumber: 1, concept: '연립방정식 기본 대입법', isCorrect: true, score: 10, maxScore: 10, hintsGiven: 0, selfResolved: true, difficulty: '하' },
      { questionNumber: 2, concept: '연립방정식 가감법 계수 맞추기', isCorrect: true, score: 10, maxScore: 10, hintsGiven: 0, selfResolved: true, difficulty: '하' },
      { questionNumber: 3, concept: '해의 조건이 주어진 연립방정식', isCorrect: false, score: 0, maxScore: 15, wrongReason: '개념 부족', hintsGiven: 2, selfResolved: false, difficulty: '중' },
      { questionNumber: 4, concept: '일차부등식의 성질', isCorrect: true, score: 15, maxScore: 15, hintsGiven: 1, selfResolved: true, difficulty: '중' },
      { questionNumber: 5, concept: '부등식 활용 (의자 배정)', isCorrect: false, score: 0, maxScore: 15, wrongReason: '문제 독해 오류', hintsGiven: 2, selfResolved: false, difficulty: '중' },
      { questionNumber: 6, concept: '거리·속력·시간 터널 열차 문제', isCorrect: false, score: 3, maxScore: 15, wrongReason: '공식 암기 부족', hintsGiven: 3, selfResolved: false, difficulty: '상' },
      { questionNumber: 7, concept: '소금물 섞기 농도와 소금의 양', isCorrect: true, score: 20, maxScore: 20, hintsGiven: 1, selfResolved: true, difficulty: '상' }
    ]
  },
  {
    id: 'exam-1004-1',
    studentId: 'std-1004',
    unitId: 'unit-m3-1-3',
    unitName: '3. 이차함수와 그래프',
    date: '2026-10-12',
    title: '중3-1 이차함수 최고난도 변별력 모의고사',
    score: 96,
    maxScore: 100,
    teacherComment: '이차함수 꼭짓점 좌표와 축의 방정식 활용 문제를 막힘없이 해결했습니다. 고난도 문항에서도 힌트 없이 스스로 해결하는 주도성이 최상입니다.',
    questions: [
      { questionNumber: 1, concept: '이차함수 표준형 변형', isCorrect: true, score: 15, maxScore: 15, hintsGiven: 0, selfResolved: true, difficulty: '하' },
      { questionNumber: 2, concept: '대칭축과 꼭짓점의 성질', isCorrect: true, score: 15, maxScore: 15, hintsGiven: 0, selfResolved: true, difficulty: '중' },
      { questionNumber: 3, concept: '이차함수와 x축의 교점', isCorrect: true, score: 20, maxScore: 20, hintsGiven: 0, selfResolved: true, difficulty: '중' },
      { questionNumber: 4, concept: '제한된 범위에서의 최댓값·최솟값', isCorrect: true, score: 25, maxScore: 25, hintsGiven: 0, selfResolved: true, difficulty: '상' },
      { questionNumber: 5, concept: '도형과 결합된 이차함수 최대 넓이', isCorrect: false, score: 21, maxScore: 25, wrongReason: '심화 응용력 부족', hintsGiven: 1, selfResolved: true, difficulty: '상' }
    ]
  }
];

export const initialAssignments: AssignmentRecord[] = [
  {
    id: 'asg-01',
    studentId: 'std-1001',
    classId: 'class-m2-adv',
    date: '2026-10-14',
    title: '쎈수학 중2-1 연립방정식 B단계 C단계 40문항',
    status: 'completed',
    grade: 'A',
    completionRate: 100,
    note: '틀린 문제 스스로 1차 오답 체크 완료함.'
  },
  {
    id: 'asg-02',
    studentId: 'std-1002',
    classId: 'class-m2-adv',
    date: '2026-10-14',
    title: '쎈수학 중2-1 연립방정식 B단계 C단계 40문항',
    status: 'completed',
    grade: 'A',
    completionRate: 100,
    note: '풀이 노트 매우 깔끔함. 우수 과제 선정.'
  },
  {
    id: 'asg-03',
    studentId: 'std-1003',
    classId: 'class-m2-concept',
    date: '2026-10-14',
    title: '개념원리 중2-1 부등식 필수 예제 20문항',
    status: 'partial',
    grade: 'C',
    completionRate: 70,
    note: '문장제 5문제 미완료. 클리닉 시간 보충 예정.'
  },
  {
    id: 'asg-04',
    studentId: 'std-1007',
    classId: 'class-m2-adv',
    date: '2026-10-14',
    title: '쎈수학 중2-1 연립방정식 B단계 C단계 40문항',
    status: 'completed',
    grade: 'B',
    completionRate: 90,
    note: '심화 2문항 재도전 권장.'
  },
  {
    id: 'asg-05',
    studentId: 'std-1008',
    classId: 'class-m2-concept',
    date: '2026-10-14',
    title: '개념원리 중2-1 부등식 필수 예제 20문항',
    status: 'completed',
    grade: 'A',
    completionRate: 100,
    note: '성실히 잘 풀었음.'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'inv-2026-10-1001',
    studentId: 'std-1001',
    invoiceNumber: 'INV-2610-001',
    billingMonth: '2026-10',
    issueDate: '2026-10-01',
    dueDate: '2026-10-10',
    totalAmount: 410000,
    status: 'paid',
    paidDate: '2026-10-04',
    paymentMethod: '신용카드',
    items: [
      { id: 'item-1', description: '10월 정규 수강료 (중2 심화S반)', category: '수강료', amount: 380000 },
      { id: 'item-2', description: 'Study Labs 자체 오답분석 워크북(상)', category: '교재비', amount: 30000 }
    ]
  },
  {
    id: 'inv-2026-10-1002',
    studentId: 'std-1002',
    invoiceNumber: 'INV-2610-002',
    billingMonth: '2026-10',
    issueDate: '2026-10-01',
    dueDate: '2026-10-10',
    totalAmount: 380000,
    status: 'paid',
    paidDate: '2026-10-02',
    paymentMethod: '계좌이체',
    items: [
      { id: 'item-1', description: '10월 정규 수강료 (중2 심화S반)', category: '수강료', amount: 380000 }
    ]
  },
  {
    id: 'inv-2026-10-1003',
    studentId: 'std-1003',
    invoiceNumber: 'INV-2610-003',
    billingMonth: '2026-10',
    issueDate: '2026-10-01',
    dueDate: '2026-10-10',
    totalAmount: 395000,
    status: 'overdue',
    lastReminderSentDate: '2026-10-12',
    items: [
      { id: 'item-1', description: '10월 정규 수강료 (중2 개념B반)', category: '수강료', amount: 350000 },
      { id: 'item-2', description: '개념원리 중2-1 시중교재', category: '교재비', amount: 20000 },
      { id: 'item-3', description: '주말 특별 클리닉 교재비', category: '교재비', amount: 25000 }
    ]
  },
  {
    id: 'inv-2026-10-1004',
    studentId: 'std-1004',
    invoiceNumber: 'INV-2610-004',
    billingMonth: '2026-10',
    issueDate: '2026-10-01',
    dueDate: '2026-10-10',
    totalAmount: 450000,
    status: 'paid',
    paidDate: '2026-10-08',
    paymentMethod: '신용카드',
    items: [
      { id: 'item-1', description: '10월 정규 수강료 (중3 1등급대비M반)', category: '수강료', amount: 420000 },
      { id: 'item-2', description: '블랙라벨 중3-1 심화교재', category: '교재비', amount: 30000 }
    ]
  },
  {
    id: 'inv-2026-10-1007',
    studentId: 'std-1007',
    invoiceNumber: 'INV-2610-005',
    billingMonth: '2026-10',
    issueDate: '2026-10-01',
    dueDate: '2026-10-20',
    totalAmount: 410000,
    status: 'unpaid',
    items: [
      { id: 'item-1', description: '10월 정규 수강료 (중2 심화S반)', category: '수강료', amount: 380000 },
      { id: 'item-2', description: 'Study Labs 자체 오답분석 워크북(상)', category: '교재비', amount: 30000 }
    ]
  }
];

export const initialClinics: ClinicSchedule[] = [
  {
    id: 'cln-01',
    studentId: 'std-1003',
    classId: 'class-m2-concept',
    date: '2026-10-16',
    time: '16:30 - 17:30',
    room: '302호 (Lab 2)',
    topic: '일차부등식 활용 문장제 및 식 세우기 집중 클리닉',
    teacherName: '이지수 강사',
    status: 'scheduled',
    note: '단원평가 오답 5번, 6번 유사 변형 10문항 지참 필수'
  },
  {
    id: 'cln-02',
    studentId: 'std-1001',
    classId: 'class-m2-adv',
    date: '2026-10-18',
    time: '14:00 - 15:00',
    room: '301호 (Lab 1)',
    topic: '연립방정식 활용 소금물·터널 고난도 킬러문항 피드백',
    teacherName: '박도형 강사',
    status: 'scheduled',
    note: '힌트 없이 스스로 식 유도하기 목표'
  }
];

export const initialNotificationLogs: NotificationLog[] = [
  {
    id: 'notif-01',
    studentId: 'std-1001',
    studentName: '이민준',
    recipientPhone: '010-9182-3847',
    type: '등원',
    timestamp: '2026-10-15 17:22',
    message: '[Study Labs 수학학원] 이민준 학생이 17:22에 안전하게 등원하였습니다.'
  },
  {
    id: 'notif-02',
    studentId: 'std-1003',
    studentName: '박준서',
    recipientPhone: '010-7749-3829',
    type: '수납안내',
    timestamp: '2026-10-12 11:30',
    message: '[Study Labs 안내] 박준서 학생의 10월 수강료 및 교재비(395,000원) 납부 기한이 10월 10일로 경과되었습니다. 확인 부탁드립니다. (가상계좌: 신한 110-384-918291)'
  }
];
