'use strict';

(function () {
	var dev = window.location.hostname.indexOf('localhost') > -1;
	var store = { data: [], columns: {}, highlightRows: [] };
	var copy = {
		hed: 'Hed',
		dek: 'Dek goes here.',
		sourcePre: 'SOURCE',
		sourcePost: 'Sources'
	};

	var options = {};

	var debug = function debug(name, data) {
		if (dev) {
			console.log('-- [debug: ' + name + '] --');
			console.log(data);
			console.log('-- [end debug] -- ');
			console.log('');
		}
	};

	var scrollTo = function scrollTo(scrollTop) {
		return $('html, body').animate({ scrollTop: scrollTop }, 250);
	};

	var getColumnNames = function getColumnNames(row) {
		var columns = row.split('\t');
		debug('columns', columns);
		if (columns.length <= 1) throw new Error('not enough columns');else {
			return columns.map(function (c) {
				return c.trim();
			});
		}
	};

	var getData = function getData(rows) {
		return rows.map(function (r) {
			var columns = r.split('\t');
			return columns.map(function (c) {
				return c.trim();
			});
		});
	};

	var parseInput = function parseInput(input) {
		var rows = input.split('\n');
		// must have more than just header
		if (rows.length > 1) {
			var names = getColumnNames(rows.shift());
			var data = getData(rows);
			// debug('data', data)
			return { names: names, data: data };
		} else {
			throw new Error('not enough rows');
		}
	};

	var displayColumnTypes = function displayColumnTypes(_ref) {
		var columns = _ref.columns;
		var data = _ref.data;

		var types = dl.type.inferAll(data);
		$('.column-types').empty();
		var html = columns.names.map(function (h, i) {
			return ('\n\t\t\t<div class=\'column-type\'>\n\t\t\t\t<span>' + h + '</span>\n\t\t\t\t<div class=\'button-types\'>\n\t\t\t\t\t<button class=\'' + (types[i] === 'string' ? 'selected' : '') + '\'>Text</button>\n\t\t\t\t\t<button class=\'' + (types[i] === 'number' ? 'selected' : '') + '\'>Number</button>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t').trim();
		}).join('');

		$('.column-types').html(html);

		$('.after').removeClass('hide');

		var position = $('.after').offset().top - 10;
		scrollTo(position);
	};

	var getColumnTypes = function getColumnTypes() {
		store.columns.types = [];
		$('.column-type').each(function (i) {
			var el = $(this).find('.selected');
			var colName = $(this).text().trim();
			var colType = el.text().toLowerCase().trim();
			store.columns.types[i] = colType;
		});
	};
	var createClass = function createClass(columnName, index) {
		var typeClass = store.columns.types[index];
		var hideClass = options.hideColumns.find(function (c) {
			return c === columnName.toLowerCase();
		}) ? 'hide-mobile' : '';
		return 'class=\'' + typeClass + ' ' + hideClass + '\'';
	};
	var createTableHeaders = function createTableHeaders() {
		return store.columns.names.map(function (columnName, i) {
			var classAttr = createClass(columnName, i);
			return '<th ' + classAttr + '>' + columnName + '</th>';
		}).join('\n\t\t\t\t');
	};

	var createTableTd = function createTableTd(value, i) {
		var columnName = store.columns.names[i];
		var classAttr = createClass(columnName, i);
		return ('\n\t\t\t<td ' + classAttr + ' data-title=\'' + columnName + '\'>' + value + '</td>\n\t\t').trim();
	};

	var createTableBody = function createTableBody() {
		return store.data.map(function (row, i) {
			var hideClass = i < options.mobileRows ? '' : 'hide-mobile';
			var highlightClass = store.highlightRows[i] ? ' highlight' : '';
			var classAttr = 'class=\'' + hideClass + highlightClass + '\'';
			return '\n\t\t\t\t<tr ' + classAttr + '>\n\t\t\t\t\t' + row.map(function (value, i) {
				return createTableTd(value, i);
			}).join('\n\t\t\t\t\t') + '\n\t\t\t\t</tr>\n\t\t\t';
		}).join('\n');
	};

	var createHTML = function createHTML(_ref2) {
		var editable = _ref2.editable;

		return ('\n<style>/* info (hed, dek, source, credit) */\n.rg-container {\n\tfont-family: Helvetica, Arial, sans-serif;\n\tfont-size: 16px;\n\tline-height: 1.4;\n\tmargin: 0;\n\tpadding: 1em 0.5em;\n\tcolor: #1a1a1a;\n}\n.rg-header {\n\tmargin-bottom: 1em;\n}\n.rg-hed {\n\tfont-weight: bold;\n\tfont-size: 1.4em;\n}\n.rg-dek {\n\tfont-size: 1em;\n}\n.rg-source-and-credit {\n\twidth: 100%;\n\toverflow: hidden;\n}\n.rg-source {\n\tmargin: 0;\n\tfloat: left;\n\tfont-weight: bold;\n\tfont-size: 0.75em;\n}\n.rg-source .pre-colon {\n\ttext-transform: uppercase;\n}\n\n/* table */\ntable.rg-table {\n\twidth: 100%;\n\tmargin-bottom: 0.5em;\n\tfont-size: 1em;\n\tborder-collapse: collapse;\n\tborder-spacing: 0;\n}\ntable.rg-table * {\n\t-moz-box-sizing: border-box;\n\tbox-sizing: border-box;\n\tmargin: 0;\n\tpadding: 0;\n\tborder: 0;\n\tfont-size: 100%;\n\tfont: inherit;\n\tvertical-align: baseline;\n\ttext-align: left;\n\tcolor: #333;\n}\ntable.rg-table thead {\n\tborder-bottom: 1px solid #ddd;\n}\ntable.rg-table tr {\n\tborder-bottom: 1px solid #ddd;\n\tcolor: #222;\n}\ntable.rg-table tr.highlight {\n\tbackground: #efefef;\n}\ntable.rg-table.zebra tr:nth-child(even) {\n\tbackground: #efefef;\n}\ntable.rg-table th {\n\tfont-weight: bold;\n\tpadding: 0.35em;\n\tfont-size: 0.9em;\n}\ntable.rg-table td {\n\tpadding: 0.35em;\n\tfont-size: 0.9em;\n}\ntable.rg-table .highlight td {\n\tfont-weight: bold;\n}\ntable.rg-table th.number, td.number {\n\ttext-align: right;\n}\n\n/* media queries */\n@media screen and (max-width: ' + options.breakpoint + ') {\n.rg-container {\n\tmax-width: ' + options.breakpoint + ';\n\tmargin: 0 auto;\n}\ntable.rg-table {\n\tdisplay: block;\n\twidth: 100%;\n}\ntable.rg-table tr.hide-mobile, table.rg-table th.hide-mobile, table.rg-table td.hide-mobile {\n\tdisplay: none;\n}\ntable.rg-table thead {\n\tdisplay: none;\n}\ntable.rg-table tbody {\n\tdisplay: block;\n\twidth: 100%;\n}\ntable.rg-table tr, table.rg-table th, table.rg-table td {\n\tdisplay: block;\n\tpadding: 0;\n}\ntable.rg-table tr {\n\tborder-bottom: none;\n\tmargin: 0 0 1em 0;\n\tpadding: 0.5em 0;\n}\ntable.rg-table tr.highlight {\n\tbackground: none;\n}\ntable.rg-table.zebra tr:nth-child(even) {\n\tbackground: none;\n}\ntable.rg-table.zebra td:nth-child(even) {\n\tbackground: #efefef;\n}\ntable.rg-table tr:nth-child(even) {\n\tbackground: none;\n}\ntable.rg-table td {\n\tpadding: 0.5em 0 0.25em 0;\n\tborder-bottom: 1px dotted #ccc;\n\ttext-align: right;\n}\ntable.rg-table td[data-title]:before {\n\tcontent: attr(data-title) ":\u0000A0";\n\tfont-weight: bold;\n\tdisplay: inline-block;\n\tcontent: attr(data-title);\n\tfloat: left;\n\tmargin-right: 0.5em;\n\tfont-size: 0.95em;\n}\ntable.rg-table td:last-child {\n\tpadding-right: 0;\n\tborder-bottom: 2px solid #ccc;\n}\ntable.rg-table td:empty {\n\tdisplay: none;\n}\ntable.rg-table .highlight td {\n\tbackground: none;\n}\n}\n</style>\n<div class=\'rg-container\'>\n\t<div class=\'rg-header\'>\n\t\t<div' + editable + ' class=\'rg-hed\'>' + copy.hed + '</div>\n\t\t<div' + editable + ' class=\'rg-dek\'>' + copy.dek + '</div>\n\t</div>\n\t<div class=\'rg-content\'>\n\t\t<table class=\'rg-table' + (options.zebra ? ' zebra' : '') + '\'>\n\t\t\t<thead>\n\t\t\t\t' + createTableHeaders() + '\n\t\t\t</thead>\n\t\t\t<tbody>\n\t\t\t\t' + createTableBody() + '\n\t\t\t</tbody>\n\t\t</table>\n\t</div>\n\t<div class=\'rg-source-and-credit\'>\n\t\t<div' + editable + ' class=\'rg-source\'>\n\t\t\t<span class=\'pre-colon\'>' + copy.sourcePre + '</span>: <span class=\'post-colon\'>' + copy.sourcePost + '</span>\n\t\t</div>\n\t</div>\n</div>\n\t\t').trim();
	};

	var createTable = function createTable() {
		var html = createHTML({ editable: " contenteditable='true'" });

		$('.preview').html(html);
		$('.final').removeClass('hide');
		$('.create-table').text('Update table');

		var position = $('.final').offset().top - 10;
		scrollTo(position);

		$('.updated').removeClass('invisible');
		setTimeout(function () {
			$('.updated').addClass('invisible');
		}, 1500);
	};

	var updateCopy = function updateCopy() {
		copy.hed = $('.rg-hed').text();
		copy.dek = $('.rg-dek').text();
		copy.sourcePre = $('.rg-source .pre-colon').text();
		copy.sourcePost = $('.rg-source .post-colon').text();
	};

	var generateCode = function generateCode() {
		updateCopy();

		store.highlightRows = [];

		$('.rg-table tbody tr').each(function () {
			store.highlightRows.push($(this).hasClass('highlight'));
		});

		var html = createHTML({ editable: '' });

		$('.output-code').val(html);
	};

	var bindEvents = function bindEvents() {
		$('.demo').on('click', function (e) {
			e.preventDefault();
			var demoData = 'Name\tCity\tPrice\tRating\nSuperette\tHolliston\t$8.00\t4.5\nTasty Treat\tAshland\t$5.00\t2.0\nBig Fresh\tFramingham\t$9.00\t5.0\nSeta\'s Cafe\tWatertown\t$7.50\t3.8';
			$('.input').val(demoData);
			return false;
		});

		$('.get-started').on('click', function (e) {
			e.preventDefault();
			if (!dev) ga('send', 'event', 'Get started', 'click', 'Get started button');
			try {
				var _parseInput = parseInput($('.input').val());

				var names = _parseInput.names;
				var data = _parseInput.data;

				store.columns.names = names;
				store.data = data;
				displayColumnTypes(store);
			} catch (error) {
				alert(error);
				console.error(error);
			}

			return false;
		});

		$('.column-types').on('click', 'button', function () {
			$(this).siblings().removeClass('selected');
			$(this).addClass('selected');
		});

		$('.zebra-buttons').on('click', 'button', function () {
			$(this).siblings().removeClass('selected');
			$(this).addClass('selected');
		});

		$('.mobile-rows-slider').on('input', function () {
			$('.mobile-rows-text').val(this.value);
		});

		$('.breakpoint-slider').on('input', function () {
			$('.breakpoint-text').val(this.value + 'px');
		});

		$('.create-table').on('click', function () {
			getColumnTypes();

			var mobileRowsVal = +$('.mobile-rows-text').val();
			options.mobileRows = isNaN(mobileRowsVal) ? 10 : mobileRowsVal;

			var zebraChoice = $('.zebra-buttons').find('.selected').text().toLowerCase().trim();
			debug('zebra', zebraChoice);
			options.zebra = zebraChoice === 'on' ? true : false;

			options.hideColumns = $('.hide-columns').val().split(',').map(function (v) {
				return v.trim().toLowerCase();
			}).filter(function (v) {
				return v;
			});
			var breakpointVal = +$('.breakpoint-text').val().split('px')[0];
			options.breakpoint = isNaN(breakpointVal) ? '600px' : breakpointVal + 'px';

			createTable();
		});

		$('.modify').on('click', function () {
			var position = $('.after').offset().top - 10;
			scrollTo(position);
		});

		$('.generate-code').on('click', generateCode);

		$('.preview').on('click', '.rg-table tbody tr', function () {
			$(this).toggleClass('highlight');
		});
	};

	var init = function init() {
		console.log('v1.0.0');
		bindEvents();
	};

	init();
})();