# Open Badges full architecture freeze

This directory is an additive DESIGN package, not an issuer implementation.

- [Complete contract](CONTRACT.md)
- [Frozen field authority matrix](AUTHORITY-MATRIX.json)
- [Capability state](capabilities.json)
- [Academic alias context](context.jsonld)
- [Closed extension fragment schema](extension.schema.json)
- [Synthetic catalog, recipient and issuer fixtures](fixtures/synthetic.json)
- [Expansion / RDFC vectors](vectors.json)
- [Freeze hashes](freeze.json)

Context/schema proposed URLs are NOT PUBLISHED. No existing public academic v1
files are changed. This freeze pins local contract bytes, not HTTP availability.
Future publication must check HTTP 200 and exact reviewed bytes before operational
use. No generated keys, signatures, real credentials, PRIVATE V4 data or code.

The matrix and contract define the entire domain even where capabilities remain
unimplemented. Missing real academic data blocks issuance, not interface freeze.
Activity dates and simultaneous revocation+suspension remain DISABLED/UNRESOLVED.

Verify from repository root: `npm test`. No network, production or Cardano needed.
Upstream context copies are public JSON-LD semantic fixtures fetched from the
official URLs listed in freeze.json. LF/terminal newline storage is pinned locally;
no claim that local serialization is identical to upstream transport bytes.
Vectors are unsigned graph tests, NOT signed OB interoperability/conformance tests.

Next: offline Open Badges domain model + closed codec; not issuance.
