import { eduRank, langRank, scorer } from '../lib/scoring';
import type { Answers, Country, Pathway } from './types';

// Figures and rules change every year. Each pathway links to the official source,
// and the app tells users to confirm details there before applying.

const L = {
  universitaly: { label: 'Universitaly (pre-enrolment for international students)', url: 'https://www.universitaly.it' },
  studyInItaly: { label: 'Study in Italy (Ministry of Foreign Affairs)', url: 'https://studyinitaly.esteri.it' },
  visa: { label: 'Visa for Italy (official visa finder)', url: 'https://vistoperitalia.esteri.it' },
  cimea: { label: 'CIMEA (recognition of foreign qualifications)', url: 'https://www.cimea.it' },
  mur: { label: 'Ministry of University and Research (MUR)', url: 'https://www.mur.gov.it' },
  mim: { label: 'Ministry of Education and Merit (MIM)', url: 'https://www.mim.gov.it' },
  euraxess: { label: 'EURAXESS (research jobs and funding in Europe)', url: 'https://euraxess.ec.europa.eu' },
  msca: { label: 'Marie Skłodowska-Curie Actions', url: 'https://marie-sklodowska-curie-actions.ec.europa.eu' },
  erc: { label: 'European Research Council', url: 'https://erc.europa.eu' },
  erasmusMundus: { label: 'Erasmus Mundus joint master catalogue', url: 'https://www.eacea.ec.europa.eu/scholarships/erasmus-mundus-catalogue_en' },
  interior: { label: 'Ministry of the Interior (residence permits)', url: 'https://www.interno.gov.it' },
};

const fundingNeed = (a: Answers) => a.budget === 'full_funding';

const bachelor: Pathway = {
  id: 'bachelor',
  title: "Bachelor's degree (Laurea triennale)",
  kind: 'study',
  summary:
    'A three-year first degree at an Italian university. Public universities are inexpensive by European standards, and a growing number of programmes are taught fully in English.',
  requirements: [
    'A secondary school diploma that gives access to university in your country, usually after at least 12 years of schooling',
    'Proof of language level for the programme (often B2 English for English-taught degrees, or Italian for Italian-taught ones)',
    'Some programmes have an entrance test (for example medicine, architecture, or degrees with limited places)',
    'Non-EU applicants: pre-enrolment on Universitaly, then a study visa (type D)',
  ],
  costs:
    'Public universities set fees by family income, so many students pay from a few hundred to a few thousand euros a year. Private universities cost more. Living costs are roughly €700 to €1,200 a month depending on the city.',
  funding: [
    'Regional "Diritto allo Studio" (DSU) scholarships, based on income and merit, can cover fees, meals, housing and a cash grant',
    'Italian Government (MAECI) scholarships for foreign students',
    'University fee waivers and merit awards',
  ],
  timeline: [
    'Autumn to winter: choose programmes and check entry requirements',
    'Winter to spring: apply to the university directly',
    'Spring to summer: pre-enrol on Universitaly and apply for the visa (non-EU)',
    'September to October: classes start',
  ],
  steps: [
    'Shortlist programmes on Universitaly and on university websites',
    'Check whether your diploma needs a statement of comparability (CIMEA) or a Declaration of Value',
    'Prepare language certificates and any entrance test',
    'Apply to the university, then pre-enrol on Universitaly if you are non-EU',
    'Apply for a DSU scholarship in the region of your university as soon as the call opens',
    'Get your visa, then apply for a residence permit within 8 days of arriving',
  ],
  links: [L.universitaly, L.studyInItaly, L.cimea, L.visa],
  assess(a) {
    const s = scorer();
    if (a.stage === 'bachelor') s.plus(45, "It matches the next step you're aiming for");
    else s.minus(25, 'It is a step earlier than the one you chose');
    if (eduRank[a.education] >= 1) s.minus(20, 'You already hold a degree, so a second bachelor is rarely the best use of time');
    if (langRank[a.english] >= 2 || langRank[a.italian] >= 2) s.plus(10, 'Your language level fits English-taught or Italian-taught degrees');
    else s.minus(15, 'Most programmes expect at least B2 in the teaching language');
    if (a.budget !== 'self_funded') s.plus(5, 'Low public tuition and DSU scholarships help with a limited budget');
    if (a.objective === 'teaching' && a.area === 'education') s.plus(5, 'Education degrees are a first step towards teaching');
    return s.done();
  },
};

