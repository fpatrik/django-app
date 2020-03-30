/**
 * Created by pigu on 05.10.17.
 */

//Configure nunjucks
nunjucks.configure({ autoescape: true });

//Define variables
// variables = {};

function get_by_uid(q){
    var xmlHttp = new XMLHttpRequest();
    //xmlHttp.open("GET", 'https://app.conventec.ch/api?t=uid&q=' + q, false);
    xmlHttp.open("GET", 'http://127.0.0.1:8000/api?t=uid&q=' + q, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}


//get options
function api_get_options(q){
    var xmlHttp = new XMLHttpRequest();
    //xmlHttp.open("GET", 'https://app.conventec.ch/api?t=address&q=' + q, false);
    xmlHttp.open("GET", 'http://127.0.0.1:8000/api?t=address&q=' + q, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}


//get selection
function api_get_selection(q){
    var xmlHttp = new XMLHttpRequest();
    //xmlHttp.open("GET", 'https://app.conventec.ch/api?t=coords&q=' + q, false);
    xmlHttp.open("GET", 'http://127.0.0.1:8000/api?t=coords&q=' + q, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

//API options
api = {'query' : '', 'options' : [], 'message' : {'message' : 'Bitte Adresse eingeben.', 'type' : 'info'}, 
       'get_options' : function(q){
    	   api.options = [];
    	   api.message.type = 'info';
    	   api.message.message = 'Bitte warten...';
    	   form.render();
    	   var result = JSON.parse(api_get_options(q));
    	   if(result.results.length > 0){
    		   for(var i = 0; i < result.results.length; i++){
    			   api.options.push([result.results[i].name, result.results[i].coords]);
    		   }
    		   api.message.message = '';
    	   }
    	   else{
    		   api.message.type = 'danger';
    		   api.message.message = 'Keine Resultate';
    	   }
    	   form.render();
}, 
       'get_selection' : function(q){
    	   api.options = [];
    	   api.message.type = 'info';
    	   api.message.message = 'Bitte warten...';
    	   form.render();
    	   var result = JSON.parse(api_get_selection(q).toString());
    	   if(Object.keys(result).length == 2){
    		   api.message.type = 'success';
    		   api.message.message = 'Daten erfolgreich übernommen';
    		   variables['kaufobjekt']['angaben']['flurname'] = result.infos.flurname;
               variables['kaufobjekt']['angaben']['liegenschaft'] = result.infos.grundstuck;
               variables['kaufobjekt']['angaben']['grundbuch'] = result.infos.grundbuch;
               variables['kaufobjekt']['angaben']['gemeinde'] = result.infos.grundbuch.split(' ').slice(2).join(' ');
               
               var flachen = 'Gesamtfläche: ' + result.infos.flachen.totalArea.toString() + ' m²; ';
               for(var i = 0; i < result.infos.flachen.assek.length; i++){
    			   flachen += result.infos.flachen.assek[i].description + ' [' + result.infos.flachen.assek[i].area + '], ';
    		   }
               for(var i = 0; i < result.infos.flachen.other.length; i++){
    			   flachen += result.infos.flachen.other[i].description + ' [' + result.infos.flachen.other[i].area + '], ';
    		   }
               
               variables['kaufobjekt']['angaben']['flache'] = flachen.substring(0, flachen.length - 2);
               
               if('uid' in result.eigentumer[0]){
                    var firm = JSON.parse(get_by_uid(result.eigentumer[0]['uid'].replace(/[^0-9]/g, '')))
                    console.log(firm)
                    variables['parteien']['verkaufer']['firma'] = firm.data.name
                    variables['parteien']['verkaufer']['ubersetzung_1'] = firm.data.translation || ''
                    variables['parteien']['verkaufer']['che'] = 'CHE-' + firm.data.uid.substring(0, 3) + '.' + firm.data.uid.substring(3, 6) + '.' + firm.data.uid.substring(6, 9)
                    
                    variables['parteien']['verkaufer']['buros'] = 'eigene'
                    
                    variables['parteien']['verkaufer']['strasse'] = firm.data.address.addressInformation.street + ' ' + firm.data.address.addressInformation.houseNumber
                    variables['parteien']['verkaufer']['plz'] = firm.data.address.addressInformation.swissZipCode
                    variables['parteien']['verkaufer']['sitzgemeinde'] = firm.data.address.addressInformation.town
                    variables['parteien']['verkaufer']['staat'] = 'Schweiz'
                        
                }
    		   
    	   }
    	   else{
    		   api.message.type = 'danger';
    		   api.message.message = 'Daten konnten nicht geladen werden';
    	   }
    	   
    	   form.render();
       }
};

//Set current page
navigation = {'step' : 0, 'page' : 0, 'multipage' : {'overview' : true, 'instance' : 0}, 'end' : false};

function convert_date(datum){
    var output = datum
    var replacements = [['.',''], ['Januar', 'January'],['Februar', 'February'],['März', 'March'],['Mai', 'May'], ['Juni', 'June'],['Juli', 'July'], ['Oktober', 'October'], ['Dezember', 'December']]
    
    for(var i = 0; i<replacements.length; i++){
       output = output.replace(replacements[i][0], replacements[i][1])
    }
    
    return output
}

function parse_vorsitzender(vorsitzender){
    //remove brackets
    var string = vorsitzender.substring(1, vorsitzender.length-1)
    var temp = string.replace(/ /g,'').split(',')
    temp[2] = parseInt(temp[2])
    return temp
}


form = new Form({'title' : function(){return 'Grundstückkaufvertrag (unter juristischen Personen)'}, 'debug' : true});

var step000 = form.add_step({'title':'Allgemeines', 'variable_name':'allgemeines'});

var page1 = step000.add_page({'title':'Allgemeines', 'variable_name':'allgemeines'});

var text = page1.add_text({'label' : 'Datum des Kaufvertrages', 'variable_name' : 'datum', 'required' : true, 'date' : true});

var step0 = form.add_step({'title':'Kaufobjekt', 'variable_name':'kaufobjekt'});

var page1 = step0.add_page({'title':'Kaufobjekt suchen', 'variable_name':'suchen'});

var radio = page1.add_apiselect({'title' : 'Kaufobjekt suchen', 'label' : 'Nach Adresse / EGRID Nummer suchen'});

var page2 = step0.add_page({'title':'Angaben', 'variable_name':'angaben'});

var text = page2.add_text({'label' : 'Gemeinde', 'variable_name' : 'gemeinde', 'required' : true});

var label = page2.add_label({'label' : 'Bezeichnung', 'font_size' : function(self){return '16'}});

var text = page2.add_text({'label' : 'Grundbuch', 'variable_name' : 'grundbuch', 'required' : true});
var text = page2.add_text({'label' : 'Liegenschaft', 'variable_name' : 'liegenschaft', 'required' : true});
var text = page2.add_text({'label' : 'Flurname', 'variable_name' : 'flurname', 'required' : true});

var textarea = page2.add_textarea({'label' : 'Fläche(n)', 'variable_name' : 'flache'});

var textarea = page2.add_textarea({'label' : 'Grundpfandrechte', 'variable_name' : 'grundpfandrechte'});


var step1 = form.add_step({'title':'Parteien', 'variable_name':'parteien'});

var page1 = step1.add_page({'title':'Verkäufer', 'variable_name':'verkaufer'});

var text = page1.add_text({'label' : 'Firma', 'variable_name' : 'firma', 'required' : true});

var text = page1.add_text({'label' : 'Übersetzung der Firma 1', 'variable_name' : 'ubersetzung_1', 'placeholder' : 'Optional'});
var text = page1.add_text({'label' : 'Übersetzung der Firma 2', 'variable_name' : 'ubersetzung_2', 'placeholder' : 'Optional'});

var text = page1.add_text({'label' : 'Unternehmensidentifikationsnummer', 'variable_name' : 'che', 'placeholder' : ''});


var radio = page1.add_radio({'variable_name' : 'buros', 'required' : true});
var option = radio.add_option({'value' : 'eigene', 'label' : 'Eigenes Domizil am Sitz'});
var option = radio.add_option({'value' : 'keine', 'label' : 'Keine eigenes Domizil am Sitz'});

var separator = page1.add_separator({'show' : function(){if(typeof variables['parteien']['verkaufer']['buros'] != 'undefined'){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'required' : true, 'show' : function(){if(equals(['parteien', 'verkaufer', 'buros'], 'eigene')){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'PLZ', 'variable_name' : 'plz', 'required' : true, 'show' : function(){if(equals(['parteien', 'verkaufer', 'buros'], 'eigene')){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Sitzgemeinde', 'variable_name' : 'sitzgemeinde', 'required' : true, 'show' : function(){if(equals(['parteien', 'verkaufer', 'buros'], 'eigene')){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Staat', 'variable_name' : 'staat', 'required' : true, 'show' : function(){if(equals(['parteien', 'verkaufer', 'buros'], 'eigene')){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'c/o Name/Firma', 'variable_name' : 'name', 'required' : true, 'show' : function(){if(equals(['parteien', 'verkaufer', 'buros'], 'keine')){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'required' : true, 'show' : function(){if(equals(['parteien', 'verkaufer', 'buros'], 'keine')){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'PLZ', 'variable_name' : 'plz', 'required' : true, 'show' : function(){if(equals(['parteien', 'verkaufer', 'buros'], 'keine')){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Sitzgemeinde', 'variable_name' : 'sitzgemeinde', 'required' : true, 'show' : function(){if(equals(['parteien', 'verkaufer', 'buros'], 'keine')){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Staat', 'variable_name' : 'staat', 'required' : true, 'show' : function(){if(equals(['parteien', 'verkaufer', 'buros'], 'keine')){return true;}else{return false;}}});

var label = page1.add_label({'label' : 'Vertreter der Rechtseinheit bei Vertragsabschluss', 'font_size' : function(self){return '18'}});

var radio = page1.add_radio({'label' : '', 'variable_name' : 'vertretung', 'required' : true});
var option = radio.add_option({'value' : 'mitglied', 'label' : 'Mitglied eines Organs der Gesellschaft (entsprechend dessen Zeichnungsberechtigung)'});
var option = radio.add_option({'value' : 'n_mitglied', 'label' : 'Nicht Mitglied eines Organs der Gesellschaft, oder Mitglied eines Organs der Gesellschaft mit Vollmacht'});

var separator = page1.add_separator({});

// V Mitglied eines Organs der Gesellschaft #####################################################################################

var radio = page1.add_radio({'variable_name' : 'sex_v', 'required' : true, 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied')}});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page1.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true, 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied')}});
var text = page1.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true, 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied')}});
var text = page1.add_text({'label' : 'Titel', 'variable_name' : 'titel', 'placeholder' : 'Optional', 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied')}});

var text = page1.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum', 'year' : true, 'required' : true, 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied')}});

var separator = page1.add_separator({'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied')}})

var text = page1.add_text({'label' : 'Funktion', 'variable_name' : 'funktion', 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied')}});

var text = page1.add_text({'label' : 'Zeichnungsberechtigung', 'variable_name' : 'zeichnung', 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied')}});



var separator = page1.add_separator({'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied')}})

var radio = page1.add_radio({'variable_name' : 'staatsburger', 'required' : true, 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied')}});
var option = radio.add_option({'value' : 'schweizer', 'label' : 'Schweizer Staatsbürger'});
var option = radio.add_option({'value' : 'auslandischer', 'label' : 'Ausländischer Staatsbürger'});

var text = page1.add_text({'label' : 'Heimatort', 'variable_name' : 'heimatort', 'required' : true, 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied') && equals(['parteien', 'verkaufer', 'staatsburger'], 'schweizer')}});
var text = page1.add_text({'label' : 'Staatsangehörige/r', 'variable_name' : 'staatsangehorige', 'required' : true, 'placeholder' : 'z.B. deutsche/r', 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied') && equals(['parteien', 'verkaufer', 'staatsburger'], 'auslandischer')}});

var separator = page1.add_separator({'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied')}})

var label = page1.add_label({'label' : 'Wohnsitzadresse','show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied')}});

var text = page1.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse_v', 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied')}});
var text = page1.add_text({'label' : 'PLZ, Ort', 'variable_name' : 'plz_ort_v', 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied')}});
var text = page1.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel_v', 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'mitglied') && equals(['parteien', 'verkaufer', 'vertretung'], 'auslandischer')}});


// V Nicht Mitglied eines Organs der Gesellschaft, oder Mitglied eines Organs der Gesellschaft mit Vollmacht ############


var radio = page1.add_radio({'variable_name' : 'sex_v', 'required' : true, 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied')}});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page1.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true, 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied')}});
var text = page1.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true, 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied')}});
var text = page1.add_text({'label' : 'Titel', 'variable_name' : 'titel', 'placeholder' : 'Optional', 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied')}});

var text = page1.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum', 'year' : true, 'required' : true, 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied')}});

var separator = page1.add_separator({'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied')}})

var radio = page1.add_radio({'variable_name' : 'staatsburger', 'required' : true, 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied')}});
var option = radio.add_option({'value' : 'schweizer', 'label' : 'Schweizer Staatsbürger'});
var option = radio.add_option({'value' : 'auslandischer', 'label' : 'Ausländischer Staatsbürger'});

var text = page1.add_text({'label' : 'Heimatort', 'variable_name' : 'heimatort', 'required' : true, 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied') && equals(['parteien', 'verkaufer', 'staatsburger'], 'schweizer')}});

var text = page1.add_text({'label' : 'Staatsangehörige/r', 'variable_name' : 'staatsangehorige', 'required' : true, 'placeholder' : 'z.B. deutsche/r', 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied') && equals(['parteien', 'verkaufer', 'staatsburger'], 'auslandischer')}});

var separator = page1.add_separator({'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied')}})

var label = page1.add_label({'label' : 'Wohnsitzadresse','show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied')}});

var text = page1.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse_v', 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied')}});
var text = page1.add_text({'label' : 'PLZ, Ort', 'variable_name' : 'plz_ort_v', 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied')}});
var text = page1.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel_v', 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied') && equals(['parteien', 'verkaufer', 'vertretung'], 'auslandischer')}});

var separator = page1.add_separator({'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied')}})

var label = page1.add_label({'label' : 'Vollmacht','show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied')}});

