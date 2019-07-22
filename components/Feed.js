import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, FlatList, Dimensions } from 'react-native';
import { Constants } from 'expo';

import firebase from 'firebase';

const flower1uri = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Liliumbulbiferumflowertop.jpg/220px-Liliumbulbiferumflowertop.jpg";

export default class FeedScreen extends React.Component {
  static navigationOptions = {
    headerTitle: 'Feed'
  };

  state = {
    posts: [],
  };

  _checkLoggedIn() {
    const currentUser = firebase.auth().currentUser;
    if (!currentUser) {
      this.props.navigation.navigate('Login');
    }
  }

  componentWillMount() {
    this._checkLoggedIn();
    firebase.database().ref('posts').on('value', (snapshot) => {
      const databasePosts = snapshot.val();
      var posts = [];
      for (var key in databasePosts) {
        const post = databasePosts[key];
        posts.push(post); 
      }
      this.setState({posts: posts});
    });
  }
  
  render() {
    return (
      <View style={styles.container}>
      <FlatList 
        contentContainerStyle = {styles.list}
        numColumns = {1}
        keyExtractor={(item, index) => item.id}
        data={this.state.posts}
        renderItem={ ({item}) => 
          <View style={styles.item}>
            <Text style={styles.user}>
              {item.userName}
            </Text>
            <Image
              style={styles.image}
              resizeMode="cover"
              source={{uri: item.image}}>
            </Image>
            <Text style={styles.paragraph}>
              {item.caption}
            </Text>
          </View>
        }
      />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
  },
  list: {
    // alignItems will center every child horizontally
    // justifyContent centers every child vertically
    justifyContent: 'center',
  },
  item: {
    // flex 1/2 makes view half the size of the screen
    flex: 1/2,
    margin: 2,
    marginBottom: 20,
  },
  paragraph: {
    fontSize: 20,
    padding: 10,
    paddingTop: 5,
    textAlign: 'left',
    color: '#000',
  },
  image: {
    width: Dimensions.get('window').width - 4,
    aspectRatio: 1
  },
  user: {
    padding: 5,
    fontSize: 14,
    textAlign: 'left',
    color: '#000',
  }
  
});
