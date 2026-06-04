const fs = require('fs')
const path = require('path')
const {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  Packer,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} = require('docx')

const outDir = path.join(process.cwd(), 'docs')
const outPath = path.join(outDir, 'cahier-des-charges-plateforme-concours-detaille.docx')

const green = '006633'
const dark = '111827'
const muted = '475569'
const gold = 'CC9900'
const paleGreen = 'ECFDF5'
const paleSlate = 'F8FAFC'

function text(value, options = {}) {
  return new TextRun({
    text: value,
    font: 'Aptos',
    size: options.size ?? 22,
    bold: options.bold,
    italics: options.italics,
    color: options.color ?? dark,
    break: options.break,
  })
}

function p(children, options = {}) {
  return new Paragraph({
    children: Array.isArray(children) ? children : [text(children)],
    heading: options.heading,
    alignment: options.alignment,
    spacing: { before: options.before ?? 80, after: options.after ?? 80, line: 280 },
    bullet: options.bullet ? { level: 0 } : undefined,
    numbering: options.numbering,
  })
}

function h1(value) {
  return p([text(value, { bold: true, color: green, size: 34 })], { heading: HeadingLevel.HEADING_1, before: 360, after: 160 })
}

function h2(value) {
  return p([text(value, { bold: true, color: green, size: 28 })], { heading: HeadingLevel.HEADING_2, before: 260, after: 120 })
}

function h3(value) {
  return p([text(value, { bold: true, color: dark, size: 24 })], { heading: HeadingLevel.HEADING_3, before: 180, after: 80 })
}

function bullet(value) {
  return p(value, { bullet: true, before: 20, after: 20 })
}

function numbered(value, level = 0) {
  return p(value, {
    numbering: { reference: 'steps', level },
    before: 20,
    after: 20,
  })
}

function table(headers, rows) {
  const cell = (content, header = false) =>
    new TableCell({
      shading: header ? { type: ShadingType.CLEAR, fill: green, color: 'auto' } : undefined,
      borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
        left: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
        right: { style: BorderStyle.SINGLE, size: 1, color: 'E2E8F0' },
      },
      margins: { top: 120, bottom: 120, left: 120, right: 120 },
      children: [
        p([text(content, { bold: header, color: header ? 'FFFFFF' : dark, size: 20 })], {
          before: 0,
          after: 0,
        }),
      ],
    })

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: headers.map((header) => cell(header, true)) }),
      ...rows.map((row) => new TableRow({ children: row.map((item) => cell(item)) })),
    ],
  })
}

function noteBox(title, lines) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { type: ShadingType.CLEAR, fill: paleGreen, color: 'auto' },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: 'BBF7D0' },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: 'BBF7D0' },
              left: { style: BorderStyle.SINGLE, size: 1, color: 'BBF7D0' },
              right: { style: BorderStyle.SINGLE, size: 1, color: 'BBF7D0' },
            },
            margins: { top: 160, bottom: 160, left: 180, right: 180 },
            children: [
              p([text(title, { bold: true, color: green, size: 22 })], { before: 0, after: 80 }),
              ...lines.map((line) => p(line, { before: 0, after: 40 })),
            ],
          }),
        ],
      }),
    ],
  })
}

const roles = [
  ['CANDIDAT', 'Utilisateur qui crée un compte, postule, dépose les pièces, suit ses dossiers et répond aux compléments.'],
  ['AGENT', 'Utilisateur administratif chargé de consulter, examiner les dossiers et demander des compléments.'],
  ['RESPONSABLE', 'Responsable académique pouvant valider les dossiers, gérer les concours et publier les résultats.'],
  ['SUPER_ADMIN', 'Administrateur global pouvant gérer utilisateurs, concours, permissions, exports, statistiques et suppressions.'],
]

