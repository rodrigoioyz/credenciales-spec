import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const bytes=p=>readFileSync(new URL(p,root));
const read=p=>JSON.parse(bytes(p));
test('complete OB public freeze pins artifacts, fragment and official schema references',()=>{
 const m=read('freeze/openbadges-academic-credential-v1.json');
 assert.equal(m.issuanceEnabled,false);
 for(const a of m.artifacts){
  assert.equal(a.url,'https://rodrigoioyz.github.io/credenciales-spec/'+a.path);
  assert.equal(createHash('sha256').update(bytes(a.path)).digest('hex'),a.sha256,a.path);
 }
 const schema=read('schemas/openbadges-academic-credential/v1.json');
 const fragment=read('schemas/openbadges-academic/v1.json');
 assert.equal(schema.$id,m.schemaUrl);
 assert.deepEqual(schema.properties.credentialSchema.const,[
  {id:'https://purl.imsglobal.org/spec/ob/v3p0/schema/json/ob_v3p0_achievementcredential_schema.json',type:'1EdTechJsonSchemaValidator2019'},
  {id:m.schemaUrl,type:'JsonSchema'}
 ]);
 for(const name of Object.keys(fragment.properties))assert.deepEqual(schema.$defs.AchievementSubject.properties[name],{$ref:fragment.$id+'#/properties/'+name});
 assert.equal(m.immutability,'Changes require new versioned URLs; no overwrite of published v1 bytes.');
});
