import os
import uuid
from django.conf import settings
from django.db.models.fields.json import json
from django.http import HttpResponse
from django.http.response import JsonResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from questions.models import Image


@require_http_methods(['POST'])
@csrf_exempt
def upload_question_image(request):
    image = request.FILES.get('file[]', None)
    filename = image.name
    uuid_name = f"{uuid.uuid4()}_{filename}"
    image.name = uuid_name
    photo = Image.objects.create(photo=image)

    return JsonResponse(
        {
            "msg": "Success!",
            "code": 0,
            "data": {
                "errFiles": [],
                "succMap": {
                    filename: os.path.join(settings.MEDIA_URL, photo.photo.url),
                }
            }
        }
    )
