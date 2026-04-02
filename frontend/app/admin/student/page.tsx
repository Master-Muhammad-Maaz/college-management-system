Maaz Bhai, aapke folder structure aur Vercel build errors ke mutabiq, yeh aapki **`frontend/app/admin/student/page.tsx`** file ka updated final version hai. Isme maine import path ko fix kar diya hai taaki `Module not found` wala error khatam ho jaye.

### **Final Version: `frontend/app/admin/student/page.tsx`**

```tsx
"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { 
  Users, UserPlus, Loader2, FileDown, FileUp, 
  CheckCircle2, Calendar, Trees, 
  X, ArrowUp, ArrowDown, Trash2 
} from "lucide-react"

// FIX: Path corrected to match your directory structure
import { AddStudentModal } from "@/components/AddStudentModal";

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
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const courses = ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"]
  
  const API_BASE = "https://college-management-system-ae1l.onrender.com";

  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [25, -25]);
  const opacity = useTransform(y, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const checkAttendanceStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/attendance/today/${selectedDate}/${selectedCourse}`);
      const data = await res.json();
      setAttendanceDone(data.success && data.record);
    } catch (err) { console.error("Status Check Error:", err); }
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/list?course=${selectedCourse}`)
      const data = await res.json()
      if (data.success) setStudents(data.students);
      else setStudents([]); 
      await checkAttendanceStatus();
    } catch (err) { console.error("Fetch Students Error:", err); } 
    finally { setLoading(false); }
  }

  useEffect(() => {
    fetchStudents();
  }, [selectedCourse, selectedDate]);

  const handleImportClick = () => { fileInputRef.current?.click(); };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("course", selectedCourse);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/import`, { method: "POST", body: formData });
      const data = await res.json();
      if (data.success) {
        alert(`✅ ${data.count} Students Imported!`);
        fetchStudents();
      } else { alert("❌ Import Failed: " + data.message); }
    } catch (err) { alert("Error uploading file"); } 
    finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleHolidayMode = async () => {
    if (attendanceDone) return alert("Attendance or Holiday already marked!");
    if (!confirm(`Mark ${selectedDate} as Holiday?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/attendance/mark-holiday`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, course: selectedCourse })
      });
      if ((await res.json()).success) { 
        alert("✅ Holiday Marked!"); fetchStudents(); 
      }
    } catch (err) { alert("Error marking holiday"); } 
    finally { setLoading(false); }
  };

  const handleExport = () => {
    window.open(`${API_BASE}/api/attendance/export?course=${selectedCourse}`, "_blank");
  };

  const startAttendance = () => {
    if (attendanceDone) return alert("Attendance already marked!");
    if (students.length === 0) return alert("No students found!");
    setCurrentIndex(0); setAttendanceSession([]); setIsSwipeMode(true);
  };

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
      if ((await res.json()).success) {
        alert(`✅ Attendance Done!`);
        fetchStudents();
      }
    } catch (err) { alert("Error submitting attendance"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-10 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".xlsx, .xls" />

        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 border-b pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl shadow-lg bg-blue-600 text-white"><Users size={24} /></div>
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

        {/* Action Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <button onClick={() => setShowModal(true)} className="flex flex-col items-center justify-center p-6 bg-blue-50 border rounded-[30px] hover:bg-blue-600 group transition-all">
            <UserPlus className="text-blue-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase group-hover:text-white">Add Student</span>
          </button>
          <button onClick={handleImportClick} className="flex flex-col items-center justify-center p-6 bg-emerald-50 border rounded-[30px] hover:bg-emerald-600 group transition-all">
            <FileUp className="text-emerald-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase group-hover:text-white">Import Excel</span>
          </button>
          <button onClick={startAttendance} disabled={attendanceDone} className={`flex flex-col items-center justify-center p-6 border rounded-[30px] transition-all group ${attendanceDone ? "bg-slate-100 opacity-60" : "bg-emerald-50 hover:bg-emerald-600"}`}>
            <CheckCircle2 className={`${attendanceDone ? "text-slate-400" : "text-emerald-600 group-hover:text-white"} mb-2`} size={24} />
            <span className={`text-[9px] font-black uppercase ${attendanceDone ? "text-slate-400" : "group-hover:text-white"}`}>{attendanceDone ? "Done ✅" : "Attendance"}</span>
          </button>
          <button onClick={handleHolidayMode} disabled={attendanceDone} className={`flex flex-col items-center justify-center p-6 border rounded-[30px] transition-all group ${attendanceDone ? "bg-slate-100 opacity-60" : "bg-orange-50 hover:bg-orange-600"}`}>
            <Trees className={`${attendanceDone ? "text-slate-400" : "text-orange-600 group-hover:text-white"} mb-2`} size={24} />
            <span className={`text-[9px] font-black uppercase ${attendanceDone ? "text-slate-400" : "group-hover:text-white"}`}>Holiday</span>
          </button>
          <button onClick={handleExport} className="flex flex-col items-center justify-center p-6 bg-slate-50 border rounded-[30px] hover:bg-slate-900 group transition-all">
            <FileDown className="text-slate-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase group-hover:text-white">Export</span>
          </button>
          <button className="flex flex-col items-center justify-center p-6 bg-red-50 border rounded-[30px] hover:bg-red-600 group transition-all">
            <Trash2 className="text-red-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase group-hover:text-white">Clear</span>
          </button>
        </div>

        {/* Course Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          {courses.map(c => (
            <button key={c} onClick={() => setSelectedCourse(c)} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase border transition-all shrink-0 ${selectedCourse === c ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-400"}`}>{c}</button>
          ))}
        </div>

        {/* Student Table */}
        <div className="bg-white rounded-[40px] border shadow-2xl overflow-hidden min-h-[400px] relative p-8">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Strength: {students.length}</p>
            {students.length > 0 ? (
              <table className="w-full mt-6 text-left border-collapse">
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
                      <td className="p-4 font-black text-slate-700 text-[11px] uppercase">{s.name}</td>
                      <td className="p-4 text-right">
                        <span className="text-[8px] font-black uppercase bg-slate-100 px-3 py-1 rounded-full text-slate-400">Active</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                <Trash2 size={48} className="mb-4 opacity-20" />
                <p className="text-[10px] font-black uppercase tracking-widest">No Students Found</p>
              </div>
            )}
            {loading && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex justify-center items-center z-50">
                <Loader2 className="animate-spin text-blue-600" size={40} />
              </div>
            )}
        </div>
      </div>

      {/* Swipe Mode Logic */}
      <AnimatePresence>
        {isSwipeMode && students[currentIndex] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6">
            <button onClick={() => setIsSwipeMode(false)} className="absolute top-8 right-8 text-white/50 hover:text-white"><X size={32} /></button>
            <div className="text-center mb-10">
               <motion.h2 key={students[currentIndex]._id + "-name"} className="text-white text-4xl font-black italic uppercase tracking-tighter">{students[currentIndex].name}</motion.h2>
               <p className="text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mt-2">ROLL NO: {students[currentIndex].srNo}</p>
            </div>
            <div className="relative w-80 h-[450px]">
              <motion.div
                key={students[currentIndex]._id}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                onDragEnd={(e, info) => {
                  if (info.offset.y < -150) handleSwipe("Present");
                  else if (info.offset.y > 150) handleSwipe("Absent");
                }}
                style={{ y, rotateX, opacity }}
                className="w-full h-full bg-white rounded-[60px] flex flex-col items-center justify-center p-10 text-center border-[6px] border-white relative overflow-hidden"
              >
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-10">
                  <span className="text-blue-600 font-black text-4xl">{students[currentIndex].name.charAt(0)}</span>
                </div>
                <div className="flex flex-col gap-4 w-full">
                  <button onClick={() => handleSwipe("Present")} className="w-full py-4 bg-emerald-500 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2"><ArrowUp size={20}/> Present</button>
                  <button onClick={() => handleSwipe("Absent")} className="w-full py-4 bg-red-500 text-white rounded-3xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2"><ArrowDown size={20}/> Absent</button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showModal && <AddStudentModal isOpen={showModal} onClose={() => setShowModal(false)} fetchStudents={fetchStudents} course={selectedCourse} />}
    </div>
  );
}
```

Is code ko save karke commit karein, Vercel build ab successfully complete ho jayegi.
