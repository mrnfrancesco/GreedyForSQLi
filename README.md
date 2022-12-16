<p align="center">
  <img alt="Powered by Semgrep" src="https://img.shields.io/badge/Powered%20by-Semgrep-brightgreen?style=for-the-badge">
  <img alt="Target Wordpress plugins" src="https://img.shields.io/badge/Target-Plugins-blue?style=for-the-badge&logo=wordpress">
  <img alt="License LGPL 2.1 only" src="https://img.shields.io/github/license/mrnfrancesco/GreedyForSQLi?style=for-the-badge">
</p>

![copertina](https://user-images.githubusercontent.com/8071136/197403921-375eb097-3b00-4ca0-87fa-0024aff99dec.png)

# Greedy for SQL Injection

Slides and code used to present the research conducted together with [@dipa96](https://github.com/dipa96) in which we implemented custom templates for Semgrep with the purpose of detecting SQL Injection from the analysis of Wordpress plugin source code.

## Table of contents

- [About](#about)
- [Getting Started](#getting_started)
- [Installing](#installing)
- [Usage](#usage)
- [Achievements](#achievements)
- [Contributing](#contributing)
## About

This project was presented at the [ComeToCode2022](https://www.cometocode.it/) conference.
The project was born out of a desire to explore the world of code review and the [SemGrep](https://semgrep.dev/) tool.

Watch our presentation at: [Slides_ENG](slides/GreedyForSQLi_slides_ENG.pdf)

## Getting Started

**Project requires:**
+ [git](https://git-scm.com/)
+ [docker](https://docs.docker.com/get-docker/)
+ [docker-compose](https://docs.docker.com/compose/install/linux/)
+ [semgrep](https://semgrep.dev/docs/getting-started/)  

Make sure each requirement is **installed correctly** before proceeding.

## Installing

Run the following command to **download** the latest version of project.
```
git clone https://github.com/dipa96/GreedyForSQLi
```

Setting up your **wordpress** environment. Check **docker-compose.yaml** file for details or change settings.
```
cd GreedyForSQLi
docker-compose up -d
```
By default **you will find** wordpress at: http://10.10.10.2/

## Usage

Once have WordPress configured you will have **plugins** installed and  already be able to **launch your first semgrep scan** with our semgrep templates.

```
cd GreedyForSQLi
cd rules/php/wordpress/plugins
semgrep -c ajax-action-to-sqli.yaml -c ajax-action-to-sqli-deep.yaml ../../../../plugins/wp-visual-slidebox-builder
```

## Achievements
We started reporting vulnerabilities to [WPScan](https://wpscan.com/).  Currently these are the updated CVEs.

+ CVE-2022-3241 | [Build App Online < 1.0.19 - Unauthenticated SQL Injection](https://wpscan.com/vulnerability/a995dd67-43fc-4087-a7f1-5db57f4c828c)
+ CVE-2022-3860 | [Visual Email Designer for WooCommerce < 1.7.2 - Multiple Author+ SQLi](https://wpscan.com/vulnerability/d99ce21f-fbb6-429c-aa3b-19c4a5eb7557)

## Contributing

+ [Francesco Marano](https://www.linkedin.com/in/mrnfrancesco/)
+ [Donato Di Pasquale](https://www.linkedin.com/in/ddipa/)
