import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  Search, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Moon,
  Sun,
  Globe,
  Mail,
  User,
  LogIn,
  UserPlus,
  ArrowUp,
  ArrowDown,
  Settings,
  ShoppingBag,
  LogOut
} from 'lucide-react';
import { PRODUCTS, CATEGORIES } from './constants';
import { CartItem, Product } from './types';
import ProductDetails from './components/ProductDetails';
import AdminPanel from './components/AdminPanel';
import CheckoutPage from './components/CheckoutPage';
import UserProfile from './components/UserProfile';
import AuthPage from './components/AuthPage';
import { supabase } from './supabase';

const TRANSLATIONS = {
  en: {
    shop_now: "Shop Now",
    hero_title: "SHARP LOOKS FOR EVERY DAY.",
    hero_desc: "Discover our collection of premium shirts, designed for the modern man who values style and comfort.",
    collection_title: "ButterFly™ Shirt Collection",
    add_to_cart: "Add to Cart",
    search_placeholder: "Search products...",
    cart_title: "Your Cart",
    checkout: "Checkout",
    pay_now: "Pay Now",
    order_confirmed: "Order Confirmed!",
    support: "Support",
    legal: "Legal",
    admin_terminal: "Admin Terminal",
    privacy_policy: "Privacy Policy",
    terms_of_service: "Terms of Service",
    login: "Login",
    register: "Register",
    logout: "Logout",
    email: "Email Address",
    password: "Password",
    no_account: "Don't have an account?",
    has_account: "Already have an account?",
    welcome: "Welcome Back",
    create_account: "Create Account",
    my_orders: "My Orders",
    order_status: "Order Status",
    order_date: "Order Date",
    total: "Total"
  },
  bn: {
    shop_now: "এখনই কিনুন",
    hero_title: "প্রতিদিনের জন্য সেরা লুক।",
    hero_desc: "আমাদের প্রিমিয়াম শার্টের কালেকশন দেখুন, যা আধুনিক পুরুষদের স্টাইল এবং আরামের কথা মাথায় রেখে তৈরি।",
    collection_title: "বাটারফ্লাই™ শার্ট কালেকশন",
    add_to_cart: "কার্টে যোগ করুন",
    search_placeholder: "পণ্য খুঁজুন...",
    cart_title: "আপনার কার্ট",
    checkout: "চেকআউট",
    pay_now: "পেমেন্ট করুন",
    order_confirmed: "অর্ডার কনফার্ম হয়েছে!",
    support: "সাপোর্ট",
    legal: "লিগ্যাল",
    admin_terminal: "এডমিন টার্মিনাল",
    privacy_policy: "প্রাইভেসি পলিসি",
    terms_of_service: "টার্মস অফ সার্ভিস",
    login: "লগইন",
    register: "রেজিস্ট্রেশন",
    logout: "লগআউট",
    email: "ইমেইল ঠিকানা",
    password: "পাসওয়ার্ড",
    no_account: "অ্যাকাউন্ট নেই?",
    has_account: "অ্যাকাউন্ট আছে?",
    welcome: "স্বাগতম",
    create_account: "অ্যাকাউন্ট তৈরি করুন",
    my_orders: "আমার অর্ডার",
    order_status: "অর্ডারের অবস্থা",
    order_date: "অর্ডারের তারিখ",
    total: "মোট"
  }
};

