# Implementation Plan - Food & Beverage System

## Task Overview

This implementation plan breaks down the Food & Beverage system into discrete, manageable tasks. Each task builds incrementally on previous work, ensuring a smooth development process from database models to final integration.

---

## Phase 1: Backend Foundation

- [x] 1. Create F&B database models and schemas


  - Create `FBItem` model with all fields (name, category, price, sizes, combo details, etc.)
  - Create `FBOffer` model with discount types and applicability rules
  - Add indexes for efficient queries (category, cinemaId, isActive)
  - Add validation rules for prices, quantities, and dates
  - _Requirements: 2.1, 9.2_

- [ ]* 1.1 Write property test for F&B models
  - **Property 10: Non-negative totals** - For any cart and discount combination, the final total should never be negative
  - **Validates: Requirements 10.3**




- [ ] 2. Create F&B API endpoints
  - Implement `GET /api/fb/items` with filtering by cinema and category
  - Implement `GET /api/fb/offers` with date and ticket count filtering
  - Implement `POST /api/fb/calculate-total` for price calculations with offers
  - Implement `POST /api/fb/recommendations` for smart combo suggestions
  - Add error handling and validation for all endpoints
  - _Requirements: 2.1, 4.2, 5.1, 10.1_

- [ ]* 2.1 Write property test for price calculation
  - **Property 4: Cart total accuracy** - For any cart with items, the subtotal should equal the sum of (item.price × item.quantity)
  - **Validates: Requirements 10.1**

- [ ]* 2.2 Write property test for offer application
  - **Property 5: Offer application correctness** - For any active offer and applicable items, the discount should be calculated correctly
  - **Validates: Requirements 4.1, 4.2**

- [ ] 3. Enhance Booking model to store F&B data
  - Add `fbItems` array field to Booking schema
  - Add `fbSubtotal`, `fbDiscount`, `fbTotal` fields
  - Update booking creation logic to include F&B data
  - Update booking retrieval to populate F&B items
  - _Requirements: 8.1, 8.2_

- [ ]* 3.1 Write property test for F&B persistence
  - **Property 8: F&B persistence** - For any completed booking with F&B items, retrieving the booking should return the same F&B items
  - **Validates: Requirements 8.1**

- [ ] 4. Checkpoint - Ensure all backend tests pass
  - Ensure all tests pass, ask the user if questions arise

---

## Phase 2: Admin Panel Integration

- [ ] 5. Create F&B management section in admin panel
  - Add "Food & Beverages" menu item to admin navigation
  - Create F&B items list view with search and filters
  - Create F&B item form for add/edit operations
  - Add image upload functionality for F&B items
  - Implement activate/deactivate toggle for items
  - _Requirements: 9.1, 9.2, 9.3, 9.5_

- [ ] 6. Create F&B offers management in admin panel
  - Create offers list view with active/expired filters
  - Create offer form with discount type selection
  - Add date range picker for offer validity


  - Add multi-select for applicable items/categories
  - Implement offer activation/deactivation
  - _Requirements: 9.4_

- [ ] 7. Seed sample F&B data for testing
  - Create seed script with sample popcorn items (Small, Medium, Large)
  - Add sample drinks (Coke, Pepsi, Water, etc.)
  - Add sample combos (Family Combo, Couple Combo, etc.)
  - Add sample offers (10% off snacks, Free drink on Tuesday, etc.)
  - Run seed script to populate database


  - _Requirements: 2.1, 4.1_

---

## Phase 3: Frontend Components - F&B Prompt

- [ ] 8. Create FBPromptModal component
  - Create modal component with backdrop and overlay
  - Add Yes/No buttons with clear styling
  - Implement slide-up animation on open
  - Add optional popular items preview section
  - Make modal responsive for mobile devices


  - _Requirements: 1.1, 1.2_

- [ ]* 8.1 Write unit test for modal interactions
  - Test modal opens after seat selection
  - Test Yes button triggers navigation to F&B menu
  - Test No button triggers navigation to payment
  - _Requirements: 1.1, 1.3, 1.4_

