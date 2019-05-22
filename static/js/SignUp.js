
/*
    checkData
    表單確認後執行
    確認輸入資料之正確性
*/
function checkData() {
   
    //紀錄輸入資料是否有誤
    var isWrong = 0;

    //提出input資料
    var name = document.getElementById("nameBox").value;
    var tele = document.getElementById("telBox").value;
    var add = document.getElementById("addBox").value;
    var sns = document.getElementById("snsBox").value;

    //呼叫其他檢查function
    isWrong += checkName(name);
    isWrong += checkTelephome(tele);
    isWrong += checkAddress(add);
    isWrong += checkSNS(sns);

    //資料有錯誤就跳窗提醒
    console.log("isWrong= " + isWrong);

    if (isWrong > 0) {
        window.alert("資料有誤 請檢查");
        console.log("資料有誤");
    }
    else {
        $.ajax({
            url: '/post-signup/',
            type: "POST",
            data: { 'name': name, 'phone': tele, 'address': add, 'contact': sns, csrfmiddlewaretoken: '{{ csrf_token }}' },
            datatype: 'string',
            success: function (response) {
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
    }
    else {
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
    }
    else {
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
    }
    else {
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
    }
    else {
        snsErr.innerText = "";
        return 0;
    }
}
