import { MicroDrillItem } from '../types';

export interface ExistingSystem {
  name: string;
  category: string;
  pricing: string;
  whatTheyBuilt: string[];
  techStack: string;
  criticalFlaws: string[];
  marketGapScore: number;
}

export interface FeatureGap {
  title: string;
  whyExistingFail: string;
  whatUsersActuallyNeed: string;
  yourCompetitiveMoat: string;
  impactLevel: 'Game Changer' | 'High' | 'Strategic';
}

export interface CompanyProfile {
  id: string;
  name: string;
  tier: 'Global Tier-1 / Investment Banking' | 'Big Tech (FAANG/M)' | 'Global Consulting / Enterprise' | 'Major IT Services (India & Global)';
  description: string;
  technicalFocus: string[];
  hrFocus: string[];
  cultureTips: string;
}

export interface RoleProfile {
  id: string;
  title: string;
  experienceLevel: string;
  coreTechSkills: string[];
  technicalTopics: string[];
  hrTopics: string[];
  defaultResumeContext: string;
}

export const TARGET_COMPANIES: CompanyProfile[] = [
  {
    id: 'goldman-sachs',
    name: 'Goldman Sachs',
    tier: 'Global Tier-1 / Investment Banking',
    description: 'High-frequency systems, algorithmic rigor, low-latency architectures, and mathematical logic. Extremely selective bar.',
    technicalFocus: [
      'Data Structures & Advanced Algorithms (Trees, Graphs, DP)',
      'Low-Latency Multithreading & Concurrency',
      'System Design for High-Throughput Financial Ledgers',
      'Memory Management & Garbage Collection optimization'
    ],
    hrFocus: [
      'High-pressure crisis management under financial risk',
      'Fiduciary integrity and ethics under ambiguity',
      'Commercial awareness & understanding of financial workflows',
      'Collaborative consensus across trading & quant desks'
    ],
    cultureTips: 'Values intellectual humility, mathematical precision, and zero-defect mindset. Expect questions on trade-offs where data loss is unacceptable.'
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    tier: 'Big Tech (FAANG/M)',
    description: 'Cloud scale (Azure), clean design patterns, distributed resiliency, and strong growth-mindset behavioral rounds.',
    technicalFocus: [
      'Scalable System Architecture & Microservices',
      'Clean OOPs, SOLID principles, and Low-Level Design (LLD)',
      'Data Structures with clean modular code & edge-case testing',
      'Distributed Caching & Asynchronous Queues'
    ],
    hrFocus: [
      'Growth Mindset: Learning from past failure without defensiveness',
      'Diversity, Inclusion & Empathetic collaboration',
      'Customer Obsession & business impact quantification',
      'Why Microsoft vs competitors'
    ],
    cultureTips: 'Never claim you know everything; Satya Nadella culture prioritizes "Learn-it-all" over "Know-it-all". Frame failures around root-cause analysis.'
  },
  {
    id: 'infosys',
    name: 'Infosys',
    tier: 'Major IT Services (India & Global)',
    description: 'Pioneer of global delivery model. Assesses CS fundamentals, InfyTQ/HackWithInfy problem solving, and client communication.',
    technicalFocus: [
      'Core Java / Python / C++ Object Oriented Programming',
      'DBMS, SQL Joins, Indexing, and Normalization (1NF to BCNF)',
      'Operating Systems (Processes vs Threads, Deadlock prevention)',
      'Basic Web Dev & REST API integrations'
    ],
    hrFocus: [
      'Willingness to learn new technologies and undergo Mysore training',
      'Relocation flexibility (Bangalore, Pune, Hyderabad, Chennai)',
      'Handling shifts and client-facing deadlines',
      'Long-term loyalty & bond/policy alignment'
    ],
    cultureTips: 'Communicate with clarity, grammatical accuracy, and professional decorum. Emphasize teamwork, adaptability, and high trainability.'
  },
  {
    id: 'deloitte',
    name: 'Deloitte',
    tier: 'Global Consulting / Enterprise',
    description: 'Tech consulting leader. Focuses on enterprise solution architecture, business problem breakdown, and stakeholder presentation.',
    technicalFocus: [
      'SQL Query Optimization, Window Functions, and CTEs',
      'Enterprise Architecture (ERP, CRM, Cloud migration)',
      'Data Modeling, ETL Pipelines, and Reporting Dashboards',
      'Business Logic debugging & System integration'
    ],
    hrFocus: [
      'Managing difficult client stakeholders who change scope',
      'Business case presentation & structuring executive summaries',
      'Working under aggressive audit / consulting milestones',
      'Why Deloitte USI / Consulting track'
    ],
    cultureTips: 'Speak like a trusted advisor: Connect every technical choice directly to business value, ROI, and risk mitigation.'
  },
  {
    id: 'tcs',
    name: 'Tata Consultancy Services (TCS)',
    tier: 'Major IT Services (India & Global)',
    description: 'India\'s largest IT employer (Ninja & Digital hiring). Evaluates core engineering foundation, project ownership, and versatility.',
    technicalFocus: [
      'C / Java / Python algorithmic programming',
      'Database queries, ACID properties, and Primary/Foreign keys',
      'Networking basics (OSI 7 layers, TCP vs UDP, IP addressing)',
      'Final year project deep dive: Your specific role & contribution'
    ],
    hrFocus: [
      'Tata Code of Conduct & ethical integrity',
      'Flexibility for shift schedules and project allocation',
      'Handling conflict in university / project teams',
      'Where do you see yourself in 3 to 5 years at TCS?'
    ],
    cultureTips: 'Tata culture places ethics, customer commitment, and team harmony at the highest pedestal. Avoid aggressive individualist tone.'
  },
  {
    id: 'epam',
    name: 'EPAM Systems',
    tier: 'Global Tier-1 / Investment Banking',
    description: 'Global engineering consultancy celebrated for extreme technical bar, clean code craftsmanship, and unit test discipline.',
    technicalFocus: [
      'Clean Code, Refactoring, and Gang of Four (GoF) Design Patterns',
      'Deep Java (Streams, Collections, Concurrency) or TypeScript / Python',
      'TDD (Test Driven Development) & Mocking libraries',
      'Complex Data Structures & Algorithm efficiency'
    ],
    hrFocus: [
      'Engineering pride & self-driven technical upskilling',
      'Collaborating in distributed global engineering pods (US/EU/APAC)',
      'Constructive feedback in code reviews',
      'Direct client technical pushback and requirement negotiation'
    ],
    cultureTips: 'Expect immediate live code critique. Interviewers will review your variable names, edge cases, and separation of concerns.'
  },
  {
    id: 'wipro',
    name: 'Wipro',
    tier: 'Major IT Services (India & Global)',
    description: 'Elite & Turbo hiring programs. Evaluates structured thinking, core software development lifecycle (SDLC), and problem solving.',
    technicalFocus: [
      'SDLC phases (Agile vs Waterfall, CI/CD basics)',
      'Core Programming & Syntax proficiency (Java/Python/C)',
      'SQL complex queries, Group By, Having, and Subqueries',
      'Linux command line fundamentals & environment setup'
    ],
    hrFocus: [
      'Adaptability to assigned project domains (BFSI, Healthcare, Retail)',
      'Overcoming academic or project roadblocks',
      'Long-term commitment to Wipro\'s spirit of innovation',
      'Relocation readiness and shift flexibility'
    ],
    cultureTips: 'Demonstrate genuine curiosity and readiness to tackle any technology stack the client project requires.'
  },
  {
    id: 'google',
    name: 'Google',
    tier: 'Big Tech (FAANG/M)',
    description: 'World-renowned for Googleyness, algorithmic complexity, distributed scale, and structured algorithmic problem solving.',
    technicalFocus: [
      'Complex DSA (Graphs, Dynamic Programming, Segment Trees)',
      'Large Scale Distributed Systems & CAP theorem trade-offs',
      'Concurrency, Sharding, and Multi-region Consensus',
      'Clean, mathematically optimal code with O(N) complexity analysis'
    ],
    hrFocus: [
      'Googleyness: Intellectual humility, doing the right thing, navigating ambiguity',
      'Leadership without formal authority',
      'Comfort with failure and rapid post-mortems',
      'Collaborative peer feedback'
    ],
    cultureTips: 'Always think out loud. Clarify constraints before writing a single line. Defend time and space complexity mathematically.'
  },
  {
    id: 'amazon',
    name: 'Amazon',
    tier: 'Big Tech (FAANG/M)',
    description: 'Fiercely driven by 16 Leadership Principles (LPs). Every single technical and behavioral question is mapped to specific LPs.',
    technicalFocus: [
      'High-throughput service architecture & latency SLAs',
      'Object Oriented Design (OOD) & Design Patterns',
      'Data Structures & Algorithm optimization',
      'Operational excellence & distributed metrics'
    ],
    hrFocus: [
      'Customer Obsession & Working Backwards from customer pain',
      'Bias for Action vs Calculated Risk Taking',
      'Have Backbone; Disagree and Commit',
      'Ownership: Saying "I did" instead of "that was not my job"'
    ],
    cultureTips: 'Structure every behavioral answer strictly in STAR format with quantified metrics (percentages, dollar savings, time reduced).'
  }
];