- [ ] 9. Integrate F&B prompt into BookingPage flow
  - Add state for `showFBPrompt` in BookingPage
  - Modify `handleProceedFromSeatSelection` to show prompt instead of going directly to payment
  - Implement `handleFBYes` to navigate to F&B menu
  - Implement `handleFBNo` to navigate to payment
  - Pass ticket count to modal for context



  - _Requirements: 1.3, 1.4, 1.5_

- [ ]* 9.1 Write property test for navigation flow
  - **Property 1: Modal navigation flow** - For any booking state, clicking "No" should navigate to payment without F&B data
  - **Validates: Requirements 1.3, 1.4**

---

## Phase 4: Frontend Components - F&B Menu

- [ ] 10. Create FoodBeveragePage component structure
  - Create main page component with header and navigation
  - Add category navigation bar (All, Combos, Popcorn, Drinks, Snacks)
  - Implement category filtering logic
  - Add loading and error states
  - Make layout responsive (grid on desktop, list on mobile)
  - _Requirements: 2.1, 2.2_

- [ ] 11. Create FBItemCard component
  - Design card layout with image, name, description, price
  - Add offer badge display for items with active offers
  - Implement size selector for items with multiple sizes
  - Add "Add to Cart" button with smooth animation
  - Show quantity controls when item is in cart
  - _Requirements: 2.3, 2.4, 3.1, 3.2, 4.1_

- [ ]* 11.1 Write unit tests for item card
  - Test item displays correctly with all fields
  - Test size selection updates price
  - Test add to cart button functionality
  - _Requirements: 2.3, 3.1_

- [ ] 12. Implement cart state management
  - Create cart state using Map for efficient lookups
  - Implement `addToCart` function with duplicate handling
  - Implement `updateQuantity` function with validation
  - Implement `removeFromCart` function
  - Implement `recalculateCart` function with offer application
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ]* 12.1 Write property test for cart operations
  - **Property 3: Cart operations maintain invariants** - For any cart state and item, operations should maintain consistency
  - **Validates: Requirements 3.1, 3.3, 3.4**

- [ ] 13. Create FBCart component
  - Create sticky cart sidebar (desktop) / bottom sheet (mobile)
  - Display cart items with quantities and prices
  - Add quantity controls (+/-) for each item
  - Show subtotal, discounts, and total
  - Add "Continue to Payment" and "Skip F&B" buttons
  - Implement empty cart state with message
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [ ] 14. Implement F&B recommendations section
  - Fetch recommendations based on ticket count
  - Display recommended combos with "Recommended for You" badge
  - Show reason for recommendation (e.g., "Perfect for 3 people")
  - Highlight savings amount for combos
  - Make recommendations dismissible
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ]* 14.1 Write property test for recommendations
  - **Property 6: Recommendation logic** - For any ticket count, appropriate combos should be recommended
  - **Validates: Requirements 5.2**

- [ ] 15. Integrate offer application logic
  - Fetch active offers on page load
  - Filter offers based on booking date and ticket count
  - Apply offers automatically to cart items
  - Display offer badges on applicable items
  - Show applied discounts in cart summary
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [ ] 16. Add F&B page styling and animations
  - Create CSS file with cinema-themed styling
  - Add smooth transitions for cart updates
  - Implement hover effects on item cards
  - Add loading skeletons for items
  - Ensure responsive design for all screen sizes
  - _Requirements: 2.1, 2.2_

- [ ] 17. Checkpoint - Test F&B menu functionality
  - Ensure all tests pass, ask the user if questions arise

---

## Phase 5: Payment Integration

- [ ] 18. Enhance PaymentPage to display F&B items
  - Add `fbData` prop to PaymentPage component
  - Create enhanced price breakdown section
  - Display ticket price as separate line item
  - Display F&B items with expandable details
  - Show all discounts with descriptions
  - Display final total prominently
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ]* 18.1 Write property test for price breakdown
  - **Property 7: Price breakdown completeness** - For any booking with F&B, all line items should be displayed
  - **Validates: Requirements 7.1, 7.2**

