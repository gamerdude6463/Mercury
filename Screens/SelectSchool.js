import React from 'react';
import { StyleSheet, View, Text, Image, Button, FlatList } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Card, Title, FAB} from "react-native-paper";
import { NavigationHelpersContext } from '@react-navigation/native';

export default function SelectSchool({route}) {
  const selectedSchool = null
  const schoolelements = []
  const school = route.params.school;
  const email = route.params.email;
  console.log(JSON.stringify(email))
  console.log(email)
  


  school.forEach((item) =>{
      schoolelements.push({id:{item},title:{item}})
  })

  const renderItem = ({ item }) => {
   

    return (
        <Card onPress={()=> navigation.navigate("Register",{school:school,email:email})}>
            <Text>{item.title}</Text>
        </Card>
    )
      
  };

    return (
        <View>
        <FlatList
        data={schoolelements}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        extraData={selectedId}
      /></View>
    );
}
