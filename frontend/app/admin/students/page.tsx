"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Calendar, Save, UploadCloud, Loader2, Play, CheckCircle, Coffee, FileDown, UserPlus, BookOpen } from "lucide-react"
import Link from "next/link"
// Naya Modal Import
import AddStudentModal from "../../../components/AddStudentModal";

export default function StudentManagement() {
  const [students, setStudents] = useState([])
  const [selectedCourse, setSelectedCourse] = useState("B.Sc-I")
  const [attendance, setAttendance] = useState({}) 
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [isSwipeMode, setIsSwipeMode] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showModal, setShowModal] = useState(false) // Modal control state

  const courses = ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"]

  const fetchStudentsAndAttendance = async () => {
    try {
      const resSt = await fetch(`http://localhost:5000/api/students/list?course=${selectedCourse}`)
      const dataSt = await resSt.json()
      if (dataSt.success) setStudents(dataSt.students)

      const resAt = await fetch(`http://localhost:5000/api/attendance/today/${selectedDate}/${selectedCourse}`)
      const dataAt = await resAt.json()
      if (dataAt.success) {
        const attendanceMap = {}
        dataAt.records.forEach(rec => { attendanceMap[rec.studentId] = rec.status })
        setAttendance(attendanceMap)
      }
    } catch (err) { console.error(err) }
  }

  useEffect(() => { fetchStudentsAndAttendance() }, [selectedDate, selectedCourse])

  const markAttendance = async (studentId, status) => {
    try {
      const res = await fetch("http://localhost:5000/api/attendance/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, date: selectedDate, status, course: selectedCourse })
      })
      if ((await res.json()).success) {
        setAttendance(prev => ({ ...prev, [studentId]: status }))
        if (isSwipeMode) setCurrentIndex(prev => prev + 1)
      }
    } catch (err) { alert("Error!") }
  }

  const downloadReport = () => {
    window.open(`http://localhost:5000/api/attendance/export-report/${selectedCourse}`, "_blank");
  }

  const markHoliday = async () => {
    if (!confirm("Mark Holiday?")) return
    await fetch("http://localhost:5000/api/attendance/mark-holiday", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: selectedDate, course: selectedCourse })
    })
    fetchStudentsAndAttendance()
  }

  return (
    <div className="min-h-screen bg-[#0a0c14] text-white p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 border-b border-white/10 pb-6 gap-6">
          <h1 className="text-3xl font-bold flex items-center gap-3"><Users className="text-sky-400" /> Management</h1>
          
          <div className="flex flex-wrap justify-center gap-3 bg-black/40 p-2 rounded-2xl border border-white/5">
            {/* ADD STUDENT BUTTON */}
            <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-sky-500 hover:text-white transition-all">
              <UserPlus size={14}/> Add Student
            </button>

            {/* NEW: ASSIGNMENTS BUTTON */}
            <Link href="/admin/assignments" className="px-4 py-2 bg-purple-600/10 text-purple-400 border border-purple-500/20 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-purple-600 hover:text-white transition-all">
              <BookOpen size={14}/> Assignments
            </Link>

            <button onClick={() => setIsSwipeMode(true)} className="px-4 py-2 bg-emerald-600 rounded-xl text-xs font-bold flex items-center gap-2 hover:opacity-80 transition-all"><Play size={14}/> Swipe Mode</button>
            <button onClick={markHoliday} className="px-4 py-2 bg-amber-600/20 text-amber-500 rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-amber-600 hover:text-white transition-all"><Coffee size={14}/> Holiday</button>
            <button onClick={downloadReport} className="px-4 py-2 bg-sky-600 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-sky-500/20 hover:opacity-80 transition-all"><FileDown size={14}/> Download Report</button>
          </div>
        </div>

        {/* SWIPE OVERLAY Logic */}
        <AnimatePresence>
          {isSwipeMode && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-[#0a0c14] flex items-center justify-center p-6">
              <div className="max-w-md w-full text-center">
                <button onClick={() => setIsSwipeMode(false)} className="mb-8 text-red-500 font-bold uppercase tracking-widest text-xs border border-red-500/20 px-4 py-2 rounded-lg">Close Mode</button>
                {currentIndex < students.length ? (
                  <motion.div 
                    key={students[currentIndex]._id} drag="y" dragConstraints={{ top: 0, bottom: 0 }}
                    onDragEnd={(e, info) => {
                      if (info.offset.y < -100) markAttendance(students[currentIndex]._id, "Absent")
                      if (info.offset.y > 100) markAttendance(students[currentIndex]._id, "Present")
                    }}
                    className="bg-white/5 border border-white/10 rounded-[40px] p-10 shadow-2xl"
                  >
                    <div className="text-4xl font-black text-sky-400 mb-4">{students[currentIndex].srNo}</div>
                    <h2 className="text-2xl font-bold uppercase tracking-tight">{students[currentIndex].name}</h2>
                    <div className="mt-10 flex justify-between text-[10px] text-gray-500 font-black tracking-widest">
                      <span>↑ SWIPE UP (ABSENT)</span>
                      <span>↓ SWIPE DOWN (PRESENT)</span>
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-10 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                    <CheckCircle className="mx-auto text-emerald-500 mb-4" size={50}/>
                    <h2 className="text-xl font-bold uppercase tracking-widest">Attendance Completed!</h2>
                    <button onClick={() => {setIsSwipeMode(false); setCurrentIndex(0);}} className="mt-6 px-8 py-3 bg-emerald-600 rounded-xl font-black text-xs uppercase tracking-widest">Finish Process</button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COURSE TABS */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          {courses.map(c => (
            <button key={c} onClick={() => setSelectedCourse(c)} className={`px-8 py-3 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${selectedCourse === c ? "bg-sky-600 shadow-lg shadow-sky-600/20" : "bg-white/5 text-gray-500 hover:text-white"}`}>{c}</button>
          ))}
        </div>

        {/* DATA TABLE */}
        <div className="bg-white/5 rounded-[32px] border border-white/10 overflow-hidden shadow-2xl">
          <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/2">
             <div className="flex items-center gap-2">
                <Calendar size={16} className="text-sky-400" />
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-transparent text-sky-400 font-bold outline-none cursor-pointer text-sm" />
             </div>
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest bg-black/30 px-3 py-1.5 rounded-lg border border-white/5">Students: {students.length}</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/2 text-[10px] text-gray-500 uppercase font-black tracking-[0.15em]">
                <tr>
                  <th className="p-5">Roll</th>
                  <th className="p-5">Name</th>
                  <th className="p-5 text-center">Mark Attendance</th>
                  <th className="p-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {students.map(st => (
                  <tr key={st._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-5 font-bold text-sky-400">{st.srNo}</td>
                    <td className="p-5 font-bold uppercase text-xs tracking-tight">{st.name}</td>
                    <td className="p-5">
                      <div className="flex justify-center gap-3">
                        <button onClick={() => markAttendance(st._id, "Present")} className={`w-11 h-11 rounded-2xl font-black text-xs transition-all shadow-sm ${attendance[st._id] === "Present" ? "bg-emerald-500 shadow-emerald-500/20 scale-105" : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"}`}>P</button>
                        <button onClick={() => markAttendance(st._id, "Absent")} className={`w-11 h-11 rounded-2xl font-black text-xs transition-all shadow-sm ${attendance[st._id] === "Absent" ? "bg-red-500 shadow-red-500/20 scale-105" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>A</button>
                      </div>
                    </td>
                    <td className="p-5 text-[10px] font-black uppercase">
                      {attendance[st._id] === "Holiday" ? <span className="text-amber-500 italic bg-amber-500/10 px-2 py-1 rounded-md border border-amber-500/10">Off Day</span> : 
                       attendance[st._id] ? <span className={attendance[st._id] === "Present" ? "text-emerald-500" : "text-red-500"}>{attendance[st._id]}</span> : <span className="text-gray-600">Pending</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL MOUNT POINT */}
        {showModal && (
          <AddStudentModal 
            selectedCourse={selectedCourse} 
            onClose={() => setShowModal(false)} 
            refreshData={fetchStudentsAndAttendance} 
          />
        )}
      </div>
    </div>
  )
}