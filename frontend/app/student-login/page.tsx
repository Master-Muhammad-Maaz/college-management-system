"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { GraduationCap, Loader2 } from "lucide-react"

export default function StudentLogin() {
  const router = useRouter()
  const [contact, setContact] = useState("")
  const [dob, setDob] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    
    // Database formatting check (Adding '0' if missing)
    const formattedContact = contact.startsWith('0') ? contact : `0${contact}`;

    try {
      // UPDATED LINK: ae1l (l for lion)
      const res = await fetch("https://college-management-system-ae1l.onrender.com/api/auth/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          contact: formattedContact, 
          dob, 
          role: "student" 
        })
      })

      const data = await res.json()
      
      if (data.success) {
        localStorage.setItem("studentData", JSON.stringify(data.user))
        router.push("/student-dashboard")
      } else {
        // Validation error ya wrong credentials yahan handle honge
        alert(`Login Failed: ${data.message || "Invalid credentials"}`)
      }
    } catch (err) {
      console.error("Connection Error:", err)
      alert("Server Connection Failed! Make sure the Render link is correct and active.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-slate-100">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-200">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Student Login</h1>
          <p className="text-[10px] font-bold text-slate-400 mt-2">LINK: AE1L ACTIVE</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <input 
            type="text" placeholder="Mobile (e.g. 8262006648)" 
            value={contact} onChange={(e) => setContact(e.target.value)} 
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 font-medium" required 
          />
          <input 
            type="date" value={dob} onChange={(e) => setDob(e.target.value)} 
            className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 font-medium" required 
          />
          <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-100">
            {loading ? <Loader2 className="animate-spin" size={18} /> : "Verify & Enter"}
          </button>
        </form>
      </div>
    </div>
  )
}
