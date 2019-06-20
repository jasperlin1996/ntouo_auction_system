
var page = document.getElementById("page");
var wid = $(window).width();
var hei = $(window).height();
var pageWidth;
var product_count = 0;
var goodID = "good_ID";

/*
    add history to cookie
    title 商品標題
    picUrl 圖片網址
    ID 商品ID
*/
//Add Viewing History to Cookie
function addHistory(ID) {

    
    var historyAmount = parseInt(getCookieByName("history_amount"));
    //window.alert("ID:" + ID);
    //console.log(historyAmount);
    
    if (historyAmount < 1 || historyAmount != historyAmount) {
        document.cookie = goodID + "=" + ID + "; path=/";
        document.cookie = "history_amount=1; path=/";
    }

    else {
        var IDs = getCookieByName(goodID);
        var IDArray = IDs.split(",");
        if (IDArray.includes(ID))
        {
            //console.log("Same in :"+historyAmount);
            deleteHistory(IDArray.indexOf(ID));
            historyAmount = parseInt(getCookieByName("history_amount"));
            IDs = getCookieByName(goodID);
            //console.log("Same out :" + historyAmount);
        }
        if(historyAmount>=20)
        {
            //console.log("Over in :" + historyAmount);
            deleteHistory(historyAmount);
            historyAmount = parseInt(getCookieByName("history_amount"));
            IDs = getCookieByName(goodID);
            //console.log("Over out :" + historyAmount);
        }
        document.cookie = goodID + "=" + ID + "," + IDs + "; path=/;";
        document.cookie = "history_amount=" + String(historyAmount + 1) + "; path=/;";
        console.log("history amount(ADD fun):" + getCookieByName("history_amount"));
    }
    return;
}

/*
    Get History From Cookie

*/

function getHistory()
{
    
    var historyAmount = parseInt(getCookieByName("history_amount"));
    console.log(historyAmount);
    if (historyAmount < 1 || historyAmount != historyAmount)
    {
        console.log("No Viewing History");
        return;
    }
    var history_goods = getCookieByName(goodID).split(',');
    for (i = 0; i < historyAmount;i++)
    {   
        console.log(history_goods[i]);
    }    
    return history_goods;
}

function displayHistory()
{
    //  loading
    $("#loader").show();
    $("#loadspace").css("display", "block");
    isLoading = true;
    $("#row").html("<div id='blank1' class='col-md-12'></div><div class='col-md-1'></div>");
    
    var historyAmount = parseInt(getCookieByName("history_amount"));
    if (historyAmount < 1 || historyAmount != historyAmount)
    {
        //window.alert("Go View Something!");
        $("#row").append("<div id='blank1' class='col-md-12'><h2>瀏覽記錄</h2></div><div class='col-md-1'></div>");
        $("#row").append("<div id='blank1' ' class='col-md-12'><h4>無瀏覽記錄<h4></div><div class='col-md-1'>");
        start();
        mychangeblankCSS();
        return;
    }
    $("#row").append("<div id='blank1' class='col-md-12'><h2>瀏覽記錄<i title='刪除所有瀏覽記錄' class='fas fa-dumpster'></i></h2></div><div class='col-md-1'></div>");
    
    var products;
    var history = getHistory();
    console.log('history');
    console.log(history);
    $.ajax({
        url: '/product2history/',
        type: 'POST',
        data: {'products_id': history},
        cache: false,
        async: false,
        success: function(response) {
            console.log('here');
            console.log(response);
            products = response.products;
        }
    });

    console.log(products);
    
    
     for (var i = 0; i < historyAmount; i++) {
         if (product_count == 2) {
             $("#row").append("<div class='col-md-1'></div><div class='col-md-1'></div>");
             product_count = 0;
         }
         product_count++;
         if (i == historyAmount - 1)
             $("#row").append("<div class='col-md-5' id='history_square'><img onload='start()' id='" + products[i].id + "' src='" + products[i].images[0] + "' %}' class='img-thumbnail img' alt=" + products[i].product_name + "><p>" + products[i].product_name + "</p><span title='刪除" + products[i].product_name + "' class='fas fa-trash' num=" + i + "></span></div>");
         else
             $("#row").append("<div class='col-md-5' id='history_square'><img id='" + products[i].id + "' src='" + products[i].images[0] + "' %}' class='img-thumbnail img' alt=" + products[i].product_name + "><p>" + products[i].product_name + "</p><span title='刪除" + products[i].product_name + "' class='fas fa-trash' num=" + i + "></span></div>");
     }
     $("#row").append("<div id='blank2' class='col-md-12'></div>");
    mychangeblankCSS();
    //Delet selected history
    $('.fa-trash').on('mousedown', function () {
        deleteHistory(parseInt($(this).attr("num")));
        $("#row").html("");
        window.location.reload();
    });
    $('.fa-dumpster').on('mousedown', function () {
        killAllHistory();
        window.location.reload();
    });
    //按下商品post
    $('.col-md-5').on('mousedown', function () {
        var myproductid = $(this).children()[0].id;
        //window.alert("title:" + mytitle);
        addHistory(myproductid);
        $.ajax(
            {
                url: "/postproductid2product/",
                type: 'POST',
                data: { 'id': myproductid },
                cache: false,
                async: false,
                success: function (response) {
                    location.href = response;
                }
            });
    });
}

//delete specific history cookie
function deleteHistory(number)
{
   
    var historyAmount = parseInt(getCookieByName("history_amount"));
    if (number >= historyAmount)
    {
        console.log("nothing to Delete");
        return;
    }
    var history_goods = new Array();
        history_goods = getHistory();
        history_goods.splice(number, 1);
        document.cookie = goodID + "=" + history_goods + "; path=/";
        document.cookie = "history_amount=" + String(historyAmount - 1) + "; path=/;";
    console.log("deleted");
    //displayHistory();
}

function killAllHistory() 
{
    document.cookie = goodID + "=; expires=Sun, 10 Dec 1995 01:00:00 GMT";
    document.cookie = "history_amount=0; path=/";
}

//get cookie through cookie name
function getCookieByName(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) {
            var bingan = c.substring(name.length, c.length);
            //window.alert(bingan);
            return bingan;
        }
    }
    return "";
}

//換新頁面blank 的 css
function mychangeblankCSS() {
    if ($(window).width() > 1040) {
        $("#blank1").css('height', hei * 0.1 + "px");
        $("#blank2").css('height', hei * 0.1 + "px");
    } else {
        $("#blank1").css('height', hei * 0.12 + "px");
        $("#blank2").css('height', hei * 0.12 + "px");
    }
}

//變更視窗大小時
$(function () {
    $(window).resize(function () {
        wid = $(window).width();
        page.style.left = (wid / 2) - (pageWidth / 2) + "px";
        mychangeblankCSS();

    }).resize()
});
