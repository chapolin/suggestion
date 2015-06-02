var services = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    prefetch: {
        url: '/services?query=all',
        ttl: 300
    }
});

var establishment = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
	prefetch: {
	    url: '/establishment?query=all',
        ttl: 300
	}
});

$('.prefetch-step-1 .typeahead').typeahead({minLength: 1, highlight: true}, {
    name: 'step-1',
    display: 'name',
    limit: 10,
    source: services,
    templates: {
      empty: 'Serviço não encontrado, cadastre por favor!',
      suggestion: Handlebars.compile('<a href="javascript:;" onclick="setServiceValueFromSuggestion(this)" data-id="{{_id}}" data-name="{{name}}">{{name}}</span>')
    }
});

$('.prefetch-step-2 .typeahead').typeahead({minLength: 1, highlight: true}, {
    name: 'step-2',
    display: 'name',
    limit: 10,
    source: establishment,
    templates: {
      empty: 'Estabelecimento não encontrado, cadastre por favor!',
      suggestion: Handlebars.compile('<a href="javascript:;" onclick="setEstablishmentValueFromSuggestion(this)" data-id="{{_id}}" data-name="{{name}}">{{name}}</span>')
    }
});