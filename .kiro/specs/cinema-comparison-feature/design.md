# Cinema Comparison Feature - Design Document

## Overview

The Cinema Comparison Feature is a comprehensive replacement for the existing recommendation/budget-friendly banner system. It provides users with an interactive, side-by-side comparison tool that enables informed decision-making when selecting cinemas. The feature consists of three main components: a comparison selection interface, a comparison modal with detailed side-by-side data, and a smart recommendation engine that calculates optimal cinema choices using weighted scoring.

The system is designed to integrate seamlessly into the existing BookingPage component while completely removing the old CinemaRecommendations component. It follows modern e-commerce comparison patterns with a floating compare bar, checkbox-based selection, and mobile-responsive design.

## Architecture

### Component Structure

```
BookingPage (Modified)
├── CinemaComparisonButton (New)
├── CinemaRow (Modified)
│   └── CompareCheckbox (New)
├── FloatingCompareBar (New)
└── ComparisonModal (New)
    ├── BestPickCard (New)
    ├── ComparisonTable (New)
    └── MobileComparisonCards (New)
```

### Data Flow

1. User selects cinemas via checkboxes → State updates in BookingPage
2. FloatingCompareBar appears when 2+ cinemas selected
3. User clicks "Compare Now" → ComparisonModal opens
4. Modal fetches/calculates recommendation scores
5. BestPickCard displays optimal choice
6. ComparisonTable/MobileComparisonCards show detailed comparison

### State Management

The feature will use React state management within the BookingPage component:

```javascript
const [selectedCinemasForComparison, setSelectedCinemasForComparison] = useState([]);
const [showComparisonModal, setShowComparisonModal] = useState(false);
const [comparisonResults, setComparisonResults] = useState(null);
```

## Components and Interfaces

### 1. CinemaComparisonButton

**Purpose**: Prominent button in the "Choose Cinema & Time" section header

**Props**:
```typescript
interface CinemaComparisonButtonProps {
  selectedCount: number;
  onClick: () => void;
}
```

**Behavior**:
- Displays "Compare Cinemas" text
- Shows count badge when cinemas are selected
- Opens modal or shows instruction message based on selection state

### 2. CompareCheckbox

**Purpose**: Checkbox control on each cinema row for selection

**Props**:
```typescript
interface CompareCheckboxProps {
  cinemaId: string;
  isSelected: boolean;
  onToggle: (cinemaId: string) => void;
}
```

**Behavior**:
- Renders checkbox with "Compare" label
- Provides visual feedback when selected
- Triggers state update on toggle

### 3. FloatingCompareBar

**Purpose**: Persistent bottom bar showing selected cinemas

**Props**:
```typescript
interface FloatingCompareBarProps {
  selectedCinemas: Cinema[];
  onCompare: () => void;
  onClear: () => void;
  onRemove: (cinemaId: string) => void;
}
```

**Behavior**:
- Appears when 2+ cinemas selected
- Shows cinema names as chips with remove buttons
- Displays "Compare Now" CTA button
- Provides "Clear All" option
- Animates in/out smoothly

### 4. ComparisonModal

**Purpose**: Full-screen modal displaying comparison results

**Props**:
```typescript
interface ComparisonModalProps {
  cinemas: Cinema[];
  isOpen: boolean;
  onClose: () => void;
  userLocation?: { lat: number; lng: number };
}
```

**Behavior**:
- Renders as overlay with backdrop
- Calculates recommendation scores on mount
- Displays BestPickCard at top
- Shows ComparisonTable or MobileComparisonCards based on viewport
- Provides close button

### 5. BestPickCard

**Purpose**: Highlighted recommendation card showing optimal cinema

**Props**:
```typescript
interface BestPickCardProps {
  cinema: Cinema;
  score: number;
  badge: 'Best Value' | 'Closest' | 'Top Rated';
  explanation: string;
  reasons: string[];
}
```

**Behavior**:
- Displays cinema name prominently
- Shows badge with appropriate styling
- Renders human-readable explanation
- Lists key reasons for recommendation

### 6. ComparisonTable

**Purpose**: Desktop side-by-side comparison table

**Props**:
```typescript
interface ComparisonTableProps {
  cinemas: CinemaComparisonData[];
  bestPickId: string;
}
```

