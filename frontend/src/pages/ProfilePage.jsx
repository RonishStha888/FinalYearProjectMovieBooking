import { useState, useEffect } from "react";
import "./ProfilePage.css";

export default function ProfilePage({ user, onBack }) {
  const [profileData, setProfileData] = useState({
    name: user?.name || user?.login || '',
    email: user?.email || '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    city: 'Kathmandu',
    membershipType: 'Premium Member',
    joinDate: new Date().toLocaleDateString(),
    totalBookings: 0,
    favoriteGenres: []
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // In a real app, you'd fetch from your API
      // For now, we'll use mock data
      setProfileData(prev => ({
        ...prev,
        phone: '+977-9841234567',
        dateOfBirth: '1995-06-15',
        gender: 'Male',
        address: 'Thamel, Kathmandu',
        totalBookings: 12,
        favoriteGenres: ['Action', 'Sci-Fi', 'Drama']
      }));
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, you'd save to your API
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2"/>
          </svg>
          Back to Home
        </button>
        <h1>My Profile</h1>
      </div>

      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              <span>{profileData.name[0]?.toUpperCase() || 'U'}</span>
            </div>
            <h2>{profileData.name}</h2>
            <p className="membership-badge">{profileData.membershipType}</p>
            <p className="join-date">Member since {profileData.joinDate}</p>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <div className="stat-number">{profileData.totalBookings}</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{profileData.favoriteGenres.length}</div>
              <div className="stat-label">Favorite Genres</div>
            </div>
          </div>
        </div>

        <div className="profile-main">
          <div className="profile-section">
            <div className="section-header">
              <h3>Personal Information</h3>
              <button 
                className={`edit-button ${isEditing ? 'save' : ''}`}
                onClick={isEditing ? handleSave : () => setIsEditing(true)}
                disabled={loading}
              >
                {loading ? (
                  <div className="loading-spinner-small"></div>
                ) : isEditing ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Save Changes
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Edit Profile
                  </>
                )}
              </button>
            </div>

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={profileData.dateOfBirth}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={profileData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>City</label>
                <select
                  name="city"
                  value={profileData.city}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                >
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                </select>
              </div>

              <div className="form-group full-width">
                <label>Address</label>
                <textarea
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="form-input"
                  rows="3"
                />
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Preferences</h3>
            <div className="preferences-grid">
              <div className="preference-item">
                <h4>Favorite Genres</h4>
                <div className="genre-tags">
                  {profileData.favoriteGenres.map((genre, index) => (
                    <span key={index} className="genre-tag">{genre}</span>
                  ))}
                </div>
              </div>
              
              <div className="preference-item">
                <h4>Notifications</h4>
                <div className="notification-settings">
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>Email notifications for new movies</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" defaultChecked />
                    <span>SMS notifications for bookings</span>
                  </label>
                  <label className="checkbox-label">
                    <input type="checkbox" />
                    <span>Promotional offers</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}