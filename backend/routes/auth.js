const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

router.post('/register', async (req, res) => {
  const { naam, email, wachtwoord } = req.body;
  try {
    const hash = await bcrypt.hash(wachtwoord, 10);
    db.query(
      'INSERT INTO users (naam, email, wachtwoord) VALUES (?, ?, ?)',
      [naam, email, hash],
      (err, result) => {
        if (err) return res.status(400).json({ fout: 'Email bestaat al' });
        res.json({ bericht: 'Account aangemaakt!' });
      }
    );
  } catch (err) {
    res.status(500).json({ fout: 'Server fout' });
  }
});

router.post('/login', (req, res) => {
  const { email, wachtwoord } = req.body;
  db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ fout: 'Gebruiker niet gevonden' });
    const gebruiker = results[0];
    const geldig = await bcrypt.compare(wachtwoord, gebruiker.wachtwoord);
    if (!geldig) return res.status(400).json({ fout: 'Verkeerd wachtwoord' });
    const token = jwt.sign({ id: gebruiker.user_id, rol: gebruiker.rol }, process.env.JWT_SECRET);
    res.json({ token, naam: gebruiker.naam, rol: gebruiker.rol });
  });
});

module.exports = router;