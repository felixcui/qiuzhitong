const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '../data/output_list.txt');
const outputFile = path.join(__dirname, '../src/data/sites.json');

try {
    const data = fs.readFileSync(inputFile, 'utf-8');
    const lines = data.split('\n');
    const sites = [];

    // Skip header and separator (first 2 lines)
    // Also filtering out empty lines
    let idCounter = 1;

    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        // Split by tab
        const parts = line.split('\t');

        // Ensure we have enough parts. 
        // Based on view_file data/output_list.txt, there are 4 columns.
        // Some lines might have missing descriptions or extra tabs.
        // The format seems to be: Title, URL, Category, Description

        if (parts.length >= 3) {
            const title = parts[0].trim();
            const url = parts[1].trim();
            const category = parts[2].trim();
            const description = parts[3] ? parts[3].trim() : '';

            // Basic validation
            if (title && url) {
                sites.push({
                    id: idCounter++,
                    name: title,
                    url: url,
                    category: category,
                    desc: description,
                    tags: [], // Placeholder for tags
                    icon: title.charAt(0) // Default icon: first char
                });
            }
        }
    }

    // Extract unique categories for verification (optional logging)
    const categories = [...new Set(sites.map(s => s.category))];
    console.log(`Processed ${sites.length} sites.`);
    console.log(`Found ${categories.length} categories:`, categories);

    // Group sites? No, the frontend will filter/group.
    // Just write the flat list.

    fs.writeFileSync(outputFile, JSON.stringify(sites, null, 2), 'utf-8');
    console.log(`Successfully wrote to ${outputFile}`);

} catch (err) {
    console.error('Error processing data:', err);
}
