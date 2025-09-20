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
    const generatedPdfDir = path.join(distDir, 'generated-pdf');
        
        // Ensure dist directory exists
        console.log('📁 Creating dist directory...');
        await fs.ensureDir(distDir);
        
        // Copy static assets to dist
        console.log('📋 Copying static assets...');
    // Directories whose contents may change during dev (exclude large / static vendor & img re-copy)
    // css & js change frequently (rebuilt by gulp tasks); docs rarely; img considered static so handled separately.
    // We now treat docs similar to img/vendor: copy once unless an explicit refresh is requested to avoid
    // unlink races when BrowserSync triggers overlapping builds.
    const staticDirs = ['css', 'js'];
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

        // Ensure vendor copied only once (prevents race / unlink errors during rapid rebuilds)
        const vendorSrc = path.join(__dirname, '..', 'vendor');
        const vendorDest = path.join(distDir, 'vendor');
        if (!(await fs.pathExists(vendorDest)) && await fs.pathExists(vendorSrc)) {
            await fs.copy(vendorSrc, vendorDest);
            console.log('   ✅ Copied vendor/ (initial)');
        }

        // Ensure img copied only once (static profile image etc.)
        const imgSrc = path.join(__dirname, '..', 'img');
        const imgDest = path.join(distDir, 'img');
        if (!(await fs.pathExists(imgDest)) && await fs.pathExists(imgSrc)) {
            await fs.copy(imgSrc, imgDest);
            console.log('   ✅ Copied img/ (initial)');
        }

    // Ensure docs copied only once (certifications & diplomas) to prevent unlink race on rapid rebuilds
    const docsSrc = path.join(__dirname, '..', 'docs');
    const docsDest = path.join(distDir, 'docs');
    if (!(await fs.pathExists(docsDest)) && await fs.pathExists(docsSrc)) {
        await fs.copy(docsSrc, docsDest);
        console.log('   ✅ Copied docs/ (initial)');
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
        
    // Ensure generated-pdf directory exists
    await fs.ensureDir(generatedPdfDir);

    // Generate PDF from the template (isolation from static certification docs)
    console.log('📑 Generating PDF...');
    const pdfOutputPath = path.join(generatedPdfDir, 'AlvaroRuano_Resume.pdf');
    await generateResumePDF(pdfTemplatePath, pdfOutputPath);
        
        console.log('🎉 Build completed successfully!');
        console.log('');
        console.log('✅ Generated files in dist/:');
        console.log(`   📄 Website: ${websitePath}`);
        console.log(`   📄 PDF Template: ${pdfTemplatePath}`);
    console.log(`   📑 PDF: dist/generated-pdf/AlvaroRuano_Resume.pdf`);
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