const master: Pathway = {
  id: 'master',
  title: "Master's degree (Laurea magistrale)",
  kind: 'study',
  summary:
    'A two-year second degree. This is where Italy is strongest for international students: hundreds of English-taught programmes, low public tuition, and a direct route into PhD programmes.',
  requirements: [
    "A bachelor's degree (usually at least three years) in a related subject",
    'Specific credits in core subjects, checked by each programme',
    'English B2 or higher for English-taught programmes (IELTS, TOEFL or similar)',
    'Non-EU applicants: pre-enrolment on Universitaly, then a study visa (type D)',
  ],
  costs:
    'Public universities set fees by family income, often from a few hundred to a few thousand euros a year. Living costs are roughly €700 to €1,200 a month depending on the city.',
  funding: [
    'Regional DSU scholarships (income and merit based)',
    'Italian Government (MAECI) scholarships, including programmes for specific countries and fields',
    'Erasmus Mundus joint masters with an Italian partner university, which come with a full scholarship',
    'University scholarships for international students',
  ],
  timeline: [
    'Autumn: shortlist programmes, many have first deadlines between November and March',
    'Winter to spring: apply and receive the admission letter',
    'Spring to summer: pre-enrol on Universitaly and apply for the visa (non-EU)',
    'September to October: classes start',
  ],
  steps: [
    'Search English-taught programmes in your area on Universitaly',
    'Check each programme’s credit requirements against your transcript',
    'Get your degree assessed (CIMEA statement or Declaration of Value) if the university asks',
    'Apply in the earliest round, which is when most scholarships are awarded',
    'Apply for DSU funding as soon as the regional call opens',
    'Pre-enrol on Universitaly and book your visa appointment early',
  ],
  links: [L.universitaly, L.studyInItaly, L.erasmusMundus, L.cimea, L.visa],
  assess(a) {
    const s = scorer();
    if (a.stage === 'master') s.plus(45, "It matches the next step you're aiming for");
    else if (a.stage === 'phd' && a.education === 'bachelor') s.plus(25, "Most Italian PhDs require a master's, so this is your bridge to one");
    else if (a.stage === 'school_teacher' && a.education === 'bachelor') s.plus(15, "Teaching in Italian schools needs a master's level degree");
    else s.minus(15, 'It is not the step you chose');
    if (eduRank[a.education] < 1) s.block("You need a bachelor's degree first");
    if (eduRank[a.education] >= 2) s.minus(15, "You already hold a master's degree");
    if (langRank[a.english] >= 2) s.plus(10, 'Your English is enough for English-taught programmes');
    else if (langRank[a.italian] >= 2) s.plus(5, 'Your Italian opens Italian-taught programmes too');
    else s.minus(15, 'You will need B2 English or Italian before applying');
    if (a.objective === 'academic_career' || a.objective === 'industry_research') s.plus(5, 'A master’s leads directly to research roles and PhD programmes');
    if (fundingNeed(a)) s.minus(5, 'Full funding is competitive; apply early and to several scholarship schemes');
    return s.done();
  },
};

