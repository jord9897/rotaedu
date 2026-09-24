import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { api } from '../api.js'

const empty = {
  studentId: '',
  period: '',
  subject: '',
  considerations: '',
  bnccCodes: [],
  correctedText: '',
  bnccOpinion: ''
}

export default function ReportEditor() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [students, setStudents] = useState([])
  const [bncc, setBncc] = useState([])
  const [form, setForm] = useState(empty)
  const [skills, setSkills] = useState([])
  const [changes, setChanges] = useState([])
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)
  const [correcting, setCorrecting] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [reportId, setReportId] = useState(id || '')

  useEffect(() => {
    api.students().then((list) => {
      setStudents(list)
      const preset = searchParams.get('aluno')
      if (!id && preset) setForm((prev) => ({ ...prev, studentId: preset }))
    }).catch((e) => setError(e.message))
    api.bncc().then(setBncc).catch(() => setBncc([]))
  }, [id, searchParams])

  useEffect(() => {
    if (!id) return
    api.report(id).then((report) => {
      setReportId(report.id)
      setForm({
        studentId: report.studentId,
        period: report.period,
        subject: report.subject,
        considerations: report.considerations,
        bnccCodes: report.bnccCodes || [],
        correctedText: report.correctedText || '',
        bnccOpinion: report.bnccOpinion || ''
      })
    }).catch((e) => setError(e.message))
  }, [id])

  const student = useMemo(
    () => students.find((s) => s.id === form.studentId),
    [students, form.studentId]
  )

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleCode(code) {
    setForm((prev) => {
      const exists = prev.bnccCodes.includes(code)
      return {
        ...prev,
        bnccCodes: exists ? prev.bnccCodes.filter((c) => c !== code) : [...prev.bnccCodes, code]
      }
    })
  }

  async function persist(extra = {}) {
    const payload = { ...form, ...extra }
    if (!payload.studentId) throw new Error('Selecione um aluno')
    if (reportId) {
      const saved = await api.updateReport(reportId, payload)
      return saved
    }
    const created = await api.createReport(payload)
    setReportId(created.id)
    navigate(`/relatorios/${created.id}`, { replace: true })
    return created
  }

  async function save(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      await persist()
      setStatus('Relatorio salvo.')
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function runCorrection() {
    if (!form.considerations.trim()) {
      setError('Escreva suas consideracoes antes de corrigir.')
      return
    }
    setCorrecting(true)
    setError('')
    setStatus('')
    try {
      const result = await api.correct(form.considerations)
      const next = { ...form, correctedText: result.corrected }
      setForm(next)
      setChanges(result.changes || [])
      await persist({ correctedText: result.corrected })
      setStatus('Correcao ortografica gerada. Revise o texto antes de usar.')
    } catch (e) {
      setError(e.message)
    } finally {
      setCorrecting(false)
    }
  }

  async function runBncc() {
    const source = form.correctedText.trim() || form.considerations.trim()
    if (!source) {
      setError('Escreva suas consideracoes antes de gerar o parecer.')
      return
    }
    setGenerating(true)
    setError('')
    setStatus('')
    try {
      const result = await api.bnccOpinion({
        considerations: source,
        studentName: student?.name || '',
        grade: student?.grade || '',
        period: form.period,
        subject: form.subject,
        bnccCodes: form.bnccCodes
      })
      const next = { ...form, bnccOpinion: result.opinion }
      setForm(next)
      setSkills(result.skills || [])
      await persist({ bnccOpinion: result.opinion })
      setStatus('Parecer BNCC gerado. Ajuste o texto se necessario.')
    } catch (e) {
      setError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  function applyCorrected() {
    update('considerations', form.correctedText)
    setStatus('Texto corrigido aplicado nas consideracoes.')
  }

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Relatorio individual</p>
          <h1>{student?.name || 'Novo relatorio'}</h1>
        </div>
        <Link className="btn" to="/relatorios">Voltar</Link>
      </div>
      <form className="grid editor" onSubmit={save}>
        <div className="card form">
          <h2>Dados do relatorio</h2>
          {error && <p className="alert">{error}</p>}
          {status && <p className="ok">{status}</p>}
          <label>
            Aluno
            <select value={form.studentId} onChange={(e) => update('studentId', e.target.value)} required>
              <option value="">Selecione</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>{s.name} {s.grade ? `· ${s.grade}` : ''}</option>
              ))}
            </select>
          </label>
          <div className="row-fields">
            <label>
              Periodo
              <input value={form.period} onChange={(e) => update('period', e.target.value)} placeholder="1o bimestre / 2026" />
            </label>
            <label>
              Componente
              <input value={form.subject} onChange={(e) => update('subject', e.target.value)} placeholder="Lingua Portuguesa" />
            </label>
          </div>
          <label>
            Minhas consideracoes
            <textarea
              rows="10"
              value={form.considerations}
              onChange={(e) => update('considerations', e.target.value)}
              placeholder="Descreva avancos, participacao, dificuldades e encaminhamentos observados..."
            />
          </label>
          <div className="row wrap">
            <button className="btn" type="button" onClick={runCorrection} disabled={correcting}>
              {correcting ? 'Corrigindo...' : 'Corrigir ortografia com IA'}
            </button>
            <button className="btn primary" type="button" onClick={runBncc} disabled={generating}>
              {generating ? 'Gerando parecer...' : 'Gerar parecer BNCC'}
            </button>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar relatorio'}
            </button>
          </div>
        </div>
        <aside className="stack">
          <div className="card">
            <h2>Habilidades BNCC</h2>
            <p className="muted">Marque as habilidades observadas. A IA usa esses codigos no parecer.</p>
            <div className="bncc-list">
              {bncc.map((item) => (
                <label key={item.code} className={form.bnccCodes.includes(item.code) ? 'chip on' : 'chip'}>
                  <input
                    type="checkbox"
                    checked={form.bnccCodes.includes(item.code)}
                    onChange={() => toggleCode(item.code)}
                  />
                  <span>
                    <strong>{item.code}</strong>
                    <em>{item.area}</em>
                    {item.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>
        <div className="card">
          <div className="card-head">
            <h2>Texto revisado</h2>
            {form.correctedText && (
              <button className="link" type="button" onClick={applyCorrected}>Usar nas consideracoes</button>
            )}
          </div>
          <textarea
            rows="8"
            value={form.correctedText}
            onChange={(e) => update('correctedText', e.target.value)}
            placeholder="A correcao ortografica aparece aqui."
          />
          {changes.length > 0 && (
            <ul className="changes">
              {changes.map((c, i) => (
                <li key={i}>
                  <s>{c.original}</s> → <b>{c.corrected}</b>
                  {c.reason ? <span> ({c.reason})</span> : null}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="card">
          <h2>Parecer BNCC</h2>
          <textarea
            rows="10"
            value={form.bnccOpinion}
            onChange={(e) => update('bnccOpinion', e.target.value)}
            placeholder="O parecer descritivo alinhado a BNCC sera gerado aqui."
          />
          {skills.length > 0 && (
            <ul className="skills">
              {skills.map((s, i) => (
                <li key={i}>
                  <strong>{s.code}</strong> {s.title}
                  <p>{s.comment}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </form>
    </section>
  )
}
