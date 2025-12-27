import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { 
  ResumeData, 
  ResumeSettings, 
  DEFAULT_RESUME_DATA, 
  DEFAULT_SETTINGS,
  WorkExperience,
  Education,
  Project,
  Certification,
  Skill,
} from '@/types/resume';
import { 
  saveResume, 
  getResume, 
  getAllResumes, 
  getSettings, 
  saveSettings,
  getCurrentResumeId,
  setCurrentResumeId,
  createNewResume,
} from '@/lib/storage';

interface ResumeState {
  resume: ResumeData;
  settings: ResumeSettings;
  allResumes: ResumeData[];
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  undoStack: ResumeData[];
  redoStack: ResumeData[];
}

type ResumeAction =
  | { type: 'SET_RESUME'; payload: ResumeData }
  | { type: 'UPDATE_RESUME'; payload: Partial<ResumeData> }
  | { type: 'SET_SETTINGS'; payload: ResumeSettings }
  | { type: 'SET_ALL_RESUMES'; payload: ResumeData[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_LAST_SAVED'; payload: Date }
  | { type: 'PUSH_UNDO'; payload: ResumeData }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'ADD_WORK_EXPERIENCE'; payload: WorkExperience }
  | { type: 'UPDATE_WORK_EXPERIENCE'; payload: { id: string; data: Partial<WorkExperience> } }
  | { type: 'DELETE_WORK_EXPERIENCE'; payload: string }
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: { id: string; data: Partial<Education> } }
  | { type: 'DELETE_EDUCATION'; payload: string }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: { id: string; data: Partial<Project> } }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_CERTIFICATION'; payload: Certification }
  | { type: 'UPDATE_CERTIFICATION'; payload: { id: string; data: Partial<Certification> } }
  | { type: 'DELETE_CERTIFICATION'; payload: string }
  | { type: 'ADD_SKILL_CATEGORY'; payload: Skill }
  | { type: 'UPDATE_SKILL_CATEGORY'; payload: { id: string; data: Partial<Skill> } }
  | { type: 'DELETE_SKILL_CATEGORY'; payload: string }
  | { type: 'REORDER_SECTIONS'; payload: string[] };

const initialState: ResumeState = {
  resume: DEFAULT_RESUME_DATA,
  settings: DEFAULT_SETTINGS,
  allResumes: [],
  isLoading: true,
  isSaving: false,
  lastSaved: null,
  undoStack: [],
  redoStack: [],
};