const phd: Pathway = {
  id: 'phd',
  title: 'PhD (Dottorato di ricerca)',
  kind: 'research',
  summary:
    'A three-year doctorate, usually funded. Most places come with a scholarship (borsa di dottorato) paid monthly, so you are paid to do research rather than paying fees.',
  requirements: [
    "A master's degree, or graduating before the PhD starts",
    'A research proposal, CV, and reference letters (varies by programme)',
    'An interview, often possible online',
    'English is usually enough; Italian helps for daily life and some humanities programmes',
  ],
  costs:
    'Funded PhD students usually pay no or very low fees. The scholarship has recently been around €16,000 to €17,000 a year before tax, which covers living costs in most Italian cities, and is higher abroad during research periods.',
  funding: [
    'University PhD scholarships (borse di dottorato), the main source',
    'Places funded by companies or research institutes, including industrial PhDs',
    'Marie Skłodowska-Curie Doctoral Networks with Italian partners',
  ],
  timeline: [
    'Spring to summer: most universities publish their PhD calls (bandi)',
    'About one month later: deadlines, followed by interviews',
    'Autumn: results published and enrolment',
    'Usually November: the PhD starts',
  ],
  steps: [
    'Find calls on university websites and on EURAXESS; search for "bando dottorato" plus the university name',
    'Contact a potential supervisor whose research matches yours',
    'Prepare a short research project and get your master’s assessed if asked',
    'Apply to several calls; each university has its own deadline',
    'Non-EU: after winning a place, apply for a study or research visa',
  ],
  links: [L.euraxess, L.mur, L.msca, L.visa],
  assess(a) {
    const s = scorer();
    if (a.stage === 'phd') s.plus(45, "It matches the next step you're aiming for");
    else if (a.stage === 'master' && a.objective === 'academic_career') s.plus(10, 'A PhD is the natural next step after your master’s');
    else s.minus(15, 'It is not the step you chose');
    if (eduRank[a.education] < 2) {
      if (a.stage === 'phd') s.block("Italian PhDs require a master's degree (or one you'll finish before starting)");
      else s.minus(20, "You'll need a master's degree first");
    }
    if (eduRank[a.education] >= 3) s.minus(30, 'You already hold a PhD');
    if (fundingNeed(a)) s.plus(10, 'Most places are funded with a scholarship');
    if (a.objective === 'academic_career' || a.objective === 'industry_research') s.plus(10, 'A PhD is the entry ticket for research careers');
    if (langRank[a.english] >= 2) s.plus(5, 'Your English is enough for most programmes');
    else s.minus(10, 'Most programmes expect good English');
    if (a.area === 'stem' || a.area === 'life_sciences') s.plus(5, 'Italy has many funded places in science and life sciences');
    return s.done();
  },
};

const postdoc: Pathway = {
  id: 'postdoc',
  title: 'Postdoctoral research (research contract or fellowship)',
  kind: 'research',
  summary:
    'Fixed-term research positions at universities and national institutes such as CNR, INFN and IIT, or a personal fellowship such as a Marie Skłodowska-Curie Postdoctoral Fellowship hosted in Italy.',
  requirements: [
    'A PhD (or near completion)',
    'A publication record and a research plan',
    'English is the working language in most labs; Italian helps with admin and teaching duties',
    'Non-EU researchers: a hosting agreement with an accredited institution gives access to a dedicated research visa outside the yearly quotas',
  ],
  costs:
    'Salaried. Pay varies by contract type and institution; EU fellowships such as MSCA pay noticeably more than standard national contracts.',
  funding: [
    'University research contracts (contratti di ricerca), advertised through public calls',
    'Marie Skłodowska-Curie Postdoctoral Fellowships hosted in Italy',
    'ERC grants for independent researchers',
    'National research institutes (CNR, INFN, IIT and others)',
  ],
  timeline: [
    'Calls open all year round; university calls usually have 2 to 4 week deadlines',
    'MSCA Postdoctoral Fellowships: one call a year, typically closing in September',
    'Start dates are flexible once you are selected',
  ],
  steps: [
    'Set job alerts on EURAXESS and on the websites of target universities and institutes',
    'Contact groups you want to join; many positions are filled with candidates they already know',
    'Consider writing an MSCA fellowship proposal with an Italian host',
    'Non-EU: ask the host to sign a hosting agreement, then apply for the research visa',
  ],
  links: [L.euraxess, L.msca, L.erc, L.visa],
  assess(a) {
    const s = scorer();
    if (a.stage === 'postdoc') s.plus(45, "It matches the next step you're aiming for");
    else if (a.stage === 'faculty') s.plus(15, 'Most faculty hires in Italy come after postdoctoral work');
    else s.minus(15, 'It is not the step you chose');
    if (eduRank[a.education] < 3) {
      if (a.stage === 'postdoc') s.block('Postdoctoral positions require a PhD');
      else s.minus(25, 'You need a PhD first');
    }
    if (a.objective === 'academic_career' || a.objective === 'industry_research') s.plus(10, 'It builds the record research careers are judged on');
    if (fundingNeed(a)) s.plus(5, 'It is a salaried position');
    if (langRank[a.english] >= 2) s.plus(5, 'English is the working language in most labs');
    if (a.citizenship === 'non_eu') s.plus(3, 'The research visa route avoids the yearly work quotas');
    if (a.area === 'stem' || a.area === 'life_sciences') s.plus(5, 'Institutes like CNR, INFN and IIT hire many researchers in these fields');
    return s.done();
  },
};

