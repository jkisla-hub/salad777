import React, { useState, useEffect } from 'react';
import { 
  Student, 
  Attendance, 
  NotificationLog 
} from '../types';
import { 
  playAttendanceChime 
} from '../utils/storage';
import { 
  X, 
  Maximize2, 
  Minimize2, 
  Delete, 
  CheckCircle2, 
  Send, 
  Clock, 
  Sparkles 
} from 'lucide-react';

interface KioskModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  attendances: Attendance[];
  onRecordAttendance: (newAttendance: Attendance, notification: NotificationLog) => void;
}

export const KioskModal: React.FC<KioskModalProps> = ({
  isOpen,
  onClose,
  students,
  attendances,
  onRecordAttendance,
}) => {
  const [pin, setPin] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<{
    student: Student;
    actionType: '등원' | '하원';
    time: string;
    notificationMessage: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
      const dateStr = now.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
      setCurrentTime(timeStr);
      setCurrentDate(dateStr);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto reset success screen after 3.5 seconds
  useEffect(() => {
    if (!lastAction) return;
    const timer = setTimeout(() => {
      setLastAction(null);
      setPin('');
      setErrorMessage('');
    }, 3800);
    return () => clearTimeout(timer);
  }, [lastAction]);

  if (!isOpen) return null;

  const handleKeyPress = (num: string) => {
    if (lastAction) return;
    setErrorMessage('');
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 4) {
        processPin(nextPin);
      }
    }
  };

  const handleBackspace = () => {
    if (lastAction) return;
    setPin(prev => prev.slice(0, -1));
    setErrorMessage('');
  };

  const handleClear = () => {
    if (lastAction) return;
    setPin('');
    setErrorMessage('');
  };

  const processPin = (inputPin: string) => {
    const student = students.find(s => s.pin === inputPin && s.status === 'active');
    if (!student) {
      setErrorMessage('등록되지 않은 번호입니다. 데스크에 문의해주세요.');
      setTimeout(() => {
        setPin('');
      }, 1500);
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const timeNow = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });

    // Check if student already checked in today
    const existingAttendance = attendances.find(a => a.studentId === student.id && a.date === todayStr);

    let actionType: '등원' | '하원' = '등원';
    let notifMessage = '';
    let updatedAttendance: Attendance;

    if (!existingAttendance) {
      // First check-in of the day
      actionType = '등원';
      notifMessage = `[Study Labs 수학학원] ${student.name} 학생이 ${timeNow}에 안전하게 등원하였습니다.`;
      updatedAttendance = {
        id: `att-${Date.now()}`,
        studentId: student.id,
        date: todayStr,
        checkInTime: timeNow,
        status: 'present',
        notificationSent: true,
        notificationMessage: notifMessage,
      };
      playAttendanceChime('checkIn');
    } else {
      // Already checked in, check out
      actionType = '하원';
      notifMessage = `[Study Labs 수학학원] ${student.name} 학생이 금일 학습을 마치고 ${timeNow}에 하원하였습니다.`;
      updatedAttendance = {
        ...existingAttendance,
        checkOutTime: timeNow,
        notificationMessage: notifMessage,
      };
      playAttendanceChime('checkOut');
    }

    const newNotification: NotificationLog = {
      id: `notif-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      recipientPhone: student.parentPhone,
      type: actionType,
      timestamp: `${todayStr} ${timeNow}`,
      message: notifMessage,
    };

    onRecordAttendance(updatedAttendance, newNotification);
    setLastAction({
      student,
      actionType,
      time: timeNow,
      notificationMessage: notifMessage,
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
      {/* Kiosk Container */}
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Kiosk Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-sm">
              SL
            </div>
            <div>
              <div className="text-sm font-bold tracking-tight">Study Labs 출결 키오스크</div>
              <div className="text-[11px] text-slate-400">학원 입구 태블릿 전용 모드</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="전체화면 전환"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="키오스크 닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Clock Strip */}
        <div className="py-4 px-6 text-center bg-slate-950/40 border-b border-slate-800/50">
          <div className="text-xs font-medium text-slate-400">{currentDate}</div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-mono tabular-nums mt-0.5">
            {currentTime}
          </div>
        </div>

        {/* Content Area: Either Pin Keypad OR Check-in Completed Screen */}
        <div className="p-6 flex flex-col items-center">
          {lastAction ? (
            /* Check-in / Out Completion Screen */
            <div className="w-full py-8 flex flex-col items-center text-center animate-in zoom-in-95 fade-in duration-300">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${
                lastAction.actionType === '등원' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
              }`}>
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-1">
                {lastAction.actionType === '등원' ? 'STUDENT CHECK-IN' : 'STUDENT CHECK-OUT'}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {lastAction.student.name} 학생, {lastAction.actionType} 완료!
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                {lastAction.student.school} {lastAction.student.grade} · {lastAction.time} 체크
              </p>

              {/* Automated Kakao/SMS Dispatch notification card */}
              <div className="mt-6 w-full max-w-md bg-slate-800/90 border border-slate-700/80 rounded-xl p-4 text-left">
                <div className="flex items-center justify-between text-xs text-indigo-400 font-medium mb-1.5">
                  <span className="flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5" />
                    학부모 알림톡 자동 전송 완료
                  </span>
                  <span className="text-slate-400 tabular-nums">
                    {lastAction.student.parentPhone}
                  </span>
                </div>
                <div className="text-xs text-slate-300 bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                  {lastAction.notificationMessage}
                </div>
              </div>

              <div className="text-xs text-slate-400 mt-6 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>3초 후 다음 학생 입력을 위해 자동으로 초기화됩니다.</span>
              </div>
            </div>
          ) : (
            /* PIN Keypad Screen */
            <div className="w-full flex flex-col items-center">
              <div className="text-sm font-medium text-slate-300 mb-2">
                학생 고유번호 4자리를 입력하세요
              </div>

              {/* PIN Dots Display */}
              <div className="flex items-center justify-center gap-3 my-3">
                {[0, 1, 2, 3].map(index => {
                  const hasDigit = pin.length > index;
                  return (
                    <div
                      key={index}
                      className={`w-12 h-14 rounded-xl border flex items-center justify-center text-2xl font-bold font-mono transition-all ${
                        hasDigit
                          ? 'border-indigo-500 bg-indigo-950/60 text-indigo-400 shadow-sm'
                          : 'border-slate-700 bg-slate-800/50 text-slate-600'
                      }`}
                    >
                      {hasDigit ? pin[index] : '•'}
                    </div>
                  );
                })}
              </div>

              {errorMessage ? (
                <div className="text-xs font-semibold text-rose-400 mb-2 animate-bounce">
                  {errorMessage}
                </div>
              ) : (
                <div className="text-xs text-slate-400 mb-2">
                  (예시: 1001, 1002, 1003)
                </div>
              )}

              {/* Numeric Keypad Grid */}
              <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs mt-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                  <button
                    key={num}
                    onClick={() => handleKeyPress(num)}
                    className="h-14 sm:h-16 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-indigo-600 active:text-white text-xl sm:text-2xl font-semibold text-slate-100 transition-colors flex items-center justify-center border border-slate-700/60 shadow-xs"
                  >
                    {num}
                  </button>
                ))}

                {/* Clear */}
                <button
                  onClick={handleClear}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-xs sm:text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center justify-center border border-slate-700/40"
                >
                  전체 지움
                </button>

                {/* Zero */}
                <button
                  onClick={() => handleKeyPress('0')}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800 hover:bg-slate-700 active:bg-indigo-600 active:text-white text-xl sm:text-2xl font-semibold text-slate-100 transition-colors flex items-center justify-center border border-slate-700/60 shadow-xs"
                >
                  0
                </button>

                {/* Backspace */}
                <button
                  onClick={handleBackspace}
                  className="h-14 sm:h-16 rounded-2xl bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-center border border-slate-700/40"
                  title="한 글자 지우기"
                >
                  <Delete className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Helper Footer */}
        <div className="px-6 py-3 bg-slate-950/60 border-t border-slate-800/80 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>등원 시 등원 알림톡, 하원 시 하원 알림톡이 학부모님께 자동 발송됩니다.</span>
        </div>
      </div>
    </div>
  );
};
