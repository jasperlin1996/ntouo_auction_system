import django
import pyrebase
import json
from django.shortcuts import render, redirect



def index(request):
    return render(request, 'index.html')
