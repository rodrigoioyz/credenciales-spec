# Open Badges academic adapter — complete architecture v1

Status: CONTRACT FROZEN; implementation and issuance NOT ENABLED.
Approved design baseline: 2026-09-21. This is the full domain, not an MVP.
The accompanying freeze manifest pins reviewed bytes, not deployment or certification.

## 1. Boundary and authority

PRIVATE V4 remains mandatory and unchanged. Existing Academic VC documents,
contexts, schemas and signatures remain immutable. The arrows PRIVATE V4 →
Academic VC → Open Badges describe product integration, NOT proof conversion.
The adapter creates a NEW issuer-authorized credential with its own signature.
It cannot convert private predicates to public exact values or reuse a source
signature over a different graph. No Cardano dependency is introduced into OB.

Input contract: verified original Academic VC (if used), trusted issuer config,
versioned achievement catalog entry, authorized recipient binding, supplemental
academic attestations, disclosure policy, signing policy and status policy.
Output contract: new secured OB representation plus PRIVATE field provenance,
authorization decisions and idempotency/audit references. Public output contains
only authorized claims. Missing required authority rejects; missing optional data
is omitted. Conflicting authorities reject, never silently override one another.
Holder-supplied data is evidence to validate, never trust configuration.

Every field follows AUTHORITY-MATRIX.json. An unlisted field defaults to
MUST_NOT_INFER and is rejected until an explicitly versioned extension allows it.
Internal provenance includes field path, source category/reference/revision,
source digest, validating authority, permitted transform and approval reference.
These references are not public claims and must not create cross-lane identifiers.

## 2. Full domain and wire boundary

The internal domain contains every entity below from v1. Capability registration
does not mean implemented/enabled. A closed codec comes in the NEXT block.
Native OB field types/cardinalities follow the pinned official revision; our
profile restricts emitted representations without claiming narrower rules are
universal W3C/OB requirements. No arbitrary property bags are allowed.

| Entity | Complete relevant surface |
|---|---|
| OpenBadgeCredential | @context, id, type, issuer, credentialSubject, validFrom, validUntil, awardedDate, name, description, image, evidence, endorsement, endorsementJwt, credentialSchema, credentialStatus, refreshService, termsOfUse, proof or supported external securing format |
| Achievement | id, type, version, name, description, criteria, achievementType, humanCode, creator, creditsAvailable, fieldOfStudy, specialization, alignment, resultDescription, image, inLanguage, tag, otherIdentifier, related, endorsement, endorsementJwt |
| AchievementSubject | type, id and/or identifier, achievement, result, creditsEarned, activityStartDate, activityEndDate, role, source, term, licenseNumber, narrative, image, academic extension |
| Profile | id, type, name, description, url, image, email, phone, address, otherIdentifier, official, parentOrg, familyName, familyNamePrefix, givenName, additionalName, patronymicName, honorificPrefix, honorificSuffix, dateOfBirth, endorsement, endorsementJwt: all identity/contact/person fields opt-in, never default recipient PII |
| Criteria | approved id/narrative; no empty criteria in our issuance profile |
| Evidence | id, type, narrative, name, description, genre, audience, with explicit publication authority |
| Result | type, resultDescription, value, status, achievedLevel, alignment, authorized for this recipient |
| ResultDescription | id, type, name, resultType, allowedValue, requiredLevel, requiredValue, valueMin, valueMax, rubricCriterionLevel, alignment |
| RubricCriterionLevel | id, type, name, description, level, points, alignment |
| Alignment | type, targetName, targetUrl, targetCode, targetDescription, targetFramework, targetType |
| IdentityObject | type, identityType, identityHash, hashed, salt when applicable; W3C identity data, NEVER V4 salts |
| Image | id, type, caption; internal media type, rights, digest and privacy classification are not invented OB wire fields |
| Address / GeoCoordinates | institutional address and latitude/longitude only with explicit authority; no inferred learner location |
| EndorsementCredential / Subject | independent secured credential, exact target id, endorsementComment, issuer, validity, status/schema where applicable |

Dates used for credential validity carry explicit time zones; unknown dates are
omitted, not filled with current time. activity dates remain DISABLED/UNRESOLVED.
Credits are finite nonnegative values with an explicit institutional credit system
in the authorized catalog; chronological hours are not credits. No rounding or
conversion by inference. Exact wire numeric bounds must be covered by codec tests.

## 3. Achievement catalog

CatalogEntry: catalogId (stable family URI), version, achievement (immutable
version-specific id and snapshot), definitionDigest, approvingAuthority,
authorizedIssuers, lifecycle, supersedes? and approvalReference.
Lifecycle DRAFT → ACTIVE → RETIRED. Only ACTIVE authorizes new issuance.
Retirement does not revoke historical credentials. No dereferencing of a mutable
latest alias substitutes for a pinned historical snapshot.
Semantic changes to criteria, credits, outcomes or alignments create a new version.
Catalog existence does not prove that a recipient met its criteria: an award
attestation is required. Data availability blocks issuance, not the interface.

## 4. Recipient identity and binding

