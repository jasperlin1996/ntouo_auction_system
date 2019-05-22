window.onload = function() { document.body.classList.remove('is-preload'); }
window.ontouchmove = function() { return false; }
window.onorientationchange = function() { document.body.scrollTop = 0; }
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

        function checkEmailVerified() {
            var user = firebase.auth().currentUser;
            // check user email verify
            if (user.emailVerified == false) {
                window.alert('please check the verification email.');
            }
            else {
                // check info
                var isUserFillAll;
                var promise_checkUserData = new Promise(function(resolve, reject){
                    resolve($.post('/checkuserdata/', {}, function(response) {
                        console.log('response: ' + response);
                        isUserFillAll = response;
                    }));
                });
                promise_checkUserData.then(function() {
                    console.log('check_response: ' + isUserFillAll);
                    
                    if (isUserFillAll == 'False') {
                        location.href = '/signup/';
                    }
                    else if (isUserFillAll == 'True') {
                        window.alert('login success');
                        location.href = '/index/';
                    }
                });
            }
        }

        function setSession(idToken) {
            $.post('/set-session/', { 'idToken': idToken }, function (response) {
                console.log(response);
                checkEmailVerified();
            });
        }

        function checkLoginUser() {
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    // User is signed in.
                    user.getIdToken().then(function(idToken) {
                        setSession(idToken);
                    });
                }
                else {
                    // No user is signed in.
                    console.log('not SignIn');
                }
            });
        }

        function googleSignIn() {
            var provider = new firebase.auth.GoogleAuthProvider();
            // firebase.auth().signInWithRedirect(provider);
            firebase.auth().signInWithPopup(provider).then(function (result) {
                // This gives you a Google Access Token. You can use it to access the Google API.
                var token = result.credential.accessToken;
                // The signed-in user info.
                var user = result.user;
                // ...
                console.log(firebase.auth().currentUser.email);
                checkLoginUser();
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // The email of the user's account used.
                var email = error.email;
                // The firebase.auth.AuthCredential type that was used.
                var credential = error.credential;
                // ...
                console.log('ERROR');
            });
        }

        function doLogIn()
        {
            var email = document.getElementById('accBox').value;
            var password = document.getElementById('passBox').value;
            console.log("Check LogIn");
            // TODO post // 把密碼和帳號丟到DB檢查
            firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                // ...
                window.alert(errorMessage);
                return -1;
            }).then(function(response) {
                console.log(response);
                if (response != -1) {
                    checkLoginUser();
                }
            });
        }
        //跳至註冊頁面
        function goPreSignup()
        {
            location.href = "/presignup/" ;
        }

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
