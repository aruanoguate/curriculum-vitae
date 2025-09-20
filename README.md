# Alvaro Ruano - Curriculum Vitae

A modern, responsive curriculum vitae and portfolio website with automated PDF generation, built using a unified data-driven approach.

🌐 **Live Site**: [https://alvaroruano.me/](https://alvaroruano.me/)  
📋 **GitHub Pages**: [https://aruanoguate.github.io/curriculum-vitae/](https://aruanoguate.github.io/curriculum-vitae/)

## 🛠️ Technology Stack

- **Frontend Framework**: Bootstrap 5.3.8
- **Styling**: Sass/SCSS with modern `@use` syntax
- **Icons**: FontAwesome 7.0.1
- **JavaScript**: jQuery 3.7.1 + jQuery Easing
- **Build System**: Gulp 4 with sass-embedded
- **PDF Generation**: Puppeteer with ATS optimization
- **Template Engine**: Custom JSON-to-HTML generator
- **CI/CD**: GitHub Actions
- **Hosting**: GitHub Pages

## ✨ Key Features

### Unified Data Source
- **Single source of truth**: All resume information stored in `data/resume-data.json`
- **Automatic synchronization**: Website and PDF generated from same data
- **Easy maintenance**: Update once, regenerate everywhere

### ATS-Optimized PDF Generation
- **2025 best practices**: Clean, semantic structure for Applicant Tracking Systems
- **Professional formatting**: Standard sections, consistent typography
- **Searchable content**: Tagged PDF with proper text extraction
- **High compatibility**: Works with all major ATS platforms

### Modern Development Workflow
- **Live reload**: Instant browser refresh during development
- **File watching**: Automatic rebuilds on changes
- **Production ready**: Optimized builds for deployment

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

3. **Generate the website and PDF**
   ```bash
   npm run build
   ```

## 🔨 Development Workflow

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run build` | **Main command**: Complete website with PDF generation |
| `npm run build-pdf` | **Debug command**: Generate PDF only (for testing) |
| `npm run dev` | Start development server with live reload + file watching |

### Development Process

**For active development** (recommended):
```bash
npm run dev
```

This command starts a single integrated Gulp + BrowserSync development server:
- Rebuilds SCSS → CSS (min + non‑min)
- Minifies JavaScript
- Regenerates website + PDF template + PDF on data/script changes
- Live-reloads the browser at `http://localhost:8000`

PDF generation intentionally runs even in dev so the downloadable resume always stays in sync while you iterate.

### Updating Resume Content

1. **Edit the data file**: `data/resume-data.json`
2. **Regenerate everything**: `npm run build`
3. **Both website and PDF are automatically updated**

### What happens during development:

1. **Data Changes**: 
   - `data/resume-data.json` modifications trigger full website regeneration
   - Both `index.html` and PDF template are rebuilt

2. **SCSS Changes**: 
   - Files in `scss/` are compiled to `css/resume.css` and `css/resume.min.css`
   - Browser automatically refreshes to show changes

3. **JavaScript Changes**: 
   - Files in `js/` are minified to `js/*.min.js`
   - Browser automatically refreshes

## 📁 Project Structure

```
curriculum-vitae/
├── .github/workflows/    # GitHub Actions CI/CD
├── data/
│   └── resume-data.json  # 📊 SINGLE SOURCE OF TRUTH - Edit this file
├── scripts/
│   ├── template-engine.js   # Generates HTML from JSON data
│   ├── build-resume.js      # Main build orchestrator
│   └── generate-pdf.js      # PDF generation with Puppeteer
├── dist/                 # 🚀 Generated output (deployment ready)
│   ├── index.html        # Generated website
│   ├── resume-template.html # Generated PDF template
│   ├── generated-pdf/    # Auto-generated PDFs (resume)
│   │   └── AlvaroRuano_Resume.pdf
│   ├── docs/             # Static assets (certifications, diplomas, images)
│   ├── css/             # Compiled CSS files
│   ├── js/              # Minified JavaScript
│   ├── img/             # Images and assets
│   └── vendor/          # Third-party libraries
├── scss/                # 🎨 Sass source files
├── img/                 # Original images and assets
├── js/                  # JavaScript source files
├── vendor/              # Generated vendor libraries (git-ignored)
├── gulpfile.js         # Build configuration
└── package.json        # Dependencies and scripts
```

### Source Files (Edit These)

- **`data/resume-data.json`** - **Main content source** (personal info, experience, skills)
- **`scss/`** - All styling source files
  - `resume.scss` - Main stylesheet entry point
  - `_variables.scss` - Color and spacing variables
  - `_global.scss` - Global styles and typography
  - `_nav.scss` - Navigation styles
  - `_resume-item.scss` - Resume section styles
  - `_bootstrap-overrides.scss` - Bootstrap customizations
- **`js/resume.js`** - Custom JavaScript functionality
- **`img/profile.jpg`** - Profile image

### Generated Files (Do Not Edit)

- **`dist/`** - Complete deployment-ready output
- **`css/`** - Compiled CSS output
- **`vendor/`** - Third-party libraries (Bootstrap, FontAwesome, jQuery)

## 📑 Data Structure

All content lives in `data/resume-data.json` as the single source of truth. A simplified shape of the current schema:

```jsonc
{
   "personal": {
      "name": "Alvaro Enrique Ruano",
      "shortName": "Alvaro Ruano",
      "title": "Director of Engineering",
      "location": "…",
      "phone": "…",
      "email": "…",
      "website": "…",
      "linkedin": "…",
      "github": "…",
      "profileImage": "img/profile.jpg",
      "resumePdf": "docs/AlvaroRuano_Resume.pdf"
   },
   "summary": { "detailed": "HTML-enabled summary (allows <br>)" },
   "contact": { "links": [ { "icon": "fas fa-…", "text": "…", "url": "…" } ] },
   "experience": [ { "title": "…", "company": "…", "period": "…", "detailedDescription": "HTML-enabled" } ],
   "education": [ { "degree": "…", "institution": "…", "period": "…", "achievements": ["…"] } ],
   "certifications": [ { "name": "…", "issuer": "…", "period": "…", "credentialUrl": "…" } ],
   "skills": { "leadership": ["…"], "technical": ["…"] },
   "collaborations": [ { "name": "…", "role": "…", "url": "…", "description": "…" } ],
   "interests": { "summary": "…", "detailed": ["…"] },
   "social": [ { "platform": "…", "url": "…", "icon": "…" } ],
   "languages": [ { "language": "…", "proficiency": "…" } ],
   "meta": { "description": "…", "keywords": "…", "author": "…", "canonical": "…", "lastUpdated": "YYYY-MM-DD" }
}
```

## 📄 PDF Generation Features

### ATS Optimization (2025 Best Practices)
- **Clean semantic HTML**: Proper heading hierarchy and markup
- **Standard section headings**: Experience, Education, Skills, etc.
- **Consistent formatting**: Uniform spacing and typography
- **Keyword optimization**: Industry-relevant terms naturally integrated
- **Text-based content**: No images or graphics that confuse ATS systems
- **Tagged PDF**: Enhanced accessibility and text extraction
- **Letter format**: Standard US Letter size (8.5" x 11")

### Technical Implementation
- **Puppeteer-based**: Uses headless Chrome for consistent output
- **Automatic integration**: Built into the main build process
- **Optimized file size**: ~158KB, web-optimized for sharing
- **Cross-platform**: Works on all major operating systems
- **Professional styling**: Clean, modern design for human readers

## �🚢 Deployment

### Automatic Deployment

The project uses **GitHub Actions** for automatic deployment:

1. **Push to `master`** triggers the workflow
2. **Dependencies installed** with Node.js 22
3. **Full build process runs** (`npm run build`)
4. **Site deployed** to GitHub Pages automatically

The deployed site includes:
- Responsive website with all content
- Downloadable ATS-optimized PDF resume
- All static assets (CSS, JS, images)

### Manual Deployment

For manual deployment to any static hosting:

```bash
npm run build
# Upload the entire 'dist/' directory to your hosting provider
```

## 🎨 Customization

### Content Updates

1. **Edit `data/resume-data.json`** with your information
2. **Run `npm run build`** to regenerate everything
3. **Both website and PDF are automatically synchronized**

### Styling Customization

1. **Edit SCSS files** in the `scss/` directory
2. **Run development server**: `npm run dev`
3. **See changes instantly** in the browser

### Visual Assets

1. **Update profile image**: Replace `img/profile.jpg`
2. **Add documents**: Place files in `docs/` folder
3. **Customize colors**: Edit `scss/_variables.scss`

## 🔧 Build System Details

### Template Engine

The `ResumeTemplateEngine` class:
- Reads JSON data from `data/resume-data.json`
- Generates website HTML with full styling and interactivity
- Creates ATS-optimized PDF template with clean formatting
- Handles data validation and error reporting

### Gulp Tasks

- **`buildResume`**: Main task that generates website and PDF from data
- **`clean`**: Removes generated directories
- **`modules`**: Copies dependencies from `node_modules` to `vendor/`
- **`css`**: Compiles SCSS → CSS, adds autoprefixer, creates minified version
- **`js`**: Minifies JavaScript files
- **`pdf`**: Generates PDF from template using Puppeteer
- **`watch`**: Monitors files for changes and rebuilds automatically

### Sass Configuration

- Uses **sass-embedded** for fastest compilation
- Modern **`@use`** syntax instead of deprecated `@import`
- **Autoprefixer** for cross-browser compatibility
- **Source maps** for easier debugging

## 🔒 Security

- Dependencies are routinely updated; run `npm audit` to view current status.
- GitHub Actions workflow builds from source and deploys static output only.
- HTTPS enforced via GitHub Pages.
- Puppeteer runs headless Chromium with restricted flags suitable for static HTML → PDF generation.
- Recommendation: periodically run `npm audit fix` (review changes first) and keep Node version aligned with `.nvmrc`.

> Note: Previous README wording claiming “No known vulnerabilities” was removed—security posture is dynamic and should be verified at build time.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💡 Tips for Success

### For Job Applications
- The generated PDF is optimized for ATS systems used by most companies
- Keywords are naturally integrated throughout the content
- Standard formatting ensures compatibility with all major recruitment platforms

### For Maintenance
- Always edit `data/resume-data.json` instead of generated HTML files
- Use `npm run build` to regenerate after any data changes
- The `dist/` directory contains everything needed for deployment
- Version control tracks only source files, not generated output

### For Customization
- Modify `scss/_variables.scss` for color and typography changes
- Update `scripts/template-engine.js` for layout modifications
- Edit `data/resume-data.json` structure for new content sections

---

**Built with ❤️ by Alvaro Ruano**  
*A modern, data-driven approach to professional portfolio management*
