import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  ShoppingBag, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar, 
  ChevronRight, 
  Package, 
  Clock, 
  CheckCircle2, 
  XCircle,
  LogOut,
  ArrowLeft,
  Edit2,
  Camera,
  Save,
  X,
  Info
} from 'lucide-react';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';

interface UserProfileProps {
  user: any;
  profile: any;
  orders: any[];
}

export default function UserProfile({ user, profile, orders }: UserProfileProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    display_name: '',
    phone_number: '',
    address: '',
    city: '',
    bio: '',
    photo_url: ''
  });

  useEffect(() => {
    if (profile) {
      setEditForm({
        display_name: profile.display_name || '',
        phone_number: profile.phone_number || '',
        address: profile.address || '',
        city: profile.city || '',
        bio: profile.bio || '',
        photo_url: profile.photo_url || ''
      });
    }
  }, [profile]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#0A0A0A]">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Please login to view your profile</h2>
          <button 
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 500000) {
        alert("Image is too large. Please use an image under 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, photo_url: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('users')
        .upsert({
          ...editForm,
          uid: user.id,
          email: user.email,
          role: profile?.role || 'user',
          updated_at: new Date().toISOString()
        }, { onConflict: 'uid' });

      if (error) throw error;
      
      // The real-time listener in App.tsx will update the profile state
      setIsEditing(false);
    } catch (error: any) {
      alert("Error updating profile: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="min-h-screen text-black dark:text-gray-200 font-sans selection:bg-black selection:text-white transition-colors duration-300"
      style={{
            backgroundColor: '#333333',
            backgroundImage: 'radial-gradient(#e0e0e0 0.5px, transparent 0.7px)',
            backgroundSize: '10px 10px'
          }}
    >
      <div className="min-h-screen pb-20">
        {/* Header */}
        <div className="bg-white/5 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Shop</span>
          </button>
          <h1 className="text-xl font-serif dark:text-white">My Account</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
              title="Edit Profile"
            >
              <Edit2 className="w-5 h-5" />
            </button>
            <button 
              onClick={handleLogout}
              className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: User Info */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-white/10"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 dark:border-white/5 shadow-xl">
                    <img 
                      src={profile?.photo_url || user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}&background=random&size=128`} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 w-8 h-8 bg-green-500 border-4 border-white dark:border-[#111] rounded-full"></div>
                </div>
                <h2 className="text-2xl font-bold dark:text-white mb-1">{profile?.display_name || user.user_metadata?.full_name || 'ButterFly Customer'}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{user.email}</p>
                
                {profile?.bio && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 italic">"{profile.bio}"</p>
                )}

                <div className="w-full space-y-4 text-left">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center shadow-sm">
                      <Mail className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
                      <p className="text-sm font-medium dark:text-white truncate">{user.email}</p>
                    </div>
                  </div>
                  
                  {profile?.phoneNumber && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                      <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center shadow-sm">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Phone Number</p>
                        <p className="text-sm font-medium dark:text-white">{profile.phoneNumber}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                    <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center shadow-sm">
                      <Calendar className="w-5 h-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Member Since</p>
                      <p className="text-sm font-medium dark:text-white">
                        {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {profile?.address && (
                    <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
                      <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center shadow-sm">
                        <MapPin className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Address</p>
                        <p className="text-sm font-medium dark:text-white">{profile.address}, {profile.city}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-black dark:bg-white rounded-[2.5rem] p-8 text-white dark:text-black shadow-xl"
            >
              <h3 className="text-xl font-bold mb-4">Shopping Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-xs opacity-60 font-bold uppercase tracking-widest">Total Orders</p>
                  <p className="text-3xl font-bold">{orders.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs opacity-60 font-bold uppercase tracking-widest">Completed</p>
                  <p className="text-3xl font-bold">
                    {orders.filter(o => o.status === 'delivered').length}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Orders */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-[#111] rounded-[2.5rem] p-8 shadow-sm border border-gray-100 dark:border-white/10"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold dark:text-white flex items-center gap-3">
                  <ShoppingBag className="w-6 h-6" />
                  Order History
                </h3>
                <span className="text-sm font-medium text-gray-400">{orders.length} Orders Found</span>
              </div>

              <div className="space-y-6">
                {orders.length === 0 ? (
                  <div className="text-center py-20 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-dashed border-gray-200 dark:border-white/10">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No orders yet. Start shopping!</p>
                    <button 
                      onClick={() => navigate('/')}
                      className="mt-4 text-black dark:text-white font-bold underline"
                    >
                      Browse Collection
                    </button>
                  </div>
                ) : (
                  orders.map((order, idx) => (
                    <motion.div 
                      key={order.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="group bg-gray-50 dark:bg-white/5 rounded-3xl p-6 border border-gray-100 dark:border-white/10 hover:border-black dark:hover:border-white transition-all"
                    >
                      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-600' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-600' :
                            'bg-blue-100 text-blue-600'
                          }`}>
                            {order.status === 'pending' && <Clock className="w-6 h-6" />}
                            {order.status === 'delivered' && <CheckCircle2 className="w-6 h-6" />}
                            {order.status === 'cancelled' && <XCircle className="w-6 h-6" />}
                            {['processing', 'shipped'].includes(order.status) && <Package className="w-6 h-6" />}
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order #{order.id.substring(0, 8)}</p>
                            <p className="text-sm font-bold dark:text-white">
                              {order.created_at ? new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest ${
                            order.status === 'pending' ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400' :
                            'bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400'
                          }`}>
                            {order.status}
                          </span>
                          <div className="h-8 w-px bg-gray-200 dark:bg-white/10 hidden md:block"></div>
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total</p>
                            <p className="text-lg font-bold dark:text-white">৳{order.totalAmount}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {order.items.map((item: any, i: number) => (
                          <div key={i} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-white dark:bg-white/10 rounded-lg flex items-center justify-center text-[10px] font-bold">
                                {item.quantity}x
                              </div>
                              <span className="text-gray-600 dark:text-gray-300">{item.name}</span>
                            </div>
                            <span className="font-medium dark:text-white">৳{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <MapPin className="w-4 h-4" />
                          <span className="text-xs">{order.customer_details.address}, {order.customer_details.city}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                          <Phone className="w-4 h-4" />
                          <span className="text-xs">{order.customer_details.phone}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#111] rounded-[2.5rem] overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
            >
              <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-bold dark:text-white">Edit Profile</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Customize your personal information.</p>
                  </div>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors dark:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Photo Upload */}
                  <div className="flex flex-col items-center">
                    <div className="relative group">
                      <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 dark:border-white/5 shadow-lg">
                        <img 
                          src={editForm.photo_url || profile?.photo_url || user.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${user.email}`} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-full">
                        <Camera className="w-6 h-6 text-white" />
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Click to change photo</p>
                  </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                          type="text"
                          value={editForm.display_name}
                          onChange={(e) => setEditForm(prev => ({ ...prev, display_name: e.target.value }))}
                          className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-black dark:focus:ring-white transition-all dark:text-white"
                          placeholder="Your Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <input 
                          type="tel"
                          value={editForm.phone_number}
                          onChange={(e) => setEditForm(prev => ({ ...prev, phone_number: e.target.value }))}
                          className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-black dark:focus:ring-white transition-all dark:text-white"
                          placeholder="+880 1XXX XXXXXX"
                        />
                      </div>
                    </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Bio / About You</label>
                    <textarea 
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-black dark:focus:ring-white transition-all dark:text-white h-24 resize-none"
                      placeholder="Tell us something about yourself..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Address</label>
                      <input 
                        type="text"
                        value={editForm.address}
                        onChange={(e) => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-black dark:focus:ring-white transition-all dark:text-white"
                        placeholder="Street Address"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                      <input 
                        type="text"
                        value={editForm.city}
                        onChange={(e) => setEditForm(prev => ({ ...prev, city: e.target.value }))}
                        className="w-full px-5 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-black dark:focus:ring-white transition-all dark:text-white"
                        placeholder="Your City"
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex gap-4">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="flex-1 px-8 py-4 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex-1 px-8 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      {isSaving ? (
                        <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
