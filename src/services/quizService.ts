import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Question } from '../types';

export const TOPIC_NAMES = {
  'general': 'General',
  'intro-rera': 'Intro to RERA',
  'maharera-rules': 'MahaRERA - Rules and Regulations',
  'maharera-portal': 'Understanding MahaRERA Portal',
  'agent-responsibilities': 'Real Estate Agent and Responsibilities',
  'project-registration': 'Real Estate Project Registration & Promoters Responsibilities',
  'allottee-responsibilities': 'Allottees & Their Responsibilities',
  'due-diligence': 'Due Diligence before facilitating sale of property',
  'sales-process': 'Sales, Process, Forms & Agreements',
  'calculations': 'Real Estate Calculations'
} as const;

// Fisher-Yates shuffle algorithm
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
    // Query the original 'questions' collection for general topic
    const questionsRef = collection(db, topic === 'general' ? 'questions' : `questions_${topic}`);
    const questionsQuery = query(questionsRef, orderBy('text'), limit(count * 2));
    const snapshot = await getDocs(questionsQuery);
    
    if (snapshot.empty) {
      if (topic === 'general') {
        throw new Error('No questions available in the general question bank');
      } else {
        throw new Error(`Questions for ${TOPIC_NAMES[topic]} are coming soon!`);
      }
    }

    const allQuestions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Question));

    // Use Fisher-Yates shuffle for true randomization
    const shuffledQuestions = shuffleArray(allQuestions);
    
    // Ensure we don't try to take more questions than available
    const actualCount = Math.min(count, shuffledQuestions.length);
    
    // Take the first 'count' questions from the shuffled array
    return shuffledQuestions.slice(0, actualCount);
  } catch (error) {
    console.error('Error fetching questions:', error);
    throw error;
  }
}