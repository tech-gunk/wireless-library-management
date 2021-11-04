import React, { Component } from 'react';
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-web';
import db from '../config';

class SearchScreen extends Component {
    constructor(){
        super();
        this.state={
            allTransactions: [],
            search: '',
            lastVisibleTransaction:null,
            type:''
        }
        
    }
    
    componentDidMount = async () =>{
            const query = await db.collection("transactions").limit(10).get();
            query.docs.map(doc=>{
                this.setState({
                    allTransactions: [],
                    lastVisibleTransaction: doc
                })
            })
    }
    searchTransactions= async (text)=>{
        this.setState({
            allTransactions: []
        })
        var enteredText = text.split("")  
      if (enteredText[0] ==='B'||enteredText[0] ==='b'){
        const transaction =  await db.collection("transactions").where('bookId','==',text.toUpperCase()).get()
        transaction.docs.map((doc)=>{
          this.setState({
            allTransactions:[...this.state.allTransactions,doc.data()],
            lastVisibleTransaction: doc,
            type:'Book'
          })
        })
      }
      else if(enteredText[0] === 'S'||enteredText[0] === 's'){
        const transaction = await db.collection('transactions').where('studentId','==',text.toUpperCase()).get()
        transaction.docs.map((doc)=>{
          this.setState({
            allTransactions:[...this.state.allTransactions,doc.data()],
            lastVisibleTransaction: doc,
            type:'Student'
          })
        })
      }
        console.log(this.state.allTransactions)
    }

    fetchMoreTransactions=async ()=>{
        var text = this.state.search.toUpperCase()
      var enteredText = text.split("")

      
      if (enteredText[0] ==='B'){
      const query = await db.collection("transactions").where('bookId','==',text.toUpperCase()).startAfter(this.state.lastVisibleTransaction).limit(10).get()
      query.docs.map((doc)=>{
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data()],
          lastVisibleTransaction: doc,
          type:'Book'
        })
      })
    }
      else if(enteredText[0] === 'S'){
        const query = await db.collection("transactions").where('bookId','==',text.toUpperCase()).startAfter(this.state.lastVisibleTransaction).limit(10).get()
        query.docs.map((doc)=>{
          this.setState({
            allTransactions: [...this.state.allTransactions, doc.data()],
            lastVisibleTransaction: doc,
            type:'Student'
          })
        })
      }
    }

    render() {
        
        return (
            <View style={styles.main}>
                <Text>
                    <h1>Search</h1>
                </Text>
                <TextInput 
                onChangeText={(text)=>{
                    this.setState({
                        search: text,
                    })
                }} 
                style={styles.input} 
                placeholder="Search a student ID or book ID"
                 /><TouchableOpacity onPress={
                     ()=>{
                         this.searchTransactions(this.state.search);
                     }
                 } style={styles.btn}>
                     {/* <svg style={styles.icon} class="svg-icon search-icon" aria-labelledby="title desc" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.9 19.7"><title id="title">Search Icon</title><desc id="desc">A magnifying glass icon.</desc><g class="search-path" fill="none" stroke="#FFFFFF"><path stroke-linecap="square" d="M18.5 18.3l-5.4-5.4"/><circle cx="8" cy="8" r="7"/></g></svg> */}
                     <Text style={styles.btn}>Search</Text>
                 </TouchableOpacity>
                 <FlatList
          data={this.state.allTransactions}
          renderItem={({item})=>(
            <View style={{backgroundColor:"white", width: "100vw", textAlign:'center'}}>
              <Text><h3>{this.state.type}</h3></Text>
              <Text>{"Book Id: " + item.bookId}</Text>
              <Text>{"Student id: " + item.studentId}</Text>
              <Text>{"Transaction Type: " + item.transactionType}</Text>
              <Text>{"Date: " + item.date.toDate()}</Text>
            </View>
          )}
          keyExtractor= {(item, index)=> index.toString()}
          onEndReached ={this.fetchMoreTransactions}
          onEndReachedThreshold={0.7}
        />      
            </View>
        );
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
        display: 'flex',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        backgroundColor: 'white',
        color: 'black',
        margin: '2px',
        padding: '2px',
        width: '300px',
        textAlign: 'center'
    },
    btn: {
        backgroundColor: '#9657d1',
        color: 'white',
        padding: '8px'
    },
    icon:{

    }
})

export default SearchScreen;

/*
Our pallete for the app
#F3F1F5 - light gray
#F0D9FF - light purple
#9657d1 - dark purple
#7F7C82 - dark gray
*/