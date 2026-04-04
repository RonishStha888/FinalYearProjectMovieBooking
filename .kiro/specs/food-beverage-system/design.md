# Design Document - Food & Beverage System

## Overview

The Food & Beverage (F&B) system integrates seamlessly into the existing cinema booking flow, appearing after seat selection and before payment. The system provides an intuitive interface for browsing, selecting, and customizing food and beverage orders, with intelligent recommendations and automatic discount application.

## Architecture

### System Flow

```
Seat Selection Complete
    ↓
F&B Prompt Modal (Yes/No)
    ↓
├─ No → Payment Page (tickets only)
    ↓
└─ Yes → F&B Menu Page
    ↓
    Browse Items by Category
    ↓
    Add Items to Cart
    ↓
    Apply Offers & Discounts
    ↓
    Review Cart Summary
    ↓
    Continue to Payment
    ↓
Payment Page (tickets + F&B)
    ↓
Complete Booking
    ↓
Store F&B with Booking
```

### Component Hierarchy

```
BookingPage (Parent)
├─ SeatSelection
│   └─ onProceed → triggers F&B prompt
├─ FBPromptModal
│   ├─ Yes → navigate to F&B page
│   └─ No → navigate to payment
├─ FoodBeveragePage
│   ├─ FBCategoryNav
│   ├─ FBItemGrid
│   │   └─ FBItemCard
│   ├─ FBCart
│   │   └─ FBCartItem
│   └─ FBRecommendations
└─ PaymentPage
    └─ PriceBreakdown (enhanced with F&B)
```

## Components and Interfaces

### 1. FBPromptModal Component

**Purpose**: Display modal after seat selection asking if user wants to add F&B

**Props**:
```typescript
interface FBPromptModalProps {
  isOpen: boolean;
  onYes: () => void;
  onNo: () => void;
  ticketCount: number;
}
```

**Features**:
- Overlay with backdrop blur
- Animated slide-up entrance
- Clear Yes/No buttons
- Optional "Popular combos" preview
- Responsive design

### 2. FoodBeveragePage Component

**Purpose**: Main F&B menu and cart management page

**Props**:
```typescript
interface FoodBeveragePageProps {
  cinema: Cinema;
  ticketCount: number;
  bookingDate: string;
  onBack: () => void;
  onContinue: (fbData: FBSelection) => void;
}
```

**State**:
```typescript
interface FBPageState {
  items: FBItem[];
  cart: CartItem[];
  selectedCategory: string;
  offers: FBOffer[];
  loading: boolean;
}
```

### 3. FBItemCard Component

**Purpose**: Display individual F&B item with add-to-cart functionality

**Props**:
```typescript
interface FBItemCardProps {
  item: FBItem;
  onAdd: (item: FBItem) => void;
  inCart: boolean;
  quantity: number;
}
```

**Features**:
- Item image with lazy loading
- Name, description, price
- Size options (if applicable)
- Offer badge
- Add/quantity controls
- Smooth animations

### 4. FBCart Component

**Purpose**: Display cart summary with items, quantities, and totals

**Props**:
```typescript
interface FBCartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  subtotal: number;
  discounts: Discount[];
  total: number;
}
```

**Features**:
- Sticky positioning
- Collapsible on mobile
- Real-time total updates
- Discount display
- Continue/Skip buttons

### 5. Enhanced PaymentPage Component

**Purpose**: Display complete price breakdown including F&B

**Additional Props**:
```typescript
interface PaymentPageProps {
  // ... existing props
  fbData?: FBSelection;
}
```

**Enhanced Price Breakdown**:
```typescript
interface PriceBreakdown {
  ticketPrice: number;
  ticketCount: number;
  ticketSubtotal: number;
  fbItems: CartItem[];
  fbSubtotal: number;
  discounts: Discount[];
  totalDiscount: number;
  convenienceFee: number;
  finalTotal: number;
}
```

## Data Models

### FBItem Model

```typescript
interface FBItem {
  _id: string;
  name: string;
  category: 'popcorn' | 'drinks' | 'combos' | 'snacks' | 'candy';
  description: string;
  image: string;
  basePrice: number;
  sizes?: {
    name: string; // 'Small', 'Medium', 'Large'
    price: number;
    calories?: number;
  }[];
  isCombo: boolean;
  comboItems?: string[]; // Item names included in combo
  originalPrice?: number; // For showing savings
  tags: string[]; // 'vegetarian', 'popular', 'new'
  cinemaId?: string; // Optional: cinema-specific items
  isActive: boolean;
  stock?: number; // Optional: inventory management
  preparationTime?: number; // Minutes
}
```

