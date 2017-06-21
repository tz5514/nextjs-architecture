import { extendLayout } from 'generic/modules/next-layouts'
import AppLayout from 'App/layouts/AppLayout'

class NewsLayout extends React.PureComponent {
  static getDocumentData(props) {  
    return {
      titlePart: '最新消息'
    }
  }

  render() {
    return (
      <div>
        <h3>最新消息</h3>
        {this.props.children}
      </div>
    )
  }
}

export default extendLayout(AppLayout)(NewsLayout)

