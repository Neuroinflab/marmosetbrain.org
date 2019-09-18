# -*- encoding: utf-8
import os, sys
from collections import namedtuple
import datetime
import transaction

from sqlalchemy import engine_from_config

from pyramid.paster import (
    get_appsettings,
    setup_logging,
    )

from pyramid.scripts.common import parse_vars

from ..models import (
    DBSession,
    Base,
    Marmoset,
    Injection,
    )
import xlrd

def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <command> [var=value]\n'
          '(example: "%s add_case CASE_ID=CJ74")\n'
          '(example: "%s get_histology CASE_ID=CJ74")\n'
          '(example: "%s create_section CASE_ID=CJ74")\n'
          '(example: "%s worksheet CASE_ID=CJ74")\n'
          '(example: "%s get_mdplot CASE_ID=CJ74")\n'
          % ((cmd, ) * 6))
    sys.exit(1)

def main(argv=sys.argv):
    cwd = os.path.dirname(os.path.realpath(__file__))
    config_uri = os.path.join(cwd, '..', '..', 'development.ini')
    setup_logging(config_uri)
    settings = get_appsettings(config_uri)
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    #Base.metadata.create_all(engine)

    Row = namedtuple('Row', ['case_id', 'animal_id', 'dob', 'body_weight', 'injection_date', 'hemisphere', 'perfusion_date', 'survival_days', 'memo'])

    with transaction.manager:
        session = DBSession()
        wb = xlrd.open_workbook('marmoset_meta.xlsx')
        sh = wb.sheet_by_index(0)
        for row_idx in range(1, sh.nrows):
            row = Row._make([v.value for v in sh.row(row_idx)])
            m = session.query(Marmoset).filter_by(case_id=row.case_id).one()
            m.animal_id = row.animal_id
            days, year = row.dob.split('/')
            dob = datetime.date(int(year) + 2000, 1, 1) + datetime.timedelta(days=int(days))
            m.dob = dob
            m.body_weight = row.body_weight if row.body_weight else None
            m.injection_date = xlrd.xldate.xldate_as_datetime(row.injection_date, wb.datemode)
            m.hemisphere = row.hemisphere
            m.perfusion_date = xlrd.xldate.xldate_as_datetime(row.perfusion_date, wb.datemode)
            m.survival_days = row.survival_days

if __name__ == '__main__':
    main()
