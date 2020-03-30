/*GmbH Gründung Barliberierung*/


function convert_date(datum){
    var output = datum
    var replacements = [['.',''], ['Januar', 'January'],['Februar', 'February'],['März', 'March'],['Mai', 'May'], ['Juni', 'June'],['Juli', 'July'], ['Oktober', 'October'], ['Dezember', 'December']]
    
    for(var i = 0; i<replacements.length; i++){
       output = output.replace(replacements[i][0], replacements[i][1])
    }
    
    return output
}

function grunder_sex(){
    var female = false;
    var male = false;
    var company = false;
    n = 0;
    for(var i=0;i<variables['grunder']['snp'].length;i++){
        company = false
        if(variables['grunder']['snp'][i]['sex'] == 'frau'){
            female = true;
        }
        else{
            male = true;
        }
        n = n+1;
    }
    
    for(var i=0;i<variables['grunder']['anp'].length;i++){
        company = false
        if(variables['grunder']['anp'][i]['sex'] == 'frau'){
            female = true;
        }
        else{
            male = true;
        }
        n = n+1;
    }
    
    for(var i=0;i<variables['grunder']['sjp'].length;i++){
        company = true
        n = n+1;
    }
    
    for(var i=0;i<variables['grunder']['ag'].length;i++){
        company = true
        n = n+1;
    }
        
    if(n==1){
        if(male){
            return 'ms';
        }
        else if(female){
            return 'fs';
        }
        else{
            return 'cs';
        }
    }
    else{
        if(male || company){
            return 'mp';
        }
        else{
            return 'fp';
        }
        
    }
    
}

function geschaftsfuhrer_sex(){
    var female = false;
    var male = false;
    n = 0;
    for(var i=0;i<variables['geschaftsfuhrer']['snp'].length;i++){
        if(variables['geschaftsfuhrer']['snp'][i]['sex'] == 'frau'){
            female = true;
        }
        else{
            male = true;
        }
        n = n+1;
    }
    
    for(var i=0;i<variables['geschaftsfuhrer']['anp'].length;i++){
        if(variables['geschaftsfuhrer']['anp'][i]['sex'] == 'frau'){
            female = true;
        }
        else{
            male = true;
        }
        n = n+1;
    }
    
    for(var i=0;i<variables['geschaftsfuhrer']['sfv'].length;i++){
        if(variables['geschaftsfuhrer']['sfv'][i]['sex'] == 'frau'){
            female = true;
        }
        else{
            male = true;
        }
        n = n+1;
    }
    
    for(var i=0;i<variables['geschaftsfuhrer']['afv'].length;i++){
        if(variables['geschaftsfuhrer']['afv'][i]['sex'] == 'frau'){
            female = true;
        }
        else{
            male = true;
        }
        n = n+1;
    }
        
    if(n==1){
        if(male){
            return 'ms';
        }
        else{
            return 'fs';
        }
    }
    else{
        if(male){
            return 'mp';
        }
        else{
            return 'fp';
        }
        
    }
    
}

function parse_vertreter(vertreter){
    //remove brackets
    var string = vertreter.substring(1, vertreter.length-1)
    return string.replace(/ /g,'').split(',')
}


function parse_vorsitzender(vorsitzender){
    //remove brackets
    var string = vorsitzender.substring(1, vorsitzender.length-1)
    var temp = string.replace(/ /g,'').split(',')
    temp[2] = parseInt(temp[2])
    return temp
}

function format_money(input){
    return input.toString().replace(new RegExp(/[^0-9]/, 'g'), '').replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1'")
}

function find_vertreter(){
    //Initialize vertritt
    for(var i=0; i < variables['grunder']['snp'].length;i++){
        variables['grunder']['snp'][i]['vertritt'] = []
    }
    for(var i=0; i < variables['grunder']['anp'].length;i++){
        variables['grunder']['anp'][i]['vertritt'] = []
    }
    
    //Extract vertreter from SNP
    for(var i=0; i < variables['grunder']['snp'].length;i++){
        if(typeof variables['grunder']['snp'][i]['vertreter'] != 'undefined' && variables['grunder']['snp'][i]['vertreter'] != ''){
            var vertreter = parse_vertreter(variables['grunder']['snp'][i]['vertreter'])
            variables['grunder'][vertreter[1]][vertreter[2]].vertritt.push(['snp', i])
        }
    }
    
    //Extract vertreter from ANP
    for(var i=0; i < variables['grunder']['anp'].length;i++){
        if(typeof variables['grunder']['anp'][i]['vertreter'] != 'undefined' && variables['grunder']['anp'][i]['vertreter'] != ''){
            var vertreter = parse_vertreter(variables['grunder']['anp'][i]['vertreter'])
            variables['grunder'][vertreter[1]][vertreter[2]].vertritt.push(['anp', i])
        }
    }
    
    //Extract vertreter from SJP
    for(var i=0; i < variables['grunder']['sjp'].length;i++){
        if(typeof variables['grunder']['sjp'][i]['vertreter'] != 'undefined' && variables['grunder']['sjp'][i]['vertreter'] != ''){
            var vertreter = parse_vertreter(variables['grunder']['sjp'][i]['vertreter'])
            variables['grunder'][vertreter[1]][vertreter[2]].vertritt.push(['sjp', i])
        }
    }
    
    //Extract vertreter from AG
    for(var i=0; i < variables['grunder']['ag'].length;i++){
        if(typeof variables['grunder']['ag'][i]['vertreter'] != 'undefined' && variables['grunder']['ag'][i]['vertreter'] != ''){
            var vertreter = parse_vertreter(variables['grunder']['ag'][i]['vertreter'])
            variables['grunder'][vertreter[1]][vertreter[2]].vertritt.push(['ag', i])
        }
    }
    
    signature_list()
    erschienen()
    vertreter_n()
}

function signature_list(){
    var list = []
    
    for(var i=0; i < variables['grunder']['snp'].length;i++){
        if(equals(['grunder', 'snp', i, 'vertretung'], true)){
            if(equals(['grunder', 'snp', i, 'typ'], 'andere')){
                list.push(['snp', 'anderer', ['grunder', 'snp', i]])
            }
            else if(variables['grunder']['snp'][i]['vertritt'].length > 0){
                list.push(['snp', 'vertritt', ['grunder', 'snp', i], variables['grunder']['snp'][i]['vertritt']])
            }
        }
        else{
            list.push(['snp', 'standard', ['grunder', 'snp', i]])
        }
    }
    
    for(var i=0; i < variables['grunder']['anp'].length;i++){
        if(equals(['grunder', 'anp', i, 'vertretung'], true)){
            if(equals(['grunder', 'anp', i, 'typ'], 'andere')){
                list.push(['anp', 'anderer', ['grunder', 'anp', i]])
            }
            else if(variables['grunder']['anp'][i]['vertritt'].length > 0){
                list.push(['anp', 'vertritt', ['grunder', 'anp', i], variables['grunder']['anp'][i]['vertritt']])
            }
        }
        else{
            list.push(['anp', 'standard', ['grunder', 'anp', i]])
        }
    }
    
    for(var i=0; i < variables['grunder']['sjp'].length;i++){
        if(equals(['grunder', 'sjp', i, 'vertretung'], 'mitglied')){
            list.push(['sjp', 'mitglied', ['grunder', 'sjp', i]])
        }
        else if(equals(['grunder', 'sjp', i, 'vertretung'], 'n_mitglied')){
            list.push(['sjp', 'n_mitglied', ['grunder', 'sjp', i]])
        }
    }
    
    for(var i=0; i < variables['grunder']['ag'].length;i++){
        if(equals(['grunder', 'ag', i, 'vertretung'], 'mitglied')){
            list.push(['ag', 'mitglied', ['grunder', 'ag', i]])
        }
        else if(equals(['grunder', 'ag', i, 'vertretung'], 'n_mitglied')){
            list.push(['ag', 'n_mitglied', ['grunder', 'ag', i]])
        }
    }
    
    variables['signature'] = {}
    variables['signature']['signature'] = list
}

function erschienen(){
    var erschienen = 0
    
    for(var i=0; i < variables['grunder']['snp'].length;i++){
        if(typeof variables['grunder']['snp'][i]['typ'] == 'undefined' || variables['grunder']['snp'][i]['typ'] != 'grunder'){
            erschienen += 1
        }
    }
    
    //Extract vertreter from ANP
    for(var i=0; i < variables['grunder']['anp'].length;i++){
        if(typeof variables['grunder']['anp'][i]['typ'] == 'undefined' || variables['grunder']['anp'][i]['typ'] != 'grunder'){
            erschienen += 1
        }
    }
    
    //Extract vertreter from SJP
    for(var i=0; i < variables['grunder']['sjp'].length;i++){
        if(typeof variables['grunder']['sjp'][i]['vertretung'] == 'undefined' || variables['grunder']['sjp'][i]['vertretung'] != 'a_grunder'){
            erschienen += 1
        }
    }
    
    //Extract vertreter from AG
    for(var i=0; i < variables['grunder']['ag'].length;i++){
        if(typeof variables['grunder']['ag'][i]['vertretung'] == 'undefined' || variables['grunder']['ag'][i]['vertretung'] != 'a_grunder'){
            erschienen += 1
        }
    }
    
    variables['erschienen'] = {}
    if(erschienen > 1){
       variables['erschienen']['erschienen'] = 'p'
    }
    else{
        variables['erschienen']['erschienen'] = 's'
    }
}

function vertreter_n(){
    var vertreter = 0
    
    for(var i=0; i < variables['grunder']['snp'].length;i++){
        if(typeof variables['grunder']['snp'][i]['vertretung'] != 'undefined' && variables['grunder']['snp'][i]['vertretung'] == true){
            vertreter += 1
        }
    }
    
    //Extract vertreter from ANP
    for(var i=0; i < variables['grunder']['anp'].length;i++){
        if(typeof variables['grunder']['anp'][i]['vertretung'] != 'undefined' && variables['grunder']['anp'][i]['vertretung'] == true){
            vertreter += 1
        }
    }
    
    //Extract vertreter from SJP
    for(var i=0; i < variables['grunder']['sjp'].length;i++){
        vertreter += 1
    }
    
    //Extract vertreter from AG
    for(var i=0; i < variables['grunder']['ag'].length;i++){
        vertreter += 1
    }
    
    variables['vertreter'] = {}
    if(vertreter > 1){
       variables['vertreter']['vertreter'] = 'p'
    }
    else if(vertreter == 1){
        variables['vertreter']['vertreter'] = 's'
    }
    else{
        variables['vertreter']['vertreter'] = 'n'
    }
}

function n_stammanteile_grunder(){
    var n = 0
    for(var i = 0; i < variables['grunder']['snp'].length; i++){
        if(typeof variables['grunder']['snp'][i].stammanteile != 'undefined'){
            n = n + parseInt(variables['grunder']['snp'][i].stammanteile);
        }
    }
    for(var i = 0; i < variables['grunder']['sjp'].length; i++){
        if(typeof variables['grunder']['sjp'][i].stammanteile != 'undefined'){
            n = n + parseInt(variables['grunder']['sjp'][i].stammanteile);
        }
    }
    for(var i = 0; i < variables['grunder']['anp'].length; i++){
        if(typeof variables['grunder']['anp'][i].stammanteile != 'undefined'){
            n = n + parseInt(variables['grunder']['anp'][i].stammanteile)
        }
    }
    for(var i = 0; i < variables['grunder']['ag'].length; i++){
        if(typeof variables['grunder']['ag'][i].stammanteile != 'undefined'){
            n = n + parseInt(variables['grunder']['ag'][i].stammanteile)
        }
    }
    return n
}

cache_geschaftsfuhrer_snp = []
cache_geschaftsfuhrer_anp = []
cache_geschaftsfuhrer_sfv = []
cache_geschaftsfuhrer_afv = []

function save_natural_geschaftsfuhrer(){
    cache_geschaftsfuhrer_snp = variables['geschaftsfuhrer']['snp']
    cache_geschaftsfuhrer_anp = variables['geschaftsfuhrer']['anp']
    variables['geschaftsfuhrer']['snp'] = []
    variables['geschaftsfuhrer']['anp'] = []
    variables['geschaftsfuhrer']['sfv'] = cache_geschaftsfuhrer_sfv
    variables['geschaftsfuhrer']['afv'] = cache_geschaftsfuhrer_afv
}

function save_j_geschaftsfuhrer(){
    cache_geschaftsfuhrer_sfv = variables['geschaftsfuhrer']['sfv']
    cache_geschaftsfuhrer_afv = variables['geschaftsfuhrer']['afv']
    variables['geschaftsfuhrer']['sfv'] = []
    variables['geschaftsfuhrer']['afv'] = []
    variables['geschaftsfuhrer']['snp'] = cache_geschaftsfuhrer_snp
    variables['geschaftsfuhrer']['anp'] = cache_geschaftsfuhrer_anp
}

function get_highest_zertifikat_nr(){
    var record = 0
    for(var i = 0; i < variables['grunder']['snp'].length; i++){
        if(typeof variables['grunder']['snp'][i]['zertifikat_nr'] != 'undefined' && parseInt(variables['grunder']['snp'][i]['zertifikat_nr'].replace(new RegExp(/[^0-9]/, 'g'), '')) > record){
            record = parseInt(variables['grunder']['snp'][i]['zertifikat_nr'].replace(new RegExp(/[^0-9]/, 'g'), ''))
        }
    }
    
    for(var i = 0; i < variables['grunder']['anp'].length; i++){
        if(typeof variables['grunder']['anp'][i]['zertifikat_nr'] != 'undefined' && parseInt(variables['grunder']['anp'][i]['zertifikat_nr'].replace(new RegExp(/[^0-9]/, 'g'), '')) > record){
            record = parseInt(variables['grunder']['anp'][i]['zertifikat_nr'].replace(new RegExp(/[^0-9]/, 'g'), ''))
        }
    }
    
    for(var i = 0; i < variables['grunder']['sjp'].length; i++){
        if(typeof variables['grunder']['sjp'][i]['zertifikat_nr'] != 'undefined' && parseInt(variables['grunder']['sjp'][i]['zertifikat_nr'].replace(new RegExp(/[^0-9]/, 'g'), '')) > record){
            record = parseInt(variables['grunder']['sjp'][i]['zertifikat_nr'].replace(new RegExp(/[^0-9]/, 'g'), ''))
        }
    }
    
    for(var i = 0; i < variables['grunder']['ag'].length; i++){
        if(typeof variables['grunder']['ag'][i]['zertifikat_nr'] != 'undefined' && parseInt(variables['grunder']['ag'][i]['zertifikat_nr'].replace(new RegExp(/[^0-9]/, 'g'), '')) > record){
            record = parseInt(variables['grunder']['ag'][i]['zertifikat_nr'].replace(new RegExp(/[^0-9]/, 'g'), ''))
        }
    }
    
    return record
}

function get_n_stammanteile_distributed(){
    var stammanteile = 0
    for(var i = 0; i < variables['grunder']['snp'].length; i++){
        if(typeof variables['grunder']['snp'][i]['stammanteile'] != 'undefined'){
            stammanteile += parseInt(variables['grunder']['snp'][i]['stammanteile'].replace(new RegExp(/[^0-9]/, 'g'), ''))
        }
    }
    
    for(var i = 0; i < variables['grunder']['anp'].length; i++){
        if(typeof variables['grunder']['anp'][i]['stammanteile'] != 'undefined'){
            stammanteile += parseInt(variables['grunder']['anp'][i]['stammanteile'].replace(new RegExp(/[^0-9]/, 'g'), ''))
        }
    }
    
    for(var i = 0; i < variables['grunder']['sjp'].length; i++){
        if(typeof variables['grunder']['sjp'][i]['stammanteile'] != 'undefined'){
            stammanteile += parseInt(variables['grunder']['sjp'][i]['stammanteile'].replace(new RegExp(/[^0-9]/, 'g'), ''))
        }
    }
    
    for(var i = 0; i < variables['grunder']['ag'].length; i++){
        if(typeof variables['grunder']['ag'][i]['stammanteile'] != 'undefined'){
            stammanteile += parseInt(variables['grunder']['ag'][i]['stammanteile'].replace(new RegExp(/[^0-9]/, 'g'), ''))
        }
    }
    
    return stammanteile
}

function get_next_zertifikat_nr(){
    var new_zertifikat = get_highest_zertifikat_nr() + 1
    return new_zertifikat.toString()
}

function get_next_zertifikat_start(){
    var new_start = get_n_stammanteile_distributed() + 1
    return new_start
}

function zertifikat_range(start, range){
    if(parseInt(range) == 1){
        return start + " - " + start
    }
    else{
        return start + " - " + (parseInt(start) + parseInt(range) - 1).toString()
    }
}

function stammanteile_wert(){
    if(typeof variables['stammkapital']['stammkapital']['nominalwert'] != 'undefined'){
        var nominalwert = parseInt(variables['stammkapital']['stammkapital']['nominalwert'].toString().replace(new RegExp(/[^0-9]/, 'g'), ''))
        var anzahl =parseInt(variables['stammkapital']['stammkapital']['anzahl'].toString().replace(new RegExp(/[^0-9]/, 'g'), ''))

        for(var i=0; i < variables['grunder']['snp'].length;i++){
            if(typeof variables['grunder']['snp'][i]['stammanteile'] != 'undefined'){
                var stammanteile = parseInt(variables['grunder']['snp'][i]['stammanteile'].replace(new RegExp(/[^0-9]/, 'g'), ''))
                variables['grunder']['snp'][i]['stammanteile_wert'] = format_money(stammanteile*nominalwert)
                variables['grunder']['snp'][i]['stammanteile_prozent'] = (100*stammanteile/anzahl).toFixed(1).toString()
            }
        }

        for(var i=0; i < variables['grunder']['anp'].length;i++){
            if(typeof variables['grunder']['anp'][i]['stammanteile'] != 'undefined'){
                var stammanteile = parseInt(variables['grunder']['anp'][i]['stammanteile'].replace(new RegExp(/[^0-9]/, 'g'), ''))
                variables['grunder']['anp'][i]['stammanteile_wert'] = format_money(stammanteile*nominalwert)
                variables['grunder']['anp'][i]['stammanteile_prozent'] = (100*stammanteile/anzahl).toFixed(1).toString()
            }
        }

        for(var i=0; i < variables['grunder']['sjp'].length;i++){
            if(typeof variables['grunder']['sjp'][i]['stammanteile'] != 'undefined'){
                var stammanteile = parseInt(variables['grunder']['sjp'][i]['stammanteile'].replace(new RegExp(/[^0-9]/, 'g'), ''))
                variables['grunder']['sjp'][i]['stammanteile_wert'] = format_money(stammanteile*nominalwert)
                variables['grunder']['sjp'][i]['stammanteile_prozent'] = (100*stammanteile/anzahl).toFixed(1).toString()
            }
        }

        for(var i=0; i < variables['grunder']['ag'].length;i++){
            if(typeof variables['grunder']['ag'][i]['stammanteile'] != 'undefined'){
                var stammanteile = parseInt(variables['grunder']['ag'][i]['stammanteile'].replace(new RegExp(/[^0-9]/, 'g'), ''))
                variables['grunder']['ag'][i]['stammanteile_wert'] = format_money(stammanteile*nominalwert)
                variables['grunder']['ag'][i]['stammanteile_prozent'] = (100*stammanteile/anzahl).toFixed(1).toString()
            }
        }
    }
}

function is_geschaftsfuhrer(){
    for(var i=0; i < variables['grunder']['snp'].length;i++){
        for(var j=0; j < variables['geschaftsfuhrer']['snp'].length;j++){
            
            if(typeof variables['grunder']['snp'][i]['vorname'] != 'undefined' && typeof variables['grunder']['snp'][i]['nachname'] != 'undefined' && typeof variables['geschaftsfuhrer']['snp'][j]['vorname'] != 'undefined' && typeof variables['geschaftsfuhrer']['snp'][j]['nachname'] != 'undefined'){
                if(variables['grunder']['snp'][i]['vorname'] == variables['geschaftsfuhrer']['snp'][j]['vorname'] && variables['grunder']['snp'][i]['nachname'] == variables['geschaftsfuhrer']['snp'][j]['nachname']){
                   variables['grunder']['snp'][i]['is_geschaftsfuhrer'] = true 
                   variables['geschaftsfuhrer']['snp'][j]['already_listed'] = true
                   
                   if(typeof variables['geschaftsfuhrer']['snp'][j]['zeichnungsberechtigung'] != 'undefined'){
                       variables['grunder']['snp'][i]['zeichnungsberechtigung'] = variables['geschaftsfuhrer']['snp'][j]['zeichnungsberechtigung']
                   }
                   
                    if(typeof variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'] != 'undefined' && variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'][1] == 'snp' && variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'][2] == j){
                       variables['grunder']['snp'][i]['is_vorsitzender'] = true
                    }
                    else{
                        variables['grunder']['snp'][i]['is_vorsitzender'] = false
                    }
                }
                else{
                    variables['grunder']['snp'][i]['is_geschaftsfuhrer'] = false 
                    variables['geschaftsfuhrer']['snp'][j]['already_listed'] = false
                    variables['grunder']['snp'][i]['is_vorsitzender'] = false
                }
            }
        }
    }
    
    for(var i=0; i < variables['grunder']['anp'].length;i++){
        for(var j=0; j < variables['geschaftsfuhrer']['anp'].length;j++){
            if(typeof variables['grunder']['anp'][i]['vorname'] != 'undefined' && typeof variables['grunder']['anp'][i]['nachname'] != 'undefined' && typeof variables['geschaftsfuhrer']['anp'][j]['vorname'] != 'undefined' && typeof variables['geschaftsfuhrer']['anp'][j]['nachname'] != 'undefined'){
                if(variables['grunder']['anp'][i]['vorname'] == variables['geschaftsfuhrer']['anp'][j]['vorname'] && variables['grunder']['anp'][i]['nachname'] == variables['geschaftsfuhrer']['anp'][j]['nachname']){
                   variables['grunder']['anp'][i]['is_geschaftsfuhrer'] = true 
                   variables['geschaftsfuhrer']['anp'][j]['already_listed'] = true
                   
                   if(typeof variables['geschaftsfuhrer']['anp'][j]['zeichnungsberechtigung'] != 'undefined'){
                       variables['grunder']['anp'][i]['zeichnungsberechtigung'] = variables['geschaftsfuhrer']['anp'][j]['zeichnungsberechtigung']
                   }
                   
                    if(typeof variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'] != 'undefined' && variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'][1] == 'anp' && variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'][2] == j){
                       variables['grunder']['anp'][i]['is_vorsitzender'] = true
                    }
                    else{
                        variables['grunder']['anp'][i]['is_vorsitzender'] = false
                    }
                }
                else{
                    variables['grunder']['anp'][i]['is_geschaftsfuhrer'] = false 
                    variables['geschaftsfuhrer']['anp'][j]['already_listed'] = false
                    variables['grunder']['anp'][i]['is_vorsitzender'] = false
                }
            }
        }
    }
}

function is_geschaftsfuhrer2(){
    for(var i=0; i < variables['geschaftsfuhrer']['snp'].length;i++){
        if(typeof variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'] != 'undefined' && variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'][1] == 'snp' && variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'][2] == i){
            variables['geschaftsfuhrer']['snp'][i]['is_vorsitzender'] = true
        }
        else{
            variables['geschaftsfuhrer']['snp'][i]['is_vorsitzender'] = false
        }
    }
    
    for(var i=0; i < variables['geschaftsfuhrer']['anp'].length;i++){
        if(typeof variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'] != 'undefined' && variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'][1] == 'anp' && variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'][2] == i){
            variables['geschaftsfuhrer']['anp'][i]['is_vorsitzender'] = true
        }
        else{
            variables['geschaftsfuhrer']['anp'][i]['is_vorsitzender'] = false
        }
    }
    
    for(var i=0; i < variables['geschaftsfuhrer']['sfv'].length;i++){
        if(typeof variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'] != 'undefined' && variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'][1] == 'sfv' && variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'][2] == i){
            variables['geschaftsfuhrer']['sfv'][i]['is_vorsitzender'] = true
        }
        else{
            variables['geschaftsfuhrer']['sfv'][i]['is_vorsitzender'] = false
        }
    }
    
    for(var i=0; i < variables['geschaftsfuhrer']['afv'].length;i++){
        if(typeof variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'] != 'undefined' && variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'][1] == 'afv' && variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'][2] == i){
            variables['geschaftsfuhrer']['afv'][i]['is_vorsitzender'] = true
        }
        else{
            variables['geschaftsfuhrer']['afv'][i]['is_vorsitzender'] = false
        }
    }
}


form = new Form({'title' : function(){return 'GmbH Gründung Bar'}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder'){return true}else{return false}}, 'assignment' : function(){find_vertreter()}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'geschaftsfuhrung' && v[1] == 'wahl' && v[2] == 'wahl'){return true}else{return false}}, 'assignment' : function(v){if(variables['geschaftsfuhrung']['wahl']['wahl'] == 'gemeinsam'){save_natural_geschaftsfuhrer()}else{save_j_geschaftsfuhrer()}}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' || v[0] == 'stammkapital'){return true}else{return false}}, 'assignment' : function(v){stammanteile_wert()}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' || v[0] == 'geschaftsfuhrer' || v[0] == 'anteilbuch'){return true}else{return false}}, 'assignment' : function(v){is_geschaftsfuhrer();is_geschaftsfuhrer2();}});

var step1 = form.add_step({'title':'Notar', 'variable_name':'notar'});

var page1 = step1.add_page({'title':'Kanton', 'variable_name':'kanton'})

var radio = page1.add_radio({'variable_name' : 'kanton', 'required' : true});
var option = radio.add_option({'value' : 'zurich', 'label' : 'Kanton Zürich'});
var option = radio.add_option({'value' : 'zug', 'label' : 'Kanton Zug'});