const modules = [
  {
    title: 'Module public',
    features: [
      'Page d’accueil institutionnelle avec logos, présentation et concours récents.',
      'Liste des concours ouverts, regroupés par département.',
      'Détail d’un concours: frais, places, dates, département, pièces, guide et bouton de candidature.',
      'Navigation responsive ordinateur, tablette et mobile.',
      'Affichage propre même si aucun concours n’est publié.',
    ],
    scenarios: [
      'Un visiteur arrive sur l’accueil, consulte les concours, ouvre le détail puis clique sur Postuler.',
      'Un visiteur consulte les concours depuis mobile et filtre visuellement par département.',
      'Si la base de données est indisponible, les pages publiques ne doivent pas afficher Application error.',
    ],
  },
  {
    title: 'Authentification et compte',
    features: [
      'Création de compte candidat avec nom, prénom, email, téléphone et mot de passe.',
      'Connexion par email et mot de passe.',
      'Déconnexion redirigeant vers le domaine courant, pas vers localhost.',
      'Vérification email par OTP.',
      'Renvoi du code de vérification.',
      'Mot de passe oublié et réinitialisation par code.',
      'Session sécurisée par cookie httpOnly.',
    ],
    scenarios: [
      'Un candidat s’inscrit, reçoit un code, vérifie son email puis accède au tableau de bord.',
      'Un utilisateur saisit un mauvais mot de passe: l’accès est refusé avec un message d’erreur.',
      'Un utilisateur oublié son mot de passe, demande un code, définit un nouveau mot de passe.',
      'Un utilisateur clique sur Déconnexion depuis Vercel: il revient à la page d’accueil Vercel.',
    ],
  },
  {
    title: 'Espace candidat',
    features: [
      'Tableau de bord personnel avec statistiques: total dossiers, à compléter, en examen, résultats.',
      'Liste des candidatures du candidat.',
      'Affichage de la prochaine action attendue.',
      'Notifications récentes et centre de notifications.',
      'Consultation d’un dossier, statut, pièces et échanges administratifs.',
      'Réponse aux demandes de complément.',
    ],
    scenarios: [
      'Un candidat a un dossier en brouillon: le tableau de bord propose de continuer.',
      'Un agent demande un complément: le candidat reçoit une notification et peut remplacer ou ajouter des fichiers.',
      'Un dossier est admis/non admis: le candidat voit le résultat publié.',
    ],
  },
  {
    title: 'Formulaire de candidature',
    features: [
      'Formulaires dédiés aux concours STAB, BIOMED et IAA-MAF.',
      'Sélection de la filière selon le concours.',
      'Sélection du centre de concours.',
      'Saisie de l’identité: nom, prénom, naissance, sexe, nationalité, téléphone, adresse.',
      'Saisie du parcours académique: diplôme, établissement, année, mention, formations.',
      'Téléversement de la photo candidat.',
      'Téléversement des pièces obligatoires selon le niveau.',
      'Signature candidat uniquement.',
      'Suppression complète du champ signature agent.',
      'Prévisualisation/récépissé de candidature lorsque disponible.',
    ],
    scenarios: [
      'Un candidat STAB L1 remplit les informations, choisit Production végétale et dépose Baccalauréat/Probatoire.',
      'Un candidat IAA-MAF M1 choisit Applied Artificial Intelligence ou Financial Mathematics.',
      'Un candidat oublie une pièce obligatoire: la soumission doit être bloquée ou signalée.',
      'Un candidat dépose une photo: elle doit être reprise sur la fiche PDF admin.',
    ],
  },
  {
    title: 'Administration des candidatures',
    features: [
      'Liste des candidatures avec numéro de dossier, candidat, concours, statut, date et actions.',
      'Bouton Examiner.',
      'Bouton Télécharger la fiche candidat.',
      'Vue détail candidature avec informations, documents, messages et actions de statut.',
      'Validation, rejet, mise en examen et demande de complément selon permissions.',
      'Historique d’échanges candidat/admin.',
      'Badge complément reçu lorsque le candidat a répondu.',
    ],
    scenarios: [
      'Un agent examine un dossier incomplet et demande un complément.',
      'Un responsable valide un dossier complet.',
      'Un dossier non conforme est rejeté avec motif.',
      'L’admin télécharge la fiche PDF officielle pour archivage.',
    ],
  },
  {
    title: 'Gestion des concours',
    features: [
      'Création d’un concours par département et niveau.',
      'Modification du titre, description, filières, centres, places, frais, dates et guide.',
      'Gestion des pièces requises.',
      'Publication, brouillon, clôture et archivage.',
      'Suppression réservée au super admin.',
      'Tri des concours par département.',
    ],
    scenarios: [
      'Un responsable crée un nouveau concours BIOMED Master Pro.',
      'Un concours en brouillon n’est pas visible par les candidats.',
      'Un concours publié apparaît dans la page Concours.',
      'Un super admin archive un concours clôturé.',
    ],
  },
  {
    title: 'Résultats',
    features: [
      'Liste des dossiers prêts pour publication.',
      'Saisie de décision finale: admis, non admis ou autre statut selon besoin.',
      'Saisie note et rang.',
      'Publication avec date.',
      'Liste des résultats publiés.',
      'Export des résultats.',
    ],
    scenarios: [
      'Un responsable publie les résultats d’un concours.',
      'Un candidat consulte son tableau de bord et voit que son dossier a un résultat.',
      'L’administration exporte la liste officielle des admis.',
    ],
  },
  {
    title: 'Exports et statistiques',
    features: [
      'Export Excel/CSV des candidatures.',
      'Export Excel/CSV des résultats.',
      'Export Excel/CSV des concours.',
      'Export par concours.',
      'Statistiques par département, centre, filière et statut.',
      'Taux de dossiers solides et taux d’occupation des places.',
    ],
    scenarios: [
      'Un super admin exporte tous les inscrits pour une commission.',
      'Un responsable consulte le centre le plus sollicité.',
      'L’administration compare le nombre de dossiers aux places disponibles.',
    ],
  },
  {
    title: 'Documents PDF',
    features: [
      'Génération de fiche candidat PDF.',
      'Logo Université de Ngaoundéré.',
      'Logo Faculté des Sciences.',
      'Photo candidat si déposée.',
      'Sections structurées: identification, concours, suivi administratif, parcours académique, pièces et résultat.',
      'Téléchargement depuis la page /admin/candidatures.',
      'Mise en page officielle avec marges et espacements.',
    ],
    scenarios: [
      'Un admin télécharge la fiche d’un candidat avant commission.',
      'Si la photo manque, le PDF affiche un emplacement photo.',
      'Si le résultat existe, il apparaît dans la fiche.',
    ],
  },
]

