import os
import sys
import enum
import django
import datetime
import pyrebase
from django.http import JsonResponse
from django.shortcuts import render, redirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from . import firestore_ops

config = {
    "apiKey": "AIzaSyCF_Q4YD_W7FWb40pDU-NHW0ooYsnJWDUM",
    "authDomain": "auction-system-73960.firebaseapp.com",
    "databaseURL": "https://auction-system-73960.firebaseio.com",
    "projectId": "auction-system-73960",
    "storageBucket": "auction-system-73960.appspot.com",
    "messagingSenderId": "650872511305",
    "appId": "1:650872511305:web:8afe3f2f1c33b4f6"
}

firebase = pyrebase.initialize_app(config)
auth = firebase.auth()
storage = firebase.storage()

class ProductStatus(enum.IntEnum):
    Removed = -1
    Onsale = 0
    Bidding = 1
    Dealing = 2
    Seller_Done = 3
    Buyer_Done = 4
    Done = 5

def _getUserId(idToken):
    user = auth.get_account_info(idToken)
    user_id = user['users'][0]['localId']
    return user_id

def _checkIdToken(request):
    """
        Returns:
            (bool): check whether idToken exist
                exist => True
                doesn't exist => False
    """
    try:
        idToken = request.session['idToken']
        user = auth.get_account_info(idToken)
        return True
    except:
        request.session['idToken'] = ''
    return False

def _checkUserInfoCompleteness(idToken):
    try:
        user_id = _getUserId(idToken)
        return firestore_ops.checkUserInfoCompleteness(user_id)
    except Exception as e:
        print(e)
    return False

def _imageSaveAndUpload(filename, image, idToken):
    path = '../.tmp/'
    with open(os.path.join(path, filename), 'wb+') as file:
        for chunk in image.chunks():
            file.write(chunk)
    storage.child(filename).put(os.path.join(path, filename), idToken)
    return storage.child(filename).get_url(idToken)

def _hashProduct(product):
    """
        Args:
            product (dict): product info
        Returns:
            product_id (str): if product info isn't False, concat with str type and hash
    """
    s = ''.join(map(lambda x: str(x) if x else '', product.values()))
    product_id = hash(s)
    if product_id < 0:
        product_id += sys.maxsize
    return str(product_id)

def _datetime2FrontendFormat(time):
    """
        Args:
            time (datetime): %Y-%m-%d %H:%M:%S (yyyy-mm-dd HH:MM:SS)
        Returns:
            (str): %Y-%m-%dT%H:%M (yyyy-mm-ddTHH:MM)
    """
    return 'T'.join(str(time.strftime('%Y-%m-%d %H:%M')).split())

def _frontendFormat2Datetime(time):
    """
        Args:
            time (str): %Y-%m-%dT%H:%M (yyyy-mm-ddTHH:MM)
        Returns:
            (datetime): %Y-%m-%d %H:%M (yyyy-mm-dd HH:MM)
    """
    return datetime.datetime.strptime(' '.join(time.split('T')), '%Y-%m-%d %H:%M')

def _parseItems(items):
    """
        Args:
            items (list): items in user database
                element: {
                    id
                }
                possible items: {
                    tracking_items,
                    bidding_items,
                    dealing_items,
                    done_items,
                    onsale_items
                }
        Returns:
            items (list): items in user database
                element: {
                    product_name,
                    id,
                    images
                }
                images (list): contains product images' url
    """
    for i in range(len(items)):
        product = firestore_ops.getProduct(items[i])
        items[i] = firestore_ops.getProductBasicInfo(product)
    return items

def _updateUserRate(user, score):
    user_rate = (user['rate'] * user['count'] + score) / (user['count'] + 1)
    user_count = user['count'] + 1
    return {'rate': user_rate, 'count': user_count}

def _changeUserItems(user_id, product_id, unlink_items, link_items):
    firestore_ops.unlinkProductFromUser(user_id, product_id, list_name = unlink_items)
    firestore_ops.linkProductToUser(user_id, product_id, list_name = link_items)

def _product2DoneStatus(product_id, seller, buyer):
    firestore_ops.transferProductStatus(product_id, ProductStatus.Done.value)
    _changeUserItems(seller, product_id, 'dealing_items', 'done_items')
    _changeUserItems(buyer, product_id, 'dealing_items', 'done_items')

def _userWithoutIdToken(user_id):
    user = firestore_ops.getUserInfo(user_id)
    del user['idToken']
    return user

