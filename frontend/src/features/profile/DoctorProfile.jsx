import { useEffect, useState } from 'react';
import apiClient from '../../api/apiClient';
import PatientRecordCard from './PatientRecordCard';
import { RefreshCcw } from 'lucide-react';

// 1. ADD { session } HERE as a prop
export default function DoctorProfile({ session }) { 
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    // 2. Add a safety check to make sure session exists
    if (!session?.user?.email) return;

    setLoading(true);
    try {
        // Use the path /doctor/records (the /api prefix is handled by your apiClient baseURL)
        const res = await apiClient.get(`/doctor/records?email=${session.user.email}`);
        setRecords(res.data);
    } catch (err) {
        console.error("Error fetching history", err);
    } finally {
        setLoading(false);
    }
  };

  // 3. Add session.user.email to the dependency array
  useEffect(() => { 
    fetchHistory(); 
  }, [session?.user?.email]); 

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-gray-800">Diagnostic History</h2>
        <button 
          onClick={fetchHistory} 
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={loading}
        >
          <RefreshCcw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-400">Loading Atlas records...</div>
      ) : records.length === 0 ? (
        <div className="text-center py-10 text-gray-400 bg-white rounded-3xl border border-dashed">
          No records found for {session?.user?.email}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {records.map((rec) => (
            <PatientRecordCard key={rec._id} record={rec} />
          ))}
        </div>
      )}
    </div>
  );
}