// Programme Masse & Esthétique : 32 semaines, 4 blocs de 8 semaines, 3 séances par semaine.
// Toutes les séances sont générées à partir de ces données.

export const BLOCKS = [
  {
    id: 1, name: 'Fondation', plate: 10, color: '#2fa55c', ink: '#06210f',
    weeks: [1, 8],
    goal: 'Tenir 3 séances par semaine et faire monter les charges sur des exercices simples à mesurer.',
    why: [
      'Exercices stables et faciles à charger : la double progression marche semaine après semaine.',
      'Rowing poitrine appuyée plutôt que rowing barre : zéro fatigue lombaire.',
      'Volume modéré : sans calories pour construire, plus de séries ne sert à rien.',
    ],
  },
  {
    id: 2, name: 'Volume', plate: 15, color: '#f0be2c', ink: '#2a1f00',
    weeks: [9, 16],
    goal: 'Maximiser la prise de muscle : plus de séries, des reps plus hautes et des séries poussées près de l\'échec sur l\'isolation.',
    why: [
      'Bases en 8-10 reps : plus de travail par série, moins de stress articulaire.',
      'Smith et machines : la trajectoire guidée permet d\'aller près de l\'échec sans risque.',
      'Nouveaux angles (hack squat, rowing unilatéral, prise large, curl pupitre) après 8 semaines.',
      'Rest-pause sur la dernière série marquée RP : échec, 15 s, 3-5 reps, 15 s, 2-4 reps.',
    ],
  },
  {
    id: 3, name: 'Force', plate: 20, color: '#3a78e6', ink: '#03122e',
    weeks: [17, 24],
    goal: 'Transformer la masse en force : charges lourdes sur les bases, volume total réduit d\'environ 15 %.',
    why: [
      'Bases en 4-6 reps et 3 min de repos : la zone qui fait le plus progresser la force.',
      'Retour aux poids libres : militaire debout, rowing barre, dips lestés, fentes bulgares.',
      'Pas de RIR 0 sur les bases : RIR 1-2 maximum, technique parfaite.',
    ],
  },
  {
    id: 4, name: 'Esthétique', plate: 25, color: '#e5483f', ink: '#2e0503',
    weeks: [25, 32],
    goal: 'Tout mettre sur le V : épaules latérales, haut des pecs, largeur du dos, bras. On maintient la force.',
    why: [
      'Le développé incliné passe en premier : ce qu\'on fait frais progresse le plus.',
      'Élévations latérales aux 3 séances : c\'est le faisceau latéral qui élargit la carrure.',
      'Bases en 3 x 6-8 : maintenir la force coûte bien moins que la construire.',
      'Myo-reps sur les latérales : une série à RIR 0-1 puis 3 mini-séries de 3-5 reps.',
    ],
  },
];

export const SESSION_META = {
  A: { name: 'Poussée', short: 'Push', muscles: 'Pecs, épaules, triceps' },
  B: { name: 'Jambes', short: 'Legs', muscles: 'Jambes, abdos, épaules latérales' },
  C: { name: 'Tirage', short: 'Pull', muscles: 'Dos, biceps, arrière d\'épaule' },
};

