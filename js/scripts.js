const errorGeneric = "an error has occurred",
	errorNoFileSelected = "please select a file",
	errorFileIsEmpty = "file is empty"
	errorPleaseSelectMonitor = "please select at least one monitor";
	
var saveFileName = "", saveContents = "";
	
function Start() {
	document.getElementById("sectionStart").style.display = "none";
	document.getElementById("sectionMonitors").style.display = "block";
}

function Confirm() {
	document.getElementById("sectionMonitors").style.display = "none";
	document.getElementById("sectionLoad").style.display = "block";
}

function Load() {
	var currentSelection = null;
	
	saveContents = "", saveSelection = "";
	
	document.getElementById("monitorList").innerHTML = "";
	document.getElementById("errorLoad").innerText = "";
	
	document.getElementById("sectionWhich").style.display = "none";
	document.getElementById("sectionDownload").style.display = "none";
	
	if(document.getElementById("uploadedFile").files.length == 0) {
		document.getElementById("errorLoad").innerText = errorNoFileSelected;
	} else {
		var file = document.getElementById("uploadedFile").files[0];
		if (file) {
			saveFileName = file.name;
		
			var reader = new FileReader();
			reader.readAsText(file, "UTF-8");
			reader.onload = function (evt) {
				var fileContents = evt.target.result;
				
				if(!IsNullOrEmpty(fileContents)) {
					var selectMonitors = document.getElementById("selectMonitors");
					var selectMonitorsValue = parseInt(selectMonitors.options[selectMonitors.selectedIndex].value);
				
					var lines = fileContents.split(/\r\n|\r|\n/);
					
					for(i=0;i<lines.length;i++) {
						if(lines[i].indexOf("selectedmonitors:s:") > -1) {
							currentSelection = lines[i].split("selectedmonitors:s:")[1];
						}
						else {
							saveContents += lines[i] + "\r\n";
						}
					}
					
					for(i=0;i<selectMonitorsValue;i++) {
						document.getElementById("monitorList").innerHTML += "<li><input class=\"monitor\" type=\"checkbox\" id=\"checkbox" + i.toString() + "\"" + ((currentSelection != null && currentSelection.indexOf(i) > -1)? " checked" : "") + "><label for=\"checkbox" + i.toString() + "\">" + (i + 1).toString() + "</label></li>";
					}
					
					document.getElementById("sectionLoad").style.display = "none";
					document.getElementById("sectionWhich").style.display = "block";
				} else {
					document.getElementById("errorLoad").innerText = errorFileIsEmpty;
				}
			}
			reader.onerror = function (evt) {
				console.log("error reading file");
			}
		} else {
			document.getElementById("errorLoad").innerText = errorNoFileSelected;
		}
	}
}

function Which() {
	document.getElementById("errorWhich").innerText = "";
	document.getElementById("selectedMonitors").innerText = "";

	var monitors = document.getElementsByClassName("monitor");
	
	if(monitors.lentgh < 1)
		document.getElementById("errorWhich").innerText = errorGeneric;
	else {
		var selectedMonitors = [];
		
		for(i=0;i<monitors.length;i++) {
			if(monitors[i].checked) {
				selectedMonitors.push(i);
				document.getElementById("selectedMonitors").innerText += ((document.getElementById("selectedMonitors").innerText != "")? ", " : "") + (i + 1).toString();
			}
		}
	}
	
	if(selectedMonitors.length < 1)
		document.getElementById("errorWhich").innerText = errorPleaseSelectMonitor;
	else {
		var saveSelection = "";
	
		for(i=0;i<selectedMonitors.length;i++) {
			saveSelection += ((saveSelection != "")? "," : "") + selectedMonitors[i].toString();
		}
		
		saveContents += "selectedmonitors:s:" + saveSelection;
		
		document.getElementById("sectionWhich").style.display = "none";
		document.getElementById("sectionDownload").style.display = "block";
	}
}

function Download() {
	var element = document.createElement('a');
	element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(saveContents));
	element.setAttribute('download', saveFileName.split(".rdp").join("").trim() + "-modified.rdp");
	element.style.display = 'none';
	
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

function Cancel() {
	document.getElementById("sectionMonitors").style.display = "none";
	document.getElementById("sectionLoad").style.display = "none";
	document.getElementById("sectionWhich").style.display = "none";
	document.getElementById("sectionDownload").style.display = "none";
	
	document.getElementById("errorLoad").innerText = "";
	document.getElementById("errorWhich").innerText = "";
	
	document.getElementById("uploadedFile").value = null;
	
	document.getElementById("sectionStart").style.display = "block";
}

function IsNullOrEmpty(inString) {
	return (inString == null || inString == "");
}
