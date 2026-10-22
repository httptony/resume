const {
  Document, Packer, Paragraph, TextRun, ExternalHyperlink, AlignmentType,
  BorderStyle, LevelFormat, convertInchesToTwip,
} = require("docx");
const fs = require("fs");

const OUTPUT = process.argv[2] || require("path").join(__dirname, "Tony_Tshandu_Resume.docx");

const TEAL = "2B7A78";
const BLACK = "1A1A1A";
const FONT = "Calibri";
const SZ = 20; // 10pt body
const DOT = " · ";
const SEP = "  •  ";

const r = (text, o = {}) => new TextRun({ text, font: FONT, color: BLACK, size: SZ, ...o });
const t = (text, o = {}) => r(text, { color: TEAL, ...o });

const section = (text) => new Paragraph({
  keepNext: true,
  spacing: { before: 110, after: 50 },
  border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: TEAL, space: 3 } },
  children: [r(text, { bold: true })],
});

const entry = (name, role, date, before = 70, italicRole = true) => new Paragraph({
  keepNext: true,
  spacing: { before, after: 25 },
  children: [
    r(name, { bold: true }),
    r("  |  "),
    r(role, { italics: italicRole }),
    r("  "),
    t(date),
  ],
});

const bullet = (children, after = 20) => new Paragraph({
  numbering: { reference: "arrows", level: 0 },
  spacing: { before: 0, after },
  children: typeof children === "string" ? [r(children)] : children,
});

const skill = (label, value) => new Paragraph({
  spacing: { before: 0, after: 25 },
  children: [t(label + ":  ", { bold: true }), r(value)],
});

const cert = (name, status) => new Paragraph({
  spacing: { before: 0, after: 20 },
  children: [r(name, { bold: true }), r("  "), t(status, { italics: true })],
});

const link = (text, url, teal = true) => new ExternalHyperlink({
  link: url,
  children: [teal ? t(text, { size: 18 }) : r(text, { size: 18 })],
});

const SUMMARY =
  "I'm a security engineer who enjoys turning slow, manual security work into automation. " +
  "I moved into cybersecurity from IT support and web development, and during my internship at Cyber1 Solutions " +
  "I built SOAR playbooks and SIEM monitoring workflows, including SLA tracking for a major South African bank. " +
  "I recently joined Maidar Secure full time and I'm finishing my IT diploma alongside work. " +
  "Next, I want to go deeper into threat intelligence and offensive security.";

