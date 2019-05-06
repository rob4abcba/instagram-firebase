import React, { Component } from 'react';
import {
  Text,
  View,
  StyleSheet,
  CameraRoll,
  Button,
  FlatList,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { Constants } from 'expo';

export default class CreateScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Create',
      headerRight: (
        <Button
          onPress={navigation.getParam('selectPhoto')}
          title="Next"
          color="#007AFF"
        />
      ),
    };
  };

  state = {
    photos: [],
    selected: 0,
    selectedUri: ''
  };

  selectPhoto = () => {
    this.props.navigation.navigate('Publish', {uri: this.state.selectedUri});
  }

  componentWillMount() {
    this.props.navigation.setParams({ selectPhoto: this.selectPhoto });
    CameraRoll.getPhotos({
      first: 100,
      assetType: 'Photos',
    })
    .then(results => {
      this.setState({ photos: results.edges, selected: 0});
      this.setState({ selectedUri: this.state.photos[0].node.image.uri});
    })
    .catch(err => {
      //Error Loading Images
    });
  }

  render() {
    const backgroundOpacity = this.props.selected ? 0.6 : 0;
    return (
      <FlatList
        numColumns={4}
        keyExtractor={(item, index) => item.id}
        data={this.state.photos}
        extraData={this.state}
        renderItem={({ item, index }) => {
          const selected = this.state.selected == index;
          const backgroundOpacity = selected ? 0.6 : 0;

          return (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                this.setState({ selected: index, selectedUri: item.node.image.uri });
              }}>
              <ImageBackground
                key={this.props.id}
                style={styles.image}
                resizeMode="cover"
                source={{ uri: item.node.image.uri }}>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundColor: 'white',
                    opacity: backgroundOpacity,
                  }}
                />
              </ImageBackground>
            </TouchableOpacity>
          );
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  item: {
    flex: 1 / 4,
    aspectRatio: 1,
    margin: 1,
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
