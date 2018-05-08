import React, { PropTypes, Component } from 'react'
import Grid from './Grid'
import Settings from './Settings'
import SettingsGrid from './SettingsGrid'
import Chart from './Chart'
import Caption from './Caption'
import ReactModal from 'react-modal'
import { connect } from 'react-redux'

class Container extends Component {

    static propTypes = {};

    constructor () {
        super();
        this.state = {
            isOpen: false,
            tab: 'grid',
            showModal: false
        }

        this.handleOpenModal = this.handleOpenModal.bind(this);
        this.handleCloseModal = this.handleCloseModal.bind(this);
    }



    handleSettingsShow = () => {
        const {isOpen} = this.state
        isOpen ? this.setState ({isOpen: false}) : this.setState ({isOpen: true})
    }

    handlePseudoTabs = (tabName) => {
        const {tab} = this.state;
        (tab != tabName) ? this.setState({tab: tabName}) : null
    }

    handleOpenModal () {
        this.setState({ showModal: true });
    }

    handleCloseModal () {
        this.setState({ showModal: false });
    }

    render() {
        const {isOpen, tab} = this.state;

        const settings = isOpen ? <Settings handleSettingsShow = {this.handleSettingsShow} /> : null

        const pseudoTabs = (tab == 'grid') ? <Grid /> : (tab == 'chart') ? <Chart/> : null

        const settingsGrid = (!isOpen) ? <SettingsGrid handlePseudoTabs = {this.handlePseudoTabs} activeTab = {this.state.tab} handleSettingsShow = {this.handleSettingsShow}/> : null

        const settingsCompositionFavorite = this.props.settingsCompositionFavorite;

        let bodyPopularReports = '';
        let btnPopularReports = null;

        if(settingsCompositionFavorite && settingsCompositionFavorite.length) {

            bodyPopularReports = settingsCompositionFavorite.map(function (item) {
                return <p><a href={'/reports/dynamic?'+item.url}>{item.title}</a></p>;
            })

            btnPopularReports = <span className="button button_content_popular-reports" onClick={this.handleOpenModal}>
                <i className="icon icon-star"/>
                Популярные отчеты
            </span>
        }

        return (
                <div>
                    <div className="portlet box grey">
                        <div className="portlet-title portlet-title_content_dynamic-reports">
                            <Caption/>
                            <div className="actions">
                                <span className="button button_content_settings-report btn" onClick={this.handleSettingsShow}>
                                    <i className="icon icon-wrench"/>
                                    Фильтр
                                </span>
                                {btnPopularReports}
                            </div>
                            <div className="clear"></div>
                        </div>
                        <div className="portlet-body">
                            {settings}
                            {settingsGrid}
                            { pseudoTabs }
                        </div>
                    </div>

                    <ReactModal
                        isOpen={this.state.showModal}
                        contentLabel="Minimal Modal Example"
                        style={{
                            overlay: {
                                backgroundColor: 'rgba(0, 0, 0, 0.75)',
                                zIndex: '99'
                            },
                            content : {
                                left: '50%',
                                top: '50%',
                                right: 'auto',
                                bottom: 'auto',
                                transform: 'translate(-50%, -50%)',
                                minWidth: '300px'
                            }
                        }}
                    >
                        <span className="modal__close" onClick={this.handleCloseModal}></span>
                        <h2 className="modal__title">Популярные отчеты</h2>
                        { bodyPopularReports }
                    </ReactModal>

                </div>
        );
    }
};

export default connect(state=>({
    settingsCompositionFavorite: state.settingsComposition.favorite
}))(Container);
