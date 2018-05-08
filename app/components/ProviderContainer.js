import React, {
    Component,
    PropTypes,
} from 'react';
import { Provider } from 'react-redux';
import store from '../store';
import Container from './Container'

class ProviderContainer extends Component {
    render() {
        return (
            <Provider store = {store}>
                <Container/>
            </Provider>
        );
    }
}

ProviderContainer.propTypes = {};
ProviderContainer.defaultProps = {};

export default ProviderContainer;

