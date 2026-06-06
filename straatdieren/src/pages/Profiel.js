import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

function Profiel() {
  const naam = localStorage.getItem('naam') || 'Gebruiker';
  const rol = localStorage.getItem('rol') || 'gebruiker';
  const [stats, setStats] = useState({ meldingen: 0, geholpen: 0, hulpacties: 0 });
  const [mijnMeldingen, setMijnMeldingen] = useState([]);
  const [toonMeldingen, setToonMeldingen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/profiel/stats', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(data => setStats(data)).catch(() => {});

    fetch('http://localhost:5000/api/mijn-meldingen', {
      headers: { 'Authorization': `Bearer ${token}` }
    }).then(res => res.json()).then(data => setMijnMeldingen(Array.isArray(data) ? data : [])).catch(() => {});
  }, []);

  const uitloggen = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('naam');
    localStorage.removeItem('rol');
    window.location.href = '/';
  };

  const rolKleur = () => {
    if (rol === 'admin') return '#FF4B4B';
    if (rol === 'vrijwilliger') return '#34C759';
    if (rol === 'dierenarts') return '#FF9500';
    if (rol === 'dierenarts_pending') return '#999';
    return '#5B6EF5';
  };

  const rolEmoji = () => {
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

  const badge = (label, emoji, kleur) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: kleur + '20', border: `1px solid ${kleur}`, borderRadius: '20px', padding: '4px 12px', fontSize: '12px', color: kleur, fontWeight: 'bold', margin: '4px' }}>
      {emoji} {label}
    </div>
  );

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '80px' },
    header: { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '30px 20px', color: 'white', textAlign: 'center' },
    avatar: { width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#5B6EF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', color: 'white', fontWeight: 'bold', margin: '0 auto 12px', border: '3px solid rgba(255,255,255,0.2)' },
    profielNaam: { fontWeight: 'bold', fontSize: '22px', marginBottom: '4px' },
    rolBadge: { display: 'inline-block', backgroundColor: rolKleur() + '30', border: `1px solid ${rolKleur()}`, borderRadius: '20px', padding: '4px 14px', fontSize: '13px', color: rolKleur(), fontWeight: 'bold' },
    statsRij: { display: 'flex', gap: '10px', margin: '12px', marginTop: '-20px' },
    statKaart: (kleur) => ({ flex: 1, backgroundColor: 'white', borderRadius: '12px', padding: '14px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `3px solid ${kleur}` }),
    statNummer: (kleur) => ({ fontSize: '24px', fontWeight: '900', color: kleur }),
    statLabel: { fontSize: '11px', color: '#666', marginTop: '2px' },
    kaart: { backgroundColor: 'white', borderRadius: '12px', margin: '12px', marginBottom: '0', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
    kaartTitel: { fontWeight: 'bold', fontSize: '14px', padding: '16px', borderBottom: '1px solid #f0f0f0', color: '#1a1a1a' },
    rij: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' },
    rijLinks: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' },
    pijl: { color: '#ccc', fontSize: '16px' },
    uitlogRij: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', cursor: 'pointer', color: '#FF4B4B', fontSize: '14px', fontWeight: 'bold' },
    meldingKaart: { margin: '0 16px 8px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' },
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.header}>
        <div style={styles.avatar}>{naam.charAt(0).toUpperCase()}</div>
        <div style={styles.profielNaam}>{naam}</div>
        <div style={styles.rolBadge}>{rolEmoji()} {rol === 'dierenarts_pending' ? 'Dierenarts (wacht op goedkeuring)' : rol}</div>
      </div>

      {rol === 'dierenarts_pending' && (
        <div style={{ backgroundColor: '#fff8e1', margin: '12px', padding: '12px', borderRadius: '8px', border: '1px solid #ffe082', fontSize: '13px', color: '#f57c00' }}>
          ⏳ Je dierenarts account wacht op goedkeuring van een admin. Je ontvangt een melding zodra je account is geactiveerd.
        </div>
      )}

      <div style={styles.statsRij}>
        <div style={styles.statKaart('#5B6EF5')}>
          <div style={styles.statNummer('#5B6EF5')}>{stats.meldingen}</div>
          <div style={styles.statLabel}>Meldingen</div>
        </div>
        <div style={styles.statKaart('#34C759')}>
          <div style={styles.statNummer('#34C759')}>{stats.geholpen}</div>
          <div style={styles.statLabel}>Geholpen</div>
        </div>
        <div style={styles.statKaart('#FF9500')}>
          <div style={styles.statNummer('#FF9500')}>{stats.hulpacties}</div>
          <div style={styles.statLabel}>Hulpacties</div>
        </div>
      </div>

      <div style={styles.kaart}>
        <div style={styles.kaartTitel}>🏆 Mijn badges</div>
        <div style={{ padding: '12px' }}>
          {stats.meldingen > 0 && badge('Dierenmelder', '📍', '#5B6EF5')}
          {stats.hulpacties > 0 && badge('Helper', '🤝', '#34C759')}
          {rol === 'vrijwilliger' && badge('Vrijwilliger', '⭐', '#FF9500')}
          {rol === 'dierenarts' && badge('Dierenarts', '🏥', '#FF9500')}
          {rol === 'admin' && badge('Administrator', '👑', '#FF4B4B')}
          {stats.meldingen === 0 && stats.hulpacties === 0 && (
            <div style={{ color: '#999', fontSize: '13px', padding: '8px' }}>Doe je eerste melding om een badge te verdienen! 🐾</div>
          )}
        </div>
      </div>

      <div style={styles.kaart}>
        <div style={{ ...styles.kaartTitel, cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }} onClick={() => setToonMeldingen(!toonMeldingen)}>
          <span>📍 Mijn meldingen ({mijnMeldingen.length})</span>
          <span>{toonMeldingen ? '▲' : '▼'}</span>
        </div>
        {toonMeldingen && (
          <div style={{ padding: '8px 0' }}>
            {mijnMeldingen.length === 0 ? (
              <div style={{ padding: '16px', color: '#999', fontSize: '13px', textAlign: 'center' }}>Nog geen meldingen gedaan</div>
            ) : (
              mijnMeldingen.map(m => (
                <div key={m.report_id} style={styles.meldingKaart} onClick={() => window.location.href = `/melding/${m.report_id}`}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{m.animal_type === 'kat' ? '🐱' : m.animal_type === 'hond' ? '🐶' : '🐾'} {m.animal_type}</div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{new Date(m.created_at).toLocaleDateString('nl-BE')}</div>
                  </div>
                  <span style={{ backgroundColor: statusKleur(m.status), color: 'white', padding: '3px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold' }}>{m.status}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div style={styles.kaart}>
        <div style={styles.kaartTitel}>📊 Mijn activiteit</div>
        <div style={styles.rij} onClick={() => window.location.href = '/mijn-hulpacties'}>
          <div style={styles.rijLinks}><span>🤝</span><span>Mijn hulpacties</span></div>
          <span style={styles.pijl}>›</span>
        </div>
        {rol === 'admin' && (
          <div style={styles.rij} onClick={() => window.location.href = '/admin'}>
            <div style={styles.rijLinks}><span>👑</span><span>Gebruikersbeheer</span></div>
            <span style={styles.pijl}>›</span>
          </div>
        )}
      </div>

      <div style={styles.kaart}>
        <div style={styles.kaartTitel}>⚙️ Instellingen</div>
        <div style={styles.rij} onClick={() => window.location.href = '/instellingen'}>
          <div style={styles.rijLinks}><span>👤</span><span>Profielgegevens aanpassen</span></div>
          <span style={styles.pijl}>›</span>
        </div>
        <div style={styles.rij} onClick={() => window.location.href = '/instellingen'}>
          <div style={styles.rijLinks}><span>🔔</span><span>Notificaties</span></div>
          <span style={styles.pijl}>›</span>
        </div>
        <div style={styles.rij} onClick={() => window.location.href = '/instellingen'}>
          <div style={styles.rijLinks}><span>🔒</span><span>Wachtwoord wijzigen</span></div>
          <span style={styles.pijl}>›</span>
        </div>
      </div>

      <div style={{ ...styles.kaart, marginTop: '12px' }}>
        <div style={styles.uitlogRij} onClick={uitloggen}>
          <span>🚪</span><span>Uitloggen</span>
        </div>
      </div>

      <div style={{ height: '20px' }} />
      <BottomNav actief="profiel" />
    </div>
  );
}

export default Profiel;