export class DomainError extends Error { constructor(message,status=422){super(message);this.status=status;} }
export const kg = v => new Intl.NumberFormat('pt-BR',{maximumFractionDigits:2}).format(v);
const quantity=v=>{const n=typeof v==='string'?Number(v.replace(',','.')):v;if(!Number.isFinite(n)||n<0||n>100000||Math.abs(n*1000-Math.round(n*1000))>.00001)throw new DomainError('Informe uma quantidade válida em kg, com até três casas decimais.');return Math.round(n*1000)/1000;};
const add=(a,b)=>Math.round((a+b)*1000)/1000;
export function createState(now=new Date().toISOString()){
 const schools=[{id:'s1',name:'E.M. Vila Esperança',short:'Vila Esperança',students:240,color:'#DDE8BE',initials:'VE'},{id:'s2',name:'E.M. Caminho do Sol',short:'Caminho do Sol',students:180,color:'#F4DCC4',initials:'CS'},{id:'s3',name:'E.M. Jardim das Flores',short:'Jardim das Flores',students:160,color:'#DDE5EC',initials:'JF'}];
 const suppliers=[{id:'p1',name:'Sítio Bom Jardim',person:'Ana Oliveira',short:'Bom Jardim',initials:'BJ',town:'Agricultura familiar',color:'#E6E9D5'},{id:'p2',name:'Cooperativa Raízes',person:'Pedro Santos',short:'Raízes',initials:'RA',town:'Cooperativa local',color:'#F1DFCC'}];
 const products=[{id:'cenoura',name:'Cenoura',icon:'carrot',color:'#E7A26A'},{id:'banana',name:'Banana',icon:'banana',color:'#D9D67D'}];
 const capacities=[{supplier:'p1',product:'cenoura',qty:40,limit:50},{supplier:'p2',product:'cenoura',qty:20,limit:30},{supplier:'p1',product:'banana',qty:35,limit:40},{supplier:'p2',product:'banana',qty:35,limit:40}];
 const demands=schools.flatMap((s,i)=>products.map(p=>({school:s.id,product:p.id,qty:p.id==='cenoura'?[30,25,15][i]:[24,18,18][i]})));
 const raw=[['p1','s1','cenoura',30],['p1','s2','cenoura',10],['p2','s2','cenoura',15],['p2','s3','cenoura',15],['p1','s1','banana',24],['p1','s2','banana',11],['p2','s2','banana',7],['p2','s3','banana',18]];
 return {id:'rede-escola',name:'Rede do Vale',demo:true,cycle:{id:'nov-24',label:'Ciclo 24',start:'2026-11-09',end:'2026-11-13',deliveryDate:'2026-11-12'},schools,suppliers,products,capacities,demands,plan:{version:1,status:'published',accepts:{p1:1,p2:1}},deliveries:raw.map(([supplier,school,product,qty],i)=>({id:'ent-'+(i+1),supplier,school,product,qty,status:'scheduled',date:'2026-11-12',time:i%2?'09:30':'08:00'})),events:[{id:crypto.randomUUID(),title:'Capacidade de cenoura atualizada',detail:'Cooperativa Raízes confirmou 20 kg. O plano precisa de uma revisão de 10 kg.',at:now,actor:'Cooperativa Raízes'},{id:crypto.randomUUID(),title:'Ambiente de demonstração iniciado',detail:'Cenário fictício: plano publicado e uma mudança de fornecimento para resolver.',at:now,actor:'Coordenação'}],operations:[],notes:[]};
}
export function summarize(s){
 const demand=s.demands.reduce((n,d)=>add(n,d.qty),0);
 const planned=s.deliveries.filter(d=>d.status!=='cancelled').reduce((n,d)=>add(n,d.qty),0);
 const accepted=s.deliveries.reduce((n,d)=>add(n,d.receipt?.accepted??0),0);
 const rejected=s.deliveries.reduce((n,d)=>add(n,d.receipt?.rejected??0),0);
 const issues=[];
 for(const c of s.capacities){const committed=s.deliveries.filter(d=>d.supplier===c.supplier&&d.product===c.product&&d.status!=='cancelled').reduce((n,d)=>add(n,d.qty),0);if(committed>Math.min(c.qty,c.limit))issues.push({supplier:c.supplier,product:c.product,qty:add(committed,-Math.min(c.qty,c.limit))});}
 return {demand,planned,accepted,rejected,shortage:issues.reduce((n,x)=>add(n,x.qty),0),issues,delivered:s.deliveries.filter(d=>d.status==='received').length,totalDeliveries:s.deliveries.filter(d=>d.status!=='cancelled').length,coverage:demand?Math.round(accepted/demand*100):0};
}
export function viewFor(s,actor){
 if(actor.role==='coordinator')return s;
 const out=structuredClone(s);
 if(actor.role==='supplier'){out.capacities=out.capacities.filter(c=>c.supplier===actor.id);out.deliveries=out.deliveries.filter(d=>d.supplier===actor.id);out.suppliers=out.suppliers.filter(p=>p.id===actor.id);out.events=out.events.filter(e=>e.actor===actor.name||e.actor==='Coordenação');out.demands=out.demands.filter(d=>out.deliveries.some(x=>x.school===d.school&&x.product===d.product));}
 else {out.deliveries=out.deliveries.filter(d=>d.school===actor.id);out.demands=out.demands.filter(d=>d.school===actor.id);out.schools=out.schools.filter(s=>s.id===actor.id);out.capacities=[];out.events=out.events.filter(e=>e.actor===actor.name||e.actor==='Coordenação');}
 out.operations=[];return out;
}
export function transition(state,actor,command,now=new Date().toISOString()){
 const s=structuredClone(state);const {type,payload={},operationId}=command;
 if(!operationId||typeof operationId!=='string'||operationId.length>100)throw new DomainError('Identificador da operação inválido.');
 if(s.operations.includes(operationId))return {state:s,duplicate:true};
 const requireRole=role=>{if(actor.role!==role)throw new DomainError('Seu perfil não permite esta ação.',403);};
 const event=(title,detail)=>s.events.unshift({id:crypto.randomUUID(),title,detail,at:now,actor:actor.name});
 if(type==='capacity'){
  requireRole('supplier');const c=s.capacities.find(c=>c.supplier===actor.id&&c.product===payload.product);if(!c)throw new DomainError('Alimento não vinculado ao fornecedor.',403);
  c.qty=quantity(payload.qty);if(c.qty>c.limit)throw new DomainError('Quantidade acima do limite do fornecimento.');
  event('Capacidade atualizada',`${actor.name} confirmou ${kg(c.qty)} kg de ${c.product}.`);
 }else if(type==='propose'){
  requireRole('coordinator');if(s.deliveries.some(d=>d.status==='dispatched'||d.status==='received'))throw new DomainError('Há entregas em execução. Preserve o plano e trate a ocorrência.');
  const remaining=new Map(s.capacities.map(c=>[c.supplier+':'+c.product,Math.min(c.qty,c.limit)]));const allocations=[];
  for(const demand of s.demands){let need=demand.qty;for(const supplier of s.suppliers){const k=supplier.id+':'+demand.product;const available=remaining.get(k)??0;const q=Math.min(need,available);if(q>0){allocations.push({id:'ent-'+crypto.randomUUID().slice(0,8),supplier:supplier.id,school:demand.school,product:demand.product,qty:q,status:'scheduled',date:s.cycle.deliveryDate,time:allocations.length%2?'09:30':'08:00'});remaining.set(k,add(available,-q));need=add(need,-q);}}}
  s.archivedPlans=[...(s.archivedPlans??[]),{...s.plan,deliveries:s.deliveries}].slice(-20);s.deliveries=allocations;s.plan={version:s.plan.version+1,status:'draft',accepts:{}};event('Nova distribuição preparada',`Versão ${s.plan.version} aguarda confirmação dos fornecedores. Quantidades descobertas permanecem visíveis.`);
 }else if(type==='allocate'){
  requireRole('coordinator');if(s.plan.status!=='draft')throw new DomainError('Prepare uma revisão antes de alterar as quantidades.');
  const d=s.deliveries.find(d=>d.id===payload.id);if(!d)throw new DomainError('Entrega não encontrada.',404);d.qty=quantity(payload.qty);s.plan.accepts={};s.plan.version+=1;
  validatePlan(s,false);event('Distribuição ajustada','As confirmações anteriores foram invalidadas.');
 }else if(type==='accept'){
  requireRole('supplier');if(payload.version!==s.plan.version||s.plan.status!=='draft')throw new DomainError('O plano mudou. Atualize para confirmar a versão atual.',409);
  if(!s.deliveries.some(d=>d.supplier===actor.id))throw new DomainError('Nenhuma entrega atribuída a este fornecedor.');s.plan.accepts[actor.id]=s.plan.version;event('Proposta confirmada',`${actor.name} confirmou a versão ${s.plan.version}.`);
 }else if(type==='publish'){
  requireRole('coordinator');if(s.plan.status!=='draft')throw new DomainError('O plano já está publicado.');validatePlan(s,true);
  for(const p of new Set(s.deliveries.filter(d=>d.qty>0).map(d=>d.supplier)))if(s.plan.accepts[p]!==s.plan.version)throw new DomainError('Aguarde a confirmação de todos os fornecedores.');
  s.plan.status='published';event('Plano publicado',`Versão ${s.plan.version} disponível para as escolas.`);
 }else if(type==='dispatch'){
  requireRole('supplier');const d=s.deliveries.find(d=>d.id===payload.id&&d.supplier===actor.id);if(!d)throw new DomainError('Entrega não permitida.',403);if(s.plan.status!=='published'||summarize(s).shortage>0)throw new DomainError('Resolva o plano de abastecimento antes da saída.');if(d.status!=='scheduled')throw new DomainError('Esta entrega já saiu ou foi conferida.',409);d.status='dispatched';d.dispatchedAt=now;event('Entrega a caminho',`${kg(d.qty)} kg de ${d.product} para ${s.schools.find(x=>x.id===d.school).short}.`);
 }else if(type==='receive'){
  requireRole('school');const d=s.deliveries.find(d=>d.id===payload.id&&d.school===actor.id);if(!d)throw new DomainError('Entrega não permitida.',403);if(d.status!=='dispatched')throw new DomainError('A entrega precisa estar a caminho e ainda não conferida.',409);
  const delivered=quantity(payload.delivered),rejected=quantity(payload.rejected??0);if(delivered>d.qty||rejected>delivered)throw new DomainError('Confira os valores: recebido não supera previsto, e rejeitado não supera recebido.');
  const note=String(payload.note??'').trim().slice(0,300);if(rejected>0&&!note)throw new DomainError('Informe o motivo da rejeição.');d.receipt={delivered,accepted:add(delivered,-rejected),rejected,note,at:now};d.status='received';event('Recebimento conferido',`${actor.name}: ${kg(d.receipt.accepted)} kg aceitos de ${d.product}.`);
 }else if(type==='resolve'){
  requireRole('coordinator');const d=s.deliveries.find(d=>d.id===payload.id);if(!d?.receipt)throw new DomainError('Recebimento não encontrado.');const note=String(payload.note??'').trim();if(note.length<8)throw new DomainError('Descreva o encaminhamento da divergência.');d.resolution={note:note.slice(0,400),at:now};event('Encaminhamento registrado',note.slice(0,160));
 }else throw new DomainError('Ação desconhecida.',400);
 s.operations=[...s.operations,operationId].slice(-500);return {state:s,duplicate:false};
}
export function validatePlan(s,complete){
 const sums=new Map();for(const d of s.deliveries){quantity(d.qty);const capacity=s.capacities.find(c=>c.supplier===d.supplier&&c.product===d.product);if(!capacity||!s.schools.some(x=>x.id===d.school))throw new DomainError('Alocação não autorizada.');const k=d.supplier+':'+d.product;sums.set(k,add(sums.get(k)??0,d.qty));}
 for(const c of s.capacities)if((sums.get(c.supplier+':'+c.product)??0)>Math.min(c.qty,c.limit))throw new DomainError('A distribuição supera a capacidade confirmada.');
 for(const demand of s.demands){const sum=s.deliveries.filter(d=>d.school===demand.school&&d.product===demand.product).reduce((n,d)=>add(n,d.qty),0);if(sum>demand.qty)throw new DomainError('A distribuição supera a demanda da escola.');if(complete&&sum<demand.qty)throw new DomainError('Há demanda descoberta. Confirme mais capacidade antes de publicar.');}
}
