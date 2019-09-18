import AppDispatcher from '../dispatcher/AppDispatcher';
import EventEmitter from 'events';
import _ from 'lodash';

let appState = {
    injectionToHighlight: undefined,
    regionToHighlight: undefined,
    filterType: null,
    filterByIntelliSearch: '',
    modal: {},
    areaPicked: null,
    injectionModalStack: [],
    currentInjectionModal: null,
    intelliFilterStack: []

};

class Store extends EventEmitter {
    constructor() {
        super();
    }

    getAll() {
        return appState;
    }

    emitChange() {
        this.emit('change');
    }

    /**
     * @param {function} callback
     */
    addChangeListener(callback) {
        this.on('change', callback);
    }

    /**
     * @param {function} callback
     */
    removeChangeListener(callback) {
        this.removeListener('change', callback);
    }

    addListener(event_id, callback) {
        this.on(event_id, callback);
    }
    getInjectionToHighlight() {
        return appState.injectionToHighlight;
    }
    getRegionToHighlight() {
        return appState.regionToHighlight;
    }
    getFilter() {
        return {
            filterType: appState.filterType,
            filterByInjection: appState.filterByInjection,
            filterByRegion: appState.filterByRegion,
            filterByIntelliSearch: appState.filterByIntelliSearch,
            start: appState.filterStart,
            limit: appState.filterLimit,
        }
    }
    setFilter(filter) {
        appState.filterType = filter.filterType;
        appState.filterByInjection = filter.filterByInjection;
        appState.filterByRegion = filter.filterByRegion;
        appState.filterByIntelliSearch = filter.filterByIntelliSearch;
        appState.start = filter.start;
        appState.limit = filter.limit;
    }
    getFlatmapOnState() {
        return appState.flatmapOn;
    }
    getViewerState() {
        return appState.viewerState;
    }
    setViewerState(viewerState) {
        appState.viewerState = viewerState;
    }
    getModal() {
        return appState.modal;
    }
    getAreaPicked() {
        return appState.areaPicked;
    }
    getInjectionModalStack() {
        return appState.injectionModalStack;
    }
    getCurrentInjectionModal() {
        return appState.currentInjectionModal;
    }
    getCurrentIntelliFilter() {
        return _.last(appState.intelliFilterStack);
    }
}

let appStoreInstance = new Store();

