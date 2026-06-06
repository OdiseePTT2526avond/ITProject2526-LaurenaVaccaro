import { useState } from 'react';

function MeldingMaken() {
  const [fotoPreview, setFotoPreview] = useState(null);
  const [fotoBase64, setFotoBase64] = useState('');
  const [locatie, setLocatie] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [dierType, setDierType] = useState('');
  const [anderDier, setAnderDier] = useState('');
  const [gewond, setGewond] = useState('');
  const [urgentie, setUrgentie] = useState('');
  const [benaderbaar, setBenaderbaar] = useState('');
  const [halsband, setHalsband] = useState('');
  const [beschrijving, setBeschrijving] = useState('');
  const [melderNaam, setMelderNaam] = useState('');
  const [melderTel, setMelderTel] = useState('');
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
    if (!dierType || !urgentie || !beschrijving) {
      setBericht('Vul alle verplichte velden in!');
      return;
    }
    const token = localStorage.getItem('token');
    const animalType = dierType === 'ander' ? anderDier || 'ander' : dierType;
    const volledige_beschrijving = `${beschrijving} | Gewond: ${gewond || 'onbekend'} | Benaderbaar: ${benaderbaar || 'onbekend'} | Halsband: ${halsband || 'onbekend'} | Melder: ${melderNaam || 'anoniem'} | Tel: ${melderTel || 'niet opgegeven'}`;

    const response = await fetch('http://localhost:5000/api/meldingen', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        animal_type: animalType,
        description: volledige_beschrijving,
        latitude,
        longitude,
        image_url: fotoBase64,
        urgentie
      })
    });
    const data = await response.json();
    if (data.bericht) {
      setBericht('✅ Melding verstuurd!');
      setTimeout(() => window.location.href = '/meldingen', 1500);
    } else {
      setBericht(data.fout || 'Er ging iets mis');
    }
  };

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '80px' },
    header: { backgroundColor: 'white', padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #eee' },
    headerTitel: { fontWeight: 'bold', fontSize: '18px' },
    kaart: { backgroundColor: 'white', borderRadius: '12px', margin: '12px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
    sectietitel: { fontWeight: 'bold', fontSize: '14px', color: '#1a1a1a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' },
    fotoBox: { border: '2px dashed #ddd', borderRadius: '12px', padding: '20px', textAlign: 'center', cursor: 'pointer', backgroundColor: '#fafafa' },
    preview: { width: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
    gpsKnop: { backgroundColor: 'transparent', border: 'none', color: '#5B6EF5', cursor: 'pointer', fontSize: '13px', marginTop: '6px', padding: '0' },
    keuzeRij: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
    keuzeKnop: (actief, kleur) => ({ padding: '8px 14px', borderRadius: '20px', border: `1px solid ${actief ? kleur : '#ddd'}`, backgroundColor: actief ? kleur : 'white', color: actief ? 'white' : '#333', fontSize: '13px', cursor: 'pointer', fontWeight: actief ? 'bold' : 'normal' }),
    urgentieKnop: (actief, kleur) => ({ flex: 1, padding: '12px', borderRadius: '10px', border: `2px solid ${actief ? kleur : '#ddd'}`, backgroundColor: actief ? kleur + '20' : 'white', color: actief ? kleur : '#666', fontSize: '13px', cursor: 'pointer', fontWeight: actief ? 'bold' : 'normal', textAlign: 'center' }),
    textarea: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', height: '100px', resize: 'none' },
    verplicht: { color: '#FF4B4B', fontSize: '11px', marginLeft: '4px' },
    verstuurKnop: { width: 'calc(100% - 24px)', margin: '12px', padding: '16px', backgroundColor: '#5B6EF5', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' },
    bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', padding: '12px', borderTop: '1px solid #eee' },
    navItem: (actief) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '11px', color: actief ? '#5B6EF5' : '#999', cursor: 'pointer', textDecoration: 'none' }),
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.header}>
        <a href="/home" style={{ textDecoration: 'none', fontSize: '20px', color: '#333' }}>←</a>
        <div style={styles.headerTitel}>🐾 Dier melden</div>
      </div>

      {/* FOTO */}
      <div style={styles.kaart}>
        <div style={styles.sectietitel}>📸 Foto</div>
        {fotoPreview
          ? <div>
              <img src={fotoPreview} alt="preview" style={{ ...styles.preview, marginBottom: '10px' }} />
              <button style={{ width: '100%', padding: '10px', backgroundColor: 'white', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', color: '#666', fontSize: '13px' }} onClick={() => { setFotoPreview(null); setFotoBase64(''); }}>🗑️ Foto verwijderen</button>
            </div>
          : <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ ...styles.fotoBox, flex: 1 }} onClick={() => document.getElementById('fotoCamera').click()}>
                <div style={{ fontSize: '30px', marginBottom: '6px' }}>📷</div>
                <div style={{ color: '#555', fontSize: '13px', fontWeight: 'bold' }}>Camera</div>
                <div style={{ color: '#999', fontSize: '11px' }}>📱 Enkel op telefoon</div>
              </div>
              <div style={{ ...styles.fotoBox, flex: 1 }} onClick={() => document.getElementById('fotoGalerij').click()}>
                <div style={{ fontSize: '30px', marginBottom: '6px' }}>🖼️</div>
                <div style={{ color: '#555', fontSize: '13px', fontWeight: 'bold' }}>Galerij</div>
                <div style={{ color: '#999', fontSize: '11px' }}>Foto kiezen</div>
              </div>
            </div>
        }
        <input id="fotoCamera" type="file" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFoto} />
        <input id="fotoGalerij" type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFoto} />
      </div>

      {/* DIERSOORT */}
      <div style={styles.kaart}>
        <div style={styles.sectietitel}>🐾 Diersoort <span style={styles.verplicht}>*</span></div>
        <div style={styles.keuzeRij}>
          {[['kat', '🐱 Kat'], ['hond', '🐶 Hond'], ['vogel', '🐦 Vogel'], ['ander', '🐾 Ander']].map(([val, label]) => (
            <button key={val} style={styles.keuzeKnop(dierType === val, '#5B6EF5')} onClick={() => setDierType(val)}>{label}</button>
          ))}
        </div>
        {dierType === 'ander' && (
          <input style={{ ...styles.input, marginTop: '10px' }} placeholder="Welk dier?" value={anderDier} onChange={e => setAnderDier(e.target.value)} />
        )}
      </div>

      {/* LOCATIE */}
      <div style={styles.kaart}>
        <div style={styles.sectietitel}>📍 Locatie</div>
        <input style={styles.input} placeholder="Adres of beschrijving van de locatie" value={locatie} onChange={e => setLocatie(e.target.value)} />
        <button style={styles.gpsKnop} onClick={haalLocatie}>📍 Automatisch bepalen via GPS</button>
      </div>

      {/* TOESTAND */}
      <div style={styles.kaart}>
        <div style={styles.sectietitel}>🏥 Toestand van het dier</div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#555' }}>Is het dier gewond?</div>
          <div style={styles.keuzeRij}>
            {[['ja', '🩸 Ja, gewond', '#FF4B4B'], ['misschien', '🤔 Mogelijk', '#FF9500'], ['nee', '✅ Niet gewond', '#34C759']].map(([val, label, kleur]) => (
              <button key={val} style={styles.keuzeKnop(gewond === val, kleur)} onClick={() => setGewond(val)}>{label}</button>
            ))}
          </div>
        </div>
        <div style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#555' }}>Is het dier benaderbaar?</div>
          <div style={styles.keuzeRij}>
            {[['ja', '😊 Ja, tam'], ['voorzichtig', '😨 Schuw'], ['nee', '⚠️ Agressief']].map(([val, label]) => (
              <button key={val} style={styles.keuzeKnop(benaderbaar === val, '#5B6EF5')} onClick={() => setBenaderbaar(val)}>{label}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', marginBottom: '8px', color: '#555' }}>Heeft het dier een halsband of chip?</div>
          <div style={styles.keuzeRij}>
            {[['ja', '🏷️ Ja'], ['nee', '❌ Nee'], ['onbekend', '❓ Onbekend']].map(([val, label]) => (
              <button key={val} style={styles.keuzeKnop(halsband === val, '#5B6EF5')} onClick={() => setHalsband(val)}>{label}</button>
            ))}
          </div>
        </div>
      </div>

      {/* URGENTIE */}
      <div style={styles.kaart}>
        <div style={styles.sectietitel}>🚨 Urgentie <span style={styles.verplicht}>*</span></div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={styles.urgentieKnop(urgentie === 'laag', '#34C759')} onClick={() => setUrgentie('laag')}>🟢<br/>Laag<br/><span style={{ fontSize: '11px', fontWeight: 'normal' }}>Stabiel</span></button>
          <button style={styles.urgentieKnop(urgentie === 'gemiddeld', '#FF9500')} onClick={() => setUrgentie('gemiddeld')}>🟠<br/>Gemiddeld<br/><span style={{ fontSize: '11px', fontWeight: 'normal' }}>Hulp nodig</span></button>
          <button style={styles.urgentieKnop(urgentie === 'dringend', '#FF4B4B')} onClick={() => setUrgentie('dringend')}>🔴<br/>Dringend<br/><span style={{ fontSize: '11px', fontWeight: 'normal' }}>Onmiddellijk</span></button>
        </div>
      </div>

      {/* BESCHRIJVING */}
      <div style={styles.kaart}>
        <div style={styles.sectietitel}>📝 Beschrijving <span style={styles.verplicht}>*</span></div>
        <textarea style={styles.textarea} placeholder="Beschrijf het dier en de situatie zo gedetailleerd mogelijk..." value={beschrijving} onChange={e => setBeschrijving(e.target.value)} />
      </div>

      {/* CONTACTGEGEVENS */}
      <div style={styles.kaart}>
        <div style={styles.sectietitel}>👤 Jouw contactgegevens (optioneel)</div>
        <input style={{ ...styles.input, marginBottom: '10px' }} placeholder="Naam" value={melderNaam} onChange={e => setMelderNaam(e.target.value)} />
        <input style={styles.input} placeholder="Telefoonnummer" type="tel" value={melderTel} onChange={e => setMelderTel(e.target.value)} />
        <div style={{ fontSize: '12px', color: '#999', marginTop: '6px' }}>Je gegevens worden enkel gebruikt om contact op te nemen bij vragen over deze melding.</div>
      </div>

      {bericht && <p style={{ textAlign: 'center', color: bericht.includes('✅') ? '#34C759' : '#FF4B4B', margin: '0 12px', fontWeight: 'bold' }}>{bericht}</p>}
      <button style={styles.verstuurKnop} onClick={verstuur}>📤 MELDING VERSTUREN</button>

      <div style={styles.bottomNav}>
        <a href="/home" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>🏠<span>Home</span></div></a>
        <a href="/meldingen" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>🗺️<span>Meldingen</span></div></a>
        <a href="/melding-maken" style={{ textDecoration: 'none' }}><div style={styles.navItem(true)}>➕<span>Melden</span></div></a>
        <a href="/profiel" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>👤<span>Profiel</span></div></a>
      </div>
    </div>
  );
}

export default MeldingMaken;