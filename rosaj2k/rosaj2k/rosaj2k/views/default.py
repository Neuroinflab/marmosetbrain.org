from pyramid.response import Response
from pyramid.view import view_config
from pyramid.httpexceptions import HTTPPaymentRequired, HTTPInternalServerError

from sqlalchemy.exc import DBAPIError

@view_config(route_name='home', renderer='home.mako')
def home(request):
    try:
        session = request.dbsession
    except DBAPIError as ex:
        return HTTPInternalServerError('Database error: %s' % ex)
    return {'project': 'rosaj2k'}

