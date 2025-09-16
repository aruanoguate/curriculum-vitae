# Alvaro Ruano - Curriculum Vitae

A modern, responsive curriculum vitae and portfolio website built with Bootstrap 5, Sass, and automated CI/CD deployment.

🌐 **Live Site**: [https://alvaroruano.me/](https://alvaroruano.me/)  
📋 **GitHub Pages**: [https://aruanoguate.github.io/curriculum-vitae/](https://aruanoguate.github.io/curriculum-vitae/)

## 🛠️ Technology Stack

- **Frontend Framework**: Bootstrap 5.3.8
- **Styling**: Sass/SCSS with modern `@use` syntax
- **Icons**: FontAwesome 7.0.1
- **JavaScript**: jQuery 3.7.1 + jQuery Easing
- **Build System**: Gulp 4 with sass-embedded
- **CI/CD**: GitHub Actions
- **Hosting**: GitHub Pages

## 🚀 Getting Started

### Prerequisites

- **Node.js 22+** (recommended)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/aruanoguate/curriculum-vitae.git
   cd curriculum-vitae
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build the project** (generates CSS and vendor files)
   ```bash
   npm run build
   ```

## 🔨 Development Workflow

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build CSS and vendor files for production |
| `npm run dev` | Start development server with live reload + file watching |

### Development Process

**For active development** (recommended):
```bash
npm run dev
```

This command runs two processes simultaneously:
- **Gulp Watch**: Monitors SCSS and JS files, rebuilds automatically
- **Live Server**: Serves the site at `http://localhost:8000` with browser auto-refresh

### What happens during development:

1. **SCSS Changes**: 
   - Files in `scss/` are compiled to `css/resume.css` and `css/resume.min.css`
   - Browser automatically refreshes to show changes

2. **JavaScript Changes**: 
   - Files in `js/` are minified to `js/*.min.js`
   - Browser automatically refreshes

3. **HTML Changes**: 
   - Browser automatically refreshes when `index.html` is modified

## 📁 Project Structure

```
curriculum-vitae/
├── .github/workflows/    # GitHub Actions CI/CD
├── css/                  # Generated CSS files (git-ignored)
├── docs/                 # PDF resume and certificates
├── img/                  # Profile images and assets
├── js/                   # JavaScript source and minified files
├── scss/                 # Sass source files
├── vendor/              # Generated vendor libraries (git-ignored)
├── gulpfile.js          # Build configuration
├── index.html           # Main HTML file
└── package.json         # Dependencies and scripts
```

### Source Files (Edit These)

- **`scss/`** - All styling source files
  - `resume.scss` - Main stylesheet entry point
  - `_variables.scss` - Color and spacing variables
  - `_global.scss` - Global styles and typography
  - `_nav.scss` - Navigation styles
  - `_resume-item.scss` - Resume section styles
  - `_bootstrap-overrides.scss` - Bootstrap customizations

- **`js/resume.js`** - Custom JavaScript functionality
- **`index.html`** - Main HTML content

### Generated Files (Do Not Edit)

- **`css/`** - Compiled CSS output
- **`vendor/`** - Third-party libraries (Bootstrap, FontAwesome, jQuery)

## 🚢 Deployment

### Automatic Deployment

The project uses **GitHub Actions** for automatic deployment:

1. **Push to `master`** triggers the workflow
2. **Dependencies installed** with Node.js 22
3. **Build process runs** (`npm run build`)
4. **Site deployed** to GitHub Pages automatically

### Manual Deployment

For manual deployment to any static hosting:

```bash
npm run build
# Upload the entire project folder to your hosting provider
```

## 🎨 Customization

### Styling

1. **Edit SCSS files** in the `scss/` directory
2. **Run development server**: `npm run dev`
3. **See changes instantly** in the browser

### Content

1. **Edit `index.html`** for content changes
2. **Update profile image** in `img/profile.jpg`
3. **Add documents** to `docs/` folder

### Colors and Variables

Edit `scss/_variables.scss` to customize:
- Primary colors
- Font families
- Spacing values
- Breakpoints

## 🔧 Build System Details

### Gulp Tasks

- **`clean`**: Removes `vendor/` directory
- **`modules`**: Copies dependencies from `node_modules` to `vendor/`
- **`css`**: Compiles SCSS → CSS, adds autoprefixer, creates minified version
- **`js`**: Minifies JavaScript files
- **`watch`**: Monitors files for changes and rebuilds automatically

### Sass Configuration

- Uses **sass-embedded** for fastest compilation
- Modern **`@use`** syntax instead of deprecated `@import`
- **Autoprefixer** for cross-browser compatibility
- **Source maps** for easier debugging

## 🔒 Security

- **Dependencies updated** to latest stable versions
- **No known vulnerabilities** in production dependencies
- **Secure deployment** via GitHub Actions
- **HTTPS enabled** on GitHub Pages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ by Alvaro Ruano**
