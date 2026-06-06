import { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

function BottomNav({ actief }) {
  const [aantalNieuw, setAantalNieuw] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    fetch('http://localhost:5000/api/meldingen')
      .then(res => res.json())
      .then(data => {
        const nieuw = data.filter(m => m.status === 'nieuw').length;
        setAantalNieuw(nieuw);
      })
      .catch(() => {});
  }, []);

  const styles = {
    bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: theme.nav, display: 'flex', justifyContent: 'space-around', padding: '12px', borderTop: `1px solid ${theme.border}`, zIndex: 50 },
    navItem: (act) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '11px', color: act ? '#5B6EF5' : theme.darkMode ? '#94a3b8' : '#999', cursor: 'pointer', textDecoration: 'none', position: 'relative' }),
    badge: { position: 'absolute', top: '-6px', right: '-10px', backgroundColor: '#FF4B4B', color: 'white', borderRadius: '10px', fontSize: '10px', fontWeight: 'bold', padding: '1px 5px', minWidth: '16px', textAlign: 'center' },
    darkToggle: { display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '11px', color: theme.darkMode ? '#94a3b8' : '#999', cursor: 'pointer', position: 'relative' },
  };

  return (
    <div style={styles.bottomNav}>
      <a href="/home" style={{ textDecoration: 'none' }}>
        <div style={styles.navItem(actief === 'home')}>🏠<span>Home</span></div>
      </a>
      <a href="/meldingen" style={{ textDecoration: 'none' }}>
        <div style={styles.navItem(actief === 'meldingen')}>
          <span style={{ position: 'relative', display: 'inline-block' }}>
            🗺️
            {aantalNieuw > 0 && <span style={styles.badge}>{aantalNieuw}</span>}
          </span>
          <span>Meldingen</span>
        </div>
      </a>
      <a href="/melding-maken" style={{ textDecoration: 'none' }}>
        <div style={styles.navItem(actief === 'melden')}>➕<span>Melden</span></div>
      </a>
      <a href="/profiel" style={{ textDecoration: 'none' }}>
        <div style={styles.navItem(actief === 'profiel')}>👤<span>Profiel</span></div>
      </a>
      <div style={styles.darkToggle} onClick={theme.toggle}>
        {theme.darkMode ? '☀️' : '🌙'}<span>{theme.darkMode ? 'Licht' : 'Donker'}</span>
      </div>
    </div>
  );
}

export default BottomNav;