// eq : barre | smith | halteres | machine | poulie | pdc (lest)
// inc : saut de charge conseillé (kg) ; m : muscle principal (volume hebdo)
export const EX = {
  'Développé couché barre': { eq: 'barre', inc: 2.5, m: 'Pecs', key: 'bench' },
  'Développé incliné haltères 30°': { eq: 'halteres', inc: 2, m: 'Pecs', key: 'incline' },
  'Développé incliné à la Smith': { eq: 'smith', inc: 2.5, m: 'Pecs', key: 'incline' },
  'Développé militaire haltères assis': { eq: 'halteres', inc: 2, m: 'Épaules' },
  'Développé militaire barre debout': { eq: 'barre', inc: 2.5, m: 'Épaules' },
  'Presse épaules machine': { eq: 'machine', inc: 2.5, m: 'Épaules' },
  'Élévations latérales': { eq: 'halteres', inc: 1, m: 'Latérales' },
  'Élévations latérales haltères': { eq: 'halteres', inc: 1, m: 'Latérales' },
  'Élévations latérales poulie': { eq: 'poulie', inc: 1.25, m: 'Latérales' },
  'Élévations latérales poulie unilatérale': { eq: 'poulie', inc: 1.25, m: 'Latérales' },
  'Extension triceps poulie corde': { eq: 'poulie', inc: 2.5, m: 'Triceps' },
  'Extension triceps poulie barre droite': { eq: 'poulie', inc: 2.5, m: 'Triceps' },
  'Extension triceps au-dessus de la tête poulie': { eq: 'poulie', inc: 2.5, m: 'Triceps' },
  'Écarté poulie haute vers le bas': { eq: 'poulie', inc: 2.5, m: 'Pecs' },
  'Écarté poulie basse vers le haut': { eq: 'poulie', inc: 2.5, m: 'Pecs' },
  'Pec deck': { eq: 'machine', inc: 2.5, m: 'Pecs' },
  'Dips lestés': { eq: 'pdc', inc: 2.5, m: 'Pecs' },
  'Squat barre': { eq: 'barre', inc: 2.5, m: 'Quadriceps', key: 'squat' },
  'Soulevé de terre roumain barre': { eq: 'barre', inc: 2.5, m: 'Ischios', key: 'rdl' },
  'Presse à cuisses': { eq: 'machine', inc: 5, m: 'Quadriceps' },
  'Hack squat': { eq: 'machine', inc: 5, m: 'Quadriceps' },
  'Fentes bulgares haltères': { eq: 'halteres', inc: 2, m: 'Quadriceps' },
  'Leg curl assis': { eq: 'machine', inc: 2.5, m: 'Ischios' },
  'Mollets debout machine': { eq: 'machine', inc: 5, m: 'Mollets' },
  'Mollets assis machine': { eq: 'machine', inc: 5, m: 'Mollets' },
  'Relevés de jambes suspendu': { eq: 'pdc', inc: 0, m: 'Abdos' },
  'Crunch poulie haute à genoux': { eq: 'poulie', inc: 2.5, m: 'Abdos' },
  'Roulette abdominale': { eq: 'pdc', inc: 0, m: 'Abdos' },
  'Tractions pronation': { eq: 'pdc', inc: 2.5, m: 'Dos', key: 'pullup' },
  'Tractions lestées': { eq: 'pdc', inc: 2.5, m: 'Dos', key: 'pullup' },
  'Rowing poitrine appuyée': { eq: 'machine', inc: 2.5, m: 'Dos' },
  'Rowing haltère unilatéral': { eq: 'halteres', inc: 2, m: 'Dos' },
  'Rowing barre penché': { eq: 'barre', inc: 2.5, m: 'Dos' },
  'Tirage vertical prise neutre': { eq: 'poulie', inc: 2.5, m: 'Dos' },
  'Tirage vertical prise large': { eq: 'poulie', inc: 2.5, m: 'Dos' },
  'Pull-over poulie haute': { eq: 'poulie', inc: 2.5, m: 'Dos' },
  'Oiseau poulie': { eq: 'poulie', inc: 1.25, m: 'Arrière d\'épaule' },
  'Face pull': { eq: 'poulie', inc: 2.5, m: 'Arrière d\'épaule' },
  'Reverse pec deck': { eq: 'machine', inc: 2.5, m: 'Arrière d\'épaule' },
  'Curl marteau': { eq: 'halteres', inc: 2, m: 'Biceps' },
  'Curl incliné haltères': { eq: 'halteres', inc: 2, m: 'Biceps' },
  'Curl barre EZ': { eq: 'barre', inc: 2.5, m: 'Biceps', bar: 10 },
  'Curl pupitre machine': { eq: 'machine', inc: 2.5, m: 'Biceps' },
  // Variantes de remplacement
  'Développé couché haltères': { eq: 'halteres', inc: 2, m: 'Pecs' },
  'Développé couché machine': { eq: 'machine', inc: 2.5, m: 'Pecs' },
  'Développé incliné machine': { eq: 'machine', inc: 2.5, m: 'Pecs' },
  'Pompes lestées': { eq: 'pdc', inc: 2.5, m: 'Pecs' },
  'Élévations latérales machine': { eq: 'machine', inc: 2.5, m: 'Latérales' },
  'Barre au front EZ': { eq: 'barre', inc: 2.5, m: 'Triceps', bar: 10 },
  'Dips machine': { eq: 'machine', inc: 5, m: 'Triceps' },
  'Squat à la Smith': { eq: 'smith', inc: 2.5, m: 'Quadriceps' },
  'Goblet squat': { eq: 'halteres', inc: 2, m: 'Quadriceps' },
  'Leg extension': { eq: 'machine', inc: 2.5, m: 'Quadriceps' },
  'Leg curl allongé': { eq: 'machine', inc: 2.5, m: 'Ischios' },
  'Soulevé de terre roumain haltères': { eq: 'halteres', inc: 2, m: 'Ischios' },
  'Hip thrust': { eq: 'barre', inc: 5, m: 'Ischios' },
  'Mollets à la presse': { eq: 'machine', inc: 5, m: 'Mollets' },
  'Gainage planche': { eq: 'pdc', inc: 0, m: 'Abdos' },
  'Tirage vertical machine': { eq: 'machine', inc: 2.5, m: 'Dos' },
  'Tractions assistées machine': { eq: 'machine', inc: 2.5, m: 'Dos' },
  'Tirage horizontal poulie': { eq: 'poulie', inc: 2.5, m: 'Dos' },
  'Rowing machine convergente': { eq: 'machine', inc: 2.5, m: 'Dos' },
  'Curl poulie basse': { eq: 'poulie', inc: 2.5, m: 'Biceps' },
  'Curl haltères debout': { eq: 'halteres', inc: 2, m: 'Biceps' },
};

