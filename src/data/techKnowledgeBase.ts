export interface TechDetail {
  name: string;
  category: string;
  whatIsIt: string;
  whyUsed: string;
  advantages: string[];
  importantDetails: {
    title: string;
    description: string;
  }[];
  interviewQuestion?: {
    question: string;
    answerSummary: string;
  };
}

export const TECH_KNOWLEDGE_BASE: Record<string, TechDetail> = {
  // ==========================================
  // PROGRAMMING LANGUAGES
  // ==========================================
  'java': {
    name: 'Java',
    category: 'Programming Language',
    whatIsIt: 'A high-level, class-based, object-oriented programming language designed for platform independence (WORA: "Write Once, Run Anywhere").',
    whyUsed: 'Widely used for enterprise backend systems, financial transaction platforms, Android apps, and big data infrastructure (Hadoop, Spark).',
    advantages: [
      'Platform Independence via bytecode and the Java Virtual Machine (JVM)',
      'Robust memory management with automated Garbage Collection (G1, ZGC, Shenandoah)',
      'Strong type safety, extensive standard library, and massive open-source ecosystem',
      'High-performance multithreading and concurrency utilities (java.util.concurrent)'
    ],
    importantDetails: [
      {
        title: 'JVM Architecture & JIT Compiler',
        description: 'Java bytecode (.class) is executed by the JVM using HotSpot JIT compilers (C1/C2) to optimize hot code paths directly into native CPU machine code.'
      },
      {
        title: 'Garbage Collection (GC)',
        description: 'Manages heap memory across generations (Young/Eden, Survivor, Old/Tenured). Collectors like G1GC and ZGC minimize stop-the-world pauses.'
      },
      {
        title: 'Memory Model (JMM)',
        description: 'Enforces happens-before relationships using volatile variables, synchronized blocks, and atomic primitives (AtomicInteger).'
      }
    ],
    interviewQuestion: {
      question: 'How does the JVM JIT compiler optimize code execution at runtime?',
      answerSummary: 'JIT identifies hot execution loops, inlines methods, eliminates dead code, performs escape analysis, and compiles bytecode directly to native CPU instructions.'
    }
  },

  'python': {
    name: 'Python',
    category: 'Programming Language',
    whatIsIt: 'An interpreted, high-level, dynamically-typed programming language emphasizing code readability and developer velocity.',
    whyUsed: 'The premier language for Data Science, Machine Learning / AI (PyTorch, TensorFlow), backend APIs (FastAPI, Django), and automation.',
    advantages: [
      'Clean, concise syntax that accelerates prototyping and development speed',
      'Unmatched ecosystem for AI/ML, data analytics, and mathematical computing',
      'Extensive standard library and rich package ecosystem via PyPI',
      'Cross-platform versatility with massive community adoption'
    ],
    importantDetails: [
      {
        title: 'Global Interpreter Lock (GIL)',
        description: 'A mutex in CPython that prevents multiple native threads from executing Python bytecode simultaneously; CPU-bound tasks use multiprocessing.'
      },
      {
        title: 'Memory Management & Ref Counting',
        description: 'Uses reference counting supplemented by a cyclic garbage collector to detect and reclaim isolated circular reference graphs.'
      },
      {
        title: 'Asyncio & Coroutines',
        description: 'Provides cooperative multitasking using async/await syntax to handle thousands of concurrent I/O-bound connections on a single thread.'
      }
    ],
    interviewQuestion: {
      question: 'What is the Global Interpreter Lock (GIL) and how do you bypass it for CPU-heavy tasks?',
      answerSummary: 'The GIL allows only one thread to execute Python bytecode at a time. Bypass it using the `multiprocessing` module, C-extensions (NumPy), or alternative runtimes.'
    }
  },

  'javascript': {
    name: 'JavaScript',
    category: 'Programming Language',
    whatIsIt: 'A high-level, interpreted, just-in-time compiled language with first-class functions conforming to the ECMAScript standard.',
    whyUsed: 'The foundational language of the web, powering dynamic browser frontends and scalable backend servers (Node.js, Deno, Bun).',
    advantages: [
      'Universal runtime: runs natively in all browsers and on the server via Node.js/V8',
      'Non-blocking asynchronous I/O via the single-threaded Event Loop',
      'Massive package ecosystem (npm) with millions of reusable libraries',
      'Rich support for functional and object-oriented programming paradigms'
    ],
    importantDetails: [
      {
        title: 'V8 Engine & Event Loop',
        description: 'V8 executes JS on a single main thread. Asynchronous tasks (Microtasks: Promises, queueMicrotask; Macrotasks: setTimeout, I/O) are scheduled via the Event Loop.'
      },
      {
        title: 'Prototypes & Closures',
        description: 'Inheritance is prototype-based. Closures allow inner functions to retain access to variables from their lexical enclosing scope even after the outer function returns.'
      }
    ],
    interviewQuestion: {
      question: 'Explain the difference between Microtasks and Macrotasks in the JavaScript Event Loop.',
      answerSummary: 'Microtasks (Promises, process.nextTick) have higher priority and are completely drained after each execution frame before the next Macrotask (setTimeout, I/O) is processed.'
    }
  },

  'typescript': {
    name: 'TypeScript',
    category: 'Programming Language',
    whatIsIt: 'A strongly typed superset of JavaScript developed by Microsoft that transpiles down to clean, standard JavaScript.',
    whyUsed: 'Used to build large-scale enterprise web applications with static type safety, intelligent autocompletion, and compile-time error detection.',
    advantages: [
      'Eliminates runtime type errors during compilation',
      'Supercharged developer experience with intelligent IDE autocomplete and refactoring',
      'Rich type system: Generics, Union/Intersection types, Mapped types, and Discriminated Unions',
      'Seamless interoperability with existing JavaScript libraries and frameworks'
    ],
    importantDetails: [
      {
        title: 'Type Erasure at Compilation',
        description: 'TypeScript types exist only at compile time; the `tsc` compiler strips all type annotations, leaving clean standard JavaScript with zero runtime overhead.'
      },
      {
        title: 'Structural Type System (Duck Typing)',
        description: 'Type compatibility is based on the shape and structure of data rather than explicit nominal declarations.'
      }
    ],
    interviewQuestion: {
      question: 'What is the difference between `interface` and `type` alias in TypeScript?',
      answerSummary: 'Interfaces are extendable and support declaration merging (ideal for object shapes and public APIs). Types are more versatile, supporting unions, intersections, and primitives.'
    }
  },

  'c++': {
    name: 'C++',
    category: 'Programming Language',
    whatIsIt: 'A high-performance, statically typed, compiled general-purpose programming language with low-level memory manipulation and object-oriented features.',
    whyUsed: 'Game engines, operating systems, embedded systems, high-frequency trading (HFT), and performance-critical infrastructure.',
    advantages: [
      'Near-hardware execution speed with zero-cost abstractions',
      'Deterministic manual memory control with RAII and smart pointers',
      'Rich generic programming with compile-time Templates',
      'Direct hardware and OS API access'
    ],
    importantDetails: [
      {
        title: 'RAII & Smart Pointers',
        description: 'Resource Acquisition Is Initialization ties resource lifecycles to object scope. Smart pointers (`std::unique_ptr`, `std::shared_ptr`) prevent memory leaks without GC overhead.'
      },
      {
        title: 'Virtual Tables (vtables)',
        description: 'Dynamic polymorphism is implemented using vtables and vpointers, incurring a single pointer indirection cost during virtual method dispatch.'
      }
    ],
    interviewQuestion: {
      question: 'How does RAII prevent resource and memory leaks in C++?',
      answerSummary: 'RAII binds resource allocation to constructor execution and deallocation to destructor execution, ensuring automatic cleanup when an object goes out of scope.'
    }
  },

  'c#': {
    name: 'C# (.NET)',
    category: 'Programming Language',
    whatIsIt: 'A modern, object-oriented, type-safe programming language developed by Microsoft as the flagship language of the .NET platform.',
    whyUsed: 'Enterprise backend APIs (ASP.NET Core), cross-platform cloud services, desktop apps, and game development via Unity.',
    advantages: [
      'High-performance cross-platform .NET runtime with JIT/AOT compilation',
      'Strong type safety, LINQ (Language Integrated Query), and async/await primitives',
      'Robust Garbage Collection with generational heap management',
      'Rich enterprise tooling and active cloud ecosystem'
    ],
    importantDetails: [
      {
        title: 'Common Language Runtime (CLR)',
        description: 'Compiles C# into Common Intermediate Language (CIL) bytecode, which the CLR executes with JIT compilation, memory management, and exception handling.'
      }
    ]
  },

  'c': {
    name: 'C Language',
    category: 'Programming Language',
    whatIsIt: 'A foundational, procedural, low-level compiled programming language with direct memory access via pointers.',
    whyUsed: 'Operating system kernels (Linux kernel), embedded microcontrollers, device drivers, and real-time systems.',
    advantages: [
      'Unrivaled bare-metal execution speed and minimal memory footprint',
      'Direct hardware register and memory pointer manipulation',
      'Extremely portable across virtually all CPU architectures',
      'The foundational basis of modern computing systems and language runtimes'
    ],
    importantDetails: [
      {
        title: 'Manual Memory Allocation',
        description: 'Requires explicit allocation and deallocation (`malloc`, `calloc`, `free`) with careful management of pointers, buffer boundaries, and stack/heap memory.'
      }
    ]
  },

  'go': {
    name: 'Go (Golang)',
    category: 'Programming Language',
    whatIsIt: 'A statically typed, compiled programming language designed at Google by Robert Griesemer, Rob Pike, and Ken Thompson for simplicity and concurrency.',
    whyUsed: 'Cloud-native infrastructure (Kubernetes, Docker, Terraform), microservices, high-throughput network APIs, and distributed systems.',
    advantages: [
      'Lightweight Goroutines (starting at ~2KB memory vs 1-2MB OS threads)',
      'Built-in CSP concurrency model with Channels (`chan`)',
      'Fast compilation to standalone static binaries with zero external runtime dependencies',
      'Simple, minimalist language design with no class inheritance complexity'
    ],
    importantDetails: [
      {
        title: 'Go Runtime & GMP Scheduler',
        description: 'The Go runtime multiplexes M goroutines onto N OS threads using a Work-Stealing scheduler (GMP Model: Goroutines, Logical Processors, Machine OS threads).'
      },
      {
        title: 'Garbage Collector',
        description: 'A concurrent tri-color mark-and-sweep garbage collector optimized for sub-millisecond stop-the-world latency.'
      }
    ],
    interviewQuestion: {
      question: 'Explain the GMP concurrency scheduler model in Go.',
      answerSummary: 'G = Goroutine, M = OS Thread, P = Logical Processor. Each P has a local run queue. Threads (M) steal work from other processors when their local queue is empty.'
    }
  },

  'rust': {
    name: 'Rust',
    category: 'Programming Language',
    whatIsIt: 'A systems programming language focused on safety, speed, and concurrency without a garbage collector.',
    whyUsed: 'Systems programming, high-performance web servers, WebAssembly, blockchain, and security-critical software.',
    advantages: [
      'Guaranteed memory safety at compile time without a Garbage Collector',
      'Ownership and Borrowing rules eliminate data races and null pointer dereferences',
      'Zero-cost abstractions matching C/C++ bare-metal performance',
      'Modern package manager (Cargo) and rich type system with algebraic types'
    ],
    importantDetails: [
      {
        title: 'Ownership & Borrow Checker',
        description: 'Each value has a single owner. You can have either one mutable reference (`&mut T`) OR any number of immutable references (`&T`), checked entirely at compile time.'
      }
    ]
  },

  'php': {
    name: 'PHP',
    category: 'Programming Language',
    whatIsIt: 'A widely-used open source general-purpose scripting language especially suited for web development and backend APIs.',
    whyUsed: 'Powering web backends, content management systems (WordPress, Drupal), and modern frameworks (Laravel, Symfony).',
    advantages: [
      'Native web integration and massive deployment footprint',
      'Modern PHP 8+ features: JIT compilation, strong typing, attributes, and match expressions',
      'Rich ecosystem via Composer package manager and Laravel framework'
    ],
    importantDetails: [
      {
        title: 'Zend Engine & OPcache',
        description: 'Executes PHP scripts via Zend Engine bytecode compilation. OPcache stores precompiled script bytecode in shared memory, eliminating recompilation overhead.'
      }
    ]
  },

  'ruby': {
    name: 'Ruby',
    category: 'Programming Language',
    whatIsIt: 'A dynamic, open source, purely object-oriented programming language with a focus on simplicity and developer happiness.',
    whyUsed: 'Full-stack web application development via Ruby on Rails, scripting, and automation.',
    advantages: [
      'Everything is an object, providing elegant and expressive syntax',
      'Convention over Configuration philosophy via Ruby on Rails accelerating MVP delivery',
      'Vibrant open-source gem ecosystem'
    ],
    importantDetails: [
      {
        title: 'YJIT Compiler',
        description: 'A Just-In-Time compiler built inside CRuby that optimizes execution of web application benchmarks.'
      }
    ]
  },

  'kotlin': {
    name: 'Kotlin',
    category: 'Programming Language',
    whatIsIt: 'A modern, cross-platform, statically typed programming language developed by JetBrains, running on the JVM with 100% Java interoperability.',
    whyUsed: 'The official preferred language for Android app development (Jetpack Compose) and modern JVM backends (Ktor, Spring Boot).',
    advantages: [
      'Built-in Null Safety (`?` operator) eliminating NullPointerExceptions',
      'Coroutines for lightweight, structured asynchronous programming',
      '100% seamless two-way interoperability with existing Java codebases',
      'Concise syntax with data classes, smart casts, and extension functions'
    ],
    importantDetails: [
      {
        title: 'Coroutines & Structured Concurrency',
        description: 'Executes non-blocking asynchronous code sequentially without callback hell, managing coroutine lifecycles via CoroutineScope.'
      }
    ]
  },

  'swift': {
    name: 'Swift',
    category: 'Programming Language',
    whatIsIt: 'A powerful, intuitive, fast compiled programming language developed by Apple for iOS, macOS, watchOS, and visionOS apps.',
    whyUsed: 'Native iOS/macOS mobile applications using SwiftUI and UIKit.',
    advantages: [
      'High-performance compiled native binary execution using LLVM',
      'Modern safety features: optionals, type inference, and value types (structs)',
      'Declarative UI development with SwiftUI',
      'Automatic Reference Counting (ARC) for deterministic memory management'
    ],
    importantDetails: [
      {
        title: 'Automatic Reference Counting (ARC)',
        description: 'Tracks and manages app memory usage at compile time, inserting retain and release calls to free objects when reference count drops to zero.'
      }
    ]
  },

  'sql': {
    name: 'SQL (Structured Query Language)',
    category: 'Database Query Language',
    whatIsIt: 'The domain-specific ANSI/ISO standard language used for managing, querying, and manipulating data stored in relational database management systems.',
    whyUsed: 'Querying, updating, and maintaining relational databases (PostgreSQL, MySQL, Oracle, SQL Server, SQLite, Snowflake).',
    advantages: [
      'Declarative syntax: specify WHAT data you want, allowing the query optimizer to determine HOW to retrieve it',
      'Powerful data aggregation, filtering, joins, and window analytics (`OVER PARTITION BY`)',
      'Universal standard supported across all relational data systems',
      'ACID transaction control commands (`COMMIT`, `ROLLBACK`)'
    ],
    importantDetails: [
      {
        title: 'Query Optimization & EXPLAIN',
        description: 'The query planner analyzes table statistics, index cardinality, and join order to generate the lowest-cost execution plan (Index Scan vs Sequential Scan).'
      }
    ]
  },

  // ==========================================
  // FRONTEND FRAMEWORKS & TECHNOLOGIES
  // ==========================================
  'react': {
    name: 'React.js',
    category: 'Frontend Framework / Library',
    whatIsIt: 'A declarative, component-based JavaScript library developed by Meta for building dynamic user interfaces.',
    whyUsed: 'Building single-page applications (SPAs), complex interactive web dashboards, and mobile apps via React Native.',
    advantages: [
      'Component-Based Architecture promoting code modularity, reusability, and clean isolation',
      'Virtual DOM and Fiber Reconciler minimizing expensive direct DOM mutations',
      'Unidirectional Data Flow making state mutations predictable and easy to debug',
      'Vast ecosystem of routing (React Router), state managers (Redux, Zustand), and SSR frameworks (Next.js)'
    ],
    importantDetails: [
      {
        title: 'Virtual DOM & Diffing Algorithm',
        description: 'React maintains a virtual representation of the UI in memory. When state changes, it diffs the new tree using an O(N) heuristic algorithm and batches minimal DOM updates.'
      },
      {
        title: 'React Fiber Architecture',
        description: 'Fiber enables incremental rendering: breaking work into units of work that can be paused, prioritized, or aborted to keep UI responsive.'
      },
      {
        title: 'Hooks Lifecycle & Rules',
        description: '`useState`, `useEffect`, `useCallback`, and `useMemo` provide state and lifecycle features to functional components based on stable hook linked-list ordering.'
      }
    ],
    interviewQuestion: {
      question: 'How does React Fiber enable Concurrent Mode and smooth UI rendering?',
      answerSummary: 'Fiber breaks rendering work into small units and yields control back to the browser main thread between chunks, preventing UI freezing during heavy updates.'
    }
  },

  'next.js': {
    name: 'Next.js',
    category: 'Full-Stack React Framework',
    whatIsIt: 'A production-grade React framework created by Vercel that enables Server-Side Rendering (SSR), Static Site Generation (SSG), and React Server Components (RSC).',
    whyUsed: 'Building fast, SEO-friendly, scalable web applications with automated routing, image optimization, and serverless API endpoints.',
    advantages: [
      'Hybrid rendering models: Server-Side Rendering (SSR), Static Generation (SSG), and Incremental Static Regeneration (ISR)',
      'React Server Components (RSC) reducing client bundle sizes by executing logic on the server',
      'Built-in file-system routing (App Router), API routes, and automated code splitting',
      'Optimal SEO performance with fast First Contentful Paint (FCP) and Time to Interactive (TTI)'
    ],
    importantDetails: [
      {
        title: 'App Router & Server Components',
        description: 'Components are Server Components by default, fetching data directly on the server without sending JS bundles to the client unless marked with `"use client"`.'
      }
    ]
  },

  'vue.js': {
    name: 'Vue.js',
    category: 'Frontend Framework',
    whatIsIt: 'A progressive, incrementally adoptable JavaScript framework for building user interfaces, developed by Evan You.',
    whyUsed: 'Building intuitive single-page applications with clean separation of template, script, and style.',
    advantages: [
      'Reactivity system powered by ES6 Proxies with fine-grained dependency tracking',
      'Single-File Components (.vue) bundling HTML, TypeScript/JS, and scoped CSS together',
      'Gentle learning curve with high runtime performance and small bundle size',
      'Official cohesive ecosystem: Pinia (state), Vue Router, and Nuxt.js (SSR)'
    ],
    importantDetails: [
      {
        title: 'Proxy-Based Reactivity',
        description: 'Vue 3 wraps state in ES6 Proxies. Accessing a property tracks it as a dependency; mutating it automatically triggers re-render of only the affected DOM nodes.'
      }
    ]
  },

  'angular': {
    name: 'Angular',
    category: 'Frontend Enterprise Framework',
    whatIsIt: 'A comprehensive, TypeScript-based web application framework developed by Google for building scalable enterprise applications.',
    whyUsed: 'Large-scale enterprise applications requiring standardized architectural patterns, two-way data binding, and comprehensive built-in tooling.',
    advantages: [
      'Full-featured battery-included framework: Routing, Forms, HTTP Client, and Dependency Injection',
      'Strict TypeScript enforcement and modular architecture',
      'Modern Signals reactivity model providing fine-grained change detection with zone-less rendering',
      'Powerful CLI for scaffolding, testing, and optimization'
    ],
    importantDetails: [
      {
        title: 'Dependency Injection (DI)',
        description: 'A hierarchical injector system that instantiates and supplies service dependencies across components and modules.'
      }
    ]
  },

  'svelte': {
    name: 'Svelte / SvelteKit',
    category: 'Frontend Framework & Compiler',
    whatIsIt: 'A radical new approach to building user interfaces: compiles declarative code into tiny, surgical vanilla JavaScript at build time with NO virtual DOM.',
    whyUsed: 'Ultra-fast web applications, interactive dashboards, and lightweight embedded widgets.',
    advantages: [
      'No Virtual DOM runtime overhead: updates the DOM surgically when state changes',
      'Truly reactive assignments with minimal boilerplate',
      'Extremely small bundle sizes and rapid load times',
      'SvelteKit provides full-stack routing, SSR, and API endpoints'
    ],
    importantDetails: [
      {
        title: 'Compile-Time Architecture',
        description: 'Unlike React/Vue that ship a runtime to the browser, Svelte runs as a compiler during build time, turning components into efficient imperative code.'
      }
    ]
  },

  'tailwind css': {
    name: 'Tailwind CSS',
    category: 'CSS Framework',
    whatIsIt: 'A utility-first CSS framework packed with classes that can be composed to build any design directly in markup.',
    whyUsed: 'Rapidly styling responsive, modern user interfaces without writing custom CSS files or managing conflicting global class names.',
    advantages: [
      'Zero CSS bloat: JIT compiler includes only classes used in the final production bundle',
      'Consistent design system tokens (spacing, typography, color palettes, breakpoints)',
      'No context switching between JSX/HTML templates and stylesheet files',
      'Seamless dark mode and responsive breakpoint modifiers (`md:`, `lg:`)'
    ],
    importantDetails: [
      {
        title: 'JIT (Just-In-Time) Compiler',
        description: 'Generates styles on-demand by scanning project files, enabling arbitrary values (e.g. `top-[117px]`) and instantaneous build times.'
      }
    ]
  },

  'html5': {
    name: 'HTML5',
    category: 'Web Standard',
    whatIsIt: 'The standard markup language for documents designed to be displayed in a web browser, supporting multimedia, canvas graphics, and semantic structuring.',
    whyUsed: 'The structural skeleton of all web pages and web applications.',
    advantages: [
      'Semantic tags (`<article>`, `<section>`, `<nav>`, `<header>`) improving SEO and accessibility',
      'Native multimedia support with `<audio>` and `<video>` without third-party plugins',
      'Web APIs: Geolocation, Web Storage (localStorage/sessionStorage), Canvas 2D/3D',
      'Universal compatibility across all modern browsers and devices'
    ],
    importantDetails: [
      {
        title: 'DOM (Document Object Model)',
        description: 'Browser parses HTML into a tree of nodes that JavaScript can dynamically inspect and manipulate.'
      }
    ]
  },

  'css3': {
    name: 'CSS3',
    category: 'Styling & Layout',
    whatIsIt: 'The stylesheet language used for describing the presentation, layout, and visual formatting of HTML documents.',
    whyUsed: 'Responsive web design, Flexbox/Grid layouts, animations, transitions, and theming.',
    advantages: [
      'CSS Flexbox and CSS Grid for complex, multi-dimensional responsive layouts',
      'Hardware-accelerated CSS Transitions and `@keyframes` Animations',
      'CSS Custom Properties (Variables) for dynamic runtime theming and dark mode',
      'Media Queries enabling fluid layouts across mobile, tablet, and desktop screens'
    ],
    importantDetails: [
      {
        title: 'The CSS Box Model',
        description: 'Every element is rendered as a box composed of Content, Padding, Border, and Margin. `box-sizing: border-box` includes padding and borders in element width.'
      }
    ]
  },

  // ==========================================
  // BACKEND FRAMEWORKS & RUNTIMES
  // ==========================================
  'node.js': {
    name: 'Node.js',
    category: 'Backend Runtime',
    whatIsIt: 'An open-source, cross-platform JavaScript runtime environment built on Google Chrome\'s V8 JavaScript engine and libuv.',
    whyUsed: 'Building fast, scalable network applications, REST APIs, real-time WebSocket servers, and microservices.',
    advantages: [
      'Non-blocking, event-driven I/O model capable of handling tens of thousands of concurrent connections',
      'Unified JavaScript/TypeScript across both frontend and backend teams',
      'Massive ecosystem with over 2 million packages in npm',
      'High throughput for I/O-intensive workloads (streaming, real-time chat, API proxies)'
    ],
    importantDetails: [
      {
        title: 'Libuv & Thread Pool',
        description: 'While JS executes single-threaded on V8, Libuv manages an underlying OS thread pool (default 4 threads) for blocking system tasks (file I/O, DNS lookup, crypto).'
      },
      {
        title: 'Streams & Buffers',
        description: 'Processes continuous chunks of data without loading entire files into memory, maximizing RAM efficiency.'
      }
    ],
    interviewQuestion: {
      question: 'How does Node.js handle CPU-heavy tasks without blocking the main event loop?',
      answerSummary: 'By offloading CPU-heavy operations to Worker Threads (`worker_threads` module), separate child processes (`child_process.fork`), or external microservices via message queues.'
    }
  },

  'express.js': {
    name: 'Express.js',
    category: 'Backend Web Framework',
    whatIsIt: 'A minimalist, unopinionated, flexible web framework for Node.js providing a robust set of features for web and mobile applications.',
    whyUsed: 'Building RESTful APIs, microservices, and backend web servers in Node.js.',
    advantages: [
      'Extremely lightweight with minimal abstraction overhead',
      'Middleware pipeline architecture for authentication, logging, and error handling',
      'Simple routing system supporting parameterized endpoints',
      'Universal adoption and vast ecosystem of middleware packages'
    ],
    importantDetails: [
      {
        title: 'Middleware Onion Architecture',
        description: 'Requests pass through sequential middleware functions `(req, res, next)`. Calling `next()` advances to the next handler; calling `next(err)` triggers error middleware.'
      }
    ]
  },

  'nestjs': {
    name: 'NestJS',
    category: 'Enterprise Backend Framework',
    whatIsIt: 'A progressive Node.js framework for building efficient, reliable, and scalable server-side applications, built with TypeScript and inspired by Angular architecture.',
    whyUsed: 'Enterprise-grade Node.js backends requiring strict architecture, modularity, Dependency Injection, and microservices.',
    advantages: [
      'Structured architecture using Modules, Controllers, and Providers',
      'First-class TypeScript support with decorators and type safety',
      'Built-in Dependency Injection container for testable code',
      'Native support for Microservices (gRPC, Redis, Kafka, RabbitMQ) and WebSockets'
    ],
    importantDetails: [
      {
        title: 'Dependency Injection & Inversion of Control',
        description: 'Manages service lifecycles (Singleton, Request, Transient) and injects providers via constructor parameters.'
      }
    ]
  },

  'spring boot': {
    name: 'Spring Boot',
    category: 'Enterprise Backend Framework',
    whatIsIt: 'An open-source Java-based framework used to create stand-alone, production-grade microservices and enterprise applications.',
    whyUsed: 'Enterprise backend architecture, transactional banking systems, and robust microservices.',
    advantages: [
      'Inversion of Control (IoC) and Dependency Injection (DI) for testable, modular code',
      'Auto-Configuration automatically setting up data sources, security, and web servers (Tomcat)',
      'Enterprise ecosystem: Spring Data JPA, Spring Security, Spring Cloud, and Actuator metrics',
      'Production-ready operational features (health endpoints, telemetry, connection pools)'
    ],
    importantDetails: [
      {
        title: 'Dependency Injection & ApplicationContext',
        description: 'The Spring IoC container manages the bean lifecycle, injecting dependencies at runtime via `@Autowired` or constructor injection.'
      }
    ]
  },

  'django': {
    name: 'Django',
    category: 'Python Backend Framework',
    whatIsIt: 'A high-level Python web framework that encourages rapid development and clean, pragmatic design following the "batteries-included" philosophy.',
    whyUsed: 'Building secure web backends, content platforms, and REST APIs (via Django REST Framework - DRF).',
    advantages: [
      'Batteries-included: Built-in ORM, admin dashboard, authentication system, and security protections',
      'Protection against common web attacks: CSRF, SQL Injection, XSS, and Clickjacking',
      'Django REST Framework (DRF) for building robust web APIs with serializers',
      'Rapid development speed for startups and enterprise systems'
    ],
    importantDetails: [
      {
        title: 'Django ORM & QuerySets',
        description: 'Maps Python classes to database tables. QuerySets are lazy: queries are only executed when evaluated (iterated, sliced, or printed).'
      }
    ]
  },

  'fastapi': {
    name: 'FastAPI',
    category: 'Modern Python API Framework',
    whatIsIt: 'A modern, fast (high-performance) web framework for building APIs with Python 3.8+ based on standard Python type hints and ASGI (Starlette / Pydantic).',
    whyUsed: 'Building high-speed REST APIs, microservices, and AI/ML model inference endpoints.',
    advantages: [
      'Blazing fast performance on par with NodeJS and Go via Starlette and Uvicorn',
      'Automatic request validation and data serialization using Pydantic',
      'Automatic interactive OpenAPI (Swagger UI) documentation generated from code',
      'Native asynchronous support via Python async/await syntax'
    ],
    importantDetails: [
      {
        title: 'ASGI & Pydantic Validation',
        description: 'Runs on the Asynchronous Server Gateway Interface (ASGI) and uses Pydantic to validate data types and generate schema definitions at runtime.'
      }
    ]
  },

  'flask': {
    name: 'Flask',
    category: 'Python Microframework',
    whatIsIt: 'A lightweight WSGI micro web framework in Python designed to make getting started quick and easy, with the ability to scale up to complex applications.',
    whyUsed: 'Microservices, simple REST APIs, and prototyping machine learning models.',
    advantages: [
      'Minimalist core with no rigid boilerplate or mandatory ORM constraints',
      'Extensible via third-party extensions (Flask-SQLAlchemy, Flask-JWT)',
      'Simple routing and Jinja2 templating'
    ],
    importantDetails: [
      {
        title: 'WSGI Architecture',
        description: 'Follows Web Server Gateway Interface (WSGI) standard, delegating request handling to underlying Python callable apps.'
      }
    ]
  },

  'asp.net core': {
    name: 'ASP.NET Core',
    category: 'Enterprise Web Framework',
    whatIsIt: 'A cross-platform, high-performance, open-source framework for building modern, cloud-enabled, Internet-connected applications using C#.',
    whyUsed: 'High-throughput enterprise APIs, microservices, and real-time cloud services.',
    advantages: [
      'Top-tier performance ranking consistently near the top of TechEmpower benchmarks',
      'Cross-platform: runs on Linux, macOS, Windows, and Docker containers',
      'Built-in dependency injection, configuration, logging, and Kestrel web server',
      'Real-time communication with SignalR'
    ],
    importantDetails: [
      {
        title: 'Kestrel Web Server',
        description: 'An asynchronous, event-driven I/O web server optimized for high request throughput and minimal memory overhead.'
      }
    ]
  },

  // ==========================================
  // DATABASES & CACHES
  // ==========================================
  'postgresql': {
    name: 'PostgreSQL',
    category: 'Relational Database (RDBMS)',
    whatIsIt: 'A powerful, open-source object-relational database system known for reliability, feature robustness, and data integrity.',
    whyUsed: 'Primary transactional database (OLTP) for SaaS applications, financial systems, spatial data (PostGIS), and complex analytics.',
    advantages: [
      'Strict ACID compliance guaranteeing zero data loss with Write-Ahead Logging (WAL)',
      'Advanced indexing: B-Tree, Hash, GiST, SP-GiST, GIN (for fast JSONB queries), BRIN',
      'Native JSONB support combining SQL relational rigor with NoSQL schema flexibility',
      'Extensibility: custom procedural languages and extensions (pgvector, PostGIS)'
    ],
    importantDetails: [
      {
        title: 'Multi-Version Concurrency Control (MVCC)',
        description: 'Readers do not block writers and writers do not block readers. PostgreSQL keeps multiple tuple versions with `xmin` and `xmax` transaction IDs, requiring VACUUM to reclaim dead tuples.'
      },
      {
        title: 'Write-Ahead Logging (WAL)',
        description: 'All transactions are written sequentially to WAL disk logs before modifying data pages, guaranteeing crash recovery and point-in-time recovery (PITR).'
      }
    ],
    interviewQuestion: {
      question: 'How does PostgreSQL MVCC work and why is the VACUUM process necessary?',
      answerSummary: 'MVCC creates a new version of a row on UPDATE/DELETE rather than overwriting in place. VACUUM scans table pages to remove obsolete row versions (dead tuples) and prevent table bloat.'
    }
  },

  'mysql': {
    name: 'MySQL',
    category: 'Relational Database (RDBMS)',
    whatIsIt: 'The world\'s most popular open-source relational database management system, powered by the InnoDB storage engine.',
    whyUsed: 'E-commerce platforms, content management systems (WordPress), web apps, and enterprise backends.',
    advantages: [
      'InnoDB storage engine with full ACID compliance and row-level locking',
      'Proven scalability powering internet-scale applications (Facebook, GitHub, YouTube)',
      'High read performance with clustered primary B+ Tree indexes',
      'Mature replication topology (Master-Slave / Group Replication) and connection pooling'
    ],
    importantDetails: [
      {
        title: 'Clustered Primary Key (InnoDB)',
        description: 'InnoDB organizes tables as a clustered B+ Tree index keyed by the Primary Key, making primary key lookups O(log N) with zero extra pointer hops.'
      }
    ]
  },

  'mongodb': {
    name: 'MongoDB',
    category: 'NoSQL Document Database',
    whatIsIt: 'A source-available, cross-platform document-oriented database that stores data in flexible, JSON-like BSON documents.',
    whyUsed: 'Rapidly evolving schemas, content catalogs, real-time analytics, user session stores, and mobile backends.',
    advantages: [
      'Dynamic schema: documents in a collection can have varying fields and nested structures',
      'Horizontal scalability via native Sharding across distributed clusters',
      'Rich aggregation pipeline framework for complex data transformations',
      'High-speed read and write throughput with replica set failover'
    ],
    importantDetails: [
      {
        title: 'WiredTiger Storage Engine',
        description: 'Uses concurrency control with document-level locking, compression (Snappy/zlib), and checkpointing to disk.'
      }
    ]
  },

  'redis': {
    name: 'Redis',
    category: 'In-Memory Data Store & Cache',
    whatIsIt: 'An open-source, in-memory data structure store used as a database, cache, message broker, and streaming engine.',
    whyUsed: 'Session caching, real-time leaderboards, rate limiting (token bucket), pub/sub messaging, and low-latency data access.',
    advantages: [
      'Sub-millisecond latency operations by storing all datasets in RAM',
      'Rich native data structures: Strings, Hashes, Lists, Sets, Sorted Sets (ZSet), Bitmaps, HyperLogLogs',
      'Persistence options: RDB snapshots and AOF (Append-Only File) disk logging',
      'Built-in Pub/Sub and Redis Streams for distributed event processing'
    ],
    importantDetails: [
      {
        title: 'Single-Threaded Event Loop Architecture',
        description: 'Redis core command processing runs on a single thread via an I/O multiplexer (epoll/kqueue), eliminating context switching and lock contention.'
      }
    ],
    interviewQuestion: {
      question: 'Why is Redis single-threaded yet able to achieve over 100,000 requests per second?',
      answerSummary: 'All data resides in RAM (no disk seek latency), operations use efficient in-memory data structures, and I/O is multiplexed using non-blocking epoll without lock overhead.'
    }
  },

  'sqlite': {
    name: 'SQLite',
    category: 'Embedded Relational Database',
    whatIsIt: 'A C-language library that implements a small, fast, self-contained, high-reliability, full-featured, SQL database engine.',
    whyUsed: 'Mobile devices (iOS/Android), desktop software, local development, embedded IoT, and lightweight web apps.',
    advantages: [
      'Serverless and zero-configuration: database is a single disk file',
      'Strict ACID transactional guarantees with Write-Ahead Logging (WAL)',
      'Blazingly fast in-process reads with zero network socket latency',
      'The most widely deployed database in the world'
    ],
    importantDetails: [
      {
        title: 'In-Process Execution',
        description: 'Runs directly inside the application process address space, eliminating IPC and network latency.'
      }
    ]
  },

  'dynamodb': {
    name: 'Amazon DynamoDB',
    category: 'Cloud NoSQL Key-Value Store',
    whatIsIt: 'A fully managed, serverless, key-value and document database designed by AWS that delivers single-digit millisecond performance at any scale.',
    whyUsed: 'High-scale web applications, gaming leaderboards, shopping carts, and event tracking.',
    advantages: [
      'Automatic horizontal partitioning with virtually unlimited throughput and storage',
      'Single-digit millisecond latency backed by SSDs and in-memory DAX caching',
      'Serverless pricing with on-demand capacity auto-scaling',
      'Global Tables providing multi-region active-active replication'
    ],
    importantDetails: [
      {
        title: 'Partition Key & Consistent Hashing',
        description: 'Data is distributed across storage partitions using a hash of the Partition Key. Queries must specify the partition key for O(1) routing.'
      }
    ]
  },

  'elasticsearch': {
    name: 'Elasticsearch',
    category: 'Distributed Search & Analytics Engine',
    whatIsIt: 'A distributed, JSON-based search and analytics engine built on Apache Lucene, designed for horizontal scalability and near real-time search.',
    whyUsed: 'Full-text search, log aggregation (ELK Stack), operational monitoring, and autocomplete.',
    advantages: [
      'Inverted Index data structure providing blazing fast full-text keyword search',
      'Distributed sharding and automated cluster rebalancing',
      'Powerful aggregations for real-time statistical analytics and histograms'
    ],
    importantDetails: [
      {
        title: 'Inverted Index & Lucene Segments',
        description: 'Maps unique words to the list of document IDs in which they occur, enabling instant text lookups.'
      }
    ]
  },

  // ==========================================
  // CLOUD & DEVOPS
  // ==========================================
  'docker': {
    name: 'Docker',
    category: 'Containerization Platform',
    whatIsIt: 'An open-source platform that automates the deployment of applications inside lightweight, portable software containers.',
    whyUsed: 'Eliminating environment discrepancies ("works on my machine"), standardizing CI/CD pipelines, and packaging microservices.',
    advantages: [
      'Lightweight virtualization: containers share the host OS kernel, using minimal RAM compared to VMs',
      'Immutable container images ensuring 100% environment parity across dev, staging, and production',
      'Rapid startup time (seconds vs minutes for virtual machines)',
      'Layer caching in Dockerfile builds accelerating deployment pipelines'
    ],
    importantDetails: [
      {
        title: 'Linux Namespaces & Cgroups',
        description: 'Containers achieve process isolation via Linux Namespaces (PID, NET, MNT, IPC) and enforce CPU/RAM resource limits using Control Groups (cgroups).'
      },
      {
        title: 'Union File System (OverlayFS)',
        description: 'Docker images are stacked read-only layers with a single writable container layer on top, saving storage via copy-on-write (CoW).'
      }
    ],
    interviewQuestion: {
      question: 'What is the fundamental architectural difference between Docker containers and Virtual Machines (VMs)?',
      answerSummary: 'VMs run a full guest OS on top of a hypervisor with dedicated hardware virtualization. Docker containers share the host OS kernel and isolate processes using namespaces and cgroups.'
    }
  },

  'kubernetes': {
    name: 'Kubernetes (K8s)',
    category: 'Container Orchestration',
    whatIsIt: 'An open-source container orchestration system for automating application deployment, scaling, and management.',
    whyUsed: 'Managing large-scale microservice fleets across cloud clusters with automated self-healing, rolling updates, and load balancing.',
    advantages: [
      'Automated rollouts, canary deployments, and zero-downtime rollbacks',
      'Horizontal Pod Autoscaling (HPA) based on CPU/memory metrics or custom queues',
      'Self-healing: restarts failed containers and reschedules pods on healthy nodes',
      'Declarative configuration via YAML/Helm charts'
    ],
    importantDetails: [
      {
        title: 'Control Plane Architecture',
        description: 'Consists of API Server, etcd (distributed key-value store for state), kube-scheduler, and controller-manager. Worker nodes run kubelet and kube-proxy.'
      }
    ]
  },

  'aws': {
    name: 'Amazon Web Services (AWS)',
    category: 'Cloud Computing Platform',
    whatIsIt: 'The world\'s most comprehensive and broadly adopted cloud platform, offering over 200 fully featured services from global data centers.',
    whyUsed: 'Hosting scalable web apps, data lakes, serverless backends (Lambda), object storage (S3), and managed databases (RDS, DynamoDB).',
    advantages: [
      'Global infrastructure with high availability across Multi-AZ regions',
      'Elastic pay-as-you-go pricing minimizing upfront infrastructure capital expenditures',
      'Enterprise security with AWS IAM, KMS encryption, and VPC network isolation',
      'Deeply integrated ecosystem spanning compute, storage, databases, AI/ML, and analytics'
    ],
    importantDetails: [
      {
        title: 'Core Services Synergy',
        description: 'EC2 (virtual servers), S3 (object storage), RDS/DynamoDB (databases), IAM (identity access management), Lambda (event-driven serverless computing).'
      }
    ]
  },

  'azure': {
    name: 'Microsoft Azure',
    category: 'Cloud Computing Platform',
    whatIsIt: 'Microsoft\'s cloud computing platform providing Infrastructure as a Service (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS).',
    whyUsed: 'Enterprise cloud hosting, hybrid active directory integrations, Azure OpenAI services, and enterprise data analytics.',
    advantages: [
      'Seamless integration with Microsoft ecosystem (Active Directory, Office 365, .NET)',
      'Enterprise hybrid cloud solutions with Azure Arc and Azure Stack',
      'Global data center network with stringent compliance certifications'
    ],
    importantDetails: [
      {
        title: 'Resource Groups & Entra ID',
        description: 'Manages resource lifecycle via Resource Groups and controls access via Azure Entra ID (formerly Azure Active Directory).'
      }
    ]
  },

  'gcp': {
    name: 'Google Cloud Platform (GCP)',
    category: 'Cloud Computing Platform',
    whatIsIt: 'A suite of cloud computing services offered by Google that runs on the same infrastructure that Google uses internally for products like Search and YouTube.',
    whyUsed: 'Big data analytics (BigQuery), machine learning (Vertex AI), and managed Kubernetes (GKE).',
    advantages: [
      'Industry-leading big data analytics with Google BigQuery',
      'Native home of Kubernetes with Google Kubernetes Engine (GKE)',
      'Advanced AI/ML infrastructure with TPUs and Vertex AI'
    ],
    importantDetails: [
      {
        title: 'Global Fiber Network',
        description: 'Google runs on its own private global software-defined fiber network (Andromeda), delivering ultra-low cross-region latency.'
      }
    ]
  },

  'git': {
    name: 'Git',
    category: 'Version Control System',
    whatIsIt: 'A distributed version control system designed to handle everything from small to very large projects with speed and efficiency.',
    whyUsed: 'Source code management, collaborative team branching workflows (GitFlow, trunk-based), and tracking historical revisions.',
    advantages: [
      'Distributed architecture: every developer has a full local repository copy and commit history',
      'Lightning-fast branching, merging, and rebasing',
      'Cryptographic integrity using SHA-1 / SHA-256 hashes for all commits and trees',
      'Standardized collaboration via GitHub, GitLab, and Bitbucket pull requests'
    ],
    importantDetails: [
      {
        title: 'Internal Object Model',
        description: 'Git stores data as a Directed Acyclic Graph (DAG) of 4 immutable objects: Blobs (file contents), Trees (directories), Commits (metadata + root tree), and Annotated Tags.'
      }
    ]
  },

  'ci/cd': {
    name: 'CI/CD Pipelines',
    category: 'DevOps & Automation',
    whatIsIt: 'Continuous Integration (CI) and Continuous Deployment/Delivery (CD) automate the building, testing, and releasing of software.',
    whyUsed: 'Preventing regressions, accelerating release cadence, and automating deployment to production (GitHub Actions, GitLab CI, Jenkins).',
    advantages: [
      'Automated automated test execution on every commit / pull request',
      'Rapid feedback loop on code quality, security vulnerabilities, and build failures',
      'Zero-downtime automated deployment to staging and production environments'
    ],
    importantDetails: [
      {
        title: 'Pipeline Stages',
        description: 'Lint -> Typecheck -> Unit Tests -> Integration Tests -> Container Build -> Security Scan -> Deploy -> Automated Smoke Verification.'
      }
    ]
  },

  'kafka': {
    name: 'Apache Kafka',
    category: 'Distributed Event Streaming',
    whatIsIt: 'An open-source distributed event store and stream-processing platform capable of handling trillions of events a day.',
    whyUsed: 'Real-time telemetry pipelines, microservice event-driven architecture, activity tracking, and log aggregation.',
    advantages: [
      'Extreme throughput with sequential disk I/O and zero-copy OS transfers (sendfile)',
      'Horizontal partition-based scaling and consumer group parallelism',
      'Persistent, replayable distributed commit log with configurable retention',
      'Fault-tolerant replication with Raft (KRaft) consensus'
    ],
    importantDetails: [
      {
        title: 'Partitioning & Consumer Groups',
        description: 'Topics are split into partitions. Within a partition, events have a strictly ordered offset. Each consumer in a group reads from dedicated partitions for parallel processing.'
      }
    ]
  },

  // ==========================================
  // MACHINE LEARNING, DATA & AI
  // ==========================================
  'pytorch': {
    name: 'PyTorch',
    category: 'Deep Learning Framework',
    whatIsIt: 'An open-source machine learning framework developed by Meta based on the Torch library, used for applications such as computer vision and NLP.',
    whyUsed: 'Research and production deep learning, training Large Language Models (LLMs), neural network design, and tensor computation on GPUs.',
    advantages: [
      'Dynamic computational graph (Eager Execution) enabling intuitive Pythonic debugging',
      'Native CUDA acceleration for tensor operations across NVIDIA GPUs',
      'The primary framework adopted by top AI research labs (OpenAI, Hugging Face, Meta)'
    ],
    importantDetails: [
      {
        title: 'Autograd Engine',
        description: 'Automatically records operations executed on tensors and calculates gradients via reverse-mode automatic differentiation during backpropagation (`loss.backward()`).'
      }
    ]
  },

  'tensorflow': {
    name: 'TensorFlow',
    category: 'Machine Learning Framework',
    whatIsIt: 'A comprehensive, open-source platform for machine learning developed by Google Brain.',
    whyUsed: 'Production-scale deep learning, mobile deployment (TensorFlow Lite), and enterprise ML pipelines.',
    advantages: [
      'End-to-end production deployment tooling (TensorFlow Serving, TFLite, TF.js)',
      'High-level Keras API for intuitive neural network modeling',
      'Optimized for Google Cloud Tensor Processing Units (TPUs)'
    ],
    importantDetails: [
      {
        title: 'Graph Execution & XLA',
        description: 'Accelerated Linear Algebra (XLA) compiles and optimizes TensorFlow computations for target hardware kernels.'
      }
    ]
  },

  'scikit-learn': {
    name: 'Scikit-Learn',
    category: 'Machine Learning Library',
    whatIsIt: 'A simple, efficient Python library for predictive data analysis built on NumPy, SciPy, and matplotlib.',
    whyUsed: 'Classical machine learning: Classification (Random Forest, SVM), Regression, Clustering (K-Means), and Dimensionality Reduction (PCA).',
    advantages: [
      'Clean, consistent Python API (`fit()`, `transform()`, `predict()`)',
      'Comprehensive toolset for model evaluation, cross-validation, and hyperparameter tuning',
      'High execution speed optimized with underlying C/Cython algorithms'
    ],
    importantDetails: [
      {
        title: 'ML Pipelines',
        description: 'Encapsulates transformers (StandardScaler, OneHotEncoder) and estimators into a single pipeline to prevent data leakage during cross-validation.'
      }
    ]
  },

  'pandas': {
    name: 'Pandas',
    category: 'Data Analysis & Manipulation',
    whatIsIt: 'A fast, powerful, flexible open-source data analysis and manipulation tool built on top of the Python programming language.',
    whyUsed: 'Data cleaning, feature engineering, exploratory data analysis (EDA), and tabular data processing.',
    advantages: [
      'Fast DataFrame and Series data structures with vectorized operations',
      'Flexible handling of missing data, time series resamplings, merges, and group-by aggregations',
      'Extensive I/O support reading from CSV, Parquet, SQL databases, and Excel'
    ],
    importantDetails: [
      {
        title: 'Vectorization & NumPy Backing',
        description: 'DataFrames store column data as contiguous NumPy arrays in C memory, making vectorized calculations orders of magnitude faster than Python for-loops.'
      }
    ]
  },

  'numpy': {
    name: 'NumPy',
    category: 'Numerical Computing Library',
    whatIsIt: 'The fundamental package for scientific computing in Python, providing support for large, multi-dimensional arrays and matrices.',
    whyUsed: 'Mathematical computations, linear algebra, Fourier transforms, and the foundational array substrate for Pandas, PyTorch, and Scikit-Learn.',
    advantages: [
      'N-dimensional array object (`ndarray`) stored in contiguous memory blocks',
      'Vectorized array broadcasting eliminating slow Python for-loops',
      'Compiled C/Fortran math backend (BLAS/LAPACK) for maximum CPU performance'
    ],
    importantDetails: [
      {
        title: 'Strided Memory Layout',
        description: 'NumPy arrays use strides to navigate multi-dimensional memory buffers with zero data copying during slicing and transposition.'
      }
    ]
  },

  // ==========================================
  // PROTOCOLS & ARCHITECTURAL PATTERNS
  // ==========================================
  'rest-apis': {
    name: 'RESTful APIs',
    category: 'API Architecture',
    whatIsIt: 'Representational State Transfer is an architectural style for designing networked applications using standard HTTP methods and stateless communication.',
    whyUsed: 'Standard client-server communication between web/mobile frontends and backend services.',
    advantages: [
      'Stateless communication: each request contains all necessary context, enabling horizontal server scaling',
      'Standard HTTP verbs: GET (read), POST (create), PUT (replace), PATCH (update), DELETE (remove)',
      'Universal compatibility with JSON payloads across all languages and platforms'
    ],
    importantDetails: [
      {
        title: 'Idempotency & Status Codes',
        description: 'GET, PUT, and DELETE methods are idempotent. Adheres to HTTP status standards (200 OK, 201 Created, 400 Bad Request, 401 Unauthorized, 404 Not Found, 500 Internal Error).'
      }
    ]
  },

  'graphql': {
    name: 'GraphQL',
    category: 'Query Language for APIs',
    whatIsIt: 'An open-source data query and manipulation language for APIs, and a runtime for fulfilling queries with existing data, developed by Meta.',
    whyUsed: 'Eliminating over-fetching and under-fetching by allowing clients to request exactly the fields they need in a single HTTP request.',
    advantages: [
      'Exact data fetching: clients declare exact fields, saving mobile bandwidth',
      'Single endpoint (`/graphql`) serving complex relational queries in one round trip',
      'Strongly typed schema with introspection and automated documentation'
    ],
    importantDetails: [
      {
        title: 'Resolvers & The N+1 Problem',
        description: 'Each field is fulfilled by a resolver function. Batch loading utilities (DataLoader) solve the N+1 database query problem by caching and batching keys.'
      }
    ]
  },

  'microservices': {
    name: 'Microservices Architecture',
    category: 'System Architecture Pattern',
    whatIsIt: 'An architectural style that structures an application as a collection of small, autonomous services modeled around business domains.',
    whyUsed: 'Enabling independent deployment, technology diversity, and organizational scaling across large engineering teams.',
    advantages: [
      'Independent deployability: update one service without redeploying the entire system',
      'Fault isolation: a crash in the recommendation service does not bring down the payment gateway',
      'Granular horizontal scaling: scale only high-traffic compute bottlenecks'
    ],
    importantDetails: [
      {
        title: 'Service Boundaries & Data Isolation',
        description: 'Each microservice owns its private database. Services communicate via lightweight protocols (gRPC, REST, Kafka) with circuit breakers for resilience.'
      }
    ]
  }
};

