export type ExperienceEntry = {
  id: string
  role: string
  company: string
  location: string
  period: string
  bullets: string[]
}

export const EXPERIENCE_ENTRIES: ExperienceEntry[] = [
  {
    id: 'cache-digitech',
    role: 'Data Analyst Intern',
    company: 'Cache Digitech Pvt. Ltd.',
    location: 'New Delhi',
    period: 'Jan 2026 – Present',
    bullets: [
      'Worked across Data Analysis, Full Stack Development, and Generative AI to design and build scalable business solutions, contributing to platforms like TechBank.Ai, Email Intelligence, and Cache CRM.',
      'Developed and optimized AI-driven workflows including resume parsing, email ingestion, and intelligent data processing using FastAPI, PostgreSQL, Microsoft Graph API, and LLM integrations (Ollama/OpenAI).',
      'Transformed raw business and technical inputs into structured dashboards, web interfaces, and automation pipelines, improving internal decision-making, workflow efficiency, and system scalability.',
    ],
  },
  {
    id: 'vgi-sooprs',
    role: 'Web Development Intern',
    company: 'VGI Sooprs Technology',
    location: 'Gurgaon',
    period: 'Jul 2025 – Jul 2025',
    bullets: [
      'Developed 3+ responsive landing pages using modern frontend technologies, ensuring smooth UI behavior across devices.',
      'Implemented UI/UX designs into functional interfaces using 5+ tools, improving layout consistency and visual structure.',
      'Collaborated with the frontend development team to integrate components, test user flows, and resolve UI issues across browsers.',
    ],
  },
  {
    id: 'easy-data-analytics',
    role: 'Data Science Intern',
    company: 'Easy Data Analytics Technology',
    location: 'Noida',
    period: 'Jun 2025 – Jul 2025',
    bullets: [
      'Built a universal binary classification system using 5+ machine learning technologies, enabling customizable business use-cases.',
      'Applied data processing, feature engineering, and model evaluation techniques across multiple structured datasets and the ML pipeline.',
      'Implemented the solution using Python, Scikit-learn, Pandas, NumPy, and Matplotlib, integrating end-to-end data workflows.',
      "Collaborated with a Data Scientist mentor to refine the model's usability, incorporating model selection and hyperparameter tuning.",
    ],
  },
  {
    id: 'binary-global',
    role: 'IOT Developer Intern',
    company: 'Binary Global Limited',
    location: 'New Delhi',
    period: 'May 2024 – Jul 2024',
    bullets: [
      'Developed and maintained IOT software applications using programming languages such as Java, Python, and frameworks such as Spring and Django, leading to enhanced system functionality and performance.',
      'Collaborated with cross-functional teams to implement efficient algorithms and data structures, optimizing application scalability.',
      'Conducted code reviews and testing to ensure code quality and application security, significantly improving overall project outcomes.',
    ],
  },
]
