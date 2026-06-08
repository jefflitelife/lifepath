import { useState, useEffect, useRef, useMemo, useContext } from "react";
import TreeVisual from "./TreeVisual";
import { Ctx } from "./ctx";

// ━━━ TOKENS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const T={bg:"#070709",sf:"#0f0f12",sfh:"#16161b",bd:"rgba(255,255,255,0.07)",tx:"#EEEAE0",mt:"#5a5a6e",sb:"#2e2e38",ac:"#C8FF00",acd:"rgba(200,255,0,0.10)",acg:"rgba(200,255,0,0.22)",bl:"#4D9FFF",gr:"#22C55E",grd:"rgba(34,197,94,0.10)",or:"#FF7A3D",ord:"rgba(255,122,61,0.10)",pu:"#A855F7",pud:"rgba(168,85,247,0.10)",rd:"#FF4D4D",yl:"#F59E0B",pk:"#EC4899",sl:"#64748B",nv:"#1E40AF",fd:"'Syne',sans-serif",fb:"'DM Sans',sans-serif"};

// ━━━ CATEGORIES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CATS=[{v:"all",l:"Tous",i:"⊕"},{v:"tech",l:"Tech",i:"💻"},{v:"creative",l:"Créatif",i:"🎨"},{v:"business",l:"Business",i:"📈"},{v:"health",l:"Santé",i:"🏥"},{v:"craft",l:"Artisanat",i:"🔧"},{v:"education",l:"Éducation",i:"📚"},{v:"finance",l:"Finance",i:"💰"}];

