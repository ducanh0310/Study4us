export type SubjectId = 'toan' | 'ly' | 'hoa' | 'anh';
export type GradeId = 8 | 9 | 10 | 11 | 12;

export interface SubjectInfo {
  id: SubjectId;
  name: string;
  shortName: string;
  icon: string;
  color: string;
  badgeBg: string;
  accentColor: string;
  description: string;
}

export type ResourceType = 'theory' | 'exercise' | 'formula' | 'tool' | 'note';

export interface ResourceItem {
  id: string;
  subjectId: SubjectId;
  gradeId: GradeId;
  title: string;
  type: ResourceType;
  chapter: string;
  summary: string;
  content: string; // Markdown / formatted explanation
  latexFormula?: string;
  tags: string[];
  tutorNote?: string;
  relatedTool?: {
    toolType: 'graph' | 'physics' | 'chemistry' | 'english';
    initialConfig?: any;
  };
  sampleProblems?: Array<{
    question: string;
    options?: string[];
    correctAnswer?: string;
    explanation: string;
  }>;
  updatedAt: string;
}

export interface MoleculeAtom {
  element: string;
  position: [number, number, number];
}

export interface MoleculeBond {
  from: number;
  to: number;
  order: 1 | 2 | 3;
}

export interface MoleculePreset {
  id: string;
  name: string;
  formula: string;
  nameVi: string;
  grade: GradeId;
  category: 'Vô cơ' | 'Hữu cơ' | 'Tinh thể';
  description: string;
  geometry: string;
  atoms: MoleculeAtom[];
  bonds: MoleculeBond[];
}

export interface AtomBohrPreset {
  symbol: string;
  nameVi: string;
  Z: number; // atomic number
  shells: number[]; // e.g., Carbon [2, 4], Oxygen [2, 6], Sodium [2, 8, 1]
  description: string;
}

export interface Flashcard {
  id: string;
  word: string;
  ipa: string;
  partOfSpeech: string;
  vietnameseMeaning: string;
  exampleEn: string;
  exampleVi: string;
  grade: GradeId;
  topic: string;
}

export interface CapturedMedia {
  id: string;
  type: 'image' | 'video';
  title: string;
  subjectId: SubjectId;
  gradeId: GradeId;
  dataUrl: string; // Base64 image or blob url / webm video
  format: string;
  createdAt: string;
  notes?: string;
}
