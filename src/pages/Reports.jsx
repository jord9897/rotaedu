import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

export default function Reports() {
  const [students, setStudents] = useState([])
  const [reports, setReports] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    api.students().then(setStudents).catch(() => setStudents([]))
    api.reports().then(setReports).catch(() => setReports([]))
  }, [])

  const filtered = useMemo(() => {
    if (!filter) return reports
    return reports.filter((r) => r.studentId === filter)
  }, [reports, filter])

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Aba de relatorios</p>
          <h1>Relatorios de alunos</h1>
        </div>
        <Link className="btn primary" to="/relatorios/novo">Novo relatorio</Link>
      </div>
      <div className="toolbar">
        <label>
          Filtrar por aluno
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="">Todos</option>
            {students.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="card">
        {filtered.length === 0 && <p className="muted">Nenhum relatorio encontrado.</p>}
        <ul className="report-list">
          {filtered.map((r) => (
            <li key={r.id}>
              <Link to={`/relatorios/${r.id}`}>
                <div>
                  <strong>{r.studentName}</strong>
                  <span>{r.grade || 'Turma nao informada'}</span>
                </div>
                <div className="meta">
                  <span>{r.period || 'Sem periodo'}</span>
                  <span>{r.subject || 'Geral'}</span>
                  <em>{r.bnccOpinion ? 'Parecer gerado' : 'Pendente de parecer'}</em>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