def index(request):
    products = []
    try:
        origin_products = firestore_ops.getNProductsBasicInfo(100)
        for product in origin_products:
            status = product['status']
            if status == ProductStatus.Onsale or status == ProductStatus.Bidding:
                products.append(product)
    except Exception as e:
        print(e)
    return render(request, 'index.html', {'products': products})

def search(request, keyword):
    try:
        products = firestore_ops.searchProducts(keyword, 100)
    except Exception as e:
        print(e)
    return render(request, 'Search.html', {'products': products})

def signIn(request):
    if _checkIdToken(request) and _checkUserInfoCompleteness(request.session['idToken']):
        return redirect(index)
    return render(request, 'SignIn.html')

def preSignUp(request):
    if _checkIdToken(request) and _checkUserInfoCompleteness(request.session['idToken']):
        return redirect(index)
    return render(request, 'pre-SignUp.html')

def signUp(request):
    if not _checkIdToken(request):
        return redirect(signIn)
    if _checkUserInfoCompleteness(request.session['idToken']):
        return redirect(index)
    return render(request, 'SignUp.html')

def postSignUp(request):
    if not _checkIdToken(request):
        return redirect(signIn)
    if _checkUserInfoCompleteness(request.session['idToken']):
        return redirect(index)

    idToken  = request.session['idToken']
    user_id = _getUserId(idToken)

    user_info = firestore_ops.createUserDict()

    user_info['user_name'] = request.POST['user_name']
    user_info['phone'] = request.POST['phone']
    user_info['address'] = request.POST['address']
    user_info['contact'] = request.POST['contact']
    user_info['email'] = request.POST['email']
    user_info['tp_info']['provider'] = request.POST['provider']
    user_info['tp_info']['uid'] = request.POST['uid']
    user_info['idToken'] = idToken

    firestore_ops.createNewUser(user_id, user_info)

    return HttpResponse('create new user success')

def trade(request, product_id):
    if (not _checkIdToken(request)) or (not _checkUserInfoCompleteness(request.session['idToken'])):
        return redirect(signIn)

    user_id = _getUserId(request.session['idToken'])

    product = firestore_ops.getProduct(product_id)
    status = product['status']

    if status == ProductStatus.Dealing or status == ProductStatus.Seller_Done or status == ProductStatus.Buyer_Done:
        if user_id == product['seller'] or user_id == product['highest_buyer_id']:
            now_user = {'user': ''}
            if user_id == product['seller']:
                now_user['user'] = 'seller'
            if user_id == product['highest_buyer_id']:
                now_user['user'] = 'buyer'

            product['create_time'] = _datetime2FrontendFormat(product['create_time'])
            product['deadline'] = _datetime2FrontendFormat(product['deadline'])

            seller_info = _userWithoutIdToken(product['seller'])
            buyer_info = _userWithoutIdToken(product['highest_buyer_id'])

            return render(request,'Trade.html', {'buyer': buyer_info, 'seller': seller_info, 'now_user': now_user, 'product': product})
    return redirect(memberCenter)

def memberCenter(request):
    if (not _checkIdToken(request)) or (not _checkUserInfoCompleteness(request.session['idToken'])):
        return redirect(signIn)

    user_id = _getUserId(request.session['idToken'])
    user_info = _userWithoutIdToken(user_id)
    user_info['tracking_items'] = _parseItems(user_info['tracking_items'])
    user_info['bidding_items'] = _parseItems(user_info['bidding_items'])
    user_info['dealing_items'] = _parseItems(user_info['dealing_items'])
    user_info['done_items'] = _parseItems(user_info['done_items'])
    user_info['onsale_items'] = _parseItems(user_info['onsale_items'])
    return render(request, 'MemberCenter.html', {'user': user_info})

def updateUserInfo(request):
    if (not _checkIdToken(request)) or (not _checkUserInfoCompleteness(request.session['idToken'])):
        return redirect(signIn)

    user_id = _getUserId(request.session['idToken'])

    user_data = firestore_ops.createUserDict()
    user_data['user_name'] = request.POST['user_name']
    user_data['phone'] = request.POST['phone']
    user_data['address'] = request.POST['address']
    user_data['contact'] = request.POST['contact']

    firestore_ops.updateUserInfo(user_id, user_data)

    return redirect(memberCenter)

