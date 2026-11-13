# Abastece Escola

Do campo ao prato: coordenação do abastecimento escolar com agricultura familiar. Projeto acadêmico CitizenTech com **site de apresentação**, **área de coordenação** e **app React Native/Expo** para produtores e escolas.

- Site: https://abastece-escola.vercel.app
- Coordenação: https://abastece-escola.vercel.app/coordenacao?view=overview
- Repositório privado pessoal: https://github.com/lucasbuzato/abastece-escola
- Vercel conectada ao repositório pessoal. A API persistente existente é encaminhada por /api; web e app usam os mesmos registros.
- Integrantes: **preencher nomes completos e RMs em ordem alfabética** (grupo de 2–5). Esses dados não foram fornecidos.
- Relatório, vídeo-pitch e evidências: pasta `docs/entrega/` quando concluída; situação detalhada em `docs/entrega.txt`.

## O problema e os papéis

Uma mudança na colheita afeta compromissos de diferentes escolas. A coordenação precisa reorganizar quantidades sem exceder capacidade, obter concordância dos produtores e acompanhar o que efetivamente chegou. O produtor usa o app para informar capacidade, confirmar a versão do plano e registrar saída. A escola usa o app para conferir quantidades e rejeições. A web reúne planejamento, distribuição, recebimentos, encaminhamentos e relatório CSV.

O cenário inicial é fictício: Rede do Vale, três escolas, dois fornecedores, dois alimentos e demanda de 130 kg. A redução de capacidade de cenoura cria um descompasso de 10 kg. Não são dados reais de escolas, pessoas, contratos ou compras. Não houve entrevista ou validação de campo; as jornadas são hipóteses de projeto. A equipe informou que não desenvolveu anteriormente o tema em outra disciplina/desafio.

## Demonstração integrada, em duas janelas ou dispositivos

1. Abra o site e entre em **Área da coordenação**. A coordenação cria um ambiente isolado, persistido no servidor.
2. Use **Conectar aplicativo** e escolha Sítio Bom Jardim. Abra o convite ou cole-o no app Expo. Convites dão acesso somente ao perfil e ambiente indicados.
3. No app, em **Colheita**, aumente cenoura de 40 para 50 kg. A web mostra a nova capacidade.
4. Na web, em **Planejamento**, prepare uma revisão. A distribuição não substitui uma decisão de compra: é uma proposta operacional baseada nas capacidades do cenário.
5. Abra os convites dos dois produtores e confirme a proposta em cada acesso. Só então publique na web.
6. No app do produtor, abra uma entrega e registre a saída.
7. No app da escola correspondente, confira o recebimento, registre quantidades e justifique eventual rejeição.
8. Veja a atualização em Entregas/Relatórios na web e exporte o CSV. Se houver divergência, registre o encaminhamento no detalhe da entrega.

Não basta abrir o app e criar uma demonstração separada: para compartilhar dados, use os convites do mesmo ambiente. **Novo ambiente** cria outra sala; preserva a anterior. Os links e dados de sessão são salvos no navegador/aparelho, não no código público.

## Executar localmente

Requisitos: Node.js 24 (o servidor usa `node:sqlite`), npm e, para abrir no celular, Expo Go compatível com SDK 57 ou um development build compatível.

```sh
npm ci
npm run dev
# outro terminal
npm run dev:web
# outro terminal
npm run mobile
```

API: `http://localhost:4181`; web: `http://localhost:4180`. Para a exportação web do app no desenvolvimento: `npm run start --workspace @abastece/mobile -- --web --port 8083`; a web encaminha `/app/` para esse processo. Se o Expo abrir outra porta, ajuste `apps/web/vite.config.ts`.

**No aparelho físico**, localhost é o próprio celular. Use o serviço publicado (padrão do app) e convites gerados na web publicada. Para usar o servidor local em uma rede Wi-Fi, defina `EXPO_PUBLIC_API_URL=http://IP_DO_COMPUTADOR:4181` antes de iniciar o Expo e use convites com esse endereço. Nunca adicione segredos à variável pública. O esquema de URL nativo é `abastece`; o fluxo de convite suportado nesta versão é colar o link no aplicativo.

```sh
npm run typecheck
npm test
npm run test:integration
npm run build:all
# verificação dos bundles nativos, sem simular um aparelho
cd apps/mobile
npx expo install --check
npx expo export --platform ios --platform android --output-dir ../../.build/native
```

O teste de integração cria somente um novo ambiente de dados fictícios. Para executá-lo contra outra origem, informe `API_URL=https://ORIGEM npm run test:integration`.

