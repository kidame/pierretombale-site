import os, re, sys, gzip
root = sys.argv[1]
rows = []
for dp, dn, fn in os.walk(root):
    for f in fn:
        if not f.endswith('.html'):
            continue
        p = os.path.join(dp, f)
        html = open(p, encoding='utf-8').read()
        js = css = 0
        for ref in set(re.findall(r'(?:src|href)="(/_astro/[^"]+\.(?:js|css))"', html)):
            data = open(os.path.join(root, ref.lstrip('/')), 'rb').read()
            g = len(gzip.compress(data))
            if ref.endswith('.js'):
                js += g
            else:
                css += g
        inline_js = sum(len(gzip.compress(s.encode())) for s in re.findall(r'<script(?![^>]*src)[^>]*>(.*?)</script>', html, re.S))
        rows.append((os.path.relpath(p, root), len(gzip.compress(html.encode())), js, inline_js, css))
rows.sort()
print("page | html gz | js externe gz | js inline gz | css gz (octets)")
for r in rows:
    print(" | ".join(str(x) for x in r))
