import type { ATSMetrics, ContactInfo, ParsedResume, SkillCategory, WorkExperience, Education, Project } from '../types/resume';

// Curated Master Skills Dictionary strictly containing real technologies, tools, runtimes, and frameworks
export const COMPREHENSIVE_SKILL_DICTIONARY: Record<string, string[]> = {
  'Programming Languages': [
    'Python', 'Java', 'C++', 'C', 'C#', 'JavaScript', 'TypeScript', 'Go', 'Golang',
    'Rust', 'Kotlin', 'Swift', 'PHP', 'Ruby', 'Scala', 'R', 'Dart', 'SQL', 'PL/SQL',
    'Bash', 'Shell', 'PowerShell', 'HTML5', 'HTML', 'CSS3', 'CSS', 'Sass', 'SCSS',
    'Lua', 'Haskell', 'Elixir', 'Clojure', 'MATLAB', 'Solidity', 'Perl', 'Assembly'
  ],

  'Frontend & Web Technologies': [
    'React', 'React.js', 'Next.js', 'Angular', 'AngularJS', 'Vue', 'Vue.js', 'Nuxt.js',
    'Svelte', 'SvelteKit', 'Remix', 'Gatsby', 'SolidJS', 'Astro', 'jQuery',
    'Tailwind CSS', 'Tailwind', 'Bootstrap', 'Material-UI', 'MUI', 'Chakra UI', 'Ant Design',
    'Redux', 'Redux Toolkit', 'Zustand', 'MobX', 'Recoil', 'TanStack Query', 'React Query',
    'Webpack', 'Vite', 'Rollup', 'Babel', 'Three.js', 'D3.js', 'Chart.js', 'WebGL', 'WebSockets', 'WebRTC'
  ],

  'Backend Frameworks & APIs': [
    'Node.js', 'Express.js', 'Express', 'NestJS', 'Fastify', 'Django', 'FastAPI',
    'Flask', 'Celery', 'Spring Boot', 'Spring', 'Spring MVC', 'ASP.NET Core', 'ASP.NET',
    '.NET Core', '.NET', 'Ruby on Rails', 'Rails', 'Laravel', 'Symfony',
    'gRPC', 'REST APIs', 'RESTful APIs', 'REST', 'GraphQL', 'Apollo GraphQL',
    'Socket.io', 'Microservices'
  ],

  'Databases & Caching': [
    'PostgreSQL', 'Postgres', 'MySQL', 'MariaDB', 'SQLite', 'Oracle Database',
    'Microsoft SQL Server', 'MSSQL', 'SQL Server', 'MongoDB', 'DynamoDB', 'Cassandra',
    'CouchDB', 'Redis', 'Memcached', 'Elasticsearch', 'OpenSearch',
    'Neo4j', 'Supabase', 'Firebase', 'Firestore', 'CockroachDB',
    'ClickHouse', 'Snowflake', 'BigQuery', 'Redshift', 'Prisma', 'TypeORM',
    'Hibernate', 'Sequelize', 'Mongoose', 'SQLAlchemy'
  ],

  'Cloud & DevOps Tools': [
    'AWS', 'Amazon Web Services', 'EC2', 'S3', 'RDS', 'Lambda', 'ECS', 'EKS', 'CloudFront',
    'Azure', 'Azure DevOps', 'GCP', 'Google Cloud', 'Google Cloud Platform',
    'Docker', 'Docker Compose', 'Kubernetes', 'K8s', 'Helm', 'Terraform', 'Ansible',
    'CI/CD', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'ArgoCD',
    'Nginx', 'Apache', 'Linux', 'Ubuntu', 'Prometheus', 'Grafana', 'Datadog', 'New Relic', 'OpenTelemetry'
  ],

  'AI, ML & Data Engineering': [
    'PyTorch', 'TensorFlow', 'Keras', 'JAX', 'Scikit-Learn', 'Pandas', 'NumPy', 'SciPy',
    'Matplotlib', 'Seaborn', 'OpenCV', 'NLTK', 'Spacy', 'Hugging Face',
    'Transformers', 'BERT', 'GPT', 'LLMs', 'LangChain', 'LlamaIndex', 'Pinecone',
    'ChromaDB', 'Qdrant', 'RAG', 'LoRA', 'Apache Spark', 'PySpark',
    'Apache Kafka', 'Kafka', 'RabbitMQ', 'Apache Airflow', 'Airflow', 'Databricks'
  ],

  'Mobile & Desktop': [
    'React Native', 'Flutter', 'SwiftUI', 'Jetpack Compose', 'Android SDK', 'iOS SDK',
    'Electron', 'Tauri', 'Ionic', '.NET MAUI', 'Unity', 'Unreal Engine'
  ],

  'Developer Tools & Testing': [
    'Git', 'GitHub', 'GitLab', 'Jest', 'Vitest', 'Cypress', 'Playwright', 'Selenium',
    'JUnit', 'PyTest', 'Postman', 'Swagger', 'OpenAPI', 'SonarQube'
  ]
};

