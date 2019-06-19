$("#accBox , #passBox").keyup(function(e)
{
  if(e.keyCode === 13)
  {
    doLogIn();
  }
});



window.onload = function() {
  document.body.classList.remove('is-preload');
}
window.ontouchmove = function() {
  return false;
}
window.onorientationchange = function() {
  document.body.scrollTop = 0;
}
// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCF_Q4YD_W7FWb40pDU-NHW0ooYsnJWDUM",
  authDomain: "auction-system-73960.firebaseapp.com",
  databaseURL: "https://auction-system-73960.firebaseio.com",
  projectId: "auction-system-73960",
  storageBucket: "auction-system-73960.appspot.com",
  messagingSenderId: "650872511305",
  appId: "1:650872511305:web:8afe3f2f1c33b4f6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


function checkUserData()
{
  $.ajax({
    url: '/checkuserdata/',
    type: 'POST',
    cache: false,
    async: false,
    success: function(response) {
      if (response.status == true) {
        window.alert('login success');
        location.href = '/index/';
      }
      else {
        location.href = '/signup/';
      }
    }
  });
}

function checkEmailVerified() {
  var user = firebase.auth().currentUser;
  // check user email verify
  if (user.emailVerified == false) {
    window.alert('please check the verification email.');
    user.sendEmailVerification().then(function () {
      // Email sent.
    }).catch(function (error) {
      // An error happened.
    });
  } else {
    // check info
    user.getIdToken().then(function(idToken) {
      setSession(idToken);
    }).then(function() {
      checkUserData();
    })
  }
}

function setSession(idToken) {
  $.ajax({
    url: '/setsession/',
    type: 'POST',
    data: {'idToken': idToken},
    cache: false,
    async: false,
    success: function(response) {
      if (response.status == false) {
        window.alert('Something Wrong, Please SignIn Again.');
        location.href = '/signin/';
      }
    }
  });
}

function checkLoginUser() {
  firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      checkEmailVerified();
    } else {
      // No user is signed in.
      console.log('not SignIn');
    }
  });
}

function thirdPartySignIn(provider)
{
  firebase.auth().signInWithPopup(provider).then(function(result) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // The signed-in user info.
    var user = result.user;
    checkLoginUser();
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    console.log(error);
    location.href = '/signin/';
  });
}

function googleSignIn() {
  var provider = new firebase.auth.GoogleAuthProvider();
  thirdPartySignIn(provider);
}

function facebookSignIn()
{
  console.log('hi');
  var provider = new firebase.auth.FacebookAuthProvider();
  thirdPartySignIn(provider);
}

function githubSignIn()
{
  var provider = new firebase.auth.GithubAuthProvider();
  thirdPartySignIn(provider);
}

function doLogIn() {
  var email = document.getElementById('accBox').value;
  var password = document.getElementById('passBox').value;
  // TODO post // 把密碼和帳號丟到DB檢查
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
    window.alert(errorMessage);
    return -1;
  }).then(function(response) {
    if (response != -1) {
      checkLoginUser();
    }
  });
}
//跳至註冊頁面
function goPreSignup() {
  location.href = "/presignup/";
}

$(".toggle-password").click(function() {

  $(this).toggleClass("fa-eye fa-eye-slash");
  var input = $($(this).attr("toggle"));
  if (input.attr("type") == "password") {
    input.attr("type", "text");
  } else {
    input.attr("type", "password");
  }
});


//重設視窗大小  andy
$(function() {
  $(window).resize(function() {
    var barHeight = $(".header1").height();
    if ($(window).width() < 1040)
    {
        $("#main").css('top',barHeight+ 50 +"px");
    }
  }).resize()
});
