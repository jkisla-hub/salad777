import React from 'react';
import { 
  UserRole 
} from '../types';
import { 
  Building2, 
  Tablet, 
  UserPlus, 
  Database, 
  Bell, 
  ShieldCheck, 
  GraduationCap 
} from 'lucide-react';

interface HeaderProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  onOpenKiosk: () => void;
  onOpenNewStudent: () => void;
  onOpenBackup: () => void;
  onOpenNotifications: () => void;
  notificationCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenKiosk,
  onOpenNewStudent,
  onOpenBackup,
  onOpenNotifications,
  notificationCount,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-4 lg:px-6 py-2.5 transition-shadow">
      <div className="flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            SL
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-slate-900 whitespace-nowrap">
                Study Labs
              </span>
              <span className="text-[11px] font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 hidden sm:inline-block">
                중등 수학 ERP
              </span>
            </div>
            <span className="text-xs text-slate-500 hidden md:block">
              학생·출결·오답분석·학부모리포트 통합 시스템
            </span>
          </div>
        </div>

        {/* Center: Role Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
          <button
            onClick={() => onRoleChange('director')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              currentRole === 'director'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>원장 (최고관리자)</span>
          </button>

          <button
            onClick={() => onRoleChange('teacher')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              currentRole === 'teacher'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
            <span>강사 (일반관리자)</span>
          </button>

          <button
            onClick={() => onRoleChange('desk')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              currentRole === 'desk'
                ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span>데스크 (행정)</span>
          </button>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Tablet Kiosk Button */}
          <button
            onClick={onOpenKiosk}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors whitespace-nowrap"
            title="학원 입구 태블릿 키패드 출결기 열기"
          >
            <Tablet className="w-4 h-4" />
            <span>키오스크 출결기</span>
          </button>

          {/* New Student (Director/Desk) */}
          {currentRole !== 'teacher' && (
            <button
              onClick={onOpenNewStudent}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap hidden sm:flex"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-500" />
              <span>원생 등록</span>
            </button>
          )}

          {/* Backup / Restore Button */}
          <button
            onClick={onOpenBackup}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            title="데이터 백업 및 JSON 수정/복원"
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">데이터 백업/편집</span>
          </button>

          {/* Notification Log Button */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            title="알림톡/SMS 발송 이력"
          >
            <Bell className="w-4 h-4" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
