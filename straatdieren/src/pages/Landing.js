import { useState, useEffect } from 'react';

function Landing() {
  const [activeFoto, setActiveFoto] = useState(0);

const fotos = [
    'https://images.unsplash.com/photo-1731432917330-c21d32819999?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1553434133-96822a8e94af?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1707835173498-6929c9b0b5f0?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1651040465988-74671931bdce?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1605254252163-9208d6fd3fd7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1702852576837-cac81a9d2397?auto=format&fit=crop&w=1200&q=80',
];
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFoto(prev => (prev + 1) % fotos.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const styles = {
    pagina: { backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: 'Arial, sans-serif' },
    hero: { position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px', overflow: 'hidden' },
    heroBg: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: `url(${fotos[activeFoto]})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'all 1s ease', filter: 'brightness(0.35)' },
    heroContent: { position: 'relative', zIndex: 2 },
    badge: { display: 'inline-block', backgroundColor: 'rgba(91,110,245,0.3)', border: '1px solid #5B6EF5', borderRadius: '20px', padding: '6px 16px', fontSize: '13px', color: '#a5b4fc', marginBottom: '20px' },
    heroTitel: { fontSize: '56px', fontWeight: '900', marginBottom: '8px', lineHeight: '1.1', background: 'linear-gradient(135deg, #ffffff 0%, #a5b4fc 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' },
    heroTagline: { fontSize: '20px', color: '#a5b4fc', marginBottom: '16px', fontWeight: '300', letterSpacing: '2px' },
    heroSub: { fontSize: '17px', color: '#94a3b8', marginBottom: '40px', maxWidth: '500px', lineHeight: '1.6' },
    knopRij: { display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' },
    knopPrimair: { padding: '14px 32px', backgroundColor: '#5B6EF5', color: 'white', border: 'none', borderRadius: '50px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: '0 0 20px rgba(91,110,245,0.5)' },
    knopSecundair: { padding: '14px 32px', backgroundColor: 'transparent', color: 'white', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' },
    dots: { position: 'absolute', bottom: '30px', display: 'flex', gap: '8px', zIndex: 2 },
    dot: (actief) => ({ width: actief ? '24px' : '8px', height: '8px', borderRadius: '4px', backgroundColor: actief ? '#5B6EF5' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s ease' }),
    statssectie: { backgroundColor: '#1e293b', padding: '40px 20px', display: 'flex', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' },
    stat: { textAlign: 'center' },
    statNummer: { fontSize: '36px', fontWeight: '900', color: '#5B6EF5' },
    statLabel: { fontSize: '13px', color: '#94a3b8', marginTop: '4px' },
    sectie: { padding: '80px 20px', maxWidth: '1000px', margin: '0 auto' },
    sectietitel: { textAlign: 'center', fontSize: '32px', fontWeight: '900', marginBottom: '12px' },
    sectiesubtitel: { textAlign: 'center', color: '#94a3b8', marginBottom: '50px', fontSize: '16px' },
    kaartRij: { display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' },
    kaart: { backgroundColor: '#1e293b', borderRadius: '20px', padding: '30px', width: '280px', border: '1px solid rgba(255,255,255,0.08)' },
    kaartNummer: { width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#5B6EF5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', marginBottom: '16px' },
    kaartTitel: { fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' },
    kaartTekst: { color: '#94a3b8', fontSize: '14px', lineHeight: '1.6' },
    overOns: { backgroundColor: '#1e293b', padding: '80px 20px' },
    overOnsInner: { maxWidth: '700px', margin: '0 auto', textAlign: 'center' },
    overOnsTekst: { color: '#94a3b8', fontSize: '16px', lineHeight: '1.8', marginBottom: '40px' },
    footer: { backgroundColor: '#0f172a', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '30px 20px', textAlign: 'center', color: '#475569', fontSize: '14px' },
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroContent}>
          <div style={styles.badge}>🐾 Helping street animals since 2026</div>
          <div style={styles.heroTitel}>StreetPaws</div>
          <div style={styles.heroTagline}>RESCUE · REPORT · REUNITE</div>
          <div style={styles.heroSub}>
            Zie je een zwerfkat, gewonde hond of dier in nood?<br/>
            Meld het en vrijwilligers in jouw buurt komen in actie.
          </div>
          <div style={styles.knopRij}>
            <button style={styles.knopPrimair} onClick={() => window.location.href = '/login'}>Inloggen →</button>
            <button style={styles.knopSecundair} onClick={() => window.location.href = '/register'}>Gratis registreren</button>
          </div>
        </div>
        <div style={styles.dots}>
          {fotos.map((_, i) => (
            <div key={i} style={styles.dot(i === activeFoto)} onClick={() => setActiveFoto(i)} />
          ))}
        </div>
      </div>

      <div style={styles.statssectie}>
        <div style={styles.stat}><div style={styles.statNummer}>500+</div><div style={styles.statLabel}>Meldingen gedaan</div></div>
        <div style={styles.stat}><div style={styles.statNummer}>200+</div><div style={styles.statLabel}>Dieren geholpen</div></div>
        <div style={styles.stat}><div style={styles.statNummer}>150+</div><div style={styles.statLabel}>Actieve vrijwilligers</div></div>
        <div style={styles.stat}><div style={styles.statNummer}>50+</div><div style={styles.statLabel}>Steden actief</div></div>
      </div>

      <div style={{ backgroundColor: '#0f172a' }}>
        <div style={styles.sectie}>
          <div style={styles.sectietitel}>Hoe werkt het?</div>
          <div style={styles.sectiesubtitel}>In 3 eenvoudige stappen help jij een dier in nood</div>
          <div style={styles.kaartRij}>
            <div style={styles.kaart}>
              <div style={styles.kaartNummer}>1</div>
              <div style={styles.kaartTitel}>📍 Meld een dier</div>
              <div style={styles.kaartTekst}>Maak een foto, voeg automatisch je GPS-locatie toe en beschrijf kort de situatie van het dier.</div>
            </div>
            <div style={styles.kaart}>
              <div style={styles.kaartNummer}>2</div>
              <div style={styles.kaartTitel}>👀 Volg de status op</div>
              <div style={styles.kaartTekst}>Bekijk alle meldingen in jouw buurt. Van nieuw over in behandeling tot geholpen — altijd up-to-date.</div>
            </div>
            <div style={styles.kaart}>
              <div style={styles.kaartNummer}>3</div>
              <div style={styles.kaartTitel}>🤝 Word vrijwilliger</div>
              <div style={styles.kaartTekst}>Registreer als vrijwilliger en bied hulp aan dieren in nood. Samen maken we het verschil.</div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.overOns}>
        <div style={styles.overOnsInner}>
          <div style={styles.sectietitel}>Wie zijn wij?</div>
          <br/>
          <div style={styles.overOnsTekst}>
            StreetPaws is een maatschappelijk initiatief waarbij burgers, vrijwilligers
            en dierenliefhebbers samenwerken om straatdieren te helpen. We geloven dat iedereen
            een verschil kan maken — of je nu een dier meldt, helpt met voeding, vervoer of opvang.
            Ons platform brengt mensen samen die begaan zijn met het welzijn van dieren.
          </div>
          <div style={styles.knopRij}>
            <button style={styles.knopPrimair} onClick={() => window.location.href = '/register'}>Word vrijwilliger 🐾</button>
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        🐾 StreetPaws — Rescue · Report · Reunite
      </div>
    </div>
  );
}

export default Landing;