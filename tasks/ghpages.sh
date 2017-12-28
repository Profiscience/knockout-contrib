#!/bin/bash

BRANCH=$(if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then echo $TRAVIS_BRANCH; else echo $TRAVIS_PULL_REQUEST_BRANCH; fi)

echo $BRANCH

# if [ "$BRANCH" == "master" ]
#   then
    yarn build:docs;
    yarn build:examples;
    cp ./_config.yml dist;
    rm -rf node_modules
    find . -name '*.md' -exec cp --parents \{\} dist \;
    tree dist
    ( cd dist
    git init
    git config user.name "Travis CI"
    git config user.email "travis@profiscience.com"
    git add .
    git commit -m "chore(gh-pages)"
    git push --force --quiet "https://${GH_TOKEN}@github.com/profiscience/knockout-contrib.git" master:gh-pages > /dev/null 2>&1
    )
# fi