import assert from 'node:assert/strict';
const base=(process.env.API_URL||'http://localhost:4181').replace(/\/$/,'');
async function req(path,token,body){const r=await fetch(base+path,{method:body?'POST':'GET',headers:{...(token?{authorization:'Bearer '+token}:{}),'content-type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});return {status:r.status,body:await r.json()};}
const created=await req('/api/create',null,{});assert.equal(created.status,201);const room=created.body.room,actors=created.body.invites;
const coord=actors.find(a=>a.role==='coordinator'),p1=actors.find(a=>a.id==='p1'),p2=actors.find(a=>a.id==='p2'),school=actors.find(a=>a.id==='s1');
const snapshot=a=>req('/api/snapshot?room='+room,a.token);
async function send(a,type,payload={}){const current=await snapshot(a);return req('/api/command',a.token,{room,revision:current.body.revision,operationId:crypto.randomUUID(),type,payload});}
assert.equal((await req('/api/snapshot?room='+room)).status,401);
assert.equal((await req('/api/snapshot?room=another',p1.token)).status,403);
const before=await snapshot(coord);assert.equal((await send(p1,'capacity',{product:'cenoura',qty:50})).status,200);const web=await snapshot(coord);assert.equal(web.body.state.capacities.find(c=>c.supplier==='p1'&&c.product==='cenoura').qty,50);
assert.equal((await req('/api/command',coord.token,{room,revision:before.body.revision,operationId:crypto.randomUUID(),type:'propose'})).status,409);
const revision=await send(coord,'propose');assert.equal(revision.status,200);const version=revision.body.state.plan.version;
assert.equal((await send(coord,'publish')).status,422);
assert.equal((await send(p1,'accept',{version})).status,200);assert.equal((await send(p2,'accept',{version})).status,200);assert.equal((await send(coord,'publish')).status,200);
const d=(await snapshot(p1)).body.state.deliveries.find(d=>d.school==='s1'&&d.product==='cenoura');
assert.equal((await send(p2,'dispatch',{id:d.id})).status,403);assert.equal((await send(p1,'dispatch',{id:d.id})).status,200);
assert.equal((await snapshot(school)).body.state.deliveries.find(x=>x.id===d.id).status,'dispatched');
const ss=await snapshot(school);const cmd={room,revision:ss.body.revision,operationId:crypto.randomUUID(),type:'receive',payload:{id:d.id,delivered:29,rejected:1,note:'Um kg danificado na conferência'}};
assert.equal((await req('/api/command',school.token,cmd)).status,200);assert.equal((await req('/api/command',school.token,cmd)).body.duplicate,true);
const final=(await snapshot(coord)).body.state.deliveries.find(x=>x.id===d.id);assert.equal(final.receipt.accepted,28);assert.equal(final.receipt.rejected,1);
assert.ok((await snapshot(school)).body.state.deliveries.every(d=>d.school==='s1'));
console.log('Integração persistente aprovada: perfis, isolamento, conflito, capacidade → revisão → aceite → publicação → saída → recebimento → web, reenvio idempotente.');