### FBOffer Model

```typescript
interface FBOffer {
  _id: string;
  title: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_item' | 'combo_discount';
  value: number;
  applicableItems: string[]; // Item IDs
  applicableCategories: string[];
  minTickets?: number;
  minAmount?: number;
  validDays?: string[]; // ['monday', 'tuesday']
  validFrom: Date;
  validUntil: Date;
  isActive: boolean;
  priority: number; // For stacking multiple offers
}
```

### CartItem Model

```typescript
interface CartItem {
  item: FBItem;
  quantity: number;
  selectedSize?: string;
  price: number; // Price per unit (considering size)
  subtotal: number; // price * quantity
  appliedOffers: string[]; // Offer IDs applied to this item
}
```

### FBSelection Model

```typescript
interface FBSelection {
  items: CartItem[];
  subtotal: number;
  appliedOffers: FBOffer[];
  totalDiscount: number;
  finalTotal: number;
  specialInstructions?: string;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Acceptence Criteria Testing Prework:

**1.1** WHEN a user completes seat selection THEN the system SHALL display a modal prompt asking if they want to add food and beverages
Thoughts: This is testing a specific UI interaction. We can test that after seat selection completes, the modal state is set to open.
Testable: yes - example

**1.2** WHEN the modal is displayed THEN the system SHALL provide clear "Yes" and "No" options with appropriate visual styling
Thoughts: This is about UI rendering. We can test that the modal contains the required buttons.
Testable: yes - example

**1.3** WHEN the user clicks "No" THEN the system SHALL proceed directly to the payment page with only ticket costs
Thoughts: This is testing navigation flow. For any booking state, clicking No should navigate to payment without F&B data.
Testable: yes - property

**2.1** WHEN the F&B menu page loads THEN the system SHALL display all available food and beverage items
Thoughts: This is testing that all active items are rendered. For any set of active F&B items, they should all appear in the menu.
Testable: yes - property

**3.1** WHEN a user clicks on an F&B item THEN the system SHALL add one unit of that item to the cart
Thoughts: This is an invariant - adding an item should increase cart size by 1.
Testable: yes - property

**3.2** WHEN an item is in the cart THEN the system SHALL display quantity controls
Thoughts: This is testing UI rendering based on cart state.
Testable: yes - property

**3.3** WHEN the user increases quantity THEN the system SHALL increment the count and update the total price
Thoughts: This is testing cart arithmetic. For any item and quantity, increasing should correctly update totals.
Testable: yes - property

**3.4** WHEN the user decreases quantity to zero THEN the system SHALL remove the item from the cart
Thoughts: This is testing cart cleanup logic.
Testable: yes - property

**4.1** WHEN special offers are active THEN the system SHALL display offer badges on applicable items
Thoughts: This is testing offer visibility logic.
Testable: yes - property

**4.2** WHEN a discount applies to the cart THEN the system SHALL automatically calculate and show the discount amount
Thoughts: This is testing discount calculation accuracy.
Testable: yes - property

**5.1** WHEN the F&B page loads THEN the system SHALL analyze the number of tickets booked
Thoughts: This is testing recommendation logic initialization.
Testable: yes - example

**5.2** WHEN multiple tickets are booked THEN the system SHALL recommend family or group combos
Thoughts: This is testing recommendation rules based on ticket count.
Testable: yes - property

**7.1** WHEN the payment page loads THEN the system SHALL display ticket price as a separate line item
Thoughts: This is testing price breakdown structure.
Testable: yes - example

**7.2** WHEN F&B items are selected THEN the system SHALL display F&B total as a separate line item
Thoughts: This is testing that F&B appears in breakdown when present.
Testable: yes - property

**8.1** WHEN payment is completed THEN the system SHALL store F&B items with the booking record
Thoughts: This is testing data persistence.
Testable: yes - property

**10.1** WHEN calculating F&B total THEN the system SHALL sum all item prices multiplied by their quantities
Thoughts: This is testing arithmetic correctness. For any cart, the total should equal sum of (price * quantity).
Testable: yes - property

**10.2** WHEN combo discounts apply THEN the system SHALL use the combo price instead of individual item prices
Thoughts: This is testing pricing logic for combos.
Testable: yes - property

**10.3** WHEN the final total is calculated THEN the system SHALL ensure no negative totals
Thoughts: This is testing boundary conditions.
Testable: yes - property (edge case)

### Property Reflection:

After reviewing all properties, I've identified the following consolidations:

- Properties 3.1, 3.3, and 3.4 can be combined into a comprehensive "Cart operations maintain invariants" property
- Properties 4.1 and 4.2 can be combined into "Offers are correctly applied and displayed"
- Properties 10.1 and 10.2 can be combined into "Price calculations are accurate"

### Correctness Properties:

**Property 1: Modal navigation flow**
*For any* booking state, when the user clicks "No" on the F&B prompt, the system should navigate to payment without F&B data, and when clicking "Yes", should navigate to the F&B menu.
**Validates: Requirements 1.3, 1.4**

**Property 2: All active items displayed**
*For any* set of active F&B items in the database, all items should appear in the menu when the F&B page loads.
**Validates: Requirements 2.1**

**Property 3: Cart operations maintain invariants**
*For any* cart state and item, adding an item increases cart size by 1, increasing quantity updates totals correctly, and decreasing to zero removes the item.
**Validates: Requirements 3.1, 3.3, 3.4**

**Property 4: Cart total accuracy**
*For any* cart with items, the subtotal should equal the sum of (item.price × item.quantity) for all items.
**Validates: Requirements 10.1**

**Property 5: Offer application correctness**
*For any* active offer and applicable items, the discount should be calculated correctly and displayed with the offer badge.
**Validates: Requirements 4.1, 4.2**

**Property 6: Recommendation logic**
*For any* ticket count, if count > 2, the system should recommend family/group combos; if count = 1, recommend individual combos.
**Validates: Requirements 5.2**

**Property 7: Price breakdown completeness**
*For any* booking with F&B items, the payment page should display separate line items for tickets, F&B, discounts, and final total.
**Validates: Requirements 7.1, 7.2**

**Property 8: F&B persistence**
*For any* completed booking with F&B items, retrieving the booking should return the same F&B items with quantities and prices.
**Validates: Requirements 8.1**

**Property 9: Combo pricing**
*For any* combo item in cart, the price used should be the combo price, not the sum of individual item prices.
**Validates: Requirements 10.2**

**Property 10: Non-negative totals**
*For any* cart and discount combination, the final total should never be negative.
**Validates: Requirements 10.3**

## Error Handling

### Client-Side Errors

1. **Network Failures**
   - Retry failed API calls with exponential backoff
   - Show user-friendly error messages
   - Cache F&B menu data for offline viewing

2. **Invalid Cart State**
   - Validate quantities (min: 1, max: 99)
   - Handle out-of-stock items gracefully
   - Prevent duplicate items with different sizes

3. **Offer Application Failures**
   - Validate offer eligibility before applying
   - Show clear messages when offers don't apply
   - Handle expired offers gracefully

### Server-Side Errors

1. **Database Failures**
   - Transaction rollback for failed bookings
   - Retry logic for temporary failures
   - Fallback to default menu if cinema-specific fails

2. **Price Calculation Errors**
   - Validate all inputs before calculation
   - Log discrepancies for audit
   - Use decimal precision for currency

3. **Inventory Management**
   - Check stock before adding to cart
   - Reserve items during checkout
   - Release reserved items on timeout/cancellation

## Testing Strategy

### Unit Tests

1. **Cart Management**
   - Test add/remove/update operations
   - Test quantity validation
   - Test cart total calculations

2. **Offer Application**
   - Test discount calculations
   - Test offer eligibility logic
   - Test offer stacking rules

3. **Price Calculations**
   - Test subtotal calculations
   - Test discount applications
   - Test final total with edge cases

### Property-Based Tests

Using **fast-check** (JavaScript property testing library):

**Property Test 1: Cart arithmetic**
- Generate random items and quantities
- Verify subtotal = sum(price × quantity)
- Run 100+ iterations

**Property Test 2: Offer calculations**
- Generate random offers and carts
- Verify discount never exceeds subtotal
- Verify final total ≥ 0

**Property Test 3: Combo pricing**
- Generate random combos
- Verify combo price < sum of individual prices
- Verify savings displayed correctly

**Property Test 4: Cart operations**
- Generate random add/remove sequences
- Verify cart state consistency
- Verify no duplicate items (same item + size)

### Integration Tests

1. **Complete F&B Flow**
   - Seat selection → F&B prompt → Menu → Cart → Payment
   - Test with various ticket counts
   - Test with different offer combinations

2. **Admin Panel Integration**
   - Create F&B item → Verify appears in menu
   - Update item → Verify changes reflected
   - Deactivate item → Verify removed from menu

3. **Booking Storage**
   - Complete booking with F&B
   - Retrieve booking
   - Verify F&B data integrity

## API Endpoints

### GET /api/fb/items
**Purpose**: Fetch all F&B items for a cinema

**Query Parameters**:
- `cinemaId` (optional): Filter by cinema
- `category` (optional): Filter by category
- `active` (default: true): Include only active items

**Response**:
```json
{
  "success": true,
  "items": [
    {
      "_id": "item123",
      "name": "Large Popcorn",
      "category": "popcorn",
      "price": 250,
      "image": "url",
      "isCombo": false
    }
  ]
}
```

### GET /api/fb/offers
**Purpose**: Fetch active offers

**Query Parameters**:
- `date`: Booking date for day-specific offers
- `ticketCount`: Number of tickets for ticket-based offers

**Response**:
```json
{
  "success": true,
  "offers": [
    {
      "_id": "offer123",
      "title": "10% off snacks",
      "type": "percentage",
      "value": 10,
      "applicableCategories": ["snacks"]
    }
  ]
}
```

### POST /api/fb/calculate-total
**Purpose**: Calculate total with offers applied

**Request Body**:
```json
{
  "items": [
    { "itemId": "item123", "quantity": 2, "size": "large" }
  ],
  "ticketCount": 2,
  "bookingDate": "2024-02-08"
}
```

**Response**:
```json
{
  "success": true,
  "subtotal": 500,
  "appliedOffers": [...],
  "totalDiscount": 50,
  "finalTotal": 450
}
```

### POST /api/fb/recommendations
**Purpose**: Get recommended combos based on ticket count

**Request Body**:
```json
{
  "ticketCount": 3,
  "cinemaId": "cinema123"
}
```

**Response**:
```json
{
  "success": true,
  "recommendations": [
    {
      "item": {...},
      "reason": "Perfect for 3 people",
      "savings": 100
    }
  ]
}
```

## UI/UX Design

### F&B Prompt Modal

**Design**:
- Centered modal with backdrop blur
- Cinema-themed gradient background
- Large, clear Yes/No buttons
- Optional preview of popular items
- Smooth slide-up animation

**Copy**:
```
🍿 Enhance Your Experience!