// ━━━ 30 CAREERS — compact but complete ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Each career: id, emoji, title, color, cat, duration, cost, level, salary{j,m,s}, tagline, skills[], safetyScore, milestones[{phase,duration,months,icon,objective,tasks[],dailyHabits[],resources[{name,url,cost,duration,level,desc}],validation[],skills_unlocked[],cost,cost_detail}]
const C = {
fullstack:{id:"fullstack",e:"💻",t:"Développeur Full-Stack",c:T.ac,cat:"tech",dur:"24 mois",cost:"800–2400€",lv:"Intermédiaire",sal:{j:"35–42K€",m:"45–60K€",s:"65–90K€"},tag:"Applications web de A à Z.",sk:["HTML/CSS","JavaScript","React","Node.js","SQL","Git","API REST"],ss:70,ms:[
{p:"Fondations Web",d:"2 mois",mo:"Mois 1–2",i:"🌐",obj:"Créer vos premières pages web.",tasks:["HTML5 sémantique, formulaires","CSS3 Flexbox, Grid, responsive","DOM et DevTools","3 pages statiques complètes"],dh:["30 min HTML/CSS","1 élément portfolio","1 article CSS Tricks","Revoir notes (10 min)"],res:[{n:"The Odin Project",u:"https://theodinproject.com",co:"Gratuit",du:"60–70h",lv:"Débutant",de:"Parcours complet dev web de zéro."},{n:"freeCodeCamp",u:"https://freecodecamp.org",co:"Gratuit",du:"~80h",lv:"Débutant",de:"Certification Responsive Web Design."}],val:["Page responsive sans doc","HTML sémantique","Flexbox/Grid maîtrisés","1 page sur GitHub Pages"],sku:["HTML5","CSS3","Responsive","GitHub"],co:"0€",cd:"100% gratuit."},
{p:"JavaScript",d:"3 mois",mo:"Mois 3–5",i:"⚡",obj:"Le langage du web moderne.",tasks:["Variables, fonctions, boucles","DOM manipulation","Fetch API, async/await","ES6+, projet mini-app"],dh:["30 min JS","1 exercice 30 Days of JS","1 mini-composant","Relecture (10 min)"],res:[{n:"javascript.info",u:"https://javascript.info",co:"Gratuit",du:"~100h",lv:"Débutant→Inter",de:"Tutoriel JS le plus complet en ligne."}],val:["var/let/const","map/filter/reduce","App avec API externe","Scope et closure"],sku:["JavaScript ES6+","DOM","Async/Await","API Fetch"],co:"0–30€",cd:"Udemy optionnel ~15€."},
{p:"React",d:"4 mois",mo:"Mois 6–9",i:"⚛️",obj:"Interfaces dynamiques.",tasks:["Composants, props, state","React Router","Context API","Tailwind CSS","Projet complet déployé"],dh:["30 min React","1 composant","1 article avancé","Push sur GitHub"],res:[{n:"React Docs",u:"https://react.dev",co:"Gratuit",du:"~40h",lv:"Intermédiaire",de:"Documentation officielle + tutoriels."}],val:["Cycle de vie React","État complexe","Projet déployé Vercel","React DevTools"],sku:["React","Tailwind","React Router","Vercel"],co:"0–200€",cd:"Scrimba Pro optionnel."},
{p:"Backend & BDD",d:"4 mois",mo:"Mois 10–13",i:"🗄",obj:"Serveurs et API.",tasks:["Node.js, Express.js","PostgreSQL, Prisma","Auth JWT","Projet API REST"],dh:["30 min Node/Express","1 endpoint","3 requêtes SQL","Doc Prisma (15 min)"],res:[{n:"Full Stack Open",u:"https://fullstackopen.com",co:"Gratuit",du:"~120h",lv:"Intermédiaire",de:"Cours universitaire complet."}],val:["API REST avec auth","Relations BDD","API sécurisée","Postman maîtrisé"],sku:["Node.js","Express","PostgreSQL","JWT","Prisma"],co:"0–20€/mois",cd:"Supabase gratuit."},
{p:"Projet Full-Stack",d:"3 mois",mo:"Mois 14–16",i:"🚀",obj:"Projet ambitieux complet.",tasks:["Architecture complète","Tests Jest","CI/CD GitHub Actions","Déploiement","Documentation"],dh:["1h de code","2 tests unitaires","1 code review","Documenter 1 endpoint"],res:[{n:"Testing Library",u:"https://testing-library.com",co:"Gratuit",du:"~15h",lv:"Intermédiaire",de:"Tests React accessibles."}],val:["Projet en production","70%+ tests","Code documenté","Choix techniques défendus"],sku:["Tests","CI/CD","DevOps","Architecture"],co:"5–25€/mois",cd:"VPS ~6€/mois."},
{p:"1er poste",d:"2–4 mois",mo:"Mois 17–20",i:"🎯",obj:"Décrocher un poste junior.",tasks:["Portfolio 3 projets","LinkedIn/GitHub","LeetCode","5–10 candidatures/sem","Meetups"],dh:["1 LeetCode","2 candidatures","30 min prépa entretien","1 interaction LinkedIn"],res:[{n:"LeetCode",u:"https://leetcode.com",co:"Gratuit/35€/mois",du:"~50h",lv:"Intermédiaire",de:"Exercices algorithmiques."}],val:["Retours positifs portfolio","5+ entretiens","LeetCode easy <20min","1 offre reçue"],sku:["Algorithmique","Soft skills","Négociation"],co:"0–50€",cd:"LeetCode Premium optionnel."}
]},
uxdesign:{id:"uxdesign",e:"🎨",t:"Designer UX/UI",c:T.or,cat:"creative",dur:"18 mois",cost:"300–1200€",lv:"Accessible",sal:{j:"30–38K€",m:"40–55K€",s:"60–80K€"},tag:"Expériences numériques captivantes.",sk:["Figma","User Research","Wireframing","Prototypage","Design System"],ss:85,ms:[
{p:"Fondamentaux Design",d:"2 mois",mo:"Mois 1–2",i:"🎯",obj:"Principes visuels et UX.",tasks:["Théorie des couleurs","Typographie","10 heuristiques Nielsen","Gestalt","Analyser 10 interfaces"],dh:["Analyser 1 app (15 min)","1 article NNGroup","Wireframes (20 min)","Principes Gestalt (10 min)"],res:[{n:"Google UX Certificate",u:"https://grow.google/certificates/ux-design",co:"~240€",du:"~200h",lv:"Débutant",de:"Certification Google reconnue."}],val:["Expliquer bon/mauvais design","Contraste WCAG","3 analyses critiques","Biais cognitifs UX"],sku:["Design Thinking","Heuristiques UX","Accessibilité"],co:"0–330€",cd:"Google Certificate recommandé."},
{p:"Figma",d:"2 mois",mo:"Mois 3–4",i:"✏️",obj:"L'outil standard.",tasks:["Frames, composants, styles","Auto-layout","Variantes","Prototypage","Recréer 5 interfaces"],dh:["30 min Figma","1 composant d'app","1 fichier Community","Auto-layout (15 min)"],res:[{n:"Figma Learn",u:"https://help.figma.com",co:"Gratuit",du:"~30h",lv:"Débutant",de:"Documentation officielle."}],val:["Composants avec variantes","Auto-layout correct","Mini design system","Prototype navigable"],sku:["Figma avancé","Design System","Prototypage"],co:"0–150€",cd:"Figma gratuit."},
{p:"UX Research",d:"3 mois",mo:"Mois 5–7",i:"🔍",obj:"Comprendre les utilisateurs.",tasks:["Interviews","Personas","Tests utilisabilité","Card sorting","5 vraies interviews"],dh:["1 article NNGroup","1 question d'interview","1 retour utilisateur","Journey map"],res:[{n:"Nielsen Norman Group",u:"https://nngroup.com/articles",co:"Gratuit",du:"Référence",lv:"Intermédiaire",de:"Articles UX de référence."}],val:["5 interviews + synthèse","Personas data-driven","Prototype testé 3+ users","Rapport lisible"],sku:["User Research","Personas","Journey Map","Tests"],co:"0–50€",cd:"Maze gratuit."},
{p:"Projet Portfolio",d:"3 mois",mo:"Mois 8–10",i:"📋",obj:"Produit de A à Z.",tasks:["Problème réel","Discovery→Design→Test","Case study complet"],dh:["1h case study","Itérer 1 écran","1 feedback","Documenter 1 décision"],res:[{n:"Behance",u:"https://behance.net",co:"Gratuit",du:"Référence",lv:"Tous",de:"Inspiration portfolios."}],val:["Case study clair","Décisions justifiées","Validé 5+ users","Portfolio pro"],sku:["Case Study","Design Process","Storytelling"],co:"0–30€",cd:"Notion/Webflow gratuit."},
{p:"Design System",d:"2 mois",mo:"Mois 11–12",i:"🔧",obj:"Systèmes et collaboration.",tasks:["DS complet","Contribuer à un DS open-source","Bases CSS","Documentation"],dh:["1 composant","1 article DS","CSS (20 min)","Review 1 composant"],res:[{n:"Design Systems Handbook",u:"https://designsystems.com",co:"Gratuit",du:"~10h",lv:"Intermédiaire",de:"Guide complet DS."}],val:["20+ composants","Contribution DS","CSS custom properties","Dev peut implémenter seul"],sku:["Design System avancé","Tokens","Documentation"],co:"0–100€",cd:"Outils gratuits."},
{p:"1er poste",d:"Dès mois 13",mo:"Mois 13–18",i:"🎯",obj:"Intégrer une équipe produit.",tasks:["3 case studies","Postuler startups","Présentation portfolio","Présence Dribbble/LinkedIn"],dh:["1 case study","1 candidature","30 min prépa","1 post LinkedIn"],res:[{n:"ADPList",u:"https://adplist.org",co:"Gratuit",du:"1h/session",lv:"Tous",de:"Mentorat gratuit designers."}],val:["Portfolio attire demandes","Retour positif senior","3+ entretiens","Premier contrat"],sku:["Présentation","Feedback culture","Présence en ligne"],co:"0€",cd:"ADPList gratuit."}
]},
dataanalyst:{id:"dataanalyst",e:"📊",t:"Data Analyst",c:T.bl,cat:"tech",dur:"20 mois",cost:"200–900€",lv:"Intermédiaire",sal:{j:"35–42K€",m:"45–62K€",s:"65–90K€"},tag:"Données → décisions stratégiques.",sk:["SQL","Python","Excel","Tableau","Power BI","Statistiques"],ss:78,ms:[
{p:"Excel & Stats",d:"2 mois",mo:"Mois 1–2",i:"📐",obj:"Excel et statistiques.",tasks:["TCD, RECHERCHEV","Fonctions stats","Graphiques","Stats descriptives","Dataset réel"],dh:["20 min Khan Academy","1 graphique","1 formule avancée","1 mini-dataset"],res:[{n:"Khan Academy Stats",u:"https://khanacademy.org/math/statistics-probability",co:"Gratuit",du:"~40h",lv:"Débutant",de:"Cours interactifs stats."}],val:["TCD complexes","Bon graphique","Corrélation vs causalité","Dataset analysé"],sku:["Excel avancé","Stats descriptives"],co:"0€",cd:"Google Sheets gratuit."},
{p:"SQL",d:"3 mois",mo:"Mois 3–5",i:"🗃",obj:"Interroger toute base.",tasks:["SELECT/WHERE/JOIN","GROUP BY/HAVING","CTEs","Window functions","20 requêtes"],dh:["3 exercices SQLZoo","1 requête CTE","Window functions (15 min)","1 LeetCode SQL"],res:[{n:"SQLZoo",u:"https://sqlzoo.net",co:"Gratuit",du:"~20h",lv:"Débutant",de:"Exercices SQL interactifs."}],val:["Exercices intermédiaires","Plans d'exécution","CTEs","Métriques business"],sku:["SQL intermédiaire","PostgreSQL"],co:"0€",cd:"Tout gratuit."},
{p:"Python Data",d:"4 mois",mo:"Mois 6–9",i:"🐍",obj:"Automatiser les analyses.",tasks:["Python basique","Pandas","NumPy","Matplotlib/Seaborn","Jupyter","Projet ~100K lignes"],dh:["30 min Python/Pandas","1 exercice Kaggle","1 viz Seaborn","Documenter Jupyter"],res:[{n:"Kaggle Python",u:"https://kaggle.com/learn/python",co:"Gratuit",du:"~15h",lv:"Débutant",de:"Micro-cours avec exercices."}],val:["Nettoyer dataset <1h","Joindre DataFrames","Graphiques lisibles","Jupyter documenté"],sku:["Python","Pandas","NumPy","Seaborn","Jupyter"],co:"0–30€",cd:"Python gratuit."},
{p:"Visualisation",d:"3 mois",mo:"Mois 10–12",i:"📈",obj:"Dashboards décisionnels.",tasks:["Tableau Public","Power BI","Data storytelling","Dashboard exécutif"],dh:["30 min Tableau/PBI","1 graphique","1 chapitre StoryData","Critiquer 1 dashboard"],res:[{n:"Storytelling with Data",u:"https://storytellingwithdata.com",co:"~25€",du:"~15h",lv:"Tous",de:"LE livre communication data."}],val:["Dashboard compréhensible 2 min","Bon graphique","100+ vues Tableau","Raconter avec les données"],sku:["Tableau","Power BI","Data Storytelling"],co:"25–50€",cd:"Livre ~25€."},
{p:"Projet Capstone",d:"3 mois",mo:"Mois 13–15",i:"🏗",obj:"Analyse complète.",tasks:["Domaine choisi","Données réelles","Python + SQL","Dashboard final","Article"],dh:["1h capstone","1 paragraphe article","1 viz","1 feedback pair"],res:[{n:"Data.gouv.fr",u:"https://data.gouv.fr",co:"Gratuit",du:"Référence",lv:"Tous",de:"Données ouvertes FR."}],val:["Cycle complet","Recommandations actionnables","Article positif","Questions maîtrisées"],sku:["Analyse end-to-end","Communication data"],co:"0€",cd:"Open-source."},
{p:"1er poste Data",d:"Dès mois 16",mo:"Mois 16–20",i:"🎯",obj:"Intégrer une équipe data.",tasks:["Entretiens SQL live","Business cases","Cibler fintech/e-commerce","Négocier salaire"],dh:["1 exercice SQL entretien","1 business case","2 candidatures","1 interaction réseau"],res:[{n:"APEC",u:"https://apec.fr",co:"Gratuit",du:"Quotidien",lv:"Tous",de:"Offres cadres FR."}],val:["SQL entretien <15 min","Business case prêt","1 offre","Contrat signé"],sku:["Entretien technique","Business acumen","Négociation"],co:"0€",cd:"Votre temps."}
]},
entrepreneur:{id:"entrepreneur",e:"🚀",t:"Entrepreneur Tech",c:T.pu,cat:"business",dur:"18–36 mois",cost:"500–5000€",lv:"Avancé",sal:{j:"Variable",m:"0–40K€",s:"Exit"},tag:"De l'idée aux premiers clients.",sk:["Validation","No-code","Growth","Pitch","Finance"],ss:90,ms:[
{p:"Validation",d:"2 mois",mo:"Mois 1–2",i:"🔍",obj:"Prouver le problème.",tasks:["20 interviews Mom Test","Analyser concurrence","ICP","Landing page"],dh:["1 interview","MAJ landing","1 concurrent","Documenter"],res:[{n:"The Mom Test",u:"https://momtestbook.com",co:"~15€",du:"~5h",lv:"Débutant",de:"Valider une idée sans que les gens mentent."}],val:["Pattern récurrent","50+ emails","Explication 1 phrase","3 prêts à payer"],sku:["Customer Discovery","Problem/Solution Fit"],co:"15–50€",cd:"Mom Test ~15€."},
{p:"MVP",d:"2–3 mois",mo:"Mois 3–5",i:"⚡",obj:"Version la plus simple.",tasks:["Définir MVP","No-code/code","6 semaines max","Stripe","Bêta fermée"],dh:["2h build","1 utilisateur","1 feedback","1 amélioration"],res:[{n:"Bubble.io",u:"https://bubble.io",co:"Gratuit/29€/mois",du:"~40h",lv:"Débutant",de:"No-code le plus complet."}],val:["MVP en ligne","1 paiement","10 actifs","20 feedbacks"],sku:["No-code","Stripe","Product Management"],co:"50–500€",cd:"Bubble ~29€/mois."},
{p:"Product/Market Fit",d:"4–6 mois",mo:"Mois 6–11",i:"🎯",obj:"Rétention forte.",tasks:["Rétention 30/60/90j","Cycles rapides","Croissance naturelle","PMF survey","Pricing"],dh:["Métriques (15 min)","1 utilisateur","1 amélioration","1 article growth"],res:[{n:"PMF Survey",u:"https://pmf.firstround.com",co:"Gratuit",du:"~5h",lv:"Intermédiaire",de:"Framework mesure PMF."}],val:["Rétention >40%","Revenus prévisibles","Recommandations spontanées","NPS >40"],sku:["Analytics","Rétention","Pricing"],co:"0–200€/mois",cd:"Mixpanel gratuit."},
{p:"Croissance",d:"4–6 mois",mo:"Mois 12–17",i:"📈",obj:"5–10K€ MRR.",tasks:["Canal principal","Funnel complet","Onboarding auto","Contenu organique"],dh:["Check MRR/churn","1 action acquisition","1 contenu","Optimiser funnel"],res:[{n:"Growth.Design",u:"https://growth.design",co:"Gratuit",du:"~15h",lv:"Intermédiaire",de:"Case studies growth."}],val:["MRR +20%/mois","CAC <1/3 LTV","Playbook documenté","Churn <5%"],sku:["Growth","SEO","Sales","Funnel"],co:"200–1000€/mois",cd:"Ads ~200€/mois."},
{p:"Levée/Bootstrap",d:"3–6 mois",mo:"Selon choix",i:"💰",obj:"Financement.",tasks:["Bootstrap vs lever","Pitch deck 10 slides","Term sheet","Pitcher 10+"],dh:["1 slide","Pitcher (10 min)","1 investisseur","1 article levée"],res:[{n:"YC Library",u:"https://ycombinator.com/library",co:"Gratuit",du:"~20h",lv:"Avancé",de:"Ressources YC."}],val:["Pitch 10 slides","Pitché 10+","Term sheet compris","LOI reçue"],sku:["Pitch","Finance startup","Négociation"],co:"0–500€",cd:"Candidatures gratuites."}
]},
infirmier:{id:"infirmier",e:"🏥",t:"Infirmier(ère)",c:T.gr,cat:"health",dur:"36 mois",cost:"Quasi gratuit",lv:"Exigeant",sal:{j:"26–30K€",m:"32–40K€",s:"40–55K€"},tag:"Métier humain et essentiel.",sk:["Soins","Anatomie","Pharmacologie","Communication patient"],ss:97,ms:[
{p:"Admission IFSI",d:"3–6 mois",mo:"Avant entrée",i:"📋",obj:"Intégrer un IFSI.",tasks:["Dossier Parcoursup","Lettre motivation","Entretien oral","Stage observation"],dh:["30 min culture sanitaire","1 question oral","1 article santé","Compléter dossier"],res:[{n:"Parcoursup",u:"https://parcoursup.fr",co:"Gratuit",du:"~20h",lv:"Bac",de:"Plateforme admission IFSI."}],val:["Dossier complet","2 concours blancs","Stage effectué","Admis"],sku:["Culture médicale","Préparation concours"],co:"0–200€",cd:"Prépa optionnelle."},
{p:"1ère Année IFSI",d:"12 mois",mo:"Année 1",i:"📚",obj:"Bases théoriques + stages.",tasks:["Anatomie","Sémiologie","Soins de base","2 stages de 5 semaines"],dh:["45 min anatomie","Gestes du cours","Portfolio clinique","1 fiche de soin"],res:[{n:"Infirmiers.com",u:"https://infirmiers.com",co:"Gratuit",du:"Référence",lv:"Étudiant",de:"Communauté IDE."}],val:["Modules validés","Bons retours stage","Gestes maîtrisés","Portfolio à jour"],sku:["Anatomie","Soins de base","Relation patient"],co:"~50€",cd:"Manuels ~50€."},
{p:"2ème Année",d:"12 mois",mo:"Année 2",i:"💊",obj:"Autonomie clinique.",tasks:["Pharmacologie","Soins techniques","2 stages de 10 semaines","Analyse clinique"],dh:["3 médicaments Vidal","1 protocole","Préparer stage","Quiz anatomie"],res:[{n:"Vidal",u:"https://vidal.fr",co:"Gratuit (base)",du:"Référence",lv:"IDE 2A",de:"Base médicaments FR."}],val:["Chariot médicaments","Soins complexes","Transmissions ciblées","Spécialité identifiée"],sku:["Pharmacologie","Soins techniques","Autonomie clinique"],co:"~40€",cd:"Manuel pharma."},
{p:"3ème Année + DE",d:"12 mois",mo:"Année 3",i:"🎓",obj:"Diplôme d'État.",tasks:["Stages professionnalisants","TFE","Diplôme d'État","Inscription Ordre"],dh:["1h TFE","Révision DE (30 min)","1 entretien embauche","1 article recherche"],res:[{n:"Ordre Infirmiers",u:"https://ordre-infirmiers.fr",co:"~75€/an",du:"Obligatoire",lv:"Diplômé",de:"Inscription obligatoire."}],val:["TFE soutenu","DE obtenu","Inscrit Ordre","Entretiens passés"],sku:["Autonomie pro","Recherche clinique"],co:"~75€",cd:"Cotisation Ordre."}
]},
comptable:{id:"comptable",e:"🧮",t:"Comptable / Expert-Comptable",c:T.yl,cat:"business",dur:"36–60 mois",cost:"2000–15000€",lv:"Exigeant",sal:{j:"28–35K€",m:"40–60K€",s:"70–150K€"},tag:"Pilier indispensable.",sk:["Comptabilité","Fiscalité","Audit","Droit des sociétés"],ss:62,ms:[
{p:"BTS CG",d:"2–3 ans",mo:"Formation initiale",i:"📚",obj:"Fondamentaux comptables.",tasks:["BTS CG complet","Sage/Cegid","Stages","Déclarations fiscales"],dh:["30 min révision","1 exercice fiscalité","Sage (20 min)","1 article Compta Online"],res:[{n:"Compta Online",u:"https://compta-online.com",co:"Gratuit",du:"Référence",lv:"Débutant",de:"Communauté comptabilité."}],val:["BTS validé","Comptabilité courante","Logiciels maîtrisés","Stage validé"],sku:["Comptabilité","Fiscalité TVA","Logiciels"],co:"~4000€/an",cd:"Alternance possible."},
{p:"DCG",d:"3 ans",mo:"En parallèle",i:"📜",obj:"Diplôme Comptabilité.",tasks:["13 UE","Droit, finance, management","Mémoire"],dh:["45 min révision DCG","1 exercice droit","Fiches de la veille","Planning UE"],res:[{n:"INTEC CNAM",u:"https://intec.cnam.fr",co:"~1500€/an",du:"3 ans",lv:"BTS CG",de:"Formation à distance reconnue."}],val:["13 UE validées","Moyenne >10","Mémoire soutenu"],sku:["Droit des sociétés","Finance avancée","Fiscalité"],co:"1500–3000€/an",cd:"Alternance possible."},
{p:"DSCG + Stage EC",d:"2–3 ans",mo:"Après DCG",i:"🎓",obj:"Titre Expert-Comptable.",tasks:["6 UE DSCG","Stage 3 ans","Audit, consolidation","Management"],dh:["30 min DSCG","Revue Fiduciaire (15 min)","1 cas audit","1 norme comptable"],res:[{n:"Revue Fiduciaire",u:"https://revuefiduciaire.com",co:"~150€/an",du:"Mensuel",lv:"DCG",de:"Actualités fiscales."}],val:["6 UE validées","Stage validé","Mémoire DEC","Réseau experts"],sku:["Audit","Consolidation","Direction financière"],co:"~2000€/an",cd:"Stage rémunéré."}
]},
commercial:{id:"commercial",e:"🤝",t:"Commercial / Business Dev",c:T.rd,cat:"business",dur:"12–18 mois",cost:"0–500€",lv:"Accessible",sal:{j:"28–38K€+var",m:"45–65K€",s:"80–120K€+"},tag:"Salaire = performance.",sk:["Prospection","Négociation","CRM","Closing"],ss:83,ms:[
{p:"Fondamentaux Vente",d:"2 mois",mo:"Mois 1–2",i:"📖",obj:"Psychologie de l'achat.",tasks:["SPIN Selling","Cycle de vente","5 objections","Écoute active"],dh:["20 pages SPIN","Pitch (10 min)","1 podcast vente","3 réponses objections"],res:[{n:"SPIN Selling",u:"https://amazon.fr",co:"~20€",du:"~10h",lv:"Débutant",de:"Méthode vente n°1."}],val:["SPIN par cœur","Objections gérées","10 cold calls","Pitch 30s fluide"],sku:["Psychologie acheteur","Cycle de vente","Objections"],co:"~60€",cd:"3 livres ~20€."},
{p:"CRM + Prospection",d:"3 mois",mo:"Mois 3–5",i:"📞",obj:"Pipeline et RDV qualifiés.",tasks:["HubSpot CRM","Cold calling","LinkedIn outreach","Cold emailing","BANT/MEDDIC"],dh:["Pipeline (10 min)","10 appels","5 emails perso","Qualifier 2 prospects"],res:[{n:"HubSpot CRM",u:"https://hubspot.com/products/crm",co:"Gratuit",du:"~15h",lv:"Débutant",de:"CRM gratuit le plus utilisé."}],val:["5+ RDV/semaine","Taux réponse >5%","Script rodé","Qualification systématique"],sku:["HubSpot","Cold calling","Emailing","Qualification"],co:"0–60€/mois",cd:"HubSpot gratuit."},
{p:"Closing + Account",d:"5 mois",mo:"Mois 6–10",i:"🤝",obj:"Signer et fidéliser.",tasks:["Découverte BANT","Closing","Propositions commerciales","QBR","Upsell"],dh:["1 RDV client","1 technique closing","1 article Gong","1 proposition"],res:[{n:"Gong.io Blog",u:"https://gong.io/blog",co:"Gratuit",du:"Référence",lv:"Intermédiaire",de:"Insights millions d'appels."}],val:["Closing >20%","5 deals signés","Rétention >90%","CA +30% portefeuille"],sku:["Closing","Négociation","Account Management"],co:"0€",cd:"Gong gratuit."}
]},
marketing:{id:"marketing",e:"📱",t:"Marketing Digital / CM",c:T.pk,cat:"creative",dur:"12 mois",cost:"0–600€",lv:"Accessible",sal:{j:"24–32K€",m:"35–48K€",s:"50–70K€"},tag:"Audiences → revenus.",sk:["Réseaux sociaux","Content","SEO","Email","Ads"],ss:65,ms:[
{p:"Fondamentaux + Content",d:"4 mois",mo:"Mois 1–4",i:"✍️",obj:"Écosystème digital et contenu.",tasks:["Funnel marketing","Google Analytics","Copywriting AIDA/PAS","Canva","Vidéo courte","Calendrier 30j"],dh:["30 min formation","1 post avec accroche","1 visuel Canva","Analyser 1 post viral"],res:[{n:"Google Digital Garage",u:"https://learndigital.withgoogle.com",co:"Gratuit",du:"~40h",lv:"Débutant",de:"Certification Google marketing."}],val:["Certification GA","20 posts","3 vidéos","100+ interactions"],sku:["Funnel","Analytics","Copywriting","Canva"],co:"0€",cd:"Certifications gratuites."},
{p:"SEO + Email + Ads",d:"4 mois",mo:"Mois 5–8",i:"🔍",obj:"Les canaux rentables.",tasks:["SEO technique","Mots-clés","Email segmentation","Meta Ads","Google Ads","Tracking"],dh:["Optimiser 1 page SEO","1 email marketing","1 mot-clé","Analyser campagnes"],res:[{n:"Moz SEO",u:"https://moz.com/learn/seo",co:"Gratuit",du:"~30h",lv:"Intermédiaire",de:"Guide SEO complet."}],val:["1 article top 3","Taux ouverture >25%","ROAS >2","Certification Google Ads"],sku:["SEO","Email automation","Meta Ads","Google Ads"],co:"0–200€",cd:"Budget test ads."},
{p:"1er poste/Freelance",d:"Dès mois 9",mo:"Mois 9–12",i:"🎯",obj:"Poste ou freelance.",tasks:["Portfolio 3 cas","Malt/LinkedIn","Tarifs","Négocier"],dh:["1 cas portfolio","1 candidature","1 post LinkedIn","1 message réseau"],res:[{n:"Malt",u:"https://malt.fr",co:"Gratuit",du:"Quotidien",lv:"Tous",de:"Freelance n°1 France."}],val:["Portfolio chiffré","Premier contrat","TJM négocié","LinkedIn actif"],sku:["Portfolio","Personal branding","Freelance"],co:"0€",cd:"Malt gratuit."}
]},
architecte:{id:"architecte",e:"🏛",t:"Architecte",c:T.sl,cat:"creative",dur:"72 mois",cost:"15000–35000€",lv:"Très exigeant",sal:{j:"28–35K€",m:"40–60K€",s:"65–120K€"},tag:"Créer des espaces de vie.",sk:["Dessin","AutoCAD/Revit","Droit construction","Urbanisme","BIM"],ss:88,ms:[
{p:"Admission ENSA",d:"1–2 ans",mo:"Avant entrée",i:"📋",obj:"Intégrer une ENSA.",tasks:["Book 15+ créations","Lettre motivation","Visiter 3 ENSA","Stage agence"],dh:["1h dessin","1 projet ArchDaily","Book (30 min)","1 bâtiment remarquable"],res:[{n:"ArchDaily",u:"https://archdaily.com",co:"Gratuit",du:"Référence",lv:"Tous",de:"Inspiration architecturale mondiale."}],val:["Book 15+ œuvres","3 ENSA visitées","Admis","Culture architecturale"],sku:["Culture architecturale","Dessin"],co:"0–1500€",cd:"Prépa optionnelle."},
{p:"Licence + Master ENSA",d:"5 ans",mo:"Années 1–5",i:"📐",obj:"Fondamentaux → vision personnelle.",tasks:["Ateliers de projet","AutoCAD/SketchUp/Revit","Histoire et théorie","BIM","Stages","Mémoire"],dh:["1h30 projet","30 min CAD/Revit","1 article Dezeen","Mémoire (30 min)"],res:[{n:"AutoCAD Education",u:"https://autodesk.com/education",co:"Gratuit étudiant",du:"~60h",lv:"Étudiant",de:"Licence gratuite AutoCAD."}],val:["5 ans validés","Projet remarqué","BIM maîtrisé","Mémoire soutenu"],sku:["Projet architectural","AutoCAD","Revit","BIM"],co:"~500€/an",cd:"Logiciels gratuits étudiants."},
{p:"HMONP + Exercice",d:"Variable",mo:"Post-Master",i:"📜",obj:"Exercer et signer.",tasks:["HMONP","Inscription Ordre","Projets complets","Spécialisation","Concours"],dh:["Mémoire pro (45 min)","1 aspect réglementaire","Maître de stage","Préparer soutenance"],res:[{n:"Ordre Architectes",u:"https://architectes.org",co:"~350€/an",du:"Obligatoire",lv:"Master",de:"Inscription obligatoire."}],val:["HMONP obtenue","Inscrit Ordre","1 bâtiment livré","Spécialité développée"],sku:["Maîtrise d'œuvre","Droit construction"],co:"~350€",cd:"Cotisation Ordre."}
]},
avocat:{id:"avocat",e:"⚖️",t:"Avocat(e)",c:T.nv,cat:"business",dur:"84 mois",cost:"20000–50000€",lv:"Très exigeant",sal:{j:"30–45K€",m:"60–100K€",s:"150–500K€+"},tag:"Défendre, conseiller, protéger.",sk:["Droit civil","Droit pénal","Procédure","Plaidoirie","Rédaction juridique"],ss:75,ms:[
{p:"Licence + Master Droit",d:"5 ans",mo:"Années 1–5",i:"📚",obj:"Fondamentaux + spécialisation.",tasks:["Droit civil, public, pénal","Méthodologie juridique","Spécialisation M2","Stages","Mémoire"],dh:["1h révision droit","1 arrêt Légifrance","1 fiche révision","1 cas pratique"],res:[{n:"Légifrance",u:"https://legifrance.gouv.fr",co:"Gratuit",du:"Référence",lv:"Tous",de:"Tous les textes de loi FR."}],val:["Master mention","Méthodologie maîtrisée","2 stages","Spécialisation identifiée"],sku:["Droit civil","Droit public","Méthode juridique"],co:"~500€/an",cd:"Université publique."},
{p:"CRFPA + EDA",d:"18 mois",mo:"Post-Master",i:"📜",obj:"Concours du Barreau.",tasks:["Note de synthèse","Grand oral","18 mois EDA","CAPA","Prestation serment"],dh:["2h révision CRFPA","1 note synthèse/sem","Grand oral (20 min)","Annales (30 min)"],res:[{n:"Prépa Capavocat",u:"https://capavocat.com",co:"~2000€",du:"~300h",lv:"Master 1+",de:"Prépa intensive CRFPA."}],val:["CRFPA réussi","EDA validé","CAPA obtenu","Serment prêté"],sku:["Plaidoirie","Procédure","Déontologie"],co:"2000–7000€",cd:"Prépa + EFB."},
{p:"Collaborateur → Associé",d:"5–10 ans",mo:"Post-serment",i:"💼",obj:"Construire sa carrière.",tasks:["Intégrer cabinet","Plaidoiries autonomes","Clientèle","Spécialisation","Association/installation"],dh:["1 dossier client","1 jurisprudence","1 plaidoirie","1 contact réseau"],res:[{n:"CNB",u:"https://cnb.avocat.fr",co:"Gratuit",du:"Référence",lv:"Avocat",de:"Conseil National Barreaux."}],val:["Plaidé 3+ juridictions","Clientèle développée","CA >150K€","Spécialisation reconnue"],sku:["Plaidoirie autonome","Clientèle","Management"],co:"~600€/an",cd:"Cotisation Barreau."}
]},
// ━━━ 20 NEW CAREERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
cybersecurite:{id:"cybersecurite",e:"🔒",t:"Expert Cybersécurité",c:"#00D4FF",cat:"tech",dur:"24 mois",cost:"500–3000€",lv:"Intermédiaire",sal:{j:"38–45K€",m:"50–70K€",s:"80–120K€"},tag:"Protéger le monde numérique.",sk:["Réseaux","Linux","Pentest","SIEM","Cryptographie"],ss:92,ms:[
{p:"Fondations Réseau & Linux",d:"4 mois",mo:"Mois 1–4",i:"🖥",obj:"Comprendre les systèmes.",tasks:["Linux administration","Réseaux TCP/IP, DNS, HTTP","Virtualisation","Scripting Bash/Python"],dh:["30 min Linux","1 commande réseau","1 lab virtuel","Script Bash (15 min)"],res:[{n:"TryHackMe",u:"https://tryhackme.com",co:"Gratuit/10€/mois",du:"~80h",lv:"Débutant",de:"Plateforme d'apprentissage cybersécurité."}],val:["Linux en CLI","Réseaux compris","VM configurée","Scripts fonctionnels"],sku:["Linux","Réseaux","Bash","Virtualisation"],co:"0–10€/mois",cd:"TryHackMe gratuit pour débuter."},
{p:"Sécurité Offensive",d:"4 mois",mo:"Mois 5–8",i:"🔓",obj:"Penser comme un attaquant.",tasks:["OWASP Top 10","Pentest web","Nmap, Burp Suite","CTF challenges"],dh:["1 challenge TryHackMe","1 vulnérabilité OWASP","Burp Suite (20 min)","1 writeup CTF"],res:[{n:"HackTheBox",u:"https://hackthebox.com",co:"Gratuit/14€/mois",du:"~100h",lv:"Intermédiaire",de:"Challenges pentest réalistes."}],val:["OWASP Top 10 maîtrisé","10 CTF résolus","Rapport pentest","Outils maîtrisés"],sku:["Pentest","OWASP","Burp Suite","CTF"],co:"0–14€/mois",cd:"HackTheBox."},
{p:"Sécurité Défensive + Certif",d:"4 mois",mo:"Mois 9–12",i:"🛡",obj:"Défendre et certifier.",tasks:["SIEM (Splunk/ELK)","Incident Response","SOC workflow","Préparer CEH ou CompTIA Security+"],dh:["30 min SIEM","1 scénario incident","Préparer certif (30 min)","1 article threat intel"],res:[{n:"CompTIA Security+",u:"https://comptia.org/certifications/security",co:"~350€ examen",du:"~60h prépa",lv:"Intermédiaire",de:"Certification cybersécurité de référence."}],val:["Certification obtenue","SIEM maîtrisé","IR process documenté","SOC workflow compris"],sku:["SIEM","Incident Response","Certification"],co:"~350€",cd:"Examen CompTIA."},
{p:"Bug Bounty & Red Team",d:"4 mois",mo:"Mois 13–16",i:"🎯",obj:"Trouver des vulnérabilités réelles.",tasks:["Plateformes bug bounty HackerOne et Bugcrowd","Exploitation avancée : SQLi, XSS, SSRF","Rédiger des rapports de vulnérabilité professionnels","Pratiquer OSCP labs en ligne"],dh:["1h bug bounty","1 rapport vulnérabilité","1 outil scanning","Lire 1 writeup public"],res:[{n:"HackerOne",u:"https://hackerone.com",co:"Gratuit",du:"Continu",lv:"Intermédiaire+",de:"Plateforme bug bounty avec programmes publics récompensés."},{n:"PortSwigger Academy",u:"https://portswigger.net/web-security",co:"Gratuit",du:"~80h",lv:"Intermédiaire",de:"Labs Web Security Academy, référence pentest web."}],val:["1er rapport soumis","Reward reçu","Portfolio 5 vulnérabilités","CVSS scoring maîtrisé"],sku:["Bug Bounty","Exploitation avancée","Rapport sécurité"],co:"0€",cd:"Plateformes bug bounty gratuites."},
{p:"Architecture Sécurité & Cloud",d:"4 mois",mo:"Mois 17–20",i:"🏗",obj:"Concevoir des systèmes résilients.",tasks:["Zero Trust architecture","AWS Security : IAM, GuardDuty, Security Hub","Threat modeling STRIDE et PASTA","Secure SDLC et DevSecOps pipeline"],dh:["1 architecture review","1 threat model","AWS Security (30 min)","1 article architecture sécurité"],res:[{n:"AWS Security Specialty",u:"https://aws.amazon.com/certification/certified-security-specialty",co:"~300€ examen",du:"~80h prépa",lv:"Avancé",de:"Certification AWS sécurité, très demandée en entreprise."},{n:"OWASP SAMM",u:"https://owasp.org/www-project-samm",co:"Gratuit",du:"~20h",lv:"Avancé",de:"Modèle de maturité sécurité applicative."}],val:["Certif AWS Security obtenue","Architecture Zero Trust documentée","Threat model livrable","DevSecOps pipeline actif"],sku:["Zero Trust","AWS Security","Threat Modeling","DevSecOps"],co:"~300€",cd:"Examen AWS Security Specialty."},
{p:"Expert & Certifications Avancées",d:"4 mois",mo:"Mois 21–24",i:"🏆",obj:"Devenir référence en cybersécurité.",tasks:["OSCP ou CISM / CISSP","Contribuer à l'open source sécurité","Veille CVE et threat intelligence quotidienne","Préparer une intervention en conférence SSTIC ou BlackHat"],dh:["1h OSCP labs ou certification","Veille CVE (15 min)","1 contribution outil open source","1 article threat intel"],res:[{n:"OSCP Offensive Security",u:"https://www.offsec.com/courses/pen-200",co:"~1500€",du:"~200h labs",lv:"Expert",de:"La certification offensive la plus reconnue au monde."},{n:"SANS Institute",u:"https://sans.org",co:"3000–7000€",du:"~40h cours",lv:"Expert",de:"Formations cybersécurité de très haut niveau."}],val:["OSCP ou CISM obtenu","10+ CVE reportés","Speaker ou contributeur reconnu","Salaire > 70K€"],sku:["OSCP","CISSP/CISM","Threat Intelligence","Expert Cybersécurité"],co:"~2000–5000€",cd:"OSCP + certif managériale CISM."}
]},
productmanager:{id:"productmanager",e:"📦",t:"Product Manager",c:"#8B5CF6",cat:"tech",dur:"18 mois",cost:"200–1500€",lv:"Intermédiaire",sal:{j:"38–45K€",m:"50–70K€",s:"75–110K€"},tag:"Le pont entre tech et business.",sk:["Discovery","Roadmap","Agile","Analytics","Stakeholder management"],ss:82,ms:[
{p:"Fondations Produit",d:"3 mois",mo:"Mois 1–3",i:"📚",obj:"Comprendre le métier.",tasks:["Lire Inspired (Marty Cagan)","Frameworks : Jobs-to-be-Done, Lean Canvas","User stories et acceptance criteria","Agile/Scrum/Kanban"],dh:["30 min lecture produit","1 user story","1 article Product School","Analyser 1 feature"],res:[{n:"Product School",u:"https://productschool.com/blog",co:"Gratuit",du:"Référence",lv:"Débutant",de:"Blog et ressources PM."}],val:["Frameworks maîtrisés","10 user stories écrites","Agile compris","1 PRD rédigé"],sku:["Discovery","User Stories","Agile","Roadmap"],co:"~30€",cd:"Livre Inspired."},
{p:"Pratique & Analytics",d:"4 mois",mo:"Mois 4–7",i:"📊",obj:"Piloter par les données.",tasks:["Mixpanel/Amplitude","A/B testing","SQL basique pour PM","Priorisation (RICE, MoSCoW)","Stakeholder management"],dh:["Check métriques (15 min)","1 hypothèse produit","1 requête SQL","1 priorisation"],res:[{n:"Lenny's Newsletter",u:"https://lennysnewsletter.com",co:"Gratuit/Payant",du:"Hebdo",lv:"Intermédiaire",de:"La meilleure newsletter produit."}],val:["Dashboard produit configuré","1 A/B test lancé","SQL basique","Roadmap priorisée"],sku:["Analytics produit","A/B testing","SQL","Priorisation"],co:"0€",cd:"Outils gratuits."},
{p:"1er poste PM",d:"4 mois",mo:"Mois 8–11",i:"🎯",obj:"Décrocher un poste PM.",tasks:["Portfolio PM (3 case studies)","Préparer les entretiens PM","Product sense exercises","Postuler startup/scaleup"],dh:["1 case study PM","1 exercise product sense","2 candidatures","1 mock interview"],res:[{n:"Exponent PM",u:"https://tryexponent.com",co:"Gratuit/Payant",du:"~30h",lv:"Intermédiaire",de:"Préparation entretiens PM."}],val:["3 case studies","5+ entretiens","Offre reçue","Poste PM décroché"],sku:["Entretien PM","Product sense","Communication"],co:"0–50€",cd:"Exponent gratuit pour débuter."},
{p:"Lancement Produit End-to-End",d:"3 mois",mo:"Mois 12–14",i:"🚀",obj:"Piloter un lancement complet.",tasks:["Go-to-market strategy","Feature flags et déploiement progressif","Communication interne et externe","Mesurer le succès post-lancement : DAU, retention"],dh:["Vérifier métriques lancement","1 retour utilisateur","1 communication équipe","Check feature flags"],res:[{n:"Reforge",u:"https://reforge.com",co:"~1500€/an",du:"~50h",lv:"Avancé",de:"Programmes PM avancés, alumni de top produits."},{n:"ProductPlan Blog",u:"https://productplan.com/blog",co:"Gratuit",du:"Référence",lv:"Intermédiaire",de:"Blog roadmap et stratégie produit."}],val:["1 lancement réussi","Métriques post-lancement positives","Go-to-market documenté","Adoption supérieure à l'objectif"],sku:["Go-to-market","Feature flags","Métriques post-lancement"],co:"0–1500€",cd:"Reforge optionnel."},
{p:"Croissance & Spécialisation",d:"2 mois",mo:"Mois 15–16",i:"📈",obj:"Développer une expertise verticale.",tasks:["Spécialisation B2B SaaS / marketplace / mobile / IA","Maîtriser un framework de croissance AARRR ou ICE","Mentorat PM junior","Parler en public à un meetup ou conférence"],dh:["Analyser 1 growth metric","1 session mentorat","Préparer talk ou article","1 livre PM (30 min)"],res:[{n:"Growth.design",u:"https://growth.design",co:"Gratuit",du:"~20h",lv:"Intermédiaire",de:"UX et growth illustrés en BD, référence originale."},{n:"Lenny's Podcast",u:"https://lennysnewsletter.com/podcast",co:"Gratuit",du:"Hebdo",lv:"Intermédiaire+",de:"Interviews des meilleurs PMs du monde."}],val:["Spécialisation identifiée","1 talk ou article publié","Mentorat de 2 juniors minimum","Framework growth maîtrisé"],sku:["Growth hacking","Mentorat","Spécialisation PM","Communication publique"],co:"0€",cd:"Ressources gratuites."},
{p:"Lead PM & Vision Produit",d:"2 mois",mo:"Mois 17–18",i:"🏆",obj:"Diriger une équipe produit.",tasks:["Définir la vision produit sur 12 à 18 mois","Recruter et onboarder un PM junior","OKRs produit alignés avec le business","Présentation de la roadmap au board"],dh:["Revue OKRs hebdomadaire","1h one-on-one équipe","Mise à jour roadmap","1 deck stratégique"],res:[{n:"Inspired – Marty Cagan",u:"https://svpg.com/inspired",co:"~30€",du:"~8h",lv:"Avancé",de:"La bible du product management moderne, 2ème édition."},{n:"SVPG Blog",u:"https://svpg.com/articles",co:"Gratuit",du:"Référence",lv:"Senior",de:"Articles de Marty Cagan sur le leadership produit."}],val:["Vision 18 mois validée par la direction","Équipe PM structurée","OKRs Q1 définis","Présentation board réussie"],sku:["Leadership produit","OKRs","Vision stratégique","Management PM"],co:"~30€",cd:"Livre Inspired 2ème édition."}
]},
devops:{id:"devops",e:"⚙️",t:"DevOps / Cloud Engineer",c:"#06B6D4",cat:"tech",dur:"18 mois",cost:"300–2000€",lv:"Intermédiaire",sal:{j:"40–48K€",m:"55–75K€",s:"80–110K€"},tag:"L'infrastructure qui scale.",sk:["Docker","Kubernetes","CI/CD","AWS/GCP","Terraform","Linux"],ss:88,ms:[
{p:"Linux & Conteneurs",d:"4 mois",mo:"Mois 1–4",i:"🐧",obj:"Linux et Docker.",tasks:["Administration Linux avancée","Docker : images, containers, compose","Networking Docker","Registries"],dh:["30 min Linux","1 Dockerfile","1 docker-compose","1 article DevOps"],res:[{n:"Docker Docs",u:"https://docs.docker.com",co:"Gratuit",du:"~40h",lv:"Intermédiaire",de:"Documentation officielle Docker."}],val:["Linux admin maîtrisé","Docker multi-container","Compose complexe","Registry privé"],sku:["Linux avancé","Docker","Docker Compose"],co:"0€",cd:"Docker gratuit."},
{p:"Cloud & Orchestration",d:"4 mois",mo:"Mois 5–8",i:"☁️",obj:"Cloud et Kubernetes.",tasks:["AWS ou GCP fondamentaux","Kubernetes : pods, services, deployments","Terraform infrastructure as code","Monitoring (Prometheus, Grafana)"],dh:["30 min cloud","1 déploiement K8s","1 module Terraform","Check monitoring"],res:[{n:"AWS Free Tier",u:"https://aws.amazon.com/free",co:"Gratuit 12 mois",du:"~60h",lv:"Intermédiaire",de:"Tier gratuit AWS pour apprendre."}],val:["Certif cloud obtenue","K8s en production","Terraform maîtrisé","Monitoring configuré"],sku:["AWS/GCP","Kubernetes","Terraform","Monitoring"],co:"0–50€/mois",cd:"Free tier cloud."},
{p:"CI/CD & SRE",d:"4 mois",mo:"Mois 9–12",i:"🔄",obj:"Pipelines et fiabilité.",tasks:["GitHub Actions / GitLab CI","Pipeline complet build→test→deploy","SRE : SLI, SLO, SLA","Incident management"],dh:["Améliorer 1 pipeline","1 test automatisé","Check SLOs","1 article SRE"],res:[{n:"Google SRE Book",u:"https://sre.google/sre-book/table-of-contents",co:"Gratuit",du:"~30h",lv:"Intermédiaire",de:"Le livre SRE de Google, gratuit en ligne."}],val:["Pipeline end-to-end","99.9% uptime","Incident process","Infra as code complète"],sku:["CI/CD","SRE","Incident Management"],co:"0€",cd:"Google SRE Book gratuit en ligne."},
{p:"DevSecOps & Sécurité Cloud",d:"2 mois",mo:"Mois 13–14",i:"🔒",obj:"Intégrer la sécurité dans le pipeline.",tasks:["SAST/DAST dans CI/CD avec SonarQube et Trivy","Gestion des secrets avec HashiCorp Vault","Scanning d'images Docker","Compliance as Code avec Open Policy Agent"],dh:["1 scan sécurité","1 rotation de secrets","1 policy OPA","Audit dépendances"],res:[{n:"HashiCorp Vault",u:"https://developer.hashicorp.com/vault",co:"Gratuit (OSS)",du:"~20h",lv:"Intermédiaire",de:"Solution secrets management de référence industrielle."},{n:"Trivy Aqua Security",u:"https://trivy.dev",co:"Gratuit",du:"~5h",lv:"Intermédiaire",de:"Scanner vulnérabilités containers et IaC open source."}],val:["Pipeline DevSecOps actif","0 secrets en clair","Images scannées à chaque build","Policies OPA en production"],sku:["DevSecOps","Vault","Scanning sécurité","OPA"],co:"0€",cd:"Outils open source entièrement gratuits."},
{p:"Architecture Multi-Cloud & Platform Engineering",d:"2 mois",mo:"Mois 15–16",i:"🌐",obj:"Architecturer à grande échelle.",tasks:["Multi-cloud AWS et GCP ou Azure","Internal Developer Platform pour l'équipe","FinOps : optimiser les coûts cloud","GitOps avec ArgoCD ou Flux"],dh:["Check coûts cloud","1 amélioration IDP","1 déploiement GitOps","1 article FinOps"],res:[{n:"ArgoCD Docs",u:"https://argo-cd.readthedocs.io",co:"Gratuit",du:"~20h",lv:"Avancé",de:"GitOps pour Kubernetes, standard industrie."},{n:"FinOps Foundation",u:"https://finops.org",co:"Gratuit",du:"~10h",lv:"Intermédiaire",de:"Pratiques d'optimisation des coûts cloud."}],val:["Multi-cloud configuré","IDP utilisé par les devs","Coûts cloud réduits de 20%","GitOps en production"],sku:["Multi-cloud","Platform Engineering","FinOps","GitOps"],co:"0€",cd:"ArgoCD open source."},
{p:"Expert DevOps & SRE Lead",d:"2 mois",mo:"Mois 17–18",i:"🏆",obj:"Leadership technique et excellence opérationnelle.",tasks:["Certifications avancées CKA ou AWS Solutions Architect Pro","Écrire des RFCs d'architecture","Onboarder et mentorer l'équipe","Créer des runbooks et playbooks exhaustifs"],dh:["1h architecture ou certif","1 runbook mis à jour","1 session mentorat","Check SLOs équipe"],res:[{n:"CKA Certification",u:"https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka",co:"~395€",du:"~60h prépa",lv:"Avancé",de:"La certification Kubernetes administrator de référence."},{n:"The Phoenix Project",u:"https://amazon.fr",co:"~20€",du:"~6h",lv:"Tous",de:"Roman sur la transformation DevOps, essentiel pour la culture SRE."}],val:["CKA ou AWS Pro obtenu","3 runbooks critiques documentés","Équipe autonome","MTTR inférieur à 30 minutes"],sku:["CKA","SRE Lead","Architecture cloud","Mentorat technique"],co:"~400€",cd:"Examen CKA Linux Foundation."}
]},
datascientist:{id:"datascientist",e:"🤖",t:"Data Scientist / ML",c:"#7C3AED",cat:"tech",dur:"24 mois",cost:"500–3000€",lv:"Avancé",sal:{j:"40–50K€",m:"55–75K€",s:"80–130K€"},tag:"Intelligence artificielle appliquée.",sk:["Python","ML","Deep Learning","Stats avancées","NLP","MLOps"],ss:85,ms:[
{p:"Maths & Stats avancées",d:"4 mois",mo:"Mois 1–4",i:"📐",obj:"Les fondations mathématiques.",tasks:["Algèbre linéaire","Probabilités et statistiques inférentielles","Calcul différentiel","Python scientifique (NumPy, SciPy)"],dh:["30 min maths","1 exercice stats","1 notebook NumPy","Khan Academy (20 min)"],res:[{n:"3Blue1Brown",u:"https://3blue1brown.com",co:"Gratuit",du:"~30h",lv:"Intermédiaire",de:"Vidéos maths visuelles exceptionnelles."}],val:["Algèbre linéaire maîtrisé","Stats inférentielles","Distributions comprises","NumPy/SciPy fluide"],sku:["Algèbre linéaire","Stats avancées","Python scientifique"],co:"0€",cd:"Tout gratuit."},
{p:"Machine Learning",d:"5 mois",mo:"Mois 5–9",i:"🧠",obj:"Algorithmes ML classiques.",tasks:["Scikit-learn : régression, classification, clustering","Feature engineering","Validation croisée, métriques","Projets Kaggle"],dh:["30 min scikit-learn","1 feature engineering","1 modèle entraîné","1 soumission Kaggle"],res:[{n:"Fast.ai",u:"https://fast.ai",co:"Gratuit",du:"~80h",lv:"Intermédiaire",de:"Cours ML/DL pratique, top-down."}],val:["5 algorithmes maîtrisés","Kaggle top 20%","Pipeline ML complet","Métriques comprises"],sku:["Scikit-learn","Feature engineering","Kaggle","ML Pipeline"],co:"0€",cd:"Kaggle et Fast.ai gratuits."},
{p:"Deep Learning & Spécialisation",d:"5 mois",mo:"Mois 10–14",i:"🔬",obj:"Réseaux de neurones.",tasks:["PyTorch ou TensorFlow","CNN pour la vision","NLP : transformers, BERT","MLOps : déploiement modèles"],dh:["30 min PyTorch","1 architecture réseau","1 paper résumé","1 modèle déployé"],res:[{n:"DeepLearning.AI",u:"https://deeplearning.ai",co:"Gratuit/~40€/mois",du:"~100h",lv:"Intermédiaire",de:"Cours Andrew Ng référence."}],val:["CNN fonctionnel","NLP model déployé","MLOps pipeline","1 paper reproduit"],sku:["PyTorch","Deep Learning","NLP","MLOps"],co:"0–40€/mois",cd:"Cours Andrew Ng sur Coursera."},
{p:"MLOps & Déploiement en Production",d:"4 mois",mo:"Mois 15–18",i:"⚙️",obj:"Industrialiser les modèles ML.",tasks:["MLflow pour tracking et model registry","Docker et Kubernetes pour servir les modèles","Pipelines de données avec Airflow ou Prefect","Monitoring de drift et de performance modèles"],dh:["1 modèle en production","Check drift métriques","Pipeline Airflow","1 article MLOps"],res:[{n:"MLflow",u:"https://mlflow.org",co:"Gratuit",du:"~30h",lv:"Intermédiaire",de:"Plateforme MLOps open source de référence."},{n:"Full Stack Deep Learning",u:"https://fullstackdeeplearning.com",co:"Gratuit",du:"~40h",lv:"Intermédiaire",de:"Cours complet pour déployer des modèles en production."}],val:["Modèle servi en API REST","Pipeline ML automatisé","Drift monitoring actif","Feature store configuré"],sku:["MLflow","Airflow","Model Serving","Feature Store"],co:"0€",cd:"Outils MLOps open source."},
{p:"Spécialisation LLMs & NLP Avancé",d:"3 mois",mo:"Mois 19–21",i:"🔬",obj:"Maîtriser les LLMs et la recherche appliquée.",tasks:["Fine-tuning LLMs avec LoRA et PEFT","RAG : Retrieval Augmented Generation","Évaluation de modèles LLM avec RAGAS","Participer à une compétition Kaggle NLP"],dh:["1h LLM fine-tuning","1 expérience RAG","Lire 1 paper arXiv","1 contribution GitHub"],res:[{n:"Hugging Face",u:"https://huggingface.co",co:"Gratuit",du:"Continu",lv:"Intermédiaire",de:"Plateforme modèles, datasets et espaces de démonstration."},{n:"LangChain Docs",u:"https://docs.langchain.com",co:"Gratuit",du:"~20h",lv:"Intermédiaire",de:"Framework orchestration LLMs, standard de facto."}],val:["1 modèle fine-tuné déployé","Système RAG en production","Top 10% Kaggle NLP","Contribution open source mergée"],sku:["LLMs","RAG","Fine-tuning","NLP avancé"],co:"0–50€/mois GPU",cd:"Google Colab Pro ou Lambda Labs."},
{p:"Lead Data Scientist & Architecture ML",d:"3 mois",mo:"Mois 22–24",i:"🏆",obj:"Diriger la stratégie data et ML de l'entreprise.",tasks:["Définir la stratégie ML à 2 ans","Recruter et structurer l'équipe data","Présenter les résultats ML au board","Évaluer et intégrer les nouvelles architectures IA"],dh:["1h stratégie ou architecture","Revue métriques ML","1 session mentorat","Veille recherche IA (20 min)"],res:[{n:"Papers With Code",u:"https://paperswithcode.com",co:"Gratuit",du:"Continu",lv:"Expert",de:"State-of-the-art en ML, benchmarks et code open source."},{n:"NeurIPS Proceedings",u:"https://proceedings.neurips.cc",co:"Gratuit",du:"Référence",lv:"Expert",de:"Les conférences IA de référence mondiale."}],val:["Stratégie ML 2 ans validée","Équipe data structurée","1 publication ou talk","Salaire supérieur à 80K€"],sku:["Leadership ML","Architecture IA","Publication recherche","Stratégie data"],co:"0€",cd:"Conférences et ressources gratuites."}
]},
devmobile:{id:"devmobile",e:"📱",t:"Développeur Mobile",c:"#10B981",cat:"tech",dur:"18 mois",cost:"500–2000€",lv:"Intermédiaire",sal:{j:"35–42K€",m:"45–65K€",s:"65–95K€"},tag:"Apps iOS & Android.",sk:["React Native","Swift","Kotlin","Flutter","Firebase"],ss:75,ms:[
{p:"Fondations Mobile",d:"3 mois",mo:"Mois 1–3",i:"📱",obj:"Comprendre le mobile.",tasks:["React Native ou Flutter","Navigation","State management","APIs REST","UI mobile patterns"],dh:["30 min React Native/Flutter","1 écran","1 composant natif","1 article mobile"],res:[{n:"React Native Docs",u:"https://reactnative.dev",co:"Gratuit",du:"~50h",lv:"JS intermédiaire",de:"Documentation officielle RN."}],val:["App 3+ écrans","Navigation fluide","API intégrée","UI responsive"],sku:["React Native","Navigation","Mobile UI"],co:"0€",cd:"RN gratuit."},
{p:"Features avancées",d:"4 mois",mo:"Mois 4–7",i:"🔔",obj:"Push, stockage, animations.",tasks:["Push notifications","Stockage local (AsyncStorage/SQLite)","Animations","Camera/GPS","Publication stores"],dh:["1 feature avancée","1 animation","Tester sur device","1 bug fix"],res:[{n:"Expo Docs",u:"https://docs.expo.dev",co:"Gratuit",du:"~30h",lv:"Intermédiaire",de:"Framework React Native simplifié."}],val:["Push fonctionnels","Stockage offline","Animations fluides","App publiée sur store"],sku:["Push","Stockage local","Animations","App Store"],co:"25€/an iOS + gratuit Android",cd:"Compte développeur Apple 99$/an."},
{p:"1er poste Mobile",d:"4 mois",mo:"Mois 8–11",i:"🎯",obj:"Développeur mobile junior.",tasks:["Portfolio 3 apps","Tests mobile","Performance","CI/CD mobile"],dh:["1h code mobile","1 test","Optimiser performance","1 candidature"],res:[{n:"LinkedIn Jobs Mobile",u:"https://linkedin.com/jobs",co:"Gratuit",du:"Quotidien",lv:"Tous",de:"Offres développeur mobile."}],val:["3 apps portfolio","Tests >60%","App store publiée","Offre reçue"],sku:["Testing mobile","Performance","CI/CD"],co:"0€",cd:"LinkedIn gratuit pour postuler."},
{p:"Architecture Mobile Avancée",d:"3 mois",mo:"Mois 12–14",i:"🏗",obj:"Concevoir des apps scalables.",tasks:["Clean Architecture MVVM et MVI","Modularisation de l'app en features indépendantes","State management avancé : Zustand ou Riverpod","Tests E2E avec Detox"],dh:["1h architecture","1 module refactorisé","1 test E2E","Check bundle size"],res:[{n:"Detox Testing",u:"https://wix.github.io/Detox",co:"Gratuit",du:"~20h",lv:"Intermédiaire",de:"Framework tests E2E pour React Native, référence."},{n:"Clean Architecture Book",u:"https://amazon.fr",co:"~35€",du:"~10h",lv:"Intermédiaire",de:"Le livre de référence par Robert C. Martin sur l'architecture logicielle."}],val:["Architecture modulaire en production","Tests E2E couvrant 60% de l'app","Bundle size optimisé","Code review de haute qualité"],sku:["Clean Architecture","Tests E2E","State Management avancé","Modularisation"],co:"~35€",cd:"Livre Clean Architecture."},
{p:"Performance & App Store Optimization",d:"2 mois",mo:"Mois 15–16",i:"⚡",obj:"App ultra-performante et visible sur les stores.",tasks:["Profiling mémoire et CPU avec Flipper et Xcode Instruments","Réduction du temps de démarrage cold start","ASO : keywords, screenshots, description","Gestion des crashs avec Sentry ou Firebase Crashlytics"],dh:["Check performance metrics","1 optimisation ciblée","1 A/B test ASO","Review crashs Sentry"],res:[{n:"Flipper",u:"https://fbflipper.com",co:"Gratuit",du:"~10h",lv:"Intermédiaire",de:"Debugger mobile de Facebook, profiling avancé."},{n:"App Store Connect",u:"https://developer.apple.com/app-store-connect",co:"Gratuit",du:"Continu",lv:"Tous",de:"Console iOS, analytics et optimisation ASO."}],val:["Cold start inférieur à 2s","Rating Store supérieur à 4.5","Crash rate inférieur à 0.1%","DAU en croissance mensuelle"],sku:["Profiling mobile","ASO","Crash reporting","Analytics mobile"],co:"0€",cd:"Outils gratuits disponibles."},
{p:"Lead Mobile Developer",d:"2 mois",mo:"Mois 17–18",i:"🏆",obj:"Diriger le développement mobile.",tasks:["Tech lead sur une feature majeure","Définir les standards et conventions de code mobile","Entretiens techniques de recrutement","Roadmap technique mobile sur 12 mois"],dh:["1h code review d'équipe","1h architecture ou RFC","Check métriques app","1 contribution open source"],res:[{n:"React Native Community",u:"https://reactnative.dev/community/overview",co:"Gratuit",du:"Continu",lv:"Avancé",de:"Écosystème et librairies communauté React Native."},{n:"Flutter Awesome",u:"https://flutterawesome.com",co:"Gratuit",du:"Référence",lv:"Avancé",de:"Librairies et ressources Flutter sélectionnées par la communauté."}],val:["Feature livrée en tant que tech lead","Standards documentés et adoptés","1 recrutement réussi","Contribution open source mergée"],sku:["Tech Lead mobile","Code Review","Architecture mobile","Recrutement"],co:"0€",cd:"Ressources communauté gratuites."}
]},
psychologue:{id:"psychologue",e:"🧠",t:"Psychologue",c:"#EC4899",cat:"health",dur:"60 mois",cost:"3000–15000€",lv:"Exigeant",sal:{j:"25–32K€",m:"35–50K€",s:"55–90K€"},tag:"Accompagner l'humain.",sk:["Psychologie clinique","Thérapie","Évaluation","Écoute","Éthique"],ss:90,ms:[
{p:"Orientation & Prépa",d:"2 mois",mo:"Avant licence",i:"📋",obj:"Confirmer la vocation et préparer le dossier.",tasks:["Rencontrer 2 psychologues en exercice","Lire sur les spécialisations clinique/travail/neuro","Préparer dossier Parcoursup","Stage d'observation en cabinet (1 semaine)"],dh:["1 article SFP (15 min)","1 podcast psycho","1 question orientation","Compléter dossier"],res:[{n:"SFP",u:"https://sfpsy.org",co:"Gratuit",du:"Référence",lv:"Tous",de:"Société Française de Psychologie — ressources orientation."},{n:"Onisep Psychologue",u:"https://onisep.fr",co:"Gratuit",du:"1h",lv:"Lycéen",de:"Fiche métier détaillée avec débouchés."}],val:["Spécialisation envisagée","Dossier Parcoursup complet","Stage observation effectué","Admission université obtenue"],sku:["Culture psychologique","Connaissance du métier"],co:"0€",cd:"Stage observation gratuit."},
{p:"Licence L1–L2",d:"2 ans",mo:"Années 1–2",i:"📚",obj:"Bases théoriques et méthodologiques solides.",tasks:["Psychologie générale, cognitive, sociale","Neuropsychologie et biologie","Méthodologie expérimentale","Statistiques descriptives et inférentielles","TD et travaux pratiques"],dh:["1h révision","1 fiche concept","1 article scientifique","Exercices stats (20 min)"],res:[{n:"Khan Academy Stats",u:"https://khanacademy.org/math/statistics-probability",co:"Gratuit",du:"~40h",lv:"L1–L2",de:"Cours statistiques adaptés psychologie."},{n:"Manuel Atkinson",u:"https://amazon.fr",co:"~35€",du:"~80h",lv:"L1",de:"Introduction à la psychologie, référence mondiale."}],val:["L1 et L2 validées","Stats maîtrisées","Méthodo expérimentale comprise","Moyenne >12/20"],sku:["Psychologie générale","Statistiques","Méthodo"],co:"~500€/an",cd:"Université publique."},
{p:"Licence L3 + Stage",d:"1 an",mo:"Année 3",i:"🔍",obj:"Choisir sa spécialisation clinique.",tasks:["Psychopathologie adulte et enfant","Psychologie du développement","Choix orientation Master","Stage découverte 70h en institution"],dh:["1h clinique","1 cas clinique fictif","Préparer candidatures M1","Lectures spécialité"],res:[{n:"CAIRN Psycho",u:"https://cairn.info",co:"Via université",du:"Référence",lv:"L3",de:"Revues psychologie francophones."},{n:"Psychologie Clinique revue",u:"https://degruyter.com",co:"Via université",du:"Mensuel",lv:"L3",de:"Articles cliniques de référence."}],val:["Licence validée mention","Spécialisation identifiée","70h stage validé","Admis en M1 ciblé"],sku:["Psychopathologie","Développement","Stage clinique"],co:"~500€/an",cd:"Université publique."},
{p:"Master 1",d:"1 an",mo:"Année 4",i:"🎓",obj:"Approfondissement clinique et initiation recherche.",tasks:["Psychopathologie avancée","Tests psychométriques (WAIS, MMPI)","Projet de recherche M1","Stage en institution 150h","Mémoire de recherche M1"],dh:["1h clinique","1 test psycho","Mémoire (30 min)","1 article de recherche"],res:[{n:"PsycINFO APA",u:"https://psycnet.apa.org",co:"Via université",du:"Référence",lv:"Master",de:"Base internationale recherche psych."},{n:"WAIS-IV Manuel",u:"https://ecpa.fr",co:"~200€",du:"~20h",lv:"M1",de:"Test intelligence adulte de référence."}],val:["M1 validé","150h stage","Tests psychométriques maîtrisés","Mémoire M1 rendu et noté"],sku:["Tests psychométriques","Recherche","Clinique avancée"],co:"~700€",cd:"Manuel WAIS ~200€."},
{p:"Master 2 + Stage 500h",d:"1 an",mo:"Année 5",i:"💼",obj:"Obtenir le titre de Psychologue.",tasks:["Stage clinique 500h supervisé","Entretiens thérapeutiques encadrés","Mémoire de recherche clinique","Soutenance devant jury","Inscription ADELI"],dh:["Consultations supervisées","Mémoire (1h)","Supervision (1h/semaine)","Préparer dossier ADELI"],res:[{n:"AFTCC Formation",u:"https://aftcc.org",co:"~1500€/an",du:"2–3 ans",lv:"M2+",de:"Formation TCC certifiante post-master."},{n:"Légifrance ADELI",u:"https://legifrance.gouv.fr",co:"Gratuit",du:"1h",lv:"Diplômé",de:"Procédure inscription registre ADELI."}],val:["500h stage validé","Mémoire soutenu mention ≥14","Titre de Psychologue obtenu","Inscrit ADELI"],sku:["Entretien clinique","Supervision","Titre psychologue","ADELI"],co:"~500€/an + 50€/sem supervision",cd:"Supervision obligatoire payante."},
{p:"Exercice & Spécialisation",d:"2–5 ans",mo:"Post-Master",i:"🧠",obj:"Exercer, fidéliser une patientèle et se certifier.",tasks:["Choisir mode exercice (libéral/salarié/mixte)","Formation spécialisée (TCC, EMDR, systémique)","Supervision continue (1h/sem)","Construire patientèle","Réseau professionnel et inter-vision"],dh:["2–4 consultations/jour","Supervision hebdomadaire","1 article clinique/semaine","1 formation/trimestre"],res:[{n:"EMDR France",u:"https://emdr-france.org",co:"~2000€",du:"~40h",lv:"Psychologue",de:"Formation EMDR niveaux 1 et 2."},{n:"IFAC TCC",u:"https://ifac.fr",co:"~1500€",du:"~60h",lv:"Psychologue",de:"Institut formation TCC reconnu."}],val:["20+ patients/semaine","Supervision hebdomadaire","1 spécialisation certifiée","CA > 3500€/mois"],sku:["TCC / EMDR / Systémique","Patientèle fidèle","Supervision avancée","Entrepreneuriat"],co:"~500€/mois cabinet + formations",cd:"Cabinet partagé ou individuel."}
]},
kine:{id:"kine",e:"💪",t:"Kinésithérapeute",c:"#14B8A6",cat:"health",dur:"60 mois",cost:"5000–40000€",lv:"Très exigeant",sal:{j:"28–35K€",m:"40–55K€",s:"60–120K€"},tag:"Rééduquer par le mouvement.",sk:["Anatomie","Rééducation","Massage","Biomécanique","Relation patient"],ss:95,ms:[
{p:"Préparation LAS / PACES",d:"3–6 mois",mo:"Avant entrée",i:"📋",obj:"Réussir la 1ère année santé.",tasks:["Programme bio, chimie, physique","Méthode QCM","Concours blancs","Stage en cabinet kiné (1 semaine)"],dh:["3h révision sciences","10 QCM/jour","1 concours blanc/semaine","Retour sur erreurs (30 min)"],res:[{n:"Prepasante",u:"https://prepasante.fr",co:"~500€",du:"3–6 mois",lv:"Terminale/Bac",de:"Prépa privée PACES/LAS."},{n:"FNEK",u:"https://fnek.fr",co:"Gratuit",du:"Référence",lv:"Étudiant kiné",de:"Ressources et réseau étudiants kiné."}],val:["Programme sciences maîtrisé","Score >70% QCM blancs","Stage observation fait","Admis en LAS/PACES"],sku:["Biologie","Chimie","Méthode QCM"],co:"0–500€",cd:"Prépa optionnelle."},
{p:"LAS/PACES – 1ère année",d:"1 an",mo:"Année 1",i:"⚕️",obj:"Passer le cap sélectif.",tasks:["Anatomie générale","Physiologie","Biochimie","UE spécifique kiné","Examens semestriels"],dh:["4h révision minimum","Fiches anatomie (30 min)","QCM (1h)","Groupe de travail"],res:[{n:"Anatomie Netter",u:"https://elsevier.com",co:"~55€",du:"~100h",lv:"PACES",de:"Atlas anatomie référence mondiale."},{n:"Fiches Kiné",u:"https://fiches-kine.fr",co:"Gratuit",du:"Référence",lv:"Étudiant",de:"Fiches synthèse IFMK."}],val:["LAS/PACES validé","Admis en IFMK","Anatomie corps entier","Physio cardio et respiratoire"],sku:["Anatomie","Physiologie","Biochimie"],co:"~500€/an + 55€ atlas",cd:"Université publique."},
{p:"IFMK Années 1–2",d:"2 ans",mo:"Années 2–3",i:"📚",obj:"Techniques manuelles fondamentales.",tasks:["Massage thérapeutique","Électrothérapie et ultrasons","Bilan musculaire et articulaire","Biomécanique","Stages hospitaliers (10 semaines)"],dh:["2h techniques manuelles","1 article kiné","Anatomie palpation","Préparer stage"],res:[{n:"Kiné La Revue",u:"https://kinelarevue.com",co:"~80€/an",du:"Mensuel",lv:"Étudiant 2A",de:"Revue scientifique kinésithérapie."},{n:"Physitrack",u:"https://physitrack.com",co:"Gratuit étudiant",du:"Outil",lv:"Étudiant",de:"Exercices thérapeutiques guidés."}],val:["Bilan musculaire complet","Massage thérapeutique","Stages validés","Notes >12/20"],sku:["Massage","Électrothérapie","Bilan fonctionnel"],co:"~500€/an",cd:"IFMK public ~500€, privé 5–10K€."},
{p:"IFMK Années 3–4 + Mémoire",d:"2 ans",mo:"Années 4–5",i:"🔬",obj:"Autonomie clinique et recherche.",tasks:["Rééducation neurologique et orthopédique","Kiné respiratoire et cardio","Stages longs 20 semaines","Mémoire de fin d'études","Soutenance DE"],dh:["3h clinique et théorie","Cas clinique (45 min)","Mémoire (1h)","Supervisions stage"],res:[{n:"Cochrane Physio",u:"https://cochrane.org",co:"Gratuit",du:"Référence",lv:"4A",de:"Evidence-based physiotherapy reviews."},{n:"Pedro Evidence",u:"https://pedro.org.au",co:"Gratuit",du:"Référence",lv:"Master",de:"Base études kiné EBP."}],val:["Stages 20sem validés","Mémoire soutenu mention","DE obtenu","Rééducation neuro/ortho autonome"],sku:["Rééducation neuro","Rééducation ortho","Kiné respiratoire","EBP"],co:"~500€/an",cd:"IFMK public ou privé."},
{p:"1ère Expérience",d:"1–2 ans",mo:"Post-DE",i:"💼",obj:"Développer vitesse et polyvalence en structure.",tasks:["Poste salarié hôpital ou clinique","Diversifier la patientèle","Formation continue obligatoire (42h/3ans)","Inscription Ordre des Kinés","Réseau professionnel"],dh:["6–8 consultations/jour","1 protocole EBP","Ordre (30 min admin)","1 collègue de réseau"],res:[{n:"Ordre MK",u:"https://ordremk.fr",co:"~300€/an",du:"Obligatoire",lv:"Diplômé",de:"Inscription obligatoire Ordre."},{n:"Sifem Formations",u:"https://sifem.net",co:"Variable",du:"2–3 jours",lv:"DE",de:"Formations continues kiné certifiantes."}],val:["Autonomie complète","Formation continue 42h","Inscrit Ordre","Réseau collègues"],sku:["Polyvalence","Formation continue","Réseau"],co:"~300€/an Ordre + formations",cd:"Formations remboursables FIFPL."},
{p:"Installation Libérale",d:"Variable",mo:"Après 1–2 ans salariat",i:"🏥",obj:"Cabinet libéral rentable et spécialisé.",tasks:["Choisir zone implantation","Cabinet seul ou associé","Spécialisation (sport, neuro, pédiatrie)","Conventionnement Secteur 1","Gestion administrative cabinet"],dh:["8–10 consultations/jour","1 séance spécialisée","Comptabilité (20 min)","Réseau prescription (médecins)"],res:[{n:"MKIL",u:"https://mkil.fr",co:"Gratuit",du:"Référence",lv:"Libéral",de:"Association kiné libéraux."},{n:"FIFPL",u:"https://fifpl.fr",co:"Gratuit",du:"Outil",lv:"Libéral",de:"Financement formation continue libéraux."}],val:["Cabinet ouvert","20+ patients/semaine","CA > 5K€/mois","Spécialisation reconnue"],sku:["Gestion cabinet","Spécialisation","Réseau prescripteurs"],co:"500–1500€/mois cabinet",cd:"Cabinet seul ou partagé."}
]},
aidesoignant:{id:"aidesoignant",e:"❤️",t:"Aide-soignant(e)",c:"#F43F5E",cat:"health",dur:"12 mois",cost:"Quasi gratuit",lv:"Accessible",sal:{j:"22–25K€",m:"26–30K€",s:"30–35K€"},tag:"Au cœur du soin.",sk:["Soins de base","Hygiène","Communication","Observation"],ss:98,ms:[
{p:"Orientation & Admission IFAS",d:"1–3 mois",mo:"Avant formation",i:"📋",obj:"Intégrer un IFAS et valider la vocation.",tasks:["Stage d'observation en EHPAD (1 semaine)","Préparer dossier sélection","Entretien de motivation","Vaccinations obligatoires"],dh:["1 article soins","1 vidéo soin technique","Préparer questions entretien","Compléter dossier"],res:[{n:"Parcoursup AS",u:"https://parcoursup.fr",co:"Gratuit",du:"~3h",lv:"Aucun diplôme",de:"Admission IFAS via Parcoursup."},{n:"Sante.gouv AS",u:"https://sante.gouv.fr",co:"Gratuit",du:"Référence",lv:"Candidat",de:"Référentiel officiel formation AS."}],val:["Stage observation fait","Dossier déposé","Admis en IFAS","Vaccinations à jour"],sku:["Connaissance du métier","Motivation"],co:"0€",cd:"Formation publique gratuite."},
{p:"Modules 1–4 : Théorie",d:"3 mois",mo:"Mois 1–3",i:"📚",obj:"Fondamentaux soins et hygiène.",tasks:["Module 1 : accompagnement de la personne","Module 2 : l'état clinique","Module 3 : les soins","Module 4 : ergonomie","TD pratique en salle de simulation"],dh:["1h révision modules","1 geste technique","1 fiche soin","Quiz auto-évaluation"],res:[{n:"Cours-soignants",u:"https://cours-soignants.com",co:"Gratuit",du:"Référence",lv:"Étudiant AS",de:"Fiches cours pour aides-soignants."},{n:"Infirmiers.com",u:"https://infirmiers.com",co:"Gratuit",du:"Référence",lv:"Étudiant",de:"Ressources para-médicales."}],val:["Modules 1–4 validés","Gestes de base maîtrisés","Fiche soin complète","Évaluation théorique >12"],sku:["Soins hygiène","Accompagnement","Ergonomie"],co:"Gratuit",cd:"Formation en IFAS publique."},
{p:"Modules 5–8 + Stages",d:"5 mois",mo:"Mois 4–8",i:"🏥",obj:"Compétences avancées et pratique terrain.",tasks:["Module 5 : communication","Module 6 : hygiène des locaux","Module 7 : transmission des infos","Module 8 : organisation","Stages 3 x 5 semaines (EHPAD, hôpital, domicile)"],dh:["Portfolio stage quotidien","1 transmission écrite","1 fiche patient","Débrief stage"],res:[{n:"ANFH",u:"https://anfh.fr",co:"Gratuit",du:"Variable",lv:"AS formation",de:"Formation continue hospitalière."},{n:"Vidal Infirmier",u:"https://vidal.fr",co:"Gratuit (base)",du:"Référence",lv:"Soignant",de:"Médicaments et protocoles."}],val:["Modules 5–8 validés","3 stages validés","Transmissions ciblées","Portfolio complet"],sku:["Communication patient","Transmissions","Hygiène locaux"],co:"Gratuit",cd:"Indemnités de stage."},
{p:"DEAS + 1er Emploi",d:"2 mois",mo:"Mois 9–10",i:"🎓",obj:"Diplôme et intégration professionnelle.",tasks:["Soutenance portfolio DEAS","Épreuves théoriques","DEAS obtenu","Candidatures hôpital/EHPAD/HAD","Premier CDD ou CDI"],dh:["Révision DEAS (2h)","1 candidature/jour","Préparer entretien","Démarches administratives"],res:[{n:"Indeed Aide-soignant",u:"https://indeed.fr",co:"Gratuit",du:"Quotidien",lv:"Diplômé",de:"Offres emploi aide-soignant France."},{n:"Pole-emploi soins",u:"https://pole-emploi.fr",co:"Gratuit",du:"Outil",lv:"Diplômé",de:"Accompagnement recherche emploi."}],val:["DEAS obtenu","1er poste signé","Fiche de paye","Période essai passée"],sku:["DEAS","Recherche emploi","Intégration service"],co:"0€",cd:"Formation entièrement gratuite."},
{p:"Expérience & Autonomie",d:"1–2 ans",mo:"Après diplôme",i:"💪",obj:"Développer l'expertise terrain.",tasks:["Acquérir autonomie complète en service","Formation continue (DPC obligatoire)","Maîtriser les protocoles du service","Être référent en binôme avec IDE","Transmissions orales et écrites fluides"],dh:["6–8 soins/vacation","1 protocole nouveau","DPC (30 min)","Échanges IDE"],res:[{n:"DPC santé",u:"https://dpc.sante.fr",co:"Gratuit (obligatoire)",du:"2 jours/an",lv:"AS diplômé",de:"Développement Professionnel Continu obligatoire."},{n:"FNESI",u:"https://fnesi.org",co:"Gratuit",du:"Référence",lv:"Para-médical",de:"Ressources para-médicaux."}],val:["Autonomie complète","DPC effectué","Référent binôme","Évaluations positives"],sku:["Autonomie clinique","DPC","Référent"],co:"Formations DPC gratuites",cd:"Prise en charge employeur."},
{p:"Évolution : Passerelle ou Spécialisation",d:"Variable",mo:"2–5 ans après DEAS",i:"🚀",obj:"Évoluer vers IDE ou se spécialiser.",tasks:["Passerelle AS→IDE (IFSI, dispenses)","OU spécialisation service (réa, pédiatrie, cancéro)","OU coordination et tutorat","Bilan de compétences","Dossier évolution professionnelle"],dh:["1 cours IFSI (si passerelle)","1 domaine spécialisé","Tutorat nouveau collègue","Projet professionnel"],res:[{n:"VAE Santé",u:"https://vae.gouv.fr",co:"Gratuit",du:"6–12 mois",lv:"AS expérimenté",de:"Validation Acquis Expérience vers IDE."},{n:"ANFH Évolution",u:"https://anfh.fr",co:"Gratuit",du:"Variable",lv:"AS",de:"Financement parcours évolution."}],val:["Projet évolution formalisé","Dossier déposé","Formation commencée","Évolution validée RH"],sku:["VAE/passerelle IDE","Spécialisation","Tutorat"],co:"0–500€",cd:"Finançable CPF/employeur."}
]},
electricien:{id:"electricien",e:"⚡",t:"Électricien / Plombier",c:"#EAB308",cat:"craft",dur:"24 mois",cost:"500–5000€",lv:"Accessible",sal:{j:"24–30K€",m:"32–42K€",s:"45–70K€"},tag:"Pénurie historique, très bien payé.",sk:["Installations","Normes NF C 15-100","Dépannage","Lecture de plans"],ss:95,ms:[
{p:"Orientation & Choix filière",d:"1 mois",mo:"Avant formation",i:"📋",obj:"Choisir entre électricité, plomberie ou multi-fluides.",tasks:["Stage 1 semaine dans une entreprise du bâtiment","Comprendre les différences CAP électricien vs plombier","Contacter CFA local pour alternance","Renseignements CPF et financement"],dh:["1 vidéo technique bâtiment","Rechercher offres alternance","1 entreprise contactée","Préparer CV"],res:[{n:"AFPA",u:"https://afpa.fr",co:"Finançable CPF",du:"12–24 mois",lv:"Aucun",de:"Formation adulte électricien/plombier."},{n:"CFA Batiment",u:"https://ccca-btp.fr",co:"Gratuit alternance",du:"2 ans",lv:"16 ans+",de:"CFA du bâtiment, alternance rémunérée."}],val:["Filière choisie","Stage observation fait","CFA ou AFPA contacté","Financement identifié"],sku:["Connaissance métier","Orientation"],co:"0€",cd:"Alternance entièrement rémunérée."},
{p:"CAP – Fondamentaux théoriques",d:"6–8 mois",mo:"Mois 1–8",i:"📚",obj:"Maîtriser les bases électriques ou sanitaires.",tasks:["Lire des schémas électriques ou plans plomberie","Normes NF C 15-100 (élec) ou DTU 60 (plomberie)","Technologie des matériaux","Mathématiques appliquées","TD en atelier"],dh:["1h cours théorique","1 schéma électrique","Normes (30 min)","Quiz sécurité"],res:[{n:"Normes AFNOR Élec",u:"https://boutique.afnor.org",co:"~150€",du:"Référence",lv:"CAP",de:"Normes NF C 15-100 électricité domestique."},{n:"Électricité Pratique",u:"https://electricite-pratique.com",co:"Gratuit",du:"Référence",lv:"Débutant",de:"Guides techniques électricité."}],val:["Schémas lus et compris","Normes de base maîtrisées","Maths élec fluentes","TD atelier réussis"],sku:["Schémas électriques","Normes","Calculs techniques"],co:"~150€",cd:"Normes NF en accès école."},
{p:"Stages en entreprise",d:"4–6 mois",mo:"Mois 4–12",i:"🔨",obj:"Pratique chantier réelle.",tasks:["3 stages en entreprise BTP","Pose tableau électrique ou installation sanitaire","Câblage ou soudure cuivre","Rapport de stage","Sécurité chantier obligatoire"],dh:["Chantier (7h/jour)","1 technique nouvelle","1 fiche sécurité","Rapport stage"],res:[{n:"INRS Sécurité BTP",u:"https://inrs.fr",co:"Gratuit",du:"~5h",lv:"Étudiant BTP",de:"Sécurité et prévention chantier."},{n:"PGI Élec",u:"https://pgi-elec.fr",co:"Gratuit",du:"Référence",lv:"CAP",de:"Logiciel calcul installations électriques."}],val:["Stages validés","Tableau posé seul","Gestes sécurisés","Rapport noté"],sku:["Pose tableau","Câblage","Sécurité chantier"],co:"0€",cd:"Rémunéré si alternance."},
{p:"CAP + Habilitations",d:"2 mois",mo:"Fin de formation",i:"🎓",obj:"Diplôme et autorisations de travail sous tension.",tasks:["Soutenance CAP pratique et théorique","Habilitations électriques B1V, BR, BC","AIPR (autorisation intervention proximité réseaux)","Permis de conduire B utile"],dh:["Révision (2h)","Préparer soutenance","Dossier habilitations","Entretiens emploi"],res:[{n:"Habilitations électriques",u:"https://habilitation-electrique.fr",co:"~200€",du:"1–2 jours",lv:"CAP",de:"Formation habilitations électriques certifiantes."},{n:"AIPR Test",u:"https://aipr-test.fr",co:"~30€",du:"1h",lv:"BTP",de:"QCM préparation test AIPR."}],val:["CAP obtenu","Habilitations B1V/BR/BC","AIPR validé","Premier CDI ou chantier signé"],sku:["CAP","Habilitations électriques","AIPR"],co:"~230€",cd:"Habilitations et AIPR."},
{p:"1ère Expérience & Polyvalence",d:"1–2 ans",mo:"Post-CAP",i:"🏗️",obj:"Acquérir vitesse et autonomie sur chantier.",tasks:["Poste salarié en entreprise BTP","Intervenir sur chantiers variés (neuf/réno)","Bac Pro en alternance (facultatif)","Permis CACES nacelle (atout)","Réseau artisans du secteur"],dh:["Chantier (8h/jour)","1 nouvelle technique/semaine","Lecture plans (20 min)","Réseau chantier"],res:[{n:"Ooreka Electricien",u:"https://travaux.ooreka.fr",co:"Gratuit",du:"Référence",lv:"Pro",de:"Fiches pratiques installation électrique."},{n:"FFB",u:"https://ffbatiment.fr",co:"Cotisation",du:"Référence",lv:"Pro",de:"Fédération Française du Bâtiment."}],val:["Autonomie complète chantier","Interventions dépannage seul","Salaire >32K€/an","Réseau 5+ artisans"],sku:["Polyvalence chantier","Dépannage","Autonomie"],co:"~200€/an matériel",cd:"Employeur fournit équipements."},
{p:"Artisan Indépendant",d:"Variable",mo:"2–4 ans après CAP",i:"🔧",obj:"Créer son entreprise et développer sa clientèle.",tasks:["Immatriculation CMA / auto-entrepreneur","Assurance décennale obligatoire","Devis et facturation numérique","Prospection (bouche à oreille, Google My Business)","Embauche apprenti (si croissance)"],dh:["2–4 chantiers/jour","1 devis (30 min)","Comptabilité (20 min)","1 avis Google"],res:[{n:"CMA France",u:"https://cma-france.fr",co:"~150€/an",du:"Référence",lv:"Artisan",de:"Chambre Métiers et Artisanat — démarches."},{n:"Batiprix",u:"https://batiprix.com",co:"~200€/an",du:"Outil",lv:"Artisan",de:"Bordereau de prix pour devis BTP."}],val:["Entreprise immatriculée","Assurance décennale","10+ clients fidèles","CA > 4K€/mois"],sku:["Entrepreneuriat","Devis BTP","Gestion","Clientèle"],co:"~350€/an assurances",cd:"Décennale ~150€/mois."}
]},
boulanger:{id:"boulanger",e:"🥖",t:"Boulanger / Pâtissier",c:"#D97706",cat:"craft",dur:"24 mois",cost:"1000–8000€",lv:"Accessible",sal:{j:"22–26K€",m:"28–35K€",s:"40–80K€"},tag:"Métier passion, franchise possible.",sk:["Pétrissage","Fermentation","Pâtisserie","Gestion","Hygiène HACCP"],ss:90,ms:[
{p:"Découverte & Orientation",d:"1 mois",mo:"Avant CAP",i:"📋",obj:"Confirmer la passion et choisir la voie.",tasks:["Stage en boulangerie artisanale 1 semaine","Choisir entre CAP Boulanger ou Pâtissier ou les deux","Identifier CFA ou INBP","Renseignements alternance ou scolaire"],dh:["1 vidéo technique pain","1 boulangerie visitée","1 CFA contacté","Tester une recette à la maison"],res:[{n:"INBP",u:"https://inbp.com",co:"Variable",du:"12–24 mois",lv:"Aucun",de:"Institut National Boulangerie Pâtisserie."},{n:"CMA Formation",u:"https://cma-france.fr",co:"Gratuit info",du:"~2h",lv:"Tous",de:"Trouver une formation artisanale."}],val:["Stage observation","CFA ou INBP trouvé","Financement identifié","CAP choisi"],sku:["Connaissance métier","Orientation"],co:"0€",cd:"Stage observation gratuit."},
{p:"CAP – Techniques de base",d:"8–12 mois",mo:"Mois 1–12",i:"🥖",obj:"Maîtriser pétrissage, fermentation et cuisson.",tasks:["Pétrissage manuel et mécanique","Fermentation et pointage","Façonnage baguettes, pains spéciaux","Cuisson : températures et vapeur","Hygiène HACCP en laboratoire"],dh:["Pratiquer pétrissage (1h)","1 nouvelle façonnage","HACCP (15 min)","Évaluation auto-recette"],res:[{n:"CAP Boulanger Officiel",u:"https://eduscol.education.fr",co:"Gratuit",du:"Référence",lv:"CAP",de:"Référentiel officiel CAP Boulanger."},{n:"Cuisine AZ Boulangerie",u:"https://cuisineaz.com",co:"Gratuit",du:"Référence",lv:"Tous",de:"Recettes et techniques de base."}],val:["Baguette tradition maîtrisée","Pointage 2h respecté","HACCP validé","Épreuves pratiques CAP réussies"],sku:["Pétrissage","Fermentation","Façonnage","HACCP"],co:"Variable",cd:"Alternance rémunérée."},
{p:"CAP – Pâtisserie & Stages",d:"6–12 mois",mo:"Mois 6–24",i:"🍰",obj:"Diversifier les techniques et valider le diplôme.",tasks:["Viennoiserie : croissant, pain au chocolat","Pâtisserie de base (tartes, entremets)","Stages en boulangerie artisanale","Épreuves pratiques et théoriques CAP","CAP Pâtissier en parallèle (optionnel)"],dh:["1 recette viennoiserie","Stages terrain (7h/jour)","Cahier recettes perso","Révision théorie CAP"],res:[{n:"Ferrandi Paris",u:"https://ferrandi-paris.fr",co:"~5000€/an",du:"1–3 ans",lv:"CAP+",de:"École de référence pâtisserie haut niveau."},{n:"YouTube Boulangerie Pro",u:"https://youtube.com",co:"Gratuit",du:"Référence",lv:"Tous",de:"Chaînes professionnels boulangers."}],val:["CAP Boulanger obtenu","CAP Pâtissier (si dual)","Stages validés","Carnet recettes 30+ produits"],sku:["Viennoiserie","Pâtisserie","Stages terrain"],co:"1000–5000€",cd:"INBP privé ou CFA public."},
{p:"1ère Expérience en Boulangerie",d:"1–2 ans",mo:"Post-CAP",i:"💼",obj:"Acquérir vitesse et rigueur professionnelle.",tasks:["Poste ouvrier en boulangerie artisanale","Maîtriser les rythmes de production (nuit/matin)","Approfondir gamme (bios, sans gluten, levain)","BP Boulanger (pour ouvrir son commerce)","Réseau artisans et fournisseurs"],dh:["Production 6h–12h","1 recette levain","Gestion (20 min)","1 fournisseur contact"],res:[{n:"CNBPF",u:"https://cnbpf.com",co:"Cotisation",du:"Référence",lv:"Boulanger",de:"Confédération Nationale Boulangers Pâtissiers."},{n:"Boulangers de France",u:"https://boulangersdefrance.fr",co:"Gratuit",du:"Référence",lv:"Pro",de:"Ressources professionnelles boulangerie."}],val:["Cadence production maîtrisée","Levain géré","BP inscrit ou validé","Réseau 3+ fournisseurs"],sku:["Vitesse production","Levain naturel","BP Boulanger"],co:"0€",cd:"Emploi rémunéré + BP financé."},
{p:"BP Boulanger & Perfectionnement",d:"2 ans",mo:"2–4 ans après CAP",i:"🎓",obj:"BP obligatoire pour ouvrir son commerce.",tasks:["BP Boulanger (brevet professionnel)","Gestion commerciale et comptabilité","Management d'une équipe","Spécialisation : boulangerie bio, traiteur, franchise","Veille tendances (pain naturel, sans gluten)"],dh:["Cours BP (soir ou altern.)","1 recette spécialisée","Comptabilité (20 min)","Tendances marché"],res:[{n:"INBP BP",u:"https://inbp.com",co:"~3000€",du:"2 ans",lv:"CAP",de:"BP Boulanger à l'INBP."},{n:"Biobreizh",u:"https://biobreizh.fr",co:"Formation",du:"2 jours",lv:"Boulanger",de:"Formation boulangerie biologique."}],val:["BP obtenu","Comptabilité maîtrisée","1 spécialisation","Business plan ébauché"],sku:["BP Boulanger","Gestion","Spécialisation","Management"],co:"~3000€",cd:"BP finançable CPF/OPCO."},
{p:"Ouverture Boulangerie",d:"Variable",mo:"4–6 ans après CAP",i:"🏪",obj:"Ouvrir et rentabiliser sa propre boulangerie.",tasks:["Trouver local (achat ou reprise)","Business plan et prêt bancaire","Recrutement et management équipe","Marketing local (vitrine, réseaux)","Optimiser marge et gamme"],dh:["Production + gestion (10h/jour)","CA quotidien","1 post Instagram","1 client fidélisé"],res:[{n:"Bpifrance",u:"https://bpifrance.fr",co:"Gratuit",du:"~5h",lv:"Entrepreneur",de:"Financement création entreprise artisanale."},{n:"Groupe Casino Franchise",u:"https://franchise-casino.fr",co:"Variable",du:"Info",lv:"Boulanger",de:"Franchise boulangerie option."}],val:["Local ouvert","CA > 8K€/mois","Équipe 2+ personnes","Fidélité clientèle"],sku:["Gestion boulangerie","Marketing local","Management","Rentabilité"],co:"50–200K€",cd:"Prêt bancaire + apport perso."}
]},
coiffeur:{id:"coiffeur",e:"✂️",t:"Coiffeur / Barbier",c:"#A855F7",cat:"craft",dur:"24 mois",cost:"500–5000€",lv:"Accessible",sal:{j:"20–24K€",m:"26–32K€",s:"35–60K€"},tag:"Accessible, entrepreneuriat rapide.",sk:["Coupe","Coloration","Barbe","Relation client","Gestion salon"],ss:88,ms:[
{p:"Découverte & Stage",d:"1 mois",mo:"Avant CAP",i:"📋",obj:"Confirmer la passion et trouver un CFA.",tasks:["Stage 1 semaine en salon","Choisir entre coiffure dame/homme/mixte","Trouver CFA ou école privée","Renseignements alternance"],dh:["1 tutoriel coiffure YT","1 salon visité","1 CFA contacté","Préparer CV"],res:[{n:"CMA Coiffure",u:"https://cma-france.fr",co:"Gratuit",du:"2h",lv:"Tous",de:"Trouver CFA coiffure près de chez vous."},{n:"L'Oréal Pro Learning",u:"https://lorealprofessionnel.fr",co:"Gratuit",du:"Référence",lv:"Débutant",de:"Ressources techniques coiffure."}],val:["Stage observation fait","CFA trouvé","Alternance ou scolaire choisi","Inscription validée"],sku:["Connaissance métier","Orientation"],co:"0€",cd:"Alternance rémunérée."},
{p:"CAP Coiffure – Bases",d:"8–12 mois",mo:"Mois 1–12",i:"✂️",obj:"Maîtriser les coupes fondamentales.",tasks:["Shampoing et soins capillaires","Coupe femme et homme au ciseau","Dégradé et coupe tondeuse","Brushing et mise en forme","Relation client et accueil"],dh:["Pratiquer coupe (1h)","1 technique nouvelle","Client fictif (20 min)","Fiche technique"],res:[{n:"Wella Education",u:"https://education.wella.com",co:"Gratuit",du:"Référence",lv:"CAP",de:"Formations Wella pour coiffeurs."},{n:"CNEC",u:"https://cnec.asso.fr",co:"Cotisation",du:"Référence",lv:"Pro",de:"Confédération nationale coiffure."}],val:["Coupes hommes/femmes","Brushing maîtrisé","Relation client positive","Épreuves pratiques CAP réussies"],sku:["Coupe ciseau","Brushing","Relation client"],co:"Variable",cd:"CFA ou école privée ~500–5000€."},
{p:"CAP – Coloration & Techniques",d:"6–12 mois",mo:"Mois 6–24",i:"🎨",obj:"Coloration et techniques avancées.",tasks:["Colorations permanentes et semi-permanentes","Balayage et mèches","Permanente et lissage","Hygiène et sécurité produits chimiques","Stages en salon clients réels"],dh:["1 technique coloration","1 stage client réel","Sécurité chimique (15 min)","Fiche résultat"],res:[{n:"Redken Education",u:"https://redken.com",co:"Formation continue",du:"2 jours",lv:"CAP+",de:"Formations techniques coloration avancées."},{n:"L'Oréal Pro Cours",u:"https://lorealprofessionnel.fr",co:"~200€",du:"1 jour",lv:"CAP",de:"Cours coloration professionnels."}],val:["CAP obtenu","Coloration permanente","Balayage réussi","Stages validés"],sku:["Coloration","Balayage","Techniques chimiques"],co:"~200€ formations",cd:"L'Oréal ou Redken."},
{p:"Expérience salon & BP",d:"1–2 ans",mo:"Post-CAP",i:"💈",obj:"Acquérir vitesse et BP pour ouvrir un salon.",tasks:["Poste ouvrier en salon","Fidéliser sa propre clientèle","BP Coiffure (obligatoire pour ouvrir)","Tendances et nouvelles techniques","Réseau fournisseurs et salons"],dh:["6–8 clients/jour","1 nouvelle technique/semaine","BP cours (soir)","Réseau collègues"],res:[{n:"BP Coiffure INBP",u:"https://inbp.com",co:"~2000€",du:"2 ans",lv:"CAP",de:"BP Coiffure pour ouvrir son salon."},{n:"Intercoiffure",u:"https://intercoiffure.org",co:"Cotisation",du:"Référence",lv:"Pro",de:"Réseau salons haut de gamme."}],val:["30+ clients fidèles","BP inscrit","Vitesse professionnelle","Réseau 3+ fournisseurs"],sku:["Fidélisation clientèle","BP Coiffure","Vitesse pro"],co:"~2000€ BP",cd:"BP finançable CPF."},
{p:"BP & Spécialisation",d:"1–2 ans",mo:"2–4 ans après CAP",i:"🎓",obj:"BP obtenu et spécialisation (barbier, extension, mariage).",tasks:["BP Coiffure validé","Spécialisation barbier ou coloration créative","Formation extensions capillaires","Présence Instagram/TikTok","Business plan salon"],dh:["Perfectionnement technique","1 post avant/après","Business plan (30 min)","1 formation certifiante"],res:[{n:"Academy Barbier France",u:"https://academybarbierfrance.fr",co:"~500€",du:"3 jours",lv:"Coiffeur",de:"Formation barbier certifiée."},{n:"Great Lengths France",u:"https://gl-extensions.fr",co:"~800€",du:"2 jours",lv:"Coiffeur",de:"Formation extensions capillaires."}],val:["BP validé","Spécialisation certifiée","500+ followers","Business plan rédigé"],sku:["Barbier / Extensions","BP","Personal branding"],co:"500–1500€ formations",cd:"Spécialisations finançables."},
{p:"Ouverture Salon",d:"Variable",mo:"4–6 ans après CAP",i:"🏪",obj:"Salon rentable avec clientèle fidèle.",tasks:["Local commercial (bail 3-6-9)","Aménagement salon","Logiciel gestion réservations","Marketing local (Google, Instagram)","Embaucher un apprenti si croissance"],dh:["8–10 clients/jour","1 post réseaux","CA quotidien (5 min)","Réseau local"],res:[{n:"Franck Provost Franchise",u:"https://franchise-provost.fr",co:"Variable",du:"Info",lv:"Entrepreneur",de:"Option franchise coiffure reconnue."},{n:"Wavy Logiciel",u:"https://wavy.fr",co:"~30€/mois",du:"Outil",lv:"Salon",de:"Logiciel gestion salon coiffure."}],val:["Salon ouvert","CA > 5K€/mois","Apprenti recruté","Google 4,5 étoiles+"],sku:["Gestion salon","Marketing local","Management","Rentabilité"],co:"20–80K€",cd:"Prêt bancaire ou franchise."}
]},
prof:{id:"prof",e:"👩‍🏫",t:"Professeur des écoles",c:"#3B82F6",cat:"education",dur:"60 mois",cost:"500–3000€",lv:"Exigeant",sal:{j:"24–28K€",m:"30–38K€",s:"38–48K€"},tag:"Vocation et stabilité.",sk:["Pédagogie","Didactique","Gestion de classe","Programmes","Psychologie enfant"],ss:92,ms:[
{p:"Licence – Fondamentaux",d:"3 ans",mo:"Années 1–3",i:"📚",obj:"Acquérir la culture générale exigée au CRPE.",tasks:["Licence sciences de l'éducation ou autre","Français : maîtrise langue, orthographe, grammaire","Mathématiques : arithmétique, géométrie, raisonnement","Histoire, géographie, sciences naturelles","Préparer profil pédagogique"],dh:["1h révision discipline","1 exercice CM2 maths","1 texte littéraire analysé","1 article éducatif"],res:[{n:"Annales CRPE Hachette",u:"https://hachette-education.com",co:"~15€",du:"~40h",lv:"L3–M1",de:"Annales concours CRPE."},{n:"Devenir Enseignant",u:"https://devenirenseignant.gouv.fr",co:"Gratuit",du:"Référence",lv:"Tous",de:"Site officiel EN — concours et formations."}],val:["Licence validée","Français niveau CE2 enseignant","Maths primaire maîtrisées","Culture générale solide"],sku:["Français","Mathématiques","Culture générale"],co:"~500€/an",cd:"Université publique."},
{p:"Master MEEF 1 + Prépa CRPE",d:"1 an",mo:"Année 4",i:"🎓",obj:"Se spécialiser en pédagogie et préparer le concours.",tasks:["Master MEEF (Métiers Enseignement Éducation Formation)","Préparation intensive CRPE : écrits français et maths","Stages d'observation en école primaire (6 semaines)","Didactiques disciplinaires"],dh:["1h CRPE écrits","1 séquence didactique","Stage (journée)","1 conférence MEEF"],res:[{n:"ESPE / INSPE",u:"https://inspe-france.fr",co:"~500€/an",du:"2 ans",lv:"Licence",de:"Instituts formation enseignants, accès MEEF."},{n:"Iprof",u:"https://iprof.fr",co:"Gratuit",du:"Référence",lv:"Étudiant MEEF",de:"Ressources pédagogiques for professeurs."}],val:["M1 validé","Stages école validés","CRPE écrit simulé","Didactiques maîtrisées"],sku:["MEEF","Didactique","Stage école"],co:"~500€/an",cd:"Université publique + INSPE."},
{p:"CRPE – Concours",d:"6–12 mois",mo:"Année 5 – Avant M2",i:"📝",obj:"Réussir les épreuves écrites et orales du CRPE.",tasks:["CRPE écrit : français (dictée, compréhension, production)","CRPE écrit : mathématiques (exercices, problème)","Oral 1 : leçon devant jury","Oral 2 : entretien sur dossier EPS","Entraînements intensifs et concours blancs"],dh:["2 épreuves CRPE blanches","1 oral simulé","Retour sur erreurs (1h)","Annales (30 min)"],res:[{n:"Préparation CRPE Iufm",u:"https://prepa-crpe.fr",co:"~300€",du:"~100h",lv:"M1",de:"Préparation en ligne aux écrits CRPE."},{n:"Mathématiques CRPE",u:"https://mathcrpe.fr",co:"Gratuit",du:"~60h",lv:"M1",de:"Fiches et exercices maths CRPE."}],val:["CRPE réussi (admissible + admis)","Oral >12/20","Classé dans les reçus","Affectation académie"],sku:["CRPE","Oral pédagogique","Entretien jury"],co:"~300€ prépa",cd:"Préparation facultative."},
{p:"Master MEEF 2 + Stage PES",d:"1 an",mo:"Après admission CRPE",i:"🏫",obj:"Enseigner en classe en autonomie guidée.",tasks:["PES (Professeur des Écoles Stagiaire)","Mi-temps en classe (CP au CM2)","Mémoire professionnel MEEF 2","Séances observées et évaluées","Gestion de classe réelle"],dh:["Préparer séances (2h)","Mémoire (1h)","Bilan avec tuteur","1 outil pédagogique"],res:[{n:"Canopé Ressources",u:"https://reseau-canope.fr",co:"Gratuit",du:"Référence",lv:"Enseignant",de:"Ressources pédagogiques EN."},{n:"Banque de séquences",u:"https://edumoov.com",co:"Gratuit",du:"Référence",lv:"PE",de:"Séquences prêtes à l'emploi."}],val:["M2 validé","PES année validée","Mémoire soutenu","Classe gérée seul"],sku:["Gestion classe","Séances pédagogiques","Mémoire prof"],co:"~500€/an",cd:"Rémunéré comme PE stagiaire."},
{p:"Titularisation",d:"1 an",mo:"Post-M2",i:"✅",obj:"Devenir titulaire de l'Éducation Nationale.",tasks:["Évaluation du formateur","Inspection par l'IEN","Rapport d'activité","Titularisation officielle","Affectation définitive"],dh:["Séances 6h/jour","Réflexivité (20 min)","Contact IEN (si besoin)","Bilan trimestre"],res:[{n:"Syndicat SNUipp",u:"https://snuipp.fr",co:"Cotisation",du:"Référence",lv:"PE",de:"Syndicat professeurs écoles, droits et actualités."},{n:"BO Éducation Nationale",u:"https://education.gouv.fr/bo",co:"Gratuit",du:"Référence",lv:"Enseignant",de:"Bulletins officiels programmes."}],val:["Titularisé(e)","Inspection positive","Affectation confirmée","Classe autonome"],sku:["Titularisation","Évaluation professionnelle","Autonomie"],co:"0€",cd:"Fonctionnaire dès PE stagiaire."},
{p:"Carrière & Évolution",d:"5–30 ans",mo:"Post-titularisation",i:"🚀",obj:"Se spécialiser, évoluer ou prendre des responsabilités.",tasks:["Formation continue PAF (Plan Académique Formation)","Spécialisation : RASED (ASH), PEMF, directeur","Passage en hors-classe puis classe exceptionnelle","Projets école innovants (numérique, environnement)","Réseau inter-écoles"],dh:["Séances (6h/jour)","1 formation PAF/trimestre","Projet classe","Conseil de maîtres"],res:[{n:"INSPE Formation continue",u:"https://inspe-france.fr",co:"Gratuit (PAF)",du:"Variable",lv:"PE titulaire",de:"Plans académiques formation continue."},{n:"Café Pédagogique",u:"https://cafepedagogique.net",co:"Gratuit",du:"Quotidien",lv:"Enseignant",de:"Actualités et pratiques pédagogiques."}],val:["PEMF ou directeur","Hors-classe atteint","Projets innovants réalisés","Formation continue >20h/an"],sku:["RASED / Directeur","PEMF","Formation continue","Leadership pédagogique"],co:"0€",cd:"Formation gratuite PAF."}
]},
agentimmo:{id:"agentimmo",e:"🏠",t:"Agent immobilier",c:"#F97316",cat:"business",dur:"6–12 mois",cost:"200–2000€",lv:"Accessible",sal:{j:"24–30K€+com",m:"35–55K€",s:"60–120K€+"},tag:"Accessible, hauts revenus possibles.",sk:["Prospection","Négociation","Droit immobilier","Estimation","Relation client"],ss:78,ms:[
{p:"Orientation & Réseau",d:"1 mois",mo:"Avant formation",i:"📋",obj:"Comprendre le marché et choisir entre agence / réseau mandataires.",tasks:["Comparer agence physique vs réseau mandataires (IAD, SAFTI, Optimhome)","Shadow d'un agent 1 semaine","Analyser marché local","Choisir la structure d'exercice"],dh:["1 article FNAIM","1 réseau mandataire étudié","1 agent rencontré","1 secteur analysé"],res:[{n:"FNAIM",u:"https://fnaim.fr",co:"Cotisation",du:"Référence",lv:"Tous",de:"Fédération Nationale Agents Immobiliers."},{n:"IAD France",u:"https://iad-france.com",co:"Gratuit info",du:"~2h",lv:"Tous",de:"Réseau mandataires immobiliers."}],val:["Structure choisie","Stage observation fait","Marché local connu","Formation identifiée"],sku:["Connaissance marché","Orientation"],co:"0€",cd:"Démarches gratuites."},
{p:"Formation Loi Alur",d:"1–3 mois",mo:"Mois 1–3",i:"📚",obj:"Obtenir la Carte T ou habilitation mandataire.",tasks:["Loi Hoguet et réglementation immobilière","Droit des contrats et baux","Déontologie agent immobilier","Formation 150h (Loi Alur) ou BTS PI","Carte T ou habilitation réseau"],dh:["1h cours Loi Alur","1 quiz réglementation","1 acte de vente étudié","Droit immo (20 min)"],res:[{n:"Formation Alur Immo",u:"https://formation-alur.fr",co:"~300–2000€",du:"150h",lv:"Aucun",de:"Formation Loi Alur obligatoire."},{n:"BTS Professions Immobilières",u:"https://eduscol.education.fr",co:"~500€/an",du:"2 ans",lv:"Bac",de:"Diplôme de référence en immobilier."}],val:["Formation Alur ou BTS","Droit contrats maîtrisé","Carte T obtenue ou habilitation","Déontologie connue"],sku:["Loi Alur","Droit immobilier","Carte T"],co:"300–2000€",cd:"Formation obligatoire Loi Alur."},
{p:"Prospection terrain",d:"3–4 mois",mo:"Mois 3–6",i:"📞",obj:"Créer un stock de mandats.",tasks:["IWP (Porte-à-porte) systématique","Phoning sur vendeurs particuliers","Réseaux sociaux et piges","Pitch et argumentaire vendeur","Estimation de biens"],dh:["20 portes frappées","10 appels prospects","1 estimation réalisée","1 annonce suivie"],res:[{n:"MeilleursAgents",u:"https://meilleursagents.com",co:"Gratuit",du:"Outil",lv:"Agent",de:"Outils estimation prix immobilier."},{n:"ImmoData",u:"https://immodata.net",co:"~30€/mois",du:"Outil",lv:"Agent",de:"Données marché immobilier professionnel."}],val:["5 mandats exclusifs signés","Estimation maîtrisée","Script vendeur rodé","Zone de chalandise définie"],sku:["Porte-à-porte","Phoning","Estimation","Mandat"],co:"~30€/mois outils",cd:"ImmoData ou MeilleursAgents."},
{p:"Visites & Closing",d:"3–6 mois",mo:"Mois 4–9",i:"🤝",obj:"Conclure les premières transactions.",tasks:["Sélection et qualification acheteurs","Technique de visite commentée","Négociation vendeur/acheteur","Accompagnement compromis → acte","Financement et courtage partenaire"],dh:["2–3 visites/jour","1 négociation","1 qualification acheteur","1 suivi financement"],res:[{n:"SeLoger Pro",u:"https://pro.seloger.com",co:"~200€/mois",du:"Outil",lv:"Agent",de:"Publication annonces immo."},{n:"Gong Immobilier",u:"https://gong.io",co:"Gratuit ressources",du:"Référence",lv:"Commercial",de:"Techniques closing et négociation."}],val:["1ère vente conclue","Commission >5K€","Qualification acheteur <20 min","Compromis signé"],sku:["Négociation","Closing","Financement","Compromis"],co:"~200€/mois annonces",cd:"SeLoger Pro ou Leboncoin Pro."},
{p:"Performance & Fidélisation",d:"6–12 mois",mo:"Mois 6–18",i:"📈",obj:"Atteindre 3K€+ de commissions/mois en régularité.",tasks:["Développer portefeuille >20 mandats","Pipeline CRM structuré","Recommandations et réseau d'anciens clients","Partenariats notaires, courtiers, diagnostiqueurs","Compétences en gestion locative"],dh:["Pipeline CRM (15 min)","3 visites","1 appel ancien client","1 partenaire contacté"],res:[{n:"Salesforce Essentials",u:"https://salesforce.com",co:"~25€/mois",du:"Outil",lv:"Agent",de:"CRM immobilier."},{n:"ImmoPotam",u:"https://immopotam.fr",co:"Gratuit",du:"Référence",lv:"Agent",de:"Ressources pro immobilier."}],val:["3K€+ commissions/mois","20+ mandats actifs","5 recommandations reçues","1 partenaire notaire"],sku:["CRM","Fidélisation","Recommandations","Partenariats"],co:"~25€/mois CRM",cd:"CRM optionnel mais très utile."},
{p:"Indépendance ou Management",d:"Variable",mo:"Après 12–24 mois",i:"🚀",obj:"Créer son agence ou devenir responsable réseau.",tasks:["Créer sa propre agence physique (Carte T propre)","OU devenir manager filleuls réseau mandataires","Business plan et financement","Recrutement et formation","Branding local fort"],dh:["CA mensuel suivi","1 recrutement réseau","1 post Google Business","1 agent coaché"],res:[{n:"Créer agence FNAIM",u:"https://fnaim.fr",co:"Cotisation",du:"Référence",lv:"Agent confirmé",de:"Créer son agence adhérente FNAIM."},{n:"Orpi Franchise",u:"https://orpi.com",co:"Variable",du:"Info",lv:"Entrepreneur",de:"Franchise Orpi reconnue."}],val:["Agence ouverte ou 5 filleuls","CA > 8K€/mois","Équipe 2+ personnes","Marque locale connue"],sku:["Création agence","Management","Branding local","Franchise"],co:"10–50K€",cd:"Agence physique ou franchise."}
]},
photographe:{id:"photographe",e:"📸",t:"Photographe / Vidéaste",c:"#8B5CF6",cat:"creative",dur:"12 mois",cost:"2000–8000€",lv:"Accessible",sal:{j:"20–28K€",m:"30–45K€",s:"50–80K€"},tag:"Capturer des moments.",sk:["Cadrage","Lumière","Retouche","Montage vidéo","Direction artistique"],ss:60,ms:[
{p:"Matériel & 1ers pas",d:"1 mois",mo:"Mois 1",i:"📷",obj:"Choisir son matériel et comprendre les bases.",tasks:["Choisir boîtier hybride ou reflex débutant (Sony A6000, Canon R50)","Comprendre le triangle d'exposition (ISO, ouverture, vitesse)","Pratiquer en mode priorité ouverture (Av)","50 premières photos analysées"],dh:["30 min pratique dehors","1 photo analysée (lumière, composition)","1 tutoriel YT","Notes sur les paramètres"],res:[{n:"Peter McKinnon YouTube",u:"https://youtube.com/@PeterMcKinnon",co:"Gratuit",du:"Référence",lv:"Débutant",de:"Tutoriels photo/vidéo accessibles."},{n:"Digital Photography School",u:"https://digital-photography-school.com",co:"Gratuit",du:"Référence",lv:"Débutant",de:"Articles et exercices photo."}],val:["Matériel acheté","Mode Av maîtrisé","50 photos analysées","1 belle photo obtenue"],sku:["Triangle exposition","Composition","Matériel"],co:"500–2000€",cd:"Boîtier d'occasion ou entrée de gamme."},
{p:"Technique Photo Avancée",d:"3 mois",mo:"Mois 2–4",i:"🎞️",obj:"Maîtriser mode manuel et composition avancée.",tasks:["Mode manuel complet (M)","Lois de composition : règle des tiers, lignes directrices","Lumière naturelle et flash externe","Lightroom Classic : retouche couleurs, exposition","Portfolio de 20 photos retouchées"],dh:["1 shooting en mode M","Retoucher 3 photos (Lightroom)","1 règle composition testée","1 tutoriel avancé"],res:[{n:"Lightroom Tutorial Serge Ramelli",u:"https://youtube.com/@SergeRamelli",co:"Gratuit",du:"~30h",lv:"Intermédiaire",de:"Tutoriels Lightroom français de référence."},{n:"Adobe Lightroom Classic",u:"https://adobe.com/lightroom",co:"~14€/mois",du:"Outil",lv:"Tous",de:"Logiciel retouche photo professionnel."}],val:["Mode M maîtrisé","20 photos retouchées","Composition conscience","Lightroom fluide"],sku:["Mode manuel","Lightroom","Composition avancée"],co:"~14€/mois",cd:"Adobe Lightroom."},
{p:"Vidéo & Montage",d:"2 mois",mo:"Mois 4–5",i:"🎬",obj:"Ajouter la vidéo à ses compétences.",tasks:["Réglages vidéo (1080p/4K, 24fps, 60fps)","Stabilisation et mouvements caméra","Premiere Pro ou DaVinci Resolve : montage de base","Premier montage de 2 minutes","Color grading basique"],dh:["15 min vidéo tournée","Montage (30 min)","1 tutoriel color grading","1 vidéo courte publiée"],res:[{n:"DaVinci Resolve",u:"https://blackmagicdesign.com/products/davinciresolve",co:"Gratuit",du:"~20h apprendre",lv:"Débutant",de:"Logiciel montage professionnel gratuit."},{n:"Casey Neistat YouTube",u:"https://youtube.com/@CaseyNeistat",co:"Gratuit",du:"Inspiration",lv:"Tous",de:"Vidéaste de référence pour storytelling."}],val:["1 vidéo 2 min montée","Color grading","DaVinci maîtrisé","Stabilisation correcte"],sku:["Vidéo","Montage","DaVinci Resolve","Color grading"],co:"Gratuit (DaVinci)",cd:"DaVinci Resolve gratuit."},
{p:"Niche & 1ers Clients",d:"3 mois",mo:"Mois 5–8",i:"💼",obj:"Définir sa niche et décrocher les premières missions.",tasks:["Choisir niche : mariage, corporate, portrait, produit, immobilier","Construire portfolio niche sur site web","Malt, Instagram, Google My Business","Shooting test gratuit pour portfolio","5 premières missions payantes"],dh:["1 post Instagram portfolio","1 prospection","1 shooting niche","Tarification mise à jour"],res:[{n:"Malt Photographe",u:"https://malt.fr",co:"Gratuit",du:"Outil",lv:"Freelance",de:"Plateforme n°1 freelances France."},{n:"Pixieset",u:"https://pixieset.com",co:"~8€/mois",du:"Outil",lv:"Photographe",de:"Galeries photos en ligne pour clients."}],val:["Niche définie","Portfolio 30 photos niche","Site web en ligne","5 missions payantes"],sku:["Niche photographique","Portfolio","Site web","Prospection"],co:"~200€",cd:"Site web + Pixieset."},
{p:"Développement Commercial",d:"4–6 mois",mo:"Mois 8–12",i:"📈",obj:"Stabiliser les revenus à 2000€/mois.",tasks:["Pricing premium","Packages mariage / corporate","Partenariats (agences événementielles, architectes)","Témoignages et note Google","Réseaux sociaux actifs (Insta, LinkedIn selon niche)"],dh:["1 devis envoyé","1 shooting client","1 post réseau","1 partenaire contacté"],res:[{n:"The Futur YouTube",u:"https://youtube.com/@thefutur",co:"Gratuit",du:"Référence",lv:"Créatif freelance",de:"Pricing et business pour créatifs."},{n:"StuDocu Contrat Photo",u:"https://studocu.com",co:"Gratuit",du:"~2h",lv:"Photographe",de:"Modèles contrats pour photographes."}],val:["2000€/mois CA","Packages créés","10+ avis Google","Partenariats actifs"],sku:["Pricing premium","Packages","Partenariats","Personal branding"],co:"~100€/mois marketing",cd:"Publicité Meta optionnelle."},
{p:"Studio & Expertise",d:"Variable",mo:"Après 12–24 mois",i:"🏆",obj:"Photographe/vidéaste reconnu dans sa niche.",tasks:["Investir en studio ou matériel avancé","Spécialisation de niche (luxe, sport, architecture)","Former ou mentorer d'autres photographes","Publication dans médias ou agences stock","Agence ou collectif de créatifs"],dh:["Shooting professionnel","1 contenu éducatif","1 contact agence","Matériel testé"],res:[{n:"Adobe Stock",u:"https://stock.adobe.com",co:"Partage revenus",du:"Outil",lv:"Confirmé",de:"Vendre ses photos en stock."},{n:"GettyImages Contributeur",u:"https://gettyimages.fr",co:"Gratuit",du:"Outil",lv:"Confirmé",de:"Agence photos mondiale."}],val:["3000€+/mois CA","Photos en banque d'images","1 cours ou tuto publié","Niche leader local"],sku:["Studio","Stock photography","Formation","Leadership créatif"],co:"2000–5000€ matériel",cd:"Investissement studio progressif."}
]},
redacteur:{id:"redacteur",e:"✍️",t:"Rédacteur / Journaliste web",c:"#6366F1",cat:"creative",dur:"12 mois",cost:"0–500€",lv:"Accessible",sal:{j:"22–28K€",m:"30–40K€",s:"42–60K€"},tag:"Content is king.",sk:["Rédaction web","SEO","Storytelling","CMS","Recherche"],ss:55,ms:[
{p:"Fondamentaux de l'écriture web",d:"2 mois",mo:"Mois 1–2",i:"📝",obj:"Maîtriser la structure d'un article web performant.",tasks:["Pyramide inversée et accroche","Titres H1/H2/H3 et hiérarchie sémantique","Styles d'écriture : informatif, persuasif, storytelling","5 articles de 500 mots publiés sur blog perso","Analyser 10 articles viraux (structure, ton, CTA)"],dh:["Écrire 500 mots (1h)","1 accroche testée","1 article concurrent analysé","Vocabulaire enrichi (10 mots)"],res:[{n:"Copywriting.fr",u:"https://copywriting.fr",co:"Gratuit",du:"Référence",lv:"Débutant",de:"Techniques de copywriting en français."},{n:"Hemingway App",u:"https://hemingwayapp.com",co:"Gratuit",du:"Outil",lv:"Tous",de:"Analyser la clarté et lisibilité de ses textes."}],val:["5 articles publiés","Accroche <30s efficace","Structure H1-H3 maîtrisée","Ton adapté à la cible"],sku:["Rédaction web","Accroche","Storytelling","Structure"],co:"0€",cd:"Blog gratuit (WordPress.com ou Notion)."},
{p:"SEO Rédactionnel",d:"2 mois",mo:"Mois 3–4",i:"🔍",obj:"Écrire des contenus qui rankent sur Google.",tasks:["Recherche de mots-clés (volume, intention)","Structure SEO : balises, densité, sémantique","Linking interne et externe","Yoast ou Rank Math sur WordPress","1 article optimisé en position 1–10 Google"],dh:["1 recherche mots-clés (30 min)","1 article SEO optimisé","1 backlink obtenu","Rank suivi Ubersuggest"],res:[{n:"Yoast SEO Blog",u:"https://yoast.com",co:"Gratuit",du:"Référence",lv:"Débutant",de:"Guide complet SEO rédactionnel."},{n:"Ubersuggest",u:"https://neilpatel.com/ubersuggest",co:"Gratuit (limité)",du:"Outil",lv:"Rédacteur",de:"Recherche mots-clés et analyse concurrence."}],val:["1 article top 10 Google","Intention recherche maîtrisée","Mots-clés longue traîne utilisés","CMS et plugins SEO maîtrisés"],sku:["SEO","Mots-clés","Balises","WordPress"],co:"0€",cd:"Outils gratuits suffisants."},
{p:"Portfolio & Niche",d:"2 mois",mo:"Mois 4–6",i:"📂",obj:"Construire un portfolio par niche pour attirer des clients.",tasks:["Choisir 1–2 niches (tech, santé, finance, RH, voyage)","15 articles niche avec résultats mesurables","Portfolio en ligne (Notion ou site)","Études de cas : avant/après SEO","Premiers contacts clients (test)"],dh:["1 article niche","1 étude de cas","1 contact potentiel","Portfolio mis à jour"],res:[{n:"Notion Portfolio",u:"https://notion.so",co:"Gratuit",du:"Outil",lv:"Tous",de:"Créer un portfolio rédacteur rapidement."},{n:"Semrush Blog",u:"https://semrush.com/blog",co:"Gratuit",du:"Référence",lv:"Intermédiaire",de:"Ressources SEO et content marketing avancés."}],val:["15 articles niche","Portfolio 5 études de cas","Niche définie","1er retour client positif"],sku:["Niche rédactionnelle","Portfolio","Études de cas"],co:"0€",cd:"Notion gratuit."},
{p:"Freelance & 1ers Clients",d:"3 mois",mo:"Mois 6–9",i:"💼",obj:"Décrocher les premières missions rémunérées.",tasks:["Profil Malt, Fiverr, LinkedIn complet","Tarification : au mot (~0,05–0,15€) ou au projet","Cold emailing ciblé (agences de contenu, startups)","5 clients payants","Contrat type rédacteur"],dh:["1 prospection Malt/LinkedIn","1 article client","TJM analysé","1 réponse aux appels d'offre"],res:[{n:"Malt Rédacteur",u:"https://malt.fr",co:"Gratuit",du:"Outil",lv:"Freelance",de:"Plateforme n°1 freelances France."},{n:"Comeup",u:"https://comeup.com",co:"Gratuit",du:"Outil",lv:"Freelance",de:"Alternative Fiverr en français."}],val:["5 clients payants","CA > 500€/mois","Tarif au projet","Malt complété 100%"],sku:["Freelance","Tarification","Prospection","Malt"],co:"0€",cd:"Plateformes gratuites."},
{p:"Croissance Freelance",d:"3–6 mois",mo:"Mois 9–12",i:"📈",obj:"Atteindre 2000€/mois de CA régulier.",tasks:["Clients récurrents (1 contenu/semaine minimum)","Tarification premium (>100€/article)","Newsletter ou blog d'autorité perso","LinkedIn publishing régulier","Sous-traiter si débordé"],dh:["2 articles clients","1 post LinkedIn","Newsletter mensuelle","Factures envoyées"],res:[{n:"ConvertKit Newsletter",u:"https://convertkit.com",co:"Gratuit (1000 abonnés)",du:"Outil",lv:"Rédacteur confirmé",de:"Créer une newsletter d'autorité."},{n:"The Content Strategist",u:"https://contently.com/strategist",co:"Gratuit",du:"Référence",lv:"Intermédiaire",de:"Blog content marketing de référence."}],val:["2000€/mois CA","3+ clients récurrents","Newsletter 100+ abonnés","Tarif >100€/article"],sku:["Clients récurrents","Newsletter","LinkedIn","Personal branding"],co:"0€",cd:"ConvertKit gratuit."},
{p:"Expert & Direction contenu",d:"Variable",mo:"Après 12–24 mois",i:"🏆",obj:"Devenir expert editorial ou directeur de contenu.",tasks:["Spécialisation profonde (1 niche dominante)","Former d'autres rédacteurs","Missions de stratégie de contenu (Content Strategy)","Proposer audits SEO + plans éditoriaux","Évoluer vers Content Manager ou CDO"],dh:["1 audit contenu","1 plan éditorial","1 junior formé","1 conférence SEO"],res:[{n:"Content Marketing Institute",u:"https://contentmarketinginstitute.com",co:"Gratuit",du:"Référence",lv:"Expert",de:"Ressources content marketing mondiales."},{n:"Semrush Academy",u:"https://semrush.com/academy",co:"Gratuit",du:"~20h",lv:"Intermédiaire",de:"Certifications SEO et content."}],val:["3K€+/mois CA","Direction contenu 1 entreprise","Certification SEO","Expert reconnu niche"],sku:["Content Strategy","Direction éditoriale","SEO avancé","Formation"],co:"0–200€ certifications",cd:"Certifications SEMrush gratuites."}
]},
graphiste:{id:"graphiste",e:"🎨",t:"Graphiste / Directeur artistique",c:"#EC4899",cat:"creative",dur:"18 mois",cost:"500–5000€",lv:"Accessible",sal:{j:"24–30K€",m:"32–45K€",s:"48–70K€"},tag:"Identités visuelles mémorables.",sk:["Adobe Suite","Identité visuelle","Typographie","Print","Direction artistique"],ss:62,ms:[
{p:"Bases du design graphique",d:"2 mois",mo:"Mois 1–2",i:"🎯",obj:"Comprendre les fondamentaux du design visuel.",tasks:["Théorie des couleurs (cercle chromatique, harmonies)","Typographie : familles, lisibilité, hiérarchie","Grilles, espaces blancs, alignement","Gestalt et perception visuelle","Analyser 20 identités visuelles célèbres"],dh:["1 création visuelle","1 analyse marque","1 règle typo testée","Inspiration Behance (15 min)"],res:[{n:"Canva Design School",u:"https://designschool.canva.com",co:"Gratuit",du:"~10h",lv:"Débutant",de:"Cours design gratuits interactifs."},{n:"Thinking with Type",u:"https://amazon.fr",co:"~25€",du:"~8h",lv:"Débutant",de:"Référence typo pour graphistes."}],val:["Couleurs harmonieuses","Typo lisible","Grille maîtrisée","20 analyses faites"],sku:["Couleurs","Typographie","Grilles","Gestalt"],co:"~25€",cd:"Livre typo référence."},
{p:"Adobe Suite – Maîtrise outils",d:"4 mois",mo:"Mois 2–6",i:"🖌",obj:"Maîtriser les 3 logiciels professionnels.",tasks:["Illustrator : logo vectoriel, icônes, tracés","Photoshop : retouche, composition, montage","InDesign : mise en page, charte graphique","Figma : maquettes UI web (bonus)","Portfolio 10 créations finalisées"],dh:["30 min Illustrator","1 création Photoshop","1 page InDesign","1 tutoriel avancé"],res:[{n:"Domestika",u:"https://domestika.org",co:"~10€/cours",du:"~20h/cours",lv:"Débutant",de:"Cours créatifs qualité filmés par pros."},{n:"Adobe Tutorials",u:"https://helpx.adobe.com",co:"Gratuit",du:"Référence",lv:"Tous",de:"Tutoriels officiels Adobe."}],val:["Logo vectoriel créé","Photo compositing","Mise en page 8 pages","10 projets portfolio"],sku:["Illustrator","Photoshop","InDesign","Figma"],co:"~290€/an (Adobe CC)",cd:"Adobe Creative Cloud."},
{p:"Identité visuelle & Branding",d:"3 mois",mo:"Mois 6–9",i:"✨",obj:"Créer une identité visuelle complète de A à Z.",tasks:["Charte graphique : logo, couleurs, typo, règles","Déclinaisons : cartes de visite, en-tête, réseaux","Moodboard et brief créatif","3 identités visuelles complètes","Présentation au client (pitch)"],dh:["1 déclinaison branding","1 moodboard","1 présentation","1 retour simulé"],res:[{n:"Logo Design Love",u:"https://logodesignlove.com",co:"~20€",du:"~8h",lv:"Intermédiaire",de:"Bible du design de logo."},{n:"Brand New UnderConsideration",u:"https://underconsideration.com",co:"Gratuit",du:"Référence",lv:"Tous",de:"Analyses critiques d'identités visuelles."}],val:["3 identités visuelles","Charte graphique livrée","Pitch client réussi","Déclinaisons print/digital"],sku:["Charte graphique","Branding","Pitch créatif","Déclinaisons"],co:"0€",cd:"Logiciels déjà payés."},
{p:"Portfolio & 1ers Clients",d:"3 mois",mo:"Mois 9–12",i:"💼",obj:"Décrocher les premières missions freelance.",tasks:["Portfolio Behance et site web","LinkedIn et Instagram créatif","Malt ou 99designs","Cold email ciblé (startups, PME)","5 premiers clients payants"],dh:["1 projet portfolio","1 post créatif","1 prospection","1 devis envoyé"],res:[{n:"Behance",u:"https://behance.net",co:"Gratuit",du:"Portfolio",lv:"Tous",de:"Vitrine portfolio graphistes mondiale."},{n:"Malt Graphiste",u:"https://malt.fr",co:"Gratuit",du:"Outil",lv:"Freelance",de:"Plateforme freelances créatifs."}],val:["Portfolio 15+ projets","5 clients payants","TJM >250€","Malt profil complet"],sku:["Portfolio","Prospection","TJM","Malt"],co:"0€",cd:"Behance et Malt gratuits."},
{p:"Direction artistique",d:"4–6 mois",mo:"Mois 12–18",i:"🎨",obj:"Aller au-delà du graphisme vers la DA.",tasks:["Briefs créatifs complets (périmètre, ton, ambiance)","Superviser une production créative","Motion design basics (After Effects ou Canva)","Stratégie de contenu visuel","Clients réguliers à tarif premium"],dh:["1 brief créatif rédigé","1 supervision","Motion design (30 min)","2 clients en parallèle"],res:[{n:"After Effects Tutorials",u:"https://motion-design-school.com",co:"~50€",du:"~20h",lv:"Intermédiaire",de:"Motion design pour graphistes."},{n:"The Futur YouTube",u:"https://youtube.com/@thefutur",co:"Gratuit",du:"Référence",lv:"Créatif freelance",de:"Pricing et business créatif."}],val:["DA sur 3 projets","Motion design 30s","TJM >400€","Clients récurrents"],sku:["Direction artistique","Brief créatif","Motion design","Stratégie visuelle"],co:"~50€ cours motion",cd:"After Effects inclus Adobe CC."},
{p:"Studio ou Agence",d:"Variable",mo:"Après 18 mois",i:"🏆",obj:"Studio créatif freelance ou responsable DA en agence.",tasks:["Studio freelance avec 3+ clients récurrents","OU responsable artistique en agence","Spécialisation (packaging, luxe, digital)","Mentorer des juniors","Personal branding fort (Instagram, talks)"],dh:["2 missions creatives/jour","1 post portfolio","1 junior suivi","CA mensuel suivi"],res:[{n:"CreativeMarket",u:"https://creativemarket.com",co:"Variable",du:"Revenus passifs",lv:"Graphiste confirmé",de:"Vendre templates et assets."},{n:"Design Week",u:"https://designweek.co.uk",co:"Gratuit",du:"Référence",lv:"Pro",de:"Actualités et tendances design."}],val:["Studio ou DA en agence","3K€+/mois CA","1 spécialisation reconnue","Personal brand visible"],sku:["Studio créatif","DA senior","Spécialisation","Leadership créatif"],co:"Variable",cd:"Studio léger vs agence."}
]},
consultant:{id:"consultant",e:"💼",t:"Consultant en management",c:"#0EA5E9",cat:"business",dur:"36–60 mois",cost:"5000–30000€",lv:"Très exigeant",sal:{j:"38–48K€",m:"55–85K€",s:"100–200K€+"},tag:"McKinsey path.",sk:["Analyse stratégique","PowerPoint","Excel","Problem solving","Communication"],ss:72,ms:[
{p:"Grande école ou Master",d:"3–5 ans",mo:"Années 1–5",i:"🎓",obj:"Diplôme d'une institution reconnue par les cabinets.",tasks:["HEC, ESSEC, Polytechnique, Sciences Po, ou Master M2 stratégie","Stages en cabinet de conseil ou entreprise","Case studies competitions (ex: BCG Open Case)","Excel et PowerPoint niveau avancé","Réseau alumni et associations étudiantes"],dh:["1 case study (30 min)","Excel avancé (30 min)","1 article stratégie","1 événement réseau/mois"],res:[{n:"Case In Point Rasiel",u:"https://amazon.fr",co:"~30€",du:"~20h",lv:"Étudiant",de:"LA bible des case studies consulting."},{n:"McKinsey Problem Solving",u:"https://mckinsey.com",co:"Gratuit",du:"Référence",lv:"Étudiant",de:"Ressources open gratuites McKinsey."}],val:["Master obtenu mention","2 stages cabinet","10 cases résolus","Réseau 50+ contacts"],sku:["Case studies","Excel avancé","PowerPoint","Réseau"],co:"5000–15000€/an",cd:"Grande école ou université."},
{p:"Préparation recrutement",d:"3–6 mois",mo:"Dernière année",i:"📝",obj:"Décrocher un stage ou CDI en cabinet.",tasks:["Entraînement cases (PST, cas estimations)","Tests numériques (McKinsey PST, BCG)","Entretiens fit (leadership, teamwork)","Préparation cover letter et CV consulting","Candidatures Big 3, Big 4, cabinets boutiques"],dh:["2 cases/jour","1 entretien simulé","1 candidature","CV mis à jour"],res:[{n:"PrepLounge",u:"https://preplounge.com",co:"Gratuit/~30€/mois",du:"~100h",lv:"Étudiant",de:"Plateforme entraînement cases consulting."},{n:"IGotAnOffer",u:"https://igotanoffer.com",co:"~50€",du:"~30h",lv:"Étudiant",de:"Guide complet recrutement conseil."}],val:["PST score >70%","5 cases résolus en entretien","Stage ou 1er poste signé","Offre reçue"],sku:["PST / tests","Cas consulting","Fit interview","Candidature"],co:"~80€",cd:"PrepLounge + livre."},
{p:"Consultant Junior (Analyst/Associate)",d:"2–3 ans",mo:"Post-diplôme",i:"📊",obj:"Produire des analyses rigoureuses et des livrables clients.",tasks:["Analyser données client (Excel, modèles financiers)","Construire slides PowerPoint claires et impactantes","Interviews et workshops clients","Structurer un problème avec approche MECE","Gérer les délais et la pression"]  ,dh:["1 slide deck","1 modèle Excel","1 client interviewé","Retour manager"],res:[{n:"Pyramid Principle Minto",u:"https://amazon.fr",co:"~30€",du:"~10h",lv:"Junior",de:"Structuration messages et slides conseil."},{n:"Think Cell PowerPoint",u:"https://think-cell.com",co:"~250€/an",du:"Outil",lv:"Consultant",de:"Plugin PowerPoint pour graphiques professionnel."}],val:["10+ missions livrées","Slides validées par senior","Modèle financier autonome","Feedback client positif"],sku:["Slides PowerPoint","Modèles Excel","MECE","Livrables"],co:"~280€/an outils",cd:"Think-Cell + Pyramid Principle."},
{p:"Manager (Case Lead)",d:"2–3 ans",mo:"4–6 ans d'expérience",i:"🤝",obj:"Piloter une équipe et gérer la relation client.",tasks:["Manager une équipe 2–4 consultants","Structurer et piloter une mission complète","Gérer le comité de pilotage client","Développer les compétences des juniors","Commencer à participer au business development"],dh:["1 réunion client","Mentorat junior (30 min)","1 proposition commerciale","Revue d'avancement"],res:[{n:"McKinsey Insights",u:"https://mckinsey.com/featured-insights",co:"Gratuit",du:"Référence",lv:"Manager",de:"Articles stratégie de référence."},{n:"Harvard Business Review",u:"https://hbr.org",co:"~15€/mois",du:"Mensuel",lv:"Manager",de:"Management et leadership avancé."}],val:["Mission de 3 mois pilotée","Équipe satisfaite","Client reconduit","Junior promu"],sku:["Management équipe","Relation client","Pilotage mission","Développement junior"],co:"~15€/mois",cd:"HBR abonnement."},
{p:"Senior Manager / Principal",d:"2–3 ans",mo:"7–9 ans",i:"💡",obj:"Apporter des insights stratégiques de haut niveau.",tasks:["Définir la stratégie globale d'une mission","Développer un portefeuille de clients","Publier des points de vue (thought leadership)","Entrer dans les réseaux d'influence sectorielle","Préparer le dossier d'association"],dh:["1 article ou insight publié","1 client développé","Revue stratégie","1 réseau événement"],res:[{n:"Consulting Club MBA",u:"https://mba-club.fr",co:"Réseau",du:"Référence",lv:"Senior",de:"Réseau alumni cabinets conseil en France."},{n:"BCG Henderson Institute",u:"https://bcg.com/featured-insights",co:"Gratuit",du:"Référence",lv:"Senior",de:"Think tank stratégie BCG."}],val:["3M€+ revenus clients managés","1 article ou étude publié","Dossier association préparé","Réseau senior solide"],sku:["Thought leadership","Business development","Stratégie","Association"],co:"0€",cd:"Développement payé par le cabinet."},
{p:"Partner / Associé",d:"3–5 ans",mo:"10+ ans",i:"🏆",obj:"Devenir associé et décider du futur du cabinet.",tasks:["Vote au comité d'association (ou créer sa boutique)","Porter un secteur ou une practice","Recruter et développer des talents","Assurer la rentabilité de sa practice","Représenter le cabinet en externe"],dh:["Développement clients","1 talent recruté","1 conférence sectorielle","Comité direction"],res:[{n:"The McKinsey Way",u:"https://amazon.fr",co:"~20€",du:"~8h",lv:"Aspirant Partner",de:"Culture et méthodes McKinsey."},{n:"Alumni Consulting Club",u:"https://aclub.fr",co:"Réseau",du:"Référence",lv:"Senior",de:"Réseau anciens consultants FR."}],val:["Associé nommé","Practice rentable","Équipe 10+ personnes","Revenus >200K€/an"],sku:["Leadership cabinet","Practice management","Recrutement","Influence sectorielle"],co:"0€",cd:"Rémunération parts cabinet."}
]},
trader:{id:"trader",e:"📈",t:"Trader / Analyste financier",c:"#10B981",cat:"finance",dur:"36–60 mois",cost:"5000–30000€",lv:"Très exigeant",sal:{j:"40–55K€",m:"70–120K€",s:"150–500K€+"},tag:"Marchés financiers.",sk:["Analyse financière","Bloomberg","Modélisation","Risk management","VBA/Python"],ss:68,ms:[
{p:"Master Finance / École",d:"3–5 ans",mo:"Années 1–5",i:"🎓",obj:"Diplôme reconnu par les salles de marchés.",tasks:["Master Finance de marché (Paris Dauphine, HEC, ESSEC)","Mathématiques financières et probabilités","Économétrie et statistiques","Programmation Python ou VBA pour finance","Stage en salle de marchés ou banque d'investissement"],dh:["1h modélisation financière","1 article macro","Python/VBA (30 min)","1 réseau événement finance"],res:[{n:"CFA Institute",u:"https://cfainstitute.org",co:"~1000€/niveau",du:"~300h/niveau",lv:"Bac+3",de:"Certification finance mondiale CFA."},{n:"QuantLib Python",u:"https://quantlib.org",co:"Gratuit",du:"~30h",lv:"Étudiant",de:"Librairie quantitative finance open-source."}],val:["Master finance validé","Stage salle de marchés","Python/VBA modèles","CFA Level 1 inscrit"],sku:["Finance de marché","Mathématiques financières","Python","Modélisation"],co:"5000–15000€/an",cd:"Grande école ou M2 public."},
{p:"CFA Levels 1–3",d:"3–4 ans",mo:"En parallèle études/début carrière",i:"📚",obj:"Obtenir la certification CFA de référence mondiale.",tasks:["CFA Level 1 : éthique, analyse financière, économie","CFA Level 2 : valorisation actions, dérivés, alternatives","CFA Level 3 : gestion de portefeuille, wealth management","~300h de préparation par niveau","Passer les examens annuels (taux réussite ~40%)"],dh:["1h révision CFA","1 exercice valorisation","Practice exam (30 min)","Flash cards éthique"],res:[{n:"CFA Institute Materials",u:"https://cfainstitute.org",co:"~1000€/niveau",du:"~300h",lv:"Bac+3",de:"Matériaux officiels CFA."},{n:"Kaplan Schweser CFA",u:"https://schweser.com",co:"~500€",du:"~200h",lv:"Tous niveaux",de:"Supports préparation CFA reconnus."}],val:["CFA Level 1 réussi","Level 2 en cours","Ethics maîtrisée","DCF et ratios fluides"],sku:["CFA","Valorisation","Gestion portefeuille","Dérivés"],co:"~1500€/niveau",cd:"CFA + Schweser."},
{p:"Analyste junior – Sell side",d:"2–3 ans",mo:"Premier emploi",i:"💹",obj:"Produire des analyses sur des secteurs ou instruments.",tasks:["Modèles DCF, LBO, comparables","Notes d'analyse sectorielles","Présentations sales et trading","Bloomberg Terminal maîtrisé","Pitchbooks et roadshows"],dh:["Marchés suivis (matin)","1 modèle mis à jour","1 note rédigée","Retour senior"],res:[{n:"Bloomberg Terminal",u:"https://bloomberg.com",co:"~25000€/an (firme)",du:"Outil",lv:"Pro",de:"Terminal de référence marchés financiers."},{n:"Financial Times",u:"https://ft.com",co:"~30€/mois",du:"Quotidien",lv:"Pro",de:"Journal financier de référence mondiale."}],val:["DCF autonome <2h","Note sectorielle publiée","Bloomberg fluide","Roadshow participé"],sku:["DCF/LBO","Bloomberg","Notes d'analyse","Pitchbook"],co:"~30€/mois",cd:"Bloomberg fourni par la firme."},
{p:"Trader junior – Desk",d:"2–3 ans",mo:"2–4 ans expérience",i:"⚡",obj:"Gérer des positions sur un desk spécialisé.",tasks:["Spécialisation : actions, taux, FX, matières premières, dérivés","Gestion des positions et couvertures","Risk management quotidien (VaR, limites)","Relation broker et contreparties","P&L positif sur 12 mois minimum"],dh:["Pré-ouverture marchés (1h)","Positions gérées en temps réel","P&L suivi","1 macro-thèse analysée"],res:[{n:"Investopedia Finance",u:"https://investopedia.com",co:"Gratuit",du:"Référence",lv:"Tous",de:"Encyclopédie finance de référence."},{n:"BreakingIntoWallStreet",u:"https://breakingintowallstreet.com",co:"~500€",du:"~40h",lv:"Junior",de:"Formation modélisation et finance IB."}],val:["P&L positif 12 mois","Spécialisation reconnue","Limites de risque respectées","Bonus first year"],sku:["Trading propriétaire","Risk management","VaR","Spécialisation desk"],co:"~30€/mois",cd:"FT + outils firme."},
{p:"Senior Trader / Portfolio Manager",d:"3–5 ans",mo:"5–8 ans",i:"📊",obj:"Gérer des positions importantes avec autonomie complète.",tasks:["Taille de positions augmentée","Stratégie macro ou micro développée","Management d'un junior trader","Contribution au risk committee","Track record 3 ans positif"],dh:["Analyse macro quotidienne","P&L suivi live","1 junior coaché","1 research publié"],res:[{n:"Ray Dalio Principles",u:"https://principles.com",co:"~20€",du:"~15h",lv:"Senior",de:"Principes d'investissement du fondateur Bridgewater."},{n:"Hedge Fund Market Wizards",u:"https://amazon.fr",co:"~20€",du:"~15h",lv:"Trader",de:"Interviews des meilleurs traders mondiaux."}],val:["Track record 3 ans positif","Book >50M€","Junior managé","Reputation desk"],sku:["Portfolio management","Track record","Leadership desk","Macro strategy"],co:"~40€/mois",cd:"Journaux et ressources."},
{p:"Partner / Fund Manager",d:"Variable",mo:"10+ ans",i:"🏆",obj:"Gérer un fonds ou devenir associé.",tasks:["Partner dans un hedge fund ou AM","Lever des fonds (fundraising institutionnel)","Définir la stratégie d'investissement du fonds","Relations investisseurs (LP, pension funds)","Créer son fonds (si entrepreunarial)"],dh:["Investor update mensuel","Marchés analyse stratégique","Performance suivi","1 LP contacté"],res:[{n:"Institutional Investor",u:"https://institutionalinvestor.com",co:"~100€/an",du:"Mensuel",lv:"Senior",de:"Publication finance institutionnelle de référence."},{n:"AIMA",u:"https://aima.org",co:"Réseau",du:"Référence",lv:"Hedge fund",de:"Association Hedge Fund Management mondiale."}],val:["AUM >50M€","Track record 5 ans","Fonds ou partner","P&L cumulatif positif"],sku:["Fund management","Fundraising","Investor relations","Leadership fonds"],co:"Variable",cd:"Formation par firme."}
]},
maintenance:{id:"maintenance",e:"🔩",t:"Technicien maintenance industrielle",c:"#78716C",cat:"craft",dur:"24 mois",cost:"500–5000€",lv:"Accessible",sal:{j:"24–30K€",m:"32–40K€",s:"40–55K€"},tag:"Très demandé, bien payé.",sk:["Mécanique","Électricité industrielle","Automatisme","Pneumatique","GMAO"],ss:93,ms:[
{p:"Orientation & Formation",d:"1 mois",mo:"Avant formation",i:"📋",obj:"Choisir la bonne filière maintenance industrielle.",tasks:["Comprendre les différences maintenance élec/méca/automatisme","Visiter une usine ou site industriel","Comparer BTS MI, Bac Pro MEI, CQPM, titre pro AFPA","Alternance ou scolaire ?","Renseignements CPF pour adultes en reconversion"],dh:["1 vidéo industrie 4.0","1 usine visitée","1 CFA contacté","1 offre alternance regardée"],res:[{n:"AFPA Maintenance",u:"https://afpa.fr",co:"Finançable CPF",du:"12–24 mois",lv:"Aucun",de:"Formation pro maintenance industrielle."},{n:"CFA Aforp",u:"https://aforp.fr",co:"Gratuit alternance",du:"2 ans",lv:"16 ans+",de:"CFA industriel, alternance rémunérée."}],val:["Filière choisie","CFA ou AFPA trouvé","Financement identifié","Alternance ou formation inscrite"],sku:["Orientation","Connaissance industrie"],co:"0€",cd:"Démarches gratuites."},
{p:"Formation – Mécanique & Électricité",d:"8–12 mois",mo:"Mois 1–12",i:"📚",obj:"Comprendre et intervenir sur machines mécaniques et électriques.",tasks:["Mécanique : roulements, courroies, réducteurs","Électricité industrielle : schémas, moteurs, variateurs","Pneumatique et hydraulique de base","Lecture de plans techniques industriels","TD atelier sur machines réelles"],dh:["1h schémas techniques","1 composant mécanique étudié","TP atelier (quand disponible)","Quiz sécurité"],res:[{n:"Techniques de l'ingénieur",u:"https://techniques-ingenieur.fr",co:"Via entreprise",du:"Référence",lv:"Technicien",de:"Encyclopédie technique industrielle."},{n:"Normes NF EN ISO 13849",u:"https://boutique.afnor.org",co:"Via école",du:"Référence",lv:"BTS",de:"Normes sécurité machines industrielles."}],val:["Schémas électriques lus","Roulements changés","Pneumatique compris","Habilitations de base"],sku:["Mécanique","Électricité industrielle","Pneumatique","Schémas"],co:"Finançable CPF",cd:"BTS ou titre pro."},
{p:"Automatisme & GMAO",d:"6–12 mois",mo:"Mois 6–18",i:"🤖",obj:"Maîtriser l'automatisme et les outils de gestion maintenance.",tasks:["Automatisme : API Siemens/Schneider (ladder, FBD)","Supervision SCADA","GMAO (SAP PM, Mainsys, Coswin)","Planification maintenance préventive","Indicateurs MTBF, MTTR, disponibilité"],dh:["30 min API/PLC","GMAO (20 min)","1 OT créé","Indicateurs mis à jour"],res:[{n:"Siemens TIA Portal",u:"https://siemens.com/tia",co:"Gratuit étudiant",du:"~40h",lv:"BTS 2A",de:"Logiciel automate Siemens gratuit étudiant."},{n:"AFIM",u:"https://afim.asso.fr",co:"Cotisation",du:"Référence",lv:"Technicien",de:"Association Française Ingénieurs Maintenance."}],val:["API programmé basique","GMAO OT maîtrisés","MTBF calculé","Préventif planifié"],sku:["Automatisme","GMAO","SCADA","KPIs maintenance"],co:"~200€",cd:"Logiciels gratuits étudiant."},
{p:"Diplôme + 1ère Expérience",d:"1–2 ans",mo:"Post-diplôme",i:"🏭",obj:"Devenir autonome sur un site industriel.",tasks:["BTS MI, Bac Pro MEI ou titre pro obtenu","Habilitations électriques B2V, BR, BC","CACES nacelle si nécessaire","Premier poste en usine (agroalimentaire, auto, chimie)","Suivi d'astreintes et interventions curative"],dh:["Interventions curative (8h/jour)","GMAO (15 min)","1 procédure appliquée","Retour d'expérience noté"],res:[{n:"Monster Maintenance",u:"https://monster.fr",co:"Gratuit",du:"Outil",lv:"Diplômé",de:"Offres emploi technicien maintenance."},{n:"Habilitations électriques",u:"https://habilitation-electrique.fr",co:"~200€",du:"1–2 jours",lv:"BTS",de:"Formation habilitations obligatoires."}],val:["BTS ou équivalent","Habilitations B2V/BR","1er poste signé","Autonomie site atteinte"],sku:["Habilitations","Maintenance curative","Autonomie"],co:"~200€",cd:"Habilitations électriques."},
{p:"Spécialisation & Confirmé",d:"2–3 ans",mo:"2–5 ans expérience",i:"🔬",obj:"Expert d'un domaine technique spécialisé.",tasks:["Choisir spécialisation : robotique, CVC, froid industriel, IoT/maintenance 4.0","Formation continue (DU ou certification)","Maintenance prédictive et analyse vibratoire","Référent technique de l'équipe","Taux de disponibilité machines > 95%"],dh:["Intervention spécialisée","Formation continue (30 min)","Analyse vibratoire","Retour expérience documenté"],res:[{n:"CETIM",u:"https://cetim.fr",co:"~1000€ formation",du:"3 jours",lv:"Technicien confirmé",de:"Centre technique mécanique, formations."},{n:"Vibrationanalyse",u:"https://vibrationanalyse.com",co:"~500€",du:"2 jours",lv:"Confirmé",de:"Formation analyse vibratoire Niveau 1."}],val:["Spécialisation certifiée","Maintenance prédictive active","Dispo machines >95%","Référent équipe"],sku:["Spécialisation","Maintenance prédictive","Analyse vibratoire","Leadership technique"],co:"500–1500€ formations",cd:"DIF/Plan de formation employeur."},
{p:"Responsable Maintenance",d:"Variable",mo:"5–10 ans",i:"🏆",obj:"Manager l'équipe maintenance et piloter la performance.",tasks:["Encadrer une équipe de 3–10 techniciens","Budget maintenance annuel","Plan directeur maintenance préventive","Projets d'amélioration continue (TPM, 5S)","Relation fournisseurs et prestataires extérieurs"],dh:["Réunion équipe","KPIs revus","1 prestataire suivi","Budget maintenance mis à jour"],res:[{n:"TPM Lean Manufacturing",u:"https://lean-manufacturing.fr",co:"Gratuit",du:"Référence",lv:"Responsable",de:"Ressources TPM et amélioration continue."},{n:"DPAM Certification",u:"https://academie-maintenance.fr",co:"~3000€",du:"1 an",lv:"Manager",de:"Diplôme professionnel management maintenance."}],val:["Équipe managée","Budget respecté","TPM déployé","KPIs en hausse"],sku:["Management équipe","Budget","TPM","Amélioration continue"],co:"~3000€ DPAM",cd:"DPAM finançable OPCO."}
]},
supplychain:{id:"supplychain",e:"📦",t:"Responsable Logistique / Supply Chain",c:"#0891B2",cat:"business",dur:"24–36 mois",cost:"2000–10000€",lv:"Intermédiaire",sal:{j:"28–35K€",m:"38–50K€",s:"55–80K€"},tag:"E-commerce explose.",sk:["Gestion stocks","ERP/WMS","Transport","Lean","Prévision demande"],ss:82,ms:[
{p:"Formation logistique",d:"12–24 mois",mo:"Mois 1–24",i:"📚",obj:"Maîtriser les fondamentaux de la chaîne logistique.",tasks:["BTS GPME ou licence logistique ou reconversion","Gestion des stocks : ABC, FIFO, LIFO, sécurité","Transport : incoterms, douanes, multimodal","Gestion entrepôt : picking, WMS","Lean management et méthode Kanban"],dh:["1h cours logistique","1 exercice stocks","WMS simulé (20 min)","Lean (15 min)"],res:[{n:"APICS/ASCM CPIM",u:"https://ascm.org",co:"~500€ certif",du:"~100h",lv:"Intermédiaire",de:"Certification supply chain mondiale CPIM."},{n:"Supply Chain Magazine",u:"https://supplychainmagazine.fr",co:"Gratuit",du:"Quotidien",lv:"Tous",de:"Actualités supply chain FR."}],val:["BTS ou licence validé","Gestion stocks ABC","WMS de base","Lean Kanban compris"],sku:["Gestion stocks","WMS","Transport","Lean"],co:"Variable",cd:"Finançable CPF."},
{p:"ERP & Outils digitaux",d:"3–6 mois",mo:"En parallèle formation",i:"💻",obj:"Maîtriser les outils ERP et WMS professionnels.",tasks:["SAP EWM ou MM (Warehouse/Materials Management)","Oracle WMS ou Infor WMS","Traçabilité et EDI","Excel avancé pour prévisions et reporting","Power BI ou Tableau pour KPIs supply"],dh:["SAP exercice (30 min)","1 KPI supply calculé","Excel forecast (30 min)","1 rapport Power BI"],res:[{n:"SAP Learning Hub",u:"https://learning.sap.com",co:"Gratuit (accès limité)",du:"~40h",lv:"Étudiant",de:"Formations SAP gratuites certifiantes."},{n:"Coursera Supply Chain",u:"https://coursera.org",co:"~50€/mois",du:"~30h",lv:"Intermédiaire",de:"Cours supply chain MIT et Georgia Tech."}],val:["SAP navigué","Excel forecast maîtrisé","KPI dashboard créé","EDI compris"],sku:["SAP","WMS","Excel prévisions","Power BI"],co:"~50€/mois",cd:"Coursera + SAP gratuit."},
{p:"Certification & 1er Poste",d:"3–6 mois",mo:"Après formation",i:"🎓",obj:"Valider les compétences et intégrer une équipe SC.",tasks:["Certification CPIM (ASCM) ou CILT","Postuler en logistique/approvisionnement/transport","Premier poste : chargé de stocks, approvisionneur, coordinateur transport","Relation fournisseurs et transporteurs","KPIs hebdomadaires tenus"],dh:["Révision CPIM (1h)","1 candidature","1 suivi stocks","1 fournisseur contacté"],res:[{n:"CILT France",u:"https://cilt-france.org",co:"~400€/an",du:"Référence",lv:"Professionnel",de:"Chartered Institute of Logistics and Transport."},{n:"Indeed Supply Chain",u:"https://indeed.fr",co:"Gratuit",du:"Quotidien",lv:"Diplômé",de:"Offres emploi supply chain France."}],val:["CPIM ou CILT","1er poste signé","KPIs tenus","Fournisseurs gérés"],sku:["CPIM / CILT","Approvisionnement","KPIs supply chain"],co:"~400–500€ certif",cd:"CPIM + CILT."},
{p:"Coordinateur SC / Chef de projet",d:"2–3 ans",mo:"1–4 ans expérience",i:"🤝",obj:"Piloter des projets logistiques et gérer des flux complexes.",tasks:["Planification S&OP (Sales and Operations Planning)","Gestion multi-sites ou multi-fournisseurs","Réduction des coûts transport et stock","Projets Lean Six Sigma en entrepôt","Management d'une équipe de 3–8 personnes"],dh:["S&OP hebdomadaire","1 projet amélioration","Manager équipe","1 tableau de bord"],res:[{n:"APICS S&OP",u:"https://ascm.org",co:"~500€",du:"~50h",lv:"Intermédiaire",de:"Modules S&OP APICS avancés."},{n:"Lean Six Sigma Green Belt",u:"https://lss-academy.com",co:"~500€",du:"~40h",lv:"Manager",de:"Certification Green Belt Lean Six Sigma."}],val:["S&OP déployé","Coûts réduits 10%","Équipe managée","Green Belt obtenu"],sku:["S&OP","Lean Six Sigma","Management","Multi-sites"],co:"~500€ certifs",cd:"Green Belt finançable OPCO."},
{p:"Responsable Logistique",d:"2–3 ans",mo:"4–7 ans",i:"📊",obj:"Diriger un département logistique ou un entrepôt.",tasks:["Responsable d'un entrepôt ou pôle transport","Budget annuel et P&L logistique","Appels d'offres transporteurs (3PL)","Digitalisation des flux (IoT, RFID)","Reporting direction et board"],dh:["Check KPIs quotidien","1 réunion équipe","1 transporteur négocié","Budget suivi"],res:[{n:"ECR France",u:"https://ecr-france.org",co:"Réseau",du:"Référence",lv:"Responsable",de:"Efficient Consumer Response, bonnes pratiques SC."},{n:"GS1 France",u:"https://gs1fr.org",co:"Réseau",du:"Référence",lv:"Pro",de:"Standards codification supply chain."}],val:["Budget respecté","Service rate >98%","3PL renégocié","Équipe 10+"],sku:["Pilotage entrepôt","Négociation 3PL","Budget P&L","Digitalisation"],co:"0€",cd:"Formation interne."},
{p:"Directeur Supply Chain / COO",d:"Variable",mo:"8–15 ans",i:"🏆",obj:"Diriger la supply chain d'une organisation ou devenir COO.",tasks:["Directeur SC groupe (multi-pays ou multi-sites)","Définir la stratégie SC 3 ans","Digitalisation end-to-end (AI demand forecast, robotique)","Relations board et comité exécutif","Gérer crises logistiques (Covid, pénuries, disruptions)"],dh:["Revue stratégie SC","1 projet digital","Board reporting","1 décision opérationnelle majeure"],res:[{n:"Gartner Supply Chain",u:"https://gartner.com",co:"Accès entreprise",du:"Référence",lv:"Directeur",de:"Analyses Gartner supply chain top 25."},{n:"MIT SCM MicroMasters",u:"https://micromasters.mit.edu/scm",co:"~1500€",du:"~150h",lv:"Directeur",de:"MicroMasters Supply Chain MIT edX."}],val:["Direction SC groupe","Stratégie SC 3 ans","IA demand forecast","Présence top 25 Gartner"],sku:["Stratégie SC","Digitalisation","Board management","Crisis management"],co:"~1500€ MIT MicroMasters",cd:"Finançable CPF."}
]}
};

