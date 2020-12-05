# User Management application

![Deploy to Firebase Hosting on merge](https://github.com/ochemerys/auth-admin-app/workflows/Deploy%20to%20Firebase%20Hosting%20on%20merge/badge.svg?branch=master)
[![codecov](https://codecov.io/gh/ochemerys/auth-admin-app/branch/master/graph/badge.svg?token=D777PYAKTN)](https://codecov.io/gh/ochemerys/auth-admin-app)

Auth User Management web application developed with VueJS. It manages users of Task Management firebase project by connecting to web api exposed by cloud https functions of task-management Firebase project.

This application was created by vue cli with preselected features

* vue router for routing implementation
* vuex as state management implementation
* eslint with Airbnb javascript style guide
* jest as unit testing framework
* cypress as e2e testing framework

Vuetify as UI Material Design framework was implemented later.

The application is hosted on Firebase Host and supports automatic builds and deploys with GitHub.
Deployment process is described [here](/docs/firebase-hosting.md).

## Getting started

Clone application and run in created folder:

```bash
npm install
```

Copy ***.env.example*** to ***.env*** and adjust the values where necessary.

## Development supporting commands

### serve

Run this command for development. After change save application re-compiles and hot-reloads

```bash
npm run serve
```

### build

It compiles and minifies and prepares /dist folder for production deployment

```bash
npm run build
```

### test

It runs all tests

```bash
npm test
```

or

```bash
npm t
```

to run unit tests only

```bash
npm run test:unit
```

to run end-to-end tests only

```bash
npm run test:e2e
```

### lint

Lints and fixes files

```bash
npm run lint
```

```bash
npm run lint --fix
```

### deploy

To deploy to ***production*** environment, run:

```bash
firebase deploy -P default
```

To deploy to ***staging*** environment, run:

```bash
firebase deploy -P staging
```

## Continuos deployment

GitHub ***master*** branch is associated with site's live channel for production deployment

## For Vue configuration settings

See [Configuration Reference](https://cli.vuejs.org/config/).
