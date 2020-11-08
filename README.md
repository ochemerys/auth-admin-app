# User Management application

Auth User Management web application developed with VueJS. It manages users of Task Management firebase project by connecting to web api exposed with Firebase functions.

Application is hosted on Firebase.

## Project setup

Clone application and run:

```bash
npm install
```

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

### Deploy to multiple environments

The application is hosted on Firebase Host and supports automatic builds and deploys with GitHub.

To deploy to ***production*** environment, run:

```bash
firebase deploy -P default
```

To deploy to ***staging*** environment, run:

```bash
firebase deploy -P staging
```

### Continuos deployment

GitHub ***master*** branch is associated with site's live channel

## For Vue configuration settings

See [Configuration Reference](https://cli.vuejs.org/config/).
