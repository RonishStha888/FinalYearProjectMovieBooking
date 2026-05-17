import './BestPickCard.css';
import { getBadgeColorClass } from '../utils/badgeLogic';

/**
 * BestPickCard Component
 * Displays the recommended cinema with badge and explanation
 * 
 * @param {Object} props
 * @param {Object} props.cinema - Cinema comparison data
 * @param {number} props.score - Recommendation score
 * @param {string} props.badge - Badge type (Best Value, Closest, Top Rated)
 * @param {string} props.explanation - Human-readable explanation
 * @param {string[]} props.reasons - List of reasons for recommendation
 */
export default function BestPickCard({ cinema, score, badge, explanation, reasons }) {
  if (!cinema) {
    return null;
  }

  const badgeColorClass = getBadgeColorClass(badge);

  return (
    <div className="best-pick-card">
      <div className="best-pick-header">
        <div className="best-pick-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#FFD700"/>
          </svg>
        </div>
        <div className="best-pick-title-section">
          <span className={`best-pick-badge ${badgeColorClass}`}>
            {badge}
          </span>
          <h3 className="best-pick-title">{cinema.cinema.name}</h3>
        </div>
        <div className="best-pick-score">
          <div className="score-circle">
            <svg width="80" height="80" viewBox="0 0 80 80">
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="6"
              />
              <circle
                cx="40"
                cy="40"
                r="35"
                fill="none"
                stroke="#4CAF50"
                strokeWidth="6"
                strokeDasharray={`${(score / 100) * 220} 220`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
              />
            </svg>
            <div className="score-text">
              <span className="score-number">{score}</span>
              <span className="score-label">/100</span>
            </div>
          </div>
        </div>
      </div>

      <p className="best-pick-explanation">{explanation}</p>

      {reasons && reasons.length > 0 && (
        <div className="best-pick-reasons">
          <h4 className="reasons-title">Why this cinema?</h4>
          <ul className="reasons-list">
            {reasons.map((reason, index) => (
              <li key={index} className="reason-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17L4 12" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
