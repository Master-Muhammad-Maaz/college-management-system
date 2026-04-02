//testing
"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { 
  Users, UserPlus, Loader2, FileDown, FileUp, 
  CheckCircle2, Calendar, Trees, X, ArrowUp, 
  ArrowDown, Trash2, Folder, File, Plus, Upload, 
  ArrowLeft, HardDrive, LayoutGrid
} from "lucide-react"
import { AddStudentModal } from "../../../components/AddStudentModal";

export default function AdminManagement() {
  // --- EXISTING STATES ---
  const [students, setStudents] = useState<any[]>([])
  const [selectedCourse, setSelectedCourse] = useState("B.Sc-I")
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [attendanceDone, setAttendanceDone] = useState(false)
  const [isSwipeMode, setIsSwipeMode] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [attendanceSession, setAttendanceSession] = useState<any[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  
  // --- NEW DRIVE STATES ---
  const [activeTab, setActiveTab] = useState<"attendance" | "drive">("attendance")
  const [driveItems, setDriveItems] = useState<any[]>([])
  const [driveLoading, setDriveLoading] = useState(false)
  const [currentCategory, setCurrentCategory] = useState("notes")
  const [parentId, setParentId] = useState<string | null>(null)
  const [stack, setStack] = useState<any[]>([])

  const fileInputRef = useRef<HTMLInputElement>(null);
  const courses = ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"]
  const API_BASE = "https://college-management-system-ae1l.onrender.com";

  // --- DRIVE LOGIC ---
  const fetchDriveItems = async () => {
    setDriveLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/content/list?course=${selectedCourse}&category=${currentCategory}&parentId=${parentId || ""}`)
      const data = await res.json()
      if(data.success) setDriveItems(data.items)
    } catch (err) { console.error("Drive Fetch Error") } 
    finally { setDriveLoading(false) }
  }

  useEffect(() => {
    if (activeTab === "drive") fetchDriveItems();
    else fetchStudents();
  }, [selectedCourse, currentCategory, parentId, activeTab]);

  const handleCreateFolder = async () => {
    const name = prompt("Enter Folder Name:")
    if (!name) return
    try {
      const res = await fetch(`${API_BASE}/api/content/create-folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, course: selectedCourse, category: currentCategory, parentId })
      })
      if (await res.json()) fetchDriveItems()
    } catch (err) { alert("Error creating folder") }
  }

  const openFolder = (item: any) => {
    if (item.type === "folder") {
      setStack([...stack, item]); setParentId(item._id);
    }
  }

  const goBackDrive = () => {
    const newStack = [...stack]; newStack.pop()
    setStack(newStack)
    setParentId(newStack.length > 0 ? newStack[newStack.length - 1]._id : null)
  }

  // --- EXISTING ATTENDANCE LOGIC (UNCHANGED) ---
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
      if (data.success) setStudents(data.students); else setStudents([]); 
      await checkAttendanceStatus();
    } catch (err) { console.error("Fetch Error"); } finally { setLoading(false); }
  }

  // Swipe logic props
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-200, 200], [25, -25]);
  const opacity = useTransform(y, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleSwipe = (status: "Present" | "Absent") => {
    const currentStudent = students[currentIndex];
    const newEntry = { studentId: currentStudent._id, status: status.toUpperCase() }; 
    const updatedSession = [...attendanceSession, newEntry];
    setAttendanceSession(updatedSession);
    if (currentIndex < students.length - 1) { setCurrentIndex(prev => prev + 1); y.set(0); } 
    else { setIsSwipeMode(false); submitAttendance(updatedSession); }
  };

  const submitAttendance = async (finalData: any[]) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/attendance/swipe-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, course: selectedCourse, attendanceData: finalData })
      });
      if ((await res.json()).success) { alert(`✅ Attendance Done!`); fetchStudents(); }
    } catch (err) { alert("Error"); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-slate-900 p-6 md:p-10 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 border-b pb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl shadow-lg bg-slate-900 text-white">
              <LayoutGrid size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase italic tracking-tighter">DEPARTMENT HUB</h1>
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{selectedCourse} Dashboard</p>
            </div>
          </div>

          {/* MODE TOGGLE SWITCH */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border">
            <button 
              onClick={() => setActiveTab("attendance")}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === "attendance" ? "bg-white shadow-sm text-blue-600" : "text-slate-400"}`}
            >
              Attendance
            </button>
            <button 
              onClick={() => setActiveTab("drive")}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeTab === "drive" ? "bg-white shadow-sm text-blue-600" : "text-slate-400"}`}
            >
              E-Drive
            </button>
          </div>
        </div>

        {/* --- ATTENDANCE VIEW --- */}
        {activeTab === "attendance" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
             {/* Action Grid (Add Student, Import, etc.) */}
             <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
                <button onClick={() => setShowModal(true)} className="flex flex-col items-center justify-center p-6 bg-blue-50 border rounded-[30px] hover:bg-blue-600 group transition-all">
                  <UserPlus className="text-blue-600 group-hover:text-white mb-2" size={24} />
                  <span className="text-[9px] font-black uppercase group-hover:text-white">Add Student</span>
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center justify-center p-6 bg-emerald-50 border rounded-[30px] hover:bg-emerald-600 group transition-all">
                  <FileUp className="text-emerald-600 group-hover:text-white mb-2" size={24} />
                  <span className="text-[9px] font-black uppercase group-hover:text-white">Import Excel</span>
                </button>
                <button onClick={() => { if(!attendanceDone) { setCurrentIndex(0); setAttendanceSession([]); setIsSwipeMode(true); }}} disabled={attendanceDone} className={`flex flex-col items-center justify-center p-6 border rounded-[30px] transition-all group ${attendanceDone ? "bg-slate-100 opacity-60" : "bg-emerald-50 hover:bg-emerald-600"}`}>
                  <CheckCircle2 className={`${attendanceDone ? "text-slate-400" : "text-emerald-600 group-hover:text-white"} mb-2`} size={24} />
                  <span className="text-[9px] font-black uppercase">{attendanceDone ? "Done ✅" : "Attendance"}</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 bg-orange-50 border rounded-[30px] hover:bg-orange-600 group transition-all">
                  <Trees className="text-orange-600 group-hover:text-white mb-2" size={24} />
                  <span className="text-[9px] font-black uppercase group-hover:text-white">Holiday</span>
                </button>
                <button onClick={() => window.open(`${API_BASE}/api/attendance/export?course=${selectedCourse}`, "_blank")} className="flex flex-col items-center justify-center p-6 bg-slate-50 border rounded-[30px] hover:bg-slate-900 group transition-all">
                  <FileDown className="text-slate-600 group-hover:text-white mb-2" size={24} />
                  <span className="text-[9px] font-black uppercase group-hover:text-white">Export</span>
                </button>
                <button className="flex flex-col items-center justify-center p-6 bg-red-50 border rounded-[30px] hover:bg-red-600 group transition-all">
                  <Trash2 className="text-red-600 group-hover:text-white mb-2" size={24} />
                  <span className="text-[9px] font-black uppercase group-hover:text-white">Clear</span>
                </button>
             </div>

             {/* Course Tabs & Table */}
             <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {courses.map(c => (
                  <button key={c} onClick={() => setSelectedCourse(c)} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase border transition-all shrink-0 ${selectedCourse === c ? "bg-blue-600 text-white shadow-lg" : "bg-white text-slate-400"}`}>{c}</button>
                ))}
             </div>

             <div className="bg-white rounded-[40px] border shadow-2xl overflow-hidden min-h-[400px] relative p-8">
                <table className="w-full text-left border-collapse">
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
                        <td className="p-4 text-right"><span className="text-[8px] font-black uppercase bg-slate-100 px-3 py-1 rounded-full text-slate-400 italic">Registered</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
          </motion.div>
        )}

        {/* --- DRIVE VIEW (INTEGRATED) --- */}
        {activeTab === "drive" && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="bg-white rounded-[40px] border shadow-2xl overflow-hidden min-h-[500px]">
              
              {/* Drive Controls */}
              <div className="p-8 border-b bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  {parentId && (
                    <button onClick={goBackDrive} className="p-2 bg-white border rounded-xl shadow-sm hover:bg-slate-100"><ArrowLeft size={18} /></button>
                  )}
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                      <HardDrive size={16} className="text-blue-600" /> Storage Space
                    </h2>
                    <p className="text-[9px] font-bold text-slate-400">{selectedCourse} / {currentCategory}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <select onChange={(e) => setCurrentCategory(e.target.value)} className="bg-white border px-4 py-2 rounded-xl text-[10px] font-black uppercase outline-none">
                    <option value="notes">Digital Notes</option>
                    <option value="assignments">Assignments</option>
                  </select>
                  <button onClick={handleCreateFolder} className="bg-slate-900 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-blue-600 transition-all">
                    <Plus size={14} /> New Folder
                  </button>
                  <label className="bg-blue-600 text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-slate-900 transition-all cursor-pointer">
                    <Upload size={14} /> Upload File
                    <input type="file" className="hidden" />
                  </label>
                </div>
              </div>

              {/* Drive Items List */}
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {driveLoading ? (
                  <div className="col-span-full flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
                ) : driveItems.length > 0 ? (
                  driveItems.map((item) => (
                    <motion.div 
                      key={item._id} 
                      whileHover={{ y: -5 }}
                      onDoubleClick={() => openFolder(item)}
                      className="p-6 bg-white border border-slate-100 rounded-[30px] hover:shadow-xl hover:border-blue-500/20 transition-all group cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-2xl ${item.type === 'folder' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400'}`}>
                          {item.type === "folder" ? <Folder size={24} fill="currentColor" fillOpacity={0.2} /> : <File size={24} />}
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={14} /></button>
                      </div>
                      <h3 className="text-xs font-black text-slate-700 truncate uppercase tracking-tighter">{item.name}</h3>
                      <p className="text-[9px] font-bold text-slate-300 mt-1 uppercase tracking-widest">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </p>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center text-slate-300 uppercase text-[10px] font-black tracking-[0.3em]">Folder is Empty</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* ATTENDANCE SWIPE MODAL (EXISTING) */}
      <AnimatePresence>
        {isSwipeMode && students[currentIndex] && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-slate-900/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6">
            <button onClick={() => setIsSwipeMode(false)} className="absolute top-8 right-8 text-white/50 hover:text-white"><X size={32} /></button>
            <div className="text-center mb-10">
               <h2 className="text-white text-4xl font-black italic uppercase tracking-tighter">{students[currentIndex].name}</h2>
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
                className="w-full h-full bg-white rounded-[60px] shadow-2xl flex flex-col items-center justify-center p-10 text-center border-[6px] border-white"
              >
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-10">
                  <span className="text-blue-600 font-black text-4xl">{students[currentIndex].name.charAt(0)}</span>
                </div>
                <div className="flex flex-col gap-4 w-full">
                  <button onClick={() => handleSwipe("Present")} className="w-full py-4 bg-emerald-500 text-white rounded-3xl font-black text-[11px] uppercase flex items-center justify-center gap-2"><ArrowUp size={20}/> Present</button>
                  <button onClick={() => handleSwipe("Absent")} className="w-full py-4 bg-red-500 text-white rounded-3xl font-black text-[11px] uppercase flex items-center justify-center gap-2"><ArrowDown size={20}/> Absent</button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <input type="file" ref={fileInputRef} onChange={() => {}} className="hidden" accept=".xlsx, .xls" />
      {showModal && <AddStudentModal isOpen={showModal} onClose={() => setShowModal(false)} fetchStudents={fetchStudents} course={selectedCourse} />}
    </div>
  )
}
