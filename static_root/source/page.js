/* A page of a step
*
* PARAMETERS
*
* title: 		 The title of the page, can be a string or a javascrip function returning a string
* show:			 A javascript function returning true/false, determining if page should be shown, true is default
* variable_name: The key of this page in the step dictionary
* tooltip:		 The optional tooltip displayed in the title
* 
 */

function Page(form, step, parameters){
	
	//Set title with string or function, create error if not found
	this.title = parameters.title || console.error('Page without title found!');
	if(typeof this.title !== 'function'){var title_text = this.title;this.title = function(self){return String(title_text)};};
	
	//Set show, default is function returning true
	this.show = parameters.show || function(self){return true;};
	
	//Set the variable name of this page, throw exception if not found
	this.variable_name = parameters.variable_name || console.error('Variable name of Page not set!');

	//Set tooltip with string or function
	this.tooltip = parameters.tooltip || '';
	if(typeof this.tooltip !== 'function'){var tooltip_text = this.tooltip;this.tooltip = function(self){return String(tooltip_text)};};

	//Set form and step the page belongs to, page id and increase number of pages
	this.form = form;
	this.step = step;
	this.page_id = this.step.n_pages;
	this.step.n_pages++;
	
	//Creates the page variable in data dictionary if not defined
	create_page_variable(this.step.variable_name, this.variable_name, 'page');

	//Initialise
	this.elements = [];
	
	//Initialise alert flag for the page
	this.has_alert = [false];
	
	//Set type to page to distinguish from multipage
	this.type = 'page';
	
	//METHOD adds a radio group to the page
	this.add_radio = function(parameters){
		var new_radio = new Radio(this.form, this.step, this, parameters);
		this.elements.push(new_radio);
		return new_radio;
	};
	
	//METHOD adds a checkbox group to the page
	this.add_checkbox_group  = function(parameters){
		var new_checkbox  = new Checkbox(this.form, this.step, this, parameters);
		this.elements.push(new_checkbox );
		return new_checkbox ;
	};
	
	//METHOD adds a text input to the page
	this.add_text = function(parameters){
		var new_text = new Text(this.form, this.step, this, parameters);
		this.elements.push(new_text);
		return new_text;
	};
	
	//METHOD adds a textarea input to the page
	this.add_textarea = function(parameters){
		var new_textarea = new Textarea(this.form, this.step, this, parameters);
		this.elements.push(new_textarea);
		return new_textarea;
	};
	
	//METHOD adds a dropdown to the page
	this.add_dropdown = function(parameters){
		var new_dropdown = new Dropdown(this.form, this.step, this, parameters);
		this.elements.push(new_dropdown);
		return new_dropdown;
	};
	
	//METHOD adds a modelselect to the page
	this.add_modelselect = function(model, parameters){
		var new_modelselect = new ModelSelect(this.form, this.step, this, model, parameters);
		this.elements.push(new_modelselect);
		return new_modelselect;
	};
	
	//METHOD adds a separator to the page
	this.add_separator = function(parameters){
		var new_separator = new Separator(this.form, this.step, this, parameters);
		this.elements.push(new_separator);
		return new_separator;
	};
	
	//METHOD adds a label to the page
	this.add_label = function(parameters){
		var new_label = new Label(this.form, this.step, this, parameters);
		this.elements.push(new_label);
		return new_label;
	};
	
	//METHOD returns next page
	this.next_page = function(){
		if(this.page_id == this.step.n_pages - 1){
			if(this.step.step_id == this.form.n_steps - 1){
				//This is the last page in the last step, return false
				return {'value' : false};
			}
			else{
				//Check if next step is shown, if yes, return, if not, get next page of next page.
				if(this.form.steps[this.step.step_id + 1].pages[0].show(this.form.steps[this.step.step_id + 1].pages[0])){
					return {'value' : true, 'step' : this.step.step_id + 1, 'page' : 0};
				}
				else{
					return this.form.steps[this.step.step_id + 1].pages[0].next_page();
				}
			}
		}
		else{
			if(this.form.steps[this.step.step_id].pages[this.page_id + 1].show(this.form.steps[this.step.step_id].pages[this.page_id + 1])){
				return {'value' : true, 'step' : this.step.step_id, 'page' : this.page_id + 1};
			}
			else{
				return this.form.steps[this.step.step_id].pages[this.page_id + 1].next_page();
			}
		}
	}
	
	//METHOD returns next page
	this.previous_page = function(){
		if(this.page_id == 0){
			if(this.step.step_id == 0){
				//This is the last page in the last step, return false
				return {'value' : false};
			}
			else{
				//Check if next step is shown, if yes, return, if not, get next page of next page.
				if(this.form.steps[this.step.step_id - 1].pages[this.form.steps[this.step.step_id - 1].n_pages - 1].show(this.form.steps[this.step.step_id - 1].pages[this.form.steps[this.step.step_id - 1].n_pages - 1])){
					return {'value' : true, 'step' : this.step.step_id - 1, 'page' : this.form.steps[this.step.step_id - 1].n_pages - 1};
				}
				else{
					return this.form.steps[this.step.step_id - 1].pages[this.form.steps[this.step.step_id - 1].n_pages - 1].previous_page();
				}
			}
		}
		else{
			if(this.form.steps[this.step.step_id].pages[this.page_id - 1].show(this.form.steps[this.step.step_id].pages[this.page_id - 1])){
				return {'value' : true, 'step' : this.step.step_id, 'page' : this.page_id - 1};
			}
			else{
				return this.form.steps[this.step.step_id].pages[this.page_id - 1].previous_page();
			}
		}
	};

	
	//Render the page
	this.render = function(){
		return nunjucks.renderString(template_page , {page : this});
	};
	
}