var page2 = step1.add_page({'title':'Notariat', 'variable_name':'notariat', 'show' : function(){if(typeof variables['notar']['kanton']['kanton'] != 'undefined' && variables['notar']['kanton']['kanton'] == 'zurich'){return true;}else{return false;}}});

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

var page3 = step1.add_page({'title':'Notariat', 'variable_name':'urkundsperson', 'show' : function(){if(typeof variables['notar']['kanton']['kanton'] != 'undefined' && variables['notar']['kanton']['kanton'] == 'zug'){return true;}else{return false;}}});

var separator = page2.add_separator({});

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

var step2 = form.add_step({'title':'Beurkundungsverfahren', 'variable_name':'beurkundungsverfahren'});

var page1 = step2.add_page({'title':'Beurkundungsverfahren', 'variable_name':'beurkundungsverfahren'})

var text = page1.add_text({'label' : 'Ort der Beurkundung (Deutsch)', 'variable_name' : 'ort_de', 'required' : true});
var text = page1.add_text({'label' : 'Ort der Beurkundung (Englisch)', 'variable_name' : 'ort_en', 'required' : true});
var text = page1.add_text({'label' : 'Datum der Beurkundung', 'variable_name' : 'datum_de', 'required' : true, 'date' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'beurkundungsverfahren' && v[1] == 'beurkundungsverfahren' && v[2] == 'datum_de'){return true}else{return false}}, 'assignment' : function(){variables['beurkundungsverfahren']['beurkundungsverfahren']['datum_en'] = convert_date(variables['beurkundungsverfahren']['beurkundungsverfahren']['datum_de'])}});

var page2 = step2.add_page({'title':'Anzahl Ausfertigungen', 'variable_name':'ausfertigungen', 'show' : function(){if(typeof variables['notar']['kanton']['kanton'] != 'undefined' && variables['notar']['kanton']['kanton'] == 'zug'){return true;}else{return false;}}})

var text = page2.add_text({'label' : 'Für die Urkundsperson', 'variable_name' : 'urkundsperson', 'default' : '2', 'required' : true});
form.add_derived_variable({'condition' : function(v){if(v[0] == 'beurkundungsverfahren'){return true}else{return false}}, 'assignment' : function(){
    if(typeof variables['beurkundungsverfahren']['ausfertigungen']['urkundsperson'] == 'undefined'){
        variables['beurkundungsverfahren']['ausfertigungen']['urkundsperson'] = '2';
    }
    variables['beurkundungsverfahren']['ausfertigungen']['urkundsperson_n'] = parseInt(variables['beurkundungsverfahren']['ausfertigungen']['urkundsperson'].replace(/[^0-9]/, ''))
    
    if(typeof variables['beurkundungsverfahren']['ausfertigungen']['handelsregisteramt'] == 'undefined'){
        variables['beurkundungsverfahren']['ausfertigungen']['handelsregisteramt'] = '1';
    }
    variables['beurkundungsverfahren']['ausfertigungen']['handelsregisteramt_n'] = parseInt(variables['beurkundungsverfahren']['ausfertigungen']['handelsregisteramt'].replace(/[^0-9]/, ''))
    
    if(typeof variables['beurkundungsverfahren']['ausfertigungen']['gesellschaft'] == 'undefined'){
        variables['beurkundungsverfahren']['ausfertigungen']['gesellschaft'] = '3';
    }
    variables['beurkundungsverfahren']['ausfertigungen']['gesellschaft_n'] = parseInt(variables['beurkundungsverfahren']['ausfertigungen']['gesellschaft'].replace(/[^0-9]/, ''))
    
    if(typeof variables['beurkundungsverfahren']['ausfertigungen']['revisionsstelle'] == 'undefined'){
        variables['beurkundungsverfahren']['ausfertigungen']['revisionsstelle'] = '1';
    }
    variables['beurkundungsverfahren']['ausfertigungen']['revisionsstelle_n'] = parseInt(variables['beurkundungsverfahren']['ausfertigungen']['revisionsstelle'].replace(/[^0-9]/, ''))}});

var text = page2.add_text({'label' : 'Für das Handelsregisteramt', 'variable_name' : 'handelsregisteramt', 'default' : '1', 'required' : true});
var text = page2.add_text({'label' : 'Für die Gesellschaft', 'variable_name' : 'gesellschaft', 'default' : '3', 'required' : true});
var text = page2.add_text({'label' : 'Für die Revisionsstelle', 'variable_name' : 'revisionsstelle', 'default' : '1', 'required' : true});

var page3 = step2.add_page({'title':'Formalitäten', 'variable_name':'formalitaten'});

var checkbox_group = page3.add_checkbox_group({'label' : 'Handelsregisteranmeldung'});
var checkbox = checkbox_group.add_checkbox({'label' : function(){if(typeof variables['notar']['kanton']['kanton'] != 'undefined' && variables['notar']['kanton']['kanton'] == 'zug'){return 'Gründer unterzeichnen Handelsregisteranmeldung ausserhalb Notariat';}else{return 'Gründer unterzeichnen Handelsregisteranmeldung ausserhalb Amtslokal';}}, 'variable_name' : 'grunder'});

var separator = page3.add_separator({});

var checkbox_group = page3.add_checkbox_group({'label' : 'Gebührenadresse'});
var checkbox = checkbox_group.add_checkbox({'label' : 'Gebührenadresse entspricht nicht dem Rechtsdomizil der Gesellschaft', 'variable_name' : 'gebuhren'});

var separator = page3.add_separator({'show' : function(){if(typeof variables['beurkundungsverfahren']['formalitaten']['gebuhren'] != 'undefined' && variables['beurkundungsverfahren']['formalitaten']['gebuhren']){return true;}else{return false;}}});
                                     
var text = page3.add_text({'label' : 'Vorname, Name oder Firma', 'variable_name' : 'vorname', 'required' : true, 'show' : function(){if(typeof variables['beurkundungsverfahren']['formalitaten']['gebuhren'] != 'undefined' && variables['beurkundungsverfahren']['formalitaten']['gebuhren']){return true;}else{return false;}}});
var text = page3.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'required' : true, 'show' : function(){if(typeof variables['beurkundungsverfahren']['formalitaten']['gebuhren'] != 'undefined' && variables['beurkundungsverfahren']['formalitaten']['gebuhren']){return true;}else{return false;}}});
var text = page3.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de', 'required' : true, 'show' : function(){if(typeof variables['beurkundungsverfahren']['formalitaten']['gebuhren'] != 'undefined' && variables['beurkundungsverfahren']['formalitaten']['gebuhren']){return true;}else{return false;}}});
var text = page3.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en', 'required' : true, 'show' : function(){if(typeof variables['beurkundungsverfahren']['formalitaten']['gebuhren'] != 'undefined' && variables['beurkundungsverfahren']['formalitaten']['gebuhren']){return true;}else{return false;}}});
var text = page3.add_text({'label' : 'Land (Deutsch)', 'variable_name' : 'land_de', 'required' : true, 'show' : function(){if(typeof variables['beurkundungsverfahren']['formalitaten']['gebuhren'] != 'undefined' && variables['beurkundungsverfahren']['formalitaten']['gebuhren']){return true;}else{return false;}}});
var text = page3.add_text({'label' : 'Land (Englisch)', 'variable_name' : 'land_en', 'required' : true, 'show' : function(){if(typeof variables['beurkundungsverfahren']['formalitaten']['gebuhren'] != 'undefined' && variables['beurkundungsverfahren']['formalitaten']['gebuhren']){return true;}else{return false;}}});

var separator = page3.add_separator({});

var checkbox_group = page3.add_checkbox_group({'label' : 'Ermächtigung'});
var checkbox = checkbox_group.add_checkbox({'label' : 'Ermächtigung an jedes Mitglied der Geschäftsführung einzeln, allfällige, wegen Beanstandung durch die Handelsregisterbehörde erforderliche Änderungen an den Statuten oder am Errichtungsakt, durch einen öffentlich zu beurkundenden Nachtrag namens der Gründer vorzunehmen.', 'variable_name' : 'ermachtigung'});

var separator = page3.add_separator({});

var label = page3.add_label({'label' : 'Bestellungen'});

var checkbox_group = page3.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Bestellungen', 'variable_name' : 'bestellungen'});

var separator = page3.add_separator({'show' : function(self, index){return equals(['beurkundungsverfahren', 'formalitaten',  'bestellungen'], true)}});

var text = page3.add_text({'label' : 'Anzahl Handelsregisterauszüge', 'variable_name' : 'anzahl', 'default' : '1', 'required' : true, 'show' : function(self, index){return equals(['beurkundungsverfahren', 'formalitaten',  'bestellungen'], true)}});

var checkbox_group = page3.add_checkbox_group({'label' : '', 'show' : function(self, index){return equals(['beurkundungsverfahren', 'formalitaten',  'bestellungen'], true)}});
var checkbox = checkbox_group.add_checkbox({'label' : 'vor SHAB-Publikation ', 'variable_name' : 'shab'});

var radio = page3.add_radio({'variable_name' : 'lieferung', 'default' : 'urkundsperson', 'required' : true, 'label' : 'Lieferung an', 'show' : function(self, index){return equals(['beurkundungsverfahren', 'formalitaten',  'bestellungen'], true)}});
var option = radio.add_option({'value' : 'urkundsperson',  'label' : function(){if(typeof variables['notar']['kanton']['kanton'] != 'undefined' && variables['notar']['kanton']['kanton'] == 'zug'){return 'Adresse Notariat';}else{return 'Adresse Urkundsperson';}}});
var option = radio.add_option({'value' : 'gesellschaft',  'label' : 'Adresse Gesellschaft'});
var option = radio.add_option({'value' : 'andere', 'label' : 'Andere Lieferadresse'});

var text = page3.add_text({'label' : 'Vorname, Name oder Firma', 'variable_name' : 'liefer_name', 'required' : true, 'show' : function(){if(typeof variables['beurkundungsverfahren']['formalitaten']['lieferung'] != 'undefined' && variables['beurkundungsverfahren']['formalitaten']['lieferung'] == 'andere' && equals(['beurkundungsverfahren', 'formalitaten',  'bestellungen'], true)){return true;}else{return false;}}});
var text = page3.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'liefer_strasse', 'required' : true, 'show' : function(){if(typeof variables['beurkundungsverfahren']['formalitaten']['lieferung'] != 'undefined' && variables['beurkundungsverfahren']['formalitaten']['lieferung'] == 'andere' && equals(['beurkundungsverfahren', 'formalitaten',  'bestellungen'], true)){return true;}else{return false;}}});
var text = page3.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'liefer_plz_de', 'required' : true, 'show' : function(){if(typeof variables['beurkundungsverfahren']['formalitaten']['lieferung'] != 'undefined' && variables['beurkundungsverfahren']['formalitaten']['lieferung'] == 'andere' && equals(['beurkundungsverfahren', 'formalitaten',  'bestellungen'], true)){return true;}else{return false;}}});
var text = page3.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'liefer_plz_en', 'required' : true, 'show' : function(){if(typeof variables['beurkundungsverfahren']['formalitaten']['lieferung'] != 'undefined' && variables['beurkundungsverfahren']['formalitaten']['lieferung'] == 'andere' && equals(['beurkundungsverfahren', 'formalitaten',  'bestellungen'], true)){return true;}else{return false;}}});
var text = page3.add_text({'label' : 'Land (Deutsch)', 'variable_name' : 'liefer_land_de', 'required' : true, 'show' : function(){if(typeof variables['beurkundungsverfahren']['formalitaten']['lieferung'] != 'undefined' && variables['beurkundungsverfahren']['formalitaten']['lieferung'] == 'andere' && equals(['beurkundungsverfahren', 'formalitaten',  'bestellungen'], true)){return true;}else{return false;}}});
var text = page3.add_text({'label' : 'Land (Englisch)', 'variable_name' : 'liefer_land_en', 'required' : true, 'show' : function(){if(typeof variables['beurkundungsverfahren']['formalitaten']['lieferung'] != 'undefined' && variables['beurkundungsverfahren']['formalitaten']['lieferung'] == 'andere' && equals(['beurkundungsverfahren', 'formalitaten',  'bestellungen'], true)){return true;}else{return false;}}});

var step3 = form.add_step({'title':'Firma, Sitz Dauer und Zweck', 'variable_name':'firma'});

var page1 = step3.add_page({'title':'Firma', 'variable_name':'firma'});

var text = page1.add_text({'label' : 'Firma', 'variable_name' : 'firma', 'required' : true, 'tooltip' : "Jede Firma darf, neben dem vom Gesetze vorgeschriebenen wesentlichen Inhalt, Angaben enthalten, die zur näheren Umschreibung der darin erwähnten Personen dienen oder auf die Natur des Unternehmens hinweisen oder eine Phantasiebezeichnung darstellen, vorausgesetzt, dass der Inhalt der Firma der Wahrheit entspricht, keine Täuschungen verursachen kann und keinem öffentlichen Interesse zuwiderläuft (Art. 944 Abs. 1 OR ).\nDie Firma muss sich von allen in der Schweiz bereits eingetragenen Firmen von Handelsgesellschaften und Genossenschaften deutlich unterscheiden (Art. 951 OR). Es empfiehlt sich allenfalls eine Abfrage unter www.regix.ch, ob in der Schweiz bereits ähnliche Firmen bestehen.\nIn der Firma muss die Rechtsform der Gesellschaft angegeben werden (Art. 950 Abs. 1 in fine OR).Die Rechtsform in der Firma ist mit der zutreffenden Bezeichnung oder deren Abkürzung in einer Landessprache des Bundes anzugeben (Art. 116a Abs. 1 HRegV ).\nZulässige Abkürzungen (Anhang 2 zur HRegV):\nDeutsch: GmbH\nFranzösisch: Sàrl\nItalienisch: Sagl\nRumantsch: Scrl\n"});
var text = page1.add_text({'label' : 'Übersetzung der Firma 1', 'variable_name' : 'ubersetzung_1', 'placeholder' : 'Optional'});
var text = page1.add_text({'label' : 'Übersetzung der Firma 2', 'variable_name' : 'ubersetzung_2', 'placeholder' : 'Optional'});
var text = page1.add_text({'label' : 'Übersetzung der Firma 3', 'variable_name' : 'ubersetzung_3', 'placeholder' : 'Optional'});

var page2 = step3.add_page({'title':'Sitz', 'variable_name':'sitz'});
var text = page2.add_text({'label' : 'Sitzgemeinde (Deutsch)', 'variable_name' : 'sitzgemeinde_de', 'required' : true, 'tooltip' : 'Als Sitz der Gesellschaft wird der Name der politischen Gemeinde eingetragen (Art. 117 Abs. 1 HRegV).'});
var text = page2.add_text({'label' : 'Sitzgemeinde (Englisch)', 'variable_name' : 'sitzgemeinde_en', 'required' : true, 'tooltip' : 'Als Sitz der Gesellschaft wird der Name der politischen Gemeinde eingetragen (Art. 117 Abs. 1 HRegV).'});

var page2 = step3.add_page({'title':'Rechtsdomizil', 'variable_name':'rechtsdomizil'});

var radio = page2.add_radio({'variable_name' : 'buros', 'required' : true});
var option = radio.add_option({'value' : 'eigene', 'label' : 'Eigene Büros am Sitz'});
var option = radio.add_option({'value' : 'keine', 'label' : 'Keine eigenen Büros am Sitz'});

var separator = page2.add_separator({'show' : function(){if(typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['buros'] == 'eigene'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['buros'] == 'eigene'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['buros'] == 'eigene'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Land (Deutsch)', 'variable_name' : 'land_de', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['buros'] == 'eigene'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Land (Englisch)', 'variable_name' : 'land_en', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['buros'] == 'eigene'){return true;}else{return false;}}});

var radio = page2.add_radio({'variable_name' : 'domizil_bei', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});
var option = radio.add_option({'value' : 'einzelperson', 'label' : 'Domizil bei Einzelperson'});
var option = radio.add_option({'value' : 'unternehmung', 'label' : 'Domizil bei Unternehmung'});

var separator = page2.add_separator({'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['domizil_bei'] == 'einzelperson' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['domizil_bei'] == 'einzelperson' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Firma', 'variable_name' : 'firma', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['domizil_bei'] == 'unternehmung' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Land (Deutsch)', 'variable_name' : 'land_de', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Land (Englisch)', 'variable_name' : 'land_en', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Vorname eines Zeichnungsberechtigten', 'variable_name' : 'zeichnungsberechtigter_1_vorname', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['domizil_bei'] == 'unternehmung' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Name eines Zeichnungsberechtigten', 'variable_name' : 'zeichnungsberechtigter_1_nachname', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['domizil_bei'] == 'unternehmung' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Funktion eines Zeichnungsberechtigten (Deutsch)', 'variable_name' : 'funktion_de', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['domizil_bei'] == 'unternehmung' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Funktion eines Zeichnungsberechtigten (Englisch)', 'variable_name' : 'funktion_en', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['domizil_bei'] == 'unternehmung' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Vorname eines zweiten Zeichnungsberechtigten', 'variable_name' : 'zeichnungsberechtigter_2_vorname', 'placeholder' : 'Optional', 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['domizil_bei'] == 'unternehmung' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}},});

var text = page2.add_text({'label' : 'Nachname eines zweiten Zeichnungsberechtigten', 'variable_name' : 'zeichnungsberechtigter_2_nachname', 'placeholder' : 'Optional', 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['domizil_bei'] == 'unternehmung' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Funktion eines zweiten Zeichnungsberechtigten (Deutsch)', 'variable_name' : 'funktion_2_de', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['domizil_bei'] == 'unternehmung' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}, 'placeholder' : 'Optional'});

var text = page2.add_text({'label' : 'Funktion eines zweiten Zeichnungsberechtigten (Englisch)', 'variable_name' : 'funktion_2_en', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['domizil_bei'] == 'unternehmung' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}, 'placeholder' : 'Optional'});

var label = page2.add_label({'label' : 'Ort und Datum der Domizilannahmeerklärung', 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Ort', 'variable_name' : 'ort', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}});

var text = page2.add_text({'label' : 'Datum', 'variable_name' : 'datum_de', 'required' : true, 'show' : function(){if(typeof variables['firma']['rechtsdomizil']['domizil_bei'] != 'undefined' && typeof variables['firma']['rechtsdomizil']['buros'] != 'undefined' && variables['firma']['rechtsdomizil']['buros'] == 'keine'){return true;}else{return false;}}, 'date' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'firma' && v[1] == 'rechtsdomizil' && v[2] == 'datum_de'){return true}else{return false}}, 'assignment' : function(){variables['firma']['rechtsdomizil']['datum_en'] = convert_date(variables['firma']['rechtsdomizil']['datum_de'])}});

var page3 = step3.add_page({'title':'Dauer der Gesellschaft', 'variable_name':'dauer'});

var radio = page3.add_radio({'variable_name' : 'dauer', 'required' : true});
var option = radio.add_option({'value' : 'unbeschrankt', 'label' : 'Die Dauer der Gesellschaft ist unbeschränkt.'});
var option = radio.add_option({'value' : 'beschrankt', 'label' : 'Die Dauer der Gesellschaft ist beschränkt'});

var separator = page3.add_separator({'show' : function(){if(typeof variables['firma']['dauer']['dauer'] != 'undefined' && variables['firma']['dauer']['dauer'] == 'beschrankt'){return true;}else{return false;}}});

var text = page3.add_text({'label' : 'Die Dauer der Gesellschaft ist beschränkt auf', 'variable_name' : 'beschrankt', 'show' : function(){if(typeof variables['firma']['dauer']['dauer'] != 'undefined' && variables['firma']['dauer']['dauer'] == 'beschrankt'){return true;}else{return false;}}});

var page3 = step3.add_page({'title':'Spezifischer Zweck', 'variable_name':'spez_zweck'});

var textarea = page3.add_textarea({'label' : 'Spezifischer Zweck (Deutsch)', 'variable_name' : 'spez_zweck_de'});
var textarea = page3.add_textarea({'label' : 'Spezifischer Zweck (Englisch)', 'variable_name' : 'spez_zweck_en'});


var page4 = step3.add_page({'title':'Allgemeiner Zweck', 'variable_name':'alg_zweck'});

var checkbox_group = page4.add_checkbox_group({'label' : 'Die Gesellschaft kann:'});
var checkbox = checkbox_group.add_checkbox({'label' : 'Zweigniederlassungen errichten ', 'variable_name' : 'zweck_1'});
var checkbox_group = page4.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Tochtergesellschaften errichten', 'variable_name' : 'zweck_2'});
var checkbox = checkbox_group.add_checkbox({'label' : 'auch um Ausland', 'variable_name' : 'zweck_3', 'show' : function(){if((typeof variables['firma']['alg_zweck']['zweck_1'] != 'undefined' && variables['firma']['alg_zweck']['zweck_1'])||(typeof variables['firma']['alg_zweck']['zweck_2'] != 'undefined' && variables['firma']['alg_zweck']['zweck_2'])){return true;}else{return false;}}});

var separator = page4.add_separator({})
var checkbox_group = page4.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'sich an anderen Unternehmen beteiligen', 'variable_name' : 'zweck_4'});
var checkbox = checkbox_group.add_checkbox({'label' : 'auch um Ausland', 'variable_name' : 'zweck_5', 'show' : function(){if(typeof variables['firma']['alg_zweck']['zweck_4'] != 'undefined' && variables['firma']['alg_zweck']['zweck_4']){return true;}else{return false;}}});
var separator = page4.add_separator({})
var checkbox_group = page4.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'alle Geschäfte eingehen und Verträge abschliessen, die ge-eignet sein können, den Zweck der Gesellschaft zu fördern, oder die direkt oder indirekt damit im Zusammenhang stehen ', 'variable_name' : 'zweck_6'});
var separator = page4.add_separator({})
var checkbox_group = page4.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Grundstücke erwerben, belasten, verwalten und veräussern', 'variable_name' : 'zweck_7'});
var checkbox = checkbox_group.add_checkbox({'label' : 'auch um Ausland', 'variable_name' : 'zweck_8', 'show' : function(){if(typeof variables['firma']['alg_zweck']['zweck_7'] != 'undefined' && variables['firma']['alg_zweck']['zweck_7']){return true;}else{return false;}}});
var separator = page4.add_separator({})
var checkbox_group = page4.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Immaterialgüterrechte wie insbesondere Urheberrechte, Patente und Lizenzen aller Art erwerben, belasten, verwalten und veräussern', 'variable_name' : 'zweck_9'});
var separator = page4.add_separator({})
var checkbox_group = page4.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Eingliederung in Konzern (Konzernierungsklausel)', 'variable_name' : 'zweck_10'});
var text = page4.add_text({'label' : 'Firma Konzernobergesellschaft', 'variable_name' : 'zweck_11', 'required' : true, 'show' : function(){if(typeof variables['firma']['alg_zweck']['zweck_10'] != 'undefined' && variables['firma']['alg_zweck']['zweck_10']){return true;}else{return false;}}});
var checkbox_group = page4.add_checkbox_group({'label' : '', 'show' : function(){if(typeof variables['firma']['alg_zweck']['zweck_10'] != 'undefined' && variables['firma']['alg_zweck']['zweck_10']){return true;}else{return false;}}});
var checkbox = checkbox_group.add_checkbox({'label' : 'Konzerninterne Gewährung von Darlehen und/oder Sicherheiten (Finanzierungsklausel)', 'variable_name' : 'zweck_12'});
var checkbox = checkbox_group.add_checkbox({'label' : 'Mit Cash-Pooling', 'variable_name' : 'zweck_13','show' : function(){if(typeof variables['firma']['alg_zweck']['zweck_12'] != 'undefined' && variables['firma']['alg_zweck']['zweck_12']){return true;}else{return false;}}});

var separator = page4.add_separator({})
var textarea = page4.add_textarea({'label' : 'Allgemeiner Zweck', 'variable_name' : 'alg_zweck_de', 'default' : ''});
var textarea = page4.add_textarea({'label' : 'Allgemeiner Zweck (Englisch)', 'variable_name' : 'alg_zweck_en', 'default' : ''});

function condition_update_zweck(variable){
    if(variable[0] == 'firma' && variable[1] == 'alg_zweck' && variable[2].startsWith('zweck')){
        return true;
    }
    else{
        return false;
    }
}

