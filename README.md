# Modern Resume Builder 📄

A data-driven resume system that generates both a responsive website and ATS-optimized PDF from a single JSON file.

🌐 **Live Demo**: [alvaroruano.me](https://alvaroruano.me/)

## ✨ What Makes This Special

- **Edit once, update everywhere** - Single JSON file powers both website and PDF
- **ATS-optimized** - PDF designed to pass applicant tracking systems  
- **Fully accessible** - WCAG 2.1 AA compliant for screen readers
- **Auto-deployment** - Push to GitHub, site updates automatically

## 🚀 Quick Start

```bash
# Clone and setup
git clone https://github.com/aruanoguate/curriculum-vitae.git
cd curriculum-vitae
npm install

# Build everything 
npm run build

# Development with live reload
npm run dev
```

Open `http://localhost:8000` to see your site!

## 📝 How to Use

### 1. Edit Your Resume Data
All content lives in **`data/resume-data.json`**:

```json
{
  "personal": {
    "name": "Your Name",
    "title": "Your Job Title",
    "email": "you@example.com"
  },
  "experience": [
    {
      "title": "Senior Developer",
      "company": "Amazing Corp",
      "period": "2020 - Present",
      "detailedDescription": "Built awesome things..."
    }
  ]
}
```

### 2. Customize Styling
Edit SCSS files in `scss/` directory:
- `_variables.scss` - Colors and fonts
- `_global.scss` - General styles  
- `resume.scss` - Main styles

### 3. Build & Deploy
```bash
npm run build  # Generates website + PDF
```

The `dist/` folder contains everything ready for deployment.

## 📁 Project Structure

```
├── data/resume-data.json     # 📊 Your resume content (edit this!)
├── scss/                     # 🎨 Styling source files
├── scripts/                  # ⚙️ Build and template generation
├── dist/                     # 🚀 Generated website (deploy this)
└── docs/                     # 📄 Static files (certs, images)
```

## 🛠️ Commands

| Command | What it does |
|---------|-------------|
| `npm run build` | Generate complete website + PDF |
| `npm run dev` | Development server with live reload |
| `npm run build-pdf` | Generate PDF only |

## 🎯 Features

- **Responsive Design** - Looks great on all devices
- **PDF Generation** - Professional resume PDF with ATS optimization
- **Live Reload** - See changes instantly during development  
- **GitHub Actions** - Automatic deployment to GitHub Pages
- **Accessibility** - Screen reader friendly with proper semantics
- **Fast Build** - Complete rebuild in under 15 seconds

## 🔧 Customization

**Change colors/fonts**: Edit `scss/_variables.scss`  
**Update content**: Edit `data/resume-data.json`  
**Add new sections**: Modify `scripts/template-engine.js`  
**Replace profile photo**: Update `img/profile.jpg`

## 📄 License

MIT License - feel free to use this for your own resume!

---

**Questions?** Check the [full documentation](docs/) or open an issue.