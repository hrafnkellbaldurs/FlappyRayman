import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import { uglify } from 'rollup-plugin-uglify'
import scss from 'rollup-plugin-scss'
import postcss from 'postcss'
import assets from 'postcss-assets'
import autoprefixer from 'autoprefixer'
import copy from 'rollup-plugin-copy'
import html from 'rollup-plugin-fill-html'

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH

export default {
    input: 'src/scripts/main.js',
    output: {
        file: 'public/bundle.js',
        format: 'iife', // immediately-invoked function expression - suitable for <script> tags
        sourcemap: true
    },
    plugins: [
        copy({
            './src/fonts': 'public/fonts',
            './src/images': 'public/images',
            './src/audio': 'public/audio'
            // './src/audio'
        }),
        scss({
            output: 'public/bundle.css',
            processor: css => postcss([
                autoprefixer,
                assets({
                    basePath: 'src/',
                    loadPaths: ['images', 'fonts'],
                    relative: '.'
                })
            ])
                .process(css)
                .then(result => result.css)
        }),
        resolve(), // tells Rollup how to find date-fns in node_modules
        babel({
            exclude: 'node_modules/**'
        }),
        commonjs(), // converts date-fns to ES modules
        // production && uglify() // minify, but only in production
        html({
            template: 'src/index.html',
            filename: 'index.html'

        })
    ]
}
