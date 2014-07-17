(function() {
	var _output,
		_failed,
		_data,
		_demo = 'Name\tCity\tRating\tPrice\nSuperette\tHolliston\t4.5\t$8.00\nTasty Treat\tAshland\t2.0\t$5.00\nBig Fresh\tFramingham\t5.0\t$9.00\nSeta\'s Cafe\tWatertown\t3.8\t$7.50';

	function init() {
		bindEvents();
	}

	//setup all event listeners
	function bindEvents() {
		$('.generate').on('click', function(e) {
			e.preventDefault();	
			_failed = false;
			_data = {
				headers: [],
				rows: [],
				className: []
			};

			var val = $('.input').val();
			parseInput(val);
			return false;
		});

		$('.demo').on('click', function(e) {
			e.preventDefault();
			$('.input').val(_demo);
			return false;
		});

		$('.headerChoices').on('click', 'button', function() {
			$(this).siblings().removeClass('currentChoice');
			$(this).addClass('currentChoice');
		});

		$('.createTable').on('click', function() {
			getColumnTypes();
			var mobileRows = $('.mobileRows').val();
			var zebra = $('.zebra:checked').val() ? true : false;
			var hideColumns = $('.hideColumns').val();
			$('.output').val('');
			customize(mobileRows, zebra, hideColumns);
		});

		$('.audioChoice').on('click', function() {
			var t = $(this).attr('data-track');
			createAudio(+t);
		});

		$('.modify').on('click', function() {
			var scrollTo = $('.after').offset().top - 10;
			$('html, body').animate({
				scrollTop: scrollTo
			}, 250);
		});
	}

	//grab the text from the input textarea and start parsing
 	function parseInput(input) {
		var lines = input.split('\n');
		if(lines.length > 1) {
			setHeaders(lines[0]);
			if(_data.headers) {
				setNumericColumns(lines[1]);
				setRows(lines.slice(1));
			}
		} else {
			_failed = 'no rows';
		}
		
		displayHeaderTypes();
	}

	//set the header names from the first row
	function setHeaders(line) {
		var headers = line.split('\t');
		//empty
		if(headers.length === 1 && !headers[0]) {
			_failed = 'no headers';
		} else {
			for(var i = 0; i < headers.length; i++) {
				var h = headers[i].trim();
				_data.headers.push(h);
			}
		}
	}

	//set the row and column data
	function setRows(lines) {
		for(var i = 0; i < lines.length; i++) {
			var l = lines[i];
			var cols = lines[i].split('\t');
			_data.rows[i] = [];
			for(var j = 0; j < cols.length; j++) {
				_data.rows[i][j] = cols[j].trim();
			}
		}
	}

	//set if the column is number or text from first row of data
	function setNumericColumns(line) {
		var cols = line.split('\t');
		for(var i = 0; i < cols.length; i++) {
			var val = cols[i].trim();
		}
	}

	//prompt user to choose types (text or number)
	function displayHeaderTypes() {
		if(_failed) {
			alert('error: ' + _failed);
		} else {
			for(var i = 0; i < _data.headers.length; i++) {
				var html = '<div class="headerChoice"><span>' + _data.headers[i] + ':</span> ';
				html += '<div class="buttonChoices"><button class="currentChoice">Text</button><button>Number</button></div></div>';
				$('.headerChoices').append(html);
			}
			$('.after').removeClass('hide');
			var scrollTo = $('.after').offset().top - 10;
			$('html, body').animate({
				scrollTop: scrollTo
			}, 250);
		}
	}

	function createTable(mobileRows, zebra, hideColumns) {
		var $table = $('<table class="responsive-table"></table>');
		var $thead = $('<thead></thead>');
		var $tbody = $('<tbody></tbody>');

		var classesTable = 'responsive-table';
		if(zebra) {
			classesTable += ' zebra';
		}
		_output = '<style>\n' + css + '\n</style>\n';
		_output += '<table class="' + classesTable + '">\n\t<thead>';

		//headers
		for (var i = 0; i < _data.headers.length; i++) {
			var valTh = _data.headers[i].toLowerCase();
			var classesTh = hideColumns[valTh] ? 'hideMobile ' : '';
			classesTh += _data.className[i];

			var htmlTh = '<th class="'+ classesTh + '">' + _data.headers[i] + '</th>';
			
			_output += '\n\t\t' + htmlTh;
			var $th = $(htmlTh);
			$thead.append($th);
		}

		_output += '\n\t</thead>\n\t<tbody>';

		//rows
		for (var a = 0; a < _data.headers.length; a++) {
			var row = _data.rows[a];
			var hideMobile = '';
			if(mobileRows) {
				hideMobile = a < mobileRows ? ' class="hideMobile"' : '';
			}
			var $tr = $('<tr' + hideMobile + '></tr>');

			_output += '\n\t\t<tr' + hideMobile + '>';

			//cols
			for (var b = 0; b < row.length; b++) {
				var valCol = _data.headers[b].toLowerCase();
				var classesTd = hideColumns[valCol] ? 'hideMobile ' : '';
				classesTd += _data.className[b];

				var htmlTd = '<td class="' + classesTd + '" data-title="' + valCol + '">' + row[b] + '</td>';

				_output += '\n\t\t\t' + htmlTd;
				var $td = $(htmlTd);
				$tr.append($td);
			}

			_output += '\n\t\t</tr>';
			$tbody.append($tr);
		}

		_output += '\n\t</tbody>\n</table>';
		$('.output').val(_output);

		//output preview
		$table.append($thead);
		$table.append($tbody);
		$('.result').empty().append($table);
		$('.final').removeClass('hide');
		$('.createTable').text('Update table');

		var scrollTo = $('.final').offset().top - 10;
		$('html, body').animate({
			scrollTop: scrollTo
		}, 250);

		//add zebra striping
		if(zebra) {
			$('.responsive-table').addClass('zebra');	
		}

		$('.updated').removeClass('invisible');
		setTimeout(function(){
			$('.updated').addClass('invisible');
		}, 1500);
	}

	function customize(mobileRows, zebra, hideColumns) {
		if(mobileRows) {
			mobileRows = +mobileRows;
			if(isNaN(mobileRows)) {
				mobileRows = false;
			}
		}
		if(hideColumns) {
			var names = hideColumns.split(',');
			hideColumns = {};
			for(var i = 0; i < names.length; i++) {
				hideColumns[names[i].trim().toLowerCase()] = true;
			}
		} else {
			hideColumns = {};
		}

		createTable(mobileRows, zebra, hideColumns);
	}

	function getColumnTypes() {
		$('.headerChoice').each(function(i) {
			var el = $(this).find('.currentChoice');
			var t = el.text().toLowerCase().trim();
			_data.className[i] = t;
		});
	}

	function createAudio(track) {
		$('.enhance').addClass('hide');
		$('.toggleAudio').removeClass('hide');
		var sound = new Howl({
			urls: ['audio/track' + track + '.mp3', 'audio/track' + track + '.ogg'],
			loop: true,
			volume: 0.5,
			onload: function() {
				sound.isPlaying = false;
				$('.toggleAudio').text('Play');
				$('.toggleAudio').on('click', function(e) {
					e.preventDefault();

					if(sound.isPlaying) {
						//pause
						sound.isPlaying = false;
						sound.pause();
						$(this).text('Play');
					} else {
						//play
						sound.isPlaying = true;
						sound.play();
						$(this).text('Pause');
					}
					return false;
				});
			},
			onloaderror: function() {
				$('.toggleAudio').remove();
				$('.enhance').remove();
			}
		});
	}

	init();
})();

