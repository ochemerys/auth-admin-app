# GitHub Ci/CD

GitHub Actions can help to build, test, and deploy repo code.

## Create New Workflow

Choose a workflow template Node.js to build and test a Node.js project with npm.

or

search [GitHub Marketplace](https://github.com/marketplace?type=actions)

and then modify template to fit required behavior

## Coverage Report


## GitHub Pages deployment

* To generate access token go to Personal access tokens area in the Developer settings of personal GitHub profile and click "Generate new token".
* Provide Notes and under "Select scopes" "repo" select:
  * repo:status,
  * repo_deployment,
  * public_repo,
  * repo:invite
* Generate token and copy token value
* Create secret something like ACTIONS_AWESOME_APP_DEPLOY_ACCESS_TOKEN and preserve generated token value


## Add Environment Variables

* GitHub repository Settings menu item
* Left site menu Secrets
* Click  button "New repository secret"
* Set Name and Value of the secret variable:
  * Name: MY_AWESOME_SECRETE
  * Value: This_Is_My_Awesome_App_Secret_I_Would_Like_To_Use_As_Environment_Variable

Newly created variable can be used in GitHub Actions Workflow yml file as VUE_APP_MY_AWESOME_SECRETE environment variable

```yml
env:
  VUE_APP_MY_AWESOME_SECRETE: ${{ secrets.MY_AWESOME_SECRETE }}
```
