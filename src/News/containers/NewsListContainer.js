import { connectModel } from 'react-redux-models'
import ScrollEventBinder from 'generic/modules/ScrollEventBinder'

import NewsList from 'News/components/NewsList'

class NewsListContainers extends React.PureComponent {
  isFetching = false;

  fetchNewsList = async() => {
    this.isFetching = true;
    await this.props.actions.fetchNewsList(this.props.nextListPage);
    this.isFetching = false;    
  }

  componentDidMount() {
    if (!this.props.newsList.status) {
      this.fetchNewsList();
    }
    this.bottomLoadingEvent = new ScrollEventBinder({
      target: window,
      bottom: 500,
      shouldCallback: () => !this.isFetching,
      callback: this.fetchNewsList
    });
  }

  componentWillUnmount() {
    this.bottomLoadingEvent.unbind();
    // this.props.actions.saveNewsListScrollTop();
  }

  render() {
    const { newsList } = this.props;
    return (newsList.page == 0)? (
      <div>loading...</div>
    ) : (
      <NewsList items={newsList.data}/>
    );
  }
}

export default connectModel({
  stateSelector: (state) => ({
    newsList: state.news.list,
  }),
  importActions: {
    NewsListModel: ['fetchNewsList'],
  },
  importComputedValues: {
    NewsListModel: ['nextListPage'],
  },
})(NewsListContainers)
