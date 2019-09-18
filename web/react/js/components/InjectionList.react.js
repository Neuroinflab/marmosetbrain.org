import React from 'react';
import Actions from '../actions/Actions';
import AppStore from '../stores/AppStore';
import _ from 'lodash';
import classNames from 'classnames';
import {modalStyle} from '../lib/Libs';
import MetadataModal from './MetadataModal.react';
import Modal from '../lib/modal';
import {
    expandTracerID, humanReadableDate, humanReadableDiffInMonth,
    parseAP, parseML, parseDV, getOffset,
    getColorOfTracer, sortInjection
} from '../lib/utils';
import {escapeRegExp, getInjectionFilterHint, getInjectionTestFunction} from '../lib/intellifilter';
import InjectionPager from './InjectionPager.react';
import InjectionListItem from './InjectionListItem.react';
import {getBarWidthFunc, getLogColorFunc} from '../lib/utils';
import numberFormat from '../lib/numberformat';
import InjectionListInfo from './InjectionListInfo.react';
import InjectionListNoInjection from './InjectionListNoInjection.react';

export default class InjectionList extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            caption: '',
            start: 0,
            limit: 20,
            injections: app.injections,
            filterType: null,
            filterByIntelliSearch: '',
            showHint: false,
            showAnalytic: false,
            showHighRes: false,
            injectionToHint: null,
            showHelp: false
        }
        this.filterTimeout = null;
        this.filterState = this.getDefaultFilterState();
        _.bindAll(this, 'handleChange', 'handleRemoveFilter', 'handleUpdateIntelliSearch',
                  'handleFilterByIntelliSearch', 'handleIntelliSearchKeyUp',
                  'handleModalShow', 'handleModalHide',
                  'handleFilterByRegion',
                  'handlePopInjectionModal',
                  'handlePopIntelliFilter',
                  'handleShowIntelliHelp',
                  'handleHideIntelliHelp',

                 );
    }
    getDefaultFilterState() {
        return {
            conditionProcessed: false,
            injHint: []
        };
    }
    componentDidMount() {
        AppStore.addChangeListener(this.handleChange);
        Actions.flipInjectionListPage(this.state.start, this.state.limit);
        AppStore.on('show_injection', () => {
            let inj = AppStore.getInjectionToHighlight();
            this.setState({
                showHint: true,
                injectionToHint: inj
            });
        });
        AppStore.on('hide_injection', () => {
            this.setState({showHint: false});
        });
        AppStore.on('show_high_res', () => {
            this.setState({
                showHighRes: true,
            });
        });
        AppStore.on('hide_high_res', () => {
            this.setState({showHighRes: false});
        });
        AppStore.on('show_analytic', () => {
            let _inj = AppStore.getInjectionToHighlight();
            fetch('/api/v1/flne_injections?injection_id=' + _inj.case_id + '-' + _inj.tracer)
            .then(function(response) {
                if (response.status >= 400) {
                    throw new Error('bad response from api');
                }
                return response.json();
            })
            .then(data => {
                this.setState({flne_data: data});

            });
            this.setState({
                showAnalytic: true,
                injectionToHint: _inj,
                flne_data: null
            });
        });
        AppStore.on('hide_analytic', () => {
            this.setState({showAnalytic: false});
        });
        AppStore.on('show_modal', () => {
            let modal = AppStore.getModal();
            if (modal.window == 'metadata') {
                this.setState({
                    showHint: true,
                    //injectionToHint: inj
                    injectionToShow: modal.injection
                }, () => {
                    //this.modal.show();
                });
            }
        });
        AppStore.on('hide_modal', () => {
            let modal = AppStore.getModal();
            if (modal.window == 'metadata') {
                this.setState({
                    showHint: false,
                    //injectionToHint: inj
                    injectionToShow: null
                }, () => {
                    //this.modal.show();
                });
            }
        });
    }

    componentWillUnmount() {
        AppStore.removeChangeListener(this.handleChange);
    }
    handleUpdateIntelliSearch(e) {
        let value = e.target.value;
        //window.clearTimeout(this.filterTimeout);
        //this.filterTimeout = window.setTimeout(function() {
        //    this.filterTimeout = null;
        //    Actions.filterInjectionListByCaseID(value);
        //}, 500);
        this.setState({
            filterByIntelliSearch: value
        });
    }
    handleFilterByIntelliSearch(e) {
        Actions.hideModal('metadata');
        let value = this.state.filterByIntelliSearch;
        Actions.pushIntelliFilter(value);
        Actions.filterInjectionListByIntelliSearch(value);
        //window.clearTimeout(this.filterTimeout);
        //this.filterTimeout = window.setTimeout(function() {
        //    this.filterTimeout = null;
        //}, 500);
    }
    handleFilterByRegion(e) {
        Actions.hideModal('metadata');
        let value = e.currentTarget.getAttribute('data-region');
        Actions.pushIntelliFilter('area:' + value);
        Actions.filterInjectionListByIntelliSearch('area:' + value);
        //window.clearTimeout(this.filterTimeout);
        //this.filterTimeout = window.setTimeout(function() {
        //    this.filterTimeout = null;
        //}, 500);
    }
    handleIntelliSearchKeyUp(e) {
        if (e.key === 'Enter') {
            this.handleFilterByIntelliSearch();
        }

    }
    handleModalShow(e) {
        this.modal.show();
    }
    handleModalHide(e) {
        Actions.hideModal('injection');
    }
    handlePopInjectionModal() {
        let inj = AppStore.getCurrentInjectionModal();
        Actions.popInjectionModal(inj);
        if (inj) {
            if (AppStore.getCurrentInjectionModal()) {
                Actions.showModal('metadata', inj);
            } else {
                Actions.hideModal();
            }
        } else {
            Actions.hideModal();
        }
    }
    handlePopIntelliFilter() {
        Actions.popIntelliFilter();
        //Actions.popInjectionModal();
        Actions.hideModal();
    }
    handleShowIntelliHelp() {
        this.setState({
            showHelp: true
        });
    }
    handleHideIntelliHelp() {
        this.setState({
            showHelp: false
        });
    }
    renderSummary() {
        if (!this.state.filterByIntelliSearch) {
            let result = _(this.state.injections)
                .groupBy('region_id')
                .map((items, name) => ({ name, count: items.length }))
                .value();
            return (<span className="injection-summary">Showing {this.state.injections.length} injections</span>);
            //return (<span className="injection-summary"> {this.state.injections.length} injections into {result.length} areas available</span>);
        } else {
            return null;
        }
    }
    handleRemoveFilter(e) {
        Actions.removeFilter($(e.target).data('filter'));
        Actions.hideModal('metadata');
        Actions.clearIntelliFilter();
        //Actions.filterInjectionListByIntelliSearch('');
    }
    handleChange() {
        let filter = AppStore.getFilter();
        if (filter.filterByIntelliSearch === null) {
            filter.filterByIntelliSearch = '';
        }
        this.setState(filter);

        if (filter.filterType == 'injection') {
            let injection = filter.filterByInjection;
            let region = _.find(app.regions, {id: injection.region_id});
            let injections = _.filter(app.injections, {region_id: region.id});
            injections = _.reject(injections, {id: injection.id});
            this.setState({
                //caption: 'Other injections in area ' + region.name,
                injections: injections
            });
        } else if (filter.filterType == 'region') {
            let region = filter.filterByRegion;
            let injections = null;
            injections = _.filter(app.injections, {region_id: region.id});
            this.setState({
                //caption: 'Injections in area ' + filter.filterByRegion.name,
                injections: injections
            });
        } else if (filter.filterType === 'intelli_search' && filter.filterByIntelliSearch) {
            let term = filter.filterByIntelliSearch;
            term = term.replace(/: +/g, ':')
            //let regex_term = escapeRegExp(term);

            let injections = _.filter(app.injections, getInjectionTestFunction(term));

            this.setState({
                //caption: 'Injections matches search term ' + term,
                injections: injections
            });
        } else if (filter.filterType === null) {
            let injections = app.injections;
            this.setState({
                caption: ' ', // TODO List of all Injections empty space
                injections: injections
            });
        } else {
            let injections = app.injections;
            this.setState({
                caption: ' ', // TODO List of all Injections empty space
                injections: injections
            });
        }
    }
    renderAnalytics() {
        let _inj = this.state.injectionToHint;
        if (_inj) {
            if (this.state.flne_data) {
                let data = this.state.flne_data;
                let flne_data = [];
                _.each(data.areas, area => {
                    let elem = {};
                    _.each(data.headers, (k, i) => {
                        elem[k] = area[i];
                    });
                    flne_data.push(elem);
                });
                flne_data = _.reverse(_.sortBy(flne_data, 'flne'));
                let top5 = _.slice(flne_data, 0, 5);
                let total_cells = _.sumBy(flne_data, 'cell_count');
                let min = _.minBy(flne_data, 'log10_flne').log10_flne;
                let max = _.maxBy(flne_data, 'log10_flne').log10_flne;
                min = -5;
                max = 0;
                let widthFunc = getBarWidthFunc(min, max, 120);
                let colorFunc = getLogColorFunc();
                return (
                    <div className={classNames('injection-analytic', {hidden: !this.state.showAnalytic})}>
                        Connectivity profile for the <span className="bold">{_inj.injection_id}</span> injection.<br/>
                        Projections from {numberFormat(flne_data.length)} areas found, {numberFormat(total_cells, 0, '.', '\u2009')} cells detected.<br/>
                        <span className="top5">Five strongest projections, log<sub>10</sub>(FLNe):</span>
                        <table className="injection-strength">
                            <tbody>
                                {_.map(top5, v => (
                                    <tr key={_inj.injection_id + '-' + v.source}>
                                        <td>{v.source}</td>
                                        <td>
                                            <div className="summary-flne">
                                                <div className="summary-flne-bar"
                                                    style={{
                                                        backgroundColor: colorFunc(v.log10_flne),
                                                        width: widthFunc(v.log10_flne) + 'px'
                                                    }}></div>
                                                <div className="summary-flne-value">{v.log10_flne.toFixed(2)}</div>
                                            </div>
                                        </td>
                                    </tr>
                                    ))
                                }
                            </tbody>
                        </table>
                        <span className="many-more"><span className="bold">Click</span> for detailed analysis.</span>
                        <div></div>
                    </div>
                );
            } else {
                return (
                    <div className={classNames('injection-analytic', 'align-center', {hidden: !this.state.showAnalytic})}>
                        <div className="loading-text">Loading the data, just a moment...</div> <img src={'/static/images/ajax-sml.gif'} />
                    </div>
                );
            }
        } else {
            return null;
        }
    }
    /**
     * @return {object}
     */
    render() {
        var start = this.state.start;
        var limit = this.state.limit;
        var injection_count = 0;
        // get all injections
        /*
        let injections = _.orderBy(this.state.injections, function(a, b) {
            return true;
        });*/

        this.filterState = this.getDefaultFilterState();
        let injections = _.clone(this.state.injections);
        injections.sort(sortInjection);
        let content, modal_content;
        if (injections.length > 0) {
            let remove_filter = (<span className={classNames('remove-filter', {'hidden': this.state.filterType === null})} data-filter="region" onClick={this.handleRemoveFilter} >(Remove filter)</span>);
            remove_filter = null;
            let flatmap_img, flatmap_caption;
            if (this.state.injectionToHint) {
                let _inj = this.state.injectionToHint;
                flatmap_img = (<img src={'//flatmap.marmosetbrain.org/flatmap-quarter/' + _inj.case_id + '/' + _inj.tracer + '.jpg'} width="291" height="275" />);
                //flatmap_caption = _inj.case_id + '-' + _inj.tracer;
                let s = _inj.display_name + '-' + _inj.tracer;
                let cond;
                let hint;
                if (_inj.matchcond && 'injection_id' in _inj.matchcond) {
                    cond = _inj.matchcond['injection_id'];
                    _.each(cond, (cond) => {
                        s.replace(new RegExp('^(.*?)(' + cond + ')(.*?)$', 'i'), function(match, p1, p2, p3) {
                            hint = (<span key={_inj.id + cond} className="match-cond">Injection: {p1}<strong>{p2}</strong>{p3}</span>);
                        });
                        this.filterState.injHint.push(hint)
                    });
                } else {
                    this.filterState.injHint.push(<span key={_inj.id} className="match-cond">Injection: {s}</span>);
                }
                _.each(['case_id', 'region_name', 'region', 'memo', 'tracer'], (cond_key) => {
                    //for (let cond_key in _inj.matchcond)

                    if (!_inj.matchcond) { return; }
                    cond = _inj.matchcond[cond_key];
                    if (!cond) {
                        return;
                    }
                    let cond_shown = false;
                    _.each(cond, (cond) => {
                        cond = escapeRegExp(cond.replace(/^[a-zA-Z\-_]+:/, ''));
                        if (!this.filterState.conditionProcessed) {
                            hint = getInjectionFilterHint(cond_key, cond, _inj, this.filterState);
                        }
                    });
                });
            }
            let injection_info;
            //if (this.state.injectionToShow && /^detail:/i.test(this.filterState.filterByIntelliSearch)) {
            let intelliFilter = AppStore.getCurrentIntelliFilter();
            if (/^detail:/i.test(intelliFilter)) {
                //let inj = this.state.injectionToShow;
                //let inj = AppStore.getCurrentInjectionModal();
                let match = intelliFilter.match(/^detail:(.*)$/i);
                if (match) {
                    let inj = _.find(app.injections, {injection_id: match[1]});
                    content = (
                        <div id="other-injection-caption" className="injection-caption">
                            <InjectionListInfo injection={inj}/>
                        </div>
                    );
                } else {
                    content = null;
                }
            } else {
                let _inj = this.state.injectionToShow;
                //{this.filterState.injHint}
                content = (
                    <div id="other-injection-caption" className="injection-caption">
                        {injection_info}
                        {this.renderSummary()}
                        {this.renderFilteredTitle()}
                        <table className="table table-bordered injection-table-view">
                            {null && <caption>{this.state.caption} {remove_filter}</caption>}
                            <thead>
                                <tr><th>Area</th><th>Injection</th><th>Actions</th></tr>
                            </thead>
                            <tbody>
                                {_.slice(injections, start, start + limit).map(function(v) {return <InjectionListItem key={v.id} injection={v} />})}
                            </tbody>
                        </table>
                        <InjectionPager injections={injections} start={start} limit={limit} />
                        <div className={classNames('injection-high-res', {hidden: !this.state.showHighRes})}>
                            <strong>Click</strong> to launch a high resolution image viewer in a new window.
                        </div>
                        <div className={classNames('injection-filter-hint', {hidden: !this.state.showHint})}>
                            <strong>Click</strong> to show injection details.
                            <div></div>
                        </div>
                        {this.renderAnalytics()}
                    </div>
                );
            }
            let modal = AppStore.getModal();
            let inj = this.state.injectionToShow;
            modal_content = <MetadataModal injection={inj} />;
            /* region picked */
            //{this.renderFilteredTitle()}
            //<div>There is no {app.injection_picked ? 'other ': ''} injection in area <i>{app.region_picked.name}</i></div>

        } else {
            let intelliFilter = AppStore.getCurrentIntelliFilter();
            if (app.region_picked) {
                content = (
                    <div id="other-injection-caption" className="injection-caption">
                        <InjectionListNoInjection area={app.region_picked} />
                    </div>
                );
            } else if (/^area:/i.test(intelliFilter)) {
                let match = intelliFilter.match(/^area:(.*)$/i);
                let region = _.find(app.regions, {code: match[1]});
                content = (
                    <div id="other-injection-caption" className="injection-caption">
                        <InjectionListNoInjection area={region} />
                    </div>
                );
            } else {
                content = (
                    <div id="other-injection-caption" className="injection-caption">
                        {this.renderFilteredTitle()}
                        <div className="no-injection">There are no injections match filter.</div>
                    </div>
                );
            }
        }
        //<div className="search-title">{this.renderSummary()}</div>
        return (
            <div className="injection-list other-injection-list">
                <input type="text" placeholder="Type any criteria to filter the list..." className="input-intelli-search" onChange={this.handleUpdateIntelliSearch} onKeyUp={this.handleIntelliSearchKeyUp} value={this.state.filterByIntelliSearch} />
                <i className="fa fa-question help"
                    onMouseEnter={this.handleShowIntelliHelp}
                    onMouseLeave={this.handleHideIntelliHelp}
                    ></i>
                <i onClick={this.handleFilterByIntelliSearch} className="search-icon" title="Click to search.">&#x1F50D;</i>
                <i onClick={this.handleRemoveFilter} className="clear-search" title="Clear search conditions.">&#x00d7;</i>
                <div className={classNames('intelli-help', {hidden: !this.state.showHelp})}>
                    <div>Type criteria to filter the injections.</div>
                    <div>Unless otherwise specified, the search is case insensitive and matches anything starts with the keyword.</div>
                    <ul>
                        <li><div className="title">Generic search:</div>
                            <strong>V1</strong> shows all possible matches to the keyword V1.
                        </li>
                        <li><div className="title">Filter By Case:</div>
                            <strong>case:CJ73-DY</strong> shows injections match the unique case id assigned to the injection;<br/>
                            <strong>case:CJ73</strong> shows all injections for animal CJ73.
                        </li>
                        <li><div className="title">Filter By Area:</div>
                            <strong>area:V1</strong> shows injections into area V1.
                        </li>
                        <li><div className="title">Filter By Tracer:</div>
                            <strong>tracer:FB</strong> shows injections with tracer Fast Blue.
                        </li>
                        <li><div className="title">Filter By Memo:</div>
                            <strong>memo:bleed</strong> shows injections which contains word <strong>bleed</strong> in the memo.
                        </li>
                        <li><div className="title">Combined criteria:</div>
                            <strong>area:V1 &amp; tracer:FB</strong> shows injections in V1 and the tracer is Fast Blue;<br/>
                            <strong>area:V1 | area:V2 | area:V3</strong> shows injections in V1, V2 and V3.<br/>
                            Combined use of <strong>&amp;</strong> and <strong>|</strong> operators are not supported.
                        </li>
                    </ul>

                </div>
                {content}
                <Modal ref={modal => this.modal = modal} modalStyle={modalStyle} onHide={this.handleModalHide}>
                    {modal_content}
                </Modal>
            </div>
        );
    }
    renderFilteredTitle() {
        if (this.state.filterByIntelliSearch) {
            let jump_href = '';
            let inj = {
                injection_id: '',
                tracer: '',
            };
            let _f = this.state.filterByIntelliSearch;
            let humanReadableFilter;
            let filterExplanation;
            let explains = [];
            let last_term = null;
            if (_f.indexOf('|') >=0 && _f.indexOf('&') >=0) {
                explains.push(<span className="explain" key="operator-limitation">Using of both | and &amp; operator is not supported</span>);
            } else if (_f.indexOf('|') >= 0) {
                _.each(_f.split('|'), (_ft, idx) => {
                    _ft = _.trim(_ft);
                    let term = null;
                    if (/^area:/i.test(_ft)) {
                        humanReadableFilter = _ft.replace(/^area:/i, '');
                        /* find the region name */
                        let region = _.find(app.regions, r => {
                            let reg = new RegExp('^' + humanReadableFilter + '$', 'i');
                            if (reg.test(r.code)) {
                                return true;
                            }
                        });
                        let title;
                        if (region) {
                            title = region.name;
                        } else {
                            title = null;
                        }
                        if (last_term !== 'area') {
                            term = 'injection into';
                        }
                        if (idx === 0) {
                            explains.push(<span className="explain" key={'title-' + idx}>Injections into <span className="bold-title" title={title}>{humanReadableFilter}</span>
                            </span>);
                        } else {
                            explains.push(
                                <span className="explain" key={'title-' + idx}> or {term} <span className="bold-title" title={title}>{humanReadableFilter}</span></span>
                            );
                        }
                        last_term = 'area';

                    } else if (/^tracer:/i.test(_ft)) {
                        humanReadableFilter = _ft.replace(/^tracer:/i, '');
                        let title = null;
                        if (last_term !== 'tracer') {
                            term = 'tracer type';
                        }
                        if (idx === 0) {
                            explains.push(<span className="explain" key={'tracer-' + idx}>Tracer type: <span className="bold-title" title={title}>{humanReadableFilter}</span></span>);
                        } else {
                            explains.push(<span className="explain" key={'tracer-' + idx}> or {term} <span className="bold-title" title={title}>{humanReadableFilter}</span></span>);
                        }
                        last_term = 'tracer';
                    } else if (/^memo:/i.test(_ft)) {
                        humanReadableFilter = _ft.replace(/memo:/i, '');
                        let title = null;
                        if (last_term !== 'memo') {
                            term = 'comment contains';
                        }
                        if (idx === 0) {
                            explains.push(<span className="explain" key={'memo-' + idx}>Comment contains: <span className="bold-title" title={title}>{humanReadableFilter}</span></span>);
                        } else {
                            explains.push(<span className="explain" key={'memo-' + idx}> or {term} <span className="bold-title" title={title}>{humanReadableFilter}</span></span>);
                        }
                        last_term = 'memo';
                    } else if (/^injection:/i.test(_ft) || /^case:/i.test(_ft)) {
                        humanReadableFilter = _ft.replace(/^injection:/i, '');
                        humanReadableFilter = humanReadableFilter.replace(/^case:/i, '');
                        let title = null;
                        if (last_term !== 'injection') {
                            term = 'injection';
                        }
                        if (idx === 0) {
                            explains.push(<span className="explain" key={'injection-' + idx}>Injection: <span className="bold-title" title={title}>{humanReadableFilter}</span></span>);
                        } else {
                            explains.push(<span className="explain" key={'injection-' + idx}>or {term} <span className="bold-title" title={title}>{humanReadableFilter}</span></span>);
                        }
                        last_term = 'injection';
                    } else {
                        humanReadableFilter = _ft.replace(/memo:/i, '');
                        if (last_term !== 'generic') {
                            term = 'searching for';
                        }
                        if (idx === 0) {
                            explains.push(<span className="explain" key={'generic-' + idx}>Searching for: <strong>{humanReadableFilter}</strong></span>);
                        } else {
                            explains.push(<span className="explain" key={'generic-' + idx}> or {term}<strong>{humanReadableFilter}</strong></span>);
                        }
                        last_term = 'generic';
                    }
                });
            } else {
                _.each(_f.split('&'), (_ft, idx) => {
                    _ft = _.trim(_ft);
                    let term = null;
                    if (/^area:/i.test(_ft)) {
                        humanReadableFilter = _ft.replace(/^area:/i, '');
                        /* find the region name */
                        let region = _.find(app.regions, r => {
                            let reg = new RegExp('^' + humanReadableFilter + '$', 'i');
                            if (reg.test(r.code)) {
                                return true;
                            }
                        });
                        let title;
                        if (region) {
                            title = region.name;
                        } else {
                            title = null;
                        }
                        if (last_term !== 'area') {
                            term = 'injection into';
                        }
                        if (idx === 0) {
                            explains.push(<span className="explain" key={'area-' + idx}>Injections into <span className="bold-title" title={title}>{humanReadableFilter}</span>
                            </span>);
                        } else {
                            explains.push(
                                <span className="explain" key={'area-' + idx}> and {term} <span className="bold-title" title={title}>{humanReadableFilter}</span></span>
                            );
                        }
                        last_term = 'area';

                    } else if (/^tracer:/i.test(_ft)) {
                        humanReadableFilter = _ft.replace(/^tracer:/i, '');
                        let title = null;
                        if (last_term !== 'tracer') {
                            term = 'tracer type';
                        }
                        if (idx === 0) {
                            explains.push(<span className="explain" key={'tracer-' + idx}>Tracer type: <span className="bold-title" title={title}>{humanReadableFilter}</span></span>);
                        } else {
                            explains.push(<span className="explain" key={'tracer-' + idx}> and {term} <span className="bold-title" title={title}>{humanReadableFilter}</span></span>);
                        }
                        last_term = 'tracer';
                    } else if (/^memo:/i.test(_ft)) {
                        humanReadableFilter = _ft.replace(/memo:/i, '');
                        let title = null;
                        if (last_term !== 'memo') {
                            term = 'comment contains';
                        }
                        if (idx === 0) {
                            explains.push(<span className="explain" key={'memo-' + idx}>Comment contains: <span className="bold-title" title={title}>{humanReadableFilter}</span></span>);
                        } else {
                            explains.push(<span className="explain" key={'memo-' + idx}> and {term} <span className="bold-title" title={title}>{humanReadableFilter}</span></span>);
                        }
                        last_term = 'memo';
                    } else if (/^injection:/i.test(_ft) || /^case:/i.test(_ft)) {
                        humanReadableFilter = _ft.replace(/^injection:/i, '');
                        humanReadableFilter = humanReadableFilter.replace(/^case:/i, '');
                        let title = null;
                        if (last_term !== 'injection: ') {
                            term = 'injection';
                        }
                        if (idx === 0) {
                            explains.push(<span className="explain" key={'injection-' + idx}>Injection: <span className="bold-title" title={title}>{humanReadableFilter}</span></span>);
                        } else {
                            explains.push(<span className="explain" key={'injection-' + idx}> and {term} <span className="bold-title" title={title}>{humanReadableFilter}</span></span>);
                        }
                        last_term = 'injection';
                    } else {
                        humanReadableFilter = _ft.replace(/memo:/i, '');
                        if (last_term !== 'generic') {
                            term = 'searching for';
                        }
                        if (idx === 0) {
                            explains.push(<span className="explain" key={'generic-' + idx}>Searching for: <strong>{humanReadableFilter}</strong></span>);
                        } else {
                            explains.push(<span className="explain" key={'generic-' + idx}> and {term} <strong>{humanReadableFilter}</strong></span>);
                        }
                        last_term = 'generic';
                    }
                });
            }
            filterExplanation = (
                <div className="filter-explain">{explains}
                    <div className="hide-detail-icon"
                        data-onClick1={this.handlePopInjectionModal}
                        onClick={this.handlePopIntelliFilter}
                        title="Click to go back."
                        >&#x21b6;</div>
                </div>);
            /*
            if (/^area:/i.test(_f)) {
                humanReadableFilter = _f.replace(/^area:/i, '');
                window.app = app;
                let region = _.find(app.regions, r => {
                    let reg = new RegExp('^' + humanReadableFilter + '$', 'i');
                    if (reg.test(r.code)) {
                        return true;
                    }
                });
                let title;
                if (region) {
                    title = region.name;
                } else {
                    title = null;
                }
                filterExplanation = (
                    <div className="filter-explain">Injections into <span className="bold-title" title={title}>{humanReadableFilter}</span>
                        <div className="hide-detail-icon"
                            data-onClick1={this.handlePopInjectionModal}
                            onClick={this.handlePopIntelliFilter}
                            title="Close the details panel"
                            >&#x21b6;</div>
                    </div>);

            } else if (/^tracer:/i.test(_f)) {
                humanReadableFilter = _f.replace(/^tracer:/i, '');
                let title = null;
                filterExplanation = (<div className="filter-explain">Tracer type: <span className="bold-title" title={title}>{humanReadableFilter}</span></div>);
            } else if (/^memo:/i.test(_f)) {
                humanReadableFilter = _f.replace(/memo:/i, '');
                let title = null;
                filterExplanation = (<div className="filter-explain">Comment contains: <span className="bold-title" title={title}>{humanReadableFilter}</span></div>);
            } else if (/^injection:/i.test(_f) || /^case:/i.test(_f)) {
                humanReadableFilter = _f.replace(/^injection:/i, '');
                humanReadableFilter = humanReadableFilter.replace(/^case:/i, '');
                let title = null;
                filterExplanation = (<div className="filter-explain">Injection: <span className="bold-title" title={title}>{humanReadableFilter}</span></div>);
            } else {
                humanReadableFilter = _f.replace(/memo:/i, '');
                filterExplanation = (<div className="filter-explain">Searching for: <strong>{humanReadableFilter}</strong></div>);

            */
            return (
                <div className="injection-filter-caption">
                    {filterExplanation}
                    {null &&
                        <div className="hide-detail-icon"
                        onClick={this.handleModalHide}
                        title="Close the details panel"
                        >&#x21b6;</div>
                    }
                </div>);
        } else {
            return null;
            //<div className="injection-filter-caption"></div>;
        }
    }
}