const requirements = [
  ['EF-01', 'Authentification', 'Le système doit permettre l’inscription, connexion, vérification email, récupération mot de passe et déconnexion.'],
  ['EF-02', 'Candidature', 'Le système doit permettre à un candidat de déposer un dossier complet pour un concours publié.'],
  ['EF-03', 'Documents', 'Le système doit accepter les documents PDF/JPG/PNG dans la limite configurée.'],
  ['EF-04', 'Compléments', 'Le système doit permettre à l’administration de demander un complément et au candidat d’y répondre.'],
  ['EF-05', 'PDF', 'Le système doit générer une fiche candidat téléchargeable par l’administration.'],
  ['EF-06', 'Résultats', 'Le système doit permettre la publication des résultats par les rôles autorisés.'],
  ['EF-07', 'Exports', 'Le système doit fournir des exports administratifs Excel/CSV.'],
  ['ENF-01', 'Sécurité', 'Les mots de passe doivent être hachés; les sessions doivent utiliser des cookies httpOnly.'],
  ['ENF-02', 'Performance', 'Les pages doivent rester utilisables sur réseau moyen et mobiles.'],
  ['ENF-03', 'Disponibilité', 'L’application doit être déployable sur Vercel avec base PostgreSQL Neon.'],
  ['ENF-04', 'Maintenabilité', 'Le code doit rester typé TypeScript et structuré par modules.'],
  ['ENF-05', 'Confidentialité', 'Les secrets ne doivent jamais être commités dans le dépôt Git.'],
]

