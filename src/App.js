import React, { Component } from 'react';
import './App.css';
import Card from './Card/Card';
import DrawButton from './DrawButton/DrawButton';
import {DB_CONFIG} from './Config/Firebase/db_config';
import firebase from 'firebase/app';
import 'firebase/database';

class App extends Component {
  
  constructor (props){
    super(props);

    this.app = firebase.initializeApp(DB_CONFIG);
    this.database = this.app.database().ref().child('cards');

    this.updateCard = this.updateCard.bind(this);
    
    this.state = {
      cards: [],
      currentCard: {}

    }
  }
  

  componentWillMount(){
    
    //asign cards array as variable
    const currentCards = this.state.cards;
    
      this.database.on('child_added', snap =>{
        currentCards.push({
          id: snap.val().id,
          question: snap.val().question,
          answer: snap.val().answer,
        })

        // set array to the random deck and pull a card from it 
        this.setState({
          cards: currentCards,
          currentCard: this.getRandomCard(currentCards)
      })
    })
  }
  // function to pull a single card from random array of cards.
  getRandomCard(currentCards){
    let card = currentCards[Math.floor(Math.random()*currentCards.length)]
    return(card);
  }

  updateCard(){
    const currentCards = this.state.cards;
    this.setState({
      currentCard: this.getRandomCard(currentCards)
    })
  }

// laying out the front end.
  render() {
    return (
      <div className="App">
        <div className = "cardRow">  
        
          <Card question = {this.state.currentCard.question +" "+ this.state.currentCard.id +" / " + this.state.cards.length}
                pagination = {this.state.currentCard.id}
                answer = {this.state.currentCard.answer}
                />

        </div>
        <div className = "buttonRow">
            <DrawButton drawCard = {this.updateCard}/>
        </div>
      </div>
    );
  }
}

export default App;
