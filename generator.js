const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, LevelFormat, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageBreak, HorizontalPositionAlign,
  Header, Footer, PageNumber
} = require('docx');
const fs = require('fs');

const DARK_BLUE  = "1A3557";
const MID_BLUE   = "2E6DA4";
const LIGHT_BLUE = "D6E8F5";
const ACCENT     = "E8A020";
const WHITE      = "FFFFFF";
const LIGHT_GRAY = "F5F5F5";

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };

function T(text, opts = {}) {
  return new TextRun({ text, font: "Calibri", ...opts });
}
function Bold(text, color) {
  return new TextRun({ text, font: "Calibri", bold: true, color: color || "000000" });
}
function P(children, opts = {}) {
  if (typeof children === 'string') children = [T(children)];
  return new Paragraph({ children, alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 100, line: 276 }, ...opts });
}
function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    children: [new TextRun({ text, font: "Calibri", bold: true, color: WHITE, size: 28 })],
    shading: { fill: DARK_BLUE, type: ShadingType.CLEAR },
    spacing: { before: 300, after: 150 },
    indent: { left: 200 }
  });
}
function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    children: [new TextRun({ text, font: "Calibri", bold: true, color: DARK_BLUE, size: 24 })],
    spacing: { before: 200, after: 100 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: MID_BLUE, space: 1 } }
  });
}
function H3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    children: [new TextRun({ text, font: "Calibri", bold: true, color: MID_BLUE, size: 22 })],
    spacing: { before: 160, after: 80 }
  });
}
function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    children: [T(text)],
    spacing: { after: 60 }
  });
}
function subBullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 1 },
    children: [T(text)],
    spacing: { after: 50 }
  });
}
function infoBox(title, content) {
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [2000, 7360],
    rows: [
      new TableRow({ children: [
        new TableCell({
          borders, shading: { fill: DARK_BLUE, type: ShadingType.CLEAR },
          width: { size: 2000, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          verticalAlign: VerticalAlign.CENTER,
          children: [new Paragraph({ children: [Bold(title, WHITE)], alignment: AlignmentType.CENTER })]
        }),
        new TableCell({
          borders, shading: { fill: LIGHT_BLUE, type: ShadingType.CLEAR },
          width: { size: 7360, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 160, right: 120 },
          children: [P(content)]
        }),
      ]})
    ]
  });
}
function space() { return new Paragraph({ children: [T("")], spacing: { after: 80 } }); }

