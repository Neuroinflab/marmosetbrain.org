import React from 'react';
import _ from 'lodash';
export function escapeRegExp(text) {
    if (text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    } else {
        return '';
    }
}

export function getInjectionFilterHint(cond_key, cond, _inj, filterState) {
    let inj_hint = filterState.injHint;
    let s, hint;
    switch (cond_key) {
        //case 'case_id':
        //    s = _inj.display_name + '-' + _inj.tracer;
        //    console.log('case_id', s);
        //    s.replace(new RegExp('^(.*?)(' + cond + ')(.*?)$', 'i'), function(match, p1, p2, p3) {
        //        hint = (<span className="match-cond">Case ID: {p1}<strong>{p2}</strong>{p3}</span>);
        //    });
        //    inj_hint.push(hint)
        //    break;

        case 'region_name':
            s = _inj.region_name;
            s.replace(new RegExp('^(.*?)(' + cond + ')(.*?)$', 'i'), function(match, p1, p2, p3) {
                hint = (<span key={_inj.id + cond_key} className="match-cond">Area: {p1}<strong>{p2}</strong>{p3}</span>);
            });
            if (hint !== null) {
                filterState.conditionProcessed = true;
                inj_hint.push(hint)
            }
            break;
        case 'region':
            s = _inj.region;
            s.replace(new RegExp('^(.*?)(' + cond + ')(.*?)$', 'i'), function(match, p1, p2, p3) {
                hint = (<span key={_inj.id + cond_key} className="match-cond">Area: {_inj.region_name} ({p1}<strong>{p2}</strong>{p3})</span>);
            });
            if (hint !== null) {
                filterState.conditionProcessed = true;
                inj_hint.push(hint)
            }
            break;
        case 'memo':
            s = _inj.memo;
            //s.replace(new RegExp('(\w+{0,10})(' + cond + ')(\w+{0,10})', 'i'), function(match, p1, p2, p3)
            s.replace(new RegExp('((?:\\w+\\W+){0,10})(\\b' + cond + ')((?:\\W+\\w+){0,10})', 'i'), function(match, p1, p2, p3) {
                hint = (<span key={_inj.id + cond_key} className="match-cond">Remarks for injection: ... {p1}<strong>{p2}</strong>{p3} ...</span>);
            });
            if (hint !== null) {
                filterState.conditionProcessed = true;
                inj_hint.push(hint)
            }
            s = _inj.case_memo;
            //s.replace(new RegExp('(\w+{0,10})(' + cond + ')(\w+{0,10})', 'i'), function(match, p1, p2, p3)

            hint = null;
            s.replace(new RegExp('((?:\\w+\\W+){0,10})(\\b' + cond + ')((?:\\W+\\w+){0,10})', 'i'), function(match, p1, p2, p3) {
                hint = (<span key={_inj.id + 'case' + cond_key} className="match-cond">Remarks for Case: ... {p1}<strong>{p2}</strong>{p3} ...</span>);
            });
            if (hint !== null) {
                filterState.conditionProcessed = true;
                inj_hint.push(hint)
            }
            break;
        /*
        case 'case_memo':
            console.log('matchin case_memo');
            s = _inj.case_memo;
            //s.replace(new RegExp('(\w+{0,10})(' + cond + ')(\w+{0,10})', 'i'), function(match, p1, p2, p3)

            s.replace(new RegExp('((?:\\w+\\W+){0,10})(\\b' + cond + ')((?:\\W+\\w+){0,10})', 'i'), function(match, p1, p2, p3) {
                hint = (<span key={_inj.id + cond_key} className="match-cond">Remarks for Case: ... {p1}<strong>{p2}</strong>{p3} ...</span>);
            });
            if (hint !== null) {
                filterState.conditionProcessed = true;
                inj_hint.push(hint)
            }
            break;
        */
        case 'tracer':
            s = _inj.tracer;
            s.replace(new RegExp('^(.*?)(' + cond + ')(.*?)$', 'i'), function(match, p1, p2, p3) {
                hint = (<span key={_inj.id + cond_key} className="match-cond">Tracer: {p1}<strong>{p2}</strong>{p3}</span>);
            });
            if (hint !== null) {
                filterState.conditionProcessed = true;
                inj_hint.push(hint)
            }
            break;
        case 'injection':
            s = _inj.injection_id;
            break;
        default: // no-op
            break;
    }
}

