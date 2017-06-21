import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'
import externalCSS from 'config/externalCSS'

export default class MyDocument extends Document {
	render() {
		const sheet = new ServerStyleSheet();
		const main = sheet.collectStyles(<Main/>);
		const styleTags = sheet.getStyleElement();
		return (
			<html>
				<Head>
					<meta charSet="utf-8"/>
					<meta name='viewport' content='initial-scale=1.0, width=device-width'/>
					{styleTags}										
					{externalCSS.map(url => (
						<link rel="stylesheet" href={url} key={url}/>
					))}
				</Head>

				<body style={{margin: 0}}>
					{main}
					<NextScript/>
				</body>
			</html>
		)
	}
}