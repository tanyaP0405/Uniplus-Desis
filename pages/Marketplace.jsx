
import React, { useEffect, useState,useRef } from 'react';

const ItemCard = ({ item, handleDeleteItem, setSelectedItem, setIsModalOpen, handleContactClick }) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        if (!item?.isBidding || !item?.biddingEnds) return;

        const endTime = new Date(item.biddingEnds.trim());
        if (isNaN(endTime.getTime())) {
            console.error("Invalid Date Format:", item.biddingEnds);
            return;
        }

        const updateCountdown = () => {
            const now = new Date();
            const diff = endTime - now;

            if (diff <= 0) {
                setTimeLeft("Bidding Ended");
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [item.biddingEnds, item.isBidding]);

    return (
       <div key={item.id} className="market-item-card">

            {/* Item Image */}
            <div className="image-container">
                <img src={item.imageUrl} alt={item.title} className="item-image" />
                {item.isBidding && (
                    <div className="auction-info">
                        <span className="auction-badge">Auction</span>
                        <span className="time-left-badge">{timeLeft}</span> {/* Timer */}
                    </div>
                )}
            </div>

            {/* Price / Bid Amount */}
            <div className="price">
                {item.isBidding ? (
                    <span className="bid-amount">Current Bid: ₹{item.bidAmount}</span>
                ) : (
                    <span className="fixed-price">₹{item.price}</span>
                )}
            </div>
            <br></br>
            {/* Item Details */}

            <h2 className="item-title"><b>{item.title}</b></h2>
            <p className="item-meta">{item.category} • {item.condition}</p>
            <p className="seller-info"><strong>Uploaded by:</strong> {item.userName}</p>
            <p className="item-description">{item.description}</p>

            {/* Delete & View Bidder Buttons (Only for Owner) */}
            {auth.currentUser?.uid === item.userId && (
                <div className="owner-actions">
                    <button onClick={() => handleDeleteItem(item.id, item.userId)} className="delete-btn">
                        Delete Item
                    </button>
                    <button onClick={() => alert(`Last Bidder's Email: ${item.lastBidderEmail || "Not Available"}`)} className="view-bidder-btn">
                        View Last Bidder
                    </button>
                </div>
            )}

            {/* Action Buttons */}
            <div className="item-actions">
            {auth.currentUser?.uid !== item.userId && (
                <>
                <button onClick={() => handleContactClick(item.userEmail)} className="contact-btn">
                    Contact Seller
                </button>

                {item.isBidding && (
                    <button onClick={() => { setSelectedItem(item); setIsModalOpen(true); }} className="bid-btn">
                    Place Bid
                    </button>
                )}
                </>
            )}
            </div>


        </div>
    );
};

