'use strict';
var _ = require('lodash');
var path = require('path');


module.exports = function(grunt) {


    /* CONFIGURATION =-=-=-=-=-=-=-=-=-=-=- */

    //varibles for the xerox page template and data files
    var templatePath = 'source/_pages/ob-template.mustache';
    var dataPath = 'source/_pages/ob-*.json';
    var layout = 'default.mustache';
    var xerxoOutput = './_dev/'

    //varibles for current page targets
    var sourceTemplate = ['source/_pages/modules.mustache'];
    var sourceLayout = 'default.mustache';


    /* XEROX =-=-=-=-=-=-=-=-=-=-=- */

    // load the page template from the desired path
    var pageTemplate = grunt.file.read(templatePath);

    // expand the data files and loop over each filepath
    var pages = _.flatten(_.map(grunt.file.expand(dataPath), function(filepath) {

        // read in the data file
        var data = grunt.file.readJSON(filepath);

        // create a 'page' object to add to the 'pages' collection
        return {
            // the filename will determine how the page is named later
            filename: path.basename(filepath, path.extname(filepath)),
            // the data from the json file
            data: data,
            // add the page template as the page content
            content: pageTemplate
        };
    }));


    // measures the time each task takes
    require('time-grunt')(grunt);


    // Project configuration.
    grunt.initConfig({





        /******************************************************
         * HTML TASKS
         ******************************************************/


        assemble: {

            options: {
                flatten: true,
                partials: ['source/_patterns/**/*.mustache'],
                layoutdir: 'source/_layouts',
                layout: 'default.mustache',
                assets: 'source/assets/',
                data: ['source/_data/*.json', 'source/_pages/**/*.json'],
                helpers: ['source/assets/js/helpers/index.js']
            },

            //this is the target for publishing data based versions of a template, sources are set in the varibles up top
            xeroxDev: {
                options: {
                    layout: layout,
                    // add the pages array from above to the pages collection on the assemble options
                    pages: pages,
                    assets: '_dev/assets/',
                },
                files: [
                    // currently we need to trick grunt and assemble into putting the pages file into the correct
                    // place using this pattern
                    { dest: './_dev/', src: '!*' }
                ]
            },

            xeroxProduction: {
                options: {
                    layout: layout,
                    // add the pages array from above to the pages collection on the assemble options
                    pages: pages,
                    assets: '_production/assets/'
                },
                files: [
                    // currently we need to trick grunt and assemble into putting the pages file into the correct
                    // place using this pattern
                    { dest: './_production/', src: '!*' }
                ]
            },

            //style guide publishing target
            gpl: {
                options: {
                    layout: 'gpl-layout.mustache',
                    assets: '_dev/assets/'
                },
                files: {
                    '_dev/style-guide/': ['source/_pages/sg-*']
                }
            },


            //report publishing target
            reports: {
                options: {
                    data: ['_dev/reports/report.json'],
                },
                files: {
                    '_dev/reports/': ['source/reports/wcag-report.mustache']
                }
            },



            //target for page dev
            dev: {
                options: {
                    layout: sourceLayout,
                    assets: '_dev/assets/'
                },
                files: {
                    '_dev/': sourceTemplate
                }
            },

            //target for page release
            production: {
                options: {
                    production: true,
                    layout: sourceLayout,
                    assets: '_production/assets/'
                },
                files: {
                    '_production/': sourceTemplate
                }
            },

        },



        processhtml: {
            //these are working
            production: {
                options: {
                    // commentMarker: 'build'
                },
                files: [{
                    expand: true,
                    cwd: '_production', // Src matches are relative to this path
                    src: '*.html', // Actual patterns to match
                    dest: '_production' // Destination path prefix
                }]
            },
            dev: {
                options: {
                    // commentMarker: 'build'
                },
                files: [{
                    expand: true,
                    cwd: '_dev', // Src matches are relative to this path
                    src: '*.html', // Actual patterns to match
                    dest: '_dev' // Destination path prefix
                }]
            }
        },





        /******************************************************
         * CSS TASKS
         ******************************************************/

        // convert sass to css
        sass: {
            options: {
                sourceMap: true
            },
            dist: {
                files: {
                    'source/assets/css/style.css': 'source/assets/css/style.scss'
                }
            }
        },


        //extract only used css
        uncss: {
            dev: {
                options: {
                    ignore: [
                        //bootstrap
                        /\.affix/,
                        /\.alert/,
                        /\.close/,
                        /\.collapse/,
                        /\.collapsing/,
                        /\.collapse.in/,
                        /\.fade/,
                        /\.has/,
                        /\.help/,
                        /\.in/,
                        /\.modal/,
                        /\.open/,
                        /\.popover/,
                        /\.tooltip/,
                        //owl-carousel
                        /\.owl-*/,
                        /\.center/,
                        //dr row
                        /\.drTable/,
                        /\.doctorname/,
                        /\.contactRow/,
                        /\.contactInfo/,
                        /\.doctorinfo/,
                        /\.nameRow/,
                        /\.drRow/,
                        //accordions
                        /\.accordionState/,
                        //venobox
                        /\.vbox-*/,
                    ]
                },
                files: {
                    '_dev/assets/css/tidy.css': ['_dev/*.html']
                }
            },
            production: {
                options: {
                    ignore: [
                        //bootstrap
                        /\.affix/,
                        /\.alert/,
                        /\.close/,
                        /\.collapse/,
                        /\.collapsing/,
                        /\.collapse.in/,
                        /\.fade/,
                        /\.has/,
                        /\.help/,
                        /\.in/,
                        /\.modal/,
                        /\.open/,
                        /\.popover/,
                        /\.tooltip/,
                        //owl-carousel
                        /\.owl-*/,
                        /\.center/,
                        //dr row
                        /\.drTable/,
                        /\.doctorname/,
                        /\.contactRow/,
                        /\.contactInfo/,
                        /\.doctorinfo/,
                        /\.nameRow/,
                        /\.drRow/,
                        //accordions
                        /\.accordionState/,
                        //venobox
                        /\.vbox-*/,
                    ]
                },
                files: {
                    '_production/assets/css/tidy.css': ['_production/*.html']
                }
            },
        },

        //and process the shit out of it
        postcss: {

            dev: {
                options: {
                    map: true, // inline sourcemaps
                    processors: [
                        require('postcss-style-guide')({ name: 'Auto Style Guide', theme: '1column', dest: '_dev/style-guide/sg-css.html' }),
                        require('postcss-flexbugs-fixes'),
                        require('autoprefixer')({ browsers: '>1%, last 4 versions' }) // add vendor prefixes
                    ]
                },
                src: '_dev/assets/css/tidy.css',
                dest: '_dev/assets/css/tidy-min.css',
            },
            production: {
                options: {
                    map: false, // inline sourcemaps
                    processors: [
                        require('postcss-flexbugs-fixes'),
                        require('autoprefixer')({ browsers: '>1%, last 4 versions' }), // add vendor prefixes
                        require('cssnano')() // minify the result
                    ]
                },
                src: '_production/assets/css/tidy.css',
                dest: '_production/assets/css/tidy-min.css',
            }
        },



        /******************************************************
         * IMAGE TASKS
         ******************************************************/

        img_find_and_copy: {
            resources: {
                files: {
                    '_production/tempImages': ['_production/assets/css/**/*.css', '_production/*.html']
                }
            }
        },

        localscreenshots: {

            production: {
                options: {
                    path: '_production/screenshots',
                    type: 'png',
                    local: {
                        path: '_production',
                        port: 8090
                    },
                    viewport: ['768x800', '992x1024', '1200x1024'],
                },
                src: ['_production/*.html']
            },

            dev: {
                options: {
                    path: '_dev/screenshots/<%= grunt.template.today("mm-dd-yyyy") %>_@_<%= grunt.template.today("hh-MM-ss") %>',
                    type: 'png',
                    local: {
                        path: '_dev',
                        port: 8090
                    },
                    viewport: ['768x800', '992x1024', '1200x1024'],
                },
                src: ['_dev/patterns/04-pages*/**/*.html', '!_dev/patterns/04-pages*/**/*.markup-only.html']
            }

        },


        imagemin: { // Task

            production: { // Another target
                options: { // Target options
                    optimizationLevel: 3,
                    svgoPlugins: [{ removeViewBox: false }],
                    //use: [mozjpeg()]
                },
                files: [{
                    expand: true, // Enable dynamic expansion
                    cwd: '_production/tempImages', // Src matches are relative to this path
                    src: ['**/*.{png,jpg,jpeg,gif}'], // Actual patterns to match
                    dest: '_production/tempImages/processed' // Destination path prefix
                }]
            }
        },




        /******************************************************
         * TESTING
         ******************************************************/

        accessibility: {
            options: {
                accessibilityLevel: 'WCAG2A',
                force: true,
                reportType: 'json',
                reportLocation: '_dev/reports',
                reportLevels: {
                    notice: true,
                    warning: true,
                    error: true
                }
            },
            test: {
                expand: true,
                cwd: '_dev/',
                src: ['**/*.html'],
                dest: '_dev/'

            }
        },




        htmllint: {
            options: {
                errorlevels: 'error'
            },
            all: ["_dev/*.html"]
        },



        validation: {
            options: {
                reset: grunt.option('reset') || false,
                stoponerror: false,
                //doctype: 'HTML 4.01 Strict',
                //or
                relaxerror: ['Bad value X-UA-Compatible for attribute http-equiv on element meta.'], //ignores these errors
                generateReport: true,
                errorHTMLRootDir: "_dev/reports",
                useTimeStamp: false,
                errorTemplate: "source/reports/error_template.html"
            },
            files: {
                //src: ['_dev/*.html']

                expand: true,
                cwd: '_dev/',
                src: ['**/*.html'],
                dest: '_dev/'


            }
        },









        /******************************************************
         * HOUSEKEEPING AND UTILITY
         ******************************************************/

        copy: {
            dev: {
                files: [{
                    expand: true,
                    cwd: 'source/',
                    src: ['assets/**/*'],
                    dest: '_dev/'
                }],
            },
            production: {
                files: [{
                    expand: true,
                    cwd: 'source/',
                    src: ['assets/css/**/*'],
                    dest: '_production/'
                }, {
                    expand: true,
                    cwd: 'source/',
                    src: ['assets/images/**/*'],
                    dest: '_production/'
                }, {
                    expand: true,
                    cwd: 'source/',
                    src: ['assets/fonts/**/*'],
                    dest: '_production/'
                }, {
                    expand: true,
                    cwd: 'source/',
                    src: ['assets/js/**/*'],
                    dest: '_production/'
                }, {
                    expand: true,
                    cwd: 'source/',
                    src: ['assets/json/**/*'],
                    dest: '_production/'
                }],
            },
            productionImages: {
                files: [{
                    expand: true,
                    cwd: '_production/tempImages/processed/_production/assets/images/',
                    src: ['**'],
                    dest: '_production/assets/images/'
                }],
            },
        },

        mkdir: {
            all: {
                options: {
                    create: ['_production/tempImages', '_production/screenshots']
                },
            },
        },

        clean: {
            output: {
                options: {},
                src: ['_dev/*', '!_dev/screenshots', '_production/*']
            },
            productionImages1: {
                options: {},
                src: ['_production/assets/images/*']
            },
            productionImages2: {
                options: {},
                src: ['_production/tempImages']
            },
            productionCss: {
                options: {},
                src: ['_production/assets/css/*', '!_production/assets/css/tidy.css']
            }
        },

        //tidy up html output
        prettify: {
            options: {
                // Task-specific options go here.
                indent: 1,
                indent_char: '	',
                unformatted: ['a', 'sub', 'sup', 'b', 'i', 'u', 'strong', 'em']
            },
            dev: {
                // Target-specific file lists and/or options go here.
                expand: true, // Enable dynamic expansion
                cwd: '_dev', // Src matches are relative to this path
                src: ['*.html'], // Actual patterns to match
                dest: '_dev' // Destination path prefix
            },
            production: {
                // Target-specific file lists and/or options go here.
                expand: true, // Enable dynamic expansion
                cwd: '_production', // Src matches are relative to this path
                src: ['*.html'], // Actual patterns to match
                dest: '_production' // Destination path prefix
            }
        },

        // update the version number of our package file
        version: {
            dev: {
                options: {
                    release: 'patch'
                },
                src: [
                    'package.json'
                ]
            },
            production: {
                options: {
                    release: 'minor'
                },
                src: [
                    'package.json'
                ]
            }
        },

        //task specific server
        connect: {
            server: {
                options: {
                    port: 8090,
                    base: ['release'],
                    //keepalive: true,
                    //open: true
                }
            }
        },

        watch: {
            // watch all source files
            files: 'source/**/*',

            // run all the dev tasks when any of the files changes
            // tasks: ['clean:output', 'assemble:dev', 'sass', 'copy:dev', 'postcss:dev', 'processhtml:dev', 'version:dev'],
            tasks: ['dev'],

            // run live reload server on the default port (35729)
            options: {
                livereload: true
            }
        }
    });

    // Load the grunt plugins.
    grunt.loadNpmTasks('grunt-assemble');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-img-find-and-copy');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-localscreenshots');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-version');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-prettify');
    grunt.loadNpmTasks('grunt-accessibility');
    grunt.loadNpmTasks('grunt-html');
    grunt.loadNpmTasks('grunt-w3c-html-validation');