function assignment_update_zweck(){
    zweck_variables = variables['firma']['alg_zweck'];
    if(typeof zweck_variables['zweck_1'] != 'undefined'){
        var zweck_1 = zweck_variables['zweck_1'];
    }
    else{
        var zweck_1 = false;
    }
    if(typeof zweck_variables['zweck_2'] != 'undefined'){
        var zweck_2 = zweck_variables['zweck_2'];
    }
    else{
        var zweck_2 = false;
    }
    if(typeof zweck_variables['zweck_3'] != 'undefined'){
        var zweck_3 = zweck_variables['zweck_3'];
    }
    else{
        var zweck_3 = false;
    }
    if(typeof zweck_variables['zweck_4'] != 'undefined'){
        var zweck_4 = zweck_variables['zweck_4'];
    }
    else{
        var zweck_4 = false;
    }
    if(typeof zweck_variables['zweck_5'] != 'undefined'){
        var zweck_5 = zweck_variables['zweck_5'];
    }
    else{
        var zweck_5 = false;
    }
    if(typeof zweck_variables['zweck_6'] != 'undefined'){
        var zweck_6 = zweck_variables['zweck_6'];
    }
    else{
        var zweck_6 = false;
    }
    if(typeof zweck_variables['zweck_7'] != 'undefined'){
        var zweck_7 = zweck_variables['zweck_7'];
    }
    else{
        var zweck_7 = false;
    }
    if(typeof zweck_variables['zweck_8'] != 'undefined'){
        var zweck_8 = zweck_variables['zweck_8'];
    }
    else{
        var zweck_8 = false;
    }
    if(typeof zweck_variables['zweck_9'] != 'undefined'){
        var zweck_9 = zweck_variables['zweck_9'];
    }
    else{
        var zweck_9 = false;
    }
    if(typeof zweck_variables['zweck_10'] != 'undefined'){
        var zweck_10 = zweck_variables['zweck_10'];
    }
    else{
        var zweck_10 = false;
    }
    if(typeof zweck_variables['zweck_11'] != 'undefined'){
        var zweck_11 = zweck_variables['zweck_11'];
    }
    else{
        var zweck_11 = false;
    }
    if(typeof zweck_variables['zweck_12'] != 'undefined'){
        var zweck_12 = zweck_variables['zweck_12'];
    }
    else{
        var zweck_12 = false;
    }
    if(typeof zweck_variables['zweck_13'] != 'undefined'){
        var zweck_13 = zweck_variables['zweck_13'];
    }
    else{
        var zweck_13 = false;
    }
    
    var part_1_de = '';
    var part_1_en = '';
    var part_2_de = '';
    var part_2_en = '';
    var part_3_de = '';
    var part_3_en = '';
    var part_4_de = '';
    var part_4_en = '';
    
    var sentence_1_de = '';
    var sentence_1_en = '';
    var sentence_2_de = '';
    var sentence_2_en = '';
    var sentence_3_de = '';
    var sentence_3_en = '';
    var sentence_4_de = '';
    var sentence_4_en = '';
    var final_de = '';
    var final_en = '';
    
    if(zweck_1 && zweck_2){
        part_1_de = 'Zweigniederlassungen und Tochtergesellschaften ';
        part_1_en = 'branch offices and subsidiaries'
    }
    else if (zweck_1 && !zweck_2){
        part_1_de = 'Zweigniederlassungen ';
        part_1_en = 'branch offices'
    }
    else if (!zweck_1 && zweck_2){
        part_1_de = 'Tochtergesellschaften ';
        part_1_en = 'subsidiaries'
    }
    else{
        part_1_de = ''
        part_1_en = ''
    }
    
    if(zweck_3){
        part_2_de = 'im In- und Ausland ';
        part_2_en = 'domestic and foreign ';
    }
    else{
        part_2_de = '';
        part_2_en = '';
    }
    
    if(zweck_4 && !zweck_5){
        part_3_de = 'sich an anderen Unternehmen beteiligen';
        part_3_en = 'participate in other companies';
    }
    else if(zweck_4 && zweck_5){
        part_3_de = 'sich an anderen Unternehmen im In- und Ausland beteiligen';
        part_3_en = 'participate in other domestic and foreign companies';
    }
    else{
        part_3_de = '';
        part_3_en = '';
    }
    
    if(zweck_6){
        part_4_de = 'alle Geschäfte eingehen und Verträge abschliessen, die geeignet sein können, den Zweck der Gesellschaft zu fördern, oder die direkt oder indirekt damit im Zusammenhang stehen.';
        part_4_en = 'conduct any business, take all measures and conclude any agreement which may be apt to promote the purpose of the Company or which is directly or indirectly related thereto.';
    }
    else{
        part_4 = '.';
    }
    
    if(zweck_1 || zweck_2 || zweck_4 || zweck_6){
        sentence_1_de = 'Die Gesellschaft kann ';
        sentence_1_en = 'The company may ';
    }
    else{
        sentence_1_de = '';
        sentence_1_en = '';
    }
    
    if(zweck_1 || zweck_2){
        sentence_1_de = sentence_1_de+part_1_de+part_2_de+'errichten';
        sentence_1_en = sentence_1_en+'open and maintain '+part_2_en+part_1_en;
    }
    
    if(zweck_4 && !zweck_6){
        if(zweck_1 || zweck_2){
            sentence_1_de = sentence_1_de+' und '+part_3_de+'.';
            sentence_1_en = sentence_1_en+' and '+part_3_en+'.';
            }
        else{
            sentence_1_de = sentence_1_de+part_3_de+'.';
            sentence_1_en = sentence_1_en+part_3_en+'.';
        }
        }
    else if (zweck_4 && zweck_6){
        if(zweck_1 || zweck_2){
            sentence_1_de = sentence_1_de+', '+part_3_de+', sowie '+part_4_de;
            sentence_1_en = sentence_1_en+', '+part_3_en+'and '+part_4_en;
            }
        else{
            sentence_1_de = sentence_1_de+part_3_de+', sowie '+part_4_de;
            sentence_1_en = sentence_1_en+part_3_en+'and '+part_4_en;
        }
        
    }
    else if (!zweck_4 && zweck_6){
        if(sentence_1_de =='Die Gesellschaft kann '){
            sentence_1_de = sentence_1_de+part_4_de;  
        }
        else{
            sentence_1_de = sentence_1_de+', sowie'+part_4_de;
        }
        if(sentence_1_en =='The company may '){
            sentence_1_en = sentence_1_en+part_4_en;  
        }
        else{
            sentence_1_en = sentence_1_en+', as well as'+part_4_en;
        }
    }
    else{
        if(sentence_1_de == ''){
            sentence_1_de = sentence_1_de;
        }
        else{
            sentence_1_de = sentence_1_de+'. ';
        }
        if(sentence_1_en == ''){
            sentence_1_en = sentence_1_en;
        }
        else{
            sentence_1_en = sentence_1_en+'. ';
        }
    }
    
    if(zweck_7){
        if(zweck_8){
            if(zweck_9){
                sentence_2_de = 'Die Gesellschaft kann im In- und Ausland Grundstücke und auch Immaterialgüterrechte wie insbesondere Urheberrechte, Patente und Lizenzen aller Art erwerben, belasten, verwalten und veräussern.';
                sentence_2_en = 'The company may purchase, encumber, manage and sell domestic and foreign real property as well as intellectual property rights such as copyrights, patents and licences of any kind. ';
            }
            else{
                sentence_2_de = 'Die Gesellschaft kann im In- und Ausland Grundstücke erwerben, belasten, verwalten und veräussern. ';
                sentence_2_en = 'The company may purchase, encumber, manage and sell domestic and foreign real property. ';
            }
        }
        else{
            if(zweck_9){
                sentence_2_de = 'Die Gesellschaft kann Grundstücke und auch Immaterialgüterrechte wie insbesondere Urheberrechte, Patente und Lizenzen aller Art erwerben, belasten, verwalten und veräussern. ';
                sentence_2_en = 'The company may purchase, encumber, manage and sell real property as well as intellectual property rights such as copyrights, patents and licences of any kind. ';
            }
            else{
                sentence_2_de = 'Die Gesellschaft kann Grundstücke erwerben, belasten, verwalten und veräussern. ';
                sentence_2_en = 'The company may purchase, encumber, manage and sell real property. ';
            }
        }
    }
    else{
        if(zweck_9){
            sentence_3_de = 'Die Gesellschaft kann Immaterialgüterrechte wie insbesondere Urheberrechte,Patente und Lizenzen aller Art erwerben, belasten, verwalten und veräussern. ';
            sentence_3_en = 'The company may purchase, encumber, manage and sell intellectual property rights such as copyrights, patents and licences of any kind. ';
        }
        else{
            sentence_3_de = '';
            sentence_3_en = '';
        }
    }
    
    if(zweck_10 && zweck_11){
        sentence_4_de = 'Die Gesellschaft ist Teil des Konzerns, der von ' + zweck_11 + ' als Muttergesellschaft kontrolliert wird. Sie kann die Interessen der Konzernmuttergesellschaft oder anderer Konzerngesellschaften fördern. ';
        sentence_4_en = 'It is part of the group of companies controlled by ' + zweck_11 + ' as parent company. The Company may promote the interests of the parent company or other group companies. ';
    }
    else{
        sentence_4_de = '';
        sentence_4_en = '';  
    }
    
    if(zweck_12){
        if(zweck_13){
            sentence_5_de = 'Die Gesellschaft kann Konzerngesellschaften sowie deren direkten und indirekten Gesellschaftern Darlehen und andere Arten der direkten oder indirekten Finanzierung gewähren, insbesondere an einer zentralen Liquiditätsverwaltung (Cash-Pooling) teilnehmen, und für die Verpflichtungen der genannten Personen Sicherheiten aller Art (insbesondere in Form von Garantien, Pfandrechten, Globalzessionen, Sicherungsübereignungen/-abtretungen sowie Schadloserklärungen) bestellen, ob entgeltlich oder nicht.';
            sentence_5_en = 'The company is authorised to grant to its direct or indirect subsidiaries or to third parties, including its direct or indirect shareholders loans and other other forms of direct or indirect financing, especially to participate in centralized treasury operations (cash pooling), and to grant securities of any kind for their obligations, including by means of guarantee, pledges, global assignment, transfer of title for security, assignment for security purposes and indemnities, even if the Company is not remunerated for these fundings or provision of securites.';
        }
        else{
            sentence_5_de = 'Die Gesellschaft kann Konzerngesellschaften sowie deren direkten und indirekten Gesellschaftern Darlehen und andere Arten der direkten oder indirekten Finanzierung gewähren und für die Verpflichtungen der genannten Personen Sicherheiten aller Art (insbesondere in Form von Garantien, Pfandrechten, Globalzessionen, Sicherungsübereignungen/-abtretungen sowie Schadloserklärungen) bestellen, ob entgeltlich oder nicht.';
            sentence_5_en = 'The company is authorised to grant to its direct or indirect subsidiaries or to third parties, including its direct or indirect shareholders loans and other other forms of direct or indirect financing and to grant securities of any kind for their obligations, including by means of guarantee, pledges, global assignment, transfer of title for security, assignment for security purposes and indemnities, even if the Company is not remunerated for these fundings or provision of securites.';
        }
    }
    else{
        sentence_5_de = '';
        sentence_5_en = '';  
    }

    if(sentence_1_de != ''){
        final_de = sentence_1_de;
        final_en = sentence_1_en;
    }
    
    if(sentence_2_de != ''){
        if(final_de == ''){
            final_de = sentence_2_de;
            final_en = sentence_2_en;
        }
        else{
            final_de += ('\r\n\r\n' + sentence_2_de);
            final_en += ('\r\n\r\n' + sentence_2_en);
        }
    }
    
    if(sentence_3_de != ''){
        if(final_de == ''){
            final_de = sentence_3_de;
            final_en = sentence_3_en;
        }
        else{
            final_de += ('\r\n\r\n' + sentence_3_de);
            final_en += ('\r\n\r\n' + sentence_3_en);
        }
    }
    
    if(sentence_4_de != ''){
        if(final_de == ''){
            final_de = sentence_4_de;
            final_en = sentence_4_en;
        }
        else{
            final_de += ('\r\n\r\n' + sentence_4_de);
            final_en += ('\r\n\r\n' + sentence_4_en);
        }
    }
    
    if(sentence_5_de != ''){
        if(final_de == ''){
            final_de = sentence_5_de;
            final_en = sentence_5_en;
        }
        else{
            final_de += ('\r\n\r\n' + sentence_5_de);
            final_en += ('\r\n\r\n' + sentence_5_en);
        }
    }
    
    variables['firma']['alg_zweck']['alg_zweck_de'] = final_de;
    variables['firma']['alg_zweck']['alg_zweck_en'] = final_en;


}

form.add_derived_variable({'condition' : condition_update_zweck, 'assignment' : assignment_update_zweck});

var step4 = form.add_step({'title':'Stammkapital', 'variable_name':'stammkapital'});

var page1 = step4.add_page({'title':'Stammkapital', 'variable_name':'stammkapital'});

var text = page1.add_text({'label' : 'Stammkapital (CHF)', 'variable_name' : 'stammkapital', 'required' : true});
var alert1 = text.add_alert({'condition' : function(self, end, index){if(typeof variables['stammkapital']['stammkapital']['stammkapital'] != 'undefined' && parseInt(variables['stammkapital']['stammkapital']['stammkapital'].replace(/[^0-9]/, '')) < 20000){return true;}else{return false;}}, 'message' : "Das Stammkapial muss mindestens CHF 20'000.- betragen"});
form.add_derived_variable({'condition' : function(variable){if(variable[0] == 'stammkapital' && variable[1] == 'stammkapital' && variable[2] == 'stammkapital'){return true;}else{return false;}}, 'assignment' : function(){variables['stammkapital']['stammkapital']['stammkapital'] = variables['stammkapital']['stammkapital']['stammkapital'].replace(new RegExp(/[^0-9]/, 'g'), '')}});
    
form.add_derived_variable({'condition' : function(v){if(v[0] == 'stammkapital' && v[1] == 'stammkapital' && v[2] == 'stammkapital'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]] = format_money(variables[v[0]][v[1]][v[2]])}});

var text = page1.add_text({'label' : 'Anzahl Stammanteile', 'variable_name' : 'anzahl', 'required' : true});
form.add_derived_variable({'condition' : function(variable){if(variable[0] == 'stammkapital' && variable[1] == 'stammkapital' && variable[2] == 'anzahl'){return true;}else{return false;}}, 'assignment' : function(){variables['stammkapital']['stammkapital']['anzahl'] = variables['stammkapital']['stammkapital']['anzahl'].replace(new RegExp(/[^0-9]/, 'g'), '')}});

var alert1 = text.add_alert({'condition' : function(self, end, index){if(typeof variables['stammkapital']['stammkapital']['anzahl'] != 'undefined' && end && parseInt(variables['stammkapital']['stammkapital']['anzahl'].replace(/[^0-9]/, '')) != n_stammanteile_grunder()){return true;}else{return false;}}, 'message' : "Die Anzahl Stammanteile entspricht nicht der Summe der Stammanteile aller Gründer."});

var text = page1.add_text({'label' : 'Nominalwert (CHF)', 'variable_name' : 'nominalwert', 'disabled' : function(){return true;}});
form.add_derived_variable({'condition' : function(variable){if(variable[0] == 'stammkapital' && variable[1] == 'stammkapital' && (variable[2] == 'anzahl' || variable[2] == 'stammkapital') && typeof variables['stammkapital']['stammkapital']['stammkapital'] != 'undefined' && typeof variables['stammkapital']['stammkapital']['anzahl'] != 'undefined'){return true;}else{return false;}}, 'assignment' : function(){variables['stammkapital']['stammkapital']['nominalwert'] = parseInt(variables['stammkapital']['stammkapital']['stammkapital'].replace(new RegExp(/[^0-9]/, 'g'), ''))/parseInt(variables['stammkapital']['stammkapital']['anzahl'].replace(new RegExp(/[^0-9]/, 'g'), ''))}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'stammkapital' && v[1] == 'stammkapital' && typeof variables[v[0]][v[1]]['nominalwert'] != 'undefined'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]]['nominalwert'] = format_money(variables[v[0]][v[1]]['nominalwert'])}});

var text = page1.add_text({'label' : 'Ausgabebetrag (CHF)', 'variable_name' : 'ausgabebetrag', 'required' : true});
form.add_derived_variable({'condition' : function(variable){if(variable[0] == 'stammkapital' && variable[1] == 'stammkapital' && variable[2] == 'ausgabebetrag'){return true;}else{return false;}}, 'assignment' : function(){variables['stammkapital']['stammkapital']['ausgabebetrag'] = variables['stammkapital']['stammkapital']['ausgabebetrag'].replace(new RegExp(/[^0-9]/, 'g'), '')}});
var alert1 = text.add_alert({'condition' : function(self, end, index){if(typeof variables['stammkapital']['stammkapital']['nominalwert'] != 'undefined' && typeof variables['stammkapital']['stammkapital']['ausgabebetrag'] != 'undefined' && parseInt(variables['stammkapital']['stammkapital']['nominalwert']) > parseInt(variables['stammkapital']['stammkapital']['ausgabebetrag'])){return true;}else{return false;}}, 'message' : "Der Ausgabebetrag muss mindestens dem Nominalwert entsprechen."});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'stammkapital' && v[1] == 'stammkapital' && v[2] == 'ausgabebetrag'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]] = format_money(variables[v[0]][v[1]][v[2]])}});

var text = page1.add_text({'label' : 'Bei Bank zu hinterlegender Liberierungsbetrag (CHF)', 'variable_name' : 'liberierungsbetrag', 'required' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'stammkapital' && v[1] == 'stammkapital' && typeof variables[v[0]][v[1]]['anzahl'] != 'undefined' && typeof variables[v[0]][v[1]]['ausgabebetrag'] != 'undefined'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]]['liberierungsbetrag'] = format_money(parseInt(variables[v[0]][v[1]]['anzahl'].replace(new RegExp(/[^0-9]/, 'g'), ''))*parseInt(variables[v[0]][v[1]]['ausgabebetrag'].replace(new RegExp(/[^0-9]/, 'g'), '')))}});

var text = page1.add_text({'label' : 'Hinterlegung bei (Deutsch):', 'variable_name' : 'hinterlegung_de'});
var text = page1.add_text({'label' : 'Hinterlegung bei (Englisch):', 'variable_name' : 'hinterlegung_en'});
var text = page1.add_text({'label' : 'Datum der Kapitaleinzahlungsbestätigung der Bank', 'variable_name' : 'datum_de', 'date' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'stammkapital' && v[1] == 'stammkapital' && v[2] == 'datum_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['datum_en'] = convert_date(variables[v[0]][v[1]][v[2]]['datum_de'])}});

var step5 = form.add_step({'title':'Gründer', 'variable_name':'grunder'});

var page1 = step5.add_multipage({'title' : 'Schweizerische natürliche Person', 'variable_name' : 'snp', 'naming' : function(self, index){if(typeof variables['grunder']['snp'][index]['vorname'] !== 'undefined' && typeof variables['grunder']['snp'][index]['nachname'] !== 'undefined'){return variables['grunder']['snp'][index]['vorname'] + ' ' + variables['grunder']['snp'][index]['nachname'];}else{return 'Schweizerische natürliche Person ' + parseInt(index + 1);}}});

var snp = page1

var radio = page1.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page1.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true});
var text = page1.add_text({'label' : 'Nachname', 'variable_name' : 'nachname', 'required' : true});
var text = page1.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional'});
var text = page1.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional'});
var text = page1.add_text({'label' : 'Kose-/Ruf-/Künstlername', 'variable_name' : 'kose', 'placeholder' : 'Optional'});
var text = page1.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum_de', 'year' : true});

var text = page1.add_text({'label' : 'Heimatort (Deutsch)', 'variable_name' : 'heimatort_de'});
var text = page1.add_text({'label' : 'Heimatort (Englisch)', 'variable_name' : 'heimatort_en'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'snp' && v[3] == 'geburtsdatum_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['geburtsdatum_en'] = convert_date(variables[v[0]][v[1]][v[2]]['geburtsdatum_de'])}});


var label = page1.add_label({'label' : 'Wohnsitzadresse'});
var text = page1.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse'});
var text = page1.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de'});
var text = page1.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'snp' && v[3] == 'plz_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['ort_de'] = variables[v[0]][v[1]][v[2]]['plz_de'].replace(new RegExp(/[0-9]/, 'g'), '').replace(',','').trim()}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'snp' && v[3] == 'plz_en'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['ort_en'] = variables[v[0]][v[1]][v[2]]['plz_en'].replace(new RegExp(/[0-9]/, 'g'), '').replace(',','').trim()}});


var checkbox_group = page1.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Wohnsitz im Ausland', 'variable_name' : 'ausland'});
var text = page1.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel', 'show' : function(self, index){if(typeof variables['grunder']['snp'][index]['ausland'] !== 'undefined' && variables['grunder']['snp'][index]['ausland']){return true;}else{return false;}}});

var separator = page1.add_separator({})

var label = page1.add_label({'label' : 'Stammanteile'});

var text = page1.add_text({'label' : 'Anzahl zu zeichnende Stammanteile', 'variable_name' : 'stammanteile', 'required' : true});

var text = page1.add_text({'label' : 'Zertifikat Nr.', 'variable_name' : 'zertifikat_nr', 'required' : true, 'placeholder' : 'z.B. 3', 'tooltip' : 'Falls Zertifikate in Form von Namenpapieren ausgestellt werden.'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'snp' && v[3] == 'stammanteile' && typeof variables['grunder']['snp'][v[2]]['zertifikat_nr'] == 'undefined'){return true}else{return false}}, 'assignment' : function(v){variables['grunder']['snp'][v[2]]['zertifikat_nr'] = get_next_zertifikat_nr()}});

var text = page1.add_text({'label' : 'Stammanteil Nr.', 'variable_name' : 'stammanteil_nr', 'required' : true, 'placeholder' : 'z.B. 3-5'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'snp' && v[3] == 'stammanteile' && typeof variables['grunder']['snp'][v[2]]['stammanteil_nr'] == 'undefined'){return true}else{return false}}, 'assignment' : function(v){variables['grunder']['snp'][v[2]]['stammanteil_nr'] = zertifikat_range(get_next_zertifikat_start() - parseInt(variables['grunder']['snp'][v[2]]['stammanteile'].replace(new RegExp(/[^0-9]/, 'g'), '')), variables['grunder']['snp'][v[2]]['stammanteile']) }});

var checkbox_group = page1.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Der Stammanteilhalter erwirbt allein oder in gemeinsamer Absprache mit Dritten Stammanteile und überschreitet dadurch den Grenzwert von 25 Prozent des Stammkapitals oder der Stimmen.', 'variable_name' : 'grenzwert', 'tooltip' : 'Der Stammanteilhalter erwirbt allein oder in gemeinsamer Absprache mit Dritten Stammanteile und überschreitet dadurch den Grenzwert von 25 Prozent des Stammkapitals oder der Stimmen.', 'disabled' : function(self,index){if(typeof variables['grunder']['snp'][index]['stammanteile'] != 'undefined' && typeof variables['stammkapital']['stammkapital']['anzahl'] != 'undefined' && parseInt(variables['grunder']['snp'][index]['stammanteile'].replace(new RegExp(/[^0-9]/, 'g'), '')) * 4 >=  parseInt(variables['stammkapital']['stammkapital']['anzahl'].replace(new RegExp(/[^0-9]/, 'g'), ''))){variables['grunder']['snp'][index]['grenzwert'] = true;return true}else{return false}}});

var separator = page1.add_separator({'show' : function(self, index){return equals(['grunder', 'snp', index, 'grenzwert'], true)}})

var radio = page1.add_radio({'variable_name' : 'berechtigt', 'required' : true, 'show' : function(self, index){return equals(['grunder', 'snp', index, 'grenzwert'], true)}});
var option = radio.add_option({'value' : 'selbst', 'label' : 'Stammanteilhalter ist selbst wirtschaftlich berechtigte Person'});
var option = radio.add_option({'value' : 'andere', 'label' : 'Eine andere Person als der Stammanteilhalter ist an den Stammanteilen wirtschaftlich berechtigt'});
var option = radio.add_option({'value' : 'keine', 'label' : 'Es kann keine wirtschaftlich berechtigte Person im Sinne des Gesetzes gemeldet werden:'});

var textarea = page1.add_textarea({'label' : '', 'variable_name' : 'keine_text', 'default' : 'Im Sinne von Art. 790a Abs. 1 OR erkläre ich hiermit, dass in Bezug auf die Stammanteile keine wirtschaftlich berechtigte Person besteht..', 'show' : function(self, index){return equals(['grunder', 'snp', index, 'grenzwert'], true) && equals(['grunder', 'snp', index, 'berechtigt'], 'keine')}});


var separator = page1.add_separator({})

var checkbox_group = page1.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Vertretung bei Gründung', 'variable_name' : 'vertretung'});

var label = page1.add_label({'label' : 'Vertretung', 'show' :  function(self, index){if(typeof variables['grunder']['snp'][index]['vertretung'] != 'undefined' && variables['grunder']['snp'][index]['vertretung']){return true;}else{return false;}}});

var radio = page1.add_radio({'variable_name' : 'typ', 'required' : true, 'show' :  function(self, index){if(typeof variables['grunder']['snp'][index]['vertretung'] != 'undefined' && variables['grunder']['snp'][index]['vertretung']){return true;}else{return false;}}});

var option = radio.add_option({'value' : 'andere', 'label' : 'Andere natürliche Person (nicht anderer Gründer)'});
var option = radio.add_option({'value' : 'grunder', 'label' : 'Anderer Gründer (natürliche Person)'});


// V Andere natürliche Person #######################################################################################

var radio = page1.add_radio({'variable_name' : 'sex_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page1.add_text({'label' : 'Vorname', 'variable_name' : 'vorname_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}});
var text = page1.add_text({'label' : 'Name', 'variable_name' : 'name_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}});

var text = page1.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_v_de', 'placeholder' : 'Optional', 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}});

var text = page1.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_v_en', 'placeholder' : 'Optional', 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}});

var text = page1.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum_v_de', 'year' : true, 'required' : true, 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'snp' && v[3] == 'geburtsdatum_v_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['geburtsdatum_v_en'] = convert_date(variables[v[0]][v[1]][v[2]]['geburtsdatum_v_de'])}});

