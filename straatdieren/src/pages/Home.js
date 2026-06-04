import { useState, useEffect } from 'react';

function Home() {
  const [stats, setStats] = useState({ totaal: 0, geholpen: 0, nieuw: 0 });
  const naam = localStorage.getItem('naam') || 'Bezoeker';

  useEffect(() => {
    fetch('http://localhost:5000/api/meldingen')
      .then(res => res.json())
      .then(data => {
        setStats({
          totaal: data.length,
          geholpen: data.filter(m => m.status === 'geholpen').length,
          nieuw: data.filter(m => m.status === 'nieuw').length,
        });
      });
  }, []);

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '80px' },
    
    // Header
    header: { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '30px 20px 40px', color: 'white' },
    headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    logo: { fontWeight: '900', fontSize: '22px', color: 'white' },
    logoBadge: { fontSize: '11px', backgroundColor: 'rgba(91,110,245,0.3)', border: '1px solid #5B6EF5', borderRadius: '20px', padding: '3px 10px', color: '#a5b4fc', marginLeft: '8px' },
    begroeting: { fontSize: '24px', fontWeight: 'bold', marginBottom: '6px' },
    subBegroeting: { fontSize: '14px', color: '#94a3b8' },

    // Stats
    statsRij: { display: 'flex', gap: '10px', margin: '0 20px', marginTop: '-20px', marginBottom: '16px' },
    statKaart: (kleur) => ({ flex: 1, backgroundColor: 'white', borderRadius: '12px', padding: '14px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `3px solid ${kleur}` }),
    statNummer: (kleur) => ({ fontSize: '24px', fontWeight: '900', color: kleur }),
    statLabel: { fontSize: '11px', color: '#666', marginTop: '2px' },

    // Sectie
    sectie: { padding: '0 20px', marginBottom: '20px' },
    sectietitel: { fontWeight: 'bold', fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' },

    // Urgente melding banner
    urgentBanner: { backgroundColor: '#FF4B4B', borderRadius: '12px', padding: '14px 16px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', cursor: 'pointer' },
    urgentTekst: { flex: 1 },
    urgentTitel: { fontWeight: 'bold', fontSize: '15px' },
    urgentSub: { fontSize: '12px', opacity: 0.9, marginTop: '2px' },

    // Actie knoppen
    actieRij: { display: 'flex', gap: '10px', marginBottom: '20px' },
    actieKnop: (bg) => ({ flex: 1, backgroundColor: bg, borderRadius: '12px', padding: '16px 12px', color: 'white', border: 'none', cursor: 'pointer', textAlign: 'center', fontWeight: 'bold', fontSize: '13px' }),
    actieEmoji: { fontSize: '24px', marginBottom: '6px', display: 'block' },

    // Info kaarten
    infoKaart: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
    infoTitel: { fontWeight: 'bold', fontSize: '15px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' },
    infoTekst: { fontSize: '13px', color: '#555', lineHeight: '1.6' },

    // Hoe werkt het
    stapRij: { display: 'flex', gap: '12px' },
    stap: { flex: 1, textAlign: 'center' },
    stapNummer: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#5B6EF5', color: 'white', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' },
    stapTekst: { fontSize: '12px', color: '#555' },

    // Bottom nav
    bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', padding: '12px', borderTop: '1px solid #eee' },
    navItem: (actief) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '11px', color: actief ? '#5B6EF5' : '#999', cursor: 'pointer', textDecoration: 'none' }),
  };

  return (
    <div style={styles.pagina}>

      {/* HEADER */}
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <div style={styles.logo}>🐾 StreetPaws <span style={styles.logoBadge}>BETA</span></div>
          <a href="/profiel" style={{ textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#5B6EF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              {naam.charAt(0).toUpperCase()}
            </div>
          </a>
        </div>
        <div style={styles.begroeting}>Hallo, {naam}! 👋</div>
        <div style={styles.subBegroeting}>Samen helpen we straatdieren in nood.</div>
      </div>

      {/* STATS */}
      <div style={styles.statsRij}>
        <div style={styles.statKaart('#FF4B4B')}>
          <div style={styles.statNummer('#FF4B4B')}>{stats.nieuw}</div>
          <div style={styles.statLabel}>Wachten op hulp</div>
        </div>
        <div style={styles.statKaart('#5B6EF5')}>
          <div style={styles.statNummer('#5B6EF5')}>{stats.totaal}</div>
          <div style={styles.statLabel}>Totaal gemeld</div>
        </div>
        <div style={styles.statKaart('#34C759')}>
          <div style={styles.statNummer('#34C759')}>{stats.geholpen}</div>
          <div style={styles.statLabel}>Geholpen</div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>

        {/* URGENTE BANNER */}
        {stats.nieuw > 0 && (
          <div style={styles.urgentBanner} onClick={() => window.location.href = '/meldingen'}>
            <span style={{ fontSize: '30px' }}>🚨</span>
            <div style={styles.urgentTekst}>
              <div style={styles.urgentTitel}>{stats.nieuw} {stats.nieuw === 1 ? 'dier heeft' : 'dieren hebben'} dringend hulp nodig!</div>
              <div style={styles.urgentSub}>Bekijk de meldingen en bied hulp aan →</div>
            </div>
          </div>
        )}

        {/* ACTIE KNOPPEN */}
        <div style={styles.actieRij}>
          <button style={styles.actieKnop('#5B6EF5')} onClick={() => window.location.href = '/melding-maken'}>
            <span style={styles.actieEmoji}>📍</span>
            Dier melden
          </button>
          <button style={styles.actieKnop('#0ea5e9')} onClick={() => window.location.href = '/meldingen'}>
            <span style={styles.actieEmoji}>🗺️</span>
            Meldingen bekijken
          </button>
          <button style={styles.actieKnop('#8b5cf6')} onClick={() => window.location.href = '/profiel'}>
            <span style={styles.actieEmoji}>🤝</span>
            Vrijwilliger worden
          </button>
        </div>

        {/* WIE ZIJN WIJ */}
        <div style={styles.sectietitel}>🐾 Wie zijn wij?</div>
        <div style={styles.infoKaart}>
          <div style={styles.infoTekst}>
            <strong>StreetPaws</strong> is een platform waar burgers, vrijwilligers en dierenliefhebbers samenwerken om straatdieren te helpen. We geloven dat iedereen een verschil kan maken — of je nu een dier meldt, helpt met voeding, vervoer of opvang.
          </div>
        </div>

        {/* HOE WERKT HET */}
        <div style={styles.sectietitel}>💡 Hoe werkt het?</div>
        <div style={styles.infoKaart}>
          <div style={styles.stapRij}>
            <div style={styles.stap}>
              <div style={styles.stapNummer}>1</div>
              <div style={{ fontSize: '20px', margin: '4px 0' }}>📸</div>
              <div style={styles.stapTekst}>Zie je een dier in nood? Maak een foto en meld het.</div>
            </div>
            <div style={styles.stap}>
              <div style={styles.stapNummer}>2</div>
              <div style={{ fontSize: '20px', margin: '4px 0' }}>🔔</div>
              <div style={styles.stapTekst}>Vrijwilligers in de buurt zien de melding.</div>
            </div>
            <div style={styles.stap}>
              <div style={styles.stapNummer}>3</div>
              <div style={{ fontSize: '20px', margin: '4px 0' }}>🤝</div>
              <div style={styles.stapTekst}>Een vrijwilliger biedt hulp aan en het dier wordt gered.</div>
            </div>
          </div>
        </div>

        {/* VRIJWILLIGER WORDEN */}
        <div style={styles.sectietitel}>🌟 Word vrijwilliger</div>
        <div style={styles.infoKaart}>
          <div style={styles.infoTekst}>
            Als vrijwilliger kan je meldingen opvolgen, de status aanpassen en hulp coördineren. Registreer je account en contacteer ons om vrijwilliger te worden.
          </div>
          <button style={{ marginTop: '12px', padding: '10px 20px', backgroundColor: '#5B6EF5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
            onClick={() => window.location.href = '/register'}>
            Registreer nu →
          </button>
        </div>

        {/* SPONSOR */}
        <div style={styles.sectietitel}>💰 Steun ons</div>
        <div style={{ ...styles.infoKaart, background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white' }}>
          <div style={{ ...styles.infoTekst, color: '#94a3b8' }}>
            Straatdieren hebben voeding, dierenaartszorg en opvang nodig. Met jouw steun kunnen we meer dieren helpen.
          </div>
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            {['🍖 Voeding', '🏥 Dierenarts', '🏠 Opvang'].map(s => (
              <div key={s} style={{ flex: 1, backgroundColor: 'rgba(91,110,245,0.2)', border: '1px solid #5B6EF5', borderRadius: '8px', padding: '8px', textAlign: 'center', fontSize: '12px', color: '#a5b4fc' }}>{s}</div>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM NAV */}
      <div style={styles.bottomNav}>
        <a href="/home" style={{ textDecoration: 'none' }}><div style={styles.navItem(true)}>🏠<span>Home</span></div></a>
        <a href="/meldingen" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>🗺️<span>Meldingen</span></div></a>
        <a href="/melding-maken" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>➕<span>Melden</span></div></a>
        <a href="/profiel" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>👤<span>Profiel</span></div></a>
      </div>
    </div>
  );
}

export default Home;