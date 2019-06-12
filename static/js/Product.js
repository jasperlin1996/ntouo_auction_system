window.onload = load;
// read product's information and show
function load() {
    // 分別寫入位置
    document.getElementById("image").setAttribute("src", info.images[0]);
    document.getElementById("product_name").innerHTML = info.product_name;
    document.getElementById("category").innerHTML = info.category;
    document.getElementById("seller").innerHTML = info.seller;

    if (info.status == 0) {
        document.getElementById("status").innerHTML = "待出售";
    }
    else if (info.status == 1) {
        document.getElementById("status").innerHTML = "競標中";
    }
    else if (info.status == 2) {
        document.getElementById("status").innerHTML = "交易中";
    }
    else if (info.status == 3 || info.status == 4) {
        document.getElementById("status").innerHTML = "已賣出";
    }
    else {
        document.getElementById("status").innerHTML = "已下架";
    }

    if (info.trading_type == 0) { // 拍賣顯示價格模式
        document.getElementById("trading_type").innerHTML = "拍賣";
        document.getElementById("price").innerHTML = info.price + "元";
        document.getElementById("current_price").innerHTML = info.current_price + "元";
        document.getElementById("price_per_mark").innerHTML = info.price_per_mark + "元";
    }
    else { // 直購顯示價格模式
        document.getElementById("trading_type").innerHTML = "直購";
        document.getElementById("price").innerHTML = info.price + "元";
        document.getElementById("current_price").innerHTML = "--------";
        document.getElementById("price_per_mark").innerHTML = "--------";
    }

    document.getElementById("highest_buyer_id").innerHTML = info.highest_buyer_id;
    document.getElementById("description").innerHTML = info.description;
    document.getElementById("trading_method").innerHTML = info.trading_method;
    setTimeout();
    // 輸入商品id以上傳
    var id = document.getElementsByName("id");
    for (let i = 0; i < id.length; i++) {
        id[i].setAttribute("value", info.id);
    }
    // 取得user name
    var user_name;
    $.ajax({
        url: "/getusername/",
        type: 'POST',
        cache: false,
        async: false,
        success: function(response) {
            user_name = response;
        }
    });
    // 輸出問與答
    var qas = info.qas;
    var temp = "";
    for (let i = 0; i < qas.length; i++) {
        temp += "<tr class='tr";
        if (i%2 == 0){
            temp += "1";
        }
        else {
            temp += "2";
        }
        temp += "'><td>" + qas[i].question + "</td>";
        // 使用者為賣家
        if(user_name == info.seller) {
            // 尚未回答
            if(qas[i].answer=="") {
                temp += '<td><form method="POST" action="/setproductanswer/" onsubmit="return checkUser()">';
                temp += csrf_token;
                // 為了上傳商品id 不顯示於網頁
                temp += '<input type="text" name="id" style="display: none">';
                // 為了上傳問題index 不顯示於網頁
                temp += '<input type="text" name="question_index" value="' + i + '" style="display:none">';
                temp += '<textarea name="text" cols="20" rows="1" required></textarea>';
                temp += '<input type="submit" value="回答此問題">';
                temp += '</form></td></tr>';
            }
            // 已回答
            else {
                temp += '<td>' + qas[i].answer + '</td></tr>';
            }
        }
        // 使用者非賣家
        else{
            temp += "<td>" + qas[i].answer + "</td></tr>";
        }
    }
    var temp = "";
    // 使用者非賣家
    if (user_name != info.seller){
        temp += '<tr class="tr3"><td><form method="POST" action="/setproductquestion/" onsubmit="return checkUser()">';
        temp += csrf_token;
        // 為了上傳商品id 不顯示於網頁
        temp += '<input type="text" name="id" style="display: none>';
        temp += '<textarea name="text" cols="20" rows="1" required></textarea>';
        temp += '<input type="submit" value="我要發問!">';
        temp += '</form></td></tr>';
    }
    document.getElementById("qa").innerHTML = temp;
}

// 倒數結標時間
function showTime(){
    console.log("show time");
    var now = new Date();
    var deadline = info.deadline;
    var array = deadline.split('-');
    var endY = array[0];
    var endM = array[1];
    var day = array[2].split('T');
    var endD = day[0];
    var da = day[1].split(':');
    var endH = da[0];
    var end = new Date(endY, endM - 1, endD, endH, 0, 0, 0);
    var spantime = (end - now) / 1000;

    console.log(spantime);
    var d = Math.floor(spantime / (24 * 3600));
    var h = Math.floor((spantime % (24 * 3600)) / 3600);
    var m = Math.floor((spantime % 3600) / 60);
    var s = Math.floor(spantime % 60);

    if (spantime < 0) {
        d = 0;
        h = 0;
        m = 0;
        s = 0;
    }
    var temp = d + " 天 " + h + " 小時 " + m + " 分 " + s + " 秒 ";
    $('#deadline').text(temp);
    setTimeout("showTime()", 1000);
}

// 送出追蹤請求
function tracking() {
    if(!checkUser()){
        return;
    }
    else{
        $.ajax({
            url: "/settrackingproduct/",
            type: "POST",
            data: {'id': info.id},
            cache: false,
            async: false,
            success: function(response){
                if (response.status) {
                    window.alert("追蹤成功");
                }
                else {
                    window.alert("追蹤失敗");
                }
            }
        });
    }
}

// 檢查出價
function checkForm(){
    // 確認價格
    var input = Number(document.getElementById("inputprice").value);
    if ((input - info.current_price) % info.price_per_mark != 0) {
        window.alert("出價需為目前價格加上每標底價的整數倍");
        return false;
    }
    return checkUser();
}

// 確認是否登入
function checkUser(){
    // 確認登入狀態
    var user_status = false;
    $.ajax({
        url: "/checkuserstatus/",
        type: 'POST',
        cache: false,
        async: false,
        success: function(response) {
        user_status = response.status;
        }
    });
    if(!user_status) {
        window.alert("請登入以繼續!");
        return false;
    }
    return true;
}