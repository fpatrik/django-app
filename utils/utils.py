def format_time(time_input):
    """
    Takes a Python datetime object and returns a string.
    If today: today, hh:mm pm
    If yesterday: yesterday, hh:mm pm
    If this year: dd month
    Else: dd month yyyy
    """
    from datetime import datetime, timedelta
    
    #if time_input is today
    if time_input.date() == datetime.today().date():
        return 'Heute, ' + time_input.strftime('%H:%M')
    
    #if time_input is yesterday
    elif time_input.date() == datetime.today().date() - timedelta(1):
        return 'Gestern, ' + time_input.strftime('%H:%M')
    
    #if time us this year
    elif time_input.year == datetime.today().year:
        return time_input.strftime('%d. %b, %H:%M')
    
    else:
        return time_input.strftime('%d. %b %Y')
    
    
def custom_redirect(url_name, *args, **kwargs):
    from django.urls import reverse 
    import urllib
    from django.http import HttpResponseRedirect
    url = reverse(url_name, args = args)
    if 'scroll_to' in kwargs:
        scroll_to = '#' + kwargs['scroll_to']
        kwargs.pop('scroll_to', None)
    else:
        scroll_to = ''
    params = urllib.parse.urlencode(kwargs)
    return HttpResponseRedirect(url + "?%s" % params + scroll_to)