**Behavior**:
- Renders table with cinema columns
- Highlights best pick column
- Shows all comparison attributes
- Provides sortable columns (optional enhancement)

### 7. MobileComparisonCards

**Purpose**: Mobile-optimized swipeable cards

**Props**:
```typescript
interface MobileComparisonCardsProps {
  cinemas: CinemaComparisonData[];
  bestPickId: string;
}
```

**Behavior**:
- Renders vertically stacked cards
- Enables horizontal swiping
- Shows position indicators
- Highlights best pick card

## Data Models

### Cinema (Existing Model - Extended)

```typescript
interface Cinema {
  _id: string;
  name: string;
  location: string;
  distance: string; // e.g., "2.5 km"
  rating: number;
  amenities: string[]; // ['Parking', 'Food Court', 'AC', 'Mall', 'Premium Sound']
  // ... existing fields
}
```

### CinemaComparisonData

```typescript
interface CinemaComparisonData {
  cinema: Cinema;
  formats: string[]; // ['2D', '3D', 'IMAX', 'Dolby Atmos']
  ticketPrice: {
    original: number;
    discounted?: number;
  };
  seatAvailability: {
    available: number;
    total: number;
  };
  activeOffers: Offer[];
  distanceKm: number; // Parsed numeric distance for scoring
  amenitiesCount: number;
  recommendationScore: number;
}
```

### Offer

```typescript
interface Offer {
  id: string;
  description: string; // e.g., "Free popcorn with ticket"
  type: 'discount' | 'freebie' | 'upgrade';
}
```

### RecommendationResult

```typescript
interface RecommendationResult {
  bestPick: {
    cinemaId: string;
    score: number;
    badge: 'Best Value' | 'Closest' | 'Top Rated';
    explanation: string;
    reasons: string[];
  };
  rankings: CinemaComparisonData[];
}
```

### WeightedScoreFactors

```typescript
interface WeightedScoreFactors {
  priceWeight: 0.40;
  ratingWeight: 0.25;
  distanceWeight: 0.20;
  amenitiesWeight: 0.15;
}
```

## 
Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Property 1: Compare button adds cinema to list
*For any* cinema, when the compare button is clicked, that cinema should be added to the comparison list and visual feedback should be provided
**Validates: Requirements 1.2**

Property 2: Floating bar shows selected cinema names
*For any* set of selected cinemas (2 or more), the floating compare bar should display all cinema names and a "Compare Now" button
**Validates: Requirements 1.4**

Property 3: Compare Now opens modal with selected cinemas
*For any* set of selected cinemas, clicking "Compare Now" should open the comparison modal containing exactly those cinemas
**Validates: Requirements 1.5**

Property 4: Comparison table has correct column count
*For any* set of selected cinemas, the comparison table should have one column per cinema plus one column for attribute labels
**Validates: Requirements 2.1**

Property 5: All cinema data fields are displayed
*For any* cinema in the comparison, the system should display name, location, distance, ticket price, formats, amenities, rating, seat availability, and active offers
**Validates: Requirements 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9**

Property 6: Discounted price display is conditional
*For any* cinema with a discounted price, both original and discounted prices should be shown; for cinemas without discounts, only the original price should be shown
**Validates: Requirements 2.4**

Property 7: Recommendation scores are calculated for all cinemas
*For any* set of cinemas in comparison, each cinema should receive a calculated recommendation score
**Validates: Requirements 3.1**

Property 8: Price weight is 40% with inverse relationship
*For any* two cinemas where cinema A has a lower price than cinema B, cinema A should receive a higher price component score, and the price component should contribute 40% to the total score
**Validates: Requirements 3.2**

Property 9: Rating weight is 25%
*For any* two cinemas where cinema A has a higher rating than cinema B, cinema A should receive a higher rating component score, and the rating component should contribute 25% to the total score
**Validates: Requirements 3.3**

Property 10: Distance weight is 20% with inverse relationship
*For any* two cinemas where cinema A is closer than cinema B, cinema A should receive a higher distance component score, and the distance component should contribute 20% to the total score
**Validates: Requirements 3.4**

Property 11: Amenities weight is 15%
*For any* two cinemas where cinema A has more amenities than cinema B, cinema A should receive a higher amenities component score, and the amenities component should contribute 15% to the total score
**Validates: Requirements 3.5**