function resumeReducer(state: ResumeState, action: ResumeAction): ResumeState {
  switch (action.type) {
    case 'SET_RESUME':
      return { ...state, resume: action.payload, redoStack: [] };
    
    case 'UPDATE_RESUME':
      return { 
        ...state, 
        resume: { ...state.resume, ...action.payload, updatedAt: new Date() },
        redoStack: [],
      };
    
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    
    case 'SET_ALL_RESUMES':
      return { ...state, allResumes: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
    
    case 'SET_LAST_SAVED':
      return { ...state, lastSaved: action.payload };
    
    case 'PUSH_UNDO':
      return { 
        ...state, 
        undoStack: [...state.undoStack.slice(-19), action.payload],
      };
    
    case 'UNDO':
      if (state.undoStack.length === 0) return state;
      const previousState = state.undoStack[state.undoStack.length - 1];
      return {
        ...state,
        resume: previousState,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, state.resume],
      };
    
    case 'REDO':
      if (state.redoStack.length === 0) return state;
      const nextState = state.redoStack[state.redoStack.length - 1];
      return {
        ...state,
        resume: nextState,
        redoStack: state.redoStack.slice(0, -1),
        undoStack: [...state.undoStack, state.resume],
      };
    
    case 'ADD_WORK_EXPERIENCE':
      return {
        ...state,
        resume: {
          ...state.resume,
          workExperience: [...state.resume.workExperience, action.payload],
          updatedAt: new Date(),
        },
        redoStack: [],
      };
    
    case 'UPDATE_WORK_EXPERIENCE':
      return {
        ...state,
        resume: {
          ...state.resume,
          workExperience: state.resume.workExperience.map(w =>
            w.id === action.payload.id ? { ...w, ...action.payload.data } : w
          ),
          updatedAt: new Date(),
        },
        redoStack: [],
      };
    
    case 'DELETE_WORK_EXPERIENCE':
      return {
        ...state,
        resume: {
          ...state.resume,
          workExperience: state.resume.workExperience.filter(w => w.id !== action.payload),
          updatedAt: new Date(),
        },
        redoStack: [],
      };
    
    case 'ADD_EDUCATION':
      return {
        ...state,
        resume: {
          ...state.resume,
          education: [...state.resume.education, action.payload],
          updatedAt: new Date(),
        },
        redoStack: [],
      };
    
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        resume: {
          ...state.resume,
          education: state.resume.education.map(e =>
            e.id === action.payload.id ? { ...e, ...action.payload.data } : e
          ),
          updatedAt: new Date(),
        },
        redoStack: [],
      };
    
    case 'DELETE_EDUCATION':
      return {
        ...state,
        resume: {
          ...state.resume,
          education: state.resume.education.filter(e => e.id !== action.payload),
          updatedAt: new Date(),
        },
        redoStack: [],
      };
    
    case 'ADD_PROJECT':
      return {
        ...state,
        resume: {
          ...state.resume,
          projects: [...state.resume.projects, action.payload],
          updatedAt: new Date(),
        },
        redoStack: [],
      };
    
    case 'UPDATE_PROJECT':
      return {
        ...state,
        resume: {
          ...state.resume,
          projects: state.resume.projects.map(p =>
            p.id === action.payload.id ? { ...p, ...action.payload.data } : p
          ),
          updatedAt: new Date(),
        },
        redoStack: [],
      };
    
    case 'DELETE_PROJECT':
      return {
        ...state,
        resume: {
          ...state.resume,
          projects: state.resume.projects.filter(p => p.id !== action.payload),
          updatedAt: new Date(),
        },
        redoStack: [],
      };
    
    case 'ADD_CERTIFICATION':
      return {
        ...state,
        resume: {
          ...state.resume,
          certifications: [...state.resume.certifications, action.payload],
          updatedAt: new Date(),
        },
        redoStack: [],
      };
    
    case 'UPDATE_CERTIFICATION':
      return {
        ...state,
        resume: {
          ...state.resume,
          certifications: state.resume.certifications.map(c =>
            c.id === action.payload.id ? { ...c, ...action.payload.data } : c
          ),
          updatedAt: new Date(),
        },
        redoStack: [],
      };
    
    case 'DELETE_CERTIFICATION':
      return {
        ...state,
        resume: {
          ...state.resume,
          certifications: state.resume.certifications.filter(c => c.id !== action.payload),
          updatedAt: new Date(),
        },
        redoStack: [],
      };
    
    case 'ADD_SKILL_CATEGORY':
      return {
        ...state,
        resume: {
          ...state.resume,
          skills: [...state.resume.skills, action.payload],
          updatedAt: new Date(),
        },
        redoStack: [],
      };
    
    case 'UPDATE_SKILL_CATEGORY':
      return {
        ...state,
        resume: {
          ...state.resume,
          skills: state.resume.skills.map(s =>
            s.id === action.payload.id ? { ...s, ...action.payload.data } : s
          ),
          updatedAt: new Date(),
        },
        redoStack: [],
      };
    
    case 'DELETE_SKILL_CATEGORY':
      return {
        ...state,
        resume: {
          ...state.resume,
          skills: state.resume.skills.filter(s => s.id !== action.payload),
          updatedAt: new Date(),
        },
        redoStack: [],
      };
    
    case 'REORDER_SECTIONS':
      return {
        ...state,
        resume: {
          ...state.resume,
          sectionOrder: action.payload,
          updatedAt: new Date(),
        },
        redoStack: [],
      };
    
    default:
      return state;
  }
}