var text = page1.add_text({'label' : 'Datum der Vollmacht', 'variable_name' : 'datum_vollmacht', 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied')}, 'date' : true});

var radio = page1.add_radio({'variable_name' : 'beglaubigung', 'required' : true, 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied')}, 'date' : true});
var option = radio.add_option({'value' : 'schweiz', 'label' : 'Beglaubigung in der Schweiz'});
var option = radio.add_option({'value' : 'ausland', 'label' : 'Beglaubigung im Ausland'});

var separator = page1.add_separator({'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied') && equals(['parteien', 'verkaufer', 'vertretung'], 'ausland')}})

var radio = page1.add_radio({'variable_name' : 'beglaubigung_art', 'required' : true, 'show': function(self, index){return equals(['parteien', 'verkaufer', 'vertretung'], 'n_mitglied')  && equals(['parteien', 'verkaufer', 'beglaubigung'], 'ausland')}, 'date' : true});
var option = radio.add_option({'value' : 'apostille', 'label' : 'Beglaubigung im Ausland mit Apostille'});
var option = radio.add_option({'value' : 'uberbeglaubigung', 'label' : 'Beglaubigung im Ausland mit Überbeglaubigung'});


// Käufer

var page2 = step1.add_page({'title':'Käufer', 'variable_name':'kaufer'});

var text = page2.add_text({'label' : 'Firma', 'variable_name' : 'firma', 'required' : true});

var text = page2.add_text({'label' : 'Übersetzung der Firma 1', 'variable_name' : 'ubersetzung_1', 'placeholder' : 'Optional'});
var text = page2.add_text({'label' : 'Übersetzung der Firma 2', 'variable_name' : 'ubersetzung_2', 'placeholder' : 'Optional'});

var text = page2.add_text({'label' : 'Unternehmensidentifikationsnummer', 'variable_name' : 'che', 'placeholder' : ''});


var radio = page2.add_radio({'variable_name' : 'buros', 'required' : true});
var option = radio.add_option({'value' : 'eigene', 'label' : 'Eigenes Domizil am Sitz'});
var option = radio.add_option({'value' : 'keine', 'label' : 'Keine eigenes Domizil am Sitz'});

var separator = page2.add_separator({'show' : function(){if(typeof variables['parteien']['kaufer']['buros'] != 'undefined'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'required' : true, 'show' : function(){if(equals(['parteien', 'kaufer', 'buros'], 'eigene')){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'PLZ', 'variable_name' : 'plz', 'required' : true, 'show' : function(){if(equals(['parteien', 'kaufer', 'buros'], 'eigene')){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Sitzgemeinde', 'variable_name' : 'sitzgemeinde', 'required' : true, 'show' : function(){if(equals(['parteien', 'kaufer', 'buros'], 'eigene')){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Staat', 'variable_name' : 'staat', 'required' : true, 'show' : function(){if(equals(['parteien', 'kaufer', 'buros'], 'eigene')){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'c/o Name/Firma', 'variable_name' : 'name', 'required' : true, 'show' : function(){if(equals(['parteien', 'kaufer', 'buros'], 'keine')){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'required' : true, 'show' : function(){if(equals(['parteien', 'kaufer', 'buros'], 'keine')){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'PLZ', 'variable_name' : 'plz', 'required' : true, 'show' : function(){if(equals(['parteien', 'kaufer', 'buros'], 'keine')){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Sitzgemeinde', 'variable_name' : 'sitzgemeinde', 'required' : true, 'show' : function(){if(equals(['parteien', 'kaufer', 'buros'], 'keine')){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Staat', 'variable_name' : 'staat', 'required' : true, 'show' : function(){if(equals(['parteien', 'kaufer', 'buros'], 'keine')){return true;}else{return false;}}});

var label = page2.add_label({'label' : 'Vertreter der Rechtseinheit bei Vertragsabschluss', 'font_size' : function(self){return '18'}});

var radio = page2.add_radio({'label' : '', 'variable_name' : 'vertretung', 'required' : true});
var option = radio.add_option({'value' : 'mitglied', 'label' : 'Mitglied eines Organs der Gesellschaft (entsprechend dessen Zeichnungsberechtigung)'});
var option = radio.add_option({'value' : 'n_mitglied', 'label' : 'Nicht Mitglied eines Organs der Gesellschaft, oder Mitglied eines Organs der Gesellschaft mit Vollmacht'});

var separator = page2.add_separator({});

// V Mitglied eines Organs der Gesellschaft #####################################################################################

var radio = page2.add_radio({'variable_name' : 'sex_v', 'required' : true, 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied')}});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page2.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true, 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied')}});
var text = page2.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true, 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied')}});
var text = page2.add_text({'label' : 'Titel', 'variable_name' : 'titel', 'placeholder' : 'Optional', 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied')}});

var text = page2.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum', 'year' : true, 'required' : true, 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied')}});

var separator = page2.add_separator({'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied')}})

var text = page2.add_text({'label' : 'Funktion', 'variable_name' : 'funktion', 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied')}});

var text = page2.add_text({'label' : 'Zeichnungsberechtigung', 'variable_name' : 'zeichnung', 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied')}});



var separator = page2.add_separator({'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied')}})

var radio = page2.add_radio({'variable_name' : 'staatsburger', 'required' : true, 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied')}});
var option = radio.add_option({'value' : 'schweizer', 'label' : 'Schweizer Staatsbürger'});
var option = radio.add_option({'value' : 'auslandischer', 'label' : 'Ausländischer Staatsbürger'});

var text = page2.add_text({'label' : 'Heimatort', 'variable_name' : 'heimatort', 'required' : true, 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied') && equals(['parteien', 'kaufer', 'staatsburger'], 'schweizer')}});
var text = page2.add_text({'label' : 'Staatsangehörige/r', 'variable_name' : 'staatsangehorige', 'required' : true, 'placeholder' : 'z.B. deutsche/r', 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied') && equals(['parteien', 'kaufer', 'staatsburger'], 'auslandischer')}});

var separator = page2.add_separator({'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied')}})

var label = page2.add_label({'label' : 'Wohnsitzadresse','show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied')}});

var text = page2.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse_v', 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied')}});
var text = page2.add_text({'label' : 'PLZ, Ort', 'variable_name' : 'plz_ort_v', 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied')}});
var text = page2.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel_v', 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'mitglied') && equals(['parteien', 'kaufer', 'vertretung'], 'auslandischer')}});


// V Nicht Mitglied eines Organs der Gesellschaft, oder Mitglied eines Organs der Gesellschaft mit Vollmacht ############


var radio = page2.add_radio({'variable_name' : 'sex_v', 'required' : true, 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied')}});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page2.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true, 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied')}});
var text = page2.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true, 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied')}});
var text = page2.add_text({'label' : 'Titel', 'variable_name' : 'titel', 'placeholder' : 'Optional', 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied')}});

var text = page2.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum', 'year' : true, 'required' : true, 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied')}});

var separator = page2.add_separator({'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied')}})

var radio = page2.add_radio({'variable_name' : 'staatsburger', 'required' : true, 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied')}});
var option = radio.add_option({'value' : 'schweizer', 'label' : 'Schweizer Staatsbürger'});
var option = radio.add_option({'value' : 'auslandischer', 'label' : 'Ausländischer Staatsbürger'});

var text = page2.add_text({'label' : 'Heimatort', 'variable_name' : 'heimatort', 'required' : true, 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied') && equals(['parteien', 'kaufer', 'staatsburger'], 'schweizer')}});

var text = page2.add_text({'label' : 'Staatsangehörige/r', 'variable_name' : 'staatsangehorige', 'required' : true, 'placeholder' : 'z.B. deutsche/r', 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied') && equals(['parteien', 'kaufer', 'staatsburger'], 'auslandischer')}});

var separator = page2.add_separator({'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied')}})

var label = page2.add_label({'label' : 'Wohnsitzadresse','show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied')}});

var text = page2.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse_v', 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied')}});
var text = page2.add_text({'label' : 'PLZ, Ort', 'variable_name' : 'plz_ort_v', 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied')}});
var text = page2.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel_v', 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied') && equals(['parteien', 'kaufer', 'vertretung'], 'auslandischer')}});

var separator = page2.add_separator({'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied')}})

