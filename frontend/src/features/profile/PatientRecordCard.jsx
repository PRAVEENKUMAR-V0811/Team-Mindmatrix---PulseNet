import { Calendar, ChevronRight } from 'lucide-react';

export default function PatientRecordCard({ record }) {
  // 1. Extract data safely using the actual keys from your MongoDB (patient_info and diagnosis_result)
  const patient = record.patient_info?.patient;
  const diagnosis = record.diagnosis_result;
  const date = record.timestamp;

  // 2. Added safety check to prevent the "undefined" crash
  if (!patient || !diagnosis) {
    return null; // Skip rendering if data is corrupted
  }

  return (
    <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:border-blue-200 transition-all group">
      <div className="flex gap-4 items-center">
        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl uppercase">
          {/* Use charAt to safely get the first letter */}
          {patient.name?.charAt(0) || '?'}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{patient.name}</h4>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <Calendar size={12} /> 
            {date ? new Date(date).toLocaleDateString() : 'N/A'}
          </p>
        </div>
      </div>
      
      <div className="text-right flex items-center gap-6">
        <div>
          <div className="text-sm font-bold text-indigo-600">
            {diagnosis.diagnosis}
          </div>
          <div className="text-[10px] uppercase font-black tracking-widest text-gray-300">
            AI Diagnosis ({diagnosis.confidence}%)
          </div>
        </div>
        <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
}