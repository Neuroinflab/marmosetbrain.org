import Actions from '../actions/Actions';
import './controls/annotation';
import './controls/buttons';
import './controls/nav';
import './controls/parcellation';

class CustomControls {
    constructor() {
        if (app.route_name == 'section.view') {
        }
    }
}
let customControls = new CustomControls();
export default customControls;
