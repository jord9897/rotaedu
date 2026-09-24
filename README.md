# RotaEdu

Aplicativo de acompanhamento pedagogico com aba de relatorios individuais de alunos.

## Funcionalidades

- Cadastro de alunos
- Relatorio individual por aluno
- Area para consideracoes do professor
- Correcao ortografica com IA
- Parecer descritivo alinhado a BNCC

## Como executar

```bash
# Instalar dependencias
npm install

# Configurar a chave da IA (obrigatorio para correcao e parecer)
cp .env.example .env
```

Informe no `.env`:

```
USER_LLM_API_KEY=sua-chave
USER_LLM_BASE_URL=https://api.deepseek.com/v1
USER_LLM_MODEL=deepseek-chat
```

```bash
# Iniciar backend e frontend
bash start.sh
```

- Frontend: `http://localhost:5173`
- API: `http://localhost:3001`

Os dados de alunos e relatorios sao salvos em `server/data/`.