// Remplacements proposés, par muscle principal
export const ALTERNATIVES = {
  'Pecs': ['Développé couché haltères', 'Développé couché machine', 'Développé incliné haltères 30°', 'Développé incliné à la Smith', 'Développé incliné machine', 'Pec deck', 'Écarté poulie haute vers le bas', 'Écarté poulie basse vers le haut', 'Dips lestés', 'Pompes lestées'],
  'Épaules': ['Développé militaire haltères assis', 'Presse épaules machine', 'Développé militaire barre debout'],
  'Latérales': ['Élévations latérales haltères', 'Élévations latérales poulie', 'Élévations latérales poulie unilatérale', 'Élévations latérales machine'],
  'Triceps': ['Extension triceps poulie corde', 'Extension triceps poulie barre droite', 'Extension triceps au-dessus de la tête poulie', 'Barre au front EZ', 'Dips machine'],
  'Quadriceps': ['Squat à la Smith', 'Hack squat', 'Presse à cuisses', 'Goblet squat', 'Fentes bulgares haltères', 'Leg extension'],
  'Ischios': ['Soulevé de terre roumain haltères', 'Leg curl assis', 'Leg curl allongé', 'Hip thrust'],
  'Mollets': ['Mollets debout machine', 'Mollets assis machine', 'Mollets à la presse'],
  'Abdos': ['Relevés de jambes suspendu', 'Crunch poulie haute à genoux', 'Roulette abdominale', 'Gainage planche'],
  'Dos': ['Tirage vertical prise neutre', 'Tirage vertical prise large', 'Tirage vertical machine', 'Tractions assistées machine', 'Rowing poitrine appuyée', 'Rowing haltère unilatéral', 'Rowing barre penché', 'Tirage horizontal poulie', 'Rowing machine convergente', 'Pull-over poulie haute'],
  'Arrière d\'épaule': ['Oiseau poulie', 'Face pull', 'Reverse pec deck'],
  'Biceps': ['Curl incliné haltères', 'Curl marteau', 'Curl barre EZ', 'Curl pupitre machine', 'Curl poulie basse', 'Curl haltères debout'],
};

