from django import forms
from django.db import models

from .models import Image
from django.forms.widgets import Textarea
from projects.models import Projects
from api.models import OfflineModel, FileUpload
from django.utils.translation import gettext_lazy as _


class ImageForm(forms.ModelForm):
    image = forms.ImageField(widget=forms.ClearableFileInput(attrs={'multiple': True}), required=False)
    class Meta:
        model = Image     
        fields = ('title', 'description', #'user', 
                    'lat', 'lng', 'image', 'project')
        labels = {
            # 'user':'User',
            'lat':_('Latitude'),
            'lng':_('Longitude')
        }
        widgets = {
          'description': Textarea(attrs={'rows':4, 'cols':20}),
        }

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super(ImageForm, self).__init__(*args, **kwargs)
        # self.fields['user'].empty_label = "-- Keep Unselected for Setting to Yourself --"
        self.fields['project'].empty_label = "No Project Linked Yet !!"
        if self.request and self.request.user.is_authenticated:
            if self.request.user.user_type == 'project_admin':
                self.fields['project'].queryset = Projects.objects.filter(users__id=self.request.user.id)
            elif self.request.user.user_type == 'admin': # admin
                self.fields['project'].queryset  = Projects.objects.all()
        else:
            self.fields['project'].queryset = []

        self.fields['image'].label = _("Multiple Images")
        self.fields['lat'].widget.attrs['min'] = -90
        self.fields['lat'].widget.attrs['max'] = 90
        self.fields['lng'].widget.attrs['min'] = -180
        self.fields['lng'].widget.attrs['max'] = 180


class OfflineModelForm(forms.ModelForm):
    model_type = forms.ChoiceField(choices=[('CLASSIFIER','Processor'),('OBJECT_DETECT','Object Detect'),('CLASSIFIER','Classifier')], widget=forms.Select, initial = 'model_type')
    model_format = forms.CharField(widget=forms.Select, initial = 'model_format')
    class Meta:
        model = OfflineModel     
        fields = ('name', 'model_type', 'model_format', 'preprocess', 'postprocess', 'file')
        labels = {
            'model_type':_('Model Type'),
            'model_format':_('Model File Format'),
            'file':_('File'),
        }

    def __init__(self, *args, **kwargs):
        super(OfflineModelForm, self).__init__(*args, **kwargs)
        self.fields['model_format'].help_text = _('Choose a format or type yourself')
        self.fields['preprocess'].help_text = _('Mark this Offline Model as Pre-Process (e.g. Gaussian Blur to preprocess the image uploaded)')
        self.fields['postprocess'].help_text = _('Mark this Offline Model as Post-Process (e.g. Customize the pipeline result or go/nogo result)')
        if self.instance and (self.instance.projects.all().count() or self.instance.classifiers.all().count()): # Done, to check if offline model is linked to projects or classifiers to disable editing object type
            if self.instance.preprocess or self.instance.postprocess:
                self.fields['model_type'].widget = forms.Select(choices=[('CLASSIFIER','Processor')])
                self.fields['model_type'].help_text = _('Model Type Cannot be Changed because this is being used by projects/classifiers. <br/> Model Type: Processor')
            else:
                # self.fields['model_type'].widget = forms.HiddenInput()
                self.fields['model_type'].widget = forms.Select(choices=[('CLASSIFIER','Processor'),('CLASSIFIER','Classifier')])
                self.fields['model_format'].help_text = 'Choose a format or type yourself <br/> Model Type: '+self.instance.model_type+' <br/> This Offline Model is being used by some projects or classifier actively. Change with Caution.'

# FILE UPLOAD
class FileUploadForm(forms.ModelForm):
    class Meta:
        model = FileUpload     
        fields = ('name', 'file')

    def __init__(self, *args, **kwargs):
        super(FileUploadForm, self).__init__(*args, **kwargs)
        self.fields['file'].help_text = 'Upload Files like Unet Models etc. here & use this path in pre-processor or post-processor'