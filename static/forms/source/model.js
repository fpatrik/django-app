/* A model that saves things like people for selection etc
 * 
 * PARAMETERS
 * 
 */

function Model(form, parameters){
	//Set form
	this.form = form;
	
	//Set model name
	this.name = parameters.name || console.error('Model without Name!');
	
	//Multipages
	this.sources = parameters.sources || [];
	
	//Render the dropdown of the model
	this.render = function(multipage, index){
		return nunjucks.renderString(template_model_dropdown , {model : this, multipage : multipage, index : index});
	}
	
	//METHOD accept suggestions
	this.accept_suggestion = function(source_i, index, target_step, target_page, target_index){
		for (var source_key in variables[this.sources[source_i].step.variable_name][this.sources[source_i].variable_name][index]) {
		    if (variables[this.sources[source_i].step.variable_name][this.sources[source_i].variable_name][index].hasOwnProperty(source_key)) {
		    	variables[target_step][target_page][target_index][source_key] = variables[this.sources[source_i].step.variable_name][this.sources[source_i].variable_name][index][source_key];
		     }
		}
		this.form.render();
	}
}