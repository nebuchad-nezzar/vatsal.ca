import Timeline from './Timeline'

const timelineData = [
  {
    title: '2026',
    content: (
      <div>
        <h4 className="text-lg md:text-2xl font-semibold text-foreground mb-2">
          Quantitative Researcher & AI Engineer — Hedge Fund
        </h4>
        <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">
          Designing and building proprietary quantitative trading systems at a tech-focused hedge fund.
          Automating trading strategies, analyzing market data across equities, options, and crypto,
          and driving portfolio performance through cutting-edge AI/ML models.
        </p>
        <div className="flex flex-wrap gap-2">
          {['Python', 'C++', 'PyTorch', 'CUDA', 'Low-Latency Systems', 'Options Pricing'].map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: '2025',
    content: (
      <div>
        <h4 className="text-lg md:text-2xl font-semibold text-foreground mb-2">
          MS in Data Science (AI Specialization) — Northeastern University
        </h4>
        <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">
          Graduated with a specialization in Artificial Intelligence. Coursework spanning statistical machine learning,
          deep learning, NLP, reinforcement learning, and large-scale data engineering. Built and published a custom Portfolio
          Management System streamlining operations across hundreds of accounts.
        </p>
        <div className="flex flex-wrap gap-2">
          {['Machine Learning', 'NLP', 'Reinforcement Learning', 'Data Engineering', 'Research'].map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: '2023',
    content: (
      <div>
        <h4 className="text-lg md:text-2xl font-semibold text-foreground mb-2">
          Blockchain Systems & Published Research
        </h4>
        <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">
          Built scalable blockchain systems including an e-wallet project that led to a published technical paper
          on concurrency control. Explored distributed consensus mechanisms, cryptographic protocols, and
          high-throughput transaction processing architectures.
        </p>
        <div className="flex flex-wrap gap-2">
          {['Blockchain', 'Distributed Systems', 'Concurrency Control', 'Cryptography', 'Published Paper'].map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: '2021',
    content: (
      <div>
        <h4 className="text-lg md:text-2xl font-semibold text-foreground mb-2">
          BEng in Information Technology — Manipal University
        </h4>
        <p className="text-sm md:text-base text-muted-foreground mb-4 leading-relaxed">
          Completed undergraduate studies in Information Technology with a strong foundation in algorithms,
          data structures, database systems, and software engineering. Early explorations into quantitative
          methods and financial markets that would shape the career trajectory ahead.
        </p>
        <div className="flex flex-wrap gap-2">
          {['Algorithms', 'Data Structures', 'Software Engineering', 'Databases', 'Quantitative Methods'].map((tag) => (
            <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
              {tag}
            </span>
          ))}
        </div>
      </div>
    ),
  },
]

export default function JourneyTimeline() {
  return (
    <section className="mt-16">
      <div className="mb-8">
        <h2 className="text-2xl font-medium">Journey</h2>
        <p className="text-sm text-muted-foreground mt-1">
          From engineering foundations to quantitative finance & AI research.
        </p>
      </div>
      <Timeline data={timelineData} />
    </section>
  )
}
