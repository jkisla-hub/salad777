import React, { useRef, useState } from 'react';
import { AppStateData } from '../utils/storage';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  Database, 
  FileCheck, 
  AlertTriangle, 
  X, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

interface DataBackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: AppStateData;
  onExport: () => void;
  onImport: (importedData: AppStateData) => void;
  onResetToDefault: () => void;
}

export const DataBackupModal: React.FC<DataBackupModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onExport,
  onImport,
  onResetToDefault,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string>('');
  const [resetConfirm, setResetConfirm] = useState(false);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = event => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.students && parsed.classes && parsed.exams) {
          onImport(parsed as AppStateData);
          setImportStatus('JSON 백업 파일이 성공적으로 데이터베이스에 복원되었습니다!');
          setTimeout(() => {
            setImportStatus('');
            onClose();
          }, 1500);
        } else {
          setImportStatus('오류: 올바른 Study Labs 백업 파일 형식이 아닙니다.');
        }
      } catch {
        setImportStatus('오류: 유효하지 않은 JSON 파일입니다.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150 text-xs">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">학원 데이터 백업 / 편집 / 복원</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Explanation Banner */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 text-indigo-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-xs">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              가장 쉬운 데이터 관리 (JSON 백업 & 복원)
            </div>
            <p className="text-[11px] leading-relaxed text-indigo-800">
              복잡한 서버 설정 없이 브라우저 내에서 원클릭으로 전체 데이터를 다운로드할 수 있습니다. 
              다운로드한 JSON 파일을 VS Code나 엑셀 등으로 열어 원생 명단이나 시험 점수를 대량 수정한 뒤 다시 업로드할 수 있습니다.
            </p>
          </div>

          {/* Current Data Statistics */}
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-2">
            <div className="font-bold text-slate-800 text-[11px]">현재 저장된 학원 레코드 통계</div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 font-mono tabular-nums">
              <div className="bg-white p-2 rounded border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 block">원생 수</span>
                <strong className="text-slate-900">{currentData.students.length}명</strong>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 block">출결 기록</span>
                <strong className="text-slate-900">{currentData.attendances.length}건</strong>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 block">단원 평가</span>
                <strong className="text-slate-900">{currentData.exams.length}건</strong>
              </div>
              <div className="bg-white p-2 rounded border border-slate-200 text-center">
                <span className="text-[10px] text-slate-400 block">수납 청구</span>
                <strong className="text-slate-900">{currentData.invoices.length}건</strong>
              </div>
            </div>
          </div>

          {importStatus && (
            <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
              importStatus.startsWith('오류') ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{importStatus}</span>
            </div>
          )}

          {/* Action 1: Export JSON */}
          <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
            <div>
              <div className="font-bold text-slate-900">전체 데이터 JSON 파일 다운로드</div>
              <div className="text-[11px] text-slate-500">학생, 출결, 오답분석, 청구서 일체를 백업 파일로 보관합니다.</div>
            </div>
            <button
              onClick={onExport}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON 내보내기</span>
            </button>
          </div>

          {/* Action 2: Import JSON */}
          <div className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 transition-colors">
            <div>
              <div className="font-bold text-slate-900">수정한 백업 JSON 파일 불러오기</div>
              <div className="text-[11px] text-slate-500">이전에 저장했거나 수정한 JSON 파일을 불러와 복원합니다.</div>
            </div>
            <div>
              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shrink-0"
              >
                <Upload className="w-3.5 h-3.5 text-slate-500" />
                <span>JSON 파일 선택</span>
              </button>
            </div>
          </div>

          {/* Action 3: Reset to Default Sample Data */}
          <div className="p-3.5 bg-rose-50/50 border border-rose-200/60 rounded-xl space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-rose-900">초기 실전 샘플 데이터로 리셋</div>
                <div className="text-[11px] text-rose-700">모든 데이터를 중1~중3 모범 샘플 데이터로 다시 초기화합니다.</div>
              </div>

              {!resetConfirm ? (
                <button
                  onClick={() => setResetConfirm(true)}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-700 bg-white border border-rose-300 hover:bg-rose-50 rounded-lg transition-colors shrink-0"
                >
                  초기화
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      onResetToDefault();
                      setResetConfirm(false);
                      onClose();
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shrink-0"
                  >
                    정말 리셋
                  </button>
                  <button
                    onClick={() => setResetConfirm(false)}
                    className="px-2 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    취소
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