export const CAREER_ROLES: RoleProfile[] = [
  {
    id: 'sde',
    title: 'Software Development Engineer (SDE / SWE)',
    experienceLevel: 'Fresher to Senior (SDE 1, SDE 2, Lead)',
    coreTechSkills: ['DSA', 'OOPs', 'DBMS', 'Operating Systems', 'System Design', 'REST APIs'],
    technicalTopics: [
      'Data Structures & Algorithms (Trees, Graphs, DP, Arrays)',
      'System Design (High-Level HLD & Low-Level LLD)',
      'Core CS (OS Processes/Threads, DBMS Indexing, Computer Networks)',
      'OOPs Principles (Polymorphism, Inheritance, Encapsulation, SOLID)',
      'Concurrency, Multithreading & Race Conditions'
    ],
    hrTopics: [
      'Past Project Ownership & Technical Challenges (STAR format)',
      'Handling disagreements with Tech Leads / Product Managers',
      'Production Outage Incident Response & Blameless Post-Mortems',
      'Handling tight sprint deadlines and scope creep',
      'Why this company & 3-5 Year Career Vision'
    ],
    defaultResumeContext: 'Built and scaled microservices in Java/Go processing 35k RPS with Redis caching and Kafka queue. Solved DB lock contention, reducing API latency from 450ms to 65ms.'
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst / BI Engineer',
    experienceLevel: 'Entry to Senior Data Analyst',
    coreTechSkills: ['SQL', 'Python/Pandas', 'Statistics & Probability', 'Data Modeling', 'Tableau/PowerBI', 'A/B Testing'],
    technicalTopics: [
      'Advanced SQL (Window Functions: DENSE_RANK, LEAD/LAG, CTEs, Self-Joins)',
      'Python Data Wrangling (Pandas, NumPy, Matplotlib)',
      'Statistical Analysis (Hypothesis Testing, p-values, Normal Distribution)',
      'Data Modeling & Data Warehousing (Star/Snowflake Schema, Fact vs Dim tables)',
      'Business Metrics & A/B Experimentation'
    ],
    hrTopics: [
      'Explaining complex analytical insights to non-technical stakeholders',
      'Handling contradictory or missing data in high-stakes decisions',
      'Prioritizing urgent ad-hoc queries vs long-term analytics pipelines',
      'Disagreeing with a stakeholder\'s gut feeling using data evidence',
      'Why you chose data analytics & business impact you delivered'
    ],
    defaultResumeContext: 'Analyzed customer churn across 2.4M user records using advanced SQL and Python. Created automated executive Tableau dashboards, uncovering drop-off points that boosted retention by 14%.'
  },
  {
    id: 'system-engineer',
    title: 'System Engineer',
    experienceLevel: 'Mid to Senior Infrastructure / Systems',
    coreTechSkills: ['Linux/Unix', 'Networking (TCP/IP, DNS, OSI)', 'Bash/Python Scripting', 'Virtualization/Cloud', 'Incident RCA'],
    technicalTopics: [
      'Linux System Administration (Process Management, Memory, systemd, top, ps)',
      'Computer Networking (OSI Model, TCP Handshake, DNS resolution, Subnetting, Firewalls)',
      'Shell / Bash Scripting & Automation',
      'Troubleshooting Production Outages (High CPU, Disk Full, Memory Leaks, Network Drops)',
      'Server Virtualization, Docker Containers, and CI/CD basics'
    ],
    hrTopics: [
      'Readiness for 24/7 on-call rotations and critical production support',
      'Handling high-severity P1 enterprise incidents calmly under pressure',
      'Managing client SLA commitments and post-incident communication',
      'Adapting to multi-vendor technology stacks (Linux, Windows Server, Cloud)',
      'Long-term engineering commitment and stability'
    ],
    defaultResumeContext: 'Managed fleet of 250+ Linux/RHEL production servers with 99.98% uptime. Automated server health monitoring and log rotation with Bash and Python, reducing manual ticket overhead by 40%.'
  },
  {
    id: 'junior-system-engineer',
    title: 'Junior System Engineer / Graduate Engineer Trainee',
    experienceLevel: 'Fresher / 0-2 Years Experience',
    coreTechSkills: ['Basic Linux Commands', 'OS Fundamentals', 'Networking Basics', 'Troubleshooting Logic', 'Customer Communication'],
    technicalTopics: [
      'Basic Linux Commands (chmod, chown, grep, awk, find, df, du, netstat)',
      'Networking Fundamentals (IP addressing, Subnet Mask, Gateway, Ping, Traceroute)',
      'Operating Systems Basics (Paging, Virtual Memory, Deadlocks, File Systems)',
      'Basic Database Operations (SELECT, UPDATE, INSERT, Joins)',
      'Hardware & Cloud Basics (VMs, Hypervisors, Storage Types)'
    ],
    hrTopics: [
      'Willingness to work in rotational shifts (including night shifts)',
      'Relocation readiness to company base locations',
      'Adaptability to be trained in new domains during initial probation',
      'Handling university academic pressure and collaborative teamwork',
      'Why you want to join our organization as a Graduate Trainee'
    ],
    defaultResumeContext: 'Completed Bachelor in CS/IT. Configured Linux Ubuntu VM labs, mastered Bash scripts for automated file backups, and set up Apache web server with MySQL backend.'
  }
];

