# Academic Open Badges extension v1 — public profile

This publication makes the reviewed extension artifacts from design commit
`45acbdc6066f751c577cf179e93dc794cda53708` available at their final versioned IRIs.
It does not enable issuance, sign credentials or claim OB certification.

- Context: https://rodrigoioyz.github.io/credenciales-spec/contexts/openbadges-academic/v1.jsonld
- Schema: https://rodrigoioyz.github.io/credenciales-spec/schemas/openbadges-academic/v1.json
- Manifest: https://rodrigoioyz.github.io/credenciales-spec/freeze/openbadges-academic-v1.json
- Approved expansion/RDFC vectors: https://rodrigoioyz.github.io/credenciales-spec/profiles/openbadges/v1/vectors.json
- Full domain and source authority: [contract](CONTRACT.md), [matrix](AUTHORITY-MATRIX.json).

## Immutable semantics

The protected JSON-LD 1.1 context defines only four aliases on AchievementSubject:

| Alias | Existing academic v1 predicate |
|---|---|
| academicHours | https://rodrigoioyz.github.io/credenciales-spec/vocab/academic/v1#hours |
| academicProgram | https://rodrigoioyz.github.io/credenciales-spec/vocab/academic/v1#program |
| academicCompetencyCodes | https://rodrigoioyz.github.io/credenciales-spec/vocab/academic/v1#competencies |
| academicRecognitionLabel | https://rodrigoioyz.github.io/credenciales-spec/vocab/academic/v1#achievement |

Hours are integer chronological 60-minute hours as attested by the academic
source, not credits or a PRIVATE V4 minimum-hours predicate. Competency codes
retain the academic v1 catalog/version/code syntax, exact case-sensitive equality
and unordered set semantics. Catalog authority is still required.
No OB/W3C term is redefined; in particular OB `achievement` remains an object.
Use the VC v2 context, OB 3.0.3 context and this alias context; do not append the
older AcademicCredential context with its colliding `achievement` term.

The schema is a closed **academic extension fragment**, not a full OB credential
or full AchievementSubject schema. It permits only the four aliases and permits
an empty fragment. Validate the entire credential's allowlist before extracting
the fragment. Schema validation does not establish source authority.

Context and schema bytes are identical to the approved design snapshots.
The schema's historical title says “design only, not published”; this preserved
annotation and the historical design package describe their original checkpoint.
This publication profile and public manifest record deployment separately,
without rewriting the design manifest, vectors, capability state or approved bytes.

Existing Academic VC v1 artifacts and PRIVATE V4 remain untouched. No PII is
required by this extension. Never export PRIVATE V4 C/B/L/H, indices, salts,
paths, witnesses or microRoots. Public OB data does not inherit private unlinkability.
Activity dates and simultaneous revocation+suspension remain DISABLED/UNRESOLVED.
Publication grants no authority to issue and enables no capability.

## Reproducibility and versioning

Run `npm test` for local artifact/schema/expansion/RDFC/hash checks.
Run `node test/verify-openbadges-publication.mjs` separately for HTTP 200,
exact served bytes and SHA-256 checks, including the manifest.
All fixtures and vectors are unsigned and synthetic.

After successful publication verification, these v1 artifact bytes are immutable
by project policy. Any future change requires new versioned URLs; historical
documents and contexts must not be rewritten. GitHub hosting is technically
mutable, so consumers must pin the manifest hashes and reject different bytes.
No full W3C/OB conformance, external audit or production readiness is claimed.
