const fs = require('fs')
const path = require('path')
const { jsPDF } = require('jspdf')

const outDir = path.join(process.cwd(), 'docs')
const pdfPath = path.join(outDir, 'cahier-des-charges-plateforme-concours.pdf')

const COLORS = {
  green: '#006633',
  greenDark: '#064E3B',
  gold: '#CC9900',
  slate: '#111827',
  muted: '#64748B',
  line: '#E2E8F0',
  pale: '#F8FAFC',
  paleGreen: '#ECFDF5',
  white: '#FFFFFF',
}

const doc = new jsPDF({ unit: 'pt', format: 'a4' })
const page = { w: 595, h: 842, margin: 42 }
let y = page.margin

const generatedAt = new Date().toLocaleDateString('fr-FR', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

const sections = [
  {
    title: '1. Présentation générale',
    body: [
      'La plateforme d’inscription aux concours de la Faculté des Sciences de l’Université de Ngaoundéré permet de publier des concours, recevoir les candidatures, contrôler les pièces, échanger avec les candidats, publier les résultats et produire des documents administratifs.',
      'Le projet couvre les parcours publics, candidats et administratifs, avec une base PostgreSQL, une interface web responsive, un système de rôles et des exports exploitables par les commissions.',
    ],
  },
  {
    title: '2. Objectifs du projet',
    bullets: [
      'Dématérialiser le dépôt des dossiers de candidature.',
      'Réduire les erreurs de saisie grâce à des formulaires guidés.',
      'Centraliser les concours par département, niveau, filière et centre.',
      'Permettre aux agents et responsables de suivre l’avancement des dossiers.',
      'Produire une fiche candidat PDF officielle et téléchargeable.',
      'Faciliter la publication des résultats et l’export des données.',
      'Assurer un déploiement compatible avec Vercel et PostgreSQL Neon.',
    ],
  },
  {
    title: '3. Périmètre fonctionnel',
    bullets: [
      'Site public: accueil, liste des concours, détail d’un concours, guide PDF.',
      'Authentification: inscription, connexion, vérification email, mot de passe oublié, déconnexion.',
      'Espace candidat: tableau de bord, suivi des dossiers, notifications, réponse aux compléments.',
      'Formulaires concours: STAB L1, STAB L3, STAB Master, STAB Master Pro, BIOMED L1/L3/Master/Master Pro, IAA-MAF M1.',
      'Administration: tableau de bord, gestion des concours, candidatures, utilisateurs, résultats, statistiques et exports.',
      'Documents: dépôt des pièces, photo candidat, reçu/quitus, documents requis par concours.',
      'PDF: fiche candidat officielle avec logos, photo, statut et détails du dossier.',
    ],
  },
]

const roleRows = [
  ['Candidat', 'Créer un compte, postuler, déposer les pièces, suivre les notifications, répondre aux compléments.'],
  ['Agent', 'Consulter les candidatures, examiner les dossiers, demander des compléments.'],
  ['Responsable', 'Valider les candidatures, gérer les concours, publier les résultats.'],
  ['Super admin', 'Accès complet: utilisateurs, concours, exports, statistiques, suppression et administration globale.'],
]

const featureGroups = [
  {
    title: 'Fonctionnalités publiques',
    items: [
      'Page d’accueil avec présentation institutionnelle.',
      'Affichage des concours ouverts par département.',
      'Détail d’un concours: frais, dates, places, pièces et bouton de candidature.',
      'Téléchargement des guides officiels lorsque disponibles.',
      'Fallback de sécurité si la base de données n’est pas configurée en production.',
    ],
  },
  {
    title: 'Fonctionnalités candidat',
    items: [
      'Inscription avec email, téléphone, nom, prénom et mot de passe.',
      'Vérification email par code OTP.',
      'Connexion sécurisée par cookie httpOnly.',
      'Tableau de bord avec compteurs: total dossiers, à compléter, en examen, résultats.',
      'Formulaire de candidature en plusieurs sections: identité, filière, centre, académique, documents, signature candidat.',
      'Suppression du champ signature agent, non pertinent côté candidat.',
      'Téléversement de la photo et des pièces justificatives.',
      'Consultation du dossier et des messages administratifs.',
      'Réponse à une demande de complément avec remplacement ou ajout de fichiers.',
    ],
  },
  {
    title: 'Fonctionnalités administration',
    items: [
      'Tableau de bord global: candidatures, concours, candidats, dossiers validés.',
      'Gestion des concours par département, niveau, filières, centres, pièces, frais, dates et statut.',
      'Création, modification, publication, archivage et suppression selon permissions.',
      'Liste des candidatures avec bouton Examiner et bouton Télécharger la fiche candidat.',
      'Examen d’un dossier, demande de complément, validation, rejet et suivi du statut.',
      'Messagerie candidat/admin rattachée à chaque candidature.',
      'Gestion des comptes utilisateurs et de leurs rôles.',
      'Publication des résultats avec décision, note, rang et date.',
      'Exports Excel/CSV des candidatures, résultats et concours.',
      'Statistiques détaillées par département, centre, filière, statut et taux d’occupation.',
    ],
  },
  {
    title: 'Documents et PDF',
    items: [
      'Fiche candidat PDF générée côté admin.',
      'Présence du logo de l’Université de Ngaoundéré et du logo de la Faculté des Sciences.',
      'Affichage de la photo candidat lorsqu’elle est disponible.',
      'Sections PDF: identification, concours, suivi administratif, parcours académique, pièces déposées et résultat publié.',
      'Nom de fichier normalisé pour faciliter l’archivage.',
      'Téléchargement depuis /admin/candidatures à côté du bouton Examiner.',
    ],
  },
]

const requirements = [
  ['Technique', 'Next.js 14, React 18, TypeScript, Tailwind CSS, Prisma ORM, PostgreSQL, jsPDF, xlsx.'],
  ['Base de données', 'PostgreSQL Neon en production, DATABASE_URL obligatoire dans Vercel.'],
  ['Sécurité', 'Mot de passe haché bcrypt, JWT signé, cookie httpOnly, contrôles de permissions par rôle.'],
  ['Performance', 'Pages dynamiques côté serveur pour les données sensibles; exports et PDF générés à la demande.'],
  ['Responsive', 'Navigation mobile, grilles adaptatives, tableaux avec overflow horizontal.'],
  ['Accessibilité', 'Boutons libellés, états visibles, contrastes institutionnels vert/or.'],
  ['Conformité', 'Aucune signature agent dans le formulaire candidat; séparation claire candidat/admin.'],
  ['Maintenance', 'Variables d’environnement documentées, build vérifiable, scripts Prisma disponibles.'],
]

const businessRules = [
  'Un candidat doit avoir un compte actif pour soumettre une candidature.',
  'Chaque candidature est liée à un concours et à un utilisateur.',
  'Une candidature peut passer par les statuts: brouillon, soumise, en examen, complément demandé, validée, rejetée, admissible, admis ou non admis.',
  'Une demande de complément renvoie le dossier vers le candidat; une réponse le repasse en suivi administratif.',
  'La publication des résultats est réservée aux rôles disposant de la permission PUBLISH_RESULTS.',
  'La suppression d’un concours est réservée au Super Admin.',
  'Les pièces requises sont configurables par concours.',
  'Les données sensibles de connexion ne doivent jamais être inscrites dans le code source.',
]

const tutorials = [
  {
    title: 'Tutoriel candidat',
    steps: [
      'Créer un compte depuis la page Inscription.',
      'Vérifier l’adresse email avec le code reçu.',
      'Se connecter puis ouvrir la page Concours.',
      'Choisir le concours correspondant au département et au niveau souhaités.',
      'Remplir les informations personnelles, académiques, filière et centre.',
      'Déposer la photo et les pièces demandées.',
      'Signer côté candidat puis soumettre le dossier.',
      'Suivre l’avancement depuis le tableau de bord et répondre aux compléments si nécessaire.',
    ],
  },
  {
    title: 'Tutoriel agent / responsable',
    steps: [
      'Se connecter avec un compte administratif.',
      'Ouvrir Administration puis Candidatures.',
      'Cliquer sur Examiner pour consulter un dossier.',
      'Contrôler les informations, documents et messages.',
      'Demander un complément si une pièce manque ou est incorrecte.',
      'Valider ou rejeter selon les règles internes.',
      'Télécharger la fiche candidat PDF pour archivage.',
      'Publier les résultats depuis le module Résultats si le rôle le permet.',
    ],
  },
  {
    title: 'Tutoriel super administrateur',
    steps: [
      'Créer ou modifier les concours depuis Administration > Concours.',
      'Paramétrer les dates, frais, centres, filières et documents requis.',
      'Gérer les utilisateurs depuis Administration > Utilisateurs.',
      'Consulter les statistiques et exporter les données selon les besoins.',
      'Configurer Vercel avec DATABASE_URL, JWT_SECRET et NEXT_PUBLIC_APP_URL.',
      'Après changement du schéma Prisma, exécuter prisma db push sur la base cible.',
    ],
  },
]

const deployment = [
  ['DATABASE_URL', 'URL PostgreSQL Neon. Obligatoire en production.'],
  ['JWT_SECRET', 'Secret long et unique pour signer les sessions.'],
  ['JWT_EXPIRES_IN', 'Durée de session, par exemple 7d.'],
  ['NEXT_PUBLIC_APP_URL', 'URL publique Vercel de l’application.'],
  ['SMTP_HOST / SMTP_PORT', 'Serveur SMTP pour les emails de vérification et réinitialisation.'],
  ['SMTP_USER / SMTP_PASS', 'Compte SMTP ou mot de passe applicatif.'],
  ['SMTP_FROM', 'Adresse expéditrice affichée aux candidats.'],
  ['UPLOAD_DIR', 'Répertoire local d’upload en développement. En production Vercel, prévoir un stockage persistant externe si nécessaire.'],
]

function addImage(publicPath, x, yPos, w, h) {
  const filePath = path.join(process.cwd(), 'public', publicPath.replace(/^\//, ''))
  if (!fs.existsSync(filePath)) return
  const ext = path.extname(filePath).toLowerCase()
  const mime = ext === '.png' ? 'image/png' : ext === '.webp' ? 'image/webp' : 'image/jpeg'
  const format = ext === '.png' ? 'PNG' : ext === '.webp' ? 'WEBP' : 'JPEG'
  try {
    doc.addImage(`data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`, format, x, yPos, w, h)
  } catch {
    // jsPDF may reject some webp files depending on runtime; the document remains valid without them.
  }
}

function ensureSpace(height) {
  if (y + height <= page.h - page.margin) return
  footer()
  doc.addPage()
  y = page.margin
}

function footer() {
  const current = doc.getCurrentPageInfo().pageNumber
  doc.setDrawColor(COLORS.line)
  doc.line(page.margin, page.h - 34, page.w - page.margin, page.h - 34)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(COLORS.muted)
  doc.text('Cahier des charges - Plateforme des concours de la Faculté des Sciences', page.margin, page.h - 18)
  doc.text(String(current), page.w - page.margin, page.h - 18, { align: 'right' })
}

function title(text, size = 18) {
  ensureSpace(42)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(size)
  doc.setTextColor(COLORS.greenDark)
  doc.text(text, page.margin, y)
  y += size + 12
}

function paragraph(text) {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(COLORS.slate)
  const lines = doc.splitTextToSize(text, page.w - page.margin * 2)
  ensureSpace(lines.length * 13 + 8)
  doc.text(lines, page.margin, y)
  y += lines.length * 13 + 10
}

function bullet(text) {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(COLORS.slate)
  const lines = doc.splitTextToSize(text, page.w - page.margin * 2 - 18)
  ensureSpace(lines.length * 13 + 7)
  doc.setFillColor(COLORS.gold)
  doc.circle(page.margin + 4, y - 3, 2, 'F')
  doc.text(lines, page.margin + 16, y)
  y += lines.length * 13 + 6
}

function card(header, items) {
  const startY = y
  const headerHeight = 28
  const itemLines = items.map((item) => doc.splitTextToSize(item, page.w - page.margin * 2 - 34))
  const height = headerHeight + 18 + itemLines.reduce((total, lines) => total + lines.length * 12 + 8, 0)
  ensureSpace(height + 10)

  doc.setDrawColor(COLORS.line)
  doc.setFillColor(COLORS.white)
  doc.roundedRect(page.margin, y, page.w - page.margin * 2, height, 8, 8, 'FD')
  doc.setFillColor(COLORS.paleGreen)
  doc.roundedRect(page.margin, y, page.w - page.margin * 2, headerHeight, 8, 8, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(COLORS.green)
  doc.text(header, page.margin + 14, y + 19)
  y += headerHeight + 18

  itemLines.forEach((lines) => {
    doc.setFillColor(COLORS.gold)
    doc.circle(page.margin + 18, y - 3, 2, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(COLORS.slate)
    doc.text(lines, page.margin + 30, y)
    y += lines.length * 12 + 8
  })
  y = startY + height + 14
}

function table(titleText, rows) {
  title(titleText, 14)
  rows.forEach(([left, right]) => {
    const rightLines = doc.splitTextToSize(right, page.w - page.margin * 2 - 178)
    const height = Math.max(32, rightLines.length * 12 + 16)
    ensureSpace(height + 2)
    doc.setDrawColor(COLORS.line)
    doc.setFillColor(COLORS.white)
    doc.rect(page.margin, y, page.w - page.margin * 2, height, 'FD')
    doc.setFillColor(COLORS.pale)
    doc.rect(page.margin, y, 160, height, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(COLORS.greenDark)
    doc.text(left, page.margin + 10, y + 19)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(COLORS.slate)
    doc.text(rightLines, page.margin + 174, y + 19)
    y += height
  })
  y += 14
}

function cover() {
  doc.setFillColor(COLORS.greenDark)
  doc.rect(0, 0, page.w, page.h, 'F')
  doc.setFillColor(COLORS.gold)
  doc.rect(0, 0, page.w, 12, 'F')
  addImage('/assets/logo-univ-ngaoundere.webp', page.margin, 44, 70, 70)
  addImage('/assets/logo-fac-sciences.webp', page.w - page.margin - 70, 44, 70, 70)

  doc.setFont('helvetica', 'bold')
  doc.setTextColor(COLORS.white)
  doc.setFontSize(14)
  doc.text('UNIVERSITÉ DE NGAOUNDÉRÉ', page.w / 2, 70, { align: 'center' })
  doc.setFontSize(12)
  doc.text('FACULTÉ DES SCIENCES', page.w / 2, 91, { align: 'center' })

  doc.setFontSize(30)
  doc.text('Cahier des charges', page.margin, 240)
  doc.setFontSize(18)
  doc.setTextColor('#FEF3C7')
  doc.text('Plateforme d’inscription en ligne aux concours', page.margin, 270)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setTextColor('#D1FAE5')
  const intro = doc.splitTextToSize(
    'Document de cadrage fonctionnel, technique et opérationnel décrivant les fonctionnalités, exigences, règles de gestion et tutoriels d’utilisation de la plateforme.',
    page.w - page.margin * 2,
  )
  doc.text(intro, page.margin, 318)

  doc.setFillColor('#0F6B4A')
  doc.roundedRect(page.margin, 470, page.w - page.margin * 2, 108, 10, 10, 'F')
  doc.setTextColor(COLORS.white)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('Version', page.margin + 22, 505)
  doc.text('Date', page.margin + 22, 535)
  doc.text('Livrable', page.margin + 22, 565)
  doc.setFont('helvetica', 'normal')
  doc.text('1.0', page.margin + 120, 505)
  doc.text(generatedAt, page.margin + 120, 535)
  doc.text('PDF de référence projet', page.margin + 120, 565)

  doc.setTextColor('#FEF3C7')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.text('Vert institutionnel • Or universitaire • Parcours candidat et administration', page.margin, 760)
}

function toc() {
  doc.addPage()
  y = page.margin
  title('Sommaire', 22)
  ;[
    'Présentation générale et objectifs',
    'Acteurs, rôles et permissions',
    'Fonctionnalités détaillées',
    'Exigences fonctionnelles et techniques',
    'Règles de gestion',
    'Tutoriels utilisateurs',
    'Déploiement, maintenance et sécurité',
    'Critères de recette',
  ].forEach((item, index) => bullet(`${index + 1}. ${item}`))
}

cover()
toc()

doc.addPage()
y = page.margin
sections.forEach((section) => {
  title(section.title)
  section.body?.forEach(paragraph)
  section.bullets?.forEach(bullet)
})

table('4. Acteurs et permissions', roleRows)

title('5. Fonctionnalités détaillées')
featureGroups.forEach((group) => card(group.title, group.items))

table('6. Exigences', requirements)

title('7. Règles de gestion')
businessRules.forEach(bullet)

title('8. Tutoriels d’utilisation')
tutorials.forEach((tutorial) => {
  card(tutorial.title, tutorial.steps.map((step, index) => `${index + 1}. ${step}`))
})

table('9. Variables et déploiement', deployment)

title('10. Architecture et données')
paragraph('Le modèle de données repose sur Prisma et PostgreSQL. Les entités principales sont User, Concours, ConcoursDocument, Candidature, UploadedDocument, CandidatureDocument, Paiement, Notification, Message, Resultat et AuditLog.')
paragraph('Les relations garantissent qu’un utilisateur peut déposer plusieurs candidatures, qu’un concours reçoit plusieurs candidatures, et que chaque candidature peut contenir des documents, paiements, messages et résultats.')

title('11. Critères de recette')
;[
  'Un candidat peut créer un compte, vérifier son email, se connecter et déposer un dossier complet.',
  'Le tableau de bord candidat affiche correctement les compteurs de dossiers.',
  'Le champ signature agent est absent du formulaire candidat.',
  'Un administrateur peut examiner une candidature et télécharger la fiche PDF candidat.',
  'La fiche PDF affiche les logos, la photo si disponible, les informations du candidat et les pièces déposées.',
  'Un responsable peut gérer les concours et publier les résultats.',
  'Les exports Excel/CSV sont disponibles pour les besoins administratifs.',
  'Le site se construit sans erreur avec next build.',
  'Le déploiement Vercel fonctionne avec DATABASE_URL, JWT_SECRET et NEXT_PUBLIC_APP_URL configurés.',
].forEach(bullet)

title('12. Points d’attention production')
;[
  'Ne jamais publier les secrets en clair dans GitHub.',
  'Régénérer le mot de passe Neon si une URL de base a été exposée.',
  'Prévoir un stockage persistant externe pour les fichiers uploadés en production Vercel.',
  'Configurer SMTP pour envoyer les codes de vérification et de réinitialisation.',
  'Vérifier régulièrement les permissions des comptes administratifs.',
].forEach(bullet)

for (let index = 1; index <= doc.getNumberOfPages(); index += 1) {
  doc.setPage(index)
  if (index > 1) footer()
}

fs.mkdirSync(outDir, { recursive: true })
fs.writeFileSync(pdfPath, Buffer.from(doc.output('arraybuffer')))
console.log(pdfPath)
