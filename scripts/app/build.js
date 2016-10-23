({
    baseUrl: ".",
    paths: {
        backbone: "../../node_modules/backbone/backbone",
        underscore: "../../node_modules/underscore/underscore",
        jquery: "../../node_modules/jquery/dist/jquery",
        handlebars: "../../node_modules/handlebars/dist/handlebars.runtime",
        jszip: "../../node_modules/jszip/dist/jszip",
        filesaver: "../../node_modules/file-saver/FileSaver",
        augmented: "../../node_modules/augmentedjs/scripts/core/augmented",
        augmentedPresentation: "../../node_modules/augmentedjs/scripts/presentation/augmentedPresentation",

        routesTemplate: "templates/routesTemplate",
        stylesheetsTemplate: "templates/stylesheetsTemplate",
        viewsTemplate: "templates/viewsTemplate",
        permissionsTemplate: "templates/permissionsTemplate",
        controllersTemplate: "templates/controllersTemplate",
        modelsTemplate: "templates/modelsTemplate",
        schemasTemplate: "templates/schemasTemplate",
        observeViewsListTemplate: "templates/observeViewsListTemplate",

    },
    include: ["jszip", "filesaver"],
    name: "freeform-designRequire",
    out: "freeform-designRequire-built.js",
    optimize: "uglify2",
    preserveLicenseComments: false,
    generateSourceMaps: true,
    useStrict: true
})
