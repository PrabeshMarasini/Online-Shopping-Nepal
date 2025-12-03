import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Loader2, Trash2 } from 'lucide-react';

const scrollbarStyles = `
  .cart-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .cart-scroll::-webkit-scrollbar-track {
    background: #f3f4f6;
  }
  .cart-scroll::-webkit-scrollbar-thumb {
    background: #d1d5db;
    border-radius: 3px;
  }
  .cart-scroll::-webkit-scrollbar-thumb:hover {
    background: #9ca3af;
  }
`;

export default function ShoppingCartApp() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountMessage, setDiscountMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when search term changes
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://fakestoreapi.com/products?limit=10');
      const data = await response.json();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const incrementQuantity = (productId) => {
    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));
  };

  const decrementQuantity = (productId) => {
    setCart(cart.map(item =>
      item.id === productId && item.quantity > 0
        ? { ...item, quantity: Math.max(0, item.quantity - 1) }
        : item
    ).filter(item => item.quantity > 0));
  };

  const resetQuantity = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscountCode('');
    setAppliedDiscount(0);
    setDiscountMessage('');
  };

  const applyDiscount = () => {
    const code = discountCode.trim();

    if (code === 'CODE10') {
      setAppliedDiscount(10);
      setDiscountMessage('10% discount applied!');
    } else if (code === 'CODE20') {
      setAppliedDiscount(20);
      setDiscountMessage('20% discount applied!');
    } else if (code === '') {
      setAppliedDiscount(0);
      setDiscountMessage('');
    } else {
      setAppliedDiscount(0);
      setDiscountMessage('Invalid code');
    }
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discount = (subtotal * appliedDiscount) / 100;
    return subtotal - discount;
  };

  const getTotalItems = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <style>{scrollbarStyles}</style>
      <div className="flex items-center justify-between py-4 px-4 md:py-6 md:px-6 border-b border-gray-200 bg-white">
        <h1 className="text-xl md:text-3xl font-bold text-gray-900">Online Shopping Nepal</h1>
        <div className="flex items-center gap-2 text-gray-700">
          <ShoppingCart className="w-4 h-4 md:w-5 md:h-5" />
          <span className="font-medium text-sm md:text-base">{getTotalItems()} items</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        <div className="flex-1 p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h2 className="text-lg md:text-xl font-semibold text-gray-900">Products</h2>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 text-sm md:text-base"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white p-3 md:p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-40 md:h-48 object-contain mb-3 md:mb-4"
                />
                <h3 className="font-medium text-gray-900 mb-2 h-10 md:h-12 line-clamp-2 text-sm md:text-base">
                  {product.title}
                </h3>
                <p className="text-lg md:text-xl font-bold text-gray-900 mb-3 md:mb-4">
                  ${product.price.toFixed(2)}
                </p>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full bg-gray-900 text-white py-2 hover:bg-gray-800 transition-colors text-sm md:text-base"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <p className="text-center text-gray-500 py-8 md:py-12">No products found</p>
          )}
        </div>

        <div className="w-full lg:w-80 bg-white border-t lg:border-t-0 lg:border-l border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Cart</h2>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500 py-8">Your cart is empty</p>
          ) : (
            <>
              <div
                className="space-y-4 mb-6 max-h-96 overflow-y-auto cart-scroll"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#d1d5db #f3f4f6'
                }}
              >
                {cart.map(item => (
                  <div key={item.id} className="pb-4 border-b border-gray-100">
                    <h4 className="font-medium text-sm text-gray-900 mb-2 line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      ${item.price.toFixed(2)} × {item.quantity} =
                      <span className="font-semibold text-gray-900 ml-1">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decrementQuantity(item.id)}
                        className="bg-gray-100 hover:bg-gray-200 px-2 py-1 text-sm"
                      >
                        -
                      </button>
                      <span className="font-medium min-w-[24px] text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => incrementQuantity(item.id)}
                        className="bg-gray-100 hover:bg-gray-200 px-2 py-1 text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => resetQuantity(item.id)}
                        className="ml-auto text-red-600 hover:text-red-700 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Discount Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-500 text-sm"
                  />
                  <button
                    onClick={applyDiscount}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-2 text-sm"
                  >
                    Apply
                  </button>
                </div>
                {discountMessage && (
                  <p className={`mt-2 text-xs ${discountMessage === 'Invalid code' ? 'text-red-600' : 'text-green-600'
                    }`}>
                    {discountMessage}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-gray-700 text-sm">
                  <span>Subtotal</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-green-600 text-sm">
                    <span>Discount ({appliedDiscount}%)</span>
                    <span>
                      -${((calculateSubtotal() * appliedDiscount) / 100).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}