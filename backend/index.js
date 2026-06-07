const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rootpass',
  database: 'straatdieren'
});

db.connect((err) => {
  if (err) console.log('DB fout:', err);
  else console.log('Database verbonden!');
});

app.post('/api/auth/register', async (req, res) => {
  const { naam, email, wachtwoord, rol } = req.body;
  try {
    const hash = await bcrypt.hash(wachtwoord, 10);
    const rolToSave = rol === 'dierenarts' ? 'dierenarts_pending' : (rol || 'gebruiker');
    db.query('INSERT INTO users (naam, email, wachtwoord, rol) VALUES (?, ?, ?, ?)', [naam, email, hash, rolToSave], (err) => {
      if (err) return res.status(400).json({ fout: 'Email bestaat al' });
      res.json({ bericht: 'Account aangemaakt!' });
    });
  } catch (err) {
    res.status(500).json({ fout: 'Server fout' });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { email, wachtwoord } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ fout: 'Gebruiker niet gevonden' });
    const gebruiker = results[0];
    const geldig = await bcrypt.compare(wachtwoord, gebruiker.wachtwoord);
    if (!geldig) return res.status(400).json({ fout: 'Verkeerd wachtwoord' });
    const token = jwt.sign({ id: gebruiker.user_id, rol: gebruiker.rol }, 'geheimesleutel123');
    res.json({ token, naam: gebruiker.naam, rol: gebruiker.rol });
  });
});

app.post('/api/meldingen', async (req, res) => {
  const { animal_type, description, latitude, longitude, image_url, urgentie } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ fout: 'Niet ingelogd' });
  try {
    const decoded = jwt.verify(token, 'geheimesleutel123');
    const user_id = decoded.id;
    db.query(
      'INSERT INTO animal_reports (user_id, animal_type, description, latitude, longitude, image_url, urgentie) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user_id, animal_type, description, latitude || null, longitude || null, image_url || null, urgentie || 'laag'],
      (err, result) => {
        if (err) {
          console.log('DB ERROR:', err);
          return res.status(500).json({ fout: 'Database fout: ' + err.message });
        }
        res.json({ bericht: 'Melding opgeslagen!', id: result.insertId });
      }
    );
  } catch (err) {
    res.status(401).json({ fout: 'Ongeldige token' });
  }
});

app.get('/api/meldingen', (req, res) => {
  db.query('SELECT * FROM animal_reports ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ fout: 'Database fout' });
    res.json(results);
  });
});

app.get('/api/meldingen/:id', (req, res) => {
  db.query('SELECT * FROM animal_reports WHERE report_id = ?', [req.params.id], (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ fout: 'Niet gevonden' });
    res.json(results[0]);
  });
});

app.put('/api/meldingen/:id/status', (req, res) => {
  const { status } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ fout: 'Niet ingelogd' });
  try {
    const decoded = jwt.verify(token, 'geheimesleutel123');
    if (decoded.rol !== 'vrijwilliger' && decoded.rol !== 'admin' && decoded.rol !== 'dierenarts') {
      return res.status(403).json({ fout: 'Geen toegang' });
    }
    db.query('UPDATE animal_reports SET status = ? WHERE report_id = ?', [status, req.params.id], (err) => {
      if (err) return res.status(500).json({ fout: 'Database fout' });
      res.json({ bericht: 'Status aangepast!' });
    });
  } catch (err) {
    res.status(401).json({ fout: 'Ongeldige token' });
  }
});

app.put('/api/meldingen/:id/medisch', (req, res) => {
  const { medische_notitie, medische_urgentie } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ fout: 'Niet ingelogd' });
  try {
    const decoded = jwt.verify(token, 'geheimesleutel123');
    if (decoded.rol !== 'dierenarts' && decoded.rol !== 'admin') {
      return res.status(403).json({ fout: 'Geen toegang' });
    }
    db.query('UPDATE animal_reports SET medische_notitie = ?, medische_urgentie = ? WHERE report_id = ?',
      [medische_notitie, medische_urgentie, req.params.id], (err) => {
        if (err) return res.status(500).json({ fout: 'Database fout' });
        res.json({ bericht: 'Medische notitie opgeslagen!' });
      });
  } catch (err) {
    res.status(401).json({ fout: 'Ongeldige token' });
  }
});

app.put('/api/meldingen/:id/verhaal', (req, res) => {
  const { verhaal } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ fout: 'Niet ingelogd' });
  try {
    const decoded = jwt.verify(token, 'geheimesleutel123');
    if (decoded.rol !== 'vrijwilliger' && decoded.rol !== 'admin' && decoded.rol !== 'dierenarts') {
      return res.status(403).json({ fout: 'Geen toegang' });
    }
    db.query('UPDATE animal_reports SET verhaal = ? WHERE report_id = ?', [verhaal, req.params.id], (err) => {
      if (err) return res.status(500).json({ fout: 'Database fout' });
      res.json({ bericht: 'Verhaal opgeslagen!' });
    });
  } catch (err) {
    res.status(401).json({ fout: 'Ongeldige token' });
  }
});

app.post('/api/meldingen/:id/like', (req, res) => {
  db.query('UPDATE animal_reports SET likes = likes + 1 WHERE report_id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ fout: 'Database fout' });
    res.json({ bericht: 'Like toegevoegd!' });
  });
});

