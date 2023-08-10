import os
import uuid
from django.core.exceptions import ValidationError
from django.http.response import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from questions.models import Image


def validate_image(image):
    filesize = image.size
    ext = os.path.splitext(image.name)[1]
    valid_extensions = [".jpg", ".jpeg", ".png"]
    if not ext.lower() in valid_extensions:
        raise ValidationError(
            f'Unsupported file extension. Supported formats: {",".join(valid_extensions)}'
        )
    megabyte_limit = 2
    if filesize > megabyte_limit*1024*1024:
        raise ValidationError("Max file size is %sMB" % str(megabyte_limit))


@require_http_methods(["POST"])
@csrf_exempt
def upload_question_image(request):
    image = request.FILES.get("file[]", None)
    try:
        validate_image(image)
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
                        filename: photo.photo.url,
                    },
                },
            }
        )

    except ValidationError as error:
        return JsonResponse(
            {
                "msg": error.message,
                "code": 1,
                "data": {
                    "errFiles": [image.name],
                    "succMap": []
                },
            }
        )
