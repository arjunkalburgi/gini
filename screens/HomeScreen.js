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
  componentWillMount() { this.getLog(); }

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

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
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
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
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
