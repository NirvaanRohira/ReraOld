import { collection, doc, setDoc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase';

// Helper function to create collections and add initial data
export async function setupFirestoreCollections() {
  const batch = writeBatch(db);
  
  // Create collections for each topic
  const topics = [
    'questions_general',
    'questions_t2',
    'questions_t3',
    'questions_t4',
    'questions_t5',
    'questions_t6',
    'questions_t7',
    'questions_t8',
    'questions_t9',
    'questions_t10'
  ];

  // Create an empty document in each collection to ensure they exist
  for (const topic of topics) {
    const collectionRef = collection(db, topic);
    const docRef = doc(collectionRef, 'placeholder');
    batch.set(docRef, {
      text: 'Placeholder question',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
      explanation: 'This is a placeholder question.',
      createdAt: new Date()
    });
  }

  // Commit the batch
  await batch.commit();
}