import compose from 'generic/modules/compose'
import wrapWithProvider from 'config/store'
import { connectModel } from 'react-redux-models'
import { applyLayout } from 'generic/modules/next-layouts'

import NewsLayout from 'News/layouts/NewsLayout'
import NewsDetailContainer from 'News/containers/NewsDetailContainer'

class NewsDetailPage extends React.PureComponent {
  static async getInitialProps({ store, isServer, query }) {
    if (isServer) {
      const { fetchNewsDetail } = store.getActions({ NewsDetailModel: 'all' });
      await fetchNewsDetail(query.id);
    }
    return { query };
  }

  static getDocumentData({ newsDetail, query: { id } }) {
    const detail = newsDetail[id];
    if (detail && detail.status == 'success') {
      return {
        titlePart: detail.data.title,
        fbImage: detail.data.thumbnail,
        fbDescription: detail.data.content.slice(0, 200) + '...'
      }
    }
  }

  render() {
    return (
      <NewsDetailContainer id={this.props.query.id} />
    );
  }
}

export default compose(
  wrapWithProvider,
  connectModel({
    stateSelector: (state) => ({ 
      newsDetail: state.news.detail,
    })
  }),
  applyLayout(NewsLayout)
)(NewsDetailPage)