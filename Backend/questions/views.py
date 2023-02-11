import os
import uuid
from django.conf import settings
from django.core.exceptions import ValidationError
from django.db.models.fields.json import json
from django.http import HttpResponse
from django.http.response import JsonResponse
from django.views.decorators.http import require_http_methods
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from questions.models import Image


def validate_image_extension(value):
    ext = os.path.splitext(value.name)[1]
    valid_extensions = [".jpg", ".jpeg", ".png"]
    if not ext.lower() in valid_extensions:
        raise ValidationError(
            f'Unsupported file extension. Supported formats: {",".join(valid_extensions)}'
        )


@require_http_methods(["POST"])
@csrf_exempt
def upload_question_image(request):
    image = request.FILES.get("file[]", None)
    try:
        validate_image_extension(image)
        filename = image.name
        uuid_name = f"{uuid.uuid4()}_{filename}"
        image.name = uuid_name
        photo = Image.objects.create(photo=image)

        if settings.DEBUG:
            return JsonResponse(
                {
                    "msg": "Success!",
                    "code": 0,
                    "data": {
                        "errFiles": [],
                        "succMap": {
                            filename: os.path.join(settings.MEDIA_URL, photo.photo.url),
                        },
                    },
                }
            )
        else:
            return JsonResponse(
                {
                    "msg": "Success!",
                    "code": 0,
                    "data": {
                        "errFiles": [],
                        "succMap": {
                            filename: photo.photo.url,
                        },
                    },
                }
            )
    except ValidationError as error:
        return JsonResponse(
            {
                "msg": error,
                "code": 1,
                "data": {
                    "errFiles": [image],
                },
            }
        )
