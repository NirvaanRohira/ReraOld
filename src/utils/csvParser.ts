import { collection, writeBatch, doc } from 'firebase/firestore';
import { db } from '../firebase';

export async function parseAndUploadQuestions(fileContent: string, topicCollection: string) {
  try {
    const lines = fileContent.split('\n').filter(line => line.trim());
    const batch = writeBatch(db);
    const collectionRef = collection(db, topicCollection);

    for (const line of lines) {
      // Skip header if present
      if (line.startsWith('question/')) continue;

      const [text, optionA, optionB, optionC, optionD, correctOption, explanation] = line.split('/').map(s => s.trim());
      
      // Map correct_option (A, B, C, D) to actual answer text
      const optionMap: Record<string, string> = {
        'A': optionA,
        'B': optionB,
        'C': optionC,
        'D': optionD
      };

      const correctAnswer = optionMap[correctOption];
      
      if (!text || !correctAnswer) {
        console.warn('Skipping invalid line:', line);
        continue;
      }

      const docRef = doc(collectionRef);
      batch.set(docRef, {
        text,
        options: [optionA, optionB, optionC, optionD],
        correctAnswer,
        explanation
      });
    }

    await batch.commit();
    return true;
  } catch (error) {
    console.error('Error parsing and uploading questions:', error);
    throw error;
  }
}