window.css = 'table.responsive-table {\n\tmargin: 0 0 1em 0;\n\twidth: 100%;\n\tfont-family: Helvetica, Arial, sans-serif;\n\tfont-size: 1em;\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}\n\ntable.responsive-table * {\n\t-moz-box-sizing: border-box;\n\tbox-sizing: border-box;\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n\ttext-align: left;\n\tcolor: #333;\n}\ntable.responsive-table thead {\n\tborder-bottom: 1px solid #ccc;\n}\ntable.responsive-table th {\n\tfont-weight: bold;\n\tpadding: 0.25em;\n}\ntable.responsive-table td {\n\tpadding: 0.25em;\n\tfont-size: 0.9em;\n}\ntable.responsive-table tr {\n\tborder-bottom: 1px solid #ccc;\n}\ntable.responsive-table .numeric {\n\ttext-align: right;\n}\ntable.responsive-table.zebra tr:nth-child(even) {\n\tbackground: #efefef;\n}\n\n@media screen and (max-width: 500px) {\ntable.responsive-table {\n\tdisplay: block;\n\twidth: 100%;\n}\ntable.responsive-table .numeric {\n\ttext-align: left;\n}\ntable.responsive-table tr.hideMobile, table.responsive-table th.hideMobile, table.responsive-table td.hideMobile {\n\tdisplay: none;\n}\ntable.responsive-table thead {\n\tdisplay: none;\n}\ntable.responsive-table tbody {\n\tdisplay: block;\n\twidth: 100%;\n}\ntable.responsive-table tr, table.responsive-table th, table.responsive-table td {\n\tdisplay: block;\n\tpadding: 0;\n}\ntable.responsive-table th[data-title]:before, table.responsive-table td[data-title]:before {\n\tcontent: attr(data-title) ":\00A0";\n\tfont-weight: bold;\n}\ntable.responsive-table tr {\n\tborder-bottom: 1px solid #ccc;\n\tmargin: 0;\n\tpadding: 0.5em 0;\n}\ntable.responsive-table tr:nth-child(even) {\n\tbackground: none;\n}\ntable.responsive-table td {\n\tpadding: 0.25em 0.5em 0 0.5em;\n}\ntable.responsive-table td:empty {\n\tdisplay: none;\n}\ntable.responsive-table td:first-child {\n\tfont-size: 1.1em;\n\tfont-weight: bold;\n}\ntable.responsive-table td:first-child:before {\n\tcontent: "";\n}\n}';