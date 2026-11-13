# Roteiro do pitch - Abastece Escola

Lucas Buzato Venarusso - RM 562332

Duração planejada: 2min45s. Leia apenas os parágrafos de narração. Use o tempo de cada trecho como referência; as cenas poderão ser ajustadas ao áudio final. Grave com voz natural, sem ler os títulos e as instruções de tela. Uma faixa de áudio contínua funciona; arquivos separados por cena também funcionam.

## 00:00 a 00:18 - Problema e beneficiário

Eu sou Lucas Buzato Venarusso, RM 562332. Este é o Abastece Escola. Quando a colheita muda, uma mesma informação precisa chegar a produtores, coordenação e escolas. O estudante depende desse trabalho conjunto para o abastecimento da alimentação escolar.

**Imagem:** Página inicial do site: chamada, paisagem SVG e seção do problema.

## 00:18 a 00:36 - Por que duas plataformas

A proposta divide os papéis. No aplicativo, o produtor informa sua capacidade e registra a saída. A escola confere o recebimento. Na plataforma web, a coordenação distribui quantidades e acompanha a rede. Todos usam os mesmos registros. Esta demonstração tem dados fictícios.

**Imagem:** Site apresenta os três participantes; mostrar início do app do produtor e visão geral da coordenação.

## 00:36 a 00:57 - Uma ação aparece na outra plataforma

Aqui, o produtor altera a capacidade de cenoura de quarenta para cinquenta quilos. A informação aparece na coordenação, que passa a contar com setenta quilos disponíveis na rede. Isso funciona por uma API compartilhada e um banco persistente: SQLite no desenvolvimento e Cloudflare D1 na versão publicada.

**Imagem:** App: Colheita, cenoura 40 kg, editar para 50 e confirmar. Em seguida, planejamento web mostra capacidade total de 70 kg.

## 00:57 a 01:21 - Planejamento e concordância

A coordenação prepara uma revisão da distribuição. Os dois produtores conferem destinos e quantidades e confirmam a mesma versão no app. Só depois o plano é publicado. As regras impedem publicação sem capacidade suficiente ou sem os aceites necessários. As agendas acompanham a versão combinada.

**Imagem:** Web: preparar revisão; app dos dois produtores: conferir e aceitar proposta; web: publicar plano.

## 01:21 a 01:45 - Saída, recebimento e resultado

O produtor registra a saída e a escola passa a ver a entrega a caminho. Nesta conferência, eram trinta quilos previstos, vinte e nove recebidos e um rejeitado com justificativa. O sistema calcula vinte e oito quilos aceitos. A coordenação vê os valores no relatório e pode tratar a divergência.

**Imagem:** Produtor registra saída; escola recebe situação A caminho, informa 29 kg recebidos, 1 kg rejeitado e motivo; relatório web mostra 28 kg aceitos.

## 01:45 a 02:03 - Conexão instável

Se a conexão falhar, a conferência fica marcada como pendente no aparelho. Ela só aparece para a coordenação depois do envio. Neste teste, a recuperação da conexão permitiu sincronizar vinte e quatro quilos de banana sem duplicação. O total aceito passou para cinquenta e dois quilos.

**Imagem:** App da escola salva uma conferência de banana sem conexão, mostra Pendente e envia depois; relatório passa a 52 kg aceitos.

## 02:03 a 02:27 - Design, movimento e acessibilidade

A identidade visual é comum, com tipografia legível, cores por função e ilustrações próprias. O movimento orienta transições e confirmações, com respeito à preferência de movimento reduzido. Status têm texto além da cor, campos têm rótulos e as ações têm áreas de toque confortáveis. A web também oferece navegação por teclado e foco visível.

**Imagem:** Transição entre abas do app, retorno da confirmação, status por texto; web com foco visível e controle de pausa; seção ODS.

## 02:27 a 02:45 - Contribuição e próximos passos

O projeto se relaciona aos ODS dois e doze, pelo abastecimento escolar e pelo registro de diferenças e perdas. Esses efeitos ainda precisam ser medidos em campo. O próximo passo é validar com pessoas reais. O código, o site e a prévia Expo estão disponíveis nos links do projeto.

**Imagem:** Seção ODS e encerramento com links do site, Expo e GitHub.

## Montagem após a narração

As cenas capturam a interface funcionando. A versão mobile é a execução React Native Web do mesmo aplicativo; não é gravação de aparelho físico. As duas plataformas usam o mesmo ambiente de dados fictícios. O áudio do autor será sincronizado na montagem final. Não há entrevistas nem resultados de impacto medidos em campo.
