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
    
    // Database mein number '0' ke saath save hai, isliye hum check kar rahe hain
    const formattedContact = contact.startsWith('0') ? contact : `0${contact}`;

    try {
      const res = await fetch("https://college-management-system-ae11.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact: formattedContact, dob, role: "student" })
      })

      const data = await res.json()
      if (data.success) {
        localStorage.setItem("studentData", JSON.stringify(data.user));
        router.push("/student-dashboard") 
      } else {
        alert(data.message || "Invalid credentials")
      }
    } catch (err) {
      alert("Server connection failed. Make sure Backend is awake!");
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-slate-100">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-4">
            <GraduationCap size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 uppercase">Student Login</h1>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <input 
            type="text" placeholder="Mobile (e.g. 8262006648)" 
            value={contact} onChange={(e) => setContact(e.target.value)} 
            className="w-full p-4 rounded-2xl bg-slate-50 border outline-none focus:border-blue-500" required 
          />
          <input 
            type="date" value={dob} onChange={(e) => setDob(e.target.value)} 
            className="w-full p-4 rounded-2xl bg-slate-50 border outline-none focus:border-blue-500" required 
          />
          <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest">
            {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : "Login Now"}
          </button>
        </form>
      </div>
    </div>
  )
}