const children = [
  // Header
  new Paragraph({
    spacing: { before: 0, after: 20 },
    children: [r("TONY TSHANDU", { bold: true, size: 48 })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 40 },
    children: [t(`Junior Security Engineer  ·  Security Automation  ·  SOAR & SIEM`, { italics: true })],
  }),
  new Paragraph({
    spacing: { before: 0, after: 20 },
    children: [
      r("Sandton, South Africa", { size: 18 }), r(SEP, { size: 18 }),
      r("+27 79 237 9248", { size: 18 }), r(SEP, { size: 18 }),
      link("17tonydaniels@gmail.com", "mailto:17tonydaniels@gmail.com", false), r(SEP, { size: 18 }),
      link("linkedin.com/in/tony-tshandu", "https://www.linkedin.com/in/tony-tshandu"), r(SEP, { size: 18 }),
      link("github.com/httptony", "https://github.com/httptony"),
    ],
  }),

  // Profile
  section("PROFESSIONAL PROFILE"),
  new Paragraph({ spacing: { before: 0, after: 0 }, children: [r(SUMMARY)] }),

  // Experience
  section("PROFESSIONAL EXPERIENCE"),
  entry("Maidar Secure", "Junior Security Engineer", "Oct 2026 - Present", 0),
  bullet("Fixed the failing Zoho MCP server in Strike48 and reorganised Devo user permissions and privileges to match each role."),

  entry("Cyber1 Solutions", "Cybersecurity Engineer Intern", "Jun 2026 - Oct 2026"),
  bullet("Built an SLA tracking pipeline in Devo SOAR (LogicHub) for a major South African bank, timing every Zoho Desk ticket against notify, escalate, respond and resolve targets."),
  bullet("Wrote the logic in Python and SQL (state tracking, severity-based breach windows, 44-field data model) and scoped it to open tickets so the breach dashboard refreshes every 3 minutes."),
  bullet("Built a SIEM ingestion monitor in Strike48 Prospector Studio (YAML, Lua, Devo MCP) that compares daily event volumes with a 7-day baseline and writes LLM fault reports."),
  bullet("Traced a 75% under-count in reported events (94 vs. 380) to a timestamp format bug in the monitor's queries, and fixed it."),
  bullet("Designed the company's Strike48 access model, mapping job positions to groups and a small set of custom roles."),
  bullet("Also wrote Devo LINQ queries, AI agent prompts for fraud risk scoring, and a self-service case export workflow for clients."),

  entry("Dalom Investment Projects", "IT Technician", "2023 - 2026"),
  bullet("Built the company website (HTML5, CSS3) and ran its social channels, growing online engagement by 60% in six months."),
  bullet("Designed and managed the SQL databases behind daily operations, with role-based access control."),
  bullet("Resolved 15+ IT tickets a month and cut unauthorised access incidents by an estimated 40% with new access controls."),

  new Paragraph({
    spacing: { before: 70, after: 0 },
    children: [
      r("Earlier roles:  ", { bold: true }),
      r("Solutions Specialist, Solotek Power Africa (2021-2022)" + DOT +
        "Showroom Manager, I'm Healthy (2022)"),
    ],
  }),

  // Projects
  section("PROJECTS"),
  bullet([
    r("AXIOM", { bold: true }), t(" (React, Anthropic API)"),
    r(": actuarial app for premium pricing (SA85-90 tables), IBNR reserving and an AI assistant."),
  ]),
  bullet([
    r("SDICMS", { bold: true }), t(" (React)"),
    r(": proposal, sprint plan and login UI for a law enforcement case management portal."),
  ]),

  // Education
  section("EDUCATION"),
  entry("Richfield College", "Diploma in Information Technology", "2024 - 2026 (expected)", 0, false),
  new Paragraph({
    spacing: { before: 0, after: 40 },
    children: [r("Secure Programming" + DOT + "Web Architecture" + DOT + "Relational Database Systems" + DOT + "Network Infrastructure" + DOT + "Information Assurance", { italics: true })],
  }),
  entry("Richfield College", "BSc in Information Technology (Advanced Entry)", "2026 - 2027 (expected)", 0, false),
  new Paragraph({
    spacing: { before: 0, after: 0 },
    children: [r("Focus: Systems Security" + DOT + "Cloud Computing" + DOT + "Software Engineering", { italics: true })],
  }),

  // Certifications
  section("CERTIFICATIONS"),
  cert("Cisco CyberOps Associate", "Completed"),
  cert("Cisco Network Technician Career Path", "Completed"),
  cert("Google Cybersecurity Professional Certificate (Foundations of Cybersecurity, Play It Safe)", "Completed"),
  cert("CompTIA Security+", "In progress, expected 2027"),
  cert("Arcon Privileged Access Management (PAM) Training, 2 days", "Completed"),
  cert("AI & Cyber Security One-Day Intensive, CDDTI", "Completed"),
  cert("Bitcoin Lightning Developer Bootcamp, Africa Free Routing", "Completed"),

  // Skills & interests
  section("SKILLS & INTERESTS"),
  skill("Languages", ["Python", "SQL", "Devo LINQ", "Lua", "YAML", "JavaScript", "React", "HTML/CSS", "C++", "Git/GitHub"].join(DOT)),
  skill("Security", ["Devo SIEM", "Devo SOAR (LogicHub)", "SOAR playbook design", "SIEM monitoring", "Access control & RBAC", "Arcon PAM"].join(DOT)),
  skill("AI Tools", ["Strike48 Prospector Studio", "Claude", "ChatGPT", "Gemini", "GitHub Copilot", "MCP server integration"].join(DOT)),
  skill("Blockchain", ["Bitcoin Script (P2SH, SegWit, multisig, timelocks)", "Lightning Network"].join(DOT)),
  skill("Interests", ["Chess", "Tennis", "Running", "Soccer", "Former national cheerleader"].join(DOT)),
];

const doc = new Document({
  creator: "Tony Tshandu",
  title: "Tony Tshandu Resume",
  styles: { default: { document: { run: { font: FONT, size: SZ, color: BLACK } } } },
  numbering: {
    config: [{
      reference: "arrows",
      levels: [{
        level: 0,
        format: LevelFormat.BULLET,
        text: "▸",
        alignment: AlignmentType.LEFT,
        style: {
          paragraph: { indent: { left: convertInchesToTwip(0.24), hanging: convertInchesToTwip(0.17) } },
          run: { font: "Segoe UI Symbol", size: 16, color: BLACK },
        },
      }],
    }],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: {
          top: convertInchesToTwip(0.5), bottom: convertInchesToTwip(0.5),
          left: convertInchesToTwip(0.65), right: convertInchesToTwip(0.65),
        },
      },
    },
    children,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUTPUT, buf);
  console.log("Done:", OUTPUT);
});
