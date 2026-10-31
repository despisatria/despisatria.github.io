// Builds index.html from content/resume.json. No dependencies: run `node scripts/build.mjs`.
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const cv = JSON.parse(readFileSync(`${root}content/resume.json`, 'utf8'));

const SITE_URL = 'https://despisatria.github.io/';
const DESCRIPTION = 'Software QA Engineer with 7+ years testing web, mobile, and API across logistics, e-commerce, fintech, and agritech. Playwright and Maestro automation, API and performance testing, QA leadership.';

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Inline formatting used in the content file: [text](url), ***bold italic***, **bold**, *italic*.
function inline(text) {
  return escape(text)
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_, label, url) => link(url, label))
    .replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function link(url, label, cls = '') {
  const external = /^https?:/.test(url);
  return `<a href="${url}"${cls ? ` class="${cls}"` : ''}${external ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`;
}

const paragraphs = (text, cls = '') => text.split('\n').filter(Boolean).map((p) => `<p${cls ? ` class="${cls}"` : ''}>${inline(p)}</p>`).join('');
const list = (items) => (items.length ? `<ul>${items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>` : '');
const span = (roles) => `${roles.at(-1).period.split(' - ')[0]} - ${roles[0].period.split(' - ')[1]}`;
const initials = (name) => name.split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
// Company logo, or a monogram when the company has no usable logo.
const logo = (src, name, width = 40) => (src
  ? `<img class="logo" src="${src}" alt="" width="${width}" height="40" loading="lazy">`
  : `<span class="logo logo-mono" aria-hidden="true">${initials(name)}</span>`);
const imgTag = (i, alt, cls = '') => `<img${cls ? ` class="${cls}"` : ''} src="${i.src}" alt="${escape(alt)}" width="${i.width}" height="${i.height}" loading="lazy">`;

// A hand-drawn arrow for the reviewer's annotations; it points the note at what it describes.
const penArrow = (cls) => `<svg class="pen-arrow ${cls}" viewBox="0 0 64 40" width="64" height="40" aria-hidden="true"><path d="M4 32 C 16 8, 36 4, 56 14"/><path d="M47 7 L57 14 L48 22"/></svg>`;

// The frame label is the section heading, like a frame name on a board. Frames with their own
// title (About, Case study) keep the label as a plain caption.
const frame = (label, id, body, cls = '', titled = false) => `
<section class="frame-wrap ${cls}" id="${id}" aria-labelledby="${id}-title">
  ${titled ? `<p class="frame-label">${escape(label)}</p>` : `<h2 class="frame-label" id="${id}-title">${escape(label)}</h2>`}
  ${body}
</section>`;

const { contact } = cv;

// The site is split into pages so no page turns into an endless scroll.
const PAGES = [
  { file: 'index.html', label: 'About' },
  { file: 'resume.html', label: 'Resume' },
  { file: 'portfolio.html', label: 'Portfolio' },
  { file: 'recommendations.html', label: 'Recommendations' },
];
const navLinks = (current) => PAGES.map((p) => `<a href="${p.file}"${p.file === current ? ' aria-current="page"' : ''}>${p.label}</a>`).join('');

const figures = (m) => `<dl class="figures">
  ${m.map((x) => `<div><dt>${escape(x.label)}</dt><dd class="trend">${x.values.map(([q, v], i) => `<span class="q${i === x.values.length - 1 ? ' q-now' : ''}"><span class="q-label">${escape(q)}</span><span class="q-val">${escape(v)}</span></span>`).join('<span class="q-step" aria-hidden="true">→</span>')}</dd></div>`).join('')}
</dl>`;

const hero = frame('About', 'about', `
  <div class="frame hero">
    <div class="hero-text">
      <h1 id="about-title">${escape(cv.name)}</h1>
      <p class="hero-role">${escape(cv.title)}</p>
      ${cv.summary.map((p) => `<p class="hero-summary">${inline(p)}</p>`).join('')}
      <div class="hero-actions">
        <a class="btn btn-ink" href="mailto:${contact.email}">Email me</a>
        <a class="btn" href="${contact.whatsapp}" target="_blank" rel="noopener">WhatsApp</a>
        <span class="hero-links">
          <a href="${contact.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
          <a href="${contact.github}" target="_blank" rel="noopener">GitHub</a>
          <a href="${contact.instagram}" target="_blank" rel="noopener">Instagram</a>
        </span>
      </div>
      <p class="print-only">${escape(contact.email)} · ${escape(contact.phone)} · linkedin.com/in/despisatria · Portfolio: despisatria.github.io</p>
    </div>
    <figure class="pinned-photo">
      <img src="${cv.photo}" alt="Portrait of ${escape(cv.name)}" width="480" height="480" fetchpriority="high">
    </figure>
  </div>
  <p class="note note-years">${penArrow('arrow-left')}${escape(cv.annotations[0])}</p>
  <p class="note note-tests">${escape(cv.annotations[1])}${penArrow('arrow-down')}</p>`, 'wrap-hero', true);