Would you like to add Food & Beverages to your booking?

[Yes, Show Menu]  [No, Continue to Payment]

💡 Popular combos available with special discounts!
```

### F&B Menu Page

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│ Header: "Food & Beverages" | Cart Icon (badge)     │
├─────────────────────────────────────────────────────┤
│ Category Nav: [All] [Combos] [Popcorn] [Drinks]   │
├─────────────────────────────────────────────────────┤
│ Recommendations Section (if applicable)             │
│ ┌──────┐ ┌──────┐ ┌──────┐                        │
│ │Combo1│ │Combo2│ │Combo3│                        │
│ └──────┘ └──────┘ └──────┘                        │
├─────────────────────────────────────────────────────┤
│ Items Grid                                          │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│ │Item 1│ │Item 2│ │Item 3│ │Item 4│              │
│ └──────┘ └──────┘ └──────┘ └──────┘              │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐              │
│ │Item 5│ │Item 6│ │Item 7│ │Item 8│              │
│ └──────┘ └──────┘ └──────┘ └──────┘              │
└─────────────────────────────────────────────────────┘

Sticky Cart (Bottom/Right):
┌─────────────────────┐
│ Your Cart (3 items) │
│ ─────────────────── │
│ Popcorn x2   Rs.500 │
│ Coke x1      Rs.150 │
│ ─────────────────── │
│ Subtotal    Rs.650  │
│ Discount    -Rs.65  │
│ Total       Rs.585  │
│ ─────────────────── │
│ [Continue to Pay]   │
│ [Skip F&B]          │
└─────────────────────┘
```

