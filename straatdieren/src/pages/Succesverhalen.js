import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

function Succesverhalen() {
  const [verhalen, setVerhalen] = useState([]);
  const [toonVerhaalFormulier, setToonVerhaalFormulier] = useState(null);
  const [verhaalTekst, setVerhaalTekst] = useState('');
  const [bericht, setBericht] = useState('');
  const rol = localStorage.getItem('rol');

  const laadVerhalen = () => {
    fetch('http://localhost:5000/api/meldingen')
      .then(res => res.json())
      .then(data => setVerhalen(data.filter(m => m.status === 'geholpen')))
      .catch(() => {});
  };

  useEffect(() => { laadVerhalen(); }, []);

  const slaVerhaalOp = async (id) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/meldingen/${id}/verhaal`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ verhaal: verhaalTekst })
    });
    const data = await response.json();
    if (data.bericht) {
      setBericht('✅ Verhaal opgeslagen!');
      setToonVerhaalFormulier(null);
      setVerhaalTekst('');
      laadVerhalen();
      setTimeout(() => setBericht(''), 3000);
    }
  };

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '80px' },
    header: { background: 'linear-gradient(135deg, #34C759 0%, #20a844 100%)', padding: '24px 20px 30px', color: 'white' },
    headerTop: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' },
    headerTitel: { fontWeight: 'bold', fontSize: '22px' },
    headerSub: { fontSize: '13px', opacity: 0.9 },
    leeg: { textAlign: 'center', padding: '60px 20px', color: '#999' },
    kaart: { backgroundColor: 'white', borderRadius: '16px', margin: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.1)' },
    fotoWrapper: { width: '100%', height: '200px', overflow: 'hidden', backgroundColor: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' },
    foto: { width: '100%', height: '100%', objectFit: 'contain', objectPosition: 'center' },
    fotoPlaceholder: { width: '100%', height: '160px', background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '70px' },
    geholpenBanner: { position: 'absolute', top: '12px', left: '12px', backgroundColor: '#34C759', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' },
    kaartBody: { padding: '16px' },
    dierNaam: { fontWeight: 'bold', fontSize: '18px', marginBottom: '6px', color: '#1a1a1a' },
    beschrijving: { fontSize: '13px', color: '#666', lineHeight: '1.6', marginBottom: '12px' },
    verhaalBox: { background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '12px', padding: '14px', marginBottom: '12px', border: '1px solid #bbf7d0' },
    verhaalLabel: { fontWeight: 'bold', fontSize: '12px', color: '#166534', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' },
    verhaalTekst: { fontSize: '14px', color: '#15803d', lineHeight: '1.7', fontStyle: 'italic' },
    geenVerhaalBox: { backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px', marginBottom: '12px', border: '1px dashed #cbd5e1', textAlign: 'center' },
    medischBox: { backgroundColor: '#fff8e1', borderRadius: '10px', padding: '10px', marginBottom: '10px', fontSize: '13px', color: '#f57c00', border: '1px solid #ffe082' },
    footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' },
    datum: { fontSize: '12px', color: '#999' },
    likes: { fontSize: '13px', color: '#FF4B4B', fontWeight: 'bold' },
    verhaalKnop: { width: '100%', padding: '10px', backgroundColor: '#34C759', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', marginTop: '10px' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'flex-end' },
    modal: { backgroundColor: 'white', borderRadius: '20px 20px 0 0', padding: '24px', width: '100%', maxHeight: '80vh', overflowY: 'auto' },
    modalTitel: { fontWeight: 'bold', fontSize: '18px', marginBottom: '6px' },
    modalSub: { fontSize: '13px', color: '#666', marginBottom: '14px' },
    sluiten: { float: 'right', background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', color: '#999' },
    textarea: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', height: '120px', resize: 'none', marginBottom: '12px', lineHeight: '1.6' },
    opslaanKnop: { width: '100%', padding: '14px', backgroundColor: '#34C759', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer' },
    berichtBox: { textAlign: 'center', padding: '10px', margin: '0 12px 12px', borderRadius: '8px', backgroundColor: '#e8f5e9', color: '#34C759', fontWeight: 'bold' },
    statsBalk: { display: 'flex', gap: '10px', padding: '12px 20px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '10px', margin: '12px 0 0' },
    statItem: { textAlign: 'center', flex: 1 },
    statNummer: { fontWeight: 'bold', fontSize: '20px' },
    statLabel: { fontSize: '11px', opacity: 0.9 },
  };

  return (
    <div className="pagina-animatie" style={styles.pagina}>
      <div style={styles.header}>
        <div style={styles.headerTop}>
          <a href="/home" style={{ textDecoration: 'none', color: 'white', fontSize: '20px' }}>←</a>
          <div>
            <div style={styles.headerTitel}>🌟 Succesverhalen</div>
            <div style={styles.headerSub}>Dieren die gered werden dankzij StreetPaws</div>
          </div>
        </div>
        <div style={styles.statsBalk}>
          <div style={styles.statItem}>
            <div style={styles.statNummer}>{verhalen.length}</div>
            <div style={styles.statLabel}>Geholpen</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNummer}>{verhalen.filter(v => v.verhaal).length}</div>
            <div style={styles.statLabel}>Met verhaal</div>
          </div>
          <div style={styles.statItem}>
            <div style={styles.statNummer}>{verhalen.reduce((sum, v) => sum + (v.likes || 0), 0)}</div>
            <div style={styles.statLabel}>❤️ Likes</div>
          </div>
        </div>
      </div>

      {bericht && <div style={styles.berichtBox}>{bericht}</div>}

      {verhalen.length === 0 ? (
        <div style={styles.leeg}>
          <div style={{ fontSize: '60px', marginBottom: '16px' }}>🐾</div>
          <div style={{ fontWeight: 'bold', fontSize: '18px', marginBottom: '8px' }}>Nog geen succesverhalen</div>
          <div style={{ fontSize: '14px', marginBottom: '20px' }}>Als een melding de status "geholpen" krijgt verschijnt het hier!</div>
          <button style={{ padding: '12px 24px', backgroundColor: '#5B6EF5', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => window.location.href = '/meldingen'}>
            Bekijk meldingen →
          </button>
        </div>
      ) : (
        verhalen.map((m, index) => (
          <div key={m.report_id} className={`kaart-hover stagger-${Math.min(index + 1, 5)}`} style={styles.kaart}>
            <div style={styles.fotoWrapper}>
              {m.image_url
                ? <img src={m.image_url} alt="dier" style={styles.foto} />
                : <div style={styles.fotoPlaceholder}>{m.animal_type === 'kat' ? '🐱' : m.animal_type === 'hond' ? '🐶' : m.animal_type === 'vogel' ? '🐦' : '🐾'}</div>
              }
              <div style={styles.geholpenBanner}>✅ Geholpen!</div>
            </div>

            <div style={styles.kaartBody}>
              <div style={styles.dierNaam}>
                {m.animal_type === 'kat' ? '🐱' : m.animal_type === 'hond' ? '🐶' : m.animal_type === 'vogel' ? '🐦' : '🐾'} {m.animal_type?.charAt(0).toUpperCase() + m.animal_type?.slice(1)} gered!
              </div>
              <div style={styles.beschrijving}>{m.description?.substring(0, 120)}...</div>

              {m.verhaal ? (
                <div style={styles.verhaalBox}>
                  <div style={styles.verhaalLabel}>📖 Het reddingsverhaal:</div>
                  <div style={styles.verhaalTekst}>"{m.verhaal}"</div>
                </div>
              ) : (
                <div style={styles.geenVerhaalBox}>
                  <div style={{ fontSize: '24px', marginBottom: '6px' }}>📖</div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>Nog geen verhaal toegevoegd</div>
                  {(rol === 'vrijwilliger' || rol === 'admin' || rol === 'dierenarts') && (
                    <div style={{ fontSize: '12px', color: '#5B6EF5', marginTop: '4px' }}>Klik hieronder om het verhaal toe te voegen!</div>
                  )}
                </div>
              )}

              {m.medische_notitie && (
                <div style={styles.medischBox}>🏥 {m.medische_notitie}</div>
              )}

              <div style={styles.footer}>
                <div style={styles.datum}>🕐 {new Date(m.created_at).toLocaleDateString('nl-BE')}</div>
             {m.likes > 0 && <div style={styles.likes}>❤️ {m.likes} {m.likes === 1 ? 'persoon denkt mee' : 'mensen denken mee'}</div>}
              </div>

              {(rol === 'vrijwilliger' || rol === 'admin' || rol === 'dierenarts') && (
                <button style={styles.verhaalKnop} onClick={() => { setToonVerhaalFormulier(m.report_id); setVerhaalTekst(m.verhaal || ''); }}>
                  📖 {m.verhaal ? 'Verhaal aanpassen ✏️' : 'Verhaal toevoegen ✨'}
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {toonVerhaalFormulier && (
        <div style={styles.overlay} onClick={() => setToonVerhaalFormulier(null)}>
          <div className="slide-in" style={styles.modal} onClick={e => e.stopPropagation()}>
            <button style={styles.sluiten} onClick={() => setToonVerhaalFormulier(null)}>✕</button>
            <div style={styles.modalTitel}>📖 Reddingsverhaal</div>
            <div style={styles.modalSub}>Vertel hoe dit dier gered werd — dit inspireert anderen!</div>
            <textarea
              style={styles.textarea}
              placeholder="Beschrijf hoe het dier gevonden werd, hoe de redding verliep, hoe het nu met het dier gaat en wie er heeft geholpen..."
              value={verhaalTekst}
              onChange={e => setVerhaalTekst(e.target.value)}
              autoFocus
            />
            <button style={styles.opslaanKnop} onClick={() => slaVerhaalOp(toonVerhaalFormulier)}>
              💾 Verhaal opslaan
            </button>
          </div>
        </div>
      )}

      <BottomNav actief="meldingen" />
    </div>
  );
}

export default Succesverhalen;