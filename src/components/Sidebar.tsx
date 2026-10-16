import React from 'react';
import { 
  UserRole 
} from '../types';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  BrainCircuit, 
  FileText, 
  CreditCard, 
  CalendarRange, 
  Sparkles, 
  ChevronRight 
} from 'lucide-react';

export type ActiveTab = 
  | 'dashboard' 
  | 'students' 
  | 'attendance' 
  | 'academics' 
  | 'reports' 
  | 'billing' 
  | 'classes';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  studentCount: number;
  todayAttendanceCount: number;
  unpaidInvoiceCount: number;
}

interface NavItem {
  id: ActiveTab;
  label: string;
  sublabel: string;
  icon: React.ElementType;
  badge?: string | number;
  badgeColor?: string;
  allowedRoles: UserRole[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  onSelectTab,
  studentCount,
  todayAttendanceCount,
  unpaidInvoiceCount,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: '학원 종합 대시보드',
      sublabel: '핵심 지표 및 일일 현황',
      icon: LayoutDashboard,
      allowedRoles: ['director', 'desk'],
    },
    {
      id: 'students',
      label: '학생 & 상담 DB',
      sublabel: '원생 프로필 및 상담일지',
      icon: Users,
      badge: studentCount,
      allowedRoles: ['director', 'desk'],
    },
    {
      id: 'attendance',
      label: '출결 현황 & 모니터',
      sublabel: '등/하원 체크 및 자동알림',
      icon: CalendarCheck,
      badge: todayAttendanceCount,
      badgeColor: 'text-indigo-600 font-semibold',
      allowedRoles: ['director', 'teacher', 'desk'],
    },
    {
      id: 'academics',
      label: '학습·성적·오답 분석',
      sublabel: '과제·단원평가·취약유형',
      icon: BrainCircuit,
      badge: '핵심',
      badgeColor: 'text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px] font-semibold',
      allowedRoles: ['director', 'teacher'],
    },
    {
      id: 'reports',
      label: '학부모 리포트 생성',
      sublabel: '주간/월간 리포트·인쇄·공유',
      icon: FileText,
      allowedRoles: ['director', 'teacher', 'desk'],
    },
    {
      id: 'billing',
      label: '수납 & 교재비 청구',
      sublabel: '원비·교재비 복합 청구서',
      icon: CreditCard,
      badge: unpaidInvoiceCount > 0 ? `미납 ${unpaidInvoiceCount}` : undefined,
      badgeColor: 'text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded text-[10px] font-semibold',
      allowedRoles: ['director', 'desk'],
    },
    {
      id: 'classes',
      label: '반 & 보강/클리닉',
      sublabel: '시간표 및 오답클리닉 예약',
      icon: CalendarRange,
      allowedRoles: ['director', 'teacher', 'desk'],
    },
  ];

  const visibleItems = navItems.filter(item => item.allowedRoles.includes(currentRole));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 shrink-0 hidden md:flex flex-col border-r border-slate-800 justify-between">
      <div className="p-4">
        {/* Current Active Role Indicator */}
        <div className="mb-4 px-3 py-2.5 bg-slate-800/80 rounded-lg border border-slate-700/60">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>현재 접속 모드</span>
            <span className="text-[10px] bg-slate-700 text-slate-200 px-1.5 py-0.5 rounded">RBAC</span>
          </div>
          <div className="mt-1 font-semibold text-white text-sm">
            {currentRole === 'director' && '원장 (최고 권한자)'}
            {currentRole === 'teacher' && '박도형 강사 (수학)'}
            {currentRole === 'desk' && '행정 데스크 (출결/수납)'}
          </div>
        </div>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 tracking-wider">
            메인 관리 메뉴
          </div>

          {visibleItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group ${
                  isActive
                    ? 'bg-indigo-600 text-white font-medium'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                  <div className="min-w-0">
                    <div className="text-xs font-medium truncate">{item.label}</div>
                    <div className={`text-[10px] truncate ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {item.sublabel}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {item.badge !== undefined && (
                    <span className={item.badgeColor || (isActive ? 'text-indigo-100 text-[11px]' : 'text-slate-400 text-[11px]')}>
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight className={`w-3.5 h-3.5 opacity-60 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Academy Info Strip */}
      <div className="p-4 border-t border-slate-800 text-xs text-slate-400">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="font-semibold text-slate-300">Study Labs Math ERP</span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-400">
          오답 원인 정밀 태깅 & 자기주도 학습 지표 기반 중등수학 특화
        </p>
      </div>
    </aside>
  );
};
