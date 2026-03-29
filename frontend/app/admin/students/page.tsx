"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Calendar, Play, CheckCircle, Coffee, FileDown, UserPlus, BookOpen, Loader2, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import AddStudentModal from "../../../components/AddStudentModal";

interface Student { _id: string; srNo: number; name: string; mobile: string; dob: string; }
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
        dataAt.records.forEach((rec: any) => { attendanceMap[rec.studentId] = rec.status })
        setAttendance(attendanceMap)
      } else { setAttendance({}) }
    } catch (err) { console.error(err) } finally { setLoading(false); }
  }

  useEffect(() => { fetchStudentsAndAttendance(); }, [selectedDate, selectedCourse])

  const markAttendance = async (studentId: string, status: AttendanceStatus) => {
    try {
      setAttendance(prev => ({ ...prev, [studentId]: status }))
      await fetch(`${API_BASE}/api/attendance/mark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, date: selectedDate, status, course: selectedCourse })
      })
      if (isSwipeMode) setCurrentIndex(prev => prev + 1)
    } catch (err) { alert("Failed!"); fetchStudentsAndAttendance(); }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER: Matches Student Repo Style */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-2xl text-blue-600">
              <Users size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#0f172a] tracking-tight">Management</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Academic Administration</p>
            </div>
          </div>
          
          <div className="flex gap-3 bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200">
             <Link href="/admin-dashboard">
                <button className="px-6 py-2.5 text-slate-400 hover:text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Repository</button>
             </Link>
             <button className="px-6 py-2.5 bg-white text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm border border-slate-100">Students</button>
          </div>
        </div>

        <hr className="border-slate-100 mb-10" />

        {/* TOOLS BAR */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 justify-between items-center">
            <div className="flex gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-100 overflow-x-auto w-full md:w-auto">
              {courses.map(c => (
                <button key={c} onClick={() => setSelectedCourse(c)} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${selectedCourse === c ? "bg-blue-600 text-white shadow-lg shadow-blue-100" : "text-slate-400 hover:bg-white"}`}>{c}</button>
              ))}
            </div>
            <button onClick={() => setShowModal(true)} className="w-full md:w-auto h-14 px-8 bg-blue-600 text-white rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-100 font-bold text-[11px] uppercase tracking-widest">
              <UserPlus size={18} /> Add Student
            </button>
        </div>

        {/* DATA TABLE AREA */}
        <div className="bg-white rounded-[40px] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden relative min-h-[500px]">
          {loading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
          )}
          
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Roll</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest">Student Name</th>
                <th className="p-6 text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors">
                  <td className="p-6 font-bold text-blue-600">#{s.srNo}</td>
                  <td className="p-6 font-black text-slate-700 uppercase tracking-tight">{s.name}</td>
                  <td className="p-6 flex justify-center gap-2">
                    <button onClick={() => markAttendance(s._id, "Present")} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${attendance[s._id] === "Present" ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100" : "bg-white text-slate-400 border-slate-100 hover:border-emerald-200 hover:text-emerald-500"}`}>P</button>
                    <button onClick={() => markAttendance(s._id, "Absent")} className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${attendance[s._id] === "Absent" ? "bg-red-500 text-white border-red-500 shadow-lg shadow-red-100" : "bg-white text-slate-400 border-slate-100 hover:border-red-200 hover:text-red-500"}`}>A</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AddStudentModal isOpen={showModal} onClose={() => setShowModal(false)} fetchStudents={fetchStudentsAndAttendance} course={selectedCourse} />
    </div>
  )
}
