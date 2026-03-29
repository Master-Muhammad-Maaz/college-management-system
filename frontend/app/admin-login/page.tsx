"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
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
      const backendUrl = "https://college-management-system-ae1l.onrender.com/api/login"
      const res = await fetch(backendUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, dob, role: "admin" })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        if (data.token) localStorage.setItem("token", data.token)
        router.push("/admin/students")
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
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-[480px]"
      >
        {/* Logo/Icon Area */}
        <div className="flex flex-col items-center mb-12">
          <div className="p-5 bg-blue-50 rounded-[30px] text-blue-600 mb-6 shadow-sm border border-blue-100">
            <ShieldCheck size={40} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-[1000] text-[#0f172a] text-center tracking-tighter uppercase">
            Admin Portal
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">
            Secure Infrastructure Access
          </p>
        </div>
        
        <div className="bg-white p-10 md:p-14 rounded-[50px] border border-slate-100 shadow-2xl shadow-slate-200/50">
          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-2">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">
                Contact Identity
              </label>
              <input 
                type="text" 
                placeholder="Enter registered number" 
                value={contact} 
                onChange={(e) => setContact(e.target.value)} 
                className="w-full p-6 rounded-3xl bg-slate-50 text-slate-900 outline-none border border-slate-100 focus:border-blue-600 focus:bg-white transition-all font-bold placeholder:text-slate-300 shadow-inner" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] ml-2">
                Security Key (DOB)
              </label>
              <input 
                type="date" 
                value={dob} 
                onChange={(e) => setDob(e.target.value)} 
                className="w-full p-6 rounded-3xl bg-slate-50 text-slate-900 outline-none border border-slate-100 focus:border-blue-600 focus:bg-white transition-all font-bold uppercase shadow-inner" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.3em] text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Verifying...
                </>
              ) : "Authorize Access"}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-50 text-center">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
              New Administrator?{" "}
              <Link href="/register?role=admin" className="text-blue-600 hover:underline decoration-2 underline-offset-4 transition-all">
                Create Account
              </Link>
            </p>
          </div>
        </div>

        {/* System Footer */}
        <p className="text-center mt-10 text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
          Powered by CodeMatrix Software Solution
        </p>
      </motion.div>
    </div>
  )
}
