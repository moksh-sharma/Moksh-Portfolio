import { DELOITTE_CERTIFICATE_URL } from './achievementsSlides'

export type Certification = {
  id: string
  title: string
  issuer: string
  href?: string
}

export const CERTIFICATIONS: Certification[] = [
  {
    id: 'deloitte-data-analytics',
    title: 'Data Analytics Job Simulation',
    issuer: 'Deloitte',
    href: DELOITTE_CERTIFICATE_URL,
  },
  {
    id: 'google-data-analytics',
    title: 'Data Analytics',
    issuer: 'Google',
    href: 'https://coursera.org/verify/professional-cert/NCXN3SKF19LJ',
  },
  {
    id: 'google-agile-pm',
    title: 'Agile Project Management',
    issuer: 'Google',
    href: 'https://www.coursera.org/account/accomplishments/verify/02YHSXA1TVR9',
  },
  {
    id: 'google-os-power-user',
    title: 'Operating Systems and You: Becoming a Power User',
    issuer: 'Google',
    href: 'https://www.coursera.org/account/accomplishments/verify/U12YH3ZEW4E6',
  },
  {
    id: 'google-project-planning',
    title: 'Project Planning: Putting It All Together',
    issuer: 'Google',
    href: 'https://coursera.org/verify/OV3IEFHGDWCB',
  },
  {
    id: 'python-data-structures',
    title: 'Python Data Structures',
    issuer: 'University of Michigan (Coursera)',
    href: 'https://coursera.org/share/d303a95bc63d096fa8ae4488c4d0794f',
  },
]
