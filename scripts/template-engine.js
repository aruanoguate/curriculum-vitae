const fs = require('fs-extra');

class ResumeTemplateEngine {
  constructor(dataPath) {
    this.dataPath = dataPath;
    this.data = null;
  }

  // Helper method to get initials from full name
  static getInitials(fullName) {
    const nameParts = fullName.split(' ');
    if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase();
    return nameParts[0].charAt(0).toUpperCase() + nameParts[nameParts.length - 1].charAt(0).toUpperCase();
  }

  // Basic HTML escaping for meta / text fields that should not render HTML
  static escape(html) {
    if (typeof html !== 'string') return html;
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async loadData() {
    try {
      const dataContent = await fs.readFile(this.dataPath, 'utf8');
      this.data = JSON.parse(dataContent);
      return this.data;
    } catch (error) {
      throw new Error(`Failed to load resume data: ${error.message}`);
    }
  }

  generateWebsiteHTML() {
    if (!this.data) {
      throw new Error('Data not loaded. Call loadData() first.');
    }

    const { personal, summary, contact, experience, education, certifications, collaborations, interests, social, meta } = this.data;

    // Computed values for cleaner template
    const initials = ResumeTemplateEngine.getInitials(personal.name);
    const metaDescription = ResumeTemplateEngine.escape(meta.description);
    const metaKeywords = ResumeTemplateEngine.escape(meta.keywords);
    const metaAuthor = ResumeTemplateEngine.escape(meta.author);
    const metaCanonical = ResumeTemplateEngine.escape(meta.canonical);
    const googleAnalyticsId = meta.analytics?.googleAnalyticsId || '';

    return `<!DOCTYPE html>
<html lang="en">

<head>
${googleAnalyticsId ? `  <!-- Google Analytics GA4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(...args){dataLayer.push(...args);} 
    gtag('js', new Date());
    gtag('config', '${googleAnalyticsId}');
  </script>` : ''}

  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="description" content="${metaDescription}">
  <meta name="keywords" content="${metaKeywords}">
  <meta name="author" content="${metaAuthor}">
  <meta name="wot-verification" content="362806dc14a211a9e9bc" />
  <link rel="canonical" href="${metaCanonical}" />

  <title>${personal.name}</title>

  <!-- Favicons -->
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">

  <!-- Bootstrap core CSS -->
  <link href="vendor/bootstrap/css/bootstrap.min.css" rel="stylesheet">

  <!-- Custom fonts for this template -->
  <link href="https://fonts.googleapis.com/css?family=Saira+Extra+Condensed:500,700" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Muli:400,400i,800,800i" rel="stylesheet">
  <link href="vendor/fontawesome-free/css/all.min.css" rel="stylesheet">

  <!-- Custom styles for this template -->
  <link href="css/resume.min.css" rel="stylesheet">

</head>

<body id="page-top">

  <nav class="navbar navbar-expand-lg navbar-dark bg-primary fixed-top" id="sideNav">
    <a class="navbar-brand js-scroll-trigger" href="#page-top">
      <!-- Desktop version - full size profile image -->
      <span class="d-none d-lg-block">
        <img class="img-fluid img-profile rounded-circle mx-auto mb-2" src="${personal.profileImage}" alt="Profile photo of ${ResumeTemplateEngine.escape(personal.name)}">
      </span>
      <!-- Mobile version - compact profile with name/initials -->
      <span class="d-lg-none d-flex align-items-center">
        <img class="img-fluid img-profile-mobile rounded-circle me-2" src="${personal.profileImage}" alt="Profile photo of ${ResumeTemplateEngine.escape(personal.name)}">
        <span class="navbar-brand-text">${initials}</span>
      </span>
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav">
        <li class="nav-item">
          <a class="nav-link js-scroll-trigger" href="#about">About</a>
        </li>
        <li class="nav-item">
          <a class="nav-link js-scroll-trigger" href="#experience">Experience</a>
        </li>
        <li class="nav-item">
          <a class="nav-link js-scroll-trigger" href="#education">Education</a>
        </li>
        <li class="nav-item">
          <a class="nav-link js-scroll-trigger" href="#certifications">Certifications</a>
        </li>
        <li class="nav-item">
          <a class="nav-link js-scroll-trigger" href="#collaborations">Collaborations</a>
        </li>
        <li class="nav-item">
          <a class="nav-link js-scroll-trigger" href="#interests">Interests</a>
        </li>
      </ul>
    </div>
  </nav>

  <div class="container-fluid p-0">

    <section class="resume-section p-3 p-lg-5 d-flex align-items-center" id="about">
      <div class="w-100">
        <h2 class="mb-0 ">
          ${personal.name.split(' ').map((name, index) =>
      index === 1 ? `<span class="d-none d-sm-inline">${name}</span>` : name
    ).join(' ')}
        </h2>
        <br />
        <p class="lead mb-5">${summary.detailed}</p>
        
        <!-- Primary Links: LinkedIn & Resume -->
        <div class="contact-section-primary mb-4">
          <ul class="fa-ul mb-0">
${contact.primary.map(link => {
      const downloadAttr = link.download ? ` 
            download="${link.download}" type="application/pdf"` : '';
      return `            <li>
          <i class="fa-li ${link.icon}" aria-hidden="true"></i>
          <a href="${link.url}" 
            target="_blank" 
            rel="noopener"${downloadAttr} aria-label="${ResumeTemplateEngine.escape(link.text)}">${link.text}</a>
         </li>`;
    }).join('\n')}
          </ul>
        </div>

        <!-- Contact Information: Phone & Email -->
        <div class="contact-section-info mb-4">
          <ul class="fa-ul mb-0">
${contact.contact.map(link => `            <li>
          <i class="fa-li ${link.icon}" aria-hidden="true"></i>
          <a href="${link.url}" 
            target="_blank" 
            rel="noopener" aria-label="${ResumeTemplateEngine.escape(link.text)}">${link.text}</a>
         </li>`).join('\n')}
          </ul>
        </div>

        <!-- Additional Links: GitHub, SlideShare, etc. -->
        <div class="contact-section-links">
          <ul class="fa-ul mb-0">
${contact.links.map(link => `            <li>
          <i class="fa-li ${link.icon}" aria-hidden="true"></i>
          <a href="${link.url}" 
            target="_blank" 
            rel="noopener" aria-label="${ResumeTemplateEngine.escape(link.text)}">${link.text}</a>
         </li>`).join('\n')}
          </ul>
        </div>
      </div>
    </section>

    <hr class="m-0">

    <section class="resume-section p-3 p-lg-5 d-flex justify-content-center" id="experience">
      <div class="w-100">
        <h2 class="mb-5">Experience</h2>

${experience.map(job => `        <div class="resume-item d-flex flex-column flex-md-row justify-content-between mb-5">
          <div class="resume-content">
            <h3 class="mb-0">${job.title}</h3>
            <div class="subheading mb-3"><a href="${job.companyUrl}" target="_blank" rel="noopener">${job.company}</a></div>
            <div class="resume-date-mobile d-md-none">
              <span class="text-primary">${job.period}</span>
            </div>
            <p>${job.detailedDescription}</p>
          </div>
          <div class="resume-date text-md-end d-none d-md-block">
            <span class="text-primary">${job.period}</span>
          </div>
        </div>`).join('\n\n')}

      </div>
    </section>

    <hr class="m-0">

    <section class="resume-section p-3 p-lg-5 d-flex align-items-center" id="education">
      <div class="w-100">
        <h2 class="mb-5">Education</h2>

${education.map(edu => `        <div class="resume-item d-flex flex-column flex-md-row justify-content-between mb-5">
          <div class="resume-content">
            <h3 class="mb-0">${edu.institution}</h3>
            <div class="mb-3">
              <div class="subheading">${edu.degree}</div>
              ${edu.credentialUrl ? `<a href="${edu.credentialUrl}" target="_blank" rel="noopener">(See Credential)</a>` : ''}
            </div>
            <div class="resume-date-mobile d-md-none">
              <span class="text-primary">${edu.period}</span>
            </div>
            ${edu.achievements && edu.achievements.length > 0 ? `<ul class="fa-ul mb-0">
${edu.achievements.map(achievement => `              <li>
                <i class="fa-li fa fa-trophy text-warning"></i>
                ${achievement}
              </li>`).join('\n')}
            </ul>` : ''}
          </div>
          <div class="resume-date text-md-end d-none d-md-block">
            <span class="text-primary">${edu.period}</span>
          </div>
        </div>`).join('\n\n')}

      </div>
    </section>

    <hr class="m-0">

    <section class="resume-section p-3 p-lg-5 d-flex align-items-center" id="certifications">
      <div class="w-100">
        <h2 class="mb-5">Certifications</h2>

${certifications.map(cert => `        <div class="resume-item d-flex flex-column flex-md-row justify-content-between mb-5">
          <div class="resume-content">
            <h3 class="mb-0">${cert.name}</h3>
            <div class="subheading">${cert.issuer}</div>
            <a href="${cert.credentialUrl}" target="_blank"
              rel="noopener">(See Credential)</a>
          </div>
          <div class="resume-date text-md-end">
            <span class="text-primary">${cert.period}</span>
          </div>
        </div>`).join('\n\n')}
      </div>
    </section>

    <hr class="m-0">

    <section class="resume-section p-3 p-lg-5 d-flex align-items-center" id="collaborations">
      <div class="w-100">
        <h2 class="mb-5">Collaborations</h2>
  <p class="lead mb-5">I've been mentioned as collaborator on the below open source projects:</p>
        <ul class="fa-ul mb-0">
${collaborations.map(collab => {
      const versionLinks = collab.versions && collab.versions.length > 0
        ? collab.versions.map(version => `<a href="${version.url}" target="_blank" rel="noopener" class="text-muted">${version.version}</a>`).join(', ')
        : '';

      return `          <li>
            <i class="fa-li fa fa-check"></i>
            <a href="${collab.url}" target="_blank"
              rel="noopener">${collab.name}</a>: ${collab.role}
            ${versionLinks ? `
            <br><small class="text-muted mt-1 d-block">Versions: ${versionLinks}</small>` : ''}
          </li>`;
    }).join('\n')}
        </ul>
      </div>
    </section>

    <hr class="m-0">

    <section class="resume-section p-3 p-lg-5 d-flex align-items-center" id="interests">
      <div class="w-100">
        <h2 class="mb-5">Interests</h2>
        
        <!-- Summary and social icons layout -->
        <div class="row align-items-center">
          <div class="col-12 col-lg-8 col-xl-7">
            <p class="lead fs-4 mb-4 mb-lg-0">${interests.summary}</p>
          </div>
          
          <div class="col-12 col-lg-4 col-xl-5">
            <div class="social-section text-center text-lg-end mt-3 mt-lg-0">
              <div class="social-icons">
${social.map(link => `                <a href="${link.url}" target="_blank" rel="noopener" aria-label="${ResumeTemplateEngine.escape(link.platform)} profile link">
                  <i class="${link.icon}" aria-hidden="true"></i>
                </a>`).join('\n')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>

  <!-- Bootstrap core JavaScript -->
  <script src="vendor/jquery/jquery.min.js"></script>
  <script src="vendor/bootstrap/js/bootstrap.bundle.min.js"></script>

  <!-- Plugin JavaScript -->
  <script src="vendor/jquery-easing/jquery.easing.min.js"></script>

  <!-- Custom scripts for this template -->
  <script src="js/resume.min.js"></script>

</body>

</html>`;
  }

  generatePDFHTML() {
    if (!this.data) {
      throw new Error('Data not loaded. Call loadData() first.');
    }

    const { personal, summary, skills, experience, education, certifications, collaborations, languages } = this.data;

    return `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${personal.name} - Resume</title>
    <style>
        /* ATS-Optimized PDF Styles */
  // Resume PDF link dynamically uses personal.resumePdf path (generated)
        body {
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 10pt;
            line-height: 1.35;
            color: #000000;
            background: white;
            max-width: 8.5in;
            margin: 0 auto;
            padding: 0.4in;
        }

        /* Typography for ATS compatibility */
        h1 {
            font-size: 16pt;
            font-weight: bold;
            margin-bottom: 6pt;
            text-transform: none;
            color: #000000;
        }

        h2 {
            font-size: 12pt;
            font-weight: bold;
            margin-top: 10pt;
            margin-bottom: 4pt;
            border-bottom: 1px solid #000000;
            padding-bottom: 1pt;
            color: #000000;
        }

        h3 {
            font-size: 11pt;
            font-weight: bold;
            margin-top: 6pt;
            margin-bottom: 2pt;
            color: #000000;
        }

        h4 {
            font-size: 10pt;
            font-weight: bold;
            margin-bottom: 1pt;
            color: #000000;
        }

        p {
            margin-bottom: 4pt;
            text-align: justify;
        }

        /* Contact Information */
        .contact-info {
            margin-bottom: 12pt;
            text-align: center;
        }

        .contact-info p {
            margin-bottom: 1pt;
            text-align: center;
        }

        .contact-info h1 {
            margin-bottom: 4pt;
        }

        /* Link styles for PDF */
        a {
            color: #000000;
            text-decoration: none;
        }

        a:hover {
            text-decoration: underline;
        }

        /* Ensure links are clickable in PDF */
        @media print {
            a {
                color: #000000;
                text-decoration: none;
            }
        }

        /* Experience and Education Items */
        .resume-item {
            margin-bottom: 8pt;
            break-inside: avoid;
        }

        .job-header {
            display: flex;
            justify-content: space-between;
            align-items: baseline;
            margin-bottom: 2pt;
        }

        .job-title {
            font-weight: bold;
            font-size: 10pt;
        }

        .company {
            font-weight: normal;
            font-style: italic;
            margin-bottom: 1pt;
            font-size: 9pt;
        }

        .date-range {
            font-weight: normal;
            font-style: italic;
            white-space: nowrap;
            font-size: 9pt;
        }

        /* Lists */
        ul {
            margin-left: 14pt;
            margin-bottom: 4pt;
        }

        li {
            margin-bottom: 1pt;
            line-height: 1.3;
        }

        /* Skills section - optimized for space */
        .skills-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 6pt;
            margin-bottom: 8pt;
        }

        .skill-category {
            margin-bottom: 4pt;
        }

        .skill-category h4 {
            margin-bottom: 2pt;
        }

        .skill-category ul {
            margin-bottom: 2pt;
        }

        .skill-category li {
            margin-bottom: 0.5pt;
        }

        /* Certifications */
        .cert-item {
            margin-bottom: 3pt;
            font-size: 9pt;
        }

        .cert-name {
            font-weight: bold;
        }

        .cert-issuer {
            font-style: italic;
        }

        /* Compact sections */
        .compact-section {
            margin-bottom: 8pt;
        }

        .compact-section h2 {
            margin-top: 8pt;
            margin-bottom: 3pt;
        }

        .compact-section ul {
            margin-bottom: 3pt;
        }

        .compact-section li {
            margin-bottom: 0.5pt;
        }

        /* Professional summary optimization */
        .professional-summary {
            margin-bottom: 10pt;
        }

        .professional-summary h2 {
            margin-top: 8pt;
        }

        .professional-summary p {
            margin-bottom: 3pt;
        }

        /* Page break handling */
        @media print {
            body {
                padding: 0.25in;
                font-size: 9pt;
            }
            
            .page-break {
                page-break-before: always;
            }
            
            .no-break {
                break-inside: avoid;
            }

            h2 {
                font-size: 11pt;
            }

            h3 {
                font-size: 10pt;
            }
        }

        /* Remove any decorative elements for ATS */
        .decorative {
            display: none;
        }

        /* Ensure text is selectable and searchable */
        body, p, h1, h2, h3, h4, h5, h6, li, span, div {
            -webkit-user-select: text;
            -moz-user-select: text;
            -ms-user-select: text;
            user-select: text;
        }
    </style>
</head>

<body>
    <!-- Header -->
    <header class="contact-info">
        <h1>${personal.name}</h1>
        <p>${personal.location} | ${personal.phone} | <a href="mailto:${personal.email}">${personal.email}</a></p>
        <p><a href="${personal.linkedin}" target="_blank">LinkedIn: linkedin.com/in/aruanoguate</a> | <a href="${personal.github}" target="_blank">GitHub: github.com/aruanoguate</a></p>
    </header>

    <!-- Professional Summary -->
    <section class="professional-summary">
        <h2>Professional Summary</h2>
        <p>${summary.detailed}</p>
    </section>

    <!-- Core Competencies -->
    <section>
        <h2>Core Competencies</h2>
        <div class="skills-grid">
            <div class="skill-category">
                <h4>Leadership & Management</h4>
                <ul>
${skills.leadership.map(skill => `                    <li>${skill}</li>`).join('\n')}
                </ul>
            </div>
            <div class="skill-category">
                <h4>Technical Expertise</h4>
                <ul>
${skills.technical.map(skill => `                    <li>${skill}</li>`).join('\n')}
                </ul>
            </div>
        </div>
    </section>

    <!-- Professional Experience -->
    <section>
        <h2>Professional Experience</h2>

${experience.map(job => `        <div class="resume-item">
            <div class="job-header">
                <div>
                    <h3 class="job-title">${job.title}</h3>
                    <p class="company">${job.company}</p>
                </div>
                <span class="date-range">${job.period}</span>
            </div>
            <p>${job.detailedDescription}</p>
        </div>`).join('\n\n')}
    </section>

    <!-- Education -->
    <section>
        <h2>Education</h2>

${education.map(edu => `        <div class="resume-item">
            <div class="job-header">
                <div>
                    <h3>${edu.degree}</h3>
                    <p class="company">${edu.institution}</p>
                </div>
                <span class="date-range">${edu.period}</span>
            </div>
            ${edu.achievements && edu.achievements.length > 0 ? `<p><strong>${edu.achievements.join(', ')}</strong></p>` : ''}
        </div>`).join('\n\n')}
    </section>

    <!-- Certifications -->
    <section class="compact-section">
        <h2>Certifications</h2>

${certifications.map(cert => `        <div class="cert-item">
            <span class="cert-name">${cert.name}</span> | 
            <span class="cert-issuer">${cert.issuer}</span> | 
            <span class="date-range">${cert.period}</span>
        </div>`).join('\n\n')}
    </section>

    <!-- Open Source Contributions -->
    <section class="compact-section">
        <h2>Open Source Contributions</h2>
        <ul>
${collaborations.map(collab => `            <li><strong>${collab.name}</strong> - ${collab.description}</li>`).join('\n')}
        </ul>
    </section>

    <!-- Additional Information -->
    <section class="compact-section">
        <h2>Additional Information</h2>
        <ul>
            <li><strong>Languages:</strong> ${languages.map(lang => `${lang.language} (${lang.proficiency})`).join(', ')}</li>
            <li><strong>Interests:</strong> ${this.data.interests.detailed.join(', ')}</li>
            <li><strong>Location:</strong> ${personal.location} (Open to remote work)</li>
        </ul>
    </section>
</body>

</html>`;
  }

  async generateWebsite(outputPath) {
    const html = this.generateWebsiteHTML();
    await fs.writeFile(outputPath, html, 'utf8');
    console.log(`✅ Website generated: ${outputPath}`);
  }

  async generatePDFTemplate(outputPath) {
    const html = this.generatePDFHTML();
    await fs.writeFile(outputPath, html, 'utf8');
    console.log(`✅ PDF template generated: ${outputPath}`);
  }

  async generateAll(websitePath, pdfTemplatePath) {
    await this.loadData();
    await Promise.all([
      this.generateWebsite(websitePath),
      this.generatePDFTemplate(pdfTemplatePath)
    ]);
    console.log('🎉 All templates generated successfully!');
  }
}

module.exports = ResumeTemplateEngine;