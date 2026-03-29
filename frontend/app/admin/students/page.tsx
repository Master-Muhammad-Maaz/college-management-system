"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, UserPlus, Loader2, FileDown, 
  CalendarDays, BookOpen, CheckCircle2, XCircle, Calendar, PalmTree
} from "lucide-react"
import Link from "next/link"
import AddStudentModal from "../../../components/AddStudentModal";

export default function AdminManagement() {
  const [students, setStudents] = useState([])
  const [selectedCourse, setSelectedCourse] = useState("B.Sc-I")
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isAttendanceMode, setIsAttendanceMode] = useState(false)
  const [isHolidayMode, setIsHolidayMode] = useState(false)
  const [attendance, setAttendance] = useState<Record<string, 'P' | 'A' | 'H'>>({})
  
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

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

  // --- HOLIDAY TOGGLE LOGIC ---
  const toggleHoliday = () => {
    const newStatus = !isHolidayMode;
    setIsHolidayMode(newStatus);
    if (newStatus) {
      setIsAttendanceMode(true);
      // Sabko Holiday 'H' mark kar do
      const holidayData: any = {};
      students.forEach((s: any) => holidayData[s._id] = 'H');
      setAttendance(holidayData);
    } else {
      setAttendance({});
    }
  }

  const handleDragEnd = (info: any, studentId: string) => {
    if (!isAttendanceMode || isHolidayMode) return; // Holiday mode mein swipe off
    const threshold = 50;
    if (info.offset.y < -threshold) setAttendance(prev => ({ ...prev, [studentId]: 'P' }));
    else if (info.offset.y > threshold) setAttendance(prev => ({ ...prev, [studentId]: 'A' }));
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 border-b border-slate-50 pb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl shadow-lg transition-all ${isHolidayMode ? "bg-orange-500 shadow-orange-100" : "bg-blue-600 shadow-blue-100"}`}>
              {isHolidayMode ? <PalmTree size={24} className="text-white" /> : <Users size={24} className="text-white" />}
            </div>
            <div>
              <h1 className="text-2xl font-black text-[#0f172a] uppercase tracking-tighter">Admin Panel</h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {isHolidayMode ? "OFFICIAL HOLIDAY MODE" : isAttendanceMode ? "Swipe: Up (P) | Down (A)" : "System Control Center"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-2.5 px-5 rounded-2xl border border-slate-100 shadow-inner">
            <Calendar size={14} className="text-blue-600" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setAttendance({}); }}
              className="bg-transparent border-none outline-none text-[10px] font-black text-blue-600 uppercase cursor-pointer"
            />
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
             <button onClick={() => {setIsAttendanceMode(false); setIsHolidayMode(false)}} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!isAttendanceMode ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>Management</button>
             <button onClick={() => {setIsAttendanceMode(true); setIsHolidayMode(false)}} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isAttendanceMode && !isHolidayMode ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>Attendance</button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button onClick={() => setShowModal(true)} className="flex flex-col items-center justify-center p-6 bg-blue-50 border border-blue-100 rounded-[30px] hover:bg-blue-600 group transition-all">
            <UserPlus className="text-blue-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-blue-600 group-hover:text-white">Add Student</span>
          </button>
          
          <button onClick={() => alert("Attendance Syncing...")} className="flex flex-col items-center justify-center p-6 bg-emerald-50 border border-emerald-100 rounded-[30px] hover:bg-emerald-600 group transition-all">
            <CheckCircle2 className="text-emerald-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-emerald-600 group-hover:text-white">Sync Records</span>
          </button>

          {/* HOLIDAY MODE BUTTON */}
          <button onClick={toggleHoliday} className={`flex flex-col items-center justify-center p-6 rounded-[30px] border transition-all ${isHolidayMode ? "bg-orange-600 border-orange-700" : "bg-orange-50 border-orange-100 hover:bg-orange-600 group"}`}>
            <CalendarDays className={`${isHolidayMode ? "text-white" : "text-orange-600 group-hover:text-white"} mb-2`} size={24} />
            <span className={`text-[9px] font-black uppercase ${isHolidayMode ? "text-white" : "text-orange-600 group-hover:text-white"}`}>
              {isHolidayMode ? "Exit Holiday" : "Holiday Mode"}
            </span>
          </button>

          <button className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-[30px] hover:bg-slate-900 group transition-all">
            <FileDown className="text-slate-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-slate-600 group-hover:text-white">Export Excel</span>
          </button>
        </div>

        {/* Table Area */}
        <div className={`bg-white rounded-[40px] border shadow-2xl overflow-hidden min-h-[400px] transition-all ${isHolidayMode ? "border-orange-200" : "border-slate-100 shadow-slate-200/50"}`}>
          <div className={`p-6 border-b flex justify-between items-center ${isHolidayMode ? "bg-orange-50/50 border-orange-100" : "bg-slate-50/50 border-slate-50"}`}>
            <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isHolidayMode ? "text-orange-600" : "text-slate-500"}`}>
              {isHolidayMode ? `CONFIRM HOLIDAY FOR ${selectedDate}` : isAttendanceMode ? `Swipe for ${selectedDate}` : "Student List"}
            </h2>
          </div>
          
          <div className="relative">
            {isHolidayMode && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none overflow-hidden">
                <span className="text-[120px] font-black text-orange-600/5 -rotate-12 uppercase">Holiday</span>
              </div>
            )}
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/20">
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">SR NO</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Student Name</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s: any) => (
                  <motion.tr 
                    key={s._id}
                    drag={isAttendanceMode && !isHolidayMode ? "y" : false}
                    dragConstraints={{ top: 0, bottom: 0 }}
                    onDragEnd={(_, info) => handleDragEnd(info, s._id)}
                    className={`border-b border-slate-50 transition-colors ${
                      attendance[s._id] === 'H' ? 'bg-orange-50/50' : 
                      attendance[s._id] === 'P' ? 'bg-emerald-50/50' : 
                      attendance[s._id] === 'A' ? 'bg-red-50/50' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <td className="p-6 font-bold text-blue-600">#{s.srNo}</td>
                    <td className="p-6 font-black text-slate-700 uppercase">{s.name}</td>
                    <td className="p-6 text-right">
                      <div className="flex justify-end items-center gap-3">
                        {attendance[s._id] === 'H' ? (
                          <span className="text-orange-600 text-[10px] font-black uppercase flex items-center gap-1"><PalmTree size={14}/> Holiday</span>
                        ) : attendance[s._id] === 'P' ? (
                          <span className="text-emerald-600 text-[10px] font-black uppercase flex items-center gap-1"><CheckCircle2 size={14}/> Present</span>
                        ) : attendance[s._id] === 'A' ? (
                          <span className="text-red-500 text-[10px] font-black uppercase flex items-center gap-1"><XCircle size={14}/> Absent</span>
                        ) : (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[8px] font-black rounded-full uppercase italic">Tap Attendance</span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <AddStudentModal isOpen={showModal} onClose={() => setShowModal(false)} fetchStudents={fetchStudents} course={selectedCourse} />
      )}
    </div>
  )
}
