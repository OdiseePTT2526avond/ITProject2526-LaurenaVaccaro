import { useState } from 'react';

function Login() {
  const [email, setEmail] = useState('');
  const [wachtwoord, setWachtwoord] = useState('');
  const [bericht, setBericht] = useState('');

  const login = async () => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, wachtwoord })
    });
    const data = await response.json();
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('naam', data.naam);
      localStorage.setItem('rol', data.rol);
      window.location.href = '/';
    } else {
      setBericht(data.fout);
    }
  };

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    kaart: { backgroundColor: 'white', padding: '40px', borderRadius: '16px', width: '300px', textAlign: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
    logo: { backgroundColor: '#5B6EF5', borderRadius: '50%', width: '70px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '30px' },
    titel: { fontWeight: 'bold', fontSize: '20px', marginBottom: '24px' },
    input: { width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
    knop: { width: '100%', padding: '14px', backgroundColor: '#5B6EF5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },
    link: { color: '#5B6EF5', textDecoration: 'none' },
    tekst: { marginTop: '16px', fontSize: '13px', color: '#666' },
    fout: { marginTop: '12px', fontSize: '13px', color: 'red' }
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.kaart}>
        <div style={styles.logo}>🐾</div>
        <div style={styles.titel}>Straatdieren App</div>
        <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Wachtwoord" value={wachtwoord} onChange={e => setWachtwoord(e.target.value)} />
        <button style={styles.knop} onClick={login}>LOGIN</button>
        {bericht && <p style={styles.fout}>{bericht}</p>}
        <p style={styles.tekst}>Nog geen account? <a href="/register" style={styles.link}>Registreer hier</a></p>
      </div>
    </div>
  );
}

export default Login;