### Item Card Design

```
┌─────────────────────┐
│     [Image]         │
│                     │
│ 🏷️ 10% OFF         │ ← Offer badge
├─────────────────────┤
│ Large Popcorn       │
│ Fresh, buttery...   │
│                     │
│ Rs. 250  ̶R̶s̶.̶ ̶2̶8̶0̶  │ ← Price with strikethrough
│                     │
│ [  -  ]  2  [  +  ] │ ← Quantity controls (if in cart)
│ [   Add to Cart   ] │ ← Add button (if not in cart)
└─────────────────────┘
```

### Enhanced Payment Page

```
Price Breakdown:
─────────────────────────────
Tickets (2x Rs. 500)    Rs. 1,000
─────────────────────────────
Food & Beverages:
  Large Popcorn x2      Rs. 500
  Coke x1               Rs. 150
  Combo Discount        -Rs. 50
  F&B Subtotal          Rs. 600
─────────────────────────────
Discounts:
  Monday Offer (10%)    -Rs. 100
─────────────────────────────
Convenience Fee         Rs. 25
─────────────────────────────
TOTAL                   Rs. 1,525
═════════════════════════════
```

## State Management

### BookingPage State Enhancement

```typescript
interface BookingPageState {
  // ... existing state
  showFBPrompt: boolean;
  showFBMenu: boolean;
  fbSelection: FBSelection | null;
}
```

