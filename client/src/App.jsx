import { useState, useEffect } from 'react';
import { Search, Plus, Filter, MapPin, Calendar, User, PackageSearch, Smartphone, Book, CreditCard, Tag, Type, AlignLeft, X, LogIn, UserCircle, CheckCircle2, Trash2 } from 'lucide-react';

const MOCK_POSTS = [
  { _id: '1', title: 'MacBook Pro Charger', description: 'Left my white Apple 61W USB-C power adapter plugged into the wall near the window on the 2nd floor of the library.', type: 'found', category: 'electronics', location: 'Library 2nd Floor', date: '2023-10-25', contact: 'john@example.com', status: 'active' },
  { _id: '2', title: 'Calculus Textbook', description: 'James Stewart Calculus 8th Edition. Hardcover, has a coffee stain on the front corner.', type: 'lost', category: 'books', location: 'Engineering Building', date: '2023-10-24', contact: 'sskum@example.com', status: 'active' },
  { _id: '3', title: 'Student ID Card - Alice', description: 'Found a student ID card for Alice Smith on a table in the cafeteria.', type: 'found', category: 'id_cards', location: 'Cafeteria', date: '2023-10-26', contact: 'alice.finds@college.edu', status: 'active' },
];

const getCategoryIcon = (category) => {
  switch(category) {
    case 'electronics': return Smartphone;
    case 'books': return Book;
    case 'id_cards': return CreditCard;
    case 'clothing': return PackageSearch;
    default: return Tag;
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'login', 'profile'
  const [user, setUser] = useState(null);

  const [activeTab, setActiveTab] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [posts, setPosts] = useState([]);
  
  const [selectedPost, setSelectedPost] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', description: '', type: 'lost', category: 'electronics', location: '', date: '', contact: ''
  });

  // Login form state
  const [loginData, setLoginData] = useState({ email: '', password: '' });

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/posts');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      } else {
        setPosts(MOCK_POSTS);
      }
    } catch (error) {
      setPosts(MOCK_POSTS);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if(loginData.email) {
      setUser({ email: loginData.email, name: loginData.email.split('@')[0] });
      setFormData(prev => ({ ...prev, contact: loginData.email })); // Pre-fill contact
      setCurrentView('home');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('home');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalContact = user ? user.email : formData.contact;
    try {
      const response = await fetch('http://localhost:5000/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, contact: finalContact })
      });
      
      if (response.ok) {
        setShowForm(false);
        fetchPosts(); 
        setFormData({ title: '', description: '', type: 'lost', category: 'electronics', location: '', date: '', contact: finalContact });
      } else {
        alert("Failed to save post to database.");
      }
    } catch (error) {
      // Fallback for mock environment
      const newPost = { ...formData, _id: Date.now().toString(), status: 'active', contact: finalContact };
      setPosts([newPost, ...posts]);
      setShowForm(false);
      setFormData({ title: '', description: '', type: 'lost', category: 'electronics', location: '', date: '', contact: finalContact });
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/posts/${id}`, { method: 'DELETE' });
      setPosts(posts.filter(p => p._id !== id));
      setSelectedPost(null);
    } catch (error) {
      setPosts(posts.filter(p => p._id !== id)); // Mock fallback
      setSelectedPost(null);
    }
  };

  const handleResolve = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/posts/${id}`, { 
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' })
      });
      fetchPosts();
      setSelectedPost(null);
    } catch (error) {
      setPosts(posts.map(p => p._id === id ? { ...p, status: 'resolved' } : p)); // Mock fallback
      setSelectedPost(null);
    }
  };

  const renderHeader = () => (
    <header className="glass rounded-2xl p-5 mb-8 max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 z-10 relative">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('home')}>
        <div className="p-2.5 bg-blue-100 rounded-xl border border-blue-200 shadow-sm">
          <PackageSearch className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Campus Finder</h1>
          <p className="text-slate-500 text-xs font-medium">Lost & Found Portal</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 w-full md:w-auto">
        {currentView === 'home' && (
          <>
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search items..." className="glass-input w-full pl-10 pr-4 py-2.5 text-sm" />
            </div>
            <button onClick={() => setShowForm(!showForm)} className="glass-button flex items-center gap-2 whitespace-nowrap text-sm py-2.5">
              {showForm ? 'View Listings' : <><Plus className="w-4 h-4" /> Report Item</>}
            </button>
          </>
        )}
        
        {user ? (
          <button onClick={() => setCurrentView('profile')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/60 border border-slate-200 hover:bg-white text-slate-700 transition-all text-sm font-semibold shadow-sm ml-2">
            <UserCircle className="w-5 h-5 text-blue-500" />
            {user.name}
          </button>
        ) : (
          <button onClick={() => setCurrentView('login')} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/60 border border-slate-200 hover:bg-white text-slate-700 transition-all text-sm font-semibold shadow-sm ml-2">
            <LogIn className="w-4 h-4" /> Login
          </button>
        )}
      </div>
    </header>
  );

  if (currentView === 'login') {
    return (
      <div className="min-h-screen text-slate-800 p-4 md:p-8 font-sans">
        {renderHeader()}
        <main className="max-w-md mx-auto mt-20 relative z-10">
          <div className="glass rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome Back</h2>
            <p className="text-slate-500 text-sm mb-8">Sign in to manage your lost and found reports.</p>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input required type="email" placeholder="Email Address (e.g. sskum@example.com)" value={loginData.email} onChange={e => setLoginData({...loginData, email: e.target.value})} className="glass-input w-full pl-11 pr-4 py-3 text-sm" />
              </div>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input required type="password" placeholder="Password (Any text works)" value={loginData.password} onChange={e => setLoginData({...loginData, password: e.target.value})} className="glass-input w-full pl-11 pr-4 py-3 text-sm" />
              </div>
              <button type="submit" className="glass-button w-full justify-center py-3 mt-4 text-sm font-semibold shadow-md">
                Sign In
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  if (currentView === 'profile') {
    const userPosts = posts.filter(p => p.contact === user.email);
    return (
      <div className="min-h-screen text-slate-800 p-4 md:p-8 font-sans">
        {renderHeader()}
        <main className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Profile */}
            <div className="w-full md:w-1/3">
              <div className="glass rounded-2xl p-8 shadow-sm text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                  <UserCircle className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 capitalize">{user.name}</h2>
                <p className="text-slate-500 text-sm mb-6">{user.email}</p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex justify-around mb-6">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{userPosts.length}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Total Posts</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{userPosts.filter(p => p.status === 'resolved').length}</p>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">Resolved</p>
                  </div>
                </div>
                <button onClick={handleLogout} className="w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-red-600 transition-colors text-sm font-semibold shadow-sm">
                  Sign Out
                </button>
              </div>
            </div>
            
            {/* User's Posts */}
            <div className="w-full md:w-2/3">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Your Reports</h2>
              {userPosts.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center text-slate-500 shadow-sm border border-slate-200/50">
                  You haven't reported any items yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {userPosts.map((post) => {
                    const Icon = getCategoryIcon(post.category);
                    const isResolved = post.status === 'resolved';
                    return (
                      <div key={post._id} onClick={() => setSelectedPost(post)} className={`glass-card p-5 flex flex-col group border-t-4 cursor-pointer ${isResolved ? 'opacity-70 border-t-slate-300 bg-slate-50/50 hover:bg-slate-100' : 'border-t-transparent hover:border-t-blue-400'}`}>
                        <div className="flex justify-between items-start mb-3">
                          <div className={`p-2.5 rounded-xl flex-shrink-0 ${post.type === 'lost' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex gap-2">
                            {isResolved && <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest bg-slate-200 text-slate-500 border border-slate-300">Resolved</span>}
                            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest ${post.type === 'lost' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                              {post.type}
                            </span>
                          </div>
                        </div>
                        <h3 className={`font-bold text-lg mb-4 line-clamp-1 ${isResolved ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{post.title}</h3>
                        <div className="mt-auto space-y-2 text-xs text-slate-500 font-medium bg-slate-50/50 p-3 rounded-lg border border-slate-100">
                          <div className="flex items-center gap-2.5"><Calendar className="w-3.5 h-3.5 text-slate-400" /><span>{new Date(post.date).toLocaleDateString()}</span></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
        {renderModal()}
      </div>
    );
  }

  function renderModal() {
    if (!selectedPost) return null;
    const isOwner = user && user.email === selectedPost.contact;
    const isResolved = selectedPost.status === 'resolved';

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm transition-opacity" onClick={() => setSelectedPost(null)}>
        <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative" onClick={e => e.stopPropagation()}>
          <button onClick={() => setSelectedPost(null)} className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-slate-100 rounded-full text-slate-500 transition-colors z-10">
            <X className="w-5 h-5" />
          </button>
          
          <div className={`p-6 pb-5 ${selectedPost.type === 'lost' ? 'bg-red-50 border-b border-red-100' : 'bg-green-50 border-b border-green-100'} ${isResolved ? 'grayscale opacity-70' : ''}`}>
            <div className="flex gap-2 mb-3">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest inline-block ${selectedPost.type === 'lost' ? 'bg-red-100 text-red-600 border border-red-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                {selectedPost.type} Item
              </span>
              {isResolved && (
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest inline-block bg-slate-200 text-slate-600 border border-slate-300">
                  Resolved
                </span>
              )}
            </div>
            <h2 className={`text-2xl font-bold leading-tight pr-8 ${isResolved ? 'text-slate-500 line-through' : 'text-slate-900'}`}>{selectedPost.title}</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap">{selectedPost.description || 'No description provided.'}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Location</h4>
                <div className="flex items-center gap-2 text-slate-700 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="truncate">{selectedPost.location}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Date</h4>
                <div className="flex items-center gap-2 text-slate-700 text-sm font-medium">
                  <Calendar className="w-4 h-4 text-blue-500 flex-shrink-0" />
                  <span className="truncate">{new Date(selectedPost.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            {!isOwner && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between mt-2">
                <div>
                  <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-wider mb-1">Contact Details</h4>
                  <p className="text-blue-900 text-sm font-semibold">{selectedPost.contact}</p>
                </div>
                <a href={`mailto:${selectedPost.contact}`} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm">
                  Contact
                </a>
              </div>
            )}

            {isOwner && (
              <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                {!isResolved && (
                  <button onClick={() => handleResolve(selectedPost._id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-xl text-sm font-semibold transition-colors">
                    <CheckCircle2 className="w-4 h-4" /> Mark as Found
                  </button>
                )}
                <button onClick={() => handleDelete(selectedPost._id)} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-sm font-semibold transition-colors">
                  <Trash2 className="w-4 h-4" /> Delete Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // HOME VIEW
  return (
    <div className="min-h-screen text-slate-800 p-4 md:p-8 font-sans">
      {renderHeader()}
      <main className="max-w-6xl mx-auto relative z-10">
        {showForm ? (
          <div className="glass rounded-2xl p-8 max-w-2xl mx-auto transition-all duration-300 transform shadow-lg">
            <h2 className="text-xl font-bold mb-6 text-slate-900 border-b border-slate-100 pb-4">Report a Lost or Found Item</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-600 ml-1 font-semibold uppercase tracking-wider">Report Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="glass-input w-full px-4 py-2.5 appearance-none bg-white text-sm">
                    <option value="lost">I lost something</option>
                    <option value="found">I found something</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-600 ml-1 font-semibold uppercase tracking-wider">Category</label>
                  <select name="category" value={formData.category} onChange={handleInputChange} className="glass-input w-full px-4 py-2.5 appearance-none bg-white text-sm">
                    <option value="electronics">Electronics</option>
                    <option value="books">Books</option>
                    <option value="id_cards">ID Cards</option>
                    <option value="clothing">Clothing / Bags</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs text-slate-600 ml-1 font-semibold uppercase tracking-wider">Item Title</label>
                <div className="relative">
                  <Type className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input required name="title" value={formData.title} onChange={handleInputChange} type="text" placeholder="e.g., Blue iPhone 13 with clear case" className="glass-input w-full pl-10 pr-4 py-2.5 text-sm" />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs text-slate-600 ml-1 font-semibold uppercase tracking-wider">Description</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <textarea required name="description" value={formData.description} onChange={handleInputChange} rows="3" placeholder="Provide details like scratches, wallpaper, contents..." className="glass-input w-full pl-10 pr-4 py-2.5 text-sm resize-none"></textarea>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-600 ml-1 font-semibold uppercase tracking-wider">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required name="location" value={formData.location} onChange={handleInputChange} type="text" placeholder="Where was it?" className="glass-input w-full pl-10 pr-4 py-2.5 text-sm" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-600 ml-1 font-semibold uppercase tracking-wider">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required name="date" value={formData.date} onChange={handleInputChange} type="date" className="glass-input w-full pl-10 pr-4 py-2.5 text-sm" />
                  </div>
                </div>
              </div>

              {!user && (
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-600 ml-1 font-semibold uppercase tracking-wider">Contact Email</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input required name="contact" value={formData.contact} onChange={handleInputChange} type="email" placeholder="Email Address" className="glass-input w-full pl-10 pr-4 py-2.5 text-sm" />
                  </div>
                </div>
              )}
              
              <button type="submit" className="glass-button w-full justify-center py-3 text-sm mt-6 shadow-[0_8px_20px_rgba(37,99,235,0.2)]">
                Submit Report
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {['all', 'lost', 'found'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full capitalize backdrop-blur-md transition-all text-sm font-semibold ${
                    activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'bg-white/60 text-slate-600 border border-slate-200 hover:bg-white hover:text-slate-900 shadow-sm'
                  }`}
                >
                  {tab} Items
                </button>
              ))}
              <div className="flex-1"></div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-slate-200 text-slate-700 hover:bg-white backdrop-blur-md transition-all text-sm font-semibold shadow-sm">
                <Filter className="w-3.5 h-3.5" /> Categories
              </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {posts.filter(p => activeTab === 'all' || p.type === activeTab).map((post) => {
                const Icon = getCategoryIcon(post.category);
                const isResolved = post.status === 'resolved';
                
                return (
                  <div 
                    key={post._id} 
                    onClick={() => setSelectedPost(post)}
                    className={`glass-card p-5 flex flex-col group border-t-4 cursor-pointer ${isResolved ? 'opacity-60 border-t-slate-300 bg-slate-50/50 hover:bg-slate-100' : 'border-t-transparent hover:border-t-blue-400'}`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className={`p-2.5 rounded-xl flex-shrink-0 transition-transform ${isResolved ? '' : 'group-hover:-translate-y-0.5'} duration-300 ${post.type === 'lost' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex gap-2">
                        {isResolved && <span className="text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest bg-slate-200 text-slate-500 border border-slate-300">Resolved</span>}
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-widest ${post.type === 'lost' ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-700 border border-green-100'}`}>
                          {post.type}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className={`font-bold text-lg mb-4 line-clamp-1 ${isResolved ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                      {post.title}
                    </h3>
                    
                    <div className="mt-auto space-y-2 text-xs text-slate-500 font-medium bg-slate-50/50 p-3 rounded-lg border border-slate-100 transition-colors group-hover:bg-blue-50/50">
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{post.location}</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(post.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </main>

      {renderModal()}
    </div>
  );
}