export const PRESET_MICRO_DRILLS: MicroDrillItem[] = [
  {
    id: 'hr-tell-me-about-yourself',
    title: 'Master "Tell Me About Yourself" in 60s (HR Round)',
    category: 'HR & Culture',
    timeSeconds: 60,
    prompt: 'Deliver an executive 60-second pitch covering your background, core technical strengths, high-impact project win, and why you are excited for this specific company role.',
    whatToFocusOn: [
      'Present-Past-Future narrative structure',
      'Mention 1 specific technical metric win',
      'End with genuine enthusiasm for the specific company role'
    ],
    benchmarkModelAnswer: 'I am a Software Engineer specializing in high-throughput backend systems in Java and Go. Over the past two years, I led the redesign of our payment webhook pipeline, which processed 35k daily transactions and reduced failure retries by 42%. Prior to that, I graduated in Computer Science with a focus on distributed algorithms. I have followed your team\'s engineering blogs on fault-tolerant systems, and I am excited to apply my background in concurrency to help scale your core platform.'
  },
  {
    id: 'hr-why-our-company',
    title: 'Answering "Why Goldman Sachs / Microsoft / Infosys?" (60s)',
    category: 'HR & Culture',
    timeSeconds: 60,
    prompt: 'The interviewer asks: "Why do you want to join our company over other offers or opportunities in the market?" Deliver a tailored, non-generic response.',
    whatToFocusOn: [
      'Do not give generic praise like "you are a big reputed brand"',
      'Cite a specific company engineering initiative, culture pillar, or product scale',
      'Connect company mission directly to your personal career development'
    ],
    benchmarkModelAnswer: 'Three key pillars attract me: First is your unmatched technical scale—handling millions of real-time transactions with sub-millisecond reliability is where I want to build mastery. Second is your culture of engineering rigor; in financial engineering, correctness is absolute and non-negotiable. Third is the collaborative bar where junior engineers are empowered to own critical services. Joining your team represents the ideal convergence of technical challenge and long-term career growth.'
  },
  {
    id: 'data-analyst-sql-drill',
    title: 'Explain DENSE_RANK vs RANK in 45s (Data Analyst)',
    category: 'Core CS',
    timeSeconds: 45,
    prompt: 'The technical interviewer asks: "In SQL, what is the exact operational difference between RANK() and DENSE_RANK() when dealing with tied data?"',
    whatToFocusOn: [
      'Explain handling of duplicate/tied rows',
      'Specify gap creation in sequence',
      'Provide a simple numerical example (e.g. ties at rank 2)'
    ],
    benchmarkModelAnswer: 'Both assign sequential rankings partitioned by an order clause. The fundamental difference is how they handle ties: RANK() skips subsequent ranking numbers after duplicate values. For instance, if two salaries tie for 2nd place, RANK() outputs 1, 2, 2, 4—leaving a gap. In contrast, DENSE_RANK() never skips numbers; for the same tie, it outputs 1, 2, 2, 3. In financial analytics where we need consecutive tiers without index gaps, DENSE_RANK is preferred.'
  },
  {
    id: 'syseng-linux-troubleshoot',
    title: 'Diagnosing High CPU Load on Linux in 60s (System Engineer)',
    category: 'System Design',
    timeSeconds: 60,
    prompt: 'An alert triggers: A production Linux server is running at 100% CPU. Walk the interviewer through your step-by-step diagnostic workflow.',
    whatToFocusOn: [
      'Mention exact command sequence: top, htop, uptime',
      'Differentiate User CPU (us) vs System CPU (sy) vs I/O Wait (wa)',
      'Trace process threads with pidstat/ps and strace/lsof'
    ],
    benchmarkModelAnswer: 'First, I run `uptime` to check load averages over 1, 5, and 15 minutes, followed by `top` or `htop` to identify whether CPU saturation is driven by User space tasks (%us), Kernel system calls (%sy), or Disk I/O wait (%wa). If driven by a user process, I identify its PID, sort by `%CPU`, and run `pidstat -u -p <PID> 1` to inspect thread utilization. If the process is hanging, I attach `strace -p <PID>` to see active syscalls or inspect logs in `/var/log` before determining whether to gracefully reload or restart the service.'
  },
  {
    id: 'star-result-drill',
    title: 'Nail the STAR Result in 45 Seconds (SDE Technical)',
    category: 'Behavioral STAR',
    timeSeconds: 45,
    prompt: 'You just explained a challenging project where you migrated a legacy database. Now deliver the RESULT section: state the business impact with specific quantified metrics.',
    whatToFocusOn: [
      'State at least 2 concrete numbers (e.g. 65% latency reduction, $14k monthly savings)',
      'Highlight zero-downtime achievement',
      'End strongly without trailing off'
    ],
    benchmarkModelAnswer: 'The migration completed with zero customer downtime across 4 million active accounts. Post-launch, P99 query latency dropped from 820ms to 45ms—a 94% reduction—which decreased CPU utilization on our database cluster by 40% and saved the engineering org $18,000 monthly in AWS RDS compute.'
  }
];

