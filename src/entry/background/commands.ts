import { SC_TRANSLATE } from '../../constants/commandsName';
import { sendTabsTranslateCommandKeyPressed } from '../../public/send';
import { getCurrentTab } from '../../public/utils';

chrome.commands.onCommand.addListener((cmd) => {
    switch (cmd) {
        case SC_TRANSLATE:
            getCurrentTab(tab => tab?.id !== undefined && sendTabsTranslateCommandKeyPressed(tab.id));
            break;
        default:
            break;
    }
});
