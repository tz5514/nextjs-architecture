import React from 'react'
import Head from 'next/head'
import pickBy from 'lodash/pickBy'
import merge from 'lodash/merge'
import last from 'lodash/last'
import hoistNonReactStatic from 'hoist-non-react-statics'

import shallowEqual from 'generic/modules/shallowEqual'

export class RootLayout extends React.PureComponent {
  static defaultProps = {
    documentData: {
      titleArray: [],
      titleSetting: {
        joinBy: ' - ',
        preprocess: array => array
      }
    }
  }

  getDocumentTitle = (titleSetting = this.props.documentData.titleSetting) => {
    const {
      joinBy = this.props.documentData.titleSetting.joinBy || RootLayout.defaultProps.documentData.titleSetting.joinBy,
      preprocess = this.props.documentData.titleSetting.preprocess || RootLayout.defaultProps.documentData.titleSetting.preprocess
    } = titleSetting;
    
    return preprocess([...this.props.documentData.titleArray].filter(t => t)).join(joinBy);
  }

  render() {
    return (
      <div>
        <Head>
          <title>{this.getDocumentTitle()}</title>
          {this.props.documentData.fbImage && (
            <meta property="og:image" content={this.props.documentData.fbImage}/>
          )}

          {this.props.documentData.fbDescription && (
            <meta property="og:description" content={this.props.documentData.fbDescription}/>
          )}

          {this.props.documentData.fbSiteName && (
            <meta property="og:site_name" content={this.props.documentData.fbSiteName}/>
          )}
        </Head>
        {this.props.children}
        {/*renderChildren(this, this.props.layoutData, true)*/}
      </div>
    )
  }
}

function renderChildren(_this, layoutData, isFistLevel = false) {
  const childLayoutElement = React.Children.only(_this.props.children);
  
  const layoutName = childLayoutElement.props._layoutName;
  const mergedProps = {
    ...childLayoutElement.props,
    ...layoutData[layoutName],        
    documentData: {
      ..._this.props.documentData,
      getDocumentTitle: _this.getDocumentTitle || _this.props.documentData.getDocumentTitle
    }
  };

  if (childLayoutElement.props._layoutName) {
    return React.cloneElement(
      childLayoutElement,
      mergedProps,
      renderChildren(React.cloneElement(childLayoutElement, mergedProps), layoutData)
    );
  }

  return React.cloneElement(childLayoutElement, {
    documentData: {
      ..._this.props.documentData,
      getDocumentTitle: _this.getDocumentTitle || _this.props.documentData.getDocumentTitle
    },
    layoutData: layoutData
  });
}

export function extendLayout2(ChildLayout, ParentLayout) {
  console.log(ChildLayout.displayName || ChildLayout.name, ParentLayout.displayName || ParentLayout.name);
  console.log(ParentLayout.getInitialProps);
  const childAsyncMethodObject = {
    layoutName: ChildLayout.displayName || ChildLayout.name,
    method: ChildLayout.getInitialProps
  }

  ChildLayout.getDocumentData = ChildLayout.getDocumentData || (() => ({}));

  return class extends React.PureComponent {
    static displayName = `Extend(${ChildLayout.displayName || ChildLayout.name}, ${ParentLayout.extendName || ParentLayout.name})`;
    static extendName = ChildLayout.displayName || ChildLayout.name;
    static getInitialProps = Array.isArray(ParentLayout.getInitialProps) ? 
      ParentLayout.getInitialProps.concat(childAsyncMethodObject).filter(f => f) : 
      [childAsyncMethodObject];

    static defaultProps = {
      documentData: {},
      layoutData: {}
    }
    
    render() {
      let childLayoutProps = pickBy(this.props, (val, key) => key != 'documentData' && key != 'layoutData'&& key != 'pagePropsWithFullLayoutData');
      childLayoutProps = merge(childLayoutProps, this.props.layoutData[ChildLayout.displayName || ChildLayout.name]);
      const childLayoutDocumentData = ChildLayout.getDocumentData(childLayoutProps);
      const parentLayoutProps = {
        layoutData: this.props.layoutData,
        documentData: {
          fbSiteName: this.props.documentData.fbSiteName || childLayoutDocumentData.fbSiteName,        
          titleArray: [childLayoutDocumentData.titlePart].concat(this.props.documentData.titleArray || this.props.documentData.titlePart),
          titleSetting: {
            ...childLayoutDocumentData.titleSetting,
            ...this.props.documentData.titleSetting
          }
        }
      }
      console.log(parentLayoutProps);

      return (
        <ParentLayout {...parentLayoutProps}>
          <ChildLayout 
          // {...childLayoutProps} 
          _layoutName={ChildLayout.displayName || ChildLayout.name}>
            {this.props.children}
          </ChildLayout>
        </ParentLayout>
      )
    }
  }
}

