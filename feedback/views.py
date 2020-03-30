from django.shortcuts import render, redirect
from .models import Feedback
from django.utils.timezone import utc
from utils.utils import custom_redirect
import datetime
from django.utils.html import escape

def feedback_view(request):
    
    #Redirect unauthenticated users
    if not request.user.is_authenticated:
        return redirect('index:index')
    
    #Check if user has accepted terms of use
    if not request.user.conventecuser.accepted_tou:
        return redirect('terms:terms')
    
    if request.user.conventecuser.kanzlei.deadline is not None and request.user.conventecuser.kanzlei.deadline <= datetime.datetime.now():
        return custom_redirect('login:error', e = 'deadline')
    
    if request.method == 'GET' and not request.user.conventecuser.view_feedback:
        active = request.GET.get('active', 'anregung')
        success = request.GET.get('success', 'f')
        
        context = {
            'user' : request.user,
            'active' : {'nav' : 'feedback', 'tabs' : active},
            'success' : success
            }
        
        return render(request, 'feedback.html', context)
        
    
    elif request.method == 'POST' and not request.user.conventecuser.view_feedback:
        type = request.POST.get('type', '')
        
        anonymous = request.POST.get('anonymous', '')
        
        if anonymous != '':
            user = None
        else:
            user = request.user
        
        if type == 'fehler' or type == 'anregung':
            title = request.POST.get('title', '')
            text = request.POST.get('text', '')
            
            if text != '' or title != '':
                Feedback.create(user, type, title, text)
                
        elif type == 'allgemein':
            q1a = escape(request.POST.get('q1a', False))
            q1b = escape(request.POST.get('q1b', False))
            q2a = escape(request.POST.get('q2a', False))
            q2b = escape(request.POST.get('q2b', False))
            q2c = escape(request.POST.get('q2c', False))
            q2d = escape(request.POST.get('q2d', False))
            q2e = escape(request.POST.get('q2e', False))
            q2f = escape(request.POST.get('q2f', False))
            q2g = escape(request.POST.get('q2g', False))
            q3 = escape(request.POST.get('q3', False))
            q4 = escape(request.POST.get('q4', False))
            q5 = escape(request.POST.get('q5', False))
            q6 = escape(request.POST.get('q6', False))
            q7 = escape(request.POST.get('q7', False))
            q8 = escape(request.POST.get('q8', False))
            q9 = escape(request.POST.get('q9', False))
            q10 = escape(request.POST.get('q10', False))
            q11 = escape(request.POST.get('q11', False))
            
            title = 'Feedback Formular'
            text = ''
            
            if q1a:
                text += '\n\n<strong>1. Würden Sie Conventec für Ihr Unternehmen nutzen und gegebenenfalls einem Kollegen weiterempfehlen?</strong>\n\n'
                text += (q1a + '\n\n')
                if q1b:
                    text += (q1b + '\n\n')
            
            text += '\n\n<strong>2. Welche Elemente der Conventec App haben Sie ausprobiert?</strong>\n\n'
            
            if q2a:
                text += 'Erstellung Projekt (Mandat)\n\n'
            
            if q2b:
                text += 'Teamverwaltung (z.B. weiteres Team zu Projekt hinzufügen)\n\n'
                
            if q2c:
                text += 'Erstellung einzelnes Geschäft\n\n'
                
            if q2d:
                text += '1.4.2. AG Revisionsstelle Opting Out Post Incorporation\n\n'
                
            if q2e:
                text += '2.1.1. GmbH Gründung bar\n\n'
                
            if q2f:
                text += 'Formular ausfüllen\n\n'
                
            if q2g:
                text += 'Dokumente downloaden\n\n'
                
            if q3:
                text += ('\n\n<strong>3. Haben Sie das Gefühl, dass Conventec Ihnen Ihren juristischen Arbeitsalltag erleichtern kann? Wenn ja, wie? Wenn nein, warum nicht?</strong>\n\n' + q3 + '\n\n')
                
            if q4:
                text += ('\n\n<strong>4. Wie müsste die Conventec App allenfalls angepasst werden, damit Sie noch besser bzw. effizienter arbeiten können?</strong>\n\n' + q4 + '\n\n')
            
            if q5:
                text += ('\n\n<strong>5. Empfinden Sie den Webauftritt der Conventec App als ansprechend und bedienungsfreundlich?</strong>\n\n' + q5 + '\n\n')
                
            if q6:
                text += ('\n\n<strong>6. Von welchen juristischen Geschäften würden Sie sich wünschen, dass sie auf der Conventec App automatisiert verfügbar wären (z.B. AG Kapitalerhöhung)?</strong>\n\n' + q6 + '\n\n')
                
            if q7:
                text += ('\n\n<strong>7. Wo beobachten Sie Ineffizienzen/Verbesserungspotential in Ihrem juristischen Alltag und wie könnte Conventec Ihnen bei der Behebung/Umsetzung helfen?</strong>\n\n' + q7 + '\n\n')
                
            if q8:
                text += ('\n\n<strong>8. Würden Sie es als hilfreich empfinden, wenn Sie in der Conventec App in real-time mit Ihren Teamkollegen oder Kunden an Geschäften (insb. Verträgen) arbeiten könnten, beispielsweise mithilfe eines Texteditors?</strong>\n\n' + q8 + '\n\n')
                
            if q9:
                text += ('\n\n<strong>9. Gibt es ein „Wunschfeature“, welches Sie als sehr nützlich empfinden würden, momentan aber noch nicht durch Conventec implementiert worden ist?</strong>\n\n' + q9 + '\n\n')
            
            if q10:
                text += ('\n\n<strong>10. Wie hoch wäre Ihre monatliche Zahlungsbereitschaft für die Nutzung der Conventec App angepasst auf Ihre Kanzlei / Unternehmung?</strong>\n\n' + q10 + '\n\n')
            
            if q11:
                text += ('\n\n<strong>11. Blockchain, Artificial Intelligence, Analytics etc. – Wie könnte Conventec Ihre Kanzlei / Unternehmung auf dem weiteren Weg zur Digitalisierung sonst unterstützen?</strong>\n\n' + q11 + '\n\n')
            
            Feedback.create(user, type, title, text)
        
        active = request.GET.get('active', 'anregung')
        success = request.GET.get('success', 'f')
        
        context = {
            'user' : request.user,
            'active' : {'nav' : 'feedback', 'tabs' : active},
            'success' : success
            }
        
        return render(request, 'feedback.html', context)
    
    elif request.method == 'GET' and request.user.conventecuser.view_feedback:
        active = request.GET.get('active', 'alles')
        
        context = {
            'user' : request.user,
            'feedback' : Feedback.objects.all(),
            'active' : {'nav' : 'feedback', 'tabs' : active}
            }
        
        return render(request, 'feedback_list.html', context)
    
    elif request.method == 'POST' and request.user.conventecuser.view_feedback:
        active = request.GET.get('active', 'all')
        loschen = request.POST.get('loschen', 'all')
        
        Feedback.objects.get(id = int(loschen)).delete()
        
        context = {
            'user' : request.user,
            'feedback' : Feedback.objects.all(),
            'active' : {'nav' : 'feedback', 'tabs' : active}
            }
        
        return render(request, 'feedback_list.html', context)