const CAREER_LIST = Object.values(C);

// ━━━ HORIZON DATA (ai=risque IA/100, gr=croissance marché/100) ━━━━━━━━━━━━
const HORIZON = {
  fullstack:      {ai:45,gr:75,th:["Copilot remplace le code basique","Low-code en progression"],                                   dr:["Demande mondiale en hausse","IA augmente la productivité","Full-stack rare"],          t:{y5:"Dev augmenté IA, focus archi",y10:"Spécialiste ML ou sécurité",y20:"Architecte systèmes intelligents"},          vd:"Métier durable si montée en compétences IA. Le dev qui maîtrise les LLMs sera 10× plus productif — et irremplaçable."},
  uxdesign:       {ai:35,gr:70,th:["Génération d'UI par IA","Templates automatisés Canva/Figma"],                                   dr:["Empathie utilisateur irremplaçable","Croissance des produits digitaux","UX stratégique"], t:{y5:"Designer + prompt engineer",y10:"Stratège UX data-driven",y20:"DA expériences humain-machine"},              vd:"L'IA génère des wireframes, pas de l'empathie. La recherche utilisateur et la vision produit restent profondément humaines."},
  dataanalyst:    {ai:55,gr:80,th:["BI automatisée par IA","SQL basique remplacé par ChatGPT"],                                    dr:["Explosion des données","Décisions data-driven partout","Forte demande RH"],             t:{y5:"Analyste augmenté par LLM",y10:"Expert data sectoriel",y20:"Chief Data Officer"},                                  vd:"L'analyse automatique monte mais l'interprétation business et la stratégie data restent humaines. Spécialisation = clé."},
  entrepreneur:   {ai:10,gr:90,th:["Concurrence accrue via outils IA","Saturation des marchés no-code"],                          dr:["IA réduit le coût de création","Marchés globaux accessibles","Financement seed disponible"],t:{y5:"Solopreneur IA-powered",y10:"Scale-up lean team",y20:"Fondateur série B+"},                               vd:"L'IA est un accélérateur massif. Jamais aussi facile de créer un produit, jamais aussi compétitif. L'exécution prime."},
  infirmier:      {ai:8, gr:85,th:["Pénurie de vocations","Burn-out et turn-over élevés"],                                        dr:["Vieillissement de la population","Besoins en hausse constante","Revalorisation Ségur"],  t:{y5:"IDE avec outils IA de diagnostic",y10:"Spécialiste augmenté",y20:"Coordinateur soins tech-assisted"},            vd:"Les soins humains sont irremplaçables. L'IA assiste mais ne remplace pas la relation patient. Débouchés excellents sur 20 ans."},
  comptable:      {ai:65,gr:40,th:["Automatisation de la saisie comptable","IA fiscale avancée (Pennylane)"],                     dr:["Expertise conseil non automatisable","Réglementation croissante","Label EC = confiance"],  t:{y5:"Comptable conseil, moins de saisie",y10:"Expert fiscal stratégique",y20:"CFO ou cabinet boutique"},             vd:"La saisie disparaît. L'expertise fiscale et l'accompagnement stratégique restent. Repositionnement vers le conseil urgent."},
  commercial:     {ai:20,gr:75,th:["Automatisation du cold emailing","CRM IA qui qualifie les leads"],                            dr:["Négociation humaine décisive","Salaire lié à la performance","Tous secteurs recrutent"],   t:{y5:"Commercial augmenté par IA",y10:"Account manager stratégique",y20:"Directeur commercial"},                        vd:"L'IA prospecte, l'humain convainc. Les commerciaux qui maîtrisent les outils IA seront 3× plus efficaces et mieux payés."},
  marketing:      {ai:50,gr:65,th:["Contenu IA généré en masse","SEO automatisé dévalue le générique"],                          dr:["Personal branding irremplaçable","Créativité humaine premium","Stratégie multi-canal"],   t:{y5:"Content manager + prompt expert",y10:"Stratège growth senior",y20:"CMO ou fondateur média"},                      vd:"Le contenu générique sera produit par l'IA. La créativité, le brand voice et la stratégie restent humains et premium."},
  architecte:     {ai:25,gr:60,th:["Rendu IA ultra-réaliste","BIM partiellement automatisé"],                                    dr:["Vision créative unique","Réglementation = humain","Transition écologique"],               t:{y5:"Architecte IA-augmenté",y10:"Spécialiste durable ou patrimonial",y20:"Urbaniste ou archi systèmes"},             vd:"L'IA accélère les rendus, pas la conception. La réglementation, la relation client et la créativité restent profondément humaines."},
  avocat:         {ai:40,gr:55,th:["LegalTech automatise les actes simples","IA de rédaction contractuelle"],                    dr:["Justice = humain par essence","Litiges en hausse","Spécialisation protège"],               t:{y5:"Avocat augmenté par IA",y10:"Expert niche juridique reconnu",y20:"Associé senior ou magistrat"},                  vd:"Les actes standards sont automatisables. Le conseil stratégique, la plaidoirie et les affaires complexes restent humains."},
  cybersecurite:  {ai:15,gr:95,th:["Attaques IA de plus en plus sophistiquées","Faux positifs SIEM en hausse"],                  dr:["Cyberattaques en explosion","Pénurie mondiale d'experts","Réglementation NIS2"],          t:{y5:"Expert red/blue team IA-augmenté",y10:"CISO ou expert sectoriel",y20:"Architecte sécurité systèmes critiques"},  vd:"Le domaine le plus résistant à l'IA — l'IA attaque autant qu'elle défend. Pénurie mondiale critique pour 20 ans."},
  productmanager: {ai:30,gr:80,th:["Roadmapping IA partiel","No-code réduit besoin de PM technique"],                            dr:["Tech croissante = PM indispensable","Salaires premium","Rôle décisionnel central"],        t:{y5:"PM augmenté par analytics IA",y10:"VP Product ou CPO",y20:"Founder ou C-suite"},                                  vd:"Le PM qui comprend l'IA sera CPO. La vision produit, l'empathie et la décision stratégique restent irremplaçables."},
  devops:         {ai:35,gr:85,th:["IaC partiellement automatisée","Cloud providers abstraient la complexité"],                   dr:["Cloud en croissance constante","SRE indispensable à l'échelle","Pénurie forte"],           t:{y5:"Platform engineer IA-augmenté",y10:"Architecte cloud senior",y20:"VP Infrastructure ou CTO"},                    vd:"L'automatisation infra accélère mais crée de nouveaux besoins. DevOps reste une compétence rare et très bien payée."},
  datascientist:  {ai:40,gr:90,th:["AutoML réduit le besoin de code ML","LLMs remplacent des pipelines custom"],                  dr:["IA en production = ML Engineers","Explosion des usages IA","Top rémunération marché"],    t:{y5:"ML Engineer + LLM specialist",y10:"AI Lead ou Research Engineer",y20:"Chief AI Officer"},                        vd:"Le data scientist notebooks est menacé. Celui qui déploie l'IA en production et comprend les LLMs est en or massif."},
  devmobile:      {ai:40,gr:70,th:["PWA réduit le besoin d'apps natives","Génération UI par IA"],                                 dr:["Smartphone = premier écran","Apps métier en croissance","Demande soutenue"],               t:{y5:"Dev mobile + React Native senior",y10:"Lead mobile ou CTO mobile",y20:"Architecte expériences mobiles"},          vd:"Le mobile reste le premier écran. Les développeurs natifs restent rares et bien payés malgré le cross-platform."},
  psychologue:    {ai:12,gr:70,th:["Apps thérapeutiques IA grand public","Télé-thérapie low-cost concurrente"],                   dr:["Crise santé mentale mondiale","Remboursement renforcé","Relation humaine irremplaçable"],   t:{y5:"Psy avec outils IA diagnostics",y10:"Spécialiste clinique reconnu",y20:"Superviseur ou chercheur"},               vd:"La relation thérapeutique est profondément humaine. La demande explose avec la crise de santé mentale mondiale."},
  kine:           {ai:5, gr:80,th:["Rééducation assistée par robot","Télé-kiné limitée en efficacité"],                          dr:["Vieillissement population","Sport et bien-être en hausse","Libéral = revenus élevés"],     t:{y5:"Kiné avec IA diagnostic mouvement",y10:"Spécialiste sport ou neuro",y20:"Entrepreneur en santé ou clinique"},   vd:"Le toucher thérapeutique est irremplaçable. Pénurie structurelle en France. Revenus libéraux parmi les meilleurs santé."},
  aidesoignant:   {ai:5, gr:85,th:["Robots d'assistance en EHPAD","Conditions de travail difficiles"],                           dr:["Vieillissement accéléré","Pénurie structurelle","Revalorisation salariale"],               t:{y5:"AS avec tablettes suivi IA",y10:"AS coordinateur de soins",y20:"Cadre de proximité ou IDE"},                     vd:"Le soin humain et la présence sont irremplaçables. Pénurie critique garantit l'emploi. Passerelle vers IDE très valorisée."},
  electricien:    {ai:3, gr:90,th:["Kits DIY smart home réducteurs","Formation accélérée en masse"],                             dr:["Pénurie historique d'artisans","Rénovation énergétique obligatoire","Revenus libéraux élevés"],t:{y5:"Artisan spécialisé smart home",y10:"Chef d'entreprise BTP",y20:"Patron PME ou franchise"},                      vd:"Impossible à délocaliser, impossible à automatiser sur chantier. Pénurie structurelle et revenus libéraux qui s'envolent."},
  boulanger:      {ai:10,gr:65,th:["Grande distribution low-cost","Coûts matières premières volatils"],                          dr:["Artisanat premium en forte hausse","Franchise accessible","Tradition française valorisée"],t:{y5:"Artisan avec présence digitale",y10:"Propriétaire de franchise",y20:"Franchise multi-sites ou marque"},           vd:"L'artisanat alimentaire de qualité résiste. La boulangerie premium et la franchise offrent un vrai potentiel de revenus."},
  coiffeur:       {ai:2, gr:55,th:["Pression prix discount","Barbiers indépendants prolifèrent"],                                dr:["Bien-être en croissance","Clientèle fidèle","Faibles coûts d'installation"],               t:{y5:"Salon spécialisé (barbier, coloriste)",y10:"Propriétaire salon premium",y20:"Franchise ou académie de coiffure"},  vd:"Service physique irremplaçable. Le marché premium et les barbiers modernes connaissent une vraie croissance durable."},
  prof:           {ai:20,gr:45,th:["IA pédagogique personnalisée","Plateformes MOOCs gratuites"],                                dr:["Fonctionnaire = stabilité totale","Revalorisation salariale","Impact sociétal fort"],       t:{y5:"Enseignant avec outils IA adaptatifs",y10:"Directeur ou formateur",y20:"Inspecteur ou cadre éducatif"},           vd:"L'IA transforme la pédagogie mais pas le rôle social de l'enseignant. Stabilité, sens et retraite garantis."},
  agentimmo:      {ai:35,gr:55,th:["Plateformes vente entre particuliers","IA d'estimation automatique"],                        dr:["Marché immobilier actif","Commissions élevées","Réseau terrain irremplaçable"],            t:{y5:"Agent digital-first hybride",y10:"Directeur agence",y20:"Promoteur ou investisseur immobilier"},                  vd:"L'IA estime, pas la confiance. La négociation et la relation client restent décisives. Les top performers gagnent très bien."},
  photographe:    {ai:55,gr:50,th:["Génération d'images IA (Midjourney)","Stock photos IA gratuites"],                          dr:["Événementiel irremplaçable","Personal branding demande","Vidéo corporate en hausse"],      t:{y5:"Créatif IA-augmenté",y10:"Directeur artistique visuel",y20:"Studio créatif ou agence"},                           vd:"La photo stock est morte face à l'IA. L'événementiel, le corporate et la direction artistique restent humains et rentables."},
  redacteur:      {ai:70,gr:40,th:["GPT génère des articles en masse","SEO automatisé dévalue le contenu","Tarifs en chute"],   dr:["Expertise sectorielle rare","Journalisme d'investigation","Personal brand unique"],       t:{y5:"Éditeur et correcteur contenu IA",y10:"Expert contenu sectoriel",y20:"Journaliste ou auteur reconnu"},            vd:"Le contenu générique est automatisé. L'expertise sectorielle, la voix unique et l'investigation restent premium et rares."},
  graphiste:      {ai:50,gr:55,th:["Midjourney/DALL-E pour visuels","Canva IA pour templates rapides"],                         dr:["Identité visuelle = stratégie","Direction artistique humaine","Branding premium en hausse"],t:{y5:"Graphiste + prompt designer",y10:"Directeur artistique",y20:"Directeur créatif d'agence"},                       vd:"Les visuels génériques sont automatisés. La direction artistique et l'identité visuelle stratégique restent humains et premium."},
  consultant:     {ai:30,gr:60,th:["IA analyse et synthèse de documents","Outils de stratégie semi-automatisés"],               dr:["Réseau et réputation non copiables","Transformation digitale forte","Conseil = confiance"],  t:{y5:"Consultant augmenté par IA",y10:"Manager senior ou Partner",y20:"Associé ou fondateur boutique"},               vd:"L'IA génère des slides, pas de la confiance. Le réseau, le jugement et la relation client sont le cœur indélogeable du métier."},
  trader:         {ai:60,gr:50,th:["Algorithmes HFT dominent le marché","IA quantitative toujours plus performante"],           dr:["Finance = innovation constante","Marchés globaux","Bonus exceptionnels possibles"],        t:{y5:"Trader quantitatif + IA",y10:"Portfolio manager spécialisé",y20:"Hedge fund manager ou directeur"},              vd:"Le trading algorithmique domine les marchés liquides. Les humains restent indispensables en gestion macro et relation client."},
  maintenance:    {ai:15,gr:75,th:["Maintenance prédictive IA","Robots d'inspection industrielle"],                             dr:["Industrie 4.0 demande des techniciens","Pénurie structurelle","Salaires en forte hausse"],  t:{y5:"Technicien GMAO IA-assisté",y10:"Responsable maintenance",y20:"Directeur technique ou DSI industriel"},          vd:"La maintenance physique est irremplaçable. L'IA prédit les pannes mais les techniciens les réparent. Pénurie garantit l'emploi."},
  supplychain:    {ai:45,gr:70,th:["Automatisation des entrepôts","IA prévision de la demande"],                                dr:["E-commerce en explosion","Supply chains critiques post-Covid","Digitalisation accélérée"],  t:{y5:"Manager supply chain digitale",y10:"Directeur logistique",y20:"VP Operations ou COO"},                            vd:"La supply chain se digitalise mais le management humain reste critique. E-commerce et crises logistiques créent une forte demande."}
};

