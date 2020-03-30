/**
 * Created by pigu on 05.10.17.
 */

//Configure nunjucks
nunjucks.configure({ autoescape: true });

//Define variables
variables = {};

//get options
function api_get_options(q){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'http://127.0.0.1:8000/api?t=search&q=' + q, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

//get selection
function api_get_selection(q){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", 'http://127.0.0.1:8000/api?t=uid&q=' + q, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}

//Shares
shares = {'namen_stamm' : {'value' : 0}, 
		   'namen_vorzug_1' : {'name' : '', 'value' : 0},
		   'namen_vorzug_2' : {'name' : '', 'value' : 0},
		   'namen_vorzug_3' : {'name' : '', 'value' : 0},
		   'namen_stimm' : {'value' : 0},
		   'inhaber_stamm' : {'value' : 0}, 
		   'inhaber_vorzug_1' : {'name' : '', 'value' : 0},
		   'inhaber_vorzug_2' : {'name' : '', 'value' : 0},
		   'inhaber_vorzug_3' : {'name' : '', 'value' : 0}
		   };

//API options
api = {'query' : '', 'options' : [], 'chose_only' : '3', 'message' : {'message' : 'Bitte Firmenname eingeben.', 'type' : 'info'}, 
       'get_options' : function(q){
    	   api.options = [];
    	   api.message.type = 'info';
    	   api.message.message = 'Bitte warten...';
    	   form.render();
    	   var result = JSON.parse(api_get_options(q));
    	   if(result.status == 'success'){
    		   for(var i = 0; i < result.data.length; i++){
    			     api.options.push([result.data[i].name + ' (in ' + result.data[i].legalSeat + ')', result.data[i].uid, result.data[i].legalFormId]);
    		   }
    		   api.message.message = '';
               
    	   }
    	   else{
    		   api.message.type = 'danger';
    		   api.message.message = result.message;
    	   }
    	   form.render();
}, 
       'get_selection' : function(q){
    	   api.options = [];
    	   api.message.type = 'info';
    	   api.message.message = 'Bitte warten...';
    	   form.render();
    	   var result = JSON.parse(api_get_selection(q));
    	   if(result.status == 'success'){
    		   api.message.type = 'success';
    		   api.message.message = 'Daten erfolgreich übernommen';
               var data = result.data;
    		   variables['angaben']['firma']['firma'] = data.name;
               if(typeof data.translation != 'undefined'){
                   variables['angaben']['firma']['ubersetzung_1'] = data.translation;
               }
               variables['angaben']['firma']['che'] = 'CHE-' + data.uid.substring(0,3) + '.' + data.uid.substring(3,6) + '.' + data.uid.substring(6,9);
               variables['angaben']['firma']['sitzgemeinde'] = data.legalSeat;
               
               // c/o adresse
               if(typeof data.address.addressInformation.addressLine2 != 'undefined'){
                   variables['angaben']['rechtsdomizil']['buros'] = 'keine';
                   variables['angaben']['rechtsdomizil']['strasse'] = data.address.addressInformation.street + ' ' + data.address.addressInformation.houseNumber;
                   variables['angaben']['rechtsdomizil']['plz_de'] = data.address.addressInformation.swissZipCode + ' ' + data.address.addressInformation.town;
                   variables['angaben']['rechtsdomizil']['plz_en'] = data.address.addressInformation.swissZipCode + ' ' + data.address.addressInformation.town;
                   
                   if(data.address.addressInformation.country == 'CH'){
                	   variables['angaben']['rechtsdomizil']['land_de'] = 'Schweiz';
                	   variables['angaben']['rechtsdomizil']['land_en'] = 'Switzerland';
                   }
                   
                   var address2 = data.address.addressInformation.addressLine2;
                   if(address2.indexOf('GmbH') != -1 || address2.indexOf('AG') != -1){
                       variables['angaben']['rechtsdomizil']['domizil_bei'] = 'unternehmung';
                       variables['angaben']['rechtsdomizil']['firma'] = address2.substring(4);
                   }
                   else{
                       variables['angaben']['rechtsdomizil']['domizil_bei'] = 'einzelperson';
                       variables['angaben']['rechtsdomizil']['vorname'] = address2.substring(4, address2.lastIndexOf(" "));
                       variables['angaben']['rechtsdomizil']['nachname'] = address2.substring( address2.lastIndexOf(" ") + 1);
                   }
               }
               // eigene buros
                else{
                   variables['angaben']['rechtsdomizil']['buros'] = 'eigene';
                   variables['angaben']['rechtsdomizil']['strasse'] = data.address.addressInformation.street + ' ' + data.address.addressInformation.houseNumber;
                   variables['angaben']['rechtsdomizil']['plz_de'] = data.address.addressInformation.swissZipCode + ' ' + data.address.addressInformation.town;
                   variables['angaben']['rechtsdomizil']['plz_en'] = data.address.addressInformation.swissZipCode + ' ' + data.address.addressInformation.town;
                   
                   if(data.address.addressInformation.country == 'CH'){
                	   variables['angaben']['rechtsdomizil']['land_de'] = 'Schweiz';
                	   variables['angaben']['rechtsdomizil']['land_en'] = 'Switzerland';
                   }
               }
               if(data.purpose.indexOf('Die Gesellschaft kann') != -1){
                    variables['angaben']['zweck']['zweck'] = data.purpose.substring(0, data.purpose.indexOf('Die Gesellschaft kann') - 1);
               }
               else if(data.purpose.indexOf(' die Gesellschaft kann') != -1){
            	   variables['angaben']['zweck']['zweck'] = data.purpose.substring(0, data.purpose.indexOf(' die Gesellschaft kann') - 1) + '.';
               }
                else{
                    variables['angaben']['zweck']['zweck'] = data.purpose;
                }
               
               if(typeof data.revision[0] != 'undefined'){
                   variables['bisherige_revisionsstelle']['bisherige_revisionsstelle']['typ'] = 'gesellschaft';
                   variables['bisherige_revisionsstelle']['bisherige_revisionsstelle']['firma'] = data.revision[0].name;
                   variables['bisherige_revisionsstelle']['bisherige_revisionsstelle']['firma'] = data.revision[0].name;
                   variables['bisherige_revisionsstelle']['bisherige_revisionsstelle']['sitz'] = data.revision[0].in.substring(3);
                   variables['bisherige_revisionsstelle']['bisherige_revisionsstelle']['che'] = data.revision[0].che;
               }
               
               // Get verwaltungsrats
               for(var i = 0; i < data.signatures.length; i++){
                   var vrat = data.signatures[i];
                   if(vrat.function != ''){
                	  if(vrat.function == 'Präsident'){
                		  vrat.function = 'Präsident des Verwaltungsrates';
                	  }
                	  if(vrat.function == 'Präsidentin'){
                		  vrat.function = 'Präsidentin des Verwaltungsrates';
                	  }
                	  if(vrat.function == 'Vizepräsident'){
                		  vrat.function = 'Vizepräsident des Verwaltungsrates';
                	  }
                	  if(vrat.function == 'Vizepräsidentin'){
                		  vrat.function = 'Vizepräsidentin des Verwaltungsrates';
                	  }
                	  if(vrat.function == 'Mitglied'){
                		  vrat.function = 'Mitglied des Verwaltungsrates';
                	  }
                	  if(vrat.function == 'Vorsitzender'){
                		  vrat.function = 'Vorsitzender des Verwaltungsrates';
                	  }
                	  if(vrat.function == 'Vorsitzende'){
                		  vrat.function = 'Vorsitzende des Verwaltungsrates';
                	  }
                	  
                	  var funktion_en = '';
                	  if(vrat.function.indexOf('Präsident') != -1){
                		  funktion_en = 'chairman of the board';
                	  }
                	  if(vrat.function.indexOf('Vizepräsident') != -1){
                		  funktion_en = 'vice chairman of the board';
                	  }
                	  if(vrat.function.indexOf('Mitglied') != -1){
                		  funktion_en = 'member of the board';
                	  }
                	  
                      variables['angaben']['verwaltungsrat'].push({'vorname' : vrat.first_name, 'nachname' : vrat.last_name, 'funktion_de' : vrat.function, 'funktion_en' : funktion_en});
                   }
               }
               
               // Get shares
               
    	   		var n_namen = 1;
    	   		var n_inhaber = 1;
    	   		for(var i = 0; i < data.shares.length; i++){
    	   			var share  = data.shares[i];
    	   			if(share.typ == 'Namenaktien'){
    	   				if(share.name == ''){
    	   					shares.namen_stamm.value = parseFloat(share.price);
    	   				}
    	   				else if(share.name == 'Stimmrechtsaktien'){
    	   					shares.namen_stimm.value = parseFloat(share.price);
    	   				}
    	   				else{
    	   					shares['namen_vorzug_' + n_namen.toString()].name = share.name;
    	   					shares['namen_vorzug_' + n_namen.toString()].value = parseFloat(share.price);
    	   					n_namen = n_namen + 1;
    	   				}
    	   			}
    	   			else if(share.typ == 'Inhaberaktien'){
    	   				if(share.name == ''){
    	   					shares.inhaber_stamm.value = parseFloat(share.price);
    	   				}
    	   				else{
    	   					shares['inhaber_vorzug_' + n_inhaber.toString()].name = share.name;
    	   					shares['inhaber_vorzug_' + n_inhaber.toString()].value = parseFloat(share.price);
    	   					n_inhaber = n_inhaber + 1;
    	   				}
    	   			}
    	   		}
    	   		
    	   		if(shares.namen_vorzug_1 != ''){
    	   			variables['eroffnungen']['aktien']['namenaktien_vorzugsaktien_kat1_bezeichnung'] = shares.namen_vorzug_1.name;
    	   			variables['eroffnungen']['aktien_v']['namenaktien_vorzugsaktien_kat1_bezeichnung'] = shares.namen_vorzug_1.name;
    	   			variables['eroffnungen']['aktien_d']['namenaktien_vorzugsaktien_kat1_bezeichnung'] = shares.namen_vorzug_1.name;
    	   		}
    	   		
    	   		if(shares.namen_vorzug_2 != ''){
    	   			variables['eroffnungen']['aktien']['namenaktien_vorzugsaktien_kat2_bezeichnung'] = shares.namen_vorzug_2.name;
    	   			variables['eroffnungen']['aktien_v']['namenaktien_vorzugsaktien_kat2_bezeichnung'] = shares.namen_vorzug_2.name;
    	   			variables['eroffnungen']['aktien_d']['namenaktien_vorzugsaktien_kat2_bezeichnung'] = shares.namen_vorzug_2.name;
    	   		}
    	   		
    	   		if(shares.namen_vorzug_3 != ''){
    	   			variables['eroffnungen']['aktien']['namenaktien_vorzugsaktien_kat3_bezeichnung'] = shares.namen_vorzug_3.name;
    	   			variables['eroffnungen']['aktien_v']['namenaktien_vorzugsaktien_kat3_bezeichnung'] = shares.namen_vorzug_3.name;
    	   			variables['eroffnungen']['aktien_d']['namenaktien_vorzugsaktien_kat3_bezeichnung'] = shares.namen_vorzug_3.name;
    	   		}
    	   		
    	   		if(shares.inhaber_vorzug_1 != ''){
    	   			variables['eroffnungen']['aktien']['inhaberaktien_vorzugsaktien_kat1_bezeichnung'] = shares.inhaber_vorzug_1.name;
    	   			variables['eroffnungen']['aktien_v']['inhaberaktien_vorzugsaktien_kat1_bezeichnung'] = shares.inhaber_vorzug_1.name;
    	   			variables['eroffnungen']['aktien_d']['inhaberaktien_vorzugsaktien_kat1_bezeichnung'] = shares.inhaber_vorzug_1.name;
    	   		}
    	   		
    	   		if(shares.inhaber_vorzug_2 != ''){
    	   			variables['eroffnungen']['aktien']['inhaberaktien_vorzugsaktien_kat1_bezeichnung'] = shares.inhaber_vorzug_2.name;
    	   			variables['eroffnungen']['aktien_v']['inhaberaktien_vorzugsaktien_kat1_bezeichnung'] = shares.inhaber_vorzug_2.name;
    	   			variables['eroffnungen']['aktien_d']['inhaberaktien_vorzugsaktien_kat1_bezeichnung'] = shares.inhaber_vorzug_2.name;
    	   		}
    	   		
    	   		if(shares.inhaber_vorzug_3 != ''){
    	   			variables['eroffnungen']['aktien']['inhaberaktien_vorzugsaktien_kat1_bezeichnung'] = shares.inhaber_vorzug_3.name;
    	   			variables['eroffnungen']['aktien_v']['inhaberaktien_vorzugsaktien_kat1_bezeichnung'] = shares.inhaber_vorzug_3.name;
    	   			variables['eroffnungen']['aktien_d']['inhaberaktien_vorzugsaktien_kat1_bezeichnung'] = shares.inhaber_vorzug_3.name;
    	   		}
    	   		
    	   		var cantons = [{'name' : 'GR', 'de' : 'Graubünden', 'en' : 'Graubunden'}, {'name' : 'ZH', 'de' : 'Zürich', 'en' : 'Zurich'}, {'name' : 'ZG', 'de' : 'Zug', 'en' : 'Zug'}, {'name' : 'LU', 'de' : 'Luzern', 'en' : 'Lucerne'}, {'name' : 'BS', 'de' : 'Basel', 'en' : 'Basel'}];
    	   		
    	   		for(var i = 0; i < cantons.length; i++){
    	   			if(cantons[i].name == data.shabPub.registryOfficeCanton){
    	   				variables['angaben']['zustandig']['hreg_de'] = cantons[i].de;
    	   				variables['angaben']['zustandig']['hreg_en'] = cantons[i].en;
    	   			}
    	   		}
               
    		   
    	   }
    	   else{
    		   api.message.type = 'danger';
    		   api.message.message = result.message;
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

function get_revisionsstelle_name(){
    if(typeof variables['bisherige_revisionsstelle']['bisherige_revisionsstelle']['typ'] != 'undefined'){
        if(variables['bisherige_revisionsstelle']['bisherige_revisionsstelle']['typ'] == 'gesellschaft'){
            if(typeof variables['bisherige_revisionsstelle']['bisherige_revisionsstelle']['firma'] != 'undefined'){
                return variables['bisherige_revisionsstelle']['bisherige_revisionsstelle']['firma'];
            }
            else{
                return '';
            }
            
        }
        else{
            var name = '';
            if(typeof variables['bisherige_revisionsstelle']['bisherige_revisionsstelle']['titel_de'] != 'undefined'){
                name += variables['bisherige_revisionsstelle']['bisherige_revisionsstelle']['titel_de'];
                name += ' ';
            }
            if(typeof variables['bisherige_revisionsstelle']['bisherige_revisionsstelle']['vorname'] != 'undefined'){
                name += variables['bisherige_revisionsstelle']['bisherige_revisionsstelle']['vorname'];
                name += ' ';
            }
            if(typeof variables['bisherige_revisionsstelle']['bisherige_revisionsstelle']['nachname'] != 'undefined'){
                name += variables['bisherige_revisionsstelle']['bisherige_revisionsstelle']['nachname'];
                name += ' ';
            }
            
            return name;
        }
    }
    else{
        return '';
    }
}

function aktionare_sex(){
	if(variables['aktionare']['aktionar'].length > 1){
		var zahl = 'p';
	}
	else{
		var zahl = 's';
	}
	for(var i = 0; i < variables['aktionare']['aktionar'].length; i++){
		if(variables['aktionare']['aktionar'][i]['typ'] == 'gesellschaft' || (variables['aktionare']['aktionar'][i]['typ'] == 'person' && variables['aktionare']['aktionar'][i]['sex'] == 'herr')){
			if(zahl == 's'){
				return 'ms'
			}
			else{
				return 'mp'
			}
		}
	}
	
	if(zahl == 's'){
		return 'fs'
	}
	else{
		return 'fp'
	}
}


form = new Form({'title' : function(){return 'Revisionsstelle – Opting-Out nach Gründung'}, 'debug' : true});

var step1 = form.add_step({'title':'Angaben zur Gesellschaft', 'variable_name':'angaben'});

var page1 = step1.add_page({'title':'Firmenwahl', 'variable_name':'firmenwahl'});

var radio = page1.add_apiselect({'title' : 'Firmenwahl', 'label' : 'Nach Firma suchen'});

var page2 = step1.add_multipage({'title' : 'Verwaltungsrat', 'variable_name' : 'verwaltungsrat', 'show' : function(){return false;}, 'naming' : function(self, index){if(typeof variables['angaben']['verwaltungsrat'][index]['vorname'] !== 'undefined' && typeof variables['angaben']['verwaltungsrat'][index]['nachname'] !== 'undefined' && typeof variables['angaben']['verwaltungsrat'][index]['funktion_de'] !== 'undefined'){return variables['angaben']['verwaltungsrat'][index]['vorname'] + ' ' + variables['angaben']['verwaltungsrat'][index]['nachname'] + ' (' + variables['angaben']['verwaltungsrat'][index]['funktion_de'] + ')';}else{return 'Verwaltungsrat ' + parseInt(index + 1);}}});

var verwaltungsrat_model = new Model(form, {'name' : 'verwaltungsrat_model', 'sources' : [page2]});

var page2 = step1.add_page({'title':'Firma', 'variable_name':'firma'});

var text = page2.add_text({'label' : 'Firma', 'variable_name' : 'firma', 'required' : true});

var text = page2.add_text({'label' : 'Übersetzung der Firma 1', 'variable_name' : 'ubersetzung_1', 'placeholder' : 'Optional'});
var text = page2.add_text({'label' : 'Übersetzung der Firma 2', 'variable_name' : 'ubersetzung_2', 'placeholder' : 'Optional'});
var text = page2.add_text({'label' : 'Übersetzung der Firma 3', 'variable_name' : 'ubersetzung_3', 'placeholder' : 'Optional'});

var text = page2.add_text({'label' : 'Rechtsform', 'variable_name' : 'rechtsform', 'default' : 'Aktiengesellschaft', 'disabled' : function(){return true;}, 'required' : true});

var text = page2.add_text({'label' : 'Unternehmensidentifikationsnummer', 'variable_name' : 'che', 'placeholder' : ''});

var text = page2.add_text({'label' : 'Sitzgemeinde', 'variable_name' : 'sitzgemeinde', 'placeholder' : ''});

var page3 = step1.add_page({'title':'Rechtsdomizil', 'variable_name':'rechtsdomizil', 'required' : true, 'tooltip' : 'Als Rechtsdomizil gilt die Adresse, unter der die Rechtseinheit an ihrem Sitz erreicht werden kann, mit folgenden Angaben: Strasse, Hausnummer, Postleitzahl und Ortsnamen (Art. 2 lit. c HRegV).'});

var radio = page3.add_radio({'variable_name' : 'buros', 'required' : true});
var option = radio.add_option({'value' : 'eigene', 'label' : 'Eigene Büros am Sitz'});
var option = radio.add_option({'value' : 'keine', 'label' : 'Keine eigenen Büros am Sitz', 'tooltip' : 'Verfügt eine Rechtseinheit über kein Rechtsdomizil an ihrem Sitz, so muss im angegeben werden, bei wem sich das Rechtsdomizil an diesem Sitz befindet (c/o-Adresse). Mit der Anmeldung an das Han-delsregister zur Eintragung ist eine Erklä-rung der Domizilhalterin oder des Domizil-halters einzureichen, dass sie oder er der Rechtseinheit ein Rechtsdomizil an deren Sitz gewährt (Art. 117 Abs. 3 HRegV).'});

var separator = page3.add_separator({'show' : function(){if(typeof variables['angaben']['rechtsdomizil']['buros'] != 'undefined'){return true;}else{return false;}}});

var text = page3.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'required' : true, 'show' : function(){if(equals(['angaben', 'rechtsdomizil', 'buros'], 'eigene')){return true;}else{return false;}}});

var text = page3.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de', 'required' : true, 'show' : function(){if(equals(['angaben', 'rechtsdomizil', 'buros'], 'eigene')){return true;}else{return false;}}});

var text = page3.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en', 'required' : true, 'show' : function(){if(equals(['angaben', 'rechtsdomizil', 'buros'], 'eigene')){return true;}else{return false;}}});

var text = page3.add_text({'label' : 'Land (Deutsch)', 'variable_name' : 'land_de', 'required' : true, 'show' : function(){if(equals(['angaben', 'rechtsdomizil', 'buros'], 'eigene')){return true;}else{return false;}}});

var text = page3.add_text({'label' : 'Land (Englisch)', 'variable_name' : 'land_en', 'required' : true, 'show' : function(){if(equals(['angaben', 'rechtsdomizil', 'buros'], 'eigene')){return true;}else{return false;}}});

var radio = page3.add_radio({'variable_name' : 'domizil_bei', 'required' : true, 'show' : function(){if(equals(['angaben', 'rechtsdomizil', 'buros'], 'keine')){return true;}else{return false;}}});
var option = radio.add_option({'value' : 'einzelperson', 'label' : 'Domizil bei Einzelperson'});
var option = radio.add_option({'value' : 'unternehmung', 'label' : 'Domizil bei Unternehmung'});

var separator = page3.add_separator({'show' : function(){if(typeof variables['angaben']['rechtsdomizil']['domizil_bei'] != 'undefined' && equals(['angaben', 'rechtsdomizil', 'buros'], 'keine')){return true;}else{return false;}}});

var text = page3.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true, 'show' : function(){if(equals(['angaben', 'rechtsdomizil', 'buros'], 'keine') && equals(['angaben', 'rechtsdomizil', 'domizil_bei'], 'einzelperson')){return true;}else{return false;}}});

var text = page3.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true, 'show' : function(){if(equals(['angaben', 'rechtsdomizil', 'buros'], 'keine') && equals(['angaben', 'rechtsdomizil', 'domizil_bei'], 'einzelperson')){return true;}else{return false;}}});

