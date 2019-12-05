// https://www.codexworld.com/bootstrap-datetimepicker-add-date-time-picker-input-field/

function AddDateLocation() {
  var Loc = $("#loc").val();
  var list = document.getElementById("Thicklist");
  //var confirmMyInput = document.getElementById("datetime");
  var s = $("#dateTime").val();
//  var dateTime = new Date(s.replace(/-/g,'/').replace('T',' '));
  var button = document.getElementById("my_submit_button");
  var checker = 0;
  console.log('debug1')
  console.log(Loc)
  console.log(s)
  var newLi = document.createElement("li");
  newLi.innerHTML = Loc;
  document.body.appendChild(newLi);

  var newLi2 = document.createElement("li");
  newLi2.innerHTML = s;
  document.body.appendChild(newLi2);
  }
