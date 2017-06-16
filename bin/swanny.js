#!/usr/bin/env node

if (process.argv.indexOf('server') > -1)
  require('../lib/server')
else if (process.argv.indexOf('publish') > -1)
  require('../lib/publish')
else
  console.log('Usage:\nswanny (server|publish)')
