/**
 * English message catalog (the baseline locale).
 *
 * `en` is the default language of 42-research. `zh.ts` mirrors this exact shape;
 * its type is checked against `typeof en` so missing keys fail at compile time.
 */
export const en = {
  site: {
    title: '42-research · Every question worth asking deserves a real answer',
    description:
      '42-research investigates the technical questions people actually care about, and answers them with reproducible, traceable, peer-reviewable methods — no guessing, no echoing unverified claims.',
    tagline: 'Every question worth asking deserves a real answer.',
  },

  nav: {
    research: 'Research',
    contribute: 'Contribute',
    about: 'About',
  },

  langSwitch: {
    label: 'Language',
    en: 'EN',
    zh: '中文',
  },

  home: {
    kicker: '// research dossier · est. 2026',
    heroLine1: 'Every question worth asking,',
    heroLine2: 'deserves',
    heroEmphasis: 'a real answer',
    heroBody:
      '42-research investigates the technical questions people genuinely care about but rarely verify rigorously. Every conclusion states the conditions under which it holds and links to clickable primary sources —',
    heroBodyStrong: 'no guessing, no echoing unverified claims.',
    ctaBrowse: 'Browse research →',
    ctaHow: 'How we do research',
    stats: {
      topics: 'Research topics',
      published: 'Published',
      primarySourced: 'Conclusions with primary sources',
      reproducible: 'Open & reproducible',
      reproducibleValue: 'Reproducible',
    },
    domains: {
      heading: 'Domains',
      items: [
        {
          icon: '◈',
          title: 'AI & machine intelligence',
          desc: 'The real limits of model capability, and where AI tools actually fit in production — past the hype, into the data.',
        },
        {
          icon: '⬡',
          title: 'Architecture & infrastructure',
          desc: 'The real cost and latency of edge, cloud, and database choices — modeled on actual usage, not vendor self-benchmarks.',
        },
        {
          icon: '◎',
          title: 'Tooling & technology choices',
          desc: 'How to choose frameworks, platforms, and paid services. Conclusions split by scenario, not one-size-fits-all picks.',
        },
        {
          icon: '◇',
          title: 'Trends & judgment',
          desc: 'Is a technology a real trend or just hype? Judged from primary signals and first principles, with falsifiable predictions on record.',
        },
      ],
    },
    featured: {
      heading: 'Featured research',
      all: '→ All research',
      empty: 'Research in progress — the first study is coming soon.',
    },
    trust: {
      kicker: '// why trust this',
      heading: 'Why you can trust the conclusions',
      items: [
        {
          title: 'Primary sources only',
          desc: 'Data comes from official docs or our own measurements — never second-hand summaries or marketing. Every fact carries a clickable source.',
        },
        {
          title: 'Conclusions state their limits',
          desc: 'Every conclusion says where it holds and where it does not — no answer pretending to be universally true.',
        },
        {
          title: 'Self-rebuttal first',
          desc: 'Before concluding, we actively seek counter-examples and question ourselves. Uncertainty is stated, not hidden.',
        },
      ],
    },
    cta: {
      kicker: '// contribute',
      heading: 'A research topic you want to see?',
      body: 'A technical question you have always wanted settled but could never find a verifiable answer for? Submit it. We will run it through the same research process and give a traceable conclusion.',
      button: 'Submit a research topic →',
    },
  },

  about: {
    metaTitle: 'Research methodology · 42-research',
    metaDescription:
      'The 42-research methodology: first principles, topic lifecycle, citation tiers, adversarial verification, and the definition-of-done quality gate.',
    kicker: '// about · 42-research',
    heading: 'About 42-research',
    heroBody:
      'Every question worth asking deserves a real answer. 42-research investigates the technical questions people genuinely care about — yet rarely verify — and delivers answers that hold up to scrutiny.',
    why: {
      kicker: '// why we exist',
      heading: 'Why 42',
      p1a: 'In The Hitchhiker’s Guide to the Galaxy, a supercomputer spends seven and a half million years computing the Ultimate Answer to Life, the Universe, and Everything —',
      p1b: '42',
      p1c: '. The joke: the answer arrived, but no one remembered the question.',
      p2a: 'Technology is the mirror image: assertions, sales pitches, and "I heard that…" everywhere, yet rarely is the question asked clearly or the answer chased to the end. 42-research exists to ask the',
      p2b: 'questions worth being curious about',
      p2c: 'clearly, then answer them with reproducible, traceable, peer-reviewable methods that',
      p2d: 'hold up to verification',
      p2e: '.',
    },
    principles: {
      heading: 'First principles',
      kicker: 'first-principles',
      items: [
        {
          no: '01',
          title: 'Fact-based, not from memory',
          desc: 'Every technical claim must be verified against official docs or primary data — training data can be out of date.',
        },
        {
          no: '02',
          title: 'Don’t echo, verify',
          desc: 'Popular claims (e.g. "X totally beats Y") are verified independently, with any deviation from the original claim recorded honestly.',
        },
        {
          no: '03',
          title: 'Conclusions are falsifiable',
          desc: 'Every conclusion states the conditions under which it holds and the conditions under which it does not.',
        },
        {
          no: '04',
          title: 'Citations are clickable',
          desc: 'Every factual claim carries a URL, annotated with the verification date and status.',
        },
      ],
    },
    lifecycle: {
      heading: 'Topic lifecycle',
      kicker: 'topic-lifecycle',
      items: [
        { stage: 'hypothesis', desc: 'State a hypothesis and define falsifiable criteria.' },
        { stage: 'survey', desc: 'Gather from multiple sources (official docs / primary data / community practice).' },
        { stage: 'experiment', desc: 'Reproducible measurement (benchmarks / cost models / deployment), with environment and commands recorded.' },
        { stage: 'verify', desc: 'Adversarial verification: actively seek counter-examples, challenge your own conclusion.' },
        { stage: 'synthesize', desc: 'Synthesize into a conclusion with a decision matrix and applicability boundaries.' },
        { stage: 'publish', desc: 'Produce a self-contained HTML artifact; metadata indexed in D1.' },
      ],
    },
    citation: {
      kicker: '// citation-standard',
      heading: 'Citation tiers',
      p1a: 'Primary sources',
      p1b: '(official docs, raw benchmark data) outweigh',
      p1c: 'secondary sources',
      p1d: '(blogs, paraphrases).',
      p2: 'On conflict, primary sources win, and the conflict is recorded. Each citation is annotated with its verification date and status.',
    },
    adversarial: {
      kicker: '// adversarial-verification',
      heading: 'Adversarial verification',
      p1: 'Before synthesizing, every core conclusion is challenged with "where could this be wrong?": are there counter-examples, is the data biased, is correlation confused with causation, does it depend on a fast-changing fact.',
      p2: 'Multiple skeptics can be dispatched in parallel to independently attempt a rebuttal; if a majority refute it, the conclusion does not stand.',
    },
    dod: {
      kicker: '// definition-of-done',
      heading: 'Definition of done',
      items: [
        'Hypothesis is explicit and falsifiable',
        'Every factual claim has ≥1 verified citation (core claims need a primary source)',
        'Experiment is reproducible (environment, commands, versions recorded)',
        'Adversarial verification done, with counter-examples and boundaries recorded',
        'Conclusion includes a decision matrix and applicability boundaries',
        'HTML artifact is self-contained, with complete JSON-LD, responsive',
        'No unverified "I heard that…" assertions',
      ],
    },
    participate: {
      heading: 'How to participate',
      body: 'You can propose a topic worth digging into, or complete a study following the methodology and submit a PR.',
      ctaSubmit: 'Submit a research topic →',
      ctaGuide: 'Contributing guide',
    },
  },

  contribute: {
    metaTitle: 'Submit a research topic · 42-research',
    metaDescription:
      'Propose a topic, or complete a study following the methodology and submit a PR. 42-research only publishes verified conclusions.',
    kicker: '// contribute',
    heading: 'Submit a research topic you want to see',
    heroBody:
      'The technical questions you are curious about but never found a good answer for are exactly what we want to research. Propose a topic, or contribute a full study — we only publish verified conclusions: with evidence, with counter-examples, with boundaries.',
    issue: {
      kicker: '// lightweight',
      heading: 'Propose a topic',
      body: 'Have a question worth digging into? Give your hypothesis, why it matters, and the primary sources you already know.',
      cta: 'Open an issue on GitHub →',
    },
    pr: {
      kicker: '// deep',
      heading: 'Complete a study',
      body: 'Walk the full 6-stage lifecycle (hypothesis → survey → experiment → verify → synthesize → publish), produce a self-contained HTML artifact, and submit a PR.',
      cta: 'Read the contributing guide →',
    },
    gate: {
      kicker: '// quality-gate',
      heading: 'We only accept verified conclusions',
      items: [
        'Hypothesis grounded in primary sources, not paraphrase',
        'Conclusion passed adversarial verification — counter-examples were actively sought',
        'Conclusion is falsifiable: states the conditions under which it fails',
        'Experiment is reproducible: environment, commands, versions recorded',
      ],
      noteA: 'Not sure if your study meets the bar? Read the',
      noteLink: 'methodology',
      noteB: 'first, then open an issue to discuss.',
    },
    back: '← Back to home',
  },

  research: {
    metaTitle: 'Research index · 42-research',
    metaDescription:
      'All 42-research topics, newest first. Every study is traceable and reproducible.',
    kicker: 'research/',
    heading: 'Research index',
    body: 'All topics, newest first. Every study is traceable and reproducible.',
    all: 'All',
    empty: 'No topics in this category yet',
  },

  card: {
    /** Suffix after the citation count, e.g. "7 citations". */
    citations: 'citations',
  },

  detail: {
    breadcrumb: '← Research index',
    primaryCitations: 'primary citations',
    tldrKicker: 'TL;DR · one-line conclusion',
    abstractKicker: 'Abstract',
    coverSource: 'Cover source: ',
    rawArtifact: 'View the original self-contained HTML artifact ↗',
    rawArtifactNote:
      'The source of truth is self-contained semantic HTML with JSON-LD structured metadata — openable standalone and traceable (ADR-001).',
    notFoundTitle: 'Topic not found',
    notFoundMessage:
      'This research topic does not exist, or the slug is wrong. Browse the research index for other topics.',
  },

  status: {
    hypothesis: 'Hypothesis',
    survey: 'Survey',
    experiment: 'Experiment',
    verify: 'Verify',
    synthesize: 'Synthesize',
    publish: 'Published',
  },

  footer: {
    tagline:
      'Every question worth asking deserves a real answer. Reproducible, traceable, peer-reviewable technical research.',
    browse: 'Browse',
    research: 'Research',
    about: 'About · Methodology',
    contribute: 'Submit a topic',
    openSource: 'Open source',
    repo: 'GitHub repository',
    contributing: 'Contributing guide',
    license: '© 2026 42-research-lab · MIT License',
    builtWith: 'built with',
  },
}

/**
 * Recursively widen string literals to `string` while preserving the object shape.
 * This lets `zh` reuse `en`'s structure (key completeness is still enforced)
 * without TypeScript demanding the Chinese strings equal the English literals.
 */
type Loosen<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? Loosen<U>[]
    : { -readonly [K in keyof T]: Loosen<T[K]> }

export type Messages = Loosen<typeof en>

