import { AlertTriangle, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ResultView({ results }) {
  // Example data structure from your teammate's backend
  const { diagnosis, confidence, treatments, referralNeeded } = results;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Critical Referral Alert */}
      {referralNeeded && (
        <div className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl flex items-start gap-4 animate-pulse">
          <AlertTriangle className="text-red-600 shrink-0" size={32} />
          <div>
            <h3 className="text-red-800 font-bold text-lg">Specialist Referral Recommended</h3>
            <p className="text-red-600 text-sm">Symptoms indicate potential severity. Please consult a specialist immediately.</p>
          </div>
        </div>
      )}

      {/* Main Diagnosis */}
      <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
        <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Possible Diagnosis</span>
        <h1 className="text-4xl font-black text-gray-900 mt-2">{diagnosis}</h1>
        
        <div className="mt-6">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Confidence Score</span>
            <span className="text-sm font-bold text-gray-900">{confidence}%</span>
          </div>
          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Treatment Plan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle2 className="text-green-500" /> Suggested Steps
          </h3>
          <ul className="space-y-3">
            {treatments.map((step, i) => (
              <li key={i} className="flex gap-3 text-gray-600 text-sm">
                <span className="bg-green-50 text-green-700 font-bold rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}