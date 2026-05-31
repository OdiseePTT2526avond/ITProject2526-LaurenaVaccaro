import { useState, useEffect } from 'react';

function Home() {
  const [meldingen, setMeldingen] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/meldingen')
      .then(res => res.json())
      .then(data => setMeldingen(data))
      .catch(err => console.log(err));
  }, []);

  const statusKleur = (status) => {
    if (status === 'nieuw') return '#FF4B4B';
    if (status === 'in_behandeling') return '#FF9500';
    if (status === 'geholpen') return '#34C759';
    return '#999';
  };

  const dierEmoji = (type) => {
    if (type === 'kat') return '🐱';
    if (type === 'hond') return '🐶';
    if (type === 'vogel') return '🐦';
    return '🐾';
  };

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', paddingBottom: '80px' },
    zoekbalk: { display: 'flex', gap: '10px', marginBottom: '16px' },
    input: { flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
    filterKnop: { padding: '10px 16px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white', cursor: 'pointer', fontWeight: 'bold' },
    kaart: { backgroundColor: '#e8edf2', borderRadius: '12px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '40px' },
    titel: { fontWeight: 'bold', fontSize: '18px', marginBottom: '12px' },
    melding: { backgroundColor: 'white', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'pointer' },
    meldingLinks: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' },
    badge: (kleur) => ({ backgroundColor: kleur, color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }),
    leeg: { textAlign: 'center', color: '#999', marginTop: '40px' },
    bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', padding: '12px', borderTop: '1px solid #eee' },
    navItem: (actief) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '11px', color: actief ? '#5B6EF5' : '#999', cursor: 'pointer', textDecoration: 'none' }),
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.zoekbalk}>
        <input style={styles.input} placeholder="🔍 Zoeken..." />
        <button style={styles.filterKnop}>⚙ Filter</button>
      </div>

      <div style={styles.kaart}>🗺️ Kaart met dierenlocaties</div>

      <div style={styles.titel}>Lijst van meldingen</div>

      {meldingen.length === 0 ? (
        <div style={styles.leeg}>Nog geen meldingen</div>
      ) : (
        meldingen.map(m => (
          <div key={m.report_id} style={styles.melding} onClick={() => window.location.href = `/melding/${m.report_id}`}>
            <div style={styles.meldingLinks}>
              <span style={{ fontSize: '28px' }}>{dierEmoji(m.animal_type)}</span>
              <div>
                <div><strong>{m.animal_type}</strong></div>
                <div style={{ color: '#999', fontSize: '12px' }}>{m.description?.substring(0, 40)}...</div>
              </div>
            </div>
            <span style={styles.badge(statusKleur(m.status))}>{m.status}</span>
          </div>
        ))
      )}

      <div style={{ height: '70px' }} />

      <div style={styles.bottomNav}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <div style={styles.navItem(true)}>🏠<span>Home</span></div>
        </a>
        <a href="/melding-maken" style={{ textDecoration: 'none' }}>
          <div style={styles.navItem(false)}>➕<span>Melden</span></div>
        </a>
        <a href="/profiel" style={{ textDecoration: 'none' }}>
          <div style={styles.navItem(false)}>👤<span>Profiel</span></div>
        </a>
      </div>
    </div>
  );
}

export default Home;