// [ordre, exercice, prescription, repos, note]
const B1 = {
  A: [['1', 'Développé couché barre', '4 x 6-8', "2'30-3'", 'Départ 55 kg. Omoplates serrées, pieds ancrés'],
    ['2', 'Développé incliné haltères 30°', '3 x 8-12', "2'", 'Départ 18 kg. Coudes à 45° du buste'],
    ['3', 'Développé militaire haltères assis', '3 x 8-12', "2'", 'Départ 18 kg'],
    ['4a', 'Élévations latérales', '4 x 12-20', 'superset', 'Départ 8 kg. Jusqu\'à l\'horizontale, sans élan'],
    ['4b', 'Extension triceps poulie corde', '3 x 10-15', '75 s', ''],
    ['5', 'Écarté poulie haute vers le bas', '3 x 12-15', '75 s', 'Bras légèrement fléchis, étire bien'],
    ['6', 'Extension triceps au-dessus de la tête poulie', '2 x 10-15', '75 s', 'Coudes fixes, étirement complet']],
  B: [['1', 'Squat barre', '4 x 6-8', "3'", 'Départ 55 kg. Cuisses au moins parallèles'],
    ['2', 'Soulevé de terre roumain barre', '3 x 8-10', "2'30", 'Départ 50 kg. Dos plat, barre contre les cuisses'],
    ['3', 'Presse à cuisses', '3 x 10-15', "2'", 'Descends jusqu\'à ce que le bassin commence à décoller'],
    ['4', 'Leg curl assis', '3 x 10-15', '90 s', 'Buste penché en avant pour étirer les ischios'],
    ['5a', 'Mollets debout machine', '3 x 10-15', 'superset', 'Pause 1 s en bas, étiré'],
    ['5b', 'Relevés de jambes suspendu', '3 x 10-15', '60 s', 'Enroule le bassin, pas juste les jambes'],
    ['6', 'Élévations latérales haltères', '3 x 15-20', '60 s', '2e dose de la semaine']],
  C: [['1', 'Tractions pronation', '4 x 3-5', "2'30", 'Strict, bras tendus en bas. kg = lest'],
    ['2', 'Rowing poitrine appuyée', '3 x 8-10', "2'", 'Tire les coudes vers les hanches'],
    ['3', 'Tirage vertical prise neutre', '3 x 10-12', "2'", 'Poitrine vers la barre, pas de balancier'],
    ['4', 'Pull-over poulie haute', '3 x 12-15', '90 s', 'Bras presque tendus, sens l\'étirement du grand dorsal'],
    ['5a', 'Oiseau poulie', '3 x 15-20', 'superset', 'Léger, contrôlé (ou face pull)'],
    ['5b', 'Curl marteau', '2 x 10-12', '60 s', 'Départ 12 kg'],
    ['6', 'Curl incliné haltères', '3 x 8-12', '90 s', 'Départ 10 kg. Bras derrière le buste']],
};
const B2 = {
  A: [['1', 'Développé couché barre', '4 x 8-10', "2'30", '-10 % sous ta charge de fin de bloc 1'],
    ['2', 'Développé incliné à la Smith', '4 x 8-12', "2'", 'Barre au niveau du haut des pecs'],
    ['3', 'Presse épaules machine', '3 x 10-12', "2'", ''],
    ['4a', 'Élévations latérales poulie unilatérale', '4 x 12-20', 'superset', 'Poulie basse, câble derrière le corps. RP dernière série'],
    ['4b', 'Extension triceps au-dessus de la tête poulie', '3 x 10-15', '75 s', ''],
    ['5', 'Pec deck', '3 x 12-15', '75 s', 'RP dernière série'],
    ['6', 'Extension triceps poulie barre droite', '2 x 12-15', '60 s', '']],
  B: [['1', 'Squat barre', '4 x 8-10', "3'", '-10 % sous ta charge de fin de bloc 1'],
    ['2', 'Soulevé de terre roumain barre', '3 x 10', "2'30", ''],
    ['3', 'Hack squat', '3 x 10-12', "2'", 'Pieds bas sur la plateforme (sinon presse)'],
    ['4', 'Leg curl assis', '4 x 10-15', '90 s', 'RP dernière série'],
    ['5a', 'Mollets assis machine', '4 x 12-20', 'superset', 'Pause 2 s en bas'],
    ['5b', 'Crunch poulie haute à genoux', '3 x 10-15', '60 s', 'Enroule la colonne, hanches fixes'],
    ['6', 'Élévations latérales haltères', '4 x 15-20', '60 s', '']],
  C: [['1', 'Tractions pronation', '4 x 5-8', "2'30", 'À 4 x 8 : leste de 2,5 kg. kg = lest'],
    ['2', 'Rowing haltère unilatéral', '3 x 8-12', "2'", 'Main libre en appui, tire vers la hanche'],
    ['3', 'Tirage vertical prise large', '4 x 10-12', "2'", 'Largeur du dos'],
    ['4', 'Pull-over poulie haute', '3 x 12-15', '90 s', 'RP dernière série'],
    ['5a', 'Reverse pec deck', '3 x 15-20', 'superset', 'Bras tendus, pouces vers le bas'],
    ['5b', 'Curl pupitre machine', '2 x 10-15', '60 s', 'RP dernière série'],
    ['6', 'Curl barre EZ', '3 x 8-12', '90 s', 'Coudes fixes, pas de balancier']],
};
const B3 = {
  A: [['1', 'Développé couché barre', '4 x 4-6', "3'", 'Pause 1 s sur la poitrine à la dernière rep'],
    ['2', 'Développé militaire barre debout', '3 x 6-8', "2'30", 'Fessiers et abdos gainés, pas de cambrure'],
    ['3', 'Développé incliné haltères 30°', '3 x 8-10', "2'", 'Compare avec tes charges du bloc 1'],
    ['4', 'Dips lestés', '3 x 6-10', "2'", 'Buste penché. kg = lest'],
    ['5a', 'Élévations latérales haltères', '3 x 12-15', 'superset', ''],
    ['5b', 'Extension triceps au-dessus de la tête poulie', '3 x 8-12', '75 s', 'Plus lourd qu\'avant']],
  B: [['1', 'Squat barre', '4 x 4-6', "3-4'", 'Le mouvement le plus lourd de ta semaine. RIR 1-2 maxi'],
    ['2', 'Soulevé de terre roumain barre', '3 x 6-8', "3'", 'Lourd, dos parfaitement plat'],
    ['3', 'Fentes bulgares haltères', '3 x 8-10', "2'", 'Par jambe. Pied arrière sur un banc'],
    ['4', 'Leg curl assis', '3 x 8-12', '90 s', ''],
    ['5a', 'Mollets debout machine', '3 x 8-12', 'superset', 'Plus lourd, pause en bas'],
    ['5b', 'Roulette abdominale', '3 x 8-12', '60 s', 'À genoux, dos rond'],
    ['6', 'Élévations latérales poulie', '3 x 15', '60 s', '']],
  C: [['1', 'Tractions lestées', '4 x 4-6', "3'", 'Charge qui te permet 6 reps propres. kg = lest'],
    ['2', 'Rowing barre penché', '3 x 6-8', "2'30", 'Buste à 45°, barre vers le nombril'],
    ['3', 'Tirage vertical prise neutre', '3 x 8-10', "2'", ''],
    ['4a', 'Face pull', '3 x 15', 'superset', 'Corde au niveau du front, coudes hauts'],
    ['4b', 'Curl marteau', '2 x 8-12', '60 s', ''],
    ['5', 'Curl barre EZ', '3 x 6-10', "2'", 'Plus lourd qu\'au bloc 2']],
};
const B4 = {
  A: [['1', 'Développé incliné haltères 30°', '4 x 8-12', "2'30", 'Priorité n°1 de la séance'],
    ['2', 'Développé couché barre', '3 x 6-8', "2'30", 'Maintien de la force'],
    ['3a', 'Élévations latérales poulie unilatérale', '4 x 12-20', 'superset', 'Myo-reps sur la dernière série'],
    ['3b', 'Extension triceps au-dessus de la tête poulie', '3 x 10-15', '75 s', ''],
    ['4', 'Écarté poulie basse vers le haut', '3 x 12-15', '75 s', 'Mains qui finissent à hauteur des yeux'],
    ['5', 'Développé militaire haltères assis', '2 x 8-12', "2'", ''],
    ['6', 'Extension triceps poulie corde', '2 x 12-15', '60 s', '']],
  B: [['1', 'Squat barre', '3 x 6-8', "3'", 'Maintien'],
    ['2', 'Soulevé de terre roumain barre', '3 x 8-10', "2'30", ''],
    ['3', 'Presse à cuisses', '2 x 10-15', "2'", ''],
    ['4', 'Leg curl assis', '3 x 10-15', '90 s', ''],
    ['5a', 'Mollets debout machine', '3 x 10-15', 'superset', ''],
    ['5b', 'Curl incliné haltères', '2 x 10-12', '60 s', '3e séance de bras de la semaine'],
    ['6', 'Élévations latérales haltères', '3 x 15-20', '60 s', '']],
  C: [['1', 'Tractions lestées', '3 x 6-8', "2'30", 'kg = lest'],
    ['2', 'Tirage vertical prise large', '3 x 10-12', "2'", 'Largeur du dos, priorité du bloc'],
    ['3', 'Rowing poitrine appuyée', '3 x 8-10', "2'", 'Compare avec tes charges du bloc 1'],
    ['4', 'Pull-over poulie haute', '2 x 12-15', '90 s', ''],
    ['5a', 'Oiseau poulie', '3 x 15-20', 'superset', ''],
    ['5b', 'Élévations latérales poulie', '2 x 15-20', '60 s', ''],
    ['6a', 'Curl barre EZ', '3 x 8-12', 'superset', ''],
    ['6b', 'Curl marteau', '2 x 10-12', '75 s', '']],
};
const TESTS = {
  A: [['1', 'Développé couché barre', '1 x 5', "4'", 'Test 5RM. Montée : barre, 50, 70, 85 %. Pareur obligatoire'],
    ['2', 'Élévations latérales haltères', '2 x 15', '60 s', 'Léger'],
    ['3', 'Extension triceps poulie corde', '2 x 15', '60 s', 'Léger']],
  B: [['1', 'Squat barre', '1 x 5', "4'", 'Test 5RM. Montée : barre, 50, 70, 85 %']],
  C: [['1', 'Tractions pronation', '1 x 20', "3'", 'Max de reps strictes au poids du corps'],
    ['2', 'Tractions lestées', '1 x 5', "3'", 'Test 5RM lesté. kg = lest'],
    ['3', 'Curl barre EZ', '2 x 12', '60 s', 'Léger']],
};
const PROGS = [B1, B2, B3, B4];

