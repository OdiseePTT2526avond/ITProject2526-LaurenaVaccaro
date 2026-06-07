import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BottomNav from '../components/BottomNav';

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
    const nietGeholpen = m.status !== 'geholpen';
    return zoek && type && status && urgentie && nietGeholpen;
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

  const urgentieBadge = (urgentie) => {
    if (urgentie === 'dringend') return <span style={{ backgroundColor: '#FF4B4B', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>🔴 DRINGEND</span>;
    if (urgentie === 'gemiddeld') return <span style={{ backgroundColor: '#FF9500', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>🟠 GEMIDDELD</span>;
    return null;
  };

  const meldingMetLocatie = meldingen.filter(m => m.latitude && m.longitude && m.status !== 'geholpen');
  const center = meldingMetLocatie.length > 0
    ? [meldingMetLocatie[0].latitude, meldingMetLocatie[0].longitude]
    : [50.85, 4.35];

  // Groepeer meldingen op locatie
  const groepenOpLocatie = {};
  meldingMetLocatie.forEach(m => {
    const key = `${parseFloat(m.latitude).toFixed(3)}_${parseFloat(m.longitude).toFixed(3)}`;
    if (!groepenOpLocatie[key]) groepenOpLocatie[key] = [];
    groepenOpLocatie[key].push(m);
  });

  const maakPin = (m, offset = 0) => {
    const emoji = dierEmoji(m.animal_type);
    const kleur = m.urgentie === 'dringend' ? '#FF4B4B' : m.urgentie === 'gemiddeld' ? '#FF9500' : '#34C759';
    return L.divIcon({
      html: `<div style="background:${kleur};border-radius:50%;width:38px;height:38px;display:flex;align-items:center;justify-content:center;font-size:20px;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.4);transform:translate(${offset * 20}px,${offset * -10}px)">${emoji}</div>`,
      className: '',
      iconSize: [38, 38],
      iconAnchor: [19, 19],
    });
  };

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '80px' },
    zoekbalk: { display: 'flex', gap: '10px', marginBottom: '12px' },
    input: { flex: 1, padding: '10px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
    filterKnop: { padding: '10px 16px', borderRadius: '8px', border: `1px solid ${toonFilter ? '#5B6EF5' : '#ddd'}`, backgroundColor: toonFilter ? '#5B6EF5' : 'white', color: toonFilter ? 'white' : '#5B6EF5', cursor: 'pointer', fontWeight: 'bold' },
    filterPanel: { backgroundColor: 'white', borderRadius: '12px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' },
    filterRij: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' },
    filterChip: (actief) => ({ padding: '6px 12px', borderRadius: '20px', border: '1px solid #ddd', backgroundColor: actief ? '#5B6EF5' : 'white', color: actief ? 'white' : '#333', fontSize: '12px', cursor: 'pointer', fontWeight: actief ? 'bold' : 'normal' }),
    kaartContainer: { borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', height: '220px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
    titel: { fontWeight: 'bold', fontSize: '18px', marginBottom: '12px' },
    melding: { backgroundColor: 'white', borderRadius: '12px', padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform 0.2s' },
    meldingLinks: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', flex: 1 },
    badge: (kleur) => ({ backgroundColor: kleur, color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', whiteSpace: 'nowrap' }),
    leeg: { textAlign: 'center', color: '#999', marginTop: '40px' },
    legende: { display: 'flex', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' },
    legendeItem: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#666' },
  };

  return (
    <div className="pagina-animatie" style={styles.pagina}>
      <div style={{ padding: '20px', paddingBottom: '0' }}>
        <div style={styles.zoekbalk}>
          <input style={styles.input} placeholder="🔍 Zoeken..." value={zoekterm} onChange={e => setZoekterm(e.target.value)} />
          <button style={styles.filterKnop} onClick={() => setToonFilter(!toonFilter)}>⚙ Filter</button>
        </div>

        {toonFilter && (
          <div className="pop-in" style={styles.filterPanel}>
            <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>🐾 Diersoort</div>
            <div style={styles.filterRij}>
              {[['', 'Alle'], ['kat', '🐱 Kat'], ['hond', '🐶 Hond'], ['vogel', '🐦 Vogel'], ['ander', '🐾 Ander']].map(([val, label]) => (
                <button key={val} style={styles.filterChip(filterType === val)} onClick={() => setFilterType(val)}>{label}</button>
              ))}
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>📊 Status</div>
            <div style={styles.filterRij}>
              {[['', 'Alle actieve'], ['nieuw', '🔴 Nieuw'], ['in_behandeling', '🟠 In behandeling']].map(([val, label]) => (
                <button key={val} style={styles.filterChip(filterStatus === val)} onClick={() => setFilterStatus(val)}>{label}</button>
              ))}
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>🚨 Urgentie</div>
            <div style={styles.filterRij}>
              {[['', 'Alle'], ['dringend', '🔴 Dringend'], ['gemiddeld', '🟠 Gemiddeld'], ['laag', '🟢 Laag']].map(([val, label]) => (
                <button key={val} style={styles.filterChip(filterUrgentie === val)} onClick={() => setFilterUrgentie(val)}>{label}</button>
              ))}
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '8px' }}>📅 Sorteren</div>
            <div style={styles.filterRij}>
              <button style={styles.filterChip(false)} onClick={() => setMeldingen([...meldingen].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)))}>📅 Nieuwste eerst</button>
              <button style={styles.filterChip(false)} onClick={() => setMeldingen([...meldingen].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)))}>📅 Oudste eerst</button>
            </div>
          </div>
        )}

        <div style={styles.legende}>
          <div style={styles.legendeItem}><span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FF4B4B', display: 'inline-block' }} /> Dringend</div>
          <div style={styles.legendeItem}><span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FF9500', display: 'inline-block' }} /> Gemiddeld</div>
          <div style={styles.legendeItem}><span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#34C759', display: 'inline-block' }} /> Laag</div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <div style={styles.kaartContainer}>
          <MapContainer center={center} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {Object.values(groepenOpLocatie).map(groep =>
              groep.map((m, index) => (
                <Marker
                  key={m.report_id}
                  position={[
                    parseFloat(m.latitude) + (index * 0.0002),
                    parseFloat(m.longitude) + (index * 0.0002)
                  ]}
                  icon={maakPin(m, index)}
                  eventHandlers={{ click: () => window.location.href = `/melding/${m.report_id}` }}
                >
                  <Popup>
                    <div style={{ textAlign: 'center', minWidth: '120px' }}>
                      <div style={{ fontSize: '24px' }}>{dierEmoji(m.animal_type)}</div>
                      <div style={{ fontWeight: 'bold' }}>{m.animal_type}</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>{m.status}</div>
                      {groep.length > 1 && <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>+{groep.length - 1} andere melding(en) hier</div>}
                      <a href={`/melding/${m.report_id}`} style={{ color: '#5B6EF5', fontSize: '12px', display: 'block', marginTop: '4px' }}>Bekijk →</a>
                    </div>
                  </Popup>
                </Marker>
              ))
            )}
          </MapContainer>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        <div style={styles.titel}>
          Actieve meldingen ({gefilterd.length})
          <span style={{ fontSize: '13px', color: '#999', fontWeight: 'normal', marginLeft: '8px' }}>
            — geholpen dieren zie je in <a href="/succesverhalen" style={{ color: '#34C759' }}>Succesverhalen 🌟</a>
          </span>
        </div>

        {gefilterd.length === 0 ? (
          <div style={styles.leeg}>
            <div style={{ fontSize: '50px', marginBottom: '12px' }}>🐾</div>
            <div>Geen actieve meldingen gevonden</div>
            <a href="/succesverhalen" style={{ color: '#34C759', fontSize: '14px', marginTop: '8px', display: 'block' }}>Bekijk succesverhalen →</a>
          </div>
        ) : (
          gefilterd.map((m, index) => (
            <div key={m.report_id} className={`kaart-hover stagger-${Math.min(index + 1, 5)}`} style={styles.melding} onClick={() => window.location.href = `/melding/${m.report_id}`}>
              <div style={styles.meldingLinks}>
                <span style={{ fontSize: '32px' }}>{dierEmoji(m.animal_type)}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '15px' }}>{m.animal_type?.charAt(0).toUpperCase() + m.animal_type?.slice(1)}</strong>
                    {urgentieBadge(m.urgentie)}
                    {m.medische_urgentie && <span style={{ backgroundColor: '#FF9500', color: 'white', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>🏥 {m.medische_urgentie}</span>}
                    {m.likes > 0 && <span style={{ fontSize: '11px', color: '#FF4B4B' }}>❤️ {m.likes}</span>}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>{m.description?.substring(0, 50)}...</div>
                  <div style={{ color: '#bbb', fontSize: '11px', marginTop: '2px' }}>🕐 {new Date(m.created_at).toLocaleDateString('nl-BE')}</div>
                </div>
              </div>
              <span style={styles.badge(statusKleur(m.status))}>{m.status}</span>
            </div>
          ))
        )}
      </div>

      <div style={{ height: '70px' }} />
      <BottomNav actief="meldingen" />
    </div>
  );
}

export default Meldingen;