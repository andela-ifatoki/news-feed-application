import React from 'react';

import newsStore from '../store/newsStore';
import NewsItem from './NewsItem';

export default class Articles extends React.Component {
  constructor() {
    super();
    this.getArticles = this.getArticles.bind(this);
    this.state = {
      articles: newsStore.fetchArticles(),
    };
  }

  componentWillMount() {
    newsStore.on('articlesChanged', this.getArticles);
  }

  componentWillUnmount() {
    newsStore.removeListener('articlesChanged', this.getArticles);
  }

  getArticles() {
    this.setState({
      articles: newsStore.fetchArticles(),
    });
  }

  render() {
    const { articles } = this.state;
    const articleComponents = articles.map((article) => {
      return <NewsItem author={article.author} title={article.title} description={article.description} url={article.url} urlToImage={article.urlToImage} publishedAt={article.publishedAt} key={article.url}/>;
    });
    return (
      <div>
        <ul className="collection">
          <li className="collection-item red"><b>My list of articles goes up in here.</b></li>
          {articleComponents}
        </ul>
      </div>
    );
  }
}

