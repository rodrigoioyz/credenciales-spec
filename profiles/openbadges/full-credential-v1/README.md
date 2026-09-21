# Complete Open Badges academic credential schema — public v1 freeze

Scope: route step 1 only: schema publication. No issuance, signing, catalog onboarding,
identity onboarding or activation of later capabilities.

New full schema: `schemas/openbadges-academic-credential/v1.json`.
Final URL: https://rodrigoioyz.github.io/credenciales-spec/schemas/openbadges-academic-credential/v1.json
Profile URL: https://rodrigoioyz.github.io/credenciales-spec/profiles/openbadges/full-credential-v1/README.md
Manifest: https://rodrigoioyz.github.io/credenciales-spec/freeze/openbadges-academic-credential-v1.json
Existing public context and fragment remain byte identical. The schema retains
its original candidate title/comment to preserve the exact reviewed bytes; this
profile and the separate manifest record publication, not a semantic revision.

## Composition

The root validates the whole OpenBadgeCredential, not an extracted academic object.
The AchievementSubject is closed and references the existing immutable fragment's
`#/properties/academicHours`, `academicProgram`, `academicCompetencyCodes` and
`academicRecognitionLabel`. Resolving these pointers also preserves the fragment's
own `$defs/text` base URI. We deliberately do NOT apply the fragment root through
`allOf` to the subject: its additionalProperties:false correctly rejects OB fields.
No fragment bytes, identifiers, contexts or historical vectors are reinterpreted.

All modeled entity objects are closed. The full domain remains modeled, including
results, evidence, alignment, endorsements, profiles, images, identity objects,
refresh/terms and proof structure. Structural acceptance does not enable their
issuance or authorize any field; the frozen authority matrix still applies.
Activity dates are absent/rejected. Status is singular and revocation-only.
Signing/external formats, suspension and the remaining roadmap are not implemented.
An unsigned document can pass for pre-sign validation; a syntactically valid dummy
proof is NOT a valid signature, and no test in this block produces one.

## Schema references and normative source

The credentialSchema array in this closed profile has exactly:

1. Official OB AchievementCredential schema URL, type
   `1EdTechJsonSchemaValidator2019`.
2. This complete profile's $id, type `JsonSchema` (2020-12).

The academic fragment is NOT a credentialSchema entry. Wrong/extra/missing
references reject. The official source is OB 3.0 Final Release, document 1.4.5:
https://www.imsglobal.org/spec/ob/v3p0/
and https://purl.imsglobal.org/spec/ob/v3p0/schema/json/ob_v3p0_achievementcredential_schema.json

The pinned official schema is retained unmodified as a local reference fixture.
Its permissive extension points are narrowed by this application profile. Exact
context order, type arrays, inline issuer Profile, bounded arrays, version strings,
canonical UTC dates and schema references are profile choices, not universal OB
requirements. The complete positive fixture also passes the official schema.

The current offline product codec only admits `JsonSchema` in its generic
CredentialSchema type. This artifact does not silently reinterpret that type:
the future issuance integration must accept the required official validator
reference as defined here. No existing product codec is edited in this schema task.

## Validation contract

Use a JSON Schema 2020-12 validator with format assertions for date/date-time.
Register the exact published academic fragment locally under its $id BEFORE
compiling the full schema. Do not fetch arbitrary schemas/contexts supplied by
the holder. The tests use Ajv strict mode, local resolution only, real calendar
checks and canonical UTC formatting; the official schema uses Ajv 2019 separately.

JSON Schema validation is structural. It does not establish issuer/source
authority, recipient ownership, result-reference integrity, chronology across
fields, proof validity, CURRENT, status bits or freshness. Those remain separate
existing/future runtime checks. No claim of full OB certification follows.

Run `node --test test/openbadges-full-schema.test.mjs test/openbadges-freeze.test.mjs test/openbadges-publication.test.mjs`.
The tests are unsigned synthetic data; no keys, PII, Cardano or PRIVATE V4.
Verify live publication separately:
`node test/verify-openbadges-publication.mjs freeze/openbadges-academic-credential-v1.json`.
This checks HTTP 200, served bytes and SHA-256, including the manifest itself.
After successful verification, all new v1 artifacts in this manifest are immutable
by project policy. Any future change requires a new versioned URL. Pin the hashes:
hosting is technically mutable. Never overwrite the academic extension v1 or this
whole-credential v1 resource. Historical credentials retain their original schemas.
