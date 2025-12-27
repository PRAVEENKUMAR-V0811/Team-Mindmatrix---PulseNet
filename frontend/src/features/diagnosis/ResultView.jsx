import { AlertTriangle, CheckCircle2, Pill, Activity, ShieldAlert, ClipboardList } from 'lucide-react';

export default function ResultView({ results }) {
  const { 
    diagnosis, 
    confidence, 
    treatments, 
    referralNeeded, 
    ageCategory, 
    clinicalNotes, 
    drugInteractions 
  } = results;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-700">
      
      {/* 1. Critical Referral Alert */}
      {referralNeeded && (
        <div className="bg-red-50 border-2 border-red-200 p-5 rounded-[2rem] flex items-start gap-4 shadow-lg shadow-red-50">
          <div className="bg-red-600 p-2 rounded-xl text-white">
            <AlertTriangle size={28} />
          </div>
          <div>
            <h3 className="text-red-900 font-black text-xl">Specialist Referral Recommended</h3>
            <p className="text-red-700 font-medium">Potential severity detected. Please facilitate immediate specialist consultation.</p>
          </div>
        </div>
      )}

      {/* 2. Main Diagnosis Header */}
      <div className="bg-white p-10 rounded-[3rem] shadow-xl shadow-blue-50 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
            <Activity size={120} />
        </div>
        
        <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-widest">
                {ageCategory || "General"} Category
            </span>
            <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest">
                AI Precision: {confidence}%
            </span>
        </div>

        <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">
            {diagnosis}
        </h1>

        <div className="mt-8">
          <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-1000" 
              style={{ width: `${confidence}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 3. Treatment Plan (Medications) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="font-black text-2xl text-gray-800 mb-6 flex items-center gap-3">
              <Pill className="text-blue-500" /> Clinical Management
            </h3>
            <div className="grid gap-4">
              {treatments?.map((t, i) => (
                <div key={i} className="p-5 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg text-blue-900">{t.medication}</h4>
                    <span className="text-xs font-black text-gray-400 uppercase bg-white px-3 py-1 rounded-full border border-gray-100">
                        {t.route}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm font-bold text-gray-600 mb-3">
                    <span className="flex items-center gap-1"><Activity size={14}/> {t.dosage}</span>
                    <span className="flex items-center gap-1"><ClipboardList size={14}/> {t.frequency} for {t.duration}</span>
                  </div>
                  <p className="text-xs text-gray-500 italic bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                    <span className="font-bold text-blue-700">Rationale:</span> {t.ageSpecificRationale}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Clinical Notes */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="font-black text-xl text-gray-800 mb-4 flex items-center gap-3">
              <ClipboardList className="text-indigo-500" /> Physician's Notes
            </h3>
            <p className="text-gray-600 leading-relaxed font-medium bg-indigo-50/30 p-5 rounded-2xl border border-indigo-100/50">
                {clinicalNotes}
            </p>
          </div>
        </div>

        {/* 5. Side Section: Drug Interactions */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <h3 className="font-black text-xl text-gray-800 mb-6 flex items-center gap-3">
              <ShieldAlert className="text-orange-500" /> Safety Analysis
            </h3>
            <div className="space-y-4">
              {drugInteractions?.length > 0 ? drugInteractions.map((risk, i) => (
                <div key={i} className={`p-4 rounded-2xl border ${
                    risk.riskLevel === 'High' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-2 h-2 rounded-full ${risk.riskLevel === 'High' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                    <span className={`text-[10px] font-black uppercase tracking-tighter ${
                        risk.riskLevel === 'High' ? 'text-red-700' : 'text-orange-700'
                    }`}>
                      {risk.riskLevel} Risk: {risk.substances}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-700 leading-tight mb-2">{risk.clinicalExplanation}</p>
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">{risk.recommendation}</p>
                </div>
              )) : (
                <div className="text-center py-6">
                    <CheckCircle2 className="mx-auto text-green-400 mb-2" />
                    <p className="text-xs font-bold text-gray-400">No major interactions detected</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}