import { db, auth, storage } from "../lib/firebaseConfig";
import { collection, addDoc, getDocs, deleteDoc, doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./Marketplace.css";

const Marketplace = () => {
    const categories = ["All", "Electronics", "Books", "Furniture", "Clothing","Other"];
    const [activeCategory, setActiveCategory] = useState("All");
    const [items, setItems] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bidIncrement, setBidIncrement] = useState(""); 
    const [timeLeft, setTimeLeft] = useState(null);
    const bidModalRef = useRef(null);

useEffect(() => {
    if (isModalOpen && bidModalRef.current) {
        bidModalRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}, [isModalOpen]);

        const [formData, setFormData] = useState({
            contactMessage: '',
            contactEmail: '',
            bidAmount: null,
            title: '',
            description: '',
            price: '',
            condition: 'Like New',
            category: 'Books',
            imageUrl: '',
            isBidding: false,
            biddingEnds: null,
            lastBidderName: '',
            lastBidderEmail: ''
        });

        const filteredItems = items.filter((item) => 
            activeCategory === "All" || item.category === activeCategory
        );
    
        const handleContactClick = (email) => {
            setSelectedEmail(email);

            setTimeout(() => {
                document.getElementById("email-modal").scrollIntoView({ behavior: "smooth", block: "center" });
            }, 100);
        };
    
        useEffect(() => {fetchItems();}, []);

        const fetchItems = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "marketplace"));
                
                if (querySnapshot.empty) {
                    console.warn("No items found in Firestore!");
                }
        
                const itemsArray = await Promise.all(
                    querySnapshot.docs.map(async (itemDoc) => {
                        const itemData = itemDoc.data();
                        let userName = "Unknown User";
                        let userEmail =  itemData.contactEmail || "Not Available";
        
                        if (itemData.userId) {
                            try {
                                const userDocRef = doc(db, "loginPage", "userDetails");
                                const userSnapshot = await getDoc(userDocRef);
        
                                if (userSnapshot.exists()) {
                                    const userData = userSnapshot.data()[`user_${itemData.userId}`];
                                    userName = userData?.name || "Unknown User";
                                                                
                                }
                            } catch (error) {
                                console.error("Error fetching user details:", error);
                            }
                        }
        
                        return { id: itemDoc.id, ...itemData, userName ,userEmail};
                    })
                );
        
                setItems(itemsArray);
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        const handleDeleteItem = async (itemId, userId) => {
            if (auth.currentUser?.uid !== userId) {
            alert("You can only delete your own items!");
            return;
            }
        
            await deleteDoc(doc(db, "marketplace", itemId));
            alert("Item deleted successfully!");
            fetchItems();
        };
        
    const user = auth.currentUser; 

        const handleBidSubmit = async (item) => {
            if (!bidIncrement || isNaN(bidIncrement) || bidIncrement <= 0) {
                alert("Please enter a valid bid amount!");  return;
            }

            if (!user) { 
                alert("You must be logged in to place a bid!"); return;
            }

            const currentTime = new Date(); // Get current date & time
            const biddingEndTime = new Date(item.biddingEnds); // Convert stored date

            if (currentTime >= biddingEndTime) {
                alert("Bidding time has ended! You can no longer place a bid.");
                return;
            }

            const newBid = parseFloat(item.bidAmount) + parseFloat(bidIncrement);

            try {
                console.log("Updating item with ID:", item.id);
                
                const itemRef = doc(db, "marketplace", item.id);
                await updateDoc(itemRef, {
                    bidAmount: newBid,           
                    lastBidderEmail: user?.email || "Not Available",           
                });

                alert(`Bid increased by ₹${bidIncrement}! New bid amount: ₹${newBid}`);
                setIsModalOpen(false);
                setBidIncrement(""); // Reset input field
                setSelectedItem(null);
                window.location.reload(); // Clear selected item after bidding
            } catch (error) {
                console.error("Error placing bid:", error);
            }
        };

        const handleAddItem = async () => {
            if (!auth.currentUser) {
              alert("You must be logged in to add items.");
              return;
            }
          
            // Validate form fields
            if (!formData.contactMessage || !formData.contactEmail || !formData.bidAmount || 
                !formData.title || !formData.description || !formData.price || 
                !formData.condition || !formData.category || !formData.image || 
                (formData.isBidding === true && !formData.biddingEnds)) {
              alert("All fields are required!");
              return;
            }
          
            setIsSubmitting(true);
          
            try {
              let imageUrl = "";
          
              // Upload Image if provided
              if (formData.image) {
                const imageRef = ref(storage, `images/${Date.now()}`);
                const response = await fetch(formData.image);
                const blob = await response.blob();
                await uploadBytes(imageRef, blob);
                imageUrl = await getDownloadURL(imageRef);
              }
          
              // Add item to Firestore
              await addDoc(collection(db, "marketplace"), {
                ...formData,
                imageUrl, // Store uploaded image URL
                userId: auth.currentUser.uid,
              });
          
              alert("Item added successfully!");
              setModalVisible(false);
              window.location.reload();
            } catch (error) {
              console.error("Error adding item:", error);
              alert("Failed to add item. Please try again.");
            } finally {
              setIsSubmitting(false);
            }
        };

        const handleImageChange = (event) => {            
            const file = event.target.files[0];
            if (file) {
              setFormData({ ...formData, image: URL.createObjectURL(file) });
            }
        };        
          
  return(
    <div className="marketplace-container">
        <div className="markeplace-tab">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`mtab-button ${activeCategory === category ? "active" : ""}`}>
                    {category}
                </button>
            ))}
        </div>

        <button onClick={() => setModalVisible(true)} className="add-item-button">
            Add New Item
        </button>

        <div className="mitems-container">
            {filteredItems.map((item) => (
                <ItemCard 
                    key={item.id} 
                    item={item} 
                    handleDeleteItem={handleDeleteItem}
                    setSelectedItem={setSelectedItem}
                    setIsModalOpen={setIsModalOpen}
                    handleContactClick={handleContactClick}
                />
            ))}
        </div>

        {modalVisible && (
        <div className="mmodal-overlay" onClick={() => setModalVisible(false)}></div>
        )}

        {modalVisible && (
            <div className="market-modal-form">
            <h3>Add Details</h3>
            <input type="text" placeholder="Title" onChange={(e) => setFormData({ ...formData, title: e.target.value })} value={formData.title} disabled={isSubmitting} />
            <textarea placeholder="Description" onChange={(e) => setFormData({ ...formData, description: e.target.value })} value={formData.description} disabled={isSubmitting} />
            <input type="text" placeholder="Contact Message" onChange={(e) => setFormData({ ...formData, contactMessage: e.target.value })} value={formData.contactMessage} disabled={isSubmitting} />
            <input type="email" placeholder="Contact Email" onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} value={formData.contactEmail} disabled={isSubmitting} />
            <input type="number" placeholder="Bid Amount" onChange={(e) => setFormData({ ...formData, bidAmount: e.target.value })} value={formData.bidAmount} disabled={isSubmitting} />
            <input type="number" placeholder="Price" onChange={(e) => setFormData({ ...formData, price: e.target.value })} value={formData.price} disabled={isSubmitting} />
            <select onChange={(e) => setFormData({ ...formData, condition: e.target.value })} value={formData.condition} disabled={isSubmitting}>
            <option value="Like New">Like New</option>
            <option value="Used">Used</option>
            <option value="New">New</option>
            </select>
            <select onChange={(e) => setFormData({ ...formData, category: e.target.value })} value={formData.category} disabled={isSubmitting}>
            <option value="Books">Books</option>
            <option value="Electronics">Electronics</option>
            <option value="Furniture">Furniture</option>
            <option value="Clothing">Clothing</option>
            <option value="Other">Other</option>
            </select>
            <input type="file" onChange={handleImageChange} disabled={isSubmitting} />
            <label><input type="checkbox" checked={formData.isBidding} onChange={(e) => setFormData({ ...formData, isBidding: e.target.checked })} disabled={isSubmitting} /> Enable Bidding</label>
            {formData.isBidding && <input type="date" placeholder="Bidding Ends On" onChange={(e) => setFormData({ ...formData, biddingEnds: e.target.value })} value={formData.biddingEnds} disabled={isSubmitting} />}
            <button onClick={handleAddItem} disabled={isSubmitting} className="custom-submit-button"><span className="custom-button-text">{isSubmitting ? "Submitting..." : "Submit"}</span></button>
            </div>
        )}

        {selectedEmail && (
            <div id="email-modal" className="email-modal-overlay" onClick={() => setSelectedEmail(null)}>
                <div className="email-modal-content" onClick={(e) => e.stopPropagation()}>
                    <h2>Seller's Contact</h2>
                    <p><strong>Email:</strong> {selectedEmail}</p>
                    <button className="email-close-button" onClick={() => setSelectedEmail(null)}>Close</button>
                </div>
            </div>
        )}


{isModalOpen && selectedItem && (
    <div className="bid-modal-overlay">
        <div ref={bidModalRef} className="bid-modal-content">
            <h2 className="bid-modal-title">Increase Your Bid</h2>

            <input
                type="number"
                placeholder="Enter bid amount"
                className="bid-input"
                value={bidIncrement}
                onChange={(e) => setBidIncrement(e.target.value)}
            />

            <div className="bid-modal-actions">
                <button onClick={() => {
                    setIsModalOpen(false);
                    setSelectedItem(null);
                }} className="bid-cancel-button">
                    Cancel
                </button>

                <button onClick={() => handleBidSubmit(selectedItem)} className="bid-submit-button">
                    Submit
                </button>
            </div>
        </div>
    </div>
)}


    </div>    
  );       
};

export default Marketplace;
