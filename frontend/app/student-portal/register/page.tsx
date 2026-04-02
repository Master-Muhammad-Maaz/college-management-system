"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Lock, BookOpen, Hash, Camera, Loader2, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

export default function StudentRegister() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rollNo: "",
    course: "B.Sc-I",
    profilePic: ""
  })

  // Handle Image Selection & Preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setPreview(base64)
        setFormData({ ...formData, profilePic: base64 })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("https://college-management-system-ae1l.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        alert("Registration Successful! Please Login.")
        router.push("/student-portal/login")
      } else {
        alert(data.message)
      }
    } catch (err) {
      alert("Server error. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-slate-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white w-full max-w-xl rounded-[50px] shadow-2xl p-10 border border-slate-100"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900">Student Join</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">Create your professional profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Upload Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div className="w-24 h-24 rounded-[35px] bg-slate-100 border-2 border-dashed border-slate-200 overflow-hidden flex items-center justify-center transition-all group-hover:border-blue-400">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="text-slate-300" size={32} />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-2 rounded-xl cursor-pointer shadow-lg hover:bg-blue-700 transition-all">
                <Hash size={14} />
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
            <p className="text-[9px] font-bold text-slate-400 uppercase mt-4 tracking-widest">Upload Profile Photo</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" required placeholder="John Doe"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={(e) => setFormData({...formData, name: e.target.value.toUpperCase()})}
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="email" required placeholder="john@example.com"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            {/* Roll Number */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Roll Number</label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  type="text" required placeholder="e.g. 2026-01"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                />
              </div>
            </div>

            {/* Course Selection */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Select Course</label>
              <div className="relative">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <select 
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none appearance-none"
                  onChange={(e) => setFormData({...formData, course: e.target.value})}
                >
                  <option value="B.Sc-I">B.Sc-I</option>
                  <option value="B.Sc-II">B.Sc-II</option>
                  <option value="B.Sc-III">B.Sc-III</option>
                  <option value="M.Sc-I">M.Sc-I</option>
                  <option value="M.Sc-II">M.Sc-II</option>
                  <option value="M.Sc-III">M.Sc-III</option>
                </select>
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Secure Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="password" required placeholder="••••••••"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button 
            type="submit" disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-[25px] font-black text-[12px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Complete Registration <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </motion.div>
  )
}
