import { useState } from 'react';

function Register() {
  const [naam, setNaam] = useState('');
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    kaart: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', width: '300px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    logo: { backgroundColor: '#5B6EF5', borderRadius: '50%', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '30px' },
    titel: { fontWeight: 'bold', fontSize: '20px', marginBottom: '24px' },
    input: { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
    knop: { width: '100%', padding: '14px', backgroundColor: '#5B6EF5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },
    link: { color: '#5B6EF5', textDecoration: 'none' },
    tekst: { marginTop: '16px', fontSize: '13px', color: '#666' }
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.kaart}>
        <div style={styles.logo}>🐾</div>
        <div style={styles.titel}>Account aanmaken</div>
        <input style={styles.input} type="text" placeholder="Naam" value={naam} onChange={e => setNaam(e.target.value)} />
        <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Wachtwoord" value={wachtwoord} onChange={e => setWachtwoord(e.target.value)} />
        <button style={styles.knop}>REGISTREREN</button>
        <p style={styles.tekst}>Al een account? <a href="/login" style={styles.link}>Login hier</a></p>
      </div>
    </div>
  );
}

export default Register;