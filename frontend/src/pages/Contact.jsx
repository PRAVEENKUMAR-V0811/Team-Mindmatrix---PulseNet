import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { Send, Building2, User, MessageCircle } from 'lucide-react';

export default function Contact() {
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);

    // Replace with your EmailJS IDs from their dashboard
    emailjs.sendForm(
      'YOUR_SERVICE_ID', 
      'YOUR_TEMPLATE_ID', 
      form.current, 
      'YOUR_PUBLIC_KEY'
    )
    .then(() => {
      toast.success("Message sent! We'll contact your clinic soon.");
      form.current.reset();
    }, (error) => {
      toast.error("Failed to send message. Please try again.");
      console.log(error.text);
    })
    .finally(() => setLoading(false));
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-black text-gray-900">Contact Support</h2>
        <p className="text-gray-500 mt-2">Connecting rural clinics to technical assistance.</p>
      </div>

      <form ref={form} onSubmit={sendEmail} className="space-y-5 bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
        <div className="relative">
          <User className="absolute left-4 top-4 text-gray-400" size={18} />
          <input type="text" name="user_name" placeholder="Doctor's Name" required 
            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-gray-100 focus:border-blue-500 outline-none" />
        </div>

        <div className="relative">
          <Building2 className="absolute left-4 top-4 text-gray-400" size={18} />
          <input type="text" name="clinic_name" placeholder="Clinic Name & Location" required 
            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-gray-200 focus:border-blue-500 outline-none" />
        </div>

        <div className="relative">
          <MessageCircle className="absolute left-4 top-4 text-gray-400" size={18} />
          <textarea name="message" placeholder="How can we help you?" required 
            className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border border-gray-200 min-h-[150px] focus:border-blue-500 outline-none" />
        </div>

        <button disabled={loading} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all disabled:opacity-50 shadow-lg shadow-blue-100">
          {loading ? "Sending..." : <><Send size={18} /> Send Message</>}
        </button>
      </form>
    </div>
  );
}