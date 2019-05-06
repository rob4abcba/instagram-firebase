import React, { Component } from 'react';
import { Text, View, StyleSheet, Alert, TextInput, Button } from 'react-native';
import { Constants } from 'expo';

import * as firebase from 'firebase';

export default class LoginScreen extends Component {
  
  static navigationOptions = {
    headerTitle: 'Login'
  };
  
  state = {
    email: '',
    password: '',
  };

  handleButtonPress = () => {
    var email = this.state.email;
    var password = this.state.password;
    
    if (!this.state.email.length) {
      email = 'fakeemail@gmail.com';
      password = 'fakepassword';
    }
    
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert('Successfully created account!');
        this.props.navigation.navigate('App');
      })
      .catch(error => {
        if (error.code == 'auth/email-already-in-use') {
          firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
              Alert.alert('Successfully logged in!');
              this.props.navigation.navigate('App');
            })
            .catch(error => {
              Alert.alert(error.message);
            });
        } else if (error.code == 'auth/weak-password') {
          Alert.alert('The password is too weak.');
        } else {
          Alert.alert(error.message);
        }
      });
  };

  render() {
     return (
      <View style={styles.container}>
        
        <TextInput
          value={this.state.email}
          placeholder="Enter email"
          onChangeText={text => this.setState({ email: text })}
          style={styles.textInput}
        />
      
        <TextInput
          value={this.state.password}
          placeholder="Enter password"
          secureTextEntry={true}
          onChangeText={text => this.setState({ password: text })}
          style={styles.textInput}
        />
      
        <Button
          title="Sign Up/Log In"
          onPress={this.handleButtonPress}
        />
      
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Constants.statusBarHeight + 50,
    backgroundColor: 'white',
  },
  textInput: {
    margin: 24,
    padding: 10,
    fontSize: 18,
    textAlign: 'center',
    width: 350,
    borderColor: 'gray',
    borderWidth: 1,
  }
});