export const EXISTING_SYSTEMS: ExistingSystem[] = [
  {
    name: 'Google Interview Warmup',
    category: 'Big Tech Free Tool',
    pricing: 'Free',
    whatTheyBuilt: [
      'Basic speech-to-text transcription in browser',
      'Pre-scripted 5 general questions per role',
      'Basic keyword spotter (highlights if you used job-related terms)'
    ],
    techStack: 'Web Speech API, Google Cloud Speech, Basic NLP parser',
    criticalFlaws: [
      'Zero conversational intelligence: cannot ask follow-up questions',
      'No evaluation of reasoning, trade-offs, or logic',
      'Does not verify if your answer was actually correct or complete BS',
      'Feels like talking to a dictation machine, not an interviewer'
    ],
    marketGapScore: 8.5
  },
  {
    name: 'Interviewing.io',
    category: 'Human Mock Platform',
    pricing: '$150 - $250+ per single 1-hour session',
    whatTheyBuilt: [
      'Anonymous audio + shared code editor with real FAANG engineers',
      'High-quality realistic human feedback',
      'Job board referral pipeline for top performers'
    ],
    techStack: 'WebRTC, Monolith backend, Collaborative Monaco editor',
    criticalFlaws: [
      'Prohibitively expensive for students ($1000+ for 4 mocks)',
      'Scheduling friction (must book days in advance)',
      'Human interviewer variance: some give rushed, subjective feedback',
      'No instant iterative practice or 2-minute micro-drills'
    ],
    marketGapScore: 7.0
  },
  {
    name: 'Yoodli / Poised',
    category: 'Speech & Soft Skills AI',
    pricing: '$12 - $20 / month',
    whatTheyBuilt: [
      'Speech rate (WPM), filler word detector (um, uh, like)',
      'Eye contact & facial expression analysis via webcam',
      'Summarizes speaking duration and pauses'
    ],
    techStack: 'Audio DSP, Computer Vision (MediaPipe), LLM summarizer',
    criticalFlaws: [
      'Zero technical or domain depth: cannot critique System Design or DSA',
      'Checks "how you speak", but does not know "what you should have said"',
      'Treats a technically brilliant answer as bad if you paused to think',
      'Does not follow STAR method or evaluate technical architecture'
    ],
    marketGapScore: 7.8
  },
  {
    name: 'Final Round AI (Interview Copilot)',
    category: 'Live Cheating Teleprompter',
    pricing: '$98 - $148 / month',
    whatTheyBuilt: [
      'Real-time audio listening during live zoom interviews',
      'Instant AI teleprompter showing answers to read aloud',
      'Resume auto-parser for quick answers'
    ],
    techStack: 'Whisper streaming, Fast LLM inference, Desktop overlay',
    criticalFlaws: [
      'High risk: candidate gets blacklisted if recruiter detects delay',
      'Candidate doesn\'t actually learn: fails on spot-probing follow-ups',
      'Banned by major enterprise recruitment platforms',
      'Solves the symptom (cheating), not the disease (lack of genuine mastery)'
    ],
    marketGapScore: 9.0
  },
  {
    name: 'Pramp / Exponent',
    category: 'Peer Mock & Courseware',
    pricing: 'Free (Peer) to $79/mo (Courses)',
    whatTheyBuilt: [
      'Match with random peer on internet to take turns interviewing',
      'Video lesson library of FAANG interview breakdowns',
      'Standardized rubrics for peers to grade each other'
    ],
    techStack: 'PeerJS, WebRTC, React, Video CMS',
    criticalFlaws: [
      'The "Blind leading the blind" problem: Peers are novices giving bad feedback',
      'High ghosting rate: peer doesn\'t show up or doesn\'t speak fluent English',
      'Passive video watching doesn\'t give muscle memory under pressure'
    ],
    marketGapScore: 7.5
  }
];

