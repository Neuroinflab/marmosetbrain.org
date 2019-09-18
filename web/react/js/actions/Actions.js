import AppDispatcher from '../dispatcher/AppDispatcher';
export default class Actions {
    /**
     * @param  {object} inj
     */
    static highlightInjection(inj) {
        AppDispatcher.dispatch({
            actionType: 'HIGHLIGHT_INJECTION',
            injection: inj
        });
    }
    static highlightRegion(region) {
        AppDispatcher.dispatch({
            actionType: 'HIGHLIGHT_REGION',
            region: region
        });
    }
    static removeTip() {
        AppDispatcher.dispatch({
            actionType: 'REMOVE_TIP',
        });
    }
    static filterInjectionListByInjection(injection) {
        AppDispatcher.dispatch({
            actionType: 'FILTER_INJECTION_LIST_BY_INJECTION',
            injection: injection
        });
    }
    static filterInjectionListByRegion(region) {
        AppDispatcher.dispatch({
            actionType: 'FILTER_INJECTION_LIST_BY_REGION',
            region: region
        });
    }
    static filterInjectionListByIntelliSearch(term) {
        AppDispatcher.dispatch({
            actionType: 'FILTER_INJECTION_LIST_BY_INTELLI_SEARCH',
            term: term
        });
    }
    static flipInjectionListPage(start, limit) {
        AppDispatcher.dispatch({
            actionType: 'FLIP_INJECTION_LIST_PAGE',
            start: start,
            limit: limit
        });
    }
    static restoreFilter() {
        AppDispatcher.dispatch({
            actionType: 'RESTORE_FILTER'
        });
    }
    static showFlatmap() {
        AppDispatcher.dispatch({
            actionType: 'SHOW_FLATMAP'
        });
    }
    static hideFlatmap() {
        AppDispatcher.dispatch({
            actionType: 'HIDE_FLATMAP'
        });
    }
    static restoreViewerState() {
        AppDispatcher.dispatch({
            actionType: 'RESTORE_VIEWER_STATE'
        });
    }
    static saveViewerState(viewerState) {
        AppDispatcher.dispatch({
            actionType: 'SAVE_VIEWER_STATE',
            viewerState: viewerState
        });
    }
    static removeFilter(filter) {
        AppDispatcher.dispatch({
            actionType: 'REMOVE_FILTER',
            filter: filter
        });
    }
    static showInjectionListHint(injection) {
        AppDispatcher.dispatch({
            actionType: 'SHOW_INJECTION_LIST_HINT',
            injection: injection,
        });
    }
    static hideInjectionListHint(injection) {
        AppDispatcher.dispatch({
            actionType: 'HIDE_INJECTION_LIST_HINT',
            injection: injection
        });
    }
    static showAnalytic(injection) {
        AppDispatcher.dispatch({
            actionType: 'SHOW_ANALYTIC',
            injection: injection
        });
    }
    static hideAnalytic(injection) {
        AppDispatcher.dispatch({
            actionType: 'HIDE_ANALYTIC'
        });
    }
    static showInjectionHighRes(injection) {
        AppDispatcher.dispatch({
            actionType: 'SHOW_HIGH_RES',
            injection: injection
        });
    }
    static hideInjectionHighRes(injection) {
        AppDispatcher.dispatch({
            actionType: 'HIDE_HIGH_RES'
        });
    }
    static showModal(modalWindow, data) {
        AppDispatcher.dispatch({
            actionType: 'SHOW_MODAL',
            modalWindow: modalWindow,
            data: data
        });
    }
    static hideModal(modalWindow) {
        AppDispatcher.dispatch({
            actionType: 'HIDE_MODAL',
            modalWindow: modalWindow
        });
    }
    static pickArea(area) {
        AppDispatcher.dispatch({
            actionType: 'PICK_AREA',
            area: area
        });
    }
    static stackInjectionModal(injection) {
        AppDispatcher.dispatch({
            actionType: 'STACK_INJECTION_MODAL',
            injection: injection
        });
    }
    static popInjectionModal(inj) {
        AppDispatcher.dispatch({
            actionType: 'POP_INJECTION_MODAL',
            injection: inj
        });
    }
    static setCurrentInjectionModal(inj) {
        AppDispatcher.dispatch({
            actionType: 'SET_CURRENT_INJECTION_MODAL',
            injection: inj
        });
    }
    static pushIntelliFilter(filter) {
        AppDispatcher.dispatch({
            actionType: 'PUSH_INTELLI_FILTER',
            filter: filter
        });
    }
    static popIntelliFilter() {
        AppDispatcher.dispatch({
            actionType: 'POP_INTELLI_FILTER',
        });

    }
    static clearIntelliFilter() {
        AppDispatcher.dispatch({
            actionType: 'CLEAR_INTELLI_FILTER',
        });
    }
}
