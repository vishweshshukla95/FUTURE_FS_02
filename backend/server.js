const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./db');

dotenv.config();

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// GET all leads
app.get('/leads', (req, res) => {
  db.query('SELECT * FROM leads ORDER BY created_at DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET single lead
app.get('/leads/:id', (req, res) => {
  db.query('SELECT * FROM leads WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Lead not found' });
    res.json(results[0]);
  });
});

// POST create lead
app.post('/leads', (req, res) => {
  const { name, email, phone, source, status, notes } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const sql = 'INSERT INTO leads (name, email, phone, source, status, notes) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, email, phone, source, status || 'New', notes], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id: result.insertId, message: 'Lead created successfully' });
  });
});

// PUT update lead
app.put('/leads/:id', (req, res) => {
  const { name, email, phone, source, status, notes } = req.body;
  const sql = 'UPDATE leads SET name=?, email=?, phone=?, source=?, status=?, notes=? WHERE id=?';
  db.query(sql, [name, email, phone, source, status, notes, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Lead updated successfully' });
  });
});

// DELETE lead
app.delete('/leads/:id', (req, res) => {
  db.query('DELETE FROM leads WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Lead deleted successfully' });
  });
});

// GET stats
app.get('/stats', (req, res) => {
  const sql = `SELECT 
    COUNT(*) as total,
    SUM(CASE WHEN status='New' THEN 1 ELSE 0 END) as new_leads,
    SUM(CASE WHEN status='Contacted' THEN 1 ELSE 0 END) as contacted,
    SUM(CASE WHEN status='Converted' THEN 1 ELSE 0 END) as converted,
    SUM(CASE WHEN status='Lost' THEN 1 ELSE 0 END) as lost
    FROM leads`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));