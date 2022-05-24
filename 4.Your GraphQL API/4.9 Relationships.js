// #4.9 Relationships (07:23)
/* Users와 Tweets를 연결해봅시다 */

//[server.js]
import {ApolloServer, gql} from "apollo-server";

/* fakeDB */
let tweets = [
    {id:"1",text:"rescue you",userId:"2"},
    {id:"2",text:"this is the way",userId:"1"},
    {id:"3",text:"coalascent",userId:"3"},
    {id:"4",text:"just do it",userId:"2"},
];//fakeDB

/* Users */
let users = [
    {id : "1", firstName:"Din", lastName:'Djarin'},
    {id : "2", firstName:"Luke", lastName:'Skywalker'},
    {id : "3", firstName:"Moira", lastName:'O\'Deorain'},
];//users

const typeDefs = gql`
    type User{
        id : ID!
        firstName : String!
        lastName : String
        fullName : String
    }
    type Tweet{
        id : ID!
        text : String!
        author : User
    }

    type Query{
        allUsers : [User!]!
        allTweets: [Tweet!]!
        tweet(id:ID!) : Tweet
    }
    
    type Mutation{
        postTweet(text:String!, userId:ID!) : Tweet!
        deleteTweet(id:ID!) : Boolean!
    }
`;

const resolvers = {
    Query : {
        allUsers(){
            return users;
        },

        allTweets(){return tweets;},

        tweet(root,{id}){
            return tweets.find(tweet=>tweet.id === id);
        },
    },//Query
    
    Mutation :{
        postTweet(_,{text,userId}){
            const newTweet = {
                id : tweets.length + 1,
                text};
            tweets.push(newTweet);
            return newTweet;
        },//postTweet
        deleteTweet(_,{id}){
            const tweet = tweets.find(tweet => tweet.id === id);
            if(!tweet){return false};
            tweets = tweets.filter(tweet => tweet.id !== id);
            return true;
        },//deleteTweet
    },//Mutation

    User:{
        firstName({firstName}){return firstName;},
        fullName({firstName,lastName}){return `${firstName} ${lastName}`},
    },//User

    Tweet:{
        author({userId}){return users.find(user => user.id === userId);}
    },//Tweet
};//resolvers

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url})=>{
    console.log(`Running on ${url}`);
});


//[Operation]
{
    allTweets {
      id
      text
      author{
        id
        fullName
      }
    }
}

//[Response]
{
    "data": {
      "allTweets": [
        {
          "id": "1",
          "text": "rescue you",
          "author": {
            "id": "2",
            "fullName": "Luke Skywalker"
          }
        },
        {
          "id": "2",
          "text": "this is the way",
          "author": {
            "id": "1",
            "fullName": "Din Djarin"
          }
        },
        {
          "id": "3",
          "text": "coalascent",
          "author": {
            "id": "3",
            "fullName": "Moira O'Deorain"
          }
        },
        {
          "id": "4",
          "text": "just do it",
          "author": {
            "id": "2",
            "fullName": "Luke Skywalker"
          }
        }
      ]
    }
}