// Common skill alias mappings to normalize and avoid duplicate pills
export const ALIAS_NORMALIZATION_MAP: Record<string, string> = {
  'react.js': 'React',
  'reactjs': 'React',
  'nextjs': 'Next.js',
  'vue.js': 'Vue.js',
  'vuejs': 'Vue.js',
  'nuxtjs': 'Nuxt.js',
  'express.js': 'Express.js',
  'expressjs': 'Express.js',
  'node': 'Node.js',
  'nodejs': 'Node.js',
  'k8s': 'Kubernetes',
  'postgres': 'PostgreSQL',
  'postgresql': 'PostgreSQL',
  'amazon web services': 'AWS',
  'google cloud platform': 'GCP',
  'google cloud': 'GCP',
  'golang': 'Go',
  'tailwindcss': 'Tailwind CSS',
  'tailwind': 'Tailwind CSS',
  'mui': 'Material-UI',
  'rest api': 'REST APIs',
  'restful api': 'REST APIs',
  'restful apis': 'REST APIs',
  'rest': 'REST APIs',
  'graphql api': 'GraphQL',
  'scikit learn': 'Scikit-Learn',
  'scikitlearn': 'Scikit-Learn',
  'github actions': 'GitHub Actions',
  'ci cd': 'CI/CD',
  'llm': 'LLMs',
  'large language models': 'LLMs',
  'apache kafka': 'Apache Kafka',
  'kafka': 'Apache Kafka',
  'apache spark': 'Apache Spark',
  'spark': 'Apache Spark',
  'spring boot': 'Spring Boot',
  'springboot': 'Spring Boot',
  'asp.net core': 'ASP.NET Core',
  'asp.net': 'ASP.NET Core',
  '.net core': '.NET Core',
  '.net': '.NET',
  'c sharp': 'C#',
  'c plus plus': 'C++',
  'cpp': 'C++',
  'html': 'HTML5',
  'html5': 'HTML5',
  'css': 'CSS3',
  'css3': 'CSS3',
  'sass': 'SCSS',
  'scss': 'SCSS',
  'js': 'JavaScript',
  'ts': 'TypeScript'
};

const ACTION_VERBS = [
  'accelerated', 'achieved', 'architected', 'automated', 'built', 'created', 'designed',
  'developed', 'directed', 'engineered', 'expanded', 'headed', 'implemented', 'improved',
  'increased', 'launched', 'led', 'managed', 'migrated', 'optimized', 'orchestrated',
  'overhauled', 'pioneered', 'reduced', 're-architected', 'scaled', 'spearheaded', 'streamlined',
  'transformed', 'upgraded', 'delivered', 'established', 'formulated', 'maximized', 'minimized',
  'refactored', 'resolved', 'supervised', 'validated', 'yielded'
];