// Comprehensive exact alias mapping table to guarantee 100% accuracy
const TECH_ALIAS_MAP: Record<string, string> = {
  'java': 'java',
  'python': 'python',
  'javascript': 'javascript',
  'js': 'javascript',
  'typescript': 'typescript',
  'ts': 'typescript',
  'c++': 'c++',
  'cpp': 'c++',
  'c#': 'c#',
  'csharp': 'c#',
  '.net': 'c#',
  '.net core': 'c#',
  'asp.net': 'asp.net core',
  'asp.net core': 'asp.net core',
  'c': 'c',
  'c language': 'c',
  'go': 'go',
  'golang': 'go',
  'rust': 'rust',
  'php': 'php',
  'ruby': 'ruby',
  'ruby on rails': 'ruby',
  'rails': 'ruby',
  'kotlin': 'kotlin',
  'swift': 'swift',
  'swiftui': 'swift',
  'sql': 'sql',
  'pl/sql': 'sql',

  // Frontend
  'react': 'react',
  'react.js': 'react',
  'reactjs': 'react',
  'next.js': 'next.js',
  'nextjs': 'next.js',
  'next': 'next.js',
  'vue': 'vue.js',
  'vue.js': 'vue.js',
  'vuejs': 'vue.js',
  'angular': 'angular',
  'angularjs': 'angular',
  'svelte': 'svelte',
  'sveltekit': 'svelte',
  'tailwind': 'tailwind css',
  'tailwind css': 'tailwind css',
  'tailwindcss': 'tailwind css',
  'html': 'html5',
  'html5': 'html5',
  'css': 'css3',
  'css3': 'css3',
  'sass': 'css3',
  'scss': 'css3',

  // Backend
  'node': 'node.js',
  'node.js': 'node.js',
  'nodejs': 'node.js',
  'express': 'express.js',
  'express.js': 'express.js',
  'expressjs': 'express.js',
  'nestjs': 'nestjs',
  'spring': 'spring boot',
  'spring boot': 'spring boot',
  'spring mvc': 'spring boot',
  'django': 'django',
  'fastapi': 'fastapi',
  'flask': 'flask',

  // Databases
  'postgres': 'postgresql',
  'postgresql': 'postgresql',
  'mysql': 'mysql',
  'mariadb': 'mysql',
  'mongodb': 'mongodb',
  'redis': 'redis',
  'sqlite': 'sqlite',
  'dynamodb': 'dynamodb',
  'elasticsearch': 'elasticsearch',

  // Cloud & DevOps
  'docker': 'docker',
  'docker compose': 'docker',
  'kubernetes': 'kubernetes',
  'k8s': 'kubernetes',
  'aws': 'aws',
  'amazon web services': 'aws',
  'azure': 'azure',
  'gcp': 'gcp',
  'google cloud': 'gcp',
  'google cloud platform': 'gcp',
  'git': 'git',
  'github': 'git',
  'gitlab': 'git',
  'ci/cd': 'ci/cd',
  'github actions': 'ci/cd',
  'jenkins': 'ci/cd',
  'kafka': 'kafka',
  'apache kafka': 'kafka',

  // AI/ML
  'pytorch': 'pytorch',
  'tensorflow': 'tensorflow',
  'scikit-learn': 'scikit-learn',
  'pandas': 'pandas',
  'numpy': 'numpy',

  // Architecture & APIs
  'rest': 'rest-apis',
  'rest api': 'rest-apis',
  'restful apis': 'rest-apis',
  'rest apis': 'rest-apis',
  'graphql': 'graphql',
  'microservices': 'microservices',
  'microservices architecture': 'microservices'
};

