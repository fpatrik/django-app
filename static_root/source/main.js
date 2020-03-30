//Configure nunjucks
nunjucks.configure({ autoescape: true });

//Define variables
variables = {};

//Set current page
navigation = {'step' : 0, 'page' : 0, 'multipage' : {'overview' : true, 'instance' : 0}, 'end' : false};

//Construct form
form = new Form({'title' : 'Öffentliche Urkunde'});
var step1 = form.add_step({'title' : 'Firma', 'variable_name' : 'firma'});
var page = step1.add_page({'title' : 'Allgemeine Angaben', 'variable_name' : 'allgemein'});
var text = page.add_text({'label' : 'Firma der Gesellschaft', 'variable_name' : 'firmenname_1', 'required' : true, 'tooltip' : 'Jede Firma darf, neben dem vom Gesetze vorgeschriebenen wesentlichen Inhalt, Angaben enthalten, die zur näheren Umschreibung der darin erwähnten Personen dienen oder auf die Natur des Unternehmens hinweisen oder eine Phantasiebezeichnung darstellen, vorausgesetzt, dass der Inhalt der Firma der Wahrheit entspricht, keine Täuschungen verursachen kann und keinem öffentlichen Interesse zuwiderläuft. (Art. 944 Abs. 1 OR).\n\nDie Firma einer Handelsgesellschaft oder einer Genossenschaft muss sich von allen in der Schweiz bereits eingetragenen Firmen von Handelsgesellschaften und Genossenschaften deutlich unterscheiden. (Art. 951 OR). Es empfiehlt sich allenfalls eine vorgängige Abfrage unter www.regix.ch.\n\nIn der Firma ist die Rechtsform anzugeben (Art. 950 Abs. 1 in fine OR). Die Rechtsform in der Firma ist mit der zutreffenden Bezeichnung oder deren Abkürzung in einer Landessprache des Bundes anzugeben. (Art. 116a Abs. 1 HRegV)\n\nZulässige Abkürzungen (Anhang 2 zur HRegV):\n\nDeutsch: GmbH\nFranzösisch: Sàrl\nItalienisch: Sagl\nRumantsch: Scrl'});
var text = page.add_text({'label' : 'Übersetzung der Firma', 'variable_name' : 'firmenname_2', 'placeholder' : 'Optional'});
var text = page.add_text({'label' : 'Firmensitz', 'variable_name' : 'sitz', 'required' : true});

var step2 = form.add_step({'title' : 'Notariat', 'variable_name' : 'notariat'});
var page = step2.add_page({'title' : 'Notariat', 'variable_name' : 'notariat'});
var text = page.add_text({'label' : 'Name Notar', 'variable_name' : 'name', 'required' : true});
var text = page.add_text({'label' : 'Strasse', 'variable_name' : 'strasse', 'required' : true});
var text = page.add_text({'label' : 'Ort', 'variable_name' : 'ort', 'required' : true});
var text = page.add_text({'label' : 'PLZ', 'variable_name' : 'plz', 'required' : true});
var text = page.add_text({'label' : 'Datum der Beurkundung', 'variable_name' : 'datum', 'required' : true, 'date' : function(self){return true;}});

