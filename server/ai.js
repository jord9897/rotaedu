const SYSTEM_CORRECT = `Voce e um revisor pedagogico em portugues brasileiro.
Corrija apenas ortografia, acentuacao, concordancia e pontuacao.
Mantenha o sentido, o tom e o conteudo pedagogico originais.
Nao invente fatos. Nao reescreva o texto de forma literaria.
Responda SOMENTE em JSON valido, sem markdown, no formato:
{"corrected":"...","changes":[{"original":"...","corrected":"...","reason":"..."}]}`

const SYSTEM_BNCC = `Voce e um pedagogo especialista na BNCC (Base Nacional Comum Curricular do Brasil).
Com base nas consideracoes do professor, elabore um parecer descritivo individual do aluno.
Regras:
- Use linguagem profissional, acolhedora e objetiva.
- Relacione o desenvolvimento do aluno a competencias gerais e habilidades da BNCC adequadas a etapa/ano.
- Quando o professor informar codigos BNCC, utilize-os e explique o progresso em cada um.
- Se nao houver codigo, sugira 2 a 4 habilidades pertinentes a etapa e area.
- Inclua avancos, desafios e encaminhamentos.
- Nao invente diagnosticos clinicos.
- Escreva em portugues brasileiro.
Responda SOMENTE em JSON valido, sem markdown, no formato:
{"opinion":"...","skills":[{"code":"...","title":"...","comment":"..."}]}`

function getConfig() {
  const apiKey = process.env.USER_LLM_API_KEY || ''
  const baseUrl = (process.env.USER_LLM_BASE_URL || 'https://api.deepseek.com/v1').replace(/\/$/, '')
  const model = process.env.USER_LLM_MODEL || 'deepseek-chat'
  return { apiKey, baseUrl, model }
}

function extractJson(text) {
  const raw = String(text || '').trim()
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  const candidate = fenced ? fenced[1].trim() : raw
  const start = candidate.indexOf('{')
  const end = candidate.lastIndexOf('}')
  if (start >= 0 && end > start) {
    return JSON.parse(candidate.slice(start, end + 1))
  }
  return JSON.parse(candidate)
}

function fallbackCorrect(text) {
  const pairs = [
    ['nao ', 'não '], ['nao.', 'não.'], ['nao,', 'não,'],
    ['voce ', 'você '], ['voce,', 'você,'],
    ['tambem', 'também'], ['entao', 'então'],
    ['lingua', 'língua'], ['matematica', 'matemática'],
    ['avaliacao', 'avaliação'], ['participacao', 'participação'],
    ['atencao', 'atenção'], ['compreensao', 'compreensão'],
    ['producao', 'produção'], ['escrita', 'escrita'],
    ['relacao', 'relação'], ['crianca', 'criança'],
    ['avancos', 'avanços'], ['dificuldade', 'dificuldade']
  ]
  let corrected = text
  const changes = []
  for (const [original, next] of pairs) {
    if (corrected.toLowerCase().includes(original) && original !== next) {
      const re = new RegExp(original, 'gi')
      if (re.test(corrected)) {
        changes.push({ original, corrected: next, reason: 'Acentuacao / ortografia' })
        corrected = corrected.replace(new RegExp(original, 'gi'), next)
      }
    }
  }
  if (!/[.!?]$/.test(corrected.trim())) corrected = `${corrected.trim()}.`
  return { corrected, changes }
}

function fallbackBncc(payload) {
  const name = payload.studentName || 'O(a) estudante'
  const grade = payload.grade || 'sua etapa de ensino'
  const codes = payload.bnccCodes || []
  const skills = (codes.length ? codes : ['EF15LP03', 'EF15LP05']).map((code) => ({
    code,
    title: 'Habilidade da BNCC relacionada ao desenvolvimento observado',
    comment: `${name} demonstra progressos que dialogam com ${code}, com potencial de consolidacao mediante mediacao intencional.`
  }))
  const opinion = [
    `Parecer descritivo — ${name} (${grade}).`,
    payload.period ? `Periodo: ${payload.period}.` : '',
    payload.subject ? `Componente: ${payload.subject}.` : '',
    '',
    `Com base nas consideracoes do professor, observa-se que ${name} vem construindo aprendizagens de forma progressiva, com avancos na participacao, na comunicacao de ideias e na resolucao de situacoes propostas em sala.`,
    'Os registros indicam potencialidades que devem ser fortalecidas e desafios pontuais que pedem continuidade do acompanhamento pedagogico, sempre em perspectiva formativa.',
    '',
    'Em alinhamento a BNCC, o desenvolvimento do(a) estudante relaciona-se a competencias como conhecimento, comunicacao, pensamento cientifico/critico e responsabilidade e cidadania. As habilidades selecionadas orientam o proximo ciclo de planejamento, privilegiando situacoes significativas, feedback descritivo e propostas que articulem pratica, reflexao e registro.',
    '',
    'Encaminhamentos: manter combinados claros, oferecer apoios pontuais quando necessario, valorizar conquistas e envolver a familia no acompanhamento das aprendizagens.',
    '',
    'Consideracoes originais consideradas:',
    payload.considerations
  ].filter(Boolean).join('\n')
  return { opinion, skills }
}

async function chat(system, user) {
  const { apiKey, baseUrl, model } = getConfig()
  if (!apiKey) {
    return null
  }
  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.3,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  })
  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`Falha na IA (${response.status}): ${detail.slice(0, 280)}`)
  }
  const data = await response.json()
  const content = data?.choices?.[0]?.message?.content
  if (!content) throw new Error('A IA nao retornou conteudo')
  return extractJson(content)
}

export async function correctOrthography(text) {
  const data = await chat(SYSTEM_CORRECT, `Texto do professor:\n${text}`)
  if (!data) return fallbackCorrect(text)
  return {
    corrected: data.corrected || text,
    changes: Array.isArray(data.changes) ? data.changes : []
  }
}

export async function generateBnccOpinion(payload) {
  const codes = (payload.bnccCodes || []).join(', ')
  const user = [
    `Aluno: ${payload.studentName || 'nao informado'}`,
    `Etapa/ano: ${payload.grade || 'nao informado'}`,
    `Periodo: ${payload.period || 'nao informado'}`,
    `Componente: ${payload.subject || 'nao informado'}`,
    `Codigos BNCC informados: ${codes || 'nenhum'}`,
    '',
    'Consideracoes do professor:',
    payload.considerations
  ].join('\n')
  const data = await chat(SYSTEM_BNCC, user)
  if (!data) return fallbackBncc(payload)
  return {
    opinion: data.opinion || '',
    skills: Array.isArray(data.skills) ? data.skills : []
  }
}