// Helper function to find or dynamically generate tech details for any skill with 100% precision
export function getTechDetail(skillName: string): TechDetail {
  if (!skillName || typeof skillName !== 'string') {
    return generateDynamicTechDetail('Technology');
  }

  const rawTrimmed = skillName.trim();
  const normalized = rawTrimmed.toLowerCase();

  // 1. Direct Alias Map Lookup
  if (TECH_ALIAS_MAP[normalized]) {
    const targetKey = TECH_ALIAS_MAP[normalized];
    if (TECH_KNOWLEDGE_BASE[targetKey]) {
      return TECH_KNOWLEDGE_BASE[targetKey];
    }
  }

  // 2. Direct Knowledge Base Key Lookup
  if (TECH_KNOWLEDGE_BASE[normalized]) {
    return TECH_KNOWLEDGE_BASE[normalized];
  }

  // 3. Exact word-boundary match (Never blind substring)
  for (const [key, val] of Object.entries(TECH_KNOWLEDGE_BASE)) {
    // Escape special chars for regex
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const wordBoundaryRegex = new RegExp(`(^|[^a-zA-Z0-9+#.-])${escaped}(?=[^a-zA-Z0-9+#.-]|$)`, 'i');
    if (wordBoundaryRegex.test(normalized)) {
      return val;
    }
  }

  // 4. Dynamic fallback generator tailored specifically to this skill
  return generateDynamicTechDetail(rawTrimmed);
}

