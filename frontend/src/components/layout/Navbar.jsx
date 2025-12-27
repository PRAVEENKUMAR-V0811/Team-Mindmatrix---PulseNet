import { useHealthStore } from '../../store/useHealthStore';
import { Globe, LogOut } from 'lucide-react';
import { supabase } from '../../api/supabase';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'ta', name: 'தமிழ்' }
];

export default function Navbar() {
  const { language, setLanguage } = useHealthStore();

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-sm border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <div className="text-white font-bold text-xl">✚</div>
        </div>
        <span className="font-bold text-gray-800 hidden md:block">RuralHealth AI</span>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
          <Globe size={16} className="text-gray-500" />
          <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-sm font-medium outline-none cursor-pointer"
          >
            {languages.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.name}</option>
            ))}
          </select>
        </div>
        <button 
          onClick={() => supabase.auth.signOut()}
          className="p-2 text-gray-500 hover:text-red-600 transition-colors"
        >
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}