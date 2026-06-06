import { useState, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

function Instellingen() {
  const [notificaties, setNotificaties] = useState({
    nieuweMeldingen: true,
    statusUpdates: true,
    hulpVerzoeken: true,
    nieuwsbrief: false,
  });
  const [oudWachtwoord, setOudWachtwoord] = useState('');
  const [nieuwWachtwoord, setNieuwWachtwoord] = useState('');
  const [bevestigWachtwoord, setBevestigWachtwoord] = useState('');
  const [toonWachtwoord, setToonWachtwoord] = useState(false);
  const [bericht, setBericht] = useState('');
  const [berichtType, setBerichtType] = useState('success');
  const [actievTab, setActiefTab] = useState('profiel');
  const naam = localStorage.getItem('naam') || '';
  const [nieuwNaam, setNieuwNaam] = useState(naam);

  useEffect(() => {
    setOudWachtwoord('');
    setNieuwWachtwoord('');
    setBevestigWachtwoord('');
  }, [actievTab]);

  const toonBericht = (tekst, type = 'success') => {
    setBericht(tekst);
    setBerichtType(type);
    setTimeout(() => setBericht(''), 3000);
  };

  const slaProfielOp = () => {
    if (!nieuwNaam) { toonBericht('Vul je naam in!', 'error'); return; }
    localStorage.setItem('naam', nieuwNaam);
    toonBericht('✅ Profiel opgeslagen!');
  };

  const wijzigWachtwoord = () => {
    if (!oudWachtwoord || !nieuwWachtwoord || !bevestigWachtwoord) {
      toonBericht('❌ Vul alle velden in!', 'error'); return;
    }
    if (nieuwWachtwoord !== bevestigWachtwoord) {
      toonBericht('❌ Wachtwoorden komen niet overeen!', 'error'); return;
    }
    if (nieuwWachtwoord.length < 6) {
      toonBericht('❌ Wachtwoord moet minstens 6 tekens zijn!', 'error'); return;
    }
    toonBericht('✅ Wachtwoord gewijzigd!');
    setOudWachtwoord('');
    setNieuwWachtwoord('');
    setBevestigWachtwoord('');
  };

  const toggleNotificatie = (key) => {
    setNotificaties(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificatieItems = [
    { key: 'nieuweMeldingen', label: '🔔 Nieuwe meldingen in mijn buurt' },
    { key: 'statusUpdates', label: '📊 Status updates van mijn meldingen' },
    { key: 'hulpVerzoeken', label: '🤝 Hulpverzoeken bevestigd' },
    { key: 'nieuwsbrief', label: '📧 Nieuwsbrief StreetPaws' },
  ];

  const styles = {
    pagina: { backgroundColor: '#f0f2f5', minHeight: '100vh', paddingBottom: '80px' },
    header: { backgroundColor: 'white', padding: '20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #eee' },
    headerTitel: { fontWeight: 'bold', fontSize: '18px' },
    tabs: { display: 'flex', backgroundColor: 'white', borderBottom: '1px solid #eee', overflowX: 'auto' },
    tab: (actief) => ({ padding: '14px 20px', fontWeight: actief ? 'bold' : 'normal', color: actief ? '#5B6EF5' : '#666', borderBottom: actief ? '2px solid #5B6EF5' : '2px solid transparent', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' }),
    kaart: { backgroundColor: 'white', borderRadius: '12px', margin: '12px', padding: '16px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' },
    sectietitel: { fontWeight: 'bold', fontSize: '15px', marginBottom: '16px', color: '#1a1a1a' },
    label: { fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '6px', display: 'block' },
    input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px' },
    inputDisabled: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #eee', fontSize: '14px', boxSizing: 'border-box', marginBottom: '12px', backgroundColor: '#f5f5f5', color: '#999' },
    wachtwoordWrapper: { position: 'relative', marginBottom: '12px' },
    wachtwoordInput: { width: '100%', padding: '12px', paddingRight: '44px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
    oogKnop: { position: 'absolute', right: '12px', top: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' },
    knop: { width: '100%', padding: '14px', backgroundColor: '#5B6EF5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' },
    gevarenKaart: { backgroundColor: '#fff5f5', borderRadius: '12px', margin: '12px', padding: '16px', border: '1px solid #ffcccc' },
    gevarenKnop: { width: '100%', padding: '14px', backgroundColor: '#FF4B4B', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', marginTop: '8px' },
    toggle: (aan) => ({ width: '50px', height: '28px', borderRadius: '14px', backgroundColor: aan ? '#34C759' : '#ddd', position: 'relative', cursor: 'pointer', transition: 'background 0.3s', flexShrink: 0 }),
    toggleBol: (aan) => ({ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '2px', left: aan ? '24px' : '2px', transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }),
    berichtBox: { textAlign: 'center', padding: '10px', borderRadius: '8px', margin: '0 12px 12px', fontWeight: 'bold', backgroundColor: berichtType === 'success' ? '#e8f5e9' : '#ffebee', color: berichtType === 'success' ? '#34C759' : '#FF4B4B' },
  };

  return (
    <div style={styles.pagina}>
      <div style={styles.header}>
        <a href="/profiel" style={{ textDecoration: 'none', fontSize: '20px', color: '#333' }}>←</a>
        <div style={styles.headerTitel}>⚙️ Instellingen</div>
      </div>

      <div style={styles.tabs}>
        <div style={styles.tab(actievTab === 'profiel')} onClick={() => setActiefTab('profiel')}>👤 Profiel</div>
        <div style={styles.tab(actievTab === 'wachtwoord')} onClick={() => setActiefTab('wachtwoord')}>🔒 Wachtwoord</div>
        <div style={styles.tab(actievTab === 'notificaties')} onClick={() => setActiefTab('notificaties')}>🔔 Notificaties</div>
        <div style={styles.tab(actievTab === 'gevaren')} onClick={() => setActiefTab('gevaren')}>⚠️ Account</div>
      </div>

      {bericht && <div style={styles.berichtBox}>{bericht}</div>}

      {actievTab === 'profiel' && (
        <div style={styles.kaart}>
          <div style={styles.sectietitel}>Profielgegevens aanpassen</div>
          <label style={styles.label}>Naam</label>
          <input style={styles.input} value={nieuwNaam} onChange={e => setNieuwNaam(e.target.value)} placeholder="Jouw naam" autoComplete="off" />
          <label style={styles.label}>E-mail</label>
          <input style={styles.inputDisabled} value="E-mail aanpassen — binnenkort beschikbaar" disabled />
          <button style={styles.knop} onClick={slaProfielOp}>💾 Opslaan</button>
        </div>
      )}

      {actievTab === 'wachtwoord' && (
        <div style={styles.kaart}>
          <div style={styles.sectietitel}>Wachtwoord wijzigen</div>
          <label style={styles.label}>Huidig wachtwoord</label>
          <div style={styles.wachtwoordWrapper}>
            <input style={styles.wachtwoordInput} type={toonWachtwoord ? 'text' : 'password'} placeholder="Huidig wachtwoord" value={oudWachtwoord} onChange={e => setOudWachtwoord(e.target.value)} autoComplete="new-password" />
            <button style={styles.oogKnop} onClick={() => setToonWachtwoord(!toonWachtwoord)}>{toonWachtwoord ? '🙈' : '👁️'}</button>
          </div>
          <label style={styles.label}>Nieuw wachtwoord</label>
          <div style={styles.wachtwoordWrapper}>
            <input style={styles.wachtwoordInput} type={toonWachtwoord ? 'text' : 'password'} placeholder="Nieuw wachtwoord (min. 6 tekens)" value={nieuwWachtwoord} onChange={e => setNieuwWachtwoord(e.target.value)} autoComplete="new-password" />
          </div>
          <label style={styles.label}>Bevestig nieuw wachtwoord</label>
          <div style={styles.wachtwoordWrapper}>
            <input style={styles.wachtwoordInput} type={toonWachtwoord ? 'text' : 'password'} placeholder="Bevestig wachtwoord" value={bevestigWachtwoord} onChange={e => setBevestigWachtwoord(e.target.value)} autoComplete="new-password" />
          </div>
          <button style={styles.knop} onClick={wijzigWachtwoord}>🔒 Wachtwoord wijzigen</button>
        </div>
      )}

      {actievTab === 'notificaties' && (
        <div style={styles.kaart}>
          <div style={styles.sectietitel}>Notificaties beheren</div>
          {notificatieItems.map(({ key, label }) => (
            <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
              <span style={{ fontSize: '14px' }}>{label}</span>
              <div style={styles.toggle(notificaties[key])} onClick={() => toggleNotificatie(key)}>
                <div style={styles.toggleBol(notificaties[key])} />
              </div>
            </div>
          ))}
        </div>
      )}

      {actievTab === 'gevaren' && (
        <div style={styles.gevarenKaart}>
          <div style={styles.sectietitel}>⚠️ Gevarenzone</div>
          <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px', lineHeight: '1.6' }}>
            Let op: het verwijderen van je account kan niet ongedaan worden gemaakt.
          </p>
          <button style={styles.gevarenKnop} onClick={() => {
            if (window.confirm('Ben je 100% zeker dat je je account wil verwijderen?')) {
              localStorage.clear();
              window.location.href = '/';
            }
          }}>
            🗑️ Account permanent verwijderen
          </button>
        </div>
      )}

      <BottomNav actief="profiel" />
    </div>
  );
}

export default Instellingen;