var text = page3.add_text({'label' : 'Firma', 'variable_name' : 'firma', 'required' : true, 'show' : function(){if(equals(['angaben', 'rechtsdomizil', 'buros'], 'keine') && equals(['angaben', 'rechtsdomizil', 'domizil_bei'], 'unternehmung')){return true;}else{return false;}}});

var text = page3.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'required' : true, 'show' : function(){if(typeof variables['angaben']['rechtsdomizil']['domizil_bei'] != 'undefined' && equals(['angaben', 'rechtsdomizil', 'buros'], 'keine')){return true;}else{return false;}}});

var text = page3.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de', 'required' : true, 'show' : function(){if(typeof variables['angaben']['rechtsdomizil']['domizil_bei'] != 'undefined' && equals(['angaben', 'rechtsdomizil', 'buros'], 'keine')){return true;}else{return false;}}});

var text = page3.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en', 'required' : true, 'show' : function(){if(typeof variables['angaben']['rechtsdomizil']['domizil_bei'] != 'undefined' && equals(['angaben', 'rechtsdomizil', 'buros'], 'keine')){return true;}else{return false;}}});

var text = page3.add_text({'label' : 'Land (Deutsch)', 'variable_name' : 'land_de', 'required' : true, 'show' : function(){if(typeof variables['angaben']['rechtsdomizil']['domizil_bei'] != 'undefined' && equals(['angaben', 'rechtsdomizil', 'buros'], 'keine')){return true;}else{return false;}}});

var text = page3.add_text({'label' : 'Land (Englisch)', 'variable_name' : 'land_en', 'required' : true, 'show' : function(){if(typeof variables['angaben']['rechtsdomizil']['domizil_bei'] != 'undefined' && equals(['angaben', 'rechtsdomizil', 'buros'], 'keine')){return true;}else{return false;}}});

var page4 = step1.add_page({'title':'Zweck der Gesellschaft (kurz)', 'variable_name':'zweck', 'required' : true});
var textarea = page4.add_textarea({'label' : 'Kurzzweck', 'variable_name' : 'zweck'});

var page4 = step1.add_page({'title':'Zuständiges Handelsregisteramt', 'variable_name':'zustandig', 'required' : true});

var text = page4.add_text({'label' : 'Zuständiges Handelsregisteramt (Deutsch)', 'variable_name' : 'hreg_de', 'required' : true});

var text = page4.add_text({'label' : 'Zuständiges Handelsregisteramt (Englisch)', 'variable_name' : 'hreg_en', 'required' : true});


var step3 = form.add_step({'title':'Bisherige Revisionsstelle', 'variable_name':'bisherige_revisionsstelle'});

var page1 = step3.add_page({'title' : 'Bisherige Revisionsstelle', 'variable_name' : 'bisherige_revisionsstelle'});

var radio = page1.add_radio({'variable_name' : 'typ', 'required' : true, 'label' : ''});
var option = radio.add_option({'value' : 'gesellschaft', 'label' : 'Gesellschaft'});
var option = radio.add_option({'value' : 'person', 'label' : 'Natürliche Person'});

var separator = page1.add_separator({'show' : function(){if(typeof variables['bisherige_revisionsstelle']['bisherige_revisionsstelle']['typ'] != 'undefined'){return true;}else{return false;}}});

