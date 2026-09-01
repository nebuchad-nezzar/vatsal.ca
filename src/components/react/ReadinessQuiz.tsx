import { useState } from 'react'
import { CheckCircle2, ArrowRight, RotateCcw, ShieldCheck, Sparkles, Building2, User, Mail, Briefcase, ChevronRight } from 'lucide-react'

interface Question {
  id: number
  category: string
  questionBusiness: string
  questionTech: string
  options: {
    label: string
    techSublabel?: string
    points: number
  }[]
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    category: 'System Integration & API Access',
    questionBusiness: 'Can your data & trading systems connect to an external AI or automated tool today?',
    questionTech: 'Are your market data feeds, databases, or order gateways accessible via REST/WebSockets/FIX APIs?',
    options: [
      { label: 'No or isolated systems — mostly manual entry', techSublabel: 'No APIs / legacy isolated databases', points: 0 },
      { label: 'Some systems have exports/APIs, others are manual', techSublabel: 'Partial REST APIs, some CSV exports', points: 5 },
      { label: 'Yes — core infrastructure is accessible via API', techSublabel: 'Full REST / WebSocket / FIX API access', points: 10 },
    ],
  },
  {
    id: 2,
    category: 'Automation & Execution Level',
    questionBusiness: 'How automated are your team’s current operational or trading workflows?',
    questionTech: 'What is the current level of algorithmic automation in your production pipeline?',
    options: [
      { label: 'Mostly manual / spreadsheets / human execution', techSublabel: 'Manual execution / Excel models', points: 2 },
      { label: 'Semi-automated / custom scripts with human oversight', techSublabel: 'Python scripts + manual trigger', points: 6 },
      { label: 'Fully automated algorithmic execution / AI pipelines', techSublabel: 'Production algo execution / CI-CD ML', points: 10 },
    ],
  },
  {
    id: 3,
    category: 'Process Specs & Documentation',
    questionBusiness: 'Is the business process or trading logic clearly written down step-by-step?',
    questionTech: 'How thoroughly are the algorithms, data schemas, or business rules documented?',
    options: [
      { label: 'In people’s heads — tribal knowledge', techSublabel: 'Undocumented / legacy code comments only', points: 0 },
      { label: 'Partial documentation or outline exists', techSublabel: 'Basic READMEs / informal specs', points: 5 },
      { label: 'Fully documented step-by-step specs / backtests', techSublabel: 'Comprehensive specs / backtest logs / schemas', points: 10 },
    ],
  },
  {
    id: 4,
    category: 'Executive Budget & Alignment',
    questionBusiness: 'What is the budget and leadership approval status for this initiative?',
    questionTech: 'Is there dedicated engineering budget & executive sign-off for this build?',
    options: [
      { label: 'Exploring ideas / no formal budget allocated yet', techSublabel: 'Research phase / no budget approved', points: 0 },
      { label: 'Active initiative with allocated Q3/Q4 project budget', techSublabel: 'Approved project budget & milestone goals', points: 8 },
      { label: 'High-priority executive mandate with dedicated budget', techSublabel: 'C-suite mandate ($10k+ engineering budget)', points: 10 },
    ],
  },
  {
    id: 5,
    category: 'Timeline & Delivery Urgency',
    questionBusiness: 'When do you need this solution or system live in production?',
    questionTech: 'What is the target deployment deadline for this infrastructure?',
    options: [
      { label: 'Informational / exploring for the next 6+ months', techSublabel: 'Exploratory / >6 months out', points: 2 },
      { label: 'Targeting production launch within 1–3 months', techSublabel: 'Next 30–90 days deployment window', points: 7 },
      { label: 'Immediate priority — need to start within 30 days', techSublabel: 'ASAP / Immediate engineering sprint', points: 10 },
    ],
  },
]