// ━━━ LIFE TREE BRANCHES (pre-built with questionnaire) ━━━━━━━━━━━━━━━━━━━━
const LIFE_BRANCHES = {
  arret_tabac:{id:"arret_tabac",icon:"🚭",title:"Arrêter de fumer",color:"#EF4444",desc:"Se libérer du tabac.",
    connections:[{to:"sport_sante",reason:"Capacités cardio +30% en 3 mois",effect:"+Endurance"},{to:"liberte_financiere",reason:"~300€/mois économisés",effect:"+Épargne"}],
    levels:[
      {title:"Préparation",dur:"Sem 1–2",objs:["Fixer une date d'arrêt dans 14 jours","Noter 5 raisons d'arrêter","Identifier 3 déclencheurs (café, stress, ennui)","Consulter médecin/pharmacien","Prévenir l'entourage"]},
      {title:"30 premiers jours",dur:"Mois 1",objs:["Passer la journée sans fumer","Remplacer chaque envie par 5 respirations","Boire 2L d'eau/jour","Éviter les situations à risque","Mettre de côté ~10€/jour économisés"]},
      {title:"Consolidation",dur:"Mois 2–3",objs:["Maintenir sans substitut si possible","30 min d'exercice 3x/semaine","Calculer le total économisé","Récompense saine mensuelle"]},
      {title:"Liberté",dur:"Mois 3–6",objs:["3 mois sans cigarette","Courir 20 min sans s'arrêter","Investir les 900€+ économisés","Aider quelqu'un d'autre à arrêter"]}
    ]},
  sport_sante:{id:"sport_sante",icon:"🏋️",title:"Sport & Santé",color:T.gr,desc:"Routine sportive durable.",
    connections:[{to:"arret_tabac",reason:"Sport réduit envies nicotine -50%",effect:"-Envies"},{to:"parentalite",reason:"Parent en forme = plus patient et énergique",effect:"+Énergie famille"}],
    levels:[
      {title:"Mise en mouvement",dur:"Sem 1–4",objs:["Marcher 30 min/jour","2 séances sport/semaine","Dormir 7h30 min/nuit","Boire 2L d'eau/jour","Supprimer 1 aliment ultra-transformé"]},
      {title:"Régularité",dur:"Mois 2–3",objs:["3 séances sport/semaine (45 min)","Check-up médical complet","Meal prep 3 jours/semaine","Journal de sommeil 2 semaines"]},
      {title:"Performance",dur:"Mois 3–6",objs:["4 séances/sem dont 1 haute intensité","Courir 5 km sans s'arrêter","Manger équilibré 5j/7","Poids stable depuis 1 mois"]},
      {title:"Mode de vie",dur:"Mois 6+",objs:["Sport = habitude naturelle","Check-up amélioré vs le 1er","Participer à un événement sportif","Inspirer 1 personne à faire du sport"]}
    ]},
  spiritualite:{id:"spiritualite",icon:"🙏",title:"Spiritualité",color:"#10B981",desc:"Développer sa vie intérieure.",
    question:"Quelle est ta tradition spirituelle ?",
    variants:{
      islam:{title:"Devenir un meilleur croyant (Islam)",icon:"🕌",
        connections:[{to:"sport_sante",reason:"Le jeûne améliore la discipline et la santé",effect:"+Discipline"},{to:"liberte_financiere",reason:"La Zakat développe la conscience financière",effect:"+Conscience financière"}],
        levels:[
          {title:"Les Fondations",dur:"Sem 1–4",objs:["Fajr 5 jours sur 7","5 prières 3 jours/semaine","Apprendre la signification d'Al-Fatiha","Lire 10 min du Coran chaque soir"]},
          {title:"La Régularité",dur:"Mois 2–3",objs:["5 prières quotidiennes tous les jours","1 hadith par semaine","Jumu'ah à la mosquée","Lire une biographie du Prophète ﷺ"]},
          {title:"L'Approfondissement",dur:"Mois 3–6",objs:["Mémoriser 3 sourates courtes","Jeûne volontaire lundis/jeudis","Calculer et donner la Zakat","Rejoindre une halqa"]},
          {title:"L'Élévation",dur:"Mois 6–12",objs:["Qiyam al-Layl 1x/semaine","Planifier et épargner pour une Omra","Mémoriser un Juz'","Transmettre 1 valeur/semaine"]}
        ]},
      christianisme:{title:"Approfondir ma foi (Christianisme)",icon:"⛪",
        connections:[{to:"parentalite",reason:"La transmission de la foi aux enfants",effect:"+Transmission"},{to:"sport_sante",reason:"Le corps est un temple",effect:"+Soin du corps"}],
        levels:[
          {title:"Les Fondations",dur:"Sem 1–4",objs:["Lire la Bible 10 min/jour","Prier chaque matin","Assister au culte/messe chaque dimanche","Tenir un journal de prière"]},
          {title:"La Régularité",dur:"Mois 2–3",objs:["Étude biblique hebdomadaire (groupe ou seul)","Mémoriser 1 verset par semaine","Servir dans sa communauté","Lire un livre de formation chrétienne"]},
          {title:"L'Approfondissement",dur:"Mois 3–6",objs:["Jeûner 1 jour par mois (avec prière)","Évangéliser : partager sa foi avec 1 personne","Donner la dîme régulièrement","Participer à une retraite spirituelle"]},
          {title:"Le Rayonnement",dur:"Mois 6–12",objs:["Mentorer un nouveau croyant","Mener un groupe d'étude biblique","Mission ou voyage humanitaire","Vivre les fruits de l'Esprit au quotidien"]}
        ]},
      bouddhisme:{title:"Pratiquer le Bouddhisme",icon:"☸️",
        connections:[{to:"sport_sante",reason:"Méditation et pleine conscience améliorent la santé",effect:"+Sérénité"}],
        levels:[
          {title:"La Voie du Débutant",dur:"Sem 1–4",objs:["Méditer 10 min/jour (Vipassana ou Zazen)","Lire une introduction au Bouddhisme","Pratiquer la pleine conscience lors des repas","Observer les 5 préceptes pendant 1 semaine"]},
          {title:"La Pratique",dur:"Mois 2–3",objs:["Méditer 20 min/jour","Visiter un temple ou centre bouddhiste","Pratiquer le non-attachement sur 1 habitude","Lire un texte fondateur (Dhammapada)"]},
          {title:"L'Approfondissement",dur:"Mois 3–6",objs:["Retraite de méditation (1 jour ou week-end)","Étudier les 4 Nobles Vérités en profondeur","Pratiquer la compassion active quotidiennement","Réduire les distractions numériques"]},
          {title:"L'Éveil",dur:"Mois 6+",objs:["Méditer 30+ min/jour","Enseigner la méditation à 1 personne","Vivre selon le Noble Sentier Octuple","Retraite longue (Vipassana 10 jours)"]}
        ]},
      libre:{title:"Spiritualité libre",icon:"✨",
        connections:[{to:"sport_sante",reason:"Corps et esprit sont liés",effect:"+Harmonie"}],
        levels:[
          {title:"Explorer",dur:"Sem 1–4",objs:["Méditer 10 min/jour","Tenir un journal introspectif","Lire 1 livre de développement spirituel","Passer 30 min dans la nature chaque semaine"]},
          {title:"Pratiquer",dur:"Mois 2–3",objs:["Routine matinale spirituelle (méditation + intention)","Pratiquer la gratitude quotidienne","Explorer 1 tradition (yoga, tai chi, chamanisme)","Réduire le temps d'écran de 1h/jour"]},
          {title:"Approfondir",dur:"Mois 3–6",objs:["Retraite de silence (1 jour)","Définir ses valeurs fondamentales","Aligner ses actions sur ses valeurs","Créer un rituel personnel significatif"]},
          {title:"Vivre",dur:"Mois 6+",objs:["Vivre en cohérence avec ses valeurs","Inspirer les autres par l'exemple","Contribuer à une cause qui te dépasse","Trouver la paix intérieure durable"]}
        ]}
    }},
  liberte_financiere:{id:"liberte_financiere",icon:"💰",title:"Liberté financière",color:T.yl,desc:"Patrimoine et indépendance.",
    connections:[{to:"arret_tabac",reason:"Économies réinvesties",effect:"+Capital"}],
    levels:[
      {title:"Le diagnostic",dur:"Sem 1–2",objs:["Lister revenus et dépenses du mois","Calculer ton taux d'épargne","Identifier 3 dépenses inutiles","Ouvrir un compte épargne séparé"]},
      {title:"L'épargne automatique",dur:"Mois 1–3",objs:["Virement auto 10% des revenus","Fonds d'urgence 3 mois de dépenses","Lire 1 livre finances (Père Riche Père Pauvre)","Tracker dépenses chaque semaine"]},
      {title:"L'investissement",dur:"Mois 3–12",objs:["Ouvrir PEA ou CTO","Investir chaque mois (DCA)","Comprendre les ETF","Calculer objectif patrimoine/année","Lire L'Investisseur Intelligent"]},
      {title:"La croissance",dur:"Année 2+",objs:["Patrimoine > 1 an de revenus","Revenus passifs > 10% du total","Diversifier (immobilier, SCPI, crypto, business)","Aider 1 personne à investir"]}
    ]},
  parentalite:{id:"parentalite",icon:"👨‍👧‍👦",title:"Être un meilleur parent",color:T.pk,desc:"Présence, connexion, transmission.",
    connections:[{to:"sport_sante",reason:"Parent en forme = plus de patience",effect:"+Patience"},{to:"spiritualite",reason:"Transmettre des valeurs",effect:"+Transmission"}],
    levels:[
      {title:"Être présent",dur:"Sem 1–4",objs:["1h temps de qualité sans écran/jour avec les enfants","Rituel du soir (histoire, discussion, câlin)","Demander comment s'est passée la journée (écouter vraiment)","Identifier le langage d'amour de chaque enfant"]},
      {title:"Se connecter",dur:"Mois 2–3",objs:["1 activité choisie par l'enfant/week-end","Écrire une lettre à chaque enfant ce trimestre","Lire 1 livre parentalité positive","Remplacer punitions par conséquences naturelles"]},
      {title:"Transmettre",dur:"Mois 3–6",objs:["Apprendre 1 compétence de vie/mois (cuisine, budget)","1 week-end tête-à-tête par enfant/semestre","Tradition familiale mensuelle","Réduire temps d'écran famille de 30 min/jour"]},
      {title:"L'héritage",dur:"Continu",objs:["Enfants te parlent spontanément de leurs problèmes","Gérer les conflits sans crier (depuis 1 mois)","Chaque enfant nomme 3 valeurs transmises","Voyage/projet familial réalisé"]}
    ]},
  ecologie:{id:"ecologie",icon:"🌍",title:"Impact écologique",color:"#059669",desc:"Réduire son empreinte.",
    connections:[{to:"sport_sante",reason:"Vélo et marche = sport + écologie",effect:"+Mobilité douce"},{to:"liberte_financiere",reason:"Moins consommer = plus économiser",effect:"+Économies"}],
    levels:[
      {title:"Mesurer",dur:"Sem 1–2",objs:["Calculer son bilan carbone (nosgestesclimat.fr)","Identifier les 3 plus gros postes d'émission","Audit déchets maison 1 semaine","Lister les alternatives possibles"]},
      {title:"Réduire",dur:"Mois 1–3",objs:["Réduire viande à 3 repas/semaine","Transport en commun ou vélo 3j/semaine","Supprimer 3 objets plastique usage unique","Acheter en vrac 1x/semaine"]},
      {title:"Transformer",dur:"Mois 3–6",objs:["Garde-robe seconde main/éthique","Compostage des déchets organiques","Énergie verte pour son logement","1 action bénévolat écologique/trimestre"]},
      {title:"Inspirer",dur:"Mois 6+",objs:["-20% empreinte carbone en 12 mois","Influencer 3 personnes de ton entourage","Rejoindre une association environnementale","Devenir référent écologie (travail ou quartier)"]}
    ]},
  creativite:{id:"creativite",icon:"🎨",title:"Créativité & Expression",color:"#8B5CF6",desc:"Écrire, dessiner, créer.",
    question:"Quel domaine créatif t'attire ?",
    variants:{
      ecriture:{title:"Écrire un roman / livre",icon:"📝",levels:[
        {title:"L'habitude",dur:"Sem 1–4",objs:["Écrire 300 mots chaque matin","Lire 1 roman dans ton genre/mois","Définir le concept de ton livre","Planifier la structure (chapitres)"]},
        {title:"Le premier jet",dur:"Mois 2–4",objs:["Écrire 1 chapitre par semaine","Atelier d'écriture mensuel","Ne pas relire avant la fin du 1er jet","50 000 mots écrits"]},
        {title:"La révision",dur:"Mois 4–6",objs:["Relire et réécrire entièrement","3 lecteurs bêta","Intégrer les feedbacks","Version finale prête"]},
        {title:"Partager",dur:"Mois 6+",objs:["Envoyer à 5 éditeurs ou auto-publier","Couverture et mise en page","Lancement et promotion","Commencer le projet suivant"]}
      ]},
      musique:{title:"Apprendre la musique",icon:"🎵",levels:[
        {title:"Découvrir",dur:"Sem 1–4",objs:["Choisir un instrument","Pratiquer 20 min/jour","Apprendre les bases (gammes, accords)","1 morceau simple appris"]},
        {title:"Pratiquer",dur:"Mois 2–3",objs:["30 min de pratique/jour","Apprendre à lire la musique","3 morceaux maîtrisés","Jouer devant 1 personne"]},
        {title:"Progresser",dur:"Mois 3–6",objs:["Rejoindre un cours ou groupe","5 morceaux de difficulté croissante","Composer 1 morceau original","Jouer en public (open mic, fête)"]},
        {title:"Créer",dur:"Mois 6+",objs:["Enregistrer 1 morceau","Partager sur les réseaux","Collaborer avec d'autres musiciens","Se produire régulièrement"]}
      ]},
      dessin:{title:"Apprendre le dessin",icon:"🖌",levels:[
        {title:"Les bases",dur:"Sem 1–4",objs:["Dessiner 20 min/jour","Exercices de contour et proportion","Ombres et lumière","10 croquis complétés"]},
        {title:"La technique",dur:"Mois 2–3",objs:["Perspective et profondeur","Anatomie de base","Couleur et composition","1 dessin abouti par semaine"]},
        {title:"Le style",dur:"Mois 3–6",objs:["Développer son style personnel","Portfolio de 20 dessins","Partager sur Instagram/Behance","Tenter le digital (Procreate/tablette)"]},
        {title:"L'artiste",dur:"Mois 6+",objs:["Vendre ou exposer 1 œuvre","Commande pour quelqu'un","Cours ou atelier donné","Pratique quotidienne naturelle"]}
      ]}
    }}
};

