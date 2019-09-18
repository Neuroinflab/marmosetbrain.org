import re, os
import hashlib

from pyramid.response import Response
from pyramid.httpexceptions import HTTPInternalServerError, HTTPFound, HTTPUnauthorized, HTTPNotFound
from pyramid.view import view_config, forbidden_view_config
from pyramid.security import remember, forget

from sqlalchemy.exc import DBAPIError

from ..models import (
    DBSession,
    User
)


@view_config(route_name='login', renderer='login.mako')
@forbidden_view_config(renderer='login.mako')
def login(request):
    username = ''
    messages = ''
    referer = request.url
    if referer == request.route_url('login'):
        referer = '/injection'
    came_from = request.params.get('came_from', referer)
    return {
        'messages': messages, 'url': request.application_url + '/login',
        'came_from': came_from, 'username': username
    }

@view_config(route_name='login', request_method='POST', renderer='login.mako')
def login_post(request):
        came_from = request.params['came_from']
        username = request.POST['username']
        password = request.POST['password']
        user = DBSession.query(User).filter_by(userid=username).first()
        if user and user.password == hashlib.sha512(password).hexdigest()[:64]:
            headers = remember(request, username)
            return HTTPFound(location=came_from, headers=headers)
        else:
            messages = ['failed login']
            return {
                'messages': messages, 'url': request.application_url + '/login',
                'came_from': came_from, 'username': username
            }

@view_config(route_name='logout')
def logout(request):
    headers = forget(request)
    return HTTPFound(location=request.route_url('home'), headers=headers)
