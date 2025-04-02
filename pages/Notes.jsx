import React, { useEffect, useState } from 'react';
import { db, auth, storage } from "../lib/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, getDocs, query, where, serverTimestamp, updateDoc ,increment, doc, getDoc, deleteDoc} from "firebase/firestore";
import "./Notes.css";

const NotesComponent = () => {
    // State for form and filters
    const [formData, setFormData] = useState({
        title: "",
        course: "",
        year: "",
        semester: "",
        category: "Notes", // Default category
        file: null,
        fileName: "",
        fileURL: "",
        uploadedAt: null,
        likes: 0, // Track number of likes
    });
    const [isAdmin, setIsAdmin] = useState(false);
    const [notes, setNotes] = useState([]);
    const [showForm, setShowForm] = useState(false);

    // Handles form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Handles file selection
    const handleFileChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            file: e.target.files[0],
        }));
    };

    // Fetch notes from Firestore based on filters
    const fetchNotes = async () => {
        const { course, year, semester, category } = formData;
        if (!course || !year || !semester || !category) return;
    
        try {
            const q = query(
                collection(db, "notes"),
                where("course", "==", course),
                where("year", "==", year),
                where("semester", "==", semester),
                where("category", "==", category)
            );
    
            const querySnapshot = await getDocs(q);
            const fetchedNotes = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                title: doc.data().title,
                fileName: doc.data().fileName,
                fileURL: doc.data().fileURL,
                uploadedAt: doc.data().uploadedAt?.toDate().toLocaleString(),
                likes: doc.data().likes ?? 0,  // ✅ Include likes (default to 0 if missing)
            }));
    
            // Prevent unnecessary re-renders
            setNotes((prevNotes) =>
                JSON.stringify(prevNotes) === JSON.stringify(fetchedNotes) ? prevNotes : fetchedNotes
            );
        } catch (error) {
            console.error("❌ Error fetching notes:", error);
        }
    };
    
    // Function to delete a note
    const handleDelete = async (noteId) => {
        try {
            await deleteDoc(doc(db, "notes", noteId));
            alert("Note deleted successfully!");
            await fetchNotes(); // Refresh the notes list
        } catch (error) {
            console.error("Error deleting note:", error);
            alert("Failed to delete note.");
        }
    };

    // Upload file and store details in Firestore
    const handleUpload = async () => {
        const { title, course, year, semester, category, file } = formData;

        if (!title || !course || !year || !semester || !category || !file) {
            alert("Please fill in all fields before uploading.");
            return;
        }

        try {
            const fileRef = ref(storage, `notes/${course}/${year}/${semester}/${category}/${file.name}`);
            await uploadBytes(fileRef, file);
            const fileURL = await getDownloadURL(fileRef);

            await addDoc(collection(db, "notes"), {
                title,
                course,
                year,
                semester,
                category,
                fileName: file.name,
                fileURL,
                uploadedAt: serverTimestamp(),
                likes: 0,
            });

            alert("File uploaded successfully!");

            // Reset form fields
            setFormData({
                title: "",
                course: "",
                year: "",
                semester: "",
                category: "Notes",
                file: null,
                likes: 0, 
            });

            setShowForm(false);
            await fetchNotes(); // Refresh notes list
        } catch (error) {
            console.error("❌ Upload failed:", error);
            alert("Failed to upload file. See console for details.");
        }
    };

    // Fetch notes whenever filters change
    useEffect(() => {
        fetchNotes();
    }, [formData.course, formData.year, formData.semester, formData.category]);



    const handleLike = async (noteId) => {
        console.log(`👍 Like button clicked for note: ${noteId}`);
    
        try {
            const docRef = doc(db, "notes", noteId);
            const docSnap = await getDoc(docRef);
    
            if (docSnap.exists()) {
                const currentLikes = docSnap.data().likes || 0;
                console.log(`📌 Current likes in Firestore: ${currentLikes}`);
    
                // Update Firestore
                await updateDoc(docRef, { likes: currentLikes + 1 });
                console.log(`✅ Likes updated in Firestore!`);
    
                // Update UI instantly
                setNotes((prevNotes) => 
                    prevNotes.map((note) =>
                        note.id === noteId ? { ...note, likes: currentLikes + 1 } : note
                    )
                );
                console.log(`🎉 Likes updated in UI!`);
            } else {
                console.error("❌ Document not found");
            }
        } catch (error) {
            console.error("❌ Error updating likes:", error);
        }
    };
    
    
    useEffect(() => {
        const checkAdmin = async () => {
            const user = auth.currentUser;
            if (!user) return;

            try {
                const adminRef = doc(db, "userAdmin", "Admins");
                const adminSnap = await getDoc(adminRef);

                if (adminSnap.exists()) {
                    const adminEmail = adminSnap.data().email;
                    if (user.email === adminEmail) {
                        setIsAdmin(true);
                    }
                }
            } catch (error) {
                console.error("Error checking admin status:", error);
            }
        };

        checkAdmin();
    }, [auth]);
    

    return (
        <div className="notes-container">
            <h2 className="text-xl font-bold mb-4 text-white ">Upload and View Notes</h2>

            {/* Filter Selection */}
            <div className="flex flex-wrap gap-2 mb-4">
                <select name="course" value={formData.course} onChange={handleInputChange} className="border p-2">
                    <option value="">Select Course</option>
                    <option value="CSE">Computer Science</option>
                    <option value="ECE">Electronics</option>
                    <option value="ME">Mechanical</option>
                    <option value="Civil">Civil Engineering</option>
                </select>

                <select name="year" value={formData.year} onChange={handleInputChange} className="border p-2">
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                </select>

                <select name="semester" value={formData.semester} onChange={handleInputChange} className="border p-2">
                    <option value="">Select Semester</option>
                    <option value="1">Sem 1</option>
                    <option value="2">Sem 2</option>
                    <option value="3">Sem 3</option>
                    <option value="4">Sem 4</option>
                </select>

                <select name="category" value={formData.category} onChange={handleInputChange} className="border p-2">
                    <option value="Lecture Notes">Lecture Notes</option>
                    <option value="PYQ">Previous Year Questions</option>
                    <option value="Assignment">Assignment</option>
                    <option value="Lab">Lab</option>
                </select>
            </div>

            {/* Upload Button */}
            <button onClick={() => setShowForm(true)} className="bg-green-500 text-white p-2 rounded">
                Upload
            </button>

            {/* Notes List */}
            <h3 className="text-lg font-semibold mb-4 mt-4 text-white">Available Notes:</h3>
            {notes.length === 0 ? (
                <p className="text-gray-500">No notes found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {notes.map((note) => (
                        <div key={note.id} className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition relative">
                            <h4 className="text-lg font-semibold text-gray-800 mb-1">{note.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{note.fileName}</p>
                            <p className="text-xs text-gray-500 mb-2">Uploaded on: {note.uploadedAt}</p>
                            <a href={note.fileURL} target="_blank" rel="noopener noreferrer" className="block bg-blue-500 text-white text-center py-1.5 rounded hover:bg-blue-600 transition">
                                View / Download
                            </a>
                            {/* Like button and count */}
                            <div className="flex items-center mt-2">
                                <button 
                                    onClick={() => handleLike(note.id)} 
                                    className="text-red-500 text-lg focus:outline-none"
                                >
                                    ❤️
                                </button>
                                <p className="ml-2 text-gray-700">{note.likes}</p>
                                {isAdmin && (
                                    <button onClick={() => handleDelete(note.id)} className="admin-delete-btn">
                                        Delete
                                    </button>
                                )}

                            </div>

                        </div>
                    ))}
                </div>
            )}

            {/* Upload Form Modal */}
            {showForm && (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div className="p-4 bg-white rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Upload Notes</h2>

            {/* Title Input */}
            <input 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                placeholder="Enter Title" 
                className="border p-2 w-full mb-2 rounded"
            />

            {/* Course Selection */}
            <select 
                name="course" 
                value={formData.course} 
                onChange={handleInputChange} 
                className="border p-2 w-full mb-2 rounded"
            >
                <option value="">Select Course</option>
                <option value="CSE">Computer Science</option>
                <option value="ECE">Electronics</option>
                <option value="ME">Mechanical</option>
                <option value="Civil">Civil Engineering</option>
            </select>

            {/* Year Selection */}
            <select 
                name="year" 
                value={formData.year} 
                onChange={handleInputChange} 
                className="border p-2 w-full mb-2 rounded"
            >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
            </select>

            {/* Semester Selection */}
            <select 
                name="semester" 
                value={formData.semester} 
                onChange={handleInputChange} 
                className="border p-2 w-full mb-2 rounded"
            >
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
            </select>

            {/* Category Selection */}
            <select 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange} 
                className="border p-2 w-full mb-2 rounded"
            >
                <option value="">Select Category</option>
                <option value="Lecture Notes">Lecture Notes</option>
                <option value="Assignments">Assignments</option>
                <option value="Previous Papers">Previous Papers</option>
            </select>

            {/* File Upload */}
            <input 
                type="file" 
                onChange={handleFileChange} 
                className="border p-2 w-full mb-2 rounded"
            />

            {/* Upload Button */}
            <button 
                onClick={handleUpload} 
                className="bg-green-500 text-white p-2 rounded w-full mb-2"
            >
                Upload
            </button>

            {/* Cancel Button */}
            <button 
                onClick={() => setShowForm(false)} 
                className="bg-red-500 text-white p-2 rounded w-full"
            >
                Cancel
            </button>
        </div>
    </div>
)}

        </div>
    );
};

export default NotesComponent;
