"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { X, UserPlus, Upload, Trash2 } from 'lucide-react';

interface AddStudentModalProps {
  selectedCourse: string;
  onClose: () => void;
  refreshData: () => void;
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ selectedCourse, onClose, refreshData }) => {
  // FIX: Added mobile and dob to state
  const [formData, setFormData] = useState({ 
    srNo: "", 
    name: "", 
    mobile: "", 
    dob: "" 
  });
  const [loading, setLoading] = useState(false);

  // Use your Render URL
  const API_BASE = "https://college-management-system-ae1l.onrender.com";

  const handleManualSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.mobile || !formData.dob) {
      alert("Please fill Mobile and Date of Birth!");
      return;
    }
    
    setLoading(true);
    try {
      // FIX: Using the '/add' route we created in studentRoutes.js for cleaner logic
      const res = await fetch(`${API_BASE}/api/students/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          course: selectedCourse 
        })
      });
      const data = await res.json();
      if(data.success) {
        setFormData({ srNo: "", name: "", mobile: "", dob: "" });
        refreshData();
        alert("Success: Student record saved.");
        onClose();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) { alert("Network Error: Failed to reach server."); }
    setLoading(false);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if(!file) return;
    const data = new FormData();
    data.append("file", file);
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/import-excel`, { method: "POST", body: data });
      const result = await res.json();
      alert(result.message);
      if (result.success) refreshData(); 
    } catch (err) { alert("Error: Excel upload failed."); }
    setLoading(false);
  };

  const handleClearBatch = async () => {
    const pin = prompt(`CRITICAL ACTION: Enter PINCODE to wipe data for ${selectedCourse}:`);
    if (!pin) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/clear-batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course: selectedCourse, pincode: pin })
      });
      const result = await res.json();
      alert(result.message);
      if (result.success) refreshData();
    } catch (err) { alert("Error: Operation failed."); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#11141d] border border-white/10 w-full max-w-md rounded-[40px] p-8 relative shadow-2xl max-h-[90vh] overflow-y-auto">
        
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
          <X size={24}/>
        </button>

        <h2 className="text-2xl font-black mb-1 flex items-center gap-3">
          <UserPlus className="text-sky-400" /> ADD STUDENT
        </h2>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">
          Course: <span className="text-sky-400">{selectedCourse}</span>
        </p>

        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-600 uppercase ml-2">Roll No</label>
              <input type="number" placeholder="101" value={formData.srNo} onChange={(e) => setFormData({...formData, srNo: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-sky-500 font-bold" required />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-gray-600 uppercase ml-2">DOB</label>
              <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-sky-500 font-bold text-gray-400" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-600 uppercase ml-2">Full Name</label>
            <input type="text" placeholder="MOHAMMAD MAAZ" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-sky-500 font-bold uppercase" required />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-600 uppercase ml-2">Mobile Number</label>
            <input type="text" placeholder="98XXXXXXXX" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-sky-500 font-bold" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-sky-600 hover:bg-sky-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2">
            {loading ? "Saving..." : "Save Record"}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <div className="relative flex justify-center text-[10px] font-black uppercase"><span className="bg-[#11141d] px-4 text-gray-600">OR</span></div>
        </div>

        <label className="flex flex-col items-center justify-center gap-3 bg-white/5 border-2 border-dashed border-white/5 p-5 rounded-3xl cursor-pointer hover:bg-white/10 transition-all group">
          <Upload size={20} className="text-emerald-500 group-hover:scale-110 transition-transform"/>
          <div className="text-center">
            <span className="text-xs font-black uppercase block">Bulk Import Excel</span>
          </div>
          <input type="file" onChange={handleFileUpload} className="hidden" accept=".xlsx, .xls" />
        </label>

        <button onClick={handleClearBatch} disabled={loading} className="mt-6 w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase text-red-500/40 hover:text-red-500 transition-all">
          <Trash2 size={12}/> Clear All Student Data
        </button>

      </div>
    </div>
  );
};

export default AddStudentModal;
