export type PortfolioWork = {
  id: string
  title: string
  /** Optional short blurb; prefer `bullets` when available. */
  description?: string
  bullets?: string[]
  tags: string[]
  primaryLabel?: 'GitHub' | 'Live Demo'
  primaryHref?: string
}

export const WORKS: PortfolioWork[] = [
  {
    id: 'email-intelligence',
    title: 'Email Intelligence',
    bullets: [
      'Built an end-to-end email intelligence platform that ingests mail via Microsoft Graph (real-time webhooks and historical backfill), stores messages in PostgreSQL, and processes them asynchronously with Redis and Celery.',
      'Implemented LLM classification (Ollama primary, optional OpenAI fallback) for summaries, categories, priority, suggested replies, and lead signals, plus escalation detection, sender trust, and team routing.',
      'Shipped a FastAPI backend and Next.js operations dashboard with Azure AD sign-in for monitoring emails, queues, escalations, and admin workflows.',
    ],
    tags: [
      'FastAPI',
      'Next.js',
      'PostgreSQL',
      'Redis',
      'Celery',
      'Microsoft Graph',
      'LLMs',
      'Ollama',
      'Azure AD',
    ],
    primaryLabel: 'GitHub',
    primaryHref: 'https://github.com/cautiousdanger/email-intelligence/tree/emailint_vm',
  },
  {
    id: 'techbank-ai',
    title: 'TechBank.Ai',
    bullets: [
      'Developed an AI-powered recruitment platform using LLMs, FastAPI, and SQL to automate resume parsing and job description analysis, enabling intelligent candidate matching with explainable scoring.',
      'Designed a unified talent management system integrating multiple data sources (uploads, email, CSV) to streamline candidate screening and improve hiring efficiency.',
    ],
    tags: ['LLMs', 'FastAPI', 'SQL', 'Python', 'AI'],
  },
  {
    id: 'ask-my-docs',
    title: 'Ask My Docs',
    bullets: [
      'Built a production-style RAG system with hybrid retrieval (BM25 + vectors via RRF), cross-encoder reranking, citation-enforced LLM answers, and a FastAPI + web UI for ingest and chat.',
      'Added a golden-set evaluation pipeline with CI gates for Recall@k, faithfulness, and citation accuracy so quality regressions block deploy.',
    ],
    tags: ['RAG', 'Python', 'FastAPI', 'BM25', 'Embeddings', 'Ollama', 'GitHub Actions'],
    primaryLabel: 'GitHub',
    primaryHref: 'https://github.com/moksh-sharma/ask-my-docs',
  },
  {
    id: 'fine-tune-lora-dpo',
    title: 'Fine-Tuning with LoRA & DPO',
    bullets: [
      'Fine-tuned a small instruct model (Qwen2.5) for JSON extraction using LoRA/QLoRA supervised fine-tuning, then stacked a second LoRA adapter for DPO preference tuning toward valid JSON.',
      'Built an end-to-end eval pipeline reporting JSON validity, keys match, field accuracy, and exact match before/after SFT and DPO on a held-out set.',
    ],
    tags: ['LoRA', 'DPO', 'QLoRA', 'Hugging Face', 'Python', 'SFT'],
    primaryLabel: 'GitHub',
    primaryHref: 'https://github.com/moksh-sharma/fine-tune-lora-dpo',
  },
  {
    id: 'rag-observability',
    title: 'RAG Observability',
    bullets: [
      'Added production-style observability for a hybrid RAG pipeline: OpenTelemetry tracing, per-stage p50/p95 latency, cost-per-request estimates, and quality metrics on a golden set.',
      'Shipped CI regression gating against a checked-in baseline plus a React + FastAPI dashboard for ask, eval, and gate workflows.',
    ],
    tags: ['OpenTelemetry', 'RAG', 'FastAPI', 'React', 'CI', 'Python', 'Observability'],
    primaryLabel: 'GitHub',
    primaryHref: 'https://github.com/moksh-sharma/rag-observability',
  },
  {
    id: 'local-slm-ollama',
    title: 'Local SLM with Ollama',
    bullets: [
      'Built an offline small-language-model app on Ollama with chat, benchmarking, and a three-model comparison (speed + quality) so privacy, latency, and cost tradeoffs are measurable.',
      'Measured TTFT, end-to-end latency, tokens/sec, and deterministic quality tasks, with a web UI and markdown/JSON reports for hardware-specific results.',
    ],
    tags: ['Ollama', 'SLM', 'Python', 'FastAPI', 'Benchmarking', 'Local AI'],
    primaryLabel: 'GitHub',
    primaryHref: 'https://github.com/moksh-sharma/local-slm-ollama',
  },
  {
    id: 'realtime-multimodal',
    title: 'Real-Time Multimodal Voice Assistant',
    bullets: [
      'Designed a streaming voice pipeline (capture/VAD → STT → LLM → TTS → playback) with explicit per-stage latency budgets and an end-to-end SLA (~2.5s stop-speaking to first audio).',
      'Implemented graceful degradation (full voice → text-only → cached → minimal) under overruns/timeouts, plus WebSocket demo UI and Monte-carlo latency simulations.',
    ],
    tags: ['Real-time', 'STT', 'TTS', 'LLM', 'WebSocket', 'Python', 'FastAPI'],
    primaryLabel: 'GitHub',
    primaryHref: 'https://github.com/moksh-sharma/realtime-multimodal',
  },
  {
    id: 'file-analyzer',
    title: 'File Analyzer',
    description:
      'This project is a File Analyzer application that processes and analyzes various file types including PDFs, images, Word documents, and Excel files. It extracts text and metadata, performs content analysis, and generates comprehensive reports. The Flask and Python backend handles parsing and safe file handling, while the front end gives clear feedback on upload progress, errors, and results. You can inspect summaries at a glance, compare metadata across files, and export or review findings in a structured layout suited for coursework or small-office workflows.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Flask', 'Python'],
    primaryLabel: 'GitHub',
    primaryHref: 'https://github.com/moksh-sharma/FileAnalyzer',
  },
  {
    id: 'college-recommendation',
    title: 'College Recommendation System',
    description:
      'An intelligent college recommendation system that helps students discover top engineering colleges based on key preferences. Combines clean UI with smart logic to display college info, JEE cutoffs, and more - all in interactive popups. The experience is tuned for quick exploration: filter and scan options without losing context, read key stats side by side, and drill into details only when you need them. Built with semantic HTML, CSS, and JavaScript and designed in Figma before implementation, then deployed on Netlify for a fast, shareable live demo.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Figma'],
    primaryLabel: 'Live Demo',
    primaryHref: 'https://collegerecommenderapp.netlify.app/',
  },
  {
    id: 'employee-management',
    title: 'Employee Management System',
    description:
      'A robust Employee Management System that simplifies tracking, organizing, and managing employee data and performance. Includes modules for attendance, payroll, roles, and performance evaluation in a streamlined dashboard. Object-oriented Java keeps domain models clear - employees, departments, and records stay consistent as you add features. The project focuses on reliable CRUD flows, validation, and readable console or UI-driven workflows so admins can onboard staff, log attendance patterns, and review performance notes without clutter.',
    tags: ['JAVA'],
    primaryLabel: 'GitHub',
    primaryHref: 'https://github.com/moksh-sharma/EMS',
  },
  {
    id: 'audio-beat-prediction',
    title: 'Audio Analysis and Beat Prediction System',
    bullets: [
      'Built an AI-powered beat prediction and music generation system using Python, Librosa, and signal-processing techniques, enabling real-time audio analysis and melody synthesis.',
      'Implemented FFT-based feature extraction, onset/beat detection, and automatic composition blending to produce complete AI-generated music tracks.',
    ],
    tags: ['Python', 'Librosa', 'FFT', 'Signal Processing', 'AI'],
  },
  {
    id: 'bi-dashboard',
    title: 'BI Dashboard / Analytics Platform',
    bullets: [
      'Designed and developed a custom business intelligence dashboard to transform raw data into interactive visualizations and actionable insights using Python, SQL, and Excel-based data pipelines.',
      'Built end-to-end data processing and visualization workflows, enabling users to upload datasets, generate dynamic dashboards, and support data-driven decision-making.',
    ],
    tags: ['Python', 'SQL', 'Excel', 'BI', 'Analytics'],
  },
]
