"use client"
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { X, UserPlus, Upload, Trash2 } from 'lucide-react';

// 1. Define the Props Interface
interface AddStudentModalProps {
  selectedCourse: string;
  onClose: () => void;
  refreshData: () => void;
}

// 2. Apply the interface to the component
const AddStudentModal: React.FC<AddStudentModalProps> = ({ selectedCourse, onClose, refreshData }) => {
  const [formData, setFormData] = useState({ srNo: "", name: "" });
  const [loading, setLoading] = useState(false);

  // 3. Typed Form Submission
  const handleManualSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/students/sync-students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course: selectedCourse, studentsList: [formData] })
      });
      const data = await res.json();
      if(data.success) {
        setFormData({ srNo: "", name: "" });
        refreshData();
        alert("Success: Student record updated.");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) { alert("Network Error: Failed to reach server."); }
    setLoading(false);
  };

  // 4. Typed File Upload
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; // Added optional chaining for safety
    if(!file) return;
    const data = new FormData();
    data.append("file", file);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/students/import-excel", { method: "POST", body: data });
      const result = await res.json();
      alert(result.message);
      if (result.success) refreshData(); 
    } catch (err) { alert("Error: Excel upload failed."); }
    setLoading(false);
  };

  const handleClearBatch = async () => {
    const pin = prompt(`CRITICAL ACTION: Enter PINCODE to wipe all data for ${selectedCourse}:`);
    if (!pin) return;

    if (confirm(`WARNING: All student records for ${selectedCourse} will be permanently deleted. Do you want to proceed?`)) {
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/api/students/clear-batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ course: selectedCourse, pincode: pin })
        });
        const result = await res.json();
        alert(result.message);
        if (result.success) refreshData();
      } catch (err) { alert("Error: Operation failed."); }
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#11141d] border border-white/10 w-full max-w-md rounded-[40px] p-8 relative shadow-2xl">
        
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors">
          <X size={24}/>
        </button>

        <h2 className="text-2xl font-black mb-1 flex items-center gap-3">
          <UserPlus className="text-sky-400" /> SYNC STUDENT
        </h2>
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-8">
          Target Course: <span className="text-sky-400">{selectedCourse}</span>
        </p>

        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-600 uppercase ml-2">Roll Number / Sr. No</label>
            <input 
              type="number" 
              placeholder="e.g. 101" 
              value={formData.srNo} 
              onChange={(e) => setFormData({...formData, srNo: e.target.value})} 
              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-sky-500/50 transition-all font-bold" 
              required 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-black text-gray-600 uppercase ml-2">Full Student Name</label>
            <input 
              type="text" 
              placeholder="e.g. MOHAMMAD MAAZ" 
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})} 
              className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 outline-none focus:border-sky-500/50 transition-all font-bold uppercase" 
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-sky-600 hover:bg-sky-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : "Sync Record"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
          <div className="relative flex justify-center text-[10px] font-black uppercase"><span className="bg-[#11141d] px-4 text-gray-600">OR BULK SYNC</span></div>
        </div>

        <label className="flex flex-col items-center justify-center gap-3 bg-white/5 border-2 border-dashed border-white/5 p-6 rounded-3xl cursor-pointer hover:bg-white/10 hover:border-emerald-500/30 transition-all group">
          <Upload size={24} className="text-emerald-500 group-hover:scale-110 transition-transform"/>
          <div className="text-center">
            <span className="text-xs font-black uppercase block">Upload Excel Sheet</span>
            <span className="text-[9px] text-gray-600 font-bold uppercase">Auto-syncs records</span>
          </div>
          <input type="file" onChange={handleFileUpload} className="hidden" accept=".xlsx, .xls" />
        </label>

        <div className="mt-8 pt-6 border-t border-white/5">
            <button 
              onClick={handleClearBatch}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-[10px] font-black uppercase text-red-500/50 hover:text-red-500 transition-all"
            >
              <Trash2 size={12}/> Wipe Out Current Batch
            </button>
        </div>

      </div>
    </div>
  );
};

export default AddStudentModal;