export default function ReadinessQuiz() {
  const [roleTrack, setRoleTrack] = useState<'business' | 'tech' | null>(null)
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)

  // Form Fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [roleTitle, setRoleTitle] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  const handleSelectRole = (track: 'business' | 'tech') => {
    setRoleTrack(track)
    setCurrentStep(1)
  }

  const handleSelectOption = (points: number) => {
    const nextAnswers = [...answers, points]
    setAnswers(nextAnswers)

    if (currentStep < QUESTIONS.length) {
      setCurrentStep(currentStep + 1)
    } else {
      setCurrentStep(QUESTIONS.length + 1) // Move to Lead Form
    }
  }

  const handleReset = () => {
    setRoleTrack(null)
    setCurrentStep(0)
    setAnswers([])
    setIsCompleted(false)
    setFormError(null)
  }

  // Score Calculation
  const totalPoints = answers.reduce((acc, curr) => acc + curr, 0)
  const maxPossible = 50
  const scorePercent = Math.min(100, Math.round((totalPoints / maxPossible) * 100))

  const isQualified = scorePercent >= 60

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name || !company) {
      setFormError('Please fill in your name, work email, and company.')
      return
    }

    setIsSubmitting(true)
    setFormError(null)

    try {
      const acqSource = typeof window !== 'undefined' ? localStorage.getItem('v_acq_source') || 'Direct' : 'Direct';
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';

      // Submit to backend newsletter/subscribe route
      await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          fullName: name,
          company,
          role: roleTitle || roleTrack,
          readinessScore: `${scorePercent}%`,
          answers,
          source: acqSource,
          path: currentPath
        }),
      })

      setIsCompleted(true)
    } catch {
      // Show score regardless
      setIsCompleted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  const currentQ = QUESTIONS[currentStep - 1]
  const progressPercent = Math.round((currentStep / (QUESTIONS.length + 1)) * 100)

  return (
    <section className="w-full max-w-4xl mx-auto py-12 px-4">
      {/* Header Title */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400">
          <Sparkles className="size-3.5" />
          Interactive Assessment
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground font-mono">
          Is Your Firm Ready for AI & Automated Trading?
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
          5 quick questions across infrastructure, data, and budget. Get an instant Readiness Score & determine if your firm qualifies for a direct engineering consultation.
        </p>
      </div>

      {/* Main Card Container */}
      <div className="relative rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Step 0: Choose Role Track */}
        {currentStep === 0 && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <h3 className="text-lg font-semibold text-foreground font-mono">Select Your Perspective</h3>
              <p className="text-xs text-muted-foreground">We’ll frame the assessment questions to match your role.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <button
                type="button"
                onClick={() => handleSelectRole('business')}
                className="group p-5 rounded-xl border border-border/60 bg-card/40 hover:border-blue-500/60 hover:bg-blue-950/20 transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                    <Building2 className="size-5" />
                  </div>
                  <h4 className="text-base font-bold text-foreground font-mono mb-1">C-Suite / Founder / Exec</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Business-focused evaluation of strategy, ROI, timeline, and budget readiness.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-blue-400 font-mono mt-4 group-hover:translate-x-1 transition-transform">
                  Start Business Track <ChevronRight className="size-3.5" />
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleSelectRole('tech')}
                className="group p-5 rounded-xl border border-border/60 bg-card/40 hover:border-purple-500/60 hover:bg-purple-950/20 transition-all text-left flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-400 w-fit mb-3 group-hover:scale-110 transition-transform">
                    <User className="size-5" />
                  </div>
                  <h4 className="text-base font-bold text-foreground font-mono mb-1">CTO / Quant Lead / Engineer</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Technical evaluation of APIs, latency, data schemas, and pipeline automation.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-purple-400 font-mono mt-4 group-hover:translate-x-1 transition-transform">
                  Start Technical Track <ChevronRight className="size-3.5" />
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Step 1 to 5: Questions */}
        {currentStep >= 1 && currentStep <= QUESTIONS.length && currentQ && (
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-muted-foreground">
                <span>Question {currentStep} of {QUESTIONS.length}</span>
                <span>{progressPercent}% Complete</span>
              </div>
              <div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Question Heading */}
            <div className="space-y-1 pt-2">
              <span className="text-[11px] font-mono text-blue-400 uppercase tracking-wider">
                {currentQ.category}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                {roleTrack === 'business' ? currentQ.questionBusiness : currentQ.questionTech}
              </h3>
            </div>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(opt.points)}
                  className="w-full p-4 rounded-xl border border-border/60 bg-card/40 hover:border-blue-500/50 hover:bg-blue-950/20 text-left transition-all duration-200 flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-blue-300 transition-colors">
                      {opt.label}
                    </p>
                    {roleTrack === 'tech' && opt.techSublabel && (
                      <p className="text-xs text-muted-foreground font-mono mt-0.5">
                        {opt.techSublabel}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="size-4 text-muted-foreground group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0 ml-3" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Form Lead Capture */}
        {currentStep === QUESTIONS.length + 1 && !isCompleted && (
          <div className="space-y-6">
            <div className="text-center space-y-1">
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                Assessment Complete
              </span>
              <h3 className="text-xl font-bold text-foreground font-mono pt-2">Where should we send your score report?</h3>
              <p className="text-xs text-muted-foreground">
                Enter your work details to unlock your readiness score and personalized diagnostic breakdown.
              </p>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 max-w-md mx-auto">
              {formError && (
                <p className="text-xs text-red-400 text-center">{formError}</p>
              )}

              <div>
                <label className="text-xs font-mono text-muted-foreground block mb-1">Your Name *</label>
                <div className="relative">
                  <User className="size-4 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Vatsal Sharma"
                    className="w-full bg-background/80 border border-border/60 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-muted-foreground block mb-1">Work Email *</label>
                <div className="relative">
                  <Mail className="size-4 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@firm.com"
                    className="w-full bg-background/80 border border-border/60 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-muted-foreground block mb-1">Company / Fund Name *</label>
                <div className="relative">
                  <Building2 className="size-4 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Alpha Capital"
                    className="w-full bg-background/80 border border-border/60 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-muted-foreground block mb-1">Role Title (Optional)</label>
                <div className="relative">
                  <Briefcase className="size-4 absolute left-3 top-3 text-muted-foreground" />
                  <input
                    type="text"
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="Partner / CTO / Head of Quant"
                    className="w-full bg-background/80 border border-border/60 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm font-semibold transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? 'Calculating Score...' : 'Unlock My Readiness Score →'}
              </button>
            </form>
          </div>
        )}

        {/* Step 7: Completed Results Card */}
        {isCompleted && (
          <div className="space-y-6 text-center">
            {/* Score Ring / Gauge */}
            <div className="inline-flex flex-col items-center justify-center p-6 rounded-full border border-border/60 bg-card/60 mx-auto">
              <span className="text-4xl font-bold font-mono text-foreground">{scorePercent}%</span>
              <span className="text-xs font-mono text-muted-foreground mt-0.5">Readiness Score</span>
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              {isQualified ? (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
                    <CheckCircle2 className="size-3.5" />
                    High Engineering Readiness
                  </div>
                  <h3 className="text-xl font-bold text-foreground font-mono">Your Firm Qualifies for a Direct Strategy Session</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Based on your integration capability and budget sign-off, your firm is ready for an architecture consultation or custom system build.
                  </p>
                </>
              ) : (
                <>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs font-mono text-amber-400">
                    Infrastructure Prep Needed
                  </div>
                  <h3 className="text-xl font-bold text-foreground font-mono">Custom Report Sent to Your Inbox</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    We’ve emailed your diagnostic report with key recommendations for stabilizing your data pipeline before initiating custom build work.
                  </p>
                </>
              )}
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isQualified && (
                <a
                  href="/book-a-call"
                  className="w-full sm:w-auto py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 inline-flex items-center justify-center gap-2"
                >
                  Book 1-on-1 Strategy Session <ArrowRight className="size-4" />
                </a>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto py-2.5 px-4 rounded-lg border border-border/60 hover:bg-card text-muted-foreground hover:text-foreground font-mono text-xs transition-all inline-flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="size-3.5" /> Retake Assessment
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Guarantee Note */}
      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60 font-mono pt-4 text-center">
        <ShieldCheck className="size-3.5" />
        Strict Privacy: We never sell your data or share your firm’s architecture.
      </div>
    </section>
  )
}
