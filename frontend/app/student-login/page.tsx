"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function StudentLogin() {
  const router = useRouter()
  const [contact, setContact] = useState("")
  const [dob, setDob] = useState("")

  const handleLogin = async (e: any) => {
    e.preventDefault()
    try {
      const res = await fetch("https://college-management-system-ae11.onrender.com/api/auth/login", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, dob, role: "student" })
      })

      const data = await res.json()
      if (data.success) {
        // Dashboard uses 'studentData' key
        localStorage.setItem("studentData", JSON.stringify(data.user)); 
        router.push("/student-dashboard") 
      } else {
        alert(data.message || "Invalid credentials")
      }
    } catch (err) {
      alert("Connection failed")
    }
  }
  // ... (Baqi UI code wahi rahega jo aapne bheja tha)
}