var separator = page1.add_separator({'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}})

var radio = page1.add_radio({'variable_name' : 'staatsburger_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}});
var option = radio.add_option({'value' : 'schweizer', 'label' : 'Schweizer Staatsbürger'});
var option = radio.add_option({'value' : 'auslandischer', 'label' : 'Ausländischer Staatsbürger'});

var text = page1.add_text({'label' : 'Heimatort (Deutsch)', 'variable_name' : 'heimatort_v_de', 'required' : true, 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere') && equals(['grunder', 'snp', index, 'staatsburger_v'], 'schweizer')}});

var text = page1.add_text({'label' : 'Heimatort (Englisch)', 'variable_name' : 'heimatort_v_en', 'required' : true, 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere') && equals(['grunder', 'snp', index, 'staatsburger_v'], 'schweizer')}});

var text = page1.add_text({'label' : 'Staatsangehörige/r', 'variable_name' : 'staatsangehorige_v_de', 'required' : true, 'placeholder' : 'z.B. deutsche/r', 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere') && equals(['grunder', 'snp', index, 'staatsburger_v'], 'auslandischer')}});
var text = page1.add_text({'label' : 'Citizen of', 'variable_name' : 'staatsangehorige_v_en', 'required' : true, 'placeholder' : 'e.g. Germany', 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere') && equals(['grunder', 'snp', index, 'staatsburger_'], 'auslandischer')}});

var separator = page1.add_separator({'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}})

var label = page1.add_label({'label' : 'Wohnsitzadresse','show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}});

var text = page1.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse_v', 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}});
var text = page1.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_v_de', 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}});
var text = page1.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_v_en', 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}});


var checkbox_group = page1.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Wohnsitz im Ausland', 'variable_name' : 'ausland_v', 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}});

var text = page1.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel_v', 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere') && equals(['grunder', 'snp', index, 'ausland_v'], true)}});

var separator = page1.add_separator({'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}})

var label = page1.add_label({'label' : 'Vollmacht','show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}});

var text = page1.add_text({'label' : 'Datum der Vollmacht', 'variable_name' : 'datum_vollmacht_v_de', 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}, 'date' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'snp' && v[3] == 'datum_vollmacht_v_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['datum_vollmacht_v_en'] = convert_date(variables[v[0]][v[1]][v[2]]['datum_vollmacht_v_de'])}});

var radio = page1.add_radio({'variable_name' : 'beglaubigung_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere')}, 'date' : true});
var option = radio.add_option({'value' : 'schweiz', 'label' : 'Beglaubigung in der Schweiz'});
var option = radio.add_option({'value' : 'ausland', 'label' : 'Beglaubigung im Ausland'});

var separator = page1.add_separator({'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere') && equals(['grunder', 'snp', index, 'beglaubigung_v'], 'ausland')}})

var radio = page1.add_radio({'variable_name' : 'beglaubigung_art_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'andere') && equals(['grunder', 'snp', index, 'beglaubigung_v'], 'ausland')}, 'date' : true});
var option = radio.add_option({'value' : 'apostille', 'label' : 'Beglaubigung im Ausland mit Apostille'});
var option = radio.add_option({'value' : 'uberbeglaubigung', 'label' : 'Beglaubigung im Ausland mit Überbeglaubigung '});


// V Anderer Gründer #############################################################################

snp_a = page1;

// Schweizerische juristische Person #######################################################################################

var page2 = step5.add_multipage({'title' : 'Schweizerische juristische Person', 'variable_name' : 'sjp', 'naming' : function(self, index){if(typeof variables['grunder']['sjp'][index]['firma'] !== 'undefined'){return variables['grunder']['sjp'][index]['firma'];}else{return 'Schweizerische juristische Person ' + parseInt(index + 1);}}});

var sjp = page2

var text = page2.add_text({'label' : 'Firma', 'variable_name' : 'firma', 'required' : true});

var text = page2.add_text({'label' : 'Adresse (mit Ort)', 'variable_name' : 'adresse', 'required' : true});

var text = page2.add_text({'label' : 'Sitzgemeinde (Deutsch)', 'variable_name' : 'sitzgemeinde_de', 'required' : true});
var text = page2.add_text({'label' : 'Sitzgemeinde (Englisch)', 'variable_name' : 'sitzgemeinde_en', 'required' : true});

var dropdown = page2.add_dropdown({'variable_name' : 'rechtsform', 'label' : 'Rechtsform', 'required' : true});
var option = dropdown.add_option({'value' : 'ag', 'label' : 'Aktiengesellschaft', 'default' : function(self){return true;}});
var option = dropdown.add_option({'value' : 'gmbh', 'label' : 'Gesellschaft mit beschränkter Haftung'});
var option = dropdown.add_option({'value' : 'genossenschaft', 'label' : 'Genossenschaft'});
var option = dropdown.add_option({'value' : 'verein', 'label' : 'Verein'});
var option = dropdown.add_option({'value' : 'stiftung', 'label' : 'Stiftung'});
var option = dropdown.add_option({'value' : 'kommanditaktiengesellschaft', 'label' : 'Kommanditaktiengesellschaft'});
var option = dropdown.add_option({'value' : 'stiftung', 'label' : 'Stiftung'});
var option = dropdown.add_option({'value' : 'kollektivgesellschaft', 'label' : 'Kollektivgesellschaft'});
var option = dropdown.add_option({'value' : 'kommanditgesellschaft', 'label' : 'Kommanditgesellschaft'});

var checkbox_group = page2.add_checkbox_group({'label' : '', 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'rechtsform'], 'kollektivgesellschaft') || equals(['grunder', 'sjp', index, 'rechtsform'], 'kommanditgesellschaft') || equals(['grunder', 'sjp', index, 'rechtsform'], 'verein') || equals(['grunder', 'sjp', index, 'rechtsform'], 'stiftung')}});
var checkbox = checkbox_group.add_checkbox({'label' : 'Im Handlesregister eingetragen', 'variable_name' : 'eingetragen'});

var text = page2.add_text({'label' : 'Unternehmensidentifikationsnummer', 'variable_name' : 'che', 'required' : true, 'default' : 'CHE-', 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'rechtsform'], 'ag') || equals(['grunder', 'sjp', index, 'rechtsform'], 'gmbh') || equals(['grunder', 'sjp', index, 'rechtsform'], 'genossenschaft') || equals(['grunder', 'sjp', index, 'rechtsform'], 'kommanditaktiengesellschaft') || equals(['grunder', 'sjp', index, 'eingetragen'], true)}});

var separator = page2.add_separator({})

var radio = page2.add_radio({'label' : 'Legitimationsprüfung gestützt auf:', 'variable_name' : 'stutzung', 'required' : true, 'show' : function(self, index){return !(equals(['grunder', 'sjp', index, 'rechtsform'], 'ag') || equals(['grunder', 'sjp', index, 'rechtsform'], 'gmbh') || equals(['grunder', 'sjp', index, 'rechtsform'], 'genossenschaft') || equals(['grunder', 'sjp', index, 'rechtsform'], 'kommanditaktiengesellschaft') || equals(['grunder', 'sjp', index, 'eingetragen'], true))}});
var option = radio.add_option({'value' : 'kopie', 'label' : 'beglaubigte Kopie der Statuten/Gesellschaftsvertrag/Stiftungsurkunde'});
var option = radio.add_option({'value' : 'auszug', 'label' : 'beglaubigter Auszug der Statuten/Gesellschaftsvertrag/Stiftungsurkunde'});

var radio = page2.add_radio({'label' : 'Legitimationsprüfung gestützt auf:', 'variable_name' : 'art_abfrage', 'required' : true, 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'rechtsform'], 'ag') || equals(['grunder', 'sjp', index, 'rechtsform'], 'gmbh') || equals(['grunder', 'sjp', index, 'rechtsform'], 'genossenschaft') || equals(['grunder', 'sjp', index, 'rechtsform'], 'kommanditaktiengesellschaft') || equals(['grunder', 'sjp', index, 'eingetragen'], true)}});
var option = radio.add_option({'value' : 'internet', 'label' : 'Internetabfrage im Handelsregister'});
var option = radio.add_option({'value' : 'handels', 'label' : 'beglaubigter Handelsregisterauszug'});

var text = page2.add_text({'label' : 'Datum', 'variable_name' : 'datum', 'required' : true, 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'rechtsform'], 'ag') || equals(['grunder', 'sjp', index, 'rechtsform'], 'gmbh') || equals(['grunder', 'sjp', index, 'rechtsform'], 'genossenschaft') || equals(['grunder', 'sjp', index, 'rechtsform'], 'kommanditaktiengesellschaft') || equals(['grunder', 'sjp', index, 'eingetragen'], true)}, 'date' : true});

var separator = page2.add_separator({})

var label = page2.add_label({'label' : 'Vertreter der Rechtseinheit bei Gründung'});

var radio = page2.add_radio({'label' : '', 'variable_name' : 'vertretung', 'required' : true});
var option = radio.add_option({'value' : 'mitglied', 'label' : 'Mitglied eines Organs der Gesellschaft mit Einzelunterschrift'});
var option = radio.add_option({'value' : 'n_mitglied', 'label' : 'Nicht Mitglied eines Organs der Gesellschaft, oder Mitglied eines Organs der Gesellschaft mit Vollmacht'});
var option = radio.add_option({'value' : 'a_grunder', 'label' : 'Anderer Gründer (natürliche Person)'});

var separator = page2.add_separator({});

// V Mitglied eines Organs der Gesellschaft #####################################################################################

var radio = page2.add_radio({'variable_name' : 'sex_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied')}});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page2.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied')}});
var text = page2.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied')}});
var text = page2.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied')}});
var text = page2.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied')}});

var text = page2.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum_de', 'year' : true, 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied')}});

var separator = page2.add_separator({'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied')}})

var text = page2.add_text({'label' : 'Funktion (Deutsch)', 'variable_name' : 'funktion_de', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied')}});

var text = page2.add_text({'label' : 'Funktion (Englisch)', 'variable_name' : 'funktion_en', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied')}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'sjp' && v[3] == 'geburtsdatum_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['geburtsdatum_en'] = convert_date(variables[v[0]][v[1]][v[2]]['geburtsdatum_de'])}});

var separator = page2.add_separator({'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied')}})

var radio = page2.add_radio({'variable_name' : 'staatsburger', 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied')}});
var option = radio.add_option({'value' : 'schweizer', 'label' : 'Schweizer Staatsbürger'});
var option = radio.add_option({'value' : 'auslandischer', 'label' : 'Ausländischer Staatsbürger'});

var text = page2.add_text({'label' : 'Heimatort', 'variable_name' : 'heimatort', 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied') && equals(['grunder', 'sjp', index, 'staatsburger'], 'schweizer')}});
var text = page2.add_text({'label' : 'Staatsangehörige/r', 'variable_name' : 'staatsangehorige', 'required' : true, 'placeholder' : 'z.B. deutsche/r', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied') && equals(['grunder', 'sjp', index, 'staatsburger'], 'auslandischer')}});
var text = page2.add_text({'label' : 'Citizen of', 'variable_name' : 'staatsangehorige', 'required' : true, 'placeholder' : 'e.g. Germany', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied') && equals(['grunder', 'sjp', index, 'staatsburger'], 'auslandischer')}});

var separator = page2.add_separator({'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied')}})

var label = page2.add_label({'label' : 'Wohnsitzadresse','show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied')}});

var text = page2.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied')}});
var text = page2.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied')}});
var text = page2.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied')}});
var text = page2.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'mitglied') && equals(['grunder', 'sjp', index, 'staatsburger'], 'auslandischer')}});


// V Nicht Mitglied eines Organs der Gesellschaft, oder Mitglied eines Organs der Gesellschaft mit Vollmacht ############


var radio = page2.add_radio({'variable_name' : 'sex_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page2.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}});
var text = page2.add_text({'label' : 'Name', 'variable_name' : 'name', 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}});
var text = page2.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}});
var text = page2.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}});

var text = page2.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum_de', 'year' : true, 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'sjp' && v[3] == 'geburtsdatum_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['geburtsdatum_en'] = convert_date(variables[v[0]][v[1]][v[2]]['geburtsdatum_de'])}});

var separator = page2.add_separator({'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}})

var radio = page2.add_radio({'variable_name' : 'staatsburger', 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}});
var option = radio.add_option({'value' : 'schweizer', 'label' : 'Schweizer Staatsbürger'});
var option = radio.add_option({'value' : 'auslandischer', 'label' : 'Ausländischer Staatsbürger'});

var text = page2.add_text({'label' : 'Heimatort (Deutsch)', 'variable_name' : 'heimatort_de', 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied') && equals(['grunder', 'sjp', index, 'staatsburger'], 'schweizer')}});

var text = page2.add_text({'label' : 'Heimatort (Englisch)', 'variable_name' : 'heimatort_en', 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied') && equals(['grunder', 'sjp', index, 'staatsburger'], 'schweizer')}});

var text = page2.add_text({'label' : 'Staatsangehörige/r', 'variable_name' : 'staatsangehorige', 'required' : true, 'placeholder' : 'z.B. deutsche/r', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied') && equals(['grunder', 'sjp', index, 'staatsburger'], 'auslandischer')}});
var text = page2.add_text({'label' : 'Citizen of', 'variable_name' : 'staatsangehorige', 'required' : true, 'placeholder' : 'e.g. Germany', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied') && equals(['grunder', 'sjp', index, 'staatsburger'], 'auslandischer')}});

var separator = page2.add_separator({'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}})

var label = page2.add_label({'label' : 'Wohnsitzadresse','show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}});

var text = page2.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}});
var text = page2.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}});
var text = page2.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}});
var text = page2.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied') && equals(['grunder', 'sjp', index, 'staatsburger'], 'auslandischer')}});

var separator = page2.add_separator({'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}})

var label = page2.add_label({'label' : 'Vollmacht','show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}});

var text = page2.add_text({'label' : 'Datum der Vollmacht', 'variable_name' : 'datum_vollmacht_de', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}, 'date' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'sjp' && v[3] == 'datum_vollmacht_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['datum_vollmacht_en'] = convert_date(variables[v[0]][v[1]][v[2]]['datum_vollmacht_de'])}});

var radio = page2.add_radio({'variable_name' : 'beglaubigung', 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')}, 'date' : true});
var option = radio.add_option({'value' : 'schweiz', 'label' : 'Beglaubigung in der Schweiz'});
var option = radio.add_option({'value' : 'ausland', 'label' : 'Beglaubigung im Ausland'});

var separator = page2.add_separator({'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied') && equals(['grunder', 'sjp', index, 'beglaubigung'], 'ausland')}})

var radio = page2.add_radio({'variable_name' : 'beglaubigung_art', 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'n_mitglied')  && equals(['grunder', 'sjp', index, 'beglaubigung'], 'ausland')}, 'date' : true});
var option = radio.add_option({'value' : 'apostille', 'label' : 'Beglaubigung im Ausland mit Apostille'});
var option = radio.add_option({'value' : 'uberbeglaubigung', 'label' : 'Beglaubigung im Ausland mit Überbeglaubigung'});

// V Anderer Gründer #############################################################################

sjp_a = page2;

//Auslandische Naturliche Person #############################################


var page3 = step5.add_multipage({'title' : 'Ausländische natürliche Person', 'variable_name' : 'anp', 'naming' : function(self, index){if(typeof variables['grunder']['anp'][index]['vorname'] !== 'undefined' && typeof variables['grunder']['anp'][index]['nachname'] !== 'undefined'){return variables['grunder']['anp'][index]['vorname'] + ' ' + variables['grunder']['anp'][index]['nachname'];}else{return 'Ausländische natürliche Person ' + parseInt(index + 1);}}});

var anp = page3

var radio = page3.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page3.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true});
var text = page3.add_text({'label' : 'Nachname', 'variable_name' : 'nachname', 'required' : true});
var text = page3.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional'});
var text = page3.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional'});
var text = page3.add_text({'label' : 'Kose-/Ruf-/Künstlername', 'variable_name' : 'kose', 'placeholder' : 'Optional'});
var text = page3.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum_de', 'year' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'anp' && v[3] == 'geburtsdatum_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['geburtsdatum_en'] = convert_date(variables[v[0]][v[1]][v[2]]['geburtsdatum_de'])}});

var text = page3.add_text({'label' : 'Staatsangehörige/r', 'variable_name' : 'staatsangehorige_de', 'required' : true, 'placeholder' : 'z.B. deutsche/r'});

var text = page3.add_text({'label' : 'Citizen of', 'variable_name' : 'staatsangehorige_en', 'required' : true, 'placeholder' : 'z.B. Germany'});

var label = page3.add_label({'label' : 'Wohnsitzadresse'});
var text = page3.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse'});
var text = page3.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de'});
var text = page3.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'anp' && v[3] == 'plz_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['ort_de'] = variables[v[0]][v[1]][v[2]]['plz_de'].replace(new RegExp(/[0-9]/, 'g'), '').replace(',','').trim()}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'anp' && v[3] == 'plz_en'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['ort_en'] = variables[v[0]][v[1]][v[2]]['plz_en'].replace(new RegExp(/[0-9]/, 'g'), '').replace(',','').trim()}});

var checkbox_group = page3.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Wohnsitz im Ausland', 'variable_name' : 'ausland'});
var text = page3.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel', 'show' : function(self, index){if(typeof variables['grunder']['anp'][index]['ausland'] !== 'undefined' && variables['grunder']['anp'][index]['ausland']){return true;}else{return false;}}});

var separator = page3.add_separator({})

var label = page3.add_label({'label' : 'Stammanteile'});

var text = page3.add_text({'label' : 'Anzahl zu zeichnende Stammanteile', 'variable_name' : 'stammanteile', 'required' : true});

var text = page3.add_text({'label' : 'Zertifikat Nr.', 'variable_name' : 'zertifikat_nr', 'required' : true, 'placeholder' : 'z.B. 3', 'tooltip' : 'Falls Zertifikate in Form von Namenpapieren ausgestellt werden.'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'anp' && v[3] == 'stammanteile' && typeof variables['grunder']['anp'][v[2]]['zertifikat_nr'] == 'undefined'){return true}else{return false}}, 'assignment' : function(v){variables['grunder']['anp'][v[2]]['zertifikat_nr'] = get_next_zertifikat_nr()}});

var text = page3.add_text({'label' : 'Stammanteil Nr.', 'variable_name' : 'stammanteil_nr', 'required' : true, 'placeholder' : 'z.B. 3-5'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'anp' && v[3] == 'stammanteile' && typeof variables['grunder']['anp'][v[2]]['stammanteil_nr'] == 'undefined'){return true}else{return false}}, 'assignment' : function(v){variables['grunder']['anp'][v[2]]['stammanteil_nr'] = zertifikat_range(get_next_zertifikat_start() - parseInt(variables['grunder']['anp'][v[2]]['stammanteile'].replace(new RegExp(/[^0-9]/, 'g'), '')), variables['grunder']['anp'][v[2]]['stammanteile']) }});

var checkbox_group = page3.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Der Stammanteilhalter erwirbt allein oder in gemeinsamer Absprache mit Dritten Stammanteile und überschreitet dadurch den Grenzwert von 25 Prozent des Stammkapitals oder der Stimmen.', 'variable_name' : 'grenzwert', 'tooltip' : 'Der Stammanteilhalter erwirbt allein oder in gemeinsamer Absprache mit Dritten Stammanteile und überschreitet dadurch den Grenzwert von 25 Prozent des Stammkapitals oder der Stimmen.', 'disabled' : function(self,index){if(typeof variables['grunder']['anp'][index]['stammanteile'] != 'undefined' && typeof variables['stammkapital']['stammkapital']['anzahl'] != 'undefined' && parseInt(variables['grunder']['anp'][index]['stammanteile'].replace(new RegExp(/[^0-9]/, 'g'), '')) * 4 >=  parseInt(variables['stammkapital']['stammkapital']['anzahl'].replace(new RegExp(/[^0-9]/, 'g'), ''))){variables['grunder']['anp'][index]['grenzwert'] = true;return true}else{return false}}});

var separator = page3.add_separator({'show' : function(self, index){return equals(['grunder', 'anp', index, 'grenzwert'], true)}})

var radio = page3.add_radio({'variable_name' : 'berechtigt', 'required' : true, 'show' : function(self, index){return equals(['grunder', 'anp', index, 'grenzwert'], true)}});
var option = radio.add_option({'value' : 'selbst', 'label' : 'Stammanteilhalter ist selbst wirtschaftlich berechtigte Person'});
var option = radio.add_option({'value' : 'andere', 'label' : 'Eine andere Person als der Stammanteilhalter ist an den Stammanteilen wirtschaftlich berechtigt'});
var option = radio.add_option({'value' : 'keine', 'label' : 'Es kann keine wirtschaftlich berechtigte Person im Sinne des Gesetzes gemeldet werden:'});

var textarea = page3.add_textarea({'label' : '', 'variable_name' : 'keine_text', 'default' : 'Im Sinne von Art. 790a Abs. 1 OR erkläre ich hiermit, dass in Bezug auf die Stammanteile keine wirtschaftlich berechtigte Person besteht.', 'show' : function(self, index){return equals(['grunder', 'anp', index, 'grenzwert'], true) && equals(['grunder', 'anp', index, 'berechtigt'], 'keine')}});

var separator = page3.add_separator({})

var checkbox_group = page3.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Vertretung bei Gründung', 'variable_name' : 'vertretung'});

var label = page3.add_label({'label' : 'Vertretung', 'show' :  function(self, index){if(typeof variables['grunder']['anp'][index]['vertretung'] != 'undefined' && variables['grunder']['anp'][index]['vertretung']){return true;}else{return false;}}});

var radio = page3.add_radio({'variable_name' : 'typ', 'required' : true, 'show' :  function(self, index){if(typeof variables['grunder']['anp'][index]['vertretung'] != 'undefined' && variables['grunder']['anp'][index]['vertretung']){return true;}else{return false;}}});

var option = radio.add_option({'value' : 'andere', 'label' : 'Andere natürliche Person (nicht anderer Gründer)'});
var option = radio.add_option({'value' : 'a_grunder', 'label' : 'Anderer Gründer (natürliche Person)'});

//Define Vertretern model
var vertreter_model = new Model(form, {'name' : 'vertreter_model', 'sources' : [snp, anp]});
var snp_model = new Model(form, {'name' : 'snp_model', 'sources' : [snp]});
var anp_model = new Model(form, {'name' : 'anp_model', 'sources' : [anp]});

//SNP Anderer gründer

page1 = snp_a

var text = page1.add_modelselect(vertreter_model, {'label' : 'Vertreter', 'variable_name' : 'vertreter', 'required' : true,'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'grunder')}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[3] == 'vertreter'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['vertreter_array'] = parse_vorsitzender(variables[v[0]][v[1]][v[2]][v[3]])}});

var separator = page1.add_separator({'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'grunder')}})

var label = page1.add_label({'label' : 'Vollmacht','show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'grunder')}});

var text = page1.add_text({'label' : 'Datum der Vollmacht', 'variable_name' : 'datum_vollmacht_v_de', 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'grunder')}, 'date' : true});

var radio = page1.add_radio({'variable_name' : 'beglaubigung_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'grunder')}});
var option = radio.add_option({'value' : 'schweiz', 'label' : 'Beglaubigung in der Schweiz'});
var option = radio.add_option({'value' : 'ausland', 'label' : 'Beglaubigung im Ausland'});

var separator = page1.add_separator({'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'grunder') && equals(['grunder', 'snp', index, 'beglaubigung'], 'ausland')}})

var radio = page1.add_radio({'variable_name' : 'beglaubigung_art_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'snp', index, 'vertretung'], true) && equals(['grunder', 'snp', index, 'typ'], 'grunder') && equals(['grunder', 'snp', index, 'beglaubigung'], 'ausland')}});
var option = radio.add_option({'value' : 'apostille', 'label' : 'Beglaubigung im Ausland mit Apostille'});
var option = radio.add_option({'value' : 'uberbeglaubigung', 'label' : 'Beglaubigung im Ausland mit Überbeglaubigung '});

//SJP Anderer gründer

page2 = sjp_a

var text = page2.add_modelselect(vertreter_model, {'label' : 'Vertreter', 'variable_name' : 'vertreter', 'required' : true,'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'a_grunder')}});

var separator = page2.add_separator({'show' : function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'a_grunder')}})

var label = page2.add_label({'label' : 'Stammanteile'});

var text = page2.add_text({'label' : 'Anzahl zu zeichnende Stammanteile', 'variable_name' : 'stammanteile', 'required' : true});

var text = page2.add_text({'label' : 'Zertifikat Nr.', 'variable_name' : 'zertifikat_nr', 'required' : true, 'placeholder' : 'z.B. 3', 'tooltip' : 'Falls Zertifikate in Form von Namenpapieren ausgestellt werden.'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'sjp' && v[3] == 'stammanteile' && typeof variables['grunder']['sjp'][v[2]]['zertifikat_nr'] == 'undefined'){return true}else{return false}}, 'assignment' : function(v){variables['grunder']['sjp'][v[2]]['zertifikat_nr'] = get_next_zertifikat_nr()}});

var text = page2.add_text({'label' : 'Stammanteil Nr.', 'variable_name' : 'stammanteil_nr', 'required' : true, 'placeholder' : 'z.B. 3-5'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'sjp' && v[3] == 'stammanteile' && typeof variables['grunder']['sjp'][v[2]]['stammanteil_nr'] == 'undefined'){return true}else{return false}}, 'assignment' : function(v){variables['grunder']['sjp'][v[2]]['stammanteil_nr'] = zertifikat_range(get_next_zertifikat_start() - parseInt(variables['grunder']['sjp'][v[2]]['stammanteile'].replace(new RegExp(/[^0-9]/, 'g'), '')), variables['grunder']['sjp'][v[2]]['stammanteile']) }});

var checkbox_group = page2.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Der Stammanteilhalter erwirbt allein oder in gemeinsamer Absprache mit Dritten Stammanteile und überschreitet dadurch den Grenzwert von 25 Prozent des Stammkapitals oder der Stimmen.', 'variable_name' : 'grenzwert', 'tooltip' : 'Der Stammanteilhalter erwirbt allein oder in gemeinsamer Absprache mit Dritten Stammanteile und überschreitet dadurch den Grenzwert von 25 Prozent des Stammkapitals oder der Stimmen.', 'disabled' : function(self,index){if(typeof variables['grunder']['sjp'][index]['stammanteile'] != 'undefined' && typeof variables['stammkapital']['stammkapital']['anzahl'] != 'undefined' && parseInt(variables['grunder']['sjp'][index]['stammanteile'].replace(new RegExp(/[^0-9]/, 'g'), '')) * 4 >=  parseInt(variables['stammkapital']['stammkapital']['anzahl'].replace(new RegExp(/[^0-9]/, 'g'), ''))){variables['grunder']['sjp'][index]['grenzwert'] = true;return true}else{return false}}});

var separator = page2.add_separator({'show' : function(self, index){return equals(['grunder', 'sjp', index, 'grenzwert'], true)}})

var radio = page2.add_radio({'variable_name' : 'berechtigt', 'required' : true, 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'grenzwert'], true)}});
var option = radio.add_option({'value' : 'andere', 'label' : 'Eine andere Person als der Stammanteilhalter ist an den Stammanteilen wirtschaftlich berechtigt'});
var option = radio.add_option({'value' : 'keine', 'label' : 'Es kann keine wirtschaftlich berechtigte Person im Sinne des Gesetzes gemeldet werden:'});

var textarea = page2.add_textarea({'label' : '', 'variable_name' : 'keine_text', 'default' : 'Im Sinne von Art. 790a Abs. 1 OR erkläre ich hiermit, dass in Bezug auf die Stammanteile keine wirtschaftlich berechtigte Person besteht.', 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'grenzwert'], true) && equals(['grunder', 'sjp', index, 'berechtigt'], 'keine')}});