## Integração e persistência

Ambas as interfaces usam a mesma API HTTP JSON: `POST /api/create`, `GET /api/snapshot`, `POST /api/command`. O estado fica em SQLite no desenvolvimento e Cloudflare D1 na publicação. A atualização é consultada a cada 1,8 s quando o aplicativo está ativo; não é WebSocket nem sincronização instantânea garantida.

Cada comando passa pelas regras compartilhadas em `packages/domain`: perfil autorizado, quantidades válidas, limite de capacidade, confirmação da versão atual, estado da entrega e justificativa de rejeição. Revisão otimista evita sobrescrever alterações simultâneas (409); identificadores de operação tornam reenvios idempotentes. A escola só recebe entregas dela, e o fornecedor só recebe compromissos/capacidades dele. A coordenação vê o conjunto.

Tokens aleatórios de convite são guardados como SHA-256 no servidor, enviados em Authorization e retirados do fragmento da URL após entrada. **São acessos de uma demonstração acadêmica, sem identificação institucional.** Não use o sistema para dados reais. Produção exige autenticação institucional, recuperação/revogação de sessões, auditoria externa, limites de criação/armazenamento, política de retenção e governança de dados. A criação de salas é pública; o controle por perfil protege salas conhecidas por seus convites, não comprova a identidade de uma pessoa.

No app, o último retrato pode ser consultado sem rede. Uma conferência cujo envio falhe por conexão fica marcada **pendente**, vinculada ao acesso original. O usuário reenvia; conflito exige revisão e a anotação não é apresentada como recebimento sincronizado. O app não oferece uma fila geral de operações offline.

## Design, movimento e acessibilidade

A web usa Bricolage Grotesque nos títulos e Source Sans 3 no texto, fontes locais. Verde floresta, lima, amarelo de colheita, azul e terracota têm papéis distintos. Paisagem, curvas de cultivo e horta são SVGs próprios; a fotografia editorial tem crédito e licença. O app conserva a organização por tarefa, com a identidade anterior. A web organiza decisões e comparação; o app concentra uma tarefa e grandes ações. As 48 referências, suas categorias, aplicações e limitações de inspeção estão em `docs/referencias.json`; a síntese em `docs/direcao-visual.txt`. Nenhuma imagem desses projetos integra o produto.

Motion: GSAP/ScrollTrigger no site de apresentação e Motion na navegação da coordenação, com entrada de confirmações e estados de proposta/entrega. SVG de caminhão/colheita reforça a identidade. A web tem pausa de animações ambiente e respeita `prefers-reduced-motion`; o app observa a preferência de movimento reduzido do sistema. Movimento não é necessário para entender informação.

HTML semântico, atalho ao conteúdo, foco visível, diálogos nativos, rótulos para ações e campos, status por texto e cor. O app usa propriedades de acessibilidade e botões de pelo menos 48 px nas ações principais. O texto nativo pode acompanhar a escala do sistema. Não declaramos certificação WCAG nem validação com leitor de tela em dispositivo real. A auditoria da revisão atual, os problemas corrigidos e seus limites estão em `docs/auditoria-design.md`.

## Organização

- `apps/web`: React, TypeScript, Vite, CSS, GSAP, Motion e Lucide.
- `apps/mobile`: React Native/Expo, SVG e AsyncStorage.
- `packages/domain`: regras de negócio compartilhadas pelo serviço.
- `server`: API e adaptador SQLite local.
- `drizzle`: migração D1/SQLite; esquema sem dados pessoais.
- `scripts`: exportação do Worker e teste integrado.
- `tests`: invariantes de domínio.
- `docs`: repertório, decisões, verificações e material acadêmico.

`npm run build:all` exporta as duas interfaces e prepara `dist/server/index.js` como Worker ESM. O arquivo `.openai/hosting.json` declara o banco D1 `DB`. As migrações são aplicadas pelo provedor antes do serviço atender; as salas são criadas pela API. Para outro provedor, adapte o armazenamento D1 ou hospede `server/local.mjs` com volume SQLite persistente; Vercel sem um banco externo não preserva esse SQLite local.

## ODS e limites do escopo

ODS 2 (Fome Zero e Agricultura Sustentável): visibilidade do abastecimento escolar e participação de fornecedores locais. ODS 12 (Consumo e Produção Responsáveis): registrar diferença entre previsto, recebido, aceito e rejeitado ajuda a investigar perdas. O protótipo não comprova redução da fome/desperdício e não determina qualidade sanitária, cardápios, elegibilidade de fornecedores ou decisões de contratação pública.
