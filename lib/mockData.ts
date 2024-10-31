import { Question } from './types'

export const mockQuestions: Question[] = [
  { id: 1, type: "单词", question: "苹果", answer: "apple", hint: "一种常见的水果", keyPoint: "单词拼写", ability: "记忆能力" },
  { id: 2, type: "单词", question: "平衡", answer: "balance", hint: "一种状态", keyPoint: "单词拼写", ability: "抽象思维" },
  { id: 3, type: "短语", question: "感谢你", answer: "thank you", hint: "表达感激之情", keyPoint: "英语词汇量", ability: "社交能力" },
  { id: 4, type: "短语", question: "推迟", answer: "put off", hint: "表达延后执行", keyPoint: "英语词汇量", ability: "时间管理" },
  { id: 5, type: "句子", question: "今天天气很好", answer: "It is nice today.", hint: "描述天气状况", keyPoint: "英语语法点", ability: "表达能力" },
  { id: 6, type: "句子", question: "你做得很棒", answer: "You did good job.", hint: "描述表现好", keyPoint: "英语语法点", ability: "表达能力" },
  { id: 7, type: "语法", question: "词汇运用：She _____(介绍) me to her best friend yesterday.", answer: "introduced", hint: "一般过去时", keyPoint: "一般过去时", ability: "推理能力" },
  { id: 8, type: "语法", question: "语法填空：I _____(visit) that library before I came back to China.", answer: "had visited", hint: "过去完成时", keyPoint: "过去完成时", ability: "系统思维" },
]