export function getInjectionTestFunction(termString) {
    function _injectionTest(v) {
        v.matchcond = {};
        if (termString) {
            if (!/^detail:/i.test(termString)) {
                let result = false;
                if (termString.indexOf('&') < 0) {
                    let terms = _.map(termString.split('|'), _.trim);
                    let injection_id = v.display_name + '-' + v.tracer;
                    _.each(terms, (term) => {
                        let name_only, injection_id_only, region_code_only, memo_only, case_memo_only, tracer_only;
                        let strict = false;
                        if (/^area:/i.test(term)) {
                            region_code_only = true;
                            strict = true;
                            term = term.replace(/^area:/i, '');
                        } else if (/^memo:/i.test(term)) {
                            memo_only = true;
                            strict = true;
                            term = term.replace(/^memo:/i, '');
                        } else if (/^case_memo:/i.test(term)) {
                            case_memo_only = true;
                            strict = true;
                            term = term.replace(/^case_memo:/i, '');
                        } else if (/^tracer:/i.test(term)) {
                            tracer_only = true;
                            strict = true;
                            term = term.replace(/^tracer:/i, '');
                        } else if (/^injection:/i.test(term)) {
                            injection_id_only = true;
                            strict = true;
                            term = term.replace(/^injection:/i, '');
                        } else if (/^case:/i.test(term)) {
                            injection_id_only = true;
                            strict = true;
                            term = term.replace(/^case:/i, '');
                        }
                        const regex_term = escapeRegExp(term);
                        const name_patt = new RegExp('^' + regex_term, 'i');
                        const region_patt = new RegExp(regex_term, 'i');
                        const memo_patt = new RegExp(regex_term, 'i');
                        const tracer_patt = new RegExp('^' + regex_term + '$', 'i');
                        //let tracer_patt = new RegExp('^' + regex_term, 'i');
                        let name_test, region_test, region_code_test, memo_test, case_memo_test, injection_id_test, tracer_test;
                        if (!strict || name_only) {
                            name_test = name_patt.test(v.case_id);
                            if (name_test) {
                                v.matchcond['case_id'] = terms;
                            }
                        }
                        if (!strict) {
                            region_test = region_patt.test(v.region_name);
                            if (region_test) {
                                v.matchcond['region_name'] = terms;
                            }
                        }
                        if (!strict || region_code_only) {
                            region_code_test = region_patt.test(v.region);
                            if (region_code_test) {
                                v.matchcond['region'] = terms;
                            }
                        }
                        if (!strict || memo_only) {
                            memo_test = memo_patt.test(v.memo);
                            if (memo_test) {
                                v.matchcond['memo'] = terms;
                            } else {
                                memo_test = memo_patt.test(v.case_memo);
                                if (memo_test) {
                                    v.matchcond['memo'] = terms;
                                }
                            }
                        }
                        /*
                        if (!strict || case_memo_only) {
                            case_memo_test = memo_patt.test(v.case_memo);
                            if (case_memo_test) {
                                v.matchcond['case_memo'] = terms;
                            }
                        }
                        */
                        if (!strict || tracer_only) {
                            tracer_test = tracer_patt.test(v.tracer);
                            if (tracer_test) {
                                v.matchcond['tracer'] = terms;
                            }
                        }
                        if (!strict || injection_id_only) {
                            injection_id_test = name_patt.test(injection_id);
                            if (injection_id_test) {
                                v.matchcond['injection_id'] = terms;
                            }
                        }
                        if (name_test || region_test || region_code_test || memo_test || case_memo_test || injection_id_test || tracer_test) {
                            result = true;
                        }
                    });
                } else if (termString.indexOf('&') >= 0) {
                    result = true;
                    let terms = _.map(termString.split('&'), _.trim);
                    let injection_id = v.display_name + '-' + v.tracer;
                    let end_result = false;
                    _.each(terms, (term) => {
                        let name_only, injection_id_only, region_code_only, memo_only, case_memo_only, tracer_only;
                        if (/^area:/i.test(term)) {
                            region_code_only = true;
                            term = term.replace(/^area:/i, '');
                        } else if (/^memo:/i.test(term)) {
                            memo_only = true;
                            term = term.replace(/^memo:/i, '');
                        } else if (/^case_memo:/i.test(term)) {
                            case_memo_only = true;
                            term = term.replace(/^case_memo:/i, '');
                        } else if (/^tracer:/i.test(term)) {
                            tracer_only = true;
                            term = term.replace(/^tracer:/i, '');
                        } else if (/^injection:/i.test(term)) {
                            injection_id_only = true;
                            term = term.replace(/^injection:/i, '');
                        } else if (/^case:/i.test(term)) {
                            injection_id_only = true;
                            term = term.replace(/^case:/i, '');
                        }
                        const regex_term = escapeRegExp(term);
                        const name_patt = new RegExp('^' + regex_term, 'i');
                        const region_patt = new RegExp(regex_term, 'i');
                        const memo_patt = new RegExp(regex_term, 'i');
                        const tracer_patt = new RegExp('^' + regex_term + '$', 'i');
                        //let tracer_patt = new RegExp('^' + regex_term, 'i');
                        let name_test, region_code_test, memo_test, injection_id_test, tracer_test;
                        if (name_only) {
                            name_test = name_patt.test(v.case_id);
                            if (name_test) {
                                v.matchcond['case_id'] = terms;
                            } else {
                                name_test = false;
                            }
                        } else {
                            name_test = true;
                        }
                        if (region_code_only) {
                            region_code_test = region_patt.test(v.region);
                            if (region_code_test) {
                                v.matchcond['region'] = terms;
                                region_code_test = true;
                            } else {
                                region_code_test = false;
                            }
                        } else {
                            region_code_test = true;
                        }
                        if (memo_only) {
                            memo_test = memo_patt.test(v.memo);
                            if (memo_test) {
                                v.matchcond['memo'] = terms;
                                memo_test = true;
                            } else {
                                memo_test = memo_patt.test(v.case_memo);
                                if (memo_test) {
                                    v.matchcond['memo'] = terms;
                                    memo_test = true;
                                } else {
                                    memo_test = false;
                                }
                            }
                        } else {
                            memo_test = true;
                        }
                        if (tracer_only) {
                            tracer_test = tracer_patt.test(v.tracer);
                            if (tracer_test) {
                                v.matchcond['tracer'] = terms;
                                tracer_test = true;
                            } else {
                                tracer_test = false;
                            }
                        } else {
                            tracer_test = true;
                        }
                        if (injection_id_only) {
                            injection_id_test = name_patt.test(injection_id);
                            if (injection_id_test) {
                                v.matchcond['injection_id'] = terms;
                                injection_id_test = true;
                            }
                        } else {
                            injection_id_test = true;
                        }
                        if (!name_test || !region_code_test || !memo_test || !injection_id_test || !tracer_test) {
                            result = false;
                        }
                    });
                } else {
                    result = true;
                }
                return result;
            } else {
                return true;

            }
        } else {
            return true;
        }

    }
    return _injectionTest;
}