// ═══════════════════════════════════════════════════════════════
//  DOCUMENT
// ═══════════════════════════════════════════════════════════════
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Calibri", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Calibri", color: WHITE },
        paragraph: { spacing: { before: 300, after: 150 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Calibri", color: DARK_BLUE },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Calibri", color: MID_BLUE },
        paragraph: { spacing: { before: 160, after: 80 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: "\u2022",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: "\u25E6",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
        ]
      }
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1440, right: 1300, bottom: 1440, left: 1300 }
      }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          children: [
            Bold("RESUME DU LIVRE : Multi-Agent Reinforcement Learning", MID_BLUE),
            T("  |  Albrecht, Christianos & Schäfer (2024)")
          ],
          border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ACCENT, space: 1 } }
        })]
      })
    },
    children: [

      // ── PAGE DE TITRE ─────────────────────────────────────────────────
      new Paragraph({
        children: [T("")], spacing: { after: 600 }
      }),
      new Table({
        width: { size: 9360, type: WidthType.DXA }, columnWidths: [9360],
        rows: [new TableRow({ children: [new TableCell({
          borders: { top: border, bottom: border, left: { style: BorderStyle.THICK, size: 12, color: ACCENT }, right: border },
          shading: { fill: DARK_BLUE, type: ShadingType.CLEAR },
          width: { size: 9360, type: WidthType.DXA },
          margins: { top: 320, bottom: 320, left: 400, right: 400 },
          children: [
            new Paragraph({ children: [new TextRun({ text: "RESUME COMPLET EN FRANCAIS", font: "Calibri", bold: true, size: 36, color: WHITE })], alignment: AlignmentType.CENTER, spacing: { after: 120 } }),
            new Paragraph({ children: [new TextRun({ text: "Multi-Agent Reinforcement Learning:", font: "Calibri", bold: true, size: 30, color: "FFD700" })], alignment: AlignmentType.CENTER, spacing: { after: 60 } }),
            new Paragraph({ children: [new TextRun({ text: "Foundations and Modern Approaches", font: "Calibri", italics: true, size: 28, color: "FFD700" })], alignment: AlignmentType.CENTER, spacing: { after: 160 } }),
            new Paragraph({ children: [new TextRun({ text: "Stefano V. Albrecht  \u2022  Filippos Christianos  \u2022  Lukas Schäfer", font: "Calibri", size: 22, color: "CCDDEE" })], alignment: AlignmentType.CENTER, spacing: { after: 80 } }),
            new Paragraph({ children: [new TextRun({ text: "MIT Press, 2024", font: "Calibri", size: 20, color: "AABBCC" })], alignment: AlignmentType.CENTER }),
          ]
        })]})],
      }),
      new Paragraph({ children: [T("")], spacing: { after: 400 } }),
      infoBox("Objectif", "Ce document constitue un resume detaille et structure du livre, couvrant l'ensemble des chapitres avec les concepts cles, les algorithmes importants, les formalismes mathematiques et les applications. Il est destine a servir de reference rapide dans le cadre d'un travail doctoral en intelligence artificielle distribuee."),
      space(), space(),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════
      H1("INTRODUCTION GENERALE"),
      // ═══════════════════════════════════════════════════════════════
      H2("1.1  Qu'est-ce que le MARL ?"),
      P("L'apprentissage par renforcement multi-agent (MARL — Multi-Agent Reinforcement Learning) est un sous-domaine de l'intelligence artificielle qui etudie comment plusieurs agents autonomes apprennent a prendre des decisions de maniere sequentielle dans un environnement partage. Chaque agent observe (partiellement ou totalement) l'etat de l'environnement, choisit des actions, recoit des recompenses et met a jour sa politique d'action. La difficulte centrale du MARL par rapport au RL mono-agent est la non-stationnarite : l'environnement percu par un agent change non seulement en raison de la dynamique intrinsèque, mais aussi a cause des actions des autres agents."),
      space(),
      H2("1.2  Pourquoi le MARL est-il important ?"),
      bullet("Nombreux problemes reels impliquent plusieurs entites decisionnelles : robots collaboratifs, reseaux de communication, marches financiers, jeux video, systemes de transport autonomes."),
      bullet("Les approches mono-agent ne capturent pas les interactions strategiques (competition, cooperation, negociation)."),
      bullet("Les avancees recentes du deep learning ont permis de scaler le MARL a des espaces d'etats et d'actions de grande dimension."),
      space(),
      H2("1.3  Structure generale du livre"),
      P("Le livre est organise en trois grandes parties : (1) les fondements theoriques (RL mono-agent, theorie des jeux, formalisme MARL), (2) les approches modernes (deep MARL, cooperation, communication, modelisation des adversaires, jeux non-cooperatifs), et (3) les sujets avances (mean-field games, offline MARL, surete, applications pratiques)."),
      space(),
      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════
      H1("CHAPITRE 2 — APPRENTISSAGE PAR RENFORCEMENT MONO-AGENT"),
      // ═══════════════════════════════════════════════════════════════
      H2("2.1  Processus de Decision de Markov (MDP)"),
      P([
        T("Un "),Bold("MDP"),T(" est defini par le tuple "),Bold("(S, A, T, R, \u03B3)"),
        T(" ou S est l'espace d'etats, A l'espace d'actions, T : S x A x S \u2192 [0,1] la fonction de transition, R : S x A \u2192 \u211D la fonction de recompense, et \u03B3 \u2208 [0,1) le facteur d'actualisation. L'objectif de l'agent est de trouver une politique \u03C0 : S \u2192 A maximisant le retour cumule actualise E[\u03A3 \u03B3\u1D57 r\u209C]."),
      ]),
      H2("2.2  Algorithmes fondamentaux"),
      H3("Methodes basees sur la valeur (Value-based)"),
      bullet("Q-learning : algorithme off-policy mettant a jour la Q-valeur Q(s,a) \u2190 Q(s,a) + \u03B1[r + \u03B3 max Q(s',a') - Q(s,a)]."),
      bullet("SARSA : variante on-policy plus conservative."),
      bullet("DQN (Deep Q-Network, Mnih et al. 2015) : combine Q-learning avec un reseau de neurones profond, experience replay et cible fixe."),
      H3("Methodes de gradient de politique (Policy Gradient)"),
      bullet("REINFORCE : gradient de la performance J(\u03B8) = E[G_t \u2207 log \u03C0_\u03B8(a|s)]."),
      bullet("Actor-Critic (A2C, A3C) : combine un acteur (politique) et un critique (valeur d'etat) pour reduire la variance."),
      bullet("PPO (Proximal Policy Optimization) : contrainte le pas de mise a jour via un ratio de vraisemblance clipe."),
      bullet("SAC (Soft Actor-Critic) : maximise la recompense et l'entropie pour explorer efficacement."),
      space(),
      infoBox("Point cle", "Le theoreme de gradient de politique de Sutton et al. (2000) garantit que le gradient de J(\u03B8) peut etre estime sans connaitre le modele de transition, ce qui rend les methodes policy gradient model-free."),
      space(),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════
      H1("CHAPITRE 3 — THEORIE DES JEUX"),
      // ═══════════════════════════════════════════════════════════════
      H2("3.1  Jeux normaux (Normal-Form Games)"),
      P("Un jeu normal implique n joueurs, chacun disposant d'un ensemble d'actions pures. La matrice de gains definit la recompense de chaque joueur pour chaque profil d'actions. Les concepts fondamentaux sont l'equilibre de Nash (EN), l'equilibre dominant, la dominance stricte et l'equilibre de Pareto."),
      H2("3.2  Equilibre de Nash"),
      P("Un profil de strategies (\u03C0*_1, ..., \u03C0*_n) est un equilibre de Nash si aucun agent ne peut ameliorer son gain en deviavant unilateralement. L'existence est garantie pour les strategies mixtes (theoreme de Nash, 1951)."),
      bullet("EN pur : deterministe, pas toujours garanti."),
      bullet("EN mixte : stochastique, toujours garanti dans les jeux finis."),
      bullet("EN correle : coordination via un signal public, plus general que l'EN de Nash."),
      H2("3.3  Jeux stochastiques (Stochastic Games)"),
      P([
        T("Extension sequentielle des jeux normaux. Defini par "),
        Bold("(S, A_1,...,A_n, T, R_1,...,R_n, \u03B3)"),
        T(". A chaque pas de temps, les agents observent l'etat, choisissent des actions, recoivent des recompenses individuelles et transitent vers un nouvel etat. Les jeux stochastiques sont le formalisme central du MARL. Cas particuliers : jeux cooperatifs (R_1 = ... = R_n), jeux a somme nulle (R_1 = -R_2), jeux de potentiel (gradient d'une fonction potentielle commune)."),
      ]),
      H2("3.4  Jeux a information incomplete"),
      bullet("Jeux bayesiens : les joueurs ont des types prives, croyances sous forme de distributions."),
      bullet("Equilibre Bayesien de Nash : strategies optimales conditionnellement aux croyances."),
      bullet("Relevanence dans le MARL : modelisation de l'incertitude sur les intentions des autres agents."),
      space(),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════
      H1("CHAPITRE 4 — MARL : FONDEMENTS"),
      // ═══════════════════════════════════════════════════════════════
      H2("4.1  Formalisme MARL"),
      P("Le MARL est formellement modelise comme un jeu stochastique. Les agents peuvent avoir des observations partielles (POSG — Partially Observable Stochastic Game) ou totales. En pratique, les POSG sont la regle, car les agents ne percoivent qu'une partie de l'etat global."),
      H2("4.2  Modes d'interaction"),
      bullet("Fully cooperative : tous les agents maximisent une recompense commune. Probleme : defi de coordination (comment se synchroniser sans communication explicite ?)."),
      bullet("Fully competitive : jeu a somme nulle, les gains d'un agent sont les pertes des autres. Concept solution : minimax."),
      bullet("Mixed (cooperatif-competitif) : scenario le plus general, agents a interlts partiellement alignes (ex. negociation, marches)."),
      H2("4.3  Approches algorithmiques generales"),
      bullet("Appentissage independant (IQL, IA2C) : chaque agent applique un algorithme mono-agent en ignorant les autres. Simple mais potentiellement divergent."),
      bullet("Centralised Training, Decentralised Execution (CTDE) : entrainement avec information globale, execution avec information locale. Paradigme dominant en MARL cooperatif."),
      bullet("Fully centralised : un controleur centralise commande tous les agents. Optimal mais ne passe pas a l'echelle."),
      space(),
      infoBox("Paradigme CTDE", "Le CTDE est le paradigme dominant du MARL cooperatif moderne. Pendant l'entrainement, un critique centralise acces a tous les etats et actions. Pendant l'execution, chaque agent n'utilise que ses observations locales. QMIX, MADDPG, COMA et MAPPO suivent tous ce paradigme."),
      space(),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════
      H1("CHAPITRE 5 — DEEP MARL"),
      // ═══════════════════════════════════════════════════════════════
      H2("5.1  Algorithmes cooperatifs a base de valeur"),
      H3("VDN (Value Decomposition Networks)"),
      P("VDN factorise la fonction de valeur jointe Q_tot comme la somme des valeurs individuelles : Q_tot(s, a) = \u03A3_i Q_i(o_i, a_i). Simple mais restrictif (pas de cooperation non-lineaire)."),
      H3("QMIX"),
      P("QMIX etend VDN en permettant une factorisation monotone (non-lineaire) : Q_tot = f(Q_1,...,Q_n, s) ou f est un reseau hyperbolique a poids positifs. La monotonie garantit la coherence entre argmax individuel et argmax joint (propriete IGM — Individual Global Max)."),
      H3("QPLEX"),
      P("QPLEX generalise QMIX avec un mecanisme d'attention duplexe permettant de representer des valeurs jointes arbitraires tout en maintenant la propriete IGM."),
      H2("5.2  Algorithmes cooperatifs actor-critic"),
      H3("MADDPG (Multi-Agent Deep Deterministic Policy Gradient)"),
      P("Extension de DDPG au cadre multi-agent. Chaque agent a un acteur et un critique central. Le critique de l'agent i recoit les observations et actions de TOUS les agents, permettant une evaluation precise pendant l'entrainement."),
      H3("COMA (Counterfactual Multi-Agent Policy Gradients)"),
      P("Utilise une ligne de base contrefactuelle pour l'attribution de credit : A_i(s,a) = Q(s,a) - \u03A3_{a'_i} \u03C0_i(a'_i|o_i) Q(s,(a_{-i}, a'_i)). Permet d'isoler la contribution individuelle de l'agent i."),
      H3("MAPPO (Multi-Agent PPO)"),
      P("Application directe de PPO au cadre cooperatif avec critique centralise. Fonctionne remarquablement bien dans la pratique malgre sa simplicite (Yu et al., 2021 montrent que MAPPO surpasse souvent des methodes plus complexes)."),
      space(),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2200, 1800, 2000, 1800, 1560],
        rows: [
          new TableRow({ children: [
            ["Algorithme","Paradigme","Factorisation","Communication","Complexite"].map((h,i) =>
              new TableCell({
                borders, shading: { fill: DARK_BLUE, type: ShadingType.CLEAR },
                width: { size: [2200,1800,2000,1800,1560][i], type: WidthType.DXA },
                margins: { top: 60, bottom: 60, left: 100, right: 100 },
                children: [new Paragraph({ children: [Bold(h, WHITE)], alignment: AlignmentType.CENTER })]
              })
            )
          ]}),
          ...[ ["VDN","CTDE","Additive","Non","Faible"],
               ["QMIX","CTDE","Monotone","Non","Moyenne"],
               ["QPLEX","CTDE","Duplexe","Non","Elevee"],
               ["MADDPG","CTDE","Aucune","Non","Moyenne"],
               ["COMA","CTDE","Aucune","Non","Elevee"],
               ["MAPPO","CTDE","Aucune","Non","Faible"],
          ].map((row, ri) => new TableRow({ children: row.map((cell, ci) =>
            new TableCell({
              borders,
              shading: { fill: ri%2===0 ? WHITE : LIGHT_BLUE, type: ShadingType.CLEAR },
              width: { size: [2200,1800,2000,1800,1560][ci], type: WidthType.DXA },
              margins: { top: 50, bottom: 50, left: 100, right: 100 },
              children: [new Paragraph({ children: [T(cell)], alignment: AlignmentType.CENTER })]
            })
          )}))
        ]
      }),
      space(),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════
      H1("CHAPITRE 6 — MARL COOPERATIF"),
      // ═══════════════════════════════════════════════════════════════
      H2("6.1  Decouverte de l'equipe et coordination emergente"),
      P("La cooperation necessite que les agents developpent des comportements coordonnes sans communication explicite. Les mecanismes cles sont : la symetrie de roles, les conventions emergentes, les normes sociales. Le défi principal est le problème de la relative surpopulation (relative overgeneralization) : l'apprentissage independant peut converger vers des sous-optima cooperatifs."),
      H2("6.2  Attribution de credit (Credit Assignment)"),
      P("L'attribution de credit est le probleme de determiner quelle contribution individuelle a genere une recompense collective. Solutions : recompenses de difference (D_i = R - R_{-i}), COMA (contrefactuelle), QPLEX (decomposition attentionnelle). Une bonne attribution de credit accelere la convergence et produit des comportements plus equitables."),
      H2("6.3  Role et diversite des agents"),
      bullet("Homogeneite : tous les agents partagent les memes parametres (parameter sharing). Tres efficace en termes de sample efficiency."),
      bullet("Heterogeneite : chaque agent a ses propres parametres ou son propre type."),
      bullet("Agents a roles : specialisation des comportements (attaquant/defenseur, explorateur/exploiteur)."),
      space(),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════
      H1("CHAPITRE 7 — COMMUNICATION EN MARL"),
      // ═══════════════════════════════════════════════════════════════
      H2("7.1  Pourquoi la communication ?"),
      P("Les observations partielles limitent la qualite des decisions individuelles. La communication permet aux agents de partager de l'information, de coordonner leurs actions et de reduire l'incertitude. Le defi est d'apprendre QUOI communiquer, QUAND et A QUI."),
      H2("7.2  Architectures de communication apprise"),
      H3("CommNet (Sukhbaatar et al., 2016)"),
      P("Premier modele de communication continue apprise. Les agents s'envoient des vecteurs continus via un reseau de neurones. La communication est globale (all-to-all) et differentiable, permettant une optimisation de bout en bout."),
      H3("DIAL (Differentiable Inter-Agent Learning, Foerster et al., 2016)"),
      P("Permet aux messages de transmettre des gradients pendant l'entrainement (soft messages) et des bits discrets pendant l'execution (hard messages). Separation claire entrainement/execution."),
      H3("TarMAC (Das et al., 2019)"),
      P("Utilise une attention ciblee : chaque agent genere une cle et une valeur, les autres agents utilisent des requetes pour selectionner l'information pertinente. Base sur le mecanisme d'attention."),
      H3("MASIA et graphes de communication"),
      P("Des travaux recents modellisent la communication comme un graphe dynamique : les agents decident de l'architecture du graphe de communication en fonction du contexte, reduisant la bande passante et ameliorant la scalabilite."),
      H2("7.3  Communication emergente vs prescrite"),
      bullet("Communication emergente : les agents developpent leur propre protocole de communication au cours de l'apprentissage."),
      bullet("Communication prescrite : le protocol est concu a l'avance (ex. broadcast, point-a-point)."),
      bullet("Compositionnalite : propriete que les messages emergents soient interpretes de maniere systematique, signe de structuration semantique."),
      space(),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════
      H1("CHAPITRE 8 — MODELISATION DES COEQUIPIERS ET ADVERSAIRES"),
      // ═══════════════════════════════════════════════════════════════
      H2("8.1  Pourquoi modeliser les autres agents ?"),
      P("La modelisation des autres agents (opponent/teammate modeling) permet a un agent de predire les actions futures des autres et d'adapter sa strategie. Cela est particulierement utile en open-endedness (nouveaux agents inconnus) et dans les jeux competitifs."),
      H2("8.2  Types de modeles d'agents"),
      bullet("Modeles de type : representation explicite des preferences/strategies d'un agent."),
      bullet("Modeles de politique : approximation directe de la politique des autres agents par regression ou imitation."),
      bullet("Modeles bayesiens : distribution de probabilite sur le type ou la politique d'un agent, mise a jour par observations."),
      H2("8.3  Ad Hoc Teamwork (AHT)"),
      P("Le paradigme AHT etudie comment un agent peut cooperer efficacement avec des coequipiers inconnus sans phase d'entrainement commune. Approches : reconnaissance de types a partir du comportement observe, portfolios de strategies de cooperation, meta-learning."),
      H2("8.4  Algorithmes representatifs"),
      bullet("LOLA (Learning with Opponent-Learning Awareness) : l'agent anticipe comment ses actions vont affecter l'apprentissage des autres agents."),
      bullet("MADDPG avec modelisation : extension avec un module de prediction de la politique adversaire."),
      bullet("ToMnet (Theory of Mind Network) : reseau de neurones predit les buts, croyances et actions des autres agents via un module de 'theorie de l'esprit'."),
      space(),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════
      H1("CHAPITRE 9 — MARL NON-COOPERATIF"),
      // ═══════════════════════════════════════════════════════════════
      H2("9.1  Jeux a somme nulle"),
      P("Dans les jeux a somme nulle a 2 joueurs, le concept solution est l'equilibre minimax. En MARL, cela correspond a apprendre une politique qui maximise son gain dans le pire cas (adversaire optimal)."),
      H2("9.2  Algorithmes pour jeux competitifs"),
      bullet("Self-play : l'agent s'entraine contre des copies de lui-meme. Tres efficace pour les jeux a 2 joueurs symetriques (ex. jeux de plateau)."),
      bullet("Fictitious self-play (FSP) : l'agent s'entraine contre la politique moyenne historique de l'adversaire."),
      bullet("Neural Fictitious Self-Play (NFSP) : extension avec des reseaux de neurones, scalable aux grands espaces d'etats (Heinrich & Silver, 2016)."),
      bullet("AlphaZero / MuZero : self-play associe a MCTS et a un modele du monde. Performances suprahumaines aux jeux de plateau."),
      H2("9.3  Jeux generaux (General-Sum)"),
      P("La plupart des problemes reels sont general-sum : la somme des recompenses n'est pas nulle. Les agents peuvent avoir des interlts partiellement alignes. Concept solution : equilibre de Nash generalise. Algorithmes : Nashconv minimization, exploitability descent."),
      space(),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════
      H1("CHAPITRE 10 — MEAN-FIELD GAMES"),
      // ═══════════════════════════════════════════════════════════════
      H2("10.1  Motivation : passage a l'echelle"),
      P("Quand le nombre d'agents devient tres grand (des milliers ou millions), il devient computationnellement infaisable de modeliser explicitement toutes les interactions. La theorie des mean-field games (MFG) resout ce probleme en approchant l'interaction d'un agent avec la population par l'interaction avec la distribution moyenne de la population."),
      H2("10.2  Formalisme MFG"),
      P("Chaque agent optimise face a une distribution moyenne empirique mu des etats de la population. En equilibre, la strategie optimale face a mu doit etre coherente avec mu (fixed-point). Sous certaines conditions de regularite, cet equilibre existe et est unique."),
      H2("10.3  Mean-Field MARL"),
      bullet("MF-Q (Yang et al., 2018) : approxime les interactions voisines par leur action moyenne. Algorithme Q-learning scalable a tres grand nombre d'agents."),
      bullet("MF-AC : extension actor-critic du mean-field approximation."),
      bullet("Applications : controle de foules, marches financiers avec nombreux operateurs, reseaux ad hoc."),
      space(),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════
      H1("CHAPITRE 11 — OFFLINE MARL ET MULTI-TASK"),
      // ═══════════════════════════════════════════════════════════════
      H2("11.1  Offline MARL"),
      P("L'offline MARL (ou batch MARL) apprend des politiques a partir d'un jeu de donnees pre-collecte sans interaction avec l'environnement. Les defis principaux sont la distribution shift (la politique apprise differe de la politique de collecte) et le bootstrapping hors distribution."),
      bullet("OMAR (Offline MARL with Opponent Modeling and Reward shaping) : estimation pessimiste des valeurs hors distribution."),
      bullet("MADT (Multi-Agent Decision Transformer) : modelise l'apprentissage offline comme un probleme de sequence modeling."),
      H2("11.2  Transfer et multi-task MARL"),
      P("Le transfert de connaissances entre taches permet de reduire le cout d'echantillonnage dans de nouveaux environnements."),
      bullet("Parameter sharing inter-taches : partage d'encodeurs d'observations entre taches similaires."),
      bullet("Meta-MARL (MAML multi-agent) : apprendre des politiques generalisables a nouvelles taches en quelques pas de gradient."),
      bullet("QPLEX multi-task : generalisation des decompositions de valeur a plusieurs taches simultanement."),
      space(),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════
      H1("CHAPITRE 12 — SURETE EN MARL (SAFE MARL)"),
      // ═══════════════════════════════════════════════════════════════
      H2("12.1  Pourquoi la surete est-elle critique ?"),
      P("Dans les systemes cyber-physiques, la robotique et les infrastructures critiques, les agents doivent satisfaire des contraintes de surete strictes (eviter les collisions, rester dans des plages de fonctionnement, ne pas nuire aux humains). Le Safe MARL integre ces contraintes dans le processus d'apprentissage."),
      H2("12.2  Formalismes de surete"),
      bullet("Constrained Markov Decision Processes (CMDP) : ajout de contraintes de type E[\u03A3 c_t] \u2264 d au MDP standard."),
      bullet("Shields logiques : un module externe verifie les actions proposees contre une specification formelle (LTL, signal temporal logic) et bloque les actions non-sures."),
      bullet("Lyapunov stability : politiques qui garantissent la stabilite asymptotique d'un etat cible."),
      H2("12.3  Algorithmes Safe MARL"),
      bullet("Multi-agent Lagrangian methods : extension des methodes de Lagrange pour CMDP au cadre multi-agent. Chaque agent possede un multiplicateur de Lagrange adaptatif."),
      bullet("MACPO (Multi-Agent Constrained Policy Optimization) : generalise CPO au MARL cooperatif avec garanties de monotonie des contraintes."),
      bullet("Robust MARL : optimise les politiques dans le pire cas d'une incertitude sur le modele (robustesse aux perturbations d'etat, aux agents byzantins)."),
      H2("12.4  Robustesse aux agents malveillants"),
      P("Dans les environnements ouverts, certains agents peuvent etre defaillants ou malveillants (byzantins). Les mecanismes de detection et d'exclusion d'agents byzanins sont essentiels pour maintenir la surete collective. Approches : agregation robuste (median geometrique, KRUM), detectors d'anomalie distribues."),
      space(),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════
      H1("CHAPITRE 13 — MARL EN PRATIQUE : OUTILS ET APPLICATIONS"),
      // ═══════════════════════════════════════════════════════════════
      H2("13.1  Environnements de benchmark"),
      bullet("SMAC (StarCraft Multi-Agent Challenge) : battles de micromanagement dans StarCraft II. Reference pour la cooperation homogene."),
      bullet("Google Research Football : jeu de football multi-agent avec physique realiste."),
      bullet("MPE (Multi-Agent Particle Environments, OpenAI) : environnements legers pour tester cooperation, communication, competition."),
      bullet("RWARE (Robot Warehouse) : robots autonomes dans un entrepot, cooperation requise."),
      bullet("MAgent : simulations a tres grande echelle (millions d'agents) en grille."),
      H2("13.2  Librairies logicielles"),
      bullet("EPyMARL : extension de PyMARL avec de nombreux algorithmes (QMIX, MADDPG, MAPPO, etc.) et benchmarks standardises."),
      bullet("RLlib (Ray) : framework scalable supportant le MARL distribue."),
      bullet("OpenSpiel (DeepMind) : collection de jeux pour la recherche en theorie des jeux et MARL."),
      bullet("MARLLIB : bibliotheque unifiee pour MARL cooperatif sur RLlib."),
      H2("13.3  Applications reelles"),
      bullet("Robotique collaborative : manipulation cooperative d'objets, formations de drones."),
      bullet("Reseaux electriques intelligents : gestion cooperative de la demande et de l'offre."),
      bullet("Trafic autonome : coordination d'intersections, convois de vehicules autonomes."),
      bullet("Jeux video et simulateurs : IA de jeux de strategie, personnages non-joueurs cooperatifs."),
      bullet("Finance algorithmique : strategies de trading multi-agents sur marches electroniques."),
      space(),

      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════
      H1("SYNTHESE ET PERSPECTIVES"),
      // ═══════════════════════════════════════════════════════════════
      H2("Points forts du livre"),
      bullet("Couverture exhaustive des fondements theoriques (theorie des jeux, MDPs, POSG) jusqu'aux algorithmes de pointe."),
      bullet("Traitement egal des scenarios cooperatifs, competitifs et mixtes."),
      bullet("Integration des developpements les plus recents : mean-field games, offline MARL, safe MARL."),
      bullet("Nombreux pseudocodes et exemples d'environnements de benchmark."),
      H2("Limites et perspectives ouvertes"),
      bullet("L'explicabilite (XAI) des politiques MARL reste sous-traitee — verrou scientifique majeur."),
      bullet("L'open-endedness (agents arrivant/partant dynamiquement) est mentionne mais peu formalise."),
      bullet("Le passage du simulateur a l'environnement reel (sim-to-real gap) reste un defi ouvert."),
      bullet("L'ethique et l'equite dans les systemes multi-agents a grande echelle meritent plus d'attention."),
      space(),
      infoBox("Pour la these", "Le livre fournit les fondements theoriques complets. La these contribuera sur les aspects non couverts : apprentissage cooperatif en environnements ouverts, methodes d'explicabilite MARL (XAI multi-agent), et garanties de fiabilite formelles pour agents heterogenes — trois axes a fort potentiel de contribution originale."),
      space(),
      new Paragraph({ children: [new PageBreak()] }),

      // ═══════════════════════════════════════════════════════════════
      H1("GLOSSAIRE DES TERMES CLES"),
      // ═══════════════════════════════════════════════════════════════
      ...[
        ["MARL","Multi-Agent Reinforcement Learning : apprentissage par renforcement dans un cadre multi-agent."],
        ["MDP","Markov Decision Process : modele formel de decision sequentielle mono-agent."],
        ["POSG","Partially Observable Stochastic Game : jeu stochastique a observations partielles, formalisme principal du MARL."],
        ["CTDE","Centralised Training, Decentralised Execution : paradigme dominant du MARL cooperatif moderne."],
        ["IGM","Individual Global Max : propriete garantissant la coherence entre optimisation individuelle et collective."],
        ["EN","Equilibre de Nash : configuration ou aucun agent ne peut ameliorer son gain en deviavant unilateralement."],
        ["AHT","Ad Hoc Teamwork : cooperation avec des coequipiers inconnus sans entrainement commun."],
        ["Safe MARL","MARL avec contraintes de surete : apprentissage sous contraintes formelles de securite."],
        ["CMDP","Constrained MDP : MDP avec contraintes additionnelles sur l'esperance de cout."],
        ["MFG","Mean-Field Game : approximation des interactions multi-agents par distribution moyenne de population."],
        ["XAI","Explainable AI : techniques pour rendre les decisions des systemes d'IA interpretables par des humains."],
        ["Sample efficiency","Efficacite d'echantillonnage : capacite a apprendre rapidement avec peu d'interactions environnementales."],
      ].map(([term, def]) => new Table({
        width: { size: 9360, type: WidthType.DXA }, columnWidths: [2000, 7360],
        rows: [new TableRow({ children: [
          new TableCell({
            borders, shading: { fill: MID_BLUE, type: ShadingType.CLEAR },
            width: { size: 2000, type: WidthType.DXA },
            margins: { top: 60, bottom: 60, left: 120, right: 120 },
            children: [new Paragraph({ children: [Bold(term, WHITE)], alignment: AlignmentType.CENTER })]
          }),
          new TableCell({
            borders, shading: { fill: LIGHT_GRAY, type: ShadingType.CLEAR },
            width: { size: 7360, type: WidthType.DXA },
            margins: { top: 60, bottom: 60, left: 140, right: 120 },
            children: [new Paragraph({ children: [T(def)] })]
          })
        ]})]
      })),
      space(),
      H2("References principales du livre"),
      ...[
        "Mnih, V. et al. (2015). Human-level control through deep reinforcement learning. Nature.",
        "Rashid, T. et al. (2018). QMIX: Monotonic Value Function Factorisation for Deep MARL. ICML.",
        "Lowe, R. et al. (2017). Multi-Agent Actor-Critic for Mixed Cooperative-Competitive Environments. NeurIPS.",
        "Foerster, J. et al. (2018). Counterfactual Multi-Agent Policy Gradients. AAAI.",
        "Yu, C. et al. (2021). The Surprising Effectiveness of MAPPO in Cooperative Multi-Agent Games. NeurIPS.",
        "Yang, Y. et al. (2018). Mean Field Multi-Agent Reinforcement Learning. ICML.",
        "Das, A. et al. (2019). TarMAC: Targeted Multi-Agent Communication. ICML.",
        "Heinrich, J. & Silver, D. (2016). Deep Reinforcement Learning from Self-Play in Imperfect-Information Games. NeurIPS.",
      ].map((ref, i) => new Paragraph({
        children: [T(`[${i+1}] ${ref}`)],
        spacing: { after: 60 },
        indent: { left: 300 }
      })),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('Resume_MARL_Livre.docx', buf);
  console.log('DOCX OK');
}).catch(e => { console.error(e); process.exit(1); });