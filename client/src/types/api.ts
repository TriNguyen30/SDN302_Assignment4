export interface ApiResponse<T> {
    data: T;
    error?: string;
    success: boolean;
    message?: string;
}

export interface ApiError {
    error: string;
    code?: string;
    message?: string;
}

export interface User {
    id: string;
    username: string;
}

export interface AuthUser {
    id: string;
    username: string;
    admin?: boolean;
}

export interface QuizRef {
    _id: string;
    title?: string;
    description?: string;
    questions?: string[];
}

export interface Question {
    _id: string;
    text: string;
    options: string[];
    correctAnswerIndex: number;
    quizId: string | QuizRef;
    keywords?: string[];
    author?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface Quiz {
    _id: string;
    title: string;
    description: string;
    questions: Question[];
    createdAt?: string;
    updatedAt?: string;
}