var radio = page1.add_radio({'variable_name' : 'sex', 'required' : true, 'show' : function(){if(equals(['bisherige_revisionsstelle', 'bisherige_revisionsstelle', 'typ'], 'person')){return true;}else{return false;}}});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page1.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true, 'show' : function(){if(equals(['bisherige_revisionsstelle', 'bisherige_revisionsstelle', 'typ'], 'person')){return true;}else{return false;}}});
var text = page1.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true, 'show' : function(){if(equals(['bisherige_revisionsstelle', 'bisherige_revisionsstelle', 'typ'], 'person')){return true;}else{return false;}}});
var text = page1.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional', 'show' : function(){if(equals(['bisherige_revisionsstelle', 'bisherige_revisionsstelle', 'typ'], 'person')){return true;}else{return false;}}});
var text = page1.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional', 'show' : function(){if(equals(['bisherige_revisionsstelle', 'bisherige_revisionsstelle', 'typ'], 'person')){return true;}else{return false;}}});
var text = page1.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'show' : function(){if(equals(['bisherige_revisionsstelle', 'bisherige_revisionsstelle', 'typ'], 'person')){return true;}else{return false;}}});
var text = page1.add_text({'label' : 'Ort (Deutsch)', 'variable_name' : 'ort_de', 'show' : function(){if(equals(['bisherige_revisionsstelle', 'bisherige_revisionsstelle', 'typ'], 'person')){return true;}else{return false;}}});
var text = page1.add_text({'label' : 'Ort (Englisch)', 'variable_name' : 'ort_en', 'show' : function(){if(equals(['bisherige_revisionsstelle', 'bisherige_revisionsstelle', 'typ'], 'person')){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Firma', 'variable_name' : 'firma', 'required' : true, 'show' : function(){if(equals(['bisherige_revisionsstelle', 'bisherige_revisionsstelle', 'typ'], 'gesellschaft')){return true;}else{return false;}}});
var text = page1.add_text({'label' : 'Sitz', 'variable_name' : 'sitz', 'required' : true, 'show' : function(){if(equals(['bisherige_revisionsstelle', 'bisherige_revisionsstelle', 'typ'], 'gesellschaft')){return true;}else{return false;}}});
var text = page1.add_text({'label' : 'Unternehmensidentifikationsnummer', 'variable_name' : 'che', 'required' : true, 'show' : function(){if(equals(['bisherige_revisionsstelle', 'bisherige_revisionsstelle', 'typ'], 'gesellschaft')){return true;}else{return false;}}});

var step4 = form.add_step({'title':'Verzicht auf eingeschränkte Revision', 'variable_name':'verzicht'});

var page1 = step4.add_page({'title' : 'Verzicht auf eingeschränkte Revision', 'variable_name' : 'verzicht'});

var radio = page1.add_radio({'variable_name' : 'erforderlich', 'required' : true});
var option = radio.add_option({'value' : 'erforderlich',  'label' : 'Revisionsstelle ist in den Statuten der Gesellschaft vorgesehen (Statutenänderung erforderlich)'});
var option = radio.add_option({'value' : 'n_erforderlich', 'label' : 'Statuten der Gesellschaft erlauben einen Verzicht auf eingeschränkte Revision (keine Statutenänderung erforderlich)'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'verzicht' && v[1] == 'verzicht' && v[2] == 'erforderlich'){return true}else{return false}}, 'assignment' : function(){if(equals(['verzicht', 'verzicht', 'erforderlich'], 'erforderlich')){variables['generalversammlung']['generalversammlung']['typ'] = 'protokoll';}}});

var page2 = step4.add_page({'title' : 'Notar', 'variable_name' : 'notar', 'show' : function(){if(equals(['verzicht', 'verzicht', 'erforderlich'], 'erforderlich')){return true;}else{return false;}}});

var radio = page2.add_radio({'variable_name' : 'kanton', 'required' : true});
var option = radio.add_option({'value' : 'zurich', 'label' : 'Kanton Zürich'});
var option = radio.add_option({'value' : 'zug', 'label' : 'Kanton Zug'});

var page2 = step4.add_page({'title':'Notariat', 'variable_name':'notariat', 'show' : function(){if(equals(['verzicht', 'verzicht', 'erforderlich'], 'erforderlich') && equals(['verzicht', 'notar', 'kanton'], 'zurich')){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Name des Notariates', 'variable_name' : 'name', 'required' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'notar' && v[1] == 'notariat' && v[2] == 'name'){return true}else{return false}}, 'assignment' : function(){variables['notar']['notariat']['name'] = variables['notar']['notariat']['name'].toUpperCase()}});


var text = page2.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'required' : true});
var text = page2.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de', 'required' : true});
var text = page2.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en', 'required' : true});
var text = page2.add_text({'label' : 'Land (Deutsch)', 'variable_name' : 'land_de', 'required' : true});
var text = page2.add_text({'label' : 'Land (Englisch)', 'variable_name' : 'land_en', 'required' : true});

var separator = page2.add_separator({});

var label = page2.add_label({'label' : 'Urkundsperson'});

var radio = page2.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page2.add_text({'label' : 'Vorname Urkundsperson', 'variable_name' : 'urkundsperson_vorname', 'required' : true});
var text = page2.add_text({'label' : 'Nachname Urkundsperson', 'variable_name' : 'urkundsperson_nachname', 'required' : true});
var text = page2.add_text({'label' : 'Titel Urkundsperson', 'variable_name' : 'titel_de', 'required' : true});
var text = page2.add_text({'label' : 'Titel Urkundsperson (Englisch)', 'variable_name' : 'titel_en', 'required' : true});

var page3 = step4.add_page({'title':'Notariat', 'variable_name':'urkundsperson', 'show' : function(){if(equals(['verzicht', 'verzicht', 'erforderlich'], 'erforderlich') && equals(['verzicht', 'notar', 'kanton'], 'zug')){return true;}else{return false;}}});

var separator = page3.add_separator({});

var radio = page3.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page3.add_text({'label' : 'Vorname Urkundsperson', 'variable_name' : 'urkundsperson_vorname', 'required' : true});
var text = page3.add_text({'label' : 'Nachname Urkundsperson', 'variable_name' : 'urkundsperson_nachname', 'required' : true});
var text = page3.add_text({'label' : 'Titel Urkundsperson', 'variable_name' : 'titel_de', 'required' : true});
var text = page3.add_text({'label' : 'Titel Urkundsperson (Englisch)', 'variable_name' : 'titel_en', 'required' : true});
var text = page3.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'required' : true});
var text = page3.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de', 'required' : true});
var text = page3.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en', 'required' : true});
var text = page3.add_text({'label' : 'Land (Deutsch)', 'variable_name' : 'land_de', 'required' : true});
var text = page3.add_text({'label' : 'Land (Englisch)', 'variable_name' : 'land_en', 'required' : true});

var page4 = step4.add_page({'title' : 'Beurkundungsverfahren', 'variable_name' : 'beurkundungsverfahren', 'show' : function(){if(equals(['verzicht', 'verzicht', 'erforderlich'], 'erforderlich')){return true;}else{return false;}}});

var text = page4.add_text({'label' : 'Ort der Beurkundung (Deutsch)', 'variable_name' : 'ort_de', 'required' : true});
var text = page4.add_text({'label' : 'Ort der Beurkundung (Englisch)', 'variable_name' : 'ort_en', 'required' : true});
var text = page4.add_text({'label' : 'Datum der Beurkundung', 'variable_name' : 'datum_de', 'required' : true, 'date' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'verzicht' && v[1] == 'beurkundungsverfahren' && v[2] == 'datum_de'){return true}else{return false}}, 'assignment' : function(){variables['verzicht']['beurkundungsverfahren']['datum_en'] = convert_date(variables['verzicht']['beurkundungsverfahren']['datum_de'])}});

var checkbox_group = page4.add_checkbox_group({'label' : 'Handelsregisteranmeldung'});
var checkbox = checkbox_group.add_checkbox({'label' : function(){if(typeof variables['verzicht']['notar']['kanton'] != 'undefined' && variables['verzicht']['notar']['kanton'] == 'zug'){return 'Gründer unterzeichnen Handelsregisteranmeldung ausserhalb Notariat';}else{return 'Gründer unterzeichnen Handelsregisteranmeldung ausserhalb Amtslokal';}}, 'variable_name' : 'grunder'});

var page5 = step4.add_page({'title' : 'Ausfertigungen', 'variable_name' : 'ausfertigungen', 'show' : function(){if(equals(['verzicht', 'verzicht', 'erforderlich'], 'erforderlich') && equals(['verzicht', 'notar', 'kanton'], 'zug')){return true;}else{return false;}}});

var label = page5.add_label({'label' : 'Anzahl Ausfertigungen der öffentlichen Urkunde für:'});

var text = page5.add_text({'label' : 'die Urkundsperson', 'variable_name' : 'urkundsperson', 'required' : true, 'default' : '2'});
var text = page5.add_text({'label' : 'das Handelsregisteramt', 'variable_name' : 'handelsregisteramt', 'required' : true, 'default' : '1'});
var text = page5.add_text({'label' : 'die Gesellschaft', 'variable_name' : 'gesellschaft', 'required' : true, 'default' : '3'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'beurkundungsverfahren'){return true}else{return false}}, 'assignment' : function(){
    variables['verzicht']['ausfertigungen']['urkundsperson_n'] = parseInt(variables['verzicht']['ausfertigungen']['urkundsperson'].replace(/[^0-9]/, ''))
variables['verzicht']['ausfertigungen']['handelsregisteramt_n'] = parseInt(variables['verzicht']['ausfertigungen']['handelsregisteramt'].replace(/[^0-9]/, ''))
variables['verzicht']['ausfertigungen']['gesellschaft_n'] = parseInt(variables['verzicht']['ausfertigungen']['gesellschaft'].replace(/[^0-9]/, ''))
variables['verzicht']['ausfertigungen']['revisionsstelle_n'] = parseInt(variables['verzicht']['ausfertigungen']['revisionsstelle'].replace(/[^0-9]/, ''))}});

var page6 = step4.add_page({'title' : 'Änderung der Statuten', 'variable_name' : 'anderung', 'show' : function(){if(equals(['verzicht', 'verzicht', 'erforderlich'], 'erforderlich')){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Artikel Nr.', 'variable_name' : 'artikel_nr', 'required' : true});

var text = page6.add_text({'label' : 'Artikel Titel', 'variable_name' : 'artikel_titel', 'required' : true});

var separator = page6.add_separator({});

var checkbox_group = page6.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Absatz', 'variable_name' : 'absatz'});

var text = page6.add_text({'label' : 'Von Absatz Nr.', 'variable_name' : 'absatz_nr_begin', 'required' : true, 'show' : function(){if(equals(['verzicht', 'anderung', 'absatz'], true)){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Bis Absatz Nr.', 'variable_name' : 'absatz_nr_end', 'required' : true, 'show' : function(){if(equals(['verzicht', 'anderung', 'absatz'], true)){return true;}else{return false;}}});

var step5 = form.add_step({'title':'Generalversammlung', 'variable_name':'generalversammlung'});

var page1 = step5.add_page({'title' : 'Generalversammlung', 'variable_name' : 'generalversammlung'});

var radio = page1.add_radio({'variable_name' : 'typ', 'required' : true, 'disabled' : function(){if(equals(['verzicht', 'verzicht', 'erforderlich'], 'erforderlich')){return true;}else{return false;}}});
var option = radio.add_option({'value' : 'protokoll',  'label' : 'Protokoll über die Beschlüsse der Generalversammlung'});
var option = radio.add_option({'value' : 'zirkular', 'label' : '(Zirkular-)Beschluss der Aktionäre', 'tooltip' : 'Nur möglich, wenn die Statuten einen Verzicht auf eingeschränkte Revision erlauben.'});

var step6 = form.add_step({'title' : 'Eröffnung und Feststellungen des Vorsitzenden', 'variable_name' : 'eroffnungen', 'show' : function(){return equals(['generalversammlung', 'generalversammlung', 'typ'], 'protokoll')}});

var page0 = step6.add_page({'title' : 'Datum und Ort der Generalversammlung', 'variable_name' : 'datum'});

var text = page0.add_text({'label' : 'Datum der Generalversammlung', 'variable_name' : 'datum_de', 'required' : true, 'date' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'datum' && v[2] == 'datum_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]]['datum_en'] = convert_date(variables[v[0]][v[1]][v[2]])}});

var radio = page0.add_radio({'variable_name' : 'ort', 'label' : 'Ort der Generalversammlung', 'required' : true});
var option = radio.add_option({'value' : 'sitz',  'label' : 'am Sitz der Gesellschaft'});
var option = radio.add_option({'value' : 'naturlich',  'label' : 'bei natürlicher Person'});
var option = radio.add_option({'value' : 'juristisch', 'label' : 'bei juristischer Person oder Unternehmung'});

var text = page0.add_text({'label' : 'Firma', 'variable_name' : 'firma', 'show' : function(){return equals(['eroffnungen', 'datum', 'ort'], 'juristisch')}});
var text = page0.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'show' : function(){return equals(['eroffnungen', 'datum', 'ort'], 'juristisch') || equals(['eroffnungen', 'datum', 'ort'], 'naturlich')}});
var text = page0.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de', 'show' : function(){return equals(['eroffnungen', 'datum', 'ort'], 'juristisch') || equals(['eroffnungen', 'datum', 'ort'], 'naturlich')}});
var text = page0.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en', 'show' : function(){return equals(['eroffnungen', 'datum', 'ort'], 'juristisch') || equals(['eroffnungen', 'datum', 'ort'], 'naturlich')}});

var separator = page0.add_separator({'show' : function(){return equals(['eroffnungen', 'datum', 'ort'], 'juristisch') || equals(['eroffnungen', 'datum', 'ort'], 'naturlich')}});

var checkbox_group = page0.add_checkbox_group({'label' : '', 'show' : function(){return equals(['eroffnungen', 'datum', 'ort'], 'juristisch') || equals(['eroffnungen', 'datum', 'ort'], 'naturlich')}});
var checkbox = checkbox_group.add_checkbox({'label' : 'im Ausland', 'variable_name' : 'ausland'});
var text = page0.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel', 'show' : function(){return equals(['eroffnungen', 'datum', 'ausland'], true) && (equals(['eroffnungen', 'datum', 'ort'], 'juristisch') || equals(['eroffnungen', 'datum', 'ort'], 'naturlich'))}});

var page1 = step6.add_page({'title' : 'Vorsitzender', 'variable_name' : 'vorsitzender'});

var text = page1.add_modelselect(verwaltungsrat_model, {'label' : 'Vorschläge', 'variable_name' : 'vorschlag'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[2] == 'vorschlag'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]]['vorschlag_array'] = parse_vorsitzender(variables[v[0]][v[1]][v[2]]);variables[v[0]][v[1]]['vorname'] = variables['angaben']['verwaltungsrat'][variables[v[0]][v[1]]['vorschlag_array'][2]]['vorname'];variables[v[0]][v[1]]['nachname'] = variables['angaben']['verwaltungsrat'][variables[v[0]][v[1]]['vorschlag_array'][2]]['nachname'];variables[v[0]][v[1]]['funktion'] = (variables['angaben']['verwaltungsrat'][variables[v[0]][v[1]]['vorschlag_array'][2]]['funktion_de'].indexOf('Präsident') != -1 ? 'prasident' : 'mitglied')}});


var radio = page1.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page1.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true});
var text = page1.add_text({'label' : 'Nachname', 'variable_name' : 'nachname', 'required' : true});
var text = page1.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional'});
var text = page1.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional'});

var separator = page1.add_separator({});

var radio = page1.add_radio({'variable_name' : 'burger', 'required' : true});
var option = radio.add_option({'value' : 'schweiz',  'label' : 'Schweizer Staatsbürger'});
var option = radio.add_option({'value' : 'ausland', 'label' : 'Ausländischer Staatsangehöriger'});


var text = page1.add_text({'label' : 'Heimatort (Deutsch)', 'variable_name' : 'heimatort_de', 'required' : true, 'show' : function(){return equals(['eroffnungen', 'vorsitzender', 'burger'], 'schweiz')}});
var text = page1.add_text({'label' : 'Heimatort (Englisch)', 'variable_name' : 'heimatort_en', 'required' : true, 'show' : function(){return equals(['eroffnungen', 'vorsitzender', 'burger'], 'schweiz')}});

var text = page1.add_text({'label' : 'Staatsangehörige/r', 'variable_name' : 'staatsangehorige_de', 'required' : true, 'placeholder' : 'z.B. deutsche/r', 'show': function(self){return equals(['eroffnungen', 'vorsitzender', 'burger'], 'ausland')}});
var text = page1.add_text({'label' : 'Citizen of', 'variable_name' : 'staatsangehorige_en', 'required' : true, 'placeholder' : 'e.g. germany', 'show': function(self){return equals(['eroffnungen', 'vorsitzender', 'burger'], 'ausland')}});

var separator = page1.add_separator({});


var label = page1.add_label({'label' : 'Wohnsitzadresse'});
var text = page1.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse'});
var text = page1.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de'});
var text = page1.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en'});

var separator = page1.add_separator({});


var checkbox_group = page1.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Wohnsitz im Ausland', 'variable_name' : 'ausland'});
var text = page1.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel', 'show' : function(){return equals(['eroffnungen', 'vorsitzender', 'ausland'], true)}});

var separator = page1.add_separator({});

var radio = page1.add_radio({'label' : 'Funktion', 'variable_name' : 'funktion', 'required' : true, 'tooltip' : 'Für die Vorsitzregelung in der Generalver-sammlung (insb. bezüglich der Möglichkeit der Wahl eines Tagespräsidenten) stets die Statuten der Gesellschaft konsultieren.'});
var option = radio.add_option({'value' : 'prasident',  'label' : 'Präsident des Verwaltungsrates'});
var option = radio.add_option({'value' : 'mitglied', 'label' : 'Mitglied des Verwaltungsrates'});
var option = radio.add_option({'value' : 'bevollmachtigter', 'label' : 'Bevollmächtigter oder Tagespräsident'});

var page2 = step6.add_page({'title' : 'Protokollführer und Stimmenzähler', 'variable_name' : 'protokollfuhrer'});

var radio = page2.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page2.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true});
var text = page2.add_text({'label' : 'Nachname', 'variable_name' : 'nachname', 'required' : true});
var text = page2.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional'});
var text = page2.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional'});

var separator = page2.add_separator({});

var radio = page2.add_radio({'variable_name' : 'burger', 'required' : true});
var option = radio.add_option({'value' : 'schweiz',  'label' : 'Schweizer Staatsbürger'});
var option = radio.add_option({'value' : 'ausland', 'label' : 'Ausländischer Staatsangehöriger'});


var text = page2.add_text({'label' : 'Heimatort (Deutsch)', 'variable_name' : 'heimatort_de', 'required' : true, 'show' : function(){return equals(['eroffnungen', 'protokollfuhrer', 'burger'], 'schweiz')}});
var text = page2.add_text({'label' : 'Heimatort (Englisch)', 'variable_name' : 'heimatort_en', 'required' : true, 'show' : function(){return equals(['eroffnungen', 'protokollfuhrer', 'burger'], 'schweiz')}});

var text = page2.add_text({'label' : 'Staatsangehörige/r', 'variable_name' : 'staatsangehorige_de', 'required' : true, 'placeholder' : 'z.B. deutsche/r', 'show': function(self){return equals(['eroffnungen', 'protokollfuhrer', 'burger'], 'ausland')}});
var text = page2.add_text({'label' : 'Citizen of', 'variable_name' : 'staatsangehorige_en', 'required' : true, 'placeholder' : 'e.g. germany', 'show': function(self){return equals(['eroffnungen', 'protokollfuhrer', 'burger'], 'ausland')}});

var separator = page2.add_separator({});


var label = page2.add_label({'label' : 'Wohnsitzadresse'});
var text = page2.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse'});
var text = page2.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de'});
var text = page2.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en'});

var separator = page2.add_separator({});

var checkbox_group = page2.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Wohnsitz im Ausland', 'variable_name' : 'ausland'});
var text = page2.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel', 'show' : function(){return equals(['eroffnungen', 'protokollfuhrer', 'ausland'], true)}});

var page3 = step6.add_page({'title' : 'Vertretung der Aktionäre', 'variable_name' : 'vertretung'});

var checkbox_group = page3.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Der Vorsitzende vertritt Aktionäre bzw. Aktionärinnen', 'variable_name' : 'aktien_v'});

var radio = page3.add_radio({'label' : 'Geschlecht und Anzahl der vom Vorsitzenden vertretener Aktionäre bzw. Aktionärinnen', 'variable_name' : 'geschlecht_v', 'required' : true, 'show' : function(){return equals(['eroffnungen', 'vertretung', 'aktien_v'], true)}});
var option = radio.add_option({'value' : 'mannlich_s',  'label' : 'einer, männlich'});
var option = radio.add_option({'value' : 'weiblich_s',  'label' : 'eine, weiblich'});
var option = radio.add_option({'value' : 'weiblich_p',  'label' : 'mehrere, ausschliesslich weiblich'});
var option = radio.add_option({'value' : 'mannlich_p',  'label' : 'mehrere, männlich (und weiblich)'});

var separator = page3.add_separator({});

var checkbox_group = page3.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Aktionäre bzw. Aktionärinnen vertreten sich selbst', 'variable_name' : 'aktien_a'});

var text = page3.add_text({'label' : 'Anwesende Aktionäre', 'variable_name' : 'anwesende', 'show' : function(){return equals(['eroffnungen', 'vertretung', 'aktien_a'], true)}, 'required' : true, 'tooltip' : 'Zahl anwesender oder (durch andere Personen als Organ- oder Depotvertreter) vertretener AktionäreInnen'});

var checkbox_group = page3.add_checkbox_group({'label' : '', 'show' : function(){return equals(['eroffnungen', 'vertretung', 'aktien_a'], true)}});
var checkbox = checkbox_group.add_checkbox({'label' : 'Die anwesenden oder vertretenen AktionäreInnen sind ausschliesslich Frauen', 'variable_name' : 'geschlecht'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'vertretung' && v[2] == 'anwesende'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]]['anwesende_n'] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''))}});

