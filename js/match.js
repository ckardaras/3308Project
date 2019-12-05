function AddDateLocation() {
  var Loc = document.getElementById("loc");
  //var confirmMyInput = document.getElementById("datetime");
  var s = $("#dateTime").val();
  var dateTime = new Date(s.replace(/-/g,'/').replace('T',' '));
  var button = document.getElementById("my_submit_button");
  var checker = 0;
  console.log('debug1')
  console.log('dateTime')

  }
