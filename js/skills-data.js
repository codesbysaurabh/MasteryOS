// skills-data.js - prebuilt skills the user can add with one click.
// `logo` is the image file (in the images/ folder) used as the skill icon.
// Topic names are a short, simplified list inspired by roadmap.sh.
// To add a skill: copy a block below, change the name, logo and topics.

const PREBUILT_SKILLS = {
  "DSA": {
    logo: "images/dsa.svg",
    topics: [
      "Time and space complexity",
      "Arrays",
      "Strings",
      "Linked lists",
      "Stacks and queues",
      "Hash tables",
      "Recursion",
      "Sorting algorithms",
      "Binary search",
      "Trees",
      "Binary search trees",
      "Heaps",
      "Graphs",
      "BFS and DFS",
      "Dynamic programming",
      "Greedy algorithms",
      "Backtracking"
    ]
  },

  "Machine Learning": {
    logo: "images/scikit-learn.svg",
    topics: [
      "Python basics",
      "NumPy and Pandas",
      "Statistics and probability",
      "Linear algebra basics",
      "Data cleaning",
      "Linear regression",
      "Logistic regression",
      "Decision trees",
      "Model evaluation",
      "Overfitting and regularization",
      "Clustering",
      "Neural networks basics",
      "Deploying a model"
    ]
  },

  "HTML": {
    logo: "images/html.svg",
    topics: [
      "Document structure",
      "Text and links",
      "Images and media",
      "Lists and tables",
      "Forms and inputs",
      "Semantic HTML",
      "Accessibility basics",
      "SEO basics"
    ]
  },

  "CSS": {
    logo: "images/css.svg",
    topics: [
      "Selectors",
      "Box model",
      "Colors and typography",
      "Positioning",
      "Flexbox",
      "Grid",
      "Responsive design",
      "Transitions and animations",
      "CSS variables"
    ]
  },

  "JavaScript": {
    logo: "images/javascript.svg",
    topics: [
      "Variables and data types",
      "Functions",
      "Arrays and objects",
      "DOM manipulation",
      "Events",
      "Closures",
      "Promises and async/await",
      "Fetch API",
      "ES modules",
      "Error handling",
      "Local storage"
    ]
  },

  "Node.js": {
    logo: "images/nodejs.svg",
    topics: [
      "How Node works",
      "Modules",
      "npm",
      "File system",
      "HTTP module",
      "Environment variables",
      "Async patterns",
      "Error handling",
      "Testing",
      "Deployment"
    ]
  },

  "Express": {
    logo: "images/express.svg",
    topics: [
      "Setting up a server",
      "Routing",
      "Middleware",
      "Request and response",
      "REST API design",
      "Validation",
      "Authentication with JWT",
      "Error handling middleware",
      "CORS"
    ]
  },

  "MongoDB": {
    logo: "images/mongodb.svg",
    topics: [
      "Documents and collections",
      "CRUD operations",
      "Query operators",
      "Indexes",
      "Aggregation pipeline",
      "Data modeling",
      "Mongoose basics",
      "Transactions"
    ]
  },

  "React": {
    logo: "images/react.svg",
    topics: [
      "Components and JSX",
      "Props",
      "State",
      "Effects",
      "Lists and keys",
      "Forms",
      "Context",
      "Custom hooks",
      "Routing",
      "Performance basics"
    ]
  },

  "Next.js": {
    logo: "images/nextjs.svg",
    topics: [
      "Project structure",
      "Routing",
      "Server and client components",
      "Data fetching",
      "API routes",
      "Layouts",
      "Rendering strategies",
      "Deployment"
    ]
  },

  "SQL": {
    logo: "images/sql.svg",
    topics: [
      "SELECT and filtering",
      "Joins",
      "Grouping and aggregates",
      "Subqueries",
      "Creating tables",
      "Keys and constraints",
      "Normalization",
      "Indexes",
      "Transactions"
    ]
  },

  "Git & GitHub": {
    logo: "images/git.svg",
    topics: [
      "Init, add, commit",
      "Branches",
      "Merging",
      "Resolving conflicts",
      "Remotes and push",
      "Pull requests",
      "Rebase basics",
      ".gitignore"
    ]
  }
};
