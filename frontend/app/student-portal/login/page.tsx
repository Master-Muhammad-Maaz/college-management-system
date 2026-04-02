"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

export default function StudentLogin() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({ email: "", password: "" })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("https://college-management-system-ae1l.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      
      if (data.success) {
        // Session Save: Isme Name, Course aur Photo sab save ho jayega
        localStorage.setItem("studentAuth", JSON.stringify(data.student))
        
        // Automatic Redirect based on Course
        alert(`Welcome ${data.student.name}! Redirecting to ${data.student.course} Dashboard...`)
        router.push("/student-portal/dashboard") 
      } else {
        alert(data.message)
      }
    } catch (err) {
      alert("Login failed. Check your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white w-full max-w-md rounded-[50px] shadow-2xl p-10 border border-slate-100"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[22px] flex items-center justify-center mx-auto mb-4 shadow-sm border border-blue-100">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">Student Portal</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Enter credentials to access {formData.email ? 'your' : 'secure'} dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="email" required placeholder="name@college.com"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" required placeholder="••••••••"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-[25px] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In Now <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
            Don't have an account? 
            <span 
              onClick={() => router.push("/student-portal/register")}
              className="text-blue-600 ml-2 cursor-pointer hover:underline"
            >
              Register Here
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
