import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, TextInput, ScrollView, FlatList } from 'react-native';
import {Button, Card} from "react-native-paper"

function Postdetail(props) {
    const data = props.route.params.data;
    const {id, title} =props.route.params.data;
    const [text, changeText] = React.useState(null);
    const [comment, changeComment] = React.useState([{text:"Comment"}]);

    useEffect(()=>{
      fetch(`http:/192.168.86.108/comment/${data.id}/`,{
        method:"GET"
      })
      .then(resp => resp.json())
      .then(data => {
        changeComment(data)
        console.log(comment)   
      })    

    },[])
  
    const deletedData = (data) => {
      fetch(`http:/192.168.86.108/snippets/${data.id}/`,{
        method:"DELETE",
        headers: { 
          "Content-type":"application/json"
        }
      })
      .then(
        data =>{
          props.navigation.navigate("Home")
        }
      )
    
    }
    const addComment = () =>{
      fetch("http:/192.168.86.108/comment/",{
          method:"POST",
          headers : {   
              "Content-Type":"application/json"
          },  
          body: JSON.stringify({text:text, postid:id})
      })
      .then(resp => resp.json())
      
      
   }
   const renderdata = (item) =>{
    return (  
    <Card style={styles.cardStyle} >
    <Text>{item.text}</Text> 
    </Card>
    )}

   return ( 
  
   <View>
    <View style = {styles.detailStyle}>
       <Card>
        <Text>{data.username}</Text>
        <Text style = {{fontSize:25}}>
          
          {data.title}
        </Text>
       </Card>
        <View>
          <Button icon = "delete"
          mode = "contained" onPress={() => deletedData(data)} style = {{marginTop:30}}>Delete</Button>
        </View>

    </View>
    <View style = {styles.commentStyle}>
      <TextInput 
        style={styles.input}
        onChangeText={(text) => {
          changeText(text)
        }}
        value={text}
        placeholder="Enter comment here"
      />
      <Button icon = "comment" 
          style = {styles.inputStyle}
          mode = "contained" 
          onPress={() => addComment()}
           >Comment</Button>
    </View>
    <View>
      <FlatList
      data = {comment}
      renderItem={({item})=>{
        return renderdata(item)
      }}
      keyExtractor={item => `${item.id}`}
      />
    </View>
   </View>
      
     
    )
}  

const styles = StyleSheet.create({ 

    detailStyle: {
        margin:10,
        padding:10,

    },
    input: {
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      flex:3
    },
  commentStyle:{
    flexDirection:"row"
  },
  inputStyle:{
    height: 40,
    marginTop:12,
    flex:1
  },
  cardStyle:{
    margin:10,
    padding:10
  }

}) 



export default Postdetail
