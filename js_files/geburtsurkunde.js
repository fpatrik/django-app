form = new Form({'title' : function(){return 'Geburtsurkunde'}});
var step1 = form.add_step({'title':'Angaben', 'variable_name':'angaben'});
var page1 = step1.add_page({'title':'Geschlecht', 'variable_name':'geschlecht'})
var radio = page1.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'junge', 'label' : 'Junge'});
var option = radio.add_option({'value' : 'madchen', 'label' : 'Mädchen'});

var page2 = step1.add_page({'title':'Name', 'variable_name':'name'});

var text = page2.add_text({'label' : 'Name', 'variable_name' : 'name', 'required' : true});

var page3 = step1.add_page({'title':'Geburtsdatum', 'variable_name':'geburtsdatum'});

var text = page3.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum', 'required' : true, 'year' :  function(self){return true;}});

var page = step1.add_multipage({'title' : 'Merkmale', 'variable_name' : 'merkmale', 'naming' : function(self, index){if(typeof variables['angaben']['merkmale'][index]['name'] !== 'undefined'){return variables['angaben']['merkmale'][index]['name'];}else{return 'Merkmal ' + parseInt(index + 1);}}});

var text = page.add_text({'label' : 'Name', 'variable_name' : 'name', 'required' : true});

var textarea = page.add_textarea({'label' : 'Beschreibung', 'variable_name' : 'beschreibung', 'required' : true});

form.render();