export function analyzeResumeText(rawText: string, pageCount: number = 1): ParsedResume {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  const words = rawText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // Extract contact info
  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = rawText.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const linkedinMatch = rawText.match(/(linkedin\.com\/in\/[a-zA-Z0-9_-]+)/i);
  const githubMatch = rawText.match(/(github\.com\/[a-zA-Z0-9_-]+)/i);

  // Name extraction: heuristic from first 5 lines
  let name = 'Candidate Name';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const candidateLine = lines[i];
    if (
      candidateLine.length >= 3 &&
      candidateLine.length < 45 &&
      !candidateLine.includes('@') &&
      !candidateLine.includes('http') &&
      !candidateLine.toLowerCase().includes('resume') &&
      !candidateLine.toLowerCase().includes('curriculum') &&
      !/^\d+$/.test(candidateLine)
    ) {
      name = candidateLine;
      break;
    }
  }

  // Job title heuristic
  let title = 'Software Engineering Professional';
  const commonTitles = [
    'Senior Full Stack Engineer', 'Full Stack Developer', 'Full Stack Engineer',
    'Senior Software Engineer', 'Software Engineer', 'Frontend Developer', 'Backend Developer',
    'Senior Backend Engineer', 'DevOps Engineer', 'Cloud Architect', 'Data Scientist',
    'Machine Learning Engineer', 'AI/ML Engineer', 'Data Engineer', 'Site Reliability Engineer',
    'Mobile Developer', 'iOS Developer', 'Android Developer', 'Product Manager', 'Solutions Architect'
  ];

  for (const t of commonTitles) {
    if (new RegExp(`(^|[^a-zA-Z])${escapeRegExp(t)}([^a-zA-Z]|$)`, 'i').test(rawText)) {
      title = t;
      break;
    }
  }

  const contact: ContactInfo = {
    name,
    title,
    email: emailMatch ? emailMatch[0] : 'email@example.com',
    phone: phoneMatch ? phoneMatch[0] : '+1 (555) 000-0000',
    location: 'Remote / Global',
    linkedIn: linkedinMatch ? `https://${linkedinMatch[0]}` : undefined,
    github: githubMatch ? `https://${githubMatch[0]}` : undefined,
  };

  // Strip URLs and emails for skill scanning so protocol strings (e.g. "https://", "github.com") don't produce false skills
  const sanitizedScanText = rawText
    .replace(/https?:\/\/[^\s]+/gi, ' ')
    .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, ' ');

  // Robust, boundary-safe skill extraction strictly against candidate resume content
  const foundSkillsMap: Record<string, Set<string>> = {};
  const normalizedSeen = new Set<string>();
  const allSkillsList: string[] = [];

  for (const [catName, skillList] of Object.entries(COMPREHENSIVE_SKILL_DICTIONARY)) {
    foundSkillsMap[catName] = new Set<string>();

    for (const skill of skillList) {
      if (matchesSkillSafe(sanitizedScanText, skill)) {
        const canonicalName = ALIAS_NORMALIZATION_MAP[skill.toLowerCase()] || skill;
        const normKey = canonicalName.toLowerCase();

        if (!normalizedSeen.has(normKey)) {
          normalizedSeen.add(normKey);
          foundSkillsMap[catName].add(canonicalName);
          allSkillsList.push(canonicalName);
        }
      }
    }
  }

  // Convert to SkillCategory array (only non-empty categories)
  const skillCategories: SkillCategory[] = [];
  for (const [catName, skillSet] of Object.entries(foundSkillsMap)) {
    if (skillSet.size > 0) {
      skillCategories.push({
        category: catName,
        skills: Array.from(skillSet)
      });
    }
  }

  // Parse Experience, Projects, Education, Summary
  const experiences = extractWorkExperience(rawText);
  const projects = extractProjects(rawText);
  const education = extractEducation(rawText);
  const summary = extractSummary(rawText, lines);

  return {
    rawText,
    contact,
    summary,
    skillCategories,
    allSkills: allSkillsList,
    experiences,
    education,
    projects,
    pageCount,
    wordCount,
  };
}

