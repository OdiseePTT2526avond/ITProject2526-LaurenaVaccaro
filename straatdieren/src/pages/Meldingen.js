import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function Meldingen() {
  const [meldingen, setMeldingen] = useState([]);
  const [zoekterm, setZoekterm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterUrgentie, setFilterUrgentie] = useState('');
  const [toonFilter, setToonFilter] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/meldingen')
      .then(res => res.json())
      .then(data => setMeldingen(data))
      .catch(err => console.log(err));
  }, []);

  const gefilterd = meldingen.filter(m => {
    const zoek = m.animal_type?.toLowerCase().includes(zoekterm.toLowerCase()) ||
      m.description?.toLowerCase().includes(zoekterm.toLowerCase());
    const type = filterType ? m.animal_type === filterType : true;
    const status = filterStatus ? m.status === filterStatus : true;
    const urgentie = filterUrgentie ? m.urgentie === filterUrgentie : true;
    return zoek && type && status && urgentie;
  });

  const statusKleur = (status) => {
    if (status === 'nieuw') return '#FF4B4B';
    if (status === 'in_behandeling') return '#FF9500';
    if (status === 'geholpen') return '#34C759';
    return '#999';
  };

  const dierEmoji = (type) => {
    if (type === 'kat') return '🐱';
    if (type === 'hond') return '🐶';
    if (type === 'vogel') return '🐦';
    return '🐾';
  };

  const meldingMetLocatie = meldingen.filter(m => m.latitude && m.longitude);
  const center = meldingMetLocatie.length > 0
    ? [meldingMetLocatie[0].latitude, meldingMetLocatie[0].longitude]
    : [50.85, 4.35];

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', padding: '20px', paddingBottom: '80px' },
    zoekbalk: { display: 'flex', gap: '10px', marginBottom: '12px' },
    input: { flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
    filterKnop: { padding: '10px 16px', borderRadius: '8px', border: '1px solid #5B6EF5', backgroundColor: toonFilter ? '#5B6EF5' : 'white', color: toonFilter ? 'white' : '#5B6EF5', cursor: 'pointer', fontWeight: 'bold' },
    filterPanel: { backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    filterRij: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' },
    filterChip: (actief) => ({ padding: '6px 12px', borderRadius: '20px', border: '1px solid #ddd', backgroundColor: actief ? '#5B6EF5' : 'white', color: actief ? 'white' : '#333', fontSize: '12px', cursor: 'pointer', fontWeight: actief ? 'bold' : 'normal' }),
    kaartContainer: { borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', height: '200px' },
    titel: { fontWeight: 'bold', fontSize: '18px', marginBottom: '12px' },
    melding: { backgroundColor: 'white', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'pointer' },
    meldingLinks: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px' },
    badge: (kleur) => ({ backgroundColor: kleur, color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }),
    leeg: { textAlign: 'center', color: '#999', marginTop: '40px' },
    bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'white', display: 'flex', justifyContent: 'space-around', padding: '12px', borderTop: '1px solid #eee' },
    navItem: (actief) => ({ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '11px', color: actief ? '#5B6EF5' : '#999', cursor: 'pointer', textDecoration: 'none' }),
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.zoekbalk}>
        <input style={styles.input} placeholder="🔍 Zoeken..." value={zoekterm} onChange={e => setZoekterm(e.target.value)} />
        <button style={styles.filterKnop} onClick={() => setToonFilter(!toonFilter)}>⚙ Filter</button>
      </div>

      {toonFilter && (
        <div style={styles.filterPanel}>
          <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>Diersoort</div>
          <div style={styles.filterRij}>
            {['', 'kat', 'hond', 'vogel', 'ander'].map(t => (
              <button key={t} style={styles.filterChip(filterType === t)} onClick={() => setFilterType(t)}>
                {t === '' ? 'Alle' : t === 'kat' ? '🐱 Kat' : t === 'hond' ? '🐶 Hond' : t === 'vogel' ? '🐦 Vogel' : '🐾 Ander'}
              </button>
            ))}
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>Status</div>
          <div style={styles.filterRij}>
            {['', 'nieuw', 'in_behandeling', 'geholpen'].map(s => (
              <button key={s} style={styles.filterChip(filterStatus === s)} onClick={() => setFilterStatus(s)}>
                {s === '' ? 'Alle' : s === 'nieuw' ? '🔴 Nieuw' : s === 'in_behandeling' ? '🟠 In behandeling' : '🟢 Geholpen'}
              </button>
            ))}
          </div>
          <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>Sorteren</div>
          <div style={styles.filterRij}>
            <button style={styles.filterChip(false)} onClick={() => setMeldingen([...meldingen].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))}>📅 Nieuwste eerst</button>
            <button style={styles.filterChip(false)} onClick={() => setMeldingen([...meldingen].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)))}>📅 Oudste eerst</button>
            <button style={styles.filterChip(false)} onClick={() => setFilterStatus('nieuw')}>🆘 Nog hulp nodig</button>
          </div>
        </div>
      )}

      <div style={styles.kaartContainer}>
        <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {meldingMetLocatie.map(m => (
            <Marker key={m.report_id} position={[m.latitude, m.longitude]}>
              <Popup>{dierEmoji(m.animal_type)} {m.animal_type} — {m.status}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div style={styles.titel}>Lijst van meldingen ({gefilterd.length})</div>

      {gefilterd.length === 0 ? (
        <div style={styles.leeg}>Geen meldingen gevonden</div>
      ) : (
        gefilterd.map(m => (
          <div key={m.report_id} style={styles.melding} onClick={() => window.location.href = `/melding/${m.report_id}`}>
            <div style={styles.meldingLinks}>
              <span style={{ fontSize: '28px' }}>{dierEmoji(m.animal_type)}</span>
              <div>
                <div><strong>{m.animal_type}</strong></div>
                <div style={{ color: '#999', fontSize: '12px' }}>{m.description?.substring(0, 40)}...</div>
              </div>
            </div>
            <span style={styles.badge(statusKleur(m.status))}>{m.status}</span>
          </div>
        ))
      )}

      <div style={{ height: '70px' }} />
      <div style={styles.bottomNav}>
        <a href="/home" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>🏠<span>Home</span></div></a>
        <a href="/meldingen" style={{ textDecoration: 'none' }}><div style={styles.navItem(true)}>🗺️<span>Meldingen</span></div></a>
        <a href="/melding-maken" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>➕<span>Melden</span></div></a>
        <a href="/profiel" style={{ textDecoration: 'none' }}><div style={styles.navItem(false)}>👤<span>Profiel</span></div></a>
      </div>
    </div>
  );
}

export default Meldingen;