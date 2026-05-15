import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  CreditCard, 
  Truck, 
  CheckCircle2, 
  ShoppingBag, 
  Wallet,
  Smartphone,
  MapPin,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { supabase } from '../supabase';
import { CartItem } from '../types';

interface CheckoutPageProps {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  user: any;
}

type CheckoutStep = 'shipping' | 'payment' | 'success';

export default function CheckoutPage({ cart, setCart, user }: CheckoutPageProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bkash' | 'nagad'>('cod');
  const [transactionId, setTransactionId] = useState('');

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0 && step !== 'success') {
    return (
      <div 
        className="min-h-screen text-black dark:text-gray-200 font-sans selection:bg-black selection:text-white transition-colors duration-300"
        style={{
          backgroundColor: '#333333',
          backgroundImage: 'radial-gradient(#e0e0e0 0.5px, transparent 0.7px)',
          backgroundSize: '10px 10px'
        }}
      >
        <div className="min-h-[60vh] flex flex-center justify-center items-center px-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
              <ShoppingBag className="w-10 h-10 text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold mb-4 dark:text-white">Your cart is empty</h2>
            <button 
              onClick={() => navigate('/')}
              className="bg-white text-black px-8 py-3 rounded-xl font-bold"
            >
              Back to Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      const orderData = {
        user_id: user?.id || 'guest',
        customer_details: shippingForm,
        items: cart.map(item => ({
          product_id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          size: item.selectedSize || null
        })),
        total_amount: cartTotal,
        payment_method: paymentMethod,
        transaction_id: (paymentMethod === 'bkash' || paymentMethod === 'nagad') ? transactionId : null,
        status: 'pending',
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('orders')
        .insert([orderData]);

      if (error) throw error;

      // Update stock for each product in the cart
      for (const item of cart) {
        // Only update if it's not a static product (or if static products are also in DB)
        // We'll try to update by ID. If it's a static ID, it might not exist in DB unless promoted.
        // But the user's request implies they want stock management for all.
        
        // Fetch current stock first to decrement correctly
        const { data: product } = await supabase
          .from('products')
          .select('stock')
          .eq('id', item.id)
          .single();

        if (product && product.stock !== undefined) {
          const newStock = Math.max(0, (product.stock || 0) - item.quantity);
          await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', item.id);
        }
      }
      
      setCart([]);
      setStep('success');
    } catch (error: any) {
      alert("Error placing order: " + error.message);
    } finally {
      setIsSubmitting(false);
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
      <div className="max-w-4xl mx-auto px-4 py-12">
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center max-w-xs mx-auto relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-white/10 -translate-y-1/2 -z-10"></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === 'shipping' || step === 'payment' || step === 'success' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 text-gray-400 dark:bg-white/5'}`}>1</div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === 'payment' || step === 'success' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 text-gray-400 dark:bg-white/5'}`}>2</div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === 'success' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-gray-100 text-gray-400 dark:bg-white/5'}`}>3</div>
        </div>
        <div className="flex justify-between max-w-xs mx-auto mt-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Shipping</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Payment</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Success</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 'shipping' && (
          <motion.div
            key="shipping"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-xl">
              <h2 className="text-3xl font-serif mb-8 dark:text-white flex items-center gap-3">
                <Truck className="w-6 h-6" /> Shipping Details
              </h2>
              
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-modern font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
                      <User className="w-3 h-3" /> First Name
                    </label>
                    <input 
                      required 
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-premium-gold dark:text-white font-modern"
                      value={shippingForm.firstName}
                      onChange={(e) => setShippingForm({...shippingForm, firstName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                      <User className="w-3 h-3" /> Last Name
                    </label>
                    <input 
                      required 
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white"
                      value={shippingForm.lastName}
                      onChange={(e) => setShippingForm({...shippingForm, lastName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                      <Mail className="w-3 h-3" /> Email
                    </label>
                    <input 
                      required 
                      type="email" 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white"
                      value={shippingForm.email}
                      onChange={(e) => setShippingForm({...shippingForm, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Phone
                    </label>
                    <input 
                      required 
                      type="tel" 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white"
                      value={shippingForm.phone}
                      onChange={(e) => setShippingForm({...shippingForm, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> Shipping Address
                    </label>
                    <input 
                      required 
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white"
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({...shippingForm, address: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                      <MapPin className="w-3 h-3" /> City
                    </label>
                    <input 
                      required 
                      type="text" 
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white"
                      value={shippingForm.city}
                      onChange={(e) => setShippingForm({...shippingForm, city: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-8">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10"
                  >
                    Continue to Payment
                    <ChevronLeft className="w-5 h-5 rotate-180" />
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}

        {step === 'payment' && (
          <motion.div
            key="payment"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="bg-white dark:bg-white/5 p-8 rounded-[2.5rem] border border-gray-100 dark:border-white/10 shadow-xl">
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setStep('shipping')} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors dark:text-white">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold dark:text-white flex items-center gap-3">
                  <CreditCard className="w-6 h-6" /> Payment Selection
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button 
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${paymentMethod === 'cod' ? 'border-black dark:border-white bg-black/5 dark:bg-white/5' : 'border-gray-100 dark:border-white/10'}`}
                  >
                    <Truck className={`w-8 h-8 mb-4 ${paymentMethod === 'cod' ? 'text-black dark:text-white' : 'text-gray-400'}`} />
                    <p className="font-bold dark:text-white">Cash on Delivery</p>
                    <p className="text-xs text-gray-500 mt-1">Pay when you receive</p>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod('bkash')}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${paymentMethod === 'bkash' ? 'border-[#D12053] bg-[#D12053]/5' : 'border-gray-100 dark:border-white/10'}`}
                  >
                    <img 
                      src="https://download.logo.wine/logo/BKash/BKash-Icon2-Logo.wine.png" 
                      alt="bKash" 
                      className="h-8 w-auto mb-4 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <p className="font-bold dark:text-white">bKash</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Send money to: <motion.span 
                        whileHover={{ scale: 1.2, color: '#D12053' }} 
                        whileTap={{ scale: 1.1 }}
                        className="inline-block font-bold cursor-zoom-in transition-colors dark:text-gray-300"
                      >
                        01625043206
                      </motion.span>
                    </p>
                  </button>

                  <button 
                    onClick={() => setPaymentMethod('nagad')}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${paymentMethod === 'nagad' ? 'border-[#ED1C24] bg-[#ED1C24]/5' : 'border-gray-100 dark:border-white/10'}`}
                  >
                    <img 
                      src="https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png" 
                      alt="Nagad" 
                      className="h-8 w-auto mb-4 object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <p className="font-bold dark:text-white">Nagad</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Send money to: <motion.span 
                        whileHover={{ scale: 1.2, color: '#ED1C24' }} 
                        whileTap={{ scale: 1.1 }}
                        className="inline-block font-bold cursor-zoom-in transition-colors dark:text-gray-300"
                      >
                        01625043206
                      </motion.span>
                    </p>
                  </button>
                </div>

                {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-4 pt-4"
                  >
                    <div className="p-4 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 rounded-xl">
                      <p className="text-xs text-orange-700 dark:text-orange-400 leading-relaxed">
                        Please send the total amount (৳{cartTotal}) to our merchant number and provide the Transaction ID below.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Transaction ID</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="e.g. 8N7X6W5V"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border-none rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white dark:text-white"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}

                <div className="pt-8">
                  <div className="flex justify-between items-center mb-6 px-2">
                    <span className="text-gray-500 dark:text-gray-400">Total Payable</span>
                    <span className="text-2xl font-bold dark:text-white">৳{cartTotal}</span>
                  </div>
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting || ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !transactionId)}
                    className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-xl shadow-black/10 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Processing...' : 'Place Order'}
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-24 h-24 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Order Confirmed!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-12 max-w-md mx-auto">
              Thank you for your purchase. Your order has been placed successfully and is now being processed.
            </p>
            <button 
              onClick={() => navigate('/')}
              className="bg-black dark:bg-white text-white dark:text-black px-12 py-4 rounded-2xl font-bold shadow-xl shadow-black/10"
            >
              Back to Home
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </div>
  );
}
