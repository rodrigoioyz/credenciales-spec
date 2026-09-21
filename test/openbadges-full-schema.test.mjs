import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import Ajv from 'ajv/dist/2020.js';
import Ajv2019 from 'ajv/dist/2019.js';
import {inputs} from './openbadges-fixtures.mjs';
const root=new URL('../',import.meta.url);
const read=p=>JSON.parse(readFileSync(new URL(p,root)));
const full=read('schemas/openbadges-academic-credential/v1.json');
const fragment=read('schemas/openbadges-academic/v1.json');
const ajv=new Ajv({strict:true,allErrors:true});
// Offline format assertions: supported profile is canonical UTC, not local time.
const validDate=s=>/^\d{4}-\d{2}-\d{2}$/.test(s)&&Number.isFinite(Date.parse(s+'T00:00:00Z'))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;
ajv.addFormat('date',validDate);
ajv.addFormat('date-time',s=>/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(s)&&validDate(s.slice(0,10))&&Number.isFinite(Date.parse(s))&&new Date(s).toISOString()===s.replace(/(?<!\.\d{3})Z$/,'.000Z'));
ajv.addSchema(fragment);
const validate=ajv.compile(full),validateFragment=ajv.getSchema(fragment.$id);
const official='https://purl.imsglobal.org/spec/ob/v3p0/schema/json/ob_v3p0_achievementcredential_schema.json';
function credential(){
 const x=structuredClone(inputs[1]);
 x.credentialSchema=[{id:official,type:'1EdTechJsonSchemaValidator2019'},{id:'https://rodrigoioyz.github.io/credenciales-spec/schemas/openbadges-academic-credential/v1.json',type:'JsonSchema'}];
 x.credentialStatus={id:'https://status.invalid/list#42',type:'BitstringStatusListEntry',statusPurpose:'revocation',statusListIndex:'42',statusListCredential:'https://status.invalid/list'};
 return x;
}
test('whole synthetic unsigned credential with authorized-model fields validates structurally',()=>assert.equal(validate(credential()),true,JSON.stringify(validate.errors)));
test('all four academic terms are valid within the subject',()=>{
 const x=credential();assert.equal(x.credentialSubject.academicHours,120);assert.equal(validate(x),true,JSON.stringify(validate.errors));
});
test('complete fixture also satisfies pinned official OB schema',()=>{
 const upstream=new Ajv2019({strict:false,allErrors:true});
 upstream.addFormat('date',validDate);
 upstream.addFormat('date-time',ajv.formats['date-time']);
 const officialValidate=upstream.compile(read('profiles/openbadges/full-credential-v1/upstream-achievementcredential.schema.json'));
 assert.equal(officialValidate(credential()),true,JSON.stringify(officialValidate.errors));
});
test('proof structure is modeled without signing or treating schema success as signature validity',()=>{
 const x=credential();
 x.proof={type:'DataIntegrityProof',cryptosuite:'ecdsa-rdfc-2019',verificationMethod:'https://issuer.invalid/#key',proofPurpose:'assertionMethod',proofValue:'z123'};
 assert.equal(validate(x),true,JSON.stringify(validate.errors));
});
test('complete credential without academic values is valid; optional claims are not invented',()=>{
 const x=credential();
 for(const key of Object.keys(fragment.properties))delete x.credentialSubject[key];
 assert.equal(validate(x),true,JSON.stringify(validate.errors));
});
test('published fragment is unchanged and reused by property references',()=>{
 assert.deepEqual(fragment,read('profiles/openbadges/v1/extension.schema.json'));
 for(const k of Object.keys(fragment.properties))assert.deepEqual(full.$defs.AchievementSubject.properties[k],{$ref:fragment.$id+'#/properties/'+k});
 assert.equal(validateFragment({academicHours:120}),true);
 assert.equal(validateFragment(credential()),false);
});
const attacks=[
 ['fragment as credential',()=>({academicHours:120})],
 ['unknown root',x=>{x.unknown=true;}],
 ['unknown subject',x=>{x.credentialSubject.unknown=true;}],
 ['unknown achievement',x=>{x.credentialSubject.achievement.unknown=true;}],
 ['unknown issuer',x=>{x.issuer.unknown=true;}],
 ['unknown criteria',x=>{x.credentialSubject.achievement.criteria.unknown=true;}],
 ['unknown extension',x=>{x.credentialSubject.academicGrade='A';}],
 ['extension on achievement',x=>{x.credentialSubject.achievement.academicHours=120;}],
 ['wrong context',x=>{x['@context'][2]='https://attacker.invalid/context';}],
 ['extra context',x=>{x['@context'].push('https://attacker.invalid/context');}],
 ['wrong type',x=>{x.type=['VerifiableCredential','AcademicCredential'];}],
 ['wrong subject type',x=>{x.credentialSubject.type=['CredentialSubject'];}],
 ['wrong achievement type',x=>{x.credentialSubject.achievement.type=['Profile'];}],
 ['wrong schema',x=>{x.credentialSchema[1].id=fragment.$id;}],
 ['wrong official schema',x=>{x.credentialSchema[0].id='https://attacker.invalid/schema';}],
 ['wrong official validator',x=>{x.credentialSchema[0].type='JsonSchema';}],
 ['missing schema',x=>{delete x.credentialSchema;}],
 ['unknown schema property',x=>{x.credentialSchema[1].bypass=true;}],
 ['negative hours',x=>{x.credentialSubject.academicHours=-1;}],
 ['fractional hours',x=>{x.credentialSubject.academicHours=0.5;}],
 ['unknown catalog version',x=>{delete x.credentialSubject.achievement.version;}],
 ['missing recipient',x=>{delete x.credentialSubject.id;}],
 ['invalid competency',x=>{x.credentialSubject.academicCompetencyCodes=['bad'];}],
 ['duplicate competency',x=>{x.credentialSubject.academicCompetencyCodes=['SYN:1:A','SYN:1:A'];}],
 ['disabled activity',x=>{x.credentialSubject.activityStartDate='2026-01-01T00:00:00Z';}],
 ['disabled simultaneous status',x=>{x.credentialStatus=[x.credentialStatus,x.credentialStatus];}],
 ['disabled suspension',x=>{x.credentialStatus.statusPurpose='suspension';}],
 ['unknown proof field',x=>{x.proof={type:'DataIntegrityProof',cryptosuite:'ecdsa-rdfc-2019',verificationMethod:'https://issuer.invalid/#key',proofPurpose:'assertionMethod',proofValue:'z123',bypass:true};}],
 ['malformed date',x=>{x.validFrom='tomorrow';}],
 ['impossible date',x=>{x.validFrom='2026-02-30T00:00:00Z';}],
 ['unknown nested result',x=>{x.credentialSubject.result[0].invented=true;}],
 ['unknown evidence',x=>{x.evidence[0].invented=true;}],
 ['extra schema reference',x=>{x.credentialSchema.push({id:'https://attacker.invalid/schema',type:'JsonSchema'});}],
 ['noncanonical status index',x=>{x.credentialStatus.statusListIndex='01';}],
 ['PII outside profile',x=>{x.credentialSubject.email='student@invalid.test';}],
];
for(const [name,mutate]of attacks)test('rejects '+name,()=>{const x=credential();const out=mutate(x);assert.equal(validate(out??x),false);});
