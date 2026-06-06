import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

function Admin() {
  const [gebruikers, setGebruikers] = useState([]);
  const [meldingen, setMeldingen] = useState([]);
  const [stats, setStats] = useState({});
  const [filter, setFilter] = useState('alle');
  const [bericht, setBericht] = useState('');
  const [actievTab, setActiefTab] = useState('dashboard');

  const rol = localStorage.getItem('rol');

  useEffect(() => {
    if (rol !== 'admin') { window.location.href = '/home'; return; }
    laadAlles();
  }, []);

  const laadAlles = () => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/admin/gebruikers', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json()).then(data => setGebruikers(Array.isArray(data) ? data : []));
    fetch('http://localhost:5000/api/meldingen')
      .then(res => res.json()).then(data => setMeldingen(Array.isArray(data) ? data : []));
    fetch('http://localhost:5000/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json()).then(data => setStats(data));
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
      laadAlles();
      setTimeout(() => setBericht(''), 3000);
    }
  };

  const verwijderMelding = async (id) => {
    if (!window.confirm('Ben je zeker dat je deze melding wil verwijderen?')) return;
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/admin/melding/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await response.json();
    if (data.bericht) {
      setBericht('✅ Melding verwijderd!');
      laadAlles();
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

  const statusKleur = (status) => {
    if (status === 'nieuw') return '#FF4B4B';
    if (status === 'in_behandeling') return '#FF9500';
    if (status === 'geholpen') return '#34C759';
    return '#999';
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
    headerTop: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' },
    headerTitel: { fontWeight: 'bold', fontSize: '20px' },
    headerSub: { fontSize: '13px', color: '#94a3b8' },
    tabs: { display: 'flex', backgroundColor: 'white', borderBottom: '1px solid #eee', overflowX: 'auto' },
    tab: (actief) => ({ padding: '14px 20px', fontWeight: actief ? 'bold' : 'normal', color: actief ? '#5B6EF5' : '#666', borderBottom: actief ? '2px solid #5B6EF5' : '2px solid transparent', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }),
    statsGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', margin: '12px' },
    statKaart: (kleur) => ({ backgroundColor: 'white', borderRadius: '12px', padding: '16px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `3px solid ${kleur}` }),
    statNummer: (kleur) => ({ fontSize: '28px', fontWeight: '900', color: kleur }),
    statLabel: { fontSize: '12px', color: '#666', marginTop: '4px' },
    bericht: { textAlign: 'center', padding: '10px', margin: '0 12px 12px', borderRadius: '8px', backgroundColor: '#e8f5e9', color: '#34C759', fontWeight: 'bold' },
    filterRij: { display: 'flex', gap: '8px', padding: '12px', overflowX: 'auto' },
    filterChip: (actief) => ({ padding: '6px 14px', borderRadius: '20px', border: '1px solid #ddd', backgroundColor: actief ? '#5B6EF5' : 'white', color: actief ? 'white' : '#333', fontSize: '12px', cursor: 'pointer', fontWeight: actief ? 'bold' : 'normal', whiteSpace: 'nowrap' }),
    kaart: { backgroundColor: 'white', borderRadius: '12px', margin: '12px', marginBottom: '0', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
    gebruikerHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' },
    gebruikerInfo: { display: 'flex', alignItems: 'center', gap: '12px' },
    avatar: (kleur) => ({ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: kleur, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px' }),
    naam: { fontWeight: 'bold', fontSize: '15px' },
    email: { fontSize: '12px', color: '#999' },
    rolBadge: (kleur) => ({ display: 'inline-block', backgroundColor: kleur + '20', border: `1px solid ${kleur}`, borderRadius: '20px', padding: '3px 10px', fontSize: '12px', color: kleur, fontWeight: 'bold' }),
    actiesRij: { display: 'flex', gap: '6px', flexWrap: 'wrap' },
    actieKnop: (kleur) => ({ padding: '6px 12px', borderRadius: '8px', border: `1px solid ${kleur}`, backgroundColor: kleur + '15', color: kleur, fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }),
    pendingBanner: { backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '12px', margin: '12px', padding: '12px', display: 'flex', alignItems: 'center', gap: '10px' },
    meldingRij: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f0f0f0' },
    verwijderKnop: { padding: '6px 12px', borderRadius: '8px', backgroundColor: '#ffebee', border: '1px solid #FF4B4B', color: '#FF4B4B', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' },
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <a href="/profiel" style={{ textDecoration: 'none', fontSize: '20px', color: 'white' }}>←</a>
          <div>
            <div style={styles.headerTitel}>👑 Admin Dashboard</div>
            <div style={styles.headerSub}>Beheer gebruikers en meldingen</div>
          </div>
        </div>
      </div>

      <div style={styles.tabs}>
        <div style={styles.tab(actievTab === 'dashboard')} onClick={() => setActiefTab('dashboard')}>📊 Dashboard</div>
        <div style={styles.tab(actievTab === 'gebruikers')} onClick={() => setActiefTab('gebruikers')}>👥 Gebruikers {pendingCount > 0 && `(${pendingCount}⏳)`}</div>
        <div style={styles.tab(actievTab === 'meldingen')} onClick={() => setActiefTab('meldingen')}>📍 Meldingen</div>
      </div>

      {bericht && <div style={styles.bericht}>{bericht}</div>}

      {actievTab === 'dashboard' && (
        <div>
          <div style={styles.statsGrid}>
            <div style={styles.statKaart('#5B6EF5')}>
              <div style={styles.statNummer('#5B6EF5')}>{stats.gebruikers || 0}</div>
              <div style={styles.statLabel}>👥 Totaal gebruikers</div>
            </div>
            <div style={styles.statKaart('#FF4B4B')}>
              <div style={styles.statNummer('#FF4B4B')}>{stats.nieuw || 0}</div>
              <div style={styles.statLabel}>🆘 Wachten op hulp</div>
            </div>
            <div style={styles.statKaart('#34C759')}>
              <div style={styles.statNummer('#34C759')}>{stats.geholpen || 0}</div>
              <div style={styles.statLabel}>✅ Dieren geholpen</div>
            </div>
            <div style={styles.statKaart('#FF9500')}>
              <div style={styles.statNummer('#FF9500')}>{stats.totaal || 0}</div>
              <div style={styles.statLabel}>📍 Totaal meldingen</div>
            </div>
            <div style={styles.statKaart('#8b5cf6')}>
              <div style={styles.statNummer('#8b5cf6')}>{stats.hulpacties || 0}</div>
              <div style={styles.statLabel}>🤝 Hulpacties</div>
            </div>
            <div style={styles.statKaart('#999')}>
              <div style={styles.statNummer('#999')}>{pendingCount}</div>
              <div style={styles.statLabel}>⏳ Pending dierenartsen</div>
            </div>
          </div>

          {pendingCount > 0 && (
            <div style={styles.pendingBanner}>
              <span style={{ fontSize: '24px' }}>⏳</span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#856404' }}>{pendingCount} dierenarts aanvraag(en) wacht op goedkeuring!</div>
                <div style={{ fontSize: '12px', color: '#856404', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => setActiefTab('gebruikers')}>Klik hier om te bekijken →</div>
              </div>
            </div>
          )}

          <div style={styles.kaart}>
            <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>📈 Overzicht</div>
            <div style={{ fontSize: '14px', color: '#555', lineHeight: '2' }}>
              <div>✅ Geholpen: <strong style={{ color: '#34C759' }}>{stats.geholpen || 0}</strong> van {stats.totaal || 0} meldingen ({stats.totaal ? Math.round((stats.geholpen / stats.totaal) * 100) : 0}%)</div>
              <div>🆘 Nog nodig: <strong style={{ color: '#FF4B4B' }}>{stats.nieuw || 0}</strong> dieren wachten op hulp</div>
              <div>🤝 Vrijwilligers: <strong style={{ color: '#34C759' }}>{gebruikers.filter(g => g.rol === 'vrijwilliger').length}</strong> actief</div>
              <div>🏥 Dierenartsen: <strong style={{ color: '#FF9500' }}>{gebruikers.filter(g => g.rol === 'dierenarts').length}</strong> goedgekeurd</div>
            </div>
          </div>
        </div>
      )}

      {actievTab === 'gebruikers' && (
        <div>
          <div style={styles.filterRij}>
            {[['alle', 'Alle'], ['pending', `⏳ Wachtend (${pendingCount})`], ['dierenarts', '🏥 Dierenartsen'], ['vrijwilliger', '🤝 Vrijwilligers']].map(([val, label]) => (
              <button key={val} style={styles.filterChip(filter === val)} onClick={() => setFilter(val)}>{label}</button>
            ))}
          </div>
          {gefilterd.map(g => (
            <div key={g.user_id} style={styles.kaart}>
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
                  <button style={styles.actieKnop('#999')} onClick={() => wijzigRol(g.user_id, 'gebruiker')}>👤 Terugzetten</button>
                )}
                {g.rol !== 'admin' && (
                  <button style={styles.actieKnop('#FF4B4B')} onClick={() => { if (window.confirm(`Maak ${g.naam} admin?`)) wijzigRol(g.user_id, 'admin'); }}>👑 Maak admin</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {actievTab === 'meldingen' && (
        <div style={styles.kaart}>
          <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' }}>📍 Alle meldingen ({meldingen.length})</div>
          {meldingen.map(m => (
            <div key={m.report_id} style={styles.meldingRij}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {m.animal_type === 'kat' ? '🐱' : m.animal_type === 'hond' ? '🐶' : '🐾'} {m.animal_type}
                  <span style={{ marginLeft: '8px', backgroundColor: statusKleur(m.status), color: 'white', padding: '2px 8px', borderRadius: '10px', fontSize: '11px' }}>{m.status}</span>
                </div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{m.description?.substring(0, 50)}...</div>
                <div style={{ fontSize: '11px', color: '#ccc', marginTop: '2px' }}>{new Date(m.created_at).toLocaleString('nl-BE')}</div>
              </div>
              <button style={styles.verwijderKnop} onClick={() => verwijderMelding(m.report_id)}>🗑️ Verwijder</button>
            </div>
          ))}
        </div>
      )}

      <div style={{ height: '20px' }} />
      <BottomNav actief="profiel" />
    </div>
  );
}

export default Admin;