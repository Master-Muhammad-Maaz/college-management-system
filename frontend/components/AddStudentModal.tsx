"use client"
import { useState, ChangeEvent } from "react"
import { X, Upload, Loader2, UserPlus, Calendar, Phone } from "lucide-react"

export const AddStudentModal = ({ isOpen, onClose, fetchStudents, course }: any) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    srNo: "",
    dob: "", // New Field Added
    mobile: "", // New Field Added
    course: course || "B.Sc-I"
  })

  const API_BASE = "https://college-management-system-ae1l.onrender.com"

  // Check if manual entry has started to hide Bulk Import
  const isManualStarted = formData.name !== "" || formData.srNo !== "" || formData.dob !== "" || formData.mobile !== "";

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

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const data = new FormData()
    data.append("file", file)
    data.append("fallbackCourse", course)

    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/students/import-excel`, { 
        method: "POST", 
        body: data 
      })
      const result = await res.json()
      if (result.success) {
        fetchStudents()
        alert(result.message)
        onClose()
      } else {
        alert(result.message)
      }
    } catch (err) { 
      alert("Excel upload failed. Please check file format.") 
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden border border-slate-100">
        <div className="p-8 border-b flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Add Student</h2>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enrolling for {course}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {/* Excel Import Section - Hidden if manual entry starts */}
          {!isManualStarted && (
            <>
              <div className="mb-8 p-6 bg-blue-50/50 border-2 border-dashed border-blue-100 rounded-[30px] flex flex-col items-center gap-3 transition-all">
                <Upload className="text-blue-600" size={24} />
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase text-blue-600">Bulk Import via Excel</p>
                  <p className="text-[8px] font-bold text-slate-400 mt-1">Files: .xlsx or .xls only</p>
                </div>
                <label className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-xl text-[9px] font-black uppercase cursor-pointer hover:bg-blue-700 transition-all">
                  {loading ? "Processing..." : "Select File"}
                  <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} disabled={loading} />
                </label>
              </div>

              <div className="relative flex items-center justify-center mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <span className="relative bg-white px-4 text-[9px] font-black text-slate-300 uppercase italic">Or Manual Entry</span>
              </div>
            </>
          )}

          {/* Manual Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
               <div className="col-span-2">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Full Name</label>
                <input 
                  type="text" required
                  className="w-full mt-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Enter Student Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})}
                />
              </div>
              
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

              <div className="col-span-2">
                <label className="text-[9px] font-black uppercase text-slate-400 ml-2">Date of Birth</label>
                <input 
                  type="date" required
                  className="w-full mt-1 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  value={formData.dob}
                  onChange={(e) => setFormData({...formData, dob: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" disabled={loading}
              className="w-full mt-2 bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <><UserPlus size={16} /> Save Student</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
