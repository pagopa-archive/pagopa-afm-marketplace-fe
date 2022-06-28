#!/usr/bin/env bash

# Recreate config file and assignment
echo "// Generated automatically, please don't write here" > ./src/env-config.js
echo "" >> ./src/env-config.js
echo "window._env_ = {" >> ./src/env-config.js

# Loop on environment variables prefixed with
# be_ and add them to env-config.js

for be_var in $(env | grep -i afm_marketplace_); do
    varname=$(printf '%s\n' "$be_var" | sed -e 's/=.*//')
    varvalue=$(printf '%s\n' "$be_var" | sed -e 's/^[^=]*=//')

    echo "  $varname: \"$varvalue\"," >> ./src/env-config.js
done

echo "};" >> ./src/env-config.js
