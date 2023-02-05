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
    this.submitSave = this.submitSave.bind(this);

    // load preferences from localStorage

    let localFavorites = localStorage.getItem('favorites') || "[]";
    let favorites = JSON.parse(localFavorites);

    let parsedFries = this.props.fries.map((fry) => {
      fry.selected = favorites.includes(fry.name) ? true : false;
      return fry;
    })

    

    this.state = {
      searchText: '',
      fries: parsedFries
    }
  }

  submitSave() {
    // get array of names of selected items
    let selectedFries = this.state.fries.filter((fry) => {
      return fry.selected;
    })
    let preferenceNames = selectedFries.map((fry) => {
      return fry.name;
    });

    // store to local storage
    localStorage.setItem('favorites', JSON.stringify(preferenceNames));

    setTimeout(() => {
      window.location.href = window.location.origin;
    }, 200)
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
    

    let saveButton = (
        <button onClick={this.submitSave} className={styles.saveButton}>Save</button>
    )

    if (fries) {
      // asign each fry a unique id
      fries = fries.map((fry, index) => {
        fry.id = index;
        if (fry.selected == null || fry.selected == undefined) {
          fry.selected = false;
        }
        return fry;
      });

      if (this.state.searchText != "") {
        fries = fries.filter((value, index, array) => {
          return value.name.toLowerCase().includes(this.state.searchText.toLowerCase());
        })
      }

      if (!this.props.showSearchBar) {
        fries = fries.filter((fry) => { return fry.selected} )
      }
    }
    
    let fryRows = [];

    // filter by fries
    fries = fries.filter((fry) => {
      return fry.name.includes("Fries");
    })

    if (fries && fries.length > 0) {
      for (let i = 0; i < fries.length; i += 3) {
        fryRows.push(fries.slice(i, i + 3));
      }
    }

    const searchBar = (
      <div className={styles.searchBarContainer}><input className={styles.searchBar} type="text" onInput={this.updateSearch} value={this.state.searchText}></input></div>
    );

    return ( <>
      { this.props.showSearchBar ? searchBar : ''}
      { this.props.showSearchBar ? saveButton : ''}
      <div className={styles.FrySection}>
        {fries && fries.length > 0 ? (
          <>
            {fryRows.map((fryRow, i) => (
              <div key={i} className={styles.FryRow}>
                {fryRow.map((fry, k) => (
                  <FryCard key={fry.id} fry={fry} selectable={this.props.selectable} selected={fry.selected || false} onSelection={this.updateSelection} showBadge={!this.props.showSearchBar}/>
                ))}
              </div>
            ))}
          </>
        ) : (
          <center>
            {this.props.showSearchBar ?
            <p>No menu items found.</p> :
            <p>None of your favorites are available today.</p> }
          </center>
        )}
      </div>
      </>
    );
  }
}
