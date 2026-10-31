// Builds the site pages from content/resume.json. No dependencies: run `node scripts/build.mjs`.
// Links omit `.html`: GitHub Pages serves /overview from overview.html (scripts/serve.mjs does the same locally).
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

// The logo: initials written in the annotation hand, circled by one pressure-varied pen stroke.
// The stroke is drawn as a filled outline so it thickens and tapers like a real pen; the loop overshoots its start.
const PEN_CIRCLE = 'M19.5 29.8 L22.9 27.6 L26.6 25.7 L30.5 24.0 L34.5 22.5 L38.7 21.5 L43.0 20.5 L47.3 19.9 L51.7 19.6 L56.0 19.7 L60.2 20.1 L64.4 20.8 L68.4 21.8 L72.2 23.1 L75.8 24.8 L79.2 26.6 L82.2 28.8 L85.0 31.1 L87.3 33.7 L89.2 36.4 L90.6 39.3 L91.6 42.3 L92.1 45.3 L92.1 48.4 L91.6 51.6 L90.6 54.7 L89.2 57.7 L87.3 60.7 L85.0 63.5 L82.3 66.2 L79.3 68.7 L76.0 71.0 L72.5 73.1 L68.7 75.0 L64.8 76.7 L60.8 78.1 L56.5 79.2 L52.2 80.1 L47.8 80.7 L43.4 81.0 L38.9 80.9 L34.6 80.4 L30.3 79.6 L26.2 78.4 L22.4 76.8 L18.9 74.8 L15.7 72.7 L12.9 70.2 L10.6 67.4 L8.7 64.4 L7.3 61.3 L6.3 58.0 L5.9 54.6 L5.9 51.2 L6.4 47.7 L7.3 44.3 L8.7 40.9 L10.5 37.5 L12.7 34.3 L15.3 31.2 L18.4 28.3 L21.8 25.7 L25.5 23.3 L29.6 21.3 L33.9 19.5 L33.8 19.2 L29.5 20.9 L25.4 23.0 L21.5 25.3 L18.0 27.9 L14.8 30.7 L12.0 33.7 L9.6 37.0 L7.6 40.3 L6.0 43.8 L4.9 47.4 L4.2 51.0 L4.1 54.7 L4.4 58.4 L5.2 62.0 L6.5 65.5 L8.4 68.9 L10.8 72.1 L13.7 75.1 L17.0 77.7 L20.8 80.0 L24.9 81.8 L29.3 83.3 L33.9 84.3 L38.6 84.9 L43.4 85.2 L48.2 85.1 L52.9 84.6 L57.6 83.8 L62.1 82.7 L66.5 81.3 L70.8 79.7 L74.9 77.7 L78.8 75.5 L82.5 73.0 L85.9 70.3 L89.0 67.2 L91.7 63.9 L94.0 60.4 L95.7 56.6 L96.9 52.8 L97.4 48.8 L97.3 44.9 L96.6 41.0 L95.3 37.3 L93.3 33.8 L90.9 30.6 L88.1 27.8 L84.9 25.2 L81.4 22.9 L77.6 21.0 L73.6 19.4 L69.5 18.1 L65.1 17.1 L60.7 16.5 L56.1 16.2 L51.5 16.2 L46.9 16.5 L42.4 17.2 L37.9 18.3 L33.6 19.9 L29.5 21.9 L25.7 24.1 L22.3 26.7 L19.3 29.6 Z';
const brandMark = (text, cls = 'bar-mark') => `<svg class="${cls}" viewBox="0 0 100 100" aria-hidden="true"><path d="${PEN_CIRCLE}"/><text x="50" y="62" transform="rotate(-6 50 50)">${text}</text></svg>`;
const MONOGRAM = cv.name.split(/\s+/).map((w) => w[0].toUpperCase()).join('');

