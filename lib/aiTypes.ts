export interface AnalysisModuleConfig {
  enabled: boolean;
  format: string;
  style: string;
  count?: number;
  prompt?: string; // 自定义 prompt
}

export interface AIAnalysisConfig {
  errorAnalysis: AnalysisModuleConfig;
  guidance: AnalysisModuleConfig;
  similarQuestions: AnalysisModuleConfig;
  keyPointSummary: AnalysisModuleConfig;
  abilityImprovement: AnalysisModuleConfig;
}

export interface AIAnalysisResult {
  errorAnalysis?: string;
  guidance?: string;
  similarQuestions?: string;
  keyPointSummary?: string;
  abilityImprovement?: string;
}