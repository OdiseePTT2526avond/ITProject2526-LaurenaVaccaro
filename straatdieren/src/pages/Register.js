import { useState } from 'react';

function Register() {
  const [naam, setNaam] = useState('');
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [rol, setRol] = useState('gebruiker');
  const [riziv, setRiziv] = useState('');
  const [bericht, setBericht] = useState('');
  const [fout, setFout] = useState('');

  const registreer = async () => {
    if (!naam || !email || !wachtwoord) { setFout('Vul alle verplichte velden in!'); return; }
    if (rol === 'dierenarts' && !riziv) { setFout('Vul je RIZIV-nummer in!'); return; }

    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ naam, email, wachtwoord, rol, riziv })
    });
    const data = await response.json();
    if (data.bericht) {
      setBericht('✅ Account aangemaakt! Je kan nu inloggen.');
      setFout('');
      setTimeout(() => window.location.href = '/login', 2000);
    } else {
      setFout(data.fout);
    }
  };

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
    kaart: { backgroundColor: 'white', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '360px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    logo: { backgroundColor: '#5B6EF5', borderRadius: '50%', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '30px' },
    titel: { fontWeight: 'bold', fontSize: '20px', marginBottom: '6px', textAlign: 'center' },
    subtitel: { color: '#999', fontSize: '13px', textAlign: 'center', marginBottom: '24px' },
    label: { fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '6px', display: 'block' },
    input: { width: '100%', padding: '12px', marginBottom: '14px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
    rolRij: { display: 'flex', gap: '8px', marginBottom: '14px' },
    rolKnop: (actief, kleur) => ({ flex: 1, padding: '10px 6px', borderRadius: '10px', border: `2px solid ${actief ? kleur : '#ddd'}`, backgroundColor: actief ? kleur + '15' : 'white', color: actief ? kleur : '#666', fontSize: '12px', cursor: 'pointer', fontWeight: actief ? 'bold' : 'normal', textAlign: 'center' }),
    rizivBox: { backgroundColor: '#fff8e1', borderRadius: '10px', padding: '12px', marginBottom: '14px', border: '1px solid #ffe082' },
    rizivLabel: { fontSize: '12px', color: '#f57c00', fontWeight: 'bold', marginBottom: '8px' },
    knop: { width: '100%', padding: '14px', backgroundColor: '#5B6EF5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },
    link: { color: '#5B6EF5', textDecoration: 'none' },
    tekst: { marginTop: '16px', fontSize: '13px', color: '#666', textAlign: 'center' },
    success: { marginTop: '12px', fontSize: '13px', color: '#34C759', textAlign: 'center', fontWeight: 'bold' },
    error: { marginTop: '12px', fontSize: '13px', color: '#FF4B4B', textAlign: 'center', fontWeight: 'bold' },
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.kaart}>
        <div style={styles.logo}>🐾</div>
        <div style={styles.titel}>Account aanmaken</div>
        <div style={styles.subtitel}>Sluit je aan bij StreetPaws</div>

        <label style={styles.label}>Naam *</label>
        <input style={styles.input} type="text" placeholder="Voornaam en achternaam" value={naam} onChange={e => setNaam(e.target.value)} />

        <label style={styles.label}>E-mail *</label>
        <input style={styles.input} type="email" placeholder="jouw@email.com" value={email} onChange={e => setEmail(e.target.value)} />

        <label style={styles.label}>Wachtwoord *</label>
        <input style={styles.input} type="password" placeholder="Min. 6 tekens" value={wachtwoord} onChange={e => setWachtwoord(e.target.value)} />

        <label style={styles.label}>Ik ben een...</label>
        <div style={styles.rolRij}>
          <button style={styles.rolKnop(rol === 'gebruiker', '#5B6EF5')} onClick={() => setRol('gebruiker')}>
            👤<br/><span style={{ fontSize: '11px' }}>Gebruiker</span>
          </button>
          <button style={styles.rolKnop(rol === 'vrijwilliger', '#34C759')} onClick={() => setRol('vrijwilliger')}>
            🤝<br/><span style={{ fontSize: '11px' }}>Vrijwilliger</span>
          </button>
          <button style={styles.rolKnop(rol === 'dierenarts', '#FF9500')} onClick={() => setRol('dierenarts')}>
            🏥<br/><span style={{ fontSize: '11px' }}>Dierenarts</span>
          </button>
        </div>

        {rol === 'vrijwilliger' && (
          <div style={styles.rizivBox}>
            <div style={{ ...styles.rizivLabel, color: '#34C759' }}>✅ Als vrijwilliger kan je meldingen opvolgen en status aanpassen.</div>
          </div>
        )}

        {rol === 'dierenarts' && (
          <div style={styles.rizivBox}>
            <div style={styles.rizivLabel}>🏥 Dierenarts verificatie vereist</div>
            <input style={{ ...styles.input, marginBottom: '0' }} type="text" placeholder="RIZIV-nummer (bv. 1-23456-78-901)" value={riziv} onChange={e => setRiziv(e.target.value)} />
            <div style={{ fontSize: '11px', color: '#999', marginTop: '6px' }}>Je account wordt nagekeken door een admin voor activatie.</div>
          </div>
        )}

        <button style={styles.knop} onClick={registreer}>REGISTREREN</button>
        {bericht && <p style={styles.success}>{bericht}</p>}
        {fout && <p style={styles.error}>{fout}</p>}
        <p style={styles.tekst}>Al een account? <a href="/login" style={styles.link}>Login hier</a></p>
        <p style={{ ...styles.tekst, marginTop: '8px' }}><a href="/" style={styles.link}>← Terug naar startpagina</a></p>
      </div>
    </div>
  );
}

export default Register;