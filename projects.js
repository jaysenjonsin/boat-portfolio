// Site content. Edit here to add or change work, projects, and skills.
const PROJECTS = [
  {
    "id": "Chartbeat",
    "title": "Chartbeat",
    "description": "building real-time analytics tools @ Chartbeat",
    "longDescription": "Chartbeat is an analytics platform that helps publishers understand and grow audience engagement in real time. As a QA/Software Engineer Intern at Chartbeat, I shipped the recirculation sorting feature end-to-end across the React/TypeScript dashboard and a Python/FastAPI data service, unlocking a new content ranking signal for 50+ publishers. I introduced the first automated merge gate for the Conversions dashboard by integrating a Dockerized Playwright smoke suite into Jenkins CI, covering auth, API-driven UI updates, URL state sync, and error handling for a React SPA. I also built a React hook that gates two mutually exclusive UI states without redundant API calls across sibling components, preventing dashboard users from seeing a false \"no data\" error during Chartbeat's 2-hour post-midnight pipeline delay. To strengthen data integrity, I developed property-based and invariant tests for FastAPI services using Python, pytest, and Hypothesis, validating data across Snowflake pipelines and increasing test coverage by 54%. I also fixed broken Python/pytest E2E test infrastructure across Chartbeat's historical analytics service and extended the harness with 7 parametrized test cases across 3 APIs to establish regression protection for recently shipped geo analytics features. Outside of my day-to-day work, I competed in Chartbeat's company-wide hackathon alongside 3 teammates. We built Labs, a two-part workflow for closing the gap between a great product idea and a customer actually seeing it: a portal where anyone on the team could submit an idea and use AI to rapidly turn it into a prototype, and a new Labs Showcase tab in the Chartbeat product where those prototypes get surfaced to real customers to try, vote on, and leave feedback on. Our team won first place overall.",
    "technologies": [
      "React",
      "Typescript",
      "Python",
      "FastAPI",
      "Playwright",
      "Docker",
      "Jenkins",
      "pytest",
      "Hypothesis",
      "Snowflake"
    ],
    "year": "2026",
    "category": "work",
    "images": [
      "projects/chartbeat/chartbeatGscOverview.gif",
      "projects/chartbeat/chartbeatUnifiedDashboardView.png",
      "projects/chartbeat/chartbeatSortingByRecircAuthors.png",
      "projects/chartbeat/chartbeatDisabledTsf.png",
      "projects/chartbeat/chartbeatLabs.png"
    ]
  },
  {
    "id": "Glassdoor",
    "title": "Glassdoor",
    "description": "growing user engagement and content contribution @ Glassdoor",
    "longDescription": "Glassdoor is a platform for workplace transparency, helping employees and job seekers research companies, read reviews, and make informed career decisions. As a Front-end Software Engineer Intern at Glassdoor, I built features and infrastructure that boosted content contribution, enhanced the user experience, and streamlined developer workflows. I built the “Add New Company” feature within the company review survey using advanced React reducer patterns, GraphQL queries/mutations, and dynamic form validation, boosting employer review survey submissions by 6%. I refactored legacy autocomplete components to meet WCAG accessibility standards and maintain UX consistency across multiple survey workflows. I also architected A/B test infrastructure with Amplitude that drove a 102% increase in survey submissions, and improved test coverage across all salary survey modules by 94% using TypeScript, Jest, and React Testing Library. Additionally, I enhanced the developer experience by creating Storybook documentation with GraphQL API mocking and i18n context integration, streamlining onboarding and cross-team collaboration.",
    "technologies": [
      "React",
      "Typescript",
      "Next.js",
      "GraphQL",
      "SCSS",
      "Jest",
      "Vitest",
      "React Testing Library",
      "Amplitude",
      "Storybook"
    ],
    "year": "2025",
    "category": "work",
    "liveUrl": "https://www.glassdoor.com/surveys/start",
    "images": [
      "projects/glassdoor/glassdoorHomepage.mp4",
      "projects/glassdoor/addNewEmployer.mp4",
      "projects/glassdoor/cRegFlow.mp4",
      "projects/glassdoor/industryDetails.mp4"
    ]
  },
  {
    "id": "Konvene",
    "title": "Konvene",
    "description": "streamlining convention organization @ Konvene",
    "longDescription": "Konvene is a convention event management application that helps organizers plan, manage, and run local conventions, while providing attendees and vendors a seamless event experience. As a Software Engineer at Konvene, I contributed across the full stack to build a platform that streamlined event organization. On the frontend, I designed and implemented 10+ responsive React pages with MUI, ensuring a cohesive, mobile-first experience across different user roles. I also architected the authentication system with React Router, Context API, and JWTs to enable secure, role-based access and persistent session management. On the backend, I built and maintained PostgreSQL schemas and models in Ruby on Rails to handle vendor applications, event add-ons, payments (via Stripe), and automated email notifications. To support smooth deployments, I set up CI/CD pipelines with GitHub Actions for database migrations and schema changes.",
    "technologies": [
      "React",
      "Javascript",
      "Ruby",
      "Ruby on Rails",
      "PostgreSQL",
      "Stripe",
      "GitHub Actions",
      "MUI",
      "React Router",
      "Context API",
      "JWT"
    ],
    "year": "2023-2024",
    "category": "work"
  },
  {
    "id": "Amelia",
    "title": "Amelia",
    "description": "taking flight w/ Amelia - 1st place hackathon winner",
    "longDescription": "Amelia is an aviation-themed game that challenges players to navigate to the other side of the map by choosing the right plane according to the weather conditions. I developed Amelia from inception to completion within 72 hours, utilizing React and Node.js. I implemented back-end API calls to access real-time weather-related data using Storm Glass API to enhance gameplay with dynamic weather conditions. My team was awarded 1st place overall among 100+ individual participants at the Aviation Hack 2023 hackathon.",
    "technologies": [
      "React",
      "Node.js",
      "Express",
      "Storm Glass API"
    ],
    "year": "2023",
    "category": "project",
    "images": [
      "projects/amelia/ameliaLoadingScreen.mp4",
      "projects/amelia/ameliaChoosePlane.webp",
      "projects/amelia/ameliaWin.mp4",
      "projects/amelia/ameliaLose1.mp4",
      "projects/amelia/ameliaLose2.mp4",
      "projects/amelia/ameliaLose3.mp4",
      "projects/amelia/ameliaResultScreens.avif"
    ],
    "githubUrl": "https://github.com/jaysenjonsin/amelia"
  },
  {
    "id": "Knoted",
    "title": "Knoted",
    "description": "making learning more efficient @ Knoted",
    "longDescription": "Knoted doesn't just help you learn — it helps you learn how to learn. Personalized flashcards/notes, spaced repetition algorithms, audio reviews, and more in one hub. Currently in production.",
    "technologies": [
      "React",
      "Typescript",
      "Next.js",
      "Tailwind",
      "Supabase",
      "PostgreSQL"
    ],
    "year": "2025",
    "category": "project",
    "images": [
      "projects/knoted/knotedNotesView.png",
      "projects/knoted/knotedLiveAudio.png",
      "projects/knoted/knotedDashboard.png",
      "projects/knoted/knotedUpload.png"
    ]
  },
  {
    "id": "Scribe",
    "title": "Scribe",
    "description": "generating automated tests @ Scribe",
    "longDescription": "Scribe is an open source application offering automated Jest type-test generation, schema validation, and smart resolver mock integration setups for GraphQL. As a software engineer, I contributed across the full stack to build a platform focused on improving the test driven development workflow. On the frontend, I created a React interface with an integrated code editor for writing and saving GraphQL queries/mutations, and implemented Redux Toolkit for centralized state management, improving readability and reducing prop-drilling complexity. On the backend, I configured an Express.js/Node.js server to generate type-safe unit and integration tests aligned with Apollo GraphQL standards. I also optimized API performance with Redis caching, cutting redundant database queries and improving response times by up to 80%.",
    "technologies": [
      "React",
      "Typescript",
      "Node.js",
      "Express.js",
      "GraphQL",
      "Redis",
      "Apollo GraphQL",
      "Redux Toolkit",
      "Prisma",
      "Husky"
    ],
    "year": "2022-2023",
    "category": "work",
    "githubUrl": "https://github.com/oslabs-beta/Scribe-for-GraphQL",
    "articleUrl": "https://medium.com/@scribegraphql/writing-jest-tests-for-graphql-scribe-graphql-387e414eea0c",
    "images": [
      "projects/scribe/scribeHomepage.png",
      "projects/scribe/scribeGenerateTest.gif",
      "projects/scribe/scribeSignUp.png"
    ]
  },
  {
    "id": "Ignition",
    "title": "Ignition",
    "description": "improving healthcare communication w/ Ignition",
    "longDescription": "Ignition is a task collaboration platform designed for integration with electronic health record systems to improve workflow efficiency for healthcare providers. I built this full-stack application using React and JavaScript, implementing JWT authentication for secure user sessions and Redux for centralized state management. I configured webpack to bundle and optimize the React application resulting in a highly efficient and maintainable build process. On the backend, I employed MongoDB with Mongoose to establish scalable and high-performing data storage for user and task functionality.",
    "technologies": [
      "React",
      "Javascript",
      "Redux",
      "Express",
      "Webpack",
      "MongoDB",
      "Mongoose",
      "JWT",
      "SCSS"
    ],
    "year": "2023",
    "images": [
      "projects/ignition/ignitionLogin.png",
      "projects/ignition/ignitionHomepage.png",
      "projects/ignition/ignitionMedRequest.png",
      "projects/ignition/ignitionMedRequestFilled.png"
    ],
    "category": "project",
    "githubUrl": "https://github.com/jaysenjonsin/Ignition"
  },
  {
    "id": "EventFinder",
    "title": "EventFinder",
    "description": "finding and managing live events w/ EventFinder",
    "longDescription": "EventFinder is a web application for discovering and managing live events such as concerts, sports, and theater shows. I implemented a responsive, mobile-first interface using Bootstrap’s CSS infrastructure and leveraged modern JavaScript (ES6+) features (including async/await, arrow functions, and destructuring) to improve readability, maintainability, and performance. I engineered an autocomplete search interface that integrates with the Ticketmaster API, delivering real-time suggestions while preventing rate limiting. Additionally, I incorporated the Spotify API to surface detailed artist information and enhance the user experience with richer event context.",
    "technologies": [
      "React",
      "JavaScript",
      "Node.js",
      "Express",
      "Bootstrap",
      "Ticketmaster API",
      "Spotify API",
      "Geolocation"
    ],
    "year": "2022-2023",
    "category": "project",
    "images": [
      "projects/eventFinder/eventFinderSearch.png",
      "projects/eventFinder/eventFinderTeams.png",
      "projects/eventFinder/eventFinderVenue.png",
      "projects/eventFinder/eventFinderMap.png"
    ],
    "githubUrl": "https://github.com/jaysenjonsin/ticketMaster"
  }
];

const SKILLS = [
  [
    "languages",
    [
      "TypeScript",
      "JavaScript(ES6)",
      "Python",
      "HTML/CSS",
      "Ruby"
    ]
  ],
  [
    "libraries/frameworks",
    [
      "React",
      "Next.js",
      "Node.js",
      "Express",
      "GraphQL",
      "Tailwind",
      "SCSS",
      "MUI",
      "Bootstrap"
    ]
  ],
  [
    "development tools/platforms",
    [
      "Git",
      "GitHub",
      "Vercel",
      "Netlify",
      "VS Code",
      "Figma",
      "Cursor",
      "Claude Code"
    ]
  ],
  [
    "databases",
    [
      "SQL",
      "NoSQL",
      "PostgreSQL",
      "MongoDB",
      "Redis",
      "Supabase",
      "Firebase"
    ]
  ]
];
