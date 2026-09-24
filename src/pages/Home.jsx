import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api.js'

export default function Home() {
  const [students, setStudents] = useState([])
  const [reports, setReports] = useState([])

  useEffect(() => {
    api.students().then(setStudents).catch(() => setStudents([]))
    api.reports().then(setReports).catch(() => setReports([]))
  }, [])

  return (
    <section className="page">
      <div className="hero">
        <p className="eyebrow">Painel do professor</p>
        <h1>Relatorios individuais com pareceres BNCC</h1>
        <p className="lead">
          Cadastre alunos, registre suas consideracoes e deixe a IA revisar a escrita
          e elaborar o parecer alinhado a Base Nacional Comum Curricular.
        </p>
        <div className="hero-actions">
          <Link className="btn primary" to="/alunos">Cadastrar aluno</Link>
          <Link className="btn" to="/relatorios/novo">Novo relatorio</Link>
        </div>
      </div>
      <div className="stats">
        <article>
          <span>Alunos</span>
          <strong>{students.length}</strong>
        </article>
        <article>
          <span>Relatorios</span>
          <strong>{reports.length}</strong>
        </article>
        <article>
          <span>Com parecer IA</span>
          <strong>{reports.filter((r) => r.bnccOpinion).length}</strong>
        </article>
      </div>
      <div className="grid two">
        <div className="card">
          <h2>Como usar</h2>
          <ol className="steps">
            <li>Cadastre o aluno com turma e dados basicos.</li>
            <li>Abra um relatorio individual e escreva suas consideracoes.</li>
            <li>Peca a correcao ortografica e o parecer BNCC com apoio da IA.</li>
            <li>Revise, ajuste e salve o documento final.</li>
          </ol>
        </div>
        <div className="card">
          <h2>Ultimos relatorios</h2>
          {reports.slice(0, 5).length === 0 && <p className="muted">Nenhum relatorio ainda.</p>}
          <ul className="list">
            {reports.slice(0, 5).map((r) => (
              <li key={r.id}>
                <Link to={`/relatorios/${r.id}`}>
                  <strong>{r.studentName}</strong>
                  <span>{r.period || 'Periodo nao informado'} · {r.subject || 'Geral'}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
