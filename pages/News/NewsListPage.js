import compose from 'generic/modules/compose'
import wrapWithProvider from 'config/store'
import { connectModel } from 'react-redux-models'
import { applyLayout } from 'generic/modules/next-layouts'

import NewsLayout from 'News/layouts/NewsLayout'
import NewsListContainer from 'News/containers/NewsListContainer'

class NewsListPage extends React.PureComponent {
  static async getInitialProps({ store, isServer }) {
    if (isServer) {
      const { fetchNewsList } = store.getActions({ NewsListModel: 'all' });
      await fetchNewsList(1);
    }
  }
  
  render() {
    return (
      <NewsListContainer/>
    )
  }
}

export default compose(
  wrapWithProvider,
  applyLayout(NewsLayout)
)(NewsListPage)
