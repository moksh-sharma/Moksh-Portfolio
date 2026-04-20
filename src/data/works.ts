export type PortfolioWork = {
  id: string
  title: string
  description: string
  tags: string[]
  primaryLabel: 'GitHub' | 'Live Demo'
  primaryHref: string
}

export const WORKS: PortfolioWork[] = [
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
      'An intelligent college recommendation system that helps students discover top engineering colleges based on key preferences. Combines clean UI with smart logic to display college info, JEE cutoffs, and more — all in interactive popups. The experience is tuned for quick exploration: filter and scan options without losing context, read key stats side by side, and drill into details only when you need them. Built with semantic HTML, CSS, and JavaScript and designed in Figma before implementation, then deployed on Netlify for a fast, shareable live demo.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Figma'],
    primaryLabel: 'Live Demo',
    primaryHref: 'https://collegerecommenderapp.netlify.app/',
  },
  {
    id: 'employee-management',
    title: 'Employee Management System',
    description:
      'A robust Employee Management System that simplifies tracking, organizing, and managing employee data and performance. Includes modules for attendance, payroll, roles, and performance evaluation in a streamlined dashboard. Object-oriented Java keeps domain models clear — employees, departments, and records stay consistent as you add features. The project focuses on reliable CRUD flows, validation, and readable console or UI-driven workflows so admins can onboard staff, log attendance patterns, and review performance notes without clutter.',
    tags: ['JAVA'],
    primaryLabel: 'GitHub',
    primaryHref: 'https://github.com/moksh-sharma/EMS',
  },
  {
    id: 'app-dev-landing',
    title: 'App Development Landing Page',
    description:
      "From concept to deployment, I design and develop high-performing mobile and web apps tailored to your business needs. With a user-first approach, responsive design, and clean code, I ensure your app stands out in today's competitive digital landscape. This landing page translates that story into scroll-driven sections: services, process highlights, social proof, and strong calls-to-action. Typography, spacing, and Figma-aligned components work together so the page feels credible on large displays and stays legible on phones, with JavaScript used for subtle interactivity where it improves clarity rather than noise.",
    tags: ['HTML', 'CSS', 'JavaScript', 'Figma'],
    primaryLabel: 'GitHub',
    primaryHref: 'https://github.com/moksh-sharma/AppDevLandingPage',
  },
  {
    id: 'ecommerce',
    title: 'Ecommerce Website',
    description:
      'From product showcases to smooth checkout flows and responsive design, this ecommerce-focused experience shows how online stores can feel fast and trustworthy. Hero areas, product grids, and pricing cues are laid out to guide attention toward purchase decisions without overwhelming the shopper. Built with HTML, CSS, and JavaScript and refined in Figma, it demonstrates layout discipline, reusable section patterns, and mobile-first breakpoints so the storefront narrative stays coherent from first impression to cart-ready state.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Figma'],
    primaryLabel: 'GitHub',
    primaryHref: 'https://github.com/moksh-sharma/EComLandingPage',
  },
  {
    id: 'ice-cream-shop',
    title: 'Ice-Cream Shop',
    description:
      'A highly interactive ice-cream shopping site built with React for stateful menus, cart-style selections, and instant UI updates as users browse flavors and combos. Custom styling and layout in HTML and CSS support playful branding while keeping controls obvious — quantity tweaks, category browsing, and highlights for featured items. Designed in Figma first, then implemented with attention to hover states, transitions, and touch-friendly targets so the experience feels as satisfying on a phone as on desktop.',
    tags: ['React.JS', 'HTML', 'CSS', 'JavaScript', 'Figma'],
    primaryLabel: 'GitHub',
    primaryHref: 'https://github.com/moksh-sharma/Ice-Cream',
  },
  {
    id: 'sustainable-living',
    title: 'Sustainable-Living-Guide',
    description:
      'A practical guide promoting eco-friendly habits and sustainable lifestyle choices for a greener future. Covers tips on energy conservation, waste reduction, ethical consumption, and sustainable living practices. React helps organize content into scannable sections and reusable cards so readers can jump between topics — home energy, food choices, travel, and daily habits — without losing their place. The interface pairs clear headings and short actionable copy with calm visuals from the Figma system, making education feel approachable rather than preachy.',
    tags: ['React.JS', 'HTML', 'CSS', 'JavaScript', 'Figma'],
    primaryLabel: 'GitHub',
    primaryHref: 'https://github.com/moksh-sharma/Sustainable-Living-Guide',
  },
  {
    id: 'netflix-clone',
    title: 'Netflix Clone',
    description:
      'A fully responsive streaming platform clone inspired by Netflix, offering a sleek UI and dynamic content display. Features include user authentication, movie previews, and categorized content browsing for a seamless experience. Rows mimic Netflix-style carousels with horizontal discovery, while a bold hero banner sets context for featured titles. React structures pages and reusable media tiles; HTML and JavaScript handle routing-friendly markup and lightweight interactions; Figma-informed spacing and contrast keep text readable on dark backgrounds across breakpoints.',
    tags: ['React.JS', 'HTML', 'JavaScript', 'Figma'],
    primaryLabel: 'GitHub',
    primaryHref: 'https://github.com/moksh-sharma/Netflix',
  },
]