// Boundary-Safe Skill Matcher: Handles special characters (+, #, ., /, -) with contextual disambiguation for short/common words
export function matchesSkillSafe(text: string, skill: string): boolean {
  if (!text || !skill) return false;
  const sLower = skill.toLowerCase().trim();

  // 1. Single Letter 'C': Only match in explicit programming context
  if (sLower === 'c') {
    return (
      /\bC\s*\/\s*C\+\+/i.test(text) ||
      /\bC\s*,\s*C\+\+/i.test(text) ||
      /\bC\s*&\s*C\+\+/i.test(text) ||
      /\bC\s+(programming|language|code|developer|backend)\b/i.test(text) ||
      /\b(ANSI|Embedded|Modern|Standard)\s+C\b/i.test(text) ||
      /(?:languages?|skills|technologies)[^:\n]*:[^\n]*\bC\b/.test(text) ||
      /(?:^|[,•|/])\s*C\s*(?:[,•|/]|$)/.test(text)
    );
  }

  // 2. Single Letter 'R': Only match in data science / programming context
  if (sLower === 'r') {
    return (
      /\bR\s+(programming|language|package|studio|script|analytics)\b/i.test(text) ||
      /\b(Python|SQL|Julia|Scala)\s*,\s*R\b/i.test(text) ||
      /\bR\s*,\s*(Python|SQL|Julia|Scala)\b/i.test(text) ||
      /(?:languages?|skills|analytics|statistics)[^:\n]*:[^\n]*\bR\b/.test(text)
    );
  }

  // 3. 'Go': Never match lowercase English "go"; require Golang, Go language, or uppercase 'Go' in skills context
  if (sLower === 'go' || sLower === 'golang') {
    if (/golang/i.test(text)) return true;
    if (/\bGo\s+(programming|language|backend|developer|runtime|microservices)\b/i.test(text)) return true;
    return /(?:languages?|skills|technologies|stack)[^:\n]*:[^\n]*\bGo\b/.test(text) || /(?:^|[,•|/])\s*Go\s*(?:[,•|/]|$)/.test(text);
  }

  // 4. 'SQL': Only match if explicitly listed (don't match accidentally in mid-words)
  if (sLower === 'sql') {
    return /\bSQL\b/i.test(text) && !/no-?sql/i.test(text);
  }

  // 5. 'REST' / 'REST APIs': Must match API / architectural context, not English "the rest"
  if (sLower === 'rest' || sLower === 'rest apis' || sLower === 'restful apis' || sLower === 'restful') {
    return /\bREST(ful)?\s*(APIs?|web services?|endpoints?|architecture|services?)?\b/i.test(text) && !/\bthe\s+rest\s+of\b/i.test(text);
  }

  // 6. 'Shell': Must match scripting context
  if (sLower === 'shell') {
    return /\bshell\s*(scripting|scripts?|commands?)\b/i.test(text) || /\b(bash|zsh|unix|linux)\s*\/\s*shell\b/i.test(text);
  }

  // 7. 'Next': Must match Next.js / NextJS
  if (sLower === 'next' || sLower === 'next.js') {
    return /\bnext(\.js|js)?\b/i.test(text) && !/\bthe\s+next\b/i.test(text);
  }

  // 8. 'Express': Must match Express.js / ExpressJS or Node/Express
  if (sLower === 'express' || sLower === 'express.js') {
    return /\bexpress(\.js|js)?\b/i.test(text) || /\bnode(\.js)?\s*\/\s*express\b/i.test(text);
  }

  // 9. 'HTML' / 'HTML5': Match HTML or HTML5
  if (sLower === 'html' || sLower === 'html5') {
    return /\bHTML5?\b/i.test(text);
  }

  // 10. 'CSS' / 'CSS3': Match CSS or CSS3
  if (sLower === 'css' || sLower === 'css3') {
    return /\bCSS3?\b/i.test(text);
  }

  // 11. General Boundary-Safe Pattern for all other skills (+, #, ., -, /)
  const escaped = escapeRegExp(skill);
  const pattern = new RegExp(`(^|[^a-zA-Z0-9+#.-])${escaped}(?=[^a-zA-Z0-9+#.-]|$)`, 'i');
  return pattern.test(text);
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Section Parsing Helpers
function extractSummary(rawText: string, lines: string[]): string {
  const lower = rawText.toLowerCase();
  const summaryHeaders = ['summary', 'professional summary', 'executive summary', 'about me', 'profile'];

  for (const header of summaryHeaders) {
    const idx = lower.indexOf(header);
    if (idx !== -1) {
      const chunk = rawText.substring(idx + header.length, idx + 400).trim();
      const firstParagraph = chunk.split(/\n\s*\n/)[0];
      if (firstParagraph && firstParagraph.length > 30) {
        return firstParagraph.replace(/^[^\w]+/, '').trim();
      }
    }
  }

  // Fallback to top lines
  return lines.slice(1, 4).join(' ').substring(0, 300);
}

function extractWorkExperience(rawText: string): WorkExperience[] {
  const experiences: WorkExperience[] = [];
  const expMatch = rawText.match(/(?:experience|work experience|employment history|work history)([\s\S]*?)(?:education|projects|skills|certifications|$)/i);

  if (expMatch && expMatch[1]) {
    const expText = expMatch[1].trim();
    const expLines = expText.split('\n').map(l => l.trim()).filter(Boolean);

    let currentCompany = 'Engineering Team';
    let currentRole = 'Software Engineer';
    let currentPeriod = '2022 - Present';
    let highlights: string[] = [];

    for (const line of expLines) {
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        highlights.push(line.replace(/^[•\-*]\s*/, '').trim());
      } else if (/\b(20\d\d|19\d\d|present|current)\b/i.test(line)) {
        if (highlights.length > 0) {
          experiences.push({
            company: currentCompany,
            role: currentRole,
            period: currentPeriod,
            highlights,
            technologies: []
          });
          highlights = [];
        }
        currentPeriod = line;
      } else if (line.length > 4 && line.length < 50 && !line.includes('.')) {
        currentRole = line;
      }
    }

    if (highlights.length > 0) {
      experiences.push({
        company: currentCompany,
        role: currentRole,
        period: currentPeriod,
        highlights,
        technologies: []
      });
    }
  }

  return experiences;
}

