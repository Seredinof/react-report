const rootElem = document.getElementById('reactReport');
const dataSettingsComposition = JSON.parse(rootElem.getAttribute('data-settings-composition'))

const defaultSettingsComposition = {
    ...dataSettingsComposition
};

export default ( settingsComposition = defaultSettingsComposition, action) => {
    return settingsComposition
}