// The same pen stretched wide, for circling a figure or a word. It is stretched to its box, so the stroke thins at top and bottom like a quick pen loop.
const PEN_RING = 'M41.1 24.2 L48.5 21.9 L56.5 19.8 L64.9 18.0 L73.7 16.6 L82.8 15.5 L92.1 14.6 L101.4 14.1 L110.7 14.0 L119.9 14.3 L128.9 15.0 L137.6 16.1 L145.9 17.6 L153.8 19.5 L161.2 21.7 L167.9 24.2 L173.9 27.0 L179.2 30.1 L183.5 33.3 L186.8 36.7 L189.1 40.1 L190.3 43.4 L190.6 46.6 L190.0 49.9 L188.5 53.4 L185.9 56.9 L182.2 60.5 L177.6 64.0 L172.0 67.4 L165.7 70.6 L158.7 73.6 L151.1 76.3 L143.0 78.7 L134.5 80.8 L125.7 82.6 L116.6 84.1 L107.2 85.3 L97.7 86.1 L88.2 86.5 L78.6 86.6 L69.1 86.2 L59.9 85.3 L51.0 84.0 L42.7 82.3 L34.9 80.1 L28.0 77.5 L21.8 74.7 L16.6 71.6 L12.4 68.2 L9.3 64.6 L7.1 60.9 L6.0 57.1 L5.8 53.1 L6.6 49.1 L8.4 45.0 L11.2 40.9 L14.9 36.9 L19.5 32.9 L25.0 29.1 L31.3 25.6 L38.4 22.2 L46.2 19.2 L54.7 16.5 L63.8 14.3 L73.2 12.4 L73.1 12.1 L63.7 13.9 L54.6 16.2 L46.1 18.7 L38.1 21.6 L30.9 24.7 L24.4 28.2 L18.7 31.9 L13.8 35.7 L9.8 39.8 L6.7 44.0 L4.6 48.4 L3.5 52.9 L3.5 57.4 L4.6 61.9 L6.8 66.3 L10.1 70.6 L14.5 74.5 L19.9 78.2 L26.2 81.5 L33.5 84.4 L41.5 86.8 L50.1 88.8 L59.3 90.3 L68.7 91.3 L78.4 92.0 L88.2 92.1 L98.1 91.9 L107.8 91.3 L117.4 90.2 L126.8 88.9 L135.9 87.2 L144.7 85.1 L153.1 82.7 L161.1 80.0 L168.6 76.9 L175.4 73.5 L181.5 69.8 L186.8 65.8 L191.2 61.4 L194.5 56.8 L196.6 51.9 L197.3 46.8 L196.7 41.7 L194.7 37.0 L191.5 32.6 L187.4 28.7 L182.3 25.1 L176.5 21.9 L169.9 19.1 L162.8 16.6 L155.1 14.5 L146.9 12.8 L138.3 11.4 L129.3 10.4 L120.1 9.8 L110.7 9.6 L101.2 9.8 L91.7 10.4 L82.3 11.4 L73.1 13.1 L64.3 15.2 L55.9 17.7 L48.1 20.6 L40.9 23.9 Z';
const penRing = `<svg class="pen-ring" viewBox="0 0 200 100" preserveAspectRatio="none" aria-hidden="true"><path d="${PEN_RING}"/></svg>`;

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
  { slug: 'overview', label: 'Overview' },
  { slug: 'experience', label: 'Experience' },
  { slug: 'portfolio', label: 'Portfolio' },
  { slug: 'testimonials', label: 'Testimonials' },
];
// Contact is the footer of every page, so its link stays on the current page.
const navLinks = (current) => PAGES.map((p) => `<a href="${p.slug}"${p.slug === current ? ' aria-current="page"' : ''}>${p.label}</a>`).join('') + '<a href="#contact">Contact</a>';

const figures = (m) => `<dl class="figures">
  ${m.map((x) => `<div><dt>${escape(x.label)}</dt><dd class="trend">${x.values.map(([q, v], i) => `<span class="q${i === x.values.length - 1 ? ' q-now' : ''}"><span class="q-label">${escape(q)}</span><span class="q-val">${escape(v)}${i === x.values.length - 1 ? penRing : ''}</span></span>`).join('<span class="q-step" aria-hidden="true">→</span>')}</dd></div>`).join('')}
</dl>`;

