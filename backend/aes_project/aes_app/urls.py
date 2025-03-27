from django.urls import path
from .views import encrypt, decrypt

urlpatterns = [
    path('encrypt/', encrypt, name='encrypt'),
    path('decrypt/', decrypt, name='decrypt'),
]
