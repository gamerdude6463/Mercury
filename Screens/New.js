import React , {useState} from 'react'
import { StyleSheet, Text, View } from 'react-native';
import {TextInput, Button} from 'react-native-paper';
import AuthContext from "../App"

function New(props) {
 const [{signUp}, state] = React.useContext(AuthContext);
 const [title,setTitle] = useState()
 

    
 const insertData = () =>{
    fetch("http:/192.168.86.108/newpost/",{
        method:"POST",
        headers : { 
            "Content-Type":"application/json",
            'Authorization': state.accesstoken,
        }, 
        body: JSON.stringify({title:title, username:state.username, school:state.school})
    })
    .then(resp => resp.json())
    .then(data =>{
        props.navigation.navigate("Home")
    })
    
 }
    return (
        <View>
            <TextInput style = {styles.inputStyle}
                    label="New Post"
                    value = {title}
                    mode = "outlined"
                    multiline
                    numberOfLines={11}

                    onChangeText = { (text) => {
                    setTitle(text)
                    
                    }}

                />
                <Button
                    icon = "pencil"
                    mode = "contained"
                    onPress={()=> insertData()}>Post
                </Button>
                
         </View>
        
    )
}
const styles = StyleSheet.create({
    inputStyle:{
        margin:50,
        paddingHorizontal:20,
        justifyContent: 'center',
    },
    cardStyle: {
        margin: 10,
        padding: 10,
        
      }
})
export default New