- [ ] 19. Update payment processing to include F&B
  - Modify payment submission to include F&B data
  - Recalculate total on server before processing
  - Validate F&B items and prices server-side
  - Store F&B data with booking record
  - _Requirements: 8.1, 8.2, 10.1, 10.2_

- [ ]* 19.1 Write property test for combo pricing
  - **Property 9: Combo pricing** - For any combo item, the price should be the combo price, not sum of individuals
  - **Validates: Requirements 10.2**

- [ ] 20. Update TicketPage to display F&B items
  - Add F&B section to ticket display
  - Show all F&B items with quantities
  - Display F&B collection instructions
  - Include F&B in email ticket
  - _Requirements: 8.3_

---

## Phase 6: Integration and Polish

- [ ] 21. Connect all components in BookingPage
  - Update BookingPage state to include F&B flow
  - Implement navigation between seat selection, F&B prompt, F&B menu, and payment
  - Pass F&B data through the flow correctly
  - Handle back navigation appropriately
  - Test complete flow from start to finish
  - _Requirements: 1.1, 1.3, 1.4, 6.4_

- [ ] 22. Implement error handling and edge cases
  - Handle API failures gracefully with retry logic
  - Show user-friendly error messages
  - Handle out-of-stock items
  - Validate cart before proceeding to payment
  - Handle session timeout scenarios
  - _Requirements: 3.5, 4.2_

- [ ] 23. Add loading states and optimistic updates
  - Show loading spinners during API calls
  - Implement skeleton screens for F&B menu
  - Use optimistic UI updates for cart operations
  - Add success animations for cart additions
  - _Requirements: 2.1, 3.1_

- [ ] 24. Implement mobile-specific optimizations
  - Make cart collapsible on mobile
  - Optimize touch targets for mobile (44x44px minimum)
  - Implement swipe gestures for cart items
  - Test on various mobile screen sizes
  - _Requirements: 1.2, 2.1, 6.1_

- [ ] 25. Add accessibility features
  - Add ARIA labels to all interactive elements
  - Ensure keyboard navigation works throughout
  - Test with screen readers
  - Add focus indicators
  - Ensure color contrast meets WCAG standards
  - _Requirements: 1.2, 2.1, 3.2_

- [ ] 26. Final checkpoint - Complete end-to-end testing
  - Ensure all tests pass, ask the user if questions arise

---

## Phase 7: Documentation and Deployment

- [ ] 27. Create user documentation
  - Write guide for using F&B system
  - Document offer types and how they work
  - Create FAQ for common questions
  - Add tooltips and help text in UI

- [ ] 28. Create admin documentation
  - Write guide for managing F&B items
  - Document how to create and manage offers
  - Explain pricing and discount strategies
  - Add troubleshooting section

- [ ] 29. Performance testing and optimization
  - Test with large F&B menus (100+ items)
  - Optimize image loading and caching
  - Minimize bundle size
  - Test on slow network connections

- [ ] 30. Final deployment preparation
  - Review all code for production readiness
  - Ensure all environment variables are configured
  - Test on staging environment
  - Prepare rollback plan
  - Deploy to production

---

## Summary

**Total Tasks**: 30 main tasks + 10 optional test tasks = 40 tasks

**Estimated Timeline**:
- Phase 1 (Backend): 2-3 days
- Phase 2 (Admin): 1-2 days
- Phase 3 (F&B Prompt): 1 day
- Phase 4 (F&B Menu): 3-4 days
- Phase 5 (Payment): 1-2 days
- Phase 6 (Integration): 2-3 days
- Phase 7 (Documentation): 1 day

**Total**: 11-16 days for complete implementation

**Key Milestones**:
1. Backend API functional (after Phase 1)
2. Admin can manage F&B items (after Phase 2)
3. Users can browse F&B menu (after Phase 4)
4. Complete booking flow works (after Phase 6)
5. Production ready (after Phase 7)