const rules = [
  'Un concours doit être actif et publié/en cours pour être visible par les candidats.',
  'Un candidat ne doit voir que ses propres candidatures.',
  'Un agent peut examiner mais ne doit pas disposer des pleins pouvoirs super admin.',
  'La validation et la publication des résultats sont réservées aux rôles autorisés.',
  'Le champ signature agent ne doit jamais apparaître dans le formulaire candidat.',
  'Une candidature avec complément demandé doit permettre au candidat d’envoyer une réponse.',
  'Les documents uploadés restent liés au dossier candidat.',
  'La fiche candidat PDF ne doit pas modifier les données, seulement les restituer.',
  'La déconnexion doit rediriger vers le domaine courant.',
  'Si DATABASE_URL manque, les pages publiques doivent éviter le crash serveur.',
]

const errorCases = [
  ['Base de données absente', 'Afficher un état vide ou un message contrôlé; ne pas afficher Application error sur les pages publiques.'],
  ['Mauvais identifiants', 'Refuser la connexion et afficher un message générique.'],
  ['Email non vérifié', 'Demander la vérification avant accès complet si nécessaire.'],
  ['Document trop lourd', 'Refuser le fichier et expliquer la limite.'],
  ['Format non accepté', 'Refuser le fichier et rappeler les formats attendus.'],
  ['Dossier introuvable', 'Retourner 404 ou message contrôlé.'],
  ['Permission insuffisante', 'Afficher un écran d’accès réservé.'],
  ['SMTP non configuré', 'Créer le compte mais signaler que l’email n’a pas pu être envoyé.'],
  ['Upload sur Vercel', 'Prévoir stockage externe persistant, car le filesystem serverless n’est pas durable.'],
]

const tutorials = [
  {
    title: 'Tutoriel candidat: déposer un dossier',
    steps: [
      'Ouvrir le site et cliquer sur Créer un compte.',
      'Renseigner nom, prénom, email, téléphone et mot de passe.',
      'Saisir le code de vérification reçu par email.',
      'Aller dans Concours et choisir le concours souhaité.',
      'Lire les conditions, frais, dates, centres et pièces demandées.',
      'Cliquer sur Remplir le formulaire.',
      'Compléter identité, filière, centre et parcours académique.',
      'Ajouter la photo candidat et chaque document obligatoire.',
      'Signer en tant que candidat.',
      'Soumettre le dossier puis suivre son état depuis le tableau de bord.',
    ],
  },
  {
    title: 'Tutoriel candidat: répondre à un complément',
    steps: [
      'Se connecter au compte candidat.',
      'Ouvrir le tableau de bord.',
      'Repérer le dossier marqué À compléter ou Complément demandé.',
      'Lire le message administratif.',
      'Remplacer le fichier incorrect ou ajouter un nouveau fichier.',
      'Rédiger une courte réponse.',
      'Envoyer le complément.',
      'Vérifier que le dossier repasse en suivi administratif.',
    ],
  },
  {
    title: 'Tutoriel agent: examiner un dossier',
    steps: [
      'Se connecter avec un compte agent.',
      'Ouvrir Administration > Candidatures.',
      'Cliquer sur Examiner.',
      'Contrôler l’identité, les pièces et les informations académiques.',
      'Envoyer un message au candidat si besoin.',
      'Demander un complément si une pièce est manquante ou incorrecte.',
      'Télécharger la fiche candidat si nécessaire.',
    ],
  },
  {
    title: 'Tutoriel responsable: publier des résultats',
    steps: [
      'Se connecter avec un compte responsable.',
      'S’assurer que les dossiers concernés sont validés/admissibles.',
      'Ouvrir Administration > Résultats.',
      'Saisir la décision, la note et le rang si disponible.',
      'Publier le résultat.',
      'Exporter la liste officielle si nécessaire.',
    ],
  },
  {
    title: 'Tutoriel super admin: déployer sur Vercel',
    steps: [
      'Créer ou vérifier la base PostgreSQL Neon.',
      'Pousser le schéma avec prisma db push.',
      'Configurer DATABASE_URL dans Vercel.',
      'Configurer JWT_SECRET et NEXT_PUBLIC_APP_URL.',
      'Configurer SMTP si les emails doivent partir en production.',
      'Push le code sur GitHub.',
      'Lancer ou relancer le déploiement Vercel.',
      'Tester inscription, connexion, déconnexion, liste concours et admin.',
    ],
  },
]

