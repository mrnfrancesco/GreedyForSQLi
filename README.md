<p align="center">
  <img alt="Powered by Semgrep" src="https://img.shields.io/badge/Powered%20by-Semgrep-brightgreen?style=for-the-badge">
  <img alt="Target Wordpress plugins" src="https://img.shields.io/badge/Target-Plugins-blue?style=for-the-badge&logo=wordpress">
  <img alt="License LGPL 2.1 only" src="https://img.shields.io/github/license/mrnfrancesco/GreedyForSQLi?style=for-the-badge">
</p>

![copertina](https://user-images.githubusercontent.com/8071136/197403921-375eb097-3b00-4ca0-87fa-0024aff99dec.png)

In questa repository sono presenti le slide e il codice utilizzati per presentare la ricerca condotta insieme a [@dipa96](https://github.com/dipa96) in cui abbiamo implementato dei template personalizzati per Semgrep con lo scopo di individuare SQL Injection dall'analisi del codice sorgente dei plugin di Wordpress.

# Pre-requisiti

+ Installazione [docker](https://docs.docker.com/get-docker/)
+ Installazione [semgrep](https://semgrep.dev/docs/getting-started/)

# Configurazione ambiente

### Download repository

```
$> git clone https://github.com/dipa96/GreedyForSQLi.git
```

### Inizializzare instanza di wordpress locale su 10.10.10.2
```
$> cd GreedyForSQLi

$> docker-compose up -d

# procedere con la normale installazione di WordPress
```

### Lanciare Semgrep su plugin di esempio

```
$> cd rules/php/wordpress/plugins

$> semgrep -c ajax-action-to-sqli.yaml -c ajax-action-to-sqli-deep.yaml ../../../../plugins/wp-visual-slidebox-builder
```
