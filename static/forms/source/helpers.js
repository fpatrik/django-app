/*
 * Helper functions used elsewhere 
 *
 */

// Initialises the dictionary of a step in case it has not been set
function create_step_variable(variable_name_step){
	if(typeof variables[variable_name_step] == 'undefined'){
		variables[variable_name_step] = {};
	}
}

// Initialises the dictionary of a page in case it has not been set
function create_page_variable(variable_name_step, variable_name_page, type){
	if(typeof variables[variable_name_step][variable_name_page] == 'undefined'){
		if(type == 'page'){
			variables[variable_name_step][variable_name_page] = {};
		}
		else if(type == 'multipage'){
			variables[variable_name_step][variable_name_page] = [];
		}
	}
}

//Gets the value of a given input
// 1. Check if input belongs to page or multipage
// 2. Check if variable is defined, if so return
// 3. Else check if default exists, if so return 
// 4. return ''
function get_value(input, index){
	if(input.page.type == 'page'){
		if(typeof variables[input.step.variable_name][input.page.variable_name][input.variable_name] !== 'undefined'){
			return variables[input.step.variable_name][input.page.variable_name][input.variable_name];
		}
		else if(input.default && input.default(input) != ''){
			variables[input.step.variable_name][input.page.variable_name][input.variable_name] = input.default(input);
			return variables[input.step.variable_name][input.page.variable_name][input.variable_name];
		}
		else{
			return '';
		}
	}
	else if(input.page.type == 'multipage'){
		if(typeof variables[input.step.variable_name][input.page.variable_name][index][input.variable_name] !== 'undefined'){
			return variables[input.step.variable_name][input.page.variable_name][index][input.variable_name];
		}
		else if(input.default && input.default(input) != ''){
			variables[input.step.variable_name][input.page.variable_name][index][input.variable_name] = input.default(input);
			return variables[input.step.variable_name][input.page.variable_name][index][input.variable_name];
		}
		else{
			return '';
		}
	}
}

//Sets the default value of a variable
function set_variable_default(variable_names, value){
	//Assign variable
	if(variable_names.length == 3){
		variables[variable_names[0]][variable_names[1]][variable_names[2]] = value;
	}
	else{
		variables[variable_names[0]][variable_names[1]][variable_names[2]][variable_names[3]] = value;
	}
}

//Sets the value of a variable
function set_variable(variable_names, value){
	//Assign variable
	if(variable_names.length == 3){
		variables[variable_names[0]][variable_names[1]][variable_names[2]] = value;
	}
	else{
		variables[variable_names[0]][variable_names[1]][variable_names[2]][variable_names[3]] = value;
	}
	
	//Compute derived variables
	for(var i = 0; i < form.derived_variables.length; i++){
		if(form.derived_variables[i].condition(variable_names)){
			form.derived_variables[i].assignment(variable_names);
		}
	}
}

//Can be used in forms to compare variables
function equals(variable, value){
	if(variable.length == 3){
		var variable_value = variables[variable[0]][variable[1]][variable[2]]
	}
	else{
		var variable_value = variables[variable[0]][variable[1]][variable[2]][variable[3]]
	}
	if(typeof variable_value != 'undefined' && variable_value == value){
		return true;
	}
	else{
		return false;
	}

}

//Dynamically returning the next page
function get_next_page(step, page){
	return form.steps[step].pages[page].next_page();
}

//Show the first SHOWN page of a step
function zero_or_next_page(step){
	if(form.steps[step].pages[0].show(form.steps[step].pages[0])){
		return {'page' : 0};
	}
	else{
		return form.steps[step].pages[0].next_page();
	}
}