var separator = page3.add_separator({});

var checkbox_group = page3.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Depovertreter vertreten Aktionäre bzw. Aktionärinnen', 'variable_name' : 'aktien_d'});

var radio = page3.add_radio({'label' : 'Geschlecht und Anzahl der Depotvertreter', 'variable_name' : 'geschlecht_d', 'required' : true, 'show' : function(){return equals(['eroffnungen', 'vertretung', 'aktien_d'], true)}});
var option = radio.add_option({'value' : 'mannlich_s',  'label' : 'einer, männlich'});
var option = radio.add_option({'value' : 'weiblich_s',  'label' : 'eine, weiblich'});
var option = radio.add_option({'value' : 'weiblich_p',  'label' : 'mehrere, ausschliesslich weiblich'});
var option = radio.add_option({'value' : 'mannlich_p',  'label' : 'mehrere, männlich (und weiblich)'});

var page4 = step6.add_page({'title' : 'Aktien vertreten durch Aktionäre', 'variable_name' : 'aktien', 'tooltip' : 'Zahl, Art und Kategorie der von den anwesenden oder vertretenen AktionäreInnen gehaltenen Aktien.', 'show' : function(){return equals(['eroffnungen', 'vertretung', 'aktien_a'], true)}});

var label = page4.add_label({'label' : 'Namenaktien', 'font_size' : function(self){return '18'}, 'show' : function(){if(shares.namen_stamm.value != 0 || shares.namen_stimm.value != 0 || shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});

var label = page4.add_label({'label' : 'Stammaktien', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_stamm.value != 0){return true;}else{return false;}}});

