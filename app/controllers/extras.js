//
// Emotes / Replacements Controller
//

'use strict';

module.exports = function() {

    var _ = require('lodash'),
        fs = require('fs'),
        path = require('path'),
        yaml = require('js-yaml'),
        express = require('express.io');

    var app = this.app,
        core = this.core,
        middlewares = this.middlewares;

    //
    // Routes
    //
    app.use('/extras/emotes/', express.static(path.join(process.cwd(), 'extras/emotes/public')));
    app.get('/extras/emotes', middlewares.requireLogin, function(req, res) {
        req.io.route('extras:emotes:list');
    });

    app.get('/extras/replacements', middlewares.requireLogin, function(req, res) {
        req.io.route('extras:replacements:list');
    });

    //
    // Sockets
    //
    app.io.route('extras', {
        'emotes:list': function(req, next) {
            var emotes = [];
            ['default.yml', 'local.yml'].forEach(function(filename) {
                var fullpath = path.join(process.cwd(), 'extras/emotes/' + filename);
                if (fs.existsSync(fullpath)) {
                    var data = yaml.safeLoad(fs.readFileSync(fullpath, 'utf8'));
                    _.each(data, function(emote) {
                        emote.image = '/extras/emotes/' + emote.image;
                        emotes.push(emote);
                    });
                }
            });
            req.io.respond(emotes, 200);
        },
        'replacements:list': function(req, next) {
            var replacements = [];
            ['default.yml', 'local.yml'].forEach(function(filename) {
                var fullpath = path.join(process.cwd(), 'extras/replacements/' + filename);
                if (fs.existsSync(fullpath)) {
                    replacements = _.merge(replacements, yaml.safeLoad(fs.readFileSync(fullpath, 'utf8')));
                }
            });
            req.io.respond(replacements, 200);
        }
    });

};
