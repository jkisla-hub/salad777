import React, { useState } from 'react';
import { NotificationLog, Student } from '../types';
import { Bell, Send, CheckCircle2, MessageSquare, X } from 'lucide-react';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationLog[];
  students: Student[];
  onSendCustomNotification: (notif: NotificationLog) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  students,
  onSendCustomNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'history' | 'compose'>('history');
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [customMsg, setCustomMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const student = students.find(s => s.id === selectedStudentId);
    if (!student || !customMsg.trim()) return;

    const notif: NotificationLog = {
      id: `notif-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      recipientPhone: student.parentPhone,
      type: '등원', // or custom
      timestamp: new Date().toLocaleString('ko-KR'),
      message: `[Study Labs] ${customMsg.trim()}`,
    };

    onSendCustomNotification(notif);
    setIsSuccess(true);
    setCustomMsg('');
    setTimeout(() => {
      setIsSuccess(false);
      setActiveTab('history');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 text-xs">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">학부모 알림톡 / SMS 발송 센터</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 px-6 pt-3">
          <button
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 font-semibold text-xs border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            발송 이력 ({notifications.length}건)
          </button>
          <button
            onClick={() => setActiveTab('compose')}
            className={`pb-2.5 px-3 font-semibold text-xs border-b-2 transition-colors ${
              activeTab === 'compose'
                ? 'border-indigo-600 text-indigo-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            직접 알림 작성
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {activeTab === 'history' ? (
            <div className="space-y-3">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-slate-400">발송 내역이 없습니다.</div>
              ) : (
                notifications
                  .slice()
                  .reverse()
                  .map(item => (
                    <div key={item.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-800">
                          {item.studentName} 학생 ({item.type})
                        </span>
                        <span className="font-mono text-slate-400">{item.timestamp}</span>
                      </div>
                      <div className="text-slate-600 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100 font-mono text-[11px]">
                        {item.message}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono text-right">
                        수신: {item.recipientPhone} (전송 성공)
                      </div>
                    </div>
                  ))
              )}
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              {isSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>알림톡이 성공적으로 발송되었습니다!</span>
                </div>
              )}

              <div>
                <label className="font-semibold text-slate-700 block mb-1">수신 원생 학부모</label>
                <select
                  value={selectedStudentId}
                  onChange={e => setSelectedStudentId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.parentPhone})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">알림톡 내용 *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="예: OOO 학생의 오늘 과제 완료 소식 전달드립니다."
                  value={customMsg}
                  onChange={e => setCustomMsg(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  닫기
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>알림톡 전송</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
