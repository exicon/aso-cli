#!/usr/bin/env node

const program = require('commander')
const app = {}
app.gp = require('aso')('gplay')
app.itc = require('aso')('itunes')

program
  .usage('<cmd> [options] \n\n  Refer to https://github.com/facundoolano/aso')

program
  .command('scores')
  .description('The scores function gathers several statistics about a keyword and builds difficulty and traffic scores that can be used to evaluate the convenience of targeting that keyword.')
  .option('-s, --store <store>', 'itc (iTunes connect) or gp (Google Play).')
  .option('-w, --word <word>', 'Keyword you want to score.')

  .action(args => {
    app[args.store].scores(args.word)
      .then(handle_result, handle_error)
  })

program
  .command('suggest')
  .description('The scores function gathers several statistics about a keyword and builds difficulty and traffic scores that can be used to evaluate the convenience of targeting that keyword.')
  .option('-s, --store <store>', 'itc (iTunes connect) or gp (Google Play).')
  .option('--strategy <STRATEGY>', 'the strategy used to get suggestions. Defaults to CATEGORY.')
  .option('-n, --num <int>', 'the amount of suggestions to get in the results. Defaults to 30.', parseInt)
  .option('-i, --app-id <app-id>', 'store app ID (for iTunes both numerical and bundle IDs are supported). Required for the CATEGORY, SIMILAR and COMPETITION strategies.')
  .option('-a, --apps <JSON array>', 'JSON array of store app IDs. Required for the ARBITRARY strategy.', JSON.parse)
  .option('-k, --keywords <JSON array>', 'JSON array of seed keywords. Required for the KEYWORDS and SEARCH strategies.', JSON.parse)

  .action(args => {
    const options = (({ strategy, num, appId, apps, keywords }) => ({ strategy, num, appId, apps, keywords }))(args)
    options.strategy = app[args.store][options.strategy]
    app[args.store].suggest(options)
      .then(handle_result, handle_error)
  })

program
  .command('visibility')
  .description('The visibility function gives an estimation of the app\'s discoverability within the store. The scores are built aggregating how well the app ranks for its target keywords, the traffic score for those keywords and how the app ranks in the top global and category rankings.')
  .option('-s, --store <store>', 'itc (iTunes connect) or gp (Google Play).')
  .option('-i, --app-id <app-id>', 'App Id.')

  .action(args => {
    app[args.store].visibility(args.appId)
      .then(handle_result, handle_error)
  })

program
  .command('app')
  .description('The app function returns an array of keywords extracted from title and description of the app. The only argument is the Google Play ID of the application (the ?id= parameter on the url).')
  .option('-s, --store <store>', 'itc (iTunes connect) or gp (Google Play).')
  .option('-i, --app-id <app-id>', 'App Id.')

  .action(args => {
    app[args.store].app(args.appId)
      .then(handle_result, handle_error)
  })

function handle_result(res){
  console.log(JSON.stringify(res))
  process.exit(0)
}
function handle_error(err){
  console.error(err)
  process.exit(1)
}

program.parse(process.argv)
