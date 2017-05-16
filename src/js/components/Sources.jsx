import React from 'react';

import newsStore from '../store/newsStore';
import * as newsActions from '../actions/newsActions';
import Dropdownitem from './DropdownItem';

export default class Sources extends React.Component {
  constructor() {
    super();
    this.newsActions = newsActions;
    this.reloadSources();
    this.state = {
      sources: newsStore.fetchSources(),
      filters: ['top'],
    };
    this.getSources = this.getSources.bind(this);
  }

  componentWillMount() {
    newsStore.on('sourcesChanged', this.getSources);
  }

  componentWillUnmount() {
    newsStore.removeListener('sourcesChanged', this.getSources);
  }

  getSources() {
    this.setState({
      sources: newsStore.fetchSources(),
    });
    if (this.state.sources.length > 0) {
      this.reloadArticles(false);
    }
  }

  reloadSources() {
    this.newsActions.getSources();
  }

  reloadArticles(filter) {
    const selector = document.getElementById('selector');
    const filterSelector = document.getElementById('filterSelector');

    if (filter) {
      this.newsActions.getArticles(
        selector.options[selector.selectedIndex].value,
        filterSelector.options[filterSelector.selectedIndex].value);
    } else {
      const { sources } = this.state;

      this.newsActions.getArticles(
        selector.options[selector.selectedIndex].value
        );
      this.setState({
        filters: sources[selector.selectedIndex].sortBysAvailable,
      });
      filterSelector.selectedIndex = 0;
    }
  }

  render() {
    const { sources, filters } = this.state;
    const filterComponents = filters.map(
      filter => <Dropdownitem value={filter} key={filter} text={filter} />);
    const sourceComponents = sources.map(
      source => <Dropdownitem
        value={source.id}
        key={source.id}
        text={source.name}
      />);
    return (
      <div>
        <div>
          Select Source
          <select
            id="selector" className="browser-default"
            onChange={this.reloadArticles.bind(this, false)}
          >
            {sourceComponents}
          </select>
          Select Filter
          <select
            id="filterSelector" className="browser-default"
            onChange={this.reloadArticles.bind(this, true)}
          >
            {filterComponents}
          </select>
        </div>
      </div>
    );
  }
}