// ━━━ CONTEXT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ━━━ BADGES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const BADGES = [
  {id:"first",    icon:"✓",  name:"Premier pas",   desc:"1ère action accomplie",              check:({completedMs,todayChecks}) => Object.values(completedMs).filter(Boolean).length>=1||todayChecks>=1},
  {id:"cap",      icon:"🏁", name:"Cap franchi",   desc:"1er jalon terminé",                  check:({completedMs}) => Object.values(completedMs).filter(Boolean).length>=1},
  {id:"lancee",   icon:"🔥", name:"Sur la lancée", desc:"3 jalons terminés",                  check:({completedMs}) => Object.values(completedMs).filter(Boolean).length>=3},
  {id:"momentum", icon:"⭐", name:"Momentum",      desc:"5 jalons terminés",                  check:({completedMs}) => Object.values(completedMs).filter(Boolean).length>=5},
  {id:"copilot",  icon:"✦",  name:"Co-piloté",     desc:"Partenaire IA activé",               check:() => true},
  {id:"profil",   icon:"◉",  name:"Profil complet",desc:"Prénom + parcours + branche",        check:({userName,selCareer,treeBranches}) => !!userName&&!!selCareer&&treeBranches.length>0},
  {id:"explorer", icon:"🗺️", name:"Explorateur",   desc:"3 parcours consultés",               check:({favorites,getProgress}) => CAREER_LIST.filter(c=>favorites.includes(c.id)||getProgress(c.id)>0).length>=3},
  {id:"cameleon", icon:"🌐", name:"Caméléon",      desc:"2 parcours commencés",               check:({getProgress}) => CAREER_LIST.filter(c=>getProgress(c.id)>0).length>=2},
];

