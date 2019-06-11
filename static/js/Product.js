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
    document.getElementById("deadline").setAttribute("value", info.deadline);
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
                temp += '<td><form method="POST" action="/setproductquestion/">';
                // 為了上傳商品id 不顯示於網頁
                temp += '<input type="text" name="id" style="display: none">';
                // 為了上傳問題index 不顯示於網頁
                temp += '<input type="text" name="question_index" value="' + i + '" style="display:none">';
                temp += '<textarea name="text" cols="20" rows="5" required></textarea>';
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
    if (user_name!=info.seller){
        temp += '<tr class="tr3"><td><form method="POST" action="/setproductquestion/">';
        // 為了上傳商品id 不顯示於網頁
        temp += '<input type="text" name="id" style="display: none>';
        temp += '<textarea name="text" cols="20" rows="5" required></textarea>';
        temp += '<input type="submit" value="我要發問!">';
        temp += '</form></td></tr>';
    }
    document.getElementById("qa").innerHTML = temp;
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