### F&B Page State

```typescript
interface FBPageState {
  items: FBItem[];
  cart: Map<string, CartItem>; // itemId+size as key
  offers: FBOffer[];
  selectedCategory: string;
  loading: boolean;
  error: string | null;
}
```

### Cart Operations

```typescript
// Add item to cart
const addToCart = (item: FBItem, size?: string) => {
  const key = `${item._id}-${size || 'default'}`;
  const existing = cart.get(key);
  
  if (existing) {
    cart.set(key, { ...existing, quantity: existing.quantity + 1 });
  } else {
    cart.set(key, {
      item,
      quantity: 1,
      selectedSize: size,
      price: size ? item.sizes.find(s => s.name === size).price : item.basePrice,
      subtotal: size ? item.sizes.find(s => s.name === size).price : item.basePrice,
      appliedOffers: []
    });
  }
  
  recalculateCart();
};

// Update quantity
const updateQuantity = (key: string, quantity: number) => {
  if (quantity <= 0) {
    cart.delete(key);
  } else {
    const item = cart.get(key);
    cart.set(key, {
      ...item,
      quantity,
      subtotal: item.price * quantity
    });
  }
  
  recalculateCart();
};

// Recalculate with offers
const recalculateCart = () => {
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.subtotal;
  });
  
  const applicableOffers = findApplicableOffers(cart, offers);
  const totalDiscount = calculateDiscounts(cart, applicableOffers);
  const finalTotal = Math.max(0, subtotal - totalDiscount);
  
  setCartTotals({ subtotal, totalDiscount, finalTotal });
};
```

## Performance Considerations

1. **Image Optimization**
   - Lazy load item images
   - Use WebP format with fallbacks
   - Implement progressive loading

2. **Cart Updates**
   - Debounce quantity changes
   - Batch state updates
   - Use memoization for calculations

3. **API Calls**
   - Cache F&B menu data
   - Prefetch offers on page load
   - Use optimistic UI updates

4. **Mobile Performance**
   - Virtual scrolling for large menus
   - Touch-optimized controls
   - Minimize re-renders

## Security Considerations

1. **Price Validation**
   - Always recalculate totals on server
   - Never trust client-side calculations
   - Validate offer eligibility server-side

2. **Input Sanitization**
   - Validate quantities (1-99)
   - Sanitize special instructions
   - Prevent injection attacks

3. **Session Management**
   - Associate cart with session
   - Clear cart on timeout
   - Prevent cart manipulation

## Accessibility

1. **Keyboard Navigation**
   - Tab through items and controls
   - Enter to add items
   - Escape to close modal

2. **Screen Readers**
   - ARIA labels for all controls
   - Announce cart updates
   - Describe offer badges

3. **Visual Accessibility**
   - High contrast mode support
   - Large touch targets (44x44px min)
   - Clear focus indicators

## Future Enhancements

1. **Advanced Features**
   - Save favorite combos
   - Dietary filters (vegetarian, vegan, gluten-free)
   - Allergen information
   - Nutritional information

2. **Personalization**
   - Order history-based recommendations
   - Seasonal items
   - Limited-time offers

3. **Integration**
   - Kitchen display system
   - Inventory management
   - Analytics dashboard

4. **Payment**
   - Split payment (tickets vs F&B)
   - Gift cards for F&B
   - Loyalty points redemption

