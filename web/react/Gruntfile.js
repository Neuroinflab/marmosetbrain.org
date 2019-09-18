module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            sass: {
                files: ['../connectome/static/css/**/*.{scss,sass}','../connectome/static/css/_partials/**/*.{scss,sass}'],
                tasks: ['sass:dist']
            }
        },
        sass: {
            options: {
                sourceMap: true,
                outputStyle: 'compressed'
            },
            dist: {
                files: {
                    'scss/viewer.css': 'scss/viewer.scss',
                    'scss/home.css': 'scss/home.scss',
                    'scss/fonts.css': 'scss/fonts.scss',
                    'scss/jquery-editable.css': 'scss/jquery-editable.scss',
                    'scss/select2.min.css': 'scss/select2.min.scss',
                    'scss/style.css': 'scss/style.scss',
                    'scss/tip-yellow.css': 'scss/tip-yellow.scss',
                    'scss/font-awesome.css': 'scss/fontawesome/font-awesome.scss'

                }
            }
        }
    });
    grunt.registerTask('default', ['sass:dist', 'watch']);
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
};

