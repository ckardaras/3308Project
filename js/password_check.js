var myInput = document.getElementById("player_passwordFirst");
var confirmMyInput = document.getElementById("player_passwordConfirm");
 console.log('helllooo1')
// myInput.onkeyup = myFunction() {
function myFunction() {
  console.log('helllooo')
  var checker = 0;
  var lowerCaseLetters = /[a-z]/g;
  var upperCaseLetters = /[A-Z]/g;
  var numbers = /[0-9]/g;
  var minLength = 8;

  // Validate lowercase letters
  if(myInput.value.match(lowerCaseLetters)) {
    console.log('1')
      // letter.classList.remove("invalid");
      // letter.classList.add("valid");
      checker++;
  } else {
      // letter.classList.remove("valid");
      // letter.classList.add("invalid");
      checker--;
  }

  // Validate capital letters
  if(myInput.value.match(upperCaseLetters)) {
      // capital.classList.remove("invalid");
      // capital.classList.add("valid");
      checker++;
      console.log('2')
  } else {
      // capital.classList.remove("valid");
      // capital.classList.add("invalid");
      checker--;
  }

  // Validate numbers
  if(myInput.value.match(numbers)) {
      // number.classList.remove("invalid");
      // number.classList.add("valid");
      checker++
      console.log('3')
  } else {
      // number.classList.remove("valid");
      // number.classList.add("invalid");
      checker--;
  }

  // Validate length
  if(myInput.value.length >= minLength) {
      // length.classList.remove("invalid");
      // length.classList.add("valid");
      checker++;
      console.log('4')
  } else {
      // length.classList.remove("valid");
      // length.classList.add("invalid");
      checker--;
  }
}
  // confirmMyInput.onkeyup = myFunction() {
  function myFunction2() {

              // Validate password and confirmPassword
              var passEqualsConfPass = (myInput.value == confirmMyInput.value && myInput.value.length == confirmMyInput.value.length);
              if(passEqualsConfPass) {
                  // match.classList.remove("invalid");
                  // match.classList.add("valid");
                  console.log('5')
                  checker++;
              } else {
                  // match.classList.remove("valid");
                  // match.classList.add("invalid");
                  checker--;
              }

              enableButton(letter, capital, number, length, match);
              console.log('checker')

  }

  function enableButton(letter, capital, number, length, match) {

      var button = document.getElementById('my_submit_button');
      //var condition = ((letter.classList.contains("valid")) && (capital.classList.contains("valid")) && (number.classList.contains("valid")) && (length.classList.contains("valid")) && (match.classList.contains("valid"))); // TODO: Replace false with the correct condition
      if(checker==5) {
              button.disabled = false;
          }
      }



  function onClickFunction() {
    if(checker ==5){
      alert("Hey! I'm all green! Well done.")
    }
    else{
      alert("You password need an upperCaseLetters, a lowercase, a number, and at least 8 char")
    }
  }
