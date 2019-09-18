import os

from setuptools import setup, find_packages

here = os.path.abspath(os.path.dirname(__file__))
with open(os.path.join(here, 'README.txt')) as f:
    README = f.read()
with open(os.path.join(here, 'CHANGES.txt')) as f:
    CHANGES = f.read()

requires = [
    'pyramid',
    'pyramid_debugtoolbar',
    'pyramid_tm',
    'pyramid_mako',
    'PasteDeploy',
    'SQLAlchemy',
    'transaction',
    'zope.sqlalchemy',
    'pillow',
    'waitress',
    'libsass',
    'msgpack-python',
    'psycopg2',
    'requests',
    'ansicolors',
    'uwsgi',
    'hupper',
    'pygments',
    'repoze.lru',
    'ipaddress',
    'translationstring',
    'venusian',
    'zope.deprecation',
    'webob',
    'xlrd',
    'xlwt',
    'yaml'
    ]

setup(name='connectome',
      version='0.0',
      description='connectome',
      long_description=README + '\n\n' + CHANGES,
      classifiers=[
        "Programming Language :: Python",
        "Framework :: Pyramid",
        "Topic :: Internet :: WWW/HTTP",
        "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
        ],
      author='',
      author_email='',
      url='',
      keywords='web wsgi bfg pylons pyramid',
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      test_suite='connectome',
      install_requires=requires,
      entry_points="""\
      [paste.app_factory]
      main = connectome:main
      [console_scripts]
      initialize_connectome_db = connectome.scripts.initializedb:main
      """,
      )
