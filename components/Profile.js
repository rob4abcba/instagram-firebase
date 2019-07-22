import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, FlatList } from 'react-native';
import { Constants } from 'expo';

import firebase from 'firebase';

export default class ProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Profile',
    };
  };

  state = {
    color: 'white',
    name: '',
    bio: '',
    posts: [""]
  };

  handlePress = () => {
    this.setState({ color: '#a6c9ed' });
    
    this.props.navigation.navigate('Edit', {
      name: this.state.name,
      bio: this.state.bio,
      saveEditedProfile: this.saveEditedProfile,
    });
  };

  saveEditedProfile = (name, bio) => {
    var user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: name,
      photoURL: bio
    }).then(function() {
      console.log("saved profile");
      alert("Saved profile!")
    }).catch(function(error) {
      console.log(error);
      alert("Updating profile failed.")
    });

    this.setState({
      name: name,
      bio: bio,
    });
  };

  componentWillMount() {
    var user = firebase.auth().currentUser;
    this.setState({
      name: user.displayName ? user.displayName : '',
      bio: user.photoURL ? user.photoURL : '',
    });
    firebase.database().ref('posts').on('value', (snapshot) => {
      const databasePosts = snapshot.val();
      var posts = [];
      for (var key in databasePosts) {
        const post = databasePosts[key];
        if (post.user == firebase.auth().currentUser.uid) {
          posts.push(post); 
        }
      }
      this.setState({posts: posts});
    });
  }

  render() {
    return (
      <View style={{ alignItems: 'center', paddingTop: 50 }}>
        {/* <Image style={styles.picture} source={require('assets/icon.png')} /> */}

        <Text style={styles.name}>{this.state.name}</Text>

        <Text style={styles.bio}>{this.state.bio}</Text>

        <TouchableOpacity onPress={this.handlePress}>
          <View
            style={{
              backgroundColor: this.state.color,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 15,
              borderWidth: 1,
              borderColor: 'black',
              margin: 15,
            }}>
            <Text style={styles.buttonText}>Edit Profile</Text>
          </View>
        </TouchableOpacity>

        <FlatList
          style={{marginTop: Constants.statusBarHeight}}
          numColumns={4}
          keyExtractor={(item, index) => item.id}
          data={this.state.posts}
          renderItem={ ({item, index}) => (
            <View style={styles.item}>
              <Image
                style={styles.image}
                resizeMode="cover"
                source={{uri: item.image}}>
              </Image>
            </View>
          )}
        />
      </View>
    );
  }
}

//  <View style = {styles.button}>
//             <Text style = {styles.buttonText}>Edit Profile</Text>
//           </View>
//

const styles = StyleSheet.create({
  item: {
    width: 80,
    height: 80,
    margin: 1,
    backgroundColor: 'gray'
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  picture: {
    height: 128,
    width: 128,
    borderRadius: 30,
    borderWidth: 1,
  },
  name: {
    margin: 24,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bio: {
    marginLeft: 10,
    marginRight: 10,
    fontSize: 18,
  },
  buttonText: {
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 10,
    padding: 5,
  },
});