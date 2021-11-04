import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import firebase from 'firebase';
import { KeyboardAvoidingView } from 'react-native-web';

class Login extends React.Component{
    constructor(){
        super();
        this.state= {
            email : '',
            password: ''
        }
    }

    login = async (email, password) => {
        if(email && password){
            try{
           const res = await firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password);
            if(res){
                this.props.navigation.navigate('Transaction')
            }
            }catch(err){
            console.log(err)
        }
        }else{
            alert('Enter email and password')
        }
    }
    render(){
        return(
            <KeyboardAvoidingView style={styles.main}>
                <Image style={styles.image} source={require('../assets/icon.png')} />
                <View>
                    <TextInput style={styles.input} placeholder="Email" onChangeText={(text)=>{
                        this.setState({
                            email: text
                        })
                    }} />
                    <TextInput style={styles.input} placeholder="Password" secureTextEntry={true} onChangeText={(text)=>{
                        this.setState({
                            password: text
                        })
                    }} />
                </View>
                <View>
            <TouchableOpacity style={styles.buttonParent} onPress={()=>{
                this.login(this.state.email, this.state.password)
            }}>
                <Text style= {styles.buttonChild}>
                    Login
                </Text>
            </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            )
    }
}

const styles = StyleSheet.create({
    main: {
        color: '#9657d1',
        backgroundColor: '#F3F1F5',
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        flex:1,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonParent: {
        backgroundColor: '#9657d1',
        padding: '8px'
    },
    buttonChild: {
        color:'#fff'
    },
    input: {
        backgroundColor: 'white',
        color: 'black',
        margin: '2px',
        marginBottom: '5px',
        padding: '5px',
    },
    image:{
        width:'200px',
        height: '200px',
        borderRadius: 50,
        marginBottom: '300px'
    }
})

export default Login;