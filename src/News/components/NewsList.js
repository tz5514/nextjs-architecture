import NewsListItem from 'News/components/NewsListItem'

class NewsList extends React.PureComponent {
  render() {
    return (
      <ListWrap>
        {this.props.items.map((item, index) => (
          <NewsListItem {...item} key={index}/>
        ))}
      </ListWrap>
    )
  }
  
}

const ListWrap = styled.div`
  max-width: 600px;
  margin: 20px;
`

export default NewsList;