const useCtx = () => useContext(Ctx);

// ━━━ CELEBRATION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CONF_COLORS = [T.ac,T.gr,T.bl,T.pu,T.or,T.yl,"#FF4D9D"];
const triggerCelebration = (x, y) => {
  const wrap = document.createElement("div");
  wrap.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;overflow:hidden";
  document.body.appendChild(wrap);
  for(let i=0;i<16;i++){
    const el  = document.createElement("div");
    const col = CONF_COLORS[i%CONF_COLORS.length];
    const ang = (i/16)*Math.PI*2+(Math.random()-.5)*.9;
    const dst = 60+Math.random()*90;
    const sz  = 5+Math.random()*7;
    el.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;background:${col};border-radius:${Math.random()>.5?"50%":"3px"};pointer-events:none`;
    el.animate(
      [{transform:"translate(-50%,-50%) translate(0,0) rotate(0deg)",opacity:1},
       {transform:`translate(-50%,-50%) translate(${Math.cos(ang)*dst}px,${Math.sin(ang)*dst-60}px) rotate(${(Math.random()-.5)*720}deg)`,opacity:0}],
      {duration:520+Math.random()*260,easing:"cubic-bezier(.2,.8,.4,1)",fill:"forwards"}
    );
    wrap.appendChild(el);
  }
  setTimeout(()=>wrap.remove(),900);
};

// ━━━ PERSISTENCE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const LS_KEY = "lifepath_v1";
const loadLS = () => { try { return JSON.parse(localStorage.getItem(LS_KEY)) || {}; } catch { return {}; } };
const saveLS = (s) => { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch {} };

// ━━━ APP ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
export default function LifePath() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 350); return () => clearTimeout(t); }, []);

  const [page, setPage] = useState("home");
  const [selCareer, setSelCareer] = useState(null);
  const [selMilestone, setSelMilestone] = useState(null);
  const [completedMs, setCompletedMs] = useState(() => loadLS().completedMs || {});
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("all");
  const [favorites, setFavorites] = useState(() => loadLS().favorites || []);
  // Life tree
  const [treeBranches, setTreeBranches] = useState(() => loadLS().treeBranches || []);
  const [selBranch, setSelBranch] = useState(null);
  const [treeObjCompleted, setTreeObjCompleted] = useState(() => loadLS().treeObjCompleted || {});
  const [notification, setNotification] = useState(null);
  const [streak,      setStreak]      = useState(() => loadLS().streak || 1);
  const [todayDate,   setTodayDate]   = useState(() => loadLS().todayDate || new Date().toISOString().slice(0,10));
  const [todayChecks, setTodayChecks] = useState(() => { const s=loadLS(),t=new Date().toISOString().slice(0,10); return s.todayDate===t?(s.todayChecks||0):0; });
  // User profile & onboarding
  const [userName,       setUserName]       = useState(() => loadLS().userName || "");
  const [onboardingDone, setOnboardingDone] = useState(() => !!loadLS().onboardingDone);
  const [activeDays,     setActiveDays]     = useState(() => loadLS().activeDays || 1);
  const [pillars,        setPillars]        = useState(() => loadLS().pillars || null);
  // Compare
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);

  const nav = (p, c, m) => { if(c!==undefined) setSelCareer(c); if(m!==undefined) setSelMilestone(m); setPage(p); };
  const notify = (msg) => { setNotification(msg); setTimeout(()=>setNotification(null), 3500); };
  const toggleMs = (cId, mId) => setCompletedMs(p => ({...p,[`${cId}-${mId}`]:!p[`${cId}-${mId}`]}));
  const isMsDone = (cId, mId) => !!completedMs[`${cId}-${mId}`];
  const getProgress = (cId) => { const c=C[cId]; if(!c) return 0; const d=c.ms.filter((_,i)=>isMsDone(cId,i)).length; return Math.round(d/c.ms.length*100); };
  const toggleFav  = (id) => setFavorites(p => p.includes(id) ? p.filter(x=>x!==id) : [...p, id]);
  const bumpToday  = () => {
    const today = new Date().toISOString().slice(0,10);
    if(todayDate!==today){ setTodayDate(today); setTodayChecks(1); }
    else setTodayChecks(c=>c+1);
  };

  useEffect(() => {
    saveLS({ completedMs, favorites, treeBranches, treeObjCompleted, streak, todayDate, todayChecks, userName, onboardingDone, activeDays, pillars, lastVisit: new Date().toISOString().slice(0,10) });
  }, [completedMs, favorites, treeBranches, treeObjCompleted, streak, todayDate, todayChecks, userName, onboardingDone, activeDays, pillars]);

  useEffect(() => {
    // ── Streak update on visit
    const saved = loadLS();
    const today = new Date().toISOString().slice(0,10);
    const yest  = new Date(Date.now()-864e5).toISOString().slice(0,10);
    if(saved.lastVisit && saved.lastVisit!==today) {
      setStreak(saved.lastVisit===yest ? (saved.streak||1)+1 : 1);
      setActiveDays((saved.activeDays||1)+1);
    }
    if(saved.todayDate && saved.todayDate!==today){ setTodayDate(today); setTodayChecks(0); }
    // ── Browser notifications
    if(!("Notification" in window)) return;
    (async()=>{
      let perm = Notification.permission;
      if(perm==="default") perm = await Notification.requestPermission();
      if(perm!=="granted") return;
      const today2 = new Date().toISOString().slice(0,10);
      const lastN  = localStorage.getItem("lifepath_notif_date");
      const now    = new Date();
      const next9  = new Date(now); next9.setHours(9,0,0,0);
      if(now>=next9 && lastN!==today2){
        // Past 9am, not yet notified today → show now
        new Notification("LifePath 🌱",{body:`🔥 ${loadLS().streak||1} jour(s) de streak ! Vos tâches du jour vous attendent.`,icon:"/favicon.ico"});
        localStorage.setItem("lifepath_notif_date",today2);
        next9.setDate(next9.getDate()+1);
      } else if(lastN===today2){
        // Already notified today → schedule tomorrow
        next9.setDate(next9.getDate()+1);
      }
      // Schedule next fire (today if <9am, tomorrow otherwise)
      const delay = next9-new Date();
      if(delay>0) setTimeout(()=>{
        const s=loadLS(),t=new Date().toISOString().slice(0,10);
        new Notification("LifePath 🌱",{body:`🔥 ${s.streak||1} jour(s) de streak ! Bonne journée productive.`,icon:"/favicon.ico"});
        localStorage.setItem("lifepath_notif_date",t);
      }, delay);
    })();
  }, []);

  // Tree helpers
  const toggleTreeObj = (branchId, objText) => {
    const key = `${branchId}::${objText}`;
    setTreeObjCompleted(p => ({...p, [key]: !p[key]}));
    // Check connections
    const branch = treeBranches.find(b=>b.id===branchId);
    if(branch && !treeObjCompleted[key]) {
      (branch.connections||[]).forEach(conn => {
        const linked = treeBranches.find(b=>b.id===conn.to);
        if(linked) setTimeout(()=>notify(`🔗 ${branch.title} → ${linked.title} : ${conn.effect}`), 800);
      });
    }
  };
  const isTreeObjDone = (branchId, objText) => !!treeObjCompleted[`${branchId}::${objText}`];
  const treeBranchProg = (branch) => {
    let t=0,d=0;
    (branch.levels||[]).forEach(l=>(l.objs||[]).forEach(o=>{t++;if(isTreeObjDone(branch.id,o))d++;}));
    return t>0?Math.round(d/t*100):0;
  };
  const treeLevelProg = (branch, levelIdx) => {
    const l = branch.levels[levelIdx];
    if(!l) return 0;
    const d = (l.objs||[]).filter(o=>isTreeObjDone(branch.id,o)).length;
    return (l.objs||[]).length > 0 ? d/(l.objs||[]).length : 0;
  };
  const isTreeLevelUnlocked = (branch, levelIdx) => {
    if(levelIdx===0) return true;
    return treeLevelProg(branch, levelIdx-1) >= 0.75;
  };
  const addTreeBranch = (branch) => {
    if(treeBranches.find(b=>b.id===branch.id)) { notify("Déjà dans ton arbre !"); return; }
    setTreeBranches(p=>[...p, branch]);
    notify(`🌱 "${branch.title}" ajoutée !`);
  };

  const ctx = {page,nav,selCareer,selMilestone,completedMs,toggleMs,isMsDone,getProgress,search,setSearch,cat,setCat,favorites,toggleFav,treeBranches,setTreeBranches,selBranch,setSelBranch,treeObjCompleted,toggleTreeObj,isTreeObjDone,treeBranchProg,treeLevelProg,isTreeLevelUnlocked,addTreeBranch,notification,notify,streak,todayChecks,bumpToday,userName,setUserName,onboardingDone,setOnboardingDone,activeDays,pillars,setPillars,compareA,setCompareA,compareB,setCompareB};

  return (
    <Ctx.Provider value={ctx}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}body{background:${T.bg};color:${T.tx};font-family:${T.fb};overflow-x:hidden}
        ::-webkit-scrollbar{width:3px}::-webkit-scrollbar-thumb{background:${T.sb};border-radius:99px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateY(-20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fireFlicker{0%,100%{transform:scale(1) rotate(-3deg)}25%{transform:scale(1.18) rotate(3deg)}50%{transform:scale(.93) rotate(-2deg)}75%{transform:scale(1.08) rotate(2deg)}}
        @keyframes scorePopIn{0%{transform:scale(.4);opacity:0}75%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}
        .fu{animation:fadeUp .38s ease both}
        .fire{animation:fireFlicker .75s ease-in-out infinite;display:inline-block;transform-origin:center bottom}
        .pop{animation:scorePopIn .38s cubic-bezier(.34,1.56,.64,1) both}
        .btn{cursor:pointer;border:none;font-family:${T.fb};transition:all .15s ease}.btn:active{transform:scale(.97)}
        .card{transition:all .2s ease}.card:hover{transform:translateY(-1px)}
        .tag{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:99px;font-size:10px;font-weight:600;white-space:nowrap}
        input:focus,textarea:focus,select:focus{outline:none;border-color:${T.ac}!important}
      `}</style>
      {loading&&<div style={{position:"fixed",inset:0,background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",zIndex:99999}}>
        <div style={{width:40,height:40,borderRadius:"50%",border:`3px solid ${T.sb}`,borderTopColor:T.ac,animation:"spin .8s linear infinite"}}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>}
      <div style={{minHeight:"100vh",background:T.bg}}>
        {notification&&<div style={{position:"fixed",top:12,left:"50%",transform:"translateX(-50%)",zIndex:9999,background:T.sf,border:`1px solid ${T.ac}33`,borderRadius:12,padding:"10px 18px",fontSize:12,color:T.tx,fontWeight:600,boxShadow:"0 8px 32px rgba(0,0,0,.5)",animation:"slideIn .3s ease",maxWidth:340,textAlign:"center"}}>{notification}</div>}
        {!onboardingDone ? <OnboardingFlow/> : (<>
          {page!=="home"&&<header style={{position:"fixed",inset:"0 0 auto",zIndex:100,height:50,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 12px",background:"rgba(7,7,9,.9)",backdropFilter:"blur(20px)",borderBottom:`1px solid ${T.bd}`}}>
            <button className="btn" onClick={()=>nav("home")} style={{background:"none",display:"flex",alignItems:"center",gap:5,padding:0,color:T.tx}}>
              <div style={{width:20,height:20,borderRadius:5,background:T.ac,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,color:"#080808"}}>L</div>
              <span style={{fontFamily:T.fd,fontWeight:800,fontSize:14}}>LifePath</span>
            </button>
            <div style={{display:"flex",alignItems:"center",gap:7}}>
              <div style={{display:"flex",alignItems:"center",gap:2}}>
                <span className={streak>1?"fire":""} style={{fontSize:15,lineHeight:1}}>🔥</span>
                <span style={{fontSize:12,fontWeight:800,color:streak>=7?T.ac:streak>=3?T.or:T.mt}}>{streak}</span>
              </div>
              {(()=>{const sc=Math.min(100,Math.round(todayChecks/5*100));const col=sc>=80?T.gr:sc>=40?T.yl:T.mt;return(
                <div key={todayChecks} className="pop" style={{width:30,height:30,borderRadius:"50%",background:T.sfh,border:`2px solid ${col}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <span style={{fontSize:7,fontWeight:900,color:col,letterSpacing:"-.3px"}}>{sc}%</span>
                </div>
              );})()}
            </div>
            <nav style={{display:"flex",gap:2,alignItems:"center"}}>
              {[{id:"explore",l:"Parcours"},{id:"dashboard",l:"Stats"},{id:"tree",l:"Arbre"},{id:"daily",l:"Journée"}].map(({id,l})=>(
                <button key={id} className="btn" onClick={()=>nav(id)} style={{padding:"4px 7px",borderRadius:99,fontSize:10,fontWeight:600,background:page===id?T.ac:"transparent",color:page===id?"#080808":T.mt}}>{l}</button>
              ))}
              <button className="btn" onClick={()=>nav("settings")} style={{padding:"4px 6px",borderRadius:99,fontSize:13,background:page==="settings"?T.ac:"transparent",color:page==="settings"?"#080808":T.mt}}>⚙️</button>
            </nav>
          </header>}
          <div key={page+selCareer+selMilestone+(selBranch?.id||"")} className="fu">
            {page==="home"&&<HomePage/>}
            {page==="explore"&&<ExplorePage/>}
            {page==="career"&&<CareerPage/>}
            {page==="milestone"&&<MilestonePage/>}
            {page==="tree"&&<TreePage/>}
            {page==="treebranch"&&<TreeBranchPage/>}
            {page==="treecatalog"&&<TreeCatalogPage/>}
            {page==="daily"&&<DailyPage/>}
            {page==="dashboard"&&<DashboardPage/>}
            {page==="compare"&&<ComparePage/>}
            {page==="treevisual"&&<TreeVisual/>}
            {page==="settings"&&<SettingsPage/>}
          </div>
        </>)}
      </div>
    </Ctx.Provider>
  );
}

// ━━━ ONBOARDING ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ONBOARD_CAREER_IDS = ["fullstack","uxdesign","entrepreneur","dataanalyst","cybersecurite","infirmier","commercial","devops","datascientist","kine"];
const PILLARS_DEF = [
  {id:"corps",   emoji:"🏃", label:"Corps",     ph:"ex: 3 séances de sport / semaine"},
  {id:"mental",  emoji:"🧠", label:"Mental",    ph:"ex: Méditer 10 min / jour"},
  {id:"social",  emoji:"🤝", label:"Social",    ph:"ex: 1 sortie entre amis / semaine"},
  {id:"finance", emoji:"💰", label:"Finance",   ph:"ex: Économiser 100€ / mois"},
  {id:"perso",   emoji:"✨", label:"Personnel", ph:"ex: Lire 20 min / soir"},
];

const OnboardingFlow = () => {
  const {setUserName,setOnboardingDone,treeBranches,setTreeBranches,nav,setPillars} = useCtx();
  const [step, setStep]           = useState(1);
  const [name, setNameVal]        = useState("");
  const [selCId, setSelCId]       = useState(null);
  const [selB, setSelB]           = useState(null);
  const [selP, setSelP]           = useState({});
  const [pillarGoals, setPillarGoals] = useState({});

  const careers = ONBOARD_CAREER_IDS.map(id=>C[id]).filter(Boolean);
  const branches = [
    {id:"sport_sante",     icon:"🏋️", title:"Sport & Santé",       color:T.gr,       levels:LIFE_BRANCHES.sport_sante.levels,             connections:LIFE_BRANCHES.sport_sante.connections||[]},
    {id:"liberte_fin",     icon:"💰", title:"Liberté financière",   color:T.yl,       levels:LIFE_BRANCHES.liberte_financiere.levels,      connections:LIFE_BRANCHES.liberte_financiere.connections||[]},
    {id:"creativite_ecr",  icon:"📝", title:"Écrire un roman",      color:"#8B5CF6",  levels:LIFE_BRANCHES.creativite.variants.ecriture.levels, connections:[]},
    {id:"parentalite",     icon:"👨‍👧‍👦", title:"Meilleur parent",    color:T.pk,       levels:LIFE_BRANCHES.parentalite.levels,             connections:LIFE_BRANCHES.parentalite.connections||[]},
    {id:"ecologie",        icon:"🌍", title:"Impact écologique",    color:"#059669",  levels:LIFE_BRANCHES.ecologie.levels,                connections:LIFE_BRANCHES.ecologie.connections||[]},
    {id:"arret_tabac",     icon:"🚭", title:"Arrêter de fumer",     color:"#EF4444",  levels:LIFE_BRANCHES.arret_tabac.levels,             connections:LIFE_BRANCHES.arret_tabac.connections||[]},
  ];

  const complete = (skipBranch=false) => {
    const n = name.trim() || "toi";
    setUserName(n);
    const activePillars = PILLARS_DEF.filter(p=>selP[p.id]);
    if(activePillars.length > 0) {
      const pd = {};
      activePillars.forEach(p => { pd[p.id] = {enabled:true, goal:pillarGoals[p.id]||"", emoji:p.emoji, label:p.label}; });
      setPillars(pd);
    }
    setOnboardingDone(true);
    if(!skipBranch && selB && !treeBranches.find(b=>b.id===selB.id))
      setTreeBranches(prev=>[...prev, selB]);
    if(selCId) nav("career", selCId); else nav("home");
  };

  const Dots = () => (
    <div style={{display:"flex",gap:5,alignItems:"center"}}>
      {[1,2,3,4].map(i=><div key={i} style={{width:i===step?20:6,height:6,borderRadius:99,background:i===step?T.ac:i<step?T.ac+"60":T.sb,transition:"all .3s"}}/>)}
    </div>
  );

  const baseStyle = {minHeight:"100vh",background:T.bg,padding:"28px 22px 80px",maxWidth:540,margin:"0 auto",boxSizing:"border-box"};

  if(step===1) return (
    <div style={baseStyle}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:52}}>
        <div style={{width:28,height:28,borderRadius:7,background:T.ac,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#080808"}}>L</div>
        <span style={{fontFamily:T.fd,fontWeight:800,fontSize:18}}>LifePath</span>
      </div>
      <Dots/>
      <h1 style={{fontFamily:T.fd,fontSize:32,fontWeight:800,letterSpacing:"-1.5px",lineHeight:1.05,margin:"28px 0 10px"}}>Bienvenue sur<br/>LifePath 🌱</h1>
      <p style={{color:T.mt,fontSize:14,lineHeight:1.7,marginBottom:36}}>Ton GPS pour construire la carrière et la vie que tu veux vraiment vivre.</p>
      <label style={{fontSize:10,color:T.mt,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:8,display:"block"}}>Ton prénom</label>
      <input autoFocus value={name} onChange={e=>setNameVal(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&name.trim()&&setStep(2)}
        placeholder="Entre ton prénom..."
        style={{width:"100%",background:T.sf,border:`1px solid ${name.trim()?T.ac:T.bd}`,borderRadius:12,padding:"14px 16px",fontSize:15,color:T.tx,fontFamily:T.fb,marginBottom:20,transition:"border-color .2s"}}/>
      <button className="btn" onClick={()=>name.trim()&&setStep(2)} disabled={!name.trim()}
        style={{background:name.trim()?T.ac:"rgba(255,255,255,.05)",color:name.trim()?"#080808":T.mt,borderRadius:14,padding:"15px",fontSize:15,fontWeight:700,width:"100%",boxShadow:name.trim()?`0 4px 24px ${T.acg}`:"none",transition:"all .2s"}}>
        Continuer →
      </button>
    </div>
  );

  if(step===2) return (
    <div style={{...baseStyle,paddingTop:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
        <button className="btn" onClick={()=>setStep(1)} style={{background:"none",color:T.mt,fontSize:12,fontWeight:600,padding:0}}>← Retour</button>
        <Dots/>
      </div>
      <h1 style={{fontFamily:T.fd,fontSize:24,fontWeight:800,letterSpacing:"-1px",marginBottom:4}}>Parfait, {name} ! 👋</h1>
      <p style={{color:T.mt,fontSize:13,marginBottom:18}}>Quel parcours professionnel t'attire le plus ?</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
        {careers.map(c=>{
          const sel=selCId===c.id;
          return (
            <div key={c.id} onClick={()=>setSelCId(sel?null:c.id)} className="card"
              style={{background:sel?c.c+"18":T.sf,border:`2px solid ${sel?c.c:T.bd}`,borderRadius:14,padding:"14px 12px",cursor:"pointer",transition:"all .15s"}}>
              <div style={{fontSize:26,marginBottom:6}}>{c.e}</div>
              <div style={{fontFamily:T.fd,fontSize:11,fontWeight:700,lineHeight:1.25,marginBottom:4}}>{c.t}</div>
              <div style={{fontSize:9,color:T.mt}}>{c.dur}</div>
              <div style={{fontSize:9,color:c.c,fontWeight:700}}>{c.sal.s}</div>
            </div>
          );
        })}
      </div>
      <button className="btn" onClick={()=>selCId&&setStep(3)} disabled={!selCId}
        style={{background:selCId?T.ac:"rgba(255,255,255,.05)",color:selCId?"#080808":T.mt,borderRadius:14,padding:"14px",fontSize:14,fontWeight:700,width:"100%",boxShadow:selCId?`0 4px 24px ${T.acg}`:"none",transition:"all .2s"}}>
        Choisir ce parcours →
      </button>
    </div>
  );

  if(step===3) return (
    <div style={{...baseStyle,paddingTop:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
        <button className="btn" onClick={()=>setStep(2)} style={{background:"none",color:T.mt,fontSize:12,fontWeight:600,padding:0}}>← Retour</button>
        <Dots/>
      </div>
      <h1 style={{fontFamily:T.fd,fontSize:24,fontWeight:800,letterSpacing:"-1px",marginBottom:4}}>Presque ! 🎯</h1>
      <p style={{color:T.mt,fontSize:13,marginBottom:18}}>Ta première branche de vie à développer en parallèle.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
        {branches.map(b=>{
          const sel=selB?.id===b.id;
          return (
            <div key={b.id} onClick={()=>setSelB(sel?null:b)} className="card"
              style={{background:sel?(b.color||T.pu)+"18":T.sf,border:`2px solid ${sel?(b.color||T.pu):T.bd}`,borderRadius:14,padding:"14px 12px",cursor:"pointer",transition:"all .15s"}}>
              <div style={{fontSize:28,marginBottom:6}}>{b.icon}</div>
              <div style={{fontFamily:T.fd,fontSize:11,fontWeight:700,lineHeight:1.25}}>{b.title}</div>
            </div>
          );
        })}
      </div>
      <button className="btn" onClick={()=>selB&&setStep(4)} disabled={!selB}
        style={{background:selB?T.ac:"rgba(255,255,255,.05)",color:selB?"#080808":T.mt,borderRadius:14,padding:"14px",fontSize:14,fontWeight:700,width:"100%",boxShadow:selB?`0 4px 24px ${T.acg}`:"none",transition:"all .2s",marginBottom:8}}>
        Continuer →
      </button>
      <button className="btn" onClick={()=>setStep(4)} style={{background:"none",color:T.mt,fontSize:12,padding:"8px",width:"100%"}}>
        Passer cette étape →
      </button>
    </div>
  );

  return (
    <div style={{...baseStyle,paddingTop:24}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}>
        <button className="btn" onClick={()=>setStep(3)} style={{background:"none",color:T.mt,fontSize:12,fontWeight:600,padding:0}}>← Retour</button>
        <Dots/>
      </div>
      <h1 style={{fontFamily:T.fd,fontSize:24,fontWeight:800,letterSpacing:"-1px",marginBottom:4}}>Tes Piliers de Vie 🌟</h1>
      <p style={{color:T.mt,fontSize:13,marginBottom:18}}>Active les piliers qui comptent pour toi et définis ton objectif hebdomadaire.</p>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
        {PILLARS_DEF.map(p=>{
          const on=!!selP[p.id];
          return (
            <div key={p.id} style={{background:T.sf,border:`1px solid ${on?T.ac+"55":T.bd}`,borderRadius:14,padding:"12px 14px",transition:"border-color .2s"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:on?10:0}}>
                <span style={{fontSize:14,fontWeight:700,fontFamily:T.fd}}>{p.emoji} {p.label}</span>
                <div onClick={()=>setSelP(prev=>({...prev,[p.id]:!prev[p.id]}))}
                  style={{width:40,height:22,borderRadius:99,background:on?T.ac:T.sb,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
                  <div style={{position:"absolute",top:2,left:on?20:2,width:18,height:18,borderRadius:"50%",background:on?"#080808":"#fff",transition:"left .2s"}}/>
                </div>
              </div>
              {on&&<input value={pillarGoals[p.id]||""} onChange={e=>setPillarGoals(prev=>({...prev,[p.id]:e.target.value}))}
                placeholder={p.ph}
                style={{width:"100%",background:T.sfh,border:`1px solid ${T.bd}`,borderRadius:8,padding:"8px 10px",fontSize:12,color:T.tx,fontFamily:T.fb,boxSizing:"border-box"}}/>}
            </div>
          );
        })}
      </div>
      <button className="btn" onClick={()=>complete(false)}
        style={{background:T.ac,color:"#080808",borderRadius:14,padding:"14px",fontSize:14,fontWeight:700,width:"100%",boxShadow:`0 4px 24px ${T.acg}`,marginBottom:8}}>
        🚀 Lancer LifePath
      </button>
      <button className="btn" onClick={()=>complete(true)} style={{background:"none",color:T.mt,fontSize:12,padding:"8px",width:"100%"}}>
        Passer cette étape →
      </button>
    </div>
  );
};

// ━━━ HOME ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const HomePage = () => {
  const {nav} = useCtx();
  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"space-between",padding:"0 24px"}}>
      <div style={{paddingTop:60}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <div style={{width:28,height:28,borderRadius:7,background:T.ac,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:900,color:"#080808"}}>L</div>
          <span style={{fontFamily:T.fd,fontWeight:800,fontSize:18}}>LifePath</span>
        </div>
        <span className="tag" style={{background:T.acd,color:T.ac,border:`1px solid ${T.ac}22`,padding:"4px 10px",fontSize:11,marginBottom:18,display:"inline-flex"}}>30 parcours · Arbre de vie · GPS quotidien</span>
        <h1 style={{fontFamily:T.fd,fontSize:"clamp(36px,10vw,56px)",fontWeight:800,lineHeight:.95,letterSpacing:"-2px",marginBottom:16}}>
          Votre GPS<br/>de <span style={{color:T.ac}}>vie.</span>
        </h1>
        <p style={{color:T.mt,fontSize:14,lineHeight:1.7,marginBottom:28,maxWidth:360}}>
          Carrière, santé, spiritualité, finances, famille — construisez la vie que vous voulez vraiment vivre.
        </p>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <button className="btn" onClick={()=>nav("explore")} style={{background:T.ac,color:"#080808",borderRadius:14,padding:"15px 24px",fontSize:15,fontWeight:700,boxShadow:`0 4px 24px ${T.acg}`}}>Explorer les 30 parcours →</button>
          <button className="btn" onClick={()=>nav("tree")} style={{background:"rgba(255,255,255,.05)",color:T.mt,borderRadius:14,padding:"13px 24px",fontSize:14,fontWeight:500,border:`1px solid ${T.bd}`}}>🌳 Mon Arbre de Vie</button>
          <button className="btn" onClick={()=>nav("dashboard")} style={{background:"rgba(255,255,255,.05)",color:T.mt,borderRadius:14,padding:"13px 24px",fontSize:14,fontWeight:500,border:`1px solid ${T.bd}`}}>📊 Mon Dashboard</button>
        </div>
      </div>
      <div style={{borderTop:`1px solid ${T.bd}`,display:"flex",padding:"18px 0 24px",marginTop:32}}>
        {[["30","Parcours pro"],["6+","Branches de vie"],["∞","Objectifs personnalisés"]].map(([n,l],i)=>(
          <div key={i} style={{flex:1,textAlign:"center",borderRight:i<2?`1px solid ${T.bd}`:"none"}}>
            <div style={{fontFamily:T.fd,fontSize:20,fontWeight:800,color:T.ac}}>{n}</div>
            <div style={{fontSize:9,color:T.mt}}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ━━━ EXPLORE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ExplorePage = () => {
  const {nav,search,setSearch,cat,setCat,getProgress,favorites,toggleFav,compareA,setCompareA,compareB,setCompareB} = useCtx();
  const filtered = useMemo(() => CAREER_LIST.filter(c => {
    const ms = c.t.toLowerCase().includes(search.toLowerCase()) || c.tag.toLowerCase().includes(search.toLowerCase());
    return ms && (cat==="all" || c.cat===cat);
  }), [search, cat]);

  const handleCompare = (e, c) => {
    e.stopPropagation();
    if(!compareA) {
      setCompareA(c); setCompareB(null);
    } else if(compareA.id===c.id) {
      setCompareA(null); setCompareB(null);
    } else {
      setCompareB(c); nav("compare");
    }
  };

  return (
    <div style={{paddingTop:66,minHeight:"100vh"}}>
      <div style={{maxWidth:540,margin:"0 auto",padding:"16px 18px 80px"}}>
        <h1 style={{fontFamily:T.fd,fontSize:22,fontWeight:800,letterSpacing:"-1px",marginBottom:4}}>Parcours</h1>
        <p style={{color:T.mt,fontSize:12,marginBottom:12}}>30 feuilles de route détaillées</p>

        {/* Compare banner */}
        {compareA&&!compareB&&(
          <div style={{background:`${T.bl}12`,border:`1px solid ${T.bl}30`,borderRadius:10,padding:"10px 12px",marginBottom:12,display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:16}}>{compareA.e}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:10,fontWeight:700,color:T.bl}}>⚖ Comparaison</div>
              <div style={{fontSize:10,color:T.mt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{compareA.t} — sélectionne un 2e parcours</div>
            </div>
            <button className="btn" onClick={()=>{setCompareA(null);setCompareB(null);}} style={{background:"none",fontSize:12,color:T.mt,padding:4}}>✕</button>
          </div>
        )}

        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{width:"100%",background:T.sf,border:`1px solid ${T.bd}`,borderRadius:8,padding:"9px 12px",fontSize:12,color:T.tx,fontFamily:T.fb,marginBottom:8}}/>
        <div style={{display:"flex",gap:4,marginBottom:12,flexWrap:"wrap",overflowX:"auto"}}>
          {CATS.map(c=><button key={c.v} className="btn" onClick={()=>setCat(c.v)} style={{padding:"3px 8px",borderRadius:99,fontSize:10,fontWeight:600,background:cat===c.v?T.ac:T.sf,color:cat===c.v?"#080808":T.mt,border:`1px solid ${cat===c.v?T.ac:T.bd}`,whiteSpace:"nowrap"}}>{c.i} {c.l}</button>)}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {filtered.map((c,i) => {
            const p=getProgress(c.id);const fav=favorites.includes(c.id);
            const isA = compareA?.id===c.id;
            return(
              <div key={c.id} className="fu card" style={{background:T.sf,border:`1px solid ${isA?T.bl+"60":T.bd}`,borderRadius:14,padding:"12px",borderLeft:`3px solid ${isA?T.bl:c.c+"33"}`,animationDelay:`${i*.03}s`,cursor:"pointer"}} onClick={()=>nav("career",c.id)}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}>
                  <div style={{width:36,height:36,borderRadius:8,background:c.c+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{c.e}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontSize:13,fontWeight:700,fontFamily:T.fd,marginBottom:2}}>{c.t}</div>
                    <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                      <span className="tag" style={{background:c.c+"14",color:c.c}}>{c.dur}</span>
                      <span className="tag" style={{background:"rgba(255,255,255,.04)",color:T.mt}}>{c.sal.s}</span>
                      {c.ss&&<span className="tag" style={{background:c.ss>=80?T.grd:c.ss>=60?T.yl+"18":"rgba(255,77,77,.1)",color:c.ss>=80?T.gr:c.ss>=60?T.yl:T.rd,fontSize:8}}>🛡{c.ss}</span>}
                    </div>
                    {p>0&&<div style={{height:2,background:T.sb,borderRadius:99,marginTop:4}}><div style={{height:"100%",width:`${p}%`,background:c.c,borderRadius:99}}/></div>}
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"center"}}>
                    <button className="btn" onClick={e=>{e.stopPropagation();toggleFav(c.id);}} style={{background:"none",fontSize:13,padding:2,color:fav?T.ac:T.sb}}>{fav?"★":"☆"}</button>
                    <button className="btn" onClick={e=>handleCompare(e,c)} style={{background:isA?T.bl+"20":T.sb,border:`1px solid ${isA?T.bl+"60":T.bd}`,borderRadius:6,fontSize:9,padding:"3px 6px",color:isA?T.bl:T.mt,fontWeight:700,whiteSpace:"nowrap"}}>{isA?"⚖ Sélect.":"⚖ Comparer"}</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ━━━ HORIZON CARD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const HorizonCard = ({c}) => {
  const hz = HORIZON[c.id];
  if(!hz) return null;
  const aiCol = hz.ai<=30?T.gr:hz.ai<=60?T.yl:T.rd;
  const grCol = hz.gr>=70?T.gr:hz.gr>=50?T.yl:T.rd;
  const ssCol = c.ss>=80?T.gr:c.ss>=60?T.yl:T.rd;
  return (
    <div style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:16,padding:"16px",marginBottom:14}}>
      <h2 style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>🔭 HORIZON 2030–2045</h2>

      {/* Score sécurité + jauges */}
      <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"stretch"}}>
        <div style={{background:ssCol+"12",border:`1px solid ${ssCol}28`,borderRadius:12,padding:"12px 8px",textAlign:"center",minWidth:70,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <div style={{fontFamily:T.fd,fontSize:40,fontWeight:900,color:ssCol,lineHeight:1}}>{c.ss}</div>
          <div style={{fontSize:7,color:ssCol,fontWeight:800,letterSpacing:".8px",marginTop:5,textTransform:"uppercase",lineHeight:1.3}}>Score<br/>sécurité</div>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",gap:10,justifyContent:"center"}}>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span style={{fontSize:9,color:T.mt,fontWeight:600}}>⚡ Risque IA</span>
              <span style={{fontSize:10,color:aiCol,fontWeight:800}}>{hz.ai}<span style={{fontSize:7,opacity:.7}}>/100</span></span>
            </div>
            <div style={{height:7,background:T.sb,borderRadius:99,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${hz.ai}%`,background:`linear-gradient(90deg,${aiCol}88,${aiCol})`,borderRadius:99}}/>
            </div>
          </div>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
              <span style={{fontSize:9,color:T.mt,fontWeight:600}}>📈 Croissance marché</span>
              <span style={{fontSize:10,color:grCol,fontWeight:800}}>{hz.gr}<span style={{fontSize:7,opacity:.7}}>/100</span></span>
            </div>
            <div style={{height:7,background:T.sb,borderRadius:99,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${hz.gr}%`,background:`linear-gradient(90deg,${grCol}88,${grCol})`,borderRadius:99}}/>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div style={{marginBottom:12}}>
        <div style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:7}}>🗓 PROJECTIONS</div>
        <div style={{display:"flex",gap:5}}>
          {[["2030",hz.t.y5,c.c],["2035",hz.t.y10,T.bl],["2045",hz.t.y20,T.pu]].map(([yr,txt,col])=>(
            <div key={yr} style={{flex:1,background:col+"0d",border:`1px solid ${col}22`,borderRadius:8,padding:"8px 7px"}}>
              <div style={{fontSize:7,color:col,fontWeight:800,letterSpacing:".5px",marginBottom:4}}>{yr} ▸</div>
              <div style={{fontSize:9,color:T.tx,lineHeight:1.45}}>{txt}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Menaces + Atouts */}
      <div style={{display:"flex",flexDirection:"column",gap:9,marginBottom:12}}>
        <div>
          <div style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:5}}>⚠️ MENACES</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {hz.th.map((t,i)=><span key={i} className="tag" style={{background:"rgba(255,77,77,.08)",border:"1px solid rgba(255,77,77,.2)",color:T.rd,fontSize:9}}>{t}</span>)}
          </div>
        </div>
        <div>
          <div style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:5}}>✅ ATOUTS</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
            {hz.dr.map((d,i)=><span key={i} className="tag" style={{background:"rgba(34,197,94,.08)",border:`1px solid ${T.gr}22`,color:T.gr,fontSize:9}}>{d}</span>)}
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div style={{background:T.sfh,border:`1px solid ${c.c}22`,borderRadius:10,padding:"11px 12px"}}>
        <div style={{fontSize:8,color:c.c,fontWeight:800,letterSpacing:"1px",textTransform:"uppercase",marginBottom:5}}>💬 VERDICT</div>
        <p style={{fontSize:11,color:T.tx,lineHeight:1.65,margin:0}}>{hz.vd}</p>
      </div>
    </div>
  );
};

// ━━━ CAREER PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CareerPage = () => {
  const {nav,selCareer,isMsDone,getProgress} = useCtx();
  const c = C[selCareer]; if(!c) return null;
  const p = getProgress(c.id);
  return (
    <div style={{paddingTop:50,minHeight:"100vh"}}>
      <div style={{maxWidth:540,margin:"0 auto",padding:"16px 18px 80px"}}>
        <button className="btn" onClick={()=>nav("explore")} style={{background:"none",color:T.mt,fontSize:12,fontWeight:600,padding:0,marginBottom:12}}>← Parcours</button>
        <div style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:16,padding:"16px",marginBottom:14}}>
          <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
            <div style={{width:44,height:44,borderRadius:10,background:c.c+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{c.e}</div>
            <div><h1 style={{fontFamily:T.fd,fontSize:17,fontWeight:800,letterSpacing:"-.5px"}}>{c.t}</h1><p style={{fontSize:11,color:T.mt}}>{c.tag}</p></div>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:4,marginBottom:10}}>
            <span className="tag" style={{background:c.c+"14",color:c.c}}>{c.dur}</span>
            <span className="tag" style={{background:"rgba(255,255,255,.04)",color:T.mt}}>{c.cost}</span>
            <span className="tag" style={{background:"rgba(255,255,255,.04)",color:T.mt}}>{c.lv}</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:10,color:T.mt}}>Progression</span><span style={{fontSize:10,color:c.c,fontWeight:700}}>{p}%</span></div>
          <div style={{height:4,background:T.sb,borderRadius:99}}><div style={{height:"100%",width:`${p}%`,background:c.c,borderRadius:99}}/></div>
          <div style={{display:"flex",gap:5,marginTop:10}}>
            {[["Junior",c.sal.j],["Mid",c.sal.m],["Senior",c.sal.s]].map(([l,v])=><div key={l} style={{flex:1,background:"rgba(255,255,255,.03)",borderRadius:6,padding:"6px",textAlign:"center"}}><div style={{fontSize:8,color:T.mt,textTransform:"uppercase"}}>{l}</div><div style={{fontSize:10,fontWeight:700}}>{v}</div></div>)}
          </div>
        </div>
        <HorizonCard c={c}/>
        {/* Milestones */}
        <div style={{position:"relative"}}>
          <div style={{position:"absolute",left:12,top:8,bottom:8,width:1,background:T.bd}}/>
          {c.ms.map((m,i) => {
            const done = isMsDone(c.id, i);
            const isCur = !done && c.ms.slice(0,i).every((_,j)=>isMsDone(c.id,j));
            const locked = !done && !isCur;
            return (
              <div key={i} style={{paddingLeft:32,position:"relative",marginBottom:6}}>
                <div style={{position:"absolute",left:4,top:10,width:16,height:16,borderRadius:"50%",background:done?c.c:isCur?T.bg:T.sf,border:`2px solid ${done?c.c:isCur?c.c:T.bd}`,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1,fontSize:7,color:done?"#080808":T.mt,boxShadow:isCur?`0 0 0 3px ${c.c}20`:"none"}}>{done?"✓":isCur?<div style={{width:4,height:4,borderRadius:"50%",background:c.c}}/>:""}</div>
                <div className="card" onClick={()=>!locked&&nav("milestone",c.id,i)} style={{background:isCur?c.c+"08":T.sf,border:`1px solid ${isCur?c.c+"30":T.bd}`,borderRadius:12,padding:"10px",cursor:locked?"default":"pointer",opacity:locked?.35:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                    <span style={{fontSize:12}}>{m.i}</span>
                    <span style={{fontWeight:700,fontSize:12,color:done?T.mt:T.tx}}>{m.p}</span>
                    {isCur&&<span className="tag" style={{background:c.c+"20",color:c.c,fontSize:8}}>En cours</span>}
                    {done&&<span className="tag" style={{background:T.grd,color:T.gr,fontSize:8}}>✓</span>}
                  </div>
                  <span style={{fontSize:9,color:T.mt}}>{m.mo} · {m.d}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div style={{marginTop:14}}><h2 style={{fontSize:10,color:T.mt,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>COMPÉTENCES</h2>
          <div style={{display:"flex",flexWrap:"wrap",gap:4}}>{c.sk.map((s,i)=><span key={i} className="tag" style={{background:T.sf,border:`1px solid ${T.bd}`,color:T.mt}}>{s}</span>)}</div>
        </div>
      </div>
    </div>
  );
};

// ━━━ MILESTONE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const MilestonePage = () => {
  const {nav,selCareer,selMilestone,isMsDone,toggleMs,bumpToday} = useCtx();
  const c = C[selCareer]; if(!c) return null;
  const m = c.ms[selMilestone]; if(!m) return null;
  const done = isMsDone(c.id, selMilestone);
  return (
    <div style={{paddingTop:50,minHeight:"100vh"}}>
      <div style={{maxWidth:540,margin:"0 auto",padding:"16px 18px 80px"}}>
        <button className="btn" onClick={()=>nav("career",c.id)} style={{background:"none",color:T.mt,fontSize:12,fontWeight:600,padding:0,marginBottom:12}}>← {c.t}</button>
        <div style={{background:T.sf,border:`1px solid ${c.c}22`,borderRadius:16,padding:"16px",marginBottom:14}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:8}}>
            <span style={{fontSize:24}}>{m.i}</span>
            <div><div style={{display:"flex",gap:4,marginBottom:3}}><span className="tag" style={{background:c.c+"14",color:c.c}}>{m.mo}</span><span className="tag" style={{background:"rgba(255,255,255,.04)",color:T.mt}}>{m.d}</span><span className="tag" style={{background:"rgba(255,255,255,.04)",color:T.mt}}>{m.co}</span></div>
            <h1 style={{fontFamily:T.fd,fontSize:17,fontWeight:800}}>{m.p}</h1><p style={{fontSize:11,color:T.mt}}>{m.obj}</p></div>
          </div>
        </div>
        {/* Tasks */}
        <Sec t="✅ TÂCHES">{m.tasks.map((t,i)=><div key={i} style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:8,padding:"8px 10px",marginBottom:4,fontSize:11,color:T.tx}}>{t}</div>)}</Sec>
        {/* Daily Habits */}
        <Sec t="📅 HABITUDES QUOTIDIENNES">{(m.dh||[]).map((h,i)=><div key={i} style={{background:T.acd,border:`1px solid ${T.ac}15`,borderRadius:8,padding:"8px 10px",marginBottom:4,fontSize:11,color:T.ac}}>→ {h}</div>)}</Sec>
        {/* Resources */}
        <Sec t="📚 RESSOURCES">{(m.res||[]).map((r,i)=>(
          <a key={i} href={r.u} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
            <div className="card" style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:10,padding:"10px",marginBottom:5,cursor:"pointer"}}>
              <div style={{fontSize:12,fontWeight:600,color:T.tx,marginBottom:2}}>{r.n} <span style={{color:T.mt,fontSize:10}}>↗</span></div>
              <p style={{fontSize:10,color:T.mt,marginBottom:4}}>{r.de}</p>
              <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
                <span className="tag" style={{background:r.co.includes("Gratuit")||r.co==="Gratuit"?T.grd:T.yl+"18",color:r.co.includes("Gratuit")||r.co==="Gratuit"?T.gr:T.yl,fontSize:8}}>💰 {r.co}</span>
                <span className="tag" style={{background:"rgba(255,255,255,.04)",color:T.mt,fontSize:8}}>⏱ {r.du}</span>
                <span className="tag" style={{background:"rgba(255,255,255,.04)",color:T.mt,fontSize:8}}>📊 {r.lv}</span>
              </div>
            </div>
          </a>
        ))}</Sec>
        {/* Validation */}
        <Sec t="🎯 VALIDATION">{m.val.map((v,i)=><div key={i} style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:8,padding:"8px 10px",marginBottom:4,fontSize:11,color:T.tx}}>☐ {v}</div>)}</Sec>
        {/* Skills */}
        <Sec t="⭐ COMPÉTENCES DÉBLOQUÉES"><div style={{display:"flex",flexWrap:"wrap",gap:4}}>{(m.sku||[]).map((s,i)=><span key={i} className="tag" style={{background:c.c+"12",border:`1px solid ${c.c}22`,color:c.c}}>{s}</span>)}</div></Sec>
        {/* Complete */}
        <button className="btn" onClick={(e)=>{if(!done){bumpToday();triggerCelebration(e.clientX,e.clientY);}toggleMs(c.id,selMilestone);nav("career",c.id);}} style={{width:"100%",padding:"12px",borderRadius:12,fontSize:13,fontWeight:700,background:done?"rgba(255,255,255,.04)":c.c,color:done?T.mt:"#080808",marginTop:8}}>{done?"↺ Non-terminé":"✓ Marquer terminé"}</button>
      </div>
    </div>
  );
};

// ━━━ TREE PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TreePage = () => {
  const {nav,treeBranches,setSelBranch,treeBranchProg,isTreeObjDone,notify} = useCtx();
  const totalObj = treeBranches.reduce((s,b)=>{let t=0;(b.levels||[]).forEach(l=>t+=(l.objs||[]).length);return s+t;},0);
  const totalObjDone = treeBranches.reduce((s,b)=>{
    let d=0; (b.levels||[]).forEach(l=>(l.objs||[]).forEach(o=>{if(isTreeObjDone(b.id,o))d++;})); return s+d;
  },0);
  const globalPct = totalObj>0?Math.round(totalObjDone/totalObj*100):0;
  const synergies = [];
  treeBranches.forEach(b=>(b.connections||[]).forEach(conn=>{
    const target=treeBranches.find(x=>x.id===conn.to);
    if(target) synergies.push({from:b,to:target,effect:conn.effect});
  }));
  const shareTree = () => {
    const lines=[`🌳 Mon Arbre de Vie LifePath`,`Progression globale : ${globalPct}%`,``];
    treeBranches.forEach(b=>lines.push(`${b.icon} ${b.title} — ${treeBranchProg(b)}%`));
    if(synergies.length>0){lines.push(``);lines.push(`🔗 Synergies :`);synergies.forEach(s=>lines.push(`  ${s.from.title} → ${s.to.title} : ${s.effect}`));}
    navigator.clipboard?.writeText(lines.join("\n")).then(()=>notify("Copié dans le presse-papiers !")).catch(()=>notify("Copier manuellement"));
  };
  return (
    <div style={{paddingTop:66,minHeight:"100vh"}}>
      <div style={{maxWidth:540,margin:"0 auto",padding:"16px 18px 80px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <span style={{fontSize:28}}>🌳</span>
          <div style={{flex:1}}>
            <h1 style={{fontFamily:T.fd,fontSize:22,fontWeight:800,letterSpacing:"-1px"}}>Mon Arbre de Vie</h1>
            <p style={{fontSize:11,color:T.mt}}>{treeBranches.length} branches · {totalObj} objectifs</p>
          </div>
          {treeBranches.length>0&&<div style={{textAlign:"right"}}>
            <div style={{fontSize:22,fontWeight:800,fontFamily:T.fd,color:globalPct>=50?T.ac:T.mt}}>{globalPct}%</div>
            <div style={{fontSize:9,color:T.mt}}>global</div>
          </div>}
        </div>
        {treeBranches.length>0&&<div style={{marginBottom:14}}>
          <div style={{height:5,background:T.sb,borderRadius:99,marginBottom:4}}>
            <div style={{height:"100%",width:`${globalPct}%`,background:T.ac,borderRadius:99,transition:"width .4s",boxShadow:`0 0 8px ${T.ac}44`}}/>
          </div>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <span style={{fontSize:9,color:T.mt}}>{totalObjDone}/{totalObj} objectifs accomplis</span>
            {synergies.length>0&&<span className="tag" style={{background:T.ord,color:T.or,fontSize:8}}>🔗 {synergies.length} synergie{synergies.length>1?"s":""} active{synergies.length>1?"s":""}</span>}
          </div>
        </div>}
        {treeBranches.length===0&&<div style={{background:T.sf,border:`1px dashed ${T.bd}`,borderRadius:16,padding:"36px 18px",textAlign:"center",marginBottom:14}}>
          <span style={{fontSize:36}}>🌱</span>
          <p style={{fontSize:13,color:T.mt,marginTop:8}}>Ton arbre est vide</p>
          <p style={{fontSize:11,color:T.sb}}>Ajoute ta première branche</p>
        </div>}
        {treeBranches.map((b,i) => {
          const pct = treeBranchProg(b);
          return (
            <div key={b.id} className="fu card" onClick={()=>{setSelBranch(b);nav("treebranch");}} style={{background:T.sf,border:`1px solid ${(b.color||T.pu)+"28"}`,borderRadius:14,padding:"14px",marginBottom:8,cursor:"pointer",borderLeft:`3px solid ${b.color||T.pu}`,animationDelay:`${i*.04}s`}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:46,height:46,borderRadius:11,background:(b.color||T.pu)+"1a",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{b.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:14,fontWeight:700,fontFamily:T.fd}}>{b.title}</span>
                    <span style={{fontSize:12,color:b.color||T.pu,fontWeight:800}}>{pct}%</span>
                  </div>
                  <div style={{height:4,background:T.sb,borderRadius:99}}>
                    <div style={{height:"100%",width:`${pct}%`,background:b.color||T.pu,borderRadius:99,boxShadow:pct>0?`0 0 6px ${b.color||T.pu}55`:""}}/>
                  </div>
                  {(b.connections||[]).filter(c=>treeBranches.some(x=>x.id===c.to)).length>0&&
                    <span className="tag" style={{background:T.ord,color:T.or,fontSize:8,marginTop:4}}>🔗 {(b.connections||[]).filter(c=>treeBranches.some(x=>x.id===c.to)).length} lien{(b.connections||[]).filter(c=>treeBranches.some(x=>x.id===c.to)).length>1?"s":""} actif{(b.connections||[]).filter(c=>treeBranches.some(x=>x.id===c.to)).length>1?"s":""}</span>}
                </div>
                <span style={{color:T.mt,fontSize:16}}>›</span>
              </div>
            </div>
          );
        })}
        {synergies.length>0&&<div style={{background:T.sf,border:`1px solid ${T.or}22`,borderRadius:14,padding:"12px 14px",marginBottom:8}}>
          <p style={{fontSize:9,color:T.or,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8}}>🔗 SYNERGIES ACTIVES</p>
          {synergies.map((s,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:i<synergies.length-1?5:0,fontSize:11}}>
              <span>{s.from.icon}</span>
              <span style={{color:T.mt,fontSize:9}}>→</span>
              <span>{s.to.icon}</span>
              <span style={{color:T.mt,flex:1,fontSize:10}}>{s.effect}</span>
            </div>
          ))}
        </div>}
        {treeBranches.length>0&&<button className="btn" onClick={shareTree} style={{width:"100%",background:T.sf,border:`1px solid ${T.bd}`,borderRadius:12,padding:"12px",fontSize:12,fontWeight:600,color:T.tx,marginBottom:8}}>🔗 Partager mon arbre</button>}
        <button className="btn" onClick={()=>nav("treevisual")} style={{width:"100%",background:"rgba(200,255,0,0.08)",border:`1px solid ${T.ac}44`,borderRadius:12,padding:"14px",fontSize:13,fontWeight:700,color:T.ac,marginTop:4,fontFamily:T.fd,letterSpacing:"-0.3px"}}>✦ Mode Immersif</button>
        <button className="btn" onClick={()=>nav("treecatalog")} style={{width:"100%",background:T.sf,border:`1px solid ${T.bd}`,borderRadius:12,padding:"14px",fontSize:13,fontWeight:600,color:T.tx,marginTop:8}}>📚 Ajouter une branche</button>
      </div>
    </div>
  );
};

// ━━━ TREE CATALOG ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TreeCatalogPage = () => {
  const {nav,addTreeBranch,treeBranches,setSelBranch} = useCtx();
  const [spiritualChoice, setSpiritualChoice] = useState(null);
  const [creatifChoice, setCreatifChoice] = useState(null);

  const handleAdd = (branch) => { addTreeBranch(branch); setSelBranch(branch); nav("treebranch"); };

  const simpleBranches = Object.values(LIFE_BRANCHES).filter(b => !b.question);
  const questionBranches = Object.values(LIFE_BRANCHES).filter(b => b.question);

  return (
    <div style={{paddingTop:66,minHeight:"100vh"}}>
      <div style={{maxWidth:540,margin:"0 auto",padding:"16px 18px 80px"}}>
        <button className="btn" onClick={()=>nav("tree")} style={{background:"none",color:T.mt,fontSize:12,fontWeight:600,padding:0,marginBottom:12}}>← Mon Arbre</button>
        <h1 style={{fontFamily:T.fd,fontSize:20,fontWeight:800,letterSpacing:"-1px",marginBottom:4}}>Ajouter une branche</h1>
        <p style={{fontSize:11,color:T.mt,marginBottom:16}}>Choisis ce que tu veux développer dans ta vie.</p>

        {/* Simple branches */}
        {simpleBranches.map(b => {
          const added = treeBranches.find(x=>x.id===b.id);
          return (
            <div key={b.id} className="fu card" style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:14,padding:"14px",marginBottom:8}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                <div style={{width:42,height:42,borderRadius:10,background:(b.color||T.pu)+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{b.icon}</div>
                <div style={{flex:1}}><h3 style={{fontFamily:T.fd,fontSize:14,fontWeight:700}}>{b.title}</h3><p style={{fontSize:10,color:T.mt}}>{b.desc}</p></div>
              </div>
              <div style={{display:"flex",gap:4,marginBottom:8}}>
                <span className="tag" style={{background:"rgba(255,255,255,.04)",color:T.mt}}>{b.levels.length} étapes</span>
                <span className="tag" style={{background:"rgba(255,255,255,.04)",color:T.mt}}>{b.levels.reduce((s,l)=>s+(l.objs||[]).length,0)} objectifs</span>
                {(b.connections||[]).length>0&&<span className="tag" style={{background:T.ord,color:T.or}}>🔗 {(b.connections||[]).length}</span>}
              </div>
              <button className="btn" onClick={()=>!added&&handleAdd(b)} disabled={!!added} style={{width:"100%",background:added?"rgba(255,255,255,.04)":(b.color||T.pu),color:added?T.mt:"#080808",borderRadius:10,padding:"10px",fontSize:12,fontWeight:700}}>{added?"✓ Déjà ajoutée":"Ajouter"}</button>
            </div>
          );
        })}

        {/* Branches with questions (spirituality, creativity) */}
        {questionBranches.map(b => {
          const choice = b.id==="spiritualite"?spiritualChoice:creatifChoice;
          const setChoice = b.id==="spiritualite"?setSpiritualChoice:setCreatifChoice;
          return (
            <div key={b.id} className="fu card" style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:14,padding:"14px",marginBottom:8}}>
              <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
                <div style={{width:42,height:42,borderRadius:10,background:(b.color||T.pu)+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{b.icon}</div>
                <div style={{flex:1}}><h3 style={{fontFamily:T.fd,fontSize:14,fontWeight:700}}>{b.title}</h3><p style={{fontSize:10,color:T.mt}}>{b.question}</p></div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {Object.entries(b.variants).map(([key, variant]) => {
                  const fullBranch = {...variant, id:`${b.id}_${key}`, color:b.color, connections:variant.connections||b.connections||[], levels:variant.levels};
                  const added = treeBranches.find(x=>x.id===fullBranch.id);
                  return (
                    <button key={key} className="btn" onClick={()=>!added&&handleAdd(fullBranch)} disabled={!!added}
                      style={{width:"100%",background:added?"rgba(255,255,255,.04)":T.sfh,border:`1px solid ${added?T.gr+"30":T.bd}`,borderRadius:8,padding:"10px 12px",textAlign:"left",display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:16}}>{variant.icon}</span>
                      <span style={{fontSize:12,fontWeight:600,color:added?T.mt:T.tx}}>{variant.title}</span>
                      {added&&<span style={{marginLeft:"auto",fontSize:10,color:T.gr}}>✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ━━━ TREE BRANCH DETAIL ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const TreeBranchPage = () => {
  const {nav,selBranch,treeBranches,toggleTreeObj,isTreeObjDone,treeBranchProg,treeLevelProg,isTreeLevelUnlocked,bumpToday} = useCtx();
  const b = treeBranches.find(x=>x.id===selBranch?.id)||selBranch;
  if(!b) return null;
  const pct = treeBranchProg(b);

  return (
    <div style={{paddingTop:66,minHeight:"100vh"}}>
      <div style={{maxWidth:540,margin:"0 auto",padding:"16px 18px 80px"}}>
        <button className="btn" onClick={()=>nav("tree")} style={{background:"none",color:T.mt,fontSize:12,fontWeight:600,padding:0,marginBottom:12}}>← Mon Arbre</button>
        {/* Header */}
        <div style={{background:T.sf,border:`1px solid ${(b.color||T.pu)}22`,borderRadius:16,padding:"16px",marginBottom:14}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
            <div style={{width:46,height:46,borderRadius:12,background:(b.color||T.pu)+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>{b.icon}</div>
            <div><h1 style={{fontFamily:T.fd,fontSize:18,fontWeight:800}}>{b.title}</h1>{b.desc&&<p style={{fontSize:10,color:T.mt}}>{b.desc}</p>}</div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:10,color:T.mt}}>Progression</span><span style={{fontSize:10,color:b.color||T.pu,fontWeight:700}}>{pct}%</span></div>
          <div style={{height:4,background:T.sb,borderRadius:99}}><div style={{height:"100%",width:`${pct}%`,background:b.color||T.pu,borderRadius:99,transition:"width .4s"}}/></div>
        </div>

        {/* Connections */}
        {(b.connections||[]).length>0&&<div style={{marginBottom:14}}>
          <h2 style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>🔗 INTERCONNEXIONS</h2>
          {(b.connections||[]).map((conn,i)=>{
            const linked=treeBranches.find(x=>x.id===conn.to);
            return(<div key={i} style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:8,padding:"7px 10px",marginBottom:4,opacity:linked?1:.4}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:12}}>{linked?.icon||"🔗"}</span><span style={{fontSize:10,fontWeight:700,color:linked?.color||T.mt}}>{linked?.title||conn.to}</span>{linked?<span className="tag" style={{background:T.grd,color:T.gr,fontSize:7}}>active</span>:<span className="tag" style={{background:"rgba(255,255,255,.04)",color:T.sb,fontSize:7}}>pas ajoutée</span>}</div>
              <p style={{fontSize:9,color:T.mt}}>{conn.reason}</p>
              <p style={{fontSize:9,color:b.color||T.ac,fontWeight:600}}>→ {conn.effect}</p>
            </div>);
          })}
        </div>}

        {/* Levels */}
        <div style={{position:"relative"}}>
          <div style={{position:"absolute",left:12,top:6,bottom:6,width:2,background:T.sb}}/>
          {(b.levels||[]).map((level,li) => {
            const unlocked = isTreeLevelUnlocked(b, li);
            const done = (level.objs||[]).filter(o=>isTreeObjDone(b.id,o)).length;
            const total = (level.objs||[]).length;
            const lPct = total>0?Math.round(done/total*100):0;
            return (
              <div key={li} className="fu" style={{paddingLeft:34,position:"relative",marginBottom:12,animationDelay:`${li*.06}s`,opacity:unlocked?1:.35}}>
                <div style={{position:"absolute",left:4,top:4,width:18,height:18,borderRadius:"50%",background:lPct===100?(b.color||T.pu):unlocked?T.bg:T.sf,border:`2px solid ${lPct===100?(b.color||T.pu):unlocked?(b.color||T.pu):T.sb}`,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1,fontSize:8,color:lPct===100?"#080808":(b.color||T.pu),fontWeight:900}}>{lPct===100?"✓":li+1}</div>
                <div style={{background:T.sf,border:`1px solid ${unlocked?(b.color||T.pu)+"22":T.bd}`,borderRadius:12,padding:"12px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                    <div><h3 style={{fontFamily:T.fd,fontSize:13,fontWeight:700}}>{level.title}</h3>{level.dur&&<span style={{fontSize:9,color:T.mt}}>{level.dur}</span>}</div>
                    <span style={{fontSize:10,fontWeight:700,color:lPct===100?T.gr:(b.color||T.pu)}}>{done}/{total}</span>
                  </div>
                  {!unlocked?<div style={{textAlign:"center",padding:"8px 0"}}><span style={{fontSize:16}}>🔒</span><p style={{fontSize:10,color:T.mt,marginTop:3}}>75% de l'étape {li} requis ({Math.round(treeLevelProg(b,li-1)*100)}%/75%)</p></div>:
                    (level.objs||[]).map((obj,oi) => {
                      const checked = isTreeObjDone(b.id, obj);
                      return (
                        <div key={oi} onClick={(e)=>{if(!checked){bumpToday();triggerCelebration(e.clientX,e.clientY);}toggleTreeObj(b.id,obj);}} style={{display:"flex",gap:7,alignItems:"flex-start",padding:"7px 8px",background:checked?(b.color||T.pu)+"0a":T.sfh,border:`1px solid ${checked?(b.color||T.pu)+"28":T.bd}`,borderRadius:7,marginBottom:4,cursor:"pointer",transition:"all .15s"}}>
                          <div style={{width:14,height:14,borderRadius:3,flexShrink:0,marginTop:1,background:checked?(b.color||T.pu):"transparent",border:`2px solid ${checked?(b.color||T.pu):T.sb}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:"#080808",fontWeight:900}}>{checked?"✓":""}</div>
                          <span style={{fontSize:11,color:checked?T.mt:T.tx,lineHeight:1.4,textDecoration:checked?"line-through":"none"}}>{obj}</span>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ━━━ DAILY PAGE (simplified) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const DailyPage = () => {
  const {nav,selCareer,treeBranches,isMsDone,isTreeLevelUnlocked,pillars} = useCtx();
  const career = selCareer ? C[selCareer] : null;
  const currentMs = career ? (career.ms.find((_,i) => !isMsDone(career.id,i) && career.ms.slice(0,i).every((_,j) => isMsDone(career.id,j))) || career.ms[0]) : null;
  return (
    <div style={{paddingTop:66,minHeight:"100vh"}}>
      <div style={{maxWidth:540,margin:"0 auto",padding:"16px 18px 80px"}}>
        <h1 style={{fontFamily:T.fd,fontSize:22,fontWeight:800,letterSpacing:"-1px",marginBottom:4}}>Ma Journée</h1>
        <p style={{color:T.mt,fontSize:12,marginBottom:16}}>Ce que tu peux faire aujourd'hui</p>

        {/* Career daily habits */}
        {currentMs&&currentMs.dh&&<Sec t={`💼 ${career.t}`}>
          {currentMs.dh.map((h,i)=><div key={i} style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:8,padding:"8px 10px",marginBottom:4,fontSize:11,color:T.tx}}>☐ {h}</div>)}
        </Sec>}

        {/* Tree branches daily view */}
        {treeBranches.map(b => {
          let curIdx = 0;
          (b.levels||[]).forEach((_,i) => { if(isTreeLevelUnlocked(b,i)) curIdx = i; });
          const currentLevel = (b.levels||[])[curIdx];
          if(!currentLevel) return null;
          const firstUndone = (currentLevel.objs||[]).slice(0,3);
          return (
            <Sec key={b.id} t={`${b.icon} ${b.title}`}>
              {firstUndone.map((o,i)=><div key={i} style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:8,padding:"8px 10px",marginBottom:4,fontSize:11,color:T.tx}}>☐ {o}</div>)}
              <button className="btn" onClick={()=>{nav("treebranch");}} style={{fontSize:10,color:b.color||T.pu,background:"none",padding:"4px 0"}}>Voir tout →</button>
            </Sec>
          );
        })}

        {/* Piliers de Vie */}
        {pillars && Object.values(pillars).some(p=>p.enabled) && (
          <Sec t="🎯 Piliers de Vie">
            {Object.values(pillars).filter(p=>p.enabled).map((p,i)=>(
              <div key={i} style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:8,padding:"8px 10px",marginBottom:4,fontSize:11,color:T.tx,display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:14}}>{p.emoji}</span>
                <span style={{flex:1}}>{p.label}{p.goal?` — ${p.goal}`:""}</span>
              </div>
            ))}
            <button className="btn" onClick={()=>nav("settings")} style={{fontSize:10,color:T.mt,background:"none",padding:"4px 0"}}>Modifier les piliers →</button>
          </Sec>
        )}

        {!career&&treeBranches.length===0&&(!pillars||Object.values(pillars).every(p=>!p.enabled))&&<div style={{textAlign:"center",padding:30,color:T.mt}}>
          <p style={{fontSize:13,marginBottom:10}}>Choisis un parcours et ajoute des branches pour voir tes tâches quotidiennes.</p>
          <button className="btn" onClick={()=>nav("explore")} style={{background:T.ac,color:"#080808",borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:700}}>Explorer</button>
        </div>}
      </div>
    </div>
  );
};

// ━━━ SETTINGS PAGE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const SettingsPage = () => {
  const {nav,userName,setUserName,setOnboardingDone,notify,pillars,setPillars} = useCtx();
  const [nameEdit, setNameEdit] = useState(userName);
  const [resetPending, setResetPending] = useState(false);
  const [immersive, setImmersive] = useState(()=>{try{return JSON.parse(localStorage.getItem("lp_immersive")||"false")}catch{return false}});
  const [notifEnabled, setNotifEnabled] = useState(()=>{try{return JSON.parse(localStorage.getItem("lp_notif")||"false")}catch{return false}});
  const [pillarEdit, setPillarEdit] = useState(() => {
    if(!pillars) {
      const d = {};
      PILLARS_DEF.forEach(p=>{ d[p.id]={enabled:false,goal:"",emoji:p.emoji,label:p.label}; });
      return d;
    }
    const d = {};
    PILLARS_DEF.forEach(p=>{ d[p.id] = pillars[p.id] || {enabled:false,goal:"",emoji:p.emoji,label:p.label}; });
    return d;
  });

  const savePillars = () => {
    const active = {};
    PILLARS_DEF.forEach(p=>{ if(pillarEdit[p.id]?.enabled) active[p.id]=pillarEdit[p.id]; });
    setPillars(Object.keys(active).length>0 ? active : null);
    notify("Piliers mis à jour !");
  };

  const toggle = (key, val, setter) => {
    setter(val);
    try{localStorage.setItem(key, JSON.stringify(val));}catch{}
  };

  const saveName = () => {
    const trimmed = nameEdit.trim();
    if(trimmed) { setUserName(trimmed); notify("Prénom mis à jour !"); }
  };

  const handleReset = () => {
    if(!resetPending){ setResetPending(true); setTimeout(()=>setResetPending(false),2500); return; }
    try{ localStorage.removeItem("lifepath_v1"); }catch{}
    setOnboardingDone(false);
    notify("Progression réinitialisée.");
    nav("home");
  };

  const row = (label, children) => (
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:`1px solid ${T.bd}`}}>
      <span style={{fontSize:13,color:T.tx}}>{label}</span>
      {children}
    </div>
  );

  const Toggle = ({val, onChange}) => (
    <div onClick={onChange} style={{width:42,height:24,borderRadius:99,background:val?T.ac:T.sb,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
      <div style={{position:"absolute",top:3,left:val?20:3,width:18,height:18,borderRadius:"50%",background:val?"#080808":"#fff",transition:"left .2s"}}/>
    </div>
  );

  return (
    <div style={{paddingTop:66,minHeight:"100vh"}}>
      <div style={{maxWidth:540,margin:"0 auto",padding:"16px 18px 80px"}}>

        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:20}}>
          <span style={{fontSize:26}}>⚙️</span>
          <h1 style={{fontFamily:T.fd,fontSize:20,fontWeight:800,letterSpacing:"-0.8px"}}>Paramètres</h1>
        </div>

        {/* Prénom */}
        <div style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:14,padding:"14px 16px",marginBottom:12}}>
          <p style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>PROFIL</p>
          {row("Prénom",
            <div style={{display:"flex",gap:6}}>
              <input value={nameEdit} onChange={e=>setNameEdit(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&saveName()}
                style={{background:T.sfh,border:`1px solid ${T.bd}`,borderRadius:8,padding:"5px 10px",fontSize:12,color:T.tx,width:100,fontFamily:T.fb}} />
              <button className="btn" onClick={saveName}
                style={{background:T.ac,color:"#080808",borderRadius:8,padding:"5px 10px",fontSize:11,fontWeight:700}}>OK</button>
            </div>
          )}
        </div>

        {/* Toggles */}
        <div style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:14,padding:"14px 16px",marginBottom:12}}>
          <p style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>AFFICHAGE</p>
          {row("Mode Immersif par défaut", <Toggle val={immersive} onChange={()=>toggle("lp_immersive",!immersive,setImmersive)} />)}
          {row("Notifications navigateur", <Toggle val={notifEnabled} onChange={()=>toggle("lp_notif",!notifEnabled,setNotifEnabled)} />)}
        </div>

        {/* Piliers de Vie */}
        <div style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:14,padding:"14px 16px",marginBottom:12}}>
          <p style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>PILIERS DE VIE</p>
          {PILLARS_DEF.map(p=>{
            const entry = pillarEdit[p.id]||{enabled:false,goal:""};
            return (
              <div key={p.id} style={{marginBottom:8,padding:"8px 0",borderBottom:`1px solid ${T.bd}`}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:entry.enabled?8:0}}>
                  <span style={{fontSize:13,color:T.tx}}>{p.emoji} {p.label}</span>
                  <div onClick={()=>setPillarEdit(prev=>({...prev,[p.id]:{...prev[p.id],enabled:!prev[p.id]?.enabled}}))}
                    style={{width:40,height:22,borderRadius:99,background:entry.enabled?T.ac:T.sb,cursor:"pointer",position:"relative",transition:"background .2s",flexShrink:0}}>
                    <div style={{position:"absolute",top:2,left:entry.enabled?20:2,width:18,height:18,borderRadius:"50%",background:entry.enabled?"#080808":"#fff",transition:"left .2s"}}/>
                  </div>
                </div>
                {entry.enabled&&<input value={entry.goal||""} onChange={e=>setPillarEdit(prev=>({...prev,[p.id]:{...prev[p.id],goal:e.target.value}}))}
                  placeholder={p.ph}
                  style={{width:"100%",background:T.sfh,border:`1px solid ${T.bd}`,borderRadius:8,padding:"6px 10px",fontSize:11,color:T.tx,fontFamily:T.fb,boxSizing:"border-box"}}/>}
              </div>
            );
          })}
          <button className="btn" onClick={savePillars}
            style={{width:"100%",marginTop:8,padding:"10px",borderRadius:10,background:T.ac,color:"#080808",fontSize:12,fontWeight:700}}>
            Sauvegarder les piliers
          </button>
        </div>

        {/* Danger zone */}
        <div style={{background:T.sf,border:`1px solid ${T.rd}22`,borderRadius:14,padding:"14px 16px",marginBottom:12}}>
          <p style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>ZONE DANGEREUSE</p>
          <button className="btn" onClick={handleReset}
            style={{width:"100%",padding:"12px",borderRadius:10,border:`1px solid ${resetPending?T.rd:T.bd}`,
              background:resetPending?"rgba(255,77,77,.12)":"transparent",
              color:resetPending?T.rd:T.mt,fontSize:12,fontWeight:700,transition:"all .2s"}}>
            {resetPending ? "⚠️ Confirmer la réinitialisation (clic)" : "🗑️ Réinitialiser ma progression"}
          </button>
        </div>

        {/* À propos */}
        <div style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:14,padding:"14px 16px"}}>
          <p style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:10}}>À PROPOS</p>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:T.mt}}>Version</span>
            <span style={{fontSize:12,color:T.ac,fontWeight:700}}>v1.0.0</span>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}>
            <span style={{fontSize:12,color:T.mt}}>Code source</span>
            <a href="https://github.com/jefflitelife/lifepath" target="_blank" rel="noreferrer"
              style={{fontSize:12,color:T.bl,fontWeight:700,textDecoration:"none"}}>GitHub →</a>
          </div>
          <div style={{background:T.sfh,borderRadius:10,padding:"12px"}}>
            <p style={{fontFamily:T.fd,fontSize:13,fontWeight:800,color:T.ac,marginBottom:4}}>LifePath</p>
            <p style={{fontSize:11,color:T.mt,lineHeight:1.5}}>Ton compagnon de développement personnel. Explore des parcours de carrière, cultive ton arbre de vie, et progresse chaque jour vers la meilleure version de toi-même.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

