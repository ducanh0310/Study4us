import React, { useState, useEffect } from 'react';
import { SubjectId, GradeId, ResourceType, ResourceItem } from '../../types';
import { SUBJECTS, GRADES } from '../../data/mockCurriculum';
import { X } from 'lucide-react';

interface CreateResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject: SubjectId;
  defaultGrade: GradeId;
  onSave: (newRes: ResourceItem) => void;
}

export const CreateResourceModal: React.FC<CreateResourceModalProps> = ({
  isOpen,
  onClose,
  defaultSubject,
  defaultGrade,
  onSave,
}) => {
  const [subjectId, setSubjectId] = useState<SubjectId>(defaultSubject);
  const [gradeId, setGradeId] = useState<GradeId>(defaultGrade);
  const [type, setType] = useState<ResourceType>('theory');
  const [title, setTitle] = useState('');
  const [chapter, setChapter] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [latexFormula, setLatexFormula] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const [tutorNote, setTutorNote] = useState('');

  useEffect(() => {
    setSubjectId(defaultSubject);
    setGradeId(defaultGrade);
  }, [defaultSubject, defaultGrade, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tags = tagsStr
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    const newRes: ResourceItem = {
      id: `custom-res-${Date.now()}`,
      subjectId,
      gradeId,
      type,
      title: title.trim(),
      chapter: chapter.trim() || `Chuyên đề tự soạn Lớp ${gradeId}`,
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      latexFormula: latexFormula.trim() || undefined,
      tags: tags.length > 0 ? tags : [subjectId, `Lớp ${gradeId}`],
      tutorNote: tutorNote.trim() || undefined,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    onSave(newRes);
    setTitle('');
    setChapter('');
    setSummary('');
    setContent('');
    setLatexFormula('');
    setTagsStr('');
    setTutorNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-900">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-base">
              Thêm tài liệu / bài giảng mới
            </h2>
            <p className="text-xs text-slate-500">
              Lưu bài giảng, công thức hoặc đề luyện tập vào đúng thư mục Môn và Khối
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ thêm tài liệu"
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex-1 p-6 overflow-y-auto space-y-4 text-xs">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Môn học</label>
              <select
                value={subjectId}
                onChange={e => setSubjectId(e.target.value as SubjectId)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-600"
              >
                {SUBJECTS.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Khối lớp</label>
              <select
                value={gradeId}
                onChange={e => setGradeId(parseInt(e.target.value) as GradeId)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-600"
              >
                {GRADES.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Phân loại</label>
              <select
                value={type}
                onChange={e => setType(e.target.value as ResourceType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-blue-600"
              >
                <option value="theory">Lý thuyết</option>
                <option value="exercise">Bài tập & Đề thi</option>
                <option value="formula">Công thức tóm tắt</option>
                <option value="note">Ghi chú riêng</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">Tiêu đề bài giảng *</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="VD: Khảo sát hàm số bậc hai, Định luật bảo toàn khối lượng..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Chương / Chuyên đề</label>
              <input
                type="text"
                value={chapter}
                onChange={e => setChapter(e.target.value)}
                placeholder="VD: Chương 1: Dao động cơ"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Từ khóa (phân cách bằng dấu phẩy)</label>
              <input
                type="text"
                value={tagsStr}
                onChange={e => setTagsStr(e.target.value)}
                placeholder="VD: Đồ thị, Cực trị, Ôn thi"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">Công thức cốt lõi (LaTeX hoặc biểu thức)</label>
            <input
              type="text"
              value={latexFormula}
              onChange={e => setLatexFormula(e.target.value)}
              placeholder="VD: y = ax^2 + bx + c"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">Tóm tắt ngắn gọn</label>
            <input
              type="text"
              value={summary}
              onChange={e => setSummary(e.target.value)}
              placeholder="Một câu mô tả trọng tâm bài học..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">Nội dung chi tiết (Markdown) *</label>
            <textarea
              required
              rows={5}
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Nhập nội dung giảng dạy, các bước giải, lý thuyết chi tiết..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-900 resize-none font-mono text-xs leading-relaxed focus:bg-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">Ghi chú riêng cho gia sư</label>
            <input
              type="text"
              value={tutorNote}
              onChange={e => setTutorNote(e.target.value)}
              placeholder="Lưu ý học sinh dễ nhầm, mẹo giảng..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs cursor-pointer"
            >
              Lưu vào thư mục
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