function generateDynamicTechDetail(skill: string): TechDetail {
  const sLower = skill.toLowerCase();

  let category = 'Technology / Framework';
  let whyUsed = `Utilized by modern software engineering teams to enhance development velocity, scalability, and code reliability.`;
  let advantages = [
    `Industry-standard tool for modern software workflows and system architectures`,
    `Enhances engineering efficiency, maintainability, and production stability`,
    `Supported by extensive developer documentation and active community ecosystem`
  ];
  let importantDetails = [
    {
      title: 'Core Engineering Role',
      description: `${skill} plays a key role in the project architecture, handling critical functional requirements, system data, or operational workflows.`
    },
    {
      title: 'Key Best Practices',
      description: `Follows modular design patterns, clean abstractions, automated testing, and optimal memory/resource management.`
    }
  ];

  if (sLower.includes('sql') || sLower.includes('db') || sLower.includes('database') || sLower.includes('store')) {
    category = 'Database & Storage Engine';
    whyUsed = `Used for reliable data persistence, transactional integrity (ACID), high-throughput querying, and indexing large datasets.`;
    advantages = [
      'High-performance data storage and fast indexed lookups',
      'ACID transactional guarantees preventing data corruption',
      'Scalable query execution and connection pooling support'
    ];
    importantDetails = [
      {
        title: 'Indexing & Query Optimization',
        description: 'Utilizes B-Tree or Hash indexes to accelerate lookups and prevent costly full-table sequential scans.'
      },
      {
        title: 'Connection Management',
        description: 'Uses connection pools to reuse database connections and minimize TCP handshake overhead.'
      }
    ];
  } else if (sLower.includes('api') || sLower.includes('rest') || sLower.includes('graphql') || sLower.includes('grpc') || sLower.includes('protocol')) {
    category = 'Networking & API Protocol';
    whyUsed = `Used for standardized client-server communication, microservice contracts, and data exchange over HTTP/HTTPS.`;
  } else if (sLower.includes('ai') || sLower.includes('ml') || sLower.includes('learning') || sLower.includes('torch') || sLower.includes('tensor') || sLower.includes('vision') || sLower.includes('nlp')) {
    category = 'Machine Learning & AI';
    whyUsed = `Used to build, train, evaluate, and deploy intelligent predictive models and neural network architectures.`;
    advantages = [
      'High-dimensional mathematical vector processing with GPU/TPU acceleration',
      'State-of-the-art algorithms for NLP, computer vision, and predictive analytics',
      'Seamless pipeline integration from data preprocessing to production inference'
    ];
  } else if (sLower.includes('cloud') || sLower.includes('ci') || sLower.includes('cd') || sLower.includes('deploy') || sLower.includes('devops') || sLower.includes('action')) {
    category = 'DevOps & Cloud Infrastructure';
    whyUsed = `Used for automated build validation, continuous testing, infrastructure-as-code, and zero-downtime production releases.`;
  }

  return {
    name: skill,
    category,
    whatIsIt: `${skill} is a core technology used in software engineering to build scalable, reliable, and high-performance applications.`,
    whyUsed,
    advantages,
    importantDetails
  };
}
