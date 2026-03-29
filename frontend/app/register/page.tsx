"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { motion } from "framer-motion"
import Link from "next/navigation"
import { UserPlus, Loader2, ArrowLeft, UserCircle } from "lucide-react"

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "student" // URL se role lega

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    dob: "",
    email: ""
  })
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      // Backend route authRoutes.js se connect hoga
      const res = await fetch("https://college-management-system-ae1l.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        alert("Registration Successful!")
        router.push(role === "admin" ? "/admin-login" : "/student-login")
      } else {
        alert(data.message || "Registration failed.")
      }
    } catch (error) {
      alert("Server error. Check your connection.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="w-full max-w-[550px]"
      >
        {/* Header Section */}
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-blue-50 rounded-[25px] text-blue-600 mb-5 shadow-sm border border-blue-100">
            <UserPlus size={35} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-black text-[#0f172a] tracking-tighter uppercase">
             Create {role === "admin" ? "Admin" : "Student"}
          </h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">
            Institutional Identity Protocol
          </p>
        </div>

        <div className="bg-white p-10 md:p-12 rounded-[50px] border border-slate-100 shadow-2xl shadow-slate-200/50">
          <form onSubmit={handleRegister} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] ml-2">Full Legal Name</label>
                <input 
                  type="text" 
                  placeholder="MOHAMMAD MAAZ" 
                  value={formData.name} 
                  onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})} 
                  className="w-full p-5 rounded-2xl bg-slate-50 text-slate-900 outline-none border border-slate-100 focus:border-blue-600 focus:bg-white transition-all font-bold uppercase shadow-inner" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <label className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] ml-2">Contact ID</label>
                <input 
                  type="text" 
                  placeholder="98XXXXXXXX" 
                  value={formData.contact} 
                  onChange={(e) => setFormData({...formData, contact: e.target.value})} 
                  className="w-full p-5 rounded-2xl bg-slate-50 text-slate-900 outline-none border border-slate-100 focus:border-blue-600 focus:bg-white transition-all font-bold shadow-inner" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] ml-2">Email Address</label>
              <input 
                type="email" 
                placeholder="maaz@codematrix.com" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                className="w-full p-5 rounded-2xl bg-slate-50 text-slate-900 outline-none border border-slate-100 focus:border-blue-600 focus:bg-white transition-all font-bold shadow-inner" 
                required 
              />
            </div>

            <div className="space-y-2">
              <label className="text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] ml-2">Date of Birth</label>
              <input 
                type="date" 
                value={formData.dob} 
                onChange={(e) => setFormData({...formData, dob: e.target.value})} 
                className="w-full p-5 rounded-2xl bg-slate-50 text-slate-900 outline-none border border-slate-100 focus:border-blue-600 focus:bg-white transition-all font-bold uppercase shadow-inner" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-6 rounded-3xl font-black text-[10px] uppercase tracking-[0.3em] text-white bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Finalize Registration"}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 text-center flex flex-col items-center gap-4">
            <Link 
              href={role === "admin" ? "/admin-login" : "/student-login"} 
              className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors"
            >
              <ArrowLeft size={14}/> Back to Login
            </Link>
          </div>
        </div>

        <p className="text-center mt-10 text-[9px] font-black text-slate-300 uppercase tracking-[0.5em]">
          Powered by CodeMatrix Software Solution
        </p>
      </motion.div>
    </div>
  )
}

// Next.js client-side navigation wrap
export default function Register() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  )
}
