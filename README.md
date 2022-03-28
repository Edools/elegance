# Elegance

This repository contains the documentation and the source code of Edools main theme, Elegance. The full code is **comming soon**
but you can already check our [filters documentation](https://github.com/Edools/elegance/blob/master/README_FILTERS.md)

### Executar no HeroDocker
No HeroDocker:
1. `$ make provision-elegance`
2. `$ make run-elegance`

Para acessar o tema:
1. Entre na URL `http://demo.edools-dev.com:3000`
2. Utilize o seguinte login/senha: `montgomery.burns@edools.com` / `edools1234`

Para forçar a mudança do tema usado pela escola no Core:
1. Acesse o bash do Core (no HeroDocker): `$ make bash-core`
2. Execute o console do Rails: `$ rails c`
3. Execute o comando: `School.find(1).update(theme_id: 1)`