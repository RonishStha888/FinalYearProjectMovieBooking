# 🧪 Chatbot FAB Testing Guide

## Quick Test Instructions

### Prerequisites
1. Backend server running: `cd backend && npm start`
2. Frontend server running: `cd frontend && npm run dev`
3. Open browser: `http://localhost:5173`

---

## Test 1: FAB Button Visibility ✅

**Steps:**
1. Open the website
2. Click "LIVE CHAT" button (bottom-right)
3. Look at the chat header (top-right area)

**Expected Result:**
- ✅ You should see a purple circular button with three dots (⋮)
- ✅ Button should be positioned between the chatbot title and close button
- ✅ Button should have a subtle shadow

**Pass/Fail:** ___________

---

## Test 2: Quick Actions Panel Toggle ✅

**Steps:**
1. Open chatbot
2. Click the three-dot FAB button

**Expected Result:**
- ✅ Panel slides down smoothly from the top
- ✅ Shows "Quick Questions" header with × close button
- ✅ Shows 6 buttons in a grid (3 columns on desktop)
- ✅ FAB button rotates 90 degrees
- ✅ Animation is smooth (no jank)

**Pass/Fail:** ___________

---

## Test 3: Quick Action Buttons ✅

**Steps:**
1. Open quick actions panel
2. Hover over each button (desktop only)
3. Click "Book Tickets" button

**Expected Result:**
- ✅ Buttons turn purple on hover
- ✅ Buttons lift slightly with shadow on hover
- ✅ Text turns white on hover
- ✅ Clicking sends "How do I book tickets?" to chat
- ✅ Panel closes automatically after click
- ✅ Chatbot responds with booking instructions

**Pass/Fail:** ___________

---

## Test 4: All Quick Actions ✅

Test each button individually:

| Button | Expected Question | Bot Response | Pass/Fail |
|--------|-------------------|--------------|-----------|
| 🎫 Book Tickets | "How do I book tickets?" | Booking instructions | ___ |
| 💳 Payment | "What payment methods do you accept?" | Payment methods | ___ |
| 🪑 Seat Selection | "How do I select seats?" | Seat selection guide | ___ |
| 🎁 Offers | "Do you have any discounts or offers?" | Discount info | ___ |
| 🕐 Timings | "What are your cinema timings?" | Cinema hours | ___ |
| 🍿 Food & Drinks | "Do you have food and beverages?" | F&B info | ___ |

**Overall Pass/Fail:** ___________

---

## Test 5: Close Functionality ✅

**Steps:**
1. Open quick actions panel
2. Click the × button in the panel header

**Expected Result:**
- ✅ Panel slides up and closes
- ✅ FAB button rotates back to original position
- ✅ Animation is smooth

**Alternative:**
1. Open quick actions panel
2. Click the FAB button again

**Expected Result:**
- ✅ Panel closes (same as × button)

**Pass/Fail:** ___________

---

## Test 6: Mobile Responsive (≤ 480px) ✅

**Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select iPhone or similar mobile device
4. Open chatbot
5. Open quick actions panel

**Expected Result:**
- ✅ Grid shows 2 columns (not 3)
- ✅ Buttons are larger and easier to tap
- ✅ Icons are 28px (larger than desktop)
- ✅ Text is 12px (larger than desktop)
- ✅ Panel fits within chat window
- ✅ No horizontal scrolling

**Pass/Fail:** ___________

---

## Test 7: Tablet Responsive (481px - 768px) ✅

**Steps:**
1. Open browser DevTools
2. Set viewport to 768px width
3. Open chatbot
4. Open quick actions panel

**Expected Result:**
- ✅ Grid shows 3 columns (same as desktop)
- ✅ Buttons are appropriately sized
- ✅ Layout looks balanced

**Pass/Fail:** ___________

---

## Test 8: Keyboard Navigation ✅

**Steps:**
1. Open chatbot
2. Press Tab until FAB button is focused
3. Press Enter to open panel
4. Press Tab to navigate through quick action buttons
5. Press Enter on a button

**Expected Result:**
- ✅ FAB button receives focus (visible outline)
- ✅ Enter key toggles panel
- ✅ Tab navigates through buttons
- ✅ Enter key activates button
- ✅ Question is sent to chat

**Pass/Fail:** ___________

---

## Test 9: Multiple Open/Close Cycles ✅

**Steps:**
1. Open quick actions panel
2. Close it (× or FAB button)
3. Open it again
4. Close it again
5. Repeat 5 times

**Expected Result:**
- ✅ Panel opens/closes smoothly every time
- ✅ No visual glitches
- ✅ No console errors
- ✅ FAB button rotates correctly each time
- ✅ No memory leaks (check DevTools Performance)

**Pass/Fail:** ___________

---

## Test 10: Interaction with Chat Messages ✅

**Steps:**
1. Send a few manual messages in chat
2. Open quick actions panel
3. Click a quick action button
4. Verify message appears in chat history

**Expected Result:**
- ✅ Quick action question appears as user message
- ✅ Bot responds appropriately
- ✅ Message history is preserved
- ✅ Scroll position updates correctly
- ✅ Panel closes after sending

**Pass/Fail:** ___________

---