app.post('/api/hulp', (req, res) => {
  const { report_id, action_type, note } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ fout: 'Niet ingelogd' });
  try {
    const decoded = jwt.verify(token, 'geheimesleutel123');
    const user_id = decoded.id;
    db.query('INSERT INTO help_actions (report_id, user_id, action_type, note) VALUES (?, ?, ?, ?)',
      [report_id, user_id, action_type, note], (err) => {
        if (err) return res.status(500).json({ fout: 'Database fout' });
        res.json({ bericht: 'Hulp aangeboden!' });
      });
  } catch (err) {
    res.status(401).json({ fout: 'Ongeldige token' });
  }
});

app.get('/api/profiel/stats', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ fout: 'Niet ingelogd' });
  try {
    const decoded = jwt.verify(token, 'geheimesleutel123');
    const user_id = decoded.id;
    db.query('SELECT COUNT(*) as meldingen FROM animal_reports WHERE user_id = ?', [user_id], (err, r1) => {
      db.query('SELECT COUNT(*) as geholpen FROM animal_reports WHERE user_id = ? AND status = "geholpen"', [user_id], (err, r2) => {
        db.query('SELECT COUNT(*) as hulpacties FROM help_actions WHERE user_id = ?', [user_id], (err, r3) => {
          res.json({ meldingen: r1[0].meldingen, geholpen: r2[0].geholpen, hulpacties: r3[0].hulpacties });
        });
      });
    });
  } catch (err) {
    res.status(401).json({ fout: 'Ongeldige token' });
  }
});

app.get('/api/mijn-meldingen', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ fout: 'Niet ingelogd' });
  try {
    const decoded = jwt.verify(token, 'geheimesleutel123');
    const user_id = decoded.id;
    db.query('SELECT * FROM animal_reports WHERE user_id = ? ORDER BY created_at DESC', [user_id], (err, results) => {
      if (err) return res.status(500).json({ fout: 'Database fout' });
      res.json(results);
    });
  } catch (err) {
    res.status(401).json({ fout: 'Ongeldige token' });
  }
});

app.get('/api/mijn-hulpacties', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ fout: 'Niet ingelogd' });
  try {
    const decoded = jwt.verify(token, 'geheimesleutel123');
    const user_id = decoded.id;
    db.query('SELECT * FROM help_actions WHERE user_id = ? ORDER BY created_at DESC', [user_id], (err, results) => {
      if (err) return res.status(500).json({ fout: 'Database fout' });
      res.json(results);
    });
  } catch (err) {
    res.status(401).json({ fout: 'Ongeldige token' });
  }
});

app.get('/api/admin/gebruikers', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ fout: 'Niet ingelogd' });
  try {
    const decoded = jwt.verify(token, 'geheimesleutel123');
    if (decoded.rol !== 'admin') return res.status(403).json({ fout: 'Geen toegang' });
    db.query('SELECT user_id, naam, email, rol, created_at FROM users ORDER BY created_at DESC', (err, results) => {
      if (err) return res.status(500).json({ fout: 'Database fout' });
      res.json(results);
    });
  } catch (err) {
    res.status(401).json({ fout: 'Ongeldige token' });
  }
});

app.put('/api/admin/gebruiker/:id/rol', (req, res) => {
  const { rol } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ fout: 'Niet ingelogd' });
  try {
    const decoded = jwt.verify(token, 'geheimesleutel123');
    if (decoded.rol !== 'admin') return res.status(403).json({ fout: 'Geen toegang' });
    db.query('UPDATE users SET rol = ? WHERE user_id = ?', [rol, req.params.id], (err) => {
      if (err) return res.status(500).json({ fout: 'Database fout' });
      res.json({ bericht: 'Rol aangepast!' });
    });
  } catch (err) {
    res.status(401).json({ fout: 'Ongeldige token' });
  }
});

app.delete('/api/admin/melding/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ fout: 'Niet ingelogd' });
  try {
    const decoded = jwt.verify(token, 'geheimesleutel123');
    if (decoded.rol !== 'admin') return res.status(403).json({ fout: 'Geen toegang' });
    db.query('DELETE FROM animal_reports WHERE report_id = ?', [req.params.id], (err) => {
      if (err) return res.status(500).json({ fout: 'Database fout' });
      res.json({ bericht: 'Melding verwijderd!' });
    });
  } catch (err) {
    res.status(401).json({ fout: 'Ongeldige token' });
  }
});

app.get('/api/admin/stats', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ fout: 'Niet ingelogd' });
  try {
    const decoded = jwt.verify(token, 'geheimesleutel123');
    if (decoded.rol !== 'admin') return res.status(403).json({ fout: 'Geen toegang' });
    db.query('SELECT COUNT(*) as totaal FROM animal_reports', (err, r1) => {
      db.query('SELECT COUNT(*) as geholpen FROM animal_reports WHERE status = "geholpen"', (err, r2) => {
        db.query('SELECT COUNT(*) as nieuw FROM animal_reports WHERE status = "nieuw"', (err, r3) => {
          db.query('SELECT COUNT(*) as gebruikers FROM users', (err, r4) => {
            db.query('SELECT COUNT(*) as hulpacties FROM help_actions', (err, r5) => {
              res.json({
                totaal: r1[0].totaal,
                geholpen: r2[0].geholpen,
                nieuw: r3[0].nieuw,
                gebruikers: r4[0].gebruikers,
                hulpacties: r5[0].hulpacties
              });
            });
          });
        });
      });
    });
  } catch (err) {
    res.status(401).json({ fout: 'Ongeldige token' });
  }
});

app.listen(5000, () => console.log('Server draait op poort 5000'));