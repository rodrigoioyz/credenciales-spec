// Artifact verification support only; no issuance or production adapter.
import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
export const base=new URL('../profiles/openbadges/v1/',import.meta.url);
export const read=name=>JSON.parse(readFileSync(new URL(name,base)));
export const extensionUrl='https://rodrigoioyz.github.io/credenciales-spec/contexts/openbadges-academic/v1.jsonld';
export const obUrl='https://purl.imsglobal.org/spec/ob/v3p0/context-3.0.3.json';
export const vcUrl='https://www.w3.org/ns/credentials/v2';
const contexts=new Map([[extensionUrl,read('context.jsonld')],[obUrl,read('upstream/ob-3.0.3.jsonld')],[vcUrl,read('upstream/vc-v2.jsonld')]]);
export const loader=async url=>{
  assert.ok(contexts.has(url),'UNPINNED_CONTEXT_BLOCKED');
  return {contextUrl:null,documentUrl:url,document:structuredClone(contexts.get(url))};
};
export const fixtures=read('fixtures/synthetic.json');
export const inputs=[
  {'@context':extensionUrl,'@id':fixtures.recipientBinding.subjectId,...fixtures.extension},
  {
    '@context':[vcUrl,obUrl,extensionUrl],
    id:'urn:uuid:00000000-0000-4000-8000-000000000040',
    type:['VerifiableCredential','OpenBadgeCredential'],
    issuer:fixtures.issuer.profile,
    validFrom:'2026-01-01T00:00:00Z',
    credentialSubject:{
      id:fixtures.recipientBinding.subjectId,type:['AchievementSubject'],
      achievement:fixtures.catalog.achievement,...fixtures.extension,
      result:[fixtures.result]
    },
    evidence:[fixtures.evidence]
  }
];
