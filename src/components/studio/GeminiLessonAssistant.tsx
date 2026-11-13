import React, { useState, useEffect } from 'react';
import { SubjectId, GradeId, ResourceItem } from '../../types';
import { SUBJECTS, GRADES } from '../../data/mockCurriculum';
import { GoogleGenAI } from '@google/genai';
import { Wand2, Copy, Check, BookPlus, Loader2, X } from 'lucide-react';

interface GeminiLessonAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: SubjectId;
  defaultGrade?: GradeId;
  defaultTopic?: string;
  onAddResourceFromAI: (newResource: Partial<ResourceItem>) => void;
}

export const GeminiLessonAssistant: React.FC<GeminiLessonAssistantProps> = ({
  isOpen,
  onClose,
  defaultSubject = 'toan',
  defaultGrade = 10,
  defaultTopic = '',
  onAddResourceFromAI,
}) => {
  const [subject, setSubject] = useState<SubjectId>(defaultSubject);
  const [grade, setGrade] = useState<GradeId>(defaultGrade);
  const [topic, setTopic] = useState(defaultTopic);
  const [contentType, setContentType] = useState<'summary' | 'exercise' | 'mnemonic' | 'exam'>('summary');

  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSubject(defaultSubject);
    setGrade(defaultGrade);
    setTopic(defaultTopic);
  }, [defaultSubject, defaultGrade, defaultTopic, isOpen]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setGeneratedResult('');

    const subjectName = SUBJECTS.find(s => s.id === subject)?.name || subject;

    try {
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;

      if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Bạn là một gia sư giàu kinh nghiệm dạy môn ${subjectName} cho học sinh lớp ${grade} tại Việt Nam (theo chương trình GDPT mới).
Hãy soạn tài liệu cho chủ đề: "${topic}".
Loại nội dung yêu cầu: ${
          contentType === 'summary'
            ? 'Tóm tắt lý thuyết cốt lõi, công thức then chốt và sơ đồ tư duy ngắn gọn.'
            : contentType === 'exercise'
            ? '3 bài tập tiêu biểu từ dễ đến khó có lời giải chi tiết từng bước.'
            : contentType === 'mnemonic'
            ? 'Mẹo ghi nhớ nhanh, bài thơ hoặc mẹo bấm máy tính Casio / phân biệt bẫy đề thi.'
            : 'Đề kiểm tra 15 phút gồm 4 câu trắc nghiệm và 1 câu tự luận kèm đáp án.'
        }
Định dạng trình bày rõ ràng, sư phạm, dùng Markdown, công thức toán/lý/hóa viết chuẩn.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        setGeneratedResult(response.text || 'Không có kết quả.');
      } else {
        await new Promise(r => setTimeout(r, 600));
        let fallbackText = '';

        if (contentType === 'summary') {
          fallbackText = `### Tóm tắt lý thuyết & Công thức trọng tâm: ${topic} (Lớp ${grade} - Môn ${subjectName})

#### 1. Khái niệm & Định nghĩa cơ bản:
- Nắm vững bản chất của chuyên đề **${topic}** theo chương trình SGK mới.
- Hiểu rõ điều kiện xác định và phạm vi áp dụng của các định lý, công thức.

#### 2. Hệ thống công thức then chốt:
- Công thức tổng quát: Định nghĩa chuẩn.
- Các hệ quả trực tiếp thường dùng để tính nhanh trắc nghiệm.
- Đơn vị đo lường và quy ước dấu chuẩn.

#### 3. Các lỗi học sinh Lớp ${grade} hay mắc phải:
- Quên đặt điều kiện xác định của ẩn số.
- Nhầm lẫn đơn vị đo hoặc dấu khi chuyển vế.
- Bỏ sót nghiệm ngoại lai hoặc không đối chiếu điều kiện ban đầu.`;
        } else if (contentType === 'exercise') {
          fallbackText = `### Bộ 3 Bài tập vận dụng: ${topic} (Lớp ${grade})

#### Bài 1 (Mức độ Nhận biết - Thông hiểu):
Cho bài toán cơ bản liên quan đến **${topic}**. Yêu cầu áp dụng trực tiếp công thức lý thuyết.
*Lời giải chi tiết:*
- Bước 1: Xác định các đại lượng đã cho trong đề bài.
- Bước 2: Áp dụng công thức liên hệ trực tiếp.
- Bước 3: Thay số và kết luận nghiệm.

#### Bài 2 (Mức độ Vận dụng):
Dạng toán tổng hợp có biến đổi trung gian.
*Lời giải chi tiết:*
- Phân tích hiện tượng / biến đổi phương trình về dạng chính tắc.
- Biện luận theo tham số và tìm giá trị thỏa mãn.

#### Bài 3 (Mức độ Vận dụng cao):
Bài toán thực tế hoặc kết hợp đồ thị / phương pháp hình học.
*Hướng dẫn giải:*
- Sử dụng phương pháp đánh giá bất đẳng thức hoặc khảo sát hàm số để tìm cực trị.`;
        } else {
          fallbackText = `### Mẹo ghi nhớ & Kỹ thuật giải nhanh: ${topic} (Lớp ${grade})

1. **Ghi nhớ bản chất**:
   - Liên kết công thức với đồ thị hoặc hình ảnh mô phỏng trực quan.
   - Vẽ sơ đồ tóm tắt dữ kiện trước khi giải phương trình.

2. **Kỹ thuật kiểm tra kết quả bằng máy tính Casio**:
   - Dùng tính năng Table (Mode 8) để quét nghiệm và kiểm tra cực trị.
   - Dùng chức năng CALC để thử lại nghiệm vừa tìm được.

3. **Lưu ý sư phạm khi giảng dạy**:
   - Yêu cầu học sinh tự trình bày lại bước lập luận sau mỗi bài mẫu.`;
        }

        setGeneratedResult(fallbackText);
      }
    } catch (err: any) {
      setGeneratedResult(`Lỗi khi tạo nội dung: ${err?.message || 'Vui lòng thử lại.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToCurriculum = () => {
    onAddResourceFromAI({
      title: `${topic} (Biên soạn bổ trợ)`,
      subjectId: subject,
      gradeId: grade,
      type: contentType === 'exercise' ? 'exercise' : 'theory',
      chapter: `Chuyên đề bổ trợ Lớp ${grade}`,
      summary: `Tài liệu biên soạn cho học sinh Lớp ${grade} chủ đề ${topic}.`,
      content: generatedResult,
      tags: [subject, `Lớp ${grade}`],
      updatedAt: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden text-slate-900">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-base">
              Trợ lý Soạn bài giảng & Đề kiểm tra nhanh
            </h2>
            <p className="text-xs text-slate-500">
              Tự động biên soạn tóm tắt lý thuyết, bài tập có lời giải và lưu vào thư mục khối
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng trợ lý soạn bài"
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Môn học</label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value as SubjectId)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
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
                value={grade}
                onChange={e => setGrade(parseInt(e.target.value) as GradeId)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
              >
                {GRADES.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Dạng tài liệu</label>
              <select
                value={contentType}
                onChange={e => setContentType(e.target.value as any)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-900 font-medium focus:outline-none focus:border-blue-600"
              >
                <option value="summary">Tóm tắt lý thuyết & công thức</option>
                <option value="exercise">3 Bài tập mẫu có lời giải</option>
                <option value="mnemonic">Mẹo giải nhanh & Casio</option>
                <option value="exam">Đề kiểm tra 15 phút</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">Chủ đề bài giảng</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="VD: Khảo sát hàm số bậc 3, Định luật Ôm, Vòng Benzen..."
                className="flex-1 bg-white border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600"
              />
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isLoading || !topic.trim()}
                className="px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang soạn...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>Soạn nội dung</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Result Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-white text-sm text-slate-800">
          {generatedResult ? (
            <div className="whitespace-pre-line leading-relaxed">{generatedResult}</div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-slate-400 text-xs text-center">
              <span>Nhập chủ đề bài học và nhấn "Soạn nội dung" để tạo tài liệu.</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {generatedResult && (
          <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Đã sao chép' : 'Sao chép văn bản'}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveToCurriculum}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-xs cursor-pointer"
            >
              <BookPlus className="w-4 h-4" />
              <span>Lưu vào Thư mục Lớp {grade}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
