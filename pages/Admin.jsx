
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from '../components/ui/Container';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { formatDate } from '../lib/utils';

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState([]);
  const [marketplaceItems, setMarketplaceItems] = useState([]);
  const [lostFoundItems, setLostFoundItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnnouncementDialogOpen, setIsAnnouncementDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'Events',
    imageUrl: ''
  });

  useEffect(() => {
    // Check if user is admin, if not redirect to home
    if (user && !isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard",
        variant: "destructive"
      });
      navigate('/');
    } else if (!user) {
      navigate('/login');
    } else {
      // Fetch data
      fetchData();
    }
  }, [user, isAdmin, navigate]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Simulate API calls
      setTimeout(() => {
        // Mock announcements data
        setAnnouncements([
          {
            id: '1',
            title: 'Fall Semester Registration',
            content: 'Registration for Fall 2024 semester opens on July 15. Please check your student portal for your assigned registration time.',
            category: 'Academic',
            date: '2024-06-20T09:00:00Z',
            imageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '2',
            title: 'Campus Career Fair',
            content: 'Join us for the annual Career Fair on September 10th in the Student Union. Over 50 companies will be present with internship and job opportunities.',
            category: 'Events',
            date: '2024-06-18T14:30:00Z',
            imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          },
          {
            id: '3',
            title: 'Library Hours Extended',
            content: 'The main library will extend its hours during finals week. It will be open 24/7 from December 5-15.',
            category: 'Notices',
            date: '2024-06-15T11:15:00Z',
            imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
          }
        ]);

        // Mock marketplace items data
        setMarketplaceItems([
          {
            id: '1',
            title: 'Calculus Textbook',
            description: 'Used calculus textbook in good condition. Some highlighting in the first few chapters.',
            price: 45,
            seller: 'Alex Johnson',
            date: '2024-06-19T10:30:00Z',
            status: 'active'
          },
          {
            id: '2',
            title: 'Desk Lamp',
            description: 'Adjustable desk lamp, barely used. Perfect for dorm rooms.',
            price: 20,
            seller: 'Taylor Wilson',
            date: '2024-06-17T16:45:00Z',
            status: 'active'
          },
          {
            id: '3',
            title: 'Bluetooth Speaker',
            description: 'JBL Flip 5 in excellent condition. Great battery life and sound quality.',
            price: 75,
            seller: 'Sam Lee',
            date: '2024-06-15T11:15:00Z',
            status: 'sold'
          }
        ]);

        // Mock lost and found items data
        setLostFoundItems([
          {
            id: '1',
            title: 'Black Laptop Bag',
            description: 'Found in the library on the 2nd floor near the computers.',
            location: 'University Library',
            reportedBy: 'Jamie Smith',
            date: '2024-06-20T14:30:00Z',
            status: 'found'
          },
          {
            id: '2',
            title: 'iPhone 13 Pro (Silver)',
            description: 'Lost in the Student Union building around 2 PM. Has a clear case with stickers.',
            location: 'Student Union',
            reportedBy: 'Alex Johnson',
            date: '2024-06-18T16:45:00Z',
            status: 'lost'
          },
          {
            id: '3',
            title: 'Student ID Card',
            description: 'Found near the Engineering building entrance. Student ID #78342.',
            location: 'Engineering Building',
            reportedBy: 'Taylor Wilson',
            date: '2024-06-15T09:15:00Z',
            status: 'found'
          }
        ]);

        // Mock users data
        setUsers([
          {
            id: '1',
            name: 'Alex Johnson',
            email: 'alex@university.edu',
            role: 'user',
            joinDate: '2024-01-15T10:30:00Z',
            status: 'active'
          },
          {
            id: '2',
            name: 'Taylor Wilson',
            email: 'taylor@university.edu',
            role: 'user',
            joinDate: '2024-02-20T14:45:00Z',
            status: 'active'
          },
          {
            id: '3',
            name: 'Jamie Smith',
            email: 'jamie@university.edu',
            role: 'admin',
            joinDate: '2024-01-10T09:15:00Z',
            status: 'active'
          },
          {
            id: '4',
            name: 'Sam Lee',
            email: 'sam@university.edu',
            role: 'user',
            joinDate: '2024-03-05T11:30:00Z',
            status: 'inactive'
          }
        ]);

        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCreateAnnouncement = (e) => {
    e.preventDefault();
    
    const newAnnouncement = {
      id: `ann_${Date.now()}`,
      title: formData.title,
      content: formData.content,
      category: formData.category,
      date: new Date().toISOString(),
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    };
    
    setAnnouncements(prevAnnouncements => [newAnnouncement, ...prevAnnouncements]);
    
    toast({
      title: "Success",
      description: "Announcement created successfully",
    });
    
    setIsAnnouncementDialogOpen(false);
    setFormData({
      title: '',
      content: '',
      category: 'Events',
      imageUrl: ''
    });
  };

  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(prevAnnouncements => 
      prevAnnouncements.filter(announcement => announcement.id !== id)
    );
    
    toast({
      title: "Success",
      description: "Announcement deleted successfully",
    });
  };

  const handleDeleteMarketplaceItem = (id) => {
    setMarketplaceItems(prevItems => 
      prevItems.filter(item => item.id !== id)
    );
    
    toast({
      title: "Success",
      description: "Marketplace item deleted successfully",
    });
  };

  const handleDeleteLostFoundItem = (id) => {
    setLostFoundItems(prevItems => 
      prevItems.filter(item => item.id !== id)
    );
    
    toast({
      title: "Success",
      description: "Lost & Found item deleted successfully",
    });
  };

  const handleUpdateUserRole = (id, newRole) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === id ? { ...user, role: newRole } : user
      )
    );
    
    toast({
      title: "Success",
      description: `User role updated to ${newRole}`,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-60 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-40 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <Container>
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage announcements, marketplace listings, and users</p>
        </div>
        
        <Tabs defaultValue="announcements" className="w-full">
          <TabsList className="grid grid-cols-4 w-full max-w-xl mb-8">
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="lostfound">Lost & Found</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>
          
          {/* Announcements Tab */}
          <TabsContent value="announcements">
            <div className="flex justify-end mb-6">
              <Button variant="primary" onClick={() => setIsAnnouncementDialogOpen(true)}>
                Create Announcement
              </Button>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {announcements.map((announcement) => (
                    <tr key={announcement.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{announcement.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {announcement.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(announcement.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-red-600 hover:text-red-900 mr-4"
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                        >
                          Delete
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          {/* Marketplace Tab */}
          <TabsContent value="marketplace">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {marketplaceItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${item.price}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.seller}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-red-600 hover:text-red-900 mr-4"
                          onClick={() => handleDeleteMarketplaceItem(item.id)}
                        >
                          Delete
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          {/* Lost & Found Tab */}
          <TabsContent value="lostfound">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {lostFoundItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{item.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.reportedBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'found' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          className="text-red-600 hover:text-red-900 mr-4"
                          onClick={() => handleDeleteLostFoundItem(item.id)}
                        >
                          Delete
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {user.role === 'user' ? (
                          <button 
                            className="text-purple-600 hover:text-purple-900 mr-4"
                            onClick={() => handleUpdateUserRole(user.id, 'admin')}
                          >
                            Make Admin
                          </button>
                        ) : (
                          <button 
                            className="text-blue-600 hover:text-blue-900 mr-4"
                            onClick={() => handleUpdateUserRole(user.id, 'user')}
                          >
                            Make User
                          </button>
                        )}
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </Container>

      {/* Create Announcement Dialog */}
      <Dialog open={isAnnouncementDialogOpen} onOpenChange={setIsAnnouncementDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create Announcement</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleCreateAnnouncement} className="space-y-4 mt-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input 
                id="title" 
                name="title" 
                value={formData.title}
                onChange={handleFormChange}
                placeholder="Announcement title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full h-10 px-3 py-2 border border-border rounded-md"
                required
              >
                <option value="Events">Events</option>
                <option value="Academic">Academic</option>
                <option value="Notices">Notices</option>
                <option value="Opportunities">Opportunities</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">Content</label>
              <textarea 
                id="content" 
                name="content"
                value={formData.content}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-border rounded-md min-h-[100px]"
                placeholder="Announcement content..."
                required
              ></textarea>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="imageUrl" className="text-sm font-medium">Image URL (Optional)</label>
              <Input 
                id="imageUrl" 
                name="imageUrl" 
                value={formData.imageUrl}
                onChange={handleFormChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAnnouncementDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
