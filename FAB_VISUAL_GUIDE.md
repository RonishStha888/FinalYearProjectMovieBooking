# RTX Cinema - FAB Visual Guide 🎨

## Visual Layout

```
┌─────────────────────────────────────────────────────────────┐
│                     RTX Cinema Website                       │
│                                                              │
│  [Header with Navigation]                                   │
│                                                              │
│  [Hero Section]                                             │
│                                                              │
│  [Movies Grid]                                              │
│                                                              │
│  [Content]                                                  │
│                                                              │
│                                                              │
│                                              ┌──────┐        │
│                                              │  ↑   │ ← Scroll to Top (Blue)
│                                              └──────┘        │
│                                                              │
│                                              ┌──────┐        │
│                                              │ 🎫  │ ← Quick Book (Green)
│                                              └──────┘        │
│                                                              │
│                                              ┌──────┐        │
│                                              │  ?   │ ← Help (Orange)
│                                              └──────┘        │
│                                                              │
│                                              ┌──────┐        │
│                                              │ 💬  │ ← Feedback (Purple)
│                                              └──────┘        │
│                                                              │
│                                              ┌──────┐        │
│                                              │  +   │ ← Main FAB (Red)
│                                              └──────┘        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## FAB States

### 1. Collapsed State (Default)
```
                    ┌──────┐
                    │  +   │  Main FAB only visible
                    └──────┘
```

### 2. Expanded State (Menu Open)
```
                    ┌──────┐
                    │  ↑   │  Scroll to Top
                    └──────┘
                        ↑
                    ┌──────┐
                    │ 🎫  │  Quick Book
                    └──────┘
                        ↑
                    ┌──────┐
                    │  ?   │  Help
                    └──────┘
                        ↑
                    ┌──────┐
                    │ 💬  │  Feedback
                    └──────┘
                        ↑
                    ┌──────┐
                    │  ×   │  Main FAB (Close)
                    └──────┘
```

### 3. With Labels (On Hover)
```
                    ┌─────────────────┐
                    │ 🎫  Quick Book  │
                    └─────────────────┘
                            ↑
                    ┌─────────────────┐
                    │  ?   Help       │
                    └─────────────────┘
                            ↑
                    ┌─────────────────┐
                    │ 💬  Feedback    │
                    └─────────────────┘
```

## Color Scheme

### Main FAB
- **Background**: Linear gradient #D84040 → #B83030 (RTX Red)
- **Icon**: White
- **Shadow**: Soft red glow on hover

### Scroll to Top FAB
- **Background**: Linear gradient #2196F3 → #1976D2 (Blue)
- **Icon**: White up arrow
- **Shadow**: Blue glow on hover

### Quick Book FAB
- **Background**: Linear gradient #4CAF50 → #388E3C (Green)
- **Icon**: White ticket
- **Shadow**: Green glow on hover

### Help FAB
- **Background**: Linear gradient #FF9800 → #F57C00 (Orange)
- **Icon**: White question mark
- **Shadow**: Orange glow on hover

### Feedback FAB
- **Background**: Linear gradient #9C27B0 → #7B1FA2 (Purple)
- **Icon**: White message bubble
- **Shadow**: Purple glow on hover

## Modal Layouts

### Quick Book Modal
```
┌─────────────────────────────────────────────────────┐
│  ×                                                   │
│                                                      │
│              🎫                                      │
│         Quick Book Tickets                          │
│    Select a movie to start booking                  │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🔍 Search movies...                         │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  [Now Showing] [Top Rated] [Coming Soon]           │
│                                                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                      │
│  │🎬 │ │🎬 │ │🎬 │ │🎬 │                      │
│  │    │ │    │ │    │ │    │                      │
│  └────┘ └────┘ └────┘ └────┘                      │
│  Movie1  Movie2  Movie3  Movie4                     │
│                                                      │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐                      │
│  │🎬 │ │🎬 │ │🎬 │ │🎬 │                      │
│  │    │ │    │ │    │ │    │                      │
│  └────┘ └────┘ └────┘ └────┘                      │
│  Movie5  Movie6  Movie7  Movie8                     │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Feedback Modal
```
┌─────────────────────────────────────────────────────┐
│  ×                                                   │
│                                                      │
│              💬                                      │
│       We Value Your Feedback                        │
│   Help us improve your RTX Cinema experience        │
│                                                      │
│  How would you rate your experience? *              │
│  ⭐ ⭐ ⭐ ⭐ ⭐                                      │
│  Poor              Excellent                         │
│                                                      │
│  Feedback Category *                                │
│  [🎫 Booking] [💻 Website] [🎬 Cinema]            │
│  [👥 Service] [💡 Suggestion] [📝 Other]          │
│                                                      │
│  Your Feedback *                                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ Tell us about your experience...            │   │
│  │                                              │   │
│  │                                              │   │
│  └─────────────────────────────────────────────┘   │
│                                          0/500       │
│                                                      │
│  Email (Optional)                                   │
│  ┌─────────────────────────────────────────────┐   │
│  │ your.email@example.com                      │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │         📤 Submit Feedback                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### Success State
```
┌─────────────────────────────────────────────────────┐
│                                                      │
│                                                      │
│                      ✓                              │
│                                                      │
│                 Thank You!                          │
│                                                      │
│     Your feedback has been submitted successfully.  │
│                                                      │
│   We appreciate you taking the time to help us      │
│                  improve.                           │
│                                                      │
│                                                      │
└─────────────────────────────────────────────────────┘
```

## Animation Sequences

### FAB Expansion
```
Step 1: Click Main FAB
   +  →  ×  (Icon rotates 90°)