Property 12: Best pick card displays highest scoring cinema
*For any* set of compared cinemas, the "Best Pick" card should display the cinema with the highest recommendation score
**Validates: Requirements 3.6**

Property 13: Best pick has distinct badge
*For any* winning cinema, the "Best Pick" card should display a badge (Best Value, Closest, or Top Rated)
**Validates: Requirements 3.7**

Property 14: Badge type matches dominant score factor
*For any* winning cinema, if price contributed most to the score, the badge should be "Best Value"; if distance contributed most, the badge should be "Closest"; if rating contributed most, the badge should be "Top Rated"
**Validates: Requirements 3.8**

Property 15: Best pick includes explanation
*For any* winning cinema, the "Best Pick" card should include a human-readable explanation string
**Validates: Requirements 3.9**

Property 16: Each selected cinema has remove mechanism
*For any* cinema in the comparison list, there should be a mechanism to remove it individually
**Validates: Requirements 4.1**

Property 17: Removing cinema updates floating bar
*For any* cinema removed from the comparison list, the floating compare bar should update to reflect the removal
**Validates: Requirements 4.2**

Property 18: Clear all resets state and closes modal
*For any* comparison state, clicking "Clear All" should remove all cinemas from the comparison list and close the modal
**Validates: Requirements 4.5**

Property 19: Modal close preserves selections
*For any* set of selected cinemas, closing the modal without clicking "Clear All" should preserve the comparison list selections
**Validates: Requirements 6.5**

Property 20: Existing cinema selection functionality is maintained
*For any* existing cinema selection operation (date selection, time selection, cinema selection), the functionality should continue to work correctly after the comparison feature is implemented
**Validates: Requirements 7.5**

## Error Handling

### User Input Errors

1. **No Cinemas Selected**: When user clicks "Compare Cinemas" button with no selections
   - Display friendly message: "Please select at least 2 cinemas to compare"
   - Provide visual cue to select cinemas

2. **Single Cinema Selected**: When user tries to compare with only 1 cinema
   - Display message: "Select at least one more cinema to compare"
   - Keep floating bar hidden

3. **Invalid Cinema Data**: When cinema data is missing required fields
   - Log error to console
   - Skip cinema in comparison or show "Data unavailable" placeholder
   - Ensure modal doesn't crash

### Calculation Errors

1. **Distance Parsing Failure**: When distance string cannot be parsed to number
   - Default to maximum distance value for scoring
   - Display original distance string in UI
   - Log warning

2. **Score Calculation Overflow**: When score calculations produce invalid numbers
   - Clamp scores to 0-100 range
   - Log error with cinema details
   - Continue with clamped value

3. **Missing Price Data**: When cinema has no price information
   - Use average price of other cinemas for scoring
   - Display "Price unavailable" in UI
   - Log warning

### UI Errors

1. **Modal Rendering Failure**: When comparison modal fails to render
   - Catch error in error boundary
   - Display fallback UI with error message
   - Provide "Try Again" button

2. **Mobile Swipe Initialization Failure**: When swipe library fails to initialize
   - Fall back to vertical scroll layout
   - Log error
   - Ensure cards are still accessible

### Network Errors

1. **User Location Unavailable**: When geolocation fails or is denied
   - Use default location (city center)
   - Calculate relative distances between cinemas
   - Display "Distance from [City]" instead of "Distance from you"

## Testing Strategy

### Unit Testing

The unit testing approach will focus on:

1. **Component Rendering**: Verify each component renders correctly with various props
   - Test CompareCheckbox with selected/unselected states
   - Test FloatingCompareBar with different cinema counts
   - Test BestPickCard with different badge types

2. **State Management**: Verify state updates correctly
   - Test adding/removing cinemas from comparison list
   - Test modal open/close state transitions
   - Test clear all functionality

3. **Score Calculation**: Verify weighted scoring algorithm
   - Test individual weight calculations (price, rating, distance, amenities)
   - Test total score calculation
   - Test badge determination logic

4. **Edge Cases**: Verify handling of edge cases
   - Empty cinema list
   - Single cinema
   - Missing data fields
   - Invalid distance strings

### Property-Based Testing

