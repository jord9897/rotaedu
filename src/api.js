async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(data.error || 'Falha na requisicao')
  }
  return data
}

export const api = {
  students: () => request('/api/students'),
  student: (id) => request(`/api/students/${id}`),
  createStudent: (body) => request('/api/students', { method: 'POST', body: JSON.stringify(body) }),
  updateStudent: (id, body) => request(`/api/students/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  reports: (studentId) => request(studentId ? `/api/reports?studentId=${studentId}` : '/api/reports'),
  report: (id) => request(`/api/reports/${id}`),
  createReport: (body) => request('/api/reports', { method: 'POST', body: JSON.stringify(body) }),
  updateReport: (id, body) => request(`/api/reports/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  bncc: () => request('/api/bncc'),
  correct: (text) => request('/api/ai/correct', { method: 'POST', body: JSON.stringify({ text }) }),
  bnccOpinion: (body) => request('/api/ai/bncc', { method: 'POST', body: JSON.stringify(body) })
}
