var services = new Bloodhound({
	datumTokenizer : Bloodhound.tokenizers.whitespace,
	queryTokenizer : Bloodhound.tokenizers.whitespace,
	prefetch : '/services?query=all'
});

var establishment = new Bloodhound({
	datumTokenizer : Bloodhound.tokenizers.whitespace,
	queryTokenizer : Bloodhound.tokenizers.whitespace,
	prefetch : '/establishment?query=all'
});

var bestPictures = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.whitespace,
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: '/data/films/post_1960.json'
  });

$('.prefetch-step-1 .typeahead').typeahead(null, {
	name: "step-1",
	source : services
});

$('.prefetch-step-2 .typeahead').typeahead(null, {
	source : establishment
});

//
//$('.prefetch-step-2 .typeahead').typeahead(null, {
//	name: 'places',
//	  display: 'name',
//	source : places,
//	templates: {
//	    empty: [
//	      '<div class="empty-message">',
//	        'Não encontrado ocorrências, cadastre o seu local :)',
//	      '</div>'
//	    ].join('\n')
//	  }
//});

//$('.prefetch-step-1 .typeahead').typeahead(null, {
//	name: 'step-1',
//	display: 'name',
//	source: bestPictures,
//	templates: {
//		empty: '<div class="empty-message">Não encontrado ocorrências!</div>',
//		suggestion: Handlebars.compile('<div><strong>{{value}}</strong> – {{year}}</div>')
//	}
//});