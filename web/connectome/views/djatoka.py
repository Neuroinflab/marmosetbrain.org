import json
import msgpack
from pyramid.response import Response
from pyramid.view import view_config
from pyramid.renderers import render
from sqlalchemy import func

from sqlalchemy.exc import DBAPIError
from sqlalchemy.orm import aliased
import requests

from ..models import (
    DBSession,
    Region,
    Injection,
    Section,
    Cell,
    Marmoset,
    AnnotationType,
    Annotation,
    )
from ..libs import models2list

@view_config(route_name='djatoka')
def djatoka(request):
    if request.GET.get('svc_id') == 'info:lanl-repo/svc/getMetadata':
        #res = requests.get('http://143.48.220.34:80%s' % request.path_qs)
        res = requests.get('http://localhost%s' % request.path_qs)
        return Response(res.content, content_type='application/json')
    else:
        #res = requests.get('http://143.48.220.34:80%s' % request.path_qs)
        res = requests.get('http://localhost%s' % request.path_qs)
        return Response(res.content, content_type='image/jpeg')
