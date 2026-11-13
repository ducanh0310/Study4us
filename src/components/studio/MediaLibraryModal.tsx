import React, { useState } from 'react';
import { CapturedMedia, SubjectId } from '../../types';
import { SUBJECTS } from '../../data/mockCurriculum';
import { Download, Trash2, Video, Image, X, Play } from 'lucide-react';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mediaList: CapturedMedia[];
  onDeleteMedia: (id: string) => void;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  mediaList,
  onDeleteMedia,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectId | 'all'>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>('all');
  const [activePreview, setActivePreview] = useState<CapturedMedia | null>(null);

  if (!isOpen) return null;

  const filteredMedia = mediaList.filter(item => {
    if (selectedSubject !== 'all' && item.subjectId !== selectedSubject) return false;
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    return true;
  });

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden text-slate-900">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-lg">
              Kho tư liệu Hình ảnh & Video minh họa đã tạo
            </h2>
            <p className="text-xs text-slate-500">
              Lưu trữ {mediaList.length} hình ảnh đồ thị và video mô phỏng để tải về gửi học sinh
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng kho tư liệu"
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedSubject('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                selectedSubject === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tất cả môn
            </button>
            {SUBJECTS.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSubject(s.id)}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                  selectedSubject === s.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {s.shortName}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setSelectedType('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                selectedType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Mọi định dạng
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('image')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                selectedType === 'image'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Hình ảnh (PNG)
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('video')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
                selectedType === 'video'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Video (WEBM)
            </button>
          </div>
        </div>

        {/* Media Grid */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50">
          {filteredMedia.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-500 text-sm text-center max-w-md mx-auto">
              <p className="font-bold text-slate-800 text-base mb-1">
                Chưa có tư liệu hình ảnh hoặc video nào
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Hãy mở các công cụ Đồ thị Toán, Mô phỏng Lý, Phân tử 3D Hóa hoặc Thẻ từ Tiếng Anh và nhấn nút "Chụp ảnh" hoặc "Quay video".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredMedia.map(item => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col group hover:border-blue-400 transition-colors"
                >
                  <div
                    onClick={() => setActivePreview(item)}
                    className="h-40 bg-slate-100 flex items-center justify-center relative cursor-pointer overflow-hidden border-b border-slate-100"
                  >
                    {item.type === 'image' ? (
                      <img
                        src={item.dataUrl}
                        alt={item.title}
                        className="w-full h-full object-contain bg-white"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-blue-600">
                        <div className="w-11 h-11 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mb-1.5">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-700">
                          Nhấp để phát video
                        </span>
                      </div>
                    )}

                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-slate-900/80 text-xs text-white flex items-center gap-1 font-medium">
                      {item.type === 'video' ? (
                        <Video className="w-3 h-3" />
                      ) : (
                        <Image className="w-3 h-3" />
                      )}
                      <span>{item.format}</span>
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col justify-between flex-1 gap-2">
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs truncate" title={item.title}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono tabular-nums mt-0.5">
                        Lớp {item.gradeId} · {item.createdAt}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <a
                        href={item.dataUrl}
                        download={`GiaSuPro_${item.title.replace(/[^a-zA-Z0-9]/g, '_')}.${
                          item.type === 'video' ? 'webm' : 'png'
                        }`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Tải về máy</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => onDeleteMedia(item.id)}
                        className="p-1.5 rounded-md text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa tư liệu"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Full Preview Modal */}
        {activePreview && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-60 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full p-5 flex flex-col gap-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-base">{activePreview.title}</h3>
                <button
                  type="button"
                  onClick={() => setActivePreview(null)}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center max-h-[65vh]">
                {activePreview.type === 'video' ? (
                  <video
                    src={activePreview.dataUrl}
                    controls
                    autoPlay
                    loop
                    className="max-h-[60vh] max-w-full"
                  />
                ) : (
                  <img
                    src={activePreview.dataUrl}
                    alt={activePreview.title}
                    className="max-h-[60vh] max-w-full object-contain"
                  />
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  {activePreview.notes || 'Tư liệu giảng dạy GiaSư Pro'}
                </span>
                <a
                  href={activePreview.dataUrl}
                  download={`GiaSuPro_${activePreview.title.replace(/[^a-zA-Z0-9]/g, '_')}.${
                    activePreview.type === 'video' ? 'webm' : 'png'
                  }`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải file về máy</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
