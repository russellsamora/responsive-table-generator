(function() {
		var _output;
		var _failed;
		var _data;
		var _breakpoint;
		var _input;
		var _demo = 'Name\tCity\tRating\tPrice\nSuperette\tHolliston\t4.5\t$8.00\nTasty Treat\tAshland\t2.0\t$5.00\nBig Fresh\tFramingham\t5.0\t$9.00\nSeta\'s Cafe\tWatertown\t3.8\t$7.50';
		var _copy = {
			hed: 'Hed',
			subhed: 'Subhed goes here.',
			credit: 'Globe Staff',
			sourcePre: 'DATA',
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

		$('.headerChoices').on('click', 'button', function() {
			$(this).siblings().removeClass('currentChoice');
			$(this).addClass('currentChoice');
		});

		$('.createTable').on('click', function() {
			getColumnTypes();
			var input = {
				mobileRows: $('.mobileRows').val(),
				zebra: $('.zebra:checked').val() ? true : false,
				hideColumns: $('.hideColumns').val(),
				breakpoint: $('#breakpointText').val()
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

		$('#breakpointSlider').on('input', function() {
			$('#breakpointText').val(this.value + 'px');
		});

		$('.generate-code').on('click', function() {
			generateCode();
		});

		$('.preview').on('click', '.responsive-table tr', function() {
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
			$('.headerChoices').empty();
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

	function createTable() {
		var $container = $('<div class="responsive-graphic-container"></div>');
		var $header = $('<div class="responsive-graphic-header"></div>');
		var $hed = $('<div contenteditable="true" class="responsive-graphic-hed">' + _copy.hed + '</div>');
		var $subhed = $('<div contenteditable="true" class="responsive-graphic-subhed">' + _copy.subhed + '</div>');
		var $content = $('<div class="responsive-graphic-content rg-table"></div>');
		var $sourceCredit = $('<div class="responsive-graphic-source-and-credit"></div>');
		var $source = $('<div class="responsive-graphic-source"><span contenteditable="true" class="pre-colon">' + _copy.sourcePre + '</span>: <span contenteditable="true" class="post-colon">' + _copy.sourcePost + '</span></div>');
		var $credit = $('<div contenteditable="true" class="responsive-graphic-credit">' + _copy.credit + '</div>');
		
		var $inlineStyle = '<style>@media screen and (max-width:' + _input.breakpoint + '){table.responsive-graphic-content {display: block;width: 100%;}table.responsive-table-content .number {text-align: left;}table.responsive-table-content tr.hideMobile, table.responsive-table-content th.hideMobile, table.responsive-table-content td.hideMobile {display: none;}table.responsive-table-content thead {display: none;}table.responsive-table-content tbody {display: block;width: 100%;}table.responsive-table-content tr, table.responsive-table-content th, table.responsive-table-content td {display: block;padding: 0;}table.responsive-table-content th[data-title]:before, table.responsive-table-content td[data-title]:before {content: attr(data-title) ":\\00A0";font-weight: bold;}table.responsive-table-content tr {border-bottom: 1px solid #ccc;margin: 0;padding: 0.5em 0;}table.responsive-table-content tr:nth-child(even) {background: none;}table.responsive-table-content td {padding: 0.25em 0 0 0;}table.responsive-table-content td:empty {display: none;}table.responsive-table-content td:first-child {font-size: 1.1em;font-weight: bold;}table.responsive-table-content td:first-child:before {content: "";}}</style>';
		
		if(_input.zebra) {
			$table.addClass('zebra')
		}

		var tableContent = '';

		tableContent += '<table class="responsive-table"><thead>';

		for (var i = 0; i < _data.headers.length; i++) {
			var valTh = _data.headers[i];
			var classesTh = _input.hideColumns[valTh] ? 'hideMobile ' : '';
			classesTh += _data.className[i] + ' responsive-th';

			var htmlTh = '<th class="'+ classesTh + '">' + _data.headers[i] + '</th>';
			
			tableContent += htmlTh;
		}

		tableContent += '</thead>';
		tableContent += '<tbody>';

		for (var a = 0; a < _data.rows.length; a++) {
			var row = _data.rows[a];
			var hideMobile = '';
			if(_input.mobileRows) {
				hideMobile = a < _input.mobileRows ? '' : ' class="hideMobile"';
			}
			tableContent += '<tr' + hideMobile + '>';

			for (var b = 0; b < row.length; b++) {
				var valCol = _data.headers[b];
				var classesTd = _input.hideColumns[valCol] ? 'hideMobile ' : '';
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
		$('.createTable').text('Update table');

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

		$('.responsive-table tr').each(function() {
			if($(this).hasClass('highlight')) {
				var index = $(this).index();
				highlight[index] = true;
				console.log(index);
			}
		});

		var html = '';
		var css = '\n/*styles for graphic info (hed, subhed, source, credit)*/\n.responsive-graphic-container {\n\tfont-family: Helvetica, Arial, sans-serif;\n\tfont-size: 16px;\n\tmargin: 0;\n\tpadding: 1em 0;\n\tcolor: #1a1a1a;\n}\n.responsive-graphic-header {\n\tmargin-bottom: 0.5em;\n}\n.responsive-graphic-hed {\n\tfont-size: 1.4em;\n\tfont-weight: bold;\n\tmargin-bottom: 0.2em;\n}\n.responsive-graphic-subhed {\n\tfont-size: 1em;\n}\n.responsive-graphic-source-and-credit {\n\tfont-family: Georgia,"Times New Roman",Times,serif;\n\twidth: 100%;\n\toverflow: hidden;\n\tmargin-top: 1em;\n}\n.responsive-graphic-source {\n\tmargin: 0;\n\tfloat: left;\n\tfont-weight: bold;\n\tfont-size: 0.75em;\n}\n.responsive-graphic-source .pre-colon {\n\ttext-transform: uppercase;\n}\n.responsive-graphic-credit {\n\tmargin: 0;\n\tcolor: #999;\n\ttext-transform: uppercase;\n\tletter-spacing: 0.05em;\n\tfloat: right;\n\ttext-align: right;\n\tfont-size: 0.65em;\n}\n@media (max-width: 640px) {\n.responsive-graphic-source-and-credit > div {\n\twidth: 100%;\n\tdisplay: block;\n\tfloat: none;\n\ttext-align: right;\n}\n}\n/*styles for graphic*/\ntable.responsive-table {\n  margin: 0 0 1em 0;\n  width: 100%;\n  font-family: Helvetica, Arial, sans-serif;\n  font-size: 1em;\n  border-collapse: collapse;\n  border-spacing: 0;\n}\ntable.responsive-table * {\n  -moz-box-sizing: border-box;\n  box-sizing: border-box;\n  margin: 0;\n  padding: 0;\n  border: 0;\n  font-size: 100%;\n  font: inherit;\n  vertical-align: baseline;\n  text-align: left;\n  color: #333;\n}\ntable.responsive-table thead {\n\tborder-bottom: 1px solid #ccc;\n}\ntable.responsive-table th {\n\tfont-weight: bold;\n\tpadding: 0.25em 0;\n}\ntable.responsive-table td {\n\tpadding: 0.25em 0;\n\tfont-size: 0.9em;\n}\ntable.responsive-table .highlight td {\n\tfont-weight: bold;\n}\ntable.responsive-table tr {\n\tborder-bottom: 1px solid #ccc;\n}\ntable.responsive-table tr.highlight {\n\tbackground: #efefef;\n}\ntable.responsive-table .number {\n\ttext-align: right;\n}\ntable.responsive-table.zebra tr:nth-child(even) {\n\tbackground: #efefef;\n}\n@media screen and (max-width: ' + _input.breakpoint + ') {\ntable.responsive-table {\n\tdisplay: block;\n\twidth: 100%;\n}\ntable.responsive-table .number {\n\ttext-align: left;\n}\ntable.responsive-table tr.hideMobile, table.responsive-table th.hideMobile, table.responsive-table td.hideMobile {\n\tdisplay: none;\n}\ntable.responsive-table thead {\n\tdisplay: none;\n}\ntable.responsive-table tbody {\n\tdisplay: block;\n\twidth: 100%;\n}\ntable.responsive-table tr, table.responsive-table th, table.responsive-table td {\n\tdisplay: block;\n\tpadding: 0;\n}\ntable.responsive-table th[data-title]:before, table.responsive-table td[data-title]:before {\n\tcontent: attr(data-title) ":\\00A0";\n\tfont-weight: bold;\n}\ntable.responsive-table tr {\n\tborder-bottom: 1px solid #ccc;\n\tmargin: 0;\n\tpadding: 0.5em 0;\n}\ntable.responsive-table tr:nth-child(even) {\n\tbackground: none;\n}\ntable.responsive-table td {\n\tpadding: 0.25em 0 0 0;\n}\ntable.responsive-table td:empty {\n\tdisplay: none;\n}\ntable.responsive-table td:first-child {\n\tfont-size: 1.1em;\n\tfont-weight: bold;\n}\ntable.responsive-table td:first-child:before {\n\tcontent: "";\n}\n}';

		html += '<style>' + css + '\n</style>';

		html += '\n<div class="responsive-graphic-container">';
		html += '\n\t<div class="responsive-graphic-header">';

		if(_copy.hed.length > 0 ) {
			html += '\n\t\t<div class="responsive-graphic-hed">' + _copy.hed + '</div>';	
		}
		if(_copy.subhed.length > 0 ) {
			html += '\n\t\t<div class="responsive-graphic-subhed">' + _copy.subhed + '</div>';	
		}
		html += '\n\t</div>';
		html += '\n\t<div class="responsive-graphic-content rg-table">';
		if(_input.zebra) {
			html += '\n\t\t<table class="responsive-table zebra">';
		} else {
			html += '\n\t\t<table class="responsive-table">';
		}
		
		html += '\n\t\t\t<thead>';

		for (var i = 0; i < _data.headers.length; i++) {
			var valTh = _data.headers[i];
			var classesTh = _input.hideColumns[valTh] ? 'hideMobile ' : '';
			classesTh += _data.className[i] + ' responsive-th';

			var htmlTh = '\n\t\t\t\t<th class="'+ classesTh + '">' + _data.headers[i] + '</th>';
			
			html += htmlTh;
		}

		html += '\n\t\t\t</thead>';
		html += '\n\t\t\t<tbody>';

		for (var a = 0; a < _data.rows.length; a++) {
			var row = _data.rows[a];
			var hideMobile = '';
			if(_input.mobileRows) {
				hideMobile = a < _input.mobileRows ? '' : ' class="hideMobile"';
			}
			html += '\n\t\t\t\t<tr' + hideMobile + '>';

			for (var b = 0; b < row.length; b++) {
				var valCol = _data.headers[b];
				var classesTd = _input.hideColumns[valCol] ? 'hideMobile ' : '';
				classesTd += _data.className[b];

				var htmlTd = '\n\t\t\t\t\t\t<td class="' + classesTd + '" data-title="' + valCol + '">' + row[b] + '</td>';

				html += htmlTd;
			}

			html += '\n\t\t\t\t</tr>';
		}
		html += '\n\t\t\t</tbody>';
		html += '\n\t\t</table>';
		html += '\n\t</div>';

		html += '\n\t<div class="responsive-graphic-source-and-credit">';
		html += '\n\t\t<div class="responsive-graphic-source"><span class="pre-colon">' + _copy.sourcePre + '</span>: <span class="post-colon">' + _copy.sourcePost + '</span></div>';
		html += '\n\t\t<div class="responsive-graphic-credit">' + _copy.credit + '</div>';
		html += '\n\t</div>';

		html += '\n</div>';

		$('.output-code').val(html);
	}

	function updateCopy() {
		_copy.hed = $('.responsive-graphic-hed').text();
		_copy.subhed = $('.responsive-graphic-subhed').text();
		_copy.credit = $('.responsive-graphic-credit').text();
		_copy.sourcePre = $('.responsive-graphic-source .pre-colon').text();
		_copy.sourcePost = $('.responsive-graphic-source .post-colon').text();
	}

	function customize(input) {
		if(input.mobileRows) {
			input.mobileRows = +input.mobileRows;
			if(isNaN(input.mobileRows)) {
				input.mobileRows = false;
			}
		}
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
		$('.headerChoice').each(function(i) {
			var el = $(this).find('.currentChoice');
			var t = el.text().toLowerCase().trim();
			_data.className[i] = t;
		});
	}

	init();
})();