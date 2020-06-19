<h1 align="center">
  <a href="https://www.arks.io">Welcome to Arks</a>
</h1>

<p align="center">
    Do more with less<br />
    This the offical repository of the Arks framework.
</p>

**!! This is for now an experimental project !!**

## What is Arks?
An opiniated React framework for isomorphic apps built on top of React with React Router and Apollo GraphQL.

## Table of Contents

- [Getting Started](#getting-started)
- [Known Bugs](known-bugs)

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

### Arks CLI commands

Start a project as development
```bash
arks dev -p 8080
```

## Arks availables packages
Here is the list of all availbles and packages :

| Name                            | Description                                                 | Implemented    |
| ------------------------------- | ----------------------------------------------------------- | -------------: |
| cli                             | Arks command line interface                                 | Yes            |
| utils                           | Some utils                                                  | Yes            |
| misc                            | Misc things                                                 | Yes            |
| common                          | Some commons used in the other pakcages                     | Yes            |
| monitors                        | Monitors used in an Arks server                             | Yes            |
| logger                          | Arks custom logger                                          | Yes            |
| compiler                        | Arks webpack compiler                                       | Yes            |
| config                          | Arks config                                                 | Yes            |
| server                          | Arks server implementation                                  | Yes            |
| client                          | Arks browser clients functions and components               | Yes            |
| hooks                           | Arks React hooks                                            | No             |


## Known Bugs
Here is the list of know bugs of Arks :

| Name                            | Description                                                 | Corrected    |
| ------------------------------- | ----------------------------------------------------------- | -----------: |
| React hot loader not detected   | False/true - Present and functionnal but not detected       | No           |
| SSR Matching                    | After webpack compliation for SSR React trees doesn't match | No           |

## Built with

* [TypeScript](https://www.typescriptlang.org/)
* [React](https://reactjs.org/)
* [React Router](https://reacttraining.com/react-router/web/guides/quick-start)
* [Apollo GraphQL](https://www.apollographql.com/)
* [NodeJS](https://nodejs.org/en/)
* [Gulp](https://gulpjs.com/)

## Authors

* **Aurélien Dupays Dexemple**