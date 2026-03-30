"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, UserPlus, Loader2, FileDown, 
  CalendarDays, CheckCircle2, XCircle, Calendar, Trees, Trash2, Upload,
  FolderPlus, Folder, ChevronRight 
} from "lucide-react"
import { AddStudentModal } from "../../../components/AddStudentModal";

export default function AdminManagement() {
  const [students, setStudents] = useState([])
  const [folders, setFolders] = useState([]) // Folders state added
  const [selectedCourse, setSelectedCourse] = useState("B.Sc-I")
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isAttendanceMode, setIsAttendanceMode] = useState(false)
  const [isHolidayMode, setIsHolidayMode] = useState(false)
  const [isRepositoryMode, setIsRepositoryMode] = useState(false) 
  const [attendance, setAttendance] = useState<Record<string, 'P' | 'A' | 'H'>>({})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const courses = ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"]
  const API_BASE = "https://college-management-system-ae1l.onrender.com";

  // --- FETCH STUDENTS ---
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/list?course=${selectedCourse}`)
      const data = await res.json()
      if (data.success) {
        setStudents(data.students);
        setAttendance({}); 
      }
    } catch (err) { console.error("Fetch Error:", err); } 
    finally { setLoading(false); }
  }

  // --- FETCH FOLDERS (E-REPOSITORY) ---
  const fetchFolders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/assignments/folders/${selectedCourse}`);
      const data = await res.json();
      if (data.success) {
        setFolders(data.folders);
      }
    } catch (err) {
      console.error("Folder Fetch Error:", err);
    }
  };

  // Sync both data on course change
  useEffect(() => { 
    fetchStudents(); 
    fetchFolders();
  }, [selectedCourse])

  // --- REPOSITORY LOGIC (CREATE FOLDER) ---
  const handleCreateFolder = async () => {
    const folderName = prompt("Enter Folder Name (e.g. Unit-1 Notes):");
    if (!folderName) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/assignments/create-folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: folderName, course: selectedCourse })
      });
      const data = await res.json();
      if (data.success) {
        alert("✅ Folder Created Successfully!");
        fetchFolders(); // Refresh list immediately
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (err) { 
      alert("⚠️ Server unreachable. Make sure Backend is awake!"); 
    } finally { 
      setLoading(false); 
    }
  }

  // --- ATTENDANCE & SYNC LOGIC ---
  const handleSyncAttendance = async () => {
    const recordCount = Object.keys(attendance).length;
    if (recordCount === 0) return alert("Nothing to sync!");
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/attendance/bulk-sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate, course: selectedCourse, records: attendance })
      });
      const result = await response.json();
      if (result.success) {
        alert("Synced successfully!");
        setAttendance({}); 
      }
    } catch (err) { alert("Server unreachable."); }
    finally { setLoading(false); }
  }

  // --- EXCEL & BATCH LOGIC ---
  const handleExcelImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fallbackCourse", selectedCourse);
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/students/import-excel`, { method: "POST", body: formData });
      const result = await response.json();
      if (result.success) { alert(result.message); fetchStudents(); }
      else { alert("Import Failed: " + result.message); }
    } catch (err) { alert("Server error."); }
    finally { setLoading(false); e.target.value = ""; }
  }

  const handleClearBatch = async () => {
    const pincode = prompt("Enter Secret Pincode to Clear Batch:");
    if (pincode !== "1234") return alert("Wrong Pincode!");
    if (confirm(`Delete ALL students from ${selectedCourse}?`)) {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/students/clear-batch`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ course: selectedCourse, pincode })
        });
        const data = await res.json();
        if (data.success) { alert(data.message); fetchStudents(); }
      } catch (err) { alert("Server error."); }
      finally { setLoading(false); }
    }
  }

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
    } else { setAttendance({}); }
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
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setAttendance({}); }}
              className="bg-transparent border-none outline-none text-[10px] font-black text-blue-600 uppercase"
            />
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <button onClick={() => setShowModal(true)} className="flex flex-col items-center justify-center p-6 bg-blue-50 border rounded-[30px] hover:bg-blue-600 group transition-all">
            <UserPlus className="text-blue-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-blue-600 group-hover:text-white">Add Student</span>
          </button>
          
          <button onClick={handleSyncAttendance} disabled={loading} className="flex flex-col items-center justify-center p-6 bg-emerald-50 border rounded-[30px] hover:bg-emerald-600 group transition-all">
            {loading ? <Loader2 className="animate-spin text-emerald-600" /> : <CheckCircle2 className="text-emerald-600 group-hover:text-white mb-2" size={24} />}
            <span className="text-[9px] font-black uppercase text-emerald-600 group-hover:text-white">Sync Records</span>
          </button>

          <button onClick={toggleHoliday} className={`flex flex-col items-center justify-center p-6 rounded-[30px] border transition-all ${isHolidayMode ? "bg-orange-600 text-white" : "bg-orange-50 hover:bg-orange-600 group"}`}>
            <CalendarDays className={`${isHolidayMode ? "text-white" : "text-orange-600 group-hover:text-white"} mb-2`} size={24} />
            <span className="text-[9px] font-black uppercase">Holiday Mode</span>
          </button>

          <button onClick={handleExportExcel} className="flex flex-col items-center justify-center p-6 bg-slate-50 border rounded-[30px] hover:bg-slate-900 group transition-all">
            <FileDown className="text-slate-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-slate-600 group-hover:text-white">Export Excel</span>
          </button>

          <button 
            onClick={() => setIsRepositoryMode(!isRepositoryMode)} 
            className={`flex flex-col items-center justify-center p-6 border rounded-[30px] transition-all ${isRepositoryMode ? "bg-indigo-600 text-white" : "bg-indigo-50 hover:bg-indigo-600 group"}`}
          >
            <FolderPlus className={`${isRepositoryMode ? "text-white" : "text-indigo-600 group-hover:text-white"} mb-2`} size={24} />
            <span className={`text-[9px] font-black uppercase ${isRepositoryMode ? "text-white" : "text-indigo-600 group-hover:text-white"}`}>Manage Files</span>
          </button>
        </div>

        {/* Course Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar">
          {courses.map(c => (
            <button key={c} onClick={() => setSelectedCourse(c)} className={`px-6 py-2 rounded-full text-[9px] font-black uppercase border transition-all ${selectedCourse === c ? "bg-blue-600 text-white" : "bg-white text-slate-400"}`}>
              {c}
            </button>
          ))}
        </div>

        {/* Quick Actions (Excel & Clear) */}
        {!isRepositoryMode && (
          <div className="grid grid-cols-2 gap-4 mb-8">
             <label className="flex flex-col items-center justify-center p-6 bg-slate-50 border-2 border-dashed border-slate-200 rounded-[30px] cursor-pointer hover:bg-slate-100 transition-all">
                <Upload className="text-slate-400 mb-2" size={20} />
                <span className="text-[9px] font-black uppercase text-slate-500">Excel Import</span>
                <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleExcelImport} />
             </label>

             <button onClick={handleClearBatch} className="flex flex-col items-center justify-center p-6 bg-red-50 border-2 border-dashed border-red-100 rounded-[30px] hover:bg-red-600 group transition-all">
                <Trash2 className="text-red-400 group-hover:text-white mb-2" size={20} />
                <span className="text-[9px] font-black uppercase text-red-500 group-hover:text-white">Clear Batch</span>
             </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="bg-white rounded-[40px] border shadow-2xl overflow-hidden min-h-[400px] relative">
          {isRepositoryMode ? (
            <div className="p-8">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="font-black text-lg uppercase tracking-tighter italic text-indigo-600">E-REPOSITORY</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Digital Library for {selectedCourse}</p>
                </div>
                <button onClick={handleCreateFolder} className="bg-slate-900 text-white px-8 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
                  + Create New Folder
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {folders.length > 0 ? (
                  folders.map((f: any) => (
                    <div key={f._id} className="p-6 bg-slate-50 border border-slate-100 rounded-[30px] flex items-center justify-between group hover:bg-white hover:shadow-xl transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-indigo-100 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                          <Folder size={20} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-slate-800 tracking-tight">{f.name}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">View Files</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300" />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full p-20 border-2 border-dashed rounded-[30px] flex flex-col items-center justify-center text-slate-300">
                    <Folder size={40} className="mb-3 opacity-20" />
                    <span className="text-[10px] font-black uppercase italic tracking-widest">No Folders Found</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="p-6 border-b flex justify-between items-center bg-slate-50/30">
                 <div className="flex gap-2">
                    <button onClick={() => setIsAttendanceMode(false)} className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase ${!isAttendanceMode ? "bg-white shadow-sm text-blue-600" : "text-slate-400"}`}>List View</button>
                    <button onClick={() => setIsAttendanceMode(true)} className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase ${isAttendanceMode ? "bg-white shadow-sm text-blue-600" : "text-slate-400"}`}>Attendance</button>
                 </div>
                 {Object.keys(attendance).length > 0 && (
                   <div className="bg-blue-600 px-4 py-1.5 rounded-full text-[9px] font-black text-white uppercase animate-pulse">
                     {Object.keys(attendance).length} Pending Sync
                   </div>
                 )}
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400">SR</th>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400">Student Name</th>
                    <th className="p-6 text-[10px] font-black uppercase text-slate-400 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {!loading && students.map((s: any) => (
                    <motion.tr 
                      key={s._id}
                      drag={isAttendanceMode && !isHolidayMode ? "y" : false}
                      dragConstraints={{ top: 0, bottom: 0 }}
                      onDragEnd={(_, info) => handleDragEnd(info, s._id)}
                      className={`border-b transition-colors ${attendance[s._id] ? 'bg-slate-50/50' : 'hover:bg-slate-50/30'}`}
                    >
                      <td className="p-6 font-bold text-blue-600">#{s.srNo}</td>
                      <td className="p-6 font-black text-slate-700 uppercase tracking-tight">{s.name}</td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end items-center gap-3">
                          {attendance[s._id] === 'H' ? (
                            <span className="text-orange-600 text-[10px] font-black uppercase bg-orange-100 px-3 py-1 rounded-full">Holiday</span>
                          ) : attendance[s._id] === 'P' ? (
                            <span className="text-emerald-600 text-[10px] font-black uppercase bg-emerald-100 px-3 py-1 rounded-full">Present</span>
                          ) : attendance[s._id] === 'A' ? (
                            <span className="text-red-500 text-[10px] font-black uppercase bg-red-100 px-3 py-1 rounded-full">Absent</span>
                          ) : (
                            <span className="text-slate-300 text-[9px] font-black uppercase italic">Pending...</span>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
          {loading && <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>}
        </div>
      </div>
      {showModal && (
        <AddStudentModal isOpen={showModal} onClose={() => setShowModal(false)} fetchStudents={fetchStudents} course={selectedCourse} />
      )}
    </div>
  )
}
