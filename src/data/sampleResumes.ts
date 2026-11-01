import type { ResumeAnalysisResult } from '../types/resume';
import { analyzeResumeText, calculateATSMetrics } from '../services/resumeAnalyzer';
import { generateInterviewQuestions } from '../services/questionGenerator';

export interface SampleResumePreset {
  id: string;
  name: string;
  role: string;
  experienceLevel: string;
  rawText: string;
}

export const SAMPLE_RESUMES: SampleResumePreset[] = [
  {
    id: 'fullstack-dev',
    name: 'Alex Rivera',
    role: 'Senior Full Stack Engineer',
    experienceLevel: '5+ Years Experience',
    rawText: `Alex Rivera
Senior Full Stack Engineer | San Francisco, CA
alex.rivera@devmail.io | +1 (555) 349-8821 | linkedin.com/in/alexrivera-dev | github.com/arivera-code

PROFESSIONAL SUMMARY
Results-oriented Senior Full Stack Engineer with 5+ years of experience building high-concurrency web applications, microservices, and distributed cloud systems. Expert in TypeScript, React, Node.js, PostgreSQL, and Docker. Proven track record of scaling user applications from zero to 100k+ active users while maintaining 99.9% service uptime.

CORE SKILLS
- Frontend: React, React.js, Next.js, TypeScript, JavaScript, TailwindCSS, Redux, Zustand, HTML5, CSS3
- Backend: Node.js, Express, REST APIs, GraphQL, Microservices, Python, FastAPI
- Databases & Storage: PostgreSQL, Redis, MongoDB, Prisma, TypeORM
- Cloud & DevOps: AWS (EC2, S3, ECS), Docker, Kubernetes, CI/CD, GitHub Actions, Nginx
- Methodology: Agile, Scrum, System Design, Automated Testing, Code Review

WORK EXPERIENCE
Senior Full Stack Engineer | Apex Cloud Solutions | 2022 - Present
- Architected and released a real-time analytics dashboard serving 120,000 active monthly users, leveraging React, TypeScript, and WebSockets.
- Optimized backend PostgreSQL queries and implemented Redis caching, reducing server P99 latency by 42% and cutting AWS infrastructure costs by $18,000 annually.
- Spearheaded the transition from monolith to containerized Docker microservices deployed on AWS ECS via GitHub Actions CI/CD pipelines.
- Mentored 4 junior frontend developers and led weekly engineering design RFCs.

Full Stack Software Engineer | TechPulse Technologies | 2019 - 2022
- Developed customer-facing React & Node.js application features, delivering 15+ major production features ahead of schedule.
- Integrated Stripe payment gateway and webhook event handlers processing over $2.5M in quarterly transactions securely.
- Built automated end-to-end testing suite using Jest and Cypress, elevating overall codebase test coverage from 45% to 88%.

EDUCATION & CERTIFICATIONS
- B.S. in Computer Science | University of California, Berkeley (2019)
- AWS Certified Solutions Architect - Associate (2022)

PROJECTS
- Open Source Real-Time Event Engine: Built a high-throughput Node.js & Redis event pipeline handling 50k events/sec.
- Developer Portfolio & Component Library: Created an accessible React UI design library with 1,200+ GitHub stars.`
  },
  {
    id: 'ai-ml-engineer',
    name: 'Dr. Sophia Chen',
    role: 'AI / Machine Learning Engineer',
    experienceLevel: '6+ Years Experience',
    rawText: `Dr. Sophia Chen
AI / Machine Learning Engineer | Boston, MA
sophia.chen@ai-researcher.org | +1 (555) 782-9014 | linkedin.com/in/sophiachen-ai | github.com/schen-ml

PROFESSIONAL SUMMARY
Senior AI/ML Engineer and Researcher specializing in Natural Language Processing (NLP), Large Language Models (LLMs), RAG systems, and Computer Vision. Hands-on expertise with PyTorch, TensorFlow, Python, Scikit-Learn, vector databases (Pinecone), and model deployment pipelines.

TECHNICAL SKILLS
- Machine Learning & AI: PyTorch, TensorFlow, Scikit-Learn, NLP, Deep Learning, Computer Vision, LLMs, LangChain, LlamaIndex, RAG, Fine-Tuning, Hugging Face
- Data & Backend: Python, FastAPI, Pandas, NumPy, PostgreSQL, Pinecone, Redis
- Infrastructure & Cloud: AWS, Docker, Kubernetes, MLflow, Ray, Triton Inference Server

WORK EXPERIENCE
Lead AI Systems Engineer | Neural Scale Labs | 2021 - Present
- Designed and deployed Retrieval-Augmented Generation (RAG) architecture powering Enterprise Search across 5M+ internal documents using PyTorch, LangChain, and Pinecone vector database.
- Reduced LLM hallucination rate by 34% through custom fine-tuning of Llama 3 models on domain-specific datasets.
- Accelerated GPU inference speed by 3.2x by implementing vLLM quantization and TensorRT optimizations.
- Managed end-to-end MLOps pipeline tracking model drift and performance metrics using MLflow.

Machine Learning Developer | DataVanguard Analytics | 2018 - 2021
- Built predictive time-series forecasting models in Python & Scikit-Learn, improving demand forecasting accuracy by 28%.
- Processed 10TB+ daily sensor streams using PySpark and PostgreSQL.

EDUCATION
- Ph.D. in Computer Science (Artificial Intelligence specialization) | MIT (2018)
- B.S. in Applied Mathematics | Stanford University (2014)`
  },
  {
    id: 'product-manager',
    name: 'Marcus Vance',
    role: 'Lead Product Manager',
    experienceLevel: '7+ Years Experience',
    rawText: `Marcus Vance
Lead Product Manager | New York, NY
marcus.vance@pm-exec.com | +1 (555) 491-0032 | linkedin.com/in/marcusvance-pm

SUMMARY
Visionary Lead Product Manager with 7+ years driving B2B SaaS and consumer tech product strategy, roadmap execution, and user growth. Expert in product analytics, user research, Agile delivery, cross-functional engineering collaboration, and monetization loops.

CORE COMPETENCIES
- Strategy: Product Strategy, Roadmap Planning, Go-To-Market (GTM), Pricing & Monetization, A/B Testing
- Analytics: Mixpanel, Amplitude, SQL, Google Analytics, Data-Driven Decision Making
- Execution: Agile, Scrum, JIRA, User Research, Wireframing, Stakeholder Management

EXPERIENCE
Lead Product Manager | CloudFlow SaaS | 2021 - Present
- Spearheaded the launch of CloudFlow Enterprise Tier, generating $4.2M ARR within the first 12 months.
- Led cross-functional squad of 12 software engineers, UX designers, and data scientists across 2-week Agile sprints.
- Conducted 60+ customer discovery interviews to define core customer pain points, resulting in a 24% boost in quarterly user retention.

Product Manager | GrowthShift Mobile | 2017 - 2021
- Owned mobile app onboarding funnel optimization, driving a 38% increase in day-1 signup conversion.
- Designed and ran 40+ multivariate A/B tests analyzing user behavior using Mixpanel and Amplitude.`
  }
];

export function getPresetAnalysis(presetId: string): ResumeAnalysisResult {
  const preset = SAMPLE_RESUMES.find(r => r.id === presetId) || SAMPLE_RESUMES[0];
  const parsedResume = analyzeResumeText(preset.rawText, 1);
  const atsMetrics = calculateATSMetrics(parsedResume);
  const questions = generateInterviewQuestions(parsedResume);

  return {
    parsedResume,
    atsMetrics,
    questions,
  };
}