// Semaines 4 et 6 de chaque bloc : +1 série sur ces exercices
const PRIO = [
  { 4: ['Élévations latérales', 'Développé incliné haltères 30°'], 6: ['Tirage vertical prise neutre', 'Curl incliné haltères'] },
  { 4: ['Élévations latérales poulie unilatérale', 'Développé incliné à la Smith'], 6: ['Tirage vertical prise large', 'Curl barre EZ'] },
  { 4: ['Développé incliné haltères 30°', 'Élévations latérales haltères'], 6: ['Tirage vertical prise neutre', 'Curl barre EZ'] },
  { 4: ['Élévations latérales poulie unilatérale', 'Développé incliné haltères 30°'], 6: ['Tirage vertical prise large', 'Curl barre EZ'] },
];

const RIR = { 1: '3', 2: '2-3', 3: '2', 4: '2', 5: '1-2', 6: '1-2', 7: '1', 8: '4' };
const CONSIGNE = {
  1: 'Cale tes charges, technique parfaite.',
  2: 'Double progression : d\'abord les reps, ensuite la charge.',
  3: 'Double progression : d\'abord les reps, ensuite la charge.',
  4: '+1 série sur deux exercices prioritaires.',
  5: 'On se rapproche de l\'échec : RIR 1-2.',
  6: '+1 série sur deux autres exercices.',
  7: 'Semaine la plus dure. RIR 0 permis sur la dernière série d\'isolation.',
  8: 'Déload : moitié des séries, charges -10 %, RIR 4. Tu sors frais.',
};

