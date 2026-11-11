import {createState,transition,viewFor,DomainError} from '../packages/domain/index.mjs';
const digest=async text=>Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))).map(b=>b.toString(16).padStart(2,'0')).join('');
const token=()=>crypto.randomUUID().replaceAll('-','')+crypto.randomUUID().replaceAll('-','');
const json=(body,status=200)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','access-control-allow-origin':'*','access-control-allow-headers':'authorization,content-type','access-control-allow-methods':'GET,POST,OPTIONS','x-content-type-options':'nosniff'}});
export async function api(request,env){
 if(request.method==='OPTIONS')return json({ok:true});
 const url=new URL(request.url);const db=env.DB;if(!db)return json({error:'O serviço de dados não está disponível.'},503);
 try{
  if(url.pathname==='/api/health')return json({ok:true,storage:'persistent',app:'Abastece Escola'});
  if(url.pathname==='/api/create'&&request.method==='POST'){
   const id=crypto.randomUUID();const state=createState();const now=new Date().toISOString();const actors=[{role:'coordinator',id:'coord',name:'Coordenação'},...state.suppliers.map(p=>({role:'supplier',id:p.id,name:p.name})),...state.schools.map(s=>({role:'school',id:s.id,name:s.name}))];
   const credentials=await Promise.all(actors.map(async actor=>{const t=token();return {...actor,token:t,hash:await digest(t)};}));
   await db.batch([db.prepare('INSERT INTO rooms(id,data,revision,created_at) VALUES(?,?,1,?)').bind(id,JSON.stringify(state),now),...credentials.map(c=>db.prepare('INSERT INTO sessions(token_hash,room_id,role,actor_id,name,created_at) VALUES(?,?,?,?,?,?)').bind(c.hash,id,c.role,c.id,c.name,now))]);
   return json({room:id,token:credentials[0].token,invites:credentials.map(({hash,...rest})=>rest)},201);
  }
  const auth=request.headers.get('authorization')??'';if(!auth.startsWith('Bearer ')||auth.length>100)throw new DomainError('Acesse pelo convite do seu ambiente de demonstração.',401);
  const row=await db.prepare('SELECT * FROM sessions WHERE token_hash=?').bind(await digest(auth.slice(7))).first();if(!row)throw new DomainError('Convite não encontrado. Confira o acesso.',401);
  const actor={role:row.role,id:row.actor_id,name:row.name};const room=await db.prepare('SELECT * FROM rooms WHERE id=?').bind(row.room_id).first();if(!room)throw new DomainError('Ambiente não encontrado.',404);
  if(url.searchParams.has('room')&&url.searchParams.get('room')!==room.id)throw new DomainError('Acesso a outro ambiente não permitido.',403);
  const state=JSON.parse(room.data);
  if(url.pathname==='/api/snapshot'&&request.method==='GET')return json({state:viewFor(state,actor),revision:room.revision,actor,updatedAt:new Date().toISOString()});
  if(url.pathname==='/api/command'&&request.method==='POST'){
   if(Number(request.headers.get('content-length'))>8192)throw new DomainError('Solicitação muito grande.',413);
   const body=await request.json();if(JSON.stringify(body).length>8192)throw new DomainError('Solicitação muito grande.',413);
   if(body.room!==room.id)throw new DomainError('Ambiente não permitido.',403);
   if(state.operations.includes(body.operationId))return json({state:viewFor(state,actor),revision:room.revision,actor,duplicate:true});
   if(body.revision!==room.revision)throw new DomainError('Outra pessoa atualizou os dados. Atualize a tela e confira sua ação.',409);
   const result=transition(state,actor,body);
   const changed=await db.prepare('UPDATE rooms SET data=?, revision=revision+1 WHERE id=? AND revision=?').bind(JSON.stringify(result.state),room.id,room.revision).run();
   if(changed.meta.changes!==1)throw new DomainError('Os dados mudaram durante o envio. Atualize e tente novamente.',409);
   return json({state:viewFor(result.state,actor),revision:room.revision+1,actor});
  }
  return json({error:'Caminho não encontrado.'},404);
 }catch(error){if(error instanceof DomainError)return json({error:error.message},error.status);return json({error:'Não foi possível concluir. Tente novamente em instantes.'},500);}
}
