import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronLeft, ShoppingCart, Star, Shield, Truck, RotateCcw, Check } from 'lucide-react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';

interface ProductDetailsProps {
  addToCart: (product: Product, size?: string) => void;
  allProducts: Product[];
}

export default function ProductDetails({ addToCart, allProducts }: ProductDetailsProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>('M');
  
  const product = allProducts.find(p => p.id.toString() === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F6] dark:bg-[#0A0A0A]">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 dark:text-white">Product not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="text-black dark:text-white underline font-medium"
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-8 group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-4"
        >
          <div className="aspect-[4/5] bg-gray-100 rounded-3xl overflow-hidden relative">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
                <span className="bg-white/90 dark:bg-black/90 text-black dark:text-white px-6 py-2 rounded-full font-bold text-sm shadow-xl">Out of Stock</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400 rounded-full text-[10px] font-modern font-bold uppercase tracking-widest">
                {product.category}
              </span>
              {(product.stock !== undefined && product.stock !== null) && (
                <span className={`px-3 py-1 rounded-full text-[10px] font-modern font-bold uppercase tracking-widest ${product.stock > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock} Units Available` : 'Out of Stock'}
                </span>
              )}
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current text-gray-200" />
                <span className="text-gray-400 text-sm ml-1">(4.8/5)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif mb-4 dark:text-white">{product.name}</h1>
            <div className="text-3xl font-modern font-bold mb-6 dark:text-white text-premium-gold">৳{product.price}</div>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 font-sans">
              {product.description}
            </p>

            {/* Size Selection */}
            <div className="mb-8">
              <label className="text-[10px] font-modern font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 block">Select Size</label>
              <div className="flex flex-wrap gap-3">
                {['M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[56px] h-14 rounded-xl font-modern font-bold transition-all flex items-center justify-center relative ${
                      selectedSize === size 
                        ? 'bg-black text-white dark:bg-white dark:text-black shadow-xl scale-105 border-2 border-premium-gold' 
                        : 'bg-gray-50 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    {size}
                    {selectedSize === size && (
                      <motion.div 
                        layoutId="activeSize"
                        className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center border-2 border-white dark:border-[#0A0A0A]"
                      >
                        <Check className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-12">
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
              <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-full flex items-center justify-center shadow-sm">
                <Shield className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-sm dark:text-white">Quality Guaranteed</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">100% Premium Fabric</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
              <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-full flex items-center justify-center shadow-sm">
                <Truck className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-sm dark:text-white">Fast Delivery</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">2-3 Business Days</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-white/5 rounded-2xl">
              <div className="w-10 h-10 bg-white dark:bg-white/10 rounded-full flex items-center justify-center shadow-sm">
                <RotateCcw className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="font-semibold text-sm dark:text-white">Easy Returns</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">7 Days Return Policy</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button 
              disabled={isOutOfStock}
              onClick={() => addToCart(product, selectedSize)}
              className={`w-full py-5 rounded-2xl font-modern font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-all shadow-xl active:scale-[0.98] ${isOutOfStock ? 'bg-gray-200 dark:bg-white/5 text-gray-400 cursor-not-allowed shadow-none' : 'bg-black dark:bg-white text-white dark:text-black hover:bg-premium-gold hover:text-white dark:hover:bg-premium-gold dark:hover:text-white shadow-black/10'}`}
            >
              <ShoppingCart className="w-5 h-5" />
              {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
            </button>
            <button 
              disabled={isOutOfStock}
              onClick={() => {
                addToCart(product, selectedSize);
              }}
              className={`w-full py-5 border-2 rounded-2xl font-modern font-bold tracking-widest uppercase flex items-center justify-center gap-3 transition-all active:scale-[0.98] ${isOutOfStock ? 'border-gray-200 dark:border-white/5 text-gray-400 cursor-not-allowed' : 'bg-white/50 dark:bg-white/5 text-black dark:text-white border-black dark:border-white hover:bg-premium-gold hover:text-white hover:border-premium-gold dark:hover:bg-premium-gold dark:hover:text-white dark:hover:border-premium-gold backdrop-blur-sm'}`}
            >
              Buy Now
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
