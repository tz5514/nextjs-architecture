import { ThemeProvider } from 'styled-components'
import { extendLayout, RootLayout } from 'generic/modules/next-layouts'
import NotificationContainer from 'App/containers/NotificationContainer'
import 'isomorphic-fetch'

const theme = {};

class AppLayout extends React.PureComponent {
  static getDocumentData(props) {  
    return {
      fbSiteName: '中央大學',
      titlePart: '中央大學',
      titleSetting: {
        joinBy: ' - ',
        preprocess: array => array.reverse()
      }
    }
  }

  render() {
    return (
      <div>
        <h2>中央大學</h2>
        <NotificationContainer/>
        <ThemeProvider theme={theme}>
          {this.props.children}
        </ThemeProvider>
      </div>
      
    )
  }
}

export default extendLayout(RootLayout)(AppLayout)