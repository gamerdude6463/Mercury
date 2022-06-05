import react from 'react';
import React from 'react';
import {useState, useEffect, useContext} from 'react';
import { StyleSheet, Text, View, Button, FlatList, Alert } from 'react-native';
import {Card, Title, FAB} from "react-native-paper";
import postdetails from './Postdetails';
import * as SecureStore from 'expo-secure-store';
import  {AuthContext}  from '../App'




 
function Home(props) {
    const [{signUp}, state] = React.useContext(AuthContext);
    console.log(state.username)
    console.log(state.school)
    
    const [data,setData] = useState("")
    const [loading,setLoading] = useState(true)
  
    const loadData = () => {
        fetch("http:/192.168.86.108/snippets/",{
            method:"GET",
            
        })
        .then(resp => resp.json())
        .then(data =>{
            setData(data)
            setLoading(false)
         })
        .catch(error => Alert.alert("error"))

    }
    const openItem = (data) => {
        props.navigation.navigate("detail", {data:data})
    }
    useEffect(()=>{
        fetch("http:/192.168.86.108/snippets/",{
            method:"GET",
            headers:{  
                'Authorization': state.accesstoken,
              },
        })
        .then(resp => resp.json())
        .then(data =>{
            setData(data)
            setLoading(false)
         })
        .catch(error => Alert.alert("error"))
     },[])
    const renderdata = (item) =>{
        return (  
        <Card style={styles.cardStyle}  onPress={()=> openItem(item)}>
        <Text style = {{fontSize:25}}>{item.title}</Text> 
        </Card>
        )}
    return (
        <View>
         <FlatList
            data = {data}
            renderItem={({item})=>{
                return renderdata(item)
            }}
            onRefresh={() => loadData()}
            refreshing = {loading}
            keyExtractor={item=>`${item.id}`}
        />

        <FAB
            style = {styles.fab}
            small = {false}
            icon = "plus"

            onPress={() => props.navigation.navigate("new")}
        />
        </View>
       
    )
}

const styles = StyleSheet.create({
    cardStyle: {
      margin: 10,
      padding: 10,
      
    },  
    fab: {
        position:"absolute",
        margin:16,
        right:0,
        bottom:0,
        backgroundColor:"blue"
    }
  });
export default Home