const experience = frame('Experience', 'experience', `
  <div class="frame">
    ${cv.experience.map((c) => `
    <article class="job">
      <div class="job-side">
        ${logo(c.logo, c.company, c.logoWidth)}
        <h3>${escape(c.company)}</h3>
        <p class="job-period">${escape(span(c.roles))}</p>
      </div>
      <div class="job-main">
        ${paragraphs(c.about, 'job-about')}
        ${c.roles.map((r) => `
        <div class="job-role">
          <h4>${escape(r.title)} <span class="muted">(${escape(r.type)}) · ${escape(r.period)}</span></h4>
          ${list(r.points)}
        </div>`).join('')}
      </div>
    </article>`).join('')}
  </div>`);

const cs = cv.caseStudy;
const caseStudy = frame('Case study', 'case-study', `
  <article class="frame case">
    <h2 id="case-study-title">${escape(cs.title)}</h2>
    <p class="meta">${escape(cs.meta)}</p>
    <div class="case-cols">
      <div>
        <h3>The problem</h3>${paragraphs(cs.problem)}
        <h3>The goal</h3>${paragraphs(cs.goal)}
      </div>
      <div>
        <h3>What I did</h3>${list(cs.actions)}
      </div>
      <div class="case-results">
        <h3>Results</h3>
        ${figures(cs.metrics)}
        <p class="note note-inline">${escape(cs.metricsNote)}</p>
        ${list(cs.results)}
      </div>
    </div>
    <div class="case-next">
      <h3>What I’d improve next</h3>${paragraphs(cs.next)}
    </div>
  </article>`, 'wrap-case', true);

// Home keeps the case study short: the goal and the evidence, with the full story on the portfolio page.
const caseTeaser = frame('Case study', 'case-study', `
  <article class="frame case case-teaser">
    <h2 id="case-study-title">${escape(cs.title)}</h2>
    <p class="meta">${escape(cs.meta)}</p>
    <div class="teaser-cols">
      <div>
        <h3>The goal</h3>${paragraphs(cs.goal)}
        <p><a class="btn" href="portfolio.html#case-study">Read the full case study</a></p>
      </div>
      <div>
        <h3>Results</h3>
        ${figures(cs.metrics)}
        <p class="note note-inline">${escape(cs.metricsNote)}</p>
      </div>
    </div>
  </article>`, 'wrap-case', true);

const project = (p, cls = '') => `
  <article class="frame project ${cls}" id="${p.id}">
    <h3>${escape(p.title)}</h3>
    <p class="meta">${escape(p.meta)}</p>
    ${paragraphs(p.intro)}
    ${list(p.points)}
    ${p.notes.map((n) => `<p class="small">${inline(n)}</p>`).join('')}
    ${p.links.length ? `<p class="project-links">${p.links.map((l) => link(l.url, escape(l.label))).join('')}</p>` : ''}
  </article>`;

const [app, appTests, suites] = cv.portfolio;
const work = frame('Selected work', 'work', `
  <div class="pair">
    ${project(app)}
    <div class="connector" aria-hidden="true"><span class="note">tested by</span></div>
    ${project(appTests)}
  </div>
  <div class="work-row">
    ${project(suites, 'project-suites')}
    <article class="frame project">
      <h3>${escape(cv.assessments.title)}</h3>
      <p class="meta">${escape(cv.assessments.meta)}</p>
      ${list(cv.assessments.points)}
    </article>
  </div>`);

const ew = cv.earlierWork;
const earlier = frame(ew.title, 'earlier', `
  <p class="section-note">${escape(ew.note)} Select a sample to see it full size.</p>
  <div class="earlier-grid">
  ${ew.projects.map((p) => `
    <article class="frame earlier">
      <div class="earlier-cover">${imgTag(p.cover, `${p.title} app screens`)}</div>
      <div class="earlier-body">
        <h3>${escape(p.title)} <span class="muted">${escape(p.year)}</span></h3>
        <p class="meta">${escape(p.context)} · ${escape(p.role)}</p>
        <p class="small">${escape(p.about)}</p>
        <p class="small">${escape(p.task)}</p>
        <p class="small"><strong>Platform:</strong> ${escape(p.platform)}. <strong>Tools:</strong> ${escape(p.tools)}.</p>
        ${p.samples.length ? `<ul class="samples">${p.samples.map((s) => `
          <li><a href="${s.full.src}" data-viewer data-caption="${escape(`${p.title}: ${s.label}`)}">${imgTag(s.thumb, `${p.title}: ${s.label}`)}<span>${escape(s.label)}</span></a></li>`).join('')}
        </ul>` : ''}
      </div>
    </article>`).join('')}
  </div>
  <p class="archive"><strong>${escape(cv.archive.title)}.</strong> ${escape(cv.archive.text)} ${link(cv.archive.url, 'Open the archive on Google Drive')}</p>`);

