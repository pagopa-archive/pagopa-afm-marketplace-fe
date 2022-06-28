#!/bin/bash

compgen -A variable | grep -q AFM_MARKETPLACE_ || export $(grep -v '^#' .env.local) ; chmod +x env.sh && . ./env.sh
