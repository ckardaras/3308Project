function PasswordCheck() {
var myInput = document.getElementById("player_passwordFirst");
 var confirmMyInput = document.getElementById("player_passwordConfirm");
 var button = document.getElementById("my_submit_button");
 var checker = 0;

 console.log('helllooo1')
myInput.onkeyup = function() {
// function myFunction() {
  console.log('helllooo')

  var lowerCaseLetters = /[a-z]/g;
  var upperCaseLetters = /[A-Z]/g;
  var numbers = /[0-9]/g;
  var minLength = 8;

  // Validate lowercase letters

  if(myInput.value.match(lowerCaseLetters)) {
    console.log('1')

      checker++;
  } else {

      checker--;
  }

  // Validate capital letters
  if(myInput.value.match(upperCaseLetters)) {

      checker++;
      console.log('2')
  } else {

      checker--;
  }

  // Validate numbers
  if(myInput.value.match(numbers)) {

      checker++
      console.log('3')
  } else {

      checker--;
  }

  // Validate length
  if(myInput.value.length >= minLength) {

      checker++;
      console.log('4')
  } else {

      checker--;
  }
}

confirmMyInput.onkeyup = function() {



              // Validate password and confirmPassword
              var passEqualsConfPass = (myInput.value == confirmMyInput.value && myInput.value.length == confirmMyInput.value.length);
              if(passEqualsConfPass) {

                  console.log('5')
                  checker++;
                    button.disabled = false;
              } else {

                  checker--;
              }

  }


// Coach Form
var myInput2 = document.getElementById("coach_passwordFirst");
var confirmMyInput2 = document.getElementById("coach_passwordConfirm");
var button2 = document.getElementById("my_submit_button2");
var checker2 = 0;
myInput2.onkeyup = function() {
// function myFunction() {
  console.log('helllooo')

  var lowerCaseLetters = /[a-z]/g;
  var upperCaseLetters = /[A-Z]/g;
  var numbers = /[0-9]/g;
  var minLength = 8;

  // Validate lowercase letters

  console.log('checker')

  if(myInput2.value.match(lowerCaseLetters)) {
    console.log('1')

      checker2++;
  } else {

      checker2--;
  }

  // Validate capital letters
  if(myInput2.value.match(upperCaseLetters)) {

      checker2++;
      console.log('2')
  } else {

      checker2--;
  }

  // Validate numbers
  if(myInput2.value.match(numbers)) {

      checker2++
      console.log('3')
  } else {

      checker2--;
  }

  // Validate length
  if(myInput2.value.length >= minLength) {

      checker2++;
      console.log('4')
  } else {

      checker2--;
  }
}

confirmMyInput2.onkeyup = function() {
  // function myFunction2() {


              // Validate password and confirmPassword
              var passEqualsConfPass = (myInput2.value == confirmMyInput2.value && myInput2.value.length == confirmMyInput2.value.length);
              if(passEqualsConfPass) {

                  console.log('5')
                  checker2++;
                  button2.disabled = false;
              } else {

                  checker2--;
              }
  }
}

  function onClickFunction() {
    if(checker ==5 ||checker2 ==5){
      alert("Hey! I'm all green! Well done.")
    }
    else{
      alert("You password need an upperCaseLetters, a lowercase, a number, and at least 8 char")
    }
  }
