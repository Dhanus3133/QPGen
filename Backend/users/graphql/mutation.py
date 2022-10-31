from gqlauth.core.directives import TokenRequired
import strawberry
from gqlauth.core.field_ import field
from gqlauth.user import relay as mutations
from gqlauth.user.arg_mutations import Captcha
from typing import Optional, Union
from gqlauth.core.types_ import GQLAuthError

from strawberry.django import auth

from users.graphql.types import UserType

@strawberry.type
class AuthMutation:
    # include here your mutations that interact with a user object from a token.

    verify_token = mutations.VerifyToken.field
    update_account = mutations.UpdateAccount.field
    archive_account = mutations.ArchiveAccount.field
    delete_account = mutations.DeleteAccount.field
    password_change = mutations.PasswordChange.field
    # swap_emails = mutations.SwapEmails.field


@strawberry.type
class Mutation:
    @field(directives=[TokenRequired()])
    def auth_entry(self) -> Union[AuthMutation, GQLAuthError]:
        return AuthOutput(node=AuthMutation())

    # these are mutation that does not require authentication.
    captcha = Captcha.field
    token_auth = mutations.ObtainJSONWebToken.field
    register = mutations.Register.field
    verify_account = mutations.VerifyAccount.field
    resend_activation_email = mutations.ResendActivationEmail.field
    send_password_reset_email = mutations.SendPasswordResetEmail.field
    password_reset = mutations.PasswordReset.field
    password_set = mutations.PasswordSet.field
    refresh_token = mutations.RefreshToken.field
    revoke_token = mutations.RevokeToken.field
    # verify_secondary_email = mutations.VerifySecondaryEmail.field


    login: Optional[UserType] = auth.login()