function FeaturedSlider({ isMobileView, products: dynamicProducts }: { isMobileView?: boolean, products?: Product[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Combine dynamic products with static ones if needed, or just use dynamic
  const featuredProducts = useMemo(() => {
    if (dynamicProducts && dynamicProducts.length > 0) {
      return dynamicProducts.slice(0, 5); // Show latest 5 products
    }
    return PRODUCTS.slice(0, 3);
  }, [dynamicProducts]);

  useEffect(() => {
    if (currentIndex >= featuredProducts.length && featuredProducts.length > 0) {
      setCurrentIndex(0);
    }
  }, [featuredProducts.length, currentIndex]);

  useEffect(() => {
    if (featuredProducts.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featuredProducts.length]);

  if (featuredProducts.length === 0) return null;

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % featuredProducts.length);
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + featuredProducts.length) % featuredProducts.length);
  };

  return (
    <div className="relative h-full flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 flex flex-col"
        >
          <div className={`relative flex-1 rounded-2xl overflow-hidden ${isMobileView ? 'mb-2' : 'mb-4'}`}>
            <img 
              src={featuredProducts[currentIndex].image} 
              alt={featuredProducts[currentIndex].name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute top-2 right-2 bg-white/10 dark:bg-white/5 backdrop-blur-md px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest text-white border border-white/10`}>
              New
            </div>
          </div>
          <div className={isMobileView ? 'px-1' : ''}>
            <h4 className={`font-serif ${isMobileView ? 'text-sm text-white' : 'text-lg text-white'} mb-0.5 truncate`}>
              {featuredProducts[currentIndex].name}
            </h4>
            <div className="flex justify-between items-center">
              <span className={`${isMobileView ? 'text-premium-gold text-[10px]' : 'text-premium-gold text-sm'} font-modern font-bold`}>
                ৳{featuredProducts[currentIndex].price}
              </span>
              <Link 
                to={`/product/${featuredProducts[currentIndex].id}`}
                className={`${isMobileView ? 'text-[10px] text-white' : 'text-xs text-white'} font-modern font-bold underline hover:text-premium-gold transition-colors`}
              >
                View
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Manual Controls */}
      <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-4 z-30">
        <button 
          onClick={prevSlide}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>
        <div className="flex gap-1.5">
          {featuredProducts.map((_, i) => (
            <div 
              key={i} 
              className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentIndex ? 'bg-white w-4' : 'bg-white/20'}`}
            />
          ))}
        </div>
        <button 
          onClick={nextSlide}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
}

