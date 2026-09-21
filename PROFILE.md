# Academic W3C profile v1

## Boundary

This profile describes future W3C academic emissions. PRIVATE V4 remains separate,
mandatory for the project's advanced private presentations, and unchanged. No
existing proof, credential, historical context, or signed fixture is rewritten.
No production adapter is implemented by this repository.

Context order: `https://www.w3.org/ns/credentials/v2`, then
`https://rodrigoioyz.github.io/credenciales-spec/contexts/academic/v1.jsonld`.
Types: `VerifiableCredential`, `AcademicCredential`.
The schema at `schemas/academic/v1.json` validates ONLY `credentialSubject`,
not the complete VC, trust configuration, signature, or revocation state.
Unknown subject terms are forbidden. No default subject identifier or PII.

## Meaning and sources

`hours` counts chronological hours of 60 minutes of issuer-certified formative
workload. It does not assert attendance, passing, a grade, accreditation, or
completion. Source records must explicitly support this unit and meaning.
Do not reinterpret legacy numbers, convert credits, round fractional hours,
or treat a private minimum-hours predicate as an exact-hours assertion.
Zero is permitted but does not mean unknown; omit unavailable claims.

`competencies` contains 1..128 unique codes, at most 2048 characters each:
`catalogId:version:code`, each segment ASCII `[A-Za-z0-9._-]+`.
Equality is exact case-sensitive string equality; order is immaterial. No case
folding, Unicode normalization, trimming, aliasing, or equivalence inference.
A code identifies a catalog entry only within its trusted issuer scope.
The verifier's trusted configuration must bind `(issuer, catalogId, version)`
to the immutable public catalog and its pinned digest. The holder cannot supply
this authority. A catalog entry describes a competency, never a student.
No actual academic catalog is invented here. Unknown catalog/version/code is
not semantically verifiable even if the signature and code syntax are valid.

`achievement` and `program` are nonempty text (up to 2048 Unicode scalar values,
no control characters). Achievement names a recognition asserted by the issuer;
program names an associated program. Neither entails an unstated qualification.
They must come from an authorized academic source, not from a V4 proof.

## Verification versus information

Revealed academic statements are issuer assertions protected by the W3C proof,
not independent evidence of academic truth or institutional recognition.
Use the existing ECDSA-SD lane and trusted issuer/controller/assertionMethod
resolution. This profile does not add holder authentication or replay semantics.
Credential status is mandatory for our newly issued revocable academic profile,
not a universal W3C MUST: retain the entire signed credentialStatus when deriving.
Use the existing independent W3C revocation list and freshness policy. Nothing
here changes its indices, status semantics, proof suite, or PRIVATE V4 status.

Display labels, translations, logos, and external catalog prose are informational
unless separately authenticated. Never append them as extra signed-subject
fields or present mutable external text as authenticated credential content.

## PRIVATE V4 mapping and privacy

Authorized source `hours` may feed W3C hours only after unit verification;
source competencyCodes require explicit catalog mapping for new W3C emissions.
V4 exposes only requested minimumHours and requiredCompetencies predicates, not
the exact hours or complete competency set. There is no automatic cryptographic
equivalence between the two lanes. Their context documents are not merged.

Exclude names, email, national/student identifiers, record references, C/B/L/H,
V4 statusIndex, salts, paths, witnesses, microRoot, and cross-lane correlation
identifiers. Free text can contain PII despite a closed schema: source-side
review is required. W3C status list/index and ECDSA-SD still permit correlation;
this profile does not claim unlinkability.

## Versioning and publication

The context uses JSON-LD 1.1 protected terms and no open default vocabulary.
Consumers use an allowlisted, hash-pinned loader; remote content is not trust
authority. Duplicate JSON keys and malformed Unicode are rejected before schema
validation. Context and schema are complementary, neither verifies a signature.

Before freezing: public repository exists, Pages enabled, all three URLs plus
profile respond HTTP 200, and fetched bytes equal reviewed repository bytes.
Then record hashes and commit in a separate freeze record. Do not mutate frozen
v1 bytes; use a new version for corrections. New IRIs change the signed RDF;
legacy credentials and fixtures retain their original context and signatures.

Open Badges compatibility is conceptual only: the string achievement is NOT an
Open Badges Achievement object. Future structured conversion needs explicit
criteria/catalog mappings and a separate profile. No Open Badges types now.

## References

- https://www.w3.org/TR/vc-data-model-2.0/
- https://www.w3.org/TR/json-ld11/
- https://www.w3.org/TR/rdf-canon/
- https://www.w3.org/TR/vc-di-ecdsa/
- https://www.w3.org/TR/vc-bitstring-status-list/
- https://www.imsglobal.org/spec/ob/v3p0/
