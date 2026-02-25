import type { HierarchyItem } from '../../../src/types';

/**
 * Generate sample hierarchical data for demonstration
 */
export function generateSampleData(): HierarchyItem[] {
  const sections = [
    { key: 'frontend', name: 'Frontend Technologies', color: '#3b82f6' },
    { key: 'backend', name: 'Backend Services', color: '#10b981' },
    { key: 'data', name: 'Data & Analytics', color: '#8b5cf6' },
    { key: 'infrastructure', name: 'Infrastructure', color: '#f59e0b' },
  ];

  const groups = {
    frontend: ['React Ecosystem', 'Vue Ecosystem', 'Angular Ecosystem', 'UI Libraries', 'Build Tools'],
    backend: ['Web Frameworks', 'API Services', 'Authentication', 'Message Queues', 'Serverless'],
    data: ['Databases', 'Analytics', 'ML/AI', 'Data Processing', 'Visualization'],
    infrastructure: ['Cloud Platforms', 'Containers', 'CI/CD', 'Monitoring', 'Security'],
  };

  const technologies = {
    'React Ecosystem': [
      { name: 'React', description: 'UI library for building user interfaces' },
      { name: 'Next.js', description: 'React framework for production' },
      { name: 'Remix', description: 'Full stack web framework' },
      { name: 'Redux', description: 'Predictable state container' },
      { name: 'React Query', description: 'Data fetching and caching' },
      { name: 'React Router', description: 'Declarative routing' },
    ],
    'Vue Ecosystem': [
      { name: 'Vue.js', description: 'Progressive JavaScript framework' },
      { name: 'Nuxt', description: 'Vue.js framework' },
      { name: 'Vuex', description: 'State management pattern' },
      { name: 'Pinia', description: 'Intuitive state management' },
    ],
    'Angular Ecosystem': [
      { name: 'Angular', description: 'Platform for web applications' },
      { name: 'RxJS', description: 'Reactive extensions library' },
      { name: 'NgRx', description: 'Reactive state management' },
    ],
    'UI Libraries': [
      { name: 'Material-UI', description: 'React component library' },
      { name: 'Ant Design', description: 'Enterprise UI design' },
      { name: 'Chakra UI', description: 'Modular component library' },
      { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
      { name: 'shadcn/ui', description: 'Re-usable components' },
    ],
    'Build Tools': [
      { name: 'Vite', description: 'Next generation frontend tooling' },
      { name: 'Webpack', description: 'Module bundler' },
      { name: 'esbuild', description: 'Extremely fast bundler' },
      { name: 'Turbopack', description: 'Incremental bundler' },
    ],
    'Web Frameworks': [
      { name: 'Express', description: 'Fast, minimalist web framework' },
      { name: 'Fastify', description: 'Fast and low overhead framework' },
      { name: 'NestJS', description: 'Progressive Node.js framework' },
      { name: 'Koa', description: 'Expressive middleware framework' },
      { name: 'Hapi', description: 'Rich framework for building applications' },
    ],
    'API Services': [
      { name: 'GraphQL', description: 'Query language for APIs' },
      { name: 'REST', description: 'Representational state transfer' },
      { name: 'gRPC', description: 'High performance RPC framework' },
      { name: 'tRPC', description: 'End-to-end typesafe APIs' },
    ],
    'Authentication': [
      { name: 'Auth0', description: 'Authentication & authorization platform' },
      { name: 'Firebase Auth', description: 'User authentication service' },
      { name: 'Clerk', description: 'Complete user management' },
      { name: 'NextAuth.js', description: 'Authentication for Next.js' },
    ],
    'Message Queues': [
      { name: 'RabbitMQ', description: 'Message broker' },
      { name: 'Apache Kafka', description: 'Distributed event streaming' },
      { name: 'Redis Streams', description: 'Log data structure' },
      { name: 'AWS SQS', description: 'Message queue service' },
    ],
    'Serverless': [
      { name: 'AWS Lambda', description: 'Run code without servers' },
      { name: 'Azure Functions', description: 'Event-driven compute' },
      { name: 'Google Cloud Functions', description: 'Serverless execution' },
      { name: 'Cloudflare Workers', description: 'Deploy serverless code' },
    ],
    'Databases': [
      { name: 'PostgreSQL', description: 'Advanced SQL database' },
      { name: 'MongoDB', description: 'Document database' },
      { name: 'Redis', description: 'In-memory data structure store' },
      { name: 'MySQL', description: 'Popular SQL database' },
      { name: 'Supabase', description: 'Open source Firebase alternative' },
    ],
    'Analytics': [
      { name: 'Mixpanel', description: 'Product analytics platform' },
      { name: 'Amplitude', description: 'Digital analytics platform' },
      { name: 'PostHog', description: 'Open source product analytics' },
      { name: 'Google Analytics', description: 'Web analytics service' },
    ],
    'ML/AI': [
      { name: 'TensorFlow', description: 'Machine learning framework' },
      { name: 'PyTorch', description: 'Deep learning framework' },
      { name: 'OpenAI API', description: 'AI models and services' },
      { name: 'Hugging Face', description: 'ML model hub' },
      { name: 'LangChain', description: 'Build LLM applications' },
    ],
    'Data Processing': [
      { name: 'Apache Spark', description: 'Unified analytics engine' },
      { name: 'Apache Airflow', description: 'Workflow orchestration' },
      { name: 'dbt', description: 'Transform data in warehouse' },
      { name: 'Pandas', description: 'Data analysis library' },
    ],
    'Visualization': [
      { name: 'D3.js', description: 'Data visualization library' },
      { name: 'Chart.js', description: 'Simple yet flexible charts' },
      { name: 'Plotly', description: 'Interactive graphing library' },
      { name: 'Apache ECharts', description: 'Powerful charting library' },
    ],
    'Cloud Platforms': [
      { name: 'AWS', description: 'Amazon Web Services' },
      { name: 'Google Cloud', description: 'Cloud computing services' },
      { name: 'Azure', description: 'Microsoft cloud platform' },
      { name: 'Vercel', description: 'Frontend cloud platform' },
      { name: 'Netlify', description: 'Modern web projects' },
    ],
    'Containers': [
      { name: 'Docker', description: 'Container platform' },
      { name: 'Kubernetes', description: 'Container orchestration' },
      { name: 'Podman', description: 'Daemonless container engine' },
      { name: 'containerd', description: 'Container runtime' },
    ],
    'CI/CD': [
      { name: 'GitHub Actions', description: 'Automate workflows' },
      { name: 'GitLab CI', description: 'Built-in CI/CD' },
      { name: 'CircleCI', description: 'Continuous integration platform' },
      { name: 'Jenkins', description: 'Automation server' },
    ],
    'Monitoring': [
      { name: 'Datadog', description: 'Monitoring and analytics' },
      { name: 'New Relic', description: 'Observability platform' },
      { name: 'Prometheus', description: 'Monitoring system' },
      { name: 'Grafana', description: 'Observability and visualization' },
    ],
    'Security': [
      { name: 'Snyk', description: 'Developer security platform' },
      { name: 'HashiCorp Vault', description: 'Secrets management' },
      { name: 'OWASP ZAP', description: 'Security testing tool' },
      { name: 'Dependabot', description: 'Automated dependency updates' },
    ],
  };

  const items: HierarchyItem[] = [];
  let id = 1;

  sections.forEach((section) => {
    const sectionGroups = groups[section.key as keyof typeof groups];
    
    sectionGroups.forEach((groupName) => {
      const groupTechs = technologies[groupName as keyof typeof technologies] || [];
      
      groupTechs.forEach((tech) => {
        items.push({
          id: `item-${id++}`,
          name: tech.name,
          description: tech.description,
          group: groupName,
          section: section.key,
          metadata: {
            sectionName: section.name,
            sectionColor: section.color,
          },
        });
      });
    });
  });

  return items;
}
