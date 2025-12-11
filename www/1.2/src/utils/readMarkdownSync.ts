import { STATIC_DATA_PATH } from '@/constants';
import fs from 'fs';
import { marked } from 'marked';
import path from 'path';

export function readMarkdownSync(name: string) {
    const filePath = path.join(STATIC_DATA_PATH, name);
    const markdown = fs.readFileSync(filePath, 'utf-8');
    marked.setOptions({ mangle: false });
    return marked.parse(markdown);
}