## Test 11: Visual Consistency ✅

**Checklist:**
- [ ] FAB button matches chatbot purple theme
- [ ] Panel background is light gray gradient
- [ ] Buttons have consistent spacing (8px gap)
- [ ] Icons are centered in buttons
- [ ] Text is centered below icons
- [ ] Hover effects are smooth
- [ ] Shadows are subtle and professional
- [ ] Colors match RTX Cinema branding

**Pass/Fail:** ___________

---

## Test 12: Performance ✅

**Steps:**
1. Open Chrome DevTools
2. Go to Performance tab
3. Start recording
4. Open/close quick actions panel 10 times
5. Stop recording
6. Check frame rate

**Expected Result:**
- ✅ Animations run at 60fps
- ✅ No dropped frames
- ✅ No layout thrashing
- ✅ Smooth transitions

**Pass/Fail:** ___________

---

## Test 13: Browser Compatibility ✅

Test in multiple browsers:

| Browser | Version | FAB Works | Panel Works | Animations Smooth | Pass/Fail |
|---------|---------|-----------|-------------|-------------------|-----------|
| Chrome | Latest | ___ | ___ | ___ | ___ |
| Firefox | Latest | ___ | ___ | ___ | ___ |
| Safari | Latest | ___ | ___ | ___ | ___ |
| Edge | Latest | ___ | ___ | ___ | ___ |

**Overall Pass/Fail:** ___________

---

## Test 14: Console Errors ✅

**Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Clear console
4. Open chatbot
5. Open quick actions panel
6. Click several quick action buttons
7. Close panel
8. Check console

**Expected Result:**
- ✅ No errors in console
- ✅ No warnings (except expected ones)
- ✅ No failed network requests

**Pass/Fail:** ___________

---

## Test 15: Accessibility ✅

**Steps:**
1. Open chatbot
2. Right-click FAB button → Inspect
3. Check for aria-label
4. Use screen reader (NVDA/JAWS) if available

**Expected Result:**
- ✅ FAB button has aria-label="Toggle quick actions"
- ✅ Quick action buttons have descriptive titles
- ✅ Close button has aria-label="Close quick actions"
- ✅ Screen reader announces elements correctly
- ✅ Focus indicators are visible

**Pass/Fail:** ___________

---

## Common Issues & Fixes

### Issue: Panel doesn't open
**Check:**
- Is `showQuickActions` state updating?
- Are there any console errors?
- Is CSS file loaded correctly?

**Fix:**
```jsx
// Verify state in ChatWindow.jsx
console.log('showQuickActions:', showQuickActions);
```

---

### Issue: Buttons not hovering
**Check:**
- Is CSS file loaded?
- Are hover styles being overridden?

**Fix:**
```css
/* Add !important if needed (last resort) */
.quick-action-btn:hover {
  background: linear-gradient(135deg, #6c3fc5 0%, #8b2fc9 100%) !important;
}
```

---

### Issue: Grid layout broken
**Check:**
- Browser DevTools → Elements → Computed styles
- Verify grid-template-columns value

**Fix:**
```css
/* Ensure grid is defined */
.quick-actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
```

---

### Issue: FAB button not rotating
**Check:**
- Is `.active` class being applied?
- Check browser DevTools → Elements

**Fix:**
```jsx
// Verify class in ChatWindow.jsx
<button className={`chat-fab-toggle ${showQuickActions ? 'active' : ''}`}>
```

---

### Issue: Mobile layout wrong
**Check:**
- Browser DevTools → Responsive mode
- Verify viewport width

**Fix:**
```css
/* Check media query */
@media (max-width: 480px) {
  .quick-actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## Final Checklist

Before marking as complete:

- [ ] All 15 tests passed
- [ ] No console errors
- [ ] Works on desktop
- [ ] Works on tablet
- [ ] Works on mobile
- [ ] Keyboard accessible
- [ ] Screen reader friendly
- [ ] Smooth animations (60fps)
- [ ] All browsers tested
- [ ] Visual design matches mockup
- [ ] Code is clean and commented
- [ ] Documentation is complete

---

## Test Results Summary

**Date Tested:** ___________
**Tested By:** ___________
**Browser:** ___________
**Device:** ___________

**Total Tests:** 15
**Passed:** ___________
**Failed:** ___________
**Pass Rate:** ___________%

**Overall Status:** ✅ PASS / ❌ FAIL

**Notes:**
_______________________________________
_______________________________________
_______________________________________

---

## Quick Demo Script

Use this script to demo the feature:

```
1. "Let me show you our new chatbot quick actions feature"
2. *Open chatbot*
3. "Notice this purple button with three dots in the header"
4. *Click FAB button*
5. "This opens a panel with 6 common questions"
6. *Hover over buttons to show purple effect*
7. "Users can click any button to instantly ask that question"
8. *Click "Book Tickets"*
9. "The question is sent automatically and the chatbot responds"
10. "This reduces user effort from typing to just 2 clicks"
11. *Show mobile view*
12. "On mobile, the layout adapts to 2 columns for easier tapping"
```

---

**Testing Guide Version:** 1.0.0
**Last Updated:** May 20, 2026
**Status:** ✅ Ready for Testing

