import sys
import django
import datetime
import pyrebase
import firebase_admin
from django.shortcuts import render, redirect
from firebase_admin import credentials, firestore
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

def index(request):
    products = firestore_ops.getProductBasicInfo()
    return render(request, 'index.html', {'products': products})

def toSell(request):
    return render(request, 'ToSell.html')

def postToSell(request):
    product = {}
    # read image
    product['product_name'] = request.POST.get('product_name')
    product['trading_type'] = request.POST.get('trading_type')
    product['price'] = request.POST.get('price')
    product['current_price'] = request.POST.get('current_price')
    product['price_per_mark'] = request.POST.get('price_per_mark')
    product['category'] = request.POST.get('category')
    product['description'] = request.POST.get('description')
    product['trading_method'] = request.POST.get('trading_method')
    product['deadline'] = request.POST.get('deadline')

    s = ('').join(product.values()) + str(datetime.datetime.now())
    product_id = hash(s)
    if product_id < 0:
        product_id += sys.maxsize

    idToken = request.session['idToken']
    user = auth.get_account_info(idToken)
    user_id = user['users'][0]['localId'] # user collection's document id

    # store to database
    try:
        firestore_ops.addProduct(user_id, product_id, product)
    except Exception as e:
        print(e)
        print('firestore_ops.addProduct error')
    
    return redirect(toSell)