import React, { useState, useEffect } from 'react';
import { SidebarTree } from './components/tree/SidebarTree';
import { CourseSelectorScreen } from './components/CourseSelectorScreen';
import { MathGraphStudio } from './components/tools/MathGraphStudio';
import { PhysicsSimulator } from './components/tools/PhysicsSimulator';
import { Chemistry3DStudio } from './components/tools/Chemistry3DStudio';
import { EnglishFlashcardStudio } from './components/tools/EnglishFlashcardStudio';
import { ResourceDetailView } from './components/resources/ResourceDetailView';
import { MediaLibraryModal } from './components/studio/MediaLibraryModal';
import { GeminiLessonAssistant } from './components/studio/GeminiLessonAssistant';
import { CreateResourceModal } from './components/resources/CreateResourceModal';
import { INITIAL_RESOURCES } from './data/mockCurriculum';
import { SubjectId, GradeId, ResourceItem, CapturedMedia } from './types';

export default function App() {
  const STORAGE_RESOURCES = 'giasu_pro_resources_v1';
  const STORAGE_MEDIA = 'giasu_pro_media_v1';

  const [resources, setResources] = useState<ResourceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_RESOURCES);
      return saved ? JSON.parse(saved) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  const [mediaList, setMediaList] = useState<CapturedMedia[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_MEDIA);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [hasChosenCourse, setHasChosenCourse] = useState(false);
  const [activeSubject, setActiveSubject] = useState<SubjectId>('toan');
  const [activeGrade, setActiveGrade] = useState<GradeId>(10);
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);

  const [currentView, setCurrentView] = useState<
    'resource' | 'tool-graph' | 'tool-physics' | 'tool-chemistry' | 'tool-english'
  >('resource');

  const [toolConfig, setToolConfig] = useState<any>(null);

  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RESOURCES, JSON.stringify(resources));
    } catch {
      // Fallback
    }
  }, [resources]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_MEDIA, JSON.stringify(mediaList));
    } catch {
      // Fallback
    }
  }, [mediaList]);

  const handleSaveMedia = (newMedia: CapturedMedia) => {
    setMediaList(prev => [newMedia, ...prev]);
  };

  const handleDeleteMedia = (id: string) => {
    setMediaList(prev => prev.filter(m => m.id !== id));
  };

  const handleConfirmCourse = () => {
    const firstMatch =
      resources.find(r => r.subjectId === activeSubject && r.gradeId === activeGrade) || null;
    setSelectedResource(firstMatch);
    setHasChosenCourse(true);
    setCurrentView('resource');
  };

  const handleChangeCourse = () => {
    setHasChosenCourse(false);
    setCurrentView('resource');
  };

  const handleOpenTool = (
    toolType: 'graph' | 'physics' | 'chemistry' | 'english',
    initialConfig?: any
  ) => {
    setToolConfig(initialConfig);
    switch (toolType) {
      case 'graph':
        setCurrentView('tool-graph');
        break;
      case 'physics':
        setCurrentView('tool-physics');
        break;
      case 'chemistry':
        setCurrentView('tool-chemistry');
        break;
      case 'english':
        setCurrentView('tool-english');
        break;
    }
  };

  const handleSelectResource = (res: ResourceItem) => {
    setSelectedResource(res);
    setCurrentView('resource');
  };

  const handleSaveNewResource = (newRes: ResourceItem) => {
    setResources(prev => [newRes, ...prev]);
    setSelectedResource(newRes);
    setActiveSubject(newRes.subjectId);
    setActiveGrade(newRes.gradeId);
    setHasChosenCourse(true);
    setCurrentView('resource');
  };

  const handleAddResourceFromAI = (aiRes: Partial<ResourceItem>) => {
    const fullRes: ResourceItem = {
      id: `ai-res-${Date.now()}`,
      subjectId: aiRes.subjectId || activeSubject,
      gradeId: aiRes.gradeId || activeGrade,
      type: aiRes.type || 'theory',
      chapter: aiRes.chapter || `Chuyên đề Lớp ${activeGrade}`,
      title: aiRes.title || 'Bài giảng bổ trợ',
      summary: aiRes.summary || '',
      content: aiRes.content || '',
      tags: aiRes.tags || ['Biên soạn'],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setResources(prev => [fullRes, ...prev]);
    setSelectedResource(fullRes);
    setHasChosenCourse(true);
    setCurrentView('resource');
  };

  const handleUpdateTutorNote = (resourceId: string, note: string) => {
    setResources(prev =>
      prev.map(r => (r.id === resourceId ? { ...r, tutorNote: note } : r))
    );
    if (selectedResource && selectedResource.id === resourceId) {
      setSelectedResource(prev => (prev ? { ...prev, tutorNote: note } : null));
    }
  };

  const getActiveStudioMeta = (): {
    toolType: 'graph' | 'physics' | 'chemistry' | 'english';
    view: 'tool-graph' | 'tool-physics' | 'tool-chemistry' | 'tool-english';
    label: string;
  } => {
    switch (activeSubject) {
      case 'toan':
        return { toolType: 'graph', view: 'tool-graph', label: 'Đồ thị Toán' };
      case 'ly':
        return { toolType: 'physics', view: 'tool-physics', label: 'Mô phỏng Lý' };
      case 'hoa':
        return { toolType: 'chemistry', view: 'tool-chemistry', label: 'Phân tử 3D Hóa' };
      case 'anh':
        return { toolType: 'english', view: 'tool-english', label: 'Từ vựng Anh' };
    }
  };

  const activeStudio = getActiveStudioMeta();

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* 3-Zone Top Bar Contract */}
      <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between gap-8 z-30 shrink-0">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={e => {
            e.preventDefault();
            handleChangeCourse();
          }}
          className="text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
        >
          GiaSư Pro
        </a>

        {/* Zone 2: Minimal context-specific links (only shown after picking Grade & Subject) */}
        {hasChosenCourse ? (
          <nav aria-label="Điều hướng chính" className="flex items-center gap-3 sm:gap-6 text-xs sm:text-sm font-medium overflow-x-auto">
            <button
              type="button"
              onClick={() => setCurrentView('resource')}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === 'resource'
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              Danh sách bài học
            </button>

            <button
              type="button"
              onClick={() => handleOpenTool(activeStudio.toolType, selectedResource?.relatedTool?.initialConfig)}
              className={`py-4 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentView === activeStudio.view
                  ? 'border-blue-600 text-blue-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeStudio.label}
            </button>

            <button
              type="button"
              onClick={handleChangeCourse}
              className="py-4 border-b-2 border-transparent text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Đổi lớp / môn
            </button>
          </nav>
        ) : (
          <div />
        )}

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setIsMediaModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-2xs"
          >
            {mediaList.length > 0 ? `Kho tư liệu (${mediaList.length})` : 'Kho tư liệu'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      {!hasChosenCourse ? (
        <CourseSelectorScreen
          selectedGrade={activeGrade}
          selectedSubject={activeSubject}
          onSelectGrade={setActiveGrade}
          onSelectSubject={setActiveSubject}
          onConfirm={handleConfirmCourse}
          resources={resources}
        />
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {currentView === 'resource' && (
            <SidebarTree
              resources={resources}
              selectedResourceId={selectedResource?.id || null}
              onSelectResource={handleSelectResource}
              onAddNewResource={(subject, grade) => {
                setActiveSubject(subject);
                setActiveGrade(grade);
                setIsCreateModalOpen(true);
              }}
              activeSubject={activeSubject}
              activeGrade={activeGrade}
              onChangeCourse={handleChangeCourse}
            />
          )}

          <main className="flex-1 h-full overflow-hidden flex flex-col bg-slate-50">
            {currentView === 'resource' && selectedResource ? (
              <ResourceDetailView
                resource={selectedResource}
                onOpenTool={handleOpenTool}
                onUpdateTutorNote={handleUpdateTutorNote}
                onOpenAIAssistant={(s, g) => {
                  setActiveSubject(s);
                  setActiveGrade(g);
                  setIsAIAssistantOpen(true);
                }}
              />
            ) : currentView === 'resource' ? (
              <div className="flex-1 flex items-center justify-center p-8 text-center">
                <div className="max-w-md space-y-3">
                  <h2 className="text-lg font-bold text-slate-900">
                    Chưa có bài học nào trong mục này
                  </h2>
                  <p className="text-sm text-slate-500">
                    Bạn có thể thêm bài giảng mới ở thanh danh sách bên trái hoặc mở ngay công cụ minh họa ở thanh phía trên.
                  </p>
                </div>
              </div>
            ) : null}

            {currentView === 'tool-graph' && (
              <MathGraphStudio
                initialExpr={toolConfig?.expr || 'x^2 - 4*x + 3'}
                onSaveMedia={handleSaveMedia}
              />
            )}

            {currentView === 'tool-physics' && (
              <PhysicsSimulator
                initialMode={toolConfig?.mode || 'spring'}
                onSaveMedia={handleSaveMedia}
              />
            )}

            {currentView === 'tool-chemistry' && (
              <Chemistry3DStudio
                initialMoleculeId={toolConfig?.moleculeId || 'h2o'}
                onSaveMedia={handleSaveMedia}
              />
            )}

            {currentView === 'tool-english' && (
              <EnglishFlashcardStudio
                initialGrade={activeGrade}
                onSaveMedia={handleSaveMedia}
              />
            )}
          </main>
        </div>
      )}

      {/* Modals */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        mediaList={mediaList}
        onDeleteMedia={handleDeleteMedia}
      />

      <GeminiLessonAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        defaultSubject={activeSubject}
        defaultGrade={activeGrade}
        defaultTopic={selectedResource?.title || ''}
        onAddResourceFromAI={handleAddResourceFromAI}
      />

      <CreateResourceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        defaultSubject={activeSubject}
        defaultGrade={activeGrade}
        onSave={handleSaveNewResource}
      />
    </div>
  );
}
