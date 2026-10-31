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
  const attrs = external ? ' target="_blank" rel="noopener"' : '';
  return `<a href="${url}"${cls ? ` class="${cls}"` : ''}${attrs}>${label}</a>`;
}

const paragraphs = (text, cls = '') => text.split('\n').filter(Boolean).map((p) => `<p${cls ? ` class="${cls}"` : ''}>${inline(p)}</p>`).join('');
const list = (items, cls = '') => items.length ? `<ul${cls ? ` class="${cls}"` : ''}>${items.map((i) => `<li>${inline(i)}</li>`).join('')}</ul>` : '';
const icon = (name) => `<i class="bi bi-${name}" aria-hidden="true"></i>`;
const initials = (name) => name.split(/\s+/).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

const { contact } = cv;

const socials = `
  <a class="icon-btn" href="${contact.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${icon('linkedin')}</a>
  <a class="icon-btn" href="${contact.github}" target="_blank" rel="noopener" aria-label="GitHub">${icon('github')}</a>
  <a class="icon-btn" href="${contact.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icon('instagram')}</a>`;

const hero = `
<section id="about" class="hero">
  <img class="hero-photo" src="${cv.photo}" alt="Portrait of ${escape(cv.name)}" width="240" height="240">
  <div class="hero-text">
    <p class="eyebrow">${escape(cv.title)}</p>
    <h1>${escape(cv.name)}</h1>
    ${cv.summary.map((p) => `<p class="lead">${inline(p)}</p>`).join('')}
    <div class="hero-actions">
      <a class="btn btn-primary" href="mailto:${contact.email}">${icon('envelope')} Email me</a>
      <a class="btn" href="${contact.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp')} WhatsApp</a>
      <span class="socials">${socials}</span>
    </div>
    <p class="print-only print-contact">${escape(contact.email)} · ${escape(contact.phone)} · linkedin.com/in/despisatria · Portfolio: despisatria.github.io</p>
  </div>
</section>
<ul class="stats" aria-label="Highlights">
  ${cv.highlights.map((h) => `<li><strong>${escape(h.value)}</strong><span>${escape(h.label)}</span></li>`).join('')}
</ul>`;

const experience = `
<section id="experience" class="section">
  <h2>Experience</h2>
  <div class="timeline">
  ${cv.experience.map((c) => `
    <article class="company">
      <h3>${escape(c.company)}</h3>
      ${paragraphs(c.about, 'about')}
      ${c.roles.map((r) => `
      <div class="role">
        <div class="role-head">
          <h4>${escape(r.title)} <span class="muted">· ${escape(r.type)}</span></h4>
          <span class="period">${escape(r.period)}</span>
        </div>
        ${list(r.points)}
      </div>`).join('')}
    </article>`).join('')}
  </div>
</section>`;

const cs = cv.caseStudy;
const caseStudy = `
<article class="case-study card" id="case-study">
  <p class="tag">Case study</p>
  <h3>${escape(cs.title)}</h3>
  <p class="meta">${escape(cs.meta)}</p>
  <div class="cs-grid">
    <div>
      <h4>The problem</h4>${paragraphs(cs.problem)}
      <h4>The goal</h4>${paragraphs(cs.goal)}
      <h4>What I did</h4>${list(cs.actions)}
    </div>
    <div>
      <h4>Results</h4>
      <div class="metric-row">
        ${cs.metrics.map((m) => `<div class="metric"><span class="metric-label">${escape(m.label)}</span><span class="metric-value"><s>${escape(m.from)}</s> ${icon('arrow-right')} <strong>${escape(m.to)}</strong></span><span class="metric-note">Q1 → Q2 2026</span></div>`).join('')}
      </div>
      ${list(cs.results)}
      <h4>What I’d improve next</h4>${paragraphs(cs.next)}
    </div>
  </div>
</article>`;

const projectCard = (p) => `
<article class="card project" id="${p.id}">
  <h3>${escape(p.title)}</h3>
  <p class="meta">${escape(p.meta)}</p>
  ${paragraphs(p.intro)}
  ${list(p.points)}
  ${p.notes.map((n) => `<p class="note">${inline(n)}</p>`).join('')}
  ${p.links.length ? `<p class="links">${p.links.map((l) => link(l.url, `${escape(l.label)} ${icon('arrow-up-right')}`)).join('')}</p>` : ''}
</article>`;

const portfolio = `
<section id="portfolio" class="section">
  <h2>Portfolio</h2>
  ${caseStudy}
  <div class="card-grid">
    ${cv.portfolio.map(projectCard).join('')}
    <article class="card project">
      <h3>${escape(cv.assessments.title)}</h3>
      <p class="meta">${escape(cv.assessments.meta)}</p>
      ${list(cv.assessments.points)}
    </article>
  </div>
  <a class="archive card" href="${cv.archive.url}" target="_blank" rel="noopener">
    <span><strong>${escape(cv.archive.title)}</strong> ${escape(cv.archive.text)}</span>
    <span class="archive-cta">Open on Google Drive ${icon('arrow-up-right')}</span>
  </a>
</section>`;

const skills = `
<section id="skills" class="section">
  <h2>Skills</h2>
  <div class="skill-groups">
  ${cv.skills.map((g) => `
    <div>
      <h3>${escape(g.group)}</h3>
      <ul class="chips">${g.items.map((i) => `<li>${escape(i)}</li>`).join('')}</ul>
    </div>`).join('')}
  </div>
</section>`;

