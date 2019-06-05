window.onload = load;

// read product's information and show
function load() {
    $.ajax({
        url:"/getproductinfo/",
        cache: false,
        async: false,
        success: function(request){
            // 讀取資料
            var info = request;
            // 分別寫入位置
            document.getElementById("image").setAttribute("src", info.image);
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

            if (info.type == 0) { // 拍賣顯示價格模式
                document.getElementById("trading_type").innerHTML = "拍賣";
                document.getElementById("price").innerHTML = info.price + "元";
                document.getElementById("current_price").innerHTML = info.current_price + "元";
                document.getElementById("price_per_mark").innerHTML = info.price_per_mark + "元";
            }
            else { // 直購顯示價格模式
                document.getElementById("type").innerHTML = "直購";
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
            for (let i = 0; i < 3; i++) {
                id[i].setAttribute("value", info.id);
            }
            // 輸出問與答
            var question = info.question;
            var answer = info.answer;
            var temp = "";
            for (let i = 0; i < question.length; i++) {
                temp += "<tr><td>" + question[i] + "</td>";
                temp += "<td>" + answer[i] + "</td></tr>";
            }
            document.getElementById("qa").innerHTML = temp;
        }
    });  
}

// 送出追蹤請求
function tracking() {
    $.ajax({
        url: "/settrackingproduct/",
        type: "POST",
        cache: false,
        async: false,
        success: function(){
            window.alert("追蹤成功！");
        }
    })
}

// 檢查出價
function checkForm(){
    window.alert("check");
    var input = Number(document.getElementById("inputprice").value);
    if ((input - info.current_price) % info.price_per_mark != 0) {
        window.alert("出價需為目前價格加上每標底價的整數倍");
        return false;
    }
    window.alert("true");
    return true;
}