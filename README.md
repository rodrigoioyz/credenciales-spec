# Public academic W3C artifacts

Public specification artifacts only. No private repository source, credentials,
keys, signatures, stores, or production deployment are included.

- [Context](https://rodrigoioyz.github.io/credenciales-spec/contexts/academic/v1.jsonld)
- [Vocabulary](https://rodrigoioyz.github.io/credenciales-spec/vocab/academic/v1)
- [Subject schema](https://rodrigoioyz.github.io/credenciales-spec/schemas/academic/v1.json)
- [Profile](PROFILE.md)

Initial publication is a candidate until the deployment verification and freeze
record exists. Thereafter the three v1 artifacts are byte-immutable by project
policy; corrections require new versioned URLs. GitHub hosting itself is mutable:
consumers must pin the recorded SHA-256 digests and reject conflicting content.

This is not a claim of complete W3C conformity, Open Badges conformity,
production readiness, certification, or external audit.

## Freeze and reproducibility

v1 is now frozen: [verified HTTP/byte evidence and hashes](freeze/academic-v1.json).
Final IRIs are those recorded in that manifest. The repository is public and
Pages is HTTPS-only. No visibility change was made to the private product repo.

Run `npm ci --ignore-scripts` then `npm test`. Tests run offline using a closed
local loader. `node test/verify-publication.mjs` is a separate online check of
HTTP 200 and exact public bytes. Lockfile pins jsonld 9.0.0, rdf-canonize 5.0.0,
and Ajv 8.17.1. [The vector](vectors/academic-v1.json) covers all academic terms,
expansion and RDFC-1.0, with tests for set reordering, value tampering and
protected-term override. It is synthetic vocabulary data, not a signed VC,
real academic catalog, or claim of complete external interoperability.
