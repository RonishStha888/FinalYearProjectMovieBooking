import './FloatingCompareBar.css';

/**
 * FloatingCompareBar Component
 * Persistent bottom bar showing selected cinemas for comparison
 * 
 * @param {Object} props
 * @param {Array} props.selectedCinemas - Array of selected cinema objects
 * @param {Function} props.onCompare - Callback when "Compare Now" is clicked
 * @param {Function} props.onClear - Callback when "Clear All" is clicked
 * @param {Function} props.onRemove - Callback when removing individual cinema
 */
export default function FloatingCompareBar({ selectedCinemas, onCompare, onClear, onRemove }) {
  if (!selectedCinemas || selectedCinemas.length < 2) {
    return null; // Only show when 2+ cinemas selected
  }

  return (
    <div className="floating-compare-bar">
      <div className="compare-bar-content">
        <div className="compare-bar-left">
          <div className="compare-bar-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 6.10457 9.89543 7 11 7H13C14.1046 7 15 6.10457 15 5M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Compare Cinemas ({selectedCinemas.length})</span>
          </div>
          <div className="compare-bar-chips">
            {selectedCinemas.map((cinema) => (
              <div key={cinema._id} className="cinema-chip">
                <span className="chip-name">{cinema.name}</span>
                <button
                  className="chip-remove"
                  onClick={() => onRemove(cinema._id)}
                  aria-label={`Remove ${cinema.name} from comparison`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="compare-bar-right">
          <button className="clear-all-btn" onClick={onClear}>
            Clear All
          </button>
          <button className="compare-now-btn" onClick={onCompare}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Compare Now
          </button>
        </div>
      </div>
    </div>
  );
}