//test


    // The default task to run with the `grunt` command.
    grunt.registerTask('default', ['assemble', 'copy']);

    //for style guide
    grunt.registerTask('gpl', ['assemble:gpl', 'sass', 'copy:dev', 'postcss:dev']);

    //testing
    grunt.registerTask('reports', ['accessibility', 'assemble:reports', 'validation']);



    //for dev template/data publishing
    grunt.registerTask('xeroxDev', ['clean:output', 'assemble:xeroxDev', 'sass', 'copy:dev', 'postcss:dev', 'processhtml:dev', 'prettify', 'assemble:gpl', 'version:dev']);

    //for production template/data publishing
    grunt.registerTask('xeroxProduction', ['clean:output', 'mkdir', 'assemble:xeroxProduction', 'sass', 'copy:production', 'production:css', 'production:images', 'connect', 'localscreenshots:production', 'prettify', 'version:production']);



    //for dev
    grunt.registerTask('dev', ['clean:output', 'assemble:dev', 'sass', 'copy:dev', 'uncss:dev', 'postcss:dev', 'processhtml:dev', 'prettify', 'assemble:gpl', 'version:dev', 'watch']);

    //for release to production
    grunt.registerTask('production', ['clean:output', 'mkdir', 'assemble:production', 'sass', 'copy:production', 'production:css', 'production:images', 'prettify', 'connect', 'localscreenshots:production', 'version:production']);



    //support tasks for production
    grunt.registerTask('production:css', ['uncss:production', 'processhtml:production', 'clean:productionCss', 'postcss:production']);
    grunt.registerTask('production:images', ['img_find_and_copy', 'imagemin:production', 'clean:productionImages1', 'copy:productionImages', 'clean:productionImages2']);



    //support tasks for dev
    // grunt.registerTask('dev:css', ['uncss:dev', 'processhtml:dev', 'clean:productionCss']);

};





