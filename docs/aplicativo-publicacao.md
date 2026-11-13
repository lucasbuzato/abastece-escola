# Aplicativo — revisão e publicação

O aplicativo usa Bricolage Grotesque nos títulos e Source Sans 3 nos textos, com as fontes empacotadas. Verde floresta, lima, amarelo, azul e terracota seguem os papéis da web. A paisagem e o símbolo são vetoriais próprios; o ícone instalado é uma exportação PNG do SVG.

Foram retirados os overlines decorativos, frases genéricas e slogans. A abertura explica os papéis; o início mostra agenda pendente, quantidades e conferências. O histórico registra ações reais. O rodapé identifica os dados fictícios.

## Verificação realizada em 13/11/2026

- Interface React Native Web revisada em 390 e 320 px, nos perfis produtor e escola. Navegação, colheita, agenda, histórico, acesso e janelas de edição/conferência funcionaram sem rolagem horizontal da página.
- Pela interface: capacidade de cenoura alterada de 40 para 50 kg; revisão preparada na coordenação; ambos os produtores aceitaram; plano publicado; produtor registrou saída; escola informou 29 kg recebidos e 1 kg rejeitado; relatório web mostrou 28 kg aceitos.
- Sem conexão: serviço local interrompido durante uma segunda conferência. O app guardou 24 kg como pendentes; após a recuperação, o reenvio atualizou o relatório para 52 kg aceitos sem duplicação. Nenhum dado de instituição real foi usado.
- Testes automatizados: 8 verificações de domínio/modelo e integração contra a API publicada, cobrindo perfis, isolamento, conflito de versão, capacidade, aceite, publicação, saída, recebimento e reenvio idempotente.
- Checagem de tipos aprovada e exportações de bundles Android, iOS e web verificadas. Não houve execução em aparelho físico nem em simulador iOS/Android nesta revisão.

## Uso e publicação

O projeto pertence a `@ucas/abastece-escola`. O endereço de dados é `https://abastece-escola.vercel.app`; os convites gerados pela coordenação abrem o mesmo ambiente. Criar uma nova demonstração gera outro ambiente.

A publicação Expo é um EAS Update no canal/branch `preview`, para o SDK 57. A prévia pode exigir Expo Go compatível com esse SDK; isso não constitui publicação nas lojas. Os perfis EAS também estão preparados para uma compilação nativa futura.

No monorepo, o Metro resolve as versões compartilhadas por seus caminhos padrão; foi desativada a resolução experimental de autolinking do Metro que impedia a inicialização local. As plataformas suportadas são Android, iOS e web. As dependências nativas continuam declaradas no projeto e vinculadas pelo Expo.

## Referências de implementação

- [Expo Font](https://docs.expo.dev/develop/user-interface/fonts/): fontes locais com carregamento antes da interface.
- [EAS Update](https://docs.expo.dev/eas-update/getting-started/): configuração e publicação no ambiente preview.
- [Expo SDK 57](https://expo.dev/changelog/sdk-57): compatibilidade da prévia.
- [Nielsen Norman Group — prototipação com IA](https://www.nngroup.com/articles/ai-prototyping/): decisões guiadas pelo contexto de uso, em vez de repetição de padrões genéricos.
- [Escrita concisa, escaneável e objetiva](https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/): orientação editorial aplicada aos textos. Esses critérios são uma revisão de qualidade, não um detector de autoria por IA.

## Publicação confirmada

- Grupo Expo: `22cec39f-80a7-4660-8bf8-8fe14be72c13`.
- [Abrir atualização na Expo](https://expo.dev/accounts/ucas/projects/abastece-escola/updates/22cec39f-80a7-4660-8bf8-8fe14be72c13). Use Preview para exibir o QR.
- [Abrir diretamente a prévia](https://expo.dev/preview/update?message=Identidade+do+site+e+integra%C3%A7%C3%A3o+produtor-escola+revisadas&updateRuntimeVersion=exposdk%3A57.0.0&createdAt=2026-11-13T21%3A16%3A35.372Z&slug=exp&projectId=1ab49602-b94c-4e8a-93e5-821374b6fa21&group=22cec39f-80a7-4660-8bf8-8fe14be72c13).
- [Abrir a versão web do app](https://abastece-escola.vercel.app/app/).
- Canal `preview` ativo e associado à branch `preview`; manifestos Android e iOS responderam HTTP 200.
- A versão web publicada foi aberta e uma alteração de capacidade foi gravada com sucesso; console sem erros ou advertências nessa sessão.
- O cálculo opcional de fingerprint do EAS foi omitido após exceder o tempo esperado. A compatibilidade da atualização usa o runtime explícito `exposdk:57.0.0`.
