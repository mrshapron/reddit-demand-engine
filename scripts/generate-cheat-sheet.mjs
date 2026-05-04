import fs from 'node:fs';
import path from 'node:path';
import PDFDocument from 'pdfkit';

const outputPath = path.resolve('docs/Reddit-Demand-Engine-Cheat-Sheet.pdf');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

const doc = new PDFDocument({
  size: 'A4',
  margin: 42,
  info: {
    Title: 'Reddit Demand Engine Cheat Sheet',
    Author: 'Enso AI',
    Subject: 'Short presentation cheat sheet',
  },
});

doc.pipe(fs.createWriteStream(outputPath));

const pageWidth = doc.page.width;
const orange = '#ff4b1f';
const orangeDark = '#c73512';
const ink = '#111827';
const muted = '#64748b';
const soft = '#f8fafc';
const border = '#e2e8f0';

function drawIcon(x, y, size) {
  doc.roundedRect(x, y, size, size, 14).fill(orange);
  doc
    .circle(x + size / 2, y + size / 2, size * 0.24)
    .lineWidth(2.2)
    .stroke('#fff7ed');
  doc
    .moveTo(x + size * 0.58, y + size * 0.34)
    .lineTo(x + size * 0.47, y + size * 0.56)
    .lineTo(x + size * 0.36, y + size * 0.66)
    .lineWidth(2.4)
    .stroke('#fff7ed');
}

function pill(text, x, y, width, color = orange) {
  doc.roundedRect(x, y, width, 20, 10).fill(`${color}15`);
  doc.fillColor(color).font('Helvetica-Bold').fontSize(8.5).text(text, x, y + 6, {
    width,
    align: 'center',
  });
}

function section(title, body, x, y, width, options = {}) {
  const titleColor = options.titleColor ?? ink;
  doc.fillColor(titleColor).font('Helvetica-Bold').fontSize(12.5).text(title, x, y, { width });
  doc.fillColor(muted).font('Helvetica').fontSize(9.6).lineGap(2).text(body, x, y + 18, { width });
}

function list(items, x, y, width, color = ink) {
  let cursor = y;
  for (const item of items) {
    doc.circle(x + 3, cursor + 4.5, 2).fill(orange);
    doc.fillColor(color).font('Helvetica').fontSize(9.4).lineGap(1.5).text(item, x + 12, cursor, {
      width: width - 12,
    });
    cursor = doc.y + 8;
  }
  return cursor;
}

// Header
drawIcon(42, 42, 48);
doc.fillColor(ink).font('Helvetica-Bold').fontSize(25).text('Reddit Demand Engine', 104, 45);
doc.fillColor(muted).font('Helvetica').fontSize(10.5).text(
  'Company presentation cheat sheet - listen first, help second, generate demand responsibly.',
  105,
  77,
);
pill('Reddit-native', pageWidth - 220, 50, 82);
pill('Human-approved', pageWidth - 130, 50, 88, orangeDark);

// Hero box
doc.roundedRect(42, 112, pageWidth - 84, 70, 16).fill(soft).stroke(border);
doc.fillColor(orange).font('Helvetica-Bold').fontSize(9).text('ONE-LINE PITCH', 64, 130);
doc.fillColor(ink).font('Helvetica-Bold').fontSize(17).lineGap(3).text(
  'Helps companies find real customer conversations on Reddit, reply helpfully, and plan posts without looking spammy.',
  64,
  148,
  { width: pageWidth - 128 },
);

// Columns
const leftX = 42;
const midX = 214;
const rightX = 386;
const colW = 150;

section(
  'The Problem',
  'Reddit has high-intent customer pain, but companies often fail because they post promotional content, ignore subreddit rules, sound like generic AI, and miss buying signals.',
  leftX,
  212,
  colW,
);

section(
  'The Solution',
  'The app turns Reddit into a responsible listening, conversation, and demand engine. It helps the company participate like a useful human, not a hidden ad.',
  midX,
  212,
  colW,
);

section(
  'Main Differentiator',
  'This is not a generic AI writing tool. It adds context, subreddit norms, risk warnings, scheduling, and human approval around every action.',
  rightX,
  212,
  colW,
);

// Main tabs
doc.fillColor(ink).font('Helvetica-Bold').fontSize(14).text('Main Tabs', 42, 330);
const tabs = [
  ['Dashboard', 'Quick overview of subreddits, reply opportunities, drafts, weekly plan, and best actions.'],
  ['Company Profile', 'Source of truth for company, product, ICP, pains, competitors, tone, and things to avoid.'],
  ['Listen', 'Understand communities first: subreddit fit, lead potential, spam risk, rules, questions, and pains.'],
  ['Respond to Posts', 'Find relevant posts, explain why they matter, draft helpful replies, and warn about product mentions.'],
  ['Generate Posts', 'Create Reddit-native drafts like lessons, checklists, research summaries, and honest questions.'],
  ['Scheduler', 'Plan approved posts for future publishing so the company does not post everything at once.'],
  ['Strategy', 'Weekly playbook: where to comment, where to post, how to build trust, and what to avoid.'],
];

let y = 354;
for (const [name, description] of tabs) {
  doc.roundedRect(42, y - 6, pageWidth - 84, 32, 9).fill('#ffffff').stroke(border);
  doc.fillColor(orange).font('Helvetica-Bold').fontSize(9.5).text(name, 56, y, { width: 110 });
  doc.fillColor(muted).font('Helvetica').fontSize(9).text(description, 168, y, {
    width: pageWidth - 226,
  });
  y += 39;
}

// Safety + next steps
doc.roundedRect(42, y + 6, 250, 172, 16).fill('#fff7ed').stroke('#fed7aa');
doc.fillColor(orangeDark).font('Helvetica-Bold').fontSize(13).text('Safety Principles', 62, y + 25);
list(
  [
    'Listen before posting.',
    'Commenting is safer than posting.',
    'Never auto-post without approval.',
    'Never pretend to be a fake customer.',
    'Warn when something may look spammy.',
  ],
  62,
  y + 53,
  210,
  ink,
);

doc.roundedRect(312, y + 6, pageWidth - 354, 172, 16).fill('#eff6ff').stroke('#bfdbfe');
doc.fillColor('#1d4ed8').font('Helvetica-Bold').fontSize(13).text('Next Steps', 332, y + 25);
list(
  [
    'Connect Reddit API and OAuth.',
    'Store profiles, drafts, schedules, and tracking in a database.',
    'Add real LLM generation for replies and posts.',
    'Track comments, engagement, and reply opportunities.',
    'Enable approved scheduled posting later.',
  ],
  332,
  y + 53,
  pageWidth - 394,
  ink,
);

// Footer
doc.fillColor(muted).font('Helvetica').fontSize(8).text(
  'Presentation reminder: emphasize trust, community norms, human approval, and Reddit-native value.',
  42,
  doc.page.height - 54,
  { width: pageWidth - 84, align: 'center' },
);

doc.end();
console.log(outputPath);