const hero = frame('Overview', 'about', `
  <div class="frame hero">
    <div class="hero-text">
      <h1 id="about-title">${escape(cv.headline)}</h1>
      <p class="hero-byline"><span class="hero-name">${escape(cv.name)}</span><span class="hero-title">${escape(cv.title)}</span></p>
      <p class="availability"><svg class="avail-tick" viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M3 11 L8 16 L17 4"/></svg>${escape(cv.availability)}</p>
      ${cv.summary.map((p) => `<p class="hero-summary">${inline(p)}</p>`).join('')}
      <div class="hero-actions">
        <a class="btn btn-ink" href="portfolio">See my work</a>
        <a class="btn" href="#contact">Get in touch <span aria-hidden="true">↓</span></a>
      </div>
      <p class="print-only">${escape(contact.email)} · ${escape(contact.phone)} · linkedin.com/in/despisatria · Portfolio: despisatria.github.io</p>
    </div>
    <figure class="pinned-photo">
      <img src="${cv.photo}" alt="Portrait of ${escape(cv.name)}" width="480" height="480" fetchpriority="high">
    </figure>
  </div>
  <p class="note note-years">${penArrow('arrow-left')}${escape(cv.annotations[0])}</p>`, 'wrap-hero', true);

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

// One note from a teammate sits next to the case it speaks about; the rest live on the testimonials page.
const quoted = cv.recommendations.find((r) => r.name === cv.featuredQuote.from);
const featuredQuote = `
        <figure class="sticky sticky-quote">
          <blockquote><p>${escape(cv.featuredQuote.text)}</p></blockquote>
          <figcaption>
            ${quoted.photo ? `<img src="${quoted.photo}" alt="" width="40" height="40" loading="lazy">` : `<span class="avatar" aria-hidden="true">${initials(quoted.name)}</span>`}
            <span><strong>${escape(quoted.name)}</strong><br>${escape(quoted.role)}</span>
          </figcaption>
          <a class="quote-more" href="testimonials">Read all testimonials</a>
        </figure>`;

// The workflow is drawn as a flow on the board: each step a card, arrows in the reviewer's pen.
const hw = cv.howIWork;
const howIWork = frame(hw.title, 'how-i-work', `
  <p class="section-note">${escape(hw.intro)}</p>
  <div class="flow-wrap">
    <div class="flow-head">
      <div class="flow-span">
        <p class="note note-flow"><svg class="flow-arrow" viewBox="0 0 100 64" aria-hidden="true"><path d="M97 8 C70 2, 46 8, 34 24 C26 35, 22 46, 20 60"/><path d="M10 47 L20 61 L30 49"/></svg>${escape(hw.note)}</p>
        <svg class="flow-brace" viewBox="0 0 100 16" preserveAspectRatio="none" aria-hidden="true"><path d="M1 15 Q1 8 6 8 L44 8 Q50 8 50 2 Q50 8 56 8 L94 8 Q99 8 99 15"/></svg>
      </div>
    </div>
    <ol class="flow">
      ${hw.steps.map((s, i) => `<li class="frame flow-step${i < 2 ? ' flow-early' : ''}"><span class="flow-num">${String(i + 1).padStart(2, '0')}</span><h3>${escape(s.title)}</h3><p>${escape(s.text)}</p></li>`).join('')}
    </ol>
    <div class="flow-branch">
      <p class="note">${escape(hw.branch.note)}</p>
      <div class="frame flow-step flow-hotfix"><h3>${escape(hw.branch.title)}</h3><p>${escape(hw.branch.text)}</p></div>
    </div>
  </div>`);

// The company suites cannot show code or screens, so their card shows the size of each suite instead.
const suiteChart = (rows) => {
  const max = Math.max(...rows.map((r) => r.count));
  const total = rows.reduce((n, r) => n + r.count, 0);
  return `<div class="suite-chart">
        <p class="chart-total"><span class="pen-word">${total}+${penRing}</span> test cases</p>
        <ul>${rows.map((r) => `<li><span class="suite-label">${escape(r.label)} <span class="muted">${escape(r.tool)}</span></span><span class="suite-bar" style="--share: ${r.count / max}"></span><span class="suite-num">${r.count}+</span></li>`).join('')}</ul>
      </div>`;
};

const [app, appTests, suites] = cv.portfolio;
const workTeaser = frame('Recent work', 'work', `
  <div class="teaser-grid">
    ${[app, appTests, suites].map((p) => `
    <article class="frame project-teaser">
      <div class="teaser-visual">${p.preview ? `<img src="${p.preview.src}" alt="${escape(p.preview.alt)}" width="740" height="400" loading="lazy">` : suiteChart(p.chart)}</div>
      <div class="teaser-body">
        <h3>${escape(p.title)}</h3>
        <p class="meta">${escape(p.meta)}</p>
        <p>${escape(p.teaser)}</p>
        <a class="teaser-link" href="portfolio#${p.id}">See the details</a>
      </div>
    </article>`).join('')}
  </div>`);

