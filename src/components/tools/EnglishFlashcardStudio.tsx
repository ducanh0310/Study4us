import React, { useState, useRef } from 'react';
import { ENGLISH_FLASHCARDS } from '../../data/mockCurriculum';
import { Flashcard, CapturedMedia, GradeId } from '../../types';
import { Volume2, RotateCcw, ChevronLeft, ChevronRight, Plus, Camera, Check, Clock, X } from 'lucide-react';

interface EnglishFlashcardStudioProps {
  initialGrade?: GradeId;
  onSaveMedia?: (media: CapturedMedia) => void;
}

export const EnglishFlashcardStudio: React.FC<EnglishFlashcardStudioProps> = ({
  initialGrade = 10,
  onSaveMedia,
}) => {
  const cardElementRef = useRef<HTMLDivElement | null>(null);

  const [selectedGrade, setSelectedGrade] = useState<GradeId>(initialGrade);
  const [activeTab, setActiveTab] = useState<'flashcards' | 'tenses'>('flashcards');

  const [cards, setCards] = useState<Flashcard[]>(ENGLISH_FLASHCARDS);
  const gradeCards = cards.filter(c => c.grade === selectedGrade);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newIpa, setNewIpa] = useState('');
  const [newPos, setNewPos] = useState('noun');
  const [newMeaning, setNewMeaning] = useState('');
  const [newExampleEn, setNewExampleEn] = useState('');
  const [newExampleVi, setNewExampleVi] = useState('');
  const [newTopic, setNewTopic] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentCard = gradeCards[currentIndex] || gradeCards[0] || ENGLISH_FLASHCARDS[0];

  const handleSpeak = (text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Trình duyệt chưa hỗ trợ phát âm tự động.');
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % gradeCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + gradeCards.length) % gradeCards.length);
  };

  const handleAddCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newMeaning.trim()) return;

    const newCardObj: Flashcard = {
      id: `fc-custom-${Date.now()}`,
      word: newWord.trim(),
      ipa: newIpa.trim() || '/.../',
      partOfSpeech: newPos,
      vietnameseMeaning: newMeaning.trim(),
      exampleEn: newExampleEn.trim() || `This is an example for ${newWord}.`,
      exampleVi: newExampleVi.trim() || `Đây là câu ví dụ minh họa cho từ ${newWord}.`,
      grade: selectedGrade,
      topic: newTopic.trim() || 'Chủ đề bổ trợ',
    };

    setCards(prev => [newCardObj, ...prev]);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowAddModal(false);

    setNewWord('');
    setNewIpa('');
    setNewMeaning('');
    setNewExampleEn('');
    setNewExampleVi('');
    setNewTopic('');
    showToast('Đã thêm thẻ từ vựng mới thành công!');
  };

  const handleExportFlashcardImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 540;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Bright Light Mode Printable Flashcard
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 900, 540);

    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.strokeRect(28, 28, 844, 484);

    ctx.fillStyle = '#2563eb';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`TIẾNG ANH LỚP ${currentCard.grade} · CHỦ ĐỀ: ${currentCard.topic.toUpperCase()}`, 60, 80);

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 54px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(currentCard.word, 60, 158);

    ctx.fillStyle = '#475569';
    ctx.font = '24px "IBM Plex Mono", monospace';
    ctx.fillText(`${currentCard.ipa}  ·  ${currentCard.partOfSpeech}`, 60, 204);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 234);
    ctx.lineTo(840, 234);
    ctx.stroke();

    ctx.fillStyle = '#1d4ed8';
    ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(`Nghĩa: ${currentCard.vietnameseMeaning}`, 60, 286);

    ctx.fillStyle = '#1e293b';
    ctx.font = 'italic 22px "DM Sans", sans-serif';
    ctx.fillText(`"${currentCard.exampleEn}"`, 60, 348);

    ctx.fillStyle = '#64748b';
    ctx.font = '20px "DM Sans", sans-serif';
    ctx.fillText(`→ ${currentCard.exampleVi}`, 60, 392);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '15px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('GiaSư Pro · Thẻ học từ vựng Tiếng Anh', 60, 476);

    const dataUrl = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Flashcard_${currentCard.word}.png`;
    a.click();

    if (onSaveMedia) {
      onSaveMedia({
        id: `img-fc-${Date.now()}`,
        type: 'image',
        title: `Flashcard: ${currentCard.word} (${currentCard.vietnameseMeaning})`,
        subjectId: 'anh',
        gradeId: currentCard.grade,
        dataUrl,
        format: 'PNG',
        createdAt: new Date().toLocaleString('vi-VN'),
        notes: `Từ vựng Unit: ${currentCard.topic}`,
      });
    }

    showToast('Đã xuất và lưu ảnh thẻ từ vựng vào Kho tư liệu!');
  };

  const TENSES_DATA = [
    { name: 'Hiện tại đơn (Present Simple)', form: 'S + V(s/es)', usage: 'Sự thật hiển nhiên, thói quen lặp lại hàng ngày' },
    { name: 'Hiện tại tiếp diễn (Present Continuous)', form: 'S + am/is/are + V-ing', usage: 'Hành động đang diễn ra ngay tại thời điểm nói' },
    { name: 'Hiện tại hoàn thành (Present Perfect)', form: 'S + have/has + V3/ed', usage: 'Hành động bắt đầu trong quá khứ và kéo dài đến hiện tại' },
    { name: 'Quá khứ đơn (Past Simple)', form: 'S + V2/ed', usage: 'Hành động đã xảy ra và kết thúc hoàn toàn trong quá khứ' },
    { name: 'Quá khứ tiếp diễn (Past Continuous)', form: 'S + was/were + V-ing', usage: 'Hành động đang diễn ra tại một thời điểm xác định trong quá khứ' },
    { name: 'Quá khứ hoàn thành (Past Perfect)', form: 'S + had + V3/ed', usage: 'Hành động xảy ra trước một hành động khác trong quá khứ' },
    { name: 'Tương lai đơn (Future Simple)', form: 'S + will + V_inf', usage: 'Quyết định đưa ra ngay tại thời điểm nói' },
    { name: 'Tương lai gần (Be going to)', form: 'S + am/is/are + going to + V', usage: 'Kế hoạch có trước hoặc dự đoán có căn cứ rõ ràng' },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50 text-slate-900 overflow-hidden">
      {/* Studio Header Bar */}
      <div className="bg-white border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4 shrink-0">
        <div>
          <h2 className="font-bold text-slate-900 text-lg tracking-tight">
            Studio Tiếng Anh - Thẻ Từ Vựng IPA & Sơ Đồ 12 Thì
          </h2>
          <p className="text-xs text-slate-500">
            Luyện phát âm chuẩn bản xứ, ôn tập ngữ pháp 12 thì và xuất ảnh thẻ Flashcard
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            <span>Thêm từ vựng mới</span>
          </button>

          <button
            type="button"
            onClick={handleExportFlashcardImage}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors shadow-xs whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            <span>Xuất ảnh thẻ Flashcard</span>
          </button>
        </div>
      </div>

      {/* Filter & View Switcher Bar */}
      <div className="bg-white px-6 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          {([8, 9, 10, 11, 12] as GradeId[]).map(grade => (
            <button
              key={grade}
              type="button"
              onClick={() => {
                setSelectedGrade(grade);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                selectedGrade === grade
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lớp {grade}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setActiveTab('flashcards')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Thẻ từ vựng Flashcard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tenses')}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              activeTab === 'tenses'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sơ đồ 12 Thì Tiếng Anh
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center overflow-y-auto relative">
        {activeTab === 'flashcards' ? (
          <div className="w-full max-w-2xl flex flex-col items-center">
            <div className="text-xs text-slate-500 mb-3 flex items-center justify-between w-full px-1">
              <span>
                Chủ đề Unit: <strong className="text-slate-900">{currentCard.topic}</strong>
              </span>
              <span className="font-mono tabular-nums font-semibold text-slate-700">
                Thẻ {currentIndex + 1} / {gradeCards.length}
              </span>
            </div>

            {/* Crisp Light Mode Interactive Flashcard */}
            <div
              ref={cardElementRef}
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full min-h-[320px] rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md p-8 flex flex-col justify-between cursor-pointer transition-all select-none"
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-medium text-slate-500">
                  Tiếng Anh Lớp {currentCard.grade} · {currentCard.partOfSpeech}
                </div>

                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleSpeak(currentCard.word);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors cursor-pointer"
                  title="Nghe phát âm chuẩn"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Nghe phát âm</span>
                </button>
              </div>

              {!isFlipped ? (
                <div className="flex flex-col items-center justify-center text-center my-auto py-6">
                  <h3 className="text-5xl font-extrabold text-slate-900 tracking-tight mb-3">
                    {currentCard.word}
                  </h3>
                  <div className="text-base text-blue-700 font-mono font-medium mb-4">
                    {currentCard.ipa}
                  </div>
                  <p className="text-xs text-slate-400 mt-4 flex items-center gap-1.5">
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Nhấp vào thẻ để lật xem nghĩa tiếng Việt & câu ví dụ</span>
                  </p>
                </div>
              ) : (
                <div className="flex flex-col my-auto py-4 text-left space-y-4">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 mb-1">
                      Ý nghĩa tiếng Việt
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {currentCard.vietnameseMeaning}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
                    <div className="text-sm text-slate-900 font-medium italic flex items-center justify-between gap-2">
                      <span>"{currentCard.exampleEn}"</span>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          handleSpeak(currentCard.exampleEn);
                        }}
                        className="p-1.5 rounded-md text-blue-600 hover:bg-blue-100 transition-colors shrink-0 cursor-pointer"
                        title="Nghe đọc cả câu"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-sm text-slate-600">
                      → {currentCard.exampleVi}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-slate-400 pt-3 border-t border-slate-100">
                <span>GiaSư Pro · Học từ vựng theo ngữ cảnh</span>
                <span className="font-medium text-slate-600">
                  {isFlipped ? 'Đang xem: Mặt sau (Nghĩa & Ví dụ)' : 'Đang xem: Mặt trước (Từ & Phiên âm)'}
                </span>
              </div>
            </div>

            {/* Card Controls */}
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Thẻ trước</span>
              </button>

              <button
                type="button"
                onClick={() => setIsFlipped(!isFlipped)}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Lật thẻ</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors cursor-pointer"
              >
                <span>Thẻ tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span>Hệ thống các Thì trọng tâm trong Tiếng Anh</span>
              </h3>
              <p className="text-xs text-slate-600">
                Bảng tóm tắt công thức và cách dùng cốt lõi giúp học sinh tra cứu nhanh khi làm bài tập chia động từ.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {TENSES_DATA.map((tense, idx) => (
                <div
                  key={idx}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2"
                >
                  <h4 className="font-bold text-slate-900 text-sm">
                    {tense.name}
                  </h4>
                  <div className="font-mono text-blue-700 font-semibold text-xs bg-blue-50/70 px-3 py-1.5 rounded-lg border border-blue-200/70">
                    {tense.form}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tense.usage}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Flashcard Modal in Light Mode */}
        {showAddModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 w-full max-w-md shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base">
                  Thêm từ vựng mới (Lớp {selectedGrade})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddCard} className="space-y-3 text-xs">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Từ vựng tiếng Anh *</label>
                  <input
                    type="text"
                    required
                    value={newWord}
                    onChange={e => setNewWord(e.target.value)}
                    placeholder="VD: sustainable"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Phiên âm IPA</label>
                    <input
                      type="text"
                      value={newIpa}
                      onChange={e => setNewIpa(e.target.value)}
                      placeholder="VD: /səˈsteɪnəbl/"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 font-mono focus:bg-white focus:outline-none focus:border-blue-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">Từ loại</label>
                    <select
                      value={newPos}
                      onChange={e => setNewPos(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                    >
                      <option value="noun">Danh từ (n)</option>
                      <option value="verb">Động từ (v)</option>
                      <option value="adj">Tính từ (adj)</option>
                      <option value="adv">Trạng từ (adv)</option>
                      <option value="idiom">Cụm từ / Idiom</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Nghĩa tiếng Việt *</label>
                  <input
                    type="text"
                    required
                    value={newMeaning}
                    onChange={e => setNewMeaning(e.target.value)}
                    placeholder="VD: bền vững, lâu dài"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Câu ví dụ tiếng Anh</label>
                  <input
                    type="text"
                    value={newExampleEn}
                    onChange={e => setNewExampleEn(e.target.value)}
                    placeholder="VD: Solar energy provides a sustainable alternative."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Dịch nghĩa câu ví dụ</label>
                  <input
                    type="text"
                    value={newExampleVi}
                    onChange={e => setNewExampleVi(e.target.value)}
                    placeholder="VD: Năng lượng mặt trời đem lại giải pháp thay thế bền vững."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">Chủ đề bài học (Unit)</label>
                  <input
                    type="text"
                    value={newTopic}
                    onChange={e => setNewTopic(e.target.value)}
                    placeholder="VD: Our Green Future"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors cursor-pointer"
                  >
                    Lưu thẻ từ vựng
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {toastMessage && (
          <div className="absolute bottom-6 right-6 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs font-semibold">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};
