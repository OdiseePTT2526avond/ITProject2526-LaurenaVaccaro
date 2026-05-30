import { useState } from 'react';

function MeldingMaken() {
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoBase64, setFotoBase64] = useState('');
  const [locatie, setLocatie] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [dierType, setDierType] = useState('kat');
  const [beschrijving, setBeschrijving] = useState('');
  const [bericht, setBericht] = useState('');

  const haalLocatie = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setLatitude(pos.coords.latitude);
      setLongitude(pos.coords.longitude);
      setLocatie(`${pos.coords.latitude}, ${pos.coords.longitude}`);
    });
  };

  const handleFoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoBase64(reader.result);
      setFotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const verstuur = async () => {
    console.log('knop geklikt!');
    const token = localStorage.getItem('token');
    console.log('token:', token);
    const response = await fetch('http://localhost:5000/api/meldingen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ animal_type: dierType, description: beschrijving, latitude, longitude, image_url: fotoBase64 })
    });
    const data = await response.json();
    console.log('response:', data);
    if (data.bericht) {
      setBericht('Melding verstuurd!');
      setTimeout(() => window.location.href = '/', 1500);
    } else {
      setBericht(data.fout || 'Er ging iets mis');
    }
  };

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', paddingBottom: '80px' },
    header: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' },
    titel: { fontWeight: 'bold', fontSize: '20px' },
    kaart: { backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '16px' },
    label: { fontWeight: 'bold', fontSize: '14px', marginBottom: '8px', display: 'block' },
    fotoBox: { border: '2px dashed #ddd', borderRadius: '12px', padding: '30px', textAlign: 'center', cursor: 'pointer' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
    select: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
    textarea: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', height: '100px', resize: 'none' },
    knop: { width: '100%', padding: '14px', backgroundColor: '#5B6EF5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },
    gpsKnop: { backgroundColor: 'transparent', border: 'none', color: '#5B6EF5', cursor: 'pointer', fontSize: '13px', marginTop: '4px' },
    preview: { width: '100%', borderRadius: '8px' }
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.header}>
        <a href="/" style={{ textDecoration: 'none', fontSize: '20px' }}>←</a>
        <div style={styles.titel}>Dier melden</div>
      </div>
      <div style={styles.kaart}>
        <label style={styles.label}>Foto</label>
        <div style={styles.fotoBox} onClick={() => document.getElementById('fotoInput').click()}>
          {fotoPreview ? <img src={fotoPreview} alt="preview" style={styles.preview} /> : <div>📷<br/>Camera / Foto upload<br/>+ knop</div>}
        </div>
        <input id="fotoInput" type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFoto} />
      </div>
      <div style={styles.kaart}>
        <label style={styles.label}>Locatie</label>
        <input style={styles.input} placeholder="📍 Locatie" value={locatie} onChange={e => setLocatie(e.target.value)} />
        <br/>
        <button style={styles.gpsKnop} onClick={haalLocatie}>📍 Automatisch bepalen via GPS</button>
      </div>
      <div style={styles.kaart}>
        <label style={styles.label}>Type dier</label>
        <select style={styles.select} value={dierType} onChange={e => setDierType(e.target.value)}>
          <option value="kat">Kat 🐱</option>
          <option value="hond">Hond 🐶</option>
          <option value="vogel">Vogel 🐦</option>
          <option value="ander">Ander dier</option>
        </select>
      </div>
      <div style={styles.kaart}>
        <label style={styles.label}>Beschrijving</label>
        <textarea style={styles.textarea} placeholder="Beschrijf het dier en de situatie..." value={beschrijving} onChange={e => setBeschrijving(e.target.value)} />
      </div>
      {bericht && <p style={{ color: 'green', textAlign: 'center', marginBottom: '10px' }}>{bericht}</p>}
      <button style={styles.knop} onClick={verstuur}>MELDING VERSTUREN</button>
    </div>
  );
}

export default MeldingMaken;