(function() {
		var _output;
		var _failed;
		var _data;
		var _input;
		var _demo = 'Name\tCity\tRating\tPrice\nSuperette\tHolliston\t4.5\t$8.00\nTasty Treat\tAshland\t2.0\t$5.00\nBig Fresh\tFramingham\t5.0\t$9.00\nSeta\'s Cafe\tWatertown\t3.8\t$7.50';
		var _copy = {
			hed: 'Hed',
			subhed: 'Subhed goes here.',
			credit: 'Globe Staff',
			sourcePre: 'SOURCE',
			sourcePost: 'Sources'
		};

	function init() {
		bindEvents();
	}

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

		$('.header-choices').on('click', 'button', function() {
			$(this).siblings().removeClass('current-choice');
			$(this).addClass('current-choice');
		});

		$('.create-table').on('click', function() {
			getColumnTypes();
			var input = {
				mobileRows: $('.mobile-rows').val() || 9999,
				zebra: $('.zebra:checked').val() ? true : false,
				hideColumns: $('.hide-columns').val(),
				breakpoint: $('#breakpoint-text').val()
			};
			$('.output').val('');
			customize(input);
		});

		$('.modify').on('click', function() {
			var scrollTo = $('.after').offset().top - 10;
			$('html, body').animate({
				scrollTop: scrollTo
			}, 250);
		});

		$('#breakpoint-slider').on('input', function() {
			$('#breakpoint-text').val(this.value + 'px');
		});

		$('.generate-code').on('click', function() {
			generateCode();
		});

		$('.preview').on('click', '.rg-table tr', function() {
			$(this).toggleClass('highlight');
		});
	}

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

	function setHeaders(line) {
		var headers = line.split('\t');
		if(headers.length === 1 && !headers[0]) {
			_failed = 'no headers';
		} else {
			for(var i = 0; i < headers.length; i++) {
				var h = headers[i].trim();
				_data.headers.push(h);
			}
		}
	}

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

	function setNumericColumns(line) {
		var cols = line.split('\t');
		for(var i = 0; i < cols.length; i++) {
			var val = cols[i].trim();
		}
	}

	function displayHeaderTypes() {
		if(_failed) {
			alert('error: ' + _failed);
		} else {
			$('.header-choices').empty();
			for(var i = 0; i < _data.headers.length; i++) {
				var html = '<div class="header-choice"><span>' + _data.headers[i] + ':</span> ';
				html += '<div class="button-choices"><button class="current-choice">Text</button><button>Number</button></div></div>';
				$('.header-choices').append(html);
			}
			$('.after').removeClass('hide');
			var scrollTo = $('.after').offset().top - 10;
			$('html, body').animate({
				scrollTop: scrollTo
			}, 250);
		}
	}

	function createTable() {
		var $container = $('<div class="rg-container"></div>');
		var $header = $('<div class="rg-header"></div>');
		var $hed = $('<div contenteditable="true" class="rg-hed">' + _copy.hed + '</div>');
		var $subhed = $('<div contenteditable="true" class="rg-subhed">' + _copy.subhed + '</div>');
		var $content = $('<div class="rg-content"></div>');
		var $sourceCredit = $('<div class="rg-source-and-credit"></div>');
		var $source = $('<div contenteditable="true" class="rg-source"><span class="pre-colon">' + _copy.sourcePre + '</span>: <span class="post-colon">' + _copy.sourcePost + '</span></div>');
		var $credit = $('<div contenteditable="true" class="rg-credit">' + _copy.credit + '</div>');
		
		var $inlineStyle = '<style>\n@media screen and (max-width: ' + _input.breakpoint + ') {\n.rg-container {\n\tmax-width: 500px;\n\tmargin: 0 auto;\n}\ntable.rg-table {\n\tdisplay: block;\n\twidth: 100%;\n}\ntable.rg-table tr.hide-mobile, table.rg-table th.hide-mobile, table.rg-table td.hide-mobile {\n\tdisplay: none;\n}\ntable.rg-table thead {\n\tdisplay: none;\n}\ntable.rg-table tbody {\n\tdisplay: block;\n\twidth: 100%;\n}\ntable.rg-table td:last-child {\n\tpadding-right: 0;\n\tborder-bottom: 2px solid #ccc;\n}\ntable.rg-table tr, table.rg-table th, table.rg-table td {\n\tdisplay: block;\n\tpadding: 0;\n}\ntable.rg-table th[data-title]:before, table.rg-table td[data-title]:before {\n\tcontent: attr(data-title) ":\00A0";\n\tfont-weight: bold;\n\tdisplay: inline-block;\n\tcontent: attr(data-title);\n\tfloat: left;\n}\ntable.rg-table tr {\n\tborder-bottom: none;\n\tmargin: 0 0 1em 0;\n\tpadding: 0.5em 0;\n}\ntable.rg-table tr:nth-child(even) {\n\tbackground: none;\n}\ntable.rg-table td {\n\tpadding: 0.5em 0 0.25em 0;\n\tborder-bottom: 1px dotted #ccc;\n\ttext-align: right;\n}\ntable.rg-table td:empty {\n\tdisplay: none;\n}\ntable.rg-table .highlight td {\n\tbackground: none;\n}\ntable.rg-table tr.highlight {\n\tbackground: none;\n}\ntable.rg-table.zebra tr:nth-child(even) {\n\tbackground: none;\n}\ntable.rg-table.zebra td:nth-child(even) {\n\tbackground: rgba(195, 195, 197, 0.1);\n}\n}</style>';
		
		var tableContent = '';

		var tableClasses = 'rg-table';
		if(_input.zebra) {
			tableClasses += ' zebra';	
		}
		tableContent += '<table class="' + tableClasses + '"><thead>';

		for (var i = 0; i < _data.headers.length; i++) {
			var valTh = _data.headers[i];
			var classesTh = _input.hideColumns[valTh] ? 'hide-mobile ' : '';
			classesTh += _data.className[i] + ' rg-th';

			var htmlTh = '<th class="'+ classesTh + '">' + _data.headers[i] + '</th>';
			
			tableContent += htmlTh;
		}

		tableContent += '</thead>';
		tableContent += '<tbody>';

		for (var a = 0; a < _data.rows.length; a++) {
			var row = _data.rows[a];
			
			var hideMobile = a < _input.mobileRows ? '' : ' class="hide-mobile"';
			
			tableContent += '<tr' + hideMobile + '>';

			for (var b = 0; b < row.length; b++) {
				var valCol = _data.headers[b];
				var classesTd = _input.hideColumns[valCol] ? 'hide-mobile ' : '';
				classesTd += _data.className[b];

				var htmlTd = '<td class="' + classesTd + '" data-title="' + valCol + '">' + row[b] + '</td>';

				tableContent += htmlTd;
			}

			tableContent += '</tr>';
		}
		tableContent += '</tbody></table>';
		
		$content.append(tableContent);

		$sourceCredit.append($source);
		$sourceCredit.append($credit);
		$header.append($hed);
		$header.append($subhed);
		
		$container.append($inlineStyle);
		$container.append($header);
		$container.append($content);
		$container.append($sourceCredit);

		$('.preview').empty().append($container);
		$('.final').removeClass('hide');
		$('.create-table').text('Update table');

		var scrollTo = $('.final').offset().top - 10;
		$('html, body').animate({
			scrollTop: scrollTo
		}, 250);

		$('.updated').removeClass('invisible');
		setTimeout(function(){
			$('.updated').addClass('invisible');
		}, 1500);
	}

	function generateCode() {
		updateCopy();

		var highlight = {};

		$('.rg-table tr').each(function() {
			if($(this).hasClass('highlight')) {
				var index = $(this).index();
				highlight[index] = true;
			}
		});

		var html = '';

		var css = '\n/*styles for graphic info (hed, subhed, source, credit)*/\n.rg-container {\n\tfont-family: Helvetica, Arial, sans-serif;\n\tfont-size: 16px;\n\tline-height: 1;\n\tmargin: 0;\n\tpadding: 1em 0;\n\tcolor: #1a1a1a;\n}\n.rg-header {\n\tmargin-bottom: 1em;\n}\n.rg-hed {\n\tfont-family: "Benton Sans Bold", Helvetica, Arial, sans-serif;\n\tfont-weight: bold;\n\tfont-size: 1.35em;\n\tmargin-bottom: 0.25em;\n}\n.rg-subhed {\n\tfont-size: 1em;\n\tline-height: 1.4em;\n}\n.rg-source-and-credit {\n\tfont-family: Georgia,"Times New Roman", Times,serif;\n\twidth: 100%;\n\toverflow: hidden;\n\tmargin-top: 1em;\n}\n.rg-source {\n\tmargin: 0;\n\tfloat: left;\n\tfont-weight: bold;\n\tfont-size: 0.75em;\n\tline-height: 1.5em;\n}\n.rg-source .pre-colon {\n\ttext-transform: uppercase;\n}\n.rg-credit {\n\tmargin: 0;\n\tcolor: #999;\n\ttext-transform: uppercase;\n\tletter-spacing: 0.05em;\n\tfloat: right;\n\ttext-align: right;\n\tfont-size: 0.65em;\n\tline-height: 1.5em;\n}\n@media (max-width: 640px) {\n.rg-source-and-credit > div {\n\twidth: 100%;\n\tdisplay: block;\n\tfloat: none;\n\ttext-align: right;\n}\n}\n/*styles for graphic*/\ntable.rg-table {\n\tmargin: 0 0 1em 0;\n\twidth: 100%;\n\tfont-family: Helvetica, Arial, sans-serif;\n\tfont-size: 1em;\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}\ntable.rg-table * {\n\t-moz-box-sizing: border-box;\n\tbox-sizing: border-box;\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n\ttext-align: left;\n\tcolor: #333;\n}\ntable.rg-table thead {\n\tborder-bottom: 1px solid rgba(195,195,197,.3);\n}\ntable.rg-table th {\n\tfont-weight: bold;\n\tpadding: 0.5em;\n\tfont-size: 0.85em;\n}\ntable.rg-table td {\n\tpadding: 0.5em;\n\tfont-size: 0.9em;\n}\ntable.rg-table .highlight td {\n\tfont-weight: bold;\n}\ntable.rg-table tr {\n\tborder-bottom: 1px solid rgba(195,195,197,.3);\n\tcolor: #222;\n}\ntable.rg-table .number {\n\ttext-align: right;\n}\ntable.rg-table.zebra tr:nth-child(even) {\n\tbackground: rgba(195, 195, 197, 0.1);\n}\ntable.rg-table tr.highlight {\n\tbackground: #edece4;\n}\n@media screen and (max-width: ' + _input.breakpoint + ') {\n.rg-container {\n\tmax-width: 500px;\n\tmargin: 0 auto;\n}\ntable.rg-table {\n\tdisplay: block;\n\twidth: 100%;\n}\ntable.rg-table tr.hide-mobile, table.rg-table th.hide-mobile, table.rg-table td.hide-mobile {\n\tdisplay: none;\n}\ntable.rg-table thead {\n\tdisplay: none;\n}\ntable.rg-table tbody {\n\tdisplay: block;\n\twidth: 100%;\n}\ntable.rg-table td:last-child {\n\tpadding-right: 0;\n\tborder-bottom: 2px solid #ccc;\n}\ntable.rg-table tr, table.rg-table th, table.rg-table td {\n\tdisplay: block;\n\tpadding: 0;\n}\ntable.rg-table th[data-title]:before, table.rg-table td[data-title]:before {\n\tcontent: attr(data-title) ":\00A0";\n\tfont-weight: bold;\n\tdisplay: inline-block;\n\tcontent: attr(data-title);\n\tfloat: left;\n}\ntable.rg-table tr {\n\tborder-bottom: none;\n\tmargin: 0 0 1em 0;\n\tpadding: 0.5em 0;\n}\ntable.rg-table tr:nth-child(even) {\n\tbackground: none;\n}\ntable.rg-table td {\n\tpadding: 0.5em 0 0.25em 0;\n\tborder-bottom: 1px dotted #ccc;\n\ttext-align: right;\n}\ntable.rg-table td:empty {\n\tdisplay: none;\n}\ntable.rg-table .highlight td {\n\tbackground: none;\n}\ntable.rg-table tr.highlight {\n\tbackground: none;\n}\ntable.rg-table.zebra tr:nth-child(even) {\n\tbackground: none;\n}\ntable.rg-table.zebra td:nth-child(even) {\n\tbackground: rgba(195, 195, 197, 0.1);\n}\n}';

		html += '<style>' + css + '\n</style>';

		html += '\n<div class="rg-container">';
		html += '\n\t<div class="rg-header">';

		if(_copy.hed.length > 0 ) {
			html += '\n\t\t<div class="rg-hed">' + _copy.hed + '</div>';	
		}
		if(_copy.subhed.length > 0 ) {
			html += '\n\t\t<div class="rg-subhed">' + _copy.subhed + '</div>';	
		}
		html += '\n\t</div>';
		html += '\n\t<div class="rg-content">';
		if(_input.zebra) {
			html += '\n\t\t<table class="rg-table zebra">';
		} else {
			html += '\n\t\t<table class="rg-table">';
		}
		
		html += '\n\t\t\t<thead>';

		for (var i = 0; i < _data.headers.length; i++) {
			var valTh = _data.headers[i];
			var classesTh = _input.hideColumns[valTh] ? 'hide-mobile ' : '';
			classesTh += _data.className[i] + ' rg-th';

			var htmlTh = '\n\t\t\t\t<th class="'+ classesTh + '">' + _data.headers[i] + '</th>';
			
			html += htmlTh;
		}

		html += '\n\t\t\t</thead>';
		html += '\n\t\t\t<tbody>';

		for (var a = 0; a < _data.rows.length; a++) {
			var row = _data.rows[a];
			var trClasses = '';
			trClasses += a < _input.mobileRows ? '' : 'hide-mobile';
			if(highlight[a]) {
				trClasses += ' highlight';
			}
			if(trClasses) {
				html += '\n\t\t\t\t<tr class="' + trClasses + '">';	
			} else {
				html += '\n\t\t\t\t<tr>';
			}

			for (var b = 0; b < row.length; b++) {
				var valCol = _data.headers[b];
				var classesTd = _input.hideColumns[valCol] ? 'hide-mobile ' : '';
				classesTd += _data.className[b];

				var htmlTd = '\n\t\t\t\t\t\t<td class="' + classesTd + '" data-title="' + valCol + '">' + row[b] + '</td>';

				html += htmlTd;
			}

			html += '\n\t\t\t\t</tr>';
		}
		html += '\n\t\t\t</tbody>';
		html += '\n\t\t</table>';
		html += '\n\t</div>';

		html += '\n\t<div class="rg-source-and-credit">';
		html += '\n\t\t<div class="rg-source"><span class="pre-colon">' + _copy.sourcePre + '</span>: <span class="post-colon">' + _copy.sourcePost + '</span></div>';
		html += '\n\t\t<div class="rg-credit">' + _copy.credit + '</div>';
		html += '\n\t</div>';

		html += '\n</div>';

		$('.output-code').val(html);
	}

	function updateCopy() {
		_copy.hed = $('.rg-hed').text();
		_copy.subhed = $('.rg-subhed').text();
		_copy.credit = $('.rg-credit').text();
		_copy.sourcePre = $('.rg-source .pre-colon').text();
		_copy.sourcePost = $('.rg-source .post-colon').text();
	}

	function customize(input) {
		if(input.hideColumns) {
			var names = input.hideColumns.split(',');
			input.hideColumns = {};
			for(var i = 0; i < names.length; i++) {
				input.hideColumns[names[i].trim()] = true;
			}
		} else {
			input.hideColumns = {};
		}

		_input = input;
		createTable();
	}

	function getColumnTypes() {
		$('.header-choice').each(function(i) {
			var el = $(this).find('.current-choice');
			var t = el.text().toLowerCase().trim();
			_data.className[i] = t;
		});
	}

	init();
})();