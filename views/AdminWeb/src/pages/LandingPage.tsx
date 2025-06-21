// This is a comment to try and refresh the language server.
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import Spline from '@splinetool/react-spline';
import { motion } from 'framer-motion';

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    width: '100%',
    color: 'white',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  },
  splineBackground: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  contentWrapper: {
    position: 'relative',
    zIndex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    maxWidth: '1280px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem 2rem',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
  },
  navLink: {
    color: '#D1D5DB',
    textDecoration: 'none',
  },
  loginButton: {
    padding: '0.5rem 1rem',
    color: '#F9FAFB',
    textDecoration: 'none',
  },
  getStartedButtonHeader: {
    padding: '0.5rem 1.5rem',
    color: '#FFFFFF',
    backgroundColor: '#2563EB',
    borderRadius: '0.375rem',
    textDecoration: 'none',
  },
  mainContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '6rem 2rem 10rem 2rem',
  },
  mainHeading: {
    fontSize: '4.5rem',
    fontWeight: 'bold',
    lineHeight: 1.1,
    maxWidth: '800px',
  },
  subHeading: {
    color: '#3B82F6',
  },
  paragraph: {
    marginTop: '1.5rem',
    fontSize: '1.125rem',
    color: '#D1D5DB',
    maxWidth: '600px',
    lineHeight: '1.75rem',
  },
  buttonContainer: {
    marginTop: '2.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  startTrialButton: {
    padding: '0.8rem 2rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#FFFFFF',
    backgroundColor: '#2563EB',
    borderRadius: '0.375rem',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
  },
  watchDemoButton: {
    padding: '0.8rem 2rem',
    fontSize: '1rem',
    fontWeight: 600,
    color: '#F9FAFB',
    backgroundColor: 'transparent',
    border: '1px solid #4B5563',
    borderRadius: '0.375rem',
    cursor: 'pointer',
  },
  featuresList: {
    marginTop: '2rem',
    fontSize: '0.875rem',
    color: '#9CA3AF',
    display: 'flex',
    gap: '1.5rem'
  },
};

export const LandingPage: React.FC = () => {
  return (
    <div style={styles.pageContainer}>
      <Suspense fallback={<div style={{ width: '100%', height: '100vh', backgroundColor: '#111827' }}></div>}>
        <motion.div 
          style={styles.splineBackground}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
        >
          <Spline 
            scene="https://prod.spline.design/4G2JOXXiHCsZCeRM/scene.splinecode" 
          />
        </motion.div>
      </Suspense>
      <div style={styles.contentWrapper}>
        <header style={styles.header}>
          <div style={styles.logo}>DESK</div>
          <nav style={styles.nav}>
            <Link to="/features" style={styles.navLink}>Features</Link>
            <Link to="/pricing" style={styles.navLink}>Pricing</Link>
            <Link to="/contact" style={styles.navLink}>Contact</Link>
            <Link to="/auth" style={styles.loginButton}>Login</Link>
            <Link to="/signup" style={styles.getStartedButtonHeader}>Get Started</Link>
          </nav>
        </header>

        <main style={styles.mainContent}>
          <h1 style={styles.mainHeading}>
            Track Your Fleet <span style={styles.subHeading}>In Real-Time</span>
          </h1>
          <p style={styles.paragraph}>
            Monitor your vehicles, optimize routes, and ensure driver safety with our cutting-edge GPS tracking system. Get complete visibility into your fleet operations.
          </p>
          <div style={styles.buttonContainer}>
            <Link to="/signup" style={styles.startTrialButton}>Start Free Trial</Link>
            <button style={styles.watchDemoButton}>Watch Demo</button>
          </div>
          <div style={styles.featuresList}>
            <span>• No Setup Fees</span>
            <span>• 14-Day Free Trial</span>
            <span>• Cancel Anytime</span>
          </div>
        </main>
        
        {/* You can add more content sections here and they will scroll over the background */}

      </div>
    </div>
  );
};

export default LandingPage; 