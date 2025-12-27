import { useState } from 'react';
import PatientForm from '../features/diagnosis/PatientForm';
import ResultView from '../features/diagnosis/ResultView';
import DoctorProfile from '../features/profile/DoctorProfile';
import apiClient from '../api/apiClient';
import { toast } from 'react-hot-toast';
import { LayoutDashboard, History, PlusCircle, User as UserIcon } from 'lucide-react';

export default function Dashboard({ session }) {
  // Tabs: 'diagnose' or 'profile'
  const [activeTab, setActiveTab] = useState('diagnose');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleDiagnose = async (formData) => {
  // 1. Correct the path to 'bp' from the Zustand store structure
  const bloodPressure = formData.vitals?.bp;

  if (!bloodPressure || !bloodPressure.includes('/')) {
    toast.error("Please enter Blood Pressure in '120/80' format");
    return;
  }

  setLoading(true);

  try {
    const [sys, dia] = bloodPressure.split('/').map(Number);

    // 2. Map the payload to match your Zustand keys (name, temp, hr)
    const payload = {
      language: "en",
      patient: {
        name: formData.name,       // Changed from fullName
        age: Number(formData.age),
        gender: (formData.gender || "other").toLowerCase(),
        weight: Number(formData.weight)
      },
      vitals: {
        temperature: Number(formData.vitals.temp), // Changed from formData.temperature
        bp: {
          systolic: sys,
          diastolic: dia
        },
        pulse: Number(formData.vitals.hr)          // Changed from formData.pulse
      },
      symptoms: formData.symptoms,
      doctorId: session.user.id,
      doctorEmail: session.user.email
    };

    console.log("Sending payload to Backend:", payload);

    const response = await apiClient.post('/analyze', payload);
    setResults(response.data);
    toast.success("Diagnosis generated successfully");

  } catch (err) {
    console.error("Diagnosis Error:", err.response?.data || err.message);
    const errorMsg = err.response?.data?.detail?.[0]?.msg || "Unable to process diagnosis";
    toast.error(errorMsg);
  } finally {
    setLoading(false);
  }
};


  const resetDiagnosis = () => {
    setResults(null);
    setActiveTab('diagnose');
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Secondary Navigation Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex gap-8">
            <button 
              onClick={() => setActiveTab('diagnose')}
              className={`py-4 flex items-center gap-2 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'diagnose' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <LayoutDashboard size={18} />
              Diagnosis Center
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`py-4 flex items-center gap-2 text-sm font-bold border-b-2 transition-all ${
                activeTab === 'profile' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <History size={18} />
              Doctor Profile & History
            </button>
          </div>

          <div className="hidden md:flex items-center gap-3 py-2 px-4 bg-gray-50 rounded-full border border-gray-100">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
              {session.user.email[0].toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase leading-none">Logged in as</span>
              <span className="text-xs font-bold text-gray-700">{session.user.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dynamic Title Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              {activeTab === 'diagnose' ? 'AI Diagnostic Suite' : 'Medical Records Vault'}
            </h1>
            <p className="text-gray-500 font-medium">
              {activeTab === 'diagnose' 
                ? 'Fill in patient details for precision AI analysis.' 
                : 'Review past patient encounters and stored diagnoses.'}
            </p>
          </div>
          
          {results && activeTab === 'diagnose' && (
            <button 
              onClick={resetDiagnosis}
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
              <PlusCircle size={18} />
              New Patient
            </button>
          )}
        </div>

        {/* Tab Content Logic */}
        <div className="transition-all duration-300">
          {activeTab === 'profile' ? (
            <DoctorProfile session={session} />
          ) : (
            <>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LayoutDashboard size={20} className="text-blue-600" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-bold text-gray-800">Analyzing Symptoms</h3>
                  <p className="mt-2 text-gray-500 font-medium animate-pulse">Syncing with PulseNet AI & MongoDB Atlas...</p>
                </div>
              ) : !results ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <PatientForm onSubmit={handleDiagnose} />
                </div>
              ) : (
                <div className="animate-in zoom-in-95 duration-400">
                  <ResultView results={results} />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}