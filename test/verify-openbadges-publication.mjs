import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url);
const manifestPath=process.argv[2]??'freeze/openbadges-academic-v1.json';
if(!['freeze/openbadges-academic-v1.json','freeze/openbadges-academic-credential-v1.json'].includes(manifestPath))throw new Error('UNRECOGNIZED_PUBLIC_MANIFEST');
const bytes=readFileSync(new URL(manifestPath,root));
const manifest=JSON.parse(bytes);
const hash=b=>createHash('sha256').update(b).digest('hex');
const artifacts=[...manifest.artifacts,{path:manifestPath,url:'https://rodrigoioyz.github.io/credenciales-spec/'+manifestPath,sha256:hash(bytes)}];
const results=[];
for(const a of artifacts){
 const expected=readFileSync(new URL(a.path,root));
 const response=await fetch(a.url,{redirect:'error',signal:AbortSignal.timeout(30000)});
 const actual=Buffer.from(await response.arrayBuffer());
 const result={url:a.url,status:response.status,byteMatch:actual.equals(expected),hashMatch:hash(actual)===a.sha256&&hash(expected)===a.sha256,sha256:hash(actual)};
 results.push(result);
 if(result.status!==200||!result.byteMatch||!result.hashMatch)process.exitCode=1;
}
console.log(JSON.stringify({checkedAt:new Date().toISOString(),results},null,2));
