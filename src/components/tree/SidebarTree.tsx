import React from 'react';
import { SUBJECTS } from '../../data/mockCurriculum';
import { SubjectId, GradeId, ResourceItem } from '../../types';
import { ArrowLeft, FileText, Plus } from 'lucide-react';

interface SidebarTreeProps {
  resources: ResourceItem[];
  selectedResourceId: string | null;
  onSelectResource: (resource: ResourceItem) => void;
  onAddNewResource: (subjectId: SubjectId, gradeId: GradeId) => void;
  activeSubject: SubjectId;
  activeGrade: GradeId;
  onChangeCourse: () => void;
}

export const SidebarTree: React.FC<SidebarTreeProps> = ({
  resources,
  selectedResourceId,
  onSelectResource,
  onAddNewResource,
  activeSubject,
  activeGrade,
  onChangeCourse,
}) => {
  const subjectInfo = SUBJECTS.find(s => s.id === activeSubject) || SUBJECTS[0];
  const gradeLessons = resources.filter(
    r => r.subjectId === activeSubject && r.gradeId === activeGrade
  );

  return (
    <aside
      aria-label="Danh sách bài học"
      className="w-80 shrink-0 h-full bg-white border-r border-slate-200 flex flex-col select-none"
    >
      {/* Selected Subject & Grade Header + Back button */}
      <div className="p-4 border-b border-slate-200 space-y-3">
        <button
          type="button"
          onClick={onChangeCourse}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Đổi lớp / môn khác</span>
        </button>

        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            {subjectInfo.name} · Lớp {activeGrade}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Danh sách bài học ({gradeLessons.length} bài)
          </p>
        </div>
      </div>

      {/* Focused Lesson List ONLY */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
        {gradeLessons.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-center space-y-2">
            <p className="text-xs text-slate-500">
              Chưa có bài học nào cho {subjectInfo.name} Lớp {activeGrade}.
            </p>
            <button
              type="button"
              onClick={() => onAddNewResource(activeSubject, activeGrade)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm bài học đầu tiên</span>
            </button>
          </div>
        ) : (
          gradeLessons.map((res, idx) => {
            const isSelected = selectedResourceId === res.id;
            return (
              <button
                key={res.id}
                type="button"
                onClick={() => onSelectResource(res)}
                className={`w-full flex items-start gap-2.5 p-3 rounded-xl text-left transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xs'
                    : 'bg-white border-slate-200/80 text-slate-800 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <FileText
                  className={`w-4 h-4 mt-0.5 shrink-0 ${
                    isSelected ? 'text-blue-100' : 'text-slate-400'
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div
                    className={`text-[11px] font-medium mb-0.5 truncate ${
                      isSelected ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    Bài {idx + 1} · {res.chapter}
                  </div>
                  <div
                    className={`text-sm leading-snug line-clamp-2 ${
                      isSelected ? 'font-semibold text-white' : 'font-semibold text-slate-900'
                    }`}
                  >
                    {res.title}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Subtle Add Lesson Footer */}
      <div className="p-3 border-t border-slate-200 bg-slate-50/60">
        <button
          type="button"
          onClick={() => onAddNewResource(activeSubject, activeGrade)}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-blue-600" />
          <span>Thêm bài học mới</span>
        </button>
      </div>
    </aside>
  );
};
