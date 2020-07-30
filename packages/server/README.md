<h1 align="center">
  <a href="">Welcome to Arks (preview)</a>
</h1>

<p align="center">
  <img width="400" align="center" src="./medias/img/arks-logo.png" />
</p>

<p align="center">
  This the offical repository of the Arks framework.
</p>

<p align="center">
  <a href="https://lerna.js.org/">
    <img alt="With Lerna" src="https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg">
  </a>
</p>

<p align="center">
  <a href="https://twitter.com/azeldvin">  
    <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/azeldvin?style=social">
  </a>
</p>

**!! This is for now an experimental project !!**

## What is Arks?
Arks is an **opiniated** open source (very important term) [React](https://reactjs.org/) framework for creating, developing, building and shipping isomorphics apps built on top of [React Router](https://reacttraining.com/react-router/web/guides/quick-start) and [Apollo GraphQL](https://www.apollographql.com/).<br />
So all of the parts of an Arks project is made to be used in a **defined** and **strict** context. Of course this context can evolves with time.<br />
In a defined project structure the CLI will mount an [Express](http://expressjs.com/) server with some features for you and serves a server side rendered React App.<br />
This is the main **purpose** of Arks: to let developers **focusing more** on the quick development of the React application without to be worried by the implementation of a server for enabling server side rendering with [React Router](https://reacttraining.com/react-router/web/guides/quick-start) and [Apollo GraphQL](https://www.apollographql.com/).

The project is divided in several packages and the server comes with some features such as monitoring as it will explain below.

Arks is made to be driven by the community so please feel free to send us your feedback, ideas and PRs!

## Table of Contents

- [Getting Started](#getting-started)
- [Arks CLI](#arks-cli)
- [Arks availables packages](#arks-availables-packages)
- [Arks project structure](#arks-project-structure)
- [Arks configuration files](#arks-configuration-files)
- [Arks Express server](#arks-express-server)
- [Arks Apollo client](#arks-apollo-client)
- [Arks React application](#arks-react-application)
- [Design systems and stylesheets](#design-systems-and-stylesheets)
- [Samples](#samples)
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
You can install the Arks cli by running the following command:
```bash
npm install -g @arks/cli
```
Once the cli is installed you can go ahead to create an develop Arks projects.

## Arks CLI
The CLI of Arks is based on NPM and with [Commander](https://github.com/tj/commander.js).<br />
You will find some commands like **create**, **dev**, **build** and **start**.

### Help
If you need help the cli comes with it.<br />
You can use the following command:

```bash
arks -h
```

### Command: `create`
The **create** command is composed of sub commands which let you creating Arks project or objects such as components (incoming feature) into your project.

#### Creating a project
The first sub command of the create command is *project*.<br />
This sub command will creates into a directory of the name of the project and then creates all the files needed for running an Arks project and install the node_modules.

Command: 
```bash
arks create project <name>
```
Args:
| Name                            | Description         | Type           | Default Value  | Required |
| ------------------------------- | ------------------- |--------------- | -------------- | -------- |
| name                            | name of the project | string         |                | yes      |

### Command: `dev`
The **dev** command let you start an Arks project as development.<br />
It will creates a webpack dev compiler with hot reloading for client side rendering and server side rendering, then creates and starts an Express server.

Command:
```bash
arks dev -p 8080
```
Options:
| Name                            | Alias           | Description              | Type    | Default Value  | Required |
| ------------------------------- | --------------- | ------------------------ | ------- | -------------- | -------- |
| --port                          | -p              | Specific port to use     | string  | 8080           | no       |
| --host                          | -s              | Specific host to use     | string  | 0.0.0.0        | no       |
| --protocol                      | -p              | Specific protocol to use | string  | http           | no       |

### Command: `build` 
The **build** command will build and Arks project as production.<br />
It will makes two builds. One for client side rendering and on for server side rendering.

Command: 
```bash
arks build
```
Options:
| Name                            | Alias           | Description                                       | Type    | Default Value  | Required |
| ------------------------------- | --------------- | ------------------------------------------------- | ------- | -------------- | -------- |
| --use-source-map                |                 | Use source map for debugging production build     | boolean | false          | no       |

### Command: `start`
The **start** command let you start an Arks project as production.<br />
It creates and starts an Express server, and then serves the application built for server side rendering and client side rendering.

Command:
```bash
arks start
```
Options:
| Name                            | Alias           | Description                                                           | Type    | Default Value  | Required |
| ------------------------------- | --------------- | --------------------------------------------------------------------- | ------- | -------------- | -------- |
| --port                          | -p              | Specific port to use                                                  | string  | 8080           | no       |
| --host                          | -s              | Specific host to use                                                  | string  | 0.0.0.0        | no       |
| --protocol                      | -p              | Specific protocol to use                                              | string  | http           | no       |
| --open                          | -o              | Opening a web browser for testing production build on a local machine | boolean | false          | no       |

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
| creator                         | Arks creator implementation                                 | Yes            |
| schematics                      | Arks schematics implementation                              | Yes            |
| client                          | Arks browser clients functions and components               | Yes            |
| react                           | Arks React components, hooks, utilities, ...                | Partial        |

## Arks project structure
When creating an Arks project the cli will creates into the file system of your machine the following files and directories :

| Name          | Description                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| tsconfig.json | The TypeScript config for compiling sources                                                                                                      |
| package.json  | The classic package file for npm                                                                                                                 |
| globals.d.ts  | Extra types definition                                                                                                                           |
| .gitignore    | Basic .gitignore file                                                                                                                            |
| .env          | Environment configuration file for emulating env vars                                                                                            |
| arks.json     | Arks configuration file for configuring an Arks project                                                                                          |
| public/       | A directory for serving static files throught the public route /public                                                                           |
| src/          | React application sources directory                                                                                                              |
| src/app.tsx   | Arks React application file                                                                                                                      |
| src/pages     | Directory to store pages of an Arks React application - Some pages are already availables when creating an Arks project such as Home or NotFound |
| .arks/        | Directory where the Arks cli will perform actions for compiling an Arks React application                                                        |

## Arks configuration files
In an Arks project you can configure your application with a **.env** file for environment configuration and a **arks.json** file for project configuration.

### Environment configuration
As said below onto your local machine or into your deployment environment you can emulate environment vars with an **.env file**.<br />
Here's the list of environment vars supported for now by Arks: 

| Name                        | Description                                                                                                                 | Type   | Default value |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------ | ------------- |
| PORT                        | Port to use to serve the Arks project - It will be overrided if the port is specified into the cli command                  | string | 8080          |
| GRAPHQL_API_ENDPOINT        | The endpoint to reach fir executing GraphQL requests                                                                        | string |               |
| HOST                        | Host to use to serve the Arks project - It will be overried if the host is specified into the cli command                   | string | 0.0.0.0       |
| PROTOCOL                    | Protocol to use to serve the Arks project - It will be overried if the host is specified into the cli command               | string | http          |
| METRICS_COLLECT_TIMEOUT     | Time interval to collect metrics of the NodeJS process with [Prometheus](https://prometheus.io/)                            | string | 5000          |
| HTTP_TIMEOUT                | Http timeout for http requests                                                                                              | string | 10000         |
| LIMIT_WINDOWS_TIME_FRAME_MS | Time frame limit for requesting the Arks Express application - "express-rate-limit" middleware                              | string | 900000        |
| LIMIT_MAX_REQUESTS_PER_IP   | Number of requests per IP for requesting the Arks Express application into the time frame - "express-rate-limit" middleware | string | 200           |

### Arks json file configuration
You can canfigure some properties of your Arks project with and **arks.json** file.<br />
Here's the list of properties supported for now by Arks:

```javascript
{
  // Application name
  "appName": "string",
  
  // Disabling monitoring metrics collection 
  "noMetrics": boolean,

  // Disabing liveness route for healthchecks
  "noLiveness": boolean,

  // Customizing the metrics collection endpoint for monitoring
  "metricsEndpoint": "string",

  // Customizing the liveness endpoint for healthchecks
  "livenessEndpoint": "string",

  // Disabling the "helmet" middleware (security)
  "noHelmet": boolean,

  // Disabling the "cors" middleware (security)
  "noCors": boolean,

  // Disabling the "express-rate-limit" middleware (security)
  "noLimit": boolean,

  // Disabling the "body-parser" middleware
  "noBodyParser": boolean,

  // Disabling the "cookie-parser" middleware
  "noCookieParser": boolean,

  // Disabling the "compression" middleware
  "noCompression": boolean,

  // Disabling Arks logger (not interpreted for now)
  "noLogger": boolean,
}
```

## Arks Express server
The Arks Express server is only handle by the Aks cli.<br />
**In no way it can be overrided!**

The Arks Express server is mount based on the .env and arks.json file. If no configuration is provided Akrs will use default constants as you can see [here](./packages/config/constants.ts).<br />
The server comes with some feature for monitoring or healthchecks.

Features:
| Name          | Description                                                                                        | Configurable                                                                          |
| ------------- | -------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Metrics       | Exposing NodeJS process metrics with [Prometheus](https://prometheus.io/) on the /metrics endpoint | Yes - Disabling, endpoint customization and metrics collection timeout customization  |
| Liveness      | Exposing a simple endpoint responding a status with an "alive" text for healthchecks               | Yes - Disabling or endpoint customization                                             |
| Security      | Using some security configs                                                                        | Yes - please refer to the [Arks configuration files](#arks-configuration-files) below |
| Middlewares   | Using some middlewares configs                                                                     | Yes - please refer to the [Arks configuration files](#arks-configuration-files) below |
| GraphQL Proxy | Proxying the given GraphQL Endpoint                                                                | No                                                                                    |

Exposed routes:
| Name      | Description                                                                             |
| --------- | --------------------------------------------------------------------------------------- |
| /metrics  | Metrics route collection                                                                |
| /liveness | Liveness route                                                                          |
| /graphql  | GraphQL endpoint                                                                        |
| /public   | Endpoint for serving static content                                                     |
| /build    | Endpoint for serving the built client JavaScript bundle React application as production |
| /         | Endpoint for serving the server side rendered React Application                         |

## Arks Apollo client
Into an Arks project an Arks Apollo client is created for client side rendering and server side rendering.<br />
For security concerns, the GraphQL endpoint defined in the **.env** configuration file is proxyfied. This means the Arks React application never reachs the GraphQL endpoint in first but instead it will reach the route */graphql* exposed by the Arks Express server which is the proxy entry point.<br />
So your GraphQL endpoint is always protected and never exposed into the web browser.

It no **GRAPHQL_ENDPOINT** property is defined in the **.env** configuration file, the Arks Express server will not create a proxy but instead will respond at the */graphql* an empty JSON object.

## Arks React application
Into an Akrs project, the Arks React application is made to simple to use and to implement.<br />
Into the *src/* directory you will the mandatory file *app.tsx*. This file is used by the server webpack and the client webpack compilers! If you deleted Arks will not be able to compile and serves your React application. And the App component as to be always exported as default!

```tsx
import * as React from 'react';
import { Switch, Route } from 'react-router-dom';

import { 
    Home,
    Help,
    NotFound,
} from './pages';

export default function App(): React.ReactElement {
    return (
        <Switch>
            <Route exact path='/'>
                <Home />
            </Route>
            <Route path='/help'>
                <Help />
            </Route>
            <Route path='*'>
                <NotFound />
            </Route>
        </Switch>
    );
}
```

As you can understand this is **mandatory file**!<br />
Page components are under the *src/pages/* directory.

In the future the Arks React application will be shape with more sturucted directories and files!

## Design systems and stylesheets
For now the Arks webpack compiler is not made to support stylesheets compilation, this feature will come maybe in the future.<br />
Arks is made to be more focused of the development of an React application's logic and performance. So if you want some styles into your Arks React Application it's mandatory to use a design system with css-in-js such as [Chakra UI](https://chakra-ui.com/).<br />
Soon Arks will provide an official support for design systems with samples.

## Samples
You can find a bunch of samples in the [samples](./samples) directory of the project.<br />

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
* [Webpack](https://webpack.js.org/)
* [Express](http://expressjs.com/)
* [NodeJS](https://nodejs.org/en/)
* [Prometheus](https://prometheus.io/)
* [Commander](https://github.com/tj/commander.js)
* [Angular DevKit](https://github.com/angular/angular-cli/tree/master/packages/angular_devkit)
* [Angular DevKit Schematics](https://github.com/angular/angular-cli/tree/master/packages/angular_devkit/schematics)
* [Gulp](https://gulpjs.com/)

## Authors

* **Aurélien Dupays Dexemple**

This project is made with ♥ and under the [MIT License](./LICENSE).