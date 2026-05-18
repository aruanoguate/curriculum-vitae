'use strict';

const ResumeTemplateEngine = require('./template-engine');
const { generateResumePDF } = require('./generate-pdf');
const fs = require('fs-extra');
const path = require('node:path');
const { PurgeCSS } = require('purgecss');

async function buildResume() {
    console.log('🏗️  Starting resume build process...');

    try {
        // Paths
        const dataPath = path.join(__dirname, '..', 'data', 'resume-data.json');
        const distDir = path.join(__dirname, '..', 'dist');
        const websitePath = path.join(distDir, 'index.html');
        const pdfTemplatePath = path.join(distDir, 'resume-template.html');
        const manifestPath = path.join(distDir, 'site.webmanifest');
        const generatedPdfDir = path.join(distDir, 'generated-pdf');

        // Ensure dist directory exists
        console.log('📁 Creating dist directory...');
        await fs.ensureDir(distDir);

        // Copy static assets to dist
        console.log('📋 Copying static assets...');
        // CSS changes frequently (rebuilt by gulp tasks)
        // JS is now pre-built by gulp to dist/js/ so we don't need to copy from source
        const staticDirs = ['css'];
        const staticFiles = [
            'android-chrome-192x192.png',
            'android-chrome-512x512.png',
            'apple-touch-icon.png',
            'favicon-16x16.png',
            'favicon-32x32.png',
            'favicon.ico',
            'sitemap.xml',
            'robots.txt'
            // Note: site.webmanifest is now generated from resume data
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

        // JS is now handled by gulp task and already in dist/js/ - no copy needed
        const jsDestDir = path.join(distDir, 'js');
        if (await fs.pathExists(jsDestDir)) {
            console.log('   ✅ JS already built to dist/js/');
        }

        // Ensure vendor copied only once (prevents race / unlink errors during rapid rebuilds)
        const vendorSrc = path.join(__dirname, '..', 'vendor');
        const vendorDest = path.join(distDir, 'vendor');
        if (!(await fs.pathExists(vendorDest)) && await fs.pathExists(vendorSrc)) {
            await fs.copy(vendorSrc, vendorDest);
            console.log('   ✅ Copied vendor/ (initial)');
        }

        // Ensure img is synced (copies new/updated files)
        const imgSrc = path.join(__dirname, '..', 'img');
        const imgDest = path.join(distDir, 'img');
        if (await fs.pathExists(imgSrc)) {
            await fs.copy(imgSrc, imgDest, { overwrite: false });
            console.log('   ✅ Synced img/');
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

        // Generate all templates (website, PDF, manifest)
        console.log('🔧 Generating templates from unified data source...');
        await templateEngine.generateAll(websitePath, pdfTemplatePath, manifestPath);

        // Ensure generated-pdf directory exists
        await fs.ensureDir(generatedPdfDir);

        // PurgeCSS: Remove unused Bootstrap CSS
        console.log('🧹 Purging unused CSS...');
        const bootstrapCssPath = path.join(distDir, 'vendor', 'bootstrap', 'css', 'bootstrap.min.css');
        if (await fs.pathExists(bootstrapCssPath)) {
            const purgeResult = await new PurgeCSS().purge({
                content: [path.join(distDir, '**/*.html')],
                css: [bootstrapCssPath],
                safelist: {
                    standard: [/^collapse/, /^navbar/, /^nav/, /^show/, /^active/, /^fade/, /^modal/, /^d-/, /^col-/, /^row/, /^container/, /^flex/, /^align-/, /^justify-/, /^text-/, /^mb-/, /^mt-/, /^me-/, /^ms-/, /^p-/, /^pb-/, /^pt-/, /^ps-/, /^pe-/, /^rounded/, /^img-fluid/, /^btn/, /^bg-/, /^fs-/, /^fw-/, /^lead/, /^list-/],
                    greedy: [/collaps/]
                }
            });
            if (purgeResult.length > 0) {
                await fs.writeFile(bootstrapCssPath, purgeResult[0].css);
                const newSize = Buffer.byteLength(purgeResult[0].css);
                console.log(`   ✅ Bootstrap CSS purged: ${(newSize / 1024).toFixed(1)} KiB`);
            }
        }

        // Generate PDF from the template (isolation from static certification docs)
        console.log('📑 Generating PDF...');
        const pdfOutputPath = path.join(generatedPdfDir, 'AlvaroRuano_Resume.pdf');
        await generateResumePDF(pdfTemplatePath, pdfOutputPath);

        console.log('🎉 Build completed successfully!');
        console.log('');
        console.log('✅ Generated files in dist/:');
        console.log(`   📄 Website: ${websitePath}`);
        console.log(`   📄 PDF Template: ${pdfTemplatePath}`);
        console.log('   📑 PDF: dist/generated-pdf/AlvaroRuano_Resume.pdf');
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
    (async () => {
        try {
            await buildResume();
            console.log('🏁 Resume build process completed successfully!');
            process.exit(0);
        } catch (error) {
            console.error('💥 Resume build failed:', error);
            process.exit(1);
        }
    })();
}

module.exports = { buildResume };
