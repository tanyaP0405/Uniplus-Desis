
import React, { useState, useEffect } from "react";
import { db, auth, storage } from "../lib/firebaseConfig";
import {  collection,  addDoc,  getDocs,  deleteDoc,  doc,  getDoc,  updateDoc,  arrayUnion,  setDoc} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./LostFound.css";

const LostAndFound = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [notifModalVisible, setNotifModalVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    date: "",
    description: "",
    type: "lost",
    image: null,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch all items from "lostAndFound" collection
  const fetchItems = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "lostAndFound"));
      const itemsArray = await Promise.all(
        querySnapshot.docs.map(async (itemDoc) => {
          const itemData = itemDoc.data();
          let userName = "Unknown User";

          if (itemData.userId) {
            const userDocRef = doc(db, "loginPage", "userDetails");
            const userSnapshot = await getDoc(userDocRef);
            if (userSnapshot.exists()) {
              const userData = userSnapshot.data()[`user_${itemData.userId}`];
              if (userData) {
                userName = userData.name;
              }
            }
          }
          return { id: itemDoc.id, ...itemData, userName };
        })
      );
      setItems(itemsArray);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  // Fetch notifications for the currently logged-in user
  const fetchNotifications = async () => {
    if (!auth.currentUser) return;
    try {
      const notifDocRef = doc(db, "notifications", auth.currentUser.uid);
      const notifSnapshot = await getDoc(notifDocRef);
      if (notifSnapshot.exists()) {
        const data = notifSnapshot.data();
        setNotifications(data.notifications || []);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Add a new lost/found item
  const handleAddItem = async () => {
    if (!auth.currentUser) {
      alert("You must be logged in to add items.");
      return;
    }

    if (
      !formData.title ||
      !formData.location ||
      !formData.date ||
      !formData.description ||
      !formData.image
    ) {
      alert("All fields are required!");
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = "";
      if (formData.image) {
        const imageRef = ref(storage, `images/${Date.now()}`);
        const response = await fetch(formData.image);
        const blob = await response.blob();
        await uploadBytes(imageRef, blob);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "lostAndFound"), {
        ...formData,
        imageUrl,
        userId: auth.currentUser.uid,
      });

      setIsSubmitting(false);
      setModalVisible(false);
      alert("Item added successfully!");
      // Refresh page or re-fetch items
      window.location.reload();
    } catch (error) {
      console.error("Error adding item:", error);
      alert("Error adding item. Check console for details.");
      setIsSubmitting(false);
    }
  };

  // Delete an item (only by the user who posted it)
  const handleDeleteItem = async (itemId, userId) => {
    if (auth.currentUser?.uid !== userId) {
      alert("You can only delete your own items!");
      return;
    }

    try {
      await deleteDoc(doc(db, "lostAndFound", itemId));
      alert("Item deleted successfully!");
      fetchItems();
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item. Check console for details.");
    }
  };

  // Send a notification to the user who posted the item
  const handleNotify = async (item) => {
    console.log("handleNotify called for item:", item);
    if (!auth.currentUser) {
      alert("You must be logged in to send notifications.");
      return;
    }
    // Prevent sending notification to your own item
    if (auth.currentUser.uid === item.userId) {
      alert("You cannot send a notification to yourself!");
      return;
    }

    // Fetch the name of the currently logged-in user
    let currentUserName = auth.currentUser.displayName || "A user on the platform";
     let currentUserEmail = auth.currentUser.email || "unknownEmail";
    try {
      // Attempt to fetch from "loginPage" -> "userDetails"
      const userDocRef = doc(db, "loginPage", "userDetails");
      const userSnapshot = await getDoc(userDocRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data()[`user_${auth.currentUser.uid}`];
        if (userData && userData.name) {
          currentUserName = userData.name;
        }
        if (userData && userData.email) {
          currentUserEmail = userData.email;
        }
      }
    } catch (err) {
      console.log("Error fetching current user name:", err);
    }

    // Determine the button type and buildlet currentUserEmail = auth.currentUser.email || "unknownEmail";
let notifMessage = "";
    
if (item.type === "lost") {
  notifMessage = `${currentUserName} wants to notify you that they found "${item.title}" which you reported lost. Their email is ${currentUserEmail}.`;
} else if (item.type === "found") {
  notifMessage = `${currentUserName} wants to notify you that they lost "${item.title}" which you reported found. Their email is ${currentUserEmail}.`;
}

    const notifDocRef = doc(db, "notifications", item.userId);

    try {
      // Try to update existing doc
      await updateDoc(notifDocRef, {
        notifications: arrayUnion({
          message: notifMessage,
          timestamp: new Date().toISOString(),
        }),
      });
      alert("Notification sent successfully!");
      console.log("Notification updated to existing doc");
    } catch (error) {
      // If doc doesn't exist or other error
      console.log("Error updating doc, will try setDoc:", error);
      try {
        await setDoc(notifDocRef, {
          notifications: [
            { message: notifMessage, timestamp: new Date().toISOString() },
          ],
        });
        alert("Notification sent successfully!");
        console.log("Notification set to new doc");
      } catch (err) {
        console.error("Error creating notification doc:", err);
        alert("Error sending notification. Check console for details.");
      }
    }
  };

  // Handle image file selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, image: URL.createObjectURL(file) });
    }
  };

  // Render each item in the list
  const renderItem = (item) => {
    if (activeTab !== "all" && item.type !== activeTab) return null;
    return (
      <div key={item.id} className="item-card">
        <img src={item.imageUrl} alt={item.title} />
        <p>
          <strong>{item.type.toUpperCase()}:</strong> {item.title}
        </p>
        <p>
          <strong>Location:</strong> {item.location}
        </p>
        <p>
          <strong>Date:</strong> {item.date}
        </p>
        <p>
          <strong>Description:</strong> {item.description}
        </p>
        <p>
          <strong>Uploaded by:</strong> {item.userName}
        </p>
        {auth.currentUser?.uid === item.userId && (
          <button
            onClick={() => handleDeleteItem(item.id, item.userId)}
            style={{ color: "red" }}
          >
            Delete
          </button>
        )}
        {/* Notification button, visible only if user is logged in and not the owner */}
        {auth.currentUser && auth.currentUser.uid !== item.userId && (
          <button onClick={() => handleNotify(item)} className="notify-button">
            {item.type === "lost" ? "I Found This!" : "I Lost This!"}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="lost-found-container">
      <div className="tabs">
        {["all", "lost", "found"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
          >
            {tab === "all"
              ? "All Items"
              : tab === "lost"
              ? "Lost Items"
              : "Found Items"}
          </button>
        ))}
      </div>

      <button
        onClick={() => {
          if (!auth.currentUser) {
            alert("Please log in to add an item");
          } else {
            setModalVisible(true);
          }
        }}
        className="submit-button"
      >
        Report Lost/Found Item
      </button>
      
      {/* Floating Notifications Button (bottom-right) */}
      {auth.currentUser && (
        <button
          className="floating-notif-button"
          
          onClick={() => {
            fetchNotifications();
            setNotifModalVisible(true);
          }}
        >
          Notifications
        </button>
      )}

      <div className="items-container">{items.map((item) => renderItem(item))}</div>

      {/* Modal overlay for adding a new item */}
      {modalVisible && (
        <>
          <div
            className="modal-overlay"
            onClick={() => setModalVisible(false)}
          ></div>
          <div className="modal-form">
            <h3>Add Lost/Found Item</h3>
            <input
              type="text"
              placeholder="Title"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              value={formData.title}
              disabled={isSubmitting}
            />
            <input
              type="text"
              placeholder="Location"
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              value={formData.location}
              disabled={isSubmitting}
            />
            <input
              type="text"
              placeholder="Date (YYYY-MM-DD)"
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
              value={formData.date}
              disabled={isSubmitting}
            />
            <textarea
              placeholder="Description"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              value={formData.description}
              disabled={isSubmitting}
            />
            <input
              type="file"
              onChange={handleImageChange}
              disabled={isSubmitting}
            />
            {/* Added radio buttons for item type selection */}
            <label style={{ marginTop: "10px", fontWeight: "bold"  }}>
              Item Type:
            </label>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <label>
                <input
                  type="radio"
                  value="lost"
                  checked={formData.type === "lost"}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  disabled={isSubmitting}
                />
                Lost
              </label>
              <label>
                <input
                  type="radio"
                  value="found"
                  checked={formData.type === "found"}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  disabled={isSubmitting}
                />
                Found
              </label>
            </div>
            <button
              onClick={handleAddItem}
              disabled={isSubmitting}
              className="custom-submit-button"
            >
              <span className="custom-button-text">
                {isSubmitting ? "Submitting..." : "Submit"}
              </span>
            </button>

          </div>
        </>
      )}
    

      {/* Notifications Modal (centered) */}
      {notifModalVisible && (
  <>
    <div
      className="custom-notif-overlay"
      onClick={() => setNotifModalVisible(false)}
    ></div>

    <div className="custom-notif-modal">
      <h3 className="custom-notif-title">🔔 Your Notifications</h3>

      {notifications.length === 0 ? (
        <p className="custom-notif-empty">No notifications yet.</p>
      ) : (
        <ul className="custom-notif-list">
          {notifications.map((notif, index) => (
            <li key={index} className="custom-notif-item">
              <p className="custom-notif-message">{notif.message}</p>
              <small className="custom-notif-timestamp">
                📅 {new Date(notif.timestamp).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={() => setNotifModalVisible(false)}
        className="custom-notif-close-btn"
      >
        Close ✨
      </button>
    </div>
  </>
)}


    </div>
  );
};

export default LostAndFound;
