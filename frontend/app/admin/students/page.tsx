"use client"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { 
  Users, UserPlus, Loader2, FileDown, FileUp, 
  CheckCircle2, Calendar, Trees, 
  X, ArrowUp, ArrowDown, Trash2, FolderPlus, FolderOpen 
} from "lucide-react"
import { AddStudentModal } from "../../../components/AddStudentModal";

export default function AdminManagement() {
  const [students, setStudents] = useState<any[]>([])
  const [folders, setFolders] = useState<any[]>([]) // Folders state
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

  // --- REPOSITORY LOGIC ---

  // 1. Fetch Folders
  const fetchFolders = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/repo/folders/root`);
      const data = await res.json();
      if (data.success) setFolders(data.folders);
    } catch (err) { console.error("Folder Fetch Error"); }
  };

  // 2. Create Folder
  const handleCreateFolder = async () => {
    const name = prompt("Enter Folder Name (e.g. Notes, Syllabus):");
    if (!name) return;
    try {
      const res = await fetch(`${API_BASE}/api/repo/create-folder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, parentId: "root" })
      });
      if ((await res.json()).success) fetchFolders();
    } catch (err) { alert("Error creating folder"); }
  };

  // 3. DELETE FOLDER (Admin Security)
  const handleDeleteFolder = async (id: string, name: string) => {
    if (!confirm(`⚠️ WARNING: Deleting "${name}" will remove ALL files inside it permanently. Continue?`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/repo/delete-folder/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        alert("🗑️ Folder Deleted!");
        fetchFolders();
      } else {
        alert("❌ Error: " + data.message);
      }
    } catch (err) { alert("Server error while deleting folder"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    fetchStudents();
    fetchFolders(); // Load folders on mount
  }, [selectedCourse, selectedDate]);

  // ... (Keep your existing fetchStudents, handleSwipe, etc. functions here) ...

  return (
    <div className="min-h-screen bg-white text-slate-900 p-6 md:p-10 font-sans relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header & Date Input (Existing) */}
        {/* Action Grid (Existing) */}

        {/* --- REPOSITORY MANAGER SECTION (NEW) --- */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Resource Repository</h2>
            <button onClick={handleCreateFolder} className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all">
              <FolderPlus size={14} /> New Folder
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {folders.map((f) => (
              <div key={f._id} className="group relative bg-slate-50 border-2 border-dashed border-slate-200 p-5 rounded-[25px] hover:border-blue-500 hover:bg-white transition-all flex flex-col items-center">
                {/* Delete Button (Visible on Hover) */}
                <button 
                  onClick={() => handleDeleteFolder(f._id, f.name)}
                  className="absolute top-3 right-3 p-2 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={12} />
                </button>

                <FolderOpen size={32} className="text-blue-600 mb-3" />
                <p className="text-[11px] font-black uppercase text-slate-800 text-center">{f.name}</p>
                <span className="text-[8px] font-bold text-slate-400 uppercase mt-1">Click to manage</span>
              </div>
            ))}
            {folders.length === 0 && (
              <div className="col-span-full py-10 border-2 border-dashed rounded-[30px] flex flex-col items-center justify-center text-slate-300">
                <FolderOpen size={40} className="mb-2 opacity-20" />
                <p className="text-[9px] font-black uppercase">No folders in Root</p>
              </div>
            )}
          </div>
        </div>

        {/* --- EXISTING STUDENTS TABLE & SWIPE UI --- */}
        {/* ... (Keep your existing code for Course Tabs, Table, and Swipe UI here) ... */}
      </div>
    </div>
  );
}
