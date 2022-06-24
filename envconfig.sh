#!/bin/bash

compgen -A variable | grep -q BE_ || export $(grep -v '^#' .env.local) ; chmod +x env.sh && . ./env.sh