const skills = frame('Skills and tools', 'skills', `
  <div class="frame skills">
    <div class="skill-cols">
    ${cv.skills.map((g) => `
      <div>
        <h3>${escape(g.group)}</h3>
        <ul class="skill-list">${g.items.map((i) => `<li>${escape(i)}</li>`).join('')}</ul>
      </div>`).join('')}
    </div>
  </div>`);

const other = frame('Projects, mentoring and education', 'more', `
  <div class="frame">
    ${cv.otherExperience.map((o) => `
    <article class="job">
      <div class="job-side">
        ${logo(o.logo, o.org)}
        <h3>${escape(o.org)}</h3>
        ${o.period ? `<p class="job-period">${escape(o.period)}</p>` : ''}
      </div>
      <div class="job-main">
        <h4>${escape(o.title)}</h4>
        ${paragraphs(o.about, 'job-about')}
        ${list(o.points)}
        ${o.projects ? `
        <details class="clients">
          <summary>Show the ${o.projects.length} client projects</summary>
          <ul class="client-list">
            ${o.projects.map((p) => `<li><strong>${escape(p.name)}</strong> <span class="muted">${escape(p.period)}</span><br>${inline(p.text)}</li>`).join('')}
          </ul>
        </details>` : ''}
      </div>
    </article>`).join('')}
    ${cv.education.map((e) => `
    <article class="job">
      <div class="job-side">
        ${logo(e.logo, e.school)}
        <h3>Education</h3>
        <p class="job-period">${escape(e.period)}</p>
      </div>
      <div class="job-main">
        <h4>${escape(e.school)}</h4>
        <p>${escape(e.degree)} · ${escape(e.detail)}</p>
      </div>
    </article>`).join('')}
  </div>`);

const recommendations = `
<section class="frame-wrap" id="recommendations" aria-label="Recommendations">
  <div class="notes">
  ${cv.recommendations.map((r) => `
    <figure class="sticky">
      <blockquote class="clamp">${paragraphs(r.text)}</blockquote>
      <button class="more" type="button" hidden>Read the full note</button>
      <figcaption>
        ${r.photo ? `<img src="${r.photo}" alt="" width="40" height="40" loading="lazy">` : `<span class="avatar" aria-hidden="true">${initials(r.name)}</span>`}
        <span><strong>${escape(r.name)}</strong><br>${escape(r.role)}</span>
      </figcaption>
    </figure>`).join('')}
  </div>
</section>`;

const contactFrame = frame('Contact', 'contact', `
  <div class="frame contact">
    <dl class="contact-list">
      <div><dt>Email</dt><dd><a href="mailto:${contact.email}">${escape(contact.email)}</a></dd></div>
      <div><dt>WhatsApp</dt><dd><a href="${contact.whatsapp}" target="_blank" rel="noopener">${escape(contact.phone)}</a></dd></div>
      <div><dt>LinkedIn</dt><dd><a href="${contact.linkedin}" target="_blank" rel="noopener">linkedin.com/in/despisatria</a></dd></div>
      <div><dt>GitHub</dt><dd><a href="${contact.github}" target="_blank" rel="noopener">github.com/despisatria</a></dd></div>
    </dl>
  </div>`, 'wrap-contact');

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: cv.name,
  jobTitle: cv.title,
  url: SITE_URL,
  image: SITE_URL + cv.photo,
  email: `mailto:${contact.email}`,
  sameAs: [contact.linkedin, contact.github],
};

// Printed CV header: the resume page has no hero, so print adds name, summary, and contact.
const printHeader = `
<div class="print-only print-header">
  <p class="print-name">${escape(cv.name)}</p>
  <p class="hero-role">${escape(cv.title)}</p>
  ${cv.summary.map((p) => `<p>${inline(p)}</p>`).join('')}
  <p><strong>${escape(contact.email)} · ${escape(contact.phone)} · linkedin.com/in/despisatria · Portfolio: despisatria.github.io</strong></p>
</div>`;

const viewerDialog = `
<dialog class="viewer" aria-label="Sample">
  <form method="dialog"><button class="btn" type="submit">Close</button></form>
  <img src="" alt="" width="1600" height="720">
  <p class="viewer-caption"></p>
</dialog>`;

