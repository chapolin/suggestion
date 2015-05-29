var services = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: '/services?query=%QUERY',
      wildcard: '%QUERY'
    }
});

var establishment = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: '/establishment?query=%QUERY',
      wildcard: '%QUERY'
    }
});

$('.prefetch-step-1 .typeahead').typeahead({minLength: 2, highlight: true}, {
    name: 'step-1',
    display: 'name',
    source: services,
    templates: {
      empty: 'Serviço não encontrado, cadastre por favor!',
      suggestion: Handlebars.compile('<a href="javascript:;" onclick="setServiceValueFromSuggestion(this)" data-id="{{_id}}" data-name="{{name}}">{{name}}</span>')
    }
});

$('.prefetch-step-2 .typeahead').typeahead({minLength: 2, highlight: true}, {
    name: 'step-2',
    display: 'name',
    source: establishment,
    templates: {
      empty: 'Estabelecimento não encontrado, cadastre por favor!',
      suggestion: Handlebars.compile('<a href="javascript:;" onclick="setEstablishmentValueFromSuggestion(this)" data-id="{{_id}}" data-name="{{name}}">{{name}}</span>')
    }
});