const faculty: Pathway = {
  id: 'faculty',
  title: 'University faculty (tenure-track researcher to professor)',
  kind: 'work',
  summary:
    'The permanent academic route. It starts with a tenure-track researcher position (RTT), which can lead to associate professor after the national habilitation (ASN).',
  requirements: [
    'A PhD and several years of research after it',
    'A strong publication record in your field',
    'The National Scientific Habilitation (ASN) to become associate or full professor',
    'Italian is often needed for teaching and university admin, especially outside English-taught programmes',
  ],
  costs: 'Salaried, permanent once tenured. Salaries follow national scales and increase with seniority.',
  funding: [
    'Public competitions (concorsi) run by each university',
    'Programmes that recruit researchers working abroad, such as the Rita Levi Montalcini programme',
    'Holding an ERC grant can open a direct-call route to a position',
  ],
  timeline: [
    'Competitions are published all year in the official gazette and on university websites',
    'ASN applications open in recurring windows',
    'The full path from tenure-track to associate professor usually takes several years',
  ],
  steps: [
    'Check whether your publication record meets the ASN thresholds for your field on the MUR site',
    'Follow competitions in your discipline and contact departments early',
    'Learn Italian to at least B2 if you will teach in Italian',
    'Consider programmes for researchers abroad and ERC grants as alternative entry points',
  ],
  links: [L.mur, L.euraxess, L.erc],
  assess(a) {
    const s = scorer();
    if (a.stage === 'faculty') s.plus(45, "It matches the next step you're aiming for");
    else if (a.stage === 'postdoc' && a.objective === 'academic_career') s.plus(5, 'This is where your academic career would lead');
    else s.minus(20, 'It is not the step you chose');
    if (eduRank[a.education] < 3) s.block('Faculty positions require a PhD and postdoctoral experience');
    if (a.objective === 'academic_career') s.plus(10, 'It is the long-term academic route in Italy');
    if (langRank[a.italian] >= 2) s.plus(10, 'Your Italian helps with teaching and admin');
    else s.minus(15, 'Italian is often needed for teaching; competition is strong');
    return s.done();
  },
};

const schoolTeacher: Pathway = {
  id: 'school_teacher',
  title: 'Teaching in Italian state schools',
  kind: 'work',
  summary:
    'Permanent teaching posts in state schools are filled through national competitions (concorsi). It is a stable career but needs fluent Italian and a recognised teaching qualification.',
  requirements: [
    "A master's level degree in a subject linked to the teaching area",
    'Teaching training credits or a recognised teaching qualification',
    'Fluent Italian (C1 or above in practice)',
    'Foreign degrees and teaching qualifications must be recognised by the Ministry of Education',
    'Non-EU citizens can apply only with certain residence statuses, such as long-term residence',
  ],
  costs: 'Salaried. Before winning a competition, many teachers work on temporary substitute contracts (supplenze).',
  funding: ['Salaried role, no tuition'],
  timeline: [
    'Recognition of foreign qualifications can take many months, so start early',
    'Competitions are announced periodically by the Ministry of Education',
    'Substitute teacher rankings are updated in recurring windows',
  ],
  steps: [
    'Ask the Ministry of Education to recognise your teaching qualification, or check what training you still need',
    'Reach C1 Italian and get a certificate (CILS, CELI or PLIDA)',
    'Register for substitute teacher rankings to gain experience',
    'Prepare for and sit the next national competition in your subject',
  ],
  links: [L.mim, L.cimea],
  assess(a) {
    const s = scorer();
    if (a.stage === 'school_teacher') s.plus(45, "It matches the next step you're aiming for");
    else if (a.objective === 'teaching') s.plus(10, 'It fits your goal of teaching');
    else s.minus(20, 'It is not the step you chose');
    if (a.objective === 'teaching') s.plus(5, 'It is a stable teaching career');
    if (langRank[a.italian] >= 3) s.plus(10, 'Your Italian is at the level schools need');
    else if (langRank[a.italian] === 2) s.minus(10, 'You will need to reach C1 Italian');
    else s.minus(30, 'State school teaching needs fluent Italian');
    if (eduRank[a.education] < 2) s.minus(10, "You'll need a master's level degree");
    if (a.citizenship === 'non_eu') s.minus(10, 'Non-EU citizens can only apply with certain residence statuses');
    return s.done();
  },
};