var label = page2.add_label({'label' : 'Vollmacht','show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied')}});

var text = page2.add_text({'label' : 'Datum der Vollmacht', 'variable_name' : 'datum_vollmacht', 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied')}, 'date' : true});

var radio = page2.add_radio({'variable_name' : 'beglaubigung', 'required' : true, 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied')}, 'date' : true});
var option = radio.add_option({'value' : 'schweiz', 'label' : 'Beglaubigung in der Schweiz'});
var option = radio.add_option({'value' : 'ausland', 'label' : 'Beglaubigung im Ausland'});

var separator = page2.add_separator({'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied') && equals(['parteien', 'kaufer', 'vertretung'], 'ausland')}})

var radio = page2.add_radio({'variable_name' : 'beglaubigung_art', 'required' : true, 'show': function(self, index){return equals(['parteien', 'kaufer', 'vertretung'], 'n_mitglied')  && equals(['parteien', 'kaufer', 'beglaubigung'], 'ausland')}, 'date' : true});
var option = radio.add_option({'value' : 'apostille', 'label' : 'Beglaubigung im Ausland mit Apostille'});
var option = radio.add_option({'value' : 'uberbeglaubigung', 'label' : 'Beglaubigung im Ausland mit Überbeglaubigung'});

// Kaufpreis
var step2 = form.add_step({'title':'Kaufpreis', 'variable_name':'kaufpreis'});

var page1 = step2.add_page({'title':'Kaufpreis', 'variable_name':'kaufpreis'});

var text = page1.add_text({'label' : 'Kaufpreis (CHF)', 'variable_name' : 'kaufpreis'});

var page2 = step2.add_page({'title':'Zahlungsmodalitäten', 'variable_name':'zahlungsmodalitaten'});

var radio = page2.add_radio({'variable_name' : 'zahlungsmodalitaten', 'required' : true});
var option = radio.add_option({'value' : 'einmal', 'label' : 'Einmalzahlung'});
var option = radio.add_option({'value' : 'tranchen', 'label' : 'Tranchen'});

var text = page2.add_text({'label' : 'Zeitpunkt Zahlung des Kaufpreis (Anzahl Tage nach Grundbucheintrag)', 'variable_name' : 'zeitpunkt', 'show': function(self, index){return equals(['kaufpreis', 'zahlungsmodalitaten', 'zahlungsmodalitaten'], 'einmal')}});

var text = page2.add_text({'label' : 'Für Bezug der Grundstückgewinnsteuer zuständiges Gemeinwesen', 'variable_name' : 'gemeinwesen', 'show': function(self, index){return equals(['kaufpreis', 'zahlungsmodalitaten', 'zahlungsmodalitaten'], 'tranchen')}});

var text = page2.add_text({'label' : 'Betrag (CHF), welchen der Käufer Valutadatum öffentliche Beurkundung bezahlt', 'variable_name' : 'betrag_beurkundung', 'show': function(self, index){return equals(['kaufpreis', 'zahlungsmodalitaten', 'zahlungsmodalitaten'], 'tranchen')}});

var text = page2.add_text({'label' : 'Betrag (CHF), welchen der Käufer dem Grundsteueramt zur Sicherstellung der Grundstückgewinnsteuer direkt bezahlt', 'variable_name' : 'betrag_grundsteueramt', 'show': function(self, index){return equals(['kaufpreis', 'zahlungsmodalitaten', 'zahlungsmodalitaten'], 'tranchen')}});

var text = page2.add_text({'label' : 'Betrag (CHF), welchen der Käufer Valutadatum Eigentumsübertragung bezahlt', 'variable_name' : 'betrag_eigentum', 'show': function(self, index){return equals(['kaufpreis', 'zahlungsmodalitaten', 'zahlungsmodalitaten'], 'tranchen')}});

var page3 = step2.add_page({'title': 'Überweisungskonto des Verkäufers', 'variable_name': 'konto_verkaufer' });

var text = page3.add_text({'label' : 'IBAN', 'variable_name' : 'iban'});
var text = page3.add_text({'label' : 'Bankinstitut, Sitz', 'variable_name' : 'institut'});
var text = page3.add_text({'label' : 'Bezeichnung des Kontoinhabers', 'variable_name' : 'inhaber'});

var page4 = step2.add_page({'title': 'Überweisungskonto Grundsteueramt', 'variable_name': 'konto_grund' });

var text = page4.add_text({'label' : 'IBAN', 'variable_name' : 'iban'});
var text = page4.add_text({'label' : 'Bankinstitut, Sitz', 'variable_name' : 'institut'});
var text = page4.add_text({'label' : 'Bezeichnung des Kontoinhabers', 'variable_name' : 'inhaber'});

// Weitere Vertragsbestimmungen
var step3 = form.add_step({'title' : 'Weitere Vertragsbestimmungen', 'variable_name' : 'vertragsbestimmungen'});

var page1 = step3.add_page({'title':'Besitzesantritt, Eigentumsübertragung', 'variable_name':'besitzesantritt'});

var radio = page1.add_radio({'variable_name' : 'besitzesantritt', 'required' : true});
var option = radio.add_option({'value' : 'eigentumsubertragung', 'label' : 'Mit Eigentumsübertragung'});
var option = radio.add_option({'value' : 'baubewilligung', 'label' : 'Baubewilligung massgebend'});
var option = radio.add_option({'value' : 'fix', 'label' : 'Fixer Tag nach Vertragsabschluss'});

var separator = page1.add_separator({'show': function(self, index){return equals(['vertragsbestimmungen', 'besitzesantritt', 'besitzesantritt'], 'baubewilligung') || equals(['vertragsbestimmungen', 'besitzesantritt', 'besitzesantritt'], 'fix')}})

var text = page1.add_text({'label' : 'Zeitraum, innert welchem die Eigentumsübertragung nach Erteilung Baubewilligung zu erfolgen hat (Anzahl Monate)', 'variable_name' : 'monate', 'show': function(self, index){return equals(['vertragsbestimmungen', 'besitzesantritt', 'besitzesantritt'], 'baubewilligung')}});

var text = page1.add_text({'label' : 'Absolut spätester Zeitpunkt', 'variable_name' : 'zeitpunkt', 'show': function(self, index){return equals(['vertragsbestimmungen', 'besitzesantritt', 'besitzesantritt'], 'baubewilligung')}, 'date' : true});

var text = page1.add_text({'label' : 'Spätester Zeitpunkt, an welchem der Käufer ein Baubewilligungsgesuch einzureichen hat', 'variable_name' : 'zeitpunkt_baubewilligung', 'show': function(self, index){return equals(['vertragsbestimmungen', 'besitzesantritt', 'besitzesantritt'], 'baubewilligung')}, 'date' : true});


var text = page1.add_text({'label' : 'Fixer Tag', 'variable_name' : 'fixer_tag', 'show': function(self, index){return equals(['vertragsbestimmungen', 'besitzesantritt', 'besitzesantritt'], 'fix')}, 'date' : true});

var text = page1.add_text({'label' : 'Anzahl Tage nach Grundbucheintrag', 'variable_name' : 'tage_grundbucheintrag', 'show': function(self, index){return equals(['vertragsbestimmungen', 'besitzesantritt', 'besitzesantritt'], 'fix')}});

var page2 = step3.add_page({'title':'Gewährleistung', 'variable_name':'gewahrleistung'});

var text = page2.add_text({'label' : 'Altlasten: Betrag bis zu welchem der Käufer Kosten von Untersuchungen, Behandlung und Entsorgung trägt (CHF)', 'variable_name' : 'altlasten'});

var page3 = step3.add_page({'title':'Gebühren, Steuern', 'variable_name':'gebuhren', 'show': function(self, index){return equals(['kaufpreis', 'zahlungsmodalitaten', 'zahlungsmodalitaten'], 'tranchen')}});

var text = page3.add_text({'label' : 'Mutmasslicher Betrag der Grundstückgewinnsteuer (CHF) gemäss Berechnung des Grundsteueramtes', 'variable_name' : 'grundstuckgewinnsteuer'});

var text = page3.add_text({'label' : 'Datum Schreiben Grundsteueramt', 'variable_name' : 'datum', 'date': true});

var step4 = form.add_step({'title' : 'Schlussbestimmungen', 'variable_name' : 'schlussbestimmungen'});

var page1 = step4.add_page({'title':'Ausfertigung', 'variable_name':'ausfertigung'});

var text = page1.add_text({'label' : 'Zuständiges Grundbuchamt', 'variable_name' : 'grundbuchamt'});

form.render();