import { useHealthStore } from '../../store/useHealthStore';
import { User, Activity, Thermometer, Heart, Droplets, Scale, Sparkles, ArrowRight } from 'lucide-react';

export default function PatientForm({ onSubmit }) { // 1. Added onSubmit prop
  const { currentPatient, setPatientData, setVitals } = useHealthStore();

  const handleDemographics = (e) => {
    setPatientData({ [e.target.name]: e.target.value });
  };

  const handleVitalChange = (e) => {
    setVitals({ [e.target.name]: e.target.value });
  };

  // Basic validation to ensure name and symptoms are present
  const isFormValid = currentPatient.name.trim() && currentPatient.symptoms.trim();

  return (
    <div className="space-y-6 pb-10">
      {/* Section 1: Demographics */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <User size={16} className="text-blue-500" /> Demographics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            name="name" value={currentPatient.name} onChange={handleDemographics}
            type="text" placeholder="Patient Full Name" 
            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all"
          />
          <div className="grid grid-cols-2 gap-3">
            <input 
              name="age" value={currentPatient.age} onChange={handleDemographics}
              type="number" placeholder="Age" 
              className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all"
            />
            <select 
              name="gender" value={currentPatient.gender} onChange={handleDemographics}
              className="p-3.5 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-50 transition-all cursor-pointer"
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Vitals Signs */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity size={16} className="text-red-500" /> Vital Signs
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <VitalBox 
            label="Temp (°F)" icon={<Thermometer size={14}/>} 
            name="temp" value={currentPatient.vitals.temp} onChange={handleVitalChange} 
          />
          <VitalBox 
            label="BP (sys/dia)" icon={<Droplets size={14}/>} 
            name="bp" value={currentPatient.vitals.bp} onChange={handleVitalChange} 
          />
          <VitalBox 
            label="Pulse (bpm)" icon={<Heart size={14}/>} 
            name="hr" value={currentPatient.vitals.hr} onChange={handleVitalChange} 
          />
          <VitalBox 
            label="Weight (kg)" icon={<Scale size={14}/>} 
            name="weight" value={currentPatient.weight} onChange={handleDemographics} 
          />
        </div>
      </div>

      {/* Section 3: Symptoms */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
           Symptoms & Clinical Notes
        </h3>
        <textarea 
          name="symptoms"
          value={currentPatient.symptoms}
          onChange={handleDemographics}
          placeholder="Describe symptoms in detail (e.g., Fever for 3 days, dry cough, loss of appetite...)"
          className="w-full p-5 bg-gray-50 border border-gray-200 rounded-2xl min-h-[160px] outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all resize-none"
        />
      </div>

      {/* 2. SUBMIT BUTTON SECTION */}
      <div className="flex flex-col items-center pt-4">
        <button
          onClick={() => onSubmit(currentPatient)}
          disabled={!isFormValid}
          className={`
            group relative flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-white transition-all duration-300
            ${isFormValid 
              ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-[0_10px_25px_rgba(79,70,229,0.4)] hover:-translate-y-1 active:scale-95' 
              : 'bg-gray-300 cursor-not-allowed'}
          `}
        >
          <Sparkles size={20} className={isFormValid ? "animate-pulse" : ""} />
          <span>Generate AI Diagnosis</span>
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </button>
        {!isFormValid && (
          <p className="text-xs text-gray-400 mt-3 font-medium">
            Please enter patient name and symptoms to proceed
          </p>
        )}
      </div>
    </div>
  );
}

function VitalBox({ label, icon, name, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-gray-500 flex items-center gap-1 ml-1">
        {icon} {label}
      </label>
      <input 
        name={name} value={value} onChange={onChange}
        type="text" 
        className="w-full p-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-center font-bold text-blue-600 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-50 outline-none transition-all"
      />
    </div>
  );
}