var step3 = form.add_step({'title' : 'Gründer', 'variable_name' : 'grunder'});
var page = step3.add_multipage({'title' : 'Gründer', 'variable_name' : 'grunder', 'naming' : function(self, index){if(typeof variables['grunder']['grunder'][index]['vorname'] !== 'undefined' && typeof variables['grunder']['grunder'][index]['name'] !== 'undefined'){return variables['grunder']['grunder'][index]['vorname'] + ' ' + variables['grunder']['grunder'][index]['name'];}else{return 'Gründer ' + parseInt(index + 1);}}});
var radio = page.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr', 'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});
var text = page.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true});
var text = page.add_text({'label' : 'Name', 'variable_name' : 'name', 'required' : true});
var text = page.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum', 'required' : true, 'year' :  function(self){return true;}});
var text = page.add_text({'label' : 'Heimatort', 'variable_name' : 'heimatort', 'required' : true});
var text = page.add_text({'label' : 'Strasse', 'variable_name' : 'strasse', 'required' : true});
var text = page.add_text({'label' : 'Ort', 'variable_name' : 'ort', 'required' : true});
var text = page.add_text({'label' : 'PLZ', 'variable_name' : 'plz', 'required' : true});
var separator = page.add_separator({});
var text = page.add_text({'label' : 'Stammanteile', 'variable_name' : 'stammanteile', 'required' : true});
var derived_v_5 = form.add_derived_variable({'assignment': 
	function(){
	for(var i = 0; i < variables['grunder']['grunder'].length; i++){
		if(typeof variables['kapital']['kapital']['nominalwert'] != 'undefined' && typeof variables['grunder']['grunder'][i]['stammanteile'] != 'undefined'){
				variables['grunder']['grunder'][i]['stammkapital'] = (parseInt(variables['kapital']['kapital']['nominalwert'].replace(/[^0-9]/, ''))*parseInt(variables['grunder']['grunder'][i]['stammanteile'].replace(/[^0-9]/, ''))).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1'") + '.-'; 
		}
	}}, 
	'condition' : function(variable_names){
		if(variable_names[0] == 'kapital' || variable_names[0] == 'grunder'){
			return true;
		}
		else{
			return false;
		}
	}
	});

var separator = page.add_separator({});
var checkbox_group = page.add_checkbox_group({'label' : 'Vertretung'});
var checkbox = checkbox_group.add_checkbox({'label' : 'Wird bei der Gründung vertreten', 'variable_name' : 'vertreten'});
var grunder_model = new Model(form, {'name' : 'grunder_model', 'sources' : [page]});
var modelselect = page.add_modelselect(grunder_model, {'variable_name': 'vertreten_durch', 'label' : 'Wird vertreten durch', 'show' : function(self, index){if(typeof variables['grunder']['grunder'][index]['vertreten'] != 'undefined' && variables['grunder']['grunder'][index]['vertreten']){return true;}else{return false;}}, 'required' : true});
var alert_1 = modelselect.add_alert({'condition' : function(self, end, index){if(typeof variables['grunder']['grunder'][index]['vertreten'] != 'undefined' && variables['grunder']['grunder'][index]['vertreten'] && typeof variables['grunder']['grunder'][index]['vertreten_durch'] != 'undefined' && variables['grunder']['grunder'][index]['vertreten_durch'] != ''){if(variables['grunder']['grunder'][index]['vertreten_durch'][2] == index){return true;}}else{return false;}}, 'message' : 'Ein Gründer kann sich nicht selbst vertreten'})
var text = page.add_text({'label' : 'Datum Vollmacht', 'variable_name' : 'datum_vollmacht', 'required' : true, 'date' :  function(self){return true;}, 'show' : function(self, index){if(typeof variables['grunder']['grunder'][index]['vertreten'] != 'undefined' && variables['grunder']['grunder'][index]['vertreten']){return true;}else{return false;}}});

var derived_v_6 = form.add_derived_variable({'assignment': 
	function(){
	var female = true;
	var singular = true;
	var vertretung = false;
	
	for(var i = 0; i < variables['grunder']['grunder'].length; i++){
		if(typeof variables['grunder']['grunder'][i]['sex'] != 'undefined'){
			if(i > 0){
				singular = false;
			}
			if(variables['grunder']['grunder'][i]['sex'] == 'herr'){
				female = false;
			}
		}
		
		if(typeof variables['grunder']['grunder'][i]['vertreten'] != 'undefined' && variables['grunder']['grunder'][i]['vertreten']){
			vertretung = true;
		}
	}
	
	if(female && singular){
		variables['grunder']['sex'] = 'fs';
	}
	else if(female && !singular){
		variables['grunder']['sex'] = 'fp';
	}
	else if(!female && singular){
		variables['grunder']['sex'] = 'ms';
	}
	else if(!female && !singular){
		variables['grunder']['sex'] = 'mp';
	}

	if(vertretung){
		variables['grunder']['vertretung'] = true;
	}
	else{
		variables['grunder']['vertretung'] = false;
	}
	}
	
, 
	'condition' : function(variable_names){
		if(variable_names[0] == 'grunder'){
			return true;
		}
		else{
			return false;
		}
	}
	});


