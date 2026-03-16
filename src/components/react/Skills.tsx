'use client'

import { useMemo } from 'react'
import { InfiniteScroll } from './InfiniteScroll'
import { getIcon } from './SkillsIconLoader'

// Types for technologies
type Category = {
  text: string
  logo: string
}

type Technologies = {
  [key: string]: Category[]
}

// Technologies based on CV with all new categories
const technologies: Technologies = {
  'Systems & Virtualization': [
    { text: 'Linux', logo: 'simple-icons:linux' },
    { text: 'Ubuntu', logo: 'mdi:ubuntu' },
    { text: 'Debian', logo: 'simple-icons:debian' },
    { text: 'Windows Server', logo: 'mdi:windows' },
    { text: 'Proxmox', logo: 'simple-icons:proxmox' },
    { text: 'Docker', logo: 'mdi:docker' },
    { text: 'Kubernetes', logo: 'mdi:kubernetes' },
    { text: 'XEN', logo: 'lucide:box' },
  ],
  'Networking & Security': [
    { text: 'Cisco', logo: 'simple-icons:cisco' },
    { text: 'pfSense', logo: 'simple-icons:pfsense' },
    { text: 'Fortinet', logo: 'simple-icons:fortinet' },
    { text: 'Palo Alto', logo: 'simple-icons:paloaltonetworks' },
    { text: 'StrongSwan', logo: 'lucide:wifi' },
    { text: 'VLAN', logo: 'lucide:network' },
    { text: 'CyberArk', logo: 'lucide:lock' },
    { text: 'Nessus', logo: 'lucide:shield' },
  ],
  'Automation & Orchestration': [
    { text: 'Ansible', logo: 'simple-icons:ansible' },
    { text: 'Terraform', logo: 'simple-icons:terraform' },
    { text: 'Puppet', logo: 'simple-icons:puppet' },
    { text: 'SALT', logo: 'simple-icons:saltproject' },
    { text: 'Bash', logo: 'lucide:terminal' },
    { text: 'Git', logo: 'mdi:git' },
    { text: 'Flux', logo: 'simple-icons:flux' },
    { text: 'Rancher', logo: 'simple-icons:rancher' },
  ],
  'Cloud & Infrastructure': [
    { text: 'AWS', logo: 'lucide:cloud' },
    { text: 'Oracle Cloud', logo: 'simple-icons:oracle' },
    { text: 'Cloudflare', logo: 'simple-icons:cloudflare' },
    { text: 'InfiniBand', logo: 'lucide:network' },
    { text: 'PBS Scheduler', logo: 'lucide:server' },
    { text: 'ManageIQ', logo: 'lucide:cloud-cog' },
    { text: 'Talos Linux', logo: 'lucide:box' },
    { text: 'Cilium CNI', logo: 'simple-icons:cilium' },
  ],
  'Monitoring & Tools': [
    { text: 'Portainer', logo: 'simple-icons:portainer' },
    { text: 'Bareos', logo: 'lucide:hard-drive' },
    { text: 'Asterisk', logo: 'simple-icons:asterisk' },
    { text: 'Apache', logo: 'simple-icons:apache' },
    { text: 'Nginx', logo: 'simple-icons:nginx' },
    { text: 'MySQL', logo: 'simple-icons:mysql' },
    { text: 'WordPress', logo: 'simple-icons:wordpress' },
    { text: 'cPanel', logo: 'simple-icons:cpanel' },
  ],
  'Programming Languages': [
    { text: 'Python', logo: 'simple-icons:python' },
    { text: 'C++', logo: 'simple-icons:cplusplus' },
    { text: 'SQL', logo: 'simple-icons:mysql' },
    { text: 'R', logo: 'simple-icons:r' },
    { text: 'Julia', logo: 'simple-icons:julia' },
    { text: 'MATLAB', logo: 'simple-icons:matlab' },
    { text: 'Bash', logo: 'lucide:terminal' },
  ],
  'Web Development': [
    { text: 'HTML', logo: 'simple-icons:html5' },
    { text: 'CSS', logo: 'simple-icons:css3' },
    { text: 'Tailwind CSS', logo: 'simple-icons:tailwindcss' },
    { text: 'React', logo: 'simple-icons:react' },
    { text: 'NextJS', logo: 'simple-icons:nextdotjs' },
  ],
  'AI/ML Domains': [
    { text: 'Deep Learning', logo: 'lucide:brain' },
    { text: 'LLMs', logo: 'lucide:message-square' },
    { text: 'Computer Vision', logo: 'lucide:eye' },
    { text: 'Natural Language Processing', logo: 'lucide:message-circle' },
    { text: 'RAGs', logo: 'lucide:database' },
    { text: 'Neural Networks', logo: 'lucide:network' },
    { text: 'Statistical Analysis', logo: 'lucide:trending-up' },
    { text: 'EDA', logo: 'lucide:bar-chart' },
    { text: 'Pattern Recognition', logo: 'lucide:search' },
    { text: 'Hyperparameter Tuning', logo: 'lucide:settings' },
    { text: 'Feature Engineering', logo: 'lucide:wrench' },
    { text: 'Time Series Analysis', logo: 'lucide:chart-line' },
    { text: 'Reinforcement Learning', logo: 'lucide:target' },
    { text: 'Transfer Learning', logo: 'lucide:share-2' },
    { text: 'Federated Learning', logo: 'lucide:globe' },
  ],
  'ML Frameworks & Tools': [
    { text: 'TensorFlow', logo: 'simple-icons:tensorflow' },
    { text: 'PyTorch', logo: 'simple-icons:pytorch' },
    { text: 'Scikit-learn', logo: 'simple-icons:scikitlearn' },
    { text: 'Keras', logo: 'simple-icons:keras' },
    { text: 'Apache Spark', logo: 'simple-icons:apachespark' },
    { text: 'PySpark', logo: 'simple-icons:apachespark' },
    { text: 'OpenCV', logo: 'simple-icons:opencv' },
    { text: 'HuggingFace', logo: 'simple-icons:huggingface' },
    { text: 'Pandas', logo: 'simple-icons:pandas' },
    { text: 'Numpy', logo: 'simple-icons:numpy' },
    { text: 'Matplotlib', logo: 'simple-icons:matplotlib' },
    { text: 'Seaborn', logo: 'simple-icons:python' },
    { text: 'Tableau', logo: 'simple-icons:tableau' },
    { text: 'Requests', logo: 'simple-icons:python' },
    { text: 'BeautifulSoup', logo: 'simple-icons:python' },
    { text: 'LangChain', logo: 'simple-icons:langchain' },
    { text: 'Streamlit', logo: 'simple-icons:streamlit' },
    { text: 'Plotly', logo: 'simple-icons:plotly' },
    { text: 'Weights & Biases', logo: 'simple-icons:weightsandbiases' },
    { text: 'MLflow', logo: 'simple-icons:mlflow' },
    { text: 'DVC', logo: 'simple-icons:dvc' },
    { text: 'Ray', logo: 'simple-icons:ray' },
    { text: 'Optuna', logo: 'simple-icons:optuna' },
  ],
  'Quantitative Research': [
    { text: 'QuantConnect', logo: 'lucide:line-chart' },
    { text: 'Zipline', logo: 'lucide:refresh-cw' },
    { text: 'Backtrader', logo: 'lucide:bar-chart-2' },
    { text: 'Alphalens', logo: 'lucide:trending-up' },
    { text: 'PyAlgoTrade', logo: 'lucide:chart-candlestick' },
    { text: 'TA-Lib', logo: 'lucide:calculator' },
    { text: 'QuantLib', logo: 'lucide:briefcase' },
    { text: 'Riskfolio-Lib', logo: 'lucide:shield' },
    { text: 'Empyrical', logo: 'lucide:clipboard-check' },
    { text: 'CCXT', logo: 'lucide:dollar-sign' },
    { text: 'yfinance', logo: 'lucide:chart-line' },
    { text: 'Statsmodels', logo: 'lucide:activity' },
  ],
  'Quantitative Trading': [
    { text: 'Quantitative Analysis', logo: 'lucide:calculator' },
    { text: 'Algorithmic Trading', logo: 'lucide:trending-up' },
    { text: 'Financial Modeling', logo: 'lucide:pie-chart' },
    { text: 'Risk Management', logo: 'lucide:shield' },
    { text: 'Statistical Arbitrage', logo: 'lucide:bar-chart-3' },
    { text: 'Backtesting', logo: 'lucide:refresh-cw' },
    { text: 'High-Frequency Trading', logo: 'lucide:zap' },
    { text: 'Market Microstructure', logo: 'lucide:activity' },
    { text: 'Portfolio Optimization', logo: 'lucide:layers' },
    { text: 'Derivatives Pricing', logo: 'lucide:line-chart' },
    { text: 'Market Making', logo: 'lucide:handshake' },
    { text: 'Execution Algorithms', logo: 'lucide:cpu' },
  ],
  'AI Development Tools': [
    { text: 'Jupyter', logo: 'simple-icons:jupyter' },
    { text: 'Google Colab', logo: 'simple-icons:googlecolab' },
    { text: 'VSCode', logo: 'simple-icons:visualstudiocode' },
    { text: 'PyCharm', logo: 'simple-icons:pycharm' },
    { text: 'GitHub Copilot', logo: 'simple-icons:githubcopilot' },
    { text: 'OpenAI API', logo: 'simple-icons:openai' },
    { text: 'Anthropic Claude', logo: 'lucide:bot' },
    { text: 'LlamaIndex', logo: 'simple-icons:llamaindex' },
    { text: 'Haystack', logo: 'lucide:search' },
    { text: 'FastAPI', logo: 'simple-icons:fastapi' },
    { text: 'Gradio', logo: 'simple-icons:gradio' },
    { text: 'Airflow', logo: 'simple-icons:apacheairflow' },
    { text: 'Prefect', logo: 'simple-icons:prefect' },
    { text: 'Dagster', logo: 'simple-icons:dagster' },
  ],
  'Data Platforms': [
    { text: 'PostgreSQL', logo: 'simple-icons:postgresql' },
    { text: 'MongoDB', logo: 'simple-icons:mongodb' },
    { text: 'Redis', logo: 'simple-icons:redis' },
    { text: 'InfluxDB', logo: 'simple-icons:influxdb' },
    { text: 'TimescaleDB', logo: 'simple-icons:timescale' },
    { text: 'ClickHouse', logo: 'simple-icons:clickhouse' },
    { text: 'DuckDB', logo: 'simple-icons:duckdb' },
    { text: 'Snowflake', logo: 'simple-icons:snowflake' },
    { text: 'Databricks', logo: 'simple-icons:databricks' },
    { text: 'BigQuery', logo: 'simple-icons:googlebigquery' },
    { text: 'Kafka', logo: 'simple-icons:apachekafka' },
  ],
  'Collaboration Tools': [
    { text: 'Notion', logo: 'simple-icons:notion' },
    { text: 'Mailchimp', logo: 'simple-icons:mailchimp' },
    { text: 'Slack', logo: 'simple-icons:slack' },
    { text: 'Confluence', logo: 'simple-icons:confluence' },
    { text: 'Jira', logo: 'simple-icons:jira' },
    { text: 'Trello', logo: 'simple-icons:trello' },
    { text: 'Microsoft Teams', logo: 'simple-icons:microsoftteams' },
    { text: 'Zoom', logo: 'simple-icons:zoom' },
  ],
  'Soft Skills': [
    { text: 'Research & Development', logo: 'lucide:microscope' },
    { text: 'Project Management', logo: 'lucide:clipboard-list' },
    { text: 'Communication', logo: 'lucide:message-circle' },
    { text: 'Critical Thinking', logo: 'lucide:brain' },
    { text: 'Problem Solving', logo: 'lucide:puzzle' },
    { text: 'Fast Learner', logo: 'lucide:zap' },
    { text: 'Attention to Detail', logo: 'lucide:search' },
    { text: 'Time Management', logo: 'lucide:clock' },
    { text: 'Leadership', logo: 'lucide:users' },
    { text: 'Team Collaboration', logo: 'lucide:handshake' },
    { text: 'Adaptability', logo: 'lucide:refresh-cw' },
  ]
}

