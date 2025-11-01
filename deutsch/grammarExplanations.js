// grammarExplanations.js - Explicações gramaticais em português

window.grammarExplanations = {
    'W-Fragen': {
        title: 'W-Fragen (Perguntas com W)',
        content: `
**O que são:** Perguntas abertas que pedem informação (não podem ser respondidas com "sim" ou "não"). Em alemão, geralmente começam com "W".

**A Fórmula:** 
W-Wort (Posição 1) + Verbo Conjugado (Posição 2) + Resto

**Principais Palavras:**
• **Wer?** (Quem?) - Nominativo
• **Was?** (O quê?) - Nominativo/Acusativo
• **Wo?** (Onde?) - Localização
• **Woher?** (De onde?) - Origem
• **Wohin?** (Para onde?) - Destino
• **Wie?** (Como?/Qual?) - Usado para "Wie heißt du?", "Wie alt?", "Wie geht's?"
• **Wann?** (Quando?)
• **Warum?** (Por quê?)

**Exemplos:**
• Wie heißt du? (Como você se chama?)
• Wo wohnst du? (Onde você mora?)
• Woher kommst du? (De onde você vem?)`
    },

    'Personalpronomen': {
        title: 'Personalpronomen (Pronomes Pessoais)',
        content: `
**O que são:** Palavras que substituem os substantivos (eu, você, ele, ela, nós...).

**A Regra:** Em alemão, "er" (ele) substitui substantivos masculinos (der), "sie" (ela) substitui femininos (die), e "es" (neutro) substitui neutros (das).

**Singular:**
• **ich** (eu)
• **du** (você - informal)
• **er** (ele / "it" masculino)
• **sie** (ela / "it" feminino)
• **es** (neutro / "it" neutro)

**Plural:**
• **wir** (nós)
• **ihr** (vocês - informal)
• **sie** (eles/elas)
• **Sie** (você/vocês - formal, sempre com maiúscula)

**Exemplos:**
• Das ist Maria. Sie kommt aus Spanien.
• Das ist ein Tisch. Er ist neu.`
    },

    'Verbkonjugation': {
        title: 'Verbkonjugation (Conjugação de Verbos)',
        content: `
**O que é:** A mudança na terminação do verbo para concordar com o pronome (o sujeito).

**A Fórmula (Regra Geral):** 
Remove-se o "-en" do infinitivo (ex: lernen) e adiciona-se:
• ich + **-e** (ich lerne)
• du + **-st** (du lernst)
• er/sie/es + **-t** (er lernt)
• wir + **-en** (wir lernen)
• ihr + **-t** (ihr lernt)
• sie/Sie + **-en** (sie lernen)

**Exceções:** Os verbos "sein" (ser/estar) e "haben" (ter) são totalmente irregulares.

**Exemplos:**
• Ich lerne Deutsch. (Eu aprendo alemão)
• Du wohnst in Berlin. (Você mora em Berlim)
• Wir machen eine Pause. (Nós fazemos uma pausa)`
    },

    'sein-heißen': {
        title: 'Verbos sein e heißen',
        content: `
**sein (ser/estar):**
• ich bin
• du bist
• er/sie/es ist
• wir sind
• ihr seid
• sie/Sie sind

**heißen (chamar-se):**
• ich heiße
• du heißt
• er/sie/es heißt
• wir heißen
• ihr heißt
• sie/Sie heißen

**Exemplos:**
• Ich bin Student. (Eu sou estudante)
• Wie heißt du? (Como você se chama?)
• Er ist mein Bruder. (Ele é meu irmão)`
    },

    'haben': {
        title: 'Verbo haben (ter)',
        content: `
**Conjugação:**
• ich habe
• du hast
• er/sie/es hat
• wir haben
• ihr habt
• sie/Sie haben

**Uso:** Indica posse ou características.

**Exemplos:**
• Ich habe eine Frage. (Eu tenho uma pergunta)
• Du hast ein schönes Auto. (Você tem um carro bonito)
• Wir haben Zeit. (Nós temos tempo)`
    },

    'Negation-nicht': {
        title: 'Negação com nicht',
        content: `
**O que é:** O "não" em alemão. Usado para negar verbos, adjetivos, advérbios ou a frase inteira.

**Regra:** "nicht" NUNCA nega um substantivo com artigo (para isso, use "kein").

**Posição:**
1. Para negar a frase inteira, "nicht" vai o mais para o final possível
2. MAS vem ANTES de adjetivos: "Das ist nicht gut"
3. Na Satzklammer (Modal ou Perfekt), vem ANTES do verbo no final: "Ich kann nicht schlafen" / "Ich habe nicht geschlafen"

**Exemplos:**
• Ich wohne nicht in Hamburg.
• Das ist nicht mein Bruder.
• Wir verstehen die Frage nicht.`
    },

    'Negativartikel': {
        title: 'Artigo Negativo kein',
        content: `
**O que é:** O "não" usado para negar substantivos. Pense nele como "nenhum/a".

**Fórmula:** É o oposto de "ein" (um/uma). Se você pode dizer "ein" na afirmativa, usa "kein" na negativa.

**Declinação:**
• Masculino: kein (Nom), keinen (Akk)
• Feminino: keine (Nom), keine (Akk)
• Neutro: kein (Nom), kein (Akk)
• Plural: keine

**Exemplos:**
• Das ist kein Tisch. (Isso não é uma mesa)
• Ich habe keine Zeit. (Eu não tenho tempo)
• Ich habe keinen Computer. (Eu não tenho computador)`
    },

    'Berufe': {
        title: 'Berufe (Profissões) e Sufixo -in',
        content: `
**Formação Feminina:** Adiciona-se "-in" à forma masculina. Se a palavra tiver a, o, u, geralmente recebe Umlaut (ä, ö, ü).

**Exemplos:**
• der Lehrer → die Lehrerin (professor/a)
• der Arzt → die Ärztin (médico/a)
• der Programmierer → die Programmiererin
• der Verkäufer → die Verkäuferin

**Profissões Comuns:**
• der/die Student/in - estudante
• der/die Journalist/in - jornalista
• der/die Ingenieur/in - engenheiro/a`
    },

    'Vokalwechsel': {
        title: 'Verbos com Troca de Vogal',
        content: `
**O que são:** Verbos "fortes" (irregulares) que mudam a vogal no Presente.

**Regra:** A troca SÓ acontece com "du" e "er/sie/es". As formas do plural (wir, ihr, sie) são normais.

**Padrões Comuns:**
• **e → i:** sprechen → du sprichst, er spricht
• **e → ie:** lesen → du liest, er liest
• **a → ä:** fahren → du fährst, er fährt
• **a → ä:** schlafen → du schläfst, er schläft

**Exemplos Importantes:**
• essen (comer) → du isst, er isst
• sehen (ver) → du siehst, er sieht
• treffen (encontrar) → du triffst, er trifft`
    },

    'Entscheidungsfragen': {
        title: 'Entscheidungsfragen (Perguntas Sim/Não)',
        content: `
**O que são:** Perguntas que podem ser respondidas com "Ja" (Sim) ou "Nein" (Não).

**Fórmula:** O verbo conjugado vai para a Posição 1.

**Estrutura:**
• Afirmação: Du kommst aus Brasilien. (Verbo na Posição 2)
• Pergunta: Kommst du aus Brasilien? (Verbo na Posição 1)

**Exemplos:**
• Ist er Lehrer? (Ele é professor?)
• Lernt ihr zusammen? (Vocês aprendem juntos?)
• Heißt sie Anna? (Ela se chama Anna?)`
    },

    'Possessivartikel': {
        title: 'Possessivartikel (Artigos Possessivos)',
        content: `
**O que são:** Indicam posse: mein (meu), dein (seu).

**Regra:** Declinam-se exatamente como "ein" (ou "kein").

**Nominativo:**
• (m) Das ist mein Vater
• (f) Das ist meine Mutter
• (n) Das ist mein Buch

**Acusativo:**
• (m) Ich sehe meinen Vater (APENAS O MASCULINO MUDA!)
• (f) Ich sehe meine Mutter
• (n) Ich sehe mein Buch

**Lista Completa:**
• mein/meine (meu/minha)
• dein/deine (seu/sua - informal)
• sein/seine (dele)
• ihr/ihre (dela)
• unser/unsere (nosso/nossa)
• euer/eure (de vocês)
• ihr/ihre (deles/delas)
• Ihr/Ihre (seu/sua - formal)`
    },

    'Artikel': {
        title: 'Artigos Definidos e Indefinidos',
        content: `
**Artigos Definidos (o, a, os, as):**
• **Nominativo:** der (m), die (f), das (n), die (pl)
• **Acusativo:** den (m), die (f), das (n), die (pl)

**Artigos Indefinidos (um, uma):**
• **Nominativo:** ein (m), eine (f), ein (n)
• **Acusativo:** einen (m), eine (f), ein (n)

**REGRA DE OURO:** Aprenda CADA substantivo com seu artigo!

**Exemplos:**
• Der Stuhl ist alt. (Nominativo)
• Ich kaufe den Stuhl. (Acusativo - masculino muda!)
• Die Lampe ist neu. (Nominativo)
• Ich kaufe die Lampe. (Acusativo - feminino não muda)`
    },

    'Plural': {
        title: 'Plural (Substantivos no Plural)',
        content: `
**O que é:** A formação do plural em alemão tem várias terminações.

**Terminações Comuns:**
• **-n/-en:** die Frau → die Frauen
• **-e:** der Tisch → die Tische
• **-er:** das Buch → die Bücher (com Umlaut)
• **-s:** das Auto → die Autos
• **Sem mudança:** der Lehrer → die Lehrer

**Estratégia:** Sempre aprenda o substantivo com artigo E plural:
• der Stuhl, die Stühle
• die Lampe, die Lampen
• das Kind, die Kinder

**NÃO HÁ REGRA LÓGICA FÁCIL - é preciso decorar!**`
    },

    'Akkusativ': {
        title: 'Akkusativ (Acusativo)',
        content: `
**O que é:** O objeto direto da frase. Quem/o que SOFRE a ação do verbo.

**Verbos Comuns com Acusativo:**
• haben (ter)
• kaufen (comprar)
• lesen (ler)
• sehen (ver)
• suchen (procurar)
• essen (comer)
• brauchen (precisar)

**REGRA DE OURO:** Apenas o MASCULINO muda no Acusativo:
• der → den
• ein → einen
• kein → keinen
• mein → meinen

**Exemplos:**
• Ich habe einen Computer. (der Computer)
• Ich sehe den Mann. (der Mann)
• Ich lese eine Zeitung. (die Zeitung - não muda!)
• Ich esse ein Brot. (das Brot - não muda!)`
    },

    'Modalverben': {
        title: 'Modalverb können (Poder/Saber)',
        content: `
**O que é:** Indica habilidade ou possibilidade.

**Conjugação:**
• ich kann
• du kannst
• er/sie/es kann
• wir können
• ihr könnt
• sie/Sie können

**Satzklammer:** "können" vai para a Posição 2 e joga o verbo principal (no infinitivo) para o FINAL da frase.

**Exemplos:**
• Ich kann schwimmen. (Eu sei nadar)
• Kannst du mir helfen? (Você pode me ajudar?)
• Wir können heute kommen. (Nós podemos vir hoje)
• Er kann nicht kochen. (Ele não sabe cozinhar)`
    },

    'Satzklammer': {
        title: 'Satzklammer (Estrutura de Pinça)',
        content: `
**O que é:** A regra MAIS IMPORTANTE da estrutura de frases alemãs. O verbo é dividido em duas partes:
1. A parte conjugada fica na Posição 2
2. A "outra parte" (infinitivo, particípio, prefixo) é jogada para o FINAL da frase

**Ativadores:**

**1. Modalverben:**
• Ich kann dich sehen.
• Er muss heute arbeiten.

**2. Perfekt:**
• Ich habe dich gesehen.
• Er ist nach Hause gegangen.

**3. Trennbare Verben:**
• Ich rufe dich an.
• Der Zug fährt um 10 Uhr ab.

**Dica Visual:** [VERBO CONJUGADO] ... conteúdo ... [OUTRA PARTE]`
    },

    'Temporale-Präpositionen': {
        title: 'Preposições Temporais',
        content: `
**O que são:** Indicam QUANDO algo acontece.

**Regras:**

**um:** Para horas exatas
• um 10 Uhr (às 10 horas)
• um 20:30 Uhr (às 20:30)

**am:** Para dias da semana e partes do dia
• am Montag (na segunda-feira)
• am Abend (à noite)
• Exceção: in der Nacht (à noite/de noite)

**im:** Para meses e estações do ano
• im Juli (em julho)
• im Sommer (no verão)
• im Winter (no inverno)

**von... bis...:** (de... até...)
• von 9 bis 17 Uhr (das 9h às 17h)

**ab:** (a partir de)
• ab morgen (a partir de amanhã)
• ab 8:00 Uhr (a partir das 8h)`
    },

    'Trennbare-Verben': {
        title: 'Trennbare Verben (Verbos Separáveis)',
        content: `
**O que são:** Verbos com prefixos (an-, auf-, ein-, mit-, zu-, fern-) que se separam no Presente.

**Regra (Presente):** O prefixo vai para o FINAL da frase (Satzklammer).
• anrufen (ligar): Ich rufe dich an.
• einkaufen (fazer compras): Er kauft im Supermarkt ein.
• aufstehen (levantar): Ich stehe um 7 Uhr auf.

**Regra (Perfekt):** O particípio é formado com "ge-" NO MEIO do verbo.
• anrufen → angerufen (Ich habe dich angerufen)
• einkaufen → eingekauft (Er hat eingekauft)

**Prefixos Separáveis Comuns:**
• an- (ligar, começar)
• auf- (abrir, levantar)
• ein- (entrar, fazer compras)
• mit- (acompanhar)
• zu- (fechar)
• fern- (assistir TV)

**Exemplos:**
• Der Zug fährt um 10 Uhr ab. (O trem parte às 10h)
• Ich kaufe heute ein. (Eu faço compras hoje)
• Wann kommst du zurück? (Quando você volta?)`
    },

    'Perfekt': {
        title: 'Perfekt (Passado)',
        content: `
**O que é:** O tempo verbal MAIS COMUM para falar sobre o passado na Alemanha.

**Fórmula (Satzklammer):**
haben/sein (conjugado na Posição 2) + Partizip II (no final)

**Partizip II:**

**Regulares:** ge- + Raiz + -t
• lernen → gelernt (Ich habe gelernt)
• machen → gemacht (Er hat gemacht)

**Irregulares:** ge- + Raiz (às vezes muda) + -en
• schreiben → geschrieben
• trinken → getrunken
• sehen → gesehen

**haben vs. sein:**

**sein:** Usado para verbos de MOVIMENTO ou MUDANÇA DE ESTADO
• gehen, fahren, fliegen, kommen, laufen
• aufstehen, bleiben, passieren

**haben:** Usado para quase todo o resto
• lernen, essen, trinken, lesen, schreiben, arbeiten, etc.

**Exemplos:**
• Ich habe Deutsch gelernt. (haben)
• Er ist nach Berlin gefahren. (sein - movimento)
• Wir haben Pizza gegessen. (haben)
• Sie ist zu Hause geblieben. (sein - mudança de estado)`
    },

    'Perfekt-haben': {
        title: 'Perfekt com haben',
        content: `
**Usado para:** A maioria dos verbos.

**Estrutura:** haben (conjugado) + Partizip II (no final)

**Verbos Regulares:**
• lernen → gelernt: Ich habe Deutsch gelernt
• machen → gemacht: Was hast du gemacht?
• kochen → gekocht: Wir haben Pizza gekocht

**Verbos Irregulares:**
• lesen → gelesen: Er hat ein Buch gelesen
• trinken → getrunken: Ich habe Wasser getrunken
• schreiben → geschrieben: Sie hat eine E-Mail geschrieben
• schlafen → geschlafen: Du hast gut geschlafen

**Trennbare Verben:**
• einkaufen → eingekauft: Ich habe eingekauft
• anrufen → angerufen: Er hat mich angerufen`
    },

    'Perfekt-sein': {
        title: 'Perfekt com sein',
        content: `
**Usado para:** Verbos de MOVIMENTO ou MUDANÇA DE ESTADO.

**Estrutura:** sein (conjugado) + Partizip II (no final)

**Verbos de Movimento:**
• gehen → gegangen: Ich bin ins Kino gegangen
• fahren → gefahren: Er ist nach Berlin gefahren
• fliegen → geflogen: Wir sind nach Brasilien geflogen
• kommen → gekommen: Bist du gekommen?
• laufen → gelaufen: Sie sind nach Hause gelaufen

**Mudança de Estado:**
• aufstehen → aufgestanden: Ich bin um 7 Uhr aufgestanden
• bleiben → geblieben: Wir sind zu Hause geblieben
• passieren → passiert: Was ist passiert?
• sein → gewesen: Er ist krank gewesen

**Exceção:** "schwimmen" pode usar haben OU sein dependendo do contexto!`
    },

    'Verben-ieren': {
        title: 'Verbos terminados em -ieren',
        content: `
**Regra Especial:** Verbos que terminam em "-ieren" NÃO usam "ge-" no Partizip II.

**Estrutura:** Raiz + -t (sem ge-)

**Exemplos:**
• studieren → studiert (NÃO gestudiert)
  - Ich habe Deutsch studiert.
• reparieren → repariert
  - Er hat das Auto repariert.
• telefonieren → telefoniert
  - Wir haben telefoniert.
• diskutieren → diskutiert
  - Was habt ihr diskutiert?

**Por quê?** Esses verbos geralmente vêm do francês/latim e já têm um prefixo estrangeiro.`
    },

    'Wortschatz': {
        title: 'Vocabulário Geral',
        content: `
**Dicas de Aprendizado:**

1. **Sempre aprenda com o artigo:**
   • der Tisch (a mesa)
   • die Lampe (a lâmpada)
   • das Buch (o livro)

2. **Aprenda com o plural:**
   • der Stuhl, die Stühle
   • die Frau, die Frauen
   • das Kind, die Kinder

3. **Grupos temáticos funcionam melhor:**
   • Família: Vater, Mutter, Bruder, Schwester
   • Comida: Brot, Apfel, Wasser, Kaffee
   • Casa: Tisch, Stuhl, Bett, Lampe

4. **Use flashcards ou repetição espaçada**

5. **Pratique com frases completas, não palavras isoladas**`
    }
};
