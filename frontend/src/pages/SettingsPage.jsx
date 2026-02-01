import { useState } from "react";
import "./SettingsPage.css";

export default function SettingsPage({ user, onBack }) {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: true,
      push: false,
      promotional: false
    },
    preferences: {
      language: 'english',
      currency: 'npr',
      theme: 'dark',
      autoPlay: true
    },
    privacy: {
      profileVisibility: 'public',
      showBookingHistory: false,
      allowRecommendations: true
    },
    account: {
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: '30'
    }
  });

  const [activeTab, setActiveTab] = useState('notifications');
  const [saving, setSaving] = useState(false);

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // In a real app, you'd save to your API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'privacy', label: 'Privacy', icon: '🔒' },
    { id: 'account', label: 'Account Security', icon: '🛡️' }
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Back to Home
        </button>
        <h1>Settings</h1>
      </div>

      <div className="settings-container">
        <div className="settings-sidebar">
          <div className="settings-tabs">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="settings-main">
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              <p className="section-description">
                Choose how you want to receive notifications about bookings, new movies, and promotions.
              </p>

              <div className="settings-group">
                <h3>Communication Channels</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Email Notifications</label>
                    <span>Receive booking confirmations and updates via email</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.notifications.email}
                      onChange={(e) => handleSettingChange('notifications', 'email', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>SMS Notifications</label>
                    <span>Get text messages for booking reminders and updates</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.notifications.sms}
                      onChange={(e) => handleSettingChange('notifications', 'sms', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Push Notifications</label>
                    <span>Receive browser notifications for real-time updates</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.notifications.push}
                      onChange={(e) => handleSettingChange('notifications', 'push', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="settings-group">
                <h3>Marketing & Promotions</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Promotional Offers</label>
                    <span>Receive special offers, discounts, and movie recommendations</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.notifications.promotional}
                      onChange={(e) => handleSettingChange('notifications', 'promotional', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="settings-section">
              <h2>App Preferences</h2>
              <p className="section-description">
                Customize your RTX Cinema experience with these preferences.
              </p>

              <div className="settings-group">
                <h3>Language & Region</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Language</label>
                    <span>Choose your preferred language</span>
                  </div>
                  <select
                    className="setting-select"
                    value={settings.preferences.language}
                    onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                  >
                    <option value="english">English</option>
                    <option value="nepali">नेपाली</option>
                    <option value="hindi">हिन्दी</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Currency</label>
                    <span>Display prices in your preferred currency</span>
                  </div>
                  <select
                    className="setting-select"
                    value={settings.preferences.currency}
                    onChange={(e) => handleSettingChange('preferences', 'currency', e.target.value)}
                  >
                    <option value="npr">NPR (Nepalese Rupee)</option>
                    <option value="usd">USD (US Dollar)</option>
                    <option value="inr">INR (Indian Rupee)</option>
                  </select>
                </div>
              </div>

              <div className="settings-group">
                <h3>Display & Interface</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Theme</label>
                    <span>Choose between light and dark theme</span>
                  </div>
                  <select
                    className="setting-select"
                    value={settings.preferences.theme}
                    onChange={(e) => handleSettingChange('preferences', 'theme', e.target.value)}
                  >
                    <option value="dark">Dark Theme</option>
                    <option value="light">Light Theme</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Auto-play Trailers</label>
                    <span>Automatically play movie trailers when browsing</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.preferences.autoPlay}
                      onChange={(e) => handleSettingChange('preferences', 'autoPlay', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2>Privacy Settings</h2>
              <p className="section-description">
                Control your privacy and data sharing preferences.
              </p>

              <div className="settings-group">
                <h3>Profile Privacy</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Profile Visibility</label>
                    <span>Control who can see your profile information</span>
                  </div>
                  <select
                    className="setting-select"
                    value={settings.privacy.profileVisibility}
                    onChange={(e) => handleSettingChange('privacy', 'profileVisibility', e.target.value)}
                  >
                    <option value="public">Public</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Show Booking History</label>
                    <span>Allow others to see your movie booking history</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.privacy.showBookingHistory}
                      onChange={(e) => handleSettingChange('privacy', 'showBookingHistory', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="settings-group">
                <h3>Data & Recommendations</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Personalized Recommendations</label>
                    <span>Use your viewing history to suggest movies you might like</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.privacy.allowRecommendations}
                      onChange={(e) => handleSettingChange('privacy', 'allowRecommendations', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="settings-section">
              <h2>Account Security</h2>
              <p className="section-description">
                Manage your account security and login preferences.
              </p>

              <div className="settings-group">
                <h3>Authentication</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Two-Factor Authentication</label>
                    <span>Add an extra layer of security to your account</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.account.twoFactorAuth}
                      onChange={(e) => handleSettingChange('account', 'twoFactorAuth', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <label>Login Alerts</label>
                    <span>Get notified when someone logs into your account</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.account.loginAlerts}
                      onChange={(e) => handleSettingChange('account', 'loginAlerts', e.target.checked)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>

              <div className="settings-group">
                <h3>Session Management</h3>
                <div className="setting-item">
                  <div className="setting-info">
                    <label>Session Timeout</label>
                    <span>Automatically log out after period of inactivity</span>
                  </div>
                  <select
                    className="setting-select"
                    value={settings.account.sessionTimeout}
                    onChange={(e) => handleSettingChange('account', 'sessionTimeout', e.target.value)}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>

              <div className="settings-group">
                <h3>Account Actions</h3>
                <div className="account-actions">
                  <button className="action-btn secondary">
                    Change Password
                  </button>
                  <button className="action-btn secondary">
                    Download My Data
                  </button>
                  <button className="action-btn danger">
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="settings-footer">
            <button 
              className="save-settings-btn"
              onClick={handleSaveSettings}
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="loading-spinner-small"></div>
                  Saving...
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="7,3 7,8 15,8" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}