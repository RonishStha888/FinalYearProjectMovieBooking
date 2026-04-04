import { useState, useEffect } from 'react';
import './FoodBeveragePage.css';

export default function FoodBeveragePage({ 
  cinema, 
  ticketCount, 
  bookingDate,
  holdExpiresAt,
  onBack, 
  onContinue 
}) {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState(new Map());
  const [offers, setOffers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0,
    totalDiscount: 0,
    finalTotal: 0
  });

  // Timer countdown effect
  useEffect(() => {
    if (!holdExpiresAt) return;

    const updateTimer = () => {
      const remaining = Math.max(0, Math.floor((holdExpiresAt - Date.now()) / 1000));
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        alert('Your seat hold has expired. Please select seats again.');
        onBack();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [holdExpiresAt, onBack]);

  // Fetch F&B data on mount
  useEffect(() => {
    fetchCategories();
    fetchItems();
    fetchOffers();
    fetchRecommendations();
  }, []);

  // Recalculate cart totals when cart changes
  useEffect(() => {
    if (cart.size > 0) {
      calculateTotal();
    } else {
      setCartTotals({ subtotal: 0, totalDiscount: 0, finalTotal: 0 });
    }
  }, [cart, offers]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/fb/categories');
      const data = await response.json();
      if (data.success) {
        setCategories(data.categories);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchItems = async () => {
    try {
      const cinemaId = cinema?._id || '';
      const response = await fetch(
        `http://localhost:5000/api/fb/items?cinemaId=${cinemaId}&active=true`
      );
      const data = await response.json();
      if (data.success) {
        setItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOffers = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/fb/offers?date=${bookingDate}&ticketCount=${ticketCount}`
      );
      const data = await response.json();
      if (data.success) {
        setOffers(data.offers);
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const cinemaId = cinema?._id || '';
      const response = await fetch('http://localhost:5000/api/fb/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketCount, cinemaId })
      });
      const data = await response.json();
      if (data.success) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const calculateTotal = async () => {
    try {
      const cartItems = Array.from(cart.values()).map(item => ({
        itemId: item.item._id,
        quantity: item.quantity,
        size: item.selectedSize
      }));

      const response = await fetch('http://localhost:5000/api/fb/calculate-total', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cartItems,
          ticketCount,
          bookingDate
        })
      });

      const data = await response.json();
      if (data.success) {
        setCartTotals({
          subtotal: data.subtotal,
          totalDiscount: data.totalDiscount,
          finalTotal: data.finalTotal,
          appliedOffers: data.appliedOffers
        });
      }
    } catch (error) {
      console.error('Error calculating total:', error);
    }
  };

  const addToCart = (item, size = null) => {
    const key = `${item._id}-${size || 'default'}`;
    const newCart = new Map(cart);
    
    if (newCart.has(key)) {
      const existing = newCart.get(key);
      newCart.set(key, { ...existing, quantity: existing.quantity + 1 });
    } else {
      const price = size && item.sizes 
        ? item.sizes.find(s => s.name === size)?.price || item.basePrice
        : item.basePrice;
      
      newCart.set(key, {
        item,
        quantity: 1,
        selectedSize: size,
        price
      });
    }
    
    setCart(newCart);
  };

  const updateQuantity = (key, quantity) => {
    const newCart = new Map(cart);
    
    if (quantity <= 0) {
      newCart.delete(key);
    } else {
      const item = newCart.get(key);
      newCart.set(key, { ...item, quantity });
    }
    
    setCart(newCart);
  };

  const removeFromCart = (key) => {
    const newCart = new Map(cart);
    newCart.delete(key);
    setCart(newCart);
  };

  const getFilteredItems = () => {
    if (selectedCategory === 'all') {
      return items;
    }
    return items.filter(item => item.category === selectedCategory);
  };

  const handleContinue = () => {
    if (cart.size === 0) {
      alert('Your cart is empty. Add items or skip to payment.');
      return;
    }

    const fbData = {
      items: Array.from(cart.values()),
      ...cartTotals
    };

    onContinue(fbData);
  };

  const handleSkip = () => {
    onContinue(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredItems = getFilteredItems();
  const cartArray = Array.from(cart.values());

  return (
    <div className="fb-page">
      {/* Header */}
      <header className="fb-header">
        <button className="fb-back-btn" onClick={onBack}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Back
        </button>
        <div className="fb-header-content">
          <h1 className="fb-title">Food & Beverages</h1>
          <p className="fb-subtitle">{cinema?.name || 'Cinema'}</p>
        </div>
        <div className="fb-header-right">
          {holdExpiresAt && timeRemaining > 0 && (
            <div className={`timer-display ${timeRemaining <= 60 ? 'warning' : ''}`} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              background: timeRemaining <= 60 ? 'rgba(255, 87, 34, 0.1)' : 'rgba(76, 175, 80, 0.1)',
              border: timeRemaining <= 60 ? '1px solid rgba(255, 87, 34, 0.3)' : '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: '8px',
              color: timeRemaining <= 60 ? '#ff5722' : '#4caf50',
              fontSize: '14px',
              fontWeight: '600',
              animation: timeRemaining <= 60 ? 'pulse 1s infinite' : 'none'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span>Time Remaining: {formatTime(timeRemaining)}</span>
            </div>
          )}
          <button className="fb-cart-icon" onClick={() => document.getElementById('fb-cart').scrollIntoView({ behavior: 'smooth' })}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 2L7 6H3L5 20H19L21 6H17L15 2H9Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            {cart.size > 0 && <span className="cart-badge">{cart.size}</span>}
          </button>
        </div>
      </header>

      <div className="fb-content">
        {/* Main Content */}
        <div className="fb-main">
          {/* Category Navigation */}
          <div className="fb-categories">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                <span className="category-icon">{cat.icon}</span>
                <span className="category-name">{cat.name}</span>
              </button>
            ))}
          </div>

          {/* Recommendations */}
          {recommendations.length > 0 && selectedCategory === 'all' && (
            <div className="fb-recommendations">
              <h2 className="section-title">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700"/>
                </svg>
                Recommended for You
              </h2>
              <div className="recommendations-grid">
                {recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-card">
                    <div className="rec-badge">Recommended</div>
                    <img src={rec.item.image} alt={rec.item.name} className="rec-image" />
                    <h3 className="rec-name">{rec.item.name}</h3>
                    <p className="rec-reason">{rec.reason}</p>
                    {rec.savings > 0 && (
                      <p className="rec-savings">Save Rs. {rec.savings}</p>
                    )}
                    <div className="rec-price">
                      {rec.item.originalPrice && (
                        <span className="original-price">Rs. {rec.item.originalPrice}</span>
                      )}
                      <span className="current-price">Rs. {rec.item.basePrice}</span>
                    </div>
                    <button 
                      className="rec-add-btn"
                      onClick={() => addToCart(rec.item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Items Grid */}
          <div className="fb-items-section">
            <h2 className="section-title">
              {selectedCategory === 'all' ? 'All Items' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading menu...</p>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="empty-state">
                <p>No items available in this category</p>
              </div>
            ) : (
              <div className="items-grid">
                {filteredItems.map(item => {
                  const cartKey = `${item._id}-default`;
                  const inCart = cart.has(cartKey);
                  const cartItem = cart.get(cartKey);
                  
                  return (
                    <div key={item._id} className="item-card">
                      {item.tags?.includes('popular') && (
                        <div className="item-badge popular">Popular</div>
                      )}
                      {item.tags?.includes('new') && (
                        <div className="item-badge new">New</div>
                      )}
                      
                      <img src={item.image} alt={item.name} className="item-image" />
                      
                      <div className="item-content">
                        <h3 className="item-name">{item.name}</h3>
                        <p className="item-description">{item.description}</p>
                        
                        {item.isCombo && item.comboItems && (
                          <div className="combo-items">
                            {item.comboItems.map((ci, idx) => (
                              <span key={idx} className="combo-item">{ci}</span>
                            ))}
                          </div>
                        )}
                        
                        <div className="item-price">
                          {item.originalPrice && (
                            <span className="original-price">Rs. {item.originalPrice}</span>
                          )}
                          <span className="current-price">Rs. {item.basePrice}</span>
                          {item.originalPrice && (
                            <span className="savings-badge">
                              Save Rs. {item.originalPrice - item.basePrice}
                            </span>
                          )}
                        </div>
                        
                        {!inCart ? (
                          <button 
                            className="add-to-cart-btn"
                            onClick={() => addToCart(item)}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            Add to Cart
                          </button>
                        ) : (
                          <div className="quantity-controls">
                            <button 
                              className="qty-btn"
                              onClick={() => updateQuantity(cartKey, cartItem.quantity - 1)}
                            >
                              -
                            </button>
                            <span className="qty-display">{cartItem.quantity}</span>
                            <button 
                              className="qty-btn"
                              onClick={() => updateQuantity(cartKey, cartItem.quantity + 1)}
                            >
                              +
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Cart Sidebar */}
        <div className="fb-cart" id="fb-cart">
          <div className="cart-header">
            <h2>Your Cart</h2>
            {cart.size > 0 && (
              <span className="cart-count">{cart.size} {cart.size === 1 ? 'item' : 'items'}</span>
            )}
          </div>

          {cart.size === 0 ? (
            <div className="cart-empty">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                <path d="M9 2L7 6H3L5 20H19L21 6H17L15 2H9Z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <p>Your cart is empty</p>
              <p className="cart-empty-hint">Add items to get started</p>
            </div>
          ) : (
            <>
              <div className="cart-items">
                {cartArray.map((cartItem) => {
                  const key = `${cartItem.item._id}-${cartItem.selectedSize || 'default'}`;
                  return (
                    <div key={key} className="cart-item">
                      <img src={cartItem.item.image} alt={cartItem.item.name} className="cart-item-image" />
                      <div className="cart-item-details">
                        <h4 className="cart-item-name">{cartItem.item.name}</h4>
                        {cartItem.selectedSize && (
                          <p className="cart-item-size">{cartItem.selectedSize}</p>
                        )}
                        <p className="cart-item-price">Rs. {cartItem.price}</p>
                      </div>
                      <div className="cart-item-controls">
                        <div className="cart-qty-controls">
                          <button onClick={() => updateQuantity(key, cartItem.quantity - 1)}>-</button>
                          <span>{cartItem.quantity}</span>
                          <button onClick={() => updateQuantity(key, cartItem.quantity + 1)}>+</button>
                        </div>
                        <button 
                          className="cart-remove-btn"
                          onClick={() => removeFromCart(key)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="cart-summary">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>Rs. {cartTotals.subtotal}</span>
                </div>
                {cartTotals.totalDiscount > 0 && (
                  <div className="summary-row discount">
                    <span>Discount</span>
                    <span>- Rs. {cartTotals.totalDiscount}</span>
                  </div>
                )}
                <div className="summary-row total">
                  <span>Total</span>
                  <span>Rs. {cartTotals.finalTotal}</span>
                </div>
              </div>

              <div className="cart-actions">
                <button className="continue-btn" onClick={handleContinue}>
                  Continue to Payment
                </button>
                <button className="skip-btn" onClick={handleSkip}>
                  Skip F&B
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
