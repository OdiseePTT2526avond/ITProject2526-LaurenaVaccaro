function Home() {
  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px' },
    zoekbalk: { display: 'flex', gap: '10px', marginBottom: '16px' },
    input: { flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
    filterKnop: { padding: '10px 16px', borderRadius: '8px', border: '1px solid #ddd', backgroundColor: 'white', cursor: 'pointer', fontWeight: 'bold' },
    kaart: { backgroundColor: '#e8edf2', borderRadius: '12px', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', fontSize: '40px' },
    titel: { fontWeight: 'bold', fontSize: '18px', marginBottom: '12px' },
    melding: { backgroundColor: 'white', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
    meldingLinks: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' },
    badge: (kleur) => ({ backgroundColor: kleur, color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }),
    bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', padding: '12px', borderTop: '1px solid #eee' },
    navItem: (actief) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '11px', color: actief ? '#5B6EF5' : '#999', cursor: 'pointer' }),
  };

  const meldingen = [
    { id: 1, dier: 'Kat', emoji: '🐱', locatie: 'Brussel', status: 'Nieuw', kleur: '#FF4B4B' },
    { id: 2, dier: 'Hond', emoji: '🐶', locatie: 'Park', status: 'In behandeling', kleur: '#FF9500' },
    { id: 3, dier: 'Kat', emoji: '🐱', locatie: 'Centrum', status: 'Geholpen', kleur: '#34C759' },
  ];

  return (
    <div style={styles.pagina}>
      <div style={styles.zoekbalk}>
        <input style={styles.input} placeholder="🔍 Zoeken..." />
        <button style={styles.filterKnop}>⚙ Filter</button>
      </div>

      <div style={styles.kaart}>🗺️ Kaart met dierenlocaties</div>

      <div style={styles.titel}>Lijst van meldingen</div>

      {meldingen.map(m => (
        <div key={m.id} style={styles.melding}>
          <div style={styles.meldingLinks}>
            <span style={{ fontSize: '28px' }}>{m.emoji}</span>
            <span><strong>{m.dier}</strong> - {m.locatie}</span>
          </div>
          <span style={styles.badge(m.kleur)}>{m.status}</span>
        </div>
      ))}

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