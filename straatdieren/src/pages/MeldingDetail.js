import { useState, useEffect } from 'react';

function MeldingDetail() {
  const [melding, setMelding] = useState(null);
  const [bericht, setBericht] = useState('');
  const id = window.location.pathname.split('/').pop();
  const rol = localStorage.getItem('rol');

  useEffect(() => {
    fetch(`http://localhost:5000/api/meldingen/${id}`)
      .then(res => res.json())
      .then(data => setMelding(data));
  }, [id]);

  const statusKleur = (status) => {
    if (status === 'nieuw') return '#FF4B4B';
    if (status === 'in_behandeling') return '#FF9500';
    if (status === 'geholpen') return '#34C759';
    return '#999';
  };

  const pasStatusAan = async (nieuweStatus) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/meldingen/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: nieuweStatus })
    });
    const data = await response.json();
    if (data.bericht) {
      setMelding({ ...melding, status: nieuweStatus });
      setBericht('Status aangepast!');
    } else {
      setBericht(data.fout);
    }
  };

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '80px' },
    header: { display: 'flex', alignItems: 'center', gap: '10px', padding: '20px', backgroundColor: 'white' },
    titel: { fontWeight: 'bold', fontSize: '20px' },
    foto: { width: '100%', maxHeight: '250px', objectFit: 'cover' },
    fotoPlaceholder: { width: '100%', height: '200px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px' },
    kaart: { backgroundColor: 'white', borderRadius: '12px', padding: '16px', margin: '12px', marginBottom: '0' },
    label: { fontWeight: 'bold', fontSize: '14px', color: '#333' },
    waarde: { fontSize: '14px', color: '#555', marginTop: '4px' },
    badge: (kleur) => ({ display: 'inline-block', backgroundColor: kleur, color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }),
    knop: { width: 'calc(100% - 24px)', margin: '12px', padding: '14px', backgroundColor: '#5B6EF5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },
    statusKnopRij: { display: 'flex', gap: '8px', marginTop: '10px' },
    statusKnop: (kleur) => ({ flex: 1, padding: '8px', backgroundColor: kleur, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }),
  };

  if (!melding) return <div style={{ padding: '20px' }}>Laden...</div>;

  return (
    <div style={styles.pagina}>
      <div style={styles.header}>
        <a href="/" style={{ textDecoration: 'none', fontSize: '20px' }}>←</a>
        <div style={styles.titel}>Dier Details</div>
      </div>

      {melding.image_url
        ? <img src={melding.image_url} alt="dier" style={styles.foto} />
        : <div style={styles.fotoPlaceholder}>📷</div>
      }

      <div style={styles.kaart}>
        <div style={styles.label}>Type: <span style={{ fontWeight: 'normal' }}>{melding.animal_type} {melding.animal_type === 'kat' ? '🐱' : melding.animal_type === 'hond' ? '🐶' : '🐾'}</span></div>
        <div style={{ ...styles.label, marginTop: '8px' }}>📍 Locatie: <span style={{ fontWeight: 'normal' }}>{melding.latitude}, {melding.longitude}</span></div>
        <div style={{ marginTop: '8px' }}>Status: <span style={styles.badge(statusKleur(melding.status))}>{melding.status}</span></div>

        {(rol === 'vrijwilliger' || rol === 'admin') && (
          <div>
            <div style={{ ...styles.label, marginTop: '12px' }}>Status aanpassen:</div>
            <div style={styles.statusKnopRij}>
              <button style={styles.statusKnop('#FF4B4B')} onClick={() => pasStatusAan('nieuw')}>Nieuw</button>
              <button style={styles.statusKnop('#FF9500')} onClick={() => pasStatusAan('in_behandeling')}>In behandeling</button>
              <button style={styles.statusKnop('#34C759')} onClick={() => pasStatusAan('geholpen')}>Geholpen</button>
            </div>
          </div>
        )}
        {bericht && <p style={{ color: 'green', marginTop: '8px' }}>{bericht}</p>}
      </div>

      <div style={styles.kaart}>
        <div style={styles.label}>Beschrijving:</div>
        <div style={styles.waarde}>{melding.description}</div>
      </div>

      <div style={styles.kaart}>
        <div style={styles.label}>Tijdlijn:</div>
        <div style={{ ...styles.waarde, marginTop: '8px' }}>🕐 Gemeld op {new Date(melding.created_at).toLocaleString('nl-BE')}</div>
      </div>

      <button style={styles.knop}>HELP AANBIEDEN</button>
    </div>
  );
}

export default MeldingDetail;