const fs = require('fs');
const path = require('path');

const dataPath = path.join(process.cwd(), 'data', 'posts.json');

try {
    const data = fs.readFileSync(dataPath, 'utf8');
    const posts = JSON.parse(data);

    const ids = posts.map(p => p.id);
    const uniqueIds = new Set(ids);

    if (ids.length !== uniqueIds.size) {
        console.log('DUPLICATES FOUND!');
        const counts = {};
        ids.forEach(id => counts[id] = (counts[id] || 0) + 1);
        Object.entries(counts).filter(([id, count]) => count > 1).forEach(([id, count]) => {
            console.log(`ID: ${id}, Count: ${count}`);
        });
    } else {
        console.log('No duplicates found.');
    }
} catch (e) {
    console.error(e);
}