const other = `
<section id="more" class="section">
  <h2>Projects, mentoring &amp; education</h2>
  <div class="other-grid">
  ${cv.otherExperience.map((o) => `
    <article class="card">
      <h3>${escape(o.title)}</h3>
      <p class="meta">${escape(o.org)}${o.period ? ` · ${escape(o.period)}` : ''}</p>
      ${paragraphs(o.about)}
      ${list(o.points)}
      ${o.projects ? `
      <details class="projects">
        <summary>${o.projects.length} client projects</summary>
        <ul class="project-list">
          ${o.projects.map((p) => `<li><strong>${escape(p.name)}</strong> <span class="period">${escape(p.period)}</span><p>${inline(p.text)}</p></li>`).join('')}
        </ul>
      </details>` : ''}
    </article>`).join('')}
  ${cv.education.map((e) => `
    <article class="card education">
      <p class="tag">${icon('mortarboard')} Education</p>
      <h3>${escape(e.school)}</h3>
      <p class="meta">${escape(e.degree)} · ${escape(e.detail)} · ${escape(e.period)}</p>
    </article>`).join('')}
  </div>
</section>`;

const recommendations = `
<section id="recommendations" class="section">
  <h2>Recommendations</h2>
  <p class="section-intro">What teammates, designers, engineers, and product managers say about working with me.</p>
  <div class="quotes">
  ${cv.recommendations.map((r) => `
    <figure class="quote card">
      <blockquote class="clamp">${paragraphs(r.text)}</blockquote>
      <button class="more" type="button" hidden>Read more</button>
      <figcaption>
        ${r.photo ? `<img src="${r.photo}" alt="" width="44" height="44" loading="lazy">` : `<span class="avatar" aria-hidden="true">${initials(r.name)}</span>`}
        <span><strong>${escape(r.name)}</strong><span class="muted">${escape(r.role)}</span></span>
      </figcaption>
    </figure>`).join('')}
  </div>
</section>`;

const footer = `
<footer id="contact" class="footer">
  <div class="wrap">
    <h2>Let’s work together</h2>
    <p>Open to QA roles and conversations about quality, test automation, and building QA teams.</p>
    <div class="hero-actions">
      <a class="btn btn-primary" href="mailto:${contact.email}">${icon('envelope')} ${escape(contact.email)}</a>
      <a class="btn" href="${contact.whatsapp}" target="_blank" rel="noopener">${icon('whatsapp')} ${escape(contact.phone)}</a>
      <span class="socials">${socials}</span>
    </div>
    <p class="fineprint">© ${new Date().getFullYear()} ${escape(cv.name)}</p>
  </div>
</footer>`;

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

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>${escape(cv.name)} | Software QA Engineer - Resume &amp; Portfolio</title>
  <meta name="description" content="${DESCRIPTION}">
  <meta name="keywords" content="software quality assurance, QA engineer, test automation, Playwright, Maestro, API testing, performance testing, Postman, JMeter, QA lead, Indonesia">
  <link rel="canonical" href="${SITE_URL}">
  <meta property="og:type" content="profile">
  <meta property="og:title" content="${escape(cv.name)} | Software QA Engineer">
  <meta property="og:description" content="${DESCRIPTION}">
  <meta property="og:image" content="${SITE_URL}${cv.photo}">
  <meta property="og:url" content="${SITE_URL}">
  <link href="assets/img/favicon.png" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap" rel="stylesheet">
  <link href="assets/vendor/bootstrap-icons/bootstrap-icons.css" rel="stylesheet">
  <link href="assets/css/site.css" rel="stylesheet">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
<!-- Generated from content/resume.json by scripts/build.mjs. Edit the content file, not this one. -->
<a class="skip" href="#main">Skip to content</a>
<header class="topbar">
  <div class="wrap topbar-inner">
    <a class="brand" href="#about">${escape(cv.name)}</a>
    <nav aria-label="Sections">
      <a href="#experience">Experience</a>
      <a href="#portfolio">Portfolio</a>
      <a href="#skills">Skills</a>
      <a href="#recommendations">Recommendations</a>
      <a href="#contact">Contact</a>
    </nav>
    <button class="btn btn-small" type="button" data-print>${icon('download')} Download CV</button>
  </div>
</header>
<main id="main" class="wrap">
${hero}
${experience}
${portfolio}
${skills}
${other}
${recommendations}
</main>
${footer}
<script>
  document.querySelector('[data-print]').addEventListener('click', () => window.print());
  window.addEventListener('beforeprint', () => document.querySelectorAll('details').forEach((d) => { d.open = true; }));
  for (const quote of document.querySelectorAll('.quote')) {
    const text = quote.querySelector('.clamp');
    const button = quote.querySelector('.more');
    if (text.scrollHeight <= text.clientHeight + 4) { text.classList.remove('clamp'); continue; }
    button.hidden = false;
    button.addEventListener('click', () => {
      const open = text.classList.toggle('clamp') === false;
      button.textContent = open ? 'Show less' : 'Read more';
    });
  }
</script>
</body>
</html>
`;

writeFileSync(`${root}index.html`, html);
console.log('index.html built');
