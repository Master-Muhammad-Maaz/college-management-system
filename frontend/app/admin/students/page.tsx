"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, UserPlus, Loader2, FileDown, 
  CalendarDays, CheckCircle2, XCircle, Calendar, Trees, Trash2, Upload,
  FolderPlus, Folder, ChevronRight, FileText, ArrowLeft
} from "lucide-react"
import { AddStudentModal } from "../../../components/AddStudentModal";

export default function AdminManagement() {
  const [students, setStudents] = useState([])
  const [folders, setFolders] = useState([])
  const [files, setFiles] = useState([]) // Us folder ki files
  const [selectedCourse, setSelectedCourse] = useState("B.Sc-I")
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isAttendanceMode, setIsAttendanceMode] = useState(false)
  const [isHolidayMode, setIsHolidayMode] = useState(false)
  const [isRepositoryMode, setIsRepositoryMode] = useState(false) 
  
  // --- DRIVE STATES ---
  const [currentFolder, setCurrentFolder] = useState<any>(null) // null = Root
  const [path, setPath] = useState<any[]>([]) // For Breadcrumbs
  
  const [attendance, setAttendance] = useState<Record<string, 'P' | 'A' | 'H'>>({})
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  const courses = ["B.Sc-I", "B.Sc-II", "B.Sc-III", "M.Sc-I", "M.Sc-II"]
  const API_BASE = "https://college-management-system-ae1l.onrender.com";

  // --- DRIVE LOGIC: FETCH CONTENT ---
  const fetchDriveContent = async () => {
    setLoading(true);
    try {
      const folderId = currentFolder ? currentFolder._id : "root";
      // Backend api to fetch folders AND files for this specific folder/course
      const res = await fetch(`${API_BASE}/api/assignments/content/${selectedCourse}/${folderId}`);
      const data = await res.json();
      if (data.success) {
        setFolders(data.folders || []);
        setFiles(data.files || []);
      }
    } catch (err) {
      console.error("Drive Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isRepositoryMode) fetchDriveContent();
    else fetchStudents();
  }, [selectedCourse, currentFolder, isRepositoryMode]);

  // --- NAVIGATION LOGIC ---
  const openFolder = (folder: any) => {
    setPath([...path, folder]);
    setCurrentFolder(folder);
  };

  const goToPath = (index: number) => {
    if (index === -1) {
      setPath([]);
      setCurrentFolder(null);
    } else {
      const newPath = path.slice(0, index + 1);
      setPath(newPath);
      setCurrentFolder(newPath[newPath.length - 1]);
    }
  };

  // --- CREATE & UPLOAD ---
  const handleCreateFolder = async () => {
    const folderName = prompt("Enter Folder Name:");
    if (!folderName) return;
    setLoading(true);
    try {
      await fetch(`${API_BASE}/api/assignments/create-folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name: folderName, 
            course: selectedCourse,
            parentId: currentFolder ? currentFolder._id : null 
        })
      });
      fetchDriveContent();
    } catch (err) { alert("Error creating folder"); }
    finally { setLoading(false); }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentFolder) return alert("Please open a folder first!");

    const fileName = prompt("Enter File Title:", file.name);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName || file.name);
    formData.append("course", selectedCourse);
    formData.append("folderId", currentFolder._id);
    formData.append("teacherName", "Admin");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/assignments/add`, { method: "POST", body: formData });
      if (res.ok) {
        alert("✅ Uploaded!");
        fetchDriveContent();
      }
    } catch (err) { alert("Upload failed"); }
    finally { setLoading(false); e.target.value = ""; }
  };

  // ... (Other existing functions like fetchStudents, handleSyncAttendance, etc. stay same)
  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/students/list?course=${selectedCourse}`)
      const data = await res.json()
      if (data.success) { setStudents(data.students); setAttendance({}); }
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header - Identical to yours */}
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

        {/* Action Grid - Navigation Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <button onClick={() => setShowModal(true)} className="flex flex-col items-center justify-center p-6 bg-blue-50 border rounded-[30px] hover:bg-blue-600 group transition-all">
            <UserPlus className="text-blue-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-blue-600 group-hover:text-white">Add Student</span>
          </button>
          <button onClick={() => {}} className="flex flex-col items-center justify-center p-6 bg-emerald-50 border rounded-[30px] hover:bg-emerald-600 group transition-all">
             <CheckCircle2 className="text-emerald-600 group-hover:text-white mb-2" size={24} />
            <span className="text-[9px] font-black uppercase text-emerald-600 group-hover:text-white">Sync Records</span>
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

        {/* MAIN CONTENT AREA: GOOGLE DRIVE STYLE */}
        <div className="bg-white rounded-[40px] border shadow-2xl overflow-hidden min-h-[500px] relative">
          {isRepositoryMode ? (
            <div className="p-8">
              {/* DRIVE HEADER & BREADCRUMBS */}
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

                <div className="flex gap-3 w-full md:w-auto">
                  <button onClick={handleCreateFolder} className="flex-1 md:flex-none bg-slate-900 text-white px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all flex items-center justify-center gap-2">
                    <FolderPlus size={16} /> New Folder
                  </button>
                  {currentFolder && (
                    <label className="flex-1 md:flex-none bg-indigo-600 text-white px-6 py-3 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-indigo-700 cursor-pointer transition-all flex items-center justify-center gap-2">
                      <Upload size={16} /> Upload
                      <input type="file" className="hidden" onChange={handleFileUpload} />
                    </label>
                  )}
                </div>
              </div>
              
              {/* GRID VIEW */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {/* Render Folders */}
                {folders.map((f: any) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    key={f._id} onClick={() => openFolder(f)}
                    className="p-6 bg-slate-50 border border-slate-100 rounded-[35px] flex flex-col items-center justify-center gap-4 group hover:bg-white hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer"
                  >
                    <div className="p-4 bg-indigo-100 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Folder size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase text-slate-800 tracking-tight leading-none">{f.name}</p>
                      <p className="text-[7px] font-bold text-slate-400 uppercase mt-1">Folder</p>
                    </div>
                  </motion.div>
                ))}

                {/* Render Files */}
                {files.map((file: any) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                    key={file._id}
                    className="p-6 bg-emerald-50/30 border border-emerald-100 rounded-[35px] flex flex-col items-center justify-center gap-4 group hover:bg-white hover:shadow-2xl transition-all cursor-pointer"
                  >
                    <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-600">
                      <FileText size={32} />
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] font-black uppercase text-slate-800 tracking-tight leading-none truncate w-32">{file.fileName}</p>
                      <button className="text-[7px] font-bold text-emerald-600 uppercase mt-1 hover:underline">Download</button>
                    </div>
                  </motion.div>
                ))}

                {/* Empty State */}
                {folders.length === 0 && files.length === 0 && !loading && (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-20">
                    <Folder size={60} className="mb-4" />
                    <span className="text-[10px] font-black uppercase italic tracking-widest text-slate-400">Folder is empty</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Attendance View - Same as your previous code */
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
                      <tr key={s._id} className="border-b">
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
      {showModal && <AddStudentModal isOpen={showModal} onClose={() => setShowModal(false)} fetchStudents={fetchStudents} course={selectedCourse} />}
    </div>
  )
}
