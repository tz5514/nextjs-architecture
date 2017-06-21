import { variables } from 'generic/styles/utils'

class NewsDetail extends React.PureComponent {
  render() {
    return (
      <DetailWrap>
        <MainImageWrap>
          <img src={this.props.thumbnail}/>
        </MainImageWrap>

        <Title>{this.props.title}</Title>
        <Date>{this.props.date}</Date>
        <Author>{this.props.author}</Author>

        <hr/>

        <Content dangerouslySetInnerHTML={{__html: this.props.content}}/>

        {this.props.pictures && this.props.pictures.map((item, index) => (
          <ImageWrap key={index}>
            <img src={item.src}/>
            <p>{item.description}</p>
          </ImageWrap>
        ))}

        {(this.props.youtube) && (
          <YoutubeWrap>
            <iframe src={this.props.youtube}/>
          </YoutubeWrap>
        )}

        {(this.props.relatedUrl) && (
          <RelativeUrlWrap>
            相關連結：
            <a href={this.props.relatedUrl} target="_blank">{this.props.relatedUrl}</a>
          </RelativeUrlWrap>
        )}
      </DetailWrap>
    );
  }
}

const DetailWrap = styled.div`
  margin: 15px 12px 20px;
`

const MainImageWrap = styled.div`
  margin: 0px -12px;

  & > img {
    width: 100%;
  }
`

const Title = styled.h2`
  color: ${variables.linkColor[0]};
  font-size: 18px;
  margin: 15px 0px 10px;
  line-height: 1.4;
  font-weight: normal;
`

const Date = styled.div`
  font-size: 15px;
  margin: 0px;
  color: $text-color3;
  margin: 8px 0px;
`

const Author = Date;

const Content = styled.div`
  padding: 5px 0px;
  font-size: 15px !important;
  line-height: 1.8;
  word-wrap: break-word;

  & > * {
    max-width: 98% !important;
    margin: 0px auto !important;
  }

  & * {
    text-indent: 0px !important;
  }

  & div, & span, & p, & h1, & h2, & h3, & h4, & h5 {
    font-family: $font-family !important;
    font-size: 15px !important;
    line-height: 1.8 !important;
    margin: 0px auto !important;

  }
  & img, & table , & iframe{
    width: 100% !important;
    max-width: 100% !important;
  }

  & table, & thead, & tbody, & th, & tr, & td {
    width: initial !important;
    word-break: break-all !important;
  }
`

const ImageWrap = styled.div`
  margin: 20px 0px 25px;
  & > img {
    width: 100%;
    box-shadow: $box-shadow1;
  }
  
  & > p {
    color: $text-color3;
    font-size: 15px;
    line-height: 1.35;
    margin: 10px 0px 0px;
  }
`

const YoutubeWrap = styled.div`
  padding-bottom: 66%;
  position: relative;
  margin: 15px 0px 20px;
  box-shadow: $box-shadow1;

  & > iframe {
    position: absolute;
    width: 100% !important;
    height: 100% !important;
    border: none;
  }
`

const RelativeUrlWrap = styled.div`
  margin-top: 15px;
  line-height: 1.4;
  font-size: 15px;
  & > a {
    margin-top: 6px;
    display: block;
    color: $link-color1;
    text-decoration: none;
    word-break: break-all;
  }
`

export default NewsDetail;