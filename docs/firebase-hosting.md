# Firebase Hosting implementation steps

Here is a quick description of Firebase Hosting implementation for web application ***my-awesome-vue-app***

For more details see [documentation](https://firebase.google.com/docs/hosting/quickstart).

## Prerequisites

NodeJS v.10 with npm are required.

Firebase CLI is required, to install:

```bash
npm install -g firebase-tools
```

Firebase project(s) for Firebase Hosting are required.

## Initialize Hosting

Open terminal and go to project root folder and run:

```bash
firebase init hosting
```

To set up Hosting configuration:

* Select ***my-awesome-project*** Firebase project to connect to local project directory as default hosting project
* Specify a directory to use as your public root directory. For Vue applications create with vue cli it is going to be ***dist*** folder
* Select ***No*** to keep default configuration or ***Yes*** to specify rewrite configuration, more details in [configure rewrites](https://firebase.google.com/docs/hosting/full-config#rewrites).

-- for GutHub CI/CD --

* select ***Yes*** to set up automatic builds and deploys with GitHub
* select ***No*** to overwrite existing index.html. This step will log into GitHub via the Firebase CLI.
* select ***your-account-name/my-awesome-vue-app*** GitHub repository to set up GitHub workflow
* select ***No*** to run a build script before every deploy
* provide command '```npm ci && npm run build:prod```' to be run before every deploy
* select ***Yes*** to set up automatic deployment when merged
* select ***master*** branch associated with the deployment

## Deployment

### Single default environment (production)

To deploy ***my-awesome-vue-app*** to Firebase ***my-awesome-project*** hosting:

Push to GitHub master branch

or

Run command:

```bash
firebase deploy --only hosting
```

### Multi-Environment deployment

To implement deployment to multiple environments: production and staging

1. Create ***my-awesome-project-staging***
2. Create alias for staging firebase project

    ```bash
    firebase use --add
    ```

    select ***my-awesome-project-staging*** and then create alias for new environment ***staging***

All changes are reflected in .firebaserc file.

To deploy ***my-awesome-vue-app*** to ***staging*** environment:

``` bash
firebase deploy -P staging
```

To deploy ***my-awesome-vue-app*** to ***production*** environment:

``` bash
firebase deploy -P default
```

## NPM Commands

Create npm commands in package.json file to simplify deployment process to different environments:

```json
"deploy:stage": "npm run test && npm run build && firebase deploy -P staging",
"deploy:prod": "npm run test && npm run build && firebase deploy -P default"
```

then in terminal run

```bash
npm run deploy:stage
```

to  run unit tests, build application and deploy it to staging environment

or run

```bash
npm run deploy:prod
```

to  run unit tests, build application and deploy it to production environment

[back to README](../README.md)
