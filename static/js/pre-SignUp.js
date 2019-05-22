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

$(".toggle-password").click(function () {

    $(this).toggleClass("fa-eye fa-eye-slash");
    var input = $($(this).attr("toggle"));
    if (input.attr("type") == "password") {
        input.attr("type", "text");
    }
    else {
        input.attr("type", "password");
    }
});


/*
    checkData
    表單確認後執行
    確認輸入資料之正確性
*/
function checkData() {
    var isWrong = 0;

    var email = document.getElementById('mailBox').value;
    var pass = document.getElementById("passBox").value;
    var pass2 = document.getElementById("passBox2").value;
    isWrong += checkPassword(pass);
    isWrong += checkPassword2(pass, pass2);
    if (isWrong > 0) {
        window.alert("資料有誤 請檢察");
    }
    else {
        //todo 進行帳號註冊
        firebase.auth().createUserWithEmailAndPassword(email, pass).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
            return;
        }).then(function () {
            firebase.auth().currentUser.sendEmailVerification().then(function () {
                // Email sent.
                window.alert('Please check verify email.');
                location.href = '/signin/';
            }).catch(function (error) {
                // An error happened.
            });
        });
    }
}

/*
    checkPassword
    檢查密碼正確性
*/
function checkPassword(pass) {
    var passErr = document.getElementById("passAlert");
    var passw = /^[0-9A-Za-z]\w{6,16}$/;
    if (pass == "") {
        passErr.innerText = "請輸入密碼";
        return 1;
    }
    if (pass.match(passw)) {
        passErr.innerText = "";
        return 0;
    }
    else {
        passErr.innerText = "密碼格式有誤";
        return 1;
    }
}

/*
    checkPassword2
    檢查密碼是否輸入正確
*/
function checkPassword2(pass, pass2) {
    var passErr2 = document.getElementById("passAlert2");
    if (pass == pass2) {
        passErr2.innerText = "";
        return 0;
    }
    else {
        passErr2.innerText = "密碼不一致 請重新輸入";
        return 1;
    }
}
function goSignIn() {
    location.href = "/signin/";
}