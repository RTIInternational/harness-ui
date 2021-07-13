# Datavue-UI

[![pipeline status](https://cds-mallard-web.rti.org/datavue/datavue-ui/badges/master/pipeline.svg)](https://cds-mallard-web.rti.org/datavue/datavue-ui/-/commits/master)
## The Datavue Component Library
Datavue-UI is a Vue Plugin that publishes a library of components binding [Datavue]() functionality to [Bootstrap 4 components](https://getbootstrap.com/docs/4.0/components/). Datavue-UI contains reusable, configurable, accessible form fields bound to Datavue filters, convenience layout functionality for filters and charts, and accessible datatables.

## Documentation
See our documentation website at [URL]().

## Contributor's Guide

### Development
See [Datavue-Starter-Template](https://cds-mallard-web.rti.org/datavue/datavue-starter-template#development-of-datavue-packages) for instructions on how to start a repository for Datavue-UI development.

### Deployment
Gitlab CI runs linter and tests.

Datavue-ui is installable via NPM using a public verdaccio registry hosted on mallard. This is available at http://verdaccio.cds-mallard.rtp.rti.org. While this is a public registry, mallard is only accessible within the RTI network - that means that in order to install datavue via NPM/Yarn, you not only need a .npmrc or .yarnrc file with the redirect, but you also need to be on pulse secure or on campus.

To build a new version of datavue-ui, run `yarn run build-bundle`, which will create a new dir named `dist` that includes a fully packaged version of datavue. 

Publishing new versions of that dist directory to the registry is handled using yarn - specifically `yarn publish --registry http://verdaccio.cds-mallard.rtp.rti.org` using either the `--major`, `--minor` or `--patch` flags. For help with choosing a flag, read about [semantic versioning](https://semver.org/#summary). These flags not only version the registry and the `package.json` file, they also commit a tag with the new version to git - so be sure to push that change once you publish.

Credentials for registry are the username `datavue` with the typical cds password. Note that you will have to authenticate with `npm login --registry http://verdaccio.cds-mallard.rtp.rti.org` prior to running `yarn publish` as above.

### Documentation

#### Development
Documentation is maintained using [Vuepress](https://vuepress.vuejs.org/), and is included in this repository under `docs`. See [their documentation](https://vuepress.vuejs.org/theme/default-theme-config.html) for how to write new pages for Vuepress. To start the vuepress development server, navigate to `/docs` and run `yarn install` then `yarn run dev`.

#### Using Datavue-UI components in markdown
The Vuepress application is itself a vue application, with Datavue/Datavue-UI installed via the `enhanceApp.js` file. Because vuepress uses its own routing scheme, we are required to use Datavue's [waypoint functionality]() to inform components which page they belong to. For demonstration purposes, a single datavue page has been created under `src/.vuepress/datavue-pages/examplePage.js`, so including `:datavue-waypoint="'examplePage'"` in your component calls will bind the components correctly. Additionally, programattic use of filters/charts must be accessed through the store, for example `store.state.examplePage.filters` instead of `filters`.

#### Building/Deploying docs
To build a new version of the vuepress app, simply run `yarn run build` from the `docs` directory. This will create a `dist` directory under `docs/src/.vuepress` containg the built application. We do not yet have a hosting plan for this application.