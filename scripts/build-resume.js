const ResumeTemplateEngine = require('./template-engine');
const { generateResumePDF } = require('./generate-pdf');
const fs = require('fs-extra');
const path = require('path');

async function buildResume() {
    console.log('🏗️  Starting resume build process...');
    
    try {
        // Paths
        const dataPath = path.join(__dirname, '..', 'data', 'resume-data.json');
        const distDir = path.join(__dirname, '..', 'dist');
        const websitePath = path.join(distDir, 'index.html');
        const pdfTemplatePath = path.join(distDir, 'resume-template.html');
        
        // Ensure dist directory exists
        console.log('📁 Creating dist directory...');
        await fs.ensureDir(distDir);
        await fs.ensureDir(path.join(distDir, 'docs'));
        
        // Copy static assets to dist
        console.log('📋 Copying static assets...');
        const staticDirs = ['css', 'js', 'img', 'vendor'];
        const staticFiles = [
            'android-chrome-192x192.png',
            'android-chrome-512x512.png', 
            'apple-touch-icon.png',
            'favicon-16x16.png',
            'favicon-32x32.png',
            'favicon.ico',
            'site.webmanifest'
        ];
        
        // Copy directories
        for (const dir of staticDirs) {
            const srcDir = path.join(__dirname, '..', dir);
            const destDir = path.join(distDir, dir);
            if (await fs.pathExists(srcDir)) {
                await fs.copy(srcDir, destDir);
                console.log(`   ✅ Copied ${dir}/`);
            }
        }
        
        // Copy static files
        for (const file of staticFiles) {
            const srcFile = path.join(__dirname, '..', file);
            const destFile = path.join(distDir, file);
            if (await fs.pathExists(srcFile)) {
                await fs.copy(srcFile, destFile);
                console.log(`   ✅ Copied ${file}`);
            }
        }
        
        // Initialize template engine
        console.log('📊 Loading resume data...');
        const templateEngine = new ResumeTemplateEngine(dataPath);
        await templateEngine.loadData();
        
        // Generate both templates
        console.log('🔧 Generating templates from unified data source...');
        await templateEngine.generateAll(websitePath, pdfTemplatePath);
        
        // Generate PDF from the template
        console.log('📑 Generating PDF...');
        await generateResumePDF(pdfTemplatePath, path.join(distDir, 'docs', 'AlvaroRuano_Resume.pdf'));
        
        console.log('🎉 Build completed successfully!');
        console.log('');
        console.log('✅ Generated files in dist/:');
        console.log(`   📄 Website: ${websitePath}`);
        console.log(`   📄 PDF Template: ${pdfTemplatePath}`);
        console.log(`   📑 PDF: dist/docs/AlvaroRuano_Resume.pdf`);
        console.log('');
        console.log('💡 All files are now synchronized from the same data source!');
        console.log('🚀 Ready to deploy from dist/ directory');
        
    } catch (error) {
        console.error('❌ Build failed:', error);
        throw error;
    }
}

// Run if called directly
if (require.main === module) {
    buildResume()
        .then(() => {
            console.log('🏁 Resume build process completed successfully!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Resume build failed:', error);
            process.exit(1);
        });
}

module.exports = { buildResume };