import { useState, useEffect } from 'react';

function Admin() {
  const [gebruikers, setGebruikers] = useState([]);
  const [filter, setFilter] = useState('alle');
  const [bericht, setBericht] = useState('');

  const rol = localStorage.getItem('rol');

  useEffect(() => {
    if (rol !== 'admin') { window.location.href = '/home'; return; }
    laadGebruikers();
  }, []);

  const laadGebruikers = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/admin/gebruikers', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setGebruikers(Array.isArray(data) ? data : []));
  };

  const wijzigRol = async (user_id, nieuweRol) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/admin/gebruiker/${user_id}/rol`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ rol: nieuweRol })
    });
    const data = await response.json();
    if (data.bericht) {
      setBericht(`✅ Rol gewijzigd naar ${nieuweRol}!`);
      laadGebruikers();
      setTimeout(() => setBericht(''), 3000);
    }
  };

  const rolKleur = (rol) => {
    if (rol === 'admin') return '#FF4B4B';
    if (rol === 'vrijwilliger') return '#34C759';
    if (rol === 'dierenarts') return '#FF9500';
    if (rol === 'dierenarts_pending') return '#999';
    return '#5B6EF5';
  };

  const rolEmoji = (rol) => {
    if (rol === 'admin') return '👑';
    if (rol === 'vrijwilliger') return '🤝';
    if (rol === 'dierenarts') return '🏥';
    if (rol === 'dierenarts_pending') return '⏳';
    return '👤';
  };

  const gefilterd = gebruikers.filter(g => {
    if (filter === 'pending') return g.rol === 'dierenarts_pending';
    if (filter === 'dierenarts') return g.rol === 'dierenarts';
    if (filter === 'vrijwilliger') return g.rol === 'vrijwilliger';
    return true;
  });

  const pendingCount = gebruikers.filter(g => g.rol === 'dierenarts_pending').length;

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '80px' },
    header: { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '20px', color: 'white' },
    headerTop: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' },
    headerTitel: { fontWeight: 'bold', fontSize: '20px' },
    headerSub: { fontSize: '13px', color: '#94a3b8' },
    statsRij: { display: 'flex', gap: '10px', margin: '12px' },
    statKaart: (kleur) => ({ flex: 1, backgroundColor: 'white', borderRadius: '12px', padding: '12px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `3px solid ${kleur}` }),
    statNummer: (kleur) => ({ fontSize: '20px', fontWeight: '900', color: kleur }),
    statLabel: { fontSize: '11px', color: '#666', marginTop: '2px' },
    filterRij: { display: 'flex', gap: '8px', padding: '12px', overflowX: 'auto' },
    filterChip: (actief) => ({ padding: '6px 14px', borderRadius: '20px', border: '1px solid #ddd', backgroundColor: actief ? '#5B6EF5' : 'white', color: actief ? 'white' : '#333', fontSize: '12px', cursor: 'pointer', fontWeight: actief ? 'bold' : 'normal', whiteSpace: 'nowrap' }),
    bericht: { textAlign: 'center', padding: '10px', margin: '0 12px 12px', borderRadius: '8px', backgroundColor: '#e8f5e9', color: '#34C759', fontWeight: 'bold' },
    gebruikerKaart: { backgroundColor: 'white', borderRadius: '12px', margin: '12px', marginBottom: '0', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
    gebruikerHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' },
    gebruikerInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: (kleur) => ({ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: kleur, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px' }),
    naam: { fontWeight: 'bold', fontSize: '15px' },
    email: { fontSize: '12px', color: '#999' },
    rolBadge: (kleur) => ({ display: 'inline-block', backgroundColor: kleur + '20', border: `1px solid ${kleur}`, borderRadius: '20px', padding: '3px 10px', fontSize: '12px', color: kleur, fontWeight: 'bold' }),
    actiesRij: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
    actieKnop: (kleur) => ({ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${kleur}`, backgroundColor: kleur + '15', color: kleur, fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }),
    pendingBanner: { backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '12px', margin: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' },
    bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', padding: '12px', borderTop: '1px solid #eee' },
    navItem: (actief) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '11px', color: actief ? '#5B6EF5' : '#999', cursor: 'pointer', textDecoration: 'none' }),
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <a href="/profiel" style={{ textDecoration: 'none', fontSize: '20px', color: 'white' }}>←</a>
          <div>
            <div style={styles.headerTitel}>👑 Gebruikersbeheer</div>
            <div style={styles.headerSub}>Beheer alle gebruikers en rollen</div>
          </div>
        </div>
      </div>

      <div style={styles.statsRij}>
        <div style={styles.statKaart('#5B6EF5')}>
          <div style={styles.statNummer('#5B6EF5')}>{gebruikers.length}</div>
          <div style={styles.statLabel}>Totaal</div>
        </div>
        <div style={styles.statKaart('#FF9500')}>
          <div style={styles.statNummer('#FF9500')}>{gebruikers.filter(g => g.rol === 'dierenarts').length}</div>
          <div style={styles.statLabel}>Dierenartsen</div>
        </div>
        <div style={styles.statKaart('#34C759')}>
          <div style={styles.statNummer('#34C759')}>{gebruikers.filter(g => g.rol === 'vrijwilliger').length}</div>
          <div style={styles.statLabel}>Vrijwilligers</div>
        </div>
        <div style={styles.statKaart('#999')}>
          <div style={styles.statNummer('#999')}>{pendingCount}</div>
          <div style={styles.statLabel}>Wachtend</div>
        </div>
      </div>

      {pendingCount > 0 && (
        <div style={styles.pendingBanner}>
          <span style={{ fontSize: '24px' }}>⏳</span>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#856404' }}>{pendingCount} dierenarts aanvraag(en) wacht op goedkeuring</div>
            <div style={{ fontSize: '12px', color: '#856404' }}>Klik op "Pending" om ze te bekijken</div>
          </div>
        </div>
      )}

      {bericht && <div style={styles.bericht}>{bericht}</div>}

      <div style={styles.filterRij}>
        {[['alle', 'Alle'], ['pending', `⏳ Wachtend (${pendingCount})`], ['dierenarts', '🏥 Dierenartsen'], ['vrijwilliger', '🤝 Vrijwilligers']].map(([val, label]) => (
          <button key={val} style={styles.filterChip(filter === val)} onClick={() => setFilter(val)}>{label}</button>
        ))}
      </div>

      {gefilterd.map(g => (
        <div key={g.user_id} style={styles.gebruikerKaart}>
          <div style={styles.gebruikerHeader}>
            <div style={styles.gebruikerInfo}>
              <div style={styles.avatar(rolKleur(g.rol))}>{g.naam?.charAt(0).toUpperCase()}</div>
              <div>
                <div style={styles.naam}>{g.naam}</div>
                <div style={styles.email}>{g.email}</div>
              </div>
            </div>
            <span style={styles.rolBadge(rolKleur(g.rol))}>{rolEmoji(g.rol)} {g.rol}</span>
          </div>

          <div style={styles.actiesRij}>
            {g.rol === 'dierenarts_pending' && (
              <button style={styles.actieKnop('#34C759')} onClick={() => wijzigRol(g.user_id, 'dierenarts')}>✅ Goedkeuren als dierenarts</button>
            )}
            {g.rol !== 'vrijwilliger' && g.rol !== 'admin' && (
              <button style={styles.actieKnop('#34C759')} onClick={() => wijzigRol(g.user_id, 'vrijwilliger')}>🤝 Maak vrijwilliger</button>
            )}
            {g.rol !== 'gebruiker' && g.rol !== 'admin' && (
              <button style={styles.actieKnop('#999')} onClick={() => wijzigRol(g.user_id, 'gebruiker')}>👤 Terugzetten naar gebruiker</button>
            )}
            {g.rol !== 'admin' && (
              <button style={styles.actieKnop('#FF4B4B')} onClick={() => { if (window.confirm(`Maak ${g.naam} admin?`)) wijzigRol(g.user_id, 'admin'); }}>👑 Maak admin</button>
            )}
          </div>
        </div>
      ))}

      <div style={styles.bottomNav}>
        <a href="/home" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>🏠<span>Home</span></div></a>
        <a href="/meldingen" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>🗺️<span>Meldingen</span></div></a>
        <a href="/melding-maken" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>➕<span>Melden</span></div></a>
        <a href="/profiel" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>👤<span>Profiel</span></div></a>
      </div>
    </div>
  );
}

export default Admin;