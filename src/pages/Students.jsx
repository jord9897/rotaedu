import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

const empty = { name: '', grade: '', birthDate: '', guardian: '', notes: '' }

export default function Students() {
  const [students, setStudents] = useState([])
  const [form, setForm] = useState(empty)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  async function load() {
    setStudents(await api.students())
  }

  useEffect(() => {
    load().catch((e) => setError(e.message))
  }, [])

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function submit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) {
        await api.updateStudent(editing, form)
      } else {
        await api.createStudent(form)
      }
      setForm(empty)
      setEditing(null)
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  function startEdit(student) {
    setEditing(student.id)
    setForm({
      name: student.name,
      grade: student.grade,
      birthDate: student.birthDate,
      guardian: student.guardian,
      notes: student.notes
    })
  }

  return (
    <section className="page">
      <div className="page-head">
        <div>
          <p className="eyebrow">Cadastro</p>
          <h1>Alunos</h1>
        </div>
      </div>
      <div className="grid split">
        <form className="card form" onSubmit={submit}>
          <h2>{editing ? 'Editar aluno' : 'Novo aluno'}</h2>
          {error && <p className="alert">{error}</p>}
          <label>
            Nome completo
            <input value={form.name} onChange={(e) => update('name', e.target.value)} required />
          </label>
          <label>
            Turma / ano
            <input value={form.grade} onChange={(e) => update('grade', e.target.value)} placeholder="Ex.: 3o ano A" />
          </label>
          <label>
            Data de nascimento
            <input type="date" value={form.birthDate} onChange={(e) => update('birthDate', e.target.value)} />
          </label>
          <label>
            Responsavel
            <input value={form.guardian} onChange={(e) => update('guardian', e.target.value)} />
          </label>
          <label>
            Observacoes
            <textarea rows="3" value={form.notes} onChange={(e) => update('notes', e.target.value)} />
          </label>
          <div className="row">
            <button className="btn primary" type="submit" disabled={saving}>
              {saving ? 'Salvando...' : editing ? 'Atualizar' : 'Cadastrar'}
            </button>
            {editing && (
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setEditing(null)
                  setForm(empty)
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
        <div className="card">
          <h2>Lista ({students.length})</h2>
          {students.length === 0 && <p className="muted">Nenhum aluno cadastrado.</p>}
          <ul className="student-list">
            {students.map((s) => (
              <li key={s.id}>
                <div>
                  <strong>{s.name}</strong>
                  <span>{s.grade || 'Turma nao informada'}</span>
                </div>
                <div className="row">
                  <button className="link" type="button" onClick={() => startEdit(s)}>Editar</button>
                  <Link to={`/relatorios/novo?aluno=${s.id}`}>Novo relatorio</Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
