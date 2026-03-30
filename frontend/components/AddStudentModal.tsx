// Replace inside AddStudentModal.tsx -> handleFileUpload function:
const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if(!file) return;
  const data = new FormData();
  data.append("file", file);
  data.append("fallbackCourse", course); // Ye missing tha!

  setLoading(true);
  try {
    const res = await fetch(`${API_BASE}/api/students/import-excel`, { 
      method: "POST", 
      body: data 
    });
    const result = await res.json();
    if (result.success) {
      fetchStudents();
      alert(result.message);
      onClose();
    } else {
      alert(result.message);
    }
  } catch (err) { alert("Excel upload failed."); }
  setLoading(false);
};

// Replace the Clear Batch button at the bottom:
<button 
  onClick={() => {
    const pincode = prompt("Enter PIN to clear this batch:");
    if(pincode === "1234") {
       // Yahan Clear Batch ka API call dashboard ki tarah add kar sakte hain
       alert("Batch will be cleared. Please use the main Admin Panel button for safety.");
    }
  }}
  className="flex flex-col items-center justify-center gap-3 bg-red-50/30 border border-red-50 p-6 rounded-3xl hover:bg-red-50 transition-all group"
>
  <Trash2 size={20} className="text-red-400 group-hover:scale-110 transition-transform"/>
  <span className="text-[9px] font-black uppercase text-red-400">Clear Batch</span>
</button>
