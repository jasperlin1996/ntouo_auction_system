import json
import django
import pyrebase
import firebase_admin
from django.shortcuts import render, redirect
from firebase_admin import credentials, firestore

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
    return render(request, 'index.html')
