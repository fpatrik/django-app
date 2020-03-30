form = new Form({'title' : function(){return "Vollmacht"}});

var step1 = form.add_step({'title':'Firma', 'variable_name':'firma'});

var page1 = step1.add_page({'title':'Firma', 'variable_name':'firma'})

var text = page1.add_text({'label' : 'Name', 'variable_name' : 'name', 'required' : true});

var text = page1.add_text({'label' : 'Übersetzung', 'variable_name' : 'ubersetzung', 'required' : false});

var step1 = form.add_step({'title':'Unterzeichnender', 'variable_name':'unterzeichnender'});
var page1 = step1.add_page({'title':'Personalien', 'variable_name':'personalien'})

var radio = page1.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr', 'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});


var text = page1.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true});

var text = page1.add_text({'label' : 'Nachame', 'variable_name' : 'nachname', 'required' : true});

var text = page1.add_text({'label' : 'Adresse (Strasse, PLZ Gemeinde)', 'variable_name' : 'adresse', 'required' : true});



var checkbox_group = page1.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Ausland', 'variable_name' : 'ausland'});


var text = page1.add_text({'label' : 'Land', 'variable_name' : 'land', 'required' : true, 'show' : function(self){if(typeof variables['unterzeichnender']['personalien']['ausland'] != 'undefined' && variables['unterzeichnender']['personalien']['ausland'] == true){return true;}else{return false;}}});


var step1 = form.add_step({'title':'Bevollmächtigter', 'variable_name':'bevollmachtigter'});
var page1 = step1.add_page({'title':'Personalien', 'variable_name':'personalien'})

var radio = page1.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr', 'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});


var text = page1.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true});

var text = page1.add_text({'label' : 'Nachame', 'variable_name' : 'nachname', 'required' : true});

var text = page1.add_text({'label' : 'Adresse (Strasse, PLZ Gemeinde)', 'variable_name' : 'adresse', 'required' : true});


var checkbox_group = page1.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Ausland', 'variable_name' : 'ausland'});

var text = page1.add_text({'label' : 'Land', 'variable_name' : 'land', 'required' : true, 'show' : function(self){if(typeof variables['bevollmachtigter']['personalien']['ausland'] != 'undefined' && variables['bevollmachtigter']['personalien']['ausland'] == true){return true;}else{return false;}}});

var step1 = form.add_step({'title':'Stammanteile', 'variable_name':'stammanteile'});
var page1 = step1.add_page({'title':'Stammanteile', 'variable_name':'stammanteile'})

var text = page1.add_text({'label' : 'Anzahl', 'variable_name' : 'anzahl', 'required' : true});

var text = page1.add_text({'label' : 'Nennwert', 'variable_name' : 'nennwert', 'required' : true});

var step1 = form.add_step({'title':'Rechtswahl', 'variable_name':'rechtswahl'});
var page1 = step1.add_page({'title':'Rechtswahl', 'variable_name':'rechtswahl'})

var checkbox_group = page1.add_checkbox_group({'label' : 'Rechtwahl'});
var checkbox = checkbox_group.add_checkbox({'label' : 'Rechtswahl anzeigen', 'variable_name' : 'rechtswahl'});

var step1 = form.add_step({'title':'Erlöschungsdatum', 'variable_name':'erloschungsdatum'});
var page1 = step1.add_page({'title':'Erlöschungsdatum', 'variable_name':'erloschungsdatum'})

var text = page1.add_text({'label' : 'Erlöschungsdatum', 'variable_name' : 'erloschungsdatum', 'required' : true, 'date' :  function(self){return true;}});


form.render();