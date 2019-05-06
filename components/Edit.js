import * as React from 'react';
import {
  Button,
  Text,
  View,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Constants } from 'expo';

export default class EditProfileScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Edit Profile',
      headerRight: (
        <Button
          // onPress={() => alert('Profile Saved!')}
          onPress={navigation.getParam('saveProfile')}
          title="Save Profile"
          color="#007AFF"
        />
      ),
    };
  };

  state = {
    name: '',
    bio: '',
  };

  saveProfile = () => {
    this.props.navigation.state.params.saveEditedProfile(
      this.state.name,
      this.state.bio
    );
    this.props.navigation.navigate('Profile');
    alert('Profile Saved!');
  };

  componentWillMount() {
    this.setState({
      name: this.props.navigation.getParam('name'),
      bio: this.props.navigation.getParam('bio'),
    });
    this.props.navigation.setParams({ saveProfile: this.saveProfile });
  }

  render() {
    return (
      <View style={{ alignItems: 'center', paddingTop: 50 }}>
        <TextInput
          style={styles.name}
          placeholder="Enter name"
          multiline={false}
          onChangeText={text => this.setState({ name: text })}
          value={this.state.name}
        />

        <TextInput
          style={styles.bio}
          placeholder="Enter a short bio"
          multiline={true}
          onChangeText={text => this.setState({ bio: text })}
          value={this.state.bio}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  name: {
    margin: 24,
    padding: 10,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 350,
    borderColor: 'gray',
    borderWidth: 1,
  },
  bio: {
    marginLeft: 10,
    marginRight: 10,
    padding: 10,
    fontSize: 18,
    width: 350,
    borderColor: 'gray',
    borderWidth: 1,
  },
});
