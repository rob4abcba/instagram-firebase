import React, { Component } from 'react';
import { View, Image, StyleSheet, Button, TextInput} from 'react-native';
import { Constants } from 'expo';
import uuid from 'uuid';
import firebase from 'firebase';

export default class PublishScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Publish',
      headerRight: (
        <Button
          onPress={navigation.getParam('publish')}
          title="Publish"
          color="#007AFF"
        />
      ),
    };
  };

  state = {
    caption: "",
    publishing: false,
  };

  // Download image as blob, upload blob to firebase, and return downloadUrl
  uploadImage = (uri) => {
    const imagesRef = firebase.storage().ref().child('images').child(uuid.v4());
    
    const downloadURLPromise = new Promise((resolve, reject) => {

      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        const blob = xhr.response;
        console.log(blob);
        var uploadTask = imagesRef.put(blob);
      
        uploadTask.then((snapshot) => {
          snapshot.ref.getDownloadURL().then(function(downloadURL) {
            console.log('File available at', downloadURL);
            resolve(downloadURL);
            
          }).catch( (error) => { 
            reject(error);
          });
        }).catch( (error) => { 
          reject(error);
        });
      };
      xhr.onerror = function(error) {
        reject(error);
      };

      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);

    });

    return downloadURLPromise;
  };

  publish = () => {
    if (this.state.publishing) {
      return;
    }
    this.setState({publishing: true});

    const imageUri = this.props.navigation.getParam('uri');
    this.uploadImage(imageUri)
      .then( (downloadURL) => {

        const posts = firebase.database().ref('posts');
        const userName = firebase.auth().currentUser.displayName;
        posts.push({
          user: firebase.auth().currentUser.uid,
          userName: userName ? userName : "",
          image: downloadURL,
          caption: this.state.caption
        });

        this.props.navigation.goBack();
        this.props.navigation.navigate('Profile');

        alert('Published!'); 
      })
      .catch( (error) => { 
        console.log('There was an error:' + error);
        alert("Publishing failed.");
      });
  };

  componentWillMount() {
    this.props.navigation.setParams({ publish: this.publish });
  }

  render() {
    return (
      <View style={{ alignItems: 'center' }}>
        <TextInput
          style={styles.caption}
          placeholder="Enter a caption"
          multiline={true}
          onChangeText={text => this.setState({ caption: text })}
          value={this.state.caption}
        />

        <Image
          style={styles.picture}
          source={{ uri: this.props.navigation.getParam('uri') }}
        />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  picture: {
    margin: 20,
    height: 350,
    width: 350,
  },
  caption: {
    margin: 10,
    padding: 10,
    fontSize: 18,
    width: 350,
    borderColor: 'gray',
    borderWidth: 1,
  },
});
