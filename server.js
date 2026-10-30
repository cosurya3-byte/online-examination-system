const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8086;
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'store.json');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const initial = {
  user: { id: 1, name: 'Student', email: 'student@example.com', role: 'Student' },
  exams: [{ id: 1, title: 'Programming Fundamentals Assessment', subject: 'Programming', duration: 5, questions: [
    { id: 1, question: 'Which keyword is used to declare a constant in JavaScript?', options: ['var', 'let', 'const', 'static'], answer: 2 },
    { id: 2, question: 'Which data structure follows FIFO?', options: ['Stack', 'Queue', 'Tree', 'Graph'], answer: 1 },
    { id: 3, question: 'Which language runs in the Java Virtual Machine?', options: ['Java', 'C', 'Python', 'HTML'], answer: 0 },
    { id: 4, question: 'What is the time complexity of binary search?', options: ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], answer: 2 },
    { id: 5, question: 'Which SQL command retrieves records?', options: ['GET', 'SELECT', 'FETCHALL', 'OPEN'], answer: 1 }
  ]}],
  subjects: [{ id: 1, name: 'Programming', description: 'Programming concepts, logic and problem solving', color: 'green' }, { id: 2, name: 'DBMS', description: 'Database design, SQL and transactions', color: 'purple' }, { id: 3, name: 'Networks', description: 'Computer networks and communication', color: 'orange' }],
  results: []
};
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
const read = () => JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
const write = data => fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'online-examination-system' }));
app.get('/api/dashboard', (req, res) => {
  const db = read();
  res.json({ user: db.user, availableExams: db.exams.length, practiceSubjects: db.subjects.length, examDuration: db.exams[0]?.duration || 0, subjects: db.subjects.map(s => s.name), recentResults: db.results.slice(-3).reverse() });
});
app.get('/api/profile', (req, res) => res.json(read().user));
app.put('/api/profile', (req, res) => {
  const db = read();
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ message: 'Name and email are required.' });
  db.user.name = String(name).trim(); db.user.email = String(email).trim(); write(db); res.json(db.user);
});
app.get('/api/subjects', (req, res) => res.json(read().subjects));
app.get('/api/exams', (req, res) => res.json(read().exams.map(({ id, title, subject, duration, questions }) => ({ id, title, subject, duration, questionCount: questions.length }))));
app.get('/api/exams/:id', (req, res) => {
  const exam = read().exams.find(e => e.id === Number(req.params.id));
  if (!exam) return res.status(404).json({ message: 'Exam not found.' });
  res.json({ ...exam, questions: exam.questions.map(({ answer, ...q }) => q) });
});
app.post('/api/exams/:id/submit', (req, res) => {
  const db = read();
  const exam = db.exams.find(e => e.id === Number(req.params.id));
  if (!exam) return res.status(404).json({ message: 'Exam not found.' });
  const answers = req.body.answers || {};
  const score = exam.questions.reduce((sum, q) => sum + (Number(answers[q.id]) === q.answer ? 1 : 0), 0);
  const result = { id: Date.now(), examTitle: exam.title, subject: exam.subject, score, total: exam.questions.length, percentage: Math.round(score / exam.questions.length * 100), date: new Date().toISOString() };
  db.results.push(result); write(db); res.json(result);
});
app.get('/api/results', (req, res) => res.json(read().results.slice().reverse()));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.listen(PORT, () => console.log(`Online Examination System running at http://localhost:${PORT}`));
