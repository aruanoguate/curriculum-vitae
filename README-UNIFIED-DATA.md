# Unified Resume Data Source

This project now uses a unified data source approach where both the website and PDF are generated from the same JSON data file.

## How it works

### Data Source
All resume information is stored in `data/resume-data.json`. This includes:
- Personal information and contact details
- Professional summary
- Work experience
- Education
- Certifications
- Skills
- Open source collaborations
- Interests and social links

### Template Generation
The `scripts/template-engine.js` file contains a `ResumeTemplateEngine` class that:
- Reads the JSON data
- Generates the main website HTML (`index.html`)
- Generates the PDF-optimized HTML template (`resume-template.html`)

### Build Process
Use `npm run build-resume` to generate both outputs from the unified data source:

```bash
npm run build-resume
```

This command will:
1. Load the data from `data/resume-data.json`
2. Generate `index.html` (the website)
3. Generate `resume-template.html` (PDF template)
4. Generate `docs/AlvaroRuano_Resume.pdf` from the template

## Available Scripts

- `npm run build-resume` - Generate both website and PDF from data source
- `npm run generate-pdf` - Generate only the PDF
- `npm run dev` - Start development server with file watching
- `npm run build` - Build CSS/JS assets only
- `npm run build-all` - Build assets and generate PDF (legacy)

## Updating Resume Information

To update your resume:

1. Edit `data/resume-data.json` with new information
2. Run `npm run build-resume` to regenerate all files
3. Both the website and PDF will be automatically synchronized

## Benefits

- **Single source of truth**: All information is maintained in one place
- **Automatic synchronization**: Website and PDF are always in sync
- **Easy updates**: Change data once, regenerate everywhere
- **Version control friendly**: JSON format works well with Git diffs
- **Maintainable**: Clear separation between data and presentation

## File Structure

```
├── data/
│   └── resume-data.json          # Single source of truth for all resume data
├── dist/                         # Generated output directory (excluded from Git)
│   ├── index.html               # Generated website
│   ├── resume-template.html     # Generated PDF template
│   ├── docs/
│   │   └── AlvaroRuano_Resume.pdf  # Generated PDF
│   ├── css/                     # Copied CSS assets
│   ├── js/                      # Copied JavaScript assets
│   ├── img/                     # Copied images
│   ├── vendor/                  # Copied vendor libraries
│   └── [other static assets]    # Favicons, etc.
├── scripts/
│   ├── template-engine.js        # Generates HTML from data
│   ├── build-resume.js          # Main build script
│   └── generate-pdf.js          # PDF generation using Puppeteer
└── [source files]              # Source CSS, images, vendor libs, etc.
```

## Benefits

- **Single source of truth**: All information is maintained in one place
- **Automatic synchronization**: Website and PDF are always in sync
- **Easy updates**: Change data once, regenerate everywhere
- **Version control friendly**: JSON format works well with Git diffs
- **Maintainable**: Clear separation between data and presentation
- **Build separation**: Generated files are kept separate from source code
- **Deploy ready**: The `dist/` directory contains everything needed for deployment

## Legacy Files

The old manual approach files are no longer used but kept for reference:
- Previous versions of `index.html` and `resume-template.html` were manually maintained
- Now they are generated automatically from the data source and output to `dist/`

⚠️ **Important**: 
- Do not edit files in the `dist/` directory directly - they will be overwritten on next build
- Do not commit the `dist/` directory to version control (it's in .gitignore)
- Always edit `data/resume-data.json` and regenerate using `npm run build-resume`