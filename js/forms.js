function viewForm(id, toggle)
{
	if(toggle == 0)
	{
		document.getElementById(id).style.visibility= 'hidden';
		document.getElementById(id).style.height= '0';
	}
	else
	{
		document.getElementById(id).style.visibility= 'visible';
		document.getElementById(id).style.height= 'auto';
	}
}

var teams = [];
var numTeams = 0;

function createTeam(team_id)
{
	teams.push(document.getElementById("coach_createTeam").value);
}

function loadTeams()
{
	if(!Data)
	{
		window.alert("There are no teams created.");
		return;
	}
	var i;
	var dropdown = document.getElementById("team_selector");
	for(i = numTeams; i < teams.length; i++)
	{
		var x = document.createElement("A");
		x.href="#";
		x.setAttribute("onclick", "pickedTeam(" + i + ")");
		x.setAttribute("class", "dropdown-item");
		x.innerText = teams[i];
		dropdown.appendChild(x);
	}
	numTeams++;
}

function pickedTeam(i)
{
	document.getElementById("selectTeamButton").innerText = teams[i];
}

function setImg()
{
	console.log("../img/" + document.getElementById("input_img").value.split("\\").pop());
	document.getElementById("playerimage").src = "../img/" + document.getElementById("input_img").value.split("\\").pop();
}
