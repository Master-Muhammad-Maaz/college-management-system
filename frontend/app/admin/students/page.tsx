"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { 
  Users, UserPlus, Loader2, FileDown, 
  CheckCircle2, Calendar, Trees, 
  X, ArrowUp, ArrowDown, Trash2 
} from "lucide-react"
import { AddStudentModal } from "../../../components/AddStudentModal";

export default function AdminManagement() {
  const [students, setStudents] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState("B.Sc-I")
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [attendanceDone, setAttendanceDone] = useState(false)
  const [isSwipeMode, setIsSwipeMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attendanceSession, setAttendanceSession] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const courses = ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"]
  const API_BASE = "https://college-management-system-ae1l.onrender.com";

  // Motion Values for Swipe Logic
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [25, -25]);
  const opacity = useTransform(y, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const checkAttendanceStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/attendance/today/${selectedDate}/${selectedCourse}`);
      const data = await res.json();
      setAttendanceDone(data.success && data.records.length > 0);
    } catch (err) { console.error(err); }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/list?course=${selectedCourse}`)
      const data = await res.json()
      if (data.success) setStudents(data.students);
      await checkAttendanceStatus();
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  }

  useEffect(() => {
    fetchStudents();
  }, [selectedCourse, selectedDate]);

  const handleHolidayMode = async () => {
    if (attendanceDone) return alert("Attendance or Holiday already marked for this date!");
    if (!confirm(`Are you sure today is a Holiday for ${selectedCourse}?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/attendance/holiday-mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, course: selectedCourse })
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Holiday Marked Successfully!");
        fetchStudents();
      }
    } catch (err) { alert("Error marking holiday"); }
    finally { setLoading(false); }
  };

  const handleClearBatch = async () => {
    const pin = prompt(`⚠️ DANGER: This will delete ALL Students & Attendance for ${selectedCourse}. Enter PIN (1234) to confirm:`);
    if (pin !== "1234") return pin === null ? null : alert("Incorrect PIN! Action Cancelled.");
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/clear-batch-full`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course: selectedCourse, pincode: pin })
      });
      const data = await res.json();
      if (data.success) {
        alert(`🗑️ ${selectedCourse} has been completely cleared!`);
        fetchStudents();
      }
    } catch (err) { alert("Error clearing records"); }
    finally { setLoading(false); }
  };

  const handleExport = () => {
    window.open(`${API_BASE}/api/attendance/export?course=${selectedCourse}`, "_blank");
  };

  const startAttendance = () => {
    if (attendanceDone) return alert("Attendance already marked for this date!");
    if (students.length === 0) return alert("No students in this class!");
    setCurrentIndex(0);
    setAttendanceSession([]);
    setIsSwipeMode(true);
  };

  const handleSwipe = (status: "Present" | "Absent") => {
    const currentStudent = students[currentIndex];
    const newEntry = { studentId: currentStudent._id, name: currentStudent.name, status };
    const updatedSession = [...attendanceSession, newEntry];
    setAttendanceSession(updatedSession);

    if (currentIndex < students.length - 1) {
      setCurrentIndex(prev => prev + 1);
      y.set(0); 
    } else {
      setIsSwipeMode(false);
      submitAttendance(updatedSession);
    }
  };

  const submitAttendance = async (finalData: any[]) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/attendance/swipe-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, course: selectedCourse, attendanceData: finalData })
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ Attendance Done for ${selectedCourse}`);
        fetchStudents();
      }
    } catch (err) { alert("Error submitting attendance"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-10 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 border-b pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl shadow-lg bg-blue-600">
              <Users size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">ADMIN PANEL</h1>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{selectedCourse} Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-2.5 px-5 rounded-2xl border shadow-inner">
            <Calendar size={14} className="text-blue-600" />
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent border-none outline-none text-[10px] font-black text-blue-600 uppercase" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <button onClick={() => setShowModal(true)} className="flex flex-col items-center justify-center p-6 bg-blue-50 border rounded-[30px] hover:bg-blue-600 group transition-all">
            <UserPlus className="text-blue-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-blue-600 group-hover:text-white">Add Student</span>
          </button>
          
          <button onClick={startAttendance} className={`flex flex-col items-center justify-center p-6 border rounded-[30px] transition-all group ${attendanceDone ? "bg-slate-100 cursor-not-allowed" : "bg-emerald-50 hover:bg-emerald-600"}`}>
             <CheckCircle2 className={`${attendanceDone ? "text-slate-400" : "text-emerald-600 group-hover:text-white"} mb-2`} size={24} />
            <span className={`text-[9px] font-black uppercase ${attendanceDone ? "text-slate-400" : "text-emerald-600 group-hover:text-white"}`}>
              {attendanceDone ? "Attendance Done ✅" : "Start Attendance"}
            </span>
          </button>

          <button onClick={handleHolidayMode} className="flex flex-col items-center justify-center p-6 bg-orange-50 border rounded-[30px] hover:bg-orange-600 group transition-all">
            <Trees className="text-orange-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-orange-600 group-hover:text-white">Holiday Mode</span>
          </button>

          <button onClick={handleExport} className="flex flex-col items-center justify-center p-6 bg-slate-50 border rounded-[30px] hover:bg-slate-900 group transition-all">
            <FileDown className="text-slate-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-slate-600 group-hover:text-white">Export Excel</span>
          </button>

          <button onClick={handleClearBatch} className="flex flex-col items-center justify-center p-6 bg-red-50 border rounded-[30px] hover:bg-red-600 group transition-all">
            <Trash2 className="text-red-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-red-600 group-hover:text-white">Clear Batch</span>
          </button>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          {courses.map(c => (
            <button key={c} onClick={() => setSelectedCourse(c)} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase border transition-all shrink-0 ${selectedCourse === c ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-white text-slate-400"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[40px] border shadow-2xl overflow-hidden min-h-[400px] relative">
            <div className="p-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class Strength: {students.length} Students</p>
                <div className="overflow-x-auto">
                  <table className="w-full mt-6 text-left border-collapse">
                    <thead>
                      <tr className="border-b">
                        <th className="p-4 text-[9px] font-black uppercase text-slate-400">SR</th>
                        <th className="p-4 text-[9px] font-black uppercase text-slate-400">Name</th>
                        <th className="p-4 text-[9px] font-black uppercase text-slate-400 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((s: any) => (
                        <tr key={s._id} className="border-b hover:bg-slate-50 transition-colors">
                          <td className="p-4 font-bold text-blue-600 text-[11px]">#{s.srNo}</td>
                          <td className="p-4 font-black text-slate-700 text-[11px] uppercase tracking-tighter">{s.name}</td>
                          <td className="p-4 text-right">
                            <span className="text-[8px] font-black uppercase bg-slate-100 px-3 py-1 rounded-full text-slate-400 italic">Registered</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
            </div>
          {loading && <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex justify-center items-center z-50"><Loader2 className="animate-spin text-blue-600" size={40} /></div>}
        </div>
      </div>

      <AnimatePresence>
        {isSwipeMode && students[currentIndex] && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6"
          >
              <button onClick={() => setIsSwipeMode(false)} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
                <X size={32} />
              </button>

              <div className="text-center mb-10">
                 <motion.h2 
                   key={students[currentIndex]._id + "-name"}
                   initial={{ y: -20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   className="text-white text-4xl font-black italic uppercase tracking-tighter"
                 >
                   {students[currentIndex].name}
                 </motion.h2>
                 <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mt-2">ROLL NO: {students[currentIndex].srNo}</p>
              </div>

              <div className="relative w-80 h-[450px]">
                <motion.div
                  key={students[currentIndex]._id}
                  drag="y"
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.8}
                  onDragEnd={(e, info) => {
                    if (info.offset.y < -150) handleSwipe("Present");
                    else if (info.offset.y > 150) handleSwipe("Absent");
                  }}
                  style={{ y, rotateX, opacity }}
                  whileDrag={{ scale: 1.05 }}
                  initial={{ scale: 0.8, opacity: 0, y: 100 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ 
                    y: attendanceSession[attendanceSession.length-1]?.status === "Present" ? -600 : 600, 
                    opacity: 0, 
                    transition: { duration: 0.4 } 
                  }}
                  className="w-full h-full bg-white rounded-[60px] shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-10 text-center border-[6px] border-white relative overflow-hidden"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-slate-100 rounded-full flex items-center justify-center mb-10 shadow-inner">
                    <span className="text-blue-600 font-black text-4xl">{students[currentIndex].name.charAt(0)}</span>
                  </div>

                  <div className="flex flex-col gap-4 w-full">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSwipe("Present")} 
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transition-colors"
                    >
                      <motion.div animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <ArrowUp size={20}/>
                      </motion.div>
                      Swipe Up (Present)
                    </motion.button>

                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSwipe("Absent")} 
                      className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 transition-colors"
                    >
                      <motion.div animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                        <ArrowDown size={20}/>
                      </motion.div>
                      Swipe Down (Absent)
                    </motion.button>
                  </div>

                  <p className="mt-8 text-slate-300 font-black text-[9px] uppercase tracking-widest">Hold & Drag Card to Mark</p>
                </motion.div>
              </div>

              <div className="mt-12 flex flex-col items-center gap-3">
                <p className="text-white/30 font-black text-[12px] uppercase tracking-[0.4em]">Progress: {currentIndex + 1} / {students.length}</p>
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-blue-500" 
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / students.length) * 100}%` }}
                  />
                </div>
              </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showModal && <AddStudentModal isOpen={showModal} onClose={() => setShowModal(false)} fetchStudents={fetchStudents} course={selectedCourse} />}
    </div>
  )
}
