const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const regex = /<img\s+src="([^"]+)"\s+alt="([^"]+)"\s+class="media-preview__portrait\s+media-preview__portrait--img">/g;
html = html.replace(regex, '<div class="media-preview__portrait media-preview__portrait--img"><img src="$1" alt="$2"></div>');
fs.writeFileSync('index.html', html);
console.log('Fixed index.html images');