const deploymentRows = [
  ['DATABASE_URL', 'URL PostgreSQL Neon. Obligatoire pour toutes les données réelles.'],
  ['JWT_SECRET', 'Secret long et privé pour signer les sessions.'],
  ['JWT_EXPIRES_IN', 'Durée de session, par défaut 7d.'],
  ['NEXT_PUBLIC_APP_URL', 'URL publique du site Vercel.'],
  ['SMTP_HOST', 'Serveur SMTP.'],
  ['SMTP_PORT', 'Port SMTP, souvent 587 ou 465.'],
  ['SMTP_USER', 'Compte SMTP.'],
  ['SMTP_PASS', 'Mot de passe ou mot de passe applicatif SMTP.'],
  ['SMTP_FROM', 'Adresse expéditeur.'],
  ['UPLOAD_DIR', 'Répertoire local en développement; prévoir stockage externe en production.'],
]

const recette = [
  'La build Next.js passe sans erreur.',
  'Le site public s’affiche sur Vercel sans Application error.',
  'La liste des concours affiche les concours de Neon.',
  'La déconnexion ne renvoie pas vers localhost.',
  'Un candidat peut créer un compte, vérifier son email et se connecter.',
  'Un candidat peut remplir une fiche avec photo et documents.',
  'L’admin voit la candidature dans /admin/candidatures.',
  'L’admin peut télécharger la fiche candidat PDF.',
  'Un agent peut demander un complément.',
  'Un candidat peut répondre au complément.',
  'Un responsable peut publier un résultat.',
  'Les exports Excel/CSV fonctionnent.',
]