var label = page2.add_label({'label' : 'Zeichnungsberechtigter für GAFI Meldung', 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'grenzwert'], true)}});
                             
var text = page2.add_text({'label' : 'Vorname', 'variable_name' : 'vorname_z', 'required' : true, 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'grenzwert'], true)}});
var text = page2.add_text({'label' : 'Name', 'variable_name' : 'nachname_z', 'required' : true, 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'grenzwert'], true)}});
var text = page2.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_z_de', 'placeholder' : 'Optional', 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'grenzwert'], true)}});

var text = page2.add_text({'label' : 'Funktion (Deutsch)', 'variable_name' : 'funktion_z_de', 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'grenzwert'], true)}});

var text = page2.add_text({'label' : 'Funktion (Englisch)', 'variable_name' : 'funktion_z_en', 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'grenzwert'], true)}});

var checkbox_group = page2.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Zweiter Zeichnungsberechtigter', 'variable_name' : 'zweiter', 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'grenzwert'], true)} });

var label = page2.add_label({'label' : 'Zweiter Zeichnungsberechtigter', 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'grenzwert'], true) && equals(['grunder', 'sjp', index, 'zweiter'], true)}});
                             
var text = page2.add_text({'label' : 'Vorname', 'variable_name' : 'vorname_z_2', 'required' : true, 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'grenzwert'], true) && equals(['grunder', 'sjp', index, 'zweiter'], true)}});
var text = page2.add_text({'label' : 'Name', 'variable_name' : 'nachname_z_2', 'required' : true, 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'grenzwert'], true) && equals(['grunder', 'sjp', index, 'zweiter'], true)}});
var text = page2.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_z_2_de', 'placeholder' : 'Optional', 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'grenzwert'], true) && equals(['grunder', 'sjp', index, 'zweiter'], true)}});

var text = page2.add_text({'label' : 'Funktion (Deutsch)', 'variable_name' : 'funktion_z_2_de', 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'grenzwert'], true) && equals(['grunder', 'sjp', index, 'zweiter'], true)}});

var text = page2.add_text({'label' : 'Funktion (Englisch)', 'variable_name' : 'funktion_z_2_en', 'show' : function(self, index){return equals(['grunder', 'sjp', index, 'grenzwert'], true) && equals(['grunder', 'sjp', index, 'zweiter'], true)}});

var separator = page2.add_separator({'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'a_grunder')}})

var label = page2.add_label({'label' : 'Vollmacht','show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'a_grunder')}});

var text = page2.add_text({'label' : 'Datum der Vollmacht', 'variable_name' : 'datum_vollmacht_de', 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'a_grunder')}, 'date' : true});

var radio = page2.add_radio({'variable_name' : 'beglaubigung', 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'a_grunder')}, 'date' : true});
var option = radio.add_option({'value' : 'schweiz', 'label' : 'Beglaubigung in der Schweiz'});
var option = radio.add_option({'value' : 'ausland', 'label' : 'Beglaubigung im Ausland'});

var separator = page2.add_separator({'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'a_grunder') && equals(['grunder', 'sjp', index, 'beglaubigung'], 'ausland')}})

var radio = page2.add_radio({'variable_name' : 'beglaubigung_art', 'required' : true, 'show': function(self, index){return equals(['grunder', 'sjp', index, 'vertretung'], 'a_grunder')  && equals(['grunder', 'sjp', index, 'beglaubigung'], 'ausland')}, 'date' : true});
var option = radio.add_option({'value' : 'apostille', 'label' : 'Beglaubigung im Ausland mit Apostille'});
var option = radio.add_option({'value' : 'uberbeglaubigung', 'label' : 'Beglaubigung im Ausland mit Überbeglaubigung'});

// V Andere natürliche Person #######################################################################################

var radio = page3.add_radio({'variable_name' : 'sex_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page3.add_text({'label' : 'Vorname', 'variable_name' : 'vorname_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}});
var text = page3.add_text({'label' : 'Name', 'variable_name' : 'nachname_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}});
var text = page3.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_v_de', 'placeholder' : 'Optional', 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}});
var text = page3.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_v_en', 'placeholder' : 'Optional', 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}});

var text = page3.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum_v_de', 'year' : true, 'required' : true, 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'anp' && v[3] == 'geburtsdatum_v_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['geburtsdatum_v_en'] = convert_date(variables[v[0]][v[1]][v[2]]['geburtsdatum_v_de'])}});

var separator = page3.add_separator({'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}})

var radio = page3.add_radio({'variable_name' : 'staatsburger_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}});
var option = radio.add_option({'value' : 'schweizer', 'label' : 'Schweizer Staatsbürger'});
var option = radio.add_option({'value' : 'auslandischer', 'label' : 'Ausländischer Staatsbürger'});

var text = page3.add_text({'label' : 'Heimatort (Deutsch)', 'variable_name' : 'heimatort_v_de', 'required' : true, 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere') && equals(['grunder', 'anp', index, 'staatsburger_v'], 'schweizer')}});
var text = page3.add_text({'label' : 'Heimatort (Englisch)', 'variable_name' : 'heimatort_v_en', 'required' : true, 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere') && equals(['grunder', 'anp', index, 'staatsburger_v'], 'schweizer')}});
var text = page3.add_text({'label' : 'Staatsangehörige/r', 'variable_name' : 'staatsangehorige_v_de', 'required' : true, 'placeholder' : 'z.B. deutsche/r', 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere') && equals(['grunder', 'anp', index, 'staatsburger_v'], 'auslandischer')}});
var text = page3.add_text({'label' : 'Citizen of', 'variable_name' : 'staatsangehorige_v_en', 'required' : true, 'placeholder' : 'e.g. Germany', 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere') && equals(['grunder', 'anp', index, 'staatsburger_v'], 'auslandischer')}});

var separator = page3.add_separator({'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}})

var label = page3.add_label({'label' : 'Wohnsitzadresse','show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}});

var text = page3.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse_v', 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}});
var text = page3.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_v_de', 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}});
var text = page3.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_v_en', 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}});
var text = page3.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel_v', 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere') && equals(['grunder', 'anp', index, 'staatsburger'], 'auslandischer')}});

var separator = page3.add_separator({'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}})

var label = page3.add_label({'label' : 'Vollmacht','show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}});

var text = page3.add_text({'label' : 'Datum der Vollmacht', 'variable_name' : 'datum_vollmacht_v_de', 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}, 'date' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'anp' && v[3] == 'datum_vollmacht_v_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['datum_vollmacht_v_en'] = convert_date(variables[v[0]][v[1]][v[2]]['datum_vollmacht_v_de'])}});

var radio = page3.add_radio({'variable_name' : 'beglaubigung_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere')}});
var option = radio.add_option({'value' : 'schweiz', 'label' : 'Beglaubigung in der Schweiz'});
var option = radio.add_option({'value' : 'ausland', 'label' : 'Beglaubigung im Ausland'});

var separator = page3.add_separator({'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere') && equals(['grunder', 'anp', index, 'beglaubigung'], 'ausland')}})

var radio = page3.add_radio({'variable_name' : 'beglaubigung_art_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'anp', index, 'vertretung'], true) && equals(['grunder', 'anp', index, 'typ'], 'andere') && equals(['grunder', 'anp', index, 'beglaubigung'], 'ausland')}});
var option = radio.add_option({'value' : 'apostille', 'label' : 'Beglaubigung im Ausland mit Apostille'});
var option = radio.add_option({'value' : 'uberbeglaubigung', 'label' : 'Beglaubigung im Ausland mit Überbeglaubigung '});

// V Anderer Grunder ################################################################################

var text = page3.add_modelselect(vertreter_model, {'label' : 'Vertreter', 'variable_name' : 'vertreter', 'required' : true,'show': function(self, index){return equals(['grunder', 'anp', index, 'typ'], 'a_grunder')}});


var separator = page3.add_separator({'show': function(self, index){return equals(['grunder', 'anp', index, 'typ'], 'a_grunder')}})

var label = page3.add_label({'label' : 'Vollmacht','show': function(self, index){return equals(['grunder', 'anp', index, 'typ'], 'a_grunder')}});

var text = page3.add_text({'label' : 'Datum der Vollmacht', 'variable_name' : 'datum_vollmacht_v_de', 'show': function(self, index){return equals(['grunder', 'anp', index, 'typ'], 'a_grunder')}, 'date' : true});

var radio = page3.add_radio({'variable_name' : 'beglaubigung_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'anp', index, 'typ'], 'a_grunder')}});
var option = radio.add_option({'value' : 'schweiz', 'label' : 'Beglaubigung in der Schweiz'});
var option = radio.add_option({'value' : 'ausland', 'label' : 'Beglaubigung im Ausland'});

var separator = page3.add_separator({'show': function(self, index){return equals(['grunder', 'anp', index, 'typ'], 'a_grunder') && equals(['grunder', 'anp', index, 'beglaubigung'], 'ausland')}})

var radio = page3.add_radio({'variable_name' : 'beglaubigung_art_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'anp', index, 'typ'], 'a_grunder')  && equals(['grunder', 'anp', index, 'beglaubigung'], 'ausland')}});
var option = radio.add_option({'value' : 'apostille', 'label' : 'Beglaubigung im Ausland mit Apostille'});
var option = radio.add_option({'value' : 'uberbeglaubigung', 'label' : 'Beglaubigung im Ausland mit Überbeglaubigung'});

//Auslandische Gesellschaft #####################################################

var page4 = step5.add_multipage({'title' : 'Ausländische Gesellschaft', 'variable_name' : 'ag', 'naming' : function(self, index){if(typeof variables['grunder']['ag'][index]['firma'] !== 'undefined'){return variables['grunder']['ag'][index]['firma'];}else{return 'Ausländische Gesellschaft ' + parseInt(index + 1);}}});

var ag = page4

var text = page4.add_text({'label' : 'Firma', 'variable_name' : 'firma', 'required' : true});

var text = page4.add_text({'label' : 'Adresse (mit Ort)', 'variable_name' : 'adresse', 'required' : true});

var text = page4.add_text({'label' : 'Sitzgemeinde, Landeskürzel (Deutsch)', 'variable_name' : 'sitzgemeinde_de', 'required' : true});
var text = page4.add_text({'label' : 'Sitzgemeinde, Landeskürzel (Englisch)', 'variable_name' : 'sitzgemeinde_en', 'required' : true});

var text = page4.add_text({'label' : 'Rechtsform (Deutsch)', 'variable_name' : 'rechtsform_de', 'required' : true});
var text = page4.add_text({'label' : 'Rechtsform (Englisch)', 'variable_name' : 'rechtsform_en', 'required' : true});
var text = page4.add_text({'label' : 'auf Gesellschaft anwendbares Recht (Deutsch)', 'variable_name' : 'recht_de', 'required' : true, 'placeholder' : 'z.B. nach "liechtensteinischem" Recht'});
var text = page4.add_text({'label' : 'auf Gesellschaft anwendbares Recht (English)', 'variable_name' : 'recht_en', 'required' : true, 'placeholder' : 'e.g. organised under the laws of "Liechtenstein"'});

var text = page4.add_text({'label' : 'Register (Deutsch)', 'variable_name' : 'register_de', 'required' : true, 'placeholder' : 'z.B. eingetragen im "Handelsregister Liechtenstein"'});
var text = page4.add_text({'label' : 'Register (English)', 'variable_name' : 'register_en', 'required' : true, 'placeholder' : 'e.g. registered with the "commercial register of Liechtenstein"'});

var text = page4.add_text({'label' : 'Unternehmensidentifikationsnummer', 'variable_name' : 'che', 'required' : true});

var separator = page4.add_separator({})

var radio = page4.add_radio({'label' : 'Art der Legitimationsprüfung', 'variable_name' : 'art_legitimation', 'required' : true});
var option = radio.add_option({'value' : 'apostilliert', 'label' : 'notariell beglaubigter und apostillierter Registerauszug'});
var option = radio.add_option({'value' : 'uberbeglaubigt', 'label' : 'notariell beglaubigter und überbeglaubigter Registerauszug'});

var text = page4.add_text({'label' : 'Datum', 'variable_name' : 'datum_de', 'required' : true, 'date' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'ag' && v[3] == 'datum_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['datum_en'] = convert_date(variables[v[0]][v[1]][v[2]]['datum_de'])}});

var label = page4.add_label({'label' : 'Vertreter der Rechtseinheit bei Gründung'});

var radio = page4.add_radio({'label' : '', 'variable_name' : 'vertretung', 'required' : true});
var option = radio.add_option({'value' : 'mitglied', 'label' : 'Mitglied eines Organs der Gesellschaft (entsprechend dessen Zeichnungsberechtigung) '});
var option = radio.add_option({'value' : 'n_mitglied', 'label' : 'Nicht Mitglied eines Organs der Gesellschaft, oder Mitglied eines Organs der Gesellschaft mit Vollmacht'});
var option = radio.add_option({'value' : 'a_grunder', 'label' : 'Anderer Gründer (natürliche Person)'});

// V mitglied der rechtseinheit ###############################################

var radio = page4.add_radio({'variable_name' : 'sex', 'required' : true, 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied')}});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page4.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true, 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied')}});
var text = page4.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true, 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied')}});
var text = page4.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied')}});
var text = page4.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied')}});

var text = page4.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum_de', 'year' : true, 'required' : true, 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied')}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'ag' && v[3] == 'geburtsdatum_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['geburtsdatum_en'] = convert_date(variables[v[0]][v[1]][v[2]]['geburtsdatum_de'])}});

var separator = page4.add_separator({'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied')}})

var radio = page4.add_radio({'variable_name' : 'staatsburger', 'required' : true, 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied')}});
var option = radio.add_option({'value' : 'schweizer', 'label' : 'Schweizer Staatsbürger'});
var option = radio.add_option({'value' : 'auslandischer', 'label' : 'Ausländischer Staatsbürger'});

var text = page4.add_text({'label' : 'Heimatort', 'variable_name' : 'heimatort', 'required' : true, 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied') && equals(['grunder', 'ag', index, 'staatsburger'], 'schweizer')}});
var text = page4.add_text({'label' : 'Staatsangehörige/r', 'variable_name' : 'staatsangehorige_de', 'required' : true, 'placeholder' : 'z.B. deutsche/r', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied') && equals(['grunder', 'ag', index, 'staatsburger'], 'auslandischer')}});
var text = page4.add_text({'label' : 'Citizen of', 'variable_name' : 'staatsangehorige_en', 'required' : true, 'placeholder' : 'e.g. Germany', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied') && equals(['grunder', 'ag', index, 'staatsburger'], 'auslandischer')}});

var separator = page4.add_separator({'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied')}})

var label = page4.add_label({'label' : 'Wohnsitzadresse','show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied')}});

var text = page4.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied')}});
var text = page4.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied')}});
var text = page4.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied')}});
var text = page4.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied') && equals(['grunder', 'ag', index, 'staatsburger'], 'auslandischer')}});

var separator = page4.add_separator({'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied')}})

var text = page4.add_text({'label' : 'Funktion (Deutsch)', 'variable_name' : 'funktion_de', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied')}});

var text = page4.add_text({'label' : 'Funktion (Englisch)', 'variable_name' : 'funktion_en', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'mitglied')}});


// V Nicht Mitglied eines Organs der Gesellschaft, oder Mitglied eines Organs der Gesellschaft mit Vollmacht ############

var radio = page4.add_radio({'variable_name' : 'sex_v', 'required' : true, 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page4.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true, 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}});
var text = page4.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true, 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}});
var text = page4.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}});
var text = page4.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}});

var text = page4.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum_de', 'year' : true, 'required' : true, 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}});

var separator = page4.add_separator({'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}})

var radio = page4.add_radio({'variable_name' : 'staatsburger', 'required' : true, 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}});
var option = radio.add_option({'value' : 'schweizer', 'label' : 'Schweizer Staatsbürger'});
var option = radio.add_option({'value' : 'auslandischer', 'label' : 'Ausländischer Staatsbürger'});

var text = page4.add_text({'label' : 'Heimatort', 'variable_name' : 'heimatort', 'required' : true, 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied') && equals(['grunder', 'ag', index, 'staatsburger'], 'schweizer')}});
var text = page4.add_text({'label' : 'Staatsangehörige/r', 'variable_name' : 'staatsangehorige', 'required' : true, 'placeholder' : 'z.B. deutsche/r', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied') && equals(['grunder', 'ag', index, 'staatsburger'], 'auslandischer')}});
var text = page4.add_text({'label' : 'Citizen of', 'variable_name' : 'staatsangehorige', 'required' : true, 'placeholder' : 'e.g. Germany', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied') && equals(['grunder', 'ag', index, 'staatsburger'], 'auslandischer')}});

var separator = page4.add_separator({'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}})

var label = page4.add_label({'label' : 'Wohnsitzadresse','show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}});

var text = page4.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}});
var text = page4.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}});
var text = page4.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}});
var text = page4.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied') && equals(['grunder', 'ag', index, 'staatsburger'], 'auslandischer')}});

var separator = page4.add_separator({'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}})

var label = page4.add_label({'label' : 'Vollmacht','show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}});

var text = page4.add_text({'label' : 'Datum der Vollmacht', 'variable_name' : 'datum_vollmacht_de', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}, 'date' : true});

var radio = page4.add_radio({'variable_name' : 'beglaubigung', 'required' : true, 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')}, 'date' : true});
var option = radio.add_option({'value' : 'schweiz', 'label' : 'Beglaubigung in der Schweiz'});
var option = radio.add_option({'value' : 'ausland', 'label' : 'Beglaubigung im Ausland'});

var separator = page4.add_separator({'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied') && equals(['grunder', 'ag', index, 'beglaubigung'], 'ausland')}})

var radio = page4.add_radio({'variable_name' : 'beglaubigung_art', 'required' : true, 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'n_mitglied')  && equals(['grunder', 'ag', index, 'beglaubigung'], 'ausland')}, 'date' : true});
var option = radio.add_option({'value' : 'apostille', 'label' : 'Beglaubigung im Ausland mit Apostille'});
var option = radio.add_option({'value' : 'uberbeglaubigung', 'label' : 'Beglaubigung im Ausland mit Überbeglaubigung'});

// V Anderer Gründer #############################################################################

var text = page4.add_modelselect(vertreter_model, {'label' : 'Vertreter', 'variable_name' : 'vertreter', 'required' : true,'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'a_grunder')}});

var separator = page4.add_separator({'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'a_grunder')}})

var label = page4.add_label({'label' : 'Vollmacht','show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'a_grunder')}});

var text = page4.add_text({'label' : 'Datum der Vollmacht', 'variable_name' : 'datum_vollmacht_de', 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'a_grunder')}, 'date' : true});

var radio = page4.add_radio({'variable_name' : 'beglaubigung', 'required' : true, 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'a_grunder')}, 'date' : true});
var option = radio.add_option({'value' : 'schweiz', 'label' : 'Beglaubigung in der Schweiz'});
var option = radio.add_option({'value' : 'ausland', 'label' : 'Beglaubigung im Ausland'});

var separator = page4.add_separator({'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'a_grunder') && equals(['grunder', 'ag', index, 'beglaubigung'], 'ausland')}})

var radio = page4.add_radio({'variable_name' : 'beglaubigung_art', 'required' : true, 'show': function(self, index){return equals(['grunder', 'ag', index, 'vertretung'], 'a_grunder')  && equals(['grunder', 'ag', index, 'beglaubigung'], 'ausland')}, 'date' : true});
var option = radio.add_option({'value' : 'apostille', 'label' : 'Beglaubigung im Ausland mit Apostille'});
var option = radio.add_option({'value' : 'uberbeglaubigung', 'label' : 'Beglaubigung im Ausland mit Überbeglaubigung'});

var separator = page4.add_separator({})

var label = page4.add_label({'label' : 'Stammanteile'});

var text = page4.add_text({'label' : 'Anzahl zu zeichnende Stammanteile', 'variable_name' : 'stammanteile', 'required' : true});

var text = page4.add_text({'label' : 'Zertifikat Nr.', 'variable_name' : 'zertifikat_nr', 'required' : true, 'placeholder' : 'z.B. 3', 'tooltip' : 'Falls Zertifikate in Form von Namenpapieren ausgestellt werden.'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'ag' && v[3] == 'stammanteile' && typeof variables['grunder']['ag'][v[2]]['zertifikat_nr'] == 'undefined'){return true}else{return false}}, 'assignment' : function(v){variables['grunder']['ag'][v[2]]['zertifikat_nr'] = get_next_zertifikat_nr()}});

var text = page4.add_text({'label' : 'Stammanteil Nr.', 'variable_name' : 'stammanteil_nr', 'required' : true, 'placeholder' : 'z.B. 3-5'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder' && v[1] == 'ag' && v[3] == 'stammanteile' && typeof variables['grunder']['ag'][v[2]]['stammanteil_nr'] == 'undefined'){return true}else{return false}}, 'assignment' : function(v){variables['grunder']['ag'][v[2]]['stammanteil_nr'] = zertifikat_range(get_next_zertifikat_start() - parseInt(variables['grunder']['ag'][v[2]]['stammanteile'].replace(new RegExp(/[^0-9]/, 'g'), '')), variables['grunder']['ag'][v[2]]['stammanteile']) }});

var checkbox_group = page4.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Der Stammanteilhalter erwirbt allein oder in gemeinsamer Absprache mit Dritten Stammanteile und überschreitet dadurch den Grenzwert von 25 Prozent des Stammkapitals oder der Stimmen.', 'variable_name' : 'grenzwert', 'tooltip' : 'Der Stammanteilhalter erwirbt allein oder in gemeinsamer Absprache mit Dritten Stammanteile und überschreitet dadurch den Grenzwert von 25 Prozent des Stammkapitals oder der Stimmen.', 'disabled' : function(self,index){if(typeof variables['grunder']['ag'][index]['stammanteile'] != 'undefined' && typeof variables['stammkapital']['stammkapital']['anzahl'] != 'undefined' && parseInt(variables['grunder']['ag'][index]['stammanteile'].replace(new RegExp(/[^0-9]/, 'g'), '')) * 4 >=  parseInt(variables['stammkapital']['stammkapital']['anzahl'].replace(new RegExp(/[^0-9]/, 'g'), ''))){variables['grunder']['ag'][index]['grenzwert'] = true;return true}else{return false}}});

var separator = page4.add_separator({'show' : function(self, index){return equals(['grunder', 'ag', index, 'grenzwert'], true)}})

var radio = page4.add_radio({'variable_name' : 'berechtigt', 'required' : true, 'show' : function(self, index){return equals(['grunder', 'ag', index, 'grenzwert'], true)}});
var option = radio.add_option({'value' : 'andere', 'label' : 'Eine andere Person als der Stammanteilhalter ist an den Stammanteilen wirtschaftlich berechtigt'});
var option = radio.add_option({'value' : 'keine', 'label' : 'Es kann keine wirtschaftlich berechtigte Person im Sinne des Gesetzes gemeldet werden:'});

var textarea = page4.add_textarea({'label' : '', 'variable_name' : 'keine_text', 'default' : 'Im Sinne von Art. 790a Abs. 1 OR erkläre ich hiermit, dass in Bezug auf die Stammanteile keine wirtschaftlich berechtigte Person besteht.', 'show' : function(self, index){return equals(['grunder', 'ag', index, 'grenzwert'], true) && equals(['grunder', 'ag', index, 'berechtigt'], 'keine')}});

var label = page4.add_label({'label' : 'Zeichnungsberechtigter für GAFI Meldung', 'show' : function(self, index){return equals(['grunder', 'ag', index, 'grenzwert'], true)}});
                             
var text = page4.add_text({'label' : 'Vorname', 'variable_name' : 'vorname_z', 'required' : true, 'show' : function(self, index){return equals(['grunder', 'ag', index, 'grenzwert'], true)}});
var text = page4.add_text({'label' : 'Name', 'variable_name' : 'nachname_z', 'required' : true, 'show' : function(self, index){return equals(['grunder', 'ag', index, 'grenzwert'], true)}});
var text = page4.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_z_de', 'placeholder' : 'Optional', 'show' : function(self, index){return equals(['grunder', 'ag', index, 'grenzwert'], true)}});

var text = page4.add_text({'label' : 'Funktion (Deutsch)', 'variable_name' : 'funktion_z_de', 'show' : function(self, index){return equals(['grunder', 'ag', index, 'grenzwert'], true)}});

var text = page4.add_text({'label' : 'Funktion (Englisch)', 'variable_name' : 'funktion_z_en', 'show' : function(self, index){return equals(['grunder', 'ag', index, 'grenzwert'], true)}});

var checkbox_group = page4.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Zweiter Zeichnungsberechtigter', 'variable_name' : 'zweiter', 'show' : function(self, index){return equals(['grunder', 'ag', index, 'grenzwert'], true)} });

var label = page4.add_label({'label' : 'Zweiter Zeichnungsberechtigter', 'show' : function(self, index){return equals(['grunder', 'ag', index, 'grenzwert'], true) && equals(['grunder', 'ag', index, 'zweiter'], true)}});
                             
var text = page4.add_text({'label' : 'Vorname', 'variable_name' : 'vorname_z_2', 'required' : true, 'show' : function(self, index){return equals(['grunder', 'ag', index, 'grenzwert'], true) && equals(['grunder', 'ag', index, 'zweiter'], true)}});
var text = page4.add_text({'label' : 'Name', 'variable_name' : 'nachname_z_2', 'required' : true, 'show' : function(self, index){return equals(['grunder', 'ag', index, 'grenzwert'], true) && equals(['grunder', 'ag', index, 'zweiter'], true)}});
var text = page4.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_z_2_de', 'placeholder' : 'Optional', 'show' : function(self, index){return equals(['grunder', 'ag', index, 'grenzwert'], true) && equals(['grunder', 'ag', index, 'zweiter'], true)}});

var text = page4.add_text({'label' : 'Funktion (Deutsch)', 'variable_name' : 'funktion_z_2_de', 'show' : function(self, index){return equals(['grunder', 'ag', index, 'grenzwert'], true) && equals(['grunder', 'ag', index, 'zweiter'], true)}});

var text = page4.add_text({'label' : 'Funktion (Englisch)', 'variable_name' : 'funktion_z_2_en', 'show' : function(self, index){return equals(['grunder', 'ag', index, 'grenzwert'], true) && equals(['grunder', 'ag', index, 'zweiter'], true)}});

// Geschaftsfuhrung ######################################################################

var step6 = form.add_step({'title':'Geschäftsführung', 'variable_name':'geschaftsfuhrung'});

var page1 = step6.add_page({'title':'Wahl/Zusammensetzung', 'variable_name':'wahl'})

var radio = page1.add_radio({'variable_name' : 'wahl', 'required' : true});
var option = radio.add_option({'value' : 'gesellschafterversammlung', 'label' : 'Die Geschäftsführung wird durch die Gesellschafterversammlung gewählt'});
var option = radio.add_option({'value' : 'gemeinsam', 'label' : 'Alle Gesellschafter üben die Geschäftsführung gemeinsam aus (Selbstorganschaft)'});

var text = page1.add_text({'label' : 'Amtsperiode der Geschäftsführer', 'variable_name' : 'amtsperiode', 'show': function(self){return equals(['geschaftsfuhrung', 'wahl', 'wahl'], 'gesellschafterversammlung')}, 'default' : '1'});

var label = page1.add_label({'label' : 'Als Geschäftsführer können nur natürliche Personen eingesetzt werden. Ist an der Gesellschaft eine juristische Person oder eine Handelsgesellschaft beteiligt, so bezeichnet sie gegebenenfalls eine natürliche Person, die diese Funktion an ihrer Stelle ausübt.', 'show' : function(self, index){return equals(['geschaftsfuhrung', 'wahl', 'wahl'], 'gemeinsam')}, 'font_size' : function(self){return '13'}});

var checkbox_group = page1.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Eine solche Bezeichnung bedarf der Zustimmung der Gesellschafterversammlung', 'variable_name' : 'beziehung', 'tooltip' : 'Als Geschäftsführer können nur natürliche Personen eingesetzt werden. Ist an der Gesellschaft eine juristische Person oder eine Handelsgesellschaft beteiligt, so be-zeichnet sie gegebenenfalls eine natürliche Person, die diese Funktion an ihrer Stelle ausübt (Art. 809 Abs. 2 OR).', 'show' : function(self, index){return equals(['geschaftsfuhrung', 'wahl', 'wahl'], 'gemeinsam')}});

var page2 = step6.add_page({'title':'Vorsitz', 'variable_name':'vorsitz'})

var radio = page2.add_radio({'variable_name' : 'vorsitz', 'required' : true, 'disabled' : function(self){return equals(['geschaftsfuhrung', 'wahl', 'wahl'], 'gemeinsam')}});
var option = radio.add_option({'value' : 'selbst', 'label' : 'Hat die Gesellschaft mehrere Geschäftsführer, so bestimmen diese aus ihrer Mitte einen Vorsitzenden. Insbesondere legen die Geschäftsführer die Art der Zeichnung der Geschäftsführer fest.'});
var option = radio.add_option({'value' : 'versammlung', 'label' : 'Hat die Gesellschaft mehrere Geschäftsführer, so muss die Gesellschafterversammlung den Vorsitz regeln. Im Übrigen organisieren sich die Geschäftsführer selbst. '});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'geschaftsfuhrung' && v[1] == 'wahl' && v[2] == 'wahl' && equals(['geschaftsfuhrung', 'wahl', 'wahl'], 'gemeinsam')){return true}else{return false}}, 'assignment' : function(){variables['geschaftsfuhrung']['vorsitz']['vorsitz'] = 'versammlung'}});

var page3 = step6.add_page({'title':'Ernennungen', 'variable_name':'ernennungen'})

var radio = page3.add_radio({'variable_name' : 'ernennugen', 'required' : true, 'label' : 'Ernennung von Direktoren, Prokuristen und Handlungsbevollmächtigten'});
var option = radio.add_option({'value' : 'geschaftsfuhrer', 'label' : 'Ernennung durch die Geschäftsführer'});
var option = radio.add_option({'value' : 'gesellschafterversammlung', 'label' : 'Ernennung durch die Gesellschafterversammlung'});

var page4 = step6.add_page({'title':'Sitzungen und Beschlussfassung', 'variable_name':'sitzungen'})

var label = page4.add_label({'label' : 'Sitzungen'});

var checkbox_group = page4.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Sitzungen der Geschäftsführung können auch mittels Telefon oder Videokonferenz abgehalten werden', 'variable_name' : 'telefon'});

var separator = page4.add_separator({})

var label = page4.add_label({'label' : 'Beschlussfassung'});

var textarea = page4.add_textarea({'label' : 'Beschlussfassung (Deutsch)', 'variable_name' : 'beschlussfassung_de', 'required' : true, 'default' : 'Hat die Gesellschaft mehrere Geschäftsführer, so entscheiden diese mit der Mehrheit der abgegebenen Stimmen. Bei Stimmengleichheit hat der Vorsitzende den Stichentscheid. '});

var textarea = page4.add_textarea({'label' : 'Beschlussfassung (Englisch)', 'variable_name' : 'beschlussfassung_en', 'required' : true, 'default' : 'Hat die Gesellschaft mehrere Geschäftsführer, so entscheiden diese mit der Mehrheit der abgegebenen Stimmen. Bei Stimmengleichheit hat der Vorsitzende den Stichentscheid. '});

var page5 = step6.add_page({'title':'Gesellschafterversammlung', 'variable_name':'genehmigung'});

var checkbox_group = page5.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Die Geschäftsführer haben der Gesellschafterversammlung bestimmte Entscheide zur Genehmigung vorzulegen', 'variable_name' : 'haben'});

var textarea = page5.add_textarea({'label' : 'Deutsch', 'variable_name' : 'haben_text_de', 'required' : true, 'default' : 'Die Geschäftsführer haben der Gesellschafterversammlung die folgenden Entscheide zur Genehmigung vorzulegen:', 'show' : function(self, index){return equals(['geschaftsfuhrung', 'genehmigung', 'haben'], true)}});

var textarea = page5.add_textarea({'label' : 'Englisch', 'variable_name' : 'haben_text_en', 'required' : true, 'default' : "The managing directors must submit the following decisions to the shareholders' meeting for approval:", 'show' : function(self, index){return equals(['geschaftsfuhrung', 'genehmigung', 'haben'], true)}});

var separator = page5.add_separator({})

var checkbox_group = page5.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Die Geschäftsführer können der Gesellschafterversammlung bestimmte Entscheide zur Genehmigung vorzulegen', 'variable_name' : 'konnen'});

var textarea = page5.add_textarea({'label' : 'Deutsch', 'variable_name' : 'konnen_text_de', 'required' : true, 'default' : 'Die Geschäftsführer können der Gesellschafterversammlung die folgenden Fragen zur Genehmigung vorlegen:', 'show' : function(self, index){return equals(['geschaftsfuhrung', 'genehmigung', 'konnen'], true)}});

var textarea = page5.add_textarea({'label' : 'Englisch', 'variable_name' : 'konnen_text_en', 'required' : true, 'default' : "The managing directors may submit the following individual matters to the shareholders’ meeting for approval:", 'show' : function(self, index){return equals(['geschaftsfuhrung', 'genehmigung', 'konnen'], true)}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'geschaftsfuhrung' && v[1] == 'genehmigung' && v[2] == 'haben' && equals(['geschaftsfuhrung', 'genehmigung', 'haben'], true)){return true}else{return false}}, 'assignment' : function(v){variables['geschaftsfuhrung']['genehmigung']['konnen_text_de'] = 'Die Geschäftsführer können der Gesellschafterversammlung ferner die folgenden Fragen zur Genehmigung vorlegen:';variables['geschaftsfuhrung']['genehmigung']['konnen_text_en'] = 'Further to the above, the managing directors may submit the following individual matters to the shareholders’ meeting for approval:';}});



var page6 = step6.add_page({'title':'Übertragung der Geschäftsführung', 'variable_name':'ubertragung'});

var checkbox_group = page6.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Die Geschäftsführer können die Geschäftsführung nach Massgabe eines Organisationsreglementes ganz oder zum Teil an einzelne Geschäftsführer oder an Dritte übertragen. ', 'variable_name' : 'ubertragung'});

var page7 = step6.add_page({'title':'Vertretung', 'variable_name':'vertretung', 'show' : function(self, index){return equals(['geschaftsfuhrung', 'wahl', 'wahl'], 'gemeinsam')}});

var radio = page7.add_radio({'variable_name' : 'vertretung', 'required' : true, 'label' : ''});
var option = radio.add_option({'value' : 'jeder', 'label' : 'Jeder Geschäftsführer ist zur Vertretung der Gesellschaft berechtigt.', 'default' : function(){return true}});
var option = radio.add_option({'value' : 'gesellschafterversammlung', 'label' : 'Die Art der Zeichnungsberechtigung der Geschäftsführer wird durch die Gesellschafterversammlung bestimmt.'});

var page8 = step6.add_page({'title':'Konkurrenzverbot', 'variable_name':'konkurrenzverbot'});

var checkbox_group = page8.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Konkurrenzverbot', 'variable_name' : 'konkurrenzverbot', 'tooltip' : 'Die Geschäftsführer sowie Dritte, die mit der Geschäftsführung befasst sind, unterstehem einem Konkurrenzverbot.', 'disabled' : function(){return equals(['geschaftsfuhrung', 'wahl', 'wahl'], 'gemeinsam')}});

var radio = page8.add_radio({'variable_name' : 'zustimmen', 'required' : true, 'label' : 'Die Geschäftsführer sowie Dritte, die mit der Geschäftsführung befasst sind, dürfen keine konkurrenzierenden Tätigkeiten ausüben, es sei denn, dass', 'show' : function(){return equals(['geschaftsfuhrung', 'konkurrenzverbot', 'konkurrenzverbot'], true)}});
var option = radio.add_option({'value' : 'option1', 'label' : 'alle Gesellschafter schriftlich zustimmen.', 'default' : function(){return true}});
var option = radio.add_option({'value' : 'option2', 'label' : 'die Gesellschafterversammlung stimmt mit qualifizierter Mehrheit von mindestens zwei Drittel der vertretenen Stimmen sowie der absoluten Mehrheit des gesamten Stammkapitals, mit dem ein ausübbares Stimmrecht verbunden ist, zu.'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'geschaftsfuhrung' && v[1] == 'wahl' && v[2] == 'wahl' && equals(['geschaftsfuhrung', 'wahl', 'wahl'], 'gemeinsam')){return true}else{return false}}, 'assignment' : function(v){variables['geschaftsfuhrung']['konkurrenzverbot']['konkurrenzverbot'] = true}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'geschaftsfuhrung' && v[1] == 'konkurrenzverbot' && v[2] == 'zustimmen' && equals(['geschaftsfuhrung', 'wahl', 'wahl'], 'gemeinsam')){return true}else{return false}}, 'assignment' : function(v){variables['rechte']['treuepflicht']['treuepflicht'] = variables['geschaftsfuhrung']['konkurrenzverbot']['zustimmen']}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'rechte' && v[1] == 'treuepflicht' && v[2] == 'treuepflicht' && equals(['geschaftsfuhrung', 'wahl', 'wahl'], 'gemeinsam')){return true}else{return false}}, 'assignment' : function(v){variables['geschaftsfuhrung']['konkurrenzverbot']['zustimmen'] = variables['rechte']['treuepflicht']['treuepflicht']}});


//Geschaftsfuhrer snp

var step7 = form.add_step({'title':'Geschäftsführer', 'variable_name':'geschaftsfuhrer'});

var page1 = step7.add_multipage({'title' : 'Schweizerische natürliche Person', 'variable_name' : 'snp', 'naming' : function(self, index){if(typeof variables['geschaftsfuhrer']['snp'][index]['vorname'] !== 'undefined' && typeof variables['geschaftsfuhrer']['snp'][index]['nachname'] !== 'undefined'){return variables['geschaftsfuhrer']['snp'][index]['vorname'] + ' ' + variables['geschaftsfuhrer']['snp'][index]['nachname'];}else{return 'Schweizerische natürliche Person ' + parseInt(index + 1);}}, 'show' : function(self, index){return equals(['geschaftsfuhrung', 'wahl', 'wahl'], 'gesellschafterversammlung')}, 'suggestions_model' : snp_model, 'suggestions_active' : function(self, index){if((typeof variables['geschaftsfuhrer']['snp'][index]['vorname'] == 'undefined' || variables['geschaftsfuhrer']['snp'][index]['vorname'] == '') && variables['grunder']['snp'].length > 0){return true;}else{return false;}}});

var f_snp = page1

var radio = page1.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page1.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true});
var text = page1.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true});
var text = page1.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional'});
var text = page1.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional'});
var text = page1.add_text({'label' : 'Kose-/Ruf-/Künstlername', 'variable_name' : 'kose', 'placeholder' : 'Optional'});
var text = page1.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum_de', 'year' : true});