const script = `
<script>
  // Samples open in a dialog; without JavaScript the links open the full image instead.
  const viewer = document.querySelector('.viewer');
  if (viewer) {
    document.querySelectorAll('[data-viewer]').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      const img = viewer.querySelector('img');
      img.src = a.href; img.alt = a.querySelector('img').alt;
      viewer.querySelector('.viewer-caption').textContent = a.dataset.caption;
      viewer.showModal();
    }));
    viewer.addEventListener('click', (e) => { if (e.target === viewer) viewer.close(); });
  }
  // Download CV prints the resume page; other pages link to it with ?print.
  document.querySelectorAll('button[data-print]').forEach((b) => b.addEventListener('click', () => window.print()));
  window.addEventListener('beforeprint', () => document.querySelectorAll('details.clients').forEach((d) => { d.open = true; }));
  if (new URLSearchParams(location.search).has('print') && document.querySelector('button[data-print]')) {
    window.addEventListener('load', () => document.fonts.ready.then(() => setTimeout(() => window.print(), 300)));
  }
  const menu = document.querySelector('.bar-menu');
  menu.addEventListener('click', (e) => { if (e.target.closest('a, button')) menu.open = false; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); } });
  for (const note of document.querySelectorAll('.sticky')) {
    const text = note.querySelector('.clamp');
    const button = note.querySelector('.more');
    if (text.scrollHeight <= text.clientHeight + 4) { text.classList.remove('clamp'); continue; }
    button.hidden = false;
    button.addEventListener('click', () => {
      const open = text.classList.toggle('clamp') === false;
      button.textContent = open ? 'Show less' : 'Read the full note';
    });
  }
</script>`;

function page({ file, title, description, heading, body, extra = '' }) {
  const url = file === 'index.html' ? SITE_URL : SITE_URL + file;
  const printControl = file === 'resume.html'
    ? (cls) => `<button class="btn ${cls}" type="button" data-print>Download CV</button>`
    : (cls) => `<a class="btn ${cls}" href="resume.html?print">Download CV</a>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="keywords" content="software quality assurance, QA engineer, test automation, Playwright, Maestro, API testing, performance testing, Postman, JMeter, QA lead, Indonesia">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${SITE_URL}${cv.photo}">
  <meta property="og:url" content="${url}">
  <link href="assets/img/favicon.png" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,800;1,400&display=swap" rel="stylesheet">
  <link href="assets/css/site.css" rel="stylesheet">
  ${file === 'index.html' ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body>
<!-- Generated from content/resume.json by scripts/build.mjs. Edit the content file, not this one. -->
<a class="skip" href="#main">Skip to content</a>
<header class="bar">
  <a class="bar-name" href="index.html"><span class="bar-mark" aria-hidden="true">${initials(cv.name)}</span><span class="bar-id"><strong>${escape(cv.name)}</strong><span class="bar-role">${escape(cv.title)}</span></span></a>
  <nav class="bar-nav" aria-label="Pages">${navLinks(file)}</nav>
  <details class="bar-menu">
    <summary>Menu</summary>
    <nav aria-label="Pages menu">${navLinks(file)}${printControl('menu-print')}</nav>
  </details>
  ${printControl('bar-print')}
</header>
<main id="main" class="board">
${heading ? `<h1 class="page-title">${escape(heading)}</h1>` : ''}
${body}
</main>
<footer class="foot">
  <p><a href="mailto:${contact.email}">${escape(contact.email)}</a> · <a href="${contact.linkedin}" target="_blank" rel="noopener">LinkedIn</a> · <a href="${contact.github}" target="_blank" rel="noopener">GitHub</a></p>
  <p>© ${new Date().getFullYear()} ${escape(cv.name)}</p>
</footer>
${extra}
${script}
</body>
</html>
`;
}

const NAME = escape(cv.name);
const pages = [
  {
    file: 'index.html',
    title: `${NAME} | Software QA Engineer - Resume &amp; Portfolio`,
    description: DESCRIPTION,
    body: `${hero}\n${caseTeaser}\n${contactFrame}`,
  },
  {
    file: 'resume.html',
    title: `Resume | ${NAME}`,
    description: 'Experience, skills, and education of Desphi Satria Nurjaya, Software QA Engineer: Mengantar, Telkom Indonesia, Finansialku, and Variable Indonesia.',
    heading: 'Resume',
    body: `${printHeader}\n${experience}\n${other}\n${skills}`,
  },
  {
    file: 'portfolio.html',
    title: `Portfolio | ${NAME}`,
    description: 'QA case study, test automation work, and earlier test documentation samples by Desphi Satria Nurjaya.',
    heading: 'Portfolio',
    body: `${caseStudy}\n${work}\n${earlier}`,
    extra: viewerDialog,
  },
  {
    file: 'recommendations.html',
    title: `Recommendations | ${NAME}`,
    description: 'Recommendations from designers, engineers, product managers, and QA engineers who worked with Desphi Satria Nurjaya.',
    heading: 'Recommendations',
    body: recommendations,
  },
];

for (const p of pages) {
  writeFileSync(`${root}${p.file}`, page(p));
}
console.log(`built ${pages.map((p) => p.file).join(', ')}`);
