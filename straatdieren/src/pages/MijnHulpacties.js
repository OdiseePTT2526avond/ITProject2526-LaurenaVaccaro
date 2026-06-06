import { useState, useEffect } from 'react';

function MijnHulpacties() {
  const [hulpacties, setHulpacties] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/mijn-hulpacties', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setHulpacties(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '80px' },
    header: { backgroundColor: 'white', padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #eee' },
    headerTitel: { fontWeight: 'bold', fontSize: '18px' },
    kaart: { backgroundColor: 'white', borderRadius: '12px', margin: '12px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
    leeg: { textAlign: 'center', color: '#999', padding: '40px 20px' },
    hulpKaart: { backgroundColor: 'white', borderRadius: '12px', margin: '12px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', borderLeft: '4px solid #34C759' },
    bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', padding: '12px', borderTop: '1px solid #eee' },
    navItem: (actief) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '11px', color: actief ? '#5B6EF5' : '#999', cursor: 'pointer', textDecoration: 'none' }),
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.header}>
        <a href="/profiel" style={{ textDecoration: 'none', fontSize: '20px', color: '#333' }}>←</a>
        <div style={styles.headerTitel}>🤝 Mijn hulpacties</div>
      </div>

      {hulpacties.length === 0 ? (
        <div style={styles.leeg}>
          <div style={{ fontSize: '50px', marginBottom: '12px' }}>🤝</div>
          <div style={{ fontWeight: 'bold', marginBottom: '8px' }}>Nog geen hulpacties</div>
          <div style={{ fontSize: '13px' }}>Bied hulp aan bij een melding om hier je acties te zien.</div>
          <button style={{ marginTop: '16px', padding: '10px 20px', backgroundColor: '#5B6EF5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }} onClick={() => window.location.href = '/meldingen'}>
            Bekijk meldingen
          </button>
        </div>
      ) : (
        hulpacties.map((h, i) => (
          <div key={i} style={styles.hulpKaart}>
            <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>🤝 {h.action_type}</div>
            <div style={{ fontSize: '13px', color: '#555', marginBottom: '4px' }}>{h.note}</div>
            <div style={{ fontSize: '12px', color: '#999' }}>🕐 {new Date(h.created_at).toLocaleString('nl-BE')}</div>
          </div>
        ))
      )}

      <div style={styles.bottomNav}>
        <a href="/home" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>🏠<span>Home</span></div></a>
        <a href="/meldingen" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>🗺️<span>Meldingen</span></div></a>
        <a href="/melding-maken" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>➕<span>Melden</span></div></a>
        <a href="/profiel" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>👤<span>Profiel</span></div></a>
      </div>
    </div>
  );
}

export default MijnHulpacties;