import os
import logging

from zope.interface import implementer
from zope.interface import Interface

from pyramid.interfaces import ITemplateRenderer
from pyramid.exceptions import ConfigurationError
from pyramid.resource import abspath_from_asset_spec
from pyramid.settings import asbool

import sass

Logger = logging.getLogger('pyramid_scss')

__version__ = '0.4'

def prefixed_keys(d, prefix):
    return dict([(k.replace(prefix, ''), v) for k, v in d.items() if k.startswith(prefix)])

def _get_import_paths(settings):
    # `scss.asset_path` is the path which should be searched to resolve a request
    if 'sass.asset_path' not in settings:
        raise ConfigurationError('SCSS renderer requires ``sass.asset_path`` setting')

    load_paths = []
    for s in settings.get('sass.asset_path').split('\n'):
        if s:
            p = abspath_from_asset_spec(s.strip())
            load_paths.append(p)
            Logger.info('adding asset path %s', p)

    # `sass.static_path`, optional, is the path which should be searched to resolve references to static assets in stylesheets
    static_path = settings.get('sass.static_path', '')
    if static_path:
        if 'sass.static_url_root' not in settings:
            raise ConfigurationError('SCSS renderer requires ``sass.static_url_root`` setting if ``sass.static_path`` is provided')

        static_path = abspath_from_asset_spec(static_path.strip())
        Logger.info('setting static path %s', static_path)

    # `sass.output_path`, optional, is the path where generated spritemaps should be written
    assets_path = settings.get('sass.output_path', '')
    if assets_path:
        if 'sass.output_url_root' not in settings:
            raise ConfigurationError('SCSS renderer requires ``sass.output_url_root`` setting if ``sass.output_path`` is provided')

        assets_path = abspath_from_asset_spec(assets_path.strip())
        Logger.info('setting output path %s', assets_path)

    return (load_paths, static_path, assets_path)

def renderer_factory(info):
    settings = prefixed_keys(info.settings, 'sass.')

    options = {
        'compress': settings.get('compress', False),
        'cache': settings.get('cache', False),
    }

    options = dict((k, asbool(v)) for k, v in options.items())
    return ScssRenderer(info, options)

@implementer(ITemplateRenderer)
class ScssRenderer(object):
    cache = None

    def __init__(self, info, options):
        self.cache = {}
        self.info = info
        self.options = options

    def __call__(self, value, system):
        #parser = Scss(scss_opts=self.options)
        parser = sass
        css, type_ = value
        if 'request' in system:
            request = system.get('request')
            request.response.content_type = 'text/css'
            key = request.matchdict.get('css_path')
            if not self.options.get('cache', False) or key not in self.cache:
                Logger.info('generating %s', key)
                if type_ == 'scss':
                    self.cache[key] = parser.compile(string=css)
                else:
                    self.cache[key] = css
            return self.cache.get(key)

        return parser.compile(string=css)

def includeme(config):
    load_paths, static_path, assets_path = _get_import_paths(config.registry.settings)

    #sass.config.LOAD_PATHS = ','.join([sass.config.LOAD_PATHS, ','.join(load_paths)])

    #sass.config.STATIC_ROOT = static_path
    #sass.config.STATIC_URL = config.registry.settings.get('sass.static_url_root')

    #sass.config.ASSETS_ROOT = assets_path
    #sass.config.ASSETS_URL = config.registry.settings.get('sass.output_url_root')

    config.add_renderer('sass', renderer_factory)
