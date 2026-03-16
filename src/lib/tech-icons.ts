// Mapping of technology names to Devicon CSS classes (all lowercase keys)
export const techIconMap: Record<string, string> = {
  // Programming Languages
  javascript: 'devicon-javascript-plain',
  js: 'devicon-javascript-plain',
  typescript: 'devicon-typescript-plain',
  ts: 'devicon-typescript-plain',
  python: 'devicon-python-plain',
  java: 'devicon-java-plain',
  golang: 'devicon-go-plain',
  go: 'devicon-go-plain',
  rust: 'devicon-rust-plain',
  'c++': 'devicon-cplusplus-plain',
  cpp: 'devicon-cplusplus-plain',
  c: 'devicon-c-plain',
  'c#': 'devicon-csharp-plain',
  csharp: 'devicon-csharp-plain',
  php: 'devicon-php-plain',
  ruby: 'devicon-ruby-plain',
  swift: 'devicon-swift-plain',
  kotlin: 'devicon-kotlin-plain',
  dart: 'devicon-dart-plain',
  scala: 'devicon-scala-plain',
  elixir: 'devicon-elixir-plain',
  clojure: 'devicon-clojure-plain',
  haskell: 'devicon-haskell-plain',

  // Frontend Frameworks & Libraries
  react: 'devicon-react-original',
  reactjs: 'devicon-react-original',
  vue: 'devicon-vuejs-plain',
  vuejs: 'devicon-vuejs-plain',
  angular: 'devicon-angularjs-plain',
  svelte: 'devicon-svelte-plain',
  'next.js': 'devicon-nextjs-plain',
  nextjs: 'devicon-nextjs-plain',
  nuxt: 'devicon-nuxtjs-plain',
  nuxtjs: 'devicon-nuxtjs-plain',

  // Backend & Runtime
  'node.js': 'devicon-nodejs-plain',
  nodejs: 'devicon-nodejs-plain',
  express: 'devicon-express-original',
  expressjs: 'devicon-express-original',
  fastapi: 'devicon-fastapi-plain',
  flask: 'devicon-flask-original',
  django: 'devicon-django-plain',
  spring: 'devicon-spring-plain',
  'spring boot': 'devicon-spring-plain',
  laravel: 'devicon-laravel-plain',
  rails: 'devicon-rails-plain',
  'ruby on rails': 'devicon-rails-plain',

  // DevOps & Infrastructure
  docker: 'devicon-docker-plain',
  kubernetes: 'devicon-kubernetes-plain',
  k8s: 'devicon-kubernetes-plain',
  aws: 'devicon-amazonwebservices-original',
  'amazon web services': 'devicon-amazonwebservices-original',
  gcp: 'devicon-googlecloud-plain',
  'google cloud': 'devicon-googlecloud-plain',
  azure: 'devicon-azure-plain',
  'microsoft azure': 'devicon-azure-plain',
  vercel: 'devicon-vercel-plain',
  netlify: 'devicon-netlify-plain',
  heroku: 'devicon-heroku-plain',

  // Databases
  mongodb: 'devicon-mongodb-plain',
  mongo: 'devicon-mongodb-plain',
  postgresql: 'devicon-postgresql-plain',
  postgres: 'devicon-postgresql-plain',
  mysql: 'devicon-mysql-plain',
  redis: 'devicon-redis-plain',
  sqlite: 'devicon-sqlite-plain',
  firebase: 'devicon-firebase-plain',

  // Version Control & Tools
  git: 'devicon-git-plain',
  github: 'devicon-github-original',
  gitlab: 'devicon-gitlab-plain',
  'visual studio code': 'devicon-vscode-plain',
  vscode: 'devicon-vscode-plain',
  'vs code': 'devicon-vscode-plain',

  // Build Tools & Bundlers
  webpack: 'devicon-webpack-plain',
  vite: 'devicon-vite-plain',
  npm: 'devicon-npm-original-wordmark',
  yarn: 'devicon-yarn-plain',

  // CSS & Styling
  tailwind: 'devicon-tailwindcss-plain',
  tailwindcss: 'devicon-tailwindcss-plain',
  bootstrap: 'devicon-bootstrap-plain',
  sass: 'devicon-sass-original',
  scss: 'devicon-sass-original',
  less: 'devicon-less-plain-wordmark',

  // Testing
  jest: 'devicon-jest-plain',

  // Operating Systems
  linux: 'devicon-linux-plain',
  ubuntu: 'devicon-ubuntu-plain',
  debian: 'devicon-debian-plain',
  centos: 'devicon-centos-plain',
  windows: 'devicon-windows8-original',

  // Package Managers & Build Tools
  gradle: 'devicon-gradle-plain',
  maven: 'devicon-maven-plain',
  composer: 'devicon-composer-line-wordmark',

  // Mobile Development
  android: 'devicon-android-plain',
  ios: 'devicon-apple-original',
  flutter: 'devicon-flutter-plain',
  ionic: 'devicon-ionic-original',

  // Markup & Data Formats
  html: 'devicon-html5-plain',
  html5: 'devicon-html5-plain',
  css: 'devicon-css3-plain',
  css3: 'devicon-css3-plain',

  // Additional tags from projects
  api: 'devicon-openapi-plain',
  'web scraping': 'devicon-webpack-plain',
  'data processing': 'devicon-azuresqldatabase-plain',
}

/**
 * Get the Devicon CSS class for a given technology tag
 * @param tag - The technology tag (case-insensitive)
 * @returns The corresponding Devicon CSS class or null if not found
 */
export function getTechIconClass(tag: string): string | null {
  return techIconMap[tag.toLowerCase()] || null
}

/**
 * Check if a technology tag has an associated icon
 * @param tag - The technology tag
 * @returns true if an icon exists for the tag
 */
export function hasTechIcon(tag: string): boolean {
  return getTechIconClass(tag) !== null
}

/**
 * Get all available technology tags that have icons
 * @returns Array of technology tag names
 */
export function getAvailableTechTags(): string[] {
  return Object.keys(techIconMap)
}