function extractProjects(rawText: string): Project[] {
  const projects: Project[] = [];
  const projMatch = rawText.match(/(?:projects|technical projects|personal projects|key projects)([\s\S]*?)(?:experience|education|skills|certifications|$)/i);

  if (projMatch && projMatch[1]) {
    const projText = projMatch[1].trim();
    const projLines = projText.split('\n').map(l => l.trim()).filter(Boolean);

    let currentName = 'Key Project';
    let currentDesc = '';
    let foundTech: string[] = [];

    for (const line of projLines) {
      if (line.startsWith('•') || line.startsWith('-')) {
        currentDesc += (currentDesc ? ' ' : '') + line.replace(/^[•\-]\s*/, '').trim();
      } else if (line.length > 3 && line.length < 40 && !line.includes('.')) {
        if (currentDesc) {
          projects.push({
            name: currentName,
            description: currentDesc,
            technologies: foundTech
          });
          currentDesc = '';
          foundTech = [];
        }
        currentName = line;
      }
    }

    if (currentDesc) {
      projects.push({
        name: currentName,
        description: currentDesc,
        technologies: foundTech
      });
    }
  }

  return projects;
}

function extractEducation(rawText: string): Education[] {
  const education: Education[] = [];
  const eduMatch = rawText.match(/(?:education|academic background|university)([\s\S]*?)(?:experience|projects|skills|certifications|$)/i);

  if (eduMatch && eduMatch[1]) {
    const eduText = eduMatch[1].trim();
    const eduLines = eduText.split('\n').map(l => l.trim()).filter(Boolean);

    let degree = 'Bachelor of Science in Computer Science';
    let institution = 'University / Institute';
    let year = '2020 - 2024';

    for (const line of eduLines) {
      if (/(bachelor|master|b\.s\.|m\.s\.|b\.tech|m\.tech|phd|associate|degree)/i.test(line)) {
        degree = line;
      } else if (/(university|college|institute|academy|school)/i.test(line)) {
        institution = line;
      } else if (/\b(20\d\d|19\d\d)\b/.test(line)) {
        year = line;
      }
    }

    education.push({ degree, institution, year });
  }

  return education;
}

