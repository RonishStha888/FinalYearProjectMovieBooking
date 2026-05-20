# 🎨 Chatbot FAB Visual Guide

## Quick Reference: What You'll See

### 1. **FAB Toggle Button** (Top-Right Corner)
```
┌─────────────────────────────────────┐
│  🤖 Chatbot        ⋮  ⊗            │ ← FAB button (three dots)
├─────────────────────────────────────┤
│                                     │
│  Messages appear here...            │
│                                     │
```

### 2. **Quick Actions Panel** (Expanded)
```
┌─────────────────────────────────────┐
│  🤖 Chatbot        ⋮  ⊗            │
├─────────────────────────────────────┤
│  Quick Questions              ×     │
├─────────────────────────────────────┤
│  ┌─────┐  ┌─────┐  ┌─────┐        │
│  │ 🎫  │  │ 💳  │  │ 🪑  │        │
│  │Book │  │Pay  │  │Seat │        │
│  └─────┘  └─────┘  └─────┘        │
│  ┌─────┐  ┌─────┐  ┌─────┐        │
│  │ 🎁  │  │ 🕐  │  │ 🍿  │        │
│  │Offer│  │Time │  │Food │        │
│  └─────┘  └─────┘  └─────┘        │
├─────────────────────────────────────┤
│  Messages appear here...            │
```

### 3. **Button States**

#### Default State
```
┌──────────────┐
│     🎫       │  ← White background
│  Book Tickets│  ← Gray text
└──────────────┘
```

#### Hover State
```
┌──────────────┐
│     🎫       │  ← Purple gradient
│  Book Tickets│  ← White text
└──────────────┘  ← Lifted with shadow
```

---

## Color Palette

### Panel Colors
- **Background**: Light gray gradient (#f8f9fa → #e9ecef)
- **Border**: Light border (#dee2e6)
- **Header Text**: Dark gray (#495057)

### Button Colors
- **Default Background**: White
- **Default Border**: Light gray (#dee2e6)
- **Default Text**: Dark gray (#495057)
- **Hover Background**: Purple gradient (#6c3fc5 → #8b2fc9)
- **Hover Text**: White
- **Hover Shadow**: Purple glow (rgba(108, 63, 197, 0.2))

### FAB Toggle Button
- **Background**: Purple gradient (#6c3fc5 → #8b2fc9)
- **Icon**: White
- **Shadow**: Purple glow (rgba(108, 63, 197, 0.3))
- **Hover**: Scales to 110%
- **Active**: Rotates 90°

---

## Layout Specifications

### Desktop (> 768px)
```
Grid: 3 columns × 2 rows
Gap: 8px
Button Size: ~110px × 90px
Icon Size: 24px
Text Size: 11px
```

### Mobile (≤ 480px)
```
Grid: 2 columns × 3 rows
Gap: 8px
Button Size: ~150px × 100px
Icon Size: 28px
Text Size: 12px
```

---

## Animation Timings

| Element | Property | Duration | Easing |
|---------|----------|----------|--------|
| Panel | max-height | 0.3s | ease |
| Panel | padding | 0.3s | ease |
| Button | transform | 0.2s | ease |
| Button | background | 0.2s | ease |
| FAB | transform | 0.3s | ease |
| FAB | box-shadow | 0.3s | ease |

---

## User Interaction Flow

```
1. User opens chatbot
   ↓
2. User sees FAB button (⋮) in header
   ↓
3. User clicks FAB button
   ↓
4. Quick actions panel slides down
   ↓
5. User hovers over button → Purple gradient + lift
   ↓
6. User clicks button → Question sent
   ↓
7. Panel closes automatically
   ↓
8. Chatbot responds with answer
```

---

## Quick Actions Reference

| Button | Icon | Label | Question Sent |
|--------|------|-------|---------------|
| 1 | 🎫 | Book Tickets | "How do I book tickets?" |
| 2 | 💳 | Payment | "What payment methods do you accept?" |
| 3 | 🪑 | Seat Selection | "How do I select seats?" |
| 4 | 🎁 | Offers | "Do you have any discounts or offers?" |
| 5 | 🕐 | Timings | "What are your cinema timings?" |
| 6 | 🍿 | Food & Drinks | "Do you have food and beverages?" |

---

## Accessibility Features

### Touch Targets
- **Desktop**: 110px × 90px (well above 44px minimum)
- **Mobile**: 150px × 100px (optimized for touch)

### Keyboard Navigation
```
Tab → Focus on FAB button
Enter → Toggle panel
Tab → Focus on first quick action
Tab → Navigate through buttons
Enter → Send question
```

### Screen Reader
```
FAB Button: "Toggle quick actions"
Quick Action 1: "Book Tickets - How do I book tickets?"
Quick Action 2: "Payment - What payment methods do you accept?"
...
Close Button: "Close quick actions"
```

---

## Visual Hierarchy

```
Priority 1: FAB Toggle Button
  ↓ (User clicks)
Priority 2: Quick Actions Panel Header
  ↓ (User scans)
Priority 3: Quick Action Buttons (Grid)
  ↓ (User selects)
Priority 4: Message List (Response)
```

---

## Responsive Breakpoints

| Device | Width | Columns | Icon Size | Text Size |
|--------|-------|---------|-----------|-----------|
| Desktop | > 768px | 3 | 24px | 11px |
| Tablet | 481-768px | 3 | 24px | 11px |
| Mobile | ≤ 480px | 2 | 28px | 12px |

---

## Testing Scenarios

### ✅ Visual Tests
- [ ] FAB button appears in correct position
- [ ] FAB button has purple gradient
- [ ] Panel slides down smoothly
- [ ] Grid layout is correct (3 or 2 columns)
- [ ] Buttons have white background by default
- [ ] Buttons turn purple on hover
- [ ] Icons are centered and visible
- [ ] Text is readable and centered

### ✅ Interaction Tests
- [ ] FAB button toggles panel
- [ ] FAB button rotates when active
- [ ] Clicking quick action sends question
- [ ] Panel closes after selection
- [ ] Close button (×) works
- [ ] Hover effects work on desktop
- [ ] Touch interactions work on mobile

### ✅ Responsive Tests
- [ ] 3 columns on desktop
- [ ] 2 columns on mobile
- [ ] Larger icons on mobile
- [ ] Larger text on mobile
- [ ] Panel fits within chat window
- [ ] No horizontal scrolling

---

## Common Issues & Solutions

### Issue: Panel doesn't slide down
**Solution**: Check that `showQuickActions` state is toggling correctly

### Issue: Buttons not hovering
**Solution**: Ensure CSS hover styles are not overridden

### Issue: Grid layout broken
**Solution**: Verify `grid-template-columns` in CSS

### Issue: FAB button not rotating
**Solution**: Check `.active` class is being applied

### Issue: Mobile layout wrong
**Solution**: Verify media query breakpoints

---

## Design Inspiration

This FAB implementation follows:
- **Material Design** principles (Google)
- **Floating Action Button** patterns
- **Quick Reply** patterns (messaging apps)
- **Guided Discovery** UX patterns

---

## Before & After

### Before (No FAB)
```
User: *types* "How do I book tickets?"
Time: ~10 seconds
Effort: High (typing)
```

### After (With FAB)
```
User: *clicks* FAB → *clicks* "Book Tickets"
Time: ~2 seconds
Effort: Low (2 clicks)
```

**Result**: 80% faster, 5x easier! 🚀

---

**Visual Guide Version**: 1.0.0
**Last Updated**: May 20, 2026
**Status**: ✅ Complete

