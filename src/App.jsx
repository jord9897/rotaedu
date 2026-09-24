import { NavLink, Route, Routes } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Students from './pages/Students.jsx'
import Reports from './pages/Reports.jsx'
import ReportEditor from './pages/ReportEditor.jsx'

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">RE</span>
          <div>
            <strong>RotaEdu</strong>
            <p>Acompanhamento pedagogico</p>
          </div>
        </div>
        <nav className="tabs">
          <NavLink to="/" end>Inicio</NavLink>
          <NavLink to="/alunos">Alunos</NavLink>
          <NavLink to="/relatorios">Relatorios</NavLink>
        </nav>
      </header>
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/alunos" element={<Students />} />
          <Route path="/relatorios" element={<Reports />} />
          <Route path="/relatorios/novo" element={<ReportEditor />} />
          <Route path="/relatorios/:id" element={<ReportEditor />} />
        </Routes>
      </main>
    </div>
  )
}
