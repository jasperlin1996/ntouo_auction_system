window.onload = load;

function load() {
    var url = location.href;
    if (url.indexOf('?')==-1) {
        alert("無商品");
        window.history.back();
    }
    else {
        var array = url.split('?');
        var id = array[1];

        if ({{ request.session.idToken }} != info.saler) {
            alert("非販賣者無法修改!");
            window.history.back();
        }
        else {
            str = '<form><table><tr><td>圖片:</td><td><img id="image" src="' + info.image + '"><br><input id="Inputimg" name="image" type="file" accept="image/jpeg, image/png"></td></tr>';
            str += '<tr><td>名稱:</td><td><input name="product_name" type="text" value="' + info.product_name  + '" readonly></td></tr>';
            str += '<tr><td>直購/拍賣:';
            if (info.type == 0) { // 拍賣
                str += '拍賣</td><td>';
                str += '<input id="sell" type="radio" name="buuStyle readonly"/>直購';
                str += '<input id="sale" type="radio" name="buyStyle" checked="true" readonly/>拍賣';
                str += '</td></tr>';
                
                str += '<tr><td>直購價:</td><td><input id="price" type="text" value="' + info.price + '元" readonly></td></tr>';
                str += '<tr><td>底價:</td><td><input id="current_price" type="text" value"' + info.current_price + '元" readonly></td></tr>';
                str += '<tr><td>每標底價:</td><td>';
                str += info.price_per_mark;
            }
            else { // 直購
                str += '直購</td><td>';
                str += '<input id="sell" type="radio" name="buuStyle" checked="true"/>直購';
                str += '<input id="sale" type="radio" name="buyStyle"/>拍賣';
                str += '</td><tr><tr><td>直購價:</td><td>';
                str += info.price;
                str += '元</td>';
            }
            str += '<tr><td>分類:</td><td><input type="text" name="catagory" value="' + info.catagory + '" readonly></td></tr>';
            str += '<tr><td>敘述:</td><td><input type="text" name="description" value="' + info.description + '"></td></tr>';
            str += '<tr><td>希望交易方式:</td><td><input type="text" name="trading_method" value="' + info.trading_method + '"></tr>';
            str += '<tr><td>結標日期:</td><td><input type="datetime-local" name="deadline" value="' + info.deadline + '" readonly></td></tr>';
            str += '<tr><td></td><td>';
            str += '<input type="submit" value="確認修改">';
            str += '<a href="../templates/MemberCenter.html"><input type="button" onclick="cancel()" value="取消"></a>';
            str += '</td></tr></table></form>';
            document.getElementById("content").innerHTML = str;
        //}
    }

    // for realtime render upload image
    $('#Inputimg').change(function(){
        readURL(this);
    });
    
    function readURL(input){
        if(input.files && input.files[0]){
            var reader = new FileReader();
            reader.onload = function (e) {
                $("#image").attr('src', e.target.result);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }
}