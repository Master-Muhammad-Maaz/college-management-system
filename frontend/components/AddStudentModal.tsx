"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { X, UserPlus, Upload, Trash2, Loader2 } from 'lucide-react';

interface AddStudentModalProps {
  isOpen: boolean;       // Dashboard se match karne ke liye
  onClose: () => void;
  fetchStudents: () => void; // Dashboard mein yahi naam hai
  course: string;        // Dashboard mein 'course' naam se pass ho raha hai
}

const AddStudentModal: React.FC<AddStudentModalProps> = ({ isOpen, onClose, fetchStudents, course }) => {
  const [formData, setFormData] = useState({ 
    srNo: "", 
    name: "", 
    mobile: "", 
    dob: "" 
  });
  const [loading, setLoading] = useState(false);

  const API_BASE = "https://college-management-system-ae1l.onrender.com";

  if (!isOpen) return null; // Modal close hone par kuch render nahi karega

  const handleManualSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!formData.mobile || !formData.dob) {
      alert("Please fill Mobile and Date of Birth!");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, course })
      });
      const data = await res.json();
      if(data.success) {
        setFormData({ srNo: "", name: "", mobile: "", dob: "" });
        fetchStudents();
        onClose();
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) { alert("Network Error!"); }
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
      if (result.success) fetchStudents(); 
      alert(result.message);
    } catch (err) { alert("Excel upload failed."); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[50px] p-12 relative shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto no-scrollbar">
        
        <button onClick={onClose} className="absolute top-10 right-10 text-slate-300 hover:text-slate-600 transition-colors">
          <X size={24}/>
        </button>

        <div className="mb-10">
          <h2 className="text-3xl font-black text-[#0f172a] tracking-tighter flex items-center gap-3">
            <UserPlus className="text-blue-600" size={32} /> ADD STUDENT
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
            Target Course: <span className="text-blue-600">{course}</span>
          </p>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Roll Number</label>
              <input type="number" placeholder="101" value={formData.srNo} onChange={(e) => setFormData({...formData, srNo: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 outline-none focus:border-blue-600 font-bold transition-all" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Birth Date</label>
              <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 outline-none focus:border-blue-600 font-bold text-slate-400 transition-all" required />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Student Full Name</label>
            <input type="text" placeholder="ENTER NAME" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 outline-none focus:border-blue-600 font-bold uppercase transition-all" required />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase ml-2 tracking-widest">Contact Number</label>
            <input type="text" placeholder="91XXXXXXXX" value={formData.mobile} onChange={(e) => setFormData({...formData, mobile: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 outline-none focus:border-blue-600 font-bold transition-all" required />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-6 rounded-2xl font-black text-[11px] text-white uppercase tracking-widest transition-all shadow-xl shadow-blue-100 flex items-center justify-center gap-3">
            {loading ? <Loader2 className="animate-spin" size={18}/> : "Save Student Record"}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-[9px] font-black uppercase tracking-[0.3em]"><span className="bg-white px-6 text-slate-300">Quick Actions</span></div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col items-center justify-center gap-3 bg-slate-50 border border-slate-100 p-6 rounded-3xl cursor-pointer hover:bg-blue-50 hover:border-blue-100 transition-all group">
            <Upload size={20} className="text-blue-600 group-hover:scale-110 transition-transform"/>
            <span className="text-[9px] font-black uppercase text-slate-500">Excel Import</span>
            <input type="file" onChange={handleFileUpload} className="hidden" accept=".xlsx, .xls" />
          </label>

          <button className="flex flex-col items-center justify-center gap-3 bg-red-50/30 border border-red-50 p-6 rounded-3xl hover:bg-red-50 transition-all group">
            <Trash2 size={20} className="text-red-400 group-hover:scale-110 transition-transform"/>
            <span className="text-[9px] font-black uppercase text-red-400">Clear Batch</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStudentModal;
