"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, UserPlus, Loader2, FileDown, 
  CalendarDays, BookOpen, ArrowLeftRight, CheckCircle2 
} from "lucide-react"
import Link from "next/link"
import AddStudentModal from "../../../components/AddStudentModal";

export default function AdminManagement() {
  const [students, setStudents] = useState([])
  const [selectedCourse, setSelectedCourse] = useState("B.Sc-I")
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // --- ATTENDANCE SWAP STATE ---
  const [isAttendanceMode, setIsAttendanceMode] = useState(false)

  const courses = ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"]
  const API_BASE = "https://college-management-system-ae1l.onrender.com";

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/list?course=${selectedCourse}`)
      const data = await res.json()
      if (data.success) setStudents(data.students)
    } catch (err) { console.error(err) } finally { setLoading(false); }
  }

  useEffect(() => { fetchStudents(); }, [selectedCourse])

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg">
              <Users size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tighter">Admin Panel</h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">System Control Center</p>
            </div>
          </div>
          
          {/* Mode Switcher */}
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
             <button 
                onClick={() => setIsAttendanceMode(false)}
                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!isAttendanceMode ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
             >
                Management
             </button>
             <button 
                onClick={() => setIsAttendanceMode(true)}
                className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isAttendanceMode ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"}`}
             >
                Attendance Mode
             </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button onClick={() => setShowModal(true)} className="flex flex-col items-center justify-center p-6 bg-blue-50 border border-blue-100 rounded-[30px] hover:bg-blue-600 group transition-all">
            <UserPlus className="text-blue-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-blue-600 group-hover:text-white">Add Student</span>
          </button>

          <Link href="/admin/assignments" className="flex flex-col items-center justify-center p-6 bg-emerald-50 border border-emerald-100 rounded-[30px] hover:bg-emerald-600 group transition-all">
            <BookOpen className="text-emerald-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-emerald-600 group-hover:text-white">Assignments</span>
          </Link>

          <button className="flex flex-col items-center justify-center p-6 bg-orange-50 border border-orange-100 rounded-[30px] hover:bg-orange-600 group transition-all">
            <CalendarDays className="text-orange-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-orange-600 group-hover:text-white">Holiday Mode</span>
          </button>

          <button className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-[30px] hover:bg-slate-900 group transition-all">
            <FileDown className="text-slate-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-slate-600 group-hover:text-white">Export Excel</span>
          </button>
        </div>

        {/* Table Area */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="p-6 bg-slate-50/50 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              {isAttendanceMode ? "Marking Attendance" : "Student List"} — {selectedCourse}
            </h2>
            {isAttendanceMode && (
              <button className="bg-blue-600 text-white px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all">
                Submit Attendance
              </button>
            )}
          </div>
          
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/20">
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">SR NO</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Student Name</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">
                  {isAttendanceMode ? "Attendance" : "Status"}
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((s: any) => (
                <tr key={s._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="p-6 font-bold text-blue-600">#{s.srNo}</td>
                  <td className="p-6 font-black text-slate-700 uppercase">{s.name}</td>
                  <td className="p-6 text-right">
                    {isAttendanceMode ? (
                      <div className="flex justify-end gap-2">
                         <button className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all">P</button>
                         <button className="w-8 h-8 rounded-full bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">A</button>
                      </div>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[8px] font-black rounded-full uppercase">Active</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600" /></div>}
        </div>
      </div>

      {/* FIXED MODAL PROPS TO SOLVE BUILD ERROR */}
      {showModal && (
        <AddStudentModal 
          isOpen={showModal} 
          onClose={() => setShowModal(false)} 
          fetchStudents={fetchStudents} 
          course={selectedCourse} 
        />
      )}
    </div>
  )
}
