function Profiel() {
  const naam = localStorage.getItem('naam') || 'Gebruiker';
  const rol = localStorage.getItem('rol') || 'gebruiker';

  const uitloggen = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('naam');
    localStorage.removeItem('rol');
    window.location.href = '/login';
  };

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '80px' },
    header: { backgroundColor: 'white', padding: '20px', fontWeight: 'bold', fontSize: '18px', borderBottom: '1px solid #eee' },
    kaart: { backgroundColor: 'white', borderRadius: '12px', margin: '12px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
    avatar: { backgroundColor: '#5B6EF5', borderRadius: '50%', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: 'white', fontWeight: 'bold' },
    naam: { fontWeight: 'bold', fontSize: '20px', marginTop: '8px' },
    rol: { color: '#666', fontSize: '14px' },
    rij: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' },
    uitlogKnop: { width: '100%', padding: '14px', backgroundColor: 'white', color: '#FF4B4B', border: '1px solid #FF4B4B', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },
    bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', padding: '12px', borderTop: '1px solid #eee' },
    navItem: (actief) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '11px', color: actief ? '#5B6EF5' : '#999', cursor: 'pointer', textDecoration: 'none' }),
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.header}>PROFIEL</div>

      <div style={styles.kaart}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={styles.avatar}>{naam.charAt(0).toUpperCase()}</div>
          <div>
            <div style={styles.naam}>{naam}</div>
            <div style={styles.rol}>Rol: <strong>{rol}</strong> 🟢</div>
          </div>
        </div>
      </div>

      <div style={styles.kaart}>
        <div style={styles.rij}>
          <span>⚙️</span><span>Instellingen</span>
        </div>
        <div style={{ ...styles.rij, borderBottom: 'none', color: '#FF4B4B' }} onClick={uitloggen}>
          <span>🚪</span><span>Uitloggen</span>
        </div>
      </div>

      <div style={{ margin: '12px' }}>
        <button style={styles.uitlogKnop} onClick={uitloggen}>Uitloggen</button>
      </div>

      <div style={styles.bottomNav}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <div style={styles.navItem(false)}>🏠<span>Home</span></div>
        </a>
        <a href="/melding-maken" style={{ textDecoration: 'none' }}>
          <div style={styles.navItem(false)}>➕<span>Melden</span></div>
        </a>
        <a href="/profiel" style={{ textDecoration: 'none' }}>
          <div style={styles.navItem(true)}>👤<span>Profiel</span></div>
        </a>
      </div>
    </div>
  );
}

export default Profiel;