RecipientBinding: strategy, subjectId OR identityObjects, identityAuthority,
scope, bindingEvidenceReference, awardReference, disclosureAuthorization,
verifiedAt and strategyVersion. Internal references do not go on the wire.
Exactly one strategy controls emission: OPAQUE_URI (default, random per credential),
DID (allowlisted method and verified binding), IDENTITY_OBJECT (OB representation),
AUTHORIZED_EXTENSION (registered version, validator and trust rules required).
No RUT, email, legal name, photograph or student number by default.
Never derive identity from H/B/L/C, signatures, commitments or V4 indices.
Possession of a source VC without a subject binding is insufficient to assign it
to an arbitrary identity. Recipient identity is not presenter authentication.
Hashed low-entropy identity and stable DID/URI can still correlate/reidentify.

## 5. Issuer/Profile

IssuerContract: institutional issuerId, authenticated Profile snapshot,
approved controllers/assertionMethods, suite/key lifecycle policy, catalog issue
authority, status policy, refresh policy and optional publication services.
Issuer != controller != hosting provider != achievement creator != subject source
!= external endorser. External verification methods remain allowed with the
existing trusted Controlled Identifier binding; URL prefixes do not prove trust.
Profile names and affiliations never imply accreditation. Private key material
is never part of configuration fixtures or adapter state; only signer references.

## 6. Results, evidence and alignments

ResultDescription belongs to the exact catalog version. Result references must
resolve within that version, values must meet its scale, levels must exist and
conflicting representations reject. Credits earned are separately attested.
Evidence needs publication approval; a signed URL does not authenticate later
mutable bytes. Content integrity, if required, needs an explicit snapshot/digest
strategy; do not invent uncontextualized digest properties. No secret-bearing URLs.
Narrative is an issuer assertion, not a substitute for evidence. Render safely.

Competency catalog key is (trusted issuer, catalogId, version, code), bound to an
immutable definition/digest. Academic codes are exact, case-sensitive and unordered.
Alignment requires an approved target URI/name/framework mapping and scope
(achievement, result description or individual result). No alias/name similarity
equivalence. Achievement alignment does not attest that every recipient mastered
all targets. CASE/CTDL integration is optional and requires explicit mappings.

## 7. Endorsements

Endorsement and endorsementJwt preserve the external issuer's exact assertion and
secured artifact. Validate signature, authority, target, version, validity and
status separately. Do not forge endorsements from logos or membership.
Optional invalid endorsements are reported invalid, never treated as verified;
if required by acceptance policy, acceptance fails. Embedding a new endorsement
changes the parent signed document and requires new issuance. Post-issue discoveries
remain external evidence unless a new credential is issued.

## 8. Status and refresh

StatusContract: strategyId/version, purpose, allocatorRef, publicationAuthority,
resolverPolicy, freshnessPolicy and transition permissions. Results: GOOD,
REVOKED, SUSPENDED, UNVERIFIABLE. Revocation is one-way; suspension is reversible
only by authorized action. Bit 0 alone never proves overall credential validity.
Signatures, issuer, reference, purpose, index/range and freshness precede bit trust.
No invented TTL; list ttl and validUntil retain distinct meanings.
Independent W3C indices, random/no reuse under current policy. No V4 indices,
root sharing or automatic synchronization. New OB entry by default; explicit
coupling of revocation across credentials would require an approved policy.
Simultaneous revocation+suspension is DISABLED/UNRESOLVED: the consulted OB schema
has singular credentialStatus. Do not invent arrays or composite status wire.
Standalone suspension is MODELED_NOT_IMPLEMENTED, not silently treated as revocation.
Refresh service is optional, issuer-authorized, privacy-controlled and creates a
new authorized artifact. It never overwrites historical signed bytes.

## 9. Signing

SigningStrategy: id/version, securingFormat, keyTypes, trustResolver,
prepare/sign/verify contracts, derive capability, algorithm policy and interop
evidence reference. Slots: ECDSA_RDFC, ECDSA_SD, EDDSA, JOSE_JWT and future registered
strategies. No holder-selected algorithm downgrade or arbitrary key loading.
Embedded proof and external JWT are distinct wire representations. Never copy an
Academic VC proof or convert BBS [C,B,L]. ECDSA-SD disclosure must retain required
OB structure and profile status; cryptographic validity alone is not OB validity.
No OB signing implementation is enabled by this freeze. Suite-specific OB
interoperability and certification claims require separate evidence. Current
OB Linked Data conformance-test support is not assumed to cover every suite.

## 10. Extension and schemas

context.jsonld defines ONLY academic aliases, reusing exact frozen academic v1
IRIs. academicHours → #hours (xsd:integer); academicProgram → #program;
academicCompetencyCodes → #competencies (@set); academicRecognitionLabel →
#achievement. Never redefine the OB achievement object. Extension lives on the
AchievementSubject, not the catalog, and does not assert AcademicCredential type.
Do NOT append the old academic context, whose achievement term collides.
Aliases preserve predicates, not the whole graph, signature or subject identity.

