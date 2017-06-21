import { Link } from 'config/routes'
import { variables } from 'generic/styles/utils'

class NewsItem extends React.PureComponent {
  render() {
    return (
      <Link route="news.detail" params={{ id: this.props.id }}>
        <ItemWrap>
          <Image src={this.props.thumbnail}/>
          <InfoWrap>
            <Title>{this.props.title}</Title>
            <Date>{this.props.date}</Date>
            <Description>{this.props.description}</Description>
          </InfoWrap>
        </ItemWrap>
      </Link>
    )
  }
}

const ItemWrap = styled.div`
  margin-bottom: 25px;
  background-color: #fbf8f4;
  box-shadow: 0 1px 6px rgba(0,0,0,.18), 0 1px 4px rgba(0,0,0,.1);
  border-radius: 5px;
  overflow: hidden;
`

const Image = styled.img`
  width: 100%;
`

const InfoWrap = styled.div`
  padding: 13px;
`

const Title = styled.h2`
  margin: 0px;
  color: ${variables.linkColor[0]};
  font-size: 17px;
  line-height: 1.3;
  word-break: break-word;
  font-weight: normal;
`

const Date = styled.div`
  color: #58514a;
  line-height: 1.4;
  display: block;
  margin: 6px 0px;
`

const Description = styled.div`
  color: #6f655b;
  font-size: 14px;
  line-height: 1.4;
  margin: 0;
  word-break: break-all;
`

export default NewsItem