var step4 = form.add_step({'title' : 'Kapital', 'variable_name' : 'kapital'});
var page = step4.add_page({'title' : 'Kapital', 'variable_name' : 'kapital'});
var text = page.add_text({'label' : 'Stammkapital (CHF)', 'variable_name' : 'stammkapital', 'required' : true, 'tooltip' : "mindestens CHF 20'000.- (Art. 773 OR)."});
var alert_1 = text.add_alert({'condition': function(self, end, index){if(typeof variables['kapital']['kapital']['stammkapital'] != 'undefined' && parseInt(variables['kapital']['kapital']['stammkapital'].replace(/[^0-9]/, '')) < 20000){return true;}else{return false;}}, 'message' : "Das Stammkapital muss mindestens 20'000.- CHF betragen"})
var derived_v_1 = form.add_derived_variable({'assignment': function(){if(typeof variables['kapital']['kapital']['stammkapital'] != 'undefined'){variables['kapital']['kapital']['stammkapital_formatted'] = variables['kapital']['kapital']['stammkapital'].replace(/[^0-9]/, '').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1'") + '.-';}}, 'condition' : function(variable_names){if(variable_names[0] == 'kapital'){return true;}else{return false;}}})
var text = page.add_text({'label' : 'Anzahl Anteile', 'variable_name' : 'anzahl', 'required' : true});
var alert_2 = text.add_alert({'condition': 
	function(self, end, index){
		var sum = 0;
		for(var i = 0; i < variables['grunder']['grunder'].length; i++){
			if(typeof variables['grunder']['grunder'][i]['stammanteile'] == 'undefined'){
				return false;
			}
			else{
				sum = sum + parseInt(variables['grunder']['grunder'][i]['stammanteile']);
			}
		}
		if(end && parseInt(variables['kapital']['kapital']['anzahl']) != sum){
			return true;
		}
		else{
			return false;
		}
	}, 'message' : "Die Anzahl Stammanteile entspricht nicht der Summe der Stammanteile der Gründer"});
var text = page.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'nominalwert', 'disabled' : function(self){return true;}, 'tooltip' : 'mindestens CHF 100.- (Art. 774 Abs. 1 OR).'});
var derived_v_2 = form.add_derived_variable({'assignment' : function(){if(typeof variables['kapital']['kapital']['stammkapital'] != 'undefined' && typeof variables['kapital']['kapital']['anzahl'] != 'undefined'){variables['kapital']['kapital']['nominalwert']=(parseInt(variables['kapital']['kapital']['stammkapital'].replace(/[^0-9]/, ''))/parseInt(variables['kapital']['kapital']['anzahl'].replace(/[^0-9]/, ''))).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1'") + '.-';}},'condition' : function(variable_names){if(variable_names[0] == 'kapital'){return true;}else{return false;}}})
var alert3 = text.add_alert({'condition' : function(self, end, index){if(typeof variables['kapital']['kapital']['stammkapital'] != 'undefined' && typeof variables['kapital']['kapital']['anzahl'] != 'undefined' && (isNaN(parseInt(variables['kapital']['kapital']['nominalwert'])) || parseInt(variables['kapital']['kapital']['nominalwert'].replace(/[^0-9]/, '')) < 100)){return true;}else{return false;}}, 'message' : 'Der Nominalwert muss mindestens CHF 100.- betragen'})
var text = page.add_text({'label' : 'Ausgabebetrag (CHF)', 'variable_name' : 'ausgabebetrag', 'required' : true, 'tooltip' : 'Die Stammanteile müssen mindestens zum Nennwert ausgegeben werden (Art. 774 Abs. 2 OR).'});
var derived_v_3 = form.add_derived_variable({'assignment': function(){if(typeof variables['kapital']['kapital']['ausgabebetrag'] != 'undefined'){variables['kapital']['kapital']['ausgabebetrag_formatted'] = variables['kapital']['kapital']['ausgabebetrag'].replace(/[^0-9]/, '').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1'") + '.-';}}, 'condition' : function(variable_names){if(variable_names[0] == 'kapital'){return true;}else{return false;}}})
var alert4 = text.add_alert({'condition' : function(self, end, index){if(typeof variables['kapital']['kapital']['ausgabebetrag'] != 'undefined' && parseInt(variables['kapital']['kapital']['ausgabebetrag'].replace(/[^0-9]/, '')) < parseInt(variables['kapital']['kapital']['nominalwert'].replace(/[^0-9]/, ''))){return true;}else{return false;}}, 'message' : 'Der Ausgabebetrag muss mindestens dem Nennwert entsprechen'})
var text = page.add_text({'label' : 'Bei Bank zu hinterlegender Liberierungsbetrag (CHF)', 'variable_name' : 'liberierungsbetrag', 'required' : true, 'disabled' : function(self){return true;}});
var derived_v_4 = form.add_derived_variable({'assignment': function(){if(typeof variables['kapital']['kapital']['ausgabebetrag'] != 'undefined' && typeof variables['kapital']['kapital']['anzahl'] != 'undefined'){variables['kapital']['kapital']['liberierungsbetrag'] = (parseInt(variables['kapital']['kapital']['ausgabebetrag'].replace(/[^0-9]/, ''))*parseInt(variables['kapital']['kapital']['anzahl'].replace(/[^0-9]/, ''))).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1'") + '.-';}}, 'condition' : function(variable_names){if(variable_names[0] == 'kapital'){return true;}else{return false;}}})
var text = page.add_text({'label' : 'Hinterlegung bei der:', 'variable_name' : 'firma', 'required' : true, 'placeholder' : 'Firma, Sitzgemeinde'});
var text = page.add_text({'label' : 'Gemäss deren vorliegender schriftlicher Bescheinigung vom:', 'variable_name' : 'datum', 'required' : true, 'placeholder' : 'Datum', 'date' :  function(self){return true;}});

var step5 = form.add_step({'title' : 'Geschäftsführung', 'variable_name' : 'geschaftsfuhrung'});
var page = step5.add_multipage({'title' : 'Geschäftsführer', 'variable_name' : 'geschaftsfuhrer', 'suggestions_model' : grunder_model, 'suggestions_active' : function(self, index){if(typeof variables['geschaftsfuhrung']['geschaftsfuhrer'][index]['name'] == 'undefined' || typeof variables['geschaftsfuhrung']['geschaftsfuhrer'][index]['vorname'] == 'undefined'){return true;}else{return false;}}, 'naming' : function(self, index){if(typeof variables['geschaftsfuhrung']['geschaftsfuhrer'][index]['vorname'] !== 'undefined' && typeof variables['geschaftsfuhrung']['geschaftsfuhrer'][index]['name'] !== 'undefined'){return variables['geschaftsfuhrung']['geschaftsfuhrer'][index]['vorname'] + ' ' + variables['geschaftsfuhrung']['geschaftsfuhrer'][index]['name'];}else{return 'Geschäftsführer ' + parseInt(index + 1);}}});
var radio = page.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr', 'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});
var text = page.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true});
var text = page.add_text({'label' : 'Name', 'variable_name' : 'name', 'required' : true});
var text = page.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum', 'required' : true, 'date' :  function(self){return true;}});
var text = page.add_text({'label' : 'Heimatort', 'variable_name' : 'heimatort', 'required' : true});
var text = page.add_text({'label' : 'Ort', 'variable_name' : 'ort', 'required' : true});

//Render the form
form.render();