Step 2: Secondary FABs appear
   (Staggered animation, bottom to top)
   
   💬 (appears first, 0.05s delay)
   ↓
   ?  (appears second, 0.1s delay)
   ↓
   🎫 (appears third, 0.15s delay)
   ↓
   ×  (Main FAB)
```

### Scroll Behavior
```
Scroll Down (>100px):
   FABs → Slide down & fade out
   
Scroll Up:
   FABs → Slide up & fade in
   
Scroll >300px:
   Scroll to Top FAB → Appears
```

### Hover Effects
```
Default State:
   ┌──────┐
   │  +   │  Scale: 1.0
   └──────┘  Shadow: Normal

Hover State:
   ┌──────┐
   │  +   │  Scale: 1.05
   └──────┘  Shadow: Larger + Glow
```

## Responsive Breakpoints

### Desktop (>768px)
- FAB Size: 56px × 56px
- Secondary FABs: 48px × 48px
- Position: 32px from bottom-right
- Labels: Visible on hover

### Tablet (481px - 768px)
- FAB Size: 52px × 52px
- Secondary FABs: 44px × 44px
- Position: 24px from bottom-right
- Labels: Visible on hover

### Mobile (≤480px)
- FAB Size: 48px × 48px
- Secondary FABs: 40px × 40px
- Position: 20px from bottom-right
- Labels: Hidden (icon only)
- Modals: Full-screen bottom sheet

## Interaction Flow

### Quick Book Flow
```
User clicks Quick Book FAB
    ↓
Modal opens with movie grid
    ↓
User searches/filters movies
    ↓
User clicks on a movie
    ↓
Modal closes
    ↓
Booking page opens
```

### Feedback Flow
```
User clicks Feedback FAB
    ↓
Modal opens with form
    ↓
User rates experience (1-5 stars)
    ↓
User selects category
    ↓
User writes feedback
    ↓
User optionally adds email
    ↓
User clicks Submit
    ↓
Loading spinner shows
    ↓
Success message displays
    ↓
Modal auto-closes after 2s
```

### Help Flow
```
User clicks Help FAB
    ↓
Page navigates to Help & Support
    ↓
User can browse FAQs and contact options
```

### Scroll to Top Flow
```
User scrolls down >300px
    ↓
Scroll to Top FAB appears
    ↓
User clicks FAB
    ↓
Page smoothly scrolls to top
    ↓
FAB disappears when at top
```

## Accessibility Features

### Keyboard Navigation
```
Tab → Focus Main FAB
Enter/Space → Open menu
Tab → Focus first secondary FAB
Tab → Focus next FAB
Enter/Space → Activate FAB
Esc → Close menu
```

### Screen Reader Announcements
```
Main FAB: "Quick actions menu button, collapsed"
Expanded: "Quick actions menu button, expanded"
Quick Book: "Quick book tickets button"
Help: "Get help button"
Feedback: "Send feedback button"
Scroll Top: "Scroll to top button"
```

## Z-Index Hierarchy
```
Highest (10000): Modals & Overlays
    ↓
High (999): FAB Container
    ↓
Medium (100): Header
    ↓
Low (1): Content
```

## Performance Metrics

### Animation Performance
- **Target**: 60 FPS
- **Method**: CSS transforms (GPU accelerated)
- **Transitions**: 0.3s cubic-bezier

### Load Impact
- **JavaScript**: ~15KB (minified)
- **CSS**: ~8KB (minified)
- **Total**: ~23KB additional

### Interaction Timing
- **FAB Expansion**: 300ms
- **Modal Open**: 300ms
- **Scroll Animation**: 500ms
- **Hover Response**: Instant

---

**This visual guide helps you understand and present the FAB system in your final year project!** 🎓