extension.schema.json is a closed fragment for extracting/validating the four
academic properties, NOT a full AchievementSubject/OB schema. It permits an empty
fragment when no academic claim is authorized. A future full codec composes OB
structure, a closed full property allowlist, extension constraints and semantic
authority checks. Do not apply this closed fragment directly to the entire subject.
The original academic schema remains unchanged. No claims can be dropped before
the future full codec's unknown-field check. Language maps, extensions and schemes
must be intentionally supported, not accepted through an arbitrary property bag.

Proposed context URL: https://rodrigoioyz.github.io/credenciales-spec/contexts/openbadges-academic/v1.jsonld
Proposed schema URL: https://rodrigoioyz.github.io/credenciales-spec/schemas/openbadges-academic/v1.json
These are DESIGNED_NOT_PUBLISHED and loaded from pinned local bytes for vectors.
Publication freeze requires HTTP 200 plus reviewed byte equality. No production
consumer may assume these proposed URLs resolve. Existing academic v1 unchanged.

## 11. Images, baking, services and CLR

Model images independently at credential, achievement, issuer and recipient levels.
Recipient image is off by default. Public image URLs are not immutable image bytes.
PNG/SVG baking is a transport plugin for an already secured artifact. Extract and
verify before display; never change signed fields for baking. Reject active SVG,
unsafe links and unintended metadata. No automatic publication of private badges.

Issuer authorizes/signs; Host stores exact artifacts with recipient authorization;
Displayer verifies/renders without inheriting host trust. Badge Connect/OB API is
a versioned transport plugin with OAuth/scopes, consent, pagination, idempotency,
tenant isolation and safe rendering. Transport tokens never become credential data.
No HTTP/API implementation in this freeze, and no certification implied.

CLR 2.0 aggregation retains independently verifiable OB artifacts; aggregator
signs its own grouping. Common-recipient binding requires authority, not name/email
matching. Check nested status/validity separately. Opaque per-credential identities
require authorized linkage. No automatic hours/credits summation or deduplication.

## 12. Reuse, new attestations and privacy

Reusable ONLY after source verification and award authorization: exact signed
hours/program/competencies/achievement text through the four aliases, and issuer
identity matching trusted config. Source Academic VC need not contain recipient
identity; source possession alone never suffices. New attestations cover recipient
award, criteria satisfaction, dates/validity, credits, results, evidence, alignments
and other fields absent from the source. Endorsements require the external issuer.
NEVER infer exact hours from minimumHours, full codes from predicates, credits from
hours, completion/degree from a program, approval from credential existence,
accreditation from a key, identity from a DID, endorsement from a logo or V4 status
from W3C status. No C/B/L/H, paths, salts, witnesses, microRoot, V4 statusIndex or
cross-lane correlators in output. W3C IdentityObject salt is a different optional
identity feature, not permission to export private V4 salt.
Stable ids/status index/signatures, free text, images, evidence and refresh services
can correlate or leak PII. Default is minimum disclosure, opaque per-credential
recipient id, no PII. W3C/OB does not inherit PRIVATE V4 unlinkability.

## 13. Versioning, capabilities and phases

Historical credentials/signatures immutable. Semantic changes require a new
contract/context/catalog version. Keep old definitions for verification. No mutable
contexts or automatic capability activation. Capabilities are listed in
capabilities.json; all issuance is disabled pending implementation and real authority.
Missing real data is an emission blocker, not an interface freeze blocker.

Phases (full model remains present): (1) contracts/vectors; (2) offline domain and
closed codec; (3) catalogs/identity authority; (4) basic authorized issuance with
selected signature/status; (5) results/evidence/credits; (6) alignments/endorsements;
(7) additional identity/signing/status strategies; (8) external interoperability;
(9) baking/Host/Displayer/transport; (10) CLR. No production code in phase 1.

## 14. Unresolved normative boundaries

ACTIVITY_DATES: DISABLED/UNRESOLVED. OB schema describes date-time; context 3.0.3
types these fields xsd:date. No truncation, midnight invention or context patch.
SIMULTANEOUS_STATUS: DISABLED/UNRESOLVED. Need reviewed interoperable wire profile.
Both are retained in the domain and authority matrix, rejected for emission until
a separately reviewed capability revision resolves them. No fallback inference.

## 15. Sources and reproducibility

- OB 3.0 Final Release document 1.4.5 (2026-06-29): https://www.imsglobal.org/spec/ob/v3p0/
- OB context: https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json
- OB schema: https://purl.imsglobal.org/spec/ob/v3p0/schema/json/ob_v3p0_achievementcredential_schema.json
- Informative implementation guide: https://www.imsglobal.org/spec/ob/v3p0/impl
- CLR: https://developers.imsglobal.org/spec/clr/v2p0/
- Academic profile: ../../../PROFILE.md (repository root profile, unchanged).

Run `npm test` at repository root. Tests use ONLY vendored contexts, pinned existing
dependencies and synthetic fixtures; no remote loader, signatures or credentials.
Vectors cover extension predicates and composition with real OB/VC contexts;
they are not signed issuance, full-schema conformance or interoperability claims.
