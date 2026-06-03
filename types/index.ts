// Три режима работы приложения
export type TabMode = "cover-letter" | "job-description" | "resume-analyzer";

// Конфигурация одного таба для рендера навигации
export interface TabConfig {
  id: TabMode;
  label: string;
  description: string;
  icon: string;
}

// Состояния стриминга — управляют UI в компонентах
export type StreamingStatus = "idle" | "loading" | "streaming" | "done" | "error";

// Данные формы Cover Letter Generator
export interface CoverLetterFormData {
  jobDescription: string;
  resume: string;
}

// Данные формы Job Description Writer
export interface JobDescriptionFormData {
  role: string;
  requirements: string;
}

// Данные формы Resume Analyzer
export interface ResumeAnalyzerFormData {
  jobDescription: string;
  resume: string;
}

// Тело запроса к API Route Handler
export interface ClaudeRequestBody {
  mode: TabMode;
  data: CoverLetterFormData | JobDescriptionFormData | ResumeAnalyzerFormData;
}

// Ответ от API при ошибке
export interface ApiErrorResponse {
  error: string;
}