var text = page1.add_text({'label' : 'Heimatort (Deutsch)', 'variable_name' : 'heimatort_de'});
var text = page1.add_text({'label' : 'Heimatort (Englisch)', 'variable_name' : 'heimatort_en'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'geschaftsfuhrer' && v[1] == 'snp' && v[3] == 'geburtsdatum_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['geburtsdatum_en'] = convert_date(variables[v[0]][v[1]][v[2]]['geburtsdatum_de'])}});

var label = page1.add_label({'label' : 'Wohnsitzadresse'});
var text = page1.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse'});
var text = page1.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de'});
var text = page1.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en'});

var checkbox_group = page1.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Wohnsitz im Ausland', 'variable_name' : 'ausland'});
var text = page1.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel', 'show' : function(self, index){if(typeof variables['geschaftsfuhrer']['snp'][index]['ausland'] !== 'undefined' && variables['geschaftsfuhrer']['snp'][index]['ausland']){return true;}else{return false;}}});

var dropdown = page1.add_dropdown({'variable_name' : 'zeichnungsberechtigung', 'label' : 'Zeichnungsberechtigung', 'required' : true, 'disabled': function(){if(equals(['geschaftsfuhrung', 'vertretung', 'vertretung'], 'jeder')){return true}else{return false}}});

var option = dropdown.add_option({'value' : '0', 'label' : 'Ohne Zeichnungsberechtigung'});
var option = dropdown.add_option({'value' : '1', 'label' : 'Einzelunterschrift', 'default' : function(self){return true;}});
var option = dropdown.add_option({'value' : '2', 'label' : 'Kollektivunterschrift zu zweien'});
var option = dropdown.add_option({'value' : '3', 'label' : 'Kollektivunterschrift zu dreien'});
var option = dropdown.add_option({'value' : '4', 'label' : 'Kollektivunterschrift zu vieren'});
var option = dropdown.add_option({'value' : '5', 'label' : 'Kollektivunterschrift zu fünfen'});
var option = dropdown.add_option({'value' : '6', 'label' : 'Kollektivunterschrift zu sechsen'});

//Geschaftsfuhrer anp

var page2 = step7.add_multipage({'title' : 'Ausländische natürliche Person', 'variable_name' : 'anp', 'naming' : function(self, index){if(typeof variables['geschaftsfuhrer']['anp'][index]['vorname'] !== 'undefined' && typeof variables['geschaftsfuhrer']['anp'][index]['nachname'] !== 'undefined'){return variables['geschaftsfuhrer']['anp'][index]['vorname'] + ' ' + variables['geschaftsfuhrer']['anp'][index]['nachname'];}else{return 'Ausländische natürliche Person ' + parseInt(index + 1);}}, 'show' : function(self, index){return equals(['geschaftsfuhrung', 'wahl', 'wahl'], 'gesellschafterversammlung')}, 'suggestions_model' : anp_model, 'suggestions_active' : function(self, index){if((typeof variables['geschaftsfuhrer']['anp'][index]['vorname'] == 'undefined' || variables['geschaftsfuhrer']['anp'][index]['vorname'] == '') && variables['grunder']['anp'].length > 0){return true;}else{return false;}}});

var f_anp = page2

var radio = page2.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page2.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true});
var text = page2.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true});
var text = page2.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional'});
var text = page2.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional'});
var text = page2.add_text({'label' : 'Kose-/Ruf-/Künstlername', 'variable_name' : 'kose', 'placeholder' : 'Optional'});
var text = page2.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum_de', 'year' : true});

var text = page2.add_text({'label' : 'Heimatort (Deutsch)', 'variable_name' : 'heimatort_de'});
var text = page2.add_text({'label' : 'Heimatort (Englisch)', 'variable_name' : 'heimatort_en'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'geschaftsfuhrer' && v[1] == 'anp' && v[3] == 'geburtsdatum_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['geburtsdatum_en'] = convert_date(variables[v[0]][v[1]][v[2]]['geburtsdatum_de'])}});

var text = page2.add_text({'label' : 'Staatsangehörige/r', 'variable_name' : 'staatsangehorige_de', 'required' : true, 'placeholder' : 'z.B. deutsche/r'});
var text = page2.add_text({'label' : 'Citizen of', 'variable_name' : 'staatsangehorige_en', 'required' : true, 'placeholder' : 'e.g. Germany'});

var label = page2.add_label({'label' : 'Wohnsitzadresse'});
var text = page2.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse'});
var text = page2.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de'});
var text = page2.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en'});

var checkbox_group = page2.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Wohnsitz im Ausland', 'variable_name' : 'ausland'});
var text = page2.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel', 'show' : function(self, index){if(typeof variables['geschaftsfuhrer']['anp'][index]['ausland'] !== 'undefined' && variables['geschaftsfuhrer']['anp'][index]['ausland']){return true;}else{return false;}}});

var dropdown = page2.add_dropdown({'variable_name' : 'zeichnungsberechtigung', 'label' : 'Zeichnungsberechtigung', 'required' : true, 'disabled': function(){if(equals(['geschaftsfuhrung', 'vertretung', 'vertretung'], 'jeder')){return true}else{return false}}});

var option = dropdown.add_option({'value' : '1', 'label' : 'Einzelunterschrift', 'default' : function(self){return true;}});
var option = dropdown.add_option({'value' : '2', 'label' : 'Kollektivunterschrift zu zweien'});
var option = dropdown.add_option({'value' : '3', 'label' : 'Kollektivunterschrift zu dreien'});
var option = dropdown.add_option({'value' : '4', 'label' : 'Kollektivunterschrift zu vieren'});
var option = dropdown.add_option({'value' : '5', 'label' : 'Kollektivunterschrift zu fünfen'});
var option = dropdown.add_option({'value' : '6', 'label' : 'Kollektivunterschrift zu sechsen'});


//snp firmenvertreter

var page3 = step7.add_multipage({'title' : 'Schweizerischer Firmenvertreter', 'variable_name' : 'sfv', 'naming' : function(self, index){if(typeof variables['geschaftsfuhrer']['sfv'][index]['vorname'] !== 'undefined' && typeof variables['geschaftsfuhrer']['sfv'][index]['nachname'] !== 'undefined'){return variables['geschaftsfuhrer']['sfv'][index]['vorname'] + ' ' + variables['geschaftsfuhrer']['sfv'][index]['nachname'];}else{return 'Schweizerischer Firmenvertreter ' + parseInt(index + 1);}}, 'show' : function(self, index){return equals(['geschaftsfuhrung', 'wahl', 'wahl'], 'gemeinsam') && (variables['grunder']['sjp'].length > 0 || variables['grunder']['ag'].length) }});

var f_sfv = page3

var firmen_model = new Model(form, {'name' : 'firmen_model', 'sources' : [sjp, ag]});
var text = page3.add_modelselect(firmen_model, {'label' : 'Vertretene Firma', 'variable_name' : 'firma', 'required' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'geschaftsfuhrer' && v[3] == 'firma'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['firma_array'] = parse_vorsitzender(variables[v[0]][v[1]][v[2]][v[3]])}});

var radio = page3.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page3.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true});
var text = page3.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true});
var text = page3.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional'});
var text = page3.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional'});
var text = page3.add_text({'label' : 'Kose-/Ruf-/Künstlername', 'variable_name' : 'kose', 'placeholder' : 'Optional'});
var text = page3.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum_de', 'year' : true});

var text = page3.add_text({'label' : 'Heimatort (Deutsch)', 'variable_name' : 'heimatort_de'});
var text = page3.add_text({'label' : 'Heimatort (Englisch)', 'variable_name' : 'heimatort_en'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'geschaftsfuhrer' && v[1] == 'sfv' && v[3] == 'geburtsdatum_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['geburtsdatum_en'] = convert_date(variables[v[0]][v[1]][v[2]]['geburtsdatum_de'])}});

var label = page3.add_label({'label' : 'Wohnsitzadresse'});
var text = page3.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse'});
var text = page3.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de'});
var text = page3.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en'});

var checkbox_group = page3.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Wohnsitz im Ausland', 'variable_name' : 'ausland'});
var text = page3.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel', 'show' : function(self, index){if(typeof variables['geschaftsfuhrer']['sfv'][index]['ausland'] !== 'undefined' && variables['geschaftsfuhrer']['sfv'][index]['ausland']){return true;}else{return false;}}});

var dropdown = page3.add_dropdown({'variable_name' : 'zeichnungsberechtigung', 'label' : 'Zeichnungsberechtigung', 'required' : true, 'disabled': function(){if(equals(['geschaftsfuhrung', 'vertretung', 'vertretung'], 'jeder')){return true}else{return false}}});

var option = dropdown.add_option({'value' : '1', 'label' : 'Einzelunterschrift', 'default' : function(self){return true;}});
var option = dropdown.add_option({'value' : '2', 'label' : 'Kollektivunterschrift zu zweien'});
var option = dropdown.add_option({'value' : '3', 'label' : 'Kollektivunterschrift zu dreien'});
var option = dropdown.add_option({'value' : '4', 'label' : 'Kollektivunterschrift zu vieren'});
var option = dropdown.add_option({'value' : '5', 'label' : 'Kollektivunterschrift zu fünfen'});
var option = dropdown.add_option({'value' : '6', 'label' : 'Kollektivunterschrift zu sechsen'});

//anp firmenvertreter

var page4 = step7.add_multipage({'title' : 'Ausländischer Firmenvertreter', 'variable_name' : 'afv', 'naming' : function(self, index){if(typeof variables['geschaftsfuhrer']['afv'][index]['vorname'] !== 'undefined' && typeof variables['geschaftsfuhrer']['afv'][index]['nachname'] !== 'undefined'){return variables['geschaftsfuhrer']['afv'][index]['vorname'] + ' ' + variables['geschaftsfuhrer']['afv'][index]['nachname'];}else{return 'Ausländischer Firmenvertreter ' + parseInt(index + 1);}}, 'show' : function(self, index){return equals(['geschaftsfuhrung', 'wahl', 'wahl'], 'gemeinsam')}});

var f_afv = page4

var text = page4.add_modelselect(firmen_model, {'label' : 'Vertretene Firma', 'variable_name' : 'firma', 'required' : true});

var radio = page4.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page4.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true});
var text = page4.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true});
var text = page4.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional'});
var text = page4.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional'});
var text = page4.add_text({'label' : 'Kose-/Ruf-/Künstlername', 'variable_name' : 'kose', 'placeholder' : 'Optional'});
var text = page4.add_text({'label' : 'Geburtsdatum', 'variable_name' : 'geburtsdatum_de', 'year' : true});

var text = page4.add_text({'label' : 'Heimatort (Deutsch)', 'variable_name' : 'heimatort_de'});
var text = page4.add_text({'label' : 'Heimatort (Englisch)', 'variable_name' : 'heimatort_en'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'geschaftsfuhrer' && v[1] == 'afv' && v[3] == 'geburtsdatum_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['geburtsdatum_en'] = convert_date(variables[v[0]][v[1]][v[2]]['geburtsdatum_de'])}});

var text = page4.add_text({'label' : 'Staatsangehörige/r', 'variable_name' : 'staatsangehorige_de', 'required' : true, 'placeholder' : 'z.B. deutsche/r'});
var text = page4.add_text({'label' : 'Citizen of', 'variable_name' : 'staatsangehorige_en', 'required' : true, 'placeholder' : 'e.g. Germany'});

var label = page4.add_label({'label' : 'Wohnsitzadresse'});
var text = page4.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse'});
var text = page4.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de'});
var text = page4.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en'});

var checkbox_group = page4.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Wohnsitz im Ausland', 'variable_name' : 'ausland'});
var text = page4.add_text({'label' : 'Landeskürzel', 'variable_name' : 'landeskurzel', 'show' : function(self, index){if(typeof variables['geschaftsfuhrer']['afv'][index]['ausland'] !== 'undefined' && variables['geschaftsfuhrer']['afv'][index]['ausland']){return true;}else{return false;}}});

var dropdown = page4.add_dropdown({'variable_name' : 'zeichnungsberechtigung', 'label' : 'Zeichnungsberechtigung', 'required' : true, 'disabled': function(){if(equals(['geschaftsfuhrung', 'vertretung', 'vertretung'], 'jeder')){return true}else{return false}}});

var option = dropdown.add_option({'value' : '1', 'label' : 'Einzelunterschrift', 'default' : function(self){return true;}});
var option = dropdown.add_option({'value' : '2', 'label' : 'Kollektivunterschrift zu zweien'});
var option = dropdown.add_option({'value' : '3', 'label' : 'Kollektivunterschrift zu dreien'});
var option = dropdown.add_option({'value' : '4', 'label' : 'Kollektivunterschrift zu vieren'});
var option = dropdown.add_option({'value' : '5', 'label' : 'Kollektivunterschrift zu fünfen'});
var option = dropdown.add_option({'value' : '6', 'label' : 'Kollektivunterschrift zu sechsen'});

var page5 = step7.add_page({'title':'Vorsitzender', 'variable_name':'vorsitzender'})

var fuhrer_model = new Model(form, {'name' : 'fuhrer_model', 'sources' : [f_snp, f_anp, f_sfv, f_afv]});

var text = page5.add_modelselect(fuhrer_model, {'label' : 'Vorsitzender der Geschäftsführung', 'variable_name' : 'vorsitzender', 'required' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'geschaftsfuhrer' && typeof variables['geschaftsfuhrer']['vorsitzender']['vorsitzender'] != 'undefined'){return true}else{return false}}, 'assignment' : function(){variables['geschaftsfuhrer']['vorsitzender']['vorsitzender_array'] = parse_vorsitzender(variables['geschaftsfuhrer']['vorsitzender']['vorsitzender'])}});

