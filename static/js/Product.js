window.onload = load;

function load() {
    var canChange = 0;
    var url = location.href;
    if(url.indexOf('?')==-1) {
        alert("無商品!");
        window.history.back();
    }
    else {
        var array = url.split('?');
        var id = array[1];

        if (url.indexOf('&')!=-1) {
            canChange = 1;
        }
        
        if ({{ request.session.idToken }} == info.saler) {
            canChange = 1;
        }

        var str = '';
        str += '<table><tr><td>圖片:</td><td><img src="';
        str += info.image
        str += '"></td></tr><tr><td>名稱:</td><td>';
        str += info.product_name;
        str += '</td></tr><td>狀態:</td><td>';
        
        if (info.status == 0) {
            str += '待出售';
        }
        else if (info.status == 1) {
            str += '競標中';
        }
        else if (info.status == 2) {
            str += '交易中';
        }
        else if (info.status == 3) {
            str += '已賣出';
        }
        else {
            str += '已下架';
        }
        
        str += '</td></tr><tr><td>直購/拍賣:</td><td>';
        if (info.type == 0) { // 拍賣
            str += '拍賣</td></tr><tr><td>直購價:</td><td>';
            str += info.price;
            str += '元</td></tr><tr><td>底價:</td><td>';
            str += info.current_price;
            str += '元</td></tr><tr><td>每標底價:</td><td>';
            str += info.price_per_mark;
        }
        else { // 直購
            str += '直購</td><tr><tr><td>直購價:</td><td>';
            str += info.price;
            str += '元</td></tr>';
        }
        str += '<tr><td>分類:</td><td>';
        str += info.catagory;
        str += '</td></tr><tr><td>敘述:</td><td>';
        str += info.description;
        str += '</td></tr><tr><td>希望交易方式:</td><td>';
        str += info.trading_method
        str += '</td></tr><tr><td>結標日期:</td><td>';
        str += info.deadline
        if (canChange == 1) {
            str += '</td></tr><tr><td></td><td>';
            str += '<a href="../templates/Modify.html?' + id + '"><input type="button" value="修改"></a>';
        }
        else {
            str += '</td></tr><tr><td></td><td>';
            str += '<input type="button" onclick="bid()" value="出價">';
            str += '<input type="button" onclick="buy()" value="直接購買">';
        }
        str += '</td></tr></table>';
        document.getElementById("content").innerHTML = str;
    }
}

// 出價
function bid() {

}

// 直購
function buy() {

}