import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,Button, TextInput } from 'react-native';
import Home from "./Screens/Home";
import New from "./Screens/New";
import Postdetail from './Screens/Postdetails';
import SelectSchool from './Screens/SelectSchool';
import VerifySchool from './Screens/VerifySchools';
import { NavigationContainer, StackActions } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import * as SecureStore from 'expo-secure-store';
import { useNavigation } from '@react-navigation/native';
import react from 'react';

export const AuthContext = React.createContext();

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}






function Register({route}) {
  const email = route.params.email
  const school = route.params.school
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [{signUp}, state] = React.useContext(AuthContext);


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
      <Button title="Sign up" onPress={() => signUp({ username, password, email})} />
    </View>
  );
}

function SignInScreen() {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const [usernamestate, setusernamestate] = React.useState(username)
 
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
      <Button title="Sign in" onPress={() => signIn({ username, password })} />
    </View>
  );
}

const Stack = createStackNavigator();

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);

}



export default function App({ navigation }) {
  
  const [loading,setLoading] = React.useState(true);
  
  
  async function Verify(){    
    const res = await fetch("http:/192.168.86.108/getinfofromtoken/",{
      method:"GET",
      headers:{  
        'Authorization': state.accesstoken,
      },        
    }).then(response => response.json());

 console.log(res)
 dispatch({ type: 'SET_USER_DATA', school: res.school, username: res.username });
} 

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            accesstoken: action.accesstoken,
            refreshtoken: action.refreshtoken,
            isLoading: false,
          }; 
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            refreshtoken: action.refreshtoken,
            accesstoken: action.accesstoken
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
        case 'SET_USER_DATA':
          return {
            ...prevState,
            username: action.username,
            school: action.school
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      refreshtoken: null,
      accesstoken: null,
      username: null,
      school: null,
    }
  );
   React.useEffect(() => {

    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;
       // replenish
       
      try {
        userToken = await SecureStore.getItemAsync('accesstoken');
        // Restore token stored in `SecureStore` or any other encrypted storage
        // userToken = await SecureStore.getItemAsync('userToken');
      } catch (e) {
        // Restoring token failed
        console.log("error")
      }
      // After restoring token, we may need to validate it in production apps
     
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      if (userToken != null){
        dispatch({ type: 'RESTORE_TOKEN', token: userToken });
      }
      
    };

    bootstrapAsync();
  }, []);

  
  
  React.useEffect(() => {

    // Fetch the token from storage then navigate to our appropriate plac

    if (state.accesstoken != null){
     Verify()
    }
  }, [state.accesstoken]);

  const authContext = React.useMemo(
    () => ({
      signIn: async (data) => {
        // In a production app, we need to send some data (usually username, password) to server and get a token
        // We will also need to handle errors if sign in failed
        // After getting token, we need to persist the token using `SecureStore` or any other encrypted storage
        // In the example, we'll use a dummy token
        async function Signinlol1(){
        
          return fetch("http:/192.168.86.108/token/",{
            method:"POST",
            headers:{ 
              'Content-Type':"application/json"
            },
            body: JSON.stringify({'username':data.username,'password':data.password})
            
          }).then(response => response.json());
        }
        const usertokens123 = await Signinlol1();

        save("refreshtoken", usertokens123.refresh)
        save("usertoken", usertokens123.access)
        dispatch({ type: 'SIGN_IN', refreshtoken: usertokens123.refresh, accesstoken: usertokens123.access });
        

      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async (data) => {
       async function Signuplol(){
        
        return fetch("http:/192.168.86.108/register/",{
          method:"POST",
          headers:{ 
            'Content-Type':"application/json"
          },
          body: JSON.stringify({'username':data.username,'password':data.password,'email':data.email, "school": data.school})
          
        }).then(response => response.json());
      }
      const usertokens12 = await Signuplol();
      save("refreshtoken", usertokens12.refreshtoken)
      save("usertoken", usertokens12.accesstoken)
        
      dispatch({ type: 'SIGN_IN', refreshtoken: usertokens12.refreshtoken, accesstoken:usertokens12.accesstoken });
      
      },
    }),
    []
  );


  React.useEffect(()=>{
    if(loading){
      updateToken()
     }

    let interval = setInterval(() => {
      if(state.refreshtoken){
        updateToken()
        
      }
    }, 240000)
    return ()=> clearInterval(interval)
  },[state.refreshtoken,loading])


  let updateToken = async ()=> {
    
    let response = await fetch('http://192.168.86.108/token/refresh/', {
        method:'POST',
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify({'refresh': state.refreshtoken})
    })

    let data = await response.json()
    if (response.status === 200){
     
     dispatch({ type: 'RESTORE_TOKEN', accesstoken: data.access, refreshtoken: data.refresh });
    }else {
      console.log(data)
    }
    if(loading == true){
      setLoading(false)
  }
}

  return (
    <AuthContext.Provider value={[authContext,state]}>
    <NavigationContainer>
      <Stack.Navigator>
      
         {state.accesstoken == null ? (
          // No token found, user isn't signed in
          <React.Fragment>
          
          <Stack.Screen name="VerifySchool" component = {VerifySchool}
          options = {{...headerstyles,title:"Verify school"}} /> 
          <Stack.Screen name="SignInScreen" component = {SignInScreen}
          options = {{...headerstyles,title:"Sign in"}} /> 
          <Stack.Screen name="SelectSchool" component = {SelectSchool}
          options = {{...headerstyles,title:"Select Your School"}} /> 
          
          <Stack.Screen name="Register" component = {Register}
          options = {{...headerstyles,title:"Register"}} /> 
          
         </React.Fragment>
    
         ) : (
         <React.Fragment>
          <Stack.Screen name="Home" component = {Home}
          options = {headerstyles} /> 
          <Stack.Screen name="new" component = {New}
          options = {{...headerstyles,title:"Create New Post"}} /> 
          <Stack.Screen name="detail" component = {Postdetail}
          options = {{...headerstyles,title:"View details"}} />
          
         </React.Fragment>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  </AuthContext.Provider>
  );
  }
  
  
  
  
  
  const headerstyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#eddfdf', 
    },
  });