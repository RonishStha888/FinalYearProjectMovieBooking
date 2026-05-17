# Requirements Document

## Introduction

This document specifies the requirements for a Cinema Comparison Feature that replaces the existing recommendation/budget-friendly banner system. The feature enables users to compare multiple cinemas side-by-side based on various criteria including price, distance, amenities, ratings, and availability. The system includes a smart recommendation engine that calculates the best cinema choice using a weighted scoring algorithm.

## Glossary

- **Cinema Comparison System**: The complete feature that allows users to select, compare, and receive recommendations for cinema venues
- **Comparison Modal**: A modal dialog that displays side-by-side comparison of selected cinemas
- **Compare Button**: UI control that allows users to add cinemas to the comparison list
- **Floating Compare Bar**: A persistent bottom bar that appears when 2 or more cinemas are selected, showing selected cinema names and a "Compare Now" CTA
- **Best Pick Card**: A highlighted recommendation card displayed at the top of comparison results showing the optimal cinema choice
- **Weighted Scoring System**: An algorithm that calculates cinema scores based on multiple weighted factors (price 40%, rating 25%, distance 20%, amenities 15%)
- **Cinema Row**: A single cinema listing in the cinema selection interface
- **Comparison Table**: A structured display showing cinema attributes in columns for easy comparison
- **Badge**: A visual indicator (e.g., "Best Value", "Closest", "Top Rated") that highlights why a cinema won the recommendation
- **Amenities**: Cinema facilities and features such as Parking, Food Court, AC, Mall, Premium Sound, IMAX, Dolby Atmos, etc.
- **Format**: Movie screening technology types (2D, 3D, IMAX, Dolby Atmos, etc.)
- **Active Offers**: Current promotions or perks available at a cinema (e.g., free popcorn, discounts)
- **Swipeable Cards**: Mobile UI pattern where comparison data is displayed in horizontally scrollable cards

## Requirements

### Requirement 1

**User Story:** As a user, I want to add cinemas to a comparison list, so that I can evaluate multiple options before making a booking decision.

#### Acceptance Criteria

1. WHEN a user views the cinema selection interface THEN the system SHALL display a "Compare" button on each cinema row
2. WHEN a user clicks a "Compare" button THEN the system SHALL add that cinema to the comparison list and provide visual feedback
3. WHEN a user adds a second or subsequent cinema to the comparison list THEN the system SHALL display a floating compare bar at the bottom of the screen
4. WHEN the floating compare bar is displayed THEN the system SHALL show the names of selected cinemas and a "Compare Now" call-to-action button
5. WHEN a user clicks the "Compare Now" button THEN the system SHALL open the comparison modal with the selected cinemas

### Requirement 2

**User Story:** As a user, I want to view a side-by-side comparison of selected cinemas, so that I can easily evaluate their differences and make an informed choice.

#### Acceptance Criteria

1. WHEN the comparison modal opens THEN the system SHALL display a comparison table with columns for each selected cinema
2. WHEN displaying cinema comparisons THEN the system SHALL show cinema name and location for each selected cinema
3. WHEN displaying cinema comparisons THEN the system SHALL show distance from user for each selected cinema
4. WHEN displaying cinema comparisons THEN the system SHALL show ticket price (both original and discounted if applicable) for each selected cinema
5. WHEN displaying cinema comparisons THEN the system SHALL show available formats (2D, 3D, IMAX, Dolby Atmos) for each selected cinema
6. WHEN displaying cinema comparisons THEN the system SHALL show amenities (Parking, Food Court, AC, Mall, Premium Sound) for each selected cinema
7. WHEN displaying cinema comparisons THEN the system SHALL show star rating for each selected cinema
8. WHEN displaying cinema comparisons THEN the system SHALL show seat availability for each selected cinema
9. WHEN displaying cinema comparisons THEN the system SHALL show active offers or perks for each selected cinema

### Requirement 3

**User Story:** As a user, I want to receive a smart recommendation from the comparison results, so that I can quickly identify the best cinema option based on multiple factors.

#### Acceptance Criteria

1. WHEN the comparison modal displays results THEN the system SHALL calculate a recommendation score for each cinema using the weighted scoring algorithm
2. WHEN calculating recommendation scores THEN the system SHALL apply a 40% weight to price (lower is better)
3. WHEN calculating recommendation scores THEN the system SHALL apply a 25% weight to rating
4. WHEN calculating recommendation scores THEN the system SHALL apply a 20% weight to distance (closer is better)
5. WHEN calculating recommendation scores THEN the system SHALL apply a 15% weight to amenities count
6. WHEN the recommendation score is calculated THEN the system SHALL display a "Best Pick" recommendation card at the top of the comparison results
7. WHEN displaying the "Best Pick" card THEN the system SHALL highlight the winning cinema with a distinct badge
8. WHEN determining the badge type THEN the system SHALL select from "Best Value", "Closest", or "Top Rated" based on which factor contributed most to the winning score
9. WHEN displaying the "Best Pick" card THEN the system SHALL show a human-readable explanation of why the cinema was recommended

### Requirement 4

**User Story:** As a user, I want to manage my comparison selections, so that I can add, remove, or reset my cinema choices.

#### Acceptance Criteria

1. WHEN a user has selected cinemas for comparison THEN the system SHALL provide a mechanism to remove individual cinemas from the comparison list
2. WHEN a user removes a cinema from the comparison list THEN the system SHALL update the floating compare bar to reflect the change
3. WHEN fewer than 2 cinemas remain in the comparison list THEN the system SHALL hide the floating compare bar
4. WHEN a user is viewing the comparison modal THEN the system SHALL provide a "Clear All" or "Start Over" option
5. WHEN a user clicks "Clear All" THEN the system SHALL remove all cinemas from the comparison list and close the comparison modal

### Requirement 5

**User Story:** As a mobile user, I want to view cinema comparisons in a mobile-optimized format, so that I can easily compare cinemas on smaller screens.

#### Acceptance Criteria

1. WHEN a user views the comparison modal on a mobile device THEN the system SHALL display comparison data in vertically stacked cards instead of a table
2. WHEN comparison cards are displayed on mobile THEN the system SHALL enable horizontal swiping between cinema cards
3. WHEN a user swipes between cinema cards THEN the system SHALL provide smooth transitions and visual indicators of the current card position
4. WHEN the floating compare bar is displayed on mobile THEN the system SHALL adapt its layout to fit smaller screen widths
5. WHEN the "Best Pick" card is displayed on mobile THEN the system SHALL maintain readability and proper spacing for touch interactions

### Requirement 6

**User Story:** As a user, I want to access the comparison feature from a prominent location, so that I can easily discover and use this functionality.

#### Acceptance Criteria

1. WHEN a user views the "Choose Cinema & Time" section THEN the system SHALL display a prominent "Compare Cinemas" button
2. WHEN a user clicks the "Compare Cinemas" button with no cinemas selected THEN the system SHALL display instructions or a prompt to select cinemas for comparison
3. WHEN a user clicks the "Compare Cinemas" button with cinemas already selected THEN the system SHALL open the comparison modal immediately
4. WHEN the comparison modal is open THEN the system SHALL provide a clear close button or mechanism to return to the cinema selection view
5. WHEN a user closes the comparison modal THEN the system SHALL preserve the comparison list selections unless explicitly cleared

### Requirement 7

**User Story:** As a developer, I want the comparison feature to replace the existing recommendation system cleanly, so that there are no conflicts or duplicate functionality.

#### Acceptance Criteria

1. WHEN the cinema comparison feature is implemented THEN the system SHALL remove the existing CinemaRecommendations component from the BookingPage
2. WHEN the cinema comparison feature is implemented THEN the system SHALL remove the budget-friendly banner display logic
3. WHEN the cinema comparison feature is implemented THEN the system SHALL remove any backend API calls specific to the old recommendation system
4. WHEN the cinema comparison feature is implemented THEN the system SHALL ensure no visual artifacts or references to the old system remain in the UI
5. WHEN the cinema comparison feature is active THEN the system SHALL maintain all existing cinema selection functionality (date selection, time selection, cinema selection)
