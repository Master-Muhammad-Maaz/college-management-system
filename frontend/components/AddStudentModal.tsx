//testing
"use client"
import { useState } from "react"
import { X, Loader2, UserPlus } from "lucide-react"

export const AddStudentModal = ({ isOpen, onClose, fetchStudents, course }: any) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    srNo: "",
    dob: "",
    mobile: "",
    course: course || "B.Sc-I"
  })

  const API_BASE = "https://college-management-system-ae1l.onrender.com"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/students/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        alert("Student Added Successfully!")
        setFormData({ name: "", srNo: "", dob: "", mobile: "", course: course || "B.Sc-I" })
        fetchStudents()
        onClose()
      } else {
        alert(data.message)
      }
    } catch (err) {
      alert("Server error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 text-slate-900">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Add Student</h2>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Manual Enrollment: {course}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Full Name</label>
              <input 
                type="text" required
                className="w-full mt-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                placeholder="Enter Student Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* SR Number */}
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">SR Number</label>
                <input 
                  type="text" required
                  className="w-full mt-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="e.g. 101"
                  value={formData.srNo}
                  onChange={(e) => setFormData({...formData, srNo: e.target.value})}
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Mobile Number</label>
                <input 
                  type="tel" required
                  className="w-full mt-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="10 Digits"
                  value={formData.mobile}
                  onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                />
              </div>
            </div>

            {/* Date of Birth */}
            <div>
              <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Date of Birth</label>
              <input 
                type="date" required
                className="w-full mt-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                value={formData.dob}
                onChange={(e) => setFormData({...formData, dob: e.target.value})}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" disabled={loading}
              className="w-full mt-4 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <><UserPlus size={16} /> Save Student</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