def product(request, product_id):
    product = firestore_ops.getProduct(product_id)
    status = product['status']
    if status == ProductStatus.Onsale or status == ProductStatus.Bidding:
        user_id = ''
        if _checkIdToken(request):
            user_id = _getUserId(request.session['idToken'])

        isSeller = (user_id == product['seller'])

        product['create_time'] = _datetime2FrontendFormat(product['create_time'])
        product['deadline'] = _datetime2FrontendFormat(product['deadline'])
        seller = _userWithoutIdToken(product['seller'])
        product['seller'] = seller['user_name']

        if product['highest_buyer_id'] != '':
            highest_buyer = firestore_ops.getUserInfo(product['highest_buyer_id'])
            product['highest_buyer_id'] = highest_buyer['user_name']

        return render(request, 'Product.html', {'product': product, 'seller': seller, 'isSeller': isSeller})
    return redirect(index)

def bidProduct(request):
    if (not _checkIdToken(request)) or (not _checkUserInfoCompleteness(request.session['idToken'])):
        return redirect(signin)

    user_id = _getUserId(request.session['idToken'])

    product_id = request.POST['id']
    current_price = request.POST['current_price']

    origin_product = firestore_ops.getProduct(product_id)
    status = origin_product['status']

    if status == ProductStatus.Onsale or status == ProductStatus.Bidding:
        product_data = {}

        product_data['highest_buyer_id'] = user_id
        product_data['current_price'] = current_price

        firestore_ops.updateProduct(product_id, product_data)
        firestore_ops.linkProductToUser(user_id, product_id, list_name = 'bidding_items')
        firestore_ops.transferProductStatus(product_id, ProductStatus.Bidding.value)

        origin_product = firestore_ops.getProduct(product)

        if current_price == origin_product['price']:
            seller = origin_product['seller']
            _changeUserItems(seller, prodcut_id, 'onsale_items', 'dealing_items')
            return redirect(trade, product_id)

        return redirect(product, product_id)
    return redirect(index)

def purchaseProduct(request):
    if (not _checkIdToken(request)) or (not _checkUserInfoCompleteness(request.session['idToken'])):
        return redirect(signin)

    user_id = _getUserId(request.session['idToken'])

    product_id = request.POST['id']

    origin_product = firestore_ops.getProduct(product_id)
    status = origin_product['status']

    if status == ProductStatus.Onsale:
        product_data = {}

        product_data['highest_buyer_id'] = user_id
        product_data['current_price'] = origin_product['price']

        firestore_ops.updateProduct(product_id, product_data)
        firestore_ops.transferProductStatus(product_id, ProductStatus.Dealing.value)
        firestore_ops.linkProductToUser(user_id, product_id, list_name = 'dealing_items')

        seller = firestore_ops.getProduct(product_id)['seller']
        _changeUserItems(seller, product_id, 'onsale_items', 'dealing_items')

        return redirect(trade, product_id)
    return redirect(index)

def setProductQuestion(request):
    product_id = request.POST['id']
    question = request.POST['question']

    product_data = {'qas': []}
    product_data['qas'].append({'question': question, 'answer': ''})

    firestore_ops.updateProduct(product_id, product_data)

    return redirect(product, product_id)

def setProductAnswer(request):
    product_id = request.POST['id']
    question_index = int(request.POST['question_index'])
    answer = request.POST['answer']

    origin_product = firestore_ops.getProduct(product_id)

    product_data = {}
    product_data['qas'] = []

    product_data['qas'].append(origin_product['qas'][question_index])
    firestore_ops.updateProduct(product_id, product_data, firestore_ops.ArrayOps.DELETE)

    product_data['qas'][0]['answer'] = answer
    firestore_ops.updateProduct(product_id, product_data)

    return redirect(product, product_id)

def toSell(request):
    if (not _checkIdToken(request)) or (not _checkUserInfoCompleteness(request.session['idToken'])):
        return redirect(signIn)
    return render(request, 'ToSell.html')

