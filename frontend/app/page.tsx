"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { 
  Users, UserPlus, Loader2, FileDown, FileUp, 
  CheckCircle2, Calendar, Trees, LayoutGrid, Home,
  X, ArrowUp, ArrowDown, Trash2, Folder, FileText 
} from "lucide-react"

// ✅ CORRECTED IMPORT PATH (As per your folder structure)
import { AddStudentModal } from "../components/AddStudentModal";

export default function AdminIntegratedManagement() {
  // Toggle between 'files' (Drive) and 'users' (Attendance)
  const [view, setView] = useState<'users' | 'files'>('users')
  
  const [students, setStudents] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState("B.Sc-I")
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [attendanceDone, setAttendanceDone] = useState(false)
  const [isSwipeMode, setIsSwipeMode] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [attendanceSession, setAttendanceSession] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  const courses = ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"]
  const API_BASE = "https://college-management-system-ae1l.onrender.com"

  const y = useMotionValue(0)
  const rotateX = useTransform(y, [-200, 200], [25, -25])
  const opacity = useTransform(y, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0])

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/list?course=${selectedCourse}`)
      const data = await res.json()
      if (data.success) setStudents(data.students);
      else setStudents([]); 
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  }

  useEffect(() => { fetchStudents(); }, [selectedCourse])

  const handleSwipe = (status: "Present" | "Absent") => {
    const currentStudent = students[currentIndex];
    const newEntry = { studentId: currentStudent._id, status: status.toUpperCase() }; 
    const updatedSession = [...attendanceSession, newEntry];
    setAttendanceSession(updatedSession);
    if (currentIndex < students.length - 1) {
      setCurrentIndex(prev => prev + 1);
      y.set(0); 
    } else {
      setIsSwipeMode(false);
      alert("Attendance session completed!");
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      
      {/* --- ORIGINAL HEADER UI --- */}
      <header className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <LayoutGrid size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase italic">Admin Repository</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Digital Academic Control</p>
          </div>
        </div>

        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setView('files')}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'files' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400'}`}
          >
            Files
          </button>
          <button 
            onClick={() => setView('users')}
            className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${view === 'users' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400'}`}
          >
            Users
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        
        {/* --- ACTION BAR --- */}
        <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
          <div className="flex gap-3">
             <button className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-100"><Home size={20}/></button>
             <div className="flex items-center gap-3 bg-slate-50 px-5 rounded-2xl border">
                <Calendar size={14} className="text-blue-600" />
                <input type="date" value={selectedDate} onChange={(e)=>setSelectedDate(e.target.value)} className="bg-transparent border-none outline-none text-[10px] font-black text-blue-600 uppercase" />
             </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-blue-100 hover:scale-105 transition-transform"><UserPlus size={16}/> Add Student</button>
            <button onClick={() => setView('files')} className="bg-white border border-slate-200 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all"><Folder size={16}/> New Folder</button>
          </div>
        </div>

        {view === 'users' ? (
          /* USERS / ATTENDANCE VIEW */
          <div className="space-y-8">
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
              {courses.map(c => (
                <button key={c} onClick={() => setSelectedCourse(c)} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase border transition-all shrink-0 ${selectedCourse === c ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-400"}`}>{c}</button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
               <button onClick={()=>setIsSwipeMode(true)} className="p-6 bg-emerald-50 border border-emerald-100 rounded-[30px] flex flex-col items-center group hover:bg-emerald-600 transition-all">
                  <CheckCircle2 className="text-emerald-600 group-hover:text-white mb-2" size={24}/>
                  <span className="text-[9px] font-black uppercase group-hover:text-white">Start Attendance</span>
               </button>
               <button className="p-6 bg-orange-50 border border-orange-100 rounded-[30px] flex flex-col items-center group hover:bg-orange-600 transition-all">
                  <Trees className="text-orange-600 group-hover:text-white mb-2" size={24}/>
                  <span className="text-[9px] font-black uppercase group-hover:text-white">Mark Holiday</span>
               </button>
               <button className="p-6 bg-slate-50 border rounded-[30px] flex flex-col items-center group hover:bg-slate-900 transition-all">
                  <FileDown className="text-slate-600 group-hover:text-white mb-2" size={24}/>
                  <span className="text-[9px] font-black uppercase group-hover:text-white">Export Excel</span>
               </button>
               <button className="p-6 bg-red-50 border border-red-100 rounded-[30px] flex flex-col items-center group hover:bg-red-600 transition-all">
                  <Trash2 className="text-red-600 group-hover:text-white mb-2" size={24}/>
                  <span className="text-[9px] font-black uppercase group-hover:text-white">Clear Batch</span>
               </button>
            </div>

            <div className="bg-white rounded-[40px] border shadow-sm overflow-hidden min-h-[400px]">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400">Student Info</th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400">Roll No</th>
                      <th className="p-6 text-[10px] font-black uppercase text-slate-400 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students.map((s: any) => (
                      <tr key={s._id} className="hover:bg-slate-50/50 transition-all">
                        <td className="p-6 flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black text-xs">{s.name.charAt(0)}</div>
                          <p className="text-sm font-bold text-slate-800 uppercase tracking-tighter">{s.name}</p>
                        </td>
                        <td className="p-6 text-xs font-bold text-slate-400 italic">#{s.srNo}</td>
                        <td className="p-6 text-right"><span className="text-[8px] font-black uppercase bg-green-50 text-green-600 px-3 py-1 rounded-full">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        ) : (
          /* FILES / DRIVE VIEW */
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {[1, 2, 3, 4, 5].map((f) => (
              <motion.div key={f} whileHover={{ y: -5 }} className="flex flex-col items-center group cursor-pointer">
                <div className="w-20 h-20 bg-blue-50 rounded-[28px] flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-all border border-blue-100">
                  <Folder size={32} />
                </div>
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tighter">Semester {f}</p>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Swipe Overlay remains same as your requested logic */}
      <AnimatePresence>
        {isSwipeMode && students[currentIndex] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6">
            <button onClick={() => setIsSwipeMode(false)} className="absolute top-8 right-8 text-white/50 hover:text-white"><X size={32} /></button>
            <div className="text-center mb-10">
               <h2 className="text-white text-4xl font-black italic uppercase tracking-tighter">{students[currentIndex].name}</h2>
               <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">ROLL NO: {students[currentIndex].srNo}</p>
            </div>
            <motion.div style={{ y, rotateX, opacity }} drag="y" dragConstraints={{ top: 0, bottom: 0 }} onDragEnd={(e, info) => {
                if (info.offset.y < -150) handleSwipe("Present");
                else if (info.offset.y > 150) handleSwipe("Absent");
              }} className="w-80 h-[400px] bg-white rounded-[60px] shadow-2xl flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-10 text-blue-600 font-black text-4xl">{students[currentIndex].name.charAt(0)}</div>
                <div className="flex flex-col gap-4 w-full">
                  <button onClick={() => handleSwipe("Present")} className="w-full py-4 bg-emerald-500 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2"><ArrowUp size={20}/> Swipe Up</button>
                  <button onClick={() => handleSwipe("Absent")} className="w-full py-4 bg-red-500 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2"><ArrowDown size={20}/> Swipe Down</button>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showModal && <AddStudentModal isOpen={showModal} onClose={() => setShowModal(false)} fetchStudents={fetchStudents} course={selectedCourse} />}
    </div>
  )
}
