import { AIAnalysisConfig } from './aiTypes';

export const defaultAnalysisConfig: AIAnalysisConfig = {
  errorAnalysis: {
    enabled: true,
    format: "以清晰的要点形式",
    style: "严谨专业",
    prompt: `请分析学生的答题错误，包含以下方面：
1. 错误原因分析（考虑认知误区、知识盲点等）
2. 学生当前对该知识点的掌握程度评估
3. 具体的改进建议`
  },
  guidance: {
    enabled: true,
    format: "以苏格拉底式问答方式",
    style: "耐心幽默",
    prompt: `请设计一段启发式教学对话，通过提问引导学生：
1. 发现自己的错误
2. 理解正确答案
3. 掌握解题思路`
  },
  similarQuestions: {
    enabled: true,
    format: "按照由易到难的顺序编排，每题包含详细解析",
    style: "循序渐进",
    count: 2,
    prompt: `请生成练习题：
1. 难度应该循序渐进
2. 每道题都要有详细的解析
3. 知识点相关性强
4. 注重能力培养`
  },
  keyPointSummary: {
    enabled: true,
    format: "以思维导图的形式",
    style: "系统全面",
    prompt: `请总结本题相关知识点：
1. 核心概念解释
2. 常见误区分析
3. 掌握要点提示
4. 知识点关联`
  },
  abilityImprovement: {
    enabled: true,
    format: "以具体可执行的步骤",
    style: "鼓励积极",
    prompt: `请提供能力提升建议：
1. 针对性训练方法
2. 实践建议
3. 进阶学习路径
4. 学习资源推荐`
  },
};