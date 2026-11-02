import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
for (const path of ['dist/index.html', 'dist/realisations/index.html']) {
  const html = readFileSync(path, 'utf8');
  if (!html.includes('href="https://kumo-seo.ch/"') || !html.includes('pied-credit'))
    throw new Error('Signature Kumo absente : ' + path);
  console.log('[footer-check]', path, 'OK', createHash('sha256').update(html).digest('hex'));
}
