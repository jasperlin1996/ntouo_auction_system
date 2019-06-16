
$('#buyer').html(buyer.user_name + "(買家)");
$('#buyer-address').html("<i class='glyphicon glyphicon-map-marker'></i>" + buyer.address);
$('#buyer-email').html("<i class='glyphicon glyphicon-envelope'></i>" + buyer.email);
$('#buyer-phone').html("<i class='glyphicon glyphicon-phone'></i>" + buyer.phone);
$('#buyer-contact').html("<i class='glyphicon glyphicon-list-alt'></i>" + buyer.contact);

$('#product-name').html(product.product_name + "(商品)");
$('#product-url').attr("src", product.images[0]);
$('#product-price').html("<i class='glyphicon glyphicon-usd'></i>" + product.price);
$('#product-method').html("<i class='glyphicon glyphicon-thumbs-up'></i>" + product.trading_method);
$('#product-category').html("<i class='glyphicon glyphicon-inbox'></i>" + product.category);
if(product.status == 0)
  $('#product-status').html("<i class='glyphicon glyphicon-tag'></i>待出售");
if(product.trading_type == 0)
  $('#product-type').html("<i class='glyphicon glyphicon-tag'></i>直購");
$('#product-description').html("<i class='glyphicon glyphicon-comment'></i>" + product.description);



$('#seller').html(seller.user_name + "(賣家)");
$('#seller-address').html("<i class='glyphicon glyphicon-map-marker'></i>" + seller.address);
$('#seller-email').html("<i class='glyphicon glyphicon-envelope'></i>" + seller.email);
$('#seller-phone').html("<i class='glyphicon glyphicon-phone'></i>" + seller.phone);
$('#seller-contact').html("<i class='glyphicon glyphicon-list-alt'></i>" + seller.contact);


var score;
load();

function evaluateProduct()  //給予評價分數
{
  score = window.prompt("請輸入對於這次交易的評分(請填入0~5分)","3");
  var test = /^[0-5]/;
  if(!test.test(score))
    window.alert("評分未完成，請重新輸入");
  else
  {
    $("#complete").prop('disabled',false);
    $("#evaluate").prop('disabled',true);
  }
}


function completeTrade() //完成評價
{
  $('#dialog').dialog({
      modal: false,
      resizable: false,
      draggable: false,
      closeOnEscape:true,
      width: 500,
      height:300,
    });
  $("#complete").prop('disabled',true);
  setTimeout(function(){
    console.log("start");
    $.ajax(
    {
      url:"/completetrade/",
      type:'POST',
      data:{"score":score, 'id': product.id},
      cache:false,
      async:false,
      success:function(response)
      {
        location.href = response;
      }
    });
  },1000);

}

function load()   //判斷是否評價過
{
  if(product.status == 3 &&　now_user.user == "seller") {
    $("#complete").prop('disabled',true);
    $("#evaluate").prop('disabled',true);
  }

  if(product.status == 4 &&　now_user.user == "buyer") {
    $("#complete").prop('disabled',true);
    $("#evaluate").prop('disabled',true);
  }
}
