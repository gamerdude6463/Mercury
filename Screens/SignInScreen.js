 import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, Text, Image, Button,TextInput } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { NavigationHelpersContext } from '@react-navigation/native';

 



export default function SignInScreen() {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    
    
    function LogIn() {
      fetch("http:/127.0.0.1/token/",{
        method:"POST",
        headers:{
          'Content-Type':"application/json"
        },
        body: JSON.stringify({'username':username,'password':password})
      })
      .then(data => console.log(data))
      .then(()=>{SecureStore.setItemAsync(accestoken, data.accesstoken)})
      .then(()=>{SecureStore.setItemAsync(refreshtoken, data.refreshtoken)});

    }
    
    
    return (
      <View>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Button title="Sign in" onPress={ () => {LogIn()}} />
      </View>
    );
  }