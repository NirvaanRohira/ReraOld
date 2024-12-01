import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useQuizStore } from '../store';
import { uploadQuestionsFromCSV } from '../services/questionService';
import toast from 'react-hot-toast';

export function FileUpload() {
  const { isDarkMode } = useQuizStore();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file?.type === 'text/csv') {
      try {
        await uploadQuestionsFromCSV(file);
        toast.success('Questions uploaded successfully!');
      } catch (error) {
        toast.error('Error uploading questions');
        console.error('Error:', error);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
    },
    multiple: false,
  });

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-dark-hover'
            : 'border-gray-300 hover:border-blue-400 dark:border-dark-border dark:hover:border-blue-400'
        } ${isDarkMode ? 'dark:bg-dark-card' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} />
        <p className={`text-lg ${isDarkMode ? 'text-dark-text' : 'text-gray-600'}`}>
          {isDragActive
            ? 'Drop the CSV file here...'
            : 'Drag & drop a CSV file here, or click to select'}
        </p>
        <p className={`text-sm mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Upload your question bank in CSV format
        </p>
      </div>

      <div className={`mt-6 text-sm ${isDarkMode ? 'text-dark-text' : 'text-gray-600'}`}>
        <p className="font-semibold mb-2">Expected CSV format:</p>
        <pre className={`${isDarkMode ? 'bg-dark-hover' : 'bg-gray-50'} p-4 rounded-lg overflow-x-auto`}>
{`question,optionA,optionB,optionC,optionD,correctOption,explanation
"What is RERA?","Option A","Option B","Option C","Option D","A","Explanation here..."
`}</pre>
      </div>
    </div>
  );
}