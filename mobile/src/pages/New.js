import React, { Component } from 'react';
import {
  KeyboardAvoidingView, Text, StyleSheet, TextInput, TouchableOpacity, Image,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';

import api from '../services/api';

export default class New extends Component {
  static navigationOptions = {
    headerTitle: 'Nova publicação',
  }

  state = {
    preview: null,
    image: null,
    author: '',
    place: '',
    description: '',
    hashtags: '',
  }

  handleSelectImage = () => {
    ImagePicker.showImagePicker({
      title: 'Selecionar Imagem',
    }, (upload) => {
      const { log } = console;
      if (upload.error) {
        log('Error: ', upload.error);
      } else if (upload.didCancel) {
        log('Usuario cancelou');
      } else {
        const preview = {
          uri: `data:image/jpeg;base64,${upload.data}`,
        };

        let filename;
        let ext;
        if (upload.fileName) {
          [filename, ext] = upload.fileName.split('.');
          ext = ext.toLowerCase() === 'heic' ? 'jpg' : ext;
        } else {
          filename = new Date().getTime();
          ext = 'jpg';
        }

        const image = {
          uri: upload.uri,
          type: upload.type,
          name: `${filename}.${ext}`,
        };

        this.setState({ preview, image });
      }
    });
  }

  handleSubmit = async () => {
    const {
      image, author, place, description, hashtags,
    } = this.state;
    const { navigation } = this.props;
    const data = new FormData();
    data.append('image', image);
    data.append('author', author);
    data.append('place', place);
    data.append('description', description);
    data.append('hashtags', hashtags);

    await api.post('posts', data);
    navigation.navigate('Feed');
  }

  TextInputCustom = ({ field }) => (
    <TextInput
      style={styles.input}
      autoCorrect={false}
      autoCapitalize="none"
      placeholderTextColor="#999"
      placeholder={`${field}`}
      // eslint-disable-next-line react/destructuring-assignment
      value={this.state[field]}
      onChangeText={value => this.setState({ [field]: value })}
    />
  );

  render() {
    const { preview } = this.state;
    return (
      <KeyboardAvoidingView style={styles.container}>
        <TouchableOpacity style={styles.selectButton} onPress={this.handleSelectImage}>
          <Text style={styles.selectButtonText}>Selecionar Image</Text>
        </TouchableOpacity>

        {
          preview && <Image style={styles.preview} source={preview} />
        }

        <this.TextInputCustom field="author" />
        <this.TextInputCustom field="place" />
        <this.TextInputCustom field="description" />
        <this.TextInputCustom field="hashtags" />

        <TouchableOpacity style={styles.shareButton} onPress={this.handleSubmit}>
          <Text style={styles.shareButtonText}>Compartilhar</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  selectButton: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
    height: 42,

    justifyContent: 'center',
    alignItems: 'center',
  },

  selectButtonText: {
    fontSize: 16,
    color: '#666',
  },

  preview: {
    width: 100,
    height: 100,
    marginTop: 10,
    alignSelf: 'center',
    borderRadius: 4,
  },

  input: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    marginTop: 10,
    fontSize: 16,
  },

  shareButton: {
    backgroundColor: '#7159c1',
    borderRadius: 4,
    height: 42,
    marginTop: 15,

    justifyContent: 'center',
    alignItems: 'center',
  },

  shareButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
  },
});
