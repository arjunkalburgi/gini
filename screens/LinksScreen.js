import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import { RectButton, ScrollView } from 'react-native-gesture-handler';

export default function LinksScreen() {
  const [searchText, setsearchText] = useState('');

  const data = [];

  const getFood = () => {
    fetch(`https://trackapi.nutritionix.com/v2/search/instant?query=${searchText}&self=true&branded=true&common=true&detailed=false&claims=false`, {
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
      // body: JSON.stringify({
      //   query: `${searchText}`,
      //   self: false,
      //   branded: true,
      //   common: true,
      //   detailed: false,
      //   claims: false
      // }),
    })
    .then((response) => response.json())
    .then((responseJson) => {
      return console.table(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });
  };
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

      <Text>Use the searchbar to look for foods</Text>
    
      <View style={styles.searchbar}>
        <View style={{ flex: 4 }}>
          <TextInput
            onChangeText={(textEntry) => { setsearchText(textEntry); getFood(); }}
            style={{ backgroundColor: 'transparent' }}
            onSubmitEditing={() => { getFood() }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => getFood()}>
            <Text>Search</Text>
          </TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
}

function OptionButton({ icon, label, onPress, isLastOption }) {
  return (
    <RectButton style={[styles.option, isLastOption && styles.lastOption]} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(0,0,0,0.35)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
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
    borderWidth: 2, borderColor: '#888', borderRadius: 10, backgroundColor: '#fff'
  }
});
