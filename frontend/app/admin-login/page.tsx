"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function AdminLogin() {
  const router = useRouter()
  const [contact, setContact] = useState("")
  const [dob, setDob] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const backendUrl = "https://college-management-system-ae1l.onrender.com/api/login"
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, dob, role: "admin" })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        if (data.token) localStorage.setItem("token", data.token)
        router.push("/admin/students") // Updated to your management path
      } else {
        alert(data.message || "Login failed.")
      }
    } catch (error) {
      alert("Server connection failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050a18]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="bg-[#0c1633] p-12 rounded-[40px] shadow-2xl w-full max-w-md border border-white/5"
      >
        <h1 className="text-4xl font-black text-center text-white mb-10 tracking-tight">Admin Login</h1>
        
        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-2">
            <label className="text-white/70 text-xs font-black uppercase tracking-widest ml-1">Contact Number</label>
            <input 
              type="text" 
              placeholder="Enter Contact Number" 
              value={contact} 
              onChange={(e) => setContact(e.target.value)} 
              className="w-full p-5 rounded-2xl bg-[#161f3d] text-white outline-none border border-white/5 focus:border-indigo-500 transition-all font-bold" 
              required 
            />
          </div>

          <div className="space-y-2">
            <label className="text-white/70 text-xs font-black uppercase tracking-widest ml-1">Date of Birth</label>
            <input 
              type="date" 
              value={dob} 
              onChange={(e) => setDob(e.target.value)} 
              className="w-full p-5 rounded-2xl bg-[#161f3d] text-white outline-none border border-white/5 focus:border-indigo-500 transition-all font-bold uppercase" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            {loading ? "Verifying..." : "Login"}
          </button>
        </form>

        <p className="text-center text-white/40 mt-10 text-[11px] font-black uppercase tracking-widest">
          Don't have an account?{" "}
          <Link href="/register?role=admin" className="text-indigo-400 hover:text-white transition-colors">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
