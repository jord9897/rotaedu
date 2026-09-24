import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { generateBnccOpinion, correctOrthography } from './ai.js'
import { getBnccCodes } from './bncc.js'

function loadEnvFile() {
  const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', '.env')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf8').split(/\r?\n/)
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq < 1) continue
    const key = trimmed.slice(0, eq).trim()
    const value = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '')
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, 'data')
const STUDENTS_FILE = path.join(DATA_DIR, 'students.json')
const REPORTS_FILE = path.join(DATA_DIR, 'reports.json')
const DIST_DIR = path.join(__dirname, '..', 'dist')

function ensureData() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })
  if (!fs.existsSync(STUDENTS_FILE)) fs.writeFileSync(STUDENTS_FILE, '[]')
  if (!fs.existsSync(REPORTS_FILE)) fs.writeFileSync(REPORTS_FILE, '[]')
}

function readJson(file) {
  ensureData()
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function writeJson(file, data) {
  ensureData()
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

function uid() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

const app = express()
app.use(cors())
app.use(express.json({ limit: '2mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, app: 'RotaEdu' })
})

app.get('/api/bncc', (req, res) => {
  const { etapa, area } = req.query
  res.json(getBnccCodes(etapa, area))
})

app.get('/api/students', (_req, res) => {
  res.json(readJson(STUDENTS_FILE))
})

app.get('/api/students/:id', (req, res) => {
  const student = readJson(STUDENTS_FILE).find((s) => s.id === req.params.id)
  if (!student) return res.status(404).json({ error: 'Aluno nao encontrado' })
  res.json(student)
})

app.post('/api/students', (req, res) => {
  const { name, grade, birthDate, guardian, notes } = req.body || {}
  if (!name || !String(name).trim()) {
    return res.status(400).json({ error: 'Nome do aluno e obrigatorio' })
  }
  const students = readJson(STUDENTS_FILE)
  const student = {
    id: uid(),
    name: String(name).trim(),
    grade: String(grade || '').trim(),
    birthDate: birthDate || '',
    guardian: String(guardian || '').trim(),
    notes: String(notes || '').trim(),
    createdAt: new Date().toISOString()
  }
  students.unshift(student)
  writeJson(STUDENTS_FILE, students)
  res.status(201).json(student)
})

app.put('/api/students/:id', (req, res) => {
  const students = readJson(STUDENTS_FILE)
  const index = students.findIndex((s) => s.id === req.params.id)
  if (index < 0) return res.status(404).json({ error: 'Aluno nao encontrado' })
  const { name, grade, birthDate, guardian, notes } = req.body || {}
  students[index] = {
    ...students[index],
    name: name != null ? String(name).trim() : students[index].name,
    grade: grade != null ? String(grade).trim() : students[index].grade,
    birthDate: birthDate != null ? birthDate : students[index].birthDate,
    guardian: guardian != null ? String(guardian).trim() : students[index].guardian,
    notes: notes != null ? String(notes).trim() : students[index].notes,
    updatedAt: new Date().toISOString()
  }
  writeJson(STUDENTS_FILE, students)
  res.json(students[index])
})

app.get('/api/reports', (req, res) => {
  const { studentId } = req.query
  let reports = readJson(REPORTS_FILE)
  if (studentId) reports = reports.filter((r) => r.studentId === studentId)
  res.json(reports)
})

app.get('/api/reports/:id', (req, res) => {
  const report = readJson(REPORTS_FILE).find((r) => r.id === req.params.id)
  if (!report) return res.status(404).json({ error: 'Relatorio nao encontrado' })
  res.json(report)
})

app.post('/api/reports', (req, res) => {
  const { studentId, period, subject, considerations, bnccCodes } = req.body || {}
  if (!studentId) return res.status(400).json({ error: 'Aluno e obrigatorio' })
  const students = readJson(STUDENTS_FILE)
  const student = students.find((s) => s.id === studentId)
  if (!student) return res.status(404).json({ error: 'Aluno nao encontrado' })
  const reports = readJson(REPORTS_FILE)
  const report = {
    id: uid(),
    studentId,
    studentName: student.name,
    grade: student.grade,
    period: String(period || '').trim(),
    subject: String(subject || '').trim(),
    considerations: String(considerations || ''),
    correctedText: '',
    bnccCodes: Array.isArray(bnccCodes) ? bnccCodes : [],
    bnccOpinion: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  reports.unshift(report)
  writeJson(REPORTS_FILE, reports)
  res.status(201).json(report)
})

app.put('/api/reports/:id', (req, res) => {
  const reports = readJson(REPORTS_FILE)
  const index = reports.findIndex((r) => r.id === req.params.id)
  if (index < 0) return res.status(404).json({ error: 'Relatorio nao encontrado' })
  const { period, subject, considerations, bnccCodes, correctedText, bnccOpinion } = req.body || {}
  reports[index] = {
    ...reports[index],
    period: period != null ? String(period).trim() : reports[index].period,
    subject: subject != null ? String(subject).trim() : reports[index].subject,
    considerations: considerations != null ? String(considerations) : reports[index].considerations,
    bnccCodes: Array.isArray(bnccCodes) ? bnccCodes : reports[index].bnccCodes,
    correctedText: correctedText != null ? String(correctedText) : reports[index].correctedText,
    bnccOpinion: bnccOpinion != null ? String(bnccOpinion) : reports[index].bnccOpinion,
    updatedAt: new Date().toISOString()
  }
  writeJson(REPORTS_FILE, reports)
  res.json(reports[index])
})

app.post('/api/ai/correct', async (req, res) => {
  const { text } = req.body || {}
  if (!text || !String(text).trim()) {
    return res.status(400).json({ error: 'Texto e obrigatorio' })
  }
  try {
    const result = await correctOrthography(String(text))
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message || 'Falha ao corrigir o texto' })
  }
})

app.post('/api/ai/bncc', async (req, res) => {
  const { considerations, studentName, grade, period, subject, bnccCodes } = req.body || {}
  if (!considerations || !String(considerations).trim()) {
    return res.status(400).json({ error: 'Consideracoes sao obrigatorias' })
  }
  try {
    const result = await generateBnccOpinion({
      considerations: String(considerations),
      studentName: studentName || '',
      grade: grade || '',
      period: period || '',
      subject: subject || '',
      bnccCodes: Array.isArray(bnccCodes) ? bnccCodes : []
    })
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message || 'Falha ao gerar parecer BNCC' })
  }
})

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next()
    res.sendFile(path.join(DIST_DIR, 'index.html'))
  })
}

const PORT = Number(process.env.PORT || 3001)
app.listen(PORT, '0.0.0.0', () => {
  ensureData()
  console.log(`RotaEdu API em http://localhost:${PORT}`)
})