var text = page4.add_text({'label' : 'Anzahl Stammaktien', 'variable_name' : 'namenaktien_stammaktien_n', 'show' : function(){if(shares.namen_stamm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'namenaktien_stammaktien_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['namenaktien_stammaktien'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.namen_stamm.value).toFixed(2);}});

var text = page4.add_text({'label' : 'Nominalwert Stammaktien (CHF)', 'variable_name' : 'namenaktien_stammaktien', 'show' : function(){if(shares.namen_stamm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'namenaktien_stammaktien'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page4.add_label({'label' : 'Vorzugsaktien Kategorie 1', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});

var text = page4.add_text({'label' : 'Anzahl', 'variable_name' : 'namenaktien_vorzugsaktien_kat1_n', 'show' : function(){if(shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'namenaktien_vorzugsaktien_kat1_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['namenaktien_vorzugsaktien_kat1'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.namen_vorzug_1.value).toFixed(2);}});

var text = page4.add_text({'label' : 'Bezeichnung', 'variable_name' : 'namenaktien_vorzugsaktien_kat1_bezeichnung', 'show' : function(){if(shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});

var text = page4.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'namenaktien_vorzugsaktien_kat1', 'show' : function(){if(shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'namenaktien_vorzugsaktien_kat1'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page4.add_label({'label' : 'Vorzugsaktien Kategorie 2', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_vorzug_2.value != 0){return true;}else{return false;}}});

var text = page4.add_text({'label' : 'Anzahl', 'variable_name' : 'namenaktien_vorzugsaktien_kat2_n', 'show' : function(){if(shares.namen_vorzug_2.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'namenaktien_vorzugsaktien_kat2_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['namenaktien_vorzugsaktien_kat2'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.namen_vorzug_2.value).toFixed(2);}});

var text = page4.add_text({'label' : 'Bezeichnung', 'variable_name' : 'namenaktien_vorzugsaktien_kat2_bezeichnung', 'show' : function(){if(shares.namen_vorzug_2.value != 0){return true;}else{return false;}}});

var text = page4.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'namenaktien_vorzugsaktien_kat2', 'show' : function(){if(shares.namen_vorzug_2.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'namenaktien_vorzugsaktien_kat2'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page4.add_label({'label' : 'Vorzugsaktien Kategorie 3', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_vorzug_3.value != 0){return true;}else{return false;}}});

var text = page4.add_text({'label' : 'Anzahl', 'variable_name' : 'namenaktien_vorzugsaktien_kat3_n', 'show' : function(){if(shares.namen_vorzug_3.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'namenaktien_vorzugsaktien_kat3_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['namenaktien_vorzugsaktien_kat3'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.namen_vorzug_3.value).toFixed(2);}});

var text = page4.add_text({'label' : 'Bezeichnung', 'variable_name' : 'namenaktien_vorzugsaktien_kat3_bezeichnung', 'show' : function(){if(shares.namen_vorzug_3.value != 0){return true;}else{return false;}}});

var text = page4.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'namenaktien_vorzugsaktien_kat3', 'show' : function(){if(shares.namen_vorzug_3.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'namenaktien_vorzugsaktien_kat3'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page4.add_label({'label' : 'Stimmrechtsaktien', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_stimm.value != 0){return true;}else{return false;}}});

var text = page4.add_text({'label' : 'Anzahl Stimmrechtsaktien', 'variable_name' : 'namenaktien_stimmrechtsaktien_n', 'show' : function(){if(shares.namen_stimm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'namenaktien_stimmrechtsaktien_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['namenaktien_stimmrechtsaktien'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.namen_stimm.value).toFixed(2);}});

var text = page4.add_text({'label' : 'Nominalwert Stimmrechtsaktien (CHF)', 'variable_name' : 'namenaktien_stimmrechtsaktien', 'show' : function(){if(shares.namen_stimm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'namenaktien_stimmrechtsaktien'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var separator = page4.add_separator({'show' : function(){if((shares.namen_stamm.value != 0 || shares.namen_stimm.value != 0 || shares.namen_vorzug_1.value != 0 || shares.namen_vorzug_2.value != 0 || shares.namen_vorzug_3.value != 0) && (shares.inhaber_stamm.value != 0 || shares.inhaber_vorzug_1.value != 0 || shares.inhaber_vorzug_2.value != 0 || shares.inhaber_vorzug_3.value != 0)){return true;}else{return false;}}});

var label = page4.add_label({'label' : 'Inhaberaktien', 'font_size' : function(self){return '18'}, 'show' : function(){if(shares.inhaber_stamm.value != 0 || shares.inhaber_vorzug_1.value != 0 || shares.inhaber_vorzug_2.value != 0 || shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});

var label = page4.add_label({'label' : 'Stammaktien', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.inhaber_stamm.value != 0){return true;}else{return false;}}});

var text = page4.add_text({'label' : 'Anzahl Stammaktien', 'variable_name' : 'inhaberaktien_stammaktien_n', 'show' : function(){if(shares.inhaber_stamm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'inhaberaktien_stammaktien_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['inhaberaktien_stammaktien'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.inhaber_stamm.value).toFixed(2);}});

var text = page4.add_text({'label' : 'Nominalwert Stammaktien (CHF)', 'variable_name' : 'inhaberaktien_stammaktien', 'show' : function(){if(shares.inhaber_stamm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'inhaberaktien_stammaktien'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page4.add_label({'label' : 'Vorzugsaktien Kategorie 1', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.inhaber_vorzug_1.value != 0){return true;}else{return false;}}});

var text = page4.add_text({'label' : 'Anzahl', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat1_n', 'show' : function(){if(shares.inhaber_vorzug_1.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'inhaberaktien_vorzugsaktien_kat1_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['inhaberaktien_vorzugsaktien_kat1'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.inhaber_vorzug_1.value).toFixed(2);}});

var text = page4.add_text({'label' : 'Bezeichnung', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat1_bezeichnung', 'show' : function(){if(shares.inhaber_vorzug_1.value != 0){return true;}else{return false;}}});

var text = page4.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat1', 'show' : function(){if(shares.inhaber_vorzug_1.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'inhaberaktien_vorzugsaktien_kat1'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page4.add_label({'label' : 'Vorzugsaktien Kategorie 2', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.inhaber_vorzug_2.value != 0){return true;}else{return false;}}});

var text = page4.add_text({'label' : 'Anzahl', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat2_n', 'show' : function(){if(shares.inhaber_vorzug_2.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'inhaberaktien_vorzugsaktien_kat2_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['inhaberaktien_vorzugsaktien_kat2'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.inhaber_vorzug_2.value).toFixed(2);}});

var text = page4.add_text({'label' : 'Bezeichnung', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat2_bezeichnung', 'show' : function(){if(shares.inhaber_vorzug_2.value != 0){return true;}else{return false;}}});

var text = page4.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat2', 'show' : function(){if(shares.inhaber_vorzug_2.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'inhaberaktien_vorzugsaktien_kat2'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page4.add_label({'label' : 'Vorzugsaktien Kategorie 3', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});

var text = page4.add_text({'label' : 'Anzahl', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat3_n', 'show' : function(){if(shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'inhaberaktien_vorzugsaktien_kat3_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['inhaberaktien_vorzugsaktien_kat3'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.inhaber_vorzug_3.value).toFixed(2);}});

var text = page4.add_text({'label' : 'Bezeichnung', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat3_bezeichnung', 'show' : function(){if(shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});

var text = page4.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat3', 'show' : function(){if(shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien' && v[2] == 'inhaberaktien_vorzugsaktien_kat3'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var page5 = step6.add_page({'title' : 'Aktien vertreten durch Vorsitzenden', 'variable_name' : 'aktien_v', 'show' : function(){return equals(['eroffnungen', 'vertretung', 'aktien_v'], true)}});

var label = page5.add_label({'label' : 'Namenaktien', 'font_size' : function(self){return '18'}, 'show' : function(){if(shares.namen_stamm.value != 0 || shares.namen_stimm.value != 0 || shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});

var label = page5.add_label({'label' : 'Stammaktien', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_stamm.value != 0){return true;}else{return false;}}});

var text = page5.add_text({'label' : 'Anzahl Stammaktien', 'variable_name' : 'namenaktien_stammaktien_n', 'show' : function(){if(shares.namen_stamm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'namenaktien_stammaktien_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, '')); variables[v[0]][v[1]]['namenaktien_stammaktien'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.namen_stamm.value).toFixed(2);}});

var text = page5.add_text({'label' : 'Nominalwert Stammaktien (CHF)', 'variable_name' : 'namenaktien_stammaktien', 'show' : function(){if(shares.namen_stamm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'namenaktien_stammaktien'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page5.add_label({'label' : 'Vorzugsaktien Kategorie 1', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});

var text = page5.add_text({'label' : 'Anzahl', 'variable_name' : 'namenaktien_vorzugsaktien_kat1_n', 'show' : function(){if(shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'namenaktien_vorzugsaktien_kat1_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['namenaktien_vorzugsaktien_kat1'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.namen_vorzug_1.value).toFixed(2);}});

var text = page5.add_text({'label' : 'Bezeichnung', 'variable_name' : 'namenaktien_vorzugsaktien_kat1_bezeichnung', 'show' : function(){if(shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});

var text = page5.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'namenaktien_vorzugsaktien_kat1', 'show' : function(){if(shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'namenaktien_vorzugsaktien_kat1'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page5.add_label({'label' : 'Vorzugsaktien Kategorie 2', 'font_size' : function(self){return '16'}, 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_vorzug_2.value != 0){return true;}else{return false;}}});

var text = page5.add_text({'label' : 'Anzahl', 'variable_name' : 'namenaktien_vorzugsaktien_kat2_n', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_vorzug_2.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'namenaktien_vorzugsaktien_kat2_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['namenaktien_vorzugsaktien_kat2'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.namen_vorzug_2.value).toFixed(2);}});

var text = page5.add_text({'label' : 'Bezeichnung', 'variable_name' : 'namenaktien_vorzugsaktien_kat2_bezeichnung', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_vorzug_2.value != 0){return true;}else{return false;}}});

var text = page5.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'namenaktien_vorzugsaktien_kat2', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_vorzug_2.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'namenaktien_vorzugsaktien_kat2'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page5.add_label({'label' : 'Vorzugsaktien Kategorie 3', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_vorzug_3.value != 0){return true;}else{return false;}}});

var text = page5.add_text({'label' : 'Anzahl', 'variable_name' : 'namenaktien_vorzugsaktien_kat3_n', 'show' : function(){if(shares.namen_vorzug_3.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'namenaktien_vorzugsaktien_kat3_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['namenaktien_vorzugsaktien_kat3'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.namen_vorzug_3.value).toFixed(2);}});

var text = page5.add_text({'label' : 'Bezeichnung', 'variable_name' : 'namenaktien_vorzugsaktien_kat3_bezeichnung', 'show' : function(){if(shares.namen_vorzug_3.value != 0){return true;}else{return false;}}});

var text = page5.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'namenaktien_vorzugsaktien_kat3', 'show' : function(){if(shares.namen_vorzug_3.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'namenaktien_vorzugsaktien_kat3'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page5.add_label({'label' : 'Stimmrechtsaktien', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_stimm.value != 0){return true;}else{return false;}}});

var text = page5.add_text({'label' : 'Anzahl Stimmrechtsaktien', 'variable_name' : 'namenaktien_stimmrechtsaktien_n', 'show' : function(){if(shares.namen_stimm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'namenaktien_stimmrechtsaktien_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['namenaktien_stimmrechtsaktien'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.namen_stimm.value).toFixed(2);}});

var text = page5.add_text({'label' : 'Nominalwert Stimmrechtsaktien (CHF)', 'variable_name' : 'namenaktien_stimmrechtsaktien', 'show' : function(){if(shares.namen_stimm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'namenaktien_stimmrechtsaktien'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var separator = page5.add_separator({'show' : function(){if((shares.namen_stamm.value != 0 || shares.namen_stimm.value != 0 || shares.namen_vorzug_1.value != 0 || shares.namen_vorzug_2.value != 0 || shares.namen_vorzug_3.value != 0) && (shares.inhaber_stamm.value != 0 || shares.inhaber_vorzug_1.value != 0 || shares.inhaber_vorzug_2.value != 0 || shares.inhaber_vorzug_3.value != 0)){return true;}else{return false;}}});

var label = page5.add_label({'label' : 'Inhaberaktien', 'font_size' : function(self){return '18'}, 'show' : function(){if(shares.inhaber_stamm.value != 0 || shares.inhaber_vorzug_1.value != 0 || shares.inhaber_vorzug_2.value != 0 || shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});

var label = page5.add_label({'label' : 'Stammaktien', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.inhaber_stamm.value != 0){return true;}else{return false;}}});

var text = page5.add_text({'label' : 'Anzahl Stammaktien', 'variable_name' : 'inhaberaktien_stammaktien_n', 'show' : function(){if(shares.inhaber_stamm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'inhaberaktien_stammaktien_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['inhaberaktien_stammaktien'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.inhaber_stamm.value).toFixed(2);}});

var text = page5.add_text({'label' : 'Nominalwert Stammaktien (CHF)', 'variable_name' : 'inhaberaktien_stammaktien', 'show' : function(){if(shares.inhaber_stamm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'inhaberaktien_stammaktien'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page5.add_label({'label' : 'Vorzugsaktien Kategorie 1', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.inhaber_vorzug_1.value != 0){return true;}else{return false;}}});

var text = page5.add_text({'label' : 'Anzahl', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat1_n', 'show' : function(){if(shares.inhaber_vorzug_1.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'inhaberaktien_vorzugsaktien_kat1_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['inhaberaktien_vorzugsaktien_kat1'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.inhaber_vorzug_1.value).toFixed(2);}});

var text = page5.add_text({'label' : 'Bezeichnung', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat1_bezeichnung', 'show' : function(){if(shares.inhaber_vorzug_1.value != 0){return true;}else{return false;}}});

var text = page5.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat1', 'show' : function(){if(shares.inhaber_vorzug_1.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'inhaberaktien_vorzugsaktien_kat1'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page5.add_label({'label' : 'Vorzugsaktien Kategorie 2', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.inhaber_vorzug_2.value != 0){return true;}else{return false;}}});

var text = page5.add_text({'label' : 'Anzahl', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat2_n', 'show' : function(){if(shares.inhaber_vorzug_2.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'inhaberaktien_vorzugsaktien_kat2_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['inhaberaktien_vorzugsaktien_kat2'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.inhaber_vorzug_2.value).toFixed(2);}});

var text = page5.add_text({'label' : 'Bezeichnung', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat2_bezeichnung', 'show' : function(){if(shares.inhaber_vorzug_2.value != 0){return true;}else{return false;}}});

var text = page5.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat2', 'show' : function(){if(shares.inhaber_vorzug_2.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'inhaberaktien_vorzugsaktien_kat2'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page5.add_label({'label' : 'Vorzugsaktien Kategorie 3', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});

var text = page5.add_text({'label' : 'Anzahl', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat3_n', 'show' : function(){if(shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'inhaberaktien_vorzugsaktien_kat3_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['inhaberaktien_vorzugsaktien_kat3'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.inhaber_vorzug_3.value).toFixed(2);}});

var text = page5.add_text({'label' : 'Bezeichnung', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat3_bezeichnung', 'show' : function(){if(shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});

var text = page5.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat3', 'show' : function(){if(shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_v' && v[2] == 'inhaberaktien_vorzugsaktien_kat3'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var page6 = step6.add_page({'title' : 'Aktien vertreten durch Depotvertreter', 'variable_name' : 'aktien_d', 'show' : function(){return equals(['eroffnungen', 'vertretung', 'aktien_d'], true)}});

var label = page6.add_label({'label' : 'Namenaktien', 'font_size' : function(self){return '18'}, 'show' : function(){if(shares.namen_stamm.value != 0 || shares.namen_stimm.value != 0 || shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});

var label = page6.add_label({'label' : 'Stammaktien', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_stamm.value != 0){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Anzahl Stammaktien', 'variable_name' : 'namenaktien_stammaktien_n', 'show' : function(){if(shares.namen_stamm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'namenaktien_stammaktien_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['namenaktien_stammaktien'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.namen_stamm.value).toFixed(2);}});

var text = page6.add_text({'label' : 'Nominalwert Stammaktien (CHF)', 'variable_name' : 'namenaktien_stammaktien', 'show' : function(){if(shares.namen_stamm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'namenaktien_stammaktien'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page6.add_label({'label' : 'Vorzugsaktien Kategorie 1', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Anzahl', 'variable_name' : 'namenaktien_vorzugsaktien_kat1_n', 'show' : function(){if(shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'namenaktien_vorzugsaktien_kat1_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['namenaktien_vorzugsaktien_kat1'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.namen_vorzug_1.value).toFixed(2);}});

var text = page6.add_text({'label' : 'Bezeichnung', 'variable_name' : 'namenaktien_vorzugsaktien_kat1_bezeichnung', 'show' : function(){if(shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'namenaktien_vorzugsaktien_kat1', 'show' : function(){if(shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'namenaktien_vorzugsaktien_kat1'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page6.add_label({'label' : 'Vorzugsaktien Kategorie 2', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_vorzug_2.value != 0){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Anzahl', 'variable_name' : 'namenaktien_vorzugsaktien_kat2_n', 'show' : function(){if(shares.namen_vorzug_2.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'namenaktien_vorzugsaktien_kat2_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['namenaktien_vorzugsaktien_kat2'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.namen_vorzug_2.value).toFixed(2);}});

var text = page6.add_text({'label' : 'Bezeichnung', 'variable_name' : 'namenaktien_vorzugsaktien_kat2_bezeichnung', 'show' : function(){if(shares.namen_vorzug_2.value != 0){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'namenaktien_vorzugsaktien_kat2', 'show' : function(){if(shares.namen_vorzug_2.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'namenaktien_vorzugsaktien_kat2'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page6.add_label({'label' : 'Vorzugsaktien Kategorie 3', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_vorzug_3.value != 0){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Anzahl', 'variable_name' : 'namenaktien_vorzugsaktien_kat3_n', 'show' : function(){if(shares.namen_vorzug_3.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'namenaktien_vorzugsaktien_kat3_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['namenaktien_vorzugsaktien_kat3'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.namen_vorzug_3.value).toFixed(2);}});

var text = page6.add_text({'label' : 'Bezeichnung', 'variable_name' : 'namenaktien_vorzugsaktien_kat3_bezeichnung', 'show' : function(){if(shares.namen_vorzug_3.value != 0){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'namenaktien_vorzugsaktien_kat3', 'show' : function(){if(shares.namen_vorzug_3.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'namenaktien_vorzugsaktien_kat3'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page6.add_label({'label' : 'Stimmrechtsaktien', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_stimm.value != 0){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Anzahl Stimmrechtsaktien', 'variable_name' : 'namenaktien_stimmrechtsaktien_n', 'show' : function(){if(shares.namen_stimm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'namenaktien_stimmrechtsaktien_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['namenaktien_stimmrechtsaktien'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.namen_stimm.value).toFixed(2);}});

var text = page6.add_text({'label' : 'Nominalwert Stimmrechtsaktien (CHF)', 'variable_name' : 'namenaktien_stimmrechtsaktien', 'show' : function(){if(shares.namen_stimm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'namenaktien_stimmrechtsaktien'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var separator = page6.add_separator({'show' : function(){if((shares.namen_stamm.value != 0 || shares.namen_stimm.value != 0 || shares.namen_vorzug_1.value != 0 || shares.namen_vorzug_2.value != 0 || shares.namen_vorzug_3.value != 0) && (shares.inhaber_stamm.value != 0 || shares.inhaber_vorzug_1.value != 0 || shares.inhaber_vorzug_2.value != 0 || shares.inhaber_vorzug_3.value != 0)){return true;}else{return false;}}});

var label = page6.add_label({'label' : 'Inhaberaktien', 'font_size' : function(self){return '18'}, 'show' : function(){if(shares.inhaber_stamm.value != 0 || shares.inhaber_vorzug_1.value != 0 || shares.inhaber_vorzug_2.value != 0 || shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});

var label = page6.add_label({'label' : 'Stammaktien', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.inhaber_stamm.value != 0){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Anzahl Stammaktien', 'variable_name' : 'inhaberaktien_stammaktien_n', 'show' : function(){if(shares.inhaber_stamm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'inhaberaktien_stammaktien_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['inhaberaktien_stammaktien'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.inhaber_stamm.value).toFixed(2);}});

var text = page6.add_text({'label' : 'Nominalwert Stammaktien (CHF)', 'variable_name' : 'inhaberaktien_stammaktien', 'show' : function(){if(shares.inhaber_stamm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'inhaberaktien_stammaktien'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page6.add_label({'label' : 'Vorzugsaktien Kategorie 1', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.inhaber_vorzug_1.value != 0){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Anzahl', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat1_n', 'show' : function(){if(shares.inhaber_vorzug_1.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'inhaberaktien_vorzugsaktien_kat1_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['inhaberaktien_vorzugsaktien_kat1'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.inhaber_vorzug_1.value).toFixed(2);}});

var text = page6.add_text({'label' : 'Bezeichnung', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat1_bezeichnung', 'show' : function(){if(shares.inhaber_vorzug_1.value != 0){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat1', 'show' : function(){if(shares.inhaber_vorzug_1.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'inhaberaktien_vorzugsaktien_kat1'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page6.add_label({'label' : 'Vorzugsaktien Kategorie 2', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.inhaber_vorzug_2.value != 0){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Anzahl', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat2_n', 'show' : function(){if(shares.inhaber_vorzug_2.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'inhaberaktien_vorzugsaktien_kat2_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['inhaberaktien_vorzugsaktien_kat2'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.inhaber_vorzug_2.value).toFixed(2);}});

var text = page6.add_text({'label' : 'Bezeichnung', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat2_bezeichnung', 'show' : function(){if(shares.inhaber_vorzug_2.value != 0){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat2', 'show' : function(){if(shares.inhaber_vorzug_2.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'inhaberaktien_vorzugsaktien_kat2'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var label = page6.add_label({'label' : 'Vorzugsaktien Kategorie 3', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Anzahl', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat3_n', 'show' : function(){if(shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'inhaberaktien_vorzugsaktien_kat3_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseInt(variables[v[0]][v[1]][v[2]].replace(/[^0-9]/, ''));variables[v[0]][v[1]]['inhaberaktien_vorzugsaktien_kat3'] = (parseFloat(variables[v[0]][v[1]][v[2]]) * shares.inhaber_vorzug_3.value).toFixed(2);}});

var text = page6.add_text({'label' : 'Bezeichnung', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat3_bezeichnung', 'show' : function(){if(shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});

var text = page6.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat3', 'show' : function(){if(shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'eroffnungen' && v[1] == 'aktien_d' && v[2] == 'inhaberaktien_vorzugsaktien_kat3'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]] = parseFloat(variables[v[0]][v[1]][v[2]].replace(/[^0-9.]/, ''))}});

var step7 = form.add_step({'title' : 'Traktanden', 'variable_name' : 'traktanden', 'show' : function(){return equals(['generalversammlung', 'generalversammlung', 'typ'], 'protokoll')}});

var page1 = step7.add_page({'title' : 'Traktanden', 'variable_name' : 'traktanden'});

var checkbox_group = page1.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Déchargeerteilung an Revisionsstelle', 'variable_name' : 'depotvertreter'});

var separator = page1.add_separator({});

var label = page1.add_label({'label' : '1. Statutenänderung', 'font_size' : function(self){return '16'}, 'show' : function(){return equals(['verzicht', 'verzicht', 'erforderlich'], 'erforderlich')}});

var label = page1.add_label({'label' : function(){var name = get_revisionsstelle_name();if(equals(['verzicht', 'verzicht', 'erforderlich'], 'erforderlich')){return '2. Abberufung von ' + name + ' als Revisionsstelle und Verzicht auf eingeschränkte Revision (Opting-Out)'}else{return '1. Abberufung von ' + name + ' als Revisionsstelle und Verzicht auf eingeschränkte Revision (Opting-Out)'}}, 'font_size' : function(self){return '16'}});

var label = page1.add_label({'label' : function(){var name = get_revisionsstelle_name();if(equals(['verzicht', 'verzicht', 'erforderlich'], 'erforderlich')){return '3. Déchargeerteilung an ' + name + ' als Revisionsstelle'}else{return '2. Déchargeerteilung an ' + name + ' als Revisionsstelle'}}, 'font_size' : function(self){return '16'}, 'show' : function(){return equals(['traktanden', 'traktanden', 'depotvertreter'], true)}});

var step8 = form.add_step({'title' : 'Verhandlungen und Beschlüsse', 'variable_name' : 'verhandlungen', 'show' : function(){if(typeof variables['generalversammlung']['generalversammlung']['typ'] != 'undefined'){return true;}else{return false;}}});

var page0 = step8.add_page({'title' : 'Änderung der Statuten', 'variable_name' : 'anderung', 'show' : function(){return equals(['verzicht', 'verzicht', 'erforderlich'], 'erforderlich');}});

var radio = page0.add_radio({'variable_name' : 'auszahlung', 'label' : 'Auszählung der Stimmen', 'required' : true});
var option = radio.add_option({'value' : 'einstimmig',  'label' : 'Einstimmigkeit (positiv)'});
var option = radio.add_option({'value' : 'n_einstimmig', 'label' : 'Keine einstimmige Entscheidung'});

var text = page0.add_text({'label' : 'Ja-Stimmen', 'variable_name' : 'ja', 'required' : true, 'show' : function(){if(equals(['verhandlungen', 'anderung', 'auszahlung'], 'n_einstimmig')){return true;}else{return false;}}});

var text = page0.add_text({'label' : 'Nein-Stimmen', 'variable_name' : 'nein', 'required' : true, 'show' : function(){if(equals(['verhandlungen', 'anderung', 'auszahlung'], 'n_einstimmig')){return true;}else{return false;}}});

var text = page0.add_text({'label' : 'Enthaltungen', 'variable_name' : 'enthaltungen', 'required' : true, 'show' : function(){if(equals(['verhandlungen', 'anderung', 'auszahlung'], 'n_einstimmig')){return true;}else{return false;}}});

var page1 = step8.add_page({'title' : 'Verhandlungen und Beschlüsse', 'variable_name' : 'verhandlungen'});

var radio = page1.add_radio({'label' : 'Abberufung der Revisionsstelle:', 'variable_name' : 'abberufung', 'required' : true});
var option = radio.add_option({'value' : 'laufend',  'label' : 'mit Abnahme der laufenden Jahresrechnung'});
var option = radio.add_option({'value' : 'sofort', 'label' : 'mit sofortiger Wirkung'});

var separator = page1.add_separator({'show' : function(){return equals(['verhandlungen', 'verhandlungen', 'abberufung'], 'sofort')}});

var radio = page1.add_radio({'label' : 'Verzicht auf Durchführung einer eingeschränkten Revision:', 'variable_name' : 'verzicht', 'required' : true});
var option = radio.add_option({'value' : 'laufend_und_kommend',  'label' : 'für das laufende Geschäftsjahr und die kommenden Geschäftsjahre', 'show' : function(){return equals(['verhandlungen', 'verhandlungen', 'abberufung'], 'sofort')}});
var option = radio.add_option({'value' : 'abgelaufen_und_kommend', 'label' : 'für das bereits abgelaufene Geschäftsjahr, das laufende Geschäftsjahr und die kommenden Geschäftsjahre', 'show' : function(){return equals(['verhandlungen', 'verhandlungen', 'abberufung'], 'sofort')}});
var option = radio.add_option({'value' : 'mehrere_abgelaufen_und_kommend', 'label' : 'für mehrere bereits abgelaufenen Geschäftsjahre, das laufende Geschäftsjahr und die kommenden Geschäftsjahre', 'show' : function(){return equals(['verhandlungen', 'verhandlungen', 'abberufung'], 'sofort')}});
var option = radio.add_option({'value' : 'kommend', 'label' : 'für die kommenden Geschäftsjahre'});

var separator = page1.add_separator({'show' : function(){if(typeof variables['verhandlungen']['verhandlungen']['verzicht'] != 'undefined'){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Bereits abgelaufenes Geschäftsjahr, für das der Verzicht gelten soll', 'variable_name' : 'abgelaufenes', 'required' : true, 'placeholder' : 'z.B. 2017', 'show' : function(){return equals(['verhandlungen', 'verhandlungen', 'verzicht'], 'abgelaufen_und_kommend');}, 'date' : true});

var text = page1.add_text({'label' : 'Bereits abgelaufene Geschäftsjahre, für welche der Verzicht gelten soll', 'variable_name' : 'abgelaufene', 'required' : true, 'placeholder' : 'z.B. 2016, 2017', 'show' : function(){return equals(['verhandlungen', 'verhandlungen', 'verzicht'], 'mehrere_abgelaufen_und_kommend');}, 'date' : true});

var text = page1.add_text({'label' : 'Datum, ab welchem der Verzicht gelten soll', 'variable_name' : 'datum_de', 'required' : true, 'show' : function(){if(typeof variables['verhandlungen']['verhandlungen']['verzicht'] != 'undefined'){return true;}else{return false;}}, 'date' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'verhandlungen' && v[1] == 'verhandlungen' && v[2] == 'datum_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]]['datum_en'] = convert_date(variables[v[0]][v[1]][v[2]])}});

var step9 = form.add_step({'title' : 'Vollmacht(en)', 'variable_name' : 'vollmacht', 'show' : function(){return equals(['generalversammlung', 'generalversammlung', 'typ'], 'protokoll')}});

var page1 = step9.add_multipage({'title' : 'Vollmacht(en)', 'variable_name' : 'vollmacht', 'tooltip' : 'Vollmachten bedürfen der notariellen Beglaubigung. Falls die Beglaubigung im Ausland erfolgt, so ist überdies eine Apostille bzw. Überbeglaubigung erforderlich.', 'naming' : function(self, index){
    if(typeof variables['vollmacht']['vollmacht'][index]['aussteller'] == 'undefined'){
        return 'Vollmacht ' + (index + 1);
    }
    if(equals(['vollmacht', 'vollmacht', index, 'aussteller'], 'naturlich') && typeof variables['vollmacht']['vollmacht'][index]['vorname'] != 'undefined' && typeof variables['vollmacht']['vollmacht'][index]['nachname'] != 'undefined'){
        return variables['vollmacht']['vollmacht'][index]['vorname'] + ' ' + variables['vollmacht']['vollmacht'][index]['nachname'];
    }else{
        if(equals(['vollmacht', 'vollmacht', index, 'aussteller'], 'unternehmung') && typeof variables['vollmacht']['vollmacht'][index]['firma'] != 'undefined'){
            return variables['vollmacht']['vollmacht'][index]['firma'];
        }
    }
    return 'Vollmacht ' + (index + 1);
}});

var label = page1.add_label({'label' : 'Aussteller der Vollmacht', 'font_size' : function(self){return '20'}});

var radio = page1.add_radio({'label' : '', 'variable_name' : 'aussteller', 'required' : true});
var option = radio.add_option({'value' : 'naturlich',  'label' : 'Natürliche Person'});
var option = radio.add_option({'value' : 'unternehmung', 'label' : 'Unternehmung'});

var separator = page1.add_separator({'show' : function(self, index){if(typeof variables['vollmacht']['vollmacht'][index]['aussteller'] != 'undefined'){return true;}else{return false;}}});

var radio = page1.add_radio({'variable_name' : 'sex', 'required' : true, 'show' : function(self, index){return equals(['vollmacht', 'vollmacht', index, 'aussteller'], 'naturlich');}});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page1.add_text({'label' : 'Firma', 'variable_name' : 'firma', 'required' : true, 'show' : function(self, index){return equals(['vollmacht', 'vollmacht', index, 'aussteller'], 'unternehmung');}});

var text = page1.add_text({'label' : 'Sitz', 'variable_name' : 'sitz', 'required' : true, 'show' : function(self, index){return equals(['vollmacht', 'vollmacht', index, 'aussteller'], 'unternehmung');}});

var text = page1.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true, 'show' : function(self, index){return equals(['vollmacht', 'vollmacht', index, 'aussteller'], 'naturlich');}});
var text = page1.add_text({'label' : 'Nachname', 'variable_name' : 'nachname', 'required' : true, 'show' : function(self, index){return equals(['vollmacht', 'vollmacht', index, 'aussteller'], 'naturlich');}});
var text = page1.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional', 'show' : function(self, index){return equals(['vollmacht', 'vollmacht', index, 'aussteller'], 'naturlich');}});
var text = page1.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional', 'show' : function(self, index){return equals(['vollmacht', 'vollmacht', index, 'aussteller'], 'naturlich');}});

var text = page1.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'required' : true, 'show' : function(self, index){if(typeof variables['vollmacht']['vollmacht'][index]['aussteller'] != 'undefined'){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de', 'required' : true, 'show' : function(self, index){if(typeof variables['vollmacht']['vollmacht'][index]['aussteller'] != 'undefined'){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en', 'required' : true, 'show' : function(self, index){if(typeof variables['vollmacht']['vollmacht'][index]['aussteller'] != 'undefined'){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Land (Detusch)', 'variable_name' : 'land_de', 'required' : true, 'show' : function(self, index){if(typeof variables['vollmacht']['vollmacht'][index]['aussteller'] != 'undefined'){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Land (Englisch)', 'variable_name' : 'land_en', 'required' : true, 'show' : function(self, index){if(typeof variables['vollmacht']['vollmacht'][index]['aussteller'] != 'undefined'){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Zeichnungsberechtigter 1', 'variable_name' : 'zeichnung_1', 'required' : true, 'show' : function(self, index){return equals(['vollmacht', 'vollmacht', index, 'aussteller'], 'unternehmung');}});

var checkbox_group = page1.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Zweiter Zeichnungsberechtigter', 'variable_name' : 'z_zeichnung', 'show' : function(self, index){return equals(['vollmacht', 'vollmacht', index, 'aussteller'], 'unternehmung')}});

var text = page1.add_text({'label' : 'Zeichnungsberechtigter 2', 'variable_name' : 'zeichnung_2', 'required' : true, 'show' : function(self, index){return equals(['vollmacht', 'vollmacht', index, 'aussteller'], 'unternehmung') && equals(['vollmacht', 'vollmacht', index, 'z_zeichnung'], true);}});

var separator = page1.add_separator({});

var label = page1.add_label({'label' : 'Bevollmächtigter', 'font_size' : function(self){return '20'}});

var radio = page1.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page1.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true});

var text = page1.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true});
var text = page1.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional'});
var text = page1.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional'});
var text = page1.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'required' : true});
var text = page1.add_text({'label' : 'Ort (Deutsch)', 'variable_name' : 'ort_de', 'required' : true});
var text = page1.add_text({'label' : 'Ort (Englisch)', 'variable_name' : 'ort_en', 'required' : true});

var text = page1.add_text({'label' : 'Land (Detusch)', 'variable_name' : 'land_de', 'required' : true});
var text = page1.add_text({'label' : 'Land (Englisch)', 'variable_name' : 'land_en', 'required' : true});

var separator = page1.add_separator({});

var label = page1.add_label({'label' : function(self, index){if(equals(['vollmacht', 'vollmacht', index, 'sex'], 'frau')){return 'Durch Bevollmächtigte zu vertretende Aktien'}else{return 'Durch Bevollmächtigten zu vertretende Aktien'}}, 'font_size' : function(self){return '20'}});

var label = page1.add_label({'label' : 'Namenaktien', 'font_size' : function(self){return '18'}, 'show' : function(){if(shares.namen_stamm.value != 0 || shares.namen_stimm.value != 0 || shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});

var label = page1.add_label({'label' : 'Stammaktien', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_stamm.value != 0){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Anzahl Stammaktien', 'variable_name' : 'namenaktien_stammaktien_n', 'show' : function(){if(shares.namen_stamm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'namenaktien_stammaktien_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseInt(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9]/, ''));variables[v[0]][v[1]][v[2]]['namenaktien_stammaktien'] = (parseFloat(variables[v[0]][v[1]][v[2]][v[3]]) * shares.namen_stamm.value).toFixed(2);}});

var text = page1.add_text({'label' : 'Nominalwert Stammaktien (CHF)', 'variable_name' : 'namenaktien_stammaktien', 'show' : function(){if(shares.namen_stamm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'namenaktien_stammaktien'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseFloat(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9.]/, ''))}});

var label = page1.add_label({'label' : 'Vorzugsaktien Kategorie 1', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Anzahl', 'variable_name' : 'namenaktien_vorzugsaktien_kat1_n', 'show' : function(){if(shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'namenaktien_vorzugsaktien_kat1_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseInt(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9]/, ''));variables[v[0]][v[1]][v[2]]['namenaktien_vorzugsaktien_kat1'] = (parseFloat(variables[v[0]][v[1]][v[2]][v[3]]) * shares.namen_vorzug_1.value).toFixed(2);}});

var text = page1.add_text({'label' : 'Bezeichnung', 'variable_name' : 'namenaktien_vorzugsaktien_kat1_bezeichnung', 'show' : function(){if(shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'namenaktien_vorzugsaktien_kat1', 'show' : function(){if(shares.namen_vorzug_1.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'namenaktien_vorzugsaktien_kat1'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseFloat(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9.]/, ''))}});

var label = page1.add_label({'label' : 'Vorzugsaktien Kategorie 2', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_vorzug_2.value != 0){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Anzahl', 'variable_name' : 'namenaktien_vorzugsaktien_kat2_n', 'show' : function(){if(shares.namen_vorzug_2.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'namenaktien_vorzugsaktien_kat2_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseInt(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9]/, ''));variables[v[0]][v[1]][v[2]]['namenaktien_vorzugsaktien_kat2'] = (parseFloat(variables[v[0]][v[1]][v[2]][v[3]]) * shares.namen_vorzug_2.value).toFixed(2);}});

var text = page1.add_text({'label' : 'Bezeichnung', 'variable_name' : 'namenaktien_vorzugsaktien_kat2_bezeichnung', 'show' : function(){if(shares.namen_vorzug_2.value != 0){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'namenaktien_vorzugsaktien_kat2', 'show' : function(){if(shares.namen_vorzug_2.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'namenaktien_vorzugsaktien_kat2'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseFloat(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9.]/, ''))}});

var label = page1.add_label({'label' : 'Vorzugsaktien Kategorie 3', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_vorzug_3.value != 0){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Anzahl', 'variable_name' : 'namenaktien_vorzugsaktien_kat3_n', 'show' : function(){if(shares.namen_vorzug_3.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'namenaktien_vorzugsaktien_kat3_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseInt(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9]/, ''));variables[v[0]][v[1]][v[2]]['namenaktien_vorzugsaktien_kat3'] = (parseFloat(variables[v[0]][v[1]][v[2]][v[3]]) * shares.namen_vorzug_3.value).toFixed(2);}});

var text = page1.add_text({'label' : 'Bezeichnung', 'variable_name' : 'namenaktien_vorzugsaktien_kat3_bezeichnung', 'show' : function(){if(shares.namen_vorzug_3.value != 0){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'namenaktien_vorzugsaktien_kat3', 'show' : function(){if(shares.namen_vorzug_3.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'namenaktien_vorzugsaktien_kat3'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseFloat(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9.]/, ''))}});

var label = page1.add_label({'label' : 'Stimmrechtsaktien', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.namen_stimm.value != 0){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Anzahl Stimmrechtsaktien', 'variable_name' : 'namenaktien_stimmrechtsaktien_n', 'show' : function(){if(shares.namen_stimm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'namenaktien_stimmrechtsaktien_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseInt(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9]/, ''));variables[v[0]][v[1]][v[2]]['namenaktien_stimmrechtsaktien'] = (parseFloat(variables[v[0]][v[1]][v[2]][v[3]]) * shares.namen_stimm.value).toFixed(2);}});

var text = page1.add_text({'label' : 'Nominalwert Stimmrechtsaktien (CHF)', 'variable_name' : 'namenaktien_stimmrechtsaktien', 'show' : function(){if(shares.namen_stimm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'namenaktien_stimmrechtsaktien'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseFloat(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9.]/, ''))}});

var separator = page1.add_separator({'show' : function(){if((shares.namen_stamm.value != 0 || shares.namen_stimm.value != 0 || shares.namen_vorzug_1.value != 0 || shares.namen_vorzug_2.value != 0 || shares.namen_vorzug_3.value != 0) && (shares.inhaber_stamm.value != 0 || shares.inhaber_vorzug_1.value != 0 || shares.inhaber_vorzug_2.value != 0 || shares.inhaber_vorzug_3.value != 0)){return true;}else{return false;}}});

var label = page1.add_label({'label' : 'Inhaberaktien', 'font_size' : function(self){return '18'}, 'show' : function(){if(shares.inhaber_stamm.value != 0 || shares.inhaber_vorzug_1.value != 0 || shares.inhaber_vorzug_2.value != 0 || shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});

var label = page1.add_label({'label' : 'Stammaktien', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.inhaber_stamm.value != 0){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Anzahl Stammaktien', 'variable_name' : 'inhaberaktien_stammaktien_n', 'show' : function(){if(shares.inhaber_stamm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'inhaberaktien_stammaktien_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseInt(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9]/, ''));variables[v[0]][v[1]][v[2]]['inhaberaktien_stammaktien'] = (parseFloat(variables[v[0]][v[1]][v[2]][v[3]]) * shares.inhaber_stamm.value).toFixed(2);}});

var text = page1.add_text({'label' : 'Nominalwert Stammaktien (CHF)', 'variable_name' : 'inhaberaktien_stammaktien', 'show' : function(){if(shares.inhaber_stamm.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'inhaberaktien_stammaktien'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseFloat(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9.]/, ''))}});

var label = page1.add_label({'label' : 'Vorzugsaktien Kategorie 1', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.inhaber_vorzug_1.value != 0){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Anzahl', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat1_n', 'show' : function(){if(shares.inhaber_vorzug_1.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'inhaberaktien_vorzugsaktien_kat1_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseInt(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9]/, ''));variables[v[0]][v[1]][v[2]]['inhaberaktien_vorzugsaktien_kat1'] = (parseFloat(variables[v[0]][v[1]][v[2]][v[3]]) * shares.inhaber_vorzug_1.value).toFixed(2);}});

var text = page1.add_text({'label' : 'Bezeichnung', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat1_bezeichnung', 'show' : function(){if(shares.inhaber_vorzug_1.value != 0){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat1', 'show' : function(){if(shares.inhaber_vorzug_1.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'inhaberaktien_vorzugsaktien_kat1'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseFloat(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9.]/, ''))}});

var label = page1.add_label({'label' : 'Vorzugsaktien Kategorie 2', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.inhaber_vorzug_2.value != 0){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Anzahl', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat2_n', 'show' : function(){if(shares.inhaber_vorzug_2.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'inhaberaktien_vorzugsaktien_kat2_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseInt(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9]/, ''));variables[v[0]][v[1]][v[2]]['inhaberaktien_vorzugsaktien_kat2'] = (parseFloat(variables[v[0]][v[1]][v[2]][v[3]]) * shares.inhaber_vorzug_2.value).toFixed(2);}});

var text = page1.add_text({'label' : 'Bezeichnung', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat2_bezeichnung', 'show' : function(){if(shares.inhaber_vorzug_2.value != 0){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat2', 'show' : function(){if(shares.inhaber_vorzug_2.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'inhaberaktien_vorzugsaktien_kat2'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseFloat(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9.]/, ''))}});

var label = page1.add_label({'label' : 'Vorzugsaktien Kategorie 3', 'font_size' : function(self){return '16'}, 'show' : function(){if(shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Anzahl', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat3_n', 'show' : function(){if(shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'inhaberaktien_vorzugsaktien_kat3_n'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseInt(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9]/, ''));variables[v[0]][v[1]][v[2]]['inhaberaktien_vorzugsaktien_kat3'] = (parseFloat(variables[v[0]][v[1]][v[2]][v[3]]) * shares.inhaber_vorzug_3.value).toFixed(2);}});

var text = page1.add_text({'label' : 'Bezeichnung', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat3_bezeichnung', 'show' : function(){if(shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'inhaberaktien_vorzugsaktien_kat3', 'show' : function(){if(shares.inhaber_vorzug_3.value != 0){return true;}else{return false;}}});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'vollmacht' && v[1] == 'vollmacht' && v[3] == 'inhaberaktien_vorzugsaktien_kat3'){return true}else{return false}}, 'assignment' : function(v){
    variables[v[0]][v[1]][v[2]][v[3]] = parseFloat(variables[v[0]][v[1]][v[2]][v[3]].replace(/[^0-9.]/, ''))}});

var separator = page1.add_separator({'show' : function(self, index){return equals(['vollmacht', 'vollmacht', 0, 'aussteller'], 'unternehmung');}});

var checkbox_group = page1.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : function(self, index){if(equals(['vollmacht', 'vollmacht', 0, 'sex'],'frau')){return 'Bevollmächtigte ist Organ der Gesellschaft oder eine andere von der Gesellschaft abhängige Person'}else{return 'Bevollmächtigter ist Organ der Gesellschaft oder eine andere von der Gesellschaft abhängige Person'}}, 'variable_name' : 'organ', 'show' : function(self, index){return equals(['vollmacht', 'vollmacht', 0, 'aussteller'], 'unternehmung');}});


var step10 = form.add_step({'title' : 'Traktanden', 'variable_name' : 'traktanden', 'show' : function(){return equals(['generalversammlung', 'generalversammlung', 'typ'], 'zirkular')}});

var page1 = step10.add_page({'title' : 'Traktanden', 'variable_name' : 'traktanden'});

var checkbox_group = page1.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Déchargeerteilung an Revisionsstelle', 'variable_name' : 'depotvertreter'});

var separator = page1.add_separator({});


var label = page1.add_label({'label' : function(){var name = get_revisionsstelle_name();return '1. Abberufung von ' + name + ' als Revisionsstelle und Verzicht auf eingeschränkte Revision (Opting-Out)'}, 'font_size' : function(self){return '16'}});

var label = page1.add_label({'label' : function(){var name = get_revisionsstelle_name();return '2. Déchargeerteilung an ' + name + ' als Revisionsstelle'}, 'font_size' : function(self){return '16'}, 'show' : function(){return equals(['traktanden', 'traktanden', 'depotvertreter'], true)}});

var step10 = form.add_step({'title' : 'Aktionäre', 'variable_name' : 'aktionare', 'show' : function(){return equals(['generalversammlung', 'generalversammlung', 'typ'], 'zirkular')}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'aktionare' && v[1] == 'aktionar'){return true}else{return false}}, 'assignment' : function(){variables['aktionare']['sex'] = aktionare_sex();}});

var page1 = step10.add_multipage({'title' : 'Aktionär', 'variable_name' : 'aktionar', 'naming' : function(self, index){
    if(typeof variables['aktionare']['aktionar'][index]['typ'] == 'undefined'){
        return 'Aktionär ' + (index + 1);
    }
    if(equals(['aktionare', 'aktionar', index, 'typ'], 'person') && typeof variables['aktionare']['aktionar'][index]['vorname'] != 'undefined' && typeof variables['aktionare']['aktionar'][index]['nachname'] != 'undefined'){
        return variables['aktionare']['aktionar'][index]['vorname'] + ' ' + variables['aktionare']['aktionar'][index]['nachname'];
    }else{
        if(equals(['aktionare', 'aktionar', index, 'typ'], 'gesellschaft') && typeof variables['aktionare']['aktionar'][index]['firma'] != 'undefined'){
            return variables['aktionare']['aktionar'][index]['firma'];
        }
    }
    return 'Aktionär ' + (index + 1);
}});

var radio = page1.add_radio({'variable_name' : 'typ', 'required' : true, 'label' : ''});
var option = radio.add_option({'value' : 'gesellschaft', 'label' : 'Gesellschaft'});
var option = radio.add_option({'value' : 'person', 'label' : 'Natürliche Person'});

var separator = page1.add_separator({'show' : function(self, index){if(typeof variables['aktionare']['aktionar'][index]['typ'] != 'undefined'){return true;}else{return false;}}});

var radio = page1.add_radio({'variable_name' : 'sex', 'required' : true, 'show' : function(self, index){if(equals(['aktionare', 'aktionar', index, 'typ'], 'person')){return true;}else{return false;}}});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page1.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true, 'show' : function(self, index){if(equals(['aktionare', 'aktionar', index, 'typ'], 'person')){return true;}else{return false;}}});
var text = page1.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true, 'show' : function(self, index){if(equals(['aktionare', 'aktionar', index, 'typ'], 'person')){return true;}else{return false;}}});
var text = page1.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional', 'show' : function(self, index){if(equals(['aktionare', 'aktionar', index, 'typ'], 'person')){return true;}else{return false;}}});
var text = page1.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional', 'show' : function(self, index){if(equals(['aktionare', 'aktionar', index, 'typ'], 'person')){return true;}else{return false;}}});


var text = page1.add_text({'label' : 'Firma', 'variable_name' : 'firma', 'required' : true, 'show' : function(self, index){return equals(['aktionare', 'aktionar', index, 'typ'], 'gesellschaft');}});

var text = page1.add_text({'label' : 'Zeichnungsberechtigter 1', 'variable_name' : 'zeichnung_1', 'required' : true, 'show' : function(self, index){return equals(['aktionare', 'aktionar', index, 'typ'], 'gesellschaft');}});

var checkbox_group = page1.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Zweiter Zeichnungsberechtigter', 'variable_name' : 'z_zeichnung', 'show' : function(self, index){return equals(['aktionare', 'aktionar', index, 'typ'], 'gesellschaft');}});

var text = page1.add_text({'label' : 'Zeichnungsberechtigter 2', 'variable_name' : 'zeichnung_2', 'required' : true, 'show' : function(self, index){return equals(['aktionare', 'aktionar', index, 'typ'], 'gesellschaft') && equals(['aktionare', 'aktionar', index, 'z_zeichnung'], true);}});

var step2 = form.add_step({'title':'Formalitäten', 'variable_name':'formalitaten'});

var page1 = step2.add_page({'title':'Handelsregistergebühren', 'variable_name':'gebuhren', 'required' : true});

var checkbox_group = page1.add_checkbox_group({'label' : 'Gebührenadresse'});
var checkbox = checkbox_group.add_checkbox({'label' : 'Gebührenadresse entspricht nicht dem Rechtsdomizil der Gesellschaft', 'variable_name' : 'gebuhren'});

var separator = page1.add_separator({'show' : function(){if(equals(['formalitaten', 'gebuhren', 'gebuhren'], true)){return true;}else{return false;}}});

var text = page1.add_text({'label' : 'Vorname, Name oder Firma', 'variable_name' : 'vorname', 'required' : true, 'show' : function(){if(equals(['formalitaten', 'gebuhren', 'gebuhren'], true)){return true;}else{return false;}}});
var text = page1.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'required' : true, 'show' : function(){if(equals(['formalitaten', 'gebuhren', 'gebuhren'], true)){return true;}else{return false;}}});
var text = page1.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de', 'required' : true, 'show' : function(){if(equals(['formalitaten', 'gebuhren', 'gebuhren'], true)){return true;}else{return false;}}});
var text = page1.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en', 'required' : true, 'show' : function(){if(equals(['formalitaten', 'gebuhren', 'gebuhren'], true)){return true;}else{return false;}}});
var text = page1.add_text({'label' : 'Land (Deutsch)', 'variable_name' : 'land_de', 'required' : true, 'show' : function(){if(equals(['formalitaten', 'gebuhren', 'gebuhren'], true)){return true;}else{return false;}}});
var text = page1.add_text({'label' : 'Land (Englisch)', 'variable_name' : 'land_en', 'required' : true, 'show' : function(){if(equals(['formalitaten', 'gebuhren', 'gebuhren'], true)){return true;}else{return false;}}});

var page2 = step2.add_page({'title':'Bestellungen', 'variable_name':'bestellungen', 'required' : true});

var checkbox_group = page2.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Bestellungen', 'variable_name' : 'bestellungen'});

var separator = page2.add_separator({'show' : function(self, index){return equals(['formalitaten', 'bestellungen',  'bestellungen'], true)}});

var text = page2.add_text({'label' : 'Anzahl Handelsregisterauszüge', 'variable_name' : 'anzahl', 'default' : '1', 'required' : true, 'show' : function(self, index){return equals(['formalitaten', 'bestellungen',  'bestellungen'], true)}});

var checkbox_group = page2.add_checkbox_group({'label' : '', 'show' : function(self, index){return equals(['formalitaten', 'bestellungen',  'bestellungen'], true)}});
var checkbox = checkbox_group.add_checkbox({'label' : 'vor SHAB-Publikation ', 'variable_name' : 'shab'});

var radio = page2.add_radio({'variable_name' : 'lieferung', 'default' : 'gesellschaft', 'required' : true, 'label' : 'Lieferung an', 'show' : function(self, index){return equals(['formalitaten', 'bestellungen',  'bestellungen'], true)}});
var option = radio.add_option({'value' : 'gesellschaft',  'label' : 'Adresse Gesellschaft'});
var option = radio.add_option({'value' : 'andere', 'label' : 'Andere Lieferadresse'});

var text = page2.add_text({'label' : 'Vorname, Name oder Firma', 'variable_name' : 'liefer_name', 'required' : true, 'show' : function(){if(equals(['formalitaten', 'bestellungen', 'bestellungen'], true) && equals(['formalitaten', 'bestellungen', 'lieferung'], 'andere')){return true;}else{return false;}}});
var text = page2.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'liefer_strasse', 'required' : true, 'show' : function(){if(equals(['formalitaten', 'bestellungen', 'bestellungen'], true) && equals(['formalitaten', 'bestellungen', 'lieferung'], 'andere')){return true;}else{return false;}}});
var text = page2.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'liefer_plz_de', 'required' : true, 'show' : function(){if(equals(['formalitaten', 'bestellungen', 'bestellungen'], true) && equals(['formalitaten', 'bestellungen', 'lieferung'], 'andere')){return true;}else{return false;}}});
var text = page2.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'liefer_plz_en', 'required' : true, 'show' : function(){if(equals(['formalitaten', 'bestellungen', 'bestellungen'], true) && equals(['formalitaten', 'bestellungen', 'lieferung'], 'andere')){return true;}else{return false;}}});
var text = page2.add_text({'label' : 'Land (Detusch)', 'variable_name' : 'liefer_land_de', 'required' : true, 'show' : function(){if(equals(['formalitaten', 'bestellungen', 'bestellungen'], true) && equals(['formalitaten', 'bestellungen', 'lieferung'], 'andere')){return true;}else{return false;}}});
var text = page2.add_text({'label' : 'Land (Englisch)', 'variable_name' : 'liefer_land_en', 'required' : true, 'show' : function(){if(equals(['formalitaten', 'bestellungen', 'bestellungen'], true) && equals(['formalitaten', 'bestellungen', 'lieferung'], 'andere')){return true;}else{return false;}}});

var page3 = step2.add_page({'title':'Ort und Datum der Handelsregisteranmeldung', 'variable_name':'ort'});

var checkbox_group = page3.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Nachträgliche Eintragung von Ort und Datum von Hand', 'variable_name' : 'ort_hand'});

var separator = page3.add_separator({'show' : function(){if(typeof variables['formalitaten']['ort']['ort_hand'] == 'undefined' || equals(['formalitaten', 'ort', 'ort_hand'], false)){return true;}else{return false;}}});

var text = page3.add_text({'label' : 'Ort der Handelsregisteranmeldung', 'variable_name' : 'ort', 'required' : true, 'show' : function(){if(typeof variables['formalitaten']['ort']['ort_hand'] == 'undefined' || equals(['formalitaten', 'ort', 'ort_hand'], false)){return true;}else{return false;}}});

var text = page3.add_text({'label' : 'Datum der Handelsregisteranmeldung', 'variable_name' : 'datum_de', 'required' : true, 'show' : function(){if(typeof variables['formalitaten']['ort']['ort_hand'] == 'undefined' || equals(['formalitaten', 'ort', 'ort_hand'], false)){return true;}else{return false;}}, 'date' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'formalitaten' && v[1] == 'ort' && v[2] == 'datum_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]]['datum_en'] = convert_date(variables[v[0]][v[1]][v[2]])}});

var page3 = step2.add_page({'title':'Datum der Erklärung des Verwaltungsrates gemäss Art. 62 HRegV', 'variable_name':'datum'});

var text = page3.add_text({'label' : 'Datum', 'variable_name' : 'datum_de', 'required' : true, 'date' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'formalitaten' && v[1] == 'datum' && v[2] == 'datum_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]]['datum_en'] = convert_date(variables[v[0]][v[1]][v[2]])}});

var page5 = step2.add_page({'title' : 'Mitglieder des Verwaltungsrates, welche die Handelsregisteranmeldung und die Erklärung des Verwaltungsrates gemäss Art. 62 HRegV unterzeichnen', 'variable_name' : 'unterzeichnende'});

var text = page5.add_modelselect(verwaltungsrat_model, {'label' : 'Unterzeichnender', 'variable_name' : 'unterzeichnende_1', 'required' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'formalitaten' && v[2] == 'unterzeichnende_1'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]]['unterzeichnende_1_array'] = parse_vorsitzender(variables[v[0]][v[1]][v[2]]);variables[v[0]][v[1]]['vorname_1'] = variables['angaben']['verwaltungsrat'][variables[v[0]][v[1]]['unterzeichnende_1_array'][2]]['vorname'];variables[v[0]][v[1]]['nachname_1'] = variables['angaben']['verwaltungsrat'][variables[v[0]][v[1]]['unterzeichnende_1_array'][2]]['nachname'];variables[v[0]][v[1]]['funktion_de_1'] = variables['angaben']['verwaltungsrat'][variables[v[0]][v[1]]['unterzeichnende_1_array'][2]]['funktion_de'];variables[v[0]][v[1]]['funktion_en_1'] = variables['angaben']['verwaltungsrat'][variables[v[0]][v[1]]['unterzeichnende_1_array'][2]]['funktion_en']}});

var text = page5.add_text({'label' : 'Vorname', 'variable_name' : 'vorname_1', 'required' : true});

var text = page5.add_text({'label' : 'Name', 'variable_name' : 'nachname_1', 'required' : true});

var text = page5.add_text({'label' : 'Funktion (Deutsch)', 'variable_name' : 'funktion_de_1', 'required' : true});

var text = page5.add_text({'label' : 'Funktion (Englisch)', 'variable_name' : 'funktion_en_1', 'required' : true});

var separator = page5.add_separator({});

var checkbox_group = page5.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Zweiter Unterzeichnender', 'variable_name' : 'zweiter'});

var text = page5.add_modelselect(verwaltungsrat_model, {'label' : 'Unterzeichnender', 'variable_name' : 'unterzeichnende_2', 'required' : true, 'show' : function(){return equals(['formalitaten', 'unterzeichnende', 'zweiter'], true)}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'formalitaten' && v[2] == 'unterzeichnende_2'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]]['unterzeichnende_2_array'] = parse_vorsitzender(variables[v[0]][v[1]][v[2]]);variables[v[0]][v[1]]['vorname_2'] = variables['angaben']['verwaltungsrat'][variables[v[0]][v[1]]['unterzeichnende_2_array'][2]]['vorname'];variables[v[0]][v[1]]['nachname_2'] = variables['angaben']['verwaltungsrat'][variables[v[0]][v[1]]['unterzeichnende_2_array'][2]]['nachname'];variables[v[0]][v[1]]['funktion_de_2'] = variables['angaben']['verwaltungsrat'][variables[v[0]][v[1]]['unterzeichnende_2_array'][2]]['funktion_de'];variables[v[0]][v[1]]['funktion_en_2'] = variables['angaben']['verwaltungsrat'][variables[v[0]][v[1]]['unterzeichnende_2_array'][2]]['funktion_en']}, 'show' : function(){return equals(['formalitaten', 'unterzeichnende', 'zweiter'], true)}});

var text = page5.add_text({'label' : 'Vorname', 'variable_name' : 'vorname_2', 'required' : true, 'show' : function(){return equals(['formalitaten', 'unterzeichnende', 'zweiter'], true)}});

var text = page5.add_text({'label' : 'Name', 'variable_name' : 'nachname_2', 'required' : true, 'show' : function(){return equals(['formalitaten', 'unterzeichnende', 'zweiter'], true)}});

var text = page5.add_text({'label' : 'Funktion', 'variable_name' : 'funktion_de_2', 'required' : true, 'show' : function(){return equals(['formalitaten', 'unterzeichnende', 'zweiter'], true)}});

var text = page5.add_text({'label' : 'Funktion', 'variable_name' : 'funktion_en_2', 'required' : true, 'show' : function(){return equals(['formalitaten', 'unterzeichnende', 'zweiter'], true)}});

                            
form.render();