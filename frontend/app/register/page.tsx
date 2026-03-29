"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, Suspense } from "react"
import { motion } from "framer-motion"
import Link from "next/link" // Fixed: Imported from next/link
import { UserPlus, Loader2, ArrowLeft, ShieldCheck } from "lucide-react"

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get("role") || "student"

  const [formData, setFormData] = useState({ name: "", contact: "", dob: "", email: "" })
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("https://college-management-system-ae1l.onrender.com/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        alert("Registration Successful!")
        router.push(role === "admin" ? "/admin-login" : "/student-login")
      } else { alert(data.message || "Registration failed.") }
    } catch (error) { alert("Server error.") } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[500px]">
        <div className="flex flex-col items-center mb-10">
          <div className="p-4 bg-blue-50 rounded-[25px] text-blue-600 mb-5 border border-blue-100 shadow-sm">
            <UserPlus size={32} />
          </div>
          <h1 className="text-3xl font-[1000] text-[#0f172a] tracking-tighter uppercase">New {role}</h1>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mt-2">Registration Protocol</p>
        </div>

        <div className="bg-white p-10 rounded-[50px] border border-slate-100 shadow-2xl shadow-slate-200/50">
          <form onSubmit={handleRegister} className="space-y-5">
            <input type="text" placeholder="FULL NAME" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})} className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-600 font-bold uppercase" required />
            <input type="text" placeholder="CONTACT NUMBER" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})} className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-600 font-bold" required />
            <input type="email" placeholder="EMAIL ADDRESS" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-600 font-bold" required />
            <input type="date" value={formData.dob} onChange={(e) => setFormData({...formData, dob: e.target.value})} className="w-full p-5 rounded-2xl bg-slate-50 border border-slate-100 outline-none focus:border-blue-600 font-bold uppercase" required />
            
            <button type="submit" disabled={loading} className="w-full py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] text-white bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" size={18} /> : "Complete Registration"}
            </button>
          </form>
          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
             <Link href={role === "admin" ? "/admin-login" : "/student-login"} className="text-slate-400 text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:text-blue-600 transition-colors">
               <ArrowLeft size={12}/> Already Registered? Login
             </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function Register() {
  return <Suspense fallback={null}><RegisterContent /></Suspense>
}
