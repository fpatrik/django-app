form = new Form({'title' : function(){return "Personalakte"}});


var step1 = form.add_step({'title':'Angaben', 'variable_name':'angaben'});
var page1 = step1.add_page({'title':'Geschlecht', 'variable_name':'geschlecht'})
var radio = page1.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr', 'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var page2 = step1.add_page({'title':'Name', 'variable_name':'name'});

var text = page2.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true});

var text = page2.add_text({'label' : 'Nachame', 'variable_name' : 'nachname', 'required' : true});

var page3 = step1.add_page({'title':'Geburtsdatum', 'variable_name':'geburtsdatum'});

var text = page3.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum', 'required' : true, 'year' :  function(self){return true;}});

var page4 = step1.add_page({'title':'Nationalität', 'variable_name':'nationalitat'});

var text = page4.add_text({'label' : 'Nationalität', 'variable_name' : 'nationalitat', 'required' : true});

var page = step1.add_multipage({'title' : 'Meilenstein', 'variable_name' : 'lebenslauf', 'naming' : function(self, index){if(typeof variables['angaben']['lebenslauf'][index]['titel'] !== 'undefined'){return variables['angaben']['lebenslauf'][index]['titel'];}else{return 'Meilenstein ' + parseInt(index + 1);}}});

var text = page.add_text({'label' : 'Titel', 'variable_name' : 'titel', 'required' : true});

var textarea = page.add_textarea({'label' : 'Beschreibung', 'variable_name' : 'beschreibung', 'required' : true});

var text = page.add_text({'label' : 'Beginn', 'variable_name' : 'beginn', 'required' : true, 'year' :  function(self){return true;}});

var text = page.add_text({'label' : 'Ende', 'variable_name' : 'ende', 'required' : true, 'year' :  function(self){return true;}});

form.render();