const children = [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 240 },
    children: [text('UNIVERSITÉ DE NGAOUNDÉRÉ', { bold: true, color: green, size: 28 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 420 },
    children: [text('FACULTÉ DES SCIENCES', { bold: true, color: gold, size: 24 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 180 },
    children: [text('Cahier des charges détaillé', { bold: true, color: green, size: 44 })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 420 },
    children: [text('Plateforme d’inscription en ligne aux concours', { bold: true, color: dark, size: 28 })],
  }),
  noteBox('Document de référence', [
    'Ce document décrit le périmètre, les fonctionnalités, les scénarios d’utilisation, les exigences, les règles de gestion, les cas d’erreur, les tutoriels et les critères de recette de la plateforme.',
    `Version: 1.0 - Date: ${new Date().toLocaleDateString('fr-FR')}`,
  ]),
  h1('1. Contexte et justification'),
  p('La Faculté des Sciences de l’Université de Ngaoundéré dispose d’une plateforme web destinée à gérer les inscriptions aux concours. Le besoin principal est de permettre aux candidats de déposer leurs dossiers en ligne et à l’administration de traiter ces dossiers de manière centralisée, traçable et exploitable.'),
  p('La solution couvre les concours STAB, Sciences biomédicales et IAA-MAF, avec des parcours adaptés aux niveaux L1, L3, Master, Master professionnel et Master 1 professionnel selon les départements.'),
  h1('2. Objectifs'),
  ...[
    'Dématérialiser la collecte des dossiers.',
    'Réduire les déplacements et les erreurs de dossier.',
    'Accélérer l’examen administratif.',
    'Permettre une communication structurée entre candidats et administration.',
    'Produire des fiches candidat PDF officielles.',
    'Faciliter les exports pour commissions et archivage.',
    'Sécuriser les accès par rôles.',
    'Déployer l’application sur Vercel avec PostgreSQL Neon.',
  ].map(bullet),
  h1('3. Acteurs et rôles'),
  table(['Rôle', 'Responsabilités'], roles),
  h1('4. Fonctionnalités détaillées par module'),
  ...modules.flatMap((module) => [
    h2(module.title),
    h3('Fonctionnalités'),
    ...module.features.map(bullet),
    h3('Scénarios possibles'),
    ...module.scenarios.map(bullet),
  ]),
  h1('5. Exigences fonctionnelles et non fonctionnelles'),
  table(['Code', 'Famille', 'Exigence'], requirements),
  h1('6. Règles de gestion'),
  ...rules.map(bullet),
  h1('7. Cas d’erreur et comportements attendus'),
  table(['Situation', 'Comportement attendu'], errorCases),
  h1('8. Tutoriels d’utilisation'),
  ...tutorials.flatMap((tutorial) => [
    h2(tutorial.title),
    ...tutorial.steps.map((step) => numbered(step)),
  ]),
  h1('9. Données et modèle conceptuel'),
  p('Les données principales sont structurées autour des utilisateurs, concours, candidatures, documents, paiements, notifications, messages, résultats et journaux d’audit. Les relations garantissent la traçabilité complète d’un dossier depuis sa création jusqu’à la décision finale.'),
  ...[
    'User: compte candidat ou administratif.',
    'Concours: configuration académique d’un concours.',
    'ConcoursDocument: pièces attendues pour un concours.',
    'Candidature: dossier candidat.',
    'UploadedDocument et CandidatureDocument: fichiers rattachés au dossier.',
    'Message: échange entre candidat et administration.',
    'Notification: information envoyée à l’utilisateur.',
    'Resultat: décision finale publiée.',
    'AuditLog: trace des actions sensibles.',
  ].map(bullet),
  h1('10. Déploiement et configuration'),
  table(['Variable', 'Usage'], deploymentRows),
  noteBox('Attention sécurité', [
    'Les secrets comme DATABASE_URL, JWT_SECRET et SMTP_PASS ne doivent pas être publiés dans GitHub.',
    'Si une URL Neon a été partagée publiquement, le mot de passe doit être régénéré dans Neon puis remplacé dans Vercel.',
  ]),
  h1('11. Maintenance et exploitation'),
  ...[
    'Sauvegarder régulièrement la base PostgreSQL.',
    'Contrôler les rôles administratifs.',
    'Vérifier les exports avant commission.',
    'Nettoyer les comptes de test avant production officielle.',
    'Prévoir un stockage persistant externe pour les uploads en production serverless.',
    'Mettre à jour les dépendances avec prudence et tester la build.',
  ].map(bullet),
  h1('12. Critères de recette'),
  ...recette.map(bullet),
  h1('13. Limites connues et recommandations'),
  ...[
    'Le stockage local des uploads n’est pas durable sur Vercel; recommander S3, UploadThing, Cloudinary ou Vercel Blob.',
    'Les emails nécessitent une configuration SMTP valide.',
    'Les documents officiels doivent être vérifiés par la Faculté avant publication.',
    'Un environnement de test distinct est recommandé avant toute modification majeure.',
    'Les comptes super admin doivent être limités et surveillés.',
  ].map(bullet),
]

const doc = new Document({
  creator: 'Codex',
  title: 'Cahier des charges détaillé - Plateforme concours Faculté des Sciences',
  description: 'Document fonctionnel, technique et opérationnel détaillé.',
  numbering: {
    config: [
      {
        reference: 'steps',
        levels: [
          {
            level: 0,
            format: 'decimal',
            text: '%1.',
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 420, hanging: 260 } } },
          },
        ],
      },
    ],
  },
  styles: {
    default: {
      document: {
        run: { font: 'Aptos', size: 22, color: dark },
        paragraph: { spacing: { line: 280 } },
      },
    },
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 34, bold: true, color: green, font: 'Aptos Display' },
        paragraph: { spacing: { before: 360, after: 160 } },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 28, bold: true, color: green, font: 'Aptos Display' },
        paragraph: { spacing: { before: 260, after: 120 } },
      },
      {
        id: 'Heading3',
        name: 'Heading 3',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 24, bold: true, color: dark, font: 'Aptos' },
        paragraph: { spacing: { before: 180, after: 80 } },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          margin: { top: 900, right: 720, bottom: 900, left: 720 },
        },
      },
      children,
    },
  ],
})

fs.mkdirSync(outDir, { recursive: true })
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outPath, buffer)
  console.log(outPath)
})
