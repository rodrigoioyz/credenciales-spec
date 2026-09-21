import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import Ajv from 'ajv/dist/2020.js';
import jsonld from 'jsonld';

const contextUrl='https://rodrigoioyz.github.io/credenciales-spec/contexts/academic/v1.jsonld';
const context=JSON.parse(readFileSync(new URL('../contexts/academic/v1.jsonld',import.meta.url)));
const schema=JSON.parse(readFileSync(new URL('../schemas/academic/v1.json',import.meta.url)));
const validate=new Ajv({strict:true}).compile(schema);
const loader=async url=>{assert.equal(url,contextUrl);return {contextUrl:null,documentUrl:url,document:context};};
const subject={achievement:'Synthetic recognition',program:'Synthetic program',hours:120,competencies:['DEMO:1:COMP-A','DEMO:1:COMP-B']};

test('closed subject schema: positive and adversarial cases',()=>{
  for(const value of [subject,{hours:0},{program:'Programa 😀'},{competencies:['DEMO:1:A']}])assert.equal(validate(value),true,JSON.stringify(validate.errors));
  for(const value of [{},{hours:-1},{hours:0.5},{hours:9007199254740992},{hours:'120'},{competencies:['A']},{competencies:['D:1:A','D:1:A']},{competencies:['D:1:A ']},{competencies:['D:1:á']},{name:'Student',hours:1},{program:'bad\ntext'}])assert.equal(validate(value),false,JSON.stringify(value));
});
test('context protects exact terms, no catch-all vocabulary',()=>{
  assert.equal(context['@context']['@protected'],true);
  assert.equal(context['@context']['@version'],1.1);
  assert.equal(context['@context']['@vocab'],undefined);
  assert.deepEqual(Object.keys(context['@context']).sort(),['@version','@protected','AcademicCredential','achievement','program','hours','competencies'].sort());
});
test('offline expansion and RDFC-1.0, set order irrelevant and mutation detected',async()=>{
  const input={'@context':contextUrl,'@type':'AcademicCredential',...subject};
  const options={documentLoader:loader,algorithm:'RDFC-1.0',format:'application/n-quads'};
  const expanded=await jsonld.expand(input,{documentLoader:loader});
  const nquads=await jsonld.canonize(input,options);
  assert.match(nquads,/XMLSchema#integer/);
  assert.equal(await jsonld.canonize({...input,competencies:[...subject.competencies].reverse()},options),nquads);
  assert.notEqual(await jsonld.canonize({...input,hours:121},options),nquads);
  await assert.rejects(jsonld.expand({...input,'@context':[contextUrl,{hours:'https://attacker.invalid/hours'}]},{documentLoader:loader}));
  const file=new URL('../vectors/academic-v1.json',import.meta.url);
  if(existsSync(file)){
    const vector=JSON.parse(readFileSync(file));
    assert.deepEqual(vector.input,input);
    assert.deepEqual(vector.expanded,expanded);
    assert.equal(vector.canonicalNQuads,nquads);
  }
});
