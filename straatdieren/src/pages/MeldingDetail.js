import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

function MeldingDetail() {
  const [melding, setMelding] = useState(null);
  const [bericht, setBericht] = useState('');
  const [toonHulpFormulier, setToonHulpFormulier] = useState(false);
  const [toonMedischFormulier, setToonMedischFormulier] = useState(false);
  const [hulpType, setHulpType] = useState('');
  const [hulpNaam, setHulpNaam] = useState('');
  const [hulpTelefoon, setHulpTelefoon] = useState('');
  const [hulpAdres, setHulpAdres] = useState('');
  const [verblijfNu, setVerblijfNu] = useState('');
  const [verblijfNa, setVerblijfNa] = useState('');
  const [verblijfAdresNa, setVerblijfAdresNa] = useState('');
  const [hulpNote, setHulpNote] = useState('');
  const [hulpBericht, setHulpBericht] = useState('');
  const [foutVelden, setFoutVelden] = useState([]);
  const [medischeNotitie, setMedischeNotitie] = useState('');
  const [medischeUrgentie, setMedischeUrgentie] = useState('');
  const [medischBericht, setMedischBericht] = useState('');
  const [likes, setLikes] = useState(0);
  const [geliked, setGeliked] = useState(false);

  const id = window.location.pathname.split('/').pop();
  const rol = localStorage.getItem('rol');

  useEffect(() => {
    fetch(`http://localhost:5000/api/meldingen/${id}`)
      .then(res => res.json())
      .then(data => {
        setMelding(data);
        setMedischeNotitie(data.medische_notitie || '');
        setMedischeUrgentie(data.medische_urgentie || '');
        setLikes(data.likes || 0);
      });
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
      setBericht('✅ Status aangepast!');
      setTimeout(() => setBericht(''), 3000);
    }
  };

  const slaaMedischOp = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/meldingen/${id}/medisch`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ medische_notitie: medischeNotitie, medische_urgentie: medischeUrgentie })
    });
    const data = await response.json();
    if (data.bericht) {
      setMedischBericht('✅ Medische notitie opgeslagen!');
      setToonMedischFormulier(false);
      setTimeout(() => setMedischBericht(''), 3000);
    }
  };

  const geefLike = async () => {
    if (geliked) return;
    await fetch(`http://localhost:5000/api/meldingen/${id}/like`, { method: 'POST' });
    setLikes(likes + 1);
    setGeliked(true);
    const knop = document.getElementById('likeKnop');
    if (knop) {
      knop.classList.add('like-animatie');
      setTimeout(() => knop.classList.remove('like-animatie'), 300);
    }
  };

  const deelViaWhatsApp = () => {
    const tekst = `🐾 StreetPaws melding: ${melding.animal_type} gevonden! Bekijk de melding en bied hulp aan. Status: ${melding.status}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(tekst)}`, '_blank');
  };

  const verstuurHulp = async () => {
    const fouten = [];
    if (!hulpType) fouten.push('hulpType');
    if (!verblijfNu) fouten.push('verblijfNu');
    if (!verblijfNa) fouten.push('verblijfNa');
    if (!hulpNaam) fouten.push('hulpNaam');
    if (!hulpTelefoon) fouten.push('hulpTelefoon');
    setFoutVelden(fouten);
    if (fouten.length > 0) { setHulpBericht('Vul alle verplichte velden in!'); return; }
    const token = localStorage.getItem('token');
    if (!token) { setHulpBericht('Je moet ingelogd zijn!'); return; }
    const note = `Naam: ${hulpNaam} | Tel: ${hulpTelefoon} | Verblijf nu: ${verblijfNu} | Verblijf na hulp: ${verblijfNa} ${verblijfAdresNa ? `(${verblijfAdresNa})` : ''} | Eigen adres: ${hulpAdres || 'niet opgegeven'} | Extra: ${hulpNote || 'geen'}`;
    const response = await fetch('http://localhost:5000/api/hulp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ report_id: id, action_type: hulpType, note })
    });
    const data = await response.json();
    if (data.bericht) {
      setHulpBericht('✅ Hulp aangeboden! We nemen contact met je op.');
      setToonHulpFormulier(false);
    } else {
      setHulpBericht('Er ging iets mis. Probeer opnieuw.');
    }
  };

  const fout = (veld) => foutVelden.includes(veld);

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '80px' },
    header: { display: 'flex', alignItems: 'center', gap: '10px', padding: '20px', backgroundColor: 'white', borderBottom: '1px solid #eee' },
    titel: { fontWeight: 'bold', fontSize: '20px', flex: 1 },
    fotoWrapper: { width: '100%', height: '420px', overflow: 'hidden', backgroundColor: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    foto: { width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' },
    fotoPlaceholder: { width: '100%', height: '250px', backgroundColor: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '50px' },
    kaart: { backgroundColor: 'white', borderRadius: '12px', padding: '16px', margin: '12px', marginBottom: '0' },
    medischKaart: { backgroundColor: '#fff8e1', borderRadius: '12px', padding: '16px', margin: '12px', marginBottom: '0', border: '1px solid #ffe082' },
    label: { fontWeight: 'bold', fontSize: '14px', color: '#333' },
    waarde: { fontSize: '14px', color: '#555', marginTop: '4px' },
    badge: (kleur) => ({ display: 'inline-block', backgroundColor: kleur, color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }),
    actiesRij: { display: 'flex', gap: '8px', margin: '12px' },
    likeKnop: (geliked) => ({ flex: 1, padding: '12px', backgroundColor: geliked ? '#ffebee' : 'white', border: `1px solid ${geliked ? '#FF4B4B' : '#ddd'}`, borderRadius: '10px', cursor: geliked ? 'default' : 'pointer', fontSize: '14px', fontWeight: 'bold', color: geliked ? '#FF4B4B' : '#666', textAlign: 'center' }),
    deelKnop: { flex: 1, padding: '12px', backgroundColor: '#e8f5e9', border: '1px solid #34C759', borderRadius: '10px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', color: '#34C759', textAlign: 'center' },
    knop: { width: 'calc(100% - 24px)', margin: '12px', padding: '14px', backgroundColor: '#5B6EF5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },
    dierenArtsKnop: { width: 'calc(100% - 24px)', margin: '0 12px 8px', padding: '14px', backgroundColor: '#FF9500', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },
    statusKnopRij: { display: 'flex', gap: '8px', marginTop: '10px' },
    statusKnop: (kleur) => ({ flex: 1, padding: '8px', backgroundColor: kleur, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }),
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'flex-end' },
    modal: { backgroundColor: 'white', borderRadius: '20px 20px 0 0', padding: '24px', width: '100%', maxHeight: '90vh', overflowY: 'auto' },
    modalTitel: { fontWeight: 'bold', fontSize: '20px', marginBottom: '4px' },
    modalSub: { color: '#666', fontSize: '13px', marginBottom: '20px' },
    sluiten: { float: 'right', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#999' },
    veldLabel: (isFout) => ({ fontWeight: 'bold', fontSize: '13px', color: isFout ? '#FF4B4B' : '#333', marginBottom: '6px', display: 'block' }),
    input: (isFout) => ({ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${isFout ? '#FF4B4B' : '#ddd'}`, fontSize: '14px', boxSizing: 'border-box', marginBottom: '14px' }),
    select: (isFout) => ({ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${isFout ? '#FF4B4B' : '#ddd'}`, fontSize: '14px', boxSizing: 'border-box', marginBottom: '14px' }),
    textarea: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', height: '80px', resize: 'none', marginBottom: '14px' },
    verblijfRij: (isFout) => ({ display: 'flex', gap: '8px', marginBottom: '14px', flexWrap: 'wrap', padding: isFout ? '8px' : '0', borderRadius: '8px', border: isFout ? '1px solid #FF4B4B' : 'none' }),
    verblijfKnop: (actief) => ({ flex: 1, minWidth: '80px', padding: '10px 6px', backgroundColor: actief ? '#5B6EF5' : 'white', color: actief ? 'white' : '#333', border: '1px solid #ddd', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', textAlign: 'center' }),
    hulpKnop: { width: '100%', padding: '14px', backgroundColor: '#34C759', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', marginTop: '8px' },
    divider: { borderTop: '1px solid #f0f0f0', margin: '16px 0' },
    sectieLabel: { fontWeight: 'bold', fontSize: '15px', color: '#1a1a1a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' },
    urgentieKnop: (actief, kleur) => ({ flex: 1, padding: '10px', borderRadius: '8px', border: `2px solid ${actief ? kleur : '#ddd'}`, backgroundColor: actief ? kleur + '20' : 'white', color: actief ? kleur : '#666', fontSize: '12px', cursor: 'pointer', fontWeight: actief ? 'bold' : 'normal', textAlign: 'center' }),
  };

  if (!melding) return (
    <div style={{ padding: '20px' }}>
      <div className="skeleton" style={{ height: '250px', marginBottom: '12px' }} />
      <div className="skeleton" style={{ height: '120px', marginBottom: '12px' }} />
      <div className="skeleton" style={{ height: '80px' }} />
    </div>
  );

  return (
    <div className="pagina-animatie" style={styles.pagina}>
      <div style={styles.header}>
        <a href="/meldingen" style={{ textDecoration: 'none', fontSize: '20px', color: '#333' }}>←</a>
        <div style={styles.titel}>Dier Details</div>
      </div>

      {melding.image_url
        ? <div style={styles.fotoWrapper}><img src={melding.image_url} alt="dier" style={styles.foto} /></div>
        : <div style={styles.fotoPlaceholder}>📷</div>
      }

      <div style={styles.actiesRij}>
        <button id="likeKnop" style={styles.likeKnop(geliked)} onClick={geefLike}>
          {geliked ? '❤️' : '🤍'} {likes} {likes === 1 ? 'hart' : 'harten'}
        </button>
        <button style={styles.deelKnop} onClick={deelViaWhatsApp}>
          📱 Delen via WhatsApp
        </button>
      </div>

      <div className="stagger-1" style={styles.kaart}>
        <div style={styles.label}>Type: <span style={{ fontWeight: 'normal' }}>{melding.animal_type} {melding.animal_type === 'kat' ? '🐱' : melding.animal_type === 'hond' ? '🐶' : '🐾'}</span></div>
        <div style={{ ...styles.label, marginTop: '8px' }}>📍 Locatie: <span style={{ fontWeight: 'normal' }}>{melding.latitude}, {melding.longitude}</span></div>
        <div style={{ marginTop: '8px' }}>Status: <span style={styles.badge(statusKleur(melding.status))}>{melding.status}</span></div>
        {melding.urgentie && melding.urgentie !== 'laag' && (
          <div style={{ marginTop: '8px' }}>Urgentie: <span style={styles.badge(melding.urgentie === 'dringend' ? '#FF4B4B' : '#FF9500')}>{melding.urgentie === 'dringend' ? '🔴 Dringend' : '🟠 Gemiddeld'}</span></div>
        )}
        {(rol === 'vrijwilliger' || rol === 'admin' || rol === 'dierenarts') && (
          <div>
            <div style={{ ...styles.label, marginTop: '12px' }}>Status aanpassen:</div>
            <div style={styles.statusKnopRij}>
              <button style={styles.statusKnop('#FF4B4B')} onClick={() => pasStatusAan('nieuw')}>Nieuw</button>
              <button style={styles.statusKnop('#FF9500')} onClick={() => pasStatusAan('in_behandeling')}>In behandeling</button>
              <button style={styles.statusKnop('#34C759')} onClick={() => pasStatusAan('geholpen')}>Geholpen</button>
            </div>
          </div>
        )}
        {bericht && <p style={{ color: '#34C759', marginTop: '8px', fontWeight: 'bold' }}>{bericht}</p>}
      </div>

      {(melding.medische_notitie || rol === 'dierenarts' || rol === 'admin') && (
        <div className="stagger-2" style={styles.medischKaart}>
          <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '8px', color: '#f57c00' }}>🏥 Medische informatie</div>
          {melding.medische_urgentie && (
            <div style={{ marginBottom: '8px' }}>Medische urgentie: <span style={styles.badge(melding.medische_urgentie === 'kritiek' ? '#FF4B4B' : melding.medische_urgentie === 'dringend' ? '#FF9500' : '#34C759')}>{melding.medische_urgentie}</span></div>
          )}
          {melding.medische_notitie
            ? <div style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>{melding.medische_notitie}</div>
            : <div style={{ fontSize: '13px', color: '#999' }}>Nog geen medische notitie toegevoegd.</div>
          }
          {medischBericht && <p style={{ color: '#34C759', marginTop: '8px', fontWeight: 'bold' }}>{medischBericht}</p>}
        </div>
      )}

      <div className="stagger-3" style={styles.kaart}>
        <div style={styles.label}>Beschrijving:</div>
        <div style={styles.waarde}>{melding.description}</div>
      </div>

      <div className="stagger-4" style={styles.kaart}>
        <div style={styles.label}>Tijdlijn:</div>
        <div style={{ ...styles.waarde, marginTop: '8px' }}>🕐 Gemeld op {new Date(melding.created_at).toLocaleString('nl-BE')}</div>
      </div>

      {hulpBericht && <p style={{ color: '#34C759', textAlign: 'center', margin: '12px', fontWeight: 'bold' }}>{hulpBericht}</p>}

      {(rol === 'dierenarts' || rol === 'admin') && (
        <button style={styles.dierenArtsKnop} onClick={() => setToonMedischFormulier(true)}>🏥 Medische notitie toevoegen/aanpassen</button>
      )}

      <button style={styles.knop} onClick={() => setToonHulpFormulier(true)}>🤝 HULP AANBIEDEN</button>

      {toonMedischFormulier && (
        <div style={styles.overlay} onClick={() => setToonMedischFormulier(false)}>
          <div className="slide-in" style={styles.modal} onClick={e => e.stopPropagation()}>
            <button style={styles.sluiten} onClick={() => setToonMedischFormulier(false)}>✕</button>
            <div style={styles.modalTitel}>🏥 Medische notitie</div>
            <div style={styles.modalSub}>Voeg medische informatie toe als dierenarts.</div>
            <div style={styles.sectieLabel}>Medische urgentie</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button style={styles.urgentieKnop(medischeUrgentie === 'stabiel', '#34C759')} onClick={() => setMedischeUrgentie('stabiel')}>🟢 Stabiel</button>
              <button style={styles.urgentieKnop(medischeUrgentie === 'dringend', '#FF9500')} onClick={() => setMedischeUrgentie('dringend')}>🟠 Dringend</button>
              <button style={styles.urgentieKnop(medischeUrgentie === 'kritiek', '#FF4B4B')} onClick={() => setMedischeUrgentie('kritiek')}>🔴 Kritiek</button>
            </div>
            <div style={styles.sectieLabel}>Medische notitie</div>
            <textarea style={{ ...styles.textarea, height: '120px' }} placeholder="Beschrijf de medische toestand..." value={medischeNotitie} onChange={e => setMedischeNotitie(e.target.value)} />
            <button style={{ ...styles.hulpKnop, backgroundColor: '#FF9500' }} onClick={slaaMedischOp}>💾 Medische notitie opslaan</button>
          </div>
        </div>
      )}

      {toonHulpFormulier && (
        <div style={styles.overlay} onClick={() => setToonHulpFormulier(false)}>
          <div className="slide-in" style={styles.modal} onClick={e => e.stopPropagation()}>
            <button style={styles.sluiten} onClick={() => setToonHulpFormulier(false)}>✕</button>
            <div style={styles.modalTitel}>🐾 Hulp aanbieden</div>
            <div style={styles.modalSub}>Bedankt dat je dit dier wil helpen!</div>
            <div style={styles.divider} />
            <div style={styles.sectieLabel}>🤝 Hoe wil je helpen?</div>
            <span style={styles.veldLabel(fout('hulpType'))}>* Type hulp {fout('hulpType') && '— verplicht!'}</span>
            <select style={styles.select(fout('hulpType'))} value={hulpType} onChange={e => { setHulpType(e.target.value); setFoutVelden(f => f.filter(x => x !== 'hulpType')); }}>
              <option value="">Kies een optie...</option>
              <option value="voeding">🍖 Voeding geven</option>
              <option value="opvang">🏠 Tijdelijke opvang bieden</option>
              <option value="transport">🚗 Transport naar dierenarts/asiel</option>
              <option value="dierenarts">🏥 Dierenarts regelen</option>
              <option value="adoptie">❤️ Adopteren</option>
              <option value="sponsoring">💰 Kosten sponsoren</option>
              <option value="anders">🤝 Andere hulp</option>
            </select>
            <div style={styles.divider} />
            <div style={styles.sectieLabel}>📍 Verblijfsituatie van het dier</div>
            <span style={styles.veldLabel(fout('verblijfNu'))}>* Waar is het dier nu? {fout('verblijfNu') && '— verplicht!'}</span>
            <div style={styles.verblijfRij(fout('verblijfNu'))}>
              {['🛣️ Straat', '🌿 Natuur', '🏗️ Verlaten pand', '🏠 Bij iemand thuis', '🏥 Dierenarts'].map(v => (
                <button key={v} style={styles.verblijfKnop(verblijfNu === v)} onClick={() => { setVerblijfNu(v); setFoutVelden(f => f.filter(x => x !== 'verblijfNu')); }}>{v}</button>
              ))}
            </div>
            <span style={styles.veldLabel(fout('verblijfNa'))}>* Waar gaat het dier naartoe? {fout('verblijfNa') && '— verplicht!'}</span>
            <div style={styles.verblijfRij(fout('verblijfNa'))}>
              {['🏠 Mijn thuis', '🏥 Dierenasiel', '🏥 Dierenarts', '👨‍👩‍👧 Pleeggezin', '🔄 Tijdelijk'].map(v => (
                <button key={v} style={styles.verblijfKnop(verblijfNa === v)} onClick={() => { setVerblijfNa(v); setFoutVelden(f => f.filter(x => x !== 'verblijfNa')); }}>{v}</button>
              ))}
            </div>
            <span style={styles.veldLabel(false)}>Adres nieuwe verblijfplaats (optioneel)</span>
            <input style={styles.input(false)} placeholder="bv. Kerkstraat 12, 1000 Brussel" value={verblijfAdresNa} onChange={e => setVerblijfAdresNa(e.target.value)} />
            <div style={styles.divider} />
            <div style={styles.sectieLabel}>👤 Jouw gegevens</div>
            <span style={styles.veldLabel(fout('hulpNaam'))}>* Naam {fout('hulpNaam') && '— verplicht!'}</span>
            <input style={styles.input(fout('hulpNaam'))} placeholder="Voornaam en achternaam" value={hulpNaam} onChange={e => { setHulpNaam(e.target.value); setFoutVelden(f => f.filter(x => x !== 'hulpNaam')); }} />
            <span style={styles.veldLabel(fout('hulpTelefoon'))}>* Telefoonnummer {fout('hulpTelefoon') && '— verplicht!'}</span>
            <input style={styles.input(fout('hulpTelefoon'))} placeholder="+32 ..." type="tel" value={hulpTelefoon} onChange={e => { setHulpTelefoon(e.target.value); setFoutVelden(f => f.filter(x => x !== 'hulpTelefoon')); }} />
            <span style={styles.veldLabel(false)}>Jouw adres (optioneel)</span>
            <input style={styles.input(false)} placeholder="Straat, nummer, gemeente" value={hulpAdres} onChange={e => setHulpAdres(e.target.value)} />
            <span style={styles.veldLabel(false)}>Extra info (optioneel)</span>
            <textarea style={styles.textarea} placeholder="Beschrijf hoe je exact kan helpen..." value={hulpNote} onChange={e => setHulpNote(e.target.value)} />
            {hulpBericht && <p style={{ color: '#FF4B4B', marginBottom: '10px' }}>{hulpBericht}</p>}
            <button style={styles.hulpKnop} onClick={verstuurHulp}>✅ Bevestig hulp</button>
          </div>
        </div>
      )}

      <BottomNav actief="meldingen" />
    </div>
  );
}

export default MeldingDetail;