import re

from datetime import datetime, date

def model2dict(model):
    d = {}
    for c in model.__table__.columns:
        f = getattr(model, c.name)
        d[c.name] = f
        if isinstance(f, datetime):
            d[c.name] = f.strftime('%Y-%m-%d %H:%M:%S')
        elif isinstance(f, date):
            d[c.name] = f.strftime('%Y-%m-%d')
    return d

def models2list(models):
    l = []
    cols = models[0].__table__.columns
    for m in models:
        d = {}
        for c in cols:
            f = getattr(m, c.name)
            d[c.name] = f
            if isinstance(f, datetime):
                d[c.name] = f.strftime('%Y-%m-%d %H:%M:%S')
            elif isinstance(f, date):
                d[c.name] = f.strftime('%Y-%m-%d')
        l.append(d)
    return l

section_name_re = re.compile(r'^([rcsm]?)(\d+)([a-z]*)$', re.I)