function Home({ addToCart, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, filteredProducts, products, lang }: any) {
  const t = TRANSLATIONS[lang as keyof typeof TRANSLATIONS];
  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] py-20 flex items-center overflow-hidden bg-[#0A0A0A] text-white">
        <div className="absolute inset-0 opacity-30">
          <img 
            src="https://plus.unsplash.com/premium_photo-1723925110801-110c00d392a3?q=80&w=870&auto=format&fit=crop" 
            alt="Hero Background" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-7xl md:text-8x1 font-stylish tracking-tighter leading-none mb-6 text-white drop-shadow-2xl">
                {t.hero_title}
              </h1>
              <p className="text-lg md:text-xl font-modern text-gray-300 mb-8 max-w-lg leading-relaxed">
                {t.hero_desc}
              </p>
              <button 
                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                className="group flex items-center gap-2 bg-white/90 dark:bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-white transition-all shadow-xl shadow-white/5"
              >
                {t.shop_now}
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Featured Products Slider in Mobile Frame */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex justify-center items-center relative"
            >
              {/* Mobile Frame Container - Transparent Glass Look */}
              <div className="relative w-[280px] h-[560px] bg-white/5 backdrop-blur-xl rounded-[3rem] border-[8px] border-white/10 shadow-2xl overflow-hidden ring-1 ring-white/20">
                {/* Speaker/Camera Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-white/10 backdrop-blur-md rounded-b-2xl z-20 flex items-center justify-center gap-2">
                  <div className="w-8 h-1 bg-white/20 rounded-full"></div>
                  <div className="w-2 h-2 bg-white/20 rounded-full"></div>
                </div>

                {/* Screen Content */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="h-full flex flex-col">
                    {/* App Header in Mobile */}
                    <div className="bg-[#FAF9F6]/10 backdrop-blur-md text-white p-4 pt-8 flex items-center justify-between border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                        <span className="text-xs font-serif tracking-widest ">ButterFly™</span>
                      </div>
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                    
                    {/* Slider Content */}
                    <div className="flex-1 relative p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[10px] font-modern text-white/40  tracking-[0.2em]">Featured</h3>
                      </div>
                      
                      <div className="relative h-full max-h-[420px]">
                        <FeaturedSlider isMobileView={true} products={products} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Bar */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/20 rounded-full z-20"></div>
              </div>

              {/* Decorative Glow behind mobile */}
              <div className="absolute -inset-10 bg-white/10 blur-[100px] rounded-full -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories & Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
         <h2 className="text-4xl md:text-4xl font-serif tracking-tight !text-black dark:!text-white">{t.collection_title}</h2>
          
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full text-xs font-modern tracking-widest uppercase transition-all ${
                  selectedCategory === category 
                    ? "bg-black text-white dark:bg-white dark:text-black shadow-xl scale-105" 
                    : "bg-white/50 backdrop-blur-sm text-gray-600 hover:bg-white border border-gray-200 dark:bg-white/5 dark:text-gray-400 dark:border-white/10"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product: Product) => (
              <motion.div
                layout
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group bg-white/40 dark:bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-100 dark:border-white/10 hover:shadow-xl hover:shadow-black/5 transition-all"
              >
                <Link to={`/product/${product.id}`} className="block aspect-square overflow-hidden bg-gray-100 dark:bg-white/5 relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <span className="bg-black/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all">
                      View Details
                    </span>
                  </div>
                </Link>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-1">
                    <Link to={`/product/${product.id}`} className="font-display font-semibold text-lg hover:text-premium-gold dark:text-white transition-colors">{product.name}</Link>
                    <span className="font-modern font-bold dark:text-white text-premium-gold">৳{product.price}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-modern font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      (product.stock !== undefined && product.stock !== null && product.stock > 0) 
                        ? 'bg-green-100 text-green-600 dark:bg-green-500/10 dark:text-green-400' 
                        : 'bg-red-100 text-red-600 dark:bg-red-500/10 dark:text-red-400'
                    }`}>
                      {(product.stock !== undefined && product.stock !== null && product.stock > 0) ? `${product.stock} In Stock` : 'Out of Stock'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-full py-3 bg-black text-white dark:bg-white dark:text-black rounded-xl text-xs font-modern tracking-widest uppercase hover:bg-premium-gold hover:text-white dark:hover:bg-premium-gold dark:hover:text-white transition-all shadow-lg"
                  >
                    {t.add_to_cart}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </section>
    </>
  );
}

function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = (hours % 12 || 12).toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <div className="text-center py-2">
      <div className="font-stylish text-4xl text-black dark:text-white leading-none mb-2 flex items-center justify-center gap-2">
        <span>{displayHours}:{minutes}:{seconds}</span>
        <span className="text-xs font-modern uppercase tracking-widest opacity-60">{ampm}</span>
      </div>
      <div className="text-[10px] font-modern uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
        {formatDate(time)}
      </div>
    </div>
  );
}

function AppContent() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    // Auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Initial products fetch
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setProducts(data);
      }
    };

    fetchProducts();

    // Real-time products subscription
    const productsChannel = supabase
      .channel('public-products-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
        console.log('App: Product change detected', payload);
        fetchProducts();
      })
      .subscribe((status) => {
        console.log('App: Product subscription status:', status);
      });

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(productsChannel);
    };
  }, []);

  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('uid', user.id)
        .single();
      
      if (!error && data) {
        setUserProfile(data);
      } else if (error && error.code === 'PGRST116') {
        // Initialize user profile if it doesn't exist
        const initialProfile = {
          uid: user.id,
          email: user.email,
          role: 'user',
          display_name: user.user_metadata?.full_name || '',
          phone_number: user.user_metadata?.phone_number || '',
          address: user.user_metadata?.address || '',
          city: user.user_metadata?.city || '',
          photo_url: user.user_metadata?.avatar_url || '',
          created_at: new Date().toISOString()
        };
        
        const { data: newProfile } = await supabase
          .from('users')
          .insert([initialProfile])
          .select()
          .single();
        
        if (newProfile) setUserProfile(newProfile);
      }
    };

    fetchProfile();

    // Real-time profile subscription
    const profileChannel = supabase
      .channel(`profile-${user.id}`)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'users', filter: `uid=eq.${user.id}` }, (payload) => {
        setUserProfile(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(profileChannel);
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      setUserOrders([]);
      return;
    }

    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        setUserOrders(data);
      }
    };

    fetchOrders();

    // Real-time orders subscription
    const ordersChannel = supabase
      .channel(`public-orders-realtime-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders', filter: `user_id=eq.${user.id}` }, (payload) => {
        console.log('App: Order change detected', payload);
        fetchOrders();
      })
      .subscribe((status) => {
        console.log('App: Order subscription status:', status);
      });

    return () => {
      supabase.removeChannel(ordersChannel);
    };
  }, [user]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const filteredProducts = useMemo(() => {
    // Combine Firestore products with static products, prioritizing Firestore
    // We handle both snake_case and camelCase to be robust against schema variations
    const firestoreOriginalIds = new Set(
      products
        .filter(p => p.original_id && p.original_id.toString().startsWith('static-'))
        .map(p => p.original_id!.toString())
    );
    
    // Also track regular IDs for direct matches
    const firestoreIds = new Set(products.map(p => p.id.toString()));

    const staticProducts = PRODUCTS
      .map(p => ({ ...p, id: `static-${p.id}` }))
      .filter(p => !firestoreOriginalIds.has(p.id) && !firestoreIds.has(p.id));

    const allProducts = [...products, ...staticProducts];
    
    return allProducts.filter(product => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery, products]);

  const addToCart = (product: Product, size?: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map(item => 
          (item.id === product.id && item.selectedSize === size) ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1, selectedSize: size }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string | number, size?: string) => {
    setCart(prev => prev.filter(item => !(item.id === productId && item.selectedSize === size)));
  };

  const updateQuantity = (productId: string | number, delta: number, size?: string) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId && item.selectedSize === size) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A to go to Admin (Bottom)
      if (e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        scrollToSection('footer');
      }
      // Alt + T to go to Top
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        scrollToSection('top');
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (id === 'top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div 
  className="min-h-screen text-black dark:text-gray-200 font-sans selection:bg-black selection:text-white transition-colors duration-300"
  style={{
    backgroundColor: 'transparent', 
    backgroundImage: 'radial-gradient(rgba(128, 128, 128, 0.3) 0.5px, transparent 0.7px)',
    backgroundSize: '10px 10px'
  }}
    >
      {/* Navigation */}
<nav className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-[#273436]/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-16">
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.png" alt="ButterFly Logo" className="w-10 h-10 object-contain" />
        <span className="text-2xl font-serif tracking-tight dark:text-white text-premium-gold">ButterFly™</span>
      </Link>

      {location.pathname === '/' && (
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text"
              placeholder={t.search_placeholder}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-full text-xs font-modern tracking-wide focus:ring-2 focus:ring-premium-gold dark:focus:ring-premium-gold dark:text-white transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        {/* User Icon (Login/Logout) */}
        <div className="relative group">
          <button 
            onClick={() => user ? navigate('/profile') : navigate('/auth')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors relative"
          >
            {user ? (
              <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200 dark:border-white/20">
                <img src={userProfile?.photo_url || user.photoURL || `https://ui-avatars.com/api/?name=${user.email}`} alt="User" />
              </div>
            ) : (
              <User className="w-6 h-6 dark:text-white" />
            )}
          </button>
          
          {user && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#FAF9F6] dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-white/5">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest truncate">{user.email}</p>
              </div>
              <button 
                onClick={() => navigate('/profile')}
                className="w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/5 dark:text-white flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                {t.my_orders}
              </button>
              <button 
                onClick={() => supabase.auth.signOut()}
                className="w-full px-4 py-3 text-left text-sm hover:bg-red-50 dark:hover:bg-red-500/10 text-red-500 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                {t.logout}
              </button>
            </div>
          )}
        </div>

        {/* Language Switcher */}
        <div className="relative group">
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors flex items-center gap-1">
            <Globe className="w-6 h-6 dark:text-white" />
            <span className="text-[10px] font-bold dark:text-white uppercase">{lang}</span>
          </button>
          <div className="absolute right-0 top-full mt-2 w-32 bg-[#FAF9F6] dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/10 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all overflow-hidden">
            <button 
              onClick={() => setLang('en')}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/5 ${lang === 'en' ? 'font-bold' : ''} dark:text-white`}
            >
              English
            </button>
            <button 
              onClick={() => setLang('bn')}
              className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-white/5 ${lang === 'bn' ? 'font-bold' : ''} dark:text-white`}
            >
              বাংলা
            </button>
          </div>
        </div>

        {/* Cart Toggle */}
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
        >
          <ShoppingCart className="w-6 h-6 dark:text-white" />
          {cartCount > 0 && (
            <span className="absolute top-0 right-0 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#FAF9F6] dark:border-[#0A0A0A]">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  </div>
</nav>

      <main className="pt-16">
        <Routes>
          <Route path="/" element={
            <Home 
              addToCart={addToCart}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filteredProducts={filteredProducts}
              products={products}
              lang={lang}
            />
          } />
          <Route path="/product/:id" element={<ProductDetails addToCart={addToCart} allProducts={filteredProducts} />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/checkout" element={<CheckoutPage cart={cart} setCart={setCart} user={user} />} />
          <Route path="/profile" element={<UserProfile user={user} profile={userProfile} orders={userOrders} />} />
          <Route path="/auth" element={<AuthPage lang={lang} t={t} />} />
        </Routes>
      </main>

      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#FAF9F6] dark:bg-[#0A0A0A] rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 dark:border-white/10"
            >
              <button 
                onClick={() => setIsContactModalOpen(false)}
                className="absolute right-6 top-6 p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 dark:text-white" />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold dark:text-white">Contact Us</h2>
                <p className="text-sm text-gray-500 mt-2">We'll get back to you as soon as possible.</p>
              </div>

              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold dark:text-white">Message Sent!</h3>
                  <p className="text-sm text-gray-500 mt-2">Thank you for reaching out. We'll reply soon.</p>
                  <button 
                    onClick={() => {
                      setIsContactModalOpen(false);
                      setIsSubmitted(false);
                    }}
                    className="mt-6 px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold"
                  >
                    Close
                  </button>
                </motion.div>
              ) : (
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setIsSubmitting(true);
                    // Simulate API call
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    setIsSubmitting(false);
                    setIsSubmitted(true);
                    setContactForm({ email: '', message: '' });
                  }} 
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Your Email</label>
                    <input 
                      required 
                      type="email" 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white outline-none"
                      placeholder="name@example.com"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Message</label>
                    <textarea 
                      required 
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white outline-none resize-none"
                      placeholder="How can we help you?"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin"></div>
                    ) : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 shadow-2xl flex flex-col"
              style={{
                backgroundColor: '#333333',
                backgroundImage: 'radial-gradient(#e0e0e0 0.5px, transparent 0.7px)',
                backgroundSize: '10px 10px'
              }}
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md">
                <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
                  Your Cart <span className="text-sm font-normal text-gray-400">({cartCount} items)</span>
                </h2>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 dark:text-white" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                      <ShoppingCart className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-semibold dark:text-white">Your cart is empty</p>
                      <p className="text-sm text-gray-500">Looks like you haven't added anything yet.</p>
                    </div>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.id}-${item.selectedSize || 'no-size'}`} className="flex gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                      <div className="w-20 h-20 bg-gray-100 dark:bg-white/10 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <h4 className="font-medium dark:text-white">{item.name}</h4>
                          <button 
                            onClick={() => removeFromCart(item.id, item.selectedSize)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        {item.selectedSize && (
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Size: {item.selectedSize}</p>
                        )}
                        <p className="text-sm text-gray-500 mb-3">৳{item.price}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-white/10 rounded-lg bg-white/5">
                            <button 
                              onClick={() => updateQuantity(item.id, -1, item.selectedSize)}
                              className="p-1 hover:bg-white/10 text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.id, 1, item.selectedSize)}
                              className="p-1 hover:bg-white/10 text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-white/5 backdrop-blur-md">
                  <div className="flex justify-between mb-4">
                    <span className="text-gray-400">Subtotal</span>
                    <span className="font-bold text-xl dark:text-white">৳{cartTotal}</span>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate('/checkout');
                    }}
                    className="w-full py-4 bg-white text-black rounded-xl font-bold hover:opacity-90 transition-all"
                  >
                    Checkout
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Navigation Assistant */}
      <div className="fixed bottom-8 right-8 z-[60] flex flex-col gap-3">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 20 }}
              onClick={() => scrollToSection('top')}
              className="p-4 bg-white/10 dark:bg-white/5 backdrop-blur-md text-black dark:text-white rounded-full shadow-xl border border-black/5 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10 hover:scale-110 active:scale-95 transition-all group"
              title="Scroll to Top"
            >
              <ArrowUp className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          onClick={() => scrollToSection('footer')}
          className="p-4 bg-black/10 dark:bg-white/5 backdrop-blur-md text-black dark:text-white rounded-full shadow-xl border border-black/5 dark:border-white/10 hover:bg-black/20 dark:hover:bg-white/10 hover:scale-110 active:scale-95 transition-all group"
          title="Go to Admin Terminal"
        >
          <ArrowDown className="w-6 h-6 group-hover:translate-y-0.5 transition-transform" />
        </motion.button>
      </div>

      <footer id="footer" className="bg-white dark:bg-[#273436] border-t border-gray-100 dark:border-white/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Brand Column */}
            <div className="space-y-4">
              <Link to="/" className="flex items-center gap-2">
                <img src="/logo.png" alt="ButterFly Logo" className="w-10 h-10 object-contain" />
                <span className="text-2xl font-serif tracking-tight dark:text-white text-premium-gold">ButterFly™</span>
              </Link>
              <div className="space-y-6">
                <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs">
                  Premium quality shirts for the modern man. Style, comfort, and elegance combined.
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-600">© 2026 ButterFly™. All rights reserved.</p>
              </div>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="font-modern font-bold text-[10px] uppercase tracking-[0.2em] mb-6 dark:text-white">{t.support}</h4>
              <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full text-[10px]">📞</span>
                  <a href="tel:+880247123472" className="hover:text-black dark:hover:text-white transition-colors">
                    +880247123472
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full text-[10px]">📍</span>
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=Motijheel+48/1+Yousuf+Mansion+C/A+Dhaka+1000" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-black dark:hover:text-white transition-colors leading-relaxed"
                  >
                    Motijheel 48/1 Yousuf Mansion C/A Dhaka 1000.
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-5 h-5 flex items-center justify-center bg-gray-100 dark:bg-white/5 rounded-full text-[10px]">✉️</span>
                  <button 
                    onClick={() => setIsContactModalOpen(true)}
                    className="hover:text-black dark:hover:text-white transition-colors text-left"
                  >
                    minhaz.al.din@gmail.com
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:col-span-1">
              <div>
                <h4 className="font-modern font-bold text-[10px] uppercase tracking-[0.2em] mb-6 dark:text-white">{t.legal}</h4>
                <ul className="space-y-4 text-sm text-gray-500 dark:text-gray-400">
                  <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.privacy_policy}</a></li>
                  <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">{t.terms_of_service}</a></li>
                  <li>
                    <Link to="/admin" className="hover:text-black dark:hover:text-white transition-colors">
                      {t.admin_terminal}
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="flex flex-col items-center justify-start">
                <h4 className="font-modern font-bold text-[10px] uppercase tracking-[0.2em] mb-6 dark:text-white">Live Time</h4>
                <DigitalClock />
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-6">
              <span className="text-xs text-gray-400 dark:text-gray-500">Premium Quality Guaranteed</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}
