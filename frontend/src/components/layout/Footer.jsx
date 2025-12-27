import { Stethoscope, ShieldCheck, HeartPulse, Globe, LifeBuoy, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <Stethoscope size={20} />
              </div>
              <span className="font-black text-xl tracking-tight text-gray-900">
                Pulse<span className="text-blue-600">Net</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              Empowering primary clinics across rural India with GenAI-driven diagnostic assistance. Built for low-bandwidth healthcare environments.
            </p>
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xs bg-blue-50 w-fit px-3 py-1.5 rounded-full">
              <HeartPulse size={14} /> Made for Bharat
            </div>
          </div>

          {/* Column 2: Legal & Guidelines */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-widest">Trust & Legal</h4>
            <ul className="space-y-4 text-sm">
              <li><Link to="/privacy" className="text-gray-500 hover:text-blue-600 transition-colors">Privacy Protocol</Link></li>
              <li><Link to="/guidelines" className="text-gray-500 hover:text-blue-600 transition-colors">Medical Guidelines</Link></li>
              <li><Link to="/terms" className="text-gray-500 hover:text-blue-600 transition-colors">Terms of Use</Link></li>
              <li className="flex items-center gap-2 text-gray-400">
                <ShieldCheck size={16} className="text-green-600" /> ABDM Compliant
              </li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="font-bold text-gray-900 mb-6 text-sm uppercase tracking-widest">Get Help</h4>
            <div className="bg-gray-50 p-5 rounded-3xl space-y-4">
              <div className="flex items-start gap-3">
                <LifeBuoy size={18} className="text-blue-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-gray-900">24/7 Support</p>
                  <p className="text-[11px] text-gray-500">For technical or clinical queries.</p>
                </div>
              </div>
              <Link to="/contact" className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-100 transition-all">
                <Mail size={14} /> Contact Form
              </Link>
            </div>
          </div>
        </div>

        <div className="h-[1px] w-full bg-gray-100 mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[13px] text-gray-400">
          <p>© {currentYear} PulseNet AI. All rights reserved.</p>
          <p className="flex items-center gap-1 italic">
            <Globe size={14} /> Designed for Rural Health Centers in India
          </p>
        </div>
      </div>
    </footer>
  );
}