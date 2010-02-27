var fs = require('file'),
    os = require('os'),
    parser = exports.parser = (new (require('args').Parser)())
        .help('создание различных сущностей');

parser
    .command('level')
        .help('уровень переопределения')
        .option('-o', '--output-dir', 'outputDir')
            .help('директория для записи результата, по умолчанию текущая')
            .def(fs.cwdPath().join('/'))
            .set()
            .validate(function (d) { return fs.path(d).join('/') })
            .end()
        .option('-l', '--level', 'level')
            .help('"прототип"')
            .set()
            .end()
        .option('-t', '--add-tech', 'addTech')
            .help('добавить технологию')
            .push()
            .end()
        .option('-T', '--force-tech', 'forceTech')
            .help('использовать только эту технологию')
            .push()
            .end()
        .option('-n', '--no-tech', 'noTech')
            .help('исключить технологию из использования')
            .push()
            .end()
        .action(function(options){
            options.args.forEach(function(name){
                var dir = options.outputDir.join(name);
                if (dir.exists()) {
                    parser.print('Пропущено "' + name + '": уже существует ' + dir);
                } else {
                    dir.mkdirs();

                    var proto, protoPath;
                    try { proto = require(protoPath = 'bem/level/' + options.level) } catch (e) {
                        try { proto = require(protoPath = fs.absolute(options.level)) } catch (e) {}
                    }

                    if (proto) {
                        var levelFile = dir.join('.bem').mkdirs().join('level.js');
                        levelFile.write(
                            'var level = require(\'' +
                                (fs.isAbsolute(protoPath)? fs.path(protoPath).from(levelFile) : protoPath) + '\');\n' +
                            'for (var n in level) exports[n] = level[n];');
                    }
                }
            });
        })
        .helpful()
        .args('names');

parser.helpful().action(function(){});