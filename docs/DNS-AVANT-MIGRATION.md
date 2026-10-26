# Releve DNS Infomaniak avant migration

Releve du 26.10.2026, fourni par Thomas (captures du Manager et texte DKIM).
Aucune boite e-mail rattachee selon Thomas. Aucun MX visible sur les captures.
Inventaire limite aux enregistrements transmis ; verifier la liste complete avant bascule.

| Nom | Type | TTL secondes | Valeur |
| --- | --- | --- | --- |
| @ | NS | 3600 | nsany1.infomaniak.com |
| @ | NS | 3600 | nsany2.infomaniak.com |
| @ | A | 300 | 128.65.195.180 |
| www | A | 300 | 128.65.195.180 |
| @ | TXT | 3600 | v=spf1 -all |
| _dmarc | TXT | 3600 | v=DMARC1; p=reject; |
| 20261022._domainkey | TXT | 3600 | Voir valeur complete ci-dessous |

## DKIM public

Les deux fragments TXT fournis sont concatenes sans espace entre eux.

```text
v=DKIM1; t=s; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAt35VXOwjiobO4P93nEtLZYxQeoINBxOxyxA+b8gf3agdIg25PK0xmU7/YXzBigv/gEeSkx04x0ruKuM6GE9EbqDGO4YWrUq2fEsE3D6H4KPKEVzjgwzvYIm6rN1YNibjuA7nOvGv3bViQsAw9tLclQeJs093P0ZJw3SkA+tn2QVDncM6N1fqj5SzttBaX/dzUW4YkLWZVM1tIybfYFqnHvR25zGA4bYMzo9LJ2ggTzDKg4yqsdN18tbzMrIxW1gGVTPbrtblNXMTN7B+7IlfIypDwzXXmwuY1kOS2JYl22ZXu0ouJ1RqSQYlAZToRRRLm/vJBrIg/X00H6RPexYNJwIDAQAB
```

## Suite

Importer dans Cloudflare Free et comparer les A/TXT, notamment le DKIM.
Les NS Infomaniak sont un releve historique : ne pas les recopier comme NS autoritaires
au sommet de la zone Cloudflare. Verifier DNSSEC avant changement de delegation.
Aucune modification DNS effectuee a cette etape.

## Progression de la migration

Cloudflare a importe les 2 A, SPF et DMARC, conformes aux captures.
DKIM ajoute manuellement ; correction du nom avec point confirmee par Thomas.
NS attribues : gracie.ns.cloudflare.com et steven.ns.cloudflare.com.
DNSSEC desactive dans le Manager selon Thomas le 26.10.2026.
Controle suivant via dig : DS 63723 encore present sur 1.1.1.1 et 8.8.8.8, TTL 3600.
Ne pas changer la delegation tant que le retrait du DS ne se propage pas.
