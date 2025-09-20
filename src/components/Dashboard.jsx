import { useEffect, useState } from 'react';
import { auth } from '../firebase';
import './Dashboard.css';

function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get the current user's information
    const user = auth.currentUser;
    if (user) {
      setUser({
        name: user.displayName || user.email.split('@')[0],
        email: user.email,
        photoURL: user.photoURL
      });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <div className="user-info">
          {user.photoURL && (
            <img src={user.photoURL} alt="Profile" className="profile-pic" />
          )}
          <h2>Hi, {user.name}!</h2>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </nav>
      <div className="dashboard-content">
        <div className="welcome-card">
          <h1>Welcome to Your Dashboard</h1>
          <p>You're successfully logged in as {user.email}</p>
        </div>
        {/* Add more dashboard content here */}
      </div>
    </div>
  );
}

export default Dashboard;