Property-based testing will be implemented using **fast-check** (for JavaScript/React). Each property-based test will run a minimum of 100 iterations to ensure comprehensive coverage.

The property-based testing approach will verify:

1. **Universal Behaviors**: Properties that should hold for all valid inputs
   - Any cinema added to comparison list appears in floating bar
   - Any set of cinemas produces valid comparison table
   - Score calculations always produce values in valid range

2. **Calculation Invariants**: Mathematical properties of scoring
   - Weights always sum to 100%
   - Lower prices always produce higher price scores
   - Closer distances always produce higher distance scores

3. **UI Consistency**: Properties about UI state
   - Modal always shows same cinemas as selected in list
   - Best pick always has highest score
   - Badge type always matches dominant factor

4. **State Transitions**: Properties about state changes
   - Adding then removing cinema returns to original state
   - Closing then reopening modal preserves selections
   - Clear all always results in empty comparison list

### Integration Testing

Integration tests will verify:

1. **End-to-End Comparison Flow**:
   - Select cinemas → Open modal → View comparison → Close modal
   - Verify data flows correctly through all components

2. **Interaction with Existing Features**:
   - Verify date selection still works
   - Verify time selection still works
   - Verify cinema booking flow still works

3. **Responsive Behavior**:
   - Test desktop layout
   - Test mobile layout
   - Test tablet layout
   - Verify smooth transitions between layouts

### Manual Testing Checklist

1. Visual design matches mockups
2. Animations are smooth
3. Touch interactions work on mobile
4. Accessibility (keyboard navigation, screen readers)
5. Cross-browser compatibility
6. Performance with large cinema lists

## Implementation Notes

### Removal of Old System

The following components and code must be removed:

1. **Component Files**:
   - `frontend/src/components/CinemaRecommendations.jsx`
   - `frontend/src/components/CinemaRecommendations.css`

2. **BookingPage Modifications**:
   - Remove import of CinemaRecommendations
   - Remove `<CinemaRecommendations>` component usage
   - Remove any state related to old recommendation system

3. **Backend API** (if applicable):
   - Remove `/api/recommendations/cinema-recommendations` endpoint
   - Remove recommendation service logic
   - Clean up any database queries specific to old system

### Performance Considerations

1. **Memoization**: Use React.memo for comparison components to prevent unnecessary re-renders
2. **Lazy Loading**: Load comparison modal components only when needed
3. **Debouncing**: Debounce checkbox selections if performance issues arise
4. **Virtual Scrolling**: Consider virtual scrolling for large cinema lists in comparison

### Accessibility

1. **Keyboard Navigation**:
   - All checkboxes accessible via Tab key
   - Modal closeable with Escape key
   - Floating bar focusable and navigable

2. **Screen Readers**:
   - Proper ARIA labels on all interactive elements
   - Announce when cinemas added/removed from comparison
   - Announce when modal opens/closes

3. **Visual Indicators**:
   - High contrast for selected states
   - Focus indicators on all interactive elements
   - Clear visual hierarchy in comparison table

### Mobile Optimization

1. **Touch Targets**: Minimum 44x44px for all touch targets
2. **Swipe Gestures**: Use react-swipeable or similar library
3. **Viewport Adaptation**: Use CSS media queries and responsive units
4. **Performance**: Optimize animations for mobile devices

## Technology Stack

- **React**: Component framework
- **CSS Modules** or **Styled Components**: Styling approach
- **fast-check**: Property-based testing library
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **react-swipeable**: Mobile swipe gestures (optional)

## Migration Strategy

1. **Phase 1**: Implement new comparison components without removing old system
2. **Phase 2**: Add feature flag to toggle between old and new systems
3. **Phase 3**: Test new system thoroughly
4. **Phase 4**: Remove old system and feature flag
5. **Phase 5**: Monitor for issues and iterate

## Future Enhancements

1. **Saved Comparisons**: Allow users to save comparison sets
2. **Share Comparisons**: Generate shareable links for comparisons
3. **Advanced Filters**: Filter cinemas by amenities, price range, etc.
4. **Comparison History**: Track previously compared cinemas
5. **Custom Weights**: Allow users to adjust scoring weights based on preferences
6. **Map View**: Show cinemas on a map with comparison data
