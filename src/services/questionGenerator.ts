import type { InterviewQuestion, ParsedResume } from '../types/resume';

export function generateInterviewQuestions(parsed: ParsedResume): InterviewQuestion[] {
  const questions: InterviewQuestion[] = [];
  let idCount = 1;

  const makeId = () => `q-${idCount++}`;

  const skills = parsed.allSkills;

  // ==========================================
  // 1. PROJECT DEEP-DIVE QUESTIONS (10 Questions)
  // ==========================================
  questions.push({
    id: makeId(),
    question: "Walk through the most technically complex project listed on your resume: what was the high-level architecture, how did data flow between components, and what were the single points of failure?",
    answer: "A strong response follows a structured breakdown: \n1. Architecture Overview: State the core components (e.g. client app, API gateway, microservices, database cluster, caching layer, and message queues).\n2. Data Ingress & Flow: Trace a request from entry point through auth, validation, cache lookups, database writes, and asynchronous workers.\n3. Bottlenecks & SPOFs: Highlight where bottlenecks existed (e.g. database connection exhaustion, unindexed queries) and explain the redundancy mechanisms introduced (e.g. read replicas, circuit breakers, automated retry policies).",
    keyTalkingPoints: [
      "Describe architecture boundaries and data flow cleanly",
      "Identify Single Points of Failure (SPOFs) and how redundancy was engineered",
      "Explain fallback strategies (circuit breakers, dead-letter queues, exponential backoff)"
    ],
    category: "Project Deep-Dive",
    difficulty: "Medium",
    contextTag: "Project Architecture & Data Flow"
  });

  questions.push({
    id: makeId(),
    question: "Your resume highlights quantitative performance improvements (such as reduced latency or throughput gains). How did you measure baseline performance, what profiling tools did you utilize, and what trade-offs were made?",
    answer: "Model response structure:\n1. Baseline Measurement: Explain how you established pre-optimization benchmarks under realistic load (e.g. p95/p99 latency using k6, JMeter, or Apache Bench).\n2. Profiling & Diagnostics: Detail the tools used to pinpoint root causes (e.g. Chrome DevTools Performance Profiler for frontend, Node.js `--inspect` / flamegraphs, PostgreSQL `EXPLAIN ANALYZE` for sequential scans and unindexed joins, or APM tools like Datadog/New Relic).\n3. Implemented Fix: Specific code/architecture change (e.g. batching DB queries to solve N+1, introducing Redis cache-aside with TTL, query index optimization).\n4. Trade-offs: Mention trade-offs (e.g. increased memory usage for in-memory caching, eventual consistency challenges, cache invalidation complexity).",
    keyTalkingPoints: [
      "Quantify P95/P99 latency or RPS before vs after optimization",
      "Mention profiling tools (Flamegraphs, EXPLAIN ANALYZE, Datadog/k6)",
      "Explain specific architectural change (indexing, connection pooling, cache-aside)",
      "Discuss engineering trade-offs (memory overhead, cache invalidation, eventual consistency)"
    ],
    category: "Project Deep-Dive",
    difficulty: "Hard",
    contextTag: "Metrics & Performance Benchmarking"
  });

  questions.push({
    id: makeId(),
    question: "In your project architecture, how did you handle asynchronous task processing and ensure data consistency across distributed service boundaries?",
    answer: "Explain using a transactional outbox pattern or message broker queue (RabbitMQ/Kafka):\n1. Event Publishing: Write events to database outbox table within the same ACID transaction to ensure atomicity.\n2. Debezium / CDC or Poller: Dispatches events to the message broker asynchronously.\n3. Idempotent Consumer: Ensures workers can safely process duplicate messages by checking unique event IDs in Redis or database before execution.",
    keyTalkingPoints: [
      "Transactional Outbox Pattern guarantees atomicity between DB writes and event publishing",
      "Idempotency tokens prevent duplicate processing during network retries",
      "Dead-letter queues (DLQ) handle poison messages safely"
    ],
    category: "Project Deep-Dive",
    difficulty: "Hard",
    contextTag: "Async Tasks & Distributed Consistency"
  });

  questions.push({
    id: makeId(),
    question: "How did you manage database connection pooling and schema migrations in production without causing downtime or query lock contention?",
    answer: "Use dedicated connection poolers (e.g. HikariCP or PgBouncer) with tuned pool sizes based on CPU cores (`pool_size = (core_count * 2) + effective_spindle_count`). For zero-downtime migrations: 1) Expand and Contract pattern, 2) Add nullable columns or default values first, 3) Backfill data in small asynchronous batches, 4) Switch application reads/writes, 5) Clean up old columns in a subsequent release.",
    keyTalkingPoints: [
      "Tuned connection pool sizes prevent socket exhaustion",
      "Expand-Contract pattern for zero-downtime migrations",
      "Batch data backfills to avoid table-level locks"
    ],
    category: "Project Deep-Dive",
    difficulty: "Hard",
    contextTag: "Database Pooling & Zero-Downtime Migrations"
  });

  questions.push({
    id: makeId(),
    question: "What caching strategies (Cache-Aside, Write-Through, Write-Behind) did you implement in your projects, and how did you resolve cache stampede and stale data issues?",
    answer: "Most web APIs utilize Cache-Aside: 1) Query Redis; on miss, fetch from DB and populate cache with TTL. To prevent Cache Stampede (Thundering Herd when a hot key expires): 1) Implement distributed mutex locking (Redlock) so only one worker queries the DB, or 2) Probabilistic early expiration (XFetch algorithm) where keys are refreshed in background before TTL hits zero.",
    keyTalkingPoints: [
      "Cache-Aside pattern with deterministic TTLs",
      "Resolve Cache Stampede via Mutex locks or Probabilistic Early Expiration",
      "Cache Invalidation on DB write events"
    ],
    category: "Project Deep-Dive",
    difficulty: "Medium",
    contextTag: "Caching Strategies & Cache Stampede"
  });

  questions.push({
    id: makeId(),
    question: "How was authentication and authorization designed in your backend services, and how did you handle token expiration, revocation, and CSRF/XSS vectors?",
    answer: "Stateless authentication via JWT access tokens (short-lived, 15m) paired with httpOnly, SameSite=Strict cookies to eliminate XSS token theft. Store refresh tokens in Redis or DB allowing instant revocation on logout or suspicious IP changes. Role-Based Access Control (RBAC) enforced via declarative middleware guards at the API Gateway or controller level.",
    keyTalkingPoints: [
      "Short-lived JWT access tokens + HttpOnly SameSite cookies",
      "Opaque refresh tokens stored in Redis for instant revocation",
      "RBAC middleware guards enforcing least privilege"
    ],
    category: "Project Deep-Dive",
    difficulty: "Medium",
    contextTag: "Auth, JWT & Security Architecture"
  });

  questions.push({
    id: makeId(),
    question: "If your project experienced a sudden 10x surge in concurrent user traffic, what component would fail first, and what autoscaling/throttling measures did you have in place?",
    answer: "Identify the primary bottleneck: typically the primary database write connection limit. Mitigations: 1) Rate Limiting (Token Bucket algorithm via Redis) at API Gateway, 2) Horizontal Pod Autoscaling (HPA) for stateless containers, 3) Offloading read queries to Read Replicas, 4) Asynchronous queue buffering (Kafka/RabbitMQ) for write operations.",
    keyTalkingPoints: [
      "Identify DB connection exhaustion as standard primary bottleneck",
      "Token Bucket rate limiting at API gateway",
      "Read replicas and async queue buffering for high write loads"
    ],
    category: "Project Deep-Dive",
    difficulty: "Hard",
    contextTag: "Scaling Under Load & Bottleneck Analysis"
  });

  questions.push({
    id: makeId(),
    question: "What logging, metrics, and distributed tracing instrumentation did you configure to debug production exceptions in your project?",
    answer: "Structured JSON logging (correlation/trace IDs attached to each request header via middleware), exported to centralized aggregators (ELK, Datadog). Prometheus counters/gauges for latency histograms (p50, p95, p99) and error rates (RED method: Rate, Errors, Duration). Distributed tracing with OpenTelemetry/Jaeger to visualize spans across microservice boundaries.",
    keyTalkingPoints: [
      "Correlation / Trace IDs injected into all request spans",
      "RED method metrics: Rate, Errors, Duration",
      "OpenTelemetry tracing for end-to-end latency visualization"
    ],
    category: "Project Deep-Dive",
    difficulty: "Medium",
    contextTag: "Observability, Telemetry & Distributed Tracing"
  });

  questions.push({
    id: makeId(),
    question: "How did your project's CI/CD pipeline ensure that pull requests could be safely deployed to production with zero regressions?",
    answer: "Automated multi-stage GitHub Actions / GitLab CI pipeline: 1) Linting & static type checking (`tsc`, `eslint`), 2) Unit & Integration test suite with coverage thresholds, 3) Security vulnerability scanning (Snyk/SonarQube), 4) Automated container build & push to artifact registry, 5) Blue/Green or Canary deployment with automated health check rollback.",
    keyTalkingPoints: [
      "Automated linting, unit, and integration testing on PR commit",
      "Security scanning and container image artifact hashing",
      "Canary / Blue-Green deployments with automated health rollback"
    ],
    category: "Project Deep-Dive",
    difficulty: "Easy",
    contextTag: "CI/CD & Deployment Safety"
  });

  questions.push({
    id: makeId(),
    question: "How did you design API error handling and input validation in your services to guarantee consistent, safe responses to clients?",
    answer: "Centralized global exception handling middleware mapping domain exceptions to RFC 7807 Problem Details JSON format. Strict schema validation on all request bodies (e.g. Zod in TypeScript, Pydantic in Python, Hibernate Validator in Java) to sanitize and reject malformed inputs before reaching business logic.",
    keyTalkingPoints: [
      "Centralized error middleware returning RFC 7807 standard JSON",
      "Strict schema validation (Zod, Pydantic, Bean Validation)",
      "Sanitizing sensitive internal stack traces from client responses"
    ],
    category: "Project Deep-Dive",
    difficulty: "Easy",
    contextTag: "API Error Handling & Schema Validation"
  });

  // ==========================================
  // 2. TECH STACK QUESTIONS (12 Questions)
  // ==========================================
  questions.push({
    id: makeId(),
    question: "How does a Hash Table achieve average O(1) time complexity? Explain what happens during a Hash Collision and how Separate Chaining compares to Open Addressing.",
    answer: "A Hash Table computes an array index from a key using `index = hash(key) % capacity`. On collision: 1) Separate Chaining stores colliding entries in a linked list (or balanced Red-Black tree when size exceeds 8), 2) Open Addressing searches subsequent array slots using Linear/Quadratic probing. The table maintains O(1) by resizing and rehashing when the Load Factor (N/Capacity) exceeds 0.75.",
    keyTalkingPoints: [
      "Hash function maps keys to array indices in average O(1) time",
      "Separate Chaining vs Open Addressing collision resolution",
      "Load factor (0.75) triggers array resizing and rehashing"
    ],
    category: "Tech Stack",
    difficulty: "Medium",
    contextTag: "Data Structures: Hash Tables"
  });

  questions.push({
    id: makeId(),
    question: "Explain the four core pillars of Object-Oriented Programming (OOP) and how the SOLID design principles enforce scalable, maintainable software architecture.",
    answer: "4 Pillars: Encapsulation (data hiding), Abstraction (clean interfaces), Inheritance (code reuse), and Polymorphism (runtime dynamic dispatch). SOLID Principles: Single Responsibility (1 reason to change), Open/Closed (extend without modifying), Liskov Substitution (subtypes honor contracts), Interface Segregation (focused interfaces), Dependency Inversion (rely on abstractions).",
    keyTalkingPoints: [
      "Encapsulation, Abstraction, Inheritance, Polymorphism",
      "Single Responsibility & Open/Closed design patterns",
      "Dependency Inversion drives IoC containers and mock testing"
    ],
    category: "Tech Stack",
    difficulty: "Medium",
    contextTag: "OOP & SOLID Principles"
  });

  questions.push({
    id: makeId(),
    question: "Explain the fundamental differences between a Process and a Thread in terms of memory layout, context switching overhead, and IPC mechanisms.",
    answer: "A Process is an execution unit with its own private virtual memory address space. Threads exist within a process and share the heap, data, and code segments but have independent registers and stacks. Process context switching requires invalidating CPU caches (TLB) and switching page tables (expensive). Thread context switching inside the same process retains memory pages (fast).",
    keyTalkingPoints: [
      "Process has isolated virtual memory; threads share heap within same process",
      "Process context switch flushes TLB / page tables; thread switch is lightweight",
      "Process IPC requires OS mediation (pipes, sockets, shared memory)"
    ],
    category: "Tech Stack",
    difficulty: "Medium",
    contextTag: "Operating Systems: Processes & Threads"
  });

  questions.push({
    id: makeId(),
    question: "Explain the ACID properties in database transactions and how Isolation Levels (Read Uncommitted, Read Committed, Repeatable Read, Serializable) prevent Dirty, Non-Repeatable, and Phantom Reads.",
    answer: "ACID guarantees transactional integrity: Atomicity (WAL rollback), Consistency (valid state transitions), Isolation (concurrency control), Durability (fsync disk writes). Read Committed prevents Dirty Reads via query snapshots. Repeatable Read prevents Non-Repeatable Reads via transaction snapshots. Serializable prevents Phantom Reads through strict serialization or range locks.",
    keyTalkingPoints: [
      "ACID breakdown (Atomicity, Consistency, Isolation, Durability)",
      "Dirty Read vs Non-Repeatable Read vs Phantom Read",
      "Isolation spectrum trade-off between concurrency and consistency"
    ],
    category: "Tech Stack",
    difficulty: "Hard",
    contextTag: "DBMS: Transactions & Isolation Levels"
  });

  questions.push({
    id: makeId(),
    question: "How do Clustered Indexes differ from Non-Clustered (Secondary) Indexes in relational databases (PostgreSQL / MySQL), and why do B+ Trees dominate database index implementations?",
    answer: "A Clustered Index dictates the physical ordering of data rows on disk; table rows are stored directly in the leaf nodes of the B+ Tree (only 1 per table). A Non-Clustered Index stores sorted index keys with pointers (row IDs / primary keys) pointing to actual data pages. B+ Trees dominate because all data sits in linked leaf nodes, enabling fast O(log N) point lookups and sequential range scans.",
    keyTalkingPoints: [
      "Clustered index stores table data directly in leaf nodes (1 per table)",
      "Secondary index stores key + pointer to clustered index / heap",
      "B+ Tree linked leaf nodes enable high-speed range scans with low tree height"
    ],
    category: "Tech Stack",
    difficulty: "Hard",
    contextTag: "Database Indexing & B+ Trees"
  });

  questions.push({
    id: makeId(),
    question: "Trace the complete lifecycle of a URL request from the moment a user hits Enter in a browser to the page rendering on screen.",
    answer: "1. DNS Resolution (Browser cache -> OS cache -> Resolver -> Root/TLD/Authoritative). 2. TCP 3-Way Handshake (SYN -> SYN-ACK -> ACK). 3. TLS 1.3 Handshake (ClientHello, Key Exchange, Cipher Negotiation). 4. HTTP Request sent and processed by server. 5. Browser parses HTML/CSS to construct DOM & CSSOM, builds Render Tree, computes Layout, and Paints pixels.",
    keyTalkingPoints: [
      "DNS resolution hierarchy and caching",
      "TCP 3-way handshake & TLS 1.3 cryptographic key exchange",
      "Browser Critical Rendering Path: DOM -> CSSOM -> Render Tree -> Layout -> Paint"
    ],
    category: "Tech Stack",
    difficulty: "Medium",
    contextTag: "Computer Networks: URL Lifecycle"
  });

  questions.push({
    id: makeId(),
    question: "Explain the differences between TCP and UDP protocols and how HTTP/3 leverages QUIC over UDP to solve Head-of-Line (HoL) blocking.",
    answer: "TCP is connection-oriented, reliable, guarantees packet ordering, and implements flow/congestion control. UDP is connectionless, lightweight, and unordered. HTTP/2 multiplexed streams over a single TCP connection, but a single lost packet stalled all streams (TCP HoL blocking). HTTP/3 uses QUIC over UDP, enabling independent multiplexed streams where packet loss on one stream does not block others.",
    keyTalkingPoints: [
      "TCP (Reliable, ordered byte stream) vs UDP (Lightweight, datagrams)",
      "TCP Head-of-Line blocking in HTTP/2",
      "QUIC over UDP eliminates connection-level HoL blocking in HTTP/3"
    ],
    category: "Tech Stack",
    difficulty: "Hard",
    contextTag: "Networking: TCP, UDP & QUIC"
  });

  questions.push({
    id: makeId(),
    question: "Explain how SQL Window Functions (such as `DENSE_RANK()`, `ROW_NUMBER()`, and `LAG()`) differ from standard `GROUP BY` aggregations.",
    answer: "`GROUP BY` collapses multiple rows into a single summary row per group. Window functions (`OVER (PARTITION BY ... ORDER BY ...)`) compute aggregated or ranking calculations across a set of rows while preserving the individual identity of every row in the output dataset.",
    keyTalkingPoints: [
      "GROUP BY collapses rows; Window functions preserve all rows",
      "PARTITION BY divides data into subsets for ranking/running sums",
      "LEAD and LAG access adjacent row values without self-joins"
    ],
    category: "Tech Stack",
    difficulty: "Medium",
    contextTag: "SQL & Window Functions"
  });

  if (skills.some(s => /react|vue|angular|next/i.test(s))) {
    questions.push({
      id: makeId(),
      question: "In frontend architecture, how does the Virtual DOM diffing algorithm optimize UI rendering, and what are the rules of React Hooks?",
      answer: "The Virtual DOM diffs tree representations using an O(N) heuristic: comparing element types and unique `key` props on list items to minimize real DOM manipulations. Hooks rules: 1) Only call hooks at the top level of functional components (never in loops, conditions, or nested functions), 2) Only call hooks from React functions, ensuring stable internal hook linked-list indices.",
      keyTalkingPoints: [
        "Virtual DOM O(N) heuristic diffing algorithm and list keys",
        "React Fiber incremental unit of work scheduling",
        "Hooks rules maintain linked-list state ordering across renders"
      ],
      category: "Tech Stack",
      difficulty: "Medium",
      contextTag: "Frontend: Virtual DOM & Hooks"
    });
  }

  if (skills.some(s => /node|express|fastapi|django|spring/i.test(s))) {
    questions.push({
      id: makeId(),
      question: "How does the Node.js / asynchronous backend runtime manage non-blocking I/O via the Event Loop, and when does it offload work to worker threads?",
      answer: "Node.js runs single-threaded JavaScript on Google V8 and utilizes Libuv for non-blocking asynchronous I/O via epoll/kqueue. When handling CPU-intensive operations (cryptography, image compression, heavy math), it offloads to the Libuv thread pool (default 4 threads) or dedicated `worker_threads` to avoid blocking the main event loop.",
      keyTalkingPoints: [
        "V8 single-threaded execution + Libuv async event loop",
        "Microtask queue (Promises) drained before Macrotask queue",
        "Worker threads and Libuv thread pool for CPU-bound tasks"
      ],
      category: "Tech Stack",
      difficulty: "Medium",
      contextTag: "Backend: Event Loop & Concurrency"
    });
  }

  questions.push({
    id: makeId(),
    question: "What is the difference between Optimistic Locking and Pessimistic Locking in concurrent database transactions?",
    answer: "Pessimistic Locking assumes conflicts will happen and locks rows immediately (`SELECT ... FOR UPDATE`), blocking other transactions until commit. Optimistic Locking assumes conflicts are rare; it reads data with a version number/timestamp and validates that the version has not changed upon writing (`UPDATE ... WHERE version = old_version`). If changed, the transaction aborts and retries.",
    keyTalkingPoints: [
      "Pessimistic locking uses database row locks (high contention overhead)",
      "Optimistic locking uses version columns and validates at commit time",
      "Choose optimistic for high-read low-write; pessimistic for high contention"
    ],
    category: "Tech Stack",
    difficulty: "Medium",
    contextTag: "DBMS: Concurrency & Locking"
  });

  questions.push({
    id: makeId(),
    question: "How do Binary Search Trees (BST), AVL Trees, and Red-Black Trees differ in terms of self-balancing mechanics and lookup guarantees?",
    answer: "Standard BST has O(N) worst-case height when elements are inserted sorted. AVL Trees enforce strict balancing (height difference <= 1), providing faster O(log N) lookups but requiring more frequent rotations on insert/delete. Red-Black Trees enforce looser balancing using color properties (black height rule), requiring fewer rotations on write-heavy workloads (used in `std::map`, Java `TreeMap`).",
    keyTalkingPoints: [
      "Standard BST degenerates to linked list O(N) if unbalanced",
      "AVL trees strictly balanced (ideal for lookup-intensive workloads)",
      "Red-Black trees have lower rotation overhead on insertions/deletions"
    ],
    category: "Tech Stack",
    difficulty: "Medium",
    contextTag: "Data Structures: Self-Balancing Trees"
  });

  // ==========================================
  // 3. BEHAVIORAL QUESTIONS (5 Questions)
  // ==========================================
  questions.push({
    id: makeId(),
    question: "Describe a situation where product requirements changed midway through an active sprint or release. How did you realign engineering priorities and manage stakeholder expectations?",
    answer: "Use the STAR framework (Situation, Task, Action, Result):\n- Situation: Describe the original sprint deliverable and the sudden business pivot or customer requirement shift.\n- Task: Assess the technical delta, dependency impacts, and timeline risk.\n- Action: Conduct an impact assessment with the team, break down the new scope into MVP must-haves versus nice-to-haves, communicate transparent trade-offs to product management (e.g. 'We can ship Scope A on time if we defer Scope B to sprint 2'), and update sprint tickets.\n- Result: Successfully launched the revised MVP on schedule with zero high-severity production defects.",
    keyTalkingPoints: [
      "Use structured STAR method (Situation, Task, Action, Result)",
      "Proactively quantify timeline and architectural impact",
      "Collaborate transparently on MVP scoping and trade-offs",
      "Deliver positive business outcome with maintained team velocity"
    ],
    category: "Behavioral",
    difficulty: "Easy",
    contextTag: "Adaptability & Delivery"
  });

  questions.push({
    id: makeId(),
    question: "Tell me about a time you had a technical disagreement with a team member or architect regarding system design or technology choice. How was it resolved?",
    answer: "Use STAR structure: Explain the technical dilemma (e.g. choosing between REST vs GraphQL, or SQL vs Document DB). Emphasize how you gathered objective data, created a proof of concept (POC), evaluated latency and maintainability metrics, held an architectural review, and committed wholeheartedly to the team's consensus decision.",
    keyTalkingPoints: [
      "Focus on objective data, benchmarks, and POCs rather than personal preference",
      "Emphasize constructive collaboration and disagree-and-commit mindset",
      "Achieve successful project milestone on time"
    ],
    category: "Behavioral",
    difficulty: "Medium",
    contextTag: "Conflict Resolution & Collaboration"
  });

  questions.push({
    id: makeId(),
    question: "Describe a high-severity production outage or critical bug you experienced. How did you diagnose the root cause, mitigate the immediate customer impact, and prevent recurrence?",
    answer: "STAR method: 1) Incident Response: Rolled back release / engaged circuit breaker to restore customer uptime, 2) Root Cause Analysis: Analyzed APM metrics, query logs, and thread dumps to isolate memory leak / unindexed lock contention, 3) Postmortem: Wrote blameless postmortem, added regression test, automated alert thresholds, and fixed the bug permanently.",
    keyTalkingPoints: [
      "Prioritize customer uptime mitigation before deep root-cause debugging",
      "Conduct blameless postmortem identifying systemic safeguards",
      "Implement automated alerting and regression tests"
    ],
    category: "Behavioral",
    difficulty: "Medium",
    contextTag: "Incident Response & Postmortems"
  });

  questions.push({
    id: makeId(),
    question: "How do you balance shipping fast product features against managing and paying down architectural technical debt?",
    answer: "Advocate for dedicated technical debt allocation (e.g. 15-20% of sprint capacity). Quantify the cost of debt (e.g. developer velocity slowdown, flakiness, outage risk) to business stakeholders. Break large refactors into incremental, test-backed PRs rather than risky multi-month rewrites.",
    keyTalkingPoints: [
      "Dedicate continuous 15-20% sprint capacity for technical maintenance",
      "Translate tech debt into business metrics (velocity, reliability, AWS costs)",
      "Refactor incrementally with comprehensive test coverage"
    ],
    category: "Behavioral",
    difficulty: "Easy",
    contextTag: "Tech Debt & Engineering Balance"
  });

  questions.push({
    id: makeId(),
    question: "Tell me about a time you mentored a junior engineer or championed a technical best practice across your engineering team.",
    answer: "Describe initiating code review guidelines, pair programming on complex concurrency bugs, hosting lunch-and-learn tech talks, or establishing standardized TypeScript/testing patterns that elevated team code quality and reduced onboarding ramp-up time.",
    keyTalkingPoints: [
      "Provide constructive, educational code reviews",
      "Empower junior developers through pair programming",
      "Standardize engineering best practices across the team"
    ],
    category: "Behavioral",
    difficulty: "Easy",
    contextTag: "Mentorship & Engineering Culture"
  });

  // ==========================================
  // 4. RESUME DEEP-DIVE QUESTIONS (4 Questions)
  // ==========================================
  questions.push({
    id: makeId(),
    question: "Looking at your career progression and skills on your resume, what has been your most impactful engineering contribution, and what technical area are you looking to deepen next?",
    answer: "Structure response into: 1) Key Contribution: Highlight a core project where your technical design or optimization drove measurable business value, 2) Growth Trajectory: Explain what technical challenges you learned from it, 3) Future Focus: Express enthusiasm for scaling systems, cloud architecture, or domain-specific deep learning in the target role.",
    keyTalkingPoints: [
      "Connect past engineering impact with future technical trajectory",
      "Demonstrate continuous learning and passion for high-scale systems",
      "Align personal engineering goals with company needs"
    ],
    category: "Resume Deep-Dive",
    difficulty: "Easy",
    contextTag: "Career Progression & Impact"
  });

  questions.push({
    id: makeId(),
    question: "What engineering values and design philosophies guide how you write production code and review pull requests?",
    answer: "Prioritize code readability, simplicity (KISS/YAGNI), strong type safety, automated test coverage, and defensive programming. Treat code reviews as opportunities for shared knowledge and maintaining architecture consistency.",
    keyTalkingPoints: [
      "Simplicity and readability over clever, unmaintainable code",
      "Comprehensive automated test coverage and type safety",
      "Empathetic, constructive peer code reviews"
    ],
    category: "Resume Deep-Dive",
    difficulty: "Easy",
    contextTag: "Engineering Philosophy & Code Standards"
  });

  questions.push({
    id: makeId(),
    question: "If you could re-architect any past project listed on your resume from scratch with the knowledge you have today, what would you do differently?",
    answer: "Reflect on design evolution: e.g. starting with a modular monolith before prematurely splitting into microservices, choosing an explicit schema (PostgreSQL) instead of unindexed document stores, or investing earlier in end-to-end integration tests and telemetry.",
    keyTalkingPoints: [
      "Demonstrate technical maturity and self-reflection",
      "Avoid premature microservice / distributed system complexity",
      "Invest early in testing, telemetry, and proper data modeling"
    ],
    category: "Resume Deep-Dive",
    difficulty: "Medium",
    contextTag: "Architectural Retrospective & Growth"
  });

  questions.push({
    id: makeId(),
    question: "How do you stay up to date with emerging technologies, languages, and distributed systems best practices in a rapidly changing industry?",
    answer: "Active engagement with engineering RFCs, reading tech company engineering blogs (Netflix TechBlog, Uber Engineering, Meta Engineering), contributing to open source, building proof-of-concept side projects, and reading distributed systems papers.",
    keyTalkingPoints: [
      "Read industry engineering blogs and architecture RFCs",
      "Build practical POCs to evaluate new frameworks hands-on",
      "Continuous learning in distributed systems and systems design"
    ],
    category: "Resume Deep-Dive",
    difficulty: "Easy",
    contextTag: "Continuous Learning & Industry Trends"
  });

  return questions;
}