// Adjust group size based on number of categories
const categories = Object.keys(technologies)
const groupSize = Math.ceil(categories.length / 4) // Increased to 4 groups for better display
const categoryGroups: string[][] = [
  categories.slice(0, groupSize),
  categories.slice(groupSize, groupSize * 2),
  categories.slice(groupSize * 2, groupSize * 3),
  categories.slice(groupSize * 3),
].filter(group => group.length > 0) // Remove empty groups

interface TechBadgeProps {
  tech: Category
  category: string
  techIndex: number
}

const TechBadge: React.FC<{ tech: Category }> = ({ tech }) => {
  const IconComponent = getIcon(tech.logo)

  return (
    <div
      className="mr-4 flex items-center gap-2.5 rounded-full bg-muted/30 px-4 py-2.5 transition-colors duration-200 hover:bg-muted/50"
      role="listitem"
      aria-label={`${tech.text} skill`}
    >
      {IconComponent && (
        <div
          className="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground"
          aria-hidden="true"
        >
          <IconComponent className="h-full w-full" />
        </div>
      )}
      <span className="text-sm font-medium text-foreground">{tech.text}</span>
    </div>
  )
}

const Skills: React.FC = () => {
  // Memoize tech items per group to prevent unnecessary re-renders
  const techItemsByGroup = useMemo(() => {
    return categoryGroups.map((group) =>
      group.flatMap((category) =>
        technologies[category].map((tech, techIndex) => ({
          tech,
          category,
          techIndex,
          key: `${category}-${techIndex}-${tech.text}`,
        })),
      ),
    )
  }, [])

  // Different durations for visual variety
  const durations = [50000, 70000, 90000, 65000]
  const directions = ['normal', 'reverse', 'normal', 'reverse']

  return (
    <div className="w-full space-y-4" role="list" aria-label="Skills categories">
      {categoryGroups.map((_, groupIndex) => (
        <InfiniteScroll
          key={groupIndex}
          duration={durations[groupIndex % durations.length]}
          direction={directions[groupIndex % directions.length] as 'normal' | 'reverse'}
          showFade={true}
          className="flex flex-row"
          aria-label={`Skills group ${groupIndex + 1}`}
        >
          {techItemsByGroup[groupIndex].map(({ tech, category, techIndex, key }) => (
            <TechBadge
              key={key}
              tech={tech}
            />
          ))}
        </InfiniteScroll>
      ))}
    </div>
  )
}

export default Skills