const eduProfessional: Pathway = {
  id: 'edu_professional',
  title: 'International schools, language teaching and education research',
  kind: 'work',
  summary:
    'Jobs outside the state system: international and bilingual schools, English language teaching, and education research at bodies such as INDIRE and INVALSI or university education departments.',
  requirements: [
    'International schools: a teaching qualification from your country and classroom experience',
    'Language teaching: native-level English plus a certificate such as CELTA helps',
    'Education research institutes: relevant degree, and usually good Italian',
    'Non-EU citizens need a work permit, which for most jobs goes through yearly quotas (decreto flussi) and an employer sponsor',
  ],
  costs: 'Salaried. Pay at language schools is modest; international schools usually pay more.',
  funding: ['Salaried roles, no tuition'],
  timeline: [
    'International schools recruit mostly from January to April for September starts',
    'Language schools hire before the autumn term and in January',
    'Research institutes publish calls through the year',
  ],
  steps: [
    'Make a list of international schools in the cities you like and check their vacancy pages',
    'Get a teaching or language-teaching certificate if you do not have one',
    'Non-EU: find an employer willing to sponsor a work permit, or enter as a student first',
    'For education research, follow INDIRE, INVALSI and university education departments',
  ],
  links: [
    { label: 'INDIRE (national education research institute)', url: 'https://www.indire.it' },
    { label: 'INVALSI (national education evaluation institute)', url: 'https://www.invalsi.it' },
    L.visa,
    L.interior,
  ],
  assess(a) {
    const s = scorer();
    if (a.stage === 'edu_professional') s.plus(45, "It matches the next step you're aiming for");
    else if (a.stage === 'school_teacher') s.plus(20, 'International schools are often a faster way into teaching in Italy');
    else s.minus(20, 'It is not the step you chose');
    if (a.objective === 'teaching') s.plus(5, 'It fits your goal of teaching');
    if (langRank[a.english] >= 3) s.plus(10, 'Fluent English is the main requirement for these jobs');
    else if (langRank[a.english] < 2) s.minus(15, 'These jobs mostly need fluent English');
    if (a.citizenship === 'non_eu') s.minus(15, 'Work permits for these jobs are limited by yearly quotas');
    if (eduRank[a.education] < 1) s.minus(10, 'Most positions need a degree');
    return s.done();
  },
};

