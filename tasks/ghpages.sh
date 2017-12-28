#!/bin/bash

BRANCH=$(if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then echo $TRAVIS_BRANCH; else echo $TRAVIS_PULL_REQUEST_BRANCH; fi)

echo $BRANCH

# if [ "$BRANCH" == "master" ]
#   then
    yarn build:docs --since master;
    yarn build:examples;
    cp ./CNAME dist
    cp ./countryiso.js dist
    find . -name '*.md' -exec cp --target-directory dist {} \;
    ( cd dist
    git init
    git config user.name "Travis CI"
    git config user.email "travis@profiscience.com"
    git add .
    git commit -m "chore(gh-pages)"
    git push --force --quiet "https://${GH_TOKEN}@github.com/profiscience/knockout-contrib.git" master:gh-pages > /dev/null 2>&1
    )
# fi