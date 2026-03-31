"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ShieldCheck, Loader2 } from "lucide-react"

export default function AdminLogin() {
  const router = useRouter()
  const [contact, setContact] = useState("")
  const [dob, setDob] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("https://college-management-system-ae1l.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            contact: contact.trim(), 
            dob: dob.trim(), 
            role: "admin" 
        })
      })

      const data = await res.json()

      if (data.success) {
        localStorage.setItem("adminData", JSON.stringify(data.user))
        router.push("/admin-dashboard")
      } else {
        alert(data.message)
      }
    } catch (error) {
      alert("Server connection failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-100">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 uppercase">Admin Portal</h1>
            <p className="text-[10px] font-bold text-slate-400 mt-2 tracking-widest uppercase">Security Verified Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase">Admin Mobile</label>
              <input 
                type="text" 
                placeholder="e.g. 8262006648" 
                value={contact} 
                onChange={(e) => setContact(e.target.value)}
                className="w-full p-5 mt-1 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold text-slate-700"
                required 
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase">Security Code (YYYY-MM-DD)</label>
              <input 
                type="text" 
                placeholder="2003-09-09" 
                value={dob} 
                onChange={(e) => setDob(e.target.value)}
                className="w-full p-5 mt-1 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-indigo-500 font-bold text-slate-700"
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black uppercase tracking-widest shadow-xl shadow-indigo-100 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Authorize Access"}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}