// Calculate calibrated ATS metrics & section health scores
export function calculateATSMetrics(parsed: ParsedResume): ATSMetrics {
  const { rawText, allSkills, wordCount } = parsed;

  // 1. Skill keyword density score (0 - 100)
  // 6+ relevant tech terms gives strong baseline (80+); 10+ gives top score (95+)
  const skillCount = allSkills.length;
  let skillDensityScore = 60;
  if (skillCount >= 10) {
    skillDensityScore = 95;
  } else if (skillCount >= 6) {
    skillDensityScore = 85;
  } else if (skillCount >= 3) {
    skillDensityScore = 75;
  } else if (skillCount >= 1) {
    skillDensityScore = 65;
  }

  // 2. Action verbs & Impact metrics score (0 - 100)
  const numbersFound = (rawText.match(/\b\d+(\.\d+)?%|\b\d+x\b|\$\d+|\b\d+\s*(users|clients|requests|ms|seconds|million|k)\b/gi) || []).length;
  let actionVerbCount = 0;
  for (const verb of ACTION_VERBS) {
    if (new RegExp(`\\b${verb}\\b`, 'i').test(rawText)) {
      actionVerbCount++;
    }
  }

  const impactMetricScore = Math.min(
    100,
    Math.round(45 + Math.min(actionVerbCount * 5, 30) + Math.min(numbersFound * 8, 25))
  );

  // 3. Formatting & section completeness score
  let formattingScore = 70;
  if (parsed.experiences.length > 0) formattingScore += 10;
  if (parsed.projects.length > 0) formattingScore += 10;
  if (parsed.education.length > 0) formattingScore += 5;
  if (parsed.summary && parsed.summary.length > 50) formattingScore += 5;
  formattingScore = Math.min(100, formattingScore);

  // 4. Readability score (word count check: 350-800 words is ideal)
  let readabilityScore = 80;
  if (wordCount >= 300 && wordCount <= 900) {
    readabilityScore = 92;
  } else if (wordCount < 200) {
    readabilityScore = 65;
  } else if (wordCount > 1200) {
    readabilityScore = 70;
  }

  // Weighted Overall ATS Score
  const overallScore = Math.round(
    skillDensityScore * 0.35 +
    impactMetricScore * 0.25 +
    formattingScore * 0.25 +
    readabilityScore * 0.15
  );

  // Generate Strengths & Recommended Improvements
  const strengths: string[] = [];
  const improvements: string[] = [];

  if (allSkills.length >= 6) {
    strengths.push(`Identified ${allSkills.length} core technologies across well-defined technical taxonomy.`);
  } else if (allSkills.length > 0) {
    strengths.push(`Detected ${allSkills.length} technical competencies in your profile.`);
  } else {
    improvements.push('No recognized technical skills detected. Ensure technologies are clearly listed.');
  }

  if (numbersFound >= 2) {
    strengths.push(`Strong quantitative impact: ${numbersFound} measurable metrics (%, $, latency, throughput) identified.`);
  } else {
    improvements.push('Add quantitative business impact (e.g. "Reduced API latency by 35%", "Scaled to 10k users").');
  }

  if (actionVerbCount >= 4) {
    strengths.push(`Action-driven descriptions using high-impact engineering verbs (${actionVerbCount} distinct action verbs).`);
  } else {
    improvements.push('Incorporate strong engineering action verbs (e.g. "Architected", "Automated", "Optimized", "Refactored").');
  }

  if (parsed.experiences.length >= 1) {
    strengths.push(`Clear chronological experience section with ${parsed.experiences.length} distinct role breakdowns.`);
  } else {
    improvements.push('Add a clearly demarcated Work Experience section with role titles and bullet points.');
  }

  if (parsed.projects.length >= 1) {
    strengths.push(`Highlighted ${parsed.projects.length} technical project portfolio showcases.`);
  } else {
    improvements.push('Feature 2-3 key technical projects detailing architecture, libraries, and measurable results.');
  }

  // Missing keywords recommendation
  const missingKeywords: string[] = [];
  if (!allSkills.some(s => /docker|kubernetes|aws|cloud/i.test(s))) {
    missingKeywords.push('Cloud & Containerization (Docker, AWS, Kubernetes)');
  }
  if (!allSkills.some(s => /git|ci\/cd/i.test(s))) {
    missingKeywords.push('Version Control & CI/CD (Git, GitHub Actions)');
  }
  if (!allSkills.some(s => /sql|postgres|mongo|redis/i.test(s))) {
    missingKeywords.push('Databases & Caching (PostgreSQL, MongoDB, Redis)');
  }

  return {
    overallScore,
    atsCompatibility: Math.round((skillDensityScore + formattingScore + readabilityScore) / 3),
    skillDensityScore,
    impactMetricScore,
    formattingScore,
    readabilityScore,
    strengths,
    improvements,
    missingKeywords,
    actionVerbCount,
    quantifiedMetricsCount: numbersFound,
  };
}
