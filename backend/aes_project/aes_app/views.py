from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import base64
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes


# AES-128 requires a 16-byte key
def get_aes_cipher(key, iv):
    key = key.ljust(16)[:16].encode('utf-8')  # Ensure key is exactly 16 bytes
    return AES.new(key, AES.MODE_CBC, iv)


@csrf_exempt
def encrypt(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            text = data.get('text', '')
            key = data.get('key', '')

            iv = get_random_bytes(16)  # Generate a random IV
            cipher = get_aes_cipher(key, iv)
            encrypted_bytes = cipher.encrypt(pad(text.encode(), AES.block_size))
            encrypted_text = base64.b64encode(iv + encrypted_bytes).decode('utf-8')  # Prepend IV

            return JsonResponse({'encrypted_text': encrypted_text})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)


@csrf_exempt
def decrypt(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            encrypted_text = data.get('encrypted_text', '')
            key = data.get('key', '')

            decoded_data = base64.b64decode(encrypted_text)
            iv, encrypted_bytes = decoded_data[:16], decoded_data[16:]  # Extract IV
            cipher = get_aes_cipher(key, iv)
            decrypted_bytes = unpad(cipher.decrypt(encrypted_bytes), AES.block_size)
            decrypted_text = decrypted_bytes.decode('utf-8')

            return JsonResponse({'decrypted_text': decrypted_text})
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)
    return JsonResponse({'error': 'Invalid request'}, status=400)