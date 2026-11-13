# Revisão de design — Abastece Escola

Revisão local de 11 de novembro de 2026. Escopo: site de apresentação e as sete telas da coordenação. O desenho realista experimental foi descartado; não há imagem gerada incorporada ao site. A nova horta e as curvas de cultivo são SVGs editáveis.

## Correções realizadas

| Problema encontrado | Correção |
| --- | --- |
| Ramos genéricos, repetidos e pouco integrados | Horta com folhas recortadas de couve, nervuras, feijoeiro, flor, vagem e rama de cenoura; composição em espaço reservado. |
| Fundo sem continuidade visual | Curvas de cultivo em duas camadas, com cores suaves e traços vetoriais, fora da leitura principal. |
| Duas entradas de coordenação no cabeçalho | Um botão principal visível também no celular; entrada adicional no menu e rodapé. |
| Cartão de confirmação sobre a nota das plataformas no tablet | Elementos em linhas próprias, com margem entre eles. |
| Selo sobre o título da ilustração no celular | Espaço próprio acima da imagem; distância verificada de 15 px em 320 px. |
| Títulos com frases visualmente grudadas após esconder quebras | Texto contínuo e separação explícita entre as frases em títulos compostos. |
| Guia ultrapassando 320 px (documento com 332 px) | Colunas de grade com mínimo zero e seletor de etapas em grade no celular. Documento voltou a 320 px. |
| Rodapé com vegetação próxima do título no celular | Composição menor, limitada ao canto inferior e afastada do texto. |
| Legenda sobre amarelo abaixo do contraste mínimo para texto pequeno | Cor de texto escura na legenda ilustrativa. |
| Índice decorativo de contraste insuficiente e rótulos repetidos | Índice e rótulos supérfluos retirados da coordenação; metadados úteis mantidos em texto normal. |
| Cabeçalho de janela desaparecendo em conteúdo longo | Cabeçalho fixado durante a rolagem do diálogo e fechamento com alvo maior. |
| Legenda da paisagem apertada em 320 px | Ícones redundantes retirados apenas nessa largura; nomes e setas permanecem. |

## Verificações

- Site: verificação de reflow em 320, 390, 768, 1024, 1280 e 1440 px. Inspeção visual de abertura, problema, solução, etapas, demonstração, perguntas e rodapé. Não foi identificada rolagem horizontal da página após os ajustes.
- Coordenação: visão geral, planejamento, entregas, escolas, produtores, relatório e guia verificados em 320, 390, 768 e 1440 px. Tabelas extensas mantêm rolagem dentro da região identificada; a página permanece na largura do dispositivo.
- Janelas: conexão/QR, revisão, entrega, recebimentos da escola, atualizações, período, ambiente e navegação. Conferidos largura, legibilidade, rolagem, botão de fechar e fechamento por Escape. O foco inicial do detalhe foi observado no botão de fechamento; diálogos usam o elemento nativo `dialog`.
- Conteúdo e interação: âncoras internas presentes, etapas alternáveis, simulação por teclado em capacidade mínima, máxima e cobertura, perguntas expansíveis e entrada na coordenação pelo site.
- Contraste: checagem de cores calculadas dos textos sobre fundos sólidos nas sete telas e nas etapas ilustradas; os dois achados registrados acima foram corrigidos. Este método não substitui inspeção manual sobre imagens, estados de foco, leitor de tela ou certificação de acessibilidade.
- Movimento: pausa disponível; GSAP configurado para respeitar movimento reduzido, com limpeza dos efeitos ao pausar ou desmontar. O veículo continua limitado à estrada. Sem rolagem forçada.
- Console: nenhuma advertência ou erro observado na sessão revisada.
- Validação funcional: 8 testes aprovados; checagem de tipos web/mobile e compilação aprovadas. Integração persistente aprovada para perfis, isolamento, conflito, capacidade, revisão, aceite, publicação, saída, recebimento e reenvio idempotente.

## Evidências

As capturas em `evidencias/revisao-design/` mostram a abertura, a horta SVG, a coordenação no desktop e no celular. As animações foram pausadas nas capturas para permitir inspeção da composição final.

## Critérios usados

- [Heurísticas de usabilidade — Nielsen Norman Group](https://www.nngroup.com/articles/ten-usability-heuristics/): estado visível, linguagem do trabalho, controle, consistência e prevenção de erros.
- [Reflow — WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html): leitura em tela estreita e regiões de tabela independentes.
- [Contraste de texto — WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): referência de 4,5:1 para texto normal e 3:1 para texto grande.
- [Hierarquia de títulos — W3C](https://www.w3.org/WAI/tutorials/page-structure/headings/): títulos descritivos e ordem compreensível.
- [Movimento reduzido — W3C](https://www.w3.org/WAI/WCAG22/Techniques/css/C39): respeito à preferência do sistema.
- [SVG viewBox — MDN](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/viewBox) e [preserveAspectRatio](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/preserveAspectRatio): coordenadas e enquadramento escaláveis.
- [GSAP matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/): preferências e condições de tamanho, com reversão dos efeitos.

## Limites

A auditoria identifica problemas nas condições testadas; não garante ausência de qualquer defeito em todos os navegadores. Não houve avaliação com participantes reais, leitor de tela em dispositivo físico ou execução nativa em iOS/Android nesta revisão. Os dados continuam fictícios. As alterações permanecem locais, sem novo repositório ou publicação externa.