// Each claim points at its evidence elsewhere on the site, written in the reviewer's pen.
const whatIDo = frame('What I do', 'what-i-do', `
  <div class="frame">
    <dl class="do-list">
      ${cv.whatIDo.map((d) => `<div><dt>${escape(d.title)}</dt><dd>${escape(d.text)}</dd>${d.proof ? `<dd class="proof"><a href="${d.proof.url}"><span aria-hidden="true">↳</span> ${escape(d.proof.label)}</a></dd>` : ''}</div>`).join('')}
    </dl>
  </div>`);

// Home keeps the case study short: the goal and the evidence, with the full story on the portfolio page.
const caseTeaser = frame('Case study', 'case-study', `
  <article class="frame case case-teaser">
    <h2 id="case-study-title">${escape(cs.title)}</h2>
    <p class="meta">${escape(cs.meta)}</p>
    <div class="teaser-cols">
      <div>
        <h3>The goal</h3>${paragraphs(cs.goal)}
        <p><a class="btn" href="portfolio#case-study">Read the full case study</a></p>
        ${featuredQuote}
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

const work = frame('Recent work', 'work', `
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
<section class="frame-wrap" id="recommendations" aria-label="Testimonials">
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

// Contact is the footer of every page: the dark edge of the board, so it is the last thing on each page.
// The dots carry on in chalk, the reviewer circles the promise, and the base row repeats the logo and the pages.
const out = (url, label) => `<a href="${url}" target="_blank" rel="noopener">${label} <span aria-hidden="true">↗</span></a>`;
const contactFooter = (cvControl, current) => `
<footer class="foot" id="contact" aria-labelledby="contact-title">
  <div class="foot-inner">
    <div class="foot-main">
      <h2 class="foot-title" id="contact-title">${escape(cv.contactTitle).replace(cv.contactCircle, `<span class="pen-word">${cv.contactCircle}${penRing}</span>`)}</h2>
      <p class="note foot-aside">${escape(cv.contactAside)}</p>
    </div>
    <div class="foot-side">
      <p>${escape(cv.contactNote)}</p>
      <a class="foot-email" href="mailto:${contact.email}">${escape(contact.email)}</a>
      <p class="foot-links">${out(contact.whatsapp, 'WhatsApp')}${out(contact.linkedin, 'LinkedIn')}${out(contact.github, 'GitHub')}${out(contact.instagram, 'Instagram')}</p>
      ${cvControl}
    </div>
  </div>
  <div class="foot-base">
    <a class="foot-brand" href="overview">${brandMark(MONOGRAM, 'foot-mark')}<span>${escape(cv.name)}</span></a>
    <nav class="foot-nav" aria-label="Footer">${PAGES.map((p) => `<a href="${p.slug}"${p.slug === current ? ' aria-current="page"' : ''}>${p.label}</a>`).join('')}</nav>
    <span class="foot-meta">${escape(cv.location)} · © ${new Date().getFullYear()}</span>
    <a class="foot-top" href="#main">Back to top <span aria-hidden="true">↑</span></a>
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
  address: { '@type': 'PostalAddress', addressLocality: 'Bandung', addressRegion: 'West Java', addressCountry: 'ID' },
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
  // Printing the experience page by hand still gives a plain CV, with the client list expanded.
  window.addEventListener('beforeprint', () => document.querySelectorAll('details.clients').forEach((d) => { d.open = true; }));
  const menu = document.querySelector('.bar-menu');
  menu.addEventListener('click', (e) => { if (e.target.closest('a, button')) menu.open = false; });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.open) { menu.open = false; menu.querySelector('summary').focus(); } });
  for (const note of document.querySelectorAll('.notes .sticky')) {
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

// Shared head tags, also used by the root redirect so link previews of the bare domain still show the card.
const meta = (url, title, description) => `
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
  <meta property="og:url" content="${url}">`;

function page({ slug, title, description, heading, lede, body, extra = '' }) {
  const url = SITE_URL + slug;
  // Download CV fetches the PDF from Google Drive.
  const cvLink = (cls) => `<a class="btn ${cls}" href="${escape(cv.cvUrl)}" target="_blank" rel="noopener">Download CV <span aria-hidden="true">↓</span></a>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>${meta(url, title, description)}
  <!-- Opt in to page transitions before any external stylesheet, so a slow font file cannot make the new page miss it. -->
  <style>@media (prefers-reduced-motion: no-preference) { @view-transition { navigation: auto; } }</style>
  <link href="assets/img/favicon.png" rel="icon">
  <link href="assets/img/apple-touch-icon.png" rel="apple-touch-icon">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&family=Plus+Jakarta+Sans:ital,wght@0,400;0,600;0,800;1,400&display=swap" rel="stylesheet">
  <link href="assets/css/site.css" rel="stylesheet">
  ${slug === 'overview' ? `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>` : ''}
</head>
<body>
<!-- Generated from content/resume.json by scripts/build.mjs. Edit the content file, not this one. -->
<a class="skip" href="#main">Skip to content</a>
<header class="bar">
  <a class="bar-name" href="overview">${brandMark(MONOGRAM)}<span class="bar-id"><strong>${escape(cv.name)}</strong><span class="bar-role">${escape(cv.title)}</span></span></a>
  <nav class="bar-nav" aria-label="Pages">${navLinks(slug)}</nav>
  <details class="bar-menu">
    <summary>Menu</summary>
    <nav aria-label="Pages menu">${navLinks(slug)}${cvLink('menu-print')}</nav>
  </details>
  ${cvLink('bar-print')}
</header>
<main id="main" class="board">
${heading ? `<h1 class="page-title">${escape(heading)}</h1>` : ''}
${lede ? `<p class="page-lede">${inline(lede)}</p>` : ''}
${body}
</main>
${contactFooter(`<a class="foot-cv" href="${escape(cv.cvUrl)}" target="_blank" rel="noopener">Download CV <span aria-hidden="true">↓</span></a>`, slug)}
${extra}
${script}
</body>
</html>
`;
}

const NAME = escape(cv.name);
const pages = [
  {
    slug: 'overview',
    title: `${NAME} | Software QA Engineer - Resume &amp; Portfolio`,
    description: DESCRIPTION,
    body: `${hero}\n${howIWork}\n${caseTeaser}\n${workTeaser}\n${whatIDo}`,
  },
  {
    slug: 'experience',
    title: `Experience &amp; Skills | ${NAME}`,
    description: 'Experience, skills, and education of Desphi Satria Nurjaya, Software QA Engineer: Mengantar, Telkom Indonesia, Finansialku, and Variable Indonesia.',
    heading: 'Experience & Skills',
    body: `${printHeader}\n${experience}\n${other}\n${skills}`,
  },
  {
    slug: 'portfolio',
    title: `Portfolio | ${NAME}`,
    description: 'QA case study, test automation work, and earlier test documentation samples by Desphi Satria Nurjaya.',
    heading: 'Portfolio',
    body: `${caseStudy}\n${work}\n${earlier}`,
    extra: viewerDialog,
  },
  {
    slug: 'testimonials',
    title: `Testimonials | ${NAME}`,
    description: 'Recommendations from designers, engineers, product managers, and QA engineers who worked with Desphi Satria Nurjaya.',
    heading: 'Testimonials',
    lede: cv.testimonialsNote,
    body: recommendations,
  },
];

for (const p of pages) {
  writeFileSync(`${root}${p.slug}.html`, page(p));
}

// The bare domain sends visitors to /overview, keeping any #anchor. Without JavaScript the meta refresh does it.
const home = pages[0];
writeFileSync(`${root}index.html`, `<!DOCTYPE html>
<html lang="en">
<head>${meta(SITE_URL + home.slug, home.title, home.description)}
  <meta http-equiv="refresh" content="0; url=${home.slug}">
  <script>location.replace('${home.slug}' + location.search + location.hash);</script>
</head>
<body>
<!-- Generated by scripts/build.mjs. -->
<p><a href="${home.slug}">Continue to ${NAME}'s overview</a></p>
</body>
</html>
`);
console.log(`built ${pages.map((p) => `${p.slug}.html`).join(', ')}, index.html (redirect to /${home.slug})`);
