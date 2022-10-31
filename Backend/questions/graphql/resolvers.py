from questions.graphql.types import QuestionType
from questions.models import Question


def resolve_tutorial_anchors(
    info: Info, filters: Optional[TutorialAnchorFilter] = None
) -> List[TutorialAnchorType]:
    # TODO privilege check
    return TutorialAnchor.objects.all()

