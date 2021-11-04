import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as Permissions from 'expo-permissions';
import db from '../config';

class TransactionScreen extends Component {
    constructor() {
        super();
        this.state = {
            hasCameraPermissions: null,
            scanned: false,
            scannedData: '',
            buttonState: 'normal',
            scannedStudentID: '',
            scannedBookID: '',
            transactionMessage: ''
        }
    }
    componentDidMount() {
        this.getCameraPermissions();
    }
    getCameraPermissions = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermissions: status === 'granted',
            buttonState: 'clicked',
            scanned: false
        })
    }
    handleBarCodeScanned = async ({ type, data }) => {
        this.setState({
            scanned: true,
            scannedData: data,
            buttonState: 'normal',
        });
    }
    handleTransaction = async() => {
        var transactionMessage = null;
        db.collection("books").doc(this.state.scannedBookID).get()
            .then((doc) => {
                var book = doc.data();
                if (book.bookAvailability) {
                    this.initiateBookIssue();
                    transactionMessage = "book issued"
                } else {
                    this.initiateBookReturn();
                    transactionMessage = 'book returned'
                }
            })
        this.setState({
            transactionMessage: transactionMessage
        })
    }
    initiateBookIssue = async () => {
        db.collection('transaction').add({
            'studentId': this.state.scannedStudentID,
            'bookId': this.state.scannedBookID,
            "data": db.Timestamp.now().toDate(),
            "transactionType": 'issue'
        });
        db.collection('books').doc(this.state.scannedBookID).update({
            'bookAvailability': false
        });
        db.collection('students').doc(this.state.scannedStudentID).update({
            'numberOfBooksIssued': db.FieldValue++
        });
        this.setState({
            scannedStudentID: '',
            scannedBookID: ''
        })
    }
    initiateBookReturn = async () => {
        db.collection('transaction').add({
            'studentId': this.state.scannedStudentID,
            'bookId': this.state.scannedBookID,
            "data": db.Timestamp.now().toDate(),
            "transactionType": 'return'
        });
        db.collection('books').doc(this.state.scannedBookID).update({
            'bookAvailability': true
        });
        db.collection('students').doc(this.state.scannedStudentID).update({
            'numberOfBooksIssued': db.FieldValue--
        });
        this.setState({
            scannedStudentID: '',
            scannedBookID: ''
        })
    }
    handleTransactionStudent = (e) => {
        this.setState({
            scannedStudentID: e.value
        })
    }
    handleTransactionBook = (e) => {
        this.setState({
            scannedBookID: e.value
        })
    }
    render() {
        const hasCameraPermissions = this.state.hasCameraPermissions;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState;
        if (buttonState === 'clicked' && hasCameraPermissions) {
            return(
                
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                    />
                    );
                    }else if(buttonState==='normal'){
            return (
                <View style={styles.main}>
                    <Image source={require('../assets/favicon.png')} style={{
                        width: '100px',
                        height:'100px'
                    }} />
                    <Text>
                        <h1>Tech Gunk's Wily</h1>
                    </Text>
                    
                    <TextInput onChange={this.handleTransactionStudent} value={this.state.scannedStudentID} placeholder="Student ID" style={styles.input} />
                        <TouchableOpacity onPress={this.getCameraPermissions} style={styles.buttonParent}>
                            <Text style={styles.buttonChild}>
                                Scan QR code
                            </Text>
                        </TouchableOpacity>
                    <TextInput onChange={this.handleTransactionBook} value={this.state.scannedBookID} placeholder="Book ID" style={styles.input} />
                        <TouchableOpacity onPress={this.getCameraPermissions} style={styles.buttonParent}>
                            <Text style={styles.buttonChild}>
                                Scan QR code
                            </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={async () => {
                        var transactionMessage = await this.handleTransaction();
                    }}>
                        <Text>
                            Submit
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }
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
        margin: '2px'
    }
})

export default TransactionScreen;

/*
Our pallete for the app
#F3F1F5 - light gray
#F0D9FF - light purple
#9657d1 - dark purple
#7F7C82 - dark gray
*/