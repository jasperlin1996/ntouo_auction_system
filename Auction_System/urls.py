"""Auction_System URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.conf.urls import url
from . import views

urlpatterns = [
    # path('admin/', admin.site.urls),
    path('', views.index, name = 'index'),
    path('signin/', views.signIn, name = 'signin'),
    path('presignup/', views.preSignUp, name = 'pre-signup'),
    path('signup/', views.signUp, name = 'signup'),
    path('postsignup/', views.postSignUp, name = 'post-signup'),
    path('tosell/', views.toSell, name = 'to-sell'),
    path('posttosell/', views.postToSell, name = 'post-to-sell'),
    path('setsession/', views.setSession, name = 'set-session'),
    path('signout/',views.signOut,name = 'signout'),
]
