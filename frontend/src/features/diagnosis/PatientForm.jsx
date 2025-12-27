import { useHealthStore } from '../../store/useHealthStore';
import { User, Activity, Thermometer, Heart, Droplets, Scale } from 'lucide-react';

export default function PatientForm() {
  const { currentPatient, setPatientData, setVitals } = useHealthStore();

  const handleDemographics = (e) => {
    setPatientData({ [e.target.name]: e.target.value });
  };

  const handleVitalChange = (e) => {
    setVitals({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      {/* Section 1: Demographics */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <User size={16} /> Demographics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input 
            name="name" value={currentPatient.name} onChange={handleDemographics}
            type="text" placeholder="Patient Full Name" 
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none"
          />
          <div className="grid grid-cols-2 gap-3">
            <input 
              name="age" value={currentPatient.age} onChange={handleDemographics}
              type="number" placeholder="Age" 
              className="p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-100 outline-none"
            />
            <select 
              name="gender" value={currentPatient.gender} onChange={handleDemographics}
              className="p-3 bg-gray-50 border border-gray-200 rounded-2xl outline-none"
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>
      </div>

      {/* Section 2: Vitals Signs */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity size={16} /> Vital Signs
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <VitalBox 
            label="Temp (°F)" icon={<Thermometer size={16}/>} 
            name="temp" value={currentPatient.vitals.temp} onChange={handleVitalChange} 
          />
          <VitalBox 
            label="BP (sys/dia)" icon={<Droplets size={16}/>} 
            name="bp" value={currentPatient.vitals.bp} onChange={handleVitalChange} 
          />
          <VitalBox 
            label="Pulse (bpm)" icon={<Heart size={16}/>} 
            name="hr" value={currentPatient.vitals.hr} onChange={handleVitalChange} 
          />
          <VitalBox 
            label="Weight (kg)" icon={<Scale size={16}/>} 
            name="weight" value={currentPatient.weight} onChange={handleDemographics} 
          />
        </div>
      </div>

      {/* Section 3: Symptoms */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Clinical Notes & Symptoms</h3>
        <textarea 
          name="symptoms"
          value={currentPatient.symptoms}
          onChange={handleDemographics}
          placeholder="E.g. Fever for 3 days, dry cough, loss of appetite. No history of asthma."
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl min-h-[150px] outline-none focus:ring-2 focus:ring-blue-100"
        />
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
        className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl text-center font-bold text-blue-600 focus:bg-white focus:border-blue-400 outline-none transition-all"
      />
    </div>
  );
}