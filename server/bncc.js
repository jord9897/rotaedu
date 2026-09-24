const BNCC = [
  {
    code: 'EI03EO01',
    etapa: 'Educacao Infantil',
    area: 'O eu, o outro e o nos',
    title: 'Demonstrar empatia pelos outros, percebendo que as pessoas tem diferentes sentimentos, necessidades e maneiras de pensar e agir.'
  },
  {
    code: 'EI03EO04',
    etapa: 'Educacao Infantil',
    area: 'O eu, o outro e o nos',
    title: 'Comunicar suas ideias e sentimentos a pessoas e grupos diversos.'
  },
  {
    code: 'EI03EF01',
    etapa: 'Educacao Infantil',
    area: 'Escuta, fala, pensamento e imaginacao',
    title: 'Expressar ideias, desejos e sentimentos sobre suas vivencias, por meio da linguagem oral e escrita (escrita espontanea).'
  },
  {
    code: 'EI03ET01',
    etapa: 'Educacao Infantil',
    area: 'Espacos, tempos, quantidades, relacoes e transformacoes',
    title: 'Estabelecer relacoes de comparacao entre objetos, observando suas propriedades.'
  },
  {
    code: 'EF15LP01',
    etapa: 'Ensino Fundamental I',
    area: 'Lingua Portuguesa',
    title: 'Identificar a funcao social de textos que circulam em campos da vida cotidiana.'
  },
  {
    code: 'EF15LP03',
    etapa: 'Ensino Fundamental I',
    area: 'Lingua Portuguesa',
    title: 'Localizar informacoes explicitas em textos.'
  },
  {
    code: 'EF15LP05',
    etapa: 'Ensino Fundamental I',
    area: 'Lingua Portuguesa',
    title: 'Planejar, produzir e revisar textos escritos considerando a situacao comunicativa.'
  },
  {
    code: 'EF01MA01',
    etapa: 'Ensino Fundamental I',
    area: 'Matematica',
    title: 'Utilizar numeros naturais como indicadores de quantidade ou de ordem em diferentes situacoes cotidianas.'
  },
  {
    code: 'EF02MA05',
    etapa: 'Ensino Fundamental I',
    area: 'Matematica',
    title: 'Construir fatos basicos da adicao e subtracao e utiliza-los no calculo mental ou escrito.'
  },
  {
    code: 'EF03MA06',
    etapa: 'Ensino Fundamental I',
    area: 'Matematica',
    title: 'Resolver e elaborar problemas de adicao e subtracao com os significados de juntar, acrescentar, separar, retirar, comparar e completar quantidades.'
  },
  {
    code: 'EF04MA03',
    etapa: 'Ensino Fundamental I',
    area: 'Matematica',
    title: 'Resolver e elaborar problemas com numeros naturais envolvendo adicao, subtracao, multiplicacao e divisao.'
  },
  {
    code: 'EF15AR01',
    etapa: 'Ensino Fundamental I',
    area: 'Arte',
    title: 'Identificar e apreciar formas distintas das artes visuais tradicionais e contemporaneas.'
  },
  {
    code: 'EF12EF01',
    etapa: 'Ensino Fundamental I',
    area: 'Educacao Fisica',
    title: 'Experimentar, fruir e recriar diferentes brincadeiras e jogos da cultura popular presentes no contexto comunitario e regional.'
  },
  {
    code: 'EF03CI01',
    etapa: 'Ensino Fundamental I',
    area: 'Ciencias',
    title: 'Produzir diferentes sons a partir da vibracao de variados objetos e identificar os elementos que produzem o som.'
  },
  {
    code: 'EF03GE01',
    etapa: 'Ensino Fundamental I',
    area: 'Geografia',
    title: 'Identificar e comparar aspectos culturais dos grupos sociais de seus lugares de vivencia.'
  },
  {
    code: 'EF04HI01',
    etapa: 'Ensino Fundamental I',
    area: 'Historia',
    title: 'Reconhecer a historia como resultado da acao do ser humano no tempo e no espaco.'
  },
  {
    code: 'EF67LP01',
    etapa: 'Ensino Fundamental II',
    area: 'Lingua Portuguesa',
    title: 'Analisar a funcao social de textos que circulam em campos da vida publica e da vida escolar.'
  },
  {
    code: 'EF69LP06',
    etapa: 'Ensino Fundamental II',
    area: 'Lingua Portuguesa',
    title: 'Produzir textos jornalisticos e argumentativos, considerando a situacao comunicativa.'
  },
  {
    code: 'EF06MA03',
    etapa: 'Ensino Fundamental II',
    area: 'Matematica',
    title: 'Resolver e elaborar problemas que envolvam o conceito de multiplos e divisores.'
  },
  {
    code: 'EF07MA12',
    etapa: 'Ensino Fundamental II',
    area: 'Matematica',
    title: 'Resolver e elaborar problemas que envolvam as operacoes com numeros racionais.'
  },
  {
    code: 'EF08MA06',
    etapa: 'Ensino Fundamental II',
    area: 'Matematica',
    title: 'Resolver e elaborar problemas que envolvam porcentagens, juros simples e composto.'
  },
  {
    code: 'EF06CI05',
    etapa: 'Ensino Fundamental II',
    area: 'Ciencias',
    title: 'Explicar a organizacao basica das celulas e seu papel como unidade da vida.'
  },
  {
    code: 'EF09CI03',
    etapa: 'Ensino Fundamental II',
    area: 'Ciencias',
    title: 'Identificar modelos que descrevem a estrutura da materia e reconhecer suas limitacoes.'
  },
  {
    code: 'EF69AR31',
    etapa: 'Ensino Fundamental II',
    area: 'Arte',
    title: 'Relacionar as praticas artisticas as diferentes dimensoes da vida social, cultural, politica, historica e economica.'
  },
  {
    code: 'EM13LGG103',
    etapa: 'Ensino Medio',
    area: 'Linguagens',
    title: 'Analisar o funcionamento das linguagens para produzir sentidos em diferentes contextos.'
  },
  {
    code: 'EM13MAT101',
    etapa: 'Ensino Medio',
    area: 'Matematica',
    title: 'Interpretar situacoes em diversos contextos, reconhecendo a Matematica como ciencia humana.'
  },
  {
    code: 'EM13CNT101',
    etapa: 'Ensino Medio',
    area: 'Ciencias da Natureza',
    title: 'Analisar fenomenos naturais e processos tecnologicos com base nas interacoes e relacoes entre materia e energia.'
  },
  {
    code: 'EM13CHS101',
    etapa: 'Ensino Medio',
    area: 'Ciencias Humanas',
    title: 'Identificar, analisar e discutir as circunstancias historicas, geograficas, politicas, economicas, sociais, ambientais e culturais.'
  }
]

export function getBnccCodes(etapa, area) {
  return BNCC.filter((item) => {
    const matchEtapa = !etapa || item.etapa === etapa
    const matchArea = !area || item.area === area
    return matchEtapa && matchArea
  })
}

export { BNCC }
