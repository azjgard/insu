#!/bin/bash

# these directories are used by the node script
# to store authentcation credentials. we need to make
# sure that they exist on the machine
if [ ! -z ${HOME+x} ];
then
  mkdir -p "$HOME"/.credentials
  echo ".credentials/ verified at $HOME"
else
  echo "\$HOME is unset."
fi

if [ ! -z ${HOMEPATH+x} ];
then
  mkdir -p "$HOMEPATH"/.credentials
  echo ".credentials/ verified at $HOMEPATH"
else
  echo "\$HOMEPATH is unset."
fi

if [ ! -z ${USERPROFILE+x} ];
then
  mkdir -p "$USERPROFILE"/.credentials
  echo ".credentials/ verified at $USERPROFILE"
else
  echo "\$USERPROFILE is unset."
fi

# make sure this matches the path to the actual
# JSON file on the VM
export GOOGLE_APPLICATION_CREDENTIALS=/home/jordin/projects/upwork/insurance-hub/automated-lead-storage-sa-creds.json

if [ ! -f "$GOOGLE_APPLICATION_CREDENTIALS" ];
then
  echo "No credentials exist at that path!"
  exit 1
else
  echo "\$GOOGLE_APPLICATION_CREDENTIALS is now:"
  echo $GOOGLE_APPLICATION_CREDENTIALS
fi


