import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

function Home() {
  const [stats, setStats] = useState({ totaal: 0, geholpen: 0, nieuw: 0 });
  const [sponsorPopup, setSponsorPopup] = useState(null);
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

  const sponsorInfo = {
    '🍖 Voeding': { titel: '🍖 Voeding sponsoren', tekst: 'Met jouw bijdrage zorgen we voor dagelijkse voeding voor straatdieren die wachten op opvang. Elke euro telt!', kleur: '#FF9500' },
    '🏥 Dierenarts': { titel: '🏥 Dierenarts sponsoren', tekst: 'Medische zorg is cruciaal voor gewonde straatdieren. Jouw steun betaalt voor behandelingen, operaties en medicatie.', kleur: '#FF4B4B' },
    '🏠 Opvang': { titel: '🏠 Opvang sponsoren', tekst: 'Tijdelijke opvang bieden aan straatdieren totdat ze een forever home vinden. Help ons meer plaatsen te creëren!', kleur: '#34C759' },
  };

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '80px' },
    header: { background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', padding: '30px 20px 40px', color: 'white' },
    headerTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    logo: { fontWeight: '900', fontSize: '22px', color: 'white' },
    logoBadge: { fontSize: '11px', backgroundColor: 'rgba(91,110,245,0.3)', border: '1px solid #5B6EF5', borderRadius: '20px', padding: '3px 10px', color: '#a5b4fc', marginLeft: '8px' },
    begroeting: { fontSize: '24px', fontWeight: 'bold', marginBottom: '6px' },
    subBegroeting: { fontSize: '14px', color: '#94a3b8' },
    statsRij: { display: 'flex', gap: '10px', margin: '0 20px', marginTop: '-20px', marginBottom: '16px' },
    statKaart: (kleur) => ({ flex: 1, backgroundColor: 'white', borderRadius: '12px', padding: '14px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', borderTop: `3px solid ${kleur}` }),
    statNummer: (kleur) => ({ fontSize: '24px', fontWeight: '900', color: kleur }),
    statLabel: { fontSize: '11px', color: '#666', marginTop: '2px' },
    sectietitel: { fontWeight: 'bold', fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' },
    urgentBanner: { backgroundColor: '#FF4B4B', borderRadius: '12px', padding: '14px 16px', color: 'white', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', cursor: 'pointer' },
    urgentTekst: { flex: 1 },
    urgentTitel: { fontWeight: 'bold', fontSize: '15px' },
    urgentSub: { fontSize: '12px', opacity: 0.9, marginTop: '2px' },
    actieRij: { display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' },
    actieKnop: (bg) => ({ flex: 1, minWidth: '80px', backgroundColor: bg, borderRadius: '12px', padding: '16px 12px', color: 'white', border: 'none', cursor: 'pointer', textAlign: 'center', fontWeight: 'bold', fontSize: '13px' }),
    actieEmoji: { fontSize: '24px', marginBottom: '6px', display: 'block' },
    infoKaart: { backgroundColor: 'white', borderRadius: '12px', padding: '20px', marginBottom: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
    infoTekst: { fontSize: '13px', color: '#555', lineHeight: '1.6' },
    stapRij: { display: 'flex', gap: '12px' },
    stap: { flex: 1, textAlign: 'center' },
    stapNummer: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#5B6EF5', color: 'white', fontWeight: 'bold', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' },
    stapTekst: { fontSize: '12px', color: '#555' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    popup: { backgroundColor: 'white', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '360px' },
    popupTitel: { fontWeight: 'bold', fontSize: '18px', marginBottom: '12px' },
    popupTekst: { fontSize: '14px', color: '#555', lineHeight: '1.6', marginBottom: '20px' },
    popupKnop: { width: '100%', padding: '12px', backgroundColor: '#5B6EF5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' },
  };

  return (
    <div className="pagina-animatie" style={styles.pagina}>
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

      <div style={styles.statsRij}>
        <div className="stagger-1" style={styles.statKaart('#FF4B4B')}>
          <div style={styles.statNummer('#FF4B4B')}>{stats.nieuw}</div>
          <div style={styles.statLabel}>Wachten op hulp</div>
        </div>
        <div className="stagger-2" style={styles.statKaart('#5B6EF5')}>
          <div style={styles.statNummer('#5B6EF5')}>{stats.totaal}</div>
          <div style={styles.statLabel}>Totaal gemeld</div>
        </div>
        <div className="stagger-3" style={styles.statKaart('#34C759')}>
          <div style={styles.statNummer('#34C759')}>{stats.geholpen}</div>
          <div style={styles.statLabel}>Geholpen</div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {stats.nieuw > 0 && (
          <div className="pulse" style={styles.urgentBanner} onClick={() => window.location.href = '/meldingen'}>
            <span style={{ fontSize: '30px' }}>🚨</span>
            <div style={styles.urgentTekst}>
              <div style={styles.urgentTitel}>{stats.nieuw} {stats.nieuw === 1 ? 'dier heeft' : 'dieren hebben'} dringend hulp nodig!</div>
              <div style={styles.urgentSub}>Bekijk de meldingen en bied hulp aan →</div>
            </div>
          </div>
        )}

        <div className="stagger-2" style={styles.actieRij}>
          <button style={styles.actieKnop('#5B6EF5')} onClick={() => window.location.href = '/melding-maken'}>
            <span style={styles.actieEmoji}>📍</span>Dier melden
          </button>
          <button style={styles.actieKnop('#0ea5e9')} onClick={() => window.location.href = '/meldingen'}>
            <span style={styles.actieEmoji}>🗺️</span>Meldingen
          </button>
          <button style={styles.actieKnop('#34C759')} onClick={() => window.location.href = '/succesverhalen'}>
            <span style={styles.actieEmoji}>🌟</span>Succesverhalen
          </button>
          <button style={styles.actieKnop('#8b5cf6')} onClick={() => window.location.href = '/register'}>
            <span style={styles.actieEmoji}>🤝</span>Vrijwilliger
          </button>
        </div>

        <div style={styles.sectietitel}>🐾 Wie zijn wij?</div>
        <div className="kaart-hover" style={styles.infoKaart}>
          <div style={styles.infoTekst}>
            <strong>StreetPaws</strong> is een platform waar burgers, vrijwilligers en dierenliefhebbers samenwerken om straatdieren te helpen. We geloven dat iedereen een verschil kan maken — of je nu een dier meldt, helpt met voeding, vervoer of opvang.
          </div>
        </div>

        <div style={styles.sectietitel}>💡 Hoe werkt het?</div>
        <div className="kaart-hover" style={styles.infoKaart}>
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

        <div style={styles.sectietitel}>🌟 Word vrijwilliger</div>
        <div className="kaart-hover" style={styles.infoKaart}>
          <div style={styles.infoTekst}>
            Als vrijwilliger kan je meldingen opvolgen, de status aanpassen en hulp coördineren. Registreer je account en contacteer ons om vrijwilliger te worden.
          </div>
          <button style={{ marginTop: '12px', padding: '10px 20px', backgroundColor: '#5B6EF5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
            onClick={() => window.location.href = '/register'}>
            Registreer nu →
          </button>
        </div>

        <div style={styles.sectietitel}>💰 Steun ons</div>
        <div className="kaart-hover" style={{ ...styles.infoKaart, background: 'linear-gradient(135deg, #1e293b, #0f172a)', color: 'white' }}>
          <div style={{ ...styles.infoTekst, color: '#94a3b8', marginBottom: '12px' }}>
            Straatdieren hebben voeding, dierenaartszorg en opvang nodig. Klik op een optie om meer te weten!
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {Object.keys(sponsorInfo).map(s => (
              <div key={s} onClick={() => setSponsorPopup(s)} style={{ flex: 1, backgroundColor: 'rgba(91,110,245,0.2)', border: '1px solid #5B6EF5', borderRadius: '8px', padding: '10px 6px', textAlign: 'center', fontSize: '12px', color: '#a5b4fc', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(91,110,245,0.4)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(91,110,245,0.2)'}>
                {s}<br/><span style={{ fontSize: '10px', opacity: 0.7 }}>Klik voor info</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {sponsorPopup && (
        <div style={styles.overlay} onClick={() => setSponsorPopup(null)}>
          <div className="pop-in" style={styles.popup} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '40px', textAlign: 'center', marginBottom: '12px' }}>{sponsorPopup.split(' ')[0]}</div>
            <div style={styles.popupTitel}>{sponsorInfo[sponsorPopup].titel}</div>
            <div style={styles.popupTekst}>{sponsorInfo[sponsorPopup].tekst}</div>
            <button style={{ ...styles.popupKnop, backgroundColor: sponsorInfo[sponsorPopup].kleur }} onClick={() => setSponsorPopup(null)}>
              Sluiten
            </button>
          </div>
        </div>
      )}

      <BottomNav actief="home" />
    </div>
  );
}

export default Home;