import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, FlatList, Button, View } from 'react-native';

export default class HomeScreen extends React.Component {
  state = {
    data: [],
    refresh: false,
  }
  constructor(props) { 
    super(props);
    this.getLog();
  }

  componentDidMount() { this.getLog(); }

  getLog() {
    console.log('before get');
    fetch(`https://us-central1-gini-v0.cloudfunctions.net/getLogTest`, {
      method: 'GET',
      redirect: 'follow',
      headers: {
        "Authorization": "Basic c7a5195c11e362086dcd8ce60dcc44ed",
        'content-type': 'application/json',
        Accept: 'application/json',
      }
    })
    .then((response) => response.json())
    .then((responseJson) => {
      console.log('after get');
      this.setState({ refresh: !this.state.refresh, data: responseJson })
    })
    .catch((error) => { console.error('API error', error); });
  }

  delFood = (idstr) => {
    console.log('before del');
    fetch(`https://us-central1-gini-v0.cloudfunctions.net/deleteLogTest`, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        "Authorization": "Basic c7a5195c11e362086dcd8ce60dcc44ed",
        'content-type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ "id": idstr })
    })
    .then(() => {
      console.log('after del');
      this.getLog();
    })
    .catch((error) => { console.error('API error', error); });
  }

  render = () => { return (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
        <Image
          source={
            __DEV__
              ? require('../assets/images/robot-dev.png')
              : require('../assets/images/robot-prod.png')
          }
          style={styles.welcomeImage}
        />
      </View>
      
      <FlatList
        data={this.state.data}
        extraData={this.state.refresh}
        renderItem={({ item }) =>
          <View style={styles.item}>
            <View style={styles.item_text}>
              <Text style={styles.item_title}>{item.data.food_name}</Text>
              <Text style={styles.item_detail}>Food Score: {item.data.score}</Text>
              <Text style={styles.item_detail}>{item.data.serving_qty} {item.data.serving_unit}</Text>
            </View>
            <Button
              onPress={() => { this.delFood(`${item.id}`) }}
              title="Delete"
              color="#841584"
              accessibilityLabel="Learn more about this purple button"
            ></Button>
          </View>
        }
      />
    </View>
  )};
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  item: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  item_text: { justifyContent: 'center', flex: 6 },
  item_title: {
    fontSize: 18,
  },
  item_detail: {
    fontSize: 14,
  },
});
