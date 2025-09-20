import { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import './Dashboard.css';

function Dashboard({ onLogout }) {
  const [user, setUser] = useState(null);
  const [thought, setThought] = useState('');
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let thoughtsUnsubscribe = null;

    const authUnsubscribe = auth.onAuthStateChanged(async (authUser) => {
      try {
        if (authUser) {
          // Set up user data
          const userData = {
            name: authUser.displayName || authUser.email?.split('@')[0] || 'User',
            email: authUser.email || '',
            photoURL: authUser.photoURL || null,
            uid: authUser.uid
          };
          setUser(userData);
          console.log('User authenticated:', userData.uid);
          
          // Set up real-time listener for thoughts
          const thoughtsRef = collection(db, 'thoughts');
          const q = query(
            thoughtsRef,
            where('userId', '==', authUser.uid),
            orderBy('createdAt', 'desc')
          );

          thoughtsUnsubscribe = onSnapshot(q, (snapshot) => {
            try {
              const thoughtsList = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                  id: doc.id,
                  content: data.content || '',
                  userId: data.userId,
                  createdAt: data.createdAt?.toDate() || new Date(),
                  userEmail: data.userEmail || '',
                  userName: data.userName || 'Anonymous'
                };
              });
              console.log('Real-time update - Thoughts count:', thoughtsList.length);
              setThoughts(thoughtsList);
            } catch (error) {
              console.error('Error processing thoughts update:', error);
            }
            setLoading(false);
          }, (error) => {
            console.error('Error in thoughts listener:', error);
            setLoading(false);
          });

        } else {
          if (thoughtsUnsubscribe) {
            thoughtsUnsubscribe();
            thoughtsUnsubscribe = null;
          }
          setUser(null);
          setThoughts([]);
          setLoading(false);
          onLogout();
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setLoading(false);
      }
    });

    return () => {
      if (thoughtsUnsubscribe) {
        thoughtsUnsubscribe();
      }
      authUnsubscribe();
    };
  }, [onLogout]);

  const fetchThoughts = async (userId) => {
    if (!userId) {
      console.error('No user ID provided to fetchThoughts');
      setLoading(false);
      return;
    }

    try {
      console.log('Fetching thoughts for user:', userId);
      
      const thoughtsRef = collection(db, 'thoughts');
      const q = query(
        thoughtsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      console.log('Executing Firestore query...');
      const querySnapshot = await getDocs(q);
      console.log('Found thoughts:', querySnapshot.size);

      const thoughtsList = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          content: data.content || '',
          userId: data.userId,
          createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
          userEmail: data.userEmail || '',
          userName: data.userName || 'Anonymous'
        };
      });

      console.log('Processed thoughts:', thoughtsList.length);
      setThoughts(thoughtsList);
    } catch (error) {
      console.error('Error fetching thoughts:', error);
      setThoughts([]);  // Reset thoughts on error
    } finally {
      setLoading(false);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleThoughtSubmit = async (e) => {
    e.preventDefault();
    if (!thought.trim() || !user || isSubmitting) return;

    try {
      setIsSubmitting(true);
      console.log('Saving thought to Firestore...');

      // Create the thought document
      const thoughtDoc = {
        content: thought.trim(),
        userId: user.uid,
        createdAt: serverTimestamp(),
        userEmail: user.email,
        userName: user.name,
        timestamp: new Date().toISOString()
      };

      // Save to Firestore
      await addDoc(collection(db, 'thoughts'), thoughtDoc);
      
      // Clear the input - no need to update local state as the listener will handle it
      setThought('');
      console.log('Thought successfully saved');
      
    } catch (error) {
      console.error('Error saving thought:', error);
      alert('Failed to save your thought. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) return (
    <div className="loading-screen">
      <div className="loading-spinner"></div>
      <p>Loading your dashboard...</p>
    </div>
  );
  
  if (!user) return null;

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
        <div className="thoughts-section">
          <form onSubmit={handleThoughtSubmit} className="thought-form">
            <textarea
              value={thought}
              onChange={(e) => setThought(e.target.value)}
              placeholder="Write your thoughts..."
              className="thought-input"
              required
            />
            <button 
              type="submit" 
              className="submit-thought"
              disabled={!thought.trim() || isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Share Thought'}
            </button>
          </form>
          <div className="thoughts-list">
            <h2>Your Thoughts</h2>
            {thoughts.map((t) => (
              <div key={t.id} className="thought-card">
                <p>{t.content}</p>
                <span className="thought-date">
                  {t.createdAt instanceof Date 
                    ? t.createdAt.toLocaleString()
                    : new Date().toLocaleString()}
                </span>
              </div>
            ))}
            {!loading && thoughts.length === 0 && (
              <p className="no-thoughts">Share your first thought!</p>
            )}
            {loading && (
              <div className="loading-thoughts">
                <div className="loading-spinner"></div>
                <p>Loading your thoughts...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;