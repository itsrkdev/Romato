import React from 'react'

export default function NotFound() {

    
  return (
 <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.emoji}>🍅</div>
        <h1 style={styles.heading}>404</h1>
        <h2 style={styles.subHeading}>Page Not Found</h2>
        <p style={styles.text}>
          Oops! Jo page aap dhoondh rahe hain wo is menu mein nahi hai. 
          Chaliye, wapas chalte hain aur kuch swadisht dhoondhte hain!
        </p>
        <a 
          href="/" 
          style={styles.button}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e03a1a';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(255, 67, 33, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#ff4321';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(255, 67, 33, 0.3)';
          }}
        >
          Go Back to Home
        </a>
      </div>
    </div>

  )
}

// Modern Inline Styles Objects
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '80vh',
    backgroundColor: '#fafafa',
    fontFamily: '"Poppins", "Segoe UI", sans-serif',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '50px 40px',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
    maxWidth: '450px',
    width: '100%',
  },
  emoji: {
    fontSize: '64px',
    marginBottom: '10px',
    animation: 'bounce 2s infinite',
  },
  heading: {
    fontSize: '72px',
    fontWeight: '800',
    color: '#ff4321',
    margin: '0',
    lineHeight: '1',
  },
  subHeading: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '10px 0 15px 0',
  },
  text: {
    fontSize: '15px',
    color: '#7f8c8d',
    lineHeight: '1.6',
    marginBottom: '30px',
  },
  button: {
    display: 'inline-block',
    backgroundColor: '#ff4321',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '14px 30px',
    borderRadius: '30px',
    fontWeight: '600',
    fontSize: '16px',
    boxShadow: '0 4px 15px rgba(255, 67, 33, 0.3)',
    transition: 'all 0.3s ease',
  }
};






