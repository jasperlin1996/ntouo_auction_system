// 即時顯示上傳圖片
$("#imgIn").change(function(){
    readURL(this);
 });
// 讀取上傳之url並丟入img顯示
function readURL(input){
    if(input.files && input.files[0]){
        var reader = new FileReader();
        reader.onload = function (e) {
            $("#image").attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// 增加日期
Date.prototype.addDays = function(days) {
    this.setDate(this.getDate() + days);
    return this;
}

// 一開始執行之動作
// 1.取得開啟網頁時間並整理設定datatime-local限制(最早7天後結標)
// 2.讀取分類表
// 3.取得賣家idToken
window.onload = load;
function load(){
    // 設定截標最短時間(7天後)
    var now = new Date();
    now.addDays(7);
    var year = now.getFullYear();
    var month = now.getMonth() + 1;
    var date = now.getDate();
    var hour = now.getHours();
    var minute = now.getMinutes();
    if (month < 10) {
        month = "0" + month;
    }
    if (date < 10) {
        date = "0" + date;
    }
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    var str= year + "-" + month + "-" + date + "T";
    str += hour + ":" + minute;
    document.getElementById("deadline").setAttribute("value", str);

    // 顯示分類選單
    var categorys;
    $.ajax({
        url: "/getcategory/",
        type: "POST",
        async: false,
        cache: false,
        success: function(response) {
            categorys = response;
        },
        error: function() {
            window.alert("取得分類表失敗！");
        }
    });
    var list = categorys.split(",");
    var temp = "";
    for (let i = 0; i < list.length; i++) {
        temp += '<option value="' + list[i] + '">' + list[i] + "</option>";
    }
    document.getElementById("category").innerHTML = temp;

    // 顯示賣家名稱
    $.ajax({
        url: "/getusername/",
        type: "POST",
        async: false,
        cache: false,
        success: function(response) {
            username = response;
        }
    })
    document.getElementById("seller").value = username;
}

// 根據販賣方式改變畫面
function switch_trading() {
    var now = document.getElementById("now");
    var step = document.getElementById("step");
    if(document.getElementById("sell").checked) { // 選取直購
        now.value = "";
        step.value = "";
        now.setAttribute("readonly", true);
        step.setAttribute("readonly", true);
    }
    else { //選取拍賣
        now.removeAttribute("readonly");
        step.removeAttribute("readonly");
    }
}

// 檢查輸入價格
function checkForm(){
    if (document.getElementById("sale").checked) { // 確認為拍賣模式
        var max = Number(document.getElementById("max").value); // 直購價
        var now = Number(document.getElementById("now").value); // 底價
        var step = Number(document.getElementById("step").value); // 每標價格

        console.log(typeof(max));
        console.log(now);
        console.log(step);

        if (max < now + step) {
            window.alert("直購價不可低於開始價格加上每標底價！");
            return false;
        }
    }
    // 檢查上傳檔案格式
    var accept = [".gif",".jpeg",".jpg",".png"];
    var update = document.getElementById("imgIn").value;
    update = update.substring(update.lastIndexOf('.'));
    if (accept.indexOf(update) < 0) {
        window.alert("上傳檔案格式錯誤");
        document.getElementById("imgIn").value = null;
        return false;
    }
    return true;
}