import { useState, useEffect } from "react";
import "./LoyaltyPage.css";

export default function LoyaltyPage({ user, onBack, newPoints = 0 }) {
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showEarnedBanner, setShowEarnedBanner] = useState(newPoints > 0);

  useEffect(() => {
    fetchLoyaltyData();
  }, []);

  const fetchLoyaltyData = async () => {
    setLoading(true);
    try {
      const userId = user?._id || user?.id;
      if (!userId) throw new Error("No user ID");
      const res = await fetch(`http://localhost:5000/api/loyalty/user/${userId}`);
      const data = await res.json();
      if (data.success) setLoyaltyData(data);
      else throw new Error(data.message);
    } catch {
      setLoyaltyData({
        loyaltyPoints: { available: 0, lifetime: 0, tier: "Bronze" },
        tierInfo: { name: "Bronze", icon: "🥉", color: "#CD7F32", nextTier: "Silver", pointsNeeded: 500 },
        redemptionOptions: [],
        recentHistory: [],
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loyalty-page">
        <div className="loyalty-loading">
          <div className="loyalty-spinner"></div>
          <p>Loading your loyalty data...</p>
        </div>
      </div>
    );
  }

  const { loyaltyPoints, tierInfo, recentHistory } = loyaltyData;
  const available = loyaltyPoints?.available || 0;
  const lifetime = loyaltyPoints?.lifetime || 0;
  const tier = loyaltyPoints?.tier || "Bronze";
  const discountValue = available * 5;

  const tierThresholds = { Bronze: 0, Silver: 500, Gold: 1000, Platinum: 2000 };
  const nextTierName = tierInfo?.nextTier;
  const nextTierPts = tierInfo?.pointsNeeded || 500;
  const currentTierMin = tierThresholds[tier] || 0;
  const progressPct = nextTierName
    ? Math.min(100, Math.round(((lifetime - currentTierMin) / (nextTierPts - currentTierMin)) * 100))
    : 100;

  const tierColors = { Bronze: "#CD7F32", Silver: "#C0C0C0", Gold: "#FFD700", Platinum: "#b0c4de" };
  const tierColor = tierColors[tier] || "#CD7F32";

  return (
    <div className="loyalty-page">
      {/* Header */}
      <header className="loyalty-header">
        <button className="loyalty-back-btn" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Back
        </button>
        <div className="loyalty-header-title">
          <h2>Loyalty Rewards</h2>
          <p>Earn points, unlock rewards</p>
        </div>
        <button className="loyalty-refresh-btn" onClick={fetchLoyaltyData} title="Refresh">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </header>

      <div className="loyalty-content">
        {/* Points Earned Banner */}
        {showEarnedBanner && newPoints > 0 && (
          <div className="loyalty-earned-banner">
            <div>
              <strong>+{newPoints} points earned!</strong>
              <span>Your loyalty points have been updated from your recent booking.</span>
            </div>
            <button onClick={() => setShowEarnedBanner(false)}>✕</button>
          </div>
        )}
        {/* Points Balance Card */}
        <div className="loyalty-balance-card" style={{ borderColor: tierColor }}>
          <div className="balance-card-bg" style={{ background: `linear-gradient(135deg, ${tierColor}22, ${tierColor}44)` }}>
            <div className="balance-left">
              <div className="tier-badge" style={{ background: tierColor }}>
                <span>{tier}</span>
              </div>
              <div className="balance-points">
                <span className="points-number">{available.toLocaleString()}</span>
                <span className="points-label">Available Points</span>
              </div>
              <div className="balance-value">
                <span>≈ Rs. {discountValue.toLocaleString()} discount value</span>
              </div>
            </div>
            <div className="balance-right">
              <div className="balance-stat">
                <span className="stat-val">{lifetime.toLocaleString()}</span>
                <span className="stat-lbl">Lifetime Points</span>
              </div>
              <div className="balance-stat">
                <span className="stat-val">Rs. {(lifetime * 5).toLocaleString()}</span>
                <span className="stat-lbl">Total Earned Value</span>
              </div>
            </div>
          </div>

          {/* Tier Progress */}
          {nextTierName && (
            <div className="tier-progress-section">
              <div className="tier-progress-labels">
                <span>{tier}</span>
                <span>{progressPct}% to {nextTierName}</span>
                <span>{nextTierName}</span>
              </div>
              <div className="tier-progress-bar">
                <div className="tier-progress-fill" style={{ width: `${progressPct}%`, background: tierColor }}></div>
              </div>
              <p className="tier-progress-hint">
                Earn {Math.max(0, nextTierPts - lifetime)} more lifetime points to reach {nextTierName}
              </p>
            </div>
          )}
          {!nextTierName && (
            <div className="tier-progress-section">
              <p className="tier-max">You've reached the highest tier — Platinum!</p>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="loyalty-rules-card">
          <h3>How It Works</h3>
          <div className="rules-grid">
            <div className="rule-item">
              <div className="rule-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/></svg>
              </div>
              <div className="rule-text">
                <strong>Earn Points</strong>
                <span>1 point per Rs. 100 spent on tickets</span>
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2"/></svg>
              </div>
              <div className="rule-text">
                <strong>Redeem</strong>
                <span>1 point = Rs. 5 discount</span>
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/></svg>
              </div>
              <div className="rule-text">
                <strong>Minimum</strong>
                <span>Redeem at least 20 points (Rs. 100 off)</span>
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 15l-6-6-6 6" stroke="currentColor" strokeWidth="2"/></svg>
              </div>
              <div className="rule-text">
                <strong>Maximum</strong>
                <span>Up to 100 points per booking (Rs. 500 off)</span>
              </div>
            </div>
            <div className="rule-item">
              <div className="rule-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 12V22H4V12" stroke="currentColor" strokeWidth="2"/><path d="M22 7H2v5h20V7z" stroke="currentColor" strokeWidth="2"/><path d="M12 22V7" stroke="currentColor" strokeWidth="2"/></svg>
              </div>
              <div className="rule-text">
                <strong>Welcome Bonus</strong>
                <span>10 points on account creation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="loyalty-tabs">
          <button className={`ltab ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>Overview</button>
          <button className={`ltab ${activeTab === "history" ? "active" : ""}`} onClick={() => setActiveTab("history")}>Activity</button>
          <button className={`ltab ${activeTab === "tiers" ? "active" : ""}`} onClick={() => setActiveTab("tiers")}>Tiers</button>
        </div>

        {activeTab === "overview" && (
          <div className="loyalty-overview">
            <div className="overview-stats">
              <div className="ov-stat">
                <span className="ov-val">{available}</span>
                <span className="ov-lbl">Points Available</span>
              </div>
              <div className="ov-stat highlight">
                <span className="ov-val">Rs. {discountValue}</span>
                <span className="ov-lbl">Discount Value</span>
              </div>
              <div className="ov-stat">
                <span className="ov-val">{Math.floor(available / 20)}</span>
                <span className="ov-lbl">Redemptions Available</span>
              </div>
            </div>
            <div className="redeem-hint">
              <div className="redeem-hint-icon"></div>
              <p>You can redeem your points during checkout on the payment page. Select how many points to use and get an instant discount!</p>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="loyalty-history">
            {recentHistory && recentHistory.length > 0 ? (
              recentHistory.map((entry, i) => (
                <div key={i} className={`history-item ${entry.type}`}>
                  <div className="history-icon">
                    {entry.type === "earned" ? "+" : entry.type === "redeemed" ? "-" : "B"}
                  </div>
                  <div className="history-info">
                    <span className="history-desc">{entry.description}</span>
                    <span className="history-date">{new Date(entry.date).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <div className={`history-points ${entry.points > 0 ? "positive" : "negative"}`}>
                    {entry.points > 0 ? "+" : ""}{entry.points} pts
                  </div>
                </div>
              ))
            ) : (
              <div className="history-empty">
                <div className="history-empty-icon"></div>
                <p>No activity yet. Book your first movie to start earning points!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "tiers" && (
          <div className="loyalty-tiers">
            {[
              { name: "Bronze", color: "#CD7F32", min: 0, max: 499, benefits: ["Earn 1 pt per Rs.100", "Redeem from 20 pts"] },
              { name: "Silver", color: "#C0C0C0", min: 500, max: 999, benefits: ["All Bronze benefits", "Priority support"] },
              { name: "Gold", color: "#FFD700", min: 1000, max: 1999, benefits: ["All Silver benefits", "Early access to offers"] },
              { name: "Platinum", color: "#b0c4de", min: 2000, max: null, benefits: ["All Gold benefits", "VIP lounge access", "Complimentary upgrades"] },
            ].map((t) => (
              <div key={t.name} className={`tier-card ${tier === t.name ? "current" : ""}`} style={{ borderColor: t.color }}>
                <div className="tier-card-header" style={{ background: `${t.color}22` }}>
                  <div>
                    <h4 style={{ color: t.color }}>{t.name}</h4>
                    <span className="tier-card-range">{t.max ? `${t.min}–${t.max} pts` : `${t.min}+ pts`}</span>
                  </div>
                  {tier === t.name && <span className="tier-current-badge">Current</span>}
                </div>
                <ul className="tier-benefits">
                  {t.benefits.map((b, i) => <li key={i}>✓ {b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
