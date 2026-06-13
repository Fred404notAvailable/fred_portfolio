import fs from 'fs';
import path from 'path';

const indexPath = path.join(process.cwd(), 'index.html');
let html = fs.readFileSync(indexPath, 'utf-8');

// 1. Remove Tailwind config script
html = html.replace(/<script id="tailwind-config">[\s\S]*?<\/script>/, '');

// 2. Remove CDNs
html = html.replace(/<script src="https:\/\/cdn\.tailwindcss\.com[\s\S]*?<\/script>/, '');
html = html.replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/gsap[\s\S]*?<\/script>/g, '');
html = html.replace(/<script src="https:\/\/unpkg\.com\/lenis[\s\S]*?<\/script>/g, '');
html = html.replace(/<script src="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js[\s\S]*?<\/script>/g, '');
html = html.replace(/<script src="https:\/\/unpkg\.com\/three[\s\S]*?<\/script>/g, '');

// 3. Extract <style> block
const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
if (styleMatch) {
    const styleContent = `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n${styleMatch[1]}`;
    fs.writeFileSync(path.join(process.cwd(), 'src/style.css'), styleContent);
    html = html.replace(styleMatch[0], '');
}

// 4. Extract main <script> block at the bottom
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/);
if (scriptMatch) {
    const mainContent = `import * as THREE from 'three';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import Lenis from 'lenis';
import './style.css';

${scriptMatch[1]}
`;
    fs.writeFileSync(path.join(process.cwd(), 'src/main.ts'), mainContent);
    html = html.replace(scriptMatch[0], '<script type="module" src="/src/main.ts"></script>\n</body>');
}

fs.writeFileSync(indexPath, html);
console.log("Migration successful.");
