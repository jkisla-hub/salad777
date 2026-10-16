import React, { useState } from 'react';
import { 
  Student, 
  Invoice, 
  InvoiceItem, 
  AcademyClass, 
  NotificationLog, 
  UserRole 
} from '../types';
import { 
  CreditCard, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Send, 
  FileText, 
  Search, 
  Trash2, 
  Check, 
  X, 
  BookOpen 
} from 'lucide-react';

interface BillingViewProps {
  students: Student[];
  invoices: Invoice[];
  classes: AcademyClass[];
  currentRole: UserRole;
  onUpdateInvoice: (invoice: Invoice, notif?: NotificationLog) => void;
  onAddInvoice: (invoice: Invoice) => void;
}

export const BillingView: React.FC<BillingViewProps> = ({
  students,
  invoices,
  classes,
  currentRole,
  onUpdateInvoice,
  onAddInvoice,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'unpaid' | 'paid'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewInvoiceOpen, setIsNewInvoiceOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<Invoice['paymentMethod']>('신용카드');

  // New Invoice Form State
  const activeStudents = students.filter(s => s.status === 'active');
  const [newInvoiceStudentId, setNewInvoiceStudentId] = useState(activeStudents[0]?.id || '');
  const [newInvoiceDueDate, setNewInvoiceDueDate] = useState('2026-10-25');
  const [newInvoiceMonth, setNewInvoiceMonth] = useState('2026-10');
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: '1', description: '10월 정규 수학 수강료', category: '수강료', amount: 380000 },
    { id: '2', description: 'Study Labs 자체 오답분석 워크북(상)', category: '교재비', amount: 30000 }
  ]);

  // Toast for alert simulation
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Filter invoices
  const filteredInvoices = invoices.filter(inv => {
    if (filterStatus === 'paid' && inv.status !== 'paid') return false;
    if (filterStatus === 'unpaid' && inv.status === 'paid') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const st = students.find(s => s.id === inv.studentId);
      const matchName = st?.name.toLowerCase().includes(q);
      const matchNum = inv.invoiceNumber.toLowerCase().includes(q);
      if (!matchName && !matchNum) return false;
    }
    return true;
  });

  // Calculate statistics
  const totalBilled = invoices.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalUnpaid = totalBilled - totalPaid;
  const collectionRate = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 100;

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsPaymentModalOpen(true);
  };

  const handleConfirmPayment = () => {
    if (!selectedInvoice) return;
    const nowStr = new Date().toISOString().slice(0, 10);
    const updated: Invoice = {
      ...selectedInvoice,
      status: 'paid',
      paidDate: nowStr,
      paymentMethod: paymentMethod,
    };
    onUpdateInvoice(updated);
    setIsPaymentModalOpen(false);
    showToast(`${students.find(s => s.id === selectedInvoice.studentId)?.name} 원생 수납 완료 처리되었습니다.`);
  };

  const handleSendReminder = (inv: Invoice) => {
    const student = students.find(s => s.id === inv.studentId);
    if (!student) return;

    const timeNow = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
    const msg = `[Study Labs 수납안내] ${student.name} 학생의 ${inv.billingMonth}월 교육비(${inv.totalAmount.toLocaleString()}원) 납부 기한(${inv.dueDate}) 안내드립니다. 납부 가상계좌: 신한은행 110-384-918291 (예금주: 스터디랩스수학)`;

    const notif: NotificationLog = {
      id: `notif-${Date.now()}`,
      studentId: student.id,
      studentName: student.name,
      recipientPhone: student.parentPhone,
      type: '수납안내',
      timestamp: `${new Date().toISOString().slice(0, 10)} ${timeNow}`,
      message: msg,
    };

    const updated: Invoice = {
      ...inv,
      lastReminderSentDate: new Date().toISOString().slice(0, 10),
    };

    onUpdateInvoice(updated, notif);
    showToast(`학부모(${student.parentPhone})께 수납 안내 알림톡이 전송되었습니다.`);
  };

  const handleStudentSelectInModal = (stId: string) => {
    setNewInvoiceStudentId(stId);
    const st = students.find(s => s.id === stId);
    if (st) {
      setInvoiceItems([
        { id: `item-${Date.now()}-1`, description: `${newInvoiceMonth}월 정규 수학 수강료`, category: '수강료', amount: st.monthlyTuition },
        { id: `item-${Date.now()}-2`, description: 'Study Labs 자체 오답분석 워크북(상)', category: '교재비', amount: 30000 }
      ]);
    }
  };

  const handleAddItemToInvoice = () => {
    setInvoiceItems([
      ...invoiceItems,
      { id: `item-${Date.now()}`, description: '쎈수학 중등 기본서 교재비', category: '교재비', amount: 20000 }
    ]);
  };

  const handleRemoveInvoiceItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter(i => i.id !== id));
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const total = invoiceItems.reduce((acc, curr) => acc + curr.amount, 0);
    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      studentId: newInvoiceStudentId,
      invoiceNumber: `INV-${newInvoiceMonth.replace('-', '').slice(2)}-${Math.floor(100 + Math.random() * 900)}`,
      billingMonth: newInvoiceMonth,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: newInvoiceDueDate,
      items: invoiceItems,
      totalAmount: total,
      status: 'unpaid',
    };

    onAddInvoice(newInv);
    setIsNewInvoiceOpen(false);
    showToast('복합 청구서가 발행되었습니다.');
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-indigo-900 text-white px-4 py-3 rounded-xl shadow-lg border border-indigo-700 flex items-center gap-2 text-xs font-semibold animate-in slide-in-from-top-4 duration-200">
          <Send className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Financial Summary Cards Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-slate-400 font-medium">당월 총 청구액</div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono tabular-nums mt-1">
            {totalBilled.toLocaleString()}원
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">총 {invoices.length}건 발행</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            완납 누적액
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-700 font-mono tabular-nums mt-1">
            {totalPaid.toLocaleString()}원
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-mono">
            수납률 {collectionRate}% 달성
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-rose-500 font-medium flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            미수금 (미납·연체)
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-600 font-mono tabular-nums mt-1">
            {totalUnpaid.toLocaleString()}원
          </div>
          <div className="text-[11px] text-rose-500 mt-1 font-mono">
            {invoices.filter(i => i.status !== 'paid').length}건 미납
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="text-xs text-indigo-600 font-medium flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            교재비 분리 청구액
          </div>
          {(() => {
            const textbookSum = invoices
              .flatMap(i => i.items)
              .filter(item => item.category === '교재비')
              .reduce((acc, item) => acc + item.amount, 0);
            return (
              <div className="text-xl sm:text-2xl font-bold text-indigo-700 font-mono tabular-nums mt-1">
                {textbookSum.toLocaleString()}원
              </div>
            );
          })()}
          <div className="text-[11px] text-indigo-600 mt-1">
            자체 워크북 및 시중교재 통합
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="원생 이름 또는 청구번호..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden"
            />
          </div>

          {/* Segmented Status Filter */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
            {(['all', 'unpaid', 'paid'] as const).map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterStatus === st
                    ? 'bg-white text-indigo-700 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st === 'all' ? '전체' : st === 'unpaid' ? '미납·연체' : '완납'}
              </button>
            ))}
          </div>
        </div>

        {/* Create Invoice Action */}
        <button
          onClick={() => setIsNewInvoiceOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>원비 + 교재비 복합 청구서 발행</span>
        </button>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-medium">
                <th className="py-3 px-4">청구번호</th>
                <th className="py-3 px-4">원생명 / 학교</th>
                <th className="py-3 px-4">청구 월</th>
                <th className="py-3 px-4">세부 항목 (수강료 + 교재비)</th>
                <th className="py-3 px-4">총 청구 금액</th>
                <th className="py-3 px-4">납부 기한</th>
                <th className="py-3 px-4">상태</th>
                <th className="py-3 px-4 text-right">수납 관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map(inv => {
                const student = students.find(s => s.id === inv.studentId);
                const tuitionItem = inv.items.find(i => i.category === '수강료');
                const textbookItems = inv.items.filter(i => i.category === '교재비');

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-slate-800 tabular-nums">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 text-sm">{student?.name}</div>
                      <div className="text-[11px] text-slate-400">{student?.school} {student?.grade}</div>
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-700 font-medium">
                      {inv.billingMonth}월
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <div className="space-y-0.5">
                        {tuitionItem && (
                          <div className="text-slate-800 font-medium">
                            수강료: {tuitionItem.amount.toLocaleString()}원
                          </div>
                        )}
                        {textbookItems.length > 0 && (
                          <div className="text-[11px] text-indigo-700">
                            교재비: {textbookItems.map(t => `${t.description}(${t.amount.toLocaleString()}원)`).join(', ')}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums text-sm">
                      {inv.totalAmount.toLocaleString()}원
                    </td>
                    <td className="py-3 px-4 font-mono tabular-nums text-slate-600">
                      {inv.dueDate}
                    </td>
                    <td className="py-3 px-4">
                      {inv.status === 'paid' ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          완납 ({inv.paymentMethod})
                        </span>
                      ) : inv.status === 'overdue' ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-rose-600">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                          납부 연체
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-semibold text-amber-700">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          미납
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {inv.status !== 'paid' ? (
                          <>
                            <button
                              onClick={() => handleOpenPayment(inv)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-colors"
                            >
                              수납 확인
                            </button>
                            <button
                              onClick={() => handleSendReminder(inv)}
                              className="px-2 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-colors flex items-center gap-1"
                              title="학부모 알림톡 수납 안내 발송"
                            >
                              <Send className="w-3 h-3 text-indigo-600" />
                              <span className="hidden sm:inline">알림 발송</span>
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-mono">
                            {inv.paidDate} 완납
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Confirmation Modal */}
      {isPaymentModalOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">수납 결제 완료 처리</h3>
              <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100 space-y-1">
                <div className="text-slate-500">결제 대상 원생</div>
                <div className="text-base font-bold text-slate-900">
                  {students.find(s => s.id === selectedInvoice.studentId)?.name}
                </div>
                <div className="text-slate-500 font-mono pt-1">
                  총 결제 금액: <strong className="text-indigo-700 text-sm">{selectedInvoice.totalAmount.toLocaleString()}원</strong>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1.5">결제 수단 선택</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['신용카드', '계좌이체', '지역화폐', '현금'] as const).map(method => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`py-2 px-3 rounded-lg border text-xs font-medium transition-colors ${
                        paymentMethod === method
                          ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="px-4 py-1.5 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  완납 처리 승인
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Item New Invoice Modal */}
      {isNewInvoiceOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-900">수강료 + 교재비 복합 청구서 발행</h3>
              <button onClick={() => setIsNewInvoiceOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">대상 원생 *</label>
                  <select
                    value={newInvoiceStudentId}
                    onChange={e => handleStudentSelectInModal(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    {activeStudents.map(st => (
                      <option key={st.id} value={st.id}>{st.name} ({st.school} {st.grade})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">청구 월 *</label>
                  <input
                    type="month"
                    value={newInvoiceMonth}
                    onChange={e => setNewInvoiceMonth(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="font-medium text-slate-700 block mb-1">납부 마감일 *</label>
                <input
                  type="date"
                  value={newInvoiceDueDate}
                  onChange={e => setNewInvoiceDueDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                />
              </div>

              {/* Line items */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-800">청구 세부 항목 ({invoiceItems.length}건)</label>
                  <button
                    type="button"
                    onClick={handleAddItemToInvoice}
                    className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    교재비/특강비 항목 추가
                  </button>
                </div>

                <div className="space-y-2">
                  {invoiceItems.map((item, idx) => (
                    <div key={item.id} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                      <select
                        value={item.category}
                        onChange={e => {
                          const updated = [...invoiceItems];
                          updated[idx].category = e.target.value as InvoiceItem['category'];
                          setInvoiceItems(updated);
                        }}
                        className="w-24 text-[11px] border border-slate-200 rounded p-1.5 bg-white font-medium"
                      >
                        <option value="수강료">수강료</option>
                        <option value="교재비">교재비</option>
                        <option value="특강비">특강비</option>
                        <option value="할인">할인</option>
                      </select>

                      <input
                        type="text"
                        value={item.description}
                        onChange={e => {
                          const updated = [...invoiceItems];
                          updated[idx].description = e.target.value;
                          setInvoiceItems(updated);
                        }}
                        placeholder="항목 설명"
                        className="flex-1 text-xs border border-slate-200 rounded p-1.5 bg-white"
                      />

                      <input
                        type="number"
                        step={5000}
                        value={item.amount}
                        onChange={e => {
                          const updated = [...invoiceItems];
                          updated[idx].amount = Number(e.target.value);
                          setInvoiceItems(updated);
                        }}
                        className="w-24 text-xs border border-slate-200 rounded p-1.5 bg-white font-mono tabular-nums text-right"
                      />

                      <button
                        type="button"
                        onClick={() => handleRemoveInvoiceItem(item.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="삭제"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="text-right pt-2 font-mono text-sm font-extrabold text-slate-900">
                  합계: {invoiceItems.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}원
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewInvoiceOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  청구서 생성 및 등록
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
