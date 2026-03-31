"use client"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { GraduationCap, ArrowLeft, Loader2 } from "lucide-react"

export default function StudentLogin() {
  const router = useRouter()
  const [contact, setContact] = useState("")
  const [dob, setDob] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      // FIX: Ensure the URL matches your live Render service
      const API_BASE_URL = "https://college-management-system-ae11.onrender.com";
      
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          contact, 
          dob, 
          role: "student" 
        })
      })

      // Check if response is okay
      if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Login failed");
      }

      const data = await res.json()

      if (data.success) {
        // Syncing with dashboard's expected key
        localStorage.setItem("studentData", JSON.stringify(data.user));
        router.push("/student-dashboard") 
      } else {
        alert(data.message || "Invalid credentials")
      }
    } catch (err: any) {
      console.error("Connection Error:", err)
      alert(err.message === "Failed to fetch" 
        ? "Server connection failed. Please check if backend is awake." 
        : err.message);
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-white p-10 md:p-12 rounded-[40px] shadow-2xl shadow-slate-200 w-full max-w-md border border-slate-100"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Portal</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Enter credentials to proceed</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Contact Number</label>
            <input 
              type="text" 
              placeholder="e.g. 9876543210" 
              value={contact} 
              onChange={(e) => setContact(e.target.value)} 
              className="w-full p-4 rounded-2xl bg-slate-50 text-slate-900 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white transition-all font-medium" 
              required 
            />
          </div>

          <div>
            <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2 block ml-1">Date of Birth</label>
            <input 
              type="date" 
              value={dob} 
              onChange={(e) => setDob(e.target.value)} 
              className="w-full p-4 rounded-2xl bg-slate-50 text-slate-900 outline-none border border-slate-200 focus:border-blue-500 focus:bg-white transition-all font-medium" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all mt-4 flex items-center justify-center gap-2 text-sm uppercase tracking-widest"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Authorize Access"}
          </button>
        </form>

        <div className="mt-10 text-center">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-wide">
            New here? <Link href="/register?role=student" className="text-blue-600 hover:underline">Create Account</Link>
          </p>
          <Link href="/" className="inline-flex items-center gap-2 mt-6 text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
            <ArrowLeft size={14} /> Back to Campus Hub
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
