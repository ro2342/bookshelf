// grammarExplanations.js - Explicações gramaticais em português
// ATUALIZADO: Convertido para HTML simples para melhor renderização

window.grammarExplanations = {
    'W-Fragen': {
        title: 'W-Fragen (Perguntas com W)',
        content: `
<strong>O que são:</strong> Perguntas abertas que pedem informação (não podem ser respondidas com "sim" ou "não"). Em alemão, geralmente começam com "W".
<br><br>
<strong>A Fórmula:</strong> 
W-Wort (Posição 1) + Verbo Conjugado (Posição 2) + Resto
<br><br>
<strong>Principais Palavras:</strong>
<ul>
    <li><strong>Wer?</strong> (Quem?) - Nominativo</li>
    <li><strong>Was?</strong> (O quê?) - Nominativo/Acusativo</li>
    <li><strong>Wo?</strong> (Onde?) - Localização</li>
    <li><strong>Woher?</strong> (De onde?) - Origem</li>
    <li><strong>Wohin?</strong> (Para onde?) - Destino</li>
    <li><strong>Wie?</strong> (Como?/Qual?) - Usado para "Wie heißt du?", "Wie alt?", "Wie geht's?"</li>
    <li><strong>Wann?</strong> (Quando?)</li>
    <li><strong>Warum?</strong> (Por quê?)</li>
</ul>
<br>
<strong>Exemplos:</strong>
<ul>
    <li>Wie heißt du? (Como você se chama?)</li>
    <li>Wo wohnst du? (Onde você mora?)</li>
    <li>Woher kommst du? (De onde você vem?)</li>
</ul>`
    },

    'Personalpronomen': {
        title: 'Personalpronomen (Pronomes Pessoais)',
        content: `
<strong>O que são:</strong> Palavras que substituem os substantivos (eu, você, ele, ela, nós...).
<br><br>
<strong>A Regra:</strong> Em alemão, "er" (ele) substitui substantivos masculinos (der), "sie" (ela) substitui femininos (die), e "es" (neutro) substitui neutros (das).
<br><br>
<strong>Singular:</strong>
<ul>
    <li><strong>ich</strong> (eu)</li>
    <li><strong>du</strong> (você - informal)</li>
    <li><strong>er</strong> (ele / "it" masculino)</li>
    <li><strong>sie</strong> (ela / "it" feminino)</li>
    <li><strong>es</strong> (neutro / "it" neutro)</li>
</ul>
<br>
<strong>Plural:</strong>
<ul>
    <li><strong>wir</strong> (nós)</li>
    <li><strong>ihr</strong> (vocês - informal)</li>
    <li><strong>sie</strong> (eles/elas)</li>
    <li><strong>Sie</strong> (você/vocês - formal, sempre com maiúscula)</li>
</ul>
<br>
<strong>Exemplos:</strong>
<ul>
    <li>Das ist Maria. Sie kommt aus Spanien.</li>
    <li>Das ist ein Tisch. Er ist neu.</li>
</ul>`
    },

    'Verbkonjugation': {
        title: 'Verbkonjugation (Conjugação de Verbos)',
        content: `
<strong>O que é:</strong> A mudança na terminação do verbo para concordar com o pronome (o sujeito).
<br><br>
<strong>A Fórmula (Regra Geral):</strong> 
Remove-se o "-en" do infinitivo (ex: lernen) e adiciona-se:
<ul>
    <li>ich + <strong>-e</strong> (ich lerne)</li>
    <li>du + <strong>-st</strong> (du lernst)</li>
    <li>er/sie/es + <strong>-t</strong> (er lernt)</li>
    <li>wir + <strong>-en</strong> (wir lernen)</li>
    <li>ihr + <strong>-t</strong> (ihr lernt)</li>
    <li>sie/Sie + <strong>-en</strong> (sie lernen)</li>
</ul>
<br>
<strong>Exceções:</strong> Os verbos "sein" (ser/estar) e "haben" (ter) são totalmente irregulares.
<br><br>
<strong>Exemplos:</strong>
<ul>
    <li>Ich lerne Deutsch. (Eu aprendo alemão)</li>
    <li>Du wohnst in Berlin. (Você mora em Berlim)</li>
    <li>Wir machen eine Pause. (Nós fazemos uma pausa)</li>
</ul>`
    },

    'sein-heißen': {
        title: 'Verbos sein e heißen',
        content: `
<strong>sein (ser/estar):</strong>
<ul>
    <li>ich bin</li>
    <li>du bist</li>
    <li>er/sie/es ist</li>
    <li>wir sind</li>
    <li>ihr seid</li>
    <li>sie/Sie sind</li>
</ul>
<br>
<strong>heißen (chamar-se):</strong>
<ul>
    <li>ich heiße</li>
    <li>du heißt</li>
    <li>er/sie/es heißt</li>
    <li>wir heißen</li>
    <li>ihr heißt</li>
    <li>sie/Sie heißen</li>
</ul>
<br>
<strong>Exemplos:</strong>
<ul>
    <li>Ich bin Student. (Eu sou estudante)</li>
    <li>Wie heißt du? (Como você se chama?)</li>
    <li>Er ist mein Bruder. (Ele é meu irmão)</li>
</ul>`
    },

    'haben': {
        title: 'Verbo haben (ter)',
        content: `
<strong>Conjugação:</strong>
<ul>
    <li>ich habe</li>
    <li>du hast</li>
    <li>er/sie/es hat</li>
    <li>wir haben</li>
    <li>ihr habt</li>
    <li>sie/Sie haben</li>
</ul>
<br>
<strong>Uso:</strong> Indica posse ou características.
<br><br>
<strong>Exemplos:</strong>
<ul>
    <li>Ich habe eine Frage. (Eu tenho uma pergunta)</li>
    <li>Du hast ein schönes Auto. (Você tem um carro bonito)</li>
    <li>Wir haben Zeit. (Nós temos tempo)</li>
</ul>`
    },

    'Negation-nicht': {
        title: 'Negação com nicht',
        content: `
<strong>O que é:</strong> O "não" em alemão. Usado para negar verbos, adjetivos, advérbios ou a frase inteira.
<br><br>
<strong>Regra:</strong> "nicht" NUNCA nega um substantivo com artigo (para isso, use "kein").
<br><br>
<strong>Posição:</strong>
<ol>
    <li>Para negar a frase inteira, "nicht" vai o mais para o final possível</li>
    <li>MAS vem ANTES de adjetivos: "Das ist nicht gut"</li>
    <li>Na Satzklammer (Modal ou Perfekt), vem ANTES do verbo no final: "Ich kann nicht schlafen" / "Ich habe nicht geschlafen"</li>
</ol>
<br>
<strong>Exemplos:</strong>
<ul>
    <li>Ich wohne nicht in Hamburg.</li>
    <li>Das ist nicht mein Bruder.</li>
    <li>Wir verstehen die Frage nicht.</li>
</ul>`
    },

    'Negativartikel': {
        title: 'Artigo Negativo kein',
        content: `
<strong>O que é:</strong> O "não" usado para negar substantivos. Pense nele como "nenhum/a".
<br><br>
<strong>Fórmula:</strong> É o oposto de "ein" (um/uma). Se você pode dizer "ein" na afirmativa, usa "kein" na negativa.
<br><br>
<strong>Declinação:</strong>
<ul>
    <li>Masculino: kein (Nom), keinen (Akk)</li>
    <li>Feminino: keine (Nom), keine (Akk)</li>
    <li>Neutro: kein (Nom), kein (Akk)</li>
    <li>Plural: keine</li>
</ul>
<br>
<strong>Exemplos:</strong>
<ul>
    <li>Das ist kein Tisch. (Isso não é uma mesa)</li>
    <li>Ich habe keine Zeit. (Eu não tenho tempo)</li>
    <li>Ich habe keinen Computer. (Eu não tenho computador)</li>
</ul>`
    },

    'Berufe': {
        title: 'Berufe (Profissões) e Sufixo -in',
        content: `
<strong>Formação Feminina:</strong> Adiciona-se "-in" à forma masculina. Se a palavra tiver a, o, u, geralmente recebe Umlaut (ä, ö, ü).
<br><br>
<strong>Exemplos:</strong>
<ul>
    <li>der Lehrer → die Lehrerin (professor/a)</li>
    <li>der Arzt → die Ärztin (médico/a)</li>
    <li>der Programmierer → die Programmiererin</li>
    <li>der Verkäufer → die Verkäuferin</li>
</ul>
<br>
<strong>Profissões Comuns:</strong>
<ul>
    <li>der/die Student/in - estudante</li>
    <li>der/die Journalist/in - jornalista</li>
    <li>der/die Ingenieur/in - engenheiro/a</li>
</ul>`
    },

    'Vokalwechsel': {
        title: 'Verbos com Troca de Vogal',
        content: `
<strong>O que são:</strong> Verbos "fortes" (irregulares) que mudam a vogal no Presente.
<br><br>
<strong>Regra:</strong> A troca SÓ acontece com "du" e "er/sie/es". As formas do plural (wir, ihr, sie) são normais.
<br><br>
<strong>Padrões Comuns:</strong>
<ul>
    <li><strong>e → i:</strong> sprechen → du sprichst, er spricht</li>
    <li><strong>e → ie:</strong> lesen → du liest, er liest</li>
    <li><strong>a → ä:</strong> fahren → du fährst, er fährt</li>
    <li><strong>a → ä:</strong> schlafen → du schläfst, er schläft</li>
</ul>
<br>
<strong>Exemplos Importantes:</strong>
<ul>
    <li>essen (comer) → du isst, er isst</li>
    <li>sehen (ver) → du siehst, er sieht</li>
    <li>treffen (encontrar) → du triffst, er trifft</li>
</ul>`
    },

    'Entscheidungsfragen': {
        title: 'Entscheidungsfragen (Perguntas Sim/Não)',
        content: `
<strong>O que são:</strong> Perguntas que podem ser respondidas com "Ja" (Sim) ou "Nein" (Não).
<br><br>
<strong>Fórmula:</strong> O verbo conjugado vai para a Posição 1.
<br><br>
<strong>Estrutura:</strong>
<ul>
    <li>Afirmação: Du kommst aus Brasilien. (Verbo na Posição 2)</li>
    <li>Pergunta: Kommst du aus Brasilien? (Verbo na Posição 1)</li>
</ul>
<br>
<strong>Exemplos:</strong>
<ul>
    <li>Ist er Lehrer? (Ele é professor?)</li>
    <li>Lernt ihr zusammen? (Vocês aprendem juntos?)</li>
    <li>Heißt sie Anna? (Ela se chama Anna?)</li>
</ul>`
    },

    'Possessivartikel': {
        title: 'Possessivartikel (Artigos Possessivos)',
        content: `
<strong>O que são:</strong> Indicam posse: mein (meu), dein (seu).
<br><br>
<strong>Regra:</strong> Declinam-se exatamente como "ein" (ou "kein").
<br><br>
<strong>Nominativo:</strong>
<ul>
    <li>(m) Das ist mein Vater</li>
    <li>(f) Das ist meine Mutter</li>
    <li>(n) Das ist mein Buch</li>
</ul>
<br>
<strong>Acusativo:</strong>
<ul>
    <li>(m) Ich sehe meinen Vater (APENAS O MASCULINO MUDA!)</li>
    <li>(f) Ich sehe meine Mutter</li>
    <li>(n) Ich sehe mein Buch</li>
</ul>
<br>
<strong>Lista Completa:</strong>
<ul>
    <li>mein/meine (meu/minha)</li>
    <li>dein/deine (seu/sua - informal)</li>
    <li>sein/seine (dele)</li>
    <li>ihr/ihre (dela)</li>
    <li>unser/unsere (nosso/nossa)</li>
    <li>euer/eure (de vocês)</li>
    <li>ihr/ihre (deles/delas)</li>
    <li>Ihr/Ihre (seu/sua - formal)</li>
</ul>`
    },

    'Artikel': {
        title: 'Artigos Definidos e Indefinidos',
        content: `
<strong>Artigos Definidos (o, a, os, as):</strong>
<ul>
    <li><strong>Nominativo:</strong> der (m), die (f), das (n), die (pl)</li>
    <li><strong>Acusativo:</strong> den (m), die (f), das (n), die (pl)</li>
</ul>
<br>
<strong>Artigos Indefinidos (um, uma):</strong>
<ul>
    <li><strong>Nominativo:</strong> ein (m), eine (f), ein (n)</li>
    <li><strong>Acusativo:</strong> einen (m), eine (f), ein (n)</li>
</ul>
<br>
<strong>REGRA DE OURO:</strong> Aprenda CADA substantivo com seu artigo!
<br><br>
<strong>Exemplos:</strong>
<ul>
    <li>Der Stuhl ist alt. (Nominativo)</li>
    <li>Ich kaufe den Stuhl. (Acusativo - masculino muda!)</li>
    <li>Die Lampe ist neu. (Nominativo)</li>
    <li>Ich kaufe die Lampe. (Acusativo - feminino não muda)</li>
</ul>`
    },

    'Plural': {
        title: 'Plural (Substantivos no Plural)',
        content: `
<strong>O que é:</strong> A formação do plural em alemão tem várias terminações.
<br><br>
<strong>Terminações Comuns:</strong>
<ul>
    <li><strong>-n/-en:</strong> die Frau → die Frauen</li>
    <li><strong>-e:</strong> der Tisch → die Tische</li>
    <li><strong>-er:</strong> das Buch → die Bücher (com Umlaut)</li>
    <li><strong>-s:</strong> das Auto → die Autos</li>
    <li><strong>Sem mudança:</strong> der Lehrer → die Lehrer</li>
</ul>
<br>
<strong>Estratégia:</strong> Sempre aprenda o substantivo com artigo E plural:
<ul>
    <li>der Stuhl, die Stühle</li>
    <li>die Lampe, die Lampen</li>
    <li>das Kind, die Kinder</li>
</ul>
<br>
<strong>NÃO HÁ REGRA LÓGICA FÁCIL - é preciso decorar!</strong>`
    },

    'Akkusativ': {
        title: 'Akkusativ (Acusativo)',
        content: `
<strong>O que é:</strong> O objeto direto da frase. Quem/o que SOFRE a ação do verbo.
<br><br>
<strong>Verbos Comuns com Acusativo:</strong>
<ul>
    <li>haben (ter)</li>
    <li>kaufen (comprar)</li>
    <li>lesen (ler)</li>
    <li>sehen (ver)</li>
    <li>suchen (procurar)</li>
    <li>essen (comer)</li>
    <li>brauchen (precisar)</li>
</ul>
<br>
<strong>REGRA DE OURO:</strong> Apenas o MASCULINO muda no Acusativo:
<ul>
    <li>der → den</li>
    <li>ein → einen</li>
    <li>kein → keinen</li>
    <li>mein → meinen</li>
</ul>
<br>
<strong>Exemplos:</strong>
<ul>
    <li>Ich habe einen Computer. (der Computer)</li>
    <li>Ich sehe den Mann. (der Mann)</li>
    <li>Ich lese eine Zeitung. (die Zeitung - não muda!)</li>
    <li>Ich esse ein Brot. (das Brot - não muda!)</li>
</ul>`
    },

    'Modalverben': {
        title: 'Modalverb können (Poder/Saber)',
        content: `
<strong>O que é:</strong> Indica habilidade ou possibilidade.
<br><br>
<strong>Conjugação:</strong>
<ul>
    <li>ich kann</li>
    <li>du kannst</li>
    <li>er/sie/es kann</li>
    <li>wir können</li>
    <li>ihr könnt</li>
    <li>sie/Sie können</li>
</ul>
<br>
<strong>Satzklammer:</strong> "können" vai para a Posição 2 e joga o verbo principal (no infinitivo) para o FINAL da frase.
<br><br>
<strong>Exemplos:</strong>
<ul>
    <li>Ich kann schwimmen. (Eu sei nadar)</li>
    <li>Kannst du mir helfen? (Você pode me ajudar?)</li>
    <li>Wir können heute kommen. (Nós podemos vir hoje)</li>
    <li>Er kann nicht kochen. (Ele não sabe cozinhar)</li>
</ul>`
    },

    'Satzklammer': {
        title: 'Satzklammer (Estrutura de Pinça)',
        content: `
<strong>O que é:</strong> A regra MAIS IMPORTANTE da estrutura de frases alemãs. O verbo é dividido em duas partes:
<ol>
    <li>A parte conjugada fica na Posição 2</li>
    <li>A "outra parte" (infinitivo, particípio, prefixo) é jogada para o FINAL da frase</li>
</ol>
<br>
<strong>Ativadores:</strong>
<br><br>
<strong>1. Modalverben:</strong>
<ul>
    <li>Ich kann dich sehen.</li>
    <li>Er muss heute arbeiten.</li>
</ul>
<br>
<strong>2. Perfekt:</strong>
<ul>
    <li>Ich habe dich gesehen.</li>
    <li>Er ist nach Hause gegangen.</li>
</ul>
<br>
<strong>3. Trennbare Verben:</strong>
<ul>
    <li>Ich rufe dich an.</li>
    <li>Der Zug fährt um 10 Uhr ab.</li>
</ul>
<br>
<strong>Dica Visual:</strong> [VERBO CONJUGADO] ... conteúdo ... [OUTRA PARTE]`
    },

    'Temporale-Präpositionen': {
        title: 'Preposições Temporais',
        content: `
<strong>O que são:</strong> Indicam QUANDO algo acontece.
<br><br>
<strong>Regras:</strong>
<br><br>
<strong>um:</strong> Para horas exatas
<ul>
    <li>um 10 Uhr (às 10 horas)</li>
    <li>um 20:30 Uhr (às 20:30)</li>
</ul>
<br>
<strong>am:</strong> Para dias da semana e partes do dia
<ul>
    <li>am Montag (na segunda-feira)</li>
    <li>am Abend (à noite)</li>
    <li>Exceção: in der Nacht (à noite/de noite)</li>
</ul>
<br>
<strong>im:</strong> Para meses e estações do ano
<ul>
    <li>im Juli (em julho)</li>
    <li>im Sommer (no verão)</li>
    <li>im Winter (no inverno)</li>
</ul>
<br>
<strong>von... bis...:</strong> (de... até...)
<ul>
    <li>von 9 bis 17 Uhr (das 9h às 17h)</li>
</ul>
<br>
<strong>ab:</strong> (a partir de)
<ul>
    <li>ab morgen (a partir de amanhã)</li>
    <li>ab 8:00 Uhr (a partir das 8h)</li>
</ul>`
    },

    'Trennbare-Verben': {
        title: 'Trennbare Verben (Verbos Separáveis)',
        content: `
<strong>O que são:</strong> Verbos com prefixos (an-, auf-, ein-, mit-, zu-, fern-) que se separam no Presente.
<br><br>
<strong>Regra (Presente):</strong> O prefixo vai para o FINAL da frase (Satzklammer).
<ul>
    <li>anrufen (ligar): Ich rufe dich an.</li>
    <li>einkaufen (fazer compras): Er kauft im Supermarkt ein.</li>
    <li>aufstehen (levantar): Ich stehe um 7 Uhr auf.</li>
</ul>
<br>
<strong>Regra (Perfekt):</strong> O particípio é formado com "ge-" NO MEIO do verbo.
<ul>
    <li>anrufen → angerufen (Ich habe dich angerufen)</li>
    <li>einkaufen → eingekauft (Er hat eingekauft)</li>
</ul>
<br>
<strong>Prefixos Separáveis Comuns:</strong>
<ul>
    <li>an- (ligar, começar)</li>
    <li>auf- (abrir, levantar)</li>
    <li>ein- (entrar, fazer compras)</li>
    <li>mit- (acompanhar)</li>
    <li>zu- (fechar)</li>
    <li>fern- (assistir TV)</li>
</ul>
<br>
<strong>Exemplos:</strong>
<ul>
    <li>Der Zug fährt um 10 Uhr ab. (O trem parte às 10h)</li>
    <li>Ich kaufe heute ein. (Eu faço compras hoje)</li>
    <li>Wann kommst du zurück? (Quando você volta?)</li>
</ul>`
    },

    'Perfekt': {
        title: 'Perfekt (Passado)',
        content: `
<strong>O que é:</strong> O tempo verbal MAIS COMUM para falar sobre o passado na Alemanha.
<br><br>
<strong>Fórmula (Satzklammer):</strong>
haben/sein (conjugado na Posição 2) + Partizip II (no final)
<br><br>
<strong>Partizip II:</strong>
<br><br>
<strong>Regulares:</strong> ge- + Raiz + -t
<ul>
    <li>lernen → gelernt (Ich habe gelernt)</li>
    <li>machen → gemacht (Er hat gemacht)</li>
</ul>
<br>
<strong>Irregulares:</strong> ge- + Raiz (às vezes muda) + -en
<ul>
    <li>schreiben → geschrieben</li>
    <li>trinken → getrunken</li>
    <li>sehen → gesehen</li>
</ul>
<br>
<strong>haben vs. sein:</strong>
<br><br>
<strong>sein:</strong> Usado para verbos de MOVIMENTO ou MUDANÇA DE ESTADO
<ul>
    <li>gehen, fahren, fliegen, kommen, laufen</li>
    <li>aufstehen, bleiben, passieren</li>
</ul>
<br>
<strong>haben:</strong> Usado para quase todo o resto
<ul>
    <li>lernen, essen, trinken, lesen, schreiben, arbeiten, etc.</li>
</ul>
<br>
<strong>Exemplos:</strong>
<ul>
    <li>Ich habe Deutsch gelernt. (haben)</li>
    <li>Er ist nach Berlin gefahren. (sein - movimento)</li>
    <li>Wir haben Pizza gegessen. (haben)</li>
    <li>Sie ist zu Hause geblieben. (sein - mudança de estado)</li>
</ul>`
    },

    'Perfekt-haben': {
        title: 'Perfekt com haben',
        content: `
<strong>Usado para:</strong> A maioria dos verbos.
<br><br>
<strong>Estrutura:</strong> haben (conjugado) + Partizip II (no final)
<br><br>
<strong>Verbos Regulares:</strong>
<ul>
    <li>lernen → gelernt: Ich habe Deutsch gelernt</li>
    <li>machen → gemacht: Was hast du gemacht?</li>
    <li>kochen → gekocht: Wir haben Pizza gekocht</li>
</ul>
<br>
<strong>Verbos Irregulares:</strong>
<ul>
    <li>lesen → gelesen: Er hat ein Buch gelesen</li>
    <li>trinken → getrunken: Ich habe Wasser getrunken</li>
    <li>schreiben → geschrieben: Sie hat eine E-Mail geschrieben</li>
    <li>schlafen → geschlafen: Du hast gut geschlafen</li>
</ul>
<br>
<strong>Trennbare Verben:</strong>
<ul>
    <li>einkaufen → eingekauft: Ich habe eingekauft</li>
    <li>anrufen → angerufen: Er hat mich angerufen</li>
</ul>`
    },

    'Perfekt-sein': {
        title: 'Perfekt com sein',
        content: `
<strong>Usado para:</strong> Verbos de MOVIMENTO ou MUDANÇA DE ESTADO.
<br><br>
<strong>Estrutura:</strong> sein (conjugado) + Partizip II (no final)
<br><br>
<strong>Verbos de Movimento:</strong>
<ul>
    <li>gehen → gegangen: Ich bin ins Kino gegangen</li>
    <li>fahren → gefahren: Er ist nach Berlin gefahren</li>
    <li>fliegen → geflogen: Wir sind nach Brasilien geflogen</li>
    <li>kommen → gekommen: Bist du gekommen?</li>
    <li>laufen → gelaufen: Sie sind nach Hause gelaufen</li>
</ul>
<br>
<strong>Mudança de Estado:</strong>
<ul>
    <li>aufstehen → aufgestanden: Ich bin um 7 Uhr aufgestanden</li>
    <li>bleiben → geblieben: Wir sind zu Hause geblieben</li>
    <li>passieren → passiert: Was ist passiert?</li>
    <li>sein → gewesen: Er ist krank gewesen</li>
</ul>
<br>
<strong>Exceção:</strong> "schwimmen" pode usar haben OU sein dependendo do contexto!`
    },

    'Verben-ieren': {
        title: 'Verbos terminados em -ieren',
        content: `
<strong>Regra Especial:</strong> Verbos que terminam em "-ieren" NÃO usam "ge-" no Partizip II.
<br><br>
<strong>Estrutura:</strong> Raiz + -t (sem ge-)
<br><br>
<strong>Exemplos:</strong>
<ul>
    <li>studieren → studiert (NÃO gestudiert)
        <br> - Ich habe Deutsch studiert.</li>
    <li>reparieren → repariert
        <br> - Er hat das Auto repariert.</li>
    <li>telefonieren → telefoniert
        <br> - Wir haben telefoniert.</li>
    <li>diskutieren → diskutiert
        <br> - Was habt ihr diskutiert?</li>
</ul>
<br>
<strong>Por quê?</strong> Esses verbos geralmente vêm do francês/latim e já têm um prefixo estrangeiro.`
    },

    'Wortschatz': {
        title: 'Vocabulário Geral',
        content: `
<strong>Dicas de Aprendizado:</strong>
<br><br>
<ol>
    <li><strong>Sempre aprenda com o artigo:</strong>
        <ul>
            <li>der Tisch (a mesa)</li>
            <li>die Lampe (a lâmpada)</li>
            <li>das Buch (o livro)</li>
        </ul>
    </li>
    <li><strong>Aprenda com o plural:</strong>
        <ul>
            <li>der Stuhl, die Stühle</li>
            <li>die Frau, die Frauen</li>
            <li>das Kind, die Kinder</li>
        </ul>
    </li>
    <li><strong>Grupos temáticos funcionam melhor:</strong>
        <ul>
            <li>Família: Vater, Mutter, Bruder, Schwester</li>
            <li>Comida: Brot, Apfel, Wasser, Kaffee</li>
            <li>Casa: Tisch, Stuhl, Bett, Lampe</li>
        </ul>
    </li>
    <li><strong>Use flashcards ou repetição espaçada</strong></li>
    <li><strong>Pratique com frases completas, não palavras isoladas</strong></li>
</ol>`
    }
};