export const applyLayout2 = (TargetLayout, sequantial = false) => (PageComponent) => {
  return class extends React.PureComponent {
    static displayName = `Apply(${PageComponent.displayName || PageComponent.name}, ${TargetLayout.extendName || TargetLayout.name})`;

    static async getInitialProps(params) {
      const asyncMethods = TargetLayout.getInitialProps;
      console.log(TargetLayout);
      let result = [];
      if (sequantial) {
        for (let key in asyncMethods) {
          if (asyncMethods[key].method) {
            const lastResult = last(result.filter(o => o));
            result[key] = await asyncMethods[key].method(params, lastResult);
          }
        }
      } else {
        // result = await Promise.all(asyncMethods.map(item => {
        //   return (item.method) ? item.method(params) : {};
        // }));
      }

      let asyncMethodResults = {};
      result.forEach((item, index) => {
        const layoutName = asyncMethods[index].layoutName
        asyncMethodResults[layoutName] = item;
      });
      
      PageComponent.getInitialProps = PageComponent.getInitialProps || (() => ({}));
      
      return {
        ...(await PageComponent.getInitialProps(params)),
        asyncMethodResults,
      };
    }

    render() {
      const pageProps = pickBy(this.props, (val, key) => key != 'asyncMethodResults');
      
      const asyncMethodResults = this.props.asyncMethodResults
      const pagePropsWithAsyncLayoutData = merge({}, pageProps, { layoutData: this.props.asyncMethodResults });
      const sourceLayoutData = (PageComponent.getLayoutProps) ? PageComponent.getLayoutProps(pagePropsWithAsyncLayoutData) : {};

      const fullLayoutData = merge({}, asyncMethodResults, sourceLayoutData);
      const pagePropsWithFullLayoutData = merge({}, pageProps, { layoutData: fullLayoutData });
      
      const sourceDocumentData = (PageComponent.getDocumentData) ? PageComponent.getDocumentData(pagePropsWithFullLayoutData) : {};
      return (
        <TargetLayout
          // pagePropsWithFullLayoutData={pagePropsWithFullLayoutData}
          documentData={sourceDocumentData} 
          // layoutData={fullLayoutData}
        >
          <PageComponent {...pageProps}/>
        </TargetLayout>
      )
    }
  }
}


export const applyLayout = (TargetLayout) => (PageComponent) => {
  class ApplyLayout extends React.PureComponent {
    static displayName = `Apply(${PageComponent.displayName || PageComponent.name}, ${TargetLayout.extendName || TargetLayout.name})`;

    updateDocumnetData = (props) => {
      this.documentData = (PageComponent.getDocumentData) ? PageComponent.getDocumentData(props) || {} : {};
    }
    
    componentWillMount() {
      this.updateDocumnetData(this.props);
    }
     
    componentWillUpdate(nextProps) {
      // if (!shallowEqual(this.props, nextProps)) {
        this.updateDocumnetData(nextProps);
      // }
    }
    
    render() {
      return (
        <TargetLayout documentData={this.documentData}>
          <PageComponent {...this.props}/>
        </TargetLayout>
      )
    }
  }

  hoistNonReactStatic(ApplyLayout, PageComponent);
  return ApplyLayout;
}

export const extendLayout = (ParentLayout) => (ChildLayout) => {
  return class extends React.PureComponent {
    static displayName = `Extend(${ChildLayout.displayName || ChildLayout.name}, ${ParentLayout.extendName || ParentLayout.name})`;
    static extendName = ChildLayout.displayName || ChildLayout.name;

    updateLayoutProps = (props) => {
      this.childLayoutProps = pickBy(props, (val, key) => key != 'documentData');
      const childLayoutDocumentData = (ChildLayout.getDocumentData) ? ChildLayout.getDocumentData(this.childLayoutProps) : {};
      this.parentLayoutProps = {
        documentData: {
          ...childLayoutDocumentData,
          ...props.documentData,
          titleArray: [childLayoutDocumentData.titlePart].concat(props.documentData.titleArray || props.documentData.titlePart),
          titleSetting: {
            ...childLayoutDocumentData.titleSetting,
            ...props.documentData.titleSetting
          }

        }
      }
    }
    
    // also will be called when env is server
    componentWillMount() {
      this.updateLayoutProps(this.props);
    }
    
    componentWillUpdate(nextProps, nextState) {
      // if (!shallowEqual(this.props, nextProps)) {
        this.updateLayoutProps(nextProps);
      // }
    }
    
    render() {
      return (
        <ParentLayout {...this.parentLayoutProps}>
          <ChildLayout {...this.childLayoutProps} >
            {this.props.children}
          </ChildLayout>
        </ParentLayout>
      )
    }
  }
}