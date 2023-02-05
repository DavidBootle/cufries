import React, { useEffect, useState } from "react";
import FryCard from "@/components/FryCard/FryCard";
import styles from "./FrySection.module.css";


// PROPS
// fries - list of all items
// showSearchBar - bool
export default class FrySection extends React.Component {

  constructor(props) {
    super(props);
    this.updateSearch = this.updateSearch.bind(this);
    this.updateSelection = this.updateSelection.bind(this);

    this.state = {
      searchText: '',
      fries: this.props.fries
    }
  }

  async updateSelection(fryId, state) {
    let tmpFries = this.state.fries;
    tmpFries[fryId].selected = state;
    this.setState({
      fries: tmpFries
    })
  }

  async updateSearch(e) {
    this.setState({
      searchText: e.target.value
    })
  }

  render() {
    let fries = this.state.fries;

    if (fries) {
      // asign each fry a unique id
      fries = fries.map((fry, index) => {
        fry.id = index;
        return fry;
      });

      if (this.state.searchText != "") {
        fries = fries.filter((value, index, array) => {
          return value.name.toLowerCase().includes(this.state.searchText.toLowerCase());
        })
      }
    }
    
    let fryRows = [];

    if (fries && fries.length > 0) {
      for (let i = 0; i < fries.length; i += 3) {
        fryRows.push(fries.slice(i, i + 3));
      }
    }

    const searchBar = (
      <div className={styles.searchBarContainer}><input className={styles.searchBar} type="text" onInput={this.updateSearch} value={this.state.searchText}></input></div>
    );
    console.log('Fries:', fries);

    return ( <>
      { this.props.showSearchBar ? searchBar : ''}
      <div className={styles.FrySection}>
        {fries && fries.length > 0 ? (
          <>
            {fryRows.map((fryRow, i) => (
              <div key={i} className={styles.FryRow}>
                {fryRow.map((fry, k) => (
                  <FryCard key={fry.id} fry={fry} selectable={this.props.selectable} selected={fry.selected || false} onSelection={this.updateSelection}/>
                ))}
              </div>
            ))}
          </>
        ) : (
          <center>
            <p>No menu items found.</p>
          </center>
        )}
      </div>
      </>
    );
  }
}
