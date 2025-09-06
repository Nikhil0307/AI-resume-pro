import { ResumeTemplate } from '../types';

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'modern-tech',
    name: 'Modern Technical',
    description: 'Clean, modern design optimized for software developers',
    style: 'modern',
    atsOptimized: true,
  },
  {
    id: 'classic-professional',
    name: 'Classic Professional',
    description: 'Traditional format preferred by enterprise companies',
    style: 'classic',
    atsOptimized: true,
  },
  {
    id: 'technical-focus',
    name: 'Technical Focus',
    description: 'Skills-first layout highlighting technical expertise',
    style: 'technical',
    atsOptimized: true,
  },
  {
    id: 'creative-impact',
    name: 'Creative Impact',
    description: 'Eye-catching design for startups and creative roles',
    style: 'creative',
    atsOptimized: false,
  },
];

export const sampleProfile = {
  id: '1',
  personalInfo: {
    name: 'Nikhil Baskar',
    email: 'vishalnikhil0307@gmail.com',
    phone: '+91-8667877361',
    location: 'chennai, TamilNadu, India',
    website: 'nikhil-baskar.dev',
    linkedin: 'linkedin.com/in/nikhil0307',
    github: 'github.com/nikhil0307',
  },
  summary: 'Backend & distributed systems engineer (3+ years) specializing in microservices, scalable APIs, and high-performance caching. Proven track record of optimizing large-scale systems, building user-facing integrations, and collaborating with cross-functional teams. Experienced in Go, Node.js, Java, Python, and React, with strong skills in API design, observability, and on-call operations. Passionate about crafting intuitive, reliable, and performant customer experiences.',
  experience: [
    {
      id: '1',
      title: 'Member Technical staff',
      company: 'ZohoCorp',
      location: 'India',
      startDate: '2023-06',
      endDate: 'Present',
      current: true,
      achievements: [
        'Built gRPC-based distributed cache processing 1M+ req/day → reduced cache misses by 35% and improved read latency by 70% using Redis + gRPC.',
        'Designed API gateway integrations with RabbitMQ consumers → increased throughput 2.5x while maintaining 99.9% reliability.',
        'Migrated legacy monolith to React-based microfrontend + microservices backend → improved scalability 3x and onboarding experience.',
        'Developed REST + GraphQL APIs for service integrations → standardized contracts, reducing cross-service failures by 25%.',
        'Implemented Kubernetes deployment workflows → cut release time by 40%, enabling rapid feature rollouts.',
        'Enhanced observability with Prometheus + Grafana dashboards → reduced MTTR by 45%.'
      ],
      technologies: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    },
    {
      id: '2',
      title: 'Project Trainee',
      company: 'ZohoCorp',
      location: 'India',
      startDate: '2022-09',
      endDate: '2023-05',
      current: false,
      achievements: [
        'Optimized inference service (200K+ req/day) → reduced latency from 150ms → 100ms using ONNX + caching',
        'Built LRU cache (2M+ lookups/day) → achieved 99.9% hit rate, cutting datastore queries by 40%.',
        'Delivered browser-based ML inference → reduced backend load 50% and doubled responsiveness.',
        'Collaborated with frontend engineers on UI components for API integrations → improved user onboarding flow with better API documentation and SDKs.'
      ],
      technologies: ['Vue.js', 'Express.js', 'MongoDB', 'Docker'],
    },
  ],
  projects: [
    {
      id: '1',
      name: 'nexply (AI Job Assistant) – Personalized job search',
      description: 'Personalized AI basedjob search',
      technologies: ['NextJS', 'TypeScript', 'Supabase', 'Tailwind CSS'],
      url: 'https://nexply.vercel.app/',
      github: 'github.com/nikhil0307/nexply',
      achievements: [
        'Reduced job search time drastically',
        'Featured on Product Hunt',
        '99.9% uptime reliability',
      ],
    },
  ],
  skills: {
    technical: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express.js',
      'Python', 'Go', 'Java', 'SQL', 'Bash',
      'PostgreSQL', 'MySQL', 'MongoDB',
      'gRPC', 'REST API', 'Kubernetes', 'Docker', 'Redis', 'RabbitMQ', 'CherryPy', 'Spring',
      'AWS (S3, EC2, DynamoDB)', 'CI/CD', 'Prometheus', 'Grafana', 'Git'
    ],
    soft: ['Leadership', 'Problem Solving', 'Communication', 'Team Collaboration', 'Agile Methodologies'],
  },
  education: [
    {
      id: '1',
      degree: 'Bachelor of Engineering in Computer Science',
      institution: 'Veltech Multitech Dr.Rangarajan Dr.Sakunthala Engineering College',
      location: 'TamilNadu,India',
      graduationDate: '2019-2023',
      gpa: '7.96/10',
      relevant_courses: ['Data Structures', 'Algorithms', 'Database Systems', 'Software Engineering'],
    },
  ],
  certifications: ['AWS Certified Developer'],
};