import React from 'react';
import { SUBJECTS, GRADES } from '../data/mockCurriculum';
import { SubjectId, GradeId, ResourceItem } from '../types';
import { ArrowRight, Calculator, Atom, FlaskConical, Languages } from 'lucide-react';

interface CourseSelectorScreenProps {
  selectedGrade: GradeId;
  selectedSubject: SubjectId;
  onSelectGrade: (grade: GradeId) => void;
  onSelectSubject: (subject: SubjectId) => void;
  onConfirm: () => void;
  resources: ResourceItem[];
}

export const CourseSelectorScreen: React.FC<CourseSelectorScreenProps> = ({
  selectedGrade,
  selectedSubject,
  onSelectGrade,
  onSelectSubject,
  onConfirm,
  resources,
}) => {
  const activeSubjectInfo = SUBJECTS.find(s => s.id === selectedSubject) || SUBJECTS[0];

  const getSubjectIcon = (id: SubjectId) => {
    switch (id) {
      case 'toan':
        return <Calculator className="w-5 h-5" />;
      case 'ly':
        return <Atom className="w-5 h-5" />;
      case 'hoa':
        return <FlaskConical className="w-5 h-5" />;
      case 'anh':
        return <Languages className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-slate-50 p-4 sm:p-6">
      <div className="min-h-full flex items-center justify-center">
        <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xs p-5 sm:p-8 space-y-6 sm:space-y-8">
          <div className="space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Chọn Lớp & Môn học để bắt đầu
            </h1>
            <p className="text-sm text-slate-500">
              Chọn khối lớp và môn học bên dưới để mở danh sách bài giảng và công cụ minh họa tương ứng.
            </p>
          </div>

          {/* Step 1: Select Grade (Lớp 8 - 12) */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              1. Chọn Khối lớp
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {GRADES.map(grade => {
                const isSelected = selectedGrade === grade.id;
                return (
                  <button
                    key={grade.id}
                    type="button"
                    onClick={() => onSelectGrade(grade.id)}
                    className={`py-3 px-4 rounded-xl text-center border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold'
                    }`}
                  >
                    <div className="text-sm">{grade.name}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Subject */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              2. Chọn Môn học
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SUBJECTS.map(subject => {
                const isSelected = selectedSubject === subject.id;
                const lessonCount = resources.filter(
                  r => r.subjectId === subject.id && r.gradeId === selectedGrade
                ).length;

                return (
                  <button
                    key={subject.id}
                    type="button"
                    onClick={() => onSelectSubject(subject.id)}
                    className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-600 ring-1 ring-blue-600/20'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-blue-600 text-white'
                          : 'bg-white border border-slate-200 text-slate-600'
                      }`}
                    >
                      {getSubjectIcon(subject.id)}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={`text-base font-bold ${
                            isSelected ? 'text-blue-950' : 'text-slate-900'
                          }`}
                        >
                          {subject.name}
                        </span>
                        <span className="text-xs font-mono tabular-nums text-slate-500">
                          {lessonCount} bài
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        {subject.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confirm CTA */}
          <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="text-sm text-slate-600">
              Đang chọn:{' '}
              <strong className="text-slate-900">
                {activeSubjectInfo.name} · Lớp {selectedGrade}
              </strong>
            </div>

            <button
              type="button"
              onClick={onConfirm}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-xs cursor-pointer whitespace-nowrap"
            >
              <span>Xem danh sách bài học</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
