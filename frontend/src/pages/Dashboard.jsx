import { useState } from 'react';
import PatientForm from '../features/diagnosis/PatientForm';
import ResultView from '../features/diagnosis/ResultView';
import apiClient from '../api/apiClient';

export default function Dashboard() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDiagnose = async (formData) => {
    setLoading(true);
    try {
      // Connects to your teammate's backend
      const response = await apiClient.post('/analyze', formData);
      setResults(response.data);
    } catch (err) {
      alert("Error connecting to AI Backend. Using demo results for now.");
      // Demo response for your development
      setResults({
        diagnosis: "Possible Dengue Fever",
        confidence: 82,
        referralNeeded: true,
        treatments: ["Stay hydrated", "Monitor platelet count", "Take Paracetamol for fever", "Avoid Aspirin"]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Diagnosis Center</h1>
            <p className="text-gray-500 font-medium">Rural Health Management System</p>
          </div>
          {results && (
            <button 
              onClick={() => setResults(null)}
              className="bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-blue-600 hover:bg-blue-50"
            >
              + New Patient
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium animate-pulse">AI is analyzing symptoms...</p>
          </div>
        ) : !results ? (
          <PatientForm onSubmit={handleDiagnose} />
        ) : (
          <ResultView results={results} />
        )}
      </div>
    </div>
  );
}