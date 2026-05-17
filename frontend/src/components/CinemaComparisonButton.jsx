import './CinemaComparisonButton.css';

/**
 * CinemaComparisonButton Component
 * Prominent button in the "Choose Cinema & Time" section header
 * 
 * @param {Object} props
 * @param {number} props.selectedCount - Number of selected cinemas
 * @param {Function} props.onClick - Callback when button is clicked
 */
export default function CinemaComparisonButton({ selectedCount, onClick }) {
  const handleClick = () => {
    if (selectedCount === 0) {
      alert('Please select at least 2 cinemas to compare by clicking the "Compare" checkbox on each cinema.');
    } else if (selectedCount === 1) {
      alert('Please select at least one more cinema to compare.');
    } else {
      onClick();
    }
  };

  return (
    <button className="cinema-comparison-button" onClick={handleClick}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2"/>
      </svg>
      <span>Compare Cinemas</span>
      {selectedCount > 0 && (
        <span className="count-badge">{selectedCount}</span>
      )}
    </button>
  );
}
