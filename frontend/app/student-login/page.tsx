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

    // 1. Trim spaces and handle '0' prefix
    const cleanContact = contact.trim()
    const formattedContact = cleanContact.startsWith('0') ? cleanContact : `0${cleanContact}`

    try {
      const res = await fetch("https://college-management-system-ae1l.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contact: formattedContact,
          dob: dob.trim(), // Trim DOB as well
          role: "student"
        })
      })

      const data = await res.json()

      if (data.success) {
        // Data save karne se pehle purana clear kar dena behtar hai
        localStorage.removeItem("studentData")
        localStorage.setItem("studentData", JSON.stringify(data.user))
        router.push("/student-dashboard")
      } else {
        // Detailed error message taaki aapko pata chale masla kya hai
        alert(`Login Failed: ${data.message}`)
      }
    } catch (err) {
      console.error("Connection Error:", err)
      alert("Server Connection Failed! Check if the Render link is active.")
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
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
            Student Login
          </h1>
          <p className="text-[10px] font-bold text-slate-400 mt-2 tracking-[2px]">
            LINK: AE1L ACTIVE
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase">Mobile Number</label>
            <input
              type="text"
              placeholder="e.g. 8262006648"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full p-4 mt-1 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 font-bold text-slate-700"
              required
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 ml-2 uppercase">Date of Birth</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              className="w-full p-4 mt-1 rounded-2xl bg-slate-50 border border-slate-200 outline-none focus:border-blue-500 font-bold text-slate-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-200 disabled:bg-slate-300"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              "Verify & Enter"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