// ━━━ HELPERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const QUOTES = [
  "Le voyage de mille lieues commence par un seul pas.",
  "La discipline est le pont entre les objectifs et les accomplissements.",
  "Chaque expert a été débutant un jour.",
  "Le succès n'est pas la clé du bonheur. C'est la passion qui est la clé.",
  "Commence là où tu es, utilise ce que tu as, fais ce que tu peux.",
  "Ton futur dépend de ce que tu fais aujourd'hui.",
  "La persévérance est la mère de la bonne fortune.",
  "Ce n'est pas la montagne qui nous épuise, mais le caillou dans notre chaussure.",
  "Le seul endroit où le succès vient avant le travail, c'est dans le dictionnaire.",
  "Rêve grand, commence petit, agis maintenant.",
  "Les obstacles sont ces choses effrayantes que tu vois quand tu perds de vue tes objectifs.",
  "La réussite appartient à ceux qui croient en la beauté de leurs rêves.",
  "Chaque jour est une nouvelle chance de changer ta vie.",
  "L'action est le fondement de tout succès.",
  "Ne compte pas les jours, fais que les jours comptent.",
  "Il n'y a pas de raccourci vers un endroit qui en vaut la peine.",
  "La meilleure façon de prédire l'avenir, c'est de le créer.",
  "La motivation te fait démarrer, l'habitude te fait continuer.",
  "Les grandes choses ne sont jamais faites par une seule personne.",
  "Si tu veux quelque chose que tu n'as jamais eu, tu dois faire quelque chose que tu n'as jamais fait.",
  "Tombe sept fois, relève-toi huit.",
  "La constance est plus importante que l'intensité.",
  "Le talent, ça n'existe pas. Le talent c'est d'avoir envie de faire quelque chose.",
  "On ne fait jamais l'expérience de sa vie future, on l'invente.",
  "Le plus grand risque est de ne pas en prendre.",
  "Crois en toi, travaille dur, tout est possible.",
  "Les petits progrès quotidiens mènent aux grands accomplissements.",
  "Sois la personne que tu voudrais croiser.",
  "Le moment présent est le seul moment où tu peux agir.",
  "Chaque effort que tu fais aujourd'hui plante une graine pour demain.",
];