interface ResumeContextType extends ResumeState {
  dispatch: React.Dispatch<ResumeAction>;
  saveCurrentResume: () => Promise<void>;
  loadResume: (id: string) => Promise<void>;
  createNew: () => Promise<void>;
  updateSettings: (settings: Partial<ResumeSettings>) => Promise<void>;
  refreshResumes: () => Promise<void>;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

const ResumeContext = createContext<ResumeContextType | null>(null);

export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(resumeReducer, initialState);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const lastResumeRef = useRef<string>('');

  // Initialize
  useEffect(() => {
    async function init() {
      try {
        const [settings, resumes, currentId] = await Promise.all([
          getSettings(),
          getAllResumes(),
          getCurrentResumeId(),
        ]);

        dispatch({ type: 'SET_SETTINGS', payload: settings });
        dispatch({ type: 'SET_ALL_RESUMES', payload: resumes });

        if (currentId && resumes.find(r => r.id === currentId)) {
          const resume = await getResume(currentId);
          if (resume) {
            dispatch({ type: 'SET_RESUME', payload: resume });
          }
        } else if (resumes.length > 0) {
          dispatch({ type: 'SET_RESUME', payload: resumes[0] });
          await setCurrentResumeId(resumes[0].id);
        } else {
          const newResume = createNewResume();
          await saveResume(newResume);
          dispatch({ type: 'SET_RESUME', payload: newResume });
          dispatch({ type: 'SET_ALL_RESUMES', payload: [newResume] });
          await setCurrentResumeId(newResume.id);
        }
      } catch (error) {
        console.error('Failed to initialize:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    init();
  }, []);

  // Autosave
  useEffect(() => {
    const resumeJson = JSON.stringify(state.resume);
    
    if (lastResumeRef.current && lastResumeRef.current !== resumeJson) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      dispatch({ type: 'SET_SAVING', payload: true });

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          await saveResume(state.resume);
          dispatch({ type: 'SET_LAST_SAVED', payload: new Date() });
          
          const resumes = await getAllResumes();
          dispatch({ type: 'SET_ALL_RESUMES', payload: resumes });
        } catch (error) {
          console.error('Autosave failed:', error);
        } finally {
          dispatch({ type: 'SET_SAVING', payload: false });
        }
      }, 1000);
    }

    lastResumeRef.current = resumeJson;

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [state.resume]);

  const saveCurrentResume = useCallback(async () => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      await saveResume(state.resume);
      dispatch({ type: 'SET_LAST_SAVED', payload: new Date() });
      
      const resumes = await getAllResumes();
      dispatch({ type: 'SET_ALL_RESUMES', payload: resumes });
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  }, [state.resume]);

  const loadResume = useCallback(async (id: string) => {
    const resume = await getResume(id);
    if (resume) {
      dispatch({ type: 'SET_RESUME', payload: resume });
      await setCurrentResumeId(id);
    }
  }, []);

  const createNew = useCallback(async () => {
    const newResume = createNewResume();
    await saveResume(newResume);
    dispatch({ type: 'SET_RESUME', payload: newResume });
    await setCurrentResumeId(newResume.id);
    
    const resumes = await getAllResumes();
    dispatch({ type: 'SET_ALL_RESUMES', payload: resumes });
  }, []);

  const updateSettings = useCallback(async (updates: Partial<ResumeSettings>) => {
    const newSettings = { ...state.settings, ...updates };
    dispatch({ type: 'SET_SETTINGS', payload: newSettings });
    await saveSettings(newSettings);
  }, [state.settings]);

  const refreshResumes = useCallback(async () => {
    const resumes = await getAllResumes();
    dispatch({ type: 'SET_ALL_RESUMES', payload: resumes });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  return (
    <ResumeContext.Provider
      value={{
        ...state,
        dispatch,
        saveCurrentResume,
        loadResume,
        createNew,
        updateSettings,
        refreshResumes,
        canUndo: state.undoStack.length > 0,
        canRedo: state.redoStack.length > 0,
        undo,
        redo,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider');
  }
  return context;
}
