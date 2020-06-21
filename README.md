<h1 align="center">
  <a href="">Welcome to Arks</a>
</h1>

<p align="center">
  <img width="400" align="center" src="./doc/img/arks-logo.png" />
</p>

<p align="center">
  This the offical repository of the Arks framework.
</p>

<p align="center">
  <a href="https://twitter.com/azeldvin">  
    <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/azeldvin?style=social">
  </a>
</p>

**!! This is for now an experimental project !!**

## What is Arks?
Arks is an **opiniated** open source (very important term) [React](https://reactjs.org/) framework for creating, developing, building and shipping isomorphics apps built on top of [React Router](https://reacttraining.com/react-router/web/guides/quick-start) and [Apollo GraphQL](https://www.apollographql.com/).<br />
In a defined project structure the CLI will mount an [Express](http://expressjs.com/) server for you and serves a server side rendered React App.<br />
Of course because this framework is an opiniated one it will impose you some constraints to respect.<br />
But don't worry this project is open source it will evolve with time.<br />
The project is divided in several packages and the server comes with some features such as monitoring as it will explain below.

Arks is made to be driven by the community so please feel free to send us your feedback, ideas and PRs!

## Table of Contents

- [Getting Started](#getting-started)
- [Arks CLI](#arks-cli)
- [Arks availables packages](#arks-availables-packages)
- [Known Bugs](known-bugs)
- [Built With](#built-with)
- [Authors](#authors)

## Getting Started
Here you can fin all the instructions you need to know to get started with Arks.

### Prerequisites

*  **NodeJS** version >= 12.16.3
*  **NPM** version >= 6.13.0
*  **yarn** yarn is not supported, please use npm

### Installing the Arks CLI

```bash
npm install -g @arks/cli
```

## Arks CLI
The CLI of Arks is based on NPM and with [Commander](https://github.com/tj/commander.js).<br />
You will find some commands like **create**, **dev**, **build**, **start** and **package**.

Create a project
```bash
arks create <name>
```

Start a project as development:
```bash
arks dev -p 8080
```

Build a project as production:
```bash
arks build
```

Start a project as production:
```bash
arks start
```

## Arks availables packages
Here is the list of all availbles and packages :

| Name                            | Description                                                 | Implemented    |
| ------------------------------- | ----------------------------------------------------------- | -------------: |
| cli                             | Arks command line interface                                 | Yes            |
| schematics                      | Arks project schematics                                     | Yes            |
| utils                           | Some utils                                                  | Yes            |
| misc                            | Misc things                                                 | Yes            |
| common                          | Some commons used in the other pakcages                     | Yes            |
| monitors                        | Monitors used in an Arks server                             | Yes            |
| logger                          | Arks custom logger                                          | Yes            |
| compiler                        | Arks webpack compiler                                       | Yes            |
| config                          | Arks config                                                 | Yes            |
| server                          | Arks server implementation                                  | Yes            |
| builder                         | Arks builder implementation                                 | Yes            |
| client                          | Arks browser clients functions and components               | Yes            |
| react                           | Arks React components, hooks, utilities, ...                | Partial        |


## Known Bugs
Here is the list of known bugs of Arks :

| Name                            | Description                                                 | Corrected    |
| ------------------------------- | ----------------------------------------------------------- | -----------: |
| React hot loader not detected   | False/true - Present and functionnal but not detected       | No           |
| SSR Matching                    | After webpack compliation for SSR React trees doesn't match | No           |

## Built with

* [TypeScript](https://www.typescriptlang.org/)
* [React](https://reactjs.org/)
* [React Router](https://reacttraining.com/react-router/web/guides/quick-start)
* [Apollo GraphQL](https://www.apollographql.com/)
* [Express](http://expressjs.com/)
* [NodeJS](https://nodejs.org/en/)
* [Commander](https://github.com/tj/commander.js)
* [Gulp](https://gulpjs.com/)

## Authors

* **Aurélien Dupays Dexemple**