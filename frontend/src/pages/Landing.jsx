import { Shield, Languages, Zap, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight">
          AI Diagnosis for <span className="text-blue-600">Rural Health Centers</span>
        </h1>
        <p className="mt-6 text-xl text-gray-600 leading-relaxed">
          Assisting village doctors with instant symptom analysis, drug interaction checks, and specialist referral alerts in Indian languages.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link to="/auth" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl text-lg shadow-xl shadow-blue-200 hover:scale-105 transition-transform">
            Start Diagnostic Tool
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="bg-gray-50 py-20 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Languages className="text-blue-600" />} 
            title="Multilingual" 
            desc="Supports Hindi, Tamil, Telugu, and Bengali for patient-doctor clarity."
          />
          <FeatureCard 
            icon={<Zap className="text-orange-500" />} 
            title="Low Internet Ready" 
            desc="Engineered to work on 2G/3G speeds common in remote clinics."
          />
          <FeatureCard 
            icon={<Shield className="text-green-600" />} 
            title="Privacy First" 
            desc="Patient data is encrypted and follows Indian health privacy guidelines."
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="bg-gray-50 w-14 h-14 rounded-2xl flex items-center justify-center mb-6">{icon}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-500">{desc}</p>
    </div>
  );
}