// ━━━ DASHBOARD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const DashboardPage = () => {
  const {nav,completedMs,favorites,treeBranches,treeObjCompleted,streak,todayChecks,getProgress,treeBranchProg,isMsDone,userName,activeDays,selCareer} = useCtx();
  const ctxB = {completedMs,favorites,treeBranches,streak,todayChecks,getProgress,userName,selCareer};
  const prevBadgesRef = useRef(null);
  useEffect(() => {
    const earned = BADGES.filter(b=>b.check(ctxB)).map(b=>b.id);
    if(prevBadgesRef.current !== null) {
      const newOnes = earned.filter(id=>!prevBadgesRef.current.includes(id));
      if(newOnes.length > 0) triggerCelebration(window.innerWidth/2, window.innerHeight/2);
    }
    prevBadgesRef.current = earned;
  });

  const totalMsDone   = Object.values(completedMs).filter(Boolean).length;
  const totalMs       = CAREER_LIST.reduce((s,c)=>s+c.ms.length,0);
  const totalObjDone  = Object.values(treeObjCompleted).filter(Boolean).length;
  const scoreToday    = Math.min(100,Math.round(todayChecks/5*100));
  const scoreCol      = scoreToday>=80?T.gr:scoreToday>=40?T.yl:T.mt;
  const streakCol     = streak>=7?T.ac:streak>=3?T.or:T.mt;

  const unlockedSkills = new Set();
  Object.entries(completedMs).forEach(([key,done])=>{
    if(!done) return;
    const li=key.lastIndexOf("-"); const cId=key.slice(0,li); const mIdx=parseInt(key.slice(li+1));
    const career=C[cId]; if(career&&career.ms[mIdx]) (career.ms[mIdx].sku||[]).forEach(s=>unlockedSkills.add(s));
  });

  const activeCareers = CAREER_LIST.filter(c=>getProgress(c.id)>0).sort((a,b)=>getProgress(b.id)-getProgress(a.id));
  const earnedBadges  = BADGES.filter(b=>b.check(ctxB));
  const today = new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
  const dayOfMonth = new Date().getDate();
  const dailyQuote = QUOTES[dayOfMonth % QUOTES.length];

  // Weekly chart: last 7 days — filled based on streak
  const weekDays = Array.from({length:7},(_,i)=>{
    const d = new Date(); d.setDate(d.getDate()-6+i);
    const label = d.toLocaleDateString("fr-FR",{weekday:"short"}).slice(0,3);
    const daysAgo = 6-i;
    const active = daysAgo < streak;
    return {label, active};
  });

  // Prochaine étape — first active career's next incomplete milestone
  const nextStep = (() => {
    for(const c of activeCareers) {
      const idx = c.ms.findIndex((_,j)=>!isMsDone(c.id,j));
      if(idx>=0) return {career:c, ms:c.ms[idx], idx};
    }
    return null;
  })();

  return (
    <div style={{paddingTop:66,minHeight:"100vh"}}>
      <div style={{maxWidth:540,margin:"0 auto",padding:"16px 18px 80px"}}>

        {/* Welcome */}
        <div style={{marginBottom:14}}>
          <h1 style={{fontFamily:T.fd,fontSize:22,fontWeight:800,letterSpacing:"-1px",marginBottom:2}}>
            {userName ? `Bonjour, ${userName} 👋` : "Mon Dashboard"}
          </h1>
          <p style={{color:T.mt,fontSize:11,textTransform:"capitalize"}}>{today}</p>
        </div>

        {/* Citation du jour */}
        <div style={{background:`${T.ac}09`,border:`1px solid ${T.ac}22`,borderLeft:`3px solid ${T.ac}`,borderRadius:12,padding:"12px 14px",marginBottom:18}}>
          <p style={{fontSize:11,color:T.ac,fontWeight:700,letterSpacing:"0.5px",marginBottom:4,textTransform:"uppercase"}}>✦ Inspiration du jour</p>
          <p style={{fontSize:13,color:T.tx,lineHeight:1.5,fontStyle:"italic"}}>« {dailyQuote} »</p>
        </div>

        {/* Hero : streak + score du jour */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:20}}>
          {/* Streak */}
          <div style={{background:streak>=3?`${streakCol}0d`:T.sf,border:`1px solid ${streak>=3?streakCol+"30":T.bd}`,borderRadius:16,padding:"18px 16px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}>
            <span className={streak>1?"fire":""} style={{fontSize:28,lineHeight:1}}>🔥</span>
            <div style={{fontFamily:T.fd,fontSize:40,fontWeight:900,color:streakCol,lineHeight:1}}>{streak}</div>
            <div style={{fontSize:9,color:T.mt,fontWeight:700,textTransform:"uppercase",letterSpacing:".8px",textAlign:"center"}}>jour{streak>1?"s":""} de streak</div>
            {streak>=3&&<span className="tag" style={{background:streakCol+"20",color:streakCol,fontSize:8,marginTop:2}}>{streak>=30?"💎 Invincible":streak>=7?"🏅 Semaine de feu":"🔥 En feu"}</span>}
          </div>
          {/* Score du jour */}
          <div style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:16,padding:"18px 16px",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
            <div style={{position:"relative",width:72,height:72}}>
              <svg width="72" height="72" style={{transform:"rotate(-90deg)"}}>
                <circle cx="36" cy="36" r="30" fill="none" stroke={T.sb} strokeWidth="5"/>
                <circle cx="36" cy="36" r="30" fill="none" stroke={scoreCol} strokeWidth="5"
                  strokeDasharray={`${188.5*scoreToday/100} 188.5`}
                  strokeLinecap="round" style={{transition:"stroke-dasharray .6s ease"}}/>
              </svg>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontFamily:T.fd,fontSize:16,fontWeight:900,color:scoreCol}}>{scoreToday}%</span>
              </div>
            </div>
            <div style={{fontSize:9,color:T.mt,fontWeight:700,textTransform:"uppercase",letterSpacing:".8px",textAlign:"center"}}>Score du jour</div>
            <div style={{fontSize:8,color:T.mt}}>{todayChecks} action{todayChecks>1?"s":""} aujourd'hui</div>
          </div>
        </div>

        {/* 4 stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:20}}>
          {[
            {v:totalMsDone,        l:"Jalons",    icon:"📈", col:T.bl},
            {v:totalObjDone,       l:"Objectifs", icon:"✅", col:T.gr},
            {v:activeDays,         l:"Jours actifs",icon:"📅",col:T.or},
            {v:unlockedSkills.size,l:"Skills",    icon:"⭐", col:T.pu},
          ].map(({v,l,icon,col},i)=>(
            <div key={i} style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:12,padding:"10px 6px",textAlign:"center"}}>
              <div style={{fontSize:12,marginBottom:3}}>{icon}</div>
              <div style={{fontFamily:T.fd,fontSize:14,fontWeight:800,color:col,lineHeight:1}}>{v}</div>
              <div style={{fontSize:7,color:T.mt,marginTop:3,lineHeight:1.2}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Graphique hebdomadaire */}
        <div style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:12,padding:"14px",marginBottom:14}}>
          <h2 style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>📅 ACTIVITÉ — 7 DERNIERS JOURS</h2>
          <div style={{display:"flex",gap:6,alignItems:"flex-end",height:52}}>
            {weekDays.map((d,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                <div style={{
                  width:"100%",borderRadius:4,
                  background: d.active ? T.ac : T.sb,
                  height: d.active ? (i===6?44:32+Math.sin(i*0.9)*10) : 8,
                  transition:"height .4s ease",
                  boxShadow: d.active ? `0 0 8px ${T.ac}55` : "none"
                }}/>
                <span style={{fontSize:8,color:d.active?T.ac:T.mt,fontWeight:d.active?700:400}}>{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Prochaine étape */}
        {nextStep&&(
          <div style={{background:T.sf,border:`1px solid ${nextStep.career.c}30`,borderLeft:`3px solid ${nextStep.career.c}`,borderRadius:12,padding:"12px 14px",marginBottom:14,cursor:"pointer"}}
            onClick={()=>nav("career",nextStep.career.id)}>
            <h2 style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8}}>🎯 PROCHAINE ÉTAPE</h2>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:36,height:36,borderRadius:9,background:nextStep.career.c+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{nextStep.ms.i}</div>
              <div style={{flex:1}}>
                <p style={{fontSize:12,fontWeight:700,fontFamily:T.fd,marginBottom:2}}>{nextStep.ms.p}</p>
                <p style={{fontSize:11,color:T.mt}}>{nextStep.career.t} · {nextStep.ms.d}</p>
                <div style={{display:"flex",gap:4,marginTop:4,flexWrap:"wrap"}}>
                  {(nextStep.ms.tasks||[]).slice(0,2).map((t,i)=>(
                    <span key={i} className="tag" style={{background:nextStep.career.c+"14",color:nextStep.career.c,fontSize:8}}>{t}</span>
                  ))}
                </div>
              </div>
              <span style={{color:T.mt,fontSize:13}}>›</span>
            </div>
          </div>
        )}

        {/* Badges */}
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <h2 style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase"}}>🏅 BADGES</h2>
            <span style={{fontSize:9,color:T.ac,fontWeight:800}}>{earnedBadges.length}/{BADGES.length} débloqués</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
            {BADGES.map((b,i)=>{
              const earned = b.check(ctxB);
              return (
                <div key={b.id} className={earned?"fu":""} style={{background:earned?`${T.ac}09`:T.sf,border:`1px solid ${earned?T.ac+"30":T.bd}`,borderRadius:10,padding:"10px 8px",textAlign:"center",opacity:earned?1:.33,animationDelay:`${i*.03}s`}}>
                  <div style={{fontSize:20,marginBottom:4,filter:earned?"none":"grayscale(100%)"}}>{b.icon}</div>
                  <div style={{fontSize:9,fontWeight:700,color:earned?T.ac:T.mt,marginBottom:2}}>{b.name}</div>
                  <div style={{fontSize:7,color:T.mt,lineHeight:1.3}}>{b.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Parcours en cours */}
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <h2 style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase"}}>📚 MES PARCOURS</h2>
            <button className="btn" onClick={()=>nav("explore")} style={{fontSize:9,color:T.ac,background:"none",padding:0,fontWeight:700}}>+ Explorer</button>
          </div>
          {activeCareers.length===0 ? (
            <div style={{background:T.sf,border:`1px dashed ${T.bd}`,borderRadius:12,padding:"22px",textAlign:"center"}}>
              <p style={{fontSize:12,color:T.mt,marginBottom:10}}>Aucun parcours commencé</p>
              <button className="btn" onClick={()=>nav("explore")} style={{background:T.ac,color:"#080808",borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:700}}>Explorer les 30 parcours →</button>
            </div>
          ) : activeCareers.map((c,i)=>{
            const p = getProgress(c.id);
            const doneCount = c.ms.filter((_,j)=>isMsDone(c.id,j)).length;
            const curMsIdx  = c.ms.findIndex((_,j)=>!isMsDone(c.id,j)&&(j===0||c.ms.slice(0,j).every((_,k)=>isMsDone(c.id,k))));
            const curMs     = curMsIdx>=0 ? c.ms[curMsIdx] : null;
            return (
              <div key={c.id} className="fu card" onClick={()=>nav("career",c.id)} style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:12,padding:"12px",marginBottom:6,cursor:"pointer",borderLeft:`3px solid ${c.c}44`,animationDelay:`${i*.04}s`}}>
                <div style={{display:"flex",gap:9,alignItems:"center"}}>
                  <div style={{width:36,height:36,borderRadius:9,background:c.c+"14",display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{c.e}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                      <span style={{fontFamily:T.fd,fontSize:12,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"70%"}}>{c.t}</span>
                      <span style={{fontSize:11,fontWeight:800,color:p===100?T.gr:c.c,flexShrink:0}}>{p===100?"✓ 100%":`${p}%`}</span>
                    </div>
                    <div style={{height:3,background:T.sb,borderRadius:99,marginBottom:4}}>
                      <div style={{height:"100%",width:`${p}%`,background:p===100?T.gr:c.c,borderRadius:99,transition:"width .4s"}}/>
                    </div>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:9,color:T.mt}}>{doneCount}/{c.ms.length} jalons</span>
                      {curMs&&p<100&&<span className="tag" style={{background:c.c+"14",color:c.c,fontSize:8}}>{curMs.i} {curMs.p}</span>}
                      {p===100&&<span className="tag" style={{background:T.grd,color:T.gr,fontSize:8}}>Terminé ✓</span>}
                    </div>
                  </div>
                  <span style={{color:T.mt,fontSize:13,flexShrink:0}}>›</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Branches actives */}
        {treeBranches.length>0&&(
          <div style={{marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <h2 style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase"}}>🌳 BRANCHES ACTIVES</h2>
              <button className="btn" onClick={()=>nav("tree")} style={{fontSize:9,color:T.gr,background:"none",padding:0,fontWeight:700}}>Voir tout →</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {treeBranches.map((b,i)=>{
                const pct = treeBranchProg(b);
                const totalO = (b.levels||[]).reduce((s,l)=>s+(l.objs||[]).length,0);
                return (
                  <div key={b.id} className="fu card" onClick={()=>nav("tree")} style={{background:T.sf,border:`1px solid ${(b.color||T.pu)}2a`,borderRadius:12,padding:"12px",cursor:"pointer",animationDelay:`${i*.04}s`}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
                      <span style={{fontSize:24}}>{b.icon}</span>
                      <span style={{fontSize:11,fontWeight:800,color:b.color||T.pu}}>{pct}%</span>
                    </div>
                    <div style={{fontSize:11,fontWeight:700,fontFamily:T.fd,marginBottom:6,lineHeight:1.2}}>{b.title}</div>
                    <div style={{height:4,background:T.sb,borderRadius:99,marginBottom:4}}>
                      <div style={{height:"100%",width:`${pct}%`,background:b.color||T.pu,borderRadius:99,boxShadow:pct>0?`0 0 6px ${b.color||T.pu}66`:"none"}}/>
                    </div>
                    <span style={{fontSize:8,color:T.mt}}>{totalO} objectif{totalO>1?"s":""}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Progression globale */}
        {totalMsDone>0&&(
          <div style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:12,padding:"14px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <h2 style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase"}}>⚡ PROGRESSION GLOBALE</h2>
              <span style={{fontSize:11,color:T.ac,fontWeight:800}}>{Math.round(totalMsDone/totalMs*100)}%</span>
            </div>
            <div style={{height:6,background:T.sb,borderRadius:99}}>
              <div style={{height:"100%",width:`${Math.round(totalMsDone/totalMs*100)}%`,background:`linear-gradient(90deg,${T.ac}88,${T.ac})`,borderRadius:99,transition:"width .4s"}}/>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
              <span style={{fontSize:9,color:T.mt}}>{totalMsDone} jalon{totalMsDone>1?"s":""} complété{totalMsDone>1?"s":""}</span>
              <span style={{fontSize:9,color:T.mt}}>{totalObjDone} objectif{totalObjDone>1?"s":""} coché{totalObjDone>1?"s":""}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const ComparePage = () => {
  const {nav,compareA,compareB,setCompareA,setCompareB,getProgress,isMsDone} = useCtx();

  if(!compareA||!compareB) return (
    <div style={{paddingTop:66,minHeight:"100vh"}}>
      <div style={{maxWidth:540,margin:"0 auto",padding:"32px 18px",textAlign:"center"}}>
        <p style={{fontSize:14,color:T.mt,marginBottom:16}}>Sélectionne 2 parcours depuis Explore.</p>
        <button className="btn" onClick={()=>nav("explore")} style={{background:T.ac,color:"#080808",borderRadius:10,padding:"10px 20px",fontSize:13,fontWeight:700}}>← Retour à Explore</button>
      </div>
    </div>
  );

  const hzA = HORIZON[compareA.id]||{};
  const hzB = HORIZON[compareB.id]||{};
  const pA  = getProgress(compareA.id);
  const pB  = getProgress(compareB.id);

  const ColHd = ({c,p}) => (
    <div style={{flex:1,minWidth:0,textAlign:"center",padding:"10px 6px 8px",background:c.c+"10",borderRadius:"12px 12px 0 0",borderBottom:`2px solid ${c.c}33`}}>
      <div style={{fontSize:22,marginBottom:4}}>{c.e}</div>
      <div style={{fontFamily:T.fd,fontSize:10,fontWeight:800,color:c.c,lineHeight:1.2,marginBottom:4}}>{c.t}</div>
      {p>0&&<div style={{fontSize:8,color:T.mt}}>{p}% complété</div>}
    </div>
  );

  const scoreColor = v => v>=70?T.gr:v>=40?T.yl:T.rd;
  const riskColor  = v => v<=30?T.gr:v<=60?T.yl:T.rd;

  const CmpRow = ({label,vA,vB,barA,barB,barMax=100,icon}) => {
    const numA = typeof barA==="number"; const numB = typeof barB==="number";
    return (
      <div style={{display:"flex",gap:0,marginBottom:2,alignItems:"stretch"}}>
        <div style={{flex:1,minWidth:0,padding:"7px 8px",background:T.sf,borderBottom:`1px solid ${T.bd}`}}>
          {numA&&<div style={{height:3,background:T.sb,borderRadius:99,marginBottom:4}}>
            <div style={{height:"100%",width:`${Math.min(100,barA/barMax*100)}%`,background:compareA.c,borderRadius:99}}/>
          </div>}
          <div style={{fontSize:10,fontWeight:600,color:T.tx,textAlign:"left"}}>{vA}</div>
        </div>
        <div style={{width:80,flexShrink:0,padding:"7px 4px",background:`${T.sf}88`,borderBottom:`1px solid ${T.bd}`,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
          <span style={{fontSize:10}}>{icon}</span>
          <span style={{fontSize:8,color:T.mt,textAlign:"center",lineHeight:1.2}}>{label}</span>
        </div>
        <div style={{flex:1,minWidth:0,padding:"7px 8px",background:T.sf,borderBottom:`1px solid ${T.bd}`}}>
          {numB&&<div style={{height:3,background:T.sb,borderRadius:99,marginBottom:4}}>
            <div style={{height:"100%",width:`${Math.min(100,barB/barMax*100)}%`,background:compareB.c,borderRadius:99}}/>
          </div>}
          <div style={{fontSize:10,fontWeight:600,color:T.tx,textAlign:"right"}}>{vB}</div>
        </div>
      </div>
    );
  };

  const ScoreRow = ({label,a,b,icon,invert=false}) => {
    const colA = invert?riskColor(a):scoreColor(a);
    const colB = invert?riskColor(b):scoreColor(b);
    return (
      <div style={{display:"flex",gap:0,marginBottom:2,alignItems:"stretch"}}>
        <div style={{flex:1,padding:"7px 8px",background:T.sf,borderBottom:`1px solid ${T.bd}`,textAlign:"left"}}>
          <div style={{height:3,background:T.sb,borderRadius:99,marginBottom:4}}>
            <div style={{height:"100%",width:`${a}%`,background:colA,borderRadius:99}}/>
          </div>
          <span style={{fontSize:10,fontWeight:700,color:colA}}>{a}/100</span>
        </div>
        <div style={{width:80,flexShrink:0,padding:"7px 4px",background:`${T.sf}88`,borderBottom:`1px solid ${T.bd}`,display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>
          <span style={{fontSize:10}}>{icon}</span>
          <span style={{fontSize:8,color:T.mt,textAlign:"center",lineHeight:1.2}}>{label}</span>
        </div>
        <div style={{flex:1,padding:"7px 8px",background:T.sf,borderBottom:`1px solid ${T.bd}`,textAlign:"right"}}>
          <div style={{height:3,background:T.sb,borderRadius:99,marginBottom:4}}>
            <div style={{height:"100%",width:`${b}%`,background:colB,borderRadius:99,marginLeft:"auto"}}/>
          </div>
          <span style={{fontSize:10,fontWeight:700,color:colB}}>{b}/100</span>
        </div>
      </div>
    );
  };

  return (
    <div style={{paddingTop:66,minHeight:"100vh"}}>
      <div style={{maxWidth:540,margin:"0 auto",padding:"16px 0 80px"}}>

        {/* Header */}
        <div style={{padding:"0 18px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h1 style={{fontFamily:T.fd,fontSize:20,fontWeight:800,letterSpacing:"-1px"}}>⚖ Comparaison</h1>
          <button className="btn" onClick={()=>{setCompareA(null);setCompareB(null);nav("explore");}} style={{background:"none",fontSize:10,color:T.mt,padding:4}}>Effacer ✕</button>
        </div>

        {/* Column headers */}
        <div style={{display:"flex",gap:0,margin:"0 0 0 0"}}>
          <ColHd c={compareA} p={pA}/>
          <div style={{width:80,flexShrink:0}}/>
          <ColHd c={compareB} p={pB}/>
        </div>

        <div style={{borderRadius:"0 0 12px 12px",overflow:"hidden",margin:"0"}}>
          {/* Infos générales */}
          <CmpRow icon="⏱" label="Durée"       vA={compareA.dur} vB={compareB.dur}/>
          <CmpRow icon="💰" label="Coût"        vA={compareA.cost} vB={compareB.cost}/>
          <CmpRow icon="📊" label="Niveau"      vA={compareA.lv} vB={compareB.lv}/>
          <CmpRow icon="💼" label="Sal. junior" vA={compareA.sal.j} vB={compareB.sal.j}/>
          <CmpRow icon="📊" label="Sal. mid"    vA={compareA.sal.m} vB={compareB.sal.m}/>
          <CmpRow icon="📈" label="Sal. senior" vA={compareA.sal.s} vB={compareB.sal.s}/>
          <CmpRow icon="🎓" label="Jalons"      vA={`${compareA.ms.length} étapes`} vB={`${compareB.ms.length} étapes`}/>

          {/* Scores horizon */}
          {(hzA.ss!==undefined||compareA.ss)&&<ScoreRow icon="🛡" label="Sécurité" a={hzA.ss??compareA.ss??50} b={hzB.ss??compareB.ss??50}/>}
          {hzA.ai!==undefined&&<ScoreRow icon="🤖" label="Risque IA" a={hzA.ai??50} b={hzB.ai??50} invert/>}
          {hzA.gr!==undefined&&<ScoreRow icon="🚀" label="Croissance" a={hzA.gr??50} b={hzB.gr??50}/>}

          {/* Timeline Y5 / Y10 */}
          {(hzA.timeline||hzB.timeline)&&<>
            <CmpRow icon="📅" label="5 ans" vA={hzA.timeline?.y5||"—"} vB={hzB.timeline?.y5||"—"}/>
            <CmpRow icon="📅" label="10 ans" vA={hzA.timeline?.y10||"—"} vB={hzB.timeline?.y10||"—"}/>
          </>}
        </div>

        {/* Skills */}
        <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:0,marginTop:12,padding:"0 0 0 0"}}>
          <div style={{padding:"10px 12px",background:T.sf,borderRadius:"10px 0 0 10px",border:`1px solid ${T.bd}`}}>
            <div style={{fontSize:8,color:T.mt,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>Skills</div>
            {(compareA.sk||[]).slice(0,5).map((s,i)=><div key={i} style={{fontSize:9,color:compareA.c,marginBottom:3,padding:"2px 6px",background:compareA.c+"12",borderRadius:99,display:"inline-block",marginRight:3}}>{s}</div>)}
          </div>
          <div style={{width:80,background:T.sfh,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:16}}>⚡</span></div>
          <div style={{padding:"10px 12px",background:T.sf,borderRadius:"0 10px 10px 0",border:`1px solid ${T.bd}`,textAlign:"right"}}>
            <div style={{fontSize:8,color:T.mt,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>Skills</div>
            {(compareB.sk||[]).slice(0,5).map((s,i)=><div key={i} style={{fontSize:9,color:compareB.c,marginBottom:3,padding:"2px 6px",background:compareB.c+"12",borderRadius:99,display:"inline-block",marginLeft:3}}>{s}</div>)}
          </div>
        </div>

        {/* Verdict horizon */}
        {(hzA.verdict||hzB.verdict)&&(
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12,padding:"0 0 0 0"}}>
            {[{hz:hzA,c:compareA},{hz:hzB,c:compareB}].map(({hz,c},i)=>hz.verdict&&(
              <div key={i} style={{background:T.sf,border:`1px solid ${c.c}20`,borderRadius:10,padding:"10px",borderTop:`2px solid ${c.c}44`}}>
                <div style={{fontSize:8,color:T.mt,fontWeight:700,letterSpacing:"1px",textTransform:"uppercase",marginBottom:5}}>Verdict</div>
                <p style={{fontSize:9,color:T.tx,lineHeight:1.5}}>{hz.verdict}</p>
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:14,padding:"0 0 0 0"}}>
          <button className="btn" onClick={()=>nav("career",compareA.id)} style={{background:compareA.c,color:"#080808",borderRadius:10,padding:"11px",fontSize:11,fontWeight:700,textAlign:"center"}}>{compareA.e} Voir {compareA.t.split(" ").slice(0,2).join(" ")}</button>
          <button className="btn" onClick={()=>nav("career",compareB.id)} style={{background:compareB.c,color:"#080808",borderRadius:10,padding:"11px",fontSize:11,fontWeight:700,textAlign:"center"}}>{compareB.e} Voir {compareB.t.split(" ").slice(0,2).join(" ")}</button>
        </div>

      </div>
    </div>
  );
};

const Sec = ({t, children}) => <div style={{marginBottom:14}}><h2 style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>{t}</h2>{children}</div>;
