#Threding 
import threading
from django.core.mail import send_mail
from django.template.loader import render_to_string

def _execute_send_email(subject,message,recipient_list,html_message):

    #function to execute inside thread
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=None,
            recipient_list=recipient_list,
            html_message=html_message,
            fail_silently=False,
        )
    except Exception as e:
        print('Async email failed to send: {}'.format(e))


#Discpatching async email

def dispatch_async_email(subject,template_name,context,recipient_list,fallback_text=""):

    #Rendering html layout and  launching thread

    html_message = render_to_string(template_name,context)

    thread = threading.Thread(
        target=_execute_send_email,
        kwargs= {'subject': subject,
            'message': fallback_text,
            'recipient_list': recipient_list,
            'html_message': html_message,
        },
     daemon=True
        )
    thread.start()
    