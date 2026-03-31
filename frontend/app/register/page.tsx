"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserPlus, Loader2 } from "lucide-react"

export default function StudentRegister() {
  const router = useRouter()
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

    // Database mein shuru mein '0' save ho raha hai, wahi format maintain karein
    const formattedContact = formData.contact.startsWith('0') ? formData.contact : `0${formData.contact}`;

    try {
      const res = await fetch("https://college-management-system-ae1l.onrender.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: formData.name,
          contact: formattedContact, 
          dob: formData.dob,
          role: "student",
          // FIX: Backend in fields ko 'required' maang raha hai
          course: "General", 
          password: "123" 
        })
      })

      const data = await res.json()
      if (data.success) {
        alert("Registration Successful! Now you can Login.")
        router.push("/student-login")
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (err) {
      alert("Server connection failed. Try again in 1 minute.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="bg-white p-10 rounded-[40px] shadow-2xl w-full max-w-md border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black uppercase tracking-tighter">New Student</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Registration Protocol</p>
        </div>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <input 
            type="text" placeholder="FULL NAME" 
            className="w-full p-4 rounded-2xl bg-slate-50 border outline-none font-bold"
            onChange={(e) => setFormData({...formData, name: e.target.value})} required 
          />
          <input 
            type="text" placeholder="MOBILE NUMBER" 
            className="w-full p-4 rounded-2xl bg-slate-50 border outline-none font-bold"
            onChange={(e) => setFormData({...formData, contact: e.target.value})} required 
          />
          <input 
            type="email" placeholder="EMAIL ADDRESS" 
            className="w-full p-4 rounded-2xl bg-slate-50 border outline-none font-bold"
            onChange={(e) => setFormData({...formData, email: e.target.value})} required 
          />
          <input 
            type="date" 
            className="w-full p-4 rounded-2xl bg-slate-50 border outline-none font-bold"
            onChange={(e) => setFormData({...formData, dob: e.target.value})} required 
          />
          <button type="submit" disabled={loading} className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest transition-all">
            {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : "Complete Registration"}
          </button>
        </form>
      </div>
    </div>
  )
}
