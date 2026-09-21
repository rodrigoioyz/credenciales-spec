import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import Ajv from 'ajv/dist/2020.js';
import jsonld from 'jsonld';
import {base,read,extensionUrl,loader,fixtures,inputs} from './openbadges-fixtures.mjs';

const schema=read('extension.schema.json');
const validate=new Ajv({strict:true}).compile(schema);
const opts={documentLoader:loader,algorithm:'RDFC-1.0',format:'application/n-quads',safe:true};

test('OB aliases preserve exact academic v1 definitions without achievement collision',()=>{
  const old=JSON.parse(readFileSync(new URL('../contexts/academic/v1.jsonld',import.meta.url)))['@context'];
  const current=read('context.jsonld')['@context'];
  assert.equal(current['@protected'],true);assert.equal(current['@version'],1.1);
  assert.deepEqual(Object.keys(current).sort(),['@version','@protected','academicHours','academicProgram','academicCompetencyCodes','academicRecognitionLabel'].sort());
  for(const [a,b] of Object.entries({academicHours:'hours',academicProgram:'program',academicCompetencyCodes:'competencies',academicRecognitionLabel:'achievement'}))assert.deepEqual(current[a],old[b]);
});
test('extension fragment accepts only frozen values, never private or unrelated fields',()=>{
  for(const v of [{},fixtures.extension,{academicHours:0},{academicProgram:'Programa 😀'}])assert.equal(validate(v),true,JSON.stringify(validate.errors));
  for(const v of [{academicHours:-1},{academicHours:1.1},{academicHours:'120'},{academicHours:9007199254740992},{academicCompetencyCodes:[]},{academicCompetencyCodes:['SYN:1:A','SYN:1:A']},{academicCompetencyCodes:['SYN:1:A\n']},{academicProgram:'x\uD800'},{academicRecognitionLabel:'x\n'},{hours:120},{achievement:{}},{statusIndex:1},{C:'1'},{email:'synthetic'},{academicHours:120,unknown:1}])assert.equal(validate(v),false,JSON.stringify(v));
});
test('extension value constraints match existing academic schema without editing it',()=>{
  const old=JSON.parse(readFileSync(new URL('../schemas/academic/v1.json',import.meta.url)));
  assert.deepEqual(schema.$defs,old.$defs);
  for(const [a,b] of Object.entries({academicHours:'hours',academicProgram:'program',academicCompetencyCodes:'competencies',academicRecognitionLabel:'achievement'}))assert.deepEqual(schema.properties[a],old.properties[b]);
});
test('frozen expansion and RDFC of extension and actual VC/OB context composition',async()=>{
  const vectors=read('vectors.json');assert.equal(vectors.algorithm,'RDFC-1.0');assert.equal(vectors.vectors.length,2);
  for(let i=0;i<inputs.length;i++){
    assert.deepEqual(vectors.vectors[i].input,inputs[i]);
    assert.deepEqual(await jsonld.expand(inputs[i],{documentLoader:loader,safe:true}),vectors.vectors[i].expanded);
    assert.equal(await jsonld.canonize(inputs[i],opts),vectors.vectors[i].canonicalNQuads);
  }
  const full=vectors.vectors[1].canonicalNQuads;
  assert.ok(full.includes('<https://purl.imsglobal.org/spec/vc/ob/vocab.html#achievement>'));
  assert.ok(full.includes('<https://rodrigoioyz.github.io/credenciales-spec/vocab/academic/v1#achievement>'));
  assert.ok(full.includes('XMLSchema#integer'));
});
test('set order invariant; hour mutation changes graph; protected alias override rejected',async()=>{
  const a=structuredClone(inputs[1]);
  const original=await jsonld.canonize(a,opts);
  a.credentialSubject.academicCompetencyCodes.reverse();assert.equal(await jsonld.canonize(a,opts),original);
  a.credentialSubject.academicHours++;assert.notEqual(await jsonld.canonize(a,opts),original);
  await assert.rejects(jsonld.expand({'@context':[extensionUrl,{academicHours:'urn:attacker:hours'}],academicHours:1},{documentLoader:loader}));
  await assert.rejects(loader('https://untrusted.invalid/context'));
});
test('full authority matrix fails closed and preserves non-MVP surface',()=>{
  const m=read('AUTHORITY-MATRIX.json');assert.equal(m.default,'MUST_NOT_INFER');
  for(const k of ['unknownField','missingRequiredAuthority','conflictingSources'])assert.equal(m[k],'REJECT');
  const fields=m.rows.flatMap(r=>r.fields);assert.equal(new Set(fields).size,fields.length);
  for(const row of m.rows){assert.ok(row.rule.length>0);assert.ok(row.sources.length>0);for(const s of row.sources)assert.ok(m.sources.includes(s));}
  for(const f of ['credentialSubject.activityStartDate','credentialSubject.activityEndDate','credentialSubject.creditsEarned','credentialSubject.achievement.creditsAvailable','credentialSubject.result','evidence','endorsementJwt','refreshService','credentialSchema','credentialSubject.licenseNumber','credentialSubject.achievement.alignment','credentialSubject.id','credentialSubject.identifier'])assert.ok(fields.includes(f),f);
});
test('disabled normative capabilities remain modeled and no emission is enabled',()=>{
  const c=read('capabilities.json');assert.equal(c.issuanceEnabled,false);assert.equal(c.publicDeployment,'DESIGNED_NOT_PUBLISHED');
  assert.equal(fixtures.issuer.issuanceEnabled,false);assert.equal(fixtures.catalog.lifecycle,'DRAFT');
  for(const fixture of fixtures.disabledInputs){const cap=c.capabilities.find(x=>x.id===fixture.capability);assert.equal(cap.state,'DISABLED');assert.equal(cap.resolution,'UNRESOLVED');assert.equal(fixture.expected,'CAPABILITY_DISABLED');}
});
test('synthetic catalog, recipient, issuer and result references agree, no real authority implied',()=>{
  assert.match(fixtures.notice,/SYNTHETIC ONLY/);
  assert.equal(fixtures.catalog.approvingAuthority,fixtures.issuer.issuerId);
  assert.ok(fixtures.catalog.authorizedIssuers.includes(fixtures.issuer.issuerId));
  assert.equal(fixtures.recipientBinding.identityAuthority,fixtures.issuer.issuerId);
  assert.equal(fixtures.recipientBinding.strategy,'OPAQUE_URI');
  assert.equal(fixtures.result.resultDescription,fixtures.catalog.achievement.resultDescription[0].id);
  assert.ok(fixtures.catalog.achievement.criteria.narrative.length>0);
  assert.equal(inputs[1].proof,undefined);
  const forbidden=new Set(['C','B','L','H','statusIndex','microRoot','witnesses','anchorSalt','recordSalt','privateKey','mnemonic','email','nameOfStudent']);
  const walk=x=>{if(x&&typeof x==='object')for(const [k,v]of Object.entries(x)){assert.ok(!forbidden.has(k),k);walk(v);}};
  walk(fixtures);walk(inputs);
});
test('frozen design manifest pins every declared artifact',()=>{
  const f=read('freeze.json');assert.equal(f.status,'CONTRACT_FROZEN');assert.equal(f.publication,'DESIGNED_NOT_PUBLISHED');
  for(const a of f.artifacts)assert.equal(createHash('sha256').update(readFileSync(new URL(a.path,base))).digest('hex'),a.sha256,a.path);
  assert.ok(f.artifacts.some(a=>a.path==='AUTHORITY-MATRIX.json'));
  assert.ok(f.artifacts.some(a=>a.path==='vectors.json'));
});
