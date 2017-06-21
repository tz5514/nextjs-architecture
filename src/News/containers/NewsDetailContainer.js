import { connectModel } from 'react-redux-models'
import ScrollEventBinder from 'generic/modules/ScrollEventBinder'

import NewsDetail from 'News/components/NewsDetail'

class NewsDetailContainer extends React.PureComponent {
  componentDidMount() {
    this.fetchNewsDetail();
  }

  fetchNewsDetail = () => {
    this.props.actions.fetchNewsDetail(this.props.id);
  }

  render() {
    const { newsDetails, id } = this.props;
    const detail = newsDetails[id];

    if (detail && detail.status == 'success') {
      return (
        <div>
          <NewsDetail {...detail.data}/>
        </div>
      )
    } else {
      return (
        <div>loading...</div>
      )
    }
  }
}

export default connectModel({
  stateSelector: (state) => ({
    newsDetails: state.news.detail,
  }),
  importActions: {
    NewsDetailModel: ['fetchNewsDetail'],
  }
})(NewsDetailContainer)
