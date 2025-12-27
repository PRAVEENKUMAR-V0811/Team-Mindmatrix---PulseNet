import { Stethoscope, LogOut, ShieldCheck, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../api/supabase';

export default function Header({ session }) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Left Section: Logo + Disclaimer */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <Stethoscope size={22} />
            </div>
            <span className="font-black text-2xl tracking-tight text-gray-900">
              Pulse<span className="text-blue-600">Net</span>
            </span>
          </Link>

          {/* AI Diagnosis Disclaimer */}
          <div className="hidden lg:flex items-center gap-2 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">
            <ShieldCheck size={14} className="text-amber-600" />
            <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
              AI-Assisted Diagnosis • Not a Substitute for Medical Professionals
            </span>
          </div>
        </div>

        {/* Right Section: Auth */}
        <div className="flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-bold text-blue-600 uppercase">
                  Authenticated User
                </span>
                <span className="text-xs font-medium text-gray-500 max-w-[140px] truncate">
                  {session.user.email}
                </span>
              </div>

              <button
                onClick={() => supabase.auth.signOut()}
                className="flex items-center gap-2 text-sm bg-gray-900 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-red-600 transition-all"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
            >
              Login
              <ChevronDown size={14} className="-rotate-90" />
            </Link>
          )}
        </div>

      </div>
    </header>
  );
}
