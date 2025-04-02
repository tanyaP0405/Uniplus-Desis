import React, { useEffect, useState } from "react";
import { Timestamp } from "firebase/firestore"; 
import { db, auth, storage } from "../lib/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";

import "./Announcements.css";

const categories = ["All", "Academic", "Events", "General", "Other"];

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tracks if the current user is an admin
  const [isAdmin, setIsAdmin] = useState(false);

  // Form State
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    author: "",
    category: "",
    imageUrl: "",
    date: "",
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 1) SIMPLE ADMIN CHECK: If email == "tanuadmin@gmail.com"
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    // Listen for user login state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email === "tanuadmin@gmail.com") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // ─────────────────────────────────────────────────────────────────────────────
  // 2) FETCH ANNOUNCEMENTS
  // ─────────────────────────────────────────────────────────────────────────────
  const fetchAnnouncements = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "announcements"));

      if (querySnapshot.empty) {
        console.warn("No announcements found in Firestore!");
      }

      // Map over all announcements
      const announcementsArray = await Promise.all(
        querySnapshot.docs.map(async (announcementDoc) => {
          const announcementData = announcementDoc.data();
          let authorName = "Unknown Author";

          // Fetch author details if userId exists
          if (announcementData.userId) {
            try {
              const userDocRef = doc(db, "loginPage", "userDetails"); // Assuming 'users' stores user info
              // eslint-disable-next-line no-undef
              const userSnapshot = await getDoc(userDocRef);

              if (userSnapshot.exists()) {
                const userData =
                  userSnapshot.data()[`user_${announcementData.userId}`];
                authorName = userSnapshot.data().name || "Unknown Author";
              }
            } catch (error) {
              console.error("Error fetching author details:", error);
            }
          }

          return { id: announcementDoc.id, ...announcementData, authorName };
        })
      );

      setAnnouncements(announcementsArray); // Update state with fetched announcements
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 3) RENDER A SINGLE ANNOUNCEMENT (Unused in final .map, but preserved)
  // ─────────────────────────────────────────────────────────────────────────────
  const renderAnnouncement = (announcements) => {
    return (
      <div
        key={announcements.id}
        className="bg-white shadow-md rounded-lg overflow-hidden border p-4 w-80"
      >
        {/* Announcement Image (Optional) */}
        {announcements.imageUrl && (
          <div className="relative">
            <img
              src={announcements.imageUrl}
              alt={announcements.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Announcement Title */}
        <h3 className="text-lg font-bold text-gray-800 mt-2">
          {announcements.title}
        </h3>

        {/* Author & Date */}
        <p className="text-sm text-gray-600">
          <strong>By:</strong> {announcements.author || "Unknown"}
        </p>
        <p className="text-sm text-gray-600">
          <strong>Date:</strong>{" "}
          {announcements.date?.toDate?.().toLocaleDateString() || "Not Available"}
        </p>
        {/* Category */}
        <p className="text-sm text-gray-500 mt-1">
          <strong>Category:</strong> {announcements.category}
        </p>

        {/* Announcement Content */}
        <p className="text-sm text-gray-500 mt-2">{announcements.content}</p>

        {/* Delete Button (Only for the Author OR an Admin) */}
        {(auth.currentUser?.uid === announcements.userId || isAdmin) && (
          <button
            onClick={() => handleDeleteAnnouncement(announcements.id)}
            className="text-red-500 font-bold mt-2"
          >
            Delete
          </button>
        )}
      </div>
    );
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 4) LOAD ANNOUNCEMENTS ON MOUNT
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (announcements.date) {
      setNewAnnouncement((prev) => ({
        ...prev,
        date: announcements.date.toDate().toISOString().split("T")[0], // Convert to "YYYY-MM-DD"
      }));
    }
  }, [announcements]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 5) FILTER ANNOUNCEMENTS BY CATEGORY
  // ─────────────────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredAnnouncements(announcements);
    } else {
      setFilteredAnnouncements(
        announcements.filter((item) => item.category === activeCategory)
      );
    }
  }, [activeCategory, announcements]);

  // ─────────────────────────────────────────────────────────────────────────────
  // 6) FORM HANDLERS
  // ─────────────────────────────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    setNewAnnouncement({
      ...newAnnouncement,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewAnnouncement({
        ...newAnnouncement,
        imageUrl: URL.createObjectURL(file),
      });
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 7) SUBMIT NEW ANNOUNCEMENT
  // ─────────────────────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const announcementToSave = {
      ...newAnnouncement,
      date: Timestamp.fromDate(new Date(newAnnouncement.date)), // Convert "YYYY-MM-DD" to Firestore Timestamp
    };

    try {
      let imageUrl = "";

      // Upload Image if provided
      if (newAnnouncement.imageUrl) {
        const imageRef = ref(storage, `images/${Date.now()}`);
        const response = await fetch(newAnnouncement.imageUrl);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "announcements"), {
        ...newAnnouncement,
        imageUrl, // Store uploaded image URL
        userId: auth.currentUser.uid,
      });
      alert("Announcement Added Successfully!");
      setShowForm(false);

      // Reset form state
      setNewAnnouncement({
        title: "",
        content: "",
        author: "",
        category: "",
        imageUrl: "",
        date: new Date().toISOString().split("T")[0],
      });

      fetchAnnouncements(); // Refresh announcements
    } catch (error) {
      console.error("Error adding announcement:", error);
      alert("Failed to add announcement");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 8) DELETE AN ANNOUNCEMENT
  // ─────────────────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await deleteDoc(doc(db, "announcements", id));
        alert("Announcement Deleted!");
        fetchAnnouncements(); // Refresh announcements
      } catch (error) {
        console.error("Error deleting announcement:", error);
        alert("Failed to delete announcement");
      }
    }
  };

  // ALIAS for "renderAnnouncement" delete button logic (kept to avoid removing code)
  const handleDeleteAnnouncement = (id) => {
    handleDelete(id);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  // 9) RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div className="container futuristic-container">

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`category-filter-button mtab-button ${activeCategory === cat ? "active" : ""}`}

            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Add Announcement Button (Visible ONLY if isAdmin is true) */}
      {isAdmin && (
        <button className="add-button" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "➕ Add Announcement"}
        </button>
      )}

      {/* Announcement Form */}
      {showForm && (
        <form className="announcement-form" onSubmit={handleSubmit}>
          <h2>Add New Announcement</h2>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newAnnouncement.title}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="content"
            placeholder="Content"
            value={newAnnouncement.content}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="author"
            placeholder="Author"
            value={newAnnouncement.author}
            onChange={handleInputChange}
            required
          />
          <select
            name="category"
            value={newAnnouncement.category}
            onChange={handleInputChange}
            required
          >
            <option value="">Select Category</option>
            {categories.slice(1).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="file"
            onChange={handleImageChange}
            disabled={isSubmitting}
          />
          <input
            type="date"
            name="date"
            value={newAnnouncement.date}
            onChange={handleInputChange}
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit Announcement"}
          </button>
        </form>
      )}

      {/* Announcement List */}
      <div className="announcement-list animated-bg">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((item) => (
            <div key={item.id} className="announcement-item glassy-announcement">
              <h3>{item.title}</h3>
              <p>
                <strong>{item.author}</strong> |{" "}
                {item.date?.seconds
                  ? new Date(item.date.seconds * 1000).toLocaleDateString()
                  : "Not Available"}
              </p>
              <p>{item.content}</p>
              {item.imageUrl && <img src={item.imageUrl} alt="Announcement" />}

              {/* Delete Button (Visible if user is admin OR the announcement author) */}
              {(isAdmin || auth.currentUser?.uid === item.userId) && (
                <button
                  className="delete-button"
                  onClick={() => handleDelete(item.id)}
                >
                  ❌ Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No announcements found.</p>
        )}
      </div>
    </div>
  );
};

export default Announcements;
