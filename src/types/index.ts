// TypeScript type definitions

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: LessonContent;
  order: number;
}

export interface LessonContent {
  text?: string;
  video?: string;
  gif?: string;
  code?: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  tags: string[];
  testCases: TestCase[];
  constraints: string[];
}

export interface TestCase {
  input: any;
  output: any;
  explanation?: string;
}

export interface Contest {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  problems: Problem[];
  participants: number;
}

export interface Submission {
  id: string;
  userId: string;
  problemId: string;
  code: string;
  language: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}
