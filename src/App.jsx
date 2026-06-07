import { useState, useEffect, createContext, useContext } from "react";

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
{p:"Sécurité Défensive + Certif",d:"4 mois",mo:"Mois 9–12",i:"🛡",obj:"Défendre et certifier.",tasks:["SIEM (Splunk/ELK)","Incident Response","SOC workflow","Préparer CEH ou CompTIA Security+"],dh:["30 min SIEM","1 scénario incident","Préparer certif (30 min)","1 article threat intel"],res:[{n:"CompTIA Security+",u:"https://comptia.org/certifications/security",co:"~350€ examen",du:"~60h prépa",lv:"Intermédiaire",de:"Certification cybersécurité de référence."}],val:["Certification obtenue","SIEM maîtrisé","IR process documenté","SOC workflow compris"],sku:["SIEM","Incident Response","Certification"],co:"~350€",cd:"Examen CompTIA."}
]},
productmanager:{id:"productmanager",e:"📦",t:"Product Manager",c:"#8B5CF6",cat:"tech",dur:"18 mois",cost:"200–1500€",lv:"Intermédiaire",sal:{j:"38–45K€",m:"50–70K€",s:"75–110K€"},tag:"Le pont entre tech et business.",sk:["Discovery","Roadmap","Agile","Analytics","Stakeholder management"],ss:82,ms:[
{p:"Fondations Produit",d:"3 mois",mo:"Mois 1–3",i:"📚",obj:"Comprendre le métier.",tasks:["Lire Inspired (Marty Cagan)","Frameworks : Jobs-to-be-Done, Lean Canvas","User stories et acceptance criteria","Agile/Scrum/Kanban"],dh:["30 min lecture produit","1 user story","1 article Product School","Analyser 1 feature"],res:[{n:"Product School",u:"https://productschool.com/blog",co:"Gratuit",du:"Référence",lv:"Débutant",de:"Blog et ressources PM."}],val:["Frameworks maîtrisés","10 user stories écrites","Agile compris","1 PRD rédigé"],sku:["Discovery","User Stories","Agile","Roadmap"],co:"~30€",cd:"Livre Inspired."},
{p:"Pratique & Analytics",d:"4 mois",mo:"Mois 4–7",i:"📊",obj:"Piloter par les données.",tasks:["Mixpanel/Amplitude","A/B testing","SQL basique pour PM","Priorisation (RICE, MoSCoW)","Stakeholder management"],dh:["Check métriques (15 min)","1 hypothèse produit","1 requête SQL","1 priorisation"],res:[{n:"Lenny's Newsletter",u:"https://lennysnewsletter.com",co:"Gratuit/Payant",du:"Hebdo",lv:"Intermédiaire",de:"La meilleure newsletter produit."}],val:["Dashboard produit configuré","1 A/B test lancé","SQL basique","Roadmap priorisée"],sku:["Analytics produit","A/B testing","SQL","Priorisation"],co:"0€",cd:"Outils gratuits."},
{p:"1er poste PM",d:"Dès mois 8",mo:"Mois 8–18",i:"🎯",obj:"Décrocher un poste PM.",tasks:["Portfolio PM (3 case studies)","Préparer les entretiens PM","Product sense exercises","Postuler startup/scaleup"],dh:["1 case study PM","1 exercise product sense","2 candidatures","1 mock interview"],res:[{n:"Exponent PM",u:"https://tryexponent.com",co:"Gratuit/Payant",du:"~30h",lv:"Intermédiaire",de:"Préparation entretiens PM."}],val:["3 case studies","5+ entretiens","Offre reçue","Poste PM décroché"],sku:["Entretien PM","Product sense","Communication"],co:"0–50€",cd:"Exponent gratuit pour débuter."}
]},
devops:{id:"devops",e:"⚙️",t:"DevOps / Cloud Engineer",c:"#06B6D4",cat:"tech",dur:"18 mois",cost:"300–2000€",lv:"Intermédiaire",sal:{j:"40–48K€",m:"55–75K€",s:"80–110K€"},tag:"L'infrastructure qui scale.",sk:["Docker","Kubernetes","CI/CD","AWS/GCP","Terraform","Linux"],ss:88,ms:[
{p:"Linux & Conteneurs",d:"4 mois",mo:"Mois 1–4",i:"🐧",obj:"Linux et Docker.",tasks:["Administration Linux avancée","Docker : images, containers, compose","Networking Docker","Registries"],dh:["30 min Linux","1 Dockerfile","1 docker-compose","1 article DevOps"],res:[{n:"Docker Docs",u:"https://docs.docker.com",co:"Gratuit",du:"~40h",lv:"Intermédiaire",de:"Documentation officielle Docker."}],val:["Linux admin maîtrisé","Docker multi-container","Compose complexe","Registry privé"],sku:["Linux avancé","Docker","Docker Compose"],co:"0€",cd:"Docker gratuit."},
{p:"Cloud & Orchestration",d:"4 mois",mo:"Mois 5–8",i:"☁️",obj:"Cloud et Kubernetes.",tasks:["AWS ou GCP fondamentaux","Kubernetes : pods, services, deployments","Terraform infrastructure as code","Monitoring (Prometheus, Grafana)"],dh:["30 min cloud","1 déploiement K8s","1 module Terraform","Check monitoring"],res:[{n:"AWS Free Tier",u:"https://aws.amazon.com/free",co:"Gratuit 12 mois",du:"~60h",lv:"Intermédiaire",de:"Tier gratuit AWS pour apprendre."}],val:["Certif cloud obtenue","K8s en production","Terraform maîtrisé","Monitoring configuré"],sku:["AWS/GCP","Kubernetes","Terraform","Monitoring"],co:"0–50€/mois",cd:"Free tier cloud."},
{p:"CI/CD & SRE",d:"4 mois",mo:"Mois 9–12",i:"🔄",obj:"Pipelines et fiabilité.",tasks:["GitHub Actions / GitLab CI","Pipeline complet build→test→deploy","SRE : SLI, SLO, SLA","Incident management"],dh:["Améliorer 1 pipeline","1 test automatisé","Check SLOs","1 article SRE"],res:[{n:"Google SRE Book",u:"https://sre.google/sre-book/table-of-contents",co:"Gratuit",du:"~30h",lv:"Intermédiaire",de:"Le livre SRE de Google, gratuit en ligne."}],val:["Pipeline end-to-end","99.9% uptime","Incident process","Infra as code complète"],sku:["CI/CD","SRE","Incident Management"],co:"0€",cd:"Tout gratuit."}
]},
datascientist:{id:"datascientist",e:"🤖",t:"Data Scientist / ML",c:"#7C3AED",cat:"tech",dur:"24 mois",cost:"500–3000€",lv:"Avancé",sal:{j:"40–50K€",m:"55–75K€",s:"80–130K€"},tag:"Intelligence artificielle appliquée.",sk:["Python","ML","Deep Learning","Stats avancées","NLP","MLOps"],ss:85,ms:[
{p:"Maths & Stats avancées",d:"4 mois",mo:"Mois 1–4",i:"📐",obj:"Les fondations mathématiques.",tasks:["Algèbre linéaire","Probabilités et statistiques inférentielles","Calcul différentiel","Python scientifique (NumPy, SciPy)"],dh:["30 min maths","1 exercice stats","1 notebook NumPy","Khan Academy (20 min)"],res:[{n:"3Blue1Brown",u:"https://3blue1brown.com",co:"Gratuit",du:"~30h",lv:"Intermédiaire",de:"Vidéos maths visuelles exceptionnelles."}],val:["Algèbre linéaire maîtrisé","Stats inférentielles","Distributions comprises","NumPy/SciPy fluide"],sku:["Algèbre linéaire","Stats avancées","Python scientifique"],co:"0€",cd:"Tout gratuit."},
{p:"Machine Learning",d:"5 mois",mo:"Mois 5–9",i:"🧠",obj:"Algorithmes ML classiques.",tasks:["Scikit-learn : régression, classification, clustering","Feature engineering","Validation croisée, métriques","Projets Kaggle"],dh:["30 min scikit-learn","1 feature engineering","1 modèle entraîné","1 soumission Kaggle"],res:[{n:"Fast.ai",u:"https://fast.ai",co:"Gratuit",du:"~80h",lv:"Intermédiaire",de:"Cours ML/DL pratique, top-down."}],val:["5 algorithmes maîtrisés","Kaggle top 20%","Pipeline ML complet","Métriques comprises"],sku:["Scikit-learn","Feature engineering","Kaggle","ML Pipeline"],co:"0€",cd:"Kaggle et Fast.ai gratuits."},
{p:"Deep Learning & Spécialisation",d:"5 mois",mo:"Mois 10–14",i:"🔬",obj:"Réseaux de neurones.",tasks:["PyTorch ou TensorFlow","CNN pour la vision","NLP : transformers, BERT","MLOps : déploiement modèles"],dh:["30 min PyTorch","1 architecture réseau","1 paper résumé","1 modèle déployé"],res:[{n:"DeepLearning.AI",u:"https://deeplearning.ai",co:"Gratuit/~40€/mois",du:"~100h",lv:"Intermédiaire",de:"Cours Andrew Ng référence."}],val:["CNN fonctionnel","NLP model déployé","MLOps pipeline","1 paper reproduit"],sku:["PyTorch","Deep Learning","NLP","MLOps"],co:"0–40€/mois",cd:"Cours Coursera."}
]},
devmobile:{id:"devmobile",e:"📱",t:"Développeur Mobile",c:"#10B981",cat:"tech",dur:"18 mois",cost:"500–2000€",lv:"Intermédiaire",sal:{j:"35–42K€",m:"45–65K€",s:"65–95K€"},tag:"Apps iOS & Android.",sk:["React Native","Swift","Kotlin","Flutter","Firebase"],ss:75,ms:[
{p:"Fondations Mobile",d:"3 mois",mo:"Mois 1–3",i:"📱",obj:"Comprendre le mobile.",tasks:["React Native ou Flutter","Navigation","State management","APIs REST","UI mobile patterns"],dh:["30 min React Native/Flutter","1 écran","1 composant natif","1 article mobile"],res:[{n:"React Native Docs",u:"https://reactnative.dev",co:"Gratuit",du:"~50h",lv:"JS intermédiaire",de:"Documentation officielle RN."}],val:["App 3+ écrans","Navigation fluide","API intégrée","UI responsive"],sku:["React Native","Navigation","Mobile UI"],co:"0€",cd:"RN gratuit."},
{p:"Features avancées",d:"4 mois",mo:"Mois 4–7",i:"🔔",obj:"Push, stockage, animations.",tasks:["Push notifications","Stockage local (AsyncStorage/SQLite)","Animations","Camera/GPS","Publication stores"],dh:["1 feature avancée","1 animation","Tester sur device","1 bug fix"],res:[{n:"Expo Docs",u:"https://docs.expo.dev",co:"Gratuit",du:"~30h",lv:"Intermédiaire",de:"Framework React Native simplifié."}],val:["Push fonctionnels","Stockage offline","Animations fluides","App publiée sur store"],sku:["Push","Stockage local","Animations","App Store"],co:"25€/an iOS + gratuit Android",cd:"Compte développeur Apple 99$/an."},
{p:"1er poste Mobile",d:"Dès mois 8",mo:"Mois 8–18",i:"🎯",obj:"Développeur mobile junior.",tasks:["Portfolio 3 apps","Tests mobile","Performance","CI/CD mobile"],dh:["1h code mobile","1 test","Optimiser performance","1 candidature"],res:[{n:"LinkedIn Jobs Mobile",u:"https://linkedin.com/jobs",co:"Gratuit",du:"Quotidien",lv:"Tous",de:"Offres développeur mobile."}],val:["3 apps portfolio","Tests >60%","App store publiée","Offre reçue"],sku:["Testing mobile","Performance","CI/CD"],co:"0€",cd:"LinkedIn gratuit."}
]},
psychologue:{id:"psychologue",e:"🧠",t:"Psychologue",c:"#EC4899",cat:"health",dur:"60 mois",cost:"3000–15000€",lv:"Exigeant",sal:{j:"25–32K€",m:"35–50K€",s:"55–90K€"},tag:"Accompagner l'humain.",sk:["Psychologie clinique","Thérapie","Évaluation","Écoute","Éthique"],ss:90,ms:[
{p:"Licence Psycho",d:"3 ans",mo:"Années 1–3",i:"📚",obj:"Fondamentaux.",tasks:["Psychologie cognitive, sociale, développementale","Méthodologie recherche","Statistiques","Stages observation"],dh:["1h révision","1 article PsycINFO","1 fiche concept","1 cas clinique"],res:[{n:"APA PsycNet",u:"https://psycnet.apa.org",co:"Via université",du:"Référence",lv:"Étudiant",de:"Base de données recherche psycho."}],val:["Licence validée","Méthodologie maîtrisée","Stats comprises","2 stages"],sku:["Psychologie générale","Méthodologie","Stats"],co:"~500€/an",cd:"Université publique."},
{p:"Master + Stage pro",d:"2 ans",mo:"Années 4–5",i:"🎓",obj:"Spécialisation + titre.",tasks:["Spécialisation (clinique, travail, neuro)","Stage 500h","Mémoire de recherche","Titre de psychologue"],dh:["1h spécialisation","Préparer stage","Mémoire (30 min)","1 supervision"],res:[{n:"SFP",u:"https://sfpsy.org",co:"Cotisation",du:"Référence",lv:"Étudiant M2",de:"Société Française de Psychologie."}],val:["Master validé","500h stage","Mémoire soutenu","Titre obtenu"],sku:["Spécialisation","Clinique","Recherche"],co:"~500€/an",cd:"Stage rémunéré."},
{p:"Installation",d:"Variable",mo:"Post-Master",i:"💼",obj:"Exercer.",tasks:["Inscription ADELI","Cabinet ou institution","Supervision continue","Formation continue"],dh:["1 consultation","1 supervision","1 article clinique","1 formation"],res:[{n:"Psychologue.net",u:"https://psychologue.net",co:"Payant listing",du:"Outil",lv:"Diplômé",de:"Annuaire et visibilité."}],val:["Inscrit ADELI","Patientèle constituée","Supervision régulière","Formation continue"],sku:["Installation","Patientèle","Supervision"],co:"Variable",cd:"Cabinet ~500€/mois."}
]},
kine:{id:"kine",e:"💪",t:"Kinésithérapeute",c:"#14B8A6",cat:"health",dur:"60 mois",cost:"5000–40000€",lv:"Très exigeant",sal:{j:"28–35K€",m:"40–55K€",s:"60–120K€"},tag:"Rééduquer par le mouvement.",sk:["Anatomie","Rééducation","Massage","Biomécanique","Relation patient"],ss:95,ms:[
{p:"PACES/LAS + IFMK",d:"5 ans",mo:"Années 1–5",i:"📚",obj:"Diplôme d'État.",tasks:["1ère année santé (PACES/LAS)","4 ans IFMK","Anatomie, physiologie","Stages cliniques","Mémoire"],dh:["2h révision","1 technique manuelle","Anatomie (30 min)","Prépa stage"],res:[{n:"FNEK",u:"https://fnek.fr",co:"Gratuit",du:"Référence",lv:"Étudiant",de:"Fédération étudiants kiné."}],val:["DE obtenu","Stages validés","Techniques maîtrisées","Mémoire soutenu"],sku:["Anatomie","Rééducation","Techniques manuelles"],co:"Variable",cd:"Public ~500€/an, privé 5–10K€/an."},
{p:"Exercice + Spécialisation",d:"Variable",mo:"Post-diplôme",i:"💼",obj:"Exercer et se spécialiser.",tasks:["Libéral ou salarié","Spécialisation (sport, neuro, respiratoire)","Formation continue","Cabinet"],dh:["Consultations","1 formation","1 article kiné","Réseau pro"],res:[{n:"Ordre des Kinés",u:"https://ordremk.fr",co:"~300€/an",du:"Obligatoire",lv:"Diplômé",de:"Inscription obligatoire."}],val:["Patientèle constituée","Spécialisation","Formation continue","CA stable"],sku:["Spécialisation","Installation","Patientèle"],co:"~300€/an",cd:"Cotisation Ordre."}
]},
aidesoignant:{id:"aidesoignant",e:"❤️",t:"Aide-soignant(e)",c:"#F43F5E",cat:"health",dur:"12 mois",cost:"Quasi gratuit",lv:"Accessible",sal:{j:"22–25K€",m:"26–30K€",s:"30–35K€"},tag:"Au cœur du soin.",sk:["Soins de base","Hygiène","Communication","Observation"],ss:98,ms:[
{p:"Formation DEAS",d:"10 mois",mo:"Formation",i:"📚",obj:"Obtenir le DEAS.",tasks:["8 modules théoriques","Stages en EHPAD, hôpital","Soins d'hygiène et confort","Relation patient"],dh:["1h révision","Pratiquer gestes","Portfolio stage","1 fiche de soin"],res:[{n:"IFAS Info",u:"https://sante.gouv.fr",co:"Gratuit (public)",du:"10 mois",lv:"Aucun diplôme requis",de:"Formation en IFAS."}],val:["DEAS obtenu","Stages validés","Gestes maîtrisés","Posture professionnelle"],sku:["Soins de base","Hygiène","Relation patient"],co:"Gratuit",cd:"Formation publique."},
{p:"Exercice + Évolution",d:"Variable",mo:"Post-DEAS",i:"💼",obj:"Exercer et évoluer.",tasks:["Hôpital, EHPAD, domicile","Passerelle vers IFSI (IDE)","Formation continue","Spécialisation service"],dh:["Soins quotidiens","1 protocole","Formation continue","Réseau pro"],res:[{n:"ANFH",u:"https://anfh.fr",co:"Gratuit",du:"Variable",lv:"AS diplômé",de:"Formation continue hospitalière."}],val:["Autonome en service","Passerelle IDE envisagée","Formation continue","Réseau actif"],sku:["Autonomie","Spécialisation","Évolution"],co:"0€",cd:"Formation par l'employeur."}
]},
electricien:{id:"electricien",e:"⚡",t:"Électricien / Plombier",c:"#EAB308",cat:"craft",dur:"24 mois",cost:"500–5000€",lv:"Accessible",sal:{j:"24–30K€",m:"32–42K€",s:"45–70K€"},tag:"Pénurie historique, très bien payé.",sk:["Installations","Normes NF C 15-100","Dépannage","Lecture de plans"],ss:95,ms:[
{p:"CAP/BEP ou Formation adulte",d:"12–24 mois",mo:"Formation",i:"📚",obj:"Diplôme + habilitations.",tasks:["CAP Électricien ou formation reconversion","Habilitations électriques","Normes NF C 15-100","Stages en entreprise"],dh:["1h pratique","Normes (30 min)","Schémas électriques","Sécurité"],res:[{n:"AFPA",u:"https://afpa.fr",co:"Finançable CPF",du:"12–24 mois",lv:"Aucun",de:"Formation professionnelle adulte."}],val:["CAP obtenu","Habilitations","Normes maîtrisées","Stage validé"],sku:["Installation","Normes","Habilitations","Sécurité"],co:"Finançable CPF",cd:"CPF ou Pôle Emploi."},
{p:"Artisan / Entreprise",d:"Variable",mo:"Post-diplôme",i:"🔧",obj:"S'installer ou salarier.",tasks:["Expérience en entreprise","Création d'entreprise (auto-entrepreneur)","Devis et facturation","Clientèle"],dh:["Chantiers","1 devis","Comptabilité","Réseau"],res:[{n:"FFB",u:"https://ffbatiment.fr",co:"Cotisation",du:"Référence",lv:"Pro",de:"Fédération Française du Bâtiment."}],val:["Autonome sur chantier","Clientèle fidèle","CA en croissance","Réseau artisans"],sku:["Entrepreneuriat","Devis","Clientèle"],co:"Variable",cd:"Auto-entrepreneur ~0€."}
]},
boulanger:{id:"boulanger",e:"🥖",t:"Boulanger / Pâtissier",c:"#D97706",cat:"craft",dur:"24 mois",cost:"1000–8000€",lv:"Accessible",sal:{j:"22–26K€",m:"28–35K€",s:"40–80K€"},tag:"Métier passion, franchise possible.",sk:["Pétrissage","Fermentation","Pâtisserie","Gestion","Hygiène HACCP"],ss:90,ms:[
{p:"CAP Boulanger/Pâtissier",d:"12–24 mois",mo:"Formation",i:"📚",obj:"Le diplôme fondamental.",tasks:["CAP en 1 ou 2 ans","Techniques de base","Hygiène HACCP","Stages en boulangerie"],dh:["Pratiquer pâte (1h)","1 recette","Hygiène (15 min)","Prépa stage"],res:[{n:"INBP",u:"https://inbp.com",co:"Variable",du:"12–24 mois",lv:"Aucun",de:"Institut National Boulangerie Pâtisserie."}],val:["CAP obtenu","Techniques maîtrisées","HACCP validé","Stage réussi"],sku:["Pétrissage","Fermentation","Pâtisserie","HACCP"],co:"Variable",cd:"Finançable CPF/région."},
{p:"Expérience + Installation",d:"Variable",mo:"Post-CAP",i:"🏪",obj:"Ouvrir sa boulangerie.",tasks:["2–3 ans d'expérience","Business plan","Local et matériel","Clientèle"],dh:["Production quotidienne","1 nouvelle recette/sem","Gestion (30 min)","Réseau"],res:[{n:"CMA",u:"https://cma-france.fr",co:"Gratuit",du:"Référence",lv:"Artisan",de:"Chambre des Métiers et de l'Artisanat."}],val:["Expérience solide","Business plan","Boulangerie ouverte","Clientèle fidèle"],sku:["Gestion","Entrepreneuriat","Créativité"],co:"50–200K€",cd:"Prêt bancaire."}
]},
coiffeur:{id:"coiffeur",e:"✂️",t:"Coiffeur / Barbier",c:"#A855F7",cat:"craft",dur:"24 mois",cost:"500–5000€",lv:"Accessible",sal:{j:"20–24K€",m:"26–32K€",s:"35–60K€"},tag:"Accessible, entrepreneuriat rapide.",sk:["Coupe","Coloration","Barbe","Relation client","Gestion salon"],ss:88,ms:[
{p:"CAP Coiffure",d:"12–24 mois",mo:"Formation",i:"✂️",obj:"Le diplôme.",tasks:["CAP Coiffure","Techniques de coupe et coloration","Relation client","Hygiène"],dh:["Pratiquer coupe (1h)","1 technique coloration","Client fictif","Tendances"],res:[{n:"CNEC",u:"https://cnec.asso.fr",co:"Variable",du:"12–24 mois",lv:"Aucun",de:"Conseil National Entreprises Coiffure."}],val:["CAP obtenu","Coupes maîtrisées","Colorations","Clients satisfaits"],sku:["Coupe","Coloration","Relation client"],co:"Variable",cd:"Finançable."},
{p:"BP + Installation",d:"Variable",mo:"Post-CAP",i:"💈",obj:"Ouvrir son salon.",tasks:["BP Coiffure (pour ouvrir)","Expérience en salon","Business plan","Local"],dh:["Coupes clients","1 nouvelle technique","Gestion (20 min)","Réseau"],res:[{n:"L'Oréal Professionnel",u:"https://lorealprofessionnel.fr",co:"Formation continue",du:"Variable",lv:"Coiffeur",de:"Formations techniques avancées."}],val:["BP obtenu","Salon ouvert","Clientèle fidèle","CA croissant"],sku:["Gestion salon","Entrepreneuriat","Tendances"],co:"20–80K€",cd:"Prêt ou franchise."}
]},
prof:{id:"prof",e:"👩‍🏫",t:"Professeur des écoles",c:"#3B82F6",cat:"education",dur:"60 mois",cost:"500–3000€",lv:"Exigeant",sal:{j:"24–28K€",m:"30–38K€",s:"38–48K€"},tag:"Vocation et stabilité.",sk:["Pédagogie","Didactique","Gestion de classe","Programmes","Psychologie enfant"],ss:92,ms:[
{p:"Licence + MEEF",d:"5 ans",mo:"Années 1–5",i:"📚",obj:"Concours CRPE.",tasks:["Licence (toute discipline)","Master MEEF","Préparation CRPE","Stages en école","Mémoire"],dh:["1h révision CRPE","1 exercice maths/français","Séquence pédagogique","1 article éducation"],res:[{n:"Devenir Enseignant",u:"https://devenirenseignant.gouv.fr",co:"Gratuit",du:"Référence",lv:"Étudiant",de:"Site officiel recrutement Éducation Nationale."}],val:["CRPE réussi","Master MEEF validé","Stages validés","Titularisation"],sku:["Pédagogie","Didactique","Gestion de classe"],co:"~500€/an",cd:"Université publique."},
{p:"Titularisation + Carrière",d:"Variable",mo:"Post-concours",i:"🎓",obj:"Enseigner et évoluer.",tasks:["Année de stage","Titularisation","Formation continue","Spécialisation possible (directeur, RASED)"],dh:["Préparer classe","1 activité innovante","Formation (30 min)","Réseau enseignants"],res:[{n:"CANOPE",u:"https://reseau-canope.fr",co:"Gratuit",du:"Référence",lv:"Enseignant",de:"Réseau de création et d'accompagnement pédagogique."}],val:["Titularisé","Classes gérées","Formation continue","Projets pédagogiques"],sku:["Gestion classe","Innovation pédagogique","Formation continue"],co:"0€",cd:"Fonctionnaire."}
]},
agentimmo:{id:"agentimmo",e:"🏠",t:"Agent immobilier",c:"#F97316",cat:"business",dur:"6–12 mois",cost:"200–2000€",lv:"Accessible",sal:{j:"24–30K€+com",m:"35–55K€",s:"60–120K€+"},tag:"Accessible, hauts revenus possibles.",sk:["Prospection","Négociation","Droit immobilier","Estimation","Relation client"],ss:78,ms:[
{p:"Formation + Carte T",d:"3–6 mois",mo:"Mois 1–6",i:"📚",obj:"Les bases du métier.",tasks:["Loi Hoguet et réglementation","Estimation immobilière","Techniques de vente immo","Obtenir carte T ou travailler sous carte d'un réseau"],dh:["1h formation immo","1 annonce analysée","1 simulation estimation","Droit immo (20 min)"],res:[{n:"FNAIM",u:"https://fnaim.fr",co:"Cotisation",du:"Référence",lv:"Débutant",de:"Fédération Nationale Agents Immobiliers."}],val:["Formation validée","Carte T ou réseau","Estimation maîtrisée","Droit immo compris"],sku:["Droit immobilier","Estimation","Vente"],co:"200–2000€",cd:"Formation obligatoire."},
{p:"Terrain + Performance",d:"6+ mois",mo:"Mois 7–12",i:"🏠",obj:"Premières ventes.",tasks:["Prospection terrain et téléphonique","Visites et négociation","Closing","Fidélisation et recommandations"],dh:["10 appels prospection","2 visites","1 estimation","Suivi clients"],res:[{n:"SeLoger Pro",u:"https://seloger.com",co:"Payant",du:"Outil",lv:"Agent",de:"Plateforme annonces immobilières."}],val:["10 mandats signés","5 ventes conclues","Commission >3K€/mois","Recommandations reçues"],sku:["Prospection","Négociation","Closing","Réseau"],co:"Variable",cd:"Commissions."}
]},
photographe:{id:"photographe",e:"📸",t:"Photographe / Vidéaste",c:"#8B5CF6",cat:"creative",dur:"12 mois",cost:"2000–8000€",lv:"Accessible",sal:{j:"20–28K€",m:"30–45K€",s:"50–80K€"},tag:"Capturer des moments.",sk:["Cadrage","Lumière","Retouche","Montage vidéo","Direction artistique"],ss:60,ms:[
{p:"Technique & Portfolio",d:"6 mois",mo:"Mois 1–6",i:"📷",obj:"Maîtriser l'outil.",tasks:["Mode manuel (ISO, ouverture, vitesse)","Composition et cadrage","Lightroom et Photoshop","Construire un portfolio de 20 photos","Vidéo : bases de montage"],dh:["1 shooting (30 min)","Retoucher 3 photos","1 tutoriel technique","1 photo portfolio"],res:[{n:"Peter McKinnon YT",u:"https://youtube.com/@PeterMcKinnon",co:"Gratuit",du:"Référence",lv:"Débutant",de:"Tutoriels photo/vidéo de qualité."}],val:["Mode manuel maîtrisé","Portfolio 20 photos","Lightroom fluide","1 vidéo montée"],sku:["Technique photo","Retouche","Composition","Montage"],co:"2000–5000€",cd:"Appareil + logiciels."},
{p:"Clients & Business",d:"6 mois",mo:"Mois 7–12",i:"💼",obj:"Premiers clients payants.",tasks:["Niche choisie (mariage, corporate, produit)","Tarification","Site web portfolio","Prospection","5 clients payants"],dh:["1 shooting client","1 retouche","1 post Instagram","1 prospection"],res:[{n:"Malt",u:"https://malt.fr",co:"Gratuit",du:"Quotidien",lv:"Tous",de:"Freelance n°1 France."}],val:["Niche définie","5 clients payants","Site en ligne","Recommandations"],sku:["Business photo","Tarification","Prospection"],co:"~500€",cd:"Site web + marketing."}
]},
redacteur:{id:"redacteur",e:"✍️",t:"Rédacteur / Journaliste web",c:"#6366F1",cat:"creative",dur:"12 mois",cost:"0–500€",lv:"Accessible",sal:{j:"22–28K€",m:"30–40K€",s:"42–60K€"},tag:"Content is king.",sk:["Rédaction web","SEO","Storytelling","CMS","Recherche"],ss:55,ms:[
{p:"Écriture & SEO",d:"4 mois",mo:"Mois 1–4",i:"📝",obj:"Écrire pour le web.",tasks:["Rédaction web : pyramide inversée, accroches","SEO : mots-clés, balises, structure","WordPress/CMS","10 articles publiés"],dh:["Écrire 500 mots","1 recherche mots-clés","1 article optimisé","Lire 1 article concurrent"],res:[{n:"Yoast SEO Blog",u:"https://yoast.com/seo-blog",co:"Gratuit",du:"Référence",lv:"Débutant",de:"Guide SEO rédactionnel."}],val:["10 articles publiés","1 article top 10 Google","SEO basique maîtrisé","CMS maîtrisé"],sku:["Rédaction web","SEO","WordPress"],co:"0€",cd:"WordPress gratuit."},
{p:"Freelance & Spécialisation",d:"Dès mois 5",mo:"Mois 5–12",i:"💼",obj:"Vivre de l'écriture.",tasks:["Malt/Fiverr/LinkedIn","Niche (tech, finance, santé)","Tarification au mot/article","Portfolio en ligne"],dh:["Écrire 1000 mots","1 prospection","1 article client","1 post LinkedIn"],res:[{n:"Malt",u:"https://malt.fr",co:"Gratuit",du:"Quotidien",lv:"Tous",de:"Plateforme freelance."}],val:["10 clients","TJM >200€","Niche identifiée","Revenus stables"],sku:["Freelance","Spécialisation","Tarification"],co:"0€",cd:"Tout gratuit."}
]},
graphiste:{id:"graphiste",e:"🎨",t:"Graphiste / Directeur artistique",c:"#EC4899",cat:"creative",dur:"18 mois",cost:"500–5000€",lv:"Accessible",sal:{j:"24–30K€",m:"32–45K€",s:"48–70K€"},tag:"Identités visuelles mémorables.",sk:["Adobe Suite","Identité visuelle","Typographie","Print","Direction artistique"],ss:62,ms:[
{p:"Outils & Fondamentaux",d:"6 mois",mo:"Mois 1–6",i:"🖌",obj:"Maîtriser les outils.",tasks:["Illustrator : dessin vectoriel","Photoshop : retouche et composition","InDesign : mise en page","Théorie du design graphique","Portfolio 10 projets"],dh:["30 min Illustrator","1 création","1 tutoriel","1 projet portfolio"],res:[{n:"Domestika",u:"https://domestika.org",co:"~10€/cours",du:"Variable",lv:"Débutant",de:"Cours créatifs de qualité."}],val:["Adobe Suite maîtrisée","Portfolio 10 projets","Identité visuelle créée","Print maîtrisé"],sku:["Illustrator","Photoshop","InDesign","Design graphique"],co:"~500€",cd:"Adobe ~24€/mois."},
{p:"Clients & DA",d:"Dès mois 7",mo:"Mois 7–18",i:"💼",obj:"Direction artistique.",tasks:["Branding complet","Brief créatif","Direction artistique","Freelance ou agence"],dh:["1 projet client","1 brief créatif","1 moodboard","1 prospection"],res:[{n:"Behance",u:"https://behance.net",co:"Gratuit",du:"Référence",lv:"Tous",de:"Portfolio et inspiration."}],val:["5 identités créées","Clients récurrents","DA sur 1 projet","Tarifs stabilisés"],sku:["Branding","Direction artistique","Freelance"],co:"0€",cd:"Behance gratuit."}
]},
consultant:{id:"consultant",e:"💼",t:"Consultant en management",c:"#0EA5E9",cat:"business",dur:"36–60 mois",cost:"5000–30000€",lv:"Très exigeant",sal:{j:"38–48K€",m:"55–85K€",s:"100–200K€+"},tag:"McKinsey path.",sk:["Analyse stratégique","PowerPoint","Excel","Problem solving","Communication"],ss:72,ms:[
{p:"Grande école / Master",d:"3–5 ans",mo:"Formation",i:"🎓",obj:"Diplôme top.",tasks:["École de commerce ou ingénieur","Stages en cabinet","Case studies","Réseau alumni"],dh:["1 case study","Pratiquer Excel","1 article stratégie","Réseau"],res:[{n:"Case In Point",u:"https://amazon.fr",co:"~30€",du:"~20h",lv:"Étudiant",de:"LA bible des case studies consulting."}],val:["Master obtenu","2 stages cabinet","Cases maîtrisés","Réseau développé"],sku:["Analyse stratégique","Case studies","Excel avancé"],co:"5000–15000€/an",cd:"Grande école."},
{p:"Junior → Manager",d:"3–5 ans",mo:"Post-diplôme",i:"📈",obj:"Gravir les échelons.",tasks:["Intégrer un cabinet (Big 3, Big 4, boutique)","Missions terrain","Management d'équipe","Business development"],dh:["1 slide deck","1 analyse client","Mentor junior","1 proposition"],res:[{n:"McKinsey Insights",u:"https://mckinsey.com/featured-insights",co:"Gratuit",du:"Référence",lv:"Consultant",de:"Articles stratégiques de référence."}],val:["Promu Manager","Portfolio clients","Équipe managée","Revenue généré"],sku:["Management","Business dev","Leadership"],co:"0€",cd:"Entreprise paie."}
]},
trader:{id:"trader",e:"📈",t:"Trader / Analyste financier",c:"#10B981",cat:"finance",dur:"36–60 mois",cost:"5000–30000€",lv:"Très exigeant",sal:{j:"40–55K€",m:"70–120K€",s:"150–500K€+"},tag:"Marchés financiers.",sk:["Analyse financière","Bloomberg","Modélisation","Risk management","VBA/Python"],ss:68,ms:[
{p:"Formation Finance",d:"3–5 ans",mo:"Formation",i:"🎓",obj:"Master Finance.",tasks:["Grande école ou Master Finance","CFA Level 1","Modélisation financière Excel","Bloomberg","Stage en salle de marchés"],dh:["1h modélisation","Bloomberg (30 min)","1 analyse financière","CFA prep"],res:[{n:"CFA Institute",u:"https://cfainstitute.org",co:"~1000€/niveau",du:"~300h/niveau",lv:"Bac+3 minimum",de:"Certification finance mondiale."}],val:["Master obtenu","CFA Level 1","Stage validé","Modèles maîtrisés"],sku:["Analyse financière","Bloomberg","Modélisation","CFA"],co:"Variable",cd:"École + CFA."},
{p:"Junior → Senior",d:"3–5 ans",mo:"Post-diplôme",i:"📊",obj:"Performer en salle.",tasks:["Intégrer banque/hedge fund","Track record","P&L positif","Spécialisation (actions, taux, FX, commodities)"],dh:["Analyse marchés","1 trade thesis","Risk management","1 article macro"],res:[{n:"Financial Times",u:"https://ft.com",co:"~30€/mois",du:"Quotidien",lv:"Pro",de:"Journal financier de référence."}],val:["P&L positif 2 ans","Bonus significatif","Spécialisation","Réseau finance"],sku:["Trading","Risk management","Spécialisation"],co:"~30€/mois",cd:"FT + outils."}
]},
maintenance:{id:"maintenance",e:"🔩",t:"Technicien maintenance industrielle",c:"#78716C",cat:"craft",dur:"24 mois",cost:"500–5000€",lv:"Accessible",sal:{j:"24–30K€",m:"32–40K€",s:"40–55K€"},tag:"Très demandé, bien payé.",sk:["Mécanique","Électricité industrielle","Automatisme","Pneumatique","GMAO"],ss:93,ms:[
{p:"BTS Maintenance / Formation",d:"12–24 mois",mo:"Formation",i:"📚",obj:"Diplôme technique.",tasks:["BTS Maintenance Industrielle ou CQPM","Mécanique, électricité, automatisme","Lecture de schémas","Stages en usine"],dh:["1h pratique technique","Schémas (30 min)","Sécurité","Prépa stage"],res:[{n:"AFPA Maintenance",u:"https://afpa.fr",co:"Finançable",du:"12–24 mois",lv:"Aucun",de:"Formation pro maintenance."}],val:["Diplôme obtenu","Stages validés","Schémas maîtrisés","Habilitations"],sku:["Mécanique","Électricité","Automatisme","Sécurité"],co:"Finançable",cd:"CPF/Pôle Emploi."},
{p:"Exercice + Spécialisation",d:"Variable",mo:"Post-diplôme",i:"🔧",obj:"Technicien confirmé.",tasks:["Maintenance préventive et curative","GMAO","Spécialisation (robotique, froid, CVC)","Astreintes"],dh:["Interventions","GMAO (15 min)","1 procédure","Formation continue"],res:[{n:"AFIM",u:"https://afim.asso.fr",co:"Cotisation",du:"Référence",lv:"Technicien",de:"Association Française Ingénieurs Maintenance."}],val:["Autonome sur site","GMAO maîtrisé","Spécialisation","Taux dispo >95%"],sku:["GMAO","Spécialisation","Autonomie"],co:"0€",cd:"Formation employeur."}
]},
supplychain:{id:"supplychain",e:"📦",t:"Responsable Logistique / Supply Chain",c:"#0891B2",cat:"business",dur:"24–36 mois",cost:"2000–10000€",lv:"Intermédiaire",sal:{j:"28–35K€",m:"38–50K€",s:"55–80K€"},tag:"E-commerce explose.",sk:["Gestion stocks","ERP/WMS","Transport","Lean","Prévision demande"],ss:82,ms:[
{p:"Formation Supply Chain",d:"12–24 mois",mo:"Formation",i:"📚",obj:"Bases logistiques.",tasks:["BTS/Licence logistique ou reconversion","ERP (SAP, Oracle)","Gestion des stocks","Transport et douanes","Lean management"],dh:["1h formation","ERP (30 min)","1 cas stock","Lean (20 min)"],res:[{n:"APICS/ASCM",u:"https://ascm.org",co:"~500€ certif",du:"~100h",lv:"Intermédiaire",de:"Certification supply chain mondiale."}],val:["Formation validée","ERP maîtrisé","Stocks gérés","Lean compris"],sku:["ERP","Gestion stocks","Transport","Lean"],co:"Variable",cd:"Finançable CPF."},
{p:"Management + Performance",d:"Variable",mo:"Post-formation",i:"📊",obj:"Optimiser la chaîne.",tasks:["Manager une équipe logistique","KPIs supply chain","Optimisation coûts transport","Prévision demande","Digital supply chain"],dh:["Check KPIs","1 optimisation","Manager équipe","1 article supply"],res:[{n:"Supply Chain Magazine",u:"https://supplychainmagazine.fr",co:"Gratuit",du:"Référence",lv:"Pro",de:"Actualités supply chain FR."}],val:["Équipe managée","Coûts réduits 10%","KPIs améliorés","Projets digitaux"],sku:["Management","KPIs","Optimisation","Digital SCM"],co:"0€",cd:"Formation employeur."}
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
  {id:"first",    icon:"🌱", name:"Premier pas",    desc:"1 étape terminée",       check:({completedMs})  => Object.values(completedMs).filter(Boolean).length>=1},
  {id:"ms5",      icon:"⚡", name:"Explorateur",    desc:"5 étapes terminées",     check:({completedMs})  => Object.values(completedMs).filter(Boolean).length>=5},
  {id:"ms10",     icon:"🚀", name:"Engagé",         desc:"10 étapes terminées",    check:({completedMs})  => Object.values(completedMs).filter(Boolean).length>=10},
  {id:"streak3",  icon:"🔥", name:"En feu",         desc:"Streak 3 jours",         check:({streak})       => streak>=3},
  {id:"streak7",  icon:"🏅", name:"Semaine de feu", desc:"Streak 7 jours",         check:({streak})       => streak>=7},
  {id:"streak30", icon:"💎", name:"Invincible",     desc:"Streak 30 jours",        check:({streak})       => streak>=30},
  {id:"fav3",     icon:"⭐", name:"Sélectif",       desc:"3 parcours en favoris",  check:({favorites})    => favorites.length>=3},
  {id:"tree1",    icon:"🌳", name:"Arbre de vie",   desc:"1 branche ajoutée",      check:({treeBranches}) => treeBranches.length>=1},
  {id:"tree3",    icon:"🌲", name:"Forêt",          desc:"3 branches actives",     check:({treeBranches}) => treeBranches.length>=3},
  {id:"multi",    icon:"💡", name:"Multi-parcours", desc:"2 parcours en cours",    check:({getProgress})  => CAREER_LIST.filter(c=>getProgress(c.id)>0).length>=2},
  {id:"half",     icon:"🎯", name:"À mi-chemin",    desc:"50% sur un parcours",    check:({getProgress})  => CAREER_LIST.some(c=>getProgress(c.id)>=50)},
  {id:"champion", icon:"🏆", name:"Diplômé",        desc:"100% sur un parcours",   check:({getProgress})  => CAREER_LIST.some(c=>getProgress(c.id)===100)},
];

const Ctx = createContext(null);
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
    saveLS({ completedMs, favorites, treeBranches, treeObjCompleted, streak, todayDate, todayChecks, lastVisit: new Date().toISOString().slice(0,10) });
  }, [completedMs, favorites, treeBranches, treeObjCompleted, streak, todayDate, todayChecks]);

  useEffect(() => {
    // ── Streak update on visit
    const saved = loadLS();
    const today = new Date().toISOString().slice(0,10);
    const yest  = new Date(Date.now()-864e5).toISOString().slice(0,10);
    if(saved.lastVisit && saved.lastVisit!==today)
      setStreak(saved.lastVisit===yest ? (saved.streak||1)+1 : 1);
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

  const ctx = {page,nav,selCareer,selMilestone,completedMs,toggleMs,isMsDone,getProgress,search,setSearch,cat,setCat,favorites,toggleFav,treeBranches,setTreeBranches,selBranch,setSelBranch,treeObjCompleted,toggleTreeObj,isTreeObjDone,treeBranchProg,treeLevelProg,isTreeLevelUnlocked,addTreeBranch,notification,notify,streak,todayChecks,bumpToday};

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
      <div style={{minHeight:"100vh",background:T.bg}}>
        {/* Notification */}
        {notification&&<div style={{position:"fixed",top:12,left:"50%",transform:"translateX(-50%)",zIndex:999,background:T.sf,border:`1px solid ${T.ac}33`,borderRadius:12,padding:"10px 18px",fontSize:12,color:T.tx,fontWeight:600,boxShadow:"0 8px 32px rgba(0,0,0,.5)",animation:"slideIn .3s ease",maxWidth:340,textAlign:"center"}}>{notification}</div>}
        {/* Nav */}
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
          <nav style={{display:"flex",gap:2}}>
            {[{id:"explore",l:"Parcours"},{id:"dashboard",l:"Stats"},{id:"tree",l:"Arbre"},{id:"daily",l:"Journée"}].map(({id,l})=>(
              <button key={id} className="btn" onClick={()=>nav(id)} style={{padding:"4px 7px",borderRadius:99,fontSize:10,fontWeight:600,background:page===id?T.ac:"transparent",color:page===id?"#080808":T.mt}}>{l}</button>
            ))}
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
        </div>
      </div>
    </Ctx.Provider>
  );
}

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
  const {nav,search,setSearch,cat,setCat,getProgress,favorites,toggleFav} = useCtx();
  let filtered = CAREER_LIST.filter(c => {
    const ms = c.t.toLowerCase().includes(search.toLowerCase()) || c.tag.toLowerCase().includes(search.toLowerCase());
    return ms && (cat==="all" || c.cat===cat);
  });
  return (
    <div style={{paddingTop:66,minHeight:"100vh"}}>
      <div style={{maxWidth:540,margin:"0 auto",padding:"16px 18px 80px"}}>
        <h1 style={{fontFamily:T.fd,fontSize:22,fontWeight:800,letterSpacing:"-1px",marginBottom:4}}>Parcours</h1>
        <p style={{color:T.mt,fontSize:12,marginBottom:12}}>30 feuilles de route détaillées</p>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher..." style={{width:"100%",background:T.sf,border:`1px solid ${T.bd}`,borderRadius:8,padding:"9px 12px",fontSize:12,color:T.tx,fontFamily:T.fb,marginBottom:8}}/>
        <div style={{display:"flex",gap:4,marginBottom:12,flexWrap:"wrap",overflowX:"auto"}}>
          {CATS.map(c=><button key={c.v} className="btn" onClick={()=>setCat(c.v)} style={{padding:"3px 8px",borderRadius:99,fontSize:10,fontWeight:600,background:cat===c.v?T.ac:T.sf,color:cat===c.v?"#080808":T.mt,border:`1px solid ${cat===c.v?T.ac:T.bd}`,whiteSpace:"nowrap"}}>{c.i} {c.l}</button>)}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {filtered.map((c,i) => {
            const p=getProgress(c.id);const fav=favorites.includes(c.id);
            return(
              <div key={c.id} className="fu card" style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:14,padding:"12px",borderLeft:`3px solid ${c.c}33`,animationDelay:`${i*.03}s`,cursor:"pointer"}} onClick={()=>nav("career",c.id)}>
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
                  <button className="btn" onClick={e=>{e.stopPropagation();toggleFav(c.id);}} style={{background:"none",fontSize:13,padding:2,color:fav?T.ac:T.sb}}>{fav?"★":"☆"}</button>
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
  const {nav,treeBranches,setSelBranch,treeBranchProg} = useCtx();
  const totalObj = treeBranches.reduce((s,b)=>{let t=0;(b.levels||[]).forEach(l=>t+=(l.objs||[]).length);return s+t;},0);
  return (
    <div style={{paddingTop:66,minHeight:"100vh"}}>
      <div style={{maxWidth:540,margin:"0 auto",padding:"16px 18px 80px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <span style={{fontSize:28}}>🌳</span>
          <div><h1 style={{fontFamily:T.fd,fontSize:22,fontWeight:800,letterSpacing:"-1px"}}>Mon Arbre de Vie</h1>
          <p style={{fontSize:11,color:T.mt}}>{treeBranches.length} branches · {totalObj} objectifs</p></div>
        </div>
        {treeBranches.length===0&&<div style={{background:T.sf,border:`1px dashed ${T.bd}`,borderRadius:16,padding:"36px 18px",textAlign:"center",marginBottom:14}}><span style={{fontSize:36}}>🌱</span><p style={{fontSize:13,color:T.mt,marginTop:8}}>Ton arbre est vide</p><p style={{fontSize:11,color:T.sb}}>Ajoute ta première branche</p></div>}
        {treeBranches.map((b,i) => {
          const pct = treeBranchProg(b);
          return (
            <div key={b.id} className="fu card" onClick={()=>{setSelBranch(b);nav("treebranch");}} style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:14,padding:"12px",marginBottom:7,cursor:"pointer",borderLeft:`3px solid ${b.color||T.pu}44`,animationDelay:`${i*.04}s`}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:38,height:38,borderRadius:9,background:(b.color||T.pu)+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{b.icon}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:13,fontWeight:700,fontFamily:T.fd}}>{b.title}</span><span style={{fontSize:11,color:b.color||T.pu,fontWeight:700}}>{pct}%</span></div>
                  <div style={{height:3,background:T.sb,borderRadius:99}}><div style={{height:"100%",width:`${pct}%`,background:b.color||T.pu,borderRadius:99}}/></div>
                  {(b.connections||[]).length>0&&treeBranches.some(x=>(b.connections||[]).some(c=>c.to===x.id))&&<span className="tag" style={{background:T.ord,color:T.or,fontSize:8,marginTop:4}}>🔗 {(b.connections||[]).filter(c=>treeBranches.some(x=>x.id===c.to)).length} liens</span>}
                </div>
                <span style={{color:T.mt,fontSize:14}}>›</span>
              </div>
            </div>
          );
        })}
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
  const {nav,selCareer,treeBranches,isMsDone,isTreeLevelUnlocked} = useCtx();
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

        {!career&&treeBranches.length===0&&<div style={{textAlign:"center",padding:30,color:T.mt}}>
          <p style={{fontSize:13,marginBottom:10}}>Choisis un parcours et ajoute des branches pour voir tes tâches quotidiennes.</p>
          <button className="btn" onClick={()=>nav("explore")} style={{background:T.ac,color:"#080808",borderRadius:8,padding:"8px 16px",fontSize:12,fontWeight:700}}>Explorer</button>
        </div>}
      </div>
    </div>
  );
};

// ━━━ HELPERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ━━━ DASHBOARD ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const DashboardPage = () => {
  const {nav,completedMs,favorites,treeBranches,streak,todayChecks,getProgress,treeBranchProg,isMsDone} = useCtx();
  const ctxB = {completedMs,favorites,treeBranches,streak,todayChecks,getProgress};

  const totalMsDone = Object.values(completedMs).filter(Boolean).length;
  const totalMs     = CAREER_LIST.reduce((s,c)=>s+c.ms.length,0);

  const unlockedSkills = new Set();
  Object.entries(completedMs).forEach(([key,done])=>{
    if(!done) return;
    const li=key.lastIndexOf("-"); const cId=key.slice(0,li); const mIdx=parseInt(key.slice(li+1));
    const career=C[cId]; if(career&&career.ms[mIdx]) (career.ms[mIdx].sku||[]).forEach(s=>unlockedSkills.add(s));
  });

  const activeCareers = CAREER_LIST.filter(c=>getProgress(c.id)>0).sort((a,b)=>getProgress(b.id)-getProgress(a.id));
  const earnedCount   = BADGES.filter(b=>b.check(ctxB)).length;
  const today = new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});

  return (
    <div style={{paddingTop:66,minHeight:"100vh"}}>
      <div style={{maxWidth:540,margin:"0 auto",padding:"16px 18px 80px"}}>

        {/* Header */}
        <h1 style={{fontFamily:T.fd,fontSize:22,fontWeight:800,letterSpacing:"-1px",marginBottom:2}}>Mon Dashboard</h1>
        <p style={{color:T.mt,fontSize:11,marginBottom:18,textTransform:"capitalize"}}>{today}</p>

        {/* 4 KPI cards */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:20}}>
          {[
            {v:streak,                      l:"Streak",   icon:"🔥", col:streak>=7?T.ac:streak>=3?T.or:T.mt},
            {v:`${totalMsDone}/${totalMs}`,  l:"Étapes",  icon:"📈", col:T.bl},
            {v:unlockedSkills.size,          l:"Skills",  icon:"⭐", col:T.pu},
            {v:treeBranches.length,          l:"Branches",icon:"🌳", col:T.gr},
          ].map(({v,l,icon,col},i)=>(
            <div key={i} style={{background:T.sf,border:`1px solid ${T.bd}`,borderRadius:12,padding:"10px 6px",textAlign:"center"}}>
              <div style={{fontSize:13,marginBottom:3}}>{icon}</div>
              <div style={{fontFamily:T.fd,fontSize:typeof v==="string"?10:14,fontWeight:800,color:col,lineHeight:1}}>{v}</div>
              <div style={{fontSize:8,color:T.mt,marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>

        {/* Badges */}
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <h2 style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase"}}>🏅 BADGES</h2>
            <span style={{fontSize:9,color:T.ac,fontWeight:800}}>{earnedCount}/{BADGES.length} débloqués</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
            {BADGES.map((b,i)=>{
              const earned = b.check(ctxB);
              return (
                <div key={b.id} className={earned?"fu":""} style={{background:earned?`${T.ac}09`:T.sf,border:`1px solid ${earned?T.ac+"30":T.bd}`,borderRadius:10,padding:"10px 8px",textAlign:"center",opacity:earned?1:.35,transition:"opacity .2s",animationDelay:`${i*.03}s`}}>
                  <div style={{fontSize:20,marginBottom:4,filter:earned?"none":"grayscale(100%)"}}>{b.icon}</div>
                  <div style={{fontSize:9,fontWeight:700,color:earned?T.ac:T.mt,marginBottom:2}}>{b.name}</div>
                  <div style={{fontSize:8,color:T.mt,lineHeight:1.3}}>{b.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Parcours en cours */}
        <div style={{marginBottom:20}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <h2 style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase"}}>📚 MES PARCOURS</h2>
            {activeCareers.length>0&&<button className="btn" onClick={()=>nav("explore")} style={{fontSize:9,color:T.ac,background:"none",padding:0,fontWeight:700}}>+ Explorer</button>}
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
                      <span style={{fontSize:9,color:T.mt}}>{doneCount}/{c.ms.length} étapes</span>
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

        {/* Arbre de vie */}
        {treeBranches.length>0&&(
          <div style={{marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <h2 style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase"}}>🌳 MON ARBRE</h2>
              <button className="btn" onClick={()=>nav("tree")} style={{fontSize:9,color:T.gr,background:"none",padding:0,fontWeight:700}}>Voir tout →</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
              {treeBranches.map((b,i)=>{
                const pct = treeBranchProg(b);
                return (
                  <div key={b.id} className="fu card" onClick={()=>nav("tree")} style={{background:T.sf,border:`1px solid ${(b.color||T.pu)}1a`,borderRadius:12,padding:"12px",cursor:"pointer",animationDelay:`${i*.04}s`}}>
                    <div style={{fontSize:22,marginBottom:5}}>{b.icon}</div>
                    <div style={{fontSize:11,fontWeight:700,fontFamily:T.fd,marginBottom:6,lineHeight:1.2}}>{b.title}</div>
                    <div style={{height:3,background:T.sb,borderRadius:99,marginBottom:5}}>
                      <div style={{height:"100%",width:`${pct}%`,background:b.color||T.pu,borderRadius:99}}/>
                    </div>
                    <span style={{fontSize:9,color:b.color||T.pu,fontWeight:700}}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Barre progression globale */}
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
              <span style={{fontSize:9,color:T.mt}}>{totalMsDone} étape{totalMsDone>1?"s":""} terminée{totalMsDone>1?"s":""}</span>
              <span style={{fontSize:9,color:T.mt}}>{totalMs-totalMsDone} restante{totalMs-totalMsDone>1?"s":""}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

const Sec = ({t, children}) => <div style={{marginBottom:14}}><h2 style={{fontSize:9,color:T.mt,fontWeight:700,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>{t}</h2>{children}</div>;
