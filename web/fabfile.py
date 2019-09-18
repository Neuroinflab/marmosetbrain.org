from datetime import datetime
from fabric.api import local, run, get, hosts, roles, cd
from fabric.api import env
from fabric.contrib.console import confirm
#env.hosts = ['mitradevel']
env.roledefs['webservers'] = ['mitradevel']
env.roledefs['dbservers'] = ['mitradevel']

@roles('dbservers')
def backup_db():
    date_str = datetime.now().strftime('%Y%m%d')
    run('pg_dump marmoset --clean | gzip > marmoset%s.sql.gz' % date_str)
    get('marmoset%s.sql.gz' % date_str, '~/marmoset%s.sql.gz' % date_str)
    print 'Go tile from', env.host_string
    run('rm marmoset%s.sql.gz' % date_str)

@roles('webservers')
def deploy():
    with cd('git/marmoset_connectome'):
        run('git fetch')
        run('git merge origin/master')
        with cd('web/connectome/static/css'):
            run('. $HOME/.virtualenvs/mar/bin/activate; ./gen_css.sh')

