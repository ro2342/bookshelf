// exercisesData.js - Banco de dados completo dos 150 exercícios organizados em 30 lições

window.exercisesData = [
    // LEKTION 1: Vorstellung (Apresentação)
    {
        id: 1,
        title: 'Lektion 1: Vorstellung',
        topics: ['W-Fragen', 'Personalpronomen', 'Verbkonjugation: sein, heißen'],
        grammarKeys: ['W-Fragen', 'Personalpronomen', 'sein-heißen', 'Verbkonjugation'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Wie ___ du?',
                answer: 'heißt',
                alternatives: ['heisst'],
                explanation: 'Bei "du" verwenden wir "heißt" (2. Person Singular). Wie heißt du? = Como você se chama?'
            },
            {
                type: 'fillBlank',
                question: '___ kommst du?',
                answer: 'woher',
                alternatives: [],
                explanation: '"Woher" pergunta pela origem/de onde você vem. Woher kommst du? = De onde você vem?'
            },
            {
                type: 'fillBlank',
                question: '___ wohnst du?',
                answer: 'wo',
                alternatives: [],
                explanation: '"Wo" pergunta pela localização. Wo wohnst du? = Onde você mora?'
            },
            {
                type: 'fillBlank',
                question: 'Das ist Maria. ___ kommt aus Spanien.',
                answer: 'sie',
                alternatives: [],
                explanation: '"Sie" (ela) substitui "Maria" (feminino). Das ist Maria. Sie kommt aus Spanien.'
            },
            {
                type: 'fillBlank',
                question: '___ heiße Rod.',
                answer: 'ich',
                alternatives: [],
                explanation: 'O pronome "ich" (eu) é usado na 1ª pessoa do singular. Ich heiße Rod.'
            },
            {
                type: 'fillBlank',
                question: 'Ich ___ Student.',
                answer: 'bin',
                alternatives: [],
                explanation: 'O verbo "sein" na 1ª pessoa singular (ich) é "bin". Ich bin Student = Eu sou estudante.'
            },
            {
                type: 'multipleChoice',
                question: 'Wo ___ du?',
                answer: 'wohnst',
                options: ['wohne', 'wohnst', 'wohnt', 'wohnen'],
                explanation: 'Bei der 2. Person Singular (du) endet das Verb auf -st. Du wohnst = você mora.'
            }
        ]
    },

    // LEKTION 2: Städte und Länder (Cidades e Países)
    {
        id: 2,
        title: 'Lektion 2: Städte und Länder',
        topics: ['haben', 'wohnen', 'Alphabet', 'Länder und Sprachen'],
        grammarKeys: ['haben', 'Verbkonjugation', 'Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich ___ eine Frage.',
                answer: 'habe',
                alternatives: [],
                explanation: 'O verbo "haben" (ter) na 1ª pessoa singular é "habe". Ich habe eine Frage = Eu tenho uma pergunta.'
            },
            {
                type: 'fillBlank',
                question: 'Du ___ ein schönes Auto.',
                answer: 'hast',
                alternatives: [],
                explanation: 'O verbo "haben" na 2ª pessoa singular (du) é "hast". Du hast ein Auto = Você tem um carro.'
            },
            {
                type: 'fillBlank',
                question: 'Wer aus Spanien kommt, spricht ___.',
                answer: 'spanisch',
                alternatives: [],
                explanation: 'Pessoas da Espanha (Spanien) falam espanhol (Spanisch).'
            },
            {
                type: 'fillBlank',
                question: 'Wer ___ spricht, kommt oft aus Portugal oder Brasilien.',
                answer: 'portugiesisch',
                alternatives: [],
                explanation: 'Português (Portugiesisch) é falado em Portugal e no Brasil.'
            },
            {
                type: 'fillBlank',
                question: 'Er kommt aus der Türkei, er spricht ___.',
                answer: 'türkisch',
                alternatives: [],
                explanation: 'Pessoas da Turquia (Türkei) falam turco (Türkisch).'
            },
            {
                type: 'translation',
                question: 'Traduza para alemão: 25',
                answer: 'fünfundzwanzig',
                alternatives: ['fuenfundzwanzig'],
                explanation: 'Em alemão, números compostos são escritos juntos: fünf + und + zwanzig = fünfundzwanzig.'
            }
        ]
    },

    // LEKTION 3: Sprachen und Nationalitäten
    {
        id: 3,
        title: 'Lektion 3: Sprachen und Nationalitäten',
        topics: ['lesen', 'sprechen', 'Negation mit nicht'],
        grammarKeys: ['Vokalwechsel', 'Negation-nicht', 'Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich wohne ___ in Hamburg.',
                answer: 'nicht',
                alternatives: [],
                explanation: '"nicht" (não) é usado para negar verbos. Ich wohne nicht in Hamburg = Eu não moro em Hamburgo.'
            },
            {
                type: 'fillBlank',
                question: 'Das ist ___ mein Bruder.',
                answer: 'nicht',
                alternatives: [],
                explanation: 'Usamos "nicht" antes de substantivos com possessivo. Das ist nicht mein Bruder = Esse não é meu irmão.'
            },
            {
                type: 'fillBlank',
                question: 'Er ___ (sprechen) sehr gut Englisch.',
                answer: 'spricht',
                alternatives: [],
                explanation: 'O verbo "sprechen" muda de "e" para "i" na 3ª pessoa singular: er spricht.'
            },
            {
                type: 'multipleChoice',
                question: '___ (lesen) du gern Bücher?',
                answer: 'liest',
                options: ['lese', 'liest', 'lesen', 'lest'],
                explanation: 'O verbo "lesen" muda de "e" para "ie" com "du": du liest.'
            },
            {
                type: 'fillBlank',
                question: 'Sie ___ (sehen) einen Film.',
                answer: 'sieht',
                alternatives: [],
                explanation: 'O verbo "sehen" muda de "e" para "ie" na 3ª pessoa: sie sieht.'
            }
        ]
    },

    // LEKTION 5: Berufe und Verwandtschaft
    {
        id: 5,
        title: 'Lektion 5: Berufe und Verwandtschaft',
        topics: ['arbeiten', 'studieren', 'Wortbildung -in'],
        grammarKeys: ['Berufe', 'Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Der Lehrer → Die ___',
                answer: 'lehrerin',
                alternatives: [],
                explanation: 'A forma feminina é criada adicionando "-in": der Lehrer → die Lehrerin.'
            },
            {
                type: 'fillBlank',
                question: 'Der Arzt → Die ___',
                answer: 'ärztin',
                alternatives: ['aerztin'],
                explanation: 'Com Umlaut: der Arzt → die Ärztin (médica).'
            },
            {
                type: 'fillBlank',
                question: 'Er arbeitet im Krankenhaus. Er ist ___.',
                answer: 'arzt',
                alternatives: [],
                explanation: 'Quem trabalha no hospital (Krankenhaus) é médico (Arzt).'
            },
            {
                type: 'fillBlank',
                question: 'Sie unterrichtet Schüler. Sie ist ___.',
                answer: 'lehrerin',
                alternatives: [],
                explanation: 'Quem ensina (unterrichten) alunos é professora (Lehrerin).'
            },
            {
                type: 'fillBlank',
                question: 'Der Vater von meinem Vater ist mein ___.',
                answer: 'großvater',
                alternatives: ['grossvater', 'opa'],
                explanation: 'O pai do seu pai é seu avô (Großvater ou Opa).'
            },
            {
                type: 'fillBlank',
                question: 'Die Schwester von meiner Mutter ist meine ___.',
                answer: 'tante',
                alternatives: [],
                explanation: 'A irmã da sua mãe é sua tia (Tante).'
            }
        ]
    },

    // LEKTION 7: Lebensmittel
    {
        id: 7,
        title: 'Lektion 7: Lebensmittel',
        topics: ['essen', 'Akkusativ', 'Negativartikel kein'],
        grammarKeys: ['Akkusativ', 'Negativartikel', 'Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich habe ___ (der) Hund.',
                answer: 'einen',
                alternatives: [],
                explanation: 'Akkusativ masculino: ein → einen. Ich habe einen Hund = Eu tenho um cachorro.'
            },
            {
                type: 'fillBlank',
                question: 'Er kauft ___ (die) Jacke.',
                answer: 'eine',
                alternatives: [],
                explanation: 'Akkusativ feminino não muda: eine bleibt eine.'
            },
            {
                type: 'fillBlank',
                question: 'Ich habe ___ (der) Computer.',
                answer: 'keinen',
                alternatives: [],
                explanation: 'Negativartikel im Akkusativ masculino: kein → keinen.'
            },
            {
                type: 'fillBlank',
                question: 'Ist das ein Tisch? — Nein, das ist ___ Tisch.',
                answer: 'kein',
                alternatives: [],
                explanation: 'Negação de substantivo masculino no nominativo: kein Tisch.'
            },
            {
                type: 'fillBlank',
                question: 'Die Banane ist ___.',
                answer: 'gelb',
                alternatives: [],
                explanation: 'Bananas são amarelas (gelb).'
            },
            {
                type: 'fillBlank',
                question: 'Ich trinke gern ___ (café).',
                answer: 'kaffee',
                alternatives: [],
                explanation: 'Café em alemão é "der Kaffee".'
            }
        ]
    },

    // LEKTION 9: Unregelmäßige Verben
    {
        id: 9,
        title: 'Lektion 9: Unregelmäßige Verben',
        topics: ['wollen', 'Akkusativ mit allen Artikeln'],
        grammarKeys: ['Vokalwechsel', 'Akkusativ', 'Artikel'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich sehe ___ (der) Mann.',
                answer: 'den',
                alternatives: [],
                explanation: 'Akkusativ: der → den. Ich sehe den Mann.'
            },
            {
                type: 'fillBlank',
                question: 'Er nimmt ___ (der) Bus.',
                answer: 'den',
                alternatives: [],
                explanation: 'Akkusativ masculino: der Bus → den Bus.'
            },
            {
                type: 'fillBlank',
                question: 'Du ___ (fahren) zu schnell.',
                answer: 'fährst',
                alternatives: ['faehrst'],
                explanation: 'Vokalwechsel a → ä: du fährst.'
            },
            {
                type: 'fillBlank',
                question: 'Er ___ (schlafen) am Wochenende lange.',
                answer: 'schläft',
                alternatives: ['schlaeft'],
                explanation: 'Vokalwechsel a → ä: er schläft.'
            },
            {
                type: 'fillBlank',
                question: 'Was ___ (essen) du gern?',
                answer: 'isst',
                alternatives: [],
                explanation: 'Vokalwechsel e → i: du isst (cuidado com duplo "s").'
            }
        ]
    },

    // LEKTION 11: Trennbare Verben
    {
        id: 11,
        title: 'Lektion 11: Trennbare Verben',
        topics: ['Trennbare Verben', 'Genitiv', 'kein im Detail'],
        grammarKeys: ['Trennbare-Verben', 'Negativartikel', 'Satzklammer'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Wann ___ der Zug ___? (abfahren)',
                answer: 'fährt|ab',
                alternatives: ['faehrt|ab'],
                explanation: 'Trennbare Verben: Präfix geht ans Ende. Der Zug fährt ab.'
            },
            {
                type: 'fillBlank',
                question: 'Ich ___ meine Freunde zum Essen ___. (einladen)',
                answer: 'lade|ein',
                alternatives: [],
                explanation: 'einladen → Ich lade ein. Der Präfix "ein" geht ans Ende.'
            },
            {
                type: 'fillBlank',
                question: 'Er ___ die Tür ___. (zumachen)',
                answer: 'macht|zu',
                alternatives: [],
                explanation: 'zumachen → Er macht zu. Trennbar!'
            },
            {
                type: 'fillBlank',
                question: 'Sie ___ im Supermarkt ___. (einkaufen)',
                answer: 'kauft|ein',
                alternatives: [],
                explanation: 'einkaufen → Sie kauft ein.'
            }
        ]
    },

    // LEKTION 13: Einkaufen
    {
        id: 13,
        title: 'Lektion 13: Einkaufen',
        topics: ['e/i-Wechsel', 'man', 'Possessivartikel'],
        grammarKeys: ['Vokalwechsel', 'Possessivartikel', 'Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Hier ist ___ (ich) Buch (das).',
                answer: 'mein',
                alternatives: [],
                explanation: 'Possessivartikel neutro: mein Buch.'
            },
            {
                type: 'fillBlank',
                question: 'Hier ist ___ (du) Tasche (die).',
                answer: 'deine',
                alternatives: [],
                explanation: 'Possessivartikel feminino: deine Tasche.'
            },
            {
                type: 'fillBlank',
                question: 'Ich suche ___ (mein) Schlüssel (der).',
                answer: 'meinen',
                alternatives: [],
                explanation: 'Akkusativ masculino: mein → meinen Schlüssel.'
            },
            {
                type: 'fillBlank',
                question: '___ Stuhl ist alt.',
                answer: 'der',
                alternatives: [],
                explanation: 'Definiter Artikel masculino Nominativ: der Stuhl.'
            }
        ]
    },

    // LEKTION 15: Kochen
    {
        id: 15,
        title: 'Lektion 15: Kochen',
        topics: ['Zahlen', 'Kochen-Verben'],
        grammarKeys: ['Wortschatz'],
        exercises: [
            {
                type: 'translation',
                question: 'Traduza: 42',
                answer: 'zweiundvierzig',
                alternatives: [],
                explanation: 'Números alemães: zwei + und + vierzig = zweiundvierzig.'
            },
            {
                type: 'translation',
                question: 'Traduza: 88',
                answer: 'achtundachtzig',
                alternatives: [],
                explanation: 'acht + und + achtzig = achtundachtzig.'
            },
            {
                type: 'fillBlank',
                question: 'Ich esse ___ (pão) zum Frühstück.',
                answer: 'brot',
                alternatives: [],
                explanation: 'Pão = das Brot.'
            }
        ]
    },

    // LEKTION 17: Tagesablauf
    {
        id: 17,
        title: 'Lektion 17: Tagesablauf',
        topics: ['Temporale Präpositionen', 'Tagesablauf'],
        grammarKeys: ['Temporale-Präpositionen', 'Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: '___ Montag spiele ich Fußball.',
                answer: 'am',
                alternatives: [],
                explanation: 'Dias da semana usam "am": am Montag.'
            },
            {
                type: 'fillBlank',
                question: 'Der Film beginnt ___ 20:15 Uhr.',
                answer: 'um',
                alternatives: [],
                explanation: 'Horas exatas usam "um": um 20:15 Uhr.'
            },
            {
                type: 'fillBlank',
                question: '___ Sommer fahren wir nach Italien.',
                answer: 'im',
                alternatives: [],
                explanation: 'Estações do ano usam "im": im Sommer.'
            },
            {
                type: 'fillBlank',
                question: 'Ich arbeite ___ 9:00 Uhr ___ 17:00 Uhr.',
                answer: 'von|bis',
                alternatives: [],
                explanation: 'von... bis... = de... até...'
            }
        ]
    },

    // LEKTION 19: Freizeit
    {
        id: 19,
        title: 'Lektion 19: Freizeit',
        topics: ['fernsehen', 'schlafen', 'Freizeitaktivitäten'],
        grammarKeys: ['Trennbare-Verben', 'Vokalwechsel', 'Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich ___ gern Musik. (ouvir)',
                answer: 'höre',
                alternatives: ['hoere'],
                explanation: 'ouvir = hören. Ich höre Musik.'
            },
            {
                type: 'fillBlank',
                question: 'Am Wochenende ___ ich gern Freunde. (encontrar)',
                answer: 'treffe',
                alternatives: [],
                explanation: 'encontrar = treffen. Ich treffe Freunde.'
            },
            {
                type: 'fillBlank',
                question: 'Sie ___ jeden Abend ___. (fernsehen)',
                answer: 'sieht|fern',
                alternatives: [],
                explanation: 'fernsehen é trennbar: Sie sieht fern.'
            }
        ]
    },

    // LEKTION 21: Modalverben
    {
        id: 21,
        title: 'Lektion 21: Freizeit und Modalverben',
        topics: ['mögen', 'können'],
        grammarKeys: ['Modalverben', 'Satzklammer'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich ___ gut schwimmen.',
                answer: 'kann',
                alternatives: [],
                explanation: 'können = poder/saber. Ich kann schwimmen = Eu sei nadar.'
            },
            {
                type: 'multipleChoice',
                question: '___ du mir helfen?',
                answer: 'kannst',
                options: ['kann', 'kannst', 'können', 'könnt'],
                explanation: 'können com "du": Kannst du mir helfen?'
            },
            {
                type: 'fillBlank',
                question: 'Wir ___ am Samstag kommen.',
                answer: 'können',
                alternatives: [],
                explanation: 'können com "wir": Wir können kommen.'
            }
        ]
    },

    // LEKTION 23: Verabredung
    {
        id: 23,
        title: 'Lektion 23: Verabredung',
        topics: ['Possessivpronomen im Akkusativ'],
        grammarKeys: ['Possessivartikel', 'Akkusativ'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Wo ist ___ (dein) Handy (das)?',
                answer: 'dein',
                alternatives: [],
                explanation: 'Nominativo neutro: dein Handy.'
            },
            {
                type: 'fillBlank',
                question: 'Ich finde ___ (dein) Handy (das) nicht.',
                answer: 'dein',
                alternatives: [],
                explanation: 'Akkusativ neutro não muda: dein Handy.'
            },
            {
                type: 'fillBlank',
                question: 'Hast du ___ (mein) Schlüssel (der) gesehen?',
                answer: 'meinen',
                alternatives: [],
                explanation: 'Akkusativ masculino: mein → meinen Schlüssel.'
            }
        ]
    },

    // LEKTION 25: Zeit und Geld
    {
        id: 25,
        title: 'Lektion 25: Zeit und Geld',
        topics: ['können', 'brauchen', 'Uhrzeiten'],
        grammarKeys: ['Modalverben', 'Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: '8:15 → Es ist acht ___ fünfzehn.',
                answer: 'uhr',
                alternatives: [],
                explanation: 'Formato formal: acht Uhr fünfzehn.'
            },
            {
                type: 'fillBlank',
                question: '10:15 → Es ist Viertel ___ elf.',
                answer: 'nach',
                alternatives: [],
                explanation: 'Formato informal: Viertel nach elf (quinze para as onze).'
            },
            {
                type: 'fillBlank',
                question: '9:30 → Es ist halb ___.',
                answer: 'zehn',
                alternatives: [],
                explanation: 'halb zehn = 9:30 (meia para as dez).'
            }
        ]
    },

    // LEKTION 27: Modalverben Erweitert
    {
        id: 27,
        title: 'Lektion 27: Modalverben',
        topics: ['müssen', 'dürfen', 'Satzklammer mit Modalverben'],
        grammarKeys: ['Modalverben', 'Satzklammer'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich ___ heute nicht ___. (kommen - Modal)',
                answer: 'kann|kommen',
                alternatives: [],
                explanation: 'Modalverb Satzklammer: Ich kann heute nicht kommen.'
            },
            {
                type: 'fillBlank',
                question: 'Sie ___ sehr gut ___. (singen - Modal)',
                answer: 'kann|singen',
                alternatives: [],
                explanation: 'Sie kann sehr gut singen.'
            }
        ]
    },

    // LEKTION 29: Natur
    {
        id: 29,
        title: 'Lektion 29: Natur',
        topics: ['finden', 'suchen', 'Natur-Wortschatz'],
        grammarKeys: ['Wortschatz', 'Verbkonjugation'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Dezember, Januar und Februar sind ___.',
                answer: 'winter',
                alternatives: [],
                explanation: 'Esses meses são no inverno (Winter) no hemisfério norte.'
            },
            {
                type: 'fillBlank',
                question: 'Der Monat nach Juni ist ___.',
                answer: 'juli',
                alternatives: [],
                explanation: 'Depois de junho (Juni) vem julho (Juli).'
            }
        ]
    },

    // LEKTION 31: Kleidung
    {
        id: 31,
        title: 'Lektion 31: Kleidung',
        topics: ['gefallen', 'helfen', 'Dativ Einführung'],
        grammarKeys: ['Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'groß (grande) ≠ ___',
                answer: 'klein',
                alternatives: [],
                explanation: 'O oposto de groß (grande) é klein (pequeno).'
            },
            {
                type: 'fillBlank',
                question: 'alt (velho) ≠ ___',
                answer: 'jung',
                alternatives: ['neu'],
                explanation: 'O oposto de alt pode ser jung (jovem) ou neu (novo).'
            },
            {
                type: 'fillBlank',
                question: 'teuer (caro) ≠ ___',
                answer: 'billig',
                alternatives: ['günstig'],
                explanation: 'O oposto de teuer é billig ou günstig (barato).'
            }
        ]
    },

    // LEKTION 33: Verwandtschaft
    {
        id: 33,
        title: 'Lektion 33: Verwandtschaft',
        topics: ['Personalpronomen im Dativ', 'Familie'],
        grammarKeys: ['Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Die Mutter von meiner Mutter ist meine ___.',
                answer: 'großmutter',
                alternatives: ['grossmutter', 'oma'],
                explanation: 'A mãe da sua mãe é sua avó (Großmutter/Oma).'
            },
            {
                type: 'fillBlank',
                question: 'Der Bruder von meinem Vater ist mein ___.',
                answer: 'onkel',
                alternatives: [],
                explanation: 'O irmão do seu pai é seu tio (Onkel).'
            }
        ]
    },

    // LEKTION 35: Reisen
    {
        id: 35,
        title: 'Lektion 35: Reisen',
        topics: ['Dativ nach "mit"', 'Verkehrsmittel'],
        grammarKeys: ['Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich fahre zur Arbeit ___ ___ ___. (o trem)',
                answer: 'mit|dem|zug',
                alternatives: [],
                explanation: 'mit dem Zug = de trem (preposição "mit" + Dativ).'
            },
            {
                type: 'fillBlank',
                question: 'Wir machen eine ___ nach Berlin.',
                answer: 'reise',
                alternatives: [],
                explanation: 'eine Reise machen = fazer uma viagem.'
            }
        ]
    },

    // LEKTION 37: Glückwünsche
    {
        id: 37,
        title: 'Lektion 37: Glückwünsche',
        topics: ['Adjektive', 'Gratulationen'],
        grammarKeys: ['Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Das Auto ist sehr ___. (schnell)',
                answer: 'schnell',
                alternatives: [],
                explanation: 'Das Auto ist schnell = O carro é rápido.'
            },
            {
                type: 'fillBlank',
                question: 'Das Buch ist ___. (langweilig)',
                answer: 'langweilig',
                alternatives: [],
                explanation: 'langweilig = chato/entediante.'
            }
        ]
    },

    // LEKTION 39: Orte in der Stadt
    {
        id: 39,
        title: 'Lektion 39: Orte in der Stadt',
        topics: ['Wechselpräpositionen', 'Stadtorte'],
        grammarKeys: ['Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Mein ___ (der) ist langsam.',
                answer: 'computer',
                alternatives: [],
                explanation: 'Mein Computer ist langsam = Meu computador é lento.'
            },
            {
                type: 'fillBlank',
                question: 'Der ___ (der) funktioniert nicht.',
                answer: 'drucker',
                alternatives: [],
                explanation: 'der Drucker = a impressora. Der Drucker funktioniert nicht = A impressora não funciona.'
            }
        ]
    },

    // LEKTION 41: Berufe Erweitert
    {
        id: 41,
        title: 'Lektion 41: Berufe',
        topics: ['Ortspräpositionen im Dativ', 'Berufe erweitert'],
        grammarKeys: ['Wortschatz', 'Berufe'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Was ___ Sie von Beruf?',
                answer: 'sind',
                alternatives: [],
                explanation: 'Was sind Sie von Beruf? = Qual é sua profissão?'
            },
            {
                type: 'fillBlank',
                question: 'Ich ___ Lehrerin.',
                answer: 'bin',
                alternatives: [],
                explanation: 'Ich bin Lehrerin = Eu sou professora.'
            },
            {
                type: 'fillBlank',
                question: 'Er ___ als Arzt.',
                answer: 'arbeitet',
                alternatives: [],
                explanation: 'Er arbeitet als Arzt = Ele trabalha como médico.'
            }
        ]
    },

    // LEKTION 43: Pläne
    {
        id: 43,
        title: 'Lektion 43: Pläne',
        topics: ['für', 'um (zu)', 'Zukunftspläne'],
        grammarKeys: ['Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: '___ Tisch ist neu.',
                answer: 'der',
                alternatives: [],
                explanation: 'Nominativo masculino: Der Tisch ist neu.'
            },
            {
                type: 'fillBlank',
                question: 'Ich kaufe ___ Tisch.',
                answer: 'den',
                alternatives: [],
                explanation: 'Akkusativ masculino: Ich kaufe den Tisch.'
            }
        ]
    },

    // LEKTION 45: Feste
    {
        id: 45,
        title: 'Lektion 45: Ostern und Weihnachten',
        topics: ['Dativverben', 'Feste'],
        grammarKeys: ['Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich habe zwei ___. (Bruder)',
                answer: 'brüder',
                alternatives: ['brueder'],
                explanation: 'Plural de Bruder: die Brüder (com Umlaut).'
            },
            {
                type: 'fillBlank',
                question: 'Das kostet ___ Euro. (100)',
                answer: 'hundert',
                alternatives: [],
                explanation: '100 = (ein)hundert.'
            }
        ]
    },

    // LEKTION 47: Telefon
    {
        id: 47,
        title: 'Lektion 47: Telefon',
        topics: ['zu Hause / nach Hause', 'Telefonieren'],
        grammarKeys: ['Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich ___ Deutsch.',
                answer: 'lerne',
                alternatives: [],
                explanation: 'Presente simples: Ich lerne Deutsch.'
            },
            {
                type: 'fillBlank',
                question: 'Er ___ gern Pizza.',
                answer: 'isst',
                alternatives: [],
                explanation: 'Vokalwechsel: Er isst gern Pizza.'
            }
        ]
    },

    // LEKTION 49: Tageszeiten
    {
        id: 49,
        title: 'Lektion 49: Tageszeiten',
        topics: ['Temporale Präpositionen erweitert', 'Tageszeiten'],
        grammarKeys: ['Temporale-Präpositionen', 'Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: '___ Sommer ist es heiß.',
                answer: 'im',
                alternatives: [],
                explanation: 'Estações usam "im": Im Sommer ist es heiß.'
            },
            {
                type: 'fillBlank',
                question: 'Der Kurs beginnt ___ 18:30 Uhr.',
                answer: 'um',
                alternatives: [],
                explanation: 'Horas exatas usam "um": um 18:30 Uhr.'
            },
            {
                type: 'fillBlank',
                question: '___ Mittwoch habe ich einen Termin.',
                answer: 'am',
                alternatives: [],
                explanation: 'Dias da semana usam "am": am Mittwoch.'
            }
        ]
    },

    // LEKTION 51: Perfekt com haben
    {
        id: 51,
        title: 'Lektion 51: Perfekt mit haben',
        topics: ['Perfekt regelmäßig', 'haben als Hilfsverb'],
        grammarKeys: ['Perfekt', 'Perfekt-haben', 'Satzklammer'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich ___ Deutsch ___. (lernen)',
                answer: 'habe|gelernt',
                alternatives: [],
                explanation: 'Perfekt com haben: Ich habe Deutsch gelernt. (ge + Raiz + t)'
            },
            {
                type: 'fillBlank',
                question: 'Er ___ Musik ___. (hören)',
                answer: 'hat|gehört',
                alternatives: ['hat|gehoert'],
                explanation: 'Perfekt: Er hat Musik gehört.'
            },
            {
                type: 'multipleChoice',
                question: '___ (du) die Hausaufgaben ___? (machen)',
                answer: 'hast|gemacht',
                options: ['habe|gemacht', 'hast|gemacht', 'hat|gemacht', 'haben|gemacht'],
                explanation: 'Perfekt com du: Hast du die Hausaufgaben gemacht?'
            },
            {
                type: 'fillBlank',
                question: 'Wir ___ Pizza ___. (kochen)',
                answer: 'haben|gekocht',
                alternatives: [],
                explanation: 'Perfekt: Wir haben Pizza gekocht.'
            }
        ]
    },

    // LEKTION 53: Perfekt com sein
    {
        id: 53,
        title: 'Lektion 53: Perfekt mit sein',
        topics: ['Perfekt mit sein', 'Bewegungsverben'],
        grammarKeys: ['Perfekt', 'Perfekt-sein', 'Satzklammer'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich ___ nach Berlin ___. (fahren)',
                answer: 'bin|gefahren',
                alternatives: [],
                explanation: 'Movimento usa sein: Ich bin nach Berlin gefahren.'
            },
            {
                type: 'fillBlank',
                question: 'Er ___ ins Kino ___. (gehen)',
                answer: 'ist|gegangen',
                alternatives: [],
                explanation: 'gehen usa sein: Er ist ins Kino gegangen.'
            },
            {
                type: 'fillBlank',
                question: 'Wir ___ nach Hause ___. (laufen)',
                answer: 'sind|gelaufen',
                alternatives: [],
                explanation: 'Movimento: Wir sind nach Hause gelaufen.'
            },
            {
                type: 'fillBlank',
                question: '___ (du) gestern ___? (kommen)',
                answer: 'bist|gekommen',
                alternatives: [],
                explanation: 'kommen usa sein: Bist du gestern gekommen?'
            },
            {
                type: 'fillBlank',
                question: 'Sie (pl.) ___ in die USA ___. (fliegen)',
                answer: 'sind|geflogen',
                alternatives: [],
                explanation: 'fliegen usa sein: Sie sind in die USA geflogen.'
            }
        ]
    },

    // LEKTION 55: Jahreszeiten
    {
        id: 55,
        title: 'Lektion 55: Jahreszeiten',
        topics: ['Perfekt regelmäßig erweitert', 'Jahreszeiten'],
        grammarKeys: ['Perfekt', 'Perfekt-haben', 'Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich ___ zu Hause ___. (bleiben)',
                answer: 'bin|geblieben',
                alternatives: [],
                explanation: 'bleiben usa sein: Ich bin zu Hause geblieben.'
            },
            {
                type: 'fillBlank',
                question: 'Er ___ gestern krank ___. (sein)',
                answer: 'ist|gewesen',
                alternatives: [],
                explanation: 'sein im Perfekt: Er ist krank gewesen.'
            },
            {
                type: 'fillBlank',
                question: 'Wir ___ um 7 Uhr ___. (aufstehen)',
                answer: 'sind|aufgestanden',
                alternatives: [],
                explanation: 'aufstehen usa sein: Wir sind um 7 Uhr aufgestanden.'
            }
        ]
    },

    // LEKTION 57: Lebensläufe
    {
        id: 57,
        title: 'Lektion 57: Lebensläufe',
        topics: ['Perfekt unregelmäßig', 'Biografien'],
        grammarKeys: ['Perfekt', 'Perfekt-haben', 'Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich ___ ein Buch ___. (lesen)',
                answer: 'habe|gelesen',
                alternatives: [],
                explanation: 'Perfekt irregular: Ich habe ein Buch gelesen.'
            },
            {
                type: 'fillBlank',
                question: 'Er ___ seinen Freund ___. (treffen)',
                answer: 'hat|getroffen',
                alternatives: [],
                explanation: 'treffen im Perfekt: Er hat seinen Freund getroffen.'
            },
            {
                type: 'fillBlank',
                question: 'Wir ___ Wasser ___. (trinken)',
                answer: 'haben|getrunken',
                alternatives: [],
                explanation: 'trinken im Perfekt: Wir haben Wasser getrunken.'
            },
            {
                type: 'fillBlank',
                question: '___ (ihr) den Film ___? (sehen)',
                answer: 'habt|gesehen',
                alternatives: [],
                explanation: 'sehen im Perfekt: Habt ihr den Film gesehen?'
            }
        ]
    },

    // LEKTION 59: Wetter
    {
        id: 59,
        title: 'Lektion 59: Wetter',
        topics: ['Perfekt ohne "ge-"', 'Wetter-Wortschatz'],
        grammarKeys: ['Perfekt', 'Verben-ieren', 'Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich ___ Deutsch ___. (studieren)',
                answer: 'habe|studiert',
                alternatives: [],
                explanation: 'Verben auf -ieren: kein "ge-"! Ich habe Deutsch studiert.'
            },
            {
                type: 'fillBlank',
                question: '___ (du) das Auto ___? (reparieren)',
                answer: 'hast|repariert',
                alternatives: [],
                explanation: 'reparieren ohne "ge-": Hast du das Auto repariert?'
            },
            {
                type: 'fillBlank',
                question: 'Er ___ mit mir ___. (telefonieren)',
                answer: 'hat|telefoniert',
                alternatives: [],
                explanation: 'telefonieren: Er hat mit mir telefoniert.'
            },
            {
                type: 'fillBlank',
                question: 'Ich ___ (anrufen) dich ___.',
                answer: 'habe|angerufen',
                alternatives: [],
                explanation: 'Trennbar im Perfekt: Ich habe dich angerufen (ge no meio!).'
            },
            {
                type: 'fillBlank',
                question: 'Er ___ (einkaufen) im Supermarkt ___.',
                answer: 'hat|eingekauft',
                alternatives: [],
                explanation: 'einkaufen im Perfekt: Er hat eingekauft.'
            }
        ]
    },

    // Exercícios de revisão/mistura distribuídos nas lições restantes
    
    // LEKTION 60-65: Revisão e consolidação
    {
        id: 60,
        title: 'Lektion 60: Wiederholung Teil 1',
        topics: ['Wiederholung: Artikel, Negation, Perfekt'],
        grammarKeys: ['Artikel', 'Negation-nicht', 'Negativartikel', 'Perfekt'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich habe ___ Zeit. (die Zeit)',
                answer: 'keine',
                alternatives: [],
                explanation: 'Negação de substantivo feminino: keine Zeit.'
            },
            {
                type: 'fillBlank',
                question: 'Er ist ___ mein Freund.',
                answer: 'nicht',
                alternatives: [],
                explanation: 'nicht antes de possessivo: Er ist nicht mein Freund.'
            },
            {
                type: 'fillBlank',
                question: 'Wir kaufen ___ Auto. (das Auto)',
                answer: 'kein',
                alternatives: [],
                explanation: 'Negação de substantivo neutro: kein Auto.'
            },
            {
                type: 'fillBlank',
                question: 'Das finde ich ___ gut.',
                answer: 'nicht',
                alternatives: [],
                explanation: 'nicht antes de adjetivo: nicht gut.'
            },
            {
                type: 'fillBlank',
                question: 'Was ___ du gestern ___? (machen)',
                answer: 'hast|gemacht',
                alternatives: [],
                explanation: 'Perfekt: Was hast du gestern gemacht?'
            }
        ]
    },

    {
        id: 61,
        title: 'Lektion 61: Wiederholung Teil 2',
        topics: ['Wiederholung: Vokalwechsel, Trennbar, Temporal'],
        grammarKeys: ['Vokalwechsel', 'Trennbare-Verben', 'Temporale-Präpositionen'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Er ___ (lesen) ein Buch.',
                answer: 'liest',
                alternatives: [],
                explanation: 'Vokalwechsel e→ie: Er liest ein Buch.'
            },
            {
                type: 'fillBlank',
                question: 'Du ___ (sprechen) zu schnell.',
                answer: 'sprichst',
                alternatives: [],
                explanation: 'Vokalwechsel e→i: Du sprichst zu schnell.'
            },
            {
                type: 'fillBlank',
                question: 'Ich ___ (anrufen) dich morgen ___.',
                answer: 'rufe|an',
                alternatives: [],
                explanation: 'Trennbar: Ich rufe dich morgen an.'
            },
            {
                type: 'fillBlank',
                question: 'Der Zug ___ (abfahren) um 10 Uhr ___.',
                answer: 'fährt|ab',
                alternatives: ['faehrt|ab'],
                explanation: 'Trennbar: Der Zug fährt um 10 Uhr ab.'
            },
            {
                type: 'fillBlank',
                question: '___ 8:00 Uhr (hora exata)',
                answer: 'um',
                alternatives: [],
                explanation: 'Horas exatas: um 8:00 Uhr.'
            }
        ]
    },

    {
        id: 62,
        title: 'Lektion 62: Wiederholung Teil 3',
        topics: ['Wiederholung: Satzklammer, Perfekt haben/sein'],
        grammarKeys: ['Satzklammer', 'Perfekt', 'Perfekt-haben', 'Perfekt-sein'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich ___ heute ___. (arbeiten - Modal)',
                answer: 'muss|arbeiten',
                alternatives: ['kann|arbeiten'],
                explanation: 'Satzklammer Modal: Ich muss heute arbeiten.'
            },
            {
                type: 'fillBlank',
                question: 'Ich ___ heute ___. (arbeiten - Perfekt)',
                answer: 'habe|gearbeitet',
                alternatives: [],
                explanation: 'Satzklammer Perfekt: Ich habe heute gearbeitet.'
            },
            {
                type: 'fillBlank',
                question: 'Er ___ nach Hause ___. (gehen)',
                answer: 'ist|gegangen',
                alternatives: [],
                explanation: 'Movimento usa sein: Er ist nach Hause gegangen.'
            },
            {
                type: 'fillBlank',
                question: 'Sie ___ ein Buch ___. (lesen)',
                answer: 'hat|gelesen',
                alternatives: [],
                explanation: 'haben im Perfekt: Sie hat ein Buch gelesen.'
            }
        ]
    },

    {
        id: 63,
        title: 'Lektion 63: Wortschatz Mix 1',
        topics: ['Wortschatz: Essen, Familie, Berufe'],
        grammarKeys: ['Wortschatz'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich kaufe drei ___. (der Apfel)',
                answer: 'äpfel',
                alternatives: ['aepfel'],
                explanation: 'Plural mit Umlaut: die Äpfel.'
            },
            {
                type: 'fillBlank',
                question: 'Ich esse zwei ___. (die Banane)',
                answer: 'bananen',
                alternatives: [],
                explanation: 'Plural -n: die Bananen.'
            },
            {
                type: 'fillBlank',
                question: 'Thomas ist ___. (Programmierer)',
                answer: 'programmierer',
                alternatives: [],
                explanation: 'Beruf männlich: Programmierer.'
            },
            {
                type: 'fillBlank',
                question: 'Anna ist ___. (Programmiererin)',
                answer: 'programmiererin',
                alternatives: [],
                explanation: 'Beruf weiblich: Programmiererin.'
            }
        ]
    },

    {
        id: 64,
        title: 'Lektion 64: Wortschatz Mix 2',
        topics: ['Wortschatz: Möbel, Transport, Alltag'],
        grammarKeys: ['Wortschatz', 'Akkusativ'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich kaufe ___ Tisch. (der)',
                answer: 'einen',
                alternatives: [],
                explanation: 'Akkusativ masculino: einen Tisch.'
            },
            {
                type: 'fillBlank',
                question: 'Wir brauchen ___ Lampe. (die)',
                answer: 'eine',
                alternatives: [],
                explanation: 'Akkusativ feminino: eine Lampe.'
            },
            {
                type: 'fillBlank',
                question: 'Ich nehme ___ Bus. (der)',
                answer: 'einen',
                alternatives: [],
                explanation: 'Akkusativ: einen Bus.'
            },
            {
                type: 'fillBlank',
                question: 'Morgens ___ ich um 7 Uhr ___. (aufstehen)',
                answer: 'stehe|auf',
                alternatives: [],
                explanation: 'Trennbar: Ich stehe um 7 Uhr auf.'
            }
        ]
    },

    {
        id: 65,
        title: 'Lektion 65: Perfekt Übungen',
        topics: ['Perfekt intensive Übung'],
        grammarKeys: ['Perfekt', 'Perfekt-haben', 'Perfekt-sein'],
        exercises: [
            {
                type: 'fillBlank',
                question: 'Ich ___ gestern ___. (schwimmen)',
                answer: 'bin|geschwommen',
                alternatives: ['habe|geschwommen'],
                explanation: 'schwimmen kann haben oder sein sein! Ich bin geschwommen.'
            },
            {
                type: 'fillBlank',
                question: 'Er ___ ein Buch ___. (lesen)',
                answer: 'hat|gelesen',
                alternatives: [],
                explanation: 'Perfekt: Er hat ein Buch gelesen.'
            },
            {
                type: 'fillBlank',
                question: 'Wir ___ Freunde ___. (treffen)',
                answer: 'haben|getroffen',
                alternatives: [],
                explanation: 'treffen mit haben: Wir haben Freunde getroffen.'
            },
            {
                type: 'fillBlank',
                question: 'Sie ___ ins Kino ___. (gehen)',
                answer: 'ist|gegangen',
                alternatives: [],
                explanation: 'Bewegung: Sie ist ins Kino gegangen.'
            }
        ]
    },

    {
        id: 66,
        title: 'Lektion 66: Satzbildung Übungen',
        topics: ['Satzbau in verschiedenen Zeiten'],
        grammarKeys: ['Satzklammer', 'Verbkonjugation'],
        exercises: [
            {
                type: 'multipleChoice',
                question: 'Ordnen Sie: Ich - Deutsch - lerne - in Berlin.',
                answer: 'Ich lerne Deutsch in Berlin.',
                options: ['Ich lerne Deutsch in Berlin.', 'Ich Deutsch lerne in Berlin.', 'In Berlin lerne ich Deutsch.', 'Deutsch lerne ich in Berlin.'],
                explanation: 'Richtige Wortstellung: Ich lerne Deutsch in Berlin.'
            },
            {
                type: 'multipleChoice',
                question: 'Ordnen Sie (Perfekt): Ich - Deutsch - gelernt - habe - in Berlin.',
                answer: 'Ich habe in Berlin Deutsch gelernt.',
                options: ['Ich habe in Berlin Deutsch gelernt.', 'Ich habe Deutsch gelernt in Berlin.', 'In Berlin habe ich Deutsch gelernt.', 'Ich Deutsch habe in Berlin gelernt.'],
                explanation: 'Perfekt Satzklammer: Ich habe in Berlin Deutsch gelernt.'
            }
        ]
    },

    {
        id: 67,
        title: 'Lektion 67: W-Fragen Vertiefung',
        topics: ['W-Fragen in verschiedenen Kontexten'],
        grammarKeys: ['W-Fragen', 'Entscheidungsfragen'],
        exercises: [
            {
                type: 'fillBlank',
                question: '___ ist deine Telefonnummer?',
                answer: 'wie',
                alternatives: [],
                explanation: 'Wie fragt nach der Telefonnummer.'
            },
            {
                type: 'fillBlank',
                question: '___ fährst du im Urlaub? (destino)',
                answer: 'wohin',
                alternatives: [],
                explanation: 'Wohin fragt nach dem Ziel/Destination.'
            },
            {
                type: 'fillBlank',
                question: '___ ist dein Lieblingssänger? (pessoa)',
                answer: 'wer',
                alternatives: [],
                explanation: 'Wer fragt nach Personen.'
            },
            {
                type: 'fillBlank',
                question: '___ lernst du Deutsch? (motivo)',
                answer: 'warum',
                alternatives: [],
                explanation: 'Warum fragt nach dem Grund.'
            }
        ]
    },

    {
        id: 68,
        title: 'Lektion 68: Artikel-Training',
        topics: ['Artikel Nominativ vs. Akkusativ'],
        grammarKeys: ['Artikel', 'Akkusativ'],
        exercises: [
            {
                type: 'fillBlank',
                question: '___ Stuhl ist alt. (Nominativ)',
                answer: 'der',
                alternatives: [],
                explanation: 'Nominativo masculino: Der Stuhl.'
            },
            {
                type: 'fillBlank',
                question: 'Ich kaufe ___ Stuhl. (Akkusativ)',
                answer: 'den',
                alternatives: [],
                explanation: 'Akkusativ masculino: den Stuhl.'
            },
            {
                type: 'fillBlank',
                question: 'Ich suche ___ Stift. (irgendeinen)',
                answer: 'einen',
                alternatives: [],
                explanation: 'Indefiniter Artikel Akkusativ: einen Stift.'
            },
            {
                type: 'fillBlank',
                question: 'Ich suche ___ Stift von dir. (den spezifischen)',
                answer: 'den',
                alternatives: [],
                explanation: 'Definiter Artikel Akkusativ: den Stift.'
            }
        ]
    },

    {
        id: 69,
        title: 'Lektion 69: Possessivartikel-Training',
        topics: ['Possessivartikel in verschiedenen Fällen'],
        grammarKeys: ['Possessivartikel', 'Akkusativ'],
        exercises: [
            {
                type: 'fillBlank',
                question: '___ Computer (der) ist alt. (Nominativ)',
                answer: 'mein',
                alternatives: [],
                explanation: 'Nominativo masculino: Mein Computer.'
            },
            {
                type: 'fillBlank',
                question: 'Ich benutze ___ Computer (der) nicht. (Akkusativ)',
                answer: 'meinen',
                alternatives: [],
                explanation: 'Akkusativ masculino: meinen Computer.'
            },
            {
                type: 'fillBlank',
                question: '___ Tasche (die) ist schwer. (Nominativ)',
                answer: 'meine',
                alternatives: [],
                explanation: 'Nominativo feminino: Meine Tasche.'
            },
            {
                type: 'fillBlank',
                question: 'Er nimmt ___ Tasche (die). (Akkusativ)',
                answer: 'meine',
                alternatives: [],
                explanation: 'Akkusativ feminino (não muda): meine Tasche.'
            }
        ]
    },

    {
        id: 70,
        title: 'Lektion 70: Final Review - Alles zusammen',
        topics: ['Comprehensive Review'],
        grammarKeys: ['W-Fragen', 'Perfekt', 'Satzklammer', 'Akkusativ', 'Temporale-Präpositionen'],
        exercises: [
            {
                type: 'fillBlank',
                question: '___ hast du gestern gemacht?',
                answer: 'was',
                alternatives: [],
                explanation: 'W-Frage im Perfekt: Was hast du gemacht?'
            },
            {
                type: 'fillBlank',
                question: 'Ich ___ ___ Berlin Deutsch ___. (lernen - Perfekt)',
                answer: 'habe|in|gelernt',
                alternatives: [],
                explanation: 'Perfekt: Ich habe in Berlin Deutsch gelernt.'
            },
            {
                type: 'fillBlank',
                question: 'Ich ___ in Berlin Deutsch ___. (lernen - Modal)',
                answer: 'kann|lernen',
                alternatives: [],
                explanation: 'Modal: Ich kann in Berlin Deutsch lernen.'
            },
            {
                type: 'multipleChoice',
                question: 'Was ist richtig?',
                answer: 'Ich stehe um 7 Uhr auf.',
                options: ['Ich stehe um 7 Uhr auf.', 'Ich stehe auf um 7 Uhr.', 'Um 7 Uhr ich stehe auf.', 'Ich um 7 Uhr aufstehe.'],
                explanation: 'Trennbar im Präsens: Ich stehe um 7 Uhr auf.'
            },
            {
                type: 'fillBlank',
                question: 'Ich habe jetzt ___. (anfangen - Perfekt)',
                answer: 'angefangen',
                alternatives: [],
                explanation: 'Trennbar im Perfekt: Ich habe jetzt angefangen (ge no meio).'
            }
        ]
    }
];
