#!/bin/bash

# github-firebase-env-vars to produce content of .env file

if [ $# -eq 2 ]; then
  api_key=$1
  root_email=$2 
else
  exit 1
fi

cat <<- _EOF_
VUE_APP_API_KEY=$api_key
VUE_APP_ROOT_USER_EMAIL=$root_email
_EOF_

exit 0