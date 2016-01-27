var chalk = require('chalk');

function printFile(file, max_line, max_char) {
	var ni;

	console.log(chalk.bold(file.filename));

	file.errors.sort(function(a, b) {
		return a.line > b.line ?
			1 : a.line < b.line ?
				-1 : a.column > b.column ?
					1 : a.column < b.column ? -1 : 0;
	});

	for (ni = 0; ni < file.errors.length; ni++) {
		printError(file.errors[ni], max_line, max_char);
	}
}

function printError(err, max_line, max_char) {
	var out = Array(3 + ('' + max_line).length - ('' + err.line).length).join(' ');

	out += chalk.bold(err.line) + ':' + chalk.bold(err.column);

	out += Array(('' + max_char).length - ('' + err.column).length + 3).join(' ');

	out += err.message + ' ' + chalk.dim('[' + err.linter + ']');

	console.log(out);
}

module.exports = {
    report: function (errors) {
  		var max_line = 0,
  			max_char = 0,
  			files = {},
  			ni;

    	if (!errors.length) {
    		console.log('No Errors');
    		return;
    	}

        for(ni = 0; ni < errors.length; ni++) {
        	if (!files.hasOwnProperty(errors[ni].file)) {
        		files[errors[ni].file] = {
        			filename: errors[ni].file,
        			errors: []
        		};
        	}

        	files[errors[ni].file].errors.push(errors[ni]);

        	if (errors[ni].line > max_line) {
        		max_line = errors[ni].line;
        	}

        	if (errors[ni].column > max_char) {
        		max_char = errors[ni].column;
        	}
        }

        for (ni in files) {
        	printFile(files[ni], max_line, max_char);
        }
    }
};