export const MISSING_FEATURE_GAPS: FeatureGap[] = [
  {
    title: 'Adaptive "Bar-Raiser" Probing (Dynamic Cross-Examination)',
    whyExistingFail: 'Existing AI coaches follow a scripted linear list of questions. If a candidate gives a shallow answer, the AI moves to the next topic.',
    whatUsersActuallyNeed: 'Real FAANG interviewers listen to your specific architecture or algorithm choice and drill down on edge cases: "Why MongoDB instead of Postgres?", "What happens if a shard fails during write?".',
    yourCompetitiveMoat: 'A multi-turn conversational agent with an adversarial Probing Bar-Raiser state machine that detects hand-waving and asks 2-3 deep contextual follow-ups before moving on.',
    impactLevel: 'Game Changer'
  },
  {
    title: 'Deep Resume & Project Grounding (No Generic Questions)',
    whyExistingFail: 'Almost every tool asks cookie-cutter questions like "Tell me about a difficult challenge".',
    whatUsersActuallyNeed: 'Interviewers always cross-examine the candidate\'s actual resume: "I see on your resume you built a microservice processing 50k RPS in Go. How did you handle cache invalidation between nodes?".',
    yourCompetitiveMoat: 'Extract candidate\'s GitHub commits, resume bullet points, and tech stack to generate hyper-personalized questions that feel 100% authentic to their actual career history.',
    impactLevel: 'Game Changer'
  },
  {
    title: 'Dual-Track Evaluation: STAR Behavioral + Technical Architecture Rubric',
    whyExistingFail: 'Tools either check soft skills (filler words) OR check LeetCode pass/fail. Nobody bridges technical trade-offs with communication agency.',
    whatUsersActuallyNeed: 'Candidates need to know if they demonstrated Agency (saying "I" instead of "we"), Quantified Impact ("reduced latency by 42%"), and Technical Rigor (CAP theorem, failure modes, concurrency).',
    yourCompetitiveMoat: 'A standardized FAANG Bar-Raiser Scorecard grading: (1) Ownership & Agency, (2) Quantified Business Result, (3) System Scalability & Bottlenecks, (4) Conciseness vs Rambling.',
    impactLevel: 'High'
  },
  {
    title: 'Instant 2-Minute "Micro-Drills" & Iterative Retry Loop',
    whyExistingFail: 'Current apps force you to do a painful 45-minute mock, then dump a 15-page report at the end that you never review. You repeat the exact same mistakes next time.',
    whatUsersActuallyNeed: 'Athletic coaching model: immediate repetition. If you rambled for 3 minutes on Question 2, the AI immediately says: "Let\'s re-record that 90-second answer right now. Keep your STAR Action to 45 seconds. Ready? Go."',
    yourCompetitiveMoat: 'Instant "Micro-Drill Studio" with side-by-side comparison against a FAANG Staff Engineer\'s benchmark model answer.',
    impactLevel: 'Game Changer'
  },
  {
    title: 'Interactive Whiteboard with Real-Time Architecture Co-Pilot',
    whyExistingFail: 'Tools are either text chat or basic LeetCode editors. System Design requires drawing blocks while verbally explaining trade-offs.',
    whatUsersActuallyNeed: 'A canvas where candidates drag-and-drop Load Balancers, Caches, Sharded DBs, Queues and explain traffic flow, while the AI analyzes the visual architecture graph.',
    yourCompetitiveMoat: 'Fullstack Interactive Visual Architecture Whiteboard with automated SPOF detection, bottleneck analysis, and scalability grading.',
    impactLevel: 'Game Changer'
  }
];
