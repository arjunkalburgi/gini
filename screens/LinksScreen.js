import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, FlatList, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

import SearchList from '../components/SearchList';

export default class LinksScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchText: '', refreshList: false };
  }

  setSearchText(text) {
    this.setState({
      searchText: text
    })
  }

  getFood() {
    fetch(`https://trackapi.nutritionix.com/v2/search/instant?query=${this.state.searchText}&self=true&branded=true&common=true&detailed=false&claims=false`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Host: 'trackapi.nutritionix.com',
        'Accept-Language': 'en-GB,en;q=0.5',
        'x-app-id': '61aca91d',
        'x-app-key': '47240e9bd8d46633bab0cd154335e8e7',
        Connection: 'keep-alive',
      },
    })
    .then((response) => response.json())
    .then((responseJson) => {
      // only refresh the data if it's worth refreshing
      if (responseJson.common || responseJson.branded) {
        this.data = responseJson;
        this.refreshList();
      }
    })
    .catch((error) => { console.error(error); });
  };

  refreshList = () => this.setState({ refreshList: !this.state.refreshList })
  
  render() {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

        <Text>Use the searchbar to look for foods</Text>
      
        <TextInput
          style={styles.searchbar}
          placeholder="Search for foods..."
          onChangeText={(textEntry) => { this.setSearchText(textEntry); this.getFood(); }}
          onSubmitEditing={() => { this.getFood() }}
        />

        <SearchList data={this.data} refresh={this.state.refreshList} />

      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  contentContainer: {
    paddingTop: 15,
  },
  optionIconContainer: {
    marginRight: 12,
  },
  option: {
    backgroundColor: '#fdfdfd',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: '#ededed',
  },
  lastOption: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    fontSize: 15,
    alignSelf: 'flex-start',
    marginTop: 1,
  },
  searchbar: {
    flexDirection: 'row',
    margin: 10,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2, borderColor: '#888', borderRadius: 10, backgroundColor: '#fff',
    backgroundColor: 'transparent'
  },
});
