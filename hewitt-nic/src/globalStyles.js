import { ConfigProvider } from 'antd';
import globalThemes from './globalThemeSrc';

// Holds global styling parameters for ant design components 
const GlobalStylesProvider = () => {
    return (
        {
            components: {
            // style for buttons across the website
            Button: {
                defaultBorderColor: globalThemes().primaryColorlight,
                defaultBg: globalThemes().secondaryColorLight,
                defaultColor: globalThemes().lightNeutral,
    
                defaultHoverBorderColor: globalThemes().primaryColorDark,
                defaultHoverBg: globalThemes().secondaryColor,
                defaultHoverColor: globalThemes().lightNeutral,
            },
            Card: {
                // actionsBg: globalThemes().primaryColor,
                headerBg: globalThemes().primaryColorLight, 
                colorBgContainer: globalThemes().lightNeutral,
            },
            Input: {
                colorText: globalThemes().darkNeutral,
                colorBgContainer: globalThemes().lightNeutral,
            },
            DatePicker: {
                colorBgContainer: globalThemes().lightNeutral,
                colorText: globalThemes().darkNeutral,
            },
            Divider: {
                colorSplit: globalThemes().secondaryColorDark,
            },
            Layout: {
                headerBg: globalThemes().primaryColorLight,
            },
            Table: {
                colorBgContainer: globalThemes().primaryColorLight,
            },
            InputNumber: {
                defaultBorderColorBorderColor: globalThemes().darkNeutral,
                activeBorderColor: globalThemes().secondaryColor,
                colorBgContainer: globalThemes().lightNeutral,
                colorText: globalThemes().darkNeutral,
            },
            Pagination: {
                colorBgContainer: globalThemes().primaryColor,
            }
            },
            token: {
            colorPrimary: globalThemes().secondaryColor,
    
            colorBgContainer: globalThemes().primaryColor,
    
            colorBorderSecondary: globalThemes().darkNeutral,
            colorText:globalThemes().darkNeutral,
            },
        }
    )
}

export default GlobalStylesProvider