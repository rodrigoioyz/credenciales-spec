import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const base='https://rodrigoioyz.github.io/credenciales-spec/';
const results=[];
for(const path of ['contexts/academic/v1.jsonld','vocab/academic/v1','schemas/academic/v1.json','PROFILE.md']){
  const response=await fetch(base+path,{redirect:'error'});
  const bytes=Buffer.from(await response.arrayBuffer());
  const expected=readFileSync(new URL('../'+path,import.meta.url));
  const result={url:base+path,status:response.status,exactBytes:bytes.equals(expected),sha256:createHash('sha256').update(bytes).digest('hex')};
  results.push(result);
  if(response.status!==200||!result.exactBytes)process.exitCode=1;
}
console.log(JSON.stringify({checkedAt:new Date().toISOString(),results},null,2));
