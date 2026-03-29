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

  // --- SYNC LOGIC (DATABASE SAVE) ---
  const handleSyncAttendance = async () => {
    if (Object.keys(attendance).length === 0) return alert("Pehle attendance mark karein!");
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/attendance/bulk-sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          course: selectedCourse,
          records: attendance // { studentId: 'P'/'A'/'H' }
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Records for ${selectedDate} saved successfully!`);
        setAttendance({});
      }
    } catch (err) {
      alert("Database sync failed. Backend check karein!");
    } finally {
      setLoading(false);
    }
  }

  // --- EXCEL EXPORT LOGIC ---
  const handleExportExcel = () => {
    window.open(`${API_BASE}/api/attendance/export?course=${selectedCourse}&date=${selectedDate}`, '_blank');
  }

  const toggleHoliday = () => {
    const newStatus = !isHolidayMode;
    setIsHolidayMode(newStatus);
    if (newStatus) {
      setIsAttendanceMode(true);
      const holidayData: any = {};
      students.forEach((s: any) => holidayData[s._id] = 'H');
      setAttendance(holidayData);
    } else {
      setAttendance({});
    }
  }

  const handleDragEnd = (info: any, studentId: string) => {
    if (!isAttendanceMode || isHolidayMode) return;
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
              <h1 className="text-2xl font-[1000] text-[#0f172a] uppercase tracking-tighter italic">ADMIN PANEL</h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {isHolidayMode ? "Holiday Logic Active" : "Management Console"}
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
             <button onClick={() => {setIsAttendanceMode(false); setIsHolidayMode(false)}} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${!isAttendanceMode ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>Manage</button>
             <button onClick={() => {setIsAttendanceMode(true); setIsHolidayMode(false)}} className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${isAttendanceMode && !isHolidayMode ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>Attend</button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <button onClick={() => setShowModal(true)} className="flex flex-col items-center justify-center p-6 bg-blue-50 border border-blue-100 rounded-[30px] hover:bg-blue-600 group transition-all">
            <UserPlus className="text-blue-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-blue-600 group-hover:text-white tracking-widest">Add Student</span>
          </button>
          
          <button onClick={handleSyncAttendance} disabled={loading} className="flex flex-col items-center justify-center p-6 bg-emerald-50 border border-emerald-100 rounded-[30px] hover:bg-emerald-600 group transition-all disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin text-emerald-600 mb-2" size={24} /> : <CheckCircle2 className="text-emerald-600 group-hover:text-white mb-2" size={24} />}
            <span className="text-[9px] font-black uppercase text-emerald-600 group-hover:text-white tracking-widest">Sync Records</span>
          </button>

          <button onClick={toggleHoliday} className={`flex flex-col items-center justify-center p-6 rounded-[30px] border transition-all ${isHolidayMode ? "bg-orange-600 border-orange-700 shadow-lg" : "bg-orange-50 border-orange-100 hover:bg-orange-600 group"}`}>
            <CalendarDays className={`${isHolidayMode ? "text-white" : "text-orange-600 group-hover:text-white"} mb-2`} size={24} />
            <span className={`text-[9px] font-black uppercase ${isHolidayMode ? "text-white" : "text-orange-600 group-hover:text-white"} tracking-widest`}>
              {isHolidayMode ? "Clear Holiday" : "Mark Holiday"}
            </span>
          </button>

          <button onClick={handleExportExcel} className="flex flex-col items-center justify-center p-6 bg-slate-50 border border-slate-100 rounded-[30px] hover:bg-slate-900 group transition-all">
            <FileDown className="text-slate-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-slate-600 group-hover:text-white tracking-widest">Export Excel</span>
          </button>
        </div>

        {/* Table Area */}
        <div className={`bg-white rounded-[40px] border shadow-2xl overflow-hidden min-h-[400px] transition-all ${isHolidayMode ? "border-orange-200" : "border-slate-100 shadow-slate-200/50"}`}>
          <div className={`p-6 border-b flex justify-between items-center ${isHolidayMode ? "bg-orange-50/50 border-orange-100" : "bg-slate-50/50 border-slate-50"}`}>
            <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isHolidayMode ? "text-orange-600" : "text-slate-500"}`}>
              {isHolidayMode ? `HOLIDAY CONFIRMATION: ${selectedDate}` : isAttendanceMode ? `DRAG ROWS FOR ${selectedDate}` : `COURSE: ${selectedCourse}`}
            </h2>
            <div className="flex gap-2">
              {courses.slice(0, 3).map(c => (
                <button key={c} onClick={() => setSelectedCourse(c)} className={`px-3 py-1 text-[8px] font-black rounded-full border transition-all ${selectedCourse === c ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-400 border-slate-100"}`}>{c}</button>
              ))}
            </div>
          </div>
          
          <div className="relative overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-50 bg-slate-50/20">
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">SR</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Student Identity</th>
                  <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-right">Action/Status</th>
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
                        ) : isAttendanceMode ? (
                          <span className="text-[8px] font-black text-slate-300 animate-pulse uppercase">↑ P | ↓ A</span>
                        ) : (
                          <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[8px] font-black rounded-full uppercase">DB Active</span>
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