// Register callback to handle all updates
appStoreInstance.dispatchToken =  AppDispatcher.register(action => {
    switch(action.actionType) {
        case 'HIGHLIGHT_INJECTION':
            appState.injectionToHighlight = action.injection;
            appStoreInstance.emit('HIGHLIGHT_INJECTION');
            break;

        case 'HIGHLIGHT_REGION':
            appState.regionToHighlight = action.region;
            appStoreInstance.emit('HIGHLIGHT_REGION');
            break;

        case 'REMOVE_TIP':
            appStoreInstance.emit('REMOVE_TIP');
            break;

        case 'FILTER_INJECTION_LIST_BY_INJECTION':
            appState.filterType = 'injection';
            appState.filterByInjection = action.injection;
            appState.filterStart = 0;
            sessionStorage.setItem('filter', JSON.stringify(appStoreInstance.getFilter()));
            appStoreInstance.emitChange();
            break;

        case 'FILTER_INJECTION_LIST_BY_REGION':
            if (action.region) {
                appState.filterType = 'region';
                appState.filterByRegion = action.region;
            } else {
                appState.filterType = null;
                appState.filterByRegion = null;
            }
            appState.filterStart = 0;
            sessionStorage.setItem('filter', JSON.stringify(appStoreInstance.getFilter()));
            appStoreInstance.emitChange();
            break;

        case 'FILTER_INJECTION_LIST_BY_INTELLI_SEARCH':
            if (action.term) {
                appState.filterType = 'intelli_search';
                appState.filterByIntelliSearch = action.term;
            } else {
                appState.filterType = null;
                appState.filterByIntelliSearch = '';
            }
            appState.filterStart = 0;
            sessionStorage.setItem('filter', JSON.stringify(appStoreInstance.getFilter()));
            console.log('filter saved as', appStoreInstance.getFilter());
            appStoreInstance.emitChange();
            break;
        case 'RESTORE_FILTER':
            let filter = null;
            try {
                let storage_filter = sessionStorage.getItem('filter');
                if (storage_filter) {
                    filter = JSON.parse(storage_filter);
                    console.log('ok restore filter to', filter);
                    appStoreInstance.setFilter(filter);
                    appStoreInstance.emitChange();
                } else {
                    console.debug('no filter found in session storage, noop');
                }
            } catch (e) {
                console.debug('error found in filter restore', e);
            }
            break;

        case 'FLIP_INJECTION_LIST_PAGE':
            appState.filterStart = action.start;
            appState.filterLimit = action.limit;
            appStoreInstance.emitChange();
            break;

        case 'SHOW_FLATMAP':
            appState.flatmapOn = true;
            appStoreInstance.emitChange();
            break;

        case 'HIDE_FLATMAP':
            appState.flatmapOn = false;
            appStoreInstance.emitChange();
            break;

        case 'RESTORE_VIEWER_STATE':
            {
                let viewerState = null;
                try {
                    let storage_state = sessionStorage.getItem('viewerState');
                    if (storage_state) {
                        viewerState = JSON.parse(storage_state);
                        console.log('ok restore viewer state to', viewerState);
                        appStoreInstance.setViewerState(viewerState);
                    } else {
                        console.debug('no state found in session storage, noop');
                        appStoreInstance.setViewerState(null);
                    }
                } catch (e) {
                    console.debug('error found in viewer state restore', e);
                }
                appStoreInstance.emit('restore');
                appStoreInstance.emitChange();
            }
            break;

        case 'SAVE_VIEWER_STATE':
            {
                let viewerState = action.viewerState;
                let view = app.map.getView();
                let extent = view.calculateExtent(app.map.getSize());
                extent = extent.map(v => (v /= app.res));
                let dump_extent = extent.map(v => (v.toFixed(2))).join(',');
                //console.log('?override_extent=' + dump_extent);
                if (app.logged_in) {
                    $('#info_extent').text('?override_extent=' + dump_extent);
                }
                let parcel_opacity = null;
                if (app.parcel_layer) {
                    parcel_opacity = app.parcel_layer.getOpacity();
                } else {
                    parcel_opacity = app.parcel_opacity;
                }
                viewerState = {
                    parcellationDensity: app.parcel_opacity,
                    extent: extent,
                    lastView: Math.floor(new Date().getTime() / 1000),
                    lastCaseId: app.case_id
                };
                let storage_state = JSON.stringify(viewerState);
                sessionStorage.setItem('viewerState', storage_state); }
            break;

        case 'REMOVE_FILTER':
            {
                let filter = action.filter;
                if (filter == 'region') {
                    //appState.filterByInjection = null;
                    appState.filterByRegion = null;
                    appState.filterType = null;
                    appState.filterByIntelliSearch = '';
                } else {
                    appState.filterType = null;
                    appState.filterByIntelliSearch = '';
                }
                sessionStorage.setItem('filter', JSON.stringify(appStoreInstance.getFilter()));
                appStoreInstance.emitChange();
            }
            break;

        case 'SHOW_INJECTION_LIST_HINT':
            appStoreInstance.emitChange();
            appStoreInstance.emit('show_injection');
            //appState.hintInjection = action.injection;
            break;
        case 'HIDE_INJECTION_LIST_HINT':
            appStoreInstance.emit('hide_injection');
            //appState.hintInjection = action.injection;
            break;
        case 'SHOW_MODAL':
            appState.modal.window = action.modalWindow;
            appState.modal.injection = action.data;
            appStoreInstance.emit('show_modal');
            //appState.hintInjection = action.injection;
            break;
        case 'HIDE_MODAL':
            appStoreInstance.emit('hide_modal');
            break;
        case 'SHOW_ANALYTIC':
            appStoreInstance.emitChange();
            appStoreInstance.emit('show_analytic');
            break;
        case 'HIDE_ANALYTIC':
            appStoreInstance.emit('hide_analytic');
            break;
        case 'SHOW_HIGH_RES':
            appStoreInstance.emitChange();
            appStoreInstance.emit('show_high_res');
            break;
        case 'HIDE_HIGH_RES':
            appStoreInstance.emit('hide_high_res');
            break;
        case 'PICK_AREA':
            appState.areaPicked = action.area;
            break;
        case 'STACK_INJECTION_MODAL':
            {
                let inj = action.injection;
                let target = _.find(appState.injectionModalStack, {injection_id: inj.injection_id});
                if (target) {
                    appState.currentInjectionModal = target;
                } else {
                    appState.injectionModalStack.push(inj);
                    appState.currentInjectionModal = inj;
                }
                appStoreInstance.emitChange();
                break;
            }
        case 'POP_INJECTION_MODAL':
            let inj = action.injection;
            if (inj) {
                let index = _.indexOf(appState.injectionModalStack, {injection_id: inj.injection_id});
                let target = _.find(appState.injectionModalStack, {injection_id: inj.injection_id});
                _.pull(appState.injectionModalStack, target);
                index += 1;
                if (index < appState.injectionModalStack.length) {
                    appState.currentInjectionModal = appState.injectionModalStack[index];
                } else {
                    appState.currentInjectionModal = _.last(appState.injectionModalStack);
                }
                //appState.injectionModalStack.pop();
            } else {
                appState.injectionModalStack.pop();
            }
            appStoreInstance.emitChange();
            break;
        case 'SET_CURRENT_INJECTION_MODAL':
            appState.currentInjectionModal = action.injection;
            appStoreInstance.emitChange();
            break;
        case 'PUSH_INTELLI_FILTER':
            appState.intelliFilterStack.push(action.filter);
            appStoreInstance.emitChange();
            break;
        case 'POP_INTELLI_FILTER': {
            let _filter = appState.intelliFilterStack.pop();
            if (_filter) {
                console.log("filter stack before assign", appState.intelliFilterStack);
                appState.filterByIntelliSearch = _.last(appState.intelliFilterStack);
                if (!appState.filterByIntelliSearch) {
                    appState.filterByIntelliSearch = '';
                }
            } else {
                appState.filterByIntelliSearch = '';
                appState.filterType = null;
            }
            appStoreInstance.emitChange();
            break;
        }
        case 'CLEAR_INTELLI_FILTER': {
            _.remove(appState.intelliFilterStack);
            appState.filterByIntelliSearch = '';
            appState.filterType = null;
            appStoreInstance.emitChange();
            break;
        }
        default:
            // no op
            return;
    }
});

export default appStoreInstance;
