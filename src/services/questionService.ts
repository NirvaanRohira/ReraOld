import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Question } from '../types';

export const TOPIC_COLLECTIONS = {
  general: 'questions_general',
  't2': 'questions_t2',
  't3': 'questions_t3',
  't4': 'questions_t4',
  't5': 'questions_t5',
  't6': 'questions_t6',
  't7': 'questions_t7',
  't8': 'questions_t8',
  't9': 'questions_t9',
  't10': 'questions_t10'
} as const;

export const TOPIC_NAMES = {
  general: 'General',
  't2': 'Intro to RERA',
  't3': 'MahaRERA - Rules and Regulations',
  't4': 'Understanding MahaRERA Portal',
  't5': 'Real Estate Agent and Responsibilities',
  't6': 'Real Estate Project Registration & Promoters Responsibilities',
  't7': 'Allottees & Their Responsibilities',
  't8': 'Due Diligence before facilitating sale of property',
  't9': 'Sales, Process, Forms & Agreements',
  't10': 'Real Estate Calculations'
} as const;

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function getRandomQuestions(count: number, topic: keyof typeof TOPIC_NAMES = 'general'): Promise<Question[]> {
  try {
    if (!auth.currentUser) {
      throw new Error('Please sign in to access questions');
    }

    const collectionName = TOPIC_COLLECTIONS[topic];
    if (!collectionName) {
      throw new Error(`Invalid topic: ${topic}`);
    }

    const questionsRef = collection(db, collectionName);
    const questionsQuery = query(
      questionsRef,
      where('text', '!=', 'Placeholder question'),
      orderBy('text'),
      limit(count * 2)
    );
    
    const snapshot = await getDocs(questionsQuery);
    
    if (snapshot.empty) {
      throw new Error(`No questions available for ${TOPIC_NAMES[topic]}`);
    }

    const allQuestions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Question));

    const shuffledQuestions = shuffleArray(allQuestions);
    const actualCount = Math.min(count, shuffledQuestions.length);
    
    return shuffledQuestions.slice(0, actualCount);
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    if (error.code === 'permission-denied') {
      throw new Error('Please sign in to access questions');
    }
    throw error;
  }
}