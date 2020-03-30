/* An alert of an input
*
* PARAMETERS
*
* title: 		 The title of the form, can be a string or a javascrip function returning a string
* 
 */


function Alert(form, step, page, element, parameters){
	
	//Set show, default is function returning true
	this.condition = parameters.condition || function(self, end, index){return true;};
	
	//Set message
	this.message = parameters.message || console.error('Alert without message found!');
	if(typeof this.message !== 'function'){var message_text = this.message;this.message = function(self){return String(message_text)};};
	
	//Set form, step and page
	this.form = form;
	this.step = step;
	this.page = page;
	this.element = element;
	
}

function update_alerts(end){
	
	var alert_found = false;
	//Iterate steps
	for(var i = 0; i < form.steps.length; i++){
		form.steps[i].has_alert = false;
		//Iterate pages
		for(var j = 0; j < form.steps[i].pages.length; j++){
			//Iterate page instances
			for(var m = 0; m < form.steps[i].pages[j].has_alert.length; m++){
				form.steps[i].pages[j].has_alert[m] = false;
				//Iterate elements
				for(var k = 0; k < form.steps[i].pages[j].elements.length; k++){
					//Check if elemenent supports alerts
					try{
						if(form.steps[i].pages[j].elements[k].hasOwnProperty('alerts') && form.steps[i].pages[j].elements[k].show(form.steps[i].pages[j].elements[k])){
							//Iterate alerts
							for(var l = 0; l < form.steps[i].pages[j].elements[k].alerts.length; l++){
								//If alert is on
								if(form.steps[i].pages[j].elements[k].alerts[l].condition(form.steps[i].pages[j].elements[k], end, m)){
									alert_found = true;
									form.steps[i].pages[j].has_alert[m] = true;
									form.steps[i].has_alert = true;
								}
							}
						}
					}
					catch(err){
						
					}
				}
			}	
		}
	}

	return alert_found;
}