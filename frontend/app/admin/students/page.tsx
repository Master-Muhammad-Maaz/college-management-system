"use client"
import { useState, useEffect, useRef } from "react" // useRef add kiya file input ke liye
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { 
  Users, UserPlus, Loader2, FileDown, FileUp, // FileUp icon add kiya
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
  
  const fileInputRef = useRef<HTMLInputElement>(null); // File input reference

  const courses = ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"]
  const API_BASE = "https://college-management-system-ae1l.onrender.com";

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
      else setStudents([]); 
      await checkAttendanceStatus();
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  }

  useEffect(() => {
    fetchStudents();
  }, [selectedCourse, selectedDate]);

  // --- NEW: IMPORT LOGIC ---
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("course", selectedCourse);

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/import`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        alert(`✅ ${data.count} Students Imported Successfully!`);
        fetchStudents(); // List refresh karein
      } else {
        alert("❌ Import Failed: " + data.message);
      }
    } catch (err) {
      alert("Error uploading file");
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
    }
  };

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
        setStudents([]); 
        setAttendanceDone(false);
        alert(`🗑️ ${selectedCourse} has been completely cleared!`);
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
        
        {/* Hidden File Input for Import */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          accept=".xlsx, .xls"
        />

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

        {/* Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <button onClick={() => setShowModal(true)} className="flex flex-col items-center justify-center p-6 bg-blue-50 border rounded-[30px] hover:bg-blue-600 group transition-all">
            <UserPlus className="text-blue-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-blue-600 group-hover:text-white">Add Student</span>
          </button>

          {/* NEW IMPORT BUTTON */}
          <button onClick={handleImportClick} className="flex flex-col items-center justify-center p-6 bg-emerald-50 border rounded-[30px] hover:bg-emerald-600 group transition-all">
            <FileUp className="text-emerald-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-emerald-600 group-hover:text-white">Import Excel</span>
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

        {/* ... (Baki ka table aur Swipe logic waisa hi rahega) */}