def postToSell(request):
    if (not _checkIdToken(request)) or (not _checkUserInfoCompleteness(request.session['idToken'])):
        return redirect(signIn)

    product = firestore_ops.createProductDict()

    user_id = _getUserId(request.session['idToken'])

    product['product_name'] = request.POST['product_name']
    product['category'] = request.POST['category']
    product['trading_type'] = int(request.POST['trading_type'])
    product['price'] = request.POST['price']
    product['current_price'] = request.POST['current_price']
    product['price_per_mark'] = request.POST['price_per_mark']
    product['description'] = request.POST['description']
    product['trading_method'] = request.POST['trading_method']
    product['deadline'] = _frontendFormat2Datetime(request.POST['deadline'])
    product['seller'] = user_id
    product['id'] = _hashProduct(product)

    image = request.FILES['image']
    filename = product['id'] + '_' + str(len(product['images'])) + '.' + image.name.split('.')[-1]
    image_url = _imageSaveAndUpload(filename, image, request.session['idToken'])

    product['images'].append(image_url)

    try:
        firestore_ops.addProduct(user_id, product['id'], product)
        firestore_ops.linkProductToUser(user_id, product_id, list_name = 'onsale_items')
    except Exception as e:
        print(e)

    return redirect(memberCenter)

def signOut(request):
    request.session['idToken'] = ''
    django.contrib.auth.logout(request)
    return render(request, 'SignOut.html')

@csrf_exempt
def searchProduct(request):
    keyword = request.POST['keyword']
    return HttpResponse('/search/' + keyword)

@csrf_exempt
def postProductId2Product(request):
    product_id = request.POST['id']
    return HttpResponse('/product/' + product_id)

@csrf_exempt
def postProductId2Trade(request):
    product_id = request.POST['id']
    return HttpResponse('/trade/' + product_id)

@csrf_exempt
def checkUserStatus(request):
    status = _checkIdToken(request) and _checkUserInfoCompleteness(request.session['idToken'])
    return JsonResponse({'status': status})

@csrf_exempt
def getUserName(request):
    user_name = ''
    if _checkIdToken(request):
        user_id = _getUserId(request.session['idToken'])
        try:
            user_name = firestore_ops.getUserInfo(user_id)['user_name']
        except Exception as e:
            print(e)
    return HttpResponse(user_name)

@csrf_exempt
def getCategory(request):
    category = ['3C', '家具', '運動', '服飾', '娛樂', '精品', '交通工具', '生活用品', '食品', '書籍', '鞋子', '音樂', '電玩', '動漫', '其他']
    return HttpResponse(','.join(category))

@csrf_exempt
def setSession(request):
    try:
        idToken = request.POST['idToken']
        request.session['idToken'] = idToken
        return JsonResponse({'status': True})
    except Exception as e:
        print(e)
    return JsonResponse({'status': False})

@csrf_exempt
def checkUserData(request):
    status = False
    if _checkIdToken(request):
        status = _checkUserInfoCompleteness(request.session['idToken'])
    return JsonResponse({'status': status})

@csrf_exempt
def setTrackingProduct(request):
    if _checkIdToken(request):
        user_id = _getUserId(request.session['idToken'])
        product_id = request.POST['id']
        try:
            firestore_ops.linkProductToUser(user_id, product_id, list_name = 'tracking_items')
            return JsonResponse({'status': True})
        except Exception as e:
            print(e)
    return JsonResponse({'status': False})

@csrf_exempt
def completeTrade(request):
    if (not _checkIdToken(request)) or (not _checkUserInfoCompleteness(request.session['idToken'])):
        return HttpResponse('/signin/')

    product_id = request.POST['id']
    score = int(request.POST['score'])

    user_id = _getUserId(request.session['idToken'])
    product = firestore_ops.getProduct(product_id)

    update_user_id = ''
    user_data = {}

    if user_id == product['seller']:
        update_user_id = product['highest_buyer_id']
        user = firestore_ops.getUserInfo(update_user_id)
        user_data['buyer_rate'] = _updateUserRate(user['buyer_rate'], score)

        if product['status'] == ProductStatus.Buyer_Done:
            _product2DoneStatus(product_id, product['seller'], product['highest_buyer_id'])
        else:
            firestore_ops.transferProductStatus(product_id, ProductStatus.Seller_Done.value)

    if user_id == product['highest_buyer_id']:
        update_user_id = product['seller']
        user = firestore_ops.getUserInfo(update_user_id)
        user_data['seller_rate'] = _updateUserRate(user['seller_rate'], score)

        if product['status'] == ProductStatus.Seller_Done:
            _product2DoneStatus(product_id, product['seller'], product['highest_buyer_id'])
        else:
            firestore_ops.transferProductStatus(product_id, ProductStatus.Buyer_Done.value)

    firestore_ops.updateUserInfo(update_user_id, user_data)

    return HttpResponse('/index/')
