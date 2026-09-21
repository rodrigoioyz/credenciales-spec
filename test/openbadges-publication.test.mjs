import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const bytes=p=>readFileSync(new URL(p,root));
const read=p=>JSON.parse(bytes(p));
test('public OB deployment preserves reviewed artifact bytes and hashes',()=>{
 const m=read('freeze/openbadges-academic-v1.json');
 assert.equal(m.designCommit,'45acbdc6066f751c577cf179e93dc794cda53708');
 assert.equal(m.issuanceEnabled,false);
 for(const [p,s] of [['contexts/openbadges-academic/v1.jsonld','context.jsonld'],['schemas/openbadges-academic/v1.json','extension.schema.json']]){
  assert.deepEqual(bytes(p),bytes('profiles/openbadges/v1/'+s));
 }
 assert.equal(new Set(m.artifacts.map(x=>x.path)).size,m.artifacts.length);
 for(const a of m.artifacts){
  assert.equal(a.url,'https://rodrigoioyz.github.io/credenciales-spec/'+a.path);
  assert.equal(createHash('sha256').update(bytes(a.path)).digest('hex'),a.sha256,a.path);
 }
 for(const path of ['contexts/openbadges-academic/v1.jsonld','schemas/openbadges-academic/v1.json','profiles/openbadges/v1/PUBLICATION.md','profiles/openbadges/v1/vectors.json'])assert.ok(m.artifacts.some(a=>a.path===path));
 const schema=read('schemas/openbadges-academic/v1.json');
 assert.equal(schema.additionalProperties,false);
 assert.equal(schema.$id,'https://rodrigoioyz.github.io/credenciales-spec/schemas/openbadges-academic/v1.json');
 assert.equal(read('contexts/openbadges-academic/v1.jsonld')['@context']['@protected'],true);
});
