# Elegance

This repository contains the documentation and the source code of Edools main theme, Elegance. The full code is **comming soon**
but you can already check our [filters documentation](https://github.com/Edools/elegance/blob/master/README_FILTERS.md)

# Para executar:
1. Copie o arquivo `theme.json.sample` para `theme.json`
2. Execute `npx edt build development` ou `npx edt serve development` (O Core precisa estar rodando)

## Possíveis erros:
* Em alguns casos o comando `npx edt build development` gera arquivos vazios, e por isso o commit falha (Rollback) no Core e alguns elementos não são exibidos corretamente. Para corrigir, rode o comando apenas com `npx edt build`