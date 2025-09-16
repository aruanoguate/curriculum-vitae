const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');

async function generateResumePDF() {
    console.log('🚀 Starting PDF generation process...');
    
    let browser;
    try {
        // Launch browser
        console.log('📖 Launching browser...');
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu'
            ]
        });

        const page = await browser.newPage();

        // Set viewport for consistent rendering
        await page.setViewport({
            width: 1200,
            height: 1600,
            deviceScaleFactor: 2
        });

        // Read the HTML template
        console.log('📄 Reading HTML template...');
        const templatePath = path.join(__dirname, '..', 'resume-template.html');
        const htmlContent = await fs.readFile(templatePath, 'utf8');

        // Set the content
        await page.setContent(htmlContent, {
            waitUntil: 'networkidle0',
            timeout: 30000
        });

        // Generate PDF with optimized settings for ATS compatibility
        console.log('🎯 Generating PDF with ATS optimization...');
        const pdfBuffer = await page.pdf({
            format: 'Letter', // US Letter format (8.5" x 11")
            printBackground: false, // Ensure pure white background for ATS
            margin: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            },
            preferCSSPageSize: true,
            displayHeaderFooter: false,
            tagged: true, // Enable PDF tagging for accessibility and ATS
            outline: false, // Disable outline for cleaner PDF
            // Optimize for text extraction
            generateDocumentMetadata: true
        });

        // Ensure docs directory exists
        const docsDir = path.join(__dirname, '..', 'docs');
        await fs.ensureDir(docsDir);

        // Save PDF
        const pdfPath = path.join(docsDir, 'AlvaroRuano_Resume.pdf');
        await fs.writeFile(pdfPath, pdfBuffer);

        // Get file size for reporting
        const stats = await fs.stat(pdfPath);
        const fileSizeKB = Math.round(stats.size / 1024);

        console.log('✅ PDF generated successfully!');
        console.log(`📁 Location: ${pdfPath}`);
        console.log(`📏 File size: ${fileSizeKB} KB`);
        
        return pdfPath;

    } catch (error) {
        console.error('❌ Error generating PDF:', error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
            console.log('🔒 Browser closed');
        }
    }
}

// Run if called directly
if (require.main === module) {
    generateResumePDF()
        .then((pdfPath) => {
            console.log('\n🎉 Resume PDF generation completed successfully!');
            console.log(`📋 Your ATS-optimized resume is ready at: ${pdfPath}`);
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 PDF generation failed:', error);
            process.exit(1);
        });
}

module.exports = { generateResumePDF };