import './CompareCheckbox.css';

/**
 * CompareCheckbox Component
 * Checkbox control for selecting cinemas to compare
 * 
 * @param {Object} props
 * @param {string} props.cinemaId - Cinema ID
 * @param {boolean} props.isSelected - Whether cinema is selected
 * @param {Function} props.onToggle - Callback when checkbox is toggled
 */
export default function CompareCheckbox({ cinemaId, isSelected, onToggle }) {
  const handleChange = () => {
    onToggle(cinemaId);
  };

  return (
    <div className="compare-checkbox-container">
      <label className={`compare-checkbox-label ${isSelected ? 'selected' : ''}`}>
        <input
          type="checkbox"
          className="compare-checkbox-input"
          checked={isSelected}
          onChange={handleChange}
          aria-label="Select cinema for comparison"
        />
        <span className="compare-checkbox-custom"></span>
        <span className="compare-checkbox-text">Compare</span>
      </label>
    </div>
  );
}
