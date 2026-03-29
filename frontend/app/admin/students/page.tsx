"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Calendar, Play, CheckCircle, Coffee, FileDown, UserPlus, BookOpen, Loader2 } from "lucide-react"
import Link from "next/link"
import AddStudentModal from "../../../components/AddStudentModal";

// --- TYPES & INTERFACES ---
interface Student {
  _id: string;
  srNo: number;
  name: string;
  mobile: string;
  dob: string;
}

type AttendanceStatus = "Present" | "Absent" | "Holiday" | "";

export default function StudentManagement() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedCourse, setSelectedCourse] = useState("B.Sc-I")
  const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({}) 
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isSwipeMode, setIsSwipeMode] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)

  const courses = ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"]
  const API_BASE = "https://college-management-system-ae1l.onrender.com";

  const fetchStudentsAndAttendance = async () => {
    setLoading(true);
    try {
      const resSt = await fetch(`${API_BASE}/api/students/list?course=${selectedCourse}`)
      const dataSt = await resSt.json()
      
      const resAt = await fetch(`${API_BASE}/api/attendance/today/${selectedDate}/${selectedCourse}`)
      const dataAt = await resAt.json()
      
      if (dataSt.success) setStudents(dataSt.students)
      
      if (dataAt.success) {
        const attendanceMap: Record<string, AttendanceStatus> = {}
        dataAt.records.forEach((rec: { studentId: string, status: AttendanceStatus }) => { 
          attendanceMap[rec.studentId] = rec.status 
        })
        setAttendance(attendanceMap)
      } else {
        setAttendance({}) // Reset if no records found for new date
      }
    } catch (err) { 
      console.error("Fetch Error:", err) 
    } finally {
      setLoading(false);
    }
  }

  // Reset indices and fetch when course/date changes
  useEffect(() => { 
    setCurrentIndex(0);
    fetchStudentsAndAttendance();
  }, [selectedDate, selectedCourse])

  const markAttendance = async (studentId: string, status: AttendanceStatus) => {
    try {
      // Optimistic Update
      setAttendance(prev => ({ ...prev, [studentId]: status }))
      
      const res = await fetch(`${API_BASE}/api/attendance/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, date: selectedDate, status, course: selectedCourse })
      })
      const result = await res.json()
      
      if (result.success && isSwipeMode) {
        setCurrentIndex(prev => prev + 1)
      }
    } catch (err) { 
      alert("Attendance marking failed!") 
      fetchStudentsAndAttendance(); // Revert on failure
    }
  }

  // ... (Keep existing downloadReport and markHoliday functions)

  return (
    <div className="min-h-screen bg-[#0a0c14] text-white p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 border-b border-white/10 pb-6 gap-6">
          <h1 className="text-3xl font-bold flex items-center gap-3"><Users className="text-sky-400" /> Management</h1>
          
          <div className="flex flex-wrap justify-center gap-3 bg-black/40 p-2 rounded-2xl border border-white/5">
             <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-sky-500 hover:text-white transition-all">
              <UserPlus size={14}/> Add Student
            </button>
            {/* ... other header buttons ... */}
          </div>
        </div>

        {/* SWIPE OVERLAY (Updated logic for empty student lists) */}
        <AnimatePresence>
          {isSwipeMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#0a0c14] flex items-center justify-center p-6 backdrop-blur-xl">
              <div className="max-w-md w-full text-center">
                <button onClick={() => setIsSwipeMode(false)} className="mb-8 text-red-500 font-bold uppercase tracking-widest text-xs border border-red-500/20 px-4 py-2 rounded-lg hover:bg-red-500/10">Close Mode</button>
                
                {students.length > 0 && currentIndex < students.length ? (
                  <motion.div 
                    key={students[currentIndex]._id} 
                    drag="y" 
                    dragConstraints={{ top: 0, bottom: 0 }}
                    onDragEnd={(e, info) => {
                      if (info.offset.y < -100) markAttendance(students[currentIndex]._id, "Absent")
                      if (info.offset.y > 100) markAttendance(students[currentIndex]._id, "Present")
                    }}
                    className="bg-white/5 border border-white/10 rounded-[40px] p-10 shadow-2xl cursor-grab active:cursor-grabbing"
                  >
                    <div className="text-4xl font-black text-sky-400 mb-4">#{students[currentIndex].srNo}</div>
                    <h2 className="text-2xl font-bold uppercase tracking-tight">{students[currentIndex].name}</h2>
                    <div className="mt-10 flex justify-between text-[10px] text-gray-500 font-black tracking-widest">
                      <span className="text-red-400">↑ SWIPE UP (ABSENT)</span>
                      <span className="text-emerald-400">↓ SWIPE DOWN (PRESENT)</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-10 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                    <CheckCircle className="mx-auto text-emerald-500 mb-4" size={50}/>
                    <h2 className="text-xl font-bold uppercase tracking-widest">Done for {selectedCourse}</h2>
                    <button onClick={() => {setIsSwipeMode(false); setCurrentIndex(0);}} className="mt-6 px-8 py-3 bg-emerald-600 rounded-xl font-black text-xs uppercase tracking-widest">Exit</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COURSE TABS */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          {courses.map(c => (
            <button key={c} onClick={() => setSelectedCourse(c)} className={`px-8 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${selectedCourse === c ? "bg-sky-600 shadow-lg shadow-sky-600/20" : "bg-white/5 text-gray-500 hover:text-white"}`}>{c}</button>
          ))}
        </div>

        {/* DATA TABLE */}
        <div className="bg-white/5 rounded-[32px] border border-white/10 overflow-hidden shadow-2xl relative min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loader2 className="animate-spin text-sky-400" size={32} />
            </div>
          )}
          {/* ... table content same as your code ... */}
        </div>
        
        {/* ... Modal same as your code ... */}
      </div>
    </div>
  )
}
