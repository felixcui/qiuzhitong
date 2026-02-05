/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

// Adjusted paths based on project structure:
// script is in /web/scripts
// data is in /data (root) -> ../../data
// output is in /web/lib -> ../lib
const inputFile = path.join(__dirname, '../../data/output_list.txt');
const outputFile = path.join(__dirname, '../lib/sites.json');

try {
    if (!fs.existsSync(inputFile)) {
        console.error(`Input file not found: ${inputFile}`);
        process.exit(1);
    }

    const data = fs.readFileSync(inputFile, 'utf-8');
    const lines = data.split('\n');
    const sites = [];

    // Skip header and separator (first 2 lines if they exist, or check content)
    // Assuming standard format, we iterate
    // output_list.txt usually: Name \t URL \t Category \t Desc

    let idCounter = 1;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Skip header lines that look like "网站名称" or "---"
        if (line.startsWith('网站名称') || line.startsWith('---')) continue;

        const parts = line.split('\t');

        if (parts.length >= 3) {
            const title = parts[0].trim();
            const url = parts[1].trim();
            const category = parts[2].trim();
            const description = parts[3] ? parts[3].trim() : '';

            if (title && url) {
                sites.push({
                    id: idCounter++,
                    name: title,
                    url: url,
                    category: category,
                    desc: description,
                    tags: [],
                    icon: title.charAt(0)
                });
            }
        }
    }

    // Ensure directory exists
    const libDir = path.dirname(outputFile);
    if (!fs.existsSync(libDir)) {
        fs.mkdirSync(libDir, { recursive: true });
    }

    fs.writeFileSync(outputFile, JSON.stringify(sites, null, 2), 'utf-8');
    console.log(`Successfully processed ${sites.length} sites.`);
    console.log(`Wrote to ${outputFile}`);

} catch (err) {
    console.error('Error processing data:', err);
    process.exit(1);
}