export const italy: Country = {
  id: 'italy',
  name: 'Italy',
  flag: '🇮🇹',
  lastReviewed: 'October 2026',
  essentials: [
    {
      title: 'Low public tuition',
      body: 'Public universities charge fees based on family income, often far below other Western European countries.',
    },
    {
      title: 'Many English-taught degrees',
      body: "Hundreds of master's programmes and most PhDs can be completed in English.",
    },
    {
      title: 'Funded PhDs',
      body: 'Most PhD places come with a scholarship, so a doctorate is a paid position.',
    },
    {
      title: 'Italian matters for jobs',
      body: 'Study and research work in English, but school teaching, admin and most jobs outside research need Italian.',
    },
    {
      title: 'Stay after graduating',
      body: 'Non-EU graduates of Italian degrees and PhDs can request a residence permit to look for work for up to 12 months.',
    },
  ],
  visa: {
    eu: [
      'No visa needed. Register your residence at the local registry office (anagrafe) if you stay longer than three months.',
      'Get a tax code (codice fiscale) and register with the national health service.',
    ],
    non_eu: [
      'Students: a study visa (type D) after university admission and pre-enrolment on Universitaly. You must show health insurance, accommodation, and financial means set each year (recently a little over €6,000 a year).',
      'Researchers: a research visa based on a hosting agreement with an accredited institution, outside the yearly quotas.',
      'Highly qualified workers: the EU Blue Card, with a job offer above a salary threshold.',
      'Within 8 days of arrival, apply for a residence permit (permesso di soggiorno), usually through the post office kit.',
    ],
  },
  institutionsByArea: {
    education: [
      { name: 'University of Bologna', city: 'Bologna', note: 'Strong education sciences department and many English-taught programmes', url: 'https://www.unibo.it' },
      { name: 'University of Padua', city: 'Padua', note: 'Long tradition in psychology and education research', url: 'https://www.unipd.it' },
      { name: 'Roma Tre University', city: 'Rome', note: 'Department of education sciences', url: 'https://www.uniroma3.it' },
      { name: 'INDIRE', city: 'Florence', note: 'National institute for education research and innovation', url: 'https://www.indire.it' },
    ],
    stem: [
      { name: 'Politecnico di Milano', city: 'Milan', note: 'Engineering and design, most master’s taught in English', url: 'https://www.polimi.it' },
      { name: 'Politecnico di Torino', city: 'Turin', note: 'Engineering with strong industry links', url: 'https://www.polito.it' },
      { name: 'SISSA', city: 'Trieste', note: 'International school for PhDs in physics, maths and neuroscience', url: 'https://www.sissa.it' },
      { name: 'Italian Institute of Technology (IIT)', city: 'Genoa', note: 'Research institute hiring PhDs and postdocs in English', url: 'https://www.iit.it' },
    ],
    humanities: [
      { name: 'Sapienza University of Rome', city: 'Rome', note: 'Largest university in Europe, strong in classics and archaeology', url: 'https://www.uniroma1.it' },
      { name: 'Scuola Normale Superiore', city: 'Pisa', note: 'Highly selective school for humanities and sciences', url: 'https://www.sns.it' },
      { name: 'University of Bologna', city: 'Bologna', note: 'Oldest university in the Western world, broad humanities offer', url: 'https://www.unibo.it' },
      { name: 'Ca’ Foscari University of Venice', city: 'Venice', note: 'Languages, Asian studies and economics', url: 'https://www.unive.it' },
    ],
    life_sciences: [
      { name: 'University of Milan', city: 'Milan', note: 'Large life sciences and medicine faculty', url: 'https://www.unimi.it' },
      { name: 'University of Padua', city: 'Padua', note: 'Biology, medicine and biomedical research', url: 'https://www.unipd.it' },
      { name: 'Human Technopole', city: 'Milan', note: 'Life sciences research institute', url: 'https://humantechnopole.it' },
      { name: 'National Research Council (CNR)', city: 'Many cities', note: 'Italy’s largest public research body', url: 'https://www.cnr.it' },
    ],
    unsure: [
      { name: 'University of Bologna', city: 'Bologna', note: 'Broad offer across all fields', url: 'https://www.unibo.it' },
      { name: 'Sapienza University of Rome', city: 'Rome', note: 'Every major field in one place', url: 'https://www.uniroma1.it' },
      { name: 'University of Padua', city: 'Padua', note: 'Strong research across sciences and humanities', url: 'https://www.unipd.it' },
      { name: 'National Research Council (CNR)', city: 'Many cities', note: 'Research institutes in every discipline', url: 'https://www.cnr.it' },
    ],
  },
  pathways: [bachelor, master, phd, postdoc, faculty, schoolTeacher, eduProfessional],
};

export const countries: Country[] = [italy];