var step8 = form.add_step({'title':'Gesellschafterversammlung', 'variable_name':'gesellschafterversammlung'});

var page1 = step8.add_page({'title':'Einberufung', 'variable_name':'einberufung'})

var text = page1.add_text({'label' : 'Frist für die Einberufung (Tage): ', 'variable_name' : 'frist', 'required' : true, 'default' : '20'});

var alert1 = text.add_alert({'condition' : function(self, end, index){if(typeof variables['gesellschafterversammlung']['einberufung']['frist'] != 'undefined' && parseInt(variables['gesellschafterversammlung']['einberufung']['frist'].replace(/[^0-9]/, '')) < 10){return true;}else{return false;}}, 'message' : "Die Frist muss mindestens 10 Tage betragen."});

var page2 = step8.add_page({'title':'Modalitäten der Versammlung', 'variable_name':'modalitaten'})

var checkbox_group = page2.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Gesellschafterversammlungen können auch mittels Videokonferenz abgehalten werden. ', 'variable_name' : 'video'});

var page3 = step8.add_page({'title':'Vertretung der Gesellschafter', 'variable_name':'vertretung'})

var radio = page3.add_radio({'variable_name' : 'vertretung', 'required' : true, 'label' : ''});
var option = radio.add_option({'value' : 'option1', 'label' : 'Jeder Gesellschafter kann seine Stammanteile in der Gesellschafterversammlung durch einen Dritten vertreten lassen, der nicht Gesellschafter zu sein braucht.', 'default' : function(){return true}});
var option = radio.add_option({'value' : 'option2', 'label' : 'Jeder Gesellschafter kann seine Stammanteile in der Gesellschafterversammlung durch einen anderen Gesellschafter, durch seinen Ehegatten, seinen eingetragenen Partner oder seinen Lebenspartner, durch Personen, die im gleichen Haushalt leben, oder durch einen Nachkommen vertreten lassen. '});

var page4 = step8.add_page({'title':'Beschlussfassung und Wahlen', 'variable_name':'beschlussfassung'})

var radio = page4.add_radio({'variable_name' : 'mehrheitserfordernisse', 'required' : true, 'label' : 'Mehrheitserfordernisse'});
var option = radio.add_option({'value' : 'option1', 'label' : 'Die Gesellschafterversammlung fasst ihre Beschlüsse und vollzieht ihre Wahlen, soweit das Gesetz oder diese Statuten es nicht anders bestimmen, mit der absoluten Mehrheit der vertretenen Stimmen.', 'tooltip' : 'Dies bedeutet, dass Enthaltungen als Nein-Stimmen gezählt werden.', 'default' : function(){return true}});
var option = radio.add_option({'value' : 'option2', 'label' : 'Die Gesellschafterversammlung fasst ihre Beschlüsse und vollzieht ihre Wahlen, soweit das Gesetz oder diese Statuten es nicht anders bestimmen, mit der absoluten Mehrheit der abgegebenen Stimmen. ', 'tooltip' : 'Dies bedeutet, dass Enthaltungen in der Abstimmung nicht gezählt werden.'});

var radio = page4.add_radio({'variable_name' : 'stimmrecht', 'required' : true, 'label' : 'Stimmrecht des Vorsitzenden der Gesellschafterversammlung '});
var option = radio.add_option({'value' : 'option1', 'label' : 'Der Vorsitzende der Gesellschafterversammlung ist stimmberechtigt. Bei Stimmengleichheit steht ihm der Stichentscheid zu.'});
var option = radio.add_option({'value' : 'option2', 'label' : 'Bei Stimmengleichheit gilt der Antrag als abgelehnt. Dem Vorsitzenden der Generalversammlung steht kein Stichentscheid zu.'});



var step9 = form.add_step({'title':'Revisionsstelle', 'variable_name':'revisionsstelle'});

var page1 = step9.add_page({'title':'Wahl einer Revisionsstelle ', 'variable_name':'wahl'})


var radio = page1.add_radio({'variable_name' : 'wahl', 'required' : true, 'label' : ''});
var option = radio.add_option({'value' : 'wahl', 'label' : 'Wahl einer Revisionsstelle'});
var option = radio.add_option({'value' : 'verzicht', 'label' : 'Verzicht auf Revisionsstelle', 'tooltip' : 'Auf die Wahl einer Revisionsstelle kann verzichtet werden, wenn die Gesellschaft nicht zur ordentlichen Revision verpflichtet ist, sämtliche Gesellschafter zustimmen und die Gesellschaft nicht mehr als zehn Vollzeitstellen im Jahresdurchschnitt hat (Art. 818 Abs. 1 i.V.m. Art. 727a Abs. 2 OR).'});

var text = page1.add_text({'label' : 'Amtsperiode der Revisionsstelle: ', 'variable_name' : 'amtsperiode', 'required' : true, 'default' : '1'});

var page2 = step9.add_multipage({'title' : 'Revisionsstelle', 'variable_name' : 'revisionsstelle', 'naming' : function(self, index){if(equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'firma') && typeof variables['revisionsstelle']['revisionsstelle'][index]['name'] != 'undefined'){return variables['revisionsstelle']['revisionsstelle'][index]['name'];}else if(equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'person') && typeof variables['revisionsstelle']['revisionsstelle'][index]['vorname'] != 'undefined' && typeof variables['revisionsstelle']['revisionsstelle'][index]['nachname'] != 'undefined'){return variables['revisionsstelle']['revisionsstelle'][index]['vorname'] + ' ' + variables['revisionsstelle']['revisionsstelle'][index]['nachname']}else{return 'Revisionsstelle ' + parseInt(index + 1);}}, 'show' : function(self, index){return equals(['revisionsstelle', 'wahl', 'wahl'], 'wahl')}});

var radio = page2.add_radio({'variable_name' : 'typ', 'required' : true, 'label' : ''});
var option = radio.add_option({'value' : 'firma', 'label' : 'Firma'});
var option = radio.add_option({'value' : 'person', 'label' : 'Person'});

var separator = page2.add_separator({'show' : function(self, index){return equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'firma') || equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'person')}})

var text = page2.add_text({'label' : 'Name', 'variable_name' : 'name', 'required' : true, 'show' : function(self, index){return equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'firma')}});

var text = page2.add_text({'label' : 'Unternehmensidentifikationsnummer', 'variable_name' : 'che', 'required' : true, 'show' : function(self, index){return equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'firma')}});

var text = page2.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true, 'show' : function(self, index){return equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'person')}});
var text = page2.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true, 'show' : function(self, index){return equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'person')}});
var text = page2.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional', 'show' : function(self, index){return equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'person')}});
var text = page2.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional', 'show' : function(self, index){return equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'person')}});
var text = page2.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse','show' : function(self, index){return equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'firma') || equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'person')}});
var text = page2.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de','show' : function(self, index){return equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'firma') || equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'person')}});
var text = page2.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en','show' : function(self, index){return equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'firma') || equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'person')}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'revisionsstelle' && v[1] == 'revisionsstelle' && v[3] == 'plz_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['ort_de'] = variables[v[0]][v[1]][v[2]]['plz_de'].replace(new RegExp(/[0-9]/, 'g'), '').replace(',','').trim()}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'revisionsstelle' && v[1] == 'revisionsstelle' && v[3] == 'plz_en'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['ort_en'] = variables[v[0]][v[1]][v[2]]['plz_en'].replace(new RegExp(/[0-9]/, 'g'), '').replace(',','').trim()}});

var text = page2.add_text({'label' : 'Land (Deutsch)', 'variable_name' : 'land_de','show' : function(self, index){return equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'firma') || equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'person')}});
var text = page2.add_text({'label' : 'Land (Englisch)', 'variable_name' : 'land_en','show' : function(self, index){return equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'firma') || equals(['revisionsstelle', 'revisionsstelle', index, 'typ'], 'person')}});

var step10 = form.add_step({'title':'Rechte und Pflichten der Gesellschafter', 'variable_name':'rechte'});

var page1 = step10.add_page({'title':'Sonderprüfung', 'variable_name' : 'sonderprufung', 'tooltip' : 'Ein Recht auf Sonderprüfung ist von Gesetzes wegen nicht vorgesehen.'})

var checkbox_group = page1.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Jeder Gesellschafter kann der Gesellschafterversammlung beantragen, bestimmte Sachverhalte durch eine Sonderprüfung abklären zu lassen, sofern dies zur Ausübung der Gesellschafterrechte erforderlich ist und er das Recht auf Auskunft oder das Recht auf Einsicht bereits ausgeübt hat.', 'variable_name' : 'sonderprufung'});

var page2 = step10.add_page({'title':'Nachschusspflicht', 'variable_name' : 'nachschuss'})

var checkbox_group = page2.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Nachschusspflicht', 'variable_name' : 'nachschusspflicht', 'tooltip' : 'Kann nützlich sein, um Kreditwürdigkeit der Gesellschaft zu erhöhen, birgt aber auch Haftungsrisiken für Stammanteilhalter.'});

var separator = page2.add_separator({'show': function(self, index){return equals(['rechte', 'nachschuss', 'nachschusspflicht'], true)}})

var radio = page2.add_radio({'variable_name' : 'art', 'required' : true, 'label' : 'Art', tooltip : 'Der Betrag kann sowohl in absoluten Zahlen (CHF) wie auch in Prozenten des Nennwerts des Stammanteils angegeben werden.','show': function(self, index){return equals(['rechte', 'nachschuss', 'nachschusspflicht'], true)}});
var option = radio.add_option({'value' : 'betrag', 'label' : 'Betrag CHF pro Stammanteil'});
var option = radio.add_option({'value' : 'prozent', 'label' : 'Prozentsatz des Nennwerts pro Stammanteil'});

var text = page2.add_text({'label' : 'Betrag (CHF)', 'variable_name' : 'betrag', 'required' : true, 'placeholder' : 'z.B. 100', 'show' : function(){return equals(['rechte', 'nachschuss', 'nachschusspflicht'], true) && equals(['rechte', 'nachschuss', 'art'], 'betrag')}, 'tooltip' : 'Der Betrag der mit einem Stammanteil verbundenen Nachschusspflicht darf das Doppelte des Nennwerts des Stammanteils nicht übersteigen (Art. 795 OR).'});
var alert1 = text.add_alert({'condition' : function(self, end, index){if(typeof variables['rechte']['nachschuss']['betrag'] != 'undefined' && typeof variables['stammkapital']['stammkapital']['nominalwert'] != 'undefined' && parseInt(variables['stammkapital']['stammkapital']['nominalwert'].toString().replace(/[^0-9]/, '')) < parseInt(variables['rechte']['nachschuss']['betrag'].toString().replace(/[^0-9]/, ''))){return true;}else{return false;}}, 'message' : "Der Betrag der mit einem Stammanteil verbundenen Nachschusspflicht darf das Doppelte des Nennwerts des Stammanteils nicht übersteigen."});

var text = page2.add_text({'label' : 'Prozentsatz', 'variable_name' : 'prozent', 'required' : true, 'placeholder' : 'z.B. 10%', 'show' : function(){return equals(['rechte', 'nachschuss', 'nachschusspflicht'], true) && equals(['rechte', 'nachschuss', 'art'], 'prozent')}, 'tooltip' : 'Der Betrag der mit einem Stammanteil verbundenen Nachschusspflicht darf das Doppelte des Nennwerts des Stammanteils nicht übersteigen (Art. 795 OR).'});
var alert1 = text.add_alert({'condition' : function(self, end, index){if(typeof variables['rechte']['nachschuss']['prozent'] != 'undefined' && 200 < parseInt(variables['rechte']['nachschuss']['prozent'].replace(/[^0-9]/, ''))){return true;}else{return false;}}, 'message' : "Der Betrag der mit einem Stammanteil verbundenen Nachschusspflicht darf das Doppelte des Nennwerts des Stammanteils nicht übersteigen."});

var page3 = step10.add_page({'title':'Konkurrenzverbot', 'variable_name' : 'konkurrenzverbot'})

var checkbox_group = page3.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Konkurrenzverbot', 'variable_name' : 'konkurrenzverbot', 'tooltip' : 'Die Gesellschafter dürfen keine die Gesellschaft konkurrenzierenden Tätigkeiten ausüben.'});

var page4 = step10.add_page({'title':'Vorkaufsrecht', 'variable_name' : 'vorkaufsrecht'})

var checkbox_group = page4.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Vorkaufsrecht', 'variable_name' : 'vorkaufsrecht'});

var text = page4.add_text({'label' : 'Frist für die Mitteilung an übrige Gesellschafter und Geschäftsführung nach Eintritt eines Vorkaufsfalles (Tage): ', 'variable_name' : 'frist_1', 'required' : true, 'default' : '30', 'show' : function(self){return equals(['rechte', 'vorkaufsrecht', 'vorkaufsrecht'], true)}});
var text = page4.add_text({'label' : 'Frist für die Ausübung des Vorkaufsrechts nach Empfang der Mitteilung des Vorkaufsfalles (Tage):', 'variable_name' : 'frist_2', 'required' : true, 'default' : '30', 'show' : function(self){return equals(['rechte', 'vorkaufsrecht', 'vorkaufsrecht'], true)}});
var text = page4.add_text({'label' : 'Frist für die Übertragung von Stammanteilen nach Ablauf der Frist zur Ausübung des Vorkaufsrechts (Tage): ', 'variable_name' : 'frist_3', 'required' : true, 'default' : '60', 'show' : function(self){return equals(['rechte', 'vorkaufsrecht', 'vorkaufsrecht'], true)}});


var page5 = step10.add_multipage({'title' : 'Weitere Nebenpflicht', 'variable_name' : 'w_nebenpflicht', 'naming' : function(self, index){if(typeof variables['rechte']['w_nebenpflicht'][index]['titel_de'] !== 'undefined'){return variables['rechte']['w_nebenpflicht'][index]['titel_de'];}else{return 'Nebenpflicht ' + parseInt(index + 1);}}});

var text = page5.add_text({'label' : 'Titel Nebenpflicht in Statuten (Deutsch)', 'variable_name' : 'titel_de', 'required' : true});
var textarea = page5.add_textarea({'label' : 'Text Nebenpflicht in Statuten (Deutsch)', 'variable_name' : 'text_de', 'required' : true});
var text = page5.add_text({'label' : 'Titel Nebenpflicht in Statuten (Englisch)', 'variable_name' : 'titel_en', 'required' : true});
var textarea = page5.add_textarea({'label' : 'Text Nebenpflicht in Statuten (Englisch)', 'variable_name' : 'text_en', 'required' : true});

var page5b = step10.add_page({'title':'Reglement', 'variable_name' : 'reglement', 'show' : function(self){if(variables['rechte']['w_nebenpflicht'].length > 0 || equals(['rechte', 'vorkaufsrecht', 'vorkaufsrecht'], true)){return true}else{return false}}})

var checkbox_group = page5b.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Die nähere Umschreibung der Pflichten erfolgt in einem Reglement der Gesellschafterversammlung. ', 'variable_name' : 'umschreibung'});

var page6 = step10.add_page({'title':'Vetorecht', 'variable_name' : 'vetorecht'})

var checkbox_group = page6.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Vetorecht', 'variable_name' : 'vetorecht'});

var textarea = page6.add_textarea({'label' : 'Die Gesellschafter haben ein Vetorecht gegen folgende Beschlüsse der Gesellschafterversammlung:', 'variable_name' : 'vetorecht_text', 'required' : true, 'show' : function(self){return equals(['rechte', 'vetorecht', 'vetorecht'], true)}});

var page7 = step10.add_page({'title':'Abtretung von Stammanteilen', 'variable_name' : 'abtretung'})

var radio = page7.add_radio({'variable_name' : 'abtretung', 'required' : true, 'label' : 'Abtretung von Stammanteilen'});
var option = radio.add_option({'value' : 'zulassig', 'label' : 'Die Abtretung von Stammanteilen ist zulässig'});
var option = radio.add_option({'value' : 'n_zulassig', 'label' : 'Die Abtretung von Stammanteilen ist ausgeschlossen', 'tooltip' : 'Falls die Abtretung von Stammanteilen ausgeschlossen wird, so ist die Bestellung von Nutzniessungen und/oder Pfandrechten an Stammanteilen nicht mehr zulässig (Art. 789a und Art. 789b jeweils Abs. 2 OR).'});

var separator = page7.add_separator({'show' : function(self){return equals(['rechte', 'abtretung', 'abtretung'], 'zulassig')}})

var checkbox_group = page7.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Die Abtretung von Stammanteilen bedarf der Zustimmung der Gesellschafterversammlung', 'variable_name' : 'zustimmung', 'tooltip' : 'Allenfalls empfehlenswert insbesondere bei personenbezogenen GmbHs mit kleinem Gesellschafterkreis.', 'show' : function(self){return equals(['rechte', 'abtretung', 'abtretung'], 'zulassig')}});

var separator = page7.add_separator({'show' : function(self){return equals(['rechte', 'abtretung', 'abtretung'], 'zulassig') && equals(['rechte', 'abtretung', 'zustimmung'], true)}})

var radio = page7.add_radio({'variable_name' : 'grund', 'required' : true, 'label' : 'Abtretung von Stammanteilen', 'show' : function(self){return equals(['rechte', 'abtretung', 'abtretung'], 'zulassig') && equals(['rechte', 'abtretung', 'zustimmung'], true)}});
var option = radio.add_option({'value' : 'option1', 'label' : 'Die Gesellschafterversammlung kann die Zustimmung ohne Angabe von Gründen verweigern.'});
var option = radio.add_option({'value' : 'option2', 'label' : 'Die Gesellschafterversammlung kann die Zustimmung aus folgenden Gründen verweigern:'});
var option = radio.add_option({'value' : 'option3', 'label' : 'Die Gesellschafterversammlung kann die Zustimmung verweigern, wenn die Gesellschaft dem Veräusserer die Übernahme der Stammanteile zum wirklichen Wert anbietet.'});
var option = radio.add_option({'value' : 'option4', 'label' : 'Die Gesellschafterversammlung kann die Zustimmung zur Abtretung verweigern, wenn die Erfüllung statutarischer Nachschuss- oder Nebenleistungspflichten zweifelhaft ist und eine von der Gesellschaft geforderte Sicherheit nicht geleistet wird.', 'tooltip' : 'Nur wählbar, wenn Nachschuss- und Nebenleistungspflichten bestehen.', 'disabled' : function(){if(equals(['rechte', 'nachschuss', 'nachschusspflicht'], true) || variables['rechte']['w_nebenpflicht'].length >0 ){return false}else{return true}}});

var separator = page7.add_separator({'show' : function(self){return equals(['rechte', 'abtretung', 'abtretung'], 'zulassig') && equals(['rechte', 'abtretung', 'zustimmung'], true) && equals(['rechte', 'abtretung', 'grund'], 'option2')}})

var textarea = page7.add_textarea({'label' : 'Die Gesellschafterversammlung kann die Zustimmung aus folgenden Gründen verweigern (Deutsch): ', 'variable_name' : 'grunde_de', 'required' : true, 'tooltip' : 'Z.B. Konkurrenten-, Familien- oder Prozentklauseln. Es ist nicht erforderlich, dass die in solchen Klauseln genannten Gründe wichtige Gründe i.S.v. Art. 685b OR darstellen.','show' : function(self){return equals(['rechte', 'abtretung', 'abtretung'], 'zulassig') && equals(['rechte', 'abtretung', 'zustimmung'], true) && equals(['rechte', 'abtretung', 'grund'], 'option2')}});

var textarea = page7.add_textarea({'label' : 'Die Gesellschafterversammlung kann die Zustimmung aus folgenden Gründen verweigern (Englisch): ', 'variable_name' : 'grunde_en', 'required' : true,'show' : function(self){return equals(['rechte', 'abtretung', 'abtretung'], 'zulassig') && equals(['rechte', 'abtretung', 'zustimmung'], true) && equals(['rechte', 'abtretung', 'grund'], 'option2')}});

var checkbox_group = page7.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Keine Zustimmung der Gesellschafterversammlung ist erforderlich, wenn die Abtretung an bestehende Gesellschafter erfolgt.', 'variable_name' : 'keine', 'show' : function(self){return equals(['rechte', 'abtretung', 'abtretung'], 'zulassig') && equals(['rechte', 'abtretung', 'zustimmung'], true) && equals(['rechte', 'abtretung', 'grund'], 'option2')}});

var page8 = step10.add_page({'title':'Nutzniessung an Stammanteilen', 'variable_name' : 'nutzniessung'})

var radio = page8.add_radio({'variable_name' : 'nutzniessung', 'required' : true, 'label' : 'Nutzniessung an Stammanteilen'});
var option = radio.add_option({'value' : 'zulassig', 'label' : 'Die Bestellung einer Nutzniessung an Stammanteilen ist zulässig.'});
var option = radio.add_option({'value' : 'n_zulassig', 'label' : 'Die vertragliche Einräumung einer Nutzniessung an Stammanteilen ist ausgeschlossen.', 'tooltip' : 'Ein solcher Ausschluss kann insbesondere empfehlenswert sein, falls i) Abtretung von Stammanteilen zugelassen wird und ii) statutarische Nachschuss- oder Nebenleistungspflichten bestehen (zwecks Vermeidung von Schwierigkeiten der Zuordnung dieser Pflichten an Gesellschafter bzw. Nutzniesser).'});

var separator = page8.add_separator({'show' : function(self){return equals(['rechte', 'nutzniessung', 'nutzniessung'], 'zulassig')}})

var checkbox_group = page8.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Die Bestellung einer Nutzniessung an Stammanteilen bedarf der Zustimmung der Gesellschafterversammlung.', 'variable_name' : 'zustimmung', 'show' : function(self){return equals(['rechte', 'nutzniessung', 'nutzniessung'], 'zulassig')}});

var separator = page8.add_separator({'show' : function(self){return equals(['rechte', 'nutzniessung', 'nutzniessung'], 'zulassig') && equals(['rechte', 'nutzniessung', 'zustimmung'], true)}})

var radio = page8.add_radio({'variable_name' : 'grund', 'required' : true, 'label' : 'Abtretung von Stammanteilen', 'show' : function(self){return equals(['rechte', 'nutzniessung', 'nutzniessung'], 'zulassig') && equals(['rechte', 'nutzniessung', 'zustimmung'], true)}});
var option = radio.add_option({'value' : 'option1', 'label' : 'Die Gesellschafterversammlung kann die Zustimmung ohne Angabe von Gründen verweigern. '});
var option = radio.add_option({'value' : 'option2', 'label' : 'Die Gesellschafterversammlung kann die Zustimmung aus bestimmten Gründen verweigern.'});

var textarea = page8.add_textarea({'label' : 'Die Gesellschafterversammlung kann die Zustimmung aus folgenden Gründen verweigern (Deutsch):  ', 'variable_name' : 'grunde_de', 'required' : true, 'tooltip' : 'Z.B. Konkurrenten-, Familien- oder Prozentklauseln. Es ist nicht erforderlich, dass die in solchen Klauseln genannten Gründe wichtige Gründe i.S.v. Art. 685b OR darstellen. ','show' : function(self){return equals(['rechte', 'nutzniessung', 'nutzniessung'], 'zulassig') && equals(['rechte', 'nutzniessung', 'zustimmung'], true) && equals(['rechte', 'nutzniessung', 'grund'], 'option2')}});

var textarea = page8.add_textarea({'label' : 'Die Gesellschafterversammlung kann die Zustimmung aus folgenden Gründen verweigern (Englisch):  ', 'variable_name' : 'grunde_en', 'required' : true,'show' : function(self){return equals(['rechte', 'nutzniessung', 'nutzniessung'], 'zulassig') && equals(['rechte', 'nutzniessung', 'zustimmung'], true) && equals(['rechte', 'nutzniessung', 'grund'], 'option2')}});

var checkbox_group = page8.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Keine Zustimmung der Gesellschafterversammlung ist erforderlich, wenn die Nutzniessung zugunsten bestehender Gesellschafter erfolgt.', 'variable_name' : 'keine', 'show' : function(self){return equals(['rechte', 'nutzniessung', 'nutzniessung'], 'zulassig') && equals(['rechte', 'nutzniessung', 'zustimmung'], true) && equals(['rechte', 'nutzniessung', 'grund'], 'option2')}});

var page9 = step10.add_page({'title':'Pfandrechte an Stammanteilen', 'variable_name' : 'pfandrechte'})