export const TOTAL_WEEKS = 32;

export function blockOf(week) { return BLOCKS[Math.min(3, Math.floor((week - 1) / 8))]; }
export function weekInBlock(week) { return ((week - 1) % 8) + 1; }
export function isDeload(week) { return weekInBlock(week) === 8 && week !== 32; }
export function isTest(week) { return week === 32; }

export function weekInfo(week) {
  const wib = weekInBlock(week);
  const block = blockOf(week);
  let rir = week === 1 ? '2' : RIR[wib];
  let consigne = week === 1 ? 'Départ direct au RIR 2 : ta reprise est déjà faite.' : CONSIGNE[wib];
  if (isTest(week)) { rir = 'Test'; consigne = 'Semaine de tests : 5RM couché et squat, tractions max. Puis photos et mensurations.'; }
  return { week, wib, block, rir, consigne, deload: isDeload(week), test: isTest(week) };
}

export function parseRest(s) {
  if (s === 'superset') return 0;
  const m = s.match(/(\d+)\s*s\b/);
  if (m && !s.includes("'")) return +m[1];
  const mm = s.match(/(\d+)'(\d+)?/);
  if (mm) return (+mm[1]) * 60 + (mm[2] ? +mm[2] : 0);
  return 90;
}

function parsePrescription(p) {
  const [n, r] = p.split(' x ');
  const [lo, hi] = r.split('-').map(Number);
  return { sets: +n, lo, hi: hi || lo };
}

// Construit la séance d'une semaine donnée, avec remplacements éventuels
export function buildSession(week, type, swaps = {}) {
  const info = weekInfo(week);
  const bi = info.block.id - 1;
  const rows = info.test ? TESTS[type] : PROGS[bi][type];
  const prio = PRIO[bi];
  const exercises = rows.map(([slot, name, presc, rest, note]) => {
    const p = parsePrescription(presc);
    let sets = p.sets;
    let plus = 0;
    if (!info.test && !info.deload) {
      for (const w of [4, 6]) if (info.wib >= w && prio[w].includes(name)) plus++;
      sets += plus;
    }
    if (info.deload) sets = Math.ceil(p.sets / 2);
    const swapKey = `${info.block.id}|${type}|${slot}`;
    const actual = swaps[swapKey] || name;
    const meta = EX[actual] || { eq: 'machine', inc: 2.5, m: (EX[name] || {}).m || 'Autre' };
    const group = slot.match(/^(\d+)([ab])$/);
    return {
      slot, name: actual, original: name, swapped: actual !== name, swapKey,
      sets, plus, lo: p.lo, hi: p.hi,
      rest: parseRest(rest), restLabel: rest,
      note, meta,
      superset: group ? group[1] : null, ssPos: group ? group[2] : null,
    };
  });
  // Repos d'un superset : celui de l'exercice "b"
  exercises.forEach((e, i) => {
    if (e.ssPos === 'a') {
      const b = exercises.find((x) => x.superset === e.superset && x.ssPos === 'b');
      e.pairRest = b ? b.rest : 75;
    }
  });
  return { id: `w${week}${type}`, week, type, info, meta: SESSION_META[type], exercises };
}

export function sessionDurationEstimate(session) {
  let sec = 8 * 60; // échauffement
  session.exercises.forEach((e) => {
    const work = e.sets * 45;
    const rest = (e.ssPos === 'a' ? 0 : e.rest) * Math.max(0, e.sets - (e.ssPos === 'b' ? 0 : 1));
    sec += work + rest;
  });
  return Math.round(sec / 60 / 5) * 5;
}

export const FAQ = [
  {
    q: 'C\'est quoi le RIR ?',
    a: 'Le nombre de répétitions que tu aurais encore pu faire en fin de série. RIR 2 : tu t\'arrêtes en sentant que tu en avais encore 2 propres. C\'est lui qui règle l\'intensité de tout le programme.',
  },
  {
    q: 'Comment je progresse ?',
    a: 'Double progression. Tu gardes la charge tant que tu n\'as pas le haut de la fourchette sur toutes les séries. Dès que c\'est fait, +2,5 kg à la barre ou haltère suivant. Je te propose la charge à chaque exercice.',
  },
  {
    q: 'Pourquoi un déload ?',
    a: 'Toutes les 8 semaines, une semaine plus légère : moitié des séries, -10 % sur les charges. C\'est là que ton corps encaisse le travail des 7 semaines d\'avant. Tu repars plus fort au bloc suivant.',
  },
  {
    q: 'J\'ai raté une séance',
    a: 'Tu ne la sautes pas : tu la fais à la prochaine occasion et tu décales. Si tu rates une semaine entière, reprends au même point avec -5 % sur les charges. Mieux vaut une séance raccourcie à 40 min qu\'une séance sautée.',
  },
  {
    q: 'Combien je dois manger ?',
    a: 'Environ 2 750 kcal et 130 g de protéines par jour, sur 4 repas. Vise +0,25 à +0,35 kg par semaine. Moins de +0,2 kg sur 2 semaines : ajoute 200 kcal. Plus de +0,5 kg : enlève 150 kcal.',
  },
  {
    q: 'Je stagne sur un exercice',
    a: 'Vérifie d\'abord sommeil et calories. Si la charge stagne deux séances de suite alors que tout va bien, change de variante au bloc suivant : appuie sur le nom de l\'exercice pour le remplacer.',
  },
];
