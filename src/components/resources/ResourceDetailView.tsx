import React, { useState, useEffect } from 'react';
import { ResourceItem, SubjectId, GradeId } from '../../types';
import { SUBJECTS } from '../../data/mockCurriculum';
import {
  Sliders,
  BookOpen,
  Edit3,
  Save,
  ChevronDown,
  ChevronUp,
  FileQuestion,
  Printer,
  Wand2,
} from 'lucide-react';
import { MathMarkdownRenderer } from './MathMarkdownRenderer';
import katex from 'katex';

interface ResourceDetailViewProps {
  resource: ResourceItem;
  onOpenTool: (toolType: 'graph' | 'physics' | 'chemistry' | 'english', initialConfig?: any) => void;
  onUpdateTutorNote: (resourceId: string, note: string) => void;
  onOpenAIAssistant: (subject: SubjectId, grade: GradeId, topic: string) => void;
}

export const ResourceDetailView: React.FC<ResourceDetailViewProps> = ({
  resource,
  onOpenTool,
  onUpdateTutorNote,
  onOpenAIAssistant,
}) => {
  const [tutorNote, setTutorNote] = useState(resource.tutorNote || '');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [revealedSolutions, setRevealedSolutions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    setTutorNote(resource.tutorNote || '');
    setIsEditingNote(false);
    setRevealedSolutions({});
  }, [resource.id, resource.tutorNote]);

  const subject = SUBJECTS.find(s => s.id === resource.subjectId);

  const toggleSolution = (idx: number) => {
    setRevealedSolutions(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleSaveNote = () => {
    onUpdateTutorNote(resource.id, tutorNote);
    setIsEditingNote(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const renderedLatexBanner = React.useMemo(() => {
    if (!resource.latexFormula) return null;
    try {
      return katex.renderToString(resource.latexFormula, { throwOnError: false, displayMode: true });
    } catch {
      return null;
    }
  }, [resource.latexFormula]);

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 text-slate-900 px-6 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Clean Lesson Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1 min-w-[260px]">
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-2">
                <span className="text-blue-700 font-semibold">{subject?.name}</span>
                <span aria-hidden="true">·</span>
                <span>Lớp {resource.gradeId}</span>
                <span aria-hidden="true">·</span>
                <span>{resource.chapter}</span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">
                {resource.title}
              </h1>

              <p className="text-base text-slate-600 leading-relaxed">
                {resource.summary}
              </p>
            </div>

            {/* Minimal Essential Actions */}
            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>In bài</span>
              </button>

              <button
                type="button"
                onClick={() => onOpenAIAssistant(resource.subjectId, resource.gradeId, resource.title)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Soạn thêm với AI</span>
              </button>

              {resource.relatedTool && (
                <button
                  type="button"
                  onClick={() =>
                    onOpenTool(resource.relatedTool!.toolType, resource.relatedTool!.initialConfig)
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Mở mô phỏng trực quan</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
          <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span>Nội dung bài giảng & Công thức trọng tâm</span>
          </h2>

          {resource.latexFormula && (
            <div className="bg-blue-50/60 border border-blue-200/80 p-5 rounded-xl mb-6">
              <div className="text-xs font-semibold text-blue-800 mb-2">
                Công thức định nghĩa cốt lõi
              </div>
              {renderedLatexBanner ? (
                <div
                  dangerouslySetInnerHTML={{ __html: renderedLatexBanner }}
                  className="text-lg text-slate-900 font-semibold overflow-x-auto py-1"
                />
              ) : (
                <div className="font-mono text-base text-slate-900 font-bold">
                  {resource.latexFormula}
                </div>
              )}
            </div>
          )}

          <div className="max-w-none">
            <MathMarkdownRenderer content={resource.content} />
          </div>
        </div>

        {/* Practice Problems Section */}
        {resource.sampleProblems && resource.sampleProblems.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100 flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-emerald-600" />
              <span>Bài tập vận dụng & Hướng dẫn giải</span>
            </h2>

            <div className="space-y-4">
              {resource.sampleProblems.map((prob, idx) => {
                const isRevealed = !!revealedSolutions[idx];
                return (
                  <div
                    key={idx}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3"
                  >
                    <div className="font-semibold text-slate-900 text-base">
                      <span className="text-blue-600 font-bold mr-1.5">Câu {idx + 1}:</span>
                      {prob.question}
                    </div>

                    {prob.options && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-sm">
                        {prob.options.map((opt, oIdx) => (
                          <div
                            key={oIdx}
                            className="px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium"
                          >
                            {opt}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-200/80">
                      <button
                        type="button"
                        onClick={() => toggleSolution(idx)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 cursor-pointer"
                      >
                        {isRevealed ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            <span>Ẩn lời giải chi tiết</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            <span>Xem đáp án & lời giải chi tiết</span>
                          </>
                        )}
                      </button>

                      {isRevealed && (
                        <div className="mt-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-950 leading-relaxed space-y-1">
                          {prob.correctAnswer && (
                            <div className="font-bold text-emerald-800">
                              Đáp án đúng: {prob.correctAnswer}
                            </div>
                          )}
                          <div>{prob.explanation}</div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tutor Private Notes Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-600" />
              <span>Ghi chú của gia sư cho bài này</span>
            </h3>

            {!isEditingNote ? (
              <button
                type="button"
                onClick={() => setIsEditingNote(true)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Chỉnh sửa
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSaveNote}
                className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-semibold cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu ghi chú</span>
              </button>
            )}
          </div>

          {isEditingNote ? (
            <textarea
              value={tutorNote}
              onChange={e => setTutorNote(e.target.value)}
              placeholder="Ghi chú tiến độ học sinh, mẹo giải nhanh, lỗi sai thường gặp..."
              className="w-full h-32 bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600 leading-relaxed resize-none"
            />
          ) : (
            <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
              {tutorNote || (
                <span className="text-slate-500 italic">
                  Chưa có ghi chú. Nhấn "Chỉnh sửa" để lưu lại kinh nghiệm dạy bài này.
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
