(function() {
	const dev = window.location.hostname.indexOf('localhost') > -1
	const store = { data: [], columns: {}, highlightRows: [] }
	const copy = {
		hed: 'Hed',
		dek: 'Dek goes here.',
		sourcePre: 'SOURCE',
		sourcePost: 'Sources',
	}
	
	const options = {}

	const debug = (name, data) => {
		if (dev) {
			console.log(`-- [debug: ${name}] --`)
			console.log(data)
			console.log('-- [end debug] -- ')
			console.log('')
		}
	}

	const scrollTo = (scrollTop) => $('html, body').animate({ scrollTop }, 250)

	const getColumnNames = (row) => {
		const columns = row.split('\t')
		debug('columns', columns)
		if(columns.length <= 1) throw new Error('not enough columns')
		else {
			return columns.map(c => c.trim())
		}
	}

	const getData = (rows) => {
		return rows.map(r => {
			const columns = r.split('\t')
			return columns.map(c => c.trim())
		})
	}

 	const parseInput = (input) => {
		const rows = input.split('\n')
		// must have more than just header
		if(rows.length > 1) {
			const names = getColumnNames(rows.shift())
			const data = getData(rows)
			// debug('data', data)
			return { names, data }
		} else {
			throw new Error('not enough rows')
		}
	}

	const displayColumnTypes = ({ columns, data }) => {
		const types = dl.type.inferAll(data)
		$('.column-types').empty()
		const html = columns.names.map((h, i) => `
			<div class='column-type'>
				<span>${h}</span>
				<div class='button-types'>
					<button class='${types[i] === 'string' ? 'selected' : ''}'>Text</button>
					<button class='${types[i] === 'number' ? 'selected' : ''}'>Number</button>
				</div>
			</div>
		`.trim()).join('')
		
		$('.column-types').html(html)

		$('.after').removeClass('hide')
		
		const position = $('.after').offset().top - 10
		scrollTo(position)
	}

	const getColumnTypes = () => {
		store.columns.types = []
		$('.column-type').each(function(i) {
			const el = $(this).find('.selected')
			const colName = $(this).text().trim()
			const colType = el.text().toLowerCase().trim()
			store.columns.types[i] = colType
		})
	}
	const createClass = (columnName, index) => {
		const typeClass = store.columns.types[index]
		const hideClass = options.hideColumns.find(c => c === columnName.toLowerCase()) ? 'hide-mobile' : ''
		return `class='${typeClass} ${hideClass}'`
	}
	const createTableHeaders = () => {
		return store.columns.names.map((columnName, i) => {
			const classAttr = createClass(columnName, i)
			return `<th ${classAttr}>${columnName}</th>`
		}).join('\n\t\t\t\t')
	}

	const createTableTd = (value, i) => {
		const columnName = store.columns.names[i]
		const classAttr = createClass(columnName, i)
		return `
			<td ${classAttr} data-title='${columnName}'>${value}</td>
		`.trim()
	}

	const createTableBody = () => {
		return store.data.map((row, i) => {
			const hideClass = i < options.mobileRows ? '' : 'hide-mobile'
			const highlightClass = store.highlightRows[i] ? ' highlight' : ''
			const classAttr = `class='${hideClass}${highlightClass}'`
			return `
				<tr ${classAttr}>
					${row.map((value, i) => createTableTd(value, i)).join('\n\t\t\t\t\t')}
				</tr>
			`
		}).join('\n')
	}

	const createHTML = ({ editable }) => {
		return `
<style>@@include("../.tmp/table-style.css")</style>
<div class='rg-container'>
	<div class='rg-header'>
		<div${editable} class='rg-hed'>${copy.hed}</div>
		<div${editable} class='rg-dek'>${copy.dek}</div>
	</div>
	<div class='rg-content'>
		<table class='rg-table${options.zebra ? ' zebra' : ''}'>
			<thead>
				${createTableHeaders()}
			</thead>
			<tbody>
				${createTableBody()}
			</tbody>
		</table>
	</div>
	<div class='rg-source-and-credit'>
		<div${editable} class='rg-source'>
			<span class='pre-colon'>${copy.sourcePre}</span>: <span class='post-colon'>${copy.sourcePost}</span>
		</div>
	</div>
</div>
		`.trim()
	}

	const createTable = () => {
		const html = createHTML({ editable: " contenteditable='true'" })

		$('.preview').html(html)
		$('.final').removeClass('hide');
		$('.create-table').text('Update table')

		const position = $('.final').offset().top - 10;
		scrollTo(position)

		$('.updated').removeClass('invisible')
		setTimeout(() => {
			$('.updated').addClass('invisible')
		}, 1500)
	}

	const updateCopy = () => {
		copy.hed = $('.rg-hed').text()
		copy.subhed = $('.rg-subhed').text()
		copy.sourcePre = $('.rg-source .pre-colon').text()
		copy.sourcePost = $('.rg-source .post-colon').text()
	}

	const generateCode = () => {
		updateCopy()

		store.highlightRows = []

		$('.rg-table tbody tr').each(function() {
			store.highlightRows.push($(this).hasClass('highlight'))
		})

		const html = createHTML({ editable: '' })

		$('.output-code').val(html)
	}

	const bindEvents = () => {
		$('.demo').on('click', function(e) {
			e.preventDefault()
			const demoData = 'Name\tCity\tPrice\tRating\nSuperette\tHolliston\t$8.00\t4.5\nTasty Treat\tAshland\t$5.00\t2.0\nBig Fresh\tFramingham\t$9.00\t5.0\nSeta\'s Cafe\tWatertown\t$7.50\t3.8'
			$('.input').val(demoData)
			return false
		})

		$('.get-started').on('click', function(e) {
			e.preventDefault()
			if (!dev) ga('send', 'event', 'Get started', 'click', 'Get started button')
			try {
				const { names, data }  = parseInput($('.input').val())
				store.columns.names = names
				store.data = data
				displayColumnTypes(store)
			} catch (error) {
				alert(error)
				console.error(error)
			}
			
			return false
		})

		$('.column-types').on('click', 'button', function() {
			$(this).siblings().removeClass('selected')
			$(this).addClass('selected')
		})

		$('.zebra-buttons').on('click', 'button', function() {
			$(this).siblings().removeClass('selected')
			$(this).addClass('selected')	
		})

		$('.mobile-rows-slider').on('input', function() {
			$('.mobile-rows-text').val(this.value)
		})

		$('.breakpoint-slider').on('input', function() {
			$('.breakpoint-text').val(this.value + 'px')
		})

		$('.create-table').on('click', function() {
			getColumnTypes()
			
			const mobileRowsVal = +$('.mobile-rows-text').val()
			options.mobileRows =  isNaN(mobileRowsVal) ? 10 : mobileRowsVal
			
			const zebraChoice = $('.zebra-buttons').find('.selected').text().toLowerCase().trim()
			debug('zebra', zebraChoice)
			options.zebra = zebraChoice === 'on' ? true : false
			
			options.hideColumns = $('.hide-columns').val().split(',').map(v => v.trim().toLowerCase()).filter(v => v)
			const breakpointVal = +$('.breakpoint-text').val().split('px')[0]
			options.breakpoint =  isNaN(breakpointVal) ? '600px' : `${breakpointVal}px`
			
			createTable()
		})

		$('.modify').on('click', function() {
			const position = $('.after').offset().top - 10
			scrollTo(position)
		})
	
		$('.generate-code').on('click', generateCode)

		$('.preview').on('click', '.rg-table tbody tr', function() {
			$(this).toggleClass('highlight')
		})
	}
	
	const init = () => {
		console.log('v1.0.0')
		bindEvents()
	}

	init()
})()
