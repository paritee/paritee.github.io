'use strict';

function copyToClipboard() {
  /* Get the text field */
  var copyText = document.getElementById("ToCopy");

  /* Select the text field */
  copyText.select();

  /* Copy the text inside the text field */
  document.execCommand("copy");

  /* Alert the copied text */
  alert("Copied the text: " + copyText.value);
}
  
function openTab(event) {
	var i, tabName, x, tablinks;

	for (i = 0; i < event.path.length; i++) {
		if (tabName = event.path[i].getAttribute('data-target'))
			break;
	}

	x = document.getElementsByClassName('content-tab');

	for (i = 0; i < x.length; i++) {
	    x[i].setAttribute('hidden', 'hidden');
	}

	tablinks = document.getElementsByClassName('tab');

	for (i = 0; i < x.length; i++) {
	    tablinks[i].className = tablinks[i].className.replace(' is-active', '');

		if (tablinks[i].getAttribute('data-target') == tabName)
			tablinks[i].className += ' is-active';
	}

	document.getElementById(tabName).removeAttribute('hidden');
}

function changeType() {
	var type, displayType;

	type = document.getElementById('Type');

	if (type.value.length < 1)
		return;

	displayType = document.getElementById('DisplayType');

	if (displayType.value.length < 1) {
		displayType.value = type.value;
	}

	updateData();
}

function changeHouse() {
	var buildingToLiveIn, displayHouse;

	buildingToLiveIn = document.getElementById('BuildingToLiveIn');

	if (buildingToLiveIn.value.length < 1)
		return;

	displayHouse = document.getElementById('DisplayHouse');

	if (displayHouse.value.length < 1) {
		displayHouse.value = buildingToLiveIn.value;
	}

	updateData();
}

function toggleProduce(event, id) {
	var produce, displayType;

	produce = document.getElementById(id);

	if (event.srcElement.checked) {
		produce.setAttribute('disabled', 'disabled');
		produce.value = '-1'
	}
	else {
		produce.removeAttribute('disabled');

		if (produce.value == '-1')
			produce.value = '';
	}

	updateData();
}

function updateProduceToggles(id) {
	var produce, toggle, harvestType, meatIndex;

	produce = document.getElementById(id);
	toggle = document.getElementById('Toggle' + id);
	harvestType = document.getElementById('HarvestType');
	meatIndex = document.getElementById('MeatIndex');

	if (harvestType.value == 'Butcher' && id == 'DefaultProduce')
	{
		produce.value = meatIndex.value == '' 
			? meatIndex.getAttribute('placeholder') 
			: meatIndex.value;
		produce.setAttribute('disabled', 'disabled');
		toggle.setAttribute('disabled', 'disabled');
	}
	else if (produce.value == -1) {
		toggle.checked = true;

		var event = [];
		event['srcElement'] = toggle;

		produce.setAttribute('disabled', 'disabled');
	} else {
		toggle.checked = false;
		produce.removeAttribute('disabled');
	}
}
  
function updateData(updateBrowserUrl = false) {
	var harvestType, harvestTool, changeTextureWhenReadyToHarvest, daysBetweenHarvests, defaultProduce, deluxeProduce;
	var fields, values, i, index, key, value, string, query, url;

	harvestType = document.getElementById('HarvestType');
	harvestTool = document.getElementById('HarvestTool');
	changeTextureWhenReadyToHarvest = document.getElementById('ChangeTextureWhenReadyToHarvest');
	daysBetweenHarvests = document.getElementById('DaysBetweenHarvests');
	defaultProduce = document.getElementById('DefaultProduce');
	deluxeProduce = document.getElementById('DeluxeProduce');

	switch (harvestType.value)
	{
		case 'Grab':
			if (harvestTool.value == 'null' || harvestTool.value == '-1')
				harvestTool.value = '';
			harvestTool.removeAttribute('disabled');
			changeTextureWhenReadyToHarvest.removeAttribute('disabled');
			daysBetweenHarvests.removeAttribute('disabled');
			if (defaultProduce.value == '-1')
				defaultProduce.value = '';
			break;
		case 'Find':
			harvestTool.value = 'null';
			harvestTool.setAttribute('disabled', 'disabled');
			changeTextureWhenReadyToHarvest.removeAttribute('disabled');
			daysBetweenHarvests.removeAttribute('disabled');
			if (defaultProduce.value == '-1')
				defaultProduce.value = '';
			break;
		case 'None':
			harvestTool.value = '-1';
			harvestTool.setAttribute('disabled', 'disabled');
			changeTextureWhenReadyToHarvest.value = 'false';
			changeTextureWhenReadyToHarvest.setAttribute('disabled', 'disabled');
			daysBetweenHarvests.setAttribute('disabled', 'disabled');
			defaultProduce.value = '-1';
			deluxeProduce.value = '-1';
			break;
		case 'Butcher':
			harvestTool.value = 'null';
			harvestTool.setAttribute('disabled', 'disabled');
			changeTextureWhenReadyToHarvest.value = 'false';
			changeTextureWhenReadyToHarvest.setAttribute('disabled', 'disabled');
			daysBetweenHarvests.setAttribute('disabled', 'disabled');
			defaultProduce.value = '-1';
			deluxeProduce.value = '-1';
			break;
		case 'Lay':
		default:
			harvestTool.value = 'null';
			harvestTool.setAttribute('disabled', 'disabled');
			changeTextureWhenReadyToHarvest.value = 'false';
			changeTextureWhenReadyToHarvest.setAttribute('disabled', 'disabled');
			daysBetweenHarvests.removeAttribute('disabled');
			if (defaultProduce.value == '-1')
				defaultProduce.value = '';
			break;
	}

	updateProduceToggles('DefaultProduce');
	updateProduceToggles('DeluxeProduce');

	fields = document.querySelectorAll('[data-field]');
	values = [];

	for (i = 0; i < fields.length; i++) {
		if (index = fields[i].getAttribute('data-field'))
			values[index] = formatField(fields[i]);
	}

	switch (values[13])
	{
		case 'Lay':
			values[13] = '0';
			break;
		case 'Butcher':
			values[13] = '2';
			break;
		default:
			values[13] = '1';
			break;
	}

	key = formatField(document.getElementById('Type'));
	value = values.join('/');

	string = '"' + key + '": "' + value + '",';

	document.getElementById('DataString').innerHTML = string;
	document.getElementById('ToCopy').value = string;

	blink(document.getElementById('CopyToClipboard'), 200);

    query = btoa(key + ':' + value);
	url = '?fad=' + query + '#generate-data-farmanimals-entry';

	document.getElementById('SaveUrl').setAttribute('href', url);

	if (updateBrowserUrl && window.history.replaceState)
	   window.history.replaceState(null, '', url);
}

function blink(el, speed = 100) {
	el.classList.toggle('is-faded');

	setTimeout(function() {
		el.classList.toggle('is-faded');
	}, speed);
}

function formatField(field) {
	return field.value.length < 1 ? field.getAttribute('placeholder') : field.value;
}

function fillFields(key, value) {
	var values, i;

	document.getElementById('Type').value = key;

	values = value.split('/');

	for (i = 0; i < values.length; i++)
		document.querySelector('[data-field="' + i + '"]').value = values[i];
}

function prefillData(event, key) {
	var data, emote, values, i, input, harvestType;

	data = {
        "White Chicken": "1/3/176/174/cluck/8/32/48/32/8/32/48/32/0/false/Coop/16/16/16/16/4/7/null/641/800/White Chicken/Coop",
        "Brown Chicken": "1/3/180/182/cluck/8/32/48/32/8/32/48/32/0/false/Coop/16/16/16/16/7/4/null/641/800/Brown Chicken/Coop",
        "Blue Chicken": "1/3/176/174/cluck/8/32/48/32/8/32/48/32/0/false/Coop/16/16/16/16/7/4/null/641/800/Blue Chicken/Coop",
        "Void Chicken": "1/3/305/305/cluck/8/32/48/32/8/32/48/32/0/false/Coop/16/16/16/16/4/4/null/641/800/Void Chicken/Coop",
        "Duck": "2/5/442/444/Duck/8/32/48/32/8/32/48/32/0/false/Coop/16/16/16/16/3/8/null/642/4000/Duck/Coop",
        "Rabbit": "4/6/440/446/rabbit/8/32/48/32/8/32/48/32/0/false/Coop/16/16/16/16/10/5/null/643/8000/Rabbit/Coop",
        "Dinosaur": "7/0/107/-1/none/8/32/48/32/8/32/48/32/0/false/Coop/16/16/16/16/1/8/null/644/1000/Dinosaur/Coop",
        "White Cow": "1/5/184/186/cow/36/64/64/64/36/64/64/64/1/false/Barn/32/32/32/32/15/5/Milk Pail/639/1500/White Cow/Barn",
        "Brown Cow": "1/5/184/186/cow/36/64/64/64/36/64/64/64/1/false/Barn/32/32/32/32/15/5/Milk Pail/639/1500/Brown Cow/Barn",
        "Goat": "2/5/436/438/goat/24/64/84/64/24/64/84/64/1/false/Barn/32/32/32/32/10/5/Milk Pail/644/4000/Goat/Barn",
        "Pig": "1/10/430/-1/pig/24/64/84/64/24/64/84/64/1/false/Barn/32/32/32/32/20/5/null/640/16000/Pig/Barn",
        "Hog": "1/5/640/-1/pig/24/64/84/64/24/64/84/64/2/false/Barn/32/32/32/32/20/5/null/640/1500/Hog/Barn",
        "Sheep": "3/4/440/-1/sheep/24/64/84/64/24/64/84/64/1/true/Barn/32/32/32/32/15/5/Shears/644/8000/Sheep/Barn"
	};

	blink(document.getElementById(key.replace(/ /g, '') + 'PrefillEmote'), 300);

	fillFields(key, data[key]);

	switch (key)
	{
		case 'White Cow':
		case 'Brown Cow':
		case 'Goat':
		case 'Sheep':
			harvestType = 'Grab';
			break;
		case 'Pig':
			harvestType = 'Find';
			break;
		case 'Hog':
			harvestType = 'Butcher';
			break;
		case 'White Chicken':
		case 'Brown Chicken':
		case 'Blue Chicken':
		case 'Void Chicken':
		case 'Duck':
		case 'Rabbit':
		case 'Dinosaur':
		default:
			harvestType = 'Lay';
			break;
	}

	document.getElementById('HarvestType').value = harvestType;

	updateData();
}

function resetData(event) {
	var fields, i;

	blink(document.getElementById('WhiteCowPrefillAngryEmote'), 300);

	openTab(event);

	document.getElementById('Type').value = '';
	
	fields = document.querySelectorAll('[data-field]');

	for (i = 0; i < fields.length; i++) {
		fields[i].value = '';
	}

	document.getElementById('Sound').value = 'cow';
	document.getElementById('HarvestType').value = 'Grab';
	document.getElementById('ChangeTextureWhenReadyToHarvest').value = 'false';

	updateData();
}

function moo()
{
	console.log('	          .=     ,        =.');
	console.log('  _  _   /\'/    )\\,/,/(_   \\ \\');
	console.log('   `//-.|  (  ,\\\\)\\//\\)\\/_  ) |');
	console.log('   //___\\   `\\\/\\/\/\\///\'  /');
	console.log(',-"~`-._ `"--\'_   `"""`  _ \\`\'"~-,_');
	console.log('\\       `-.  \'_`.      .\'_` \ ,-"~`/');
	console.log(' `.__.-\'`/   (-\\        /-) |-.__,\'');
	console.log('   ||   |     \\O)  /^\\ (O/  |');
	console.log('   `\\\\  |         /   `\\    /');
	console.log('     \\\\  \\       /      `\\ /');
	console.log('      `\\\\ `-.  /\' .---.--.\\');
	console.log('        `\\\\/`~(, \'()      (\'');
	console.log('         /(O) \\\\   _,.-.,_)');
	console.log('        //  \\\\ `\'`      /');
	console.log('       / |  ||   `""""~"`');
	console.log('     /\'  |__||');
	console.log('           `o');
}

document.addEventListener('DOMContentLoaded', function () {
  	var urlParams, fad, entry;

  	urlParams = new URLSearchParams(window.location.search);
	fad = urlParams.get('fad');

	if (fad !== null) {
		entry = atob(fad).split(':');
		fillFields(entry[0], entry[1]);
	}

  	updateData(false);

  	moo();
});