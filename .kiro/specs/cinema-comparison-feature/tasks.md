# Implementation Plan

- [x] 1. Remove existing recommendation system



  - Remove CinemaRecommendations component files
  - Remove imports and usage from BookingPage
  - Remove backend API endpoint for old recommendations




  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 2. Create core comparison data structures and utilities
  - [ ] 2.1 Create TypeScript interfaces for comparison data models
    - Define CinemaComparisonData interface


    - Define RecommendationResult interface
    - Define WeightedScoreFactors interface
    - Define Offer interface
    - _Requirements: All requirements (data foundation)_

  - [ ] 2.2 Implement weighted scoring algorithm utility
    - Create calculateRecommendationScore function
    - Implement price scoring (40% weight, inverse)
    - Implement rating scoring (25% weight)
    - Implement distance scoring (20% weight, inverse)
    - Implement amenities scoring (15% weight)
    - Add score normalization and clamping
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_



  - [ ]* 2.3 Write property test for weighted scoring algorithm
    - **Property 8: Price weight is 40% with inverse relationship**
    - **Property 9: Rating weight is 25%**
    - **Property 10: Distance weight is 20% with inverse relationship**
    - **Property 11: Amenities weight is 15%**
    - **Validates: Requirements 3.2, 3.3, 3.4, 3.5**

  - [x] 2.4 Implement badge determination logic


    - Create determineBadgeType function
    - Analyze which factor contributed most to score
    - Return appropriate badge type (Best Value, Closest, Top Rated)
    - _Requirements: 3.8_



  - [ ]* 2.5 Write property test for badge determination
    - **Property 14: Badge type matches dominant score factor**




    - **Validates: Requirements 3.8**

  - [ ] 2.6 Implement explanation generator
    - Create generateExplanation function
    - Generate human-readable explanation based on winning factors
    - Include cinema name, key metrics, and reasons
    - _Requirements: 3.9_



  - [ ] 2.7 Create distance parsing utility
    - Parse distance strings (e.g., "2.5 km") to numbers
    - Handle parsing errors gracefully




    - Return default value on failure
    - _Requirements: 2.3, 3.4_

- [x] 3. Implement CompareCheckbox component


  - [ ] 3.1 Create CompareCheckbox component with props interface
    - Implement checkbox input with label
    - Add visual styling for selected/unselected states
    - Handle toggle callback
    - _Requirements: 1.1, 1.2_

  - [ ]* 3.2 Write property test for CompareCheckbox
    - **Property 1: Compare button adds cinema to list**
    - **Validates: Requirements 1.2**






  - [ ] 3.3 Add CompareCheckbox to cinema rows in BookingPage
    - Import CompareCheckbox component
    - Add checkbox to each cinema card
    - Wire up state management for selections


    - _Requirements: 1.1, 1.2_

- [ ] 4. Implement comparison state management in BookingPage
  - [ ] 4.1 Add state for selected cinemas and modal visibility
    - Add selectedCinemasForComparison state
    - Add showComparisonModal state
    - Add comparisonResults state


    - _Requirements: 1.2, 1.5_

  - [x] 4.2 Implement cinema selection handlers






    - Create handleCompareToggle function
    - Create handleRemoveFromComparison function
    - Create handleClearComparison function


    - _Requirements: 1.2, 4.1, 4.2, 4.5_





  - [ ]* 4.3 Write property test for state management
    - **Property 16: Each selected cinema has remove mechanism**
    - **Property 17: Removing cinema updates floating bar**
    - **Property 18: Clear all resets state and closes modal**
    - **Validates: Requirements 4.1, 4.2, 4.5**

- [ ] 5. Implement FloatingCompareBar component
  - [ ] 5.1 Create FloatingCompareBar component with props interface
    - Implement bar layout with cinema chips
    - Add remove buttons for each cinema




    - Add "Compare Now" CTA button
    - Add "Clear All" button
    - Implement show/hide animation
    - _Requirements: 1.3, 1.4, 4.1, 4.2, 4.3_

  - [ ] 5.2 Add responsive styling for mobile
    - Adapt layout for smaller screens
    - Ensure touch-friendly button sizes
    - _Requirements: 5.4_





  - [ ]* 5.3 Write property test for FloatingCompareBar
    - **Property 2: Floating bar shows selected cinema names**
    - **Validates: Requirements 1.4**

  - [ ] 5.4 Integrate FloatingCompareBar into BookingPage
    - Import and render FloatingCompareBar

    - Wire up event handlers
    - Conditionally show when 2+ cinemas selected
    - _Requirements: 1.3, 1.4_





- [ ] 6. Implement CinemaComparisonButton component
  - [ ] 6.1 Create CinemaComparisonButton component
    - Implement button with count badge
    - Handle click to open modal or show instructions

    - Add styling to match design
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 6.2 Add CinemaComparisonButton to section header
    - Place button in "Choose Cinema & Time" section
    - Wire up click handler
    - _Requirements: 6.1_

- [ ] 7. Implement BestPickCard component
  - [ ] 7.1 Create BestPickCard component with props interface
    - Display cinema name prominently
    - Render badge with appropriate styling

    - Show explanation text
    - List key reasons
    - Add visual highlighting
    - _Requirements: 3.6, 3.7, 3.9_


  - [ ]* 7.2 Write property test for BestPickCard
    - **Property 12: Best pick card displays highest scoring cinema**

    - **Property 13: Best pick has distinct badge**

    - **Property 15: Best pick includes explanation**

    - **Validates: Requirements 3.6, 3.7, 3.9**

- [ ] 8. Implement ComparisonTable component
  - [ ] 8.1 Create ComparisonTable component with props interface
    - Implement table structure with cinema columns

    - Display all comparison attributes (name, location, distance, price, formats, amenities, rating, availability, offers)
    - Highlight best pick column
    - Add responsive table styling
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9_


  - [ ]* 8.2 Write property test for ComparisonTable
    - **Property 4: Comparison table has correct column count**
    - **Property 5: All cinema data fields are displayed**
    - **Property 6: Discounted price display is conditional**
    - **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9**


- [ ] 9. Implement MobileComparisonCards component
  - [ ] 9.1 Create MobileComparisonCards component with props interface
    - Implement vertically stacked card layout
    - Display all comparison attributes per card
    - Add swipe gesture support using react-swipeable
    - Add position indicators
    - Highlight best pick card


    - _Requirements: 5.1, 5.2_


  - [ ] 9.2 Add responsive styling and animations
    - Implement smooth card transitions
    - Add swipe indicators
    - _Requirements: 5.2_

- [ ] 10. Implement ComparisonModal component
  - [ ] 10.1 Create ComparisonModal component with props interface
    - Implement modal overlay and backdrop

    - Add close button
    - Render BestPickCard at top
    - Conditionally render ComparisonTable or MobileComparisonCards based on viewport
    - _Requirements: 1.5, 2.1, 3.6, 5.1, 6.4_


  - [ ] 10.2 Implement recommendation calculation on modal open
    - Calculate scores for all cinemas
    - Determine best pick
    - Generate explanation and reasons
    - Store results in state
    - _Requirements: 3.1, 3.6, 3.8, 3.9_

  - [ ]* 10.3 Write property test for ComparisonModal
    - **Property 3: Compare Now opens modal with selected cinemas**
    - **Property 7: Recommendation scores are calculated for all cinemas**
    - **Property 19: Modal close preserves selections**
    - **Validates: Requirements 1.5, 3.1, 6.5**

  - [ ] 10.4 Add error handling and loading states
    - Handle calculation errors gracefully
    - Show loading spinner during calculations
    - Display error messages when data is invalid
    - _Requirements: Error Handling section_

  - [ ] 10.5 Integrate ComparisonModal into BookingPage
    - Import and render ComparisonModal
    - Wire up open/close handlers
    - Pass selected cinemas and user location
    - _Requirements: 1.5, 6.3, 6.4, 6.5_

- [ ] 11. Add accessibility features
  - [ ] 11.1 Add ARIA labels and roles
    - Add aria-label to all interactive elements
    - Add role attributes to modal and table
    - Add aria-live regions for dynamic updates
    - _Requirements: Accessibility section_

  - [ ] 11.2 Implement keyboard navigation
    - Add Tab navigation support
    - Add Escape key to close modal
    - Add Enter/Space for checkbox toggle
    - _Requirements: Accessibility section_

  - [ ] 11.3 Add focus management
    - Focus modal on open
    - Trap focus within modal
    - Restore focus on close
    - Add visible focus indicators
    - _Requirements: Accessibility section_

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ]* 13. Write integration tests
  - Test end-to-end comparison flow
  - Test interaction with existing booking features
  - Test responsive behavior across viewports
  - _Requirements: Testing Strategy section_

- [ ] 14. Add CSS styling and animations
  - [ ] 14.1 Create styles for new components
    - Style CompareCheckbox
    - Style FloatingCompareBar with animations
    - Style CinemaComparisonButton
    - Style BestPickCard with highlighting
    - Style ComparisonTable
    - Style MobileComparisonCards with transitions
    - Style ComparisonModal overlay
    - _Requirements: All UI requirements_

  - [ ] 14.2 Ensure responsive design
    - Add media queries for mobile, tablet, desktop
    - Test on various screen sizes
    - Verify touch target sizes on mobile
    - _Requirements: 5.1, 5.2, 5.4_

  - [ ] 14.3 Add smooth animations and transitions
    - Animate floating bar appearance
    - Animate modal open/close
    - Animate card swipes on mobile
    - Add hover effects
    - _Requirements: 5.2_

- [ ] 15. Final testing and verification
  - [ ] 15.1 Verify old system is completely removed
    - Confirm no CinemaRecommendations imports
    - Confirm no old API calls
    - Confirm no visual artifacts
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

  - [ ]* 15.2 Write property test for existing functionality preservation
    - **Property 20: Existing cinema selection functionality is maintained**
    - **Validates: Requirements 7.5**

  - [ ] 15.3 Test all user flows
    - Test selecting and comparing cinemas
    - Test removing cinemas from comparison
    - Test clearing comparison
    - Test modal interactions
    - Test on mobile and desktop
    - _Requirements: All requirements_

- [ ] 16. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
