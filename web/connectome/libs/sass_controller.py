import os
import logging

from pyramid.exceptions import ConfigurationError
from pyramid.httpexceptions import HTTPNotFound
from pyramid.resource import abspath_from_asset_spec

Logger = logging.getLogger('pyramid_scss')

def get_scss(root, request):
    Logger.info('serving SCSS request for %s', request.matchdict.get('css_path'))
    scss = _load_asset(request)
    return scss

def _get_asset_path(request):
    if 'sass.asset_path' not in request.registry.settings:
        raise ConfigurationError('SCSS renderer requires ``sass.asset_path`` setting')

    scss_name = request.matchdict.get('css_path') + '.scss'
    css_name = request.matchdict.get('css_path') + '.css'
    for s in request.registry.settings.get('sass.asset_path').split('\n'):
        if s:
            p = abspath_from_asset_spec(os.path.join(s.strip(), scss_name))
            if os.path.exists(p):
                return p, 'scss'
            p = abspath_from_asset_spec(os.path.join(s.strip(), css_name))
            if os.path.exists(p):
                return p, 'css'
    raise HTTPNotFound()

def _load_asset(request):
    path, type_ = _get_asset_path(request)
    with open(path) as f:
        return f.read(), type_
    raise HTTPNotFound()
