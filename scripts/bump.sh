#!/bin/sh

if [ $(git symbolic-ref --short HEAD) != master ]; then
    echo "This script is supposed to be run on the \"master\" branch."
    exit 1
fi

if [ -z $1 ]; then
    echo "A bump rule (\"patch\", \"minor\", \"major\") must be passed as a parameter."
    exit 1
fi

# Get old version
OLD_VERSION=$(yarn --silent version:get)

# Bump up package.json version and get new version
npm version $1 --no-git-tag-version && NEW_VERSION=$(yarn --silent version:get)

# Get the scripts directory name and the base directory name
SCRIPTS=$(cd $(dirname $0) && pwd)
BASEDIR=$(dirname $SCRIPTS)

# Get the version file
METADATA="$BASEDIR/src/lib/version.ts"

# Get substitution strings
OLD_VERSION_SUBSTITUTION=$(echo $OLD_VERSION | sed "s/\./, /g")
NEW_VERSION_SUBSTITUTION=$(echo $NEW_VERSION | sed "s/\./, /g")

# Substitute the version in the TypeScript version file
sed -i.tmp "s#$OLD_VERSION_SUBSTITUTION#$NEW_VERSION_SUBSTITUTION#g" $METADATA && rm $METADATA.tmp

# Commit changes into release branch
git add $BASEDIR/package.json $BASEDIR/src/lib/version.ts &&
git checkout -b release/prepare-$NEW_VERSION &&
git commit --message "pre-release: prepare $NEW_VERSION release"
