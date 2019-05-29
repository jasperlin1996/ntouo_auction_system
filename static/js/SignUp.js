/*
    checkData
    表單確認後執行
    確認輸入資料之正確性
*/
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

function checkData() {

  //紀錄輸入資料是否有誤
  var isWrong = 0;

  //提出input資料
  var user_name = document.getElementById("nameBox").value;
  var tele = document.getElementById("telBox").value;
  var add = document.getElementById("addBox").value;
  var sns = document.getElementById("snsBox").value;

  //呼叫其他檢查function
  isWrong += checkName(user_name);
  isWrong += checkTelephome(tele);
  isWrong += checkAddress(add);
  isWrong += checkSNS(sns);

  //資料有錯誤就跳窗提醒
  console.log("isWrong= " + isWrong);

  if (isWrong > 0) {
    window.alert("資料有誤 請檢查");
    console.log("資料有誤");
  } else {
    var email = '';
    var providerId = '';
    var uid = '';
    if (firebase.auth().currentUser != null) {
      var provider_data = firebase.auth().currentUser.providerData[0];
      email = provider_data.email;
      providerId = provider_data.providerId;
      uid = provider_data.uid;
    }
    $.ajax({
      url: '/postsignup/',
      type: "POST",
      data: {
        'user_name': user_name,
        'phone': tele,
        'address': add,
        'contact': sns,
        'email': email,
        'provider': providerId,
        'uid': uid,
        csrfmiddlewaretoken: csrf_token
      },
      datatype: 'string',
      success: function(response) {
        console.log(response);
        location.href = '/index/';
      }
    });
  }
}

/*
    checkName
    確認姓名正確性
*/
function checkName(name) {
  var nameErr = document.getElementById("nameAlert");
  if (name == "") {
    nameErr.innerText = "名字不能為空白";
    return 1;
  } else {
    nameErr.innerText = "";
    return 0;
  }
}

/*
    checkTelephone
    確認電話正確性
*/
function checkTelephome(tele) {
  var passErr2 = document.getElementById("phoneAlert");
  var numbers = /^[0-9]+$/;
  if (tele.match(numbers)) {
    passErr2.innerText = "";
    return 0;
  } else {
    passErr2.innerText = "請輸入正確的電話號碼";
    return 1;
  }
}

/*
    checkAddress
    確認地址的正確
*/
function checkAddress(add) {
  var addErr = document.getElementById("addAlert");
  if (add == "") {
    addErr.innerText = "地址不能為空白";
    return 1;
  } else {
    addErr.innerText = "";
    return 0;
  }
}

/*
    checkSNS
    確認社群帳號之正確
*/
function checkSNS(sns) {
  var snsErr = document.getElementById("snsAlert");
  if (sns == "") {
    snsErr.innerText = "SNS不能為空白";
    return 1;
  } else {
    snsErr.innerText = "";
    return 0;
  }
}
