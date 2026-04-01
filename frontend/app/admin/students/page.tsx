"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { 
  Users, UserPlus, Loader2, FileDown, 
  CalendarDays, CheckCircle2, Calendar, Trees, Upload,
  FolderPlus, Folder, ChevronRight, FileText, X, Check, ArrowUp, ArrowDown
} from "lucide-react"
import { AddStudentModal } from "../../../components/AddStudentModal";

export default function AdminManagement() {
  const [students, setStudents] = useState<any[]>([])
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([])
  const [selectedCourse, setSelectedCourse] = useState("B.Sc-I")
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isHolidayMode, setIsHolidayMode] = useState(false)
  const [isRepositoryMode, setIsRepositoryMode] = useState(false) 
  
  // --- SWIPE ATTENDANCE STATES ---
  const [isSwipeMode, setIsSwipeMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attendanceSession, setAttendanceSession] = useState<any[]>([]);
  
  const [currentFolder, setCurrentFolder] = useState<any>(null) 
  const [path, setPath] = useState<any[]>([]) 
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const courses = ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"]
  const API_BASE = "https://college-management-system-ae1l.onrender.com";

  const fetchDriveContent = async () => {
    setLoading(true);
    try {
      const folderId = currentFolder?._id || "root";
      const res = await fetch(`${API_BASE}/api/assignments/content/${selectedCourse}/${folderId}`);
      const data = await res.json();
      if (data.success) { setFolders(data.folders || []); setFiles(data.files || []); }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/list?course=${selectedCourse}`)
      const data = await res.json()
      if (data.success) setStudents(data.students);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  }

  useEffect(() => {
    if (isRepositoryMode) fetchDriveContent();
    else fetchStudents();
  }, [selectedCourse, currentFolder, isRepositoryMode]);

  const openFolder = (folder: any) => { setPath([...path, folder]); setCurrentFolder(folder); };
  const goToPath = (index: number) => {
    if (index === -1) { setPath([]); setCurrentFolder(null); } 
    else { const newPath = path.slice(0, index + 1); setPath(newPath); setCurrentFolder(newPath[newPath.length - 1]); }
  };

  // --- ATTENDANCE SWIPE LOGIC ---
  const startAttendance = () => {
    if (students.length === 0) return alert("No students in this class!");
    setCurrentIndex(0);
    setAttendanceSession([]);
    setIsSwipeMode(true);
  };

  const handleSwipe = (status: "Present" | "Absent") => {
    const currentStudent = students[currentIndex];
    const newEntry = { studentId: currentStudent._id, name: currentStudent.name, status };
    
    setAttendanceSession(prev => [...prev, newEntry]);

    if (currentIndex < students.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      // Last Student Reached - Auto Submit logic can be here or show summary
      setIsSwipeMode(false);
      submitAttendance([...attendanceSession, newEntry]);
    }
  };

  const submitAttendance = async (finalData: any[]) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/attendance/swipe-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: selectedDate,
          course: selectedCourse,
          attendanceData: finalData
        })
      });
      const data = await res.json();
      if (data.success) alert(`✅ Attendance Done for ${selectedCourse}`);
    } catch (err) { alert("Error submitting attendance"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-10 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 border-b pb-8">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl shadow-lg ${isHolidayMode ? "bg-orange-500" : "bg-blue-600"}`}>
              {isHolidayMode ? <Trees size={24} className="text-white" /> : <Users size={24} className="text-white" />}
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter italic text-slate-900">ADMIN PANEL</h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{selectedCourse} Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 px-5 rounded-2xl border shadow-inner">
            <Calendar size={14} className="text-blue-600" />
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent border-none outline-none text-[10px] font-black text-blue-600 uppercase" />
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <button onClick={() => setShowModal(true)} className="flex flex-col items-center justify-center p-6 bg-blue-50 border rounded-[30px] hover:bg-blue-600 group transition-all">
            <UserPlus className="text-blue-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-blue-600 group-hover:text-white">Add Student</span>
          </button>
          
          {/* SYNC RECORDS transformed to START ATTENDANCE */}
          <button onClick={startAttendance} className="flex flex-col items-center justify-center p-6 bg-emerald-50 border rounded-[30px] hover:bg-emerald-600 group transition-all">
             <CheckCircle2 className="text-emerald-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-emerald-600 group-hover:text-white">Start Attendance</span>
          </button>

          <button onClick={() => setIsHolidayMode(!isHolidayMode)} className="flex flex-col items-center justify-center p-6 bg-orange-50 border rounded-[30px] hover:bg-orange-600 group transition-all">
            <CalendarDays className="text-orange-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-orange-600 group-hover:text-white">Holiday Mode</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-slate-50 border rounded-[30px] hover:bg-slate-900 group transition-all">
            <FileDown className="text-slate-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-slate-600 group-hover:text-white">Export</span>
          </button>
          <button 
            onClick={() => setIsRepositoryMode(!isRepositoryMode)} 
            className={`flex flex-col items-center justify-center p-6 border rounded-[30px] transition-all ${isRepositoryMode ? "bg-indigo-600 text-white shadow-xl scale-105" : "bg-indigo-50 hover:bg-indigo-600 group"}`}
          >
            <FolderPlus className={`${isRepositoryMode ? "text-white" : "text-indigo-600 group-hover:text-white"} mb-2`} size={24} />
            <span className="text-[9px] font-black uppercase">E-Repository</span>
          </button>
        </div>

        {/* Course Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          {courses.map(c => (
            <button key={c} onClick={() => { setSelectedCourse(c); setCurrentFolder(null); setPath([]); }} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase border transition-all ${selectedCourse === c ? "bg-blue-600 text-white" : "bg-white text-slate-400"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-[40px] border shadow-2xl overflow-hidden min-h-[500px] relative">
          {/* ... Repository Mode Logic Remains Same ... */}
          {isRepositoryMode ? (
            <div className="p-8">
               {/* Repository Content (From your existing code) */}
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <div className="flex items-center gap-2 bg-slate-50 p-2 px-4 rounded-2xl border">
                  <button onClick={() => goToPath(-1)} className={`text-[9px] font-black uppercase ${!currentFolder ? 'text-indigo-600' : 'text-slate-400'}`}>Repository</button>
                  {path.map((p, i) => (
                    <div key={p._id} className="flex items-center gap-2">
                      <ChevronRight size={12} className="text-slate-300" />
                      <button onClick={() => goToPath(i)} className={`text-[9px] font-black uppercase ${i === path.length - 1 ? 'text-indigo-600' : 'text-slate-400'}`}>{p.name}</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {folders.map((f: any) => (
                   <div key={f._id} onClick={() => openFolder(f)} className="p-6 bg-slate-50 rounded-[35px] flex flex-col items-center cursor-pointer hover:bg-indigo-50 transition-all">
                      <Folder size={32} className="text-indigo-600 mb-2" />
                      <span className="text-[10px] font-black uppercase">{f.name}</span>
                   </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8">
                <p className="text-[10px] font-black text-slate-400 uppercase">Student Attendance List</p>
                <table className="w-full mt-6 text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="p-4 text-[9px] font-black uppercase text-slate-400">SR</th>
                      <th className="p-4 text-[9px] font-black uppercase text-slate-400">Name</th>
                      <th className="p-4 text-[9px] font-black uppercase text-slate-400 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s: any) => (
                      <tr key={s._id} className="border-b hover:bg-slate-50 transition-colors">
                        <td className="p-4 font-bold text-blue-600 text-[11px]">#{s.srNo}</td>
                        <td className="p-4 font-black text-slate-700 text-[11px] uppercase tracking-tighter">{s.name}</td>
                        <td className="p-4 text-right">
                          <span className="text-[8px] font-black uppercase bg-slate-100 px-3 py-1 rounded-full text-slate-400 italic">Pending</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          )}
          {loading && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex justify-center items-center z-50"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>}
        </div>
      </div>

      {/* SWIPE OVERLAY MODAL */}
      <AnimatePresence>
        {isSwipeMode && students[currentIndex] && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-xl flex flex-col items-center justify-center p-6"
          >
             <button onClick={() => setIsSwipeMode(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                <X size={32} />
             </button>

             <div className="text-center mb-12">
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-2">Marking Attendance</p>
                <h2 className="text-white text-3xl font-black italic uppercase">{selectedCourse}</h2>
                <div className="mt-4 flex gap-1 justify-center">
                   {students.map((_, i) => (
                      <div key={i} className={`h-1 w-4 rounded-full transition-all ${i === currentIndex ? "bg-white w-8" : i < currentIndex ? "bg-emerald-500" : "bg-white/10"}`} />
                   ))}
                </div>
             </div>

             {/* TINDER CARD ANIMATION */}
             <div className="swipe-card-container">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={students[currentIndex]._id}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    onDragEnd={(e, info) => {
                      if (info.offset.y < -100) handleSwipe("Present");
                      else if (info.offset.y > 100) handleSwipe("Absent");
                    }}
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -200, transition: { duration: 0.2 } }}
                    className="swipe-card bg-white rounded-[50px] shadow-2xl p-10 flex flex-col items-center justify-center text-center border-4 border-white"
                  >
                     <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6 text-blue-600 font-black text-2xl">
                        {students[currentIndex].name.charAt(0)}
                     </div>
                     <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">
                        {students[currentIndex].name}
                     </h3>
                     <p className="text-slate-400 font-bold text-[12px]">ROLL NO: #{students[currentIndex].srNo}</p>
                     
                     <div className="mt-12 flex flex-col gap-8 opacity-30">
                        <div className="flex items-center gap-3 text-emerald-500 font-black text-[10px] uppercase tracking-widest">
                           <ArrowUp size={20} className="animate-bounce" /> Swipe Up for Present
                        </div>
                        <div className="flex items-center gap-3 text-red-500 font-black text-[10px] uppercase tracking-widest">
                           <ArrowDown size={20} className="animate-bounce" /> Swipe Down for Absent
                        </div>
                     </div>
                  </motion.div>
                </AnimatePresence>
             </div>
             
             <p className="mt-10 text-white/20 font-black text-[11px] uppercase tracking-widest">
                Student {currentIndex + 1} of {students.length}
             </p>
          </motion.div>
        )}
      </AnimatePresence>

      {showModal && <AddStudentModal isOpen={showModal} onClose={() => setShowModal(false)} fetchStudents={fetchStudents} course={selectedCourse} />}
    </div>
  )
}
