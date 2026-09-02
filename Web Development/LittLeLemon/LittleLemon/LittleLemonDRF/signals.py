#Automating triggering signals
from django.db.models.signals import post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from django_rest_passwordreset.signals import reset_password_token_created
from LittleLemonDRF.utils import dispatch_async_email



@receiver(post_save,sender=User)
def send_welcome_email(sender,instance,created,**kwarg):
    #Triggers on new user creation
    if created and instance.email:
        dispatch_async_email(
            subject="Welcome to Little Lemon Platform ✨",
            template_name='emails/welcome.html',
            context= {'Username':instance.username},
            recipient_list=[instance.email],
            fallback_text= f"Welcome {instance.username}! Thanks for signing up"
        )

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    reset_url = f""
    
    dispatch_async_email(
        subject="Password Reset Request 🔒",
        template_name="emails/password_reset.html",
        context={
            "username": reset_password_token.user.username,
            "reset_url": reset_url
        },
        recipient_list=[reset_password_token.user.email],
        fallback_text=f"Click here to reset your password: {reset_url}"
    )