var radio = page9.add_radio({'variable_name' : 'pfandrechte', 'required' : true, 'label' : 'Pfandrechte an Stammanteilen', 'disabled' : function(self){if(typeof variables['rechte']['abtretung']['abtretung'] != 'undefined'){return true}else{return false}}});
var option = radio.add_option({'value' : 'zulassig', 'label' : 'Die Bestellung eines Pfandrechts an Stammanteilen ist zulässig.'});
var option = radio.add_option({'value' : 'n_zulassig', 'label' : 'Die Bestellung eines Pfandrechts an Stammanteilen ist ausgeschlossen.', 'tooltip' : 'Zwingend, aber gleichzeitig auch nur dann zulässig, wenn Abtretung der Stammanteile ausgeschlossen wurde.'});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'rechte' && v[1] == 'abtretung' && v[2] == 'abtretung'){return true}else{return false}}, 'assignment' : function(){variables['rechte']['pfandrechte']['pfandrechte'] = variables['rechte']['abtretung']['abtretung']}});

var separator = page9.add_separator({'show' : function(self){return equals(['rechte', 'pfandrechte', 'pfandrechte'], 'zulassig')}})

var checkbox_group = page9.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Die Bestellung eines Pfandrechts an Stammanteilen bedarf der Zustimmung der Gesellschafterversammlung', 'variable_name' : 'zusimmung', 'show' : function(self){return equals(['rechte', 'pfandrechte', 'pfandrechte'], 'zulassig')}});

var page10 = step10.add_page({'title':'Treuepflicht', 'variable_name' : 'treuepflicht'})

var radio = page10.add_radio({'variable_name' : 'treuepflicht', 'required' : true, 'label' : function(self){if(equals(['rechte', 'konkurrenzverbot', 'konkurrenzverbot'], true)){return 'Die Gesellschafter dürfen Tätigkeiten, die gegen die Treuepflicht oder das Konkurrenzverbot verstossen, ausüben, sofern:'}else{return 'Die Gesellschafter dürfen Tätigkeiten, die gegen die Treuepflicht verstossen, ausüben, sofern:'}}});
var option = radio.add_option({'value' : 'option1', 'label' : 'alle übrigen Gesellschafter schriftlich zustimmen.'});
var option = radio.add_option({'value' : 'option2', 'label' : 'die Gesellschafterversammlung zustimmt.'});

var page11 = step10.add_page({'title':'Austritt und Ausschluss', 'variable_name' : 'austritt'})

var checkbox_group = page11.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Austrittsrecht für Gesellschafter unter Einhaltung einer Kündigungsfrist', 'variable_name' : 'austritt'});

var text = page11.add_text({'label' : 'Kündigungsfrist in Monaten', 'variable_name' : 'frist', 'placeholder' : 'z.B. 1', 'required' : true, 'show' : function(self){return equals(['rechte', 'austritt', 'austritt'], true)}});

var separator = page11.add_separator({})

var checkbox_group = page11.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Die Gesellschafterversammlung darf einen Gesellschafter aus den bestimmten Gründen aus der Gesellschaft ausschliessen ', 'variable_name' : 'ausschluss', 'tooltip' : 'Auch wenn diese Option nicht gewählt wird, kann die Gesellschaft beim Gericht auf Ausschluss eines Gesellschafters klagen, wenn ein wichtiger Grund vorliegt.'});

var textarea = page11.add_textarea({'label' : 'Deutsch', 'variable_name' : 'grunde_de', 'required' : true, default: 'Die Gesellschafterversammlung darf einen Gesellschafter aus den folgenden Gründen aus der Gesellschaft ausschliessen:', 'show' : function(self){return equals(['rechte', 'austritt', 'ausschluss'], true)}});

var textarea = page11.add_textarea({'label' : 'Englisch', 'variable_name' : 'grunde_en', 'required' : true, default: 'The shareholders’ meeting may resolve to ex-clude a shareholder for the following reasons:', 'show' : function(self){return equals(['rechte', 'austritt', 'ausschluss'], true)}});


var step11 = form.add_step({'title':'Rechnungslegung', 'variable_name':'rechnungslegung'})
var page1 = step11.add_page({'title':'Rechnungslegung', 'variable_name' : 'rechnungslegung'})

var radio = page1.add_radio({'variable_name' : 'geschaftsjahr', 'required' : true});
var option = radio.add_option({'value' : 'option1', 'label' : 'Das Geschäftsjahr wird durch die Geschäftsführung bestimmt.'});
var option = radio.add_option({'value' : 'option2', 'label' : 'Festlegung des Geschäftsjahres in den Statuten.'});

var label = page1.add_label({'label' : 'Erstes Geschäftsjahr'});

var text = page1.add_text({'label' : 'Beginn', 'variable_name' : 'erstes_beginn_de', 'required' : true, 'date' : true});
var text = page1.add_text({'label' : 'Ende', 'variable_name' : 'erstes_ende_de', 'required' : true, 'date' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'rechnungslegung' && v[1] == 'rechnungslegung' && v[2] == 'erstes_beginn_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]]['erstes_beginn_en'] = convert_date(variables[v[0]][v[1]]['erstes_beginn_de'])}});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'rechnungslegung' && v[1] == 'rechnungslegung' && v[2] == 'erstes_ende_de'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]]['erstes_ende_en'] = convert_date(variables[v[0]][v[1]]['erstes_ende_de'])}});

var label = page1.add_label({'label' : 'Folgende Geschäftsjahre'});

var text = page1.add_text({'label' : 'Beginn (Deutsch)', 'variable_name' : 'folgende_beginn_de', 'required' : true, 'default' : '1. Januar'});
var text = page1.add_text({'label' : 'Ende (Deutsch)', 'variable_name' : 'folgende_ende_de', 'required' : true, 'default' : '31. Dezember'});

var text = page1.add_text({'label' : 'Beginn (Englisch)', 'variable_name' : 'folgende_beginn_en', 'required' : true, 'default' : '1 January'});
var text = page1.add_text({'label' : 'Ende (Englisch)', 'variable_name' : 'folgende_ende_en', 'required' : true, 'default' : '31 December'});

var step12 = form.add_step({'title':'Reserven und Gewinnverwendung', 'variable_name':'reserven'})
var page1 = step12.add_page({'title':'Reserven und Gewinnverwendung', 'variable_name' : 'reserven'})

var checkbox_group = page1.add_checkbox_group({'label' : ''});
var checkbox = checkbox_group.add_checkbox({'label' : 'Zuweisung von Gewinn an statutarische Reserven (zusätzlich zu gesetzlichen Reserven)', 'variable_name' : 'reserven'});

var textarea = page1.add_textarea({'label' : 'Statutarische Reservenklausel (Deutsch)', 'variable_name' : 'klausel_de', 'required' : true, 'show' : function(self){return equals(['reserven', 'reserven', 'reserven'], true)}});

var textarea = page1.add_textarea({'label' : 'Statutarische Reservenklausel (Englisch)', 'variable_name' : 'klausel_en', 'required' : true, 'show' : function(self){return equals(['reserven', 'reserven', 'reserven'], true)}});

var step13 = form.add_step({'title':'Mitteilungen', 'variable_name':'mitteilungen'})
var page1 = step13.add_page({'title':'Mitteilungen', 'variable_name' : 'mitteilungen'})

var text = page1.add_text({'label' : 'Die Mitteilungen der Geschäftsführung an die Gesellschafter erfolgen (Deutsch)', 'variable_name' : 'mitteilungen_de', 'required' : true, 'default' : 'per Brief oder E-Mail.'});

var text = page1.add_text({'label' : 'Die Mitteilungen der Geschäftsführung an die Gesellschafter erfolgen (Englisch)', 'variable_name' : 'mitteilungen_en', 'required' : true, 'default' : 'by letter or email.'});

var step13b = form.add_step({'title':'Publikationen', 'variable_name':'publikationen'})
var page1 = step13b.add_page({'title':'Publikationen', 'variable_name' : 'publikationen'})

var textarea = page1.add_textarea({'label' : 'Das Publikationsorgan der Gesellschaft ist: (Deutsch)', 'variable_name' : 'publikationen_de', 'required' : true, 'default' : 'das Schweizerische Handelsamtsblatt (SHAB)'});

var textarea = page1.add_textarea({'label' : 'Das Publikationsorgan der Gesellschaft ist: (Englisch)', 'variable_name' : 'publikationen_en', 'required' : true, 'default' : 'the Swiss Official Gazette of Commerce'});

var step14 = form.add_step({'title':'Lex-Friedrich Erklärung', 'variable_name':'lex'})
var page1 = step14.add_page({'title':'Lex-Friedrich Erklärung', 'variable_name' : 'lex'})

var radio = page1.add_radio({'variable_name' : 'ort', 'required' : true});
var option = radio.add_option({'value' : 'zurich', 'label' : 'Kanton Zürich '});
var option = radio.add_option({'value' : 'zug', 'label' : 'Kanton Zug '});

var separator = page11.add_separator({'show' : function(self){if(typeof variables['lex']['lex']['ort'] != 'undefined'){return true}else{return false}}})

var checkbox_group = page1.add_checkbox_group({'label' : 'Zutreffendes bitte ankreuzen:', 'show' : function(self){return equals(['lex', 'lex', 'ort'], 'zurich')}});
var checkbox = checkbox_group.add_checkbox({'label' : 'Personen im Ausland bzw. Personen, die für Rechnung von Personen im Ausland handeln, sind an der Gesellschaft beteiligt.', 'variable_name' : 'zurich_question_1', 'tooltip' : 'Als Personen im Ausland gelten (Art. 5 BewG ):\n\n\
-	Ausländer mit Wohnsitz im Ausland;\n\n\
-	Ausländer mit Wohnsitz in der Schweiz, die weder Staatsangehörige eines Mitgliedstaates der Europäischen Gemeinschaft (EG) oder der Europäischen Freihandelsassoziation (EFTA) sind noch eine gültige Niederlassungsbewilligung (Ausländerausweis C) besitzen;\n\n \
-	juristische Personen und vermögensfähige Gesellschaften ohne juristische Persönlichkeit, die ihren Sitz im Ausland haben;\n\n\
-	juristische Personen und vermögensfähige Gesellschaften ohne juristische Persönlichkeit, die ihren rechtlichen und tatsächlichen Sitz in der Schweiz haben, aber von Personen im Ausland beherrscht werden;\n\n\
-	natürliche und juristische Personen sowie vermögensfähige Gesellschaften ohne juristische Persönlichkeit, die grundsätzlich nicht dem BewG unterliegen, wenn sie ein Grundstück auf Rechnung einer Person im Ausland erwerben (Treuhandgeschäft).\n\n\
', 'disabled' : function(){return true}});
var checkbox = checkbox_group.add_checkbox({'label' : 'Personen im Ausland bzw. Personen, die für Rechnung von Personen im Ausland handeln, erwerben im Zusammenhang mit der Gründung an der Gesellschaft neu eine Beteiligung. ', 'variable_name' : 'zurich_question_2', 'tooltip' : 'Als Personen im Ausland gelten (Art. 5 BewG ):\n\n\
-	Ausländer mit Wohnsitz im Ausland;\n\n\
-	Ausländer mit Wohnsitz in der Schweiz, die weder Staatsangehörige eines Mitgliedstaates der Europäischen Gemeinschaft (EG) oder der Europäischen Freihandelsassoziation (EFTA) sind noch eine gültige Niederlassungsbewilligung (Ausländerausweis C) besitzen;\n\n \
-	juristische Personen und vermögensfähige Gesellschaften ohne juristische Persönlichkeit, die ihren Sitz im Ausland haben;\n\n\
-	juristische Personen und vermögensfähige Gesellschaften ohne juristische Persönlichkeit, die ihren rechtlichen und tatsächlichen Sitz in der Schweiz haben, aber von Personen im Ausland beherrscht werden;\n\n\
-	natürliche und juristische Personen sowie vermögensfähige Gesellschaften ohne juristische Persönlichkeit, die grundsätzlich nicht dem BewG unterliegen, wenn sie ein Grundstück auf Rechnung einer Person im Ausland erwerben (Treuhandgeschäft).\n\n\
'});
var checkbox = checkbox_group.add_checkbox({'label' : 'Bei Sacheinlage, Sachübernahme, Fusion, Umwandlung oder Spaltung: die Gesellschaft erwirbt Nicht-Betriebsstätte-Grundstücke in der Schweiz.', 'variable_name' : 'zurich_question_3', 'tooltip' : 'Als Betriebsstätte-Grundstücke gelten (Art. 2 Abs. 2 lit. a und Abs. 3 BewG):\n\n Grundstücke, die als ständige Betriebsstätte eines Handels-, Fabrikations- oder eines anderen nach kaufmännischer Art geführten Gewerbes, eines Handwerkbetriebes oder eines freien Berufes dienen (inkl. durch Wohnanteilvorschriften vorgeschriebene Wohnungen oder dafür reservierte Flächen).', 'disabled' : function(){return true}});
var checkbox = checkbox_group.add_checkbox({'label' : 'Bei Kapitalherabsetzung: Personen im Ausland bzw. Personen, die für Rechnung von Personen im Ausland handeln, haben nach der Kapitalherabsetzung an obgenannter Gesellschaft eine beherrschende Stellung gemäss Art. 6 BewG inne. ', 'variable_name' : 'zurich_question_4', 'disabled' : function(){return true}});

var checkbox_group = page1.add_checkbox_group({'label' : 'Zutreffendes bitte ankreuzen:', 'show' : function(self){return equals(['lex', 'lex', 'ort'], 'zug')}});
var checkbox = checkbox_group.add_checkbox({'label' : 'Die Gründung der Gesellschaft bedarf keiner Bewilligung im Sinne des BewG und der BewV . Sind an der Gesellschaft Personen im Ausland beteiligt, so wird erklärt, dass allfällige Grundstücke in der Schweiz, Anteile oder Rechte nach Art. 4 BewG als ständige Betriebsstätten gemäss Art. 2 Abs. 2 lit. a BewG dienen werden. ', 'variable_name' : 'zurich_question_1', 'tooltip' : 'Als Personen im Ausland gelten (Art. 5 BewG ):\n\n\
-	Ausländer mit Wohnsitz im Ausland;\n\n\
-	Ausländer mit Wohnsitz in der Schweiz, die weder Staatsangehörige eines Mitgliedstaates der Europäischen Gemeinschaft (EG) oder der Europäischen Freihandelsassoziation (EFTA) sind noch eine gültige Niederlassungsbewilligung (Ausländerausweis C) besitzen;\n\n \
-	juristische Personen und vermögensfähige Gesellschaften ohne juristische Persönlichkeit, die ihren Sitz im Ausland haben;\n\n\
-	juristische Personen und vermögensfähige Gesellschaften ohne juristische Persönlichkeit, die ihren rechtlichen und tatsächlichen Sitz in der Schweiz haben, aber von Personen im Ausland beherrscht werden;\n\n\
-	natürliche und juristische Personen sowie vermögensfähige Gesellschaften ohne juristische Persönlichkeit, die grundsätzlich nicht dem BewG unterliegen, wenn sie ein Grundstück auf Rechnung einer Person im Ausland erwerben (Treuhandgeschäft).\n\n\
', 'disabled' : function(){return true}});

var step15 = form.add_step({'title':'Wertpapiere, Anteilbuch und GAFI Verzeichnis', 'variable_name':'anteilbuch'})

var page1 = step15.add_multipage({'title' : 'GAFI Meldungen', 'variable_name' : 'gafi', 'naming' : function(self, index){
    if(equals(['anteilbuch', 'gafi', index, 'art'], 'naturliche') || (typeof variables['anteilbuch']['gafi'][index]['vorname'] != 'undefined' && typeof variables['anteilbuch']['gafi'][index]['nachname'] != 'undefined')){
        if(typeof variables['anteilbuch']['gafi'][index]['vorname'] != 'undefined' && typeof variables['anteilbuch']['gafi'][index]['nachname'] != 'undefined'){
            return variables['anteilbuch']['gafi'][index]['vorname'] + ' ' + variables['anteilbuch']['gafi'][index]['nachname'];
        }
        else{
            return 'Person ' + parseInt(index + 1);
        }
    }
    if(equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')){
        return 'Gesellschaft ' + parseInt(index + 1);
    }
    return 'GAFI Meldung ' + parseInt(index + 1);
                                                                                                                        
}, 'suggestions_model' : vertreter_model, 'suggestions_active' : function(self, index){if((typeof variables['anteilbuch']['gafi'][index]['art'] == 'undefined' && typeof variables['anteilbuch']['gafi'][index]['vorname'] == 'undefined') || (equals(['anteilbuch', 'gafi', index, 'art'], 'naturliche') && typeof variables['anteilbuch']['gafi'][index]['vorname'] == 'undefined') && (variables['grunder']['snp'].length > 0 || variables['grunder']['anp'].length > 0)){return true;}else{return false;}}});

var radio = page1.add_radio({'variable_name' : 'art', 'required' : true});
var option = radio.add_option({'value' : 'naturliche', 'label' : 'Natürliche Person', 'default' : function(){return true;}});
var option = radio.add_option({'value' : 'gesellschaft', 'label' : 'Gesellschaft'});

var separator = page1.add_separator({'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'naturliche') || equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}})

var radio = page1.add_radio({'variable_name' : 'sex', 'required' : true, 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'naturliche')}});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page1.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true, 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'naturliche')}});
var text = page1.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true, 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'naturliche')}});
var text = page1.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional', 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'naturliche')}});
var text = page1.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional', 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'naturliche')}});

var text = page1.add_text({'label' : 'Funktion (Deutsch)', 'variable_name' : 'funktion_de', 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'naturliche')}});

var text = page1.add_text({'label' : 'Funktion (Englisch)', 'variable_name' : 'funktion_en', 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'naturliche')}});

var label = page1.add_label({'label' : 'Zeichnungsberechtigter', 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}});

var radio = page1.add_radio({'variable_name' : 'sex', 'required' : true, 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});
                             
var text = page1.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true, 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}});
var text = page1.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true, 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}});
var text = page1.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional', 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}});
var text = page1.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional', 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}});

var text = page1.add_text({'label' : 'Funktion (Deutsch)', 'variable_name' : 'funktion_de', 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}});

var text = page1.add_text({'label' : 'Funktion (Englisch)', 'variable_name' : 'funktion_en', 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}});

var label = page1.add_label({'label' : 'Zweiter Zeichnungsberechtigter', 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}});

var radio = page1.add_radio({'variable_name' : 'sex_2', 'required' : true, 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});
                             
var text = page1.add_text({'label' : 'Vorname', 'variable_name' : 'vorname_2', 'required' : true, 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}});
var text = page1.add_text({'label' : 'Name', 'variable_name' : 'nachname_2', 'required' : true, 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}});
var text = page1.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de_2', 'placeholder' : 'Optional', 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}});
var text = page1.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en_2', 'placeholder' : 'Optional', 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}});

var text = page1.add_text({'label' : 'Funktion (Deutsch)', 'variable_name' : 'funktion_de_2', 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}});

var text = page1.add_text({'label' : 'Funktion (Englisch)', 'variable_name' : 'funktion_en_2', 'show' : function(self, index){return equals(['anteilbuch', 'gafi', index, 'art'], 'gesellschaft')}});

var page1 = step15.add_multipage({'title' : 'Wirtschaftlich berechtigte Personen', 'variable_name' : 'wb_personen', 'naming' : function(self, index){if(typeof variables['anteilbuch']['wb_personen'][index]['vorname'] !== 'undefined' && typeof variables['anteilbuch']['wb_personen'][index]['nachname'] !== 'undefined'){return variables['anteilbuch']['wb_personen'][index]['vorname'] + ' ' + variables['anteilbuch']['wb_personen'][index]['nachname'];}else{return 'Wirtschaftlich berechtigte Person ' + parseInt(index + 1);}}, 'show' : function(self, index){
    for(var i = 0; i < variables['grunder']['snp'].length; i++){
        if(variables['grunder']['snp'][i]['grenzwert']){
            return true;
        }
    }
    for(var i = 0; i < variables['grunder']['anp'].length; i++){
        if(variables['grunder']['anp'][i]['grenzwert']){
            return true;
        }
    }
    for(var i = 0; i < variables['grunder']['sjp'].length; i++){
        if(variables['grunder']['sjp'][i]['grenzwert']){
            return true;
        }
    }
    for(var i = 0; i < variables['grunder']['ag'].length; i++){
        if(variables['grunder']['ag'][i]['grenzwert']){
            return true;
        }
    }
    return false;
}});

var grunder_model = new Model(form, {'name' : 'grunder_model', 'sources' : [snp, sjp, anp, ag]});


var text = page1.add_modelselect(grunder_model, {'label' : 'Wirtschaftlich berechtigt an den Stammanteilen von:', 'variable_name' : 'grunder', 'required' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'anteilbuch' && v[3] == 'grunder'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]][v[2]]['grunder_array'] = parse_vorsitzender(variables[v[0]][v[1]][v[2]][v[3]])}});

var separator = page1.add_separator({})

var text = page1.add_modelselect(vertreter_model, {'label' : 'Berechtigte Person ist Mitgründer:', 'variable_name' : 'vorschlag', 'required' : false});

var separator = page1.add_separator({})

form.add_derived_variable({'condition' : function(v){if(v[0] == 'anteilbuch' && v[3] == 'vorschlag'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]]['vorschlag_array'] = parse_vorsitzender(variables[v[0]][v[1]][v[2]][v[3]]);
variables[v[0]][v[1]][v[2]]['vorname'] = variables['grunder'][variables[v[0]][v[1]]['vorschlag_array'][1]][variables[v[0]][v[1]]['vorschlag_array'][2]]['vorname'];
variables[v[0]][v[1]][v[2]]['sex'] = variables['grunder'][variables[v[0]][v[1]]['vorschlag_array'][1]][variables[v[0]][v[1]]['vorschlag_array'][2]]['sex'];
variables[v[0]][v[1]][v[2]]['nachname'] = variables['grunder'][variables[v[0]][v[1]]['vorschlag_array'][1]][variables[v[0]][v[1]]['vorschlag_array'][2]]['nachname'];
variables[v[0]][v[1]][v[2]]['titel_de'] = variables['grunder'][variables[v[0]][v[1]]['vorschlag_array'][1]][variables[v[0]][v[1]]['vorschlag_array'][2]]['titel_de'];
variables[v[0]][v[1]][v[2]]['titel_en'] = variables['grunder'][variables[v[0]][v[1]]['vorschlag_array'][1]][variables[v[0]][v[1]]['vorschlag_array'][2]]['titel_en'];
variables[v[0]][v[1]][v[2]]['strasse'] = variables['grunder'][variables[v[0]][v[1]]['vorschlag_array'][1]][variables[v[0]][v[1]]['vorschlag_array'][2]]['strasse'];
variables[v[0]][v[1]][v[2]]['plz_de'] = variables['grunder'][variables[v[0]][v[1]]['vorschlag_array'][1]][variables[v[0]][v[1]]['vorschlag_array'][2]]['plz_de'];
variables[v[0]][v[1]][v[2]]['plz_en'] = variables['grunder'][variables[v[0]][v[1]]['vorschlag_array'][1]][variables[v[0]][v[1]]['vorschlag_array'][2]]['plz_en'];
}});

var radio = page1.add_radio({'variable_name' : 'sex', 'required' : true});
var option = radio.add_option({'value' : 'herr',  'label' : 'Herr'});
var option = radio.add_option({'value' : 'frau', 'label' : 'Frau'});

var text = page1.add_text({'label' : 'Vorname', 'variable_name' : 'vorname', 'required' : true});
var text = page1.add_text({'label' : 'Name', 'variable_name' : 'nachname', 'required' : true});
var text = page1.add_text({'label' : 'Titel (Deutsch)', 'variable_name' : 'titel_de', 'placeholder' : 'Optional'});
var text = page1.add_text({'label' : 'Titel (English)', 'variable_name' : 'titel_en', 'placeholder' : 'Optional'});
var text = page1.add_text({'label' : 'Strasse und Hausnummer', 'variable_name' : 'strasse'});
var text = page1.add_text({'label' : 'PLZ, Ort (Deutsch)', 'variable_name' : 'plz_de'});
var text = page1.add_text({'label' : 'PLZ, Ort (Englisch)', 'variable_name' : 'plz_en'});
var text = page1.add_text({'label' : 'Land (Deutsch)', 'variable_name' : 'land_de'});
var text = page1.add_text({'label' : 'Land (Englisch)', 'variable_name' : 'land_en'});

var page0 = step15.add_page({'title':'Zertifikate', 'variable_name' : 'zertifikate'})

var radio = page0.add_radio({'variable_name' : 'zertifikate', 'required' : true});
var option = radio.add_option({'value' : 'ausgabe', 'label' : 'Ausgabe von Zertifikaten in Form von Namenpapieren'});
var option = radio.add_option({'value' : 'k_ausgabe', 'label' : 'keine Ausgabe von Zertifikaten über Stammanteile'});


var text = page0.add_modelselect(fuhrer_model, {'label' : 'Mitglied der Geschäftsführung, welches das Stammanteilbuch und Verzeichnis der wirtschaftlich berechtigten Personen unterzeichnet ', 'variable_name' : 'mitglied', 'required' : true});

form.add_derived_variable({'condition' : function(v){if(v[0] == 'anteilbuch' && v[2] == 'mitglied'){return true}else{return false}}, 'assignment' : function(v){variables[v[0]][v[1]]['mitglied_array'] = parse_vorsitzender(variables[v[0]][v[1]][v[2]])}});


//Sex of grunder
form.add_derived_variable({'condition' : function(v){if(v[0] == 'grunder'){return true}else{return false}}, 'assignment' : function(){variables['grunder']['sex']={};variables['grunder']['sex']['sex'] = grunder_sex()}});

//Sex of geschaftsfuhrer
form.add_derived_variable({'condition' : function(v){if(v[0] == 'geschaftsfuhrer'){return true}else{return false}}, 'assignment' : function(){variables['geschaftsfuhrer']['sex']={};variables['geschaftsfuhrer']['sex']['sex'] = geschaftsfuhrer_sex()}});


form.render();