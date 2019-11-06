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
