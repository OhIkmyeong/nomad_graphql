//#4.8 Type Resolvers (08:51)

/* [server.js] */
import {ApolloServer, gql} from "apollo-server";

/* fakeDB */
let tweets = [
    {id:"1",text:"hello"},
    {id:"2",text:"world"},
    {id:"3",text:"third one"},
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
};//resolvers

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url})=>{
    console.log(`Running on ${url}`);
});


/* Operation */
{
    allUsers {
      id
      firstName
      lastName
    }
}

/* 결괴 */
{
    "data": {
      "allUsers": [
        {
          "id": "1",
          "firstName": "Din",
          "lastName": "Djarin"
        },
        {
          "id": "2",
          "firstName": "Luke",
          "lastName": "Skywalker"
        },
        {
          "id": "3",
          "firstName": "Moira",
          "lastName": "O'Deorain"
        }
      ]
    }
}
//1:00

//----------------------
//dynamic 필드를 다뤄보자
/* 지금은 fullName이라는 필드가 없어. resolver에서 fullName이라는 필드 추가하고싶어. 이런걸 dynamic field라고 한다 */

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
        fullName(){return "Hello"},
    },//User
};//resolvers

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url})=>{
    console.log(`Running on ${url}`);
});

/* 실행 */
{
    allUsers {
      id
      fullName
    }
}
/* 결과 */
{
    "data": {
      "allUsers": [
        {
          "id": "1",
          "fullName": "Hello"
        },
        {
          "id": "2",
          "fullName": "Hello"
        },
        {
          "id": "3",
          "fullName": "Hello"
        }
      ]
    }
  }

  /*  */
  import {ApolloServer, gql} from "apollo-server";

  /* fakeDB */
  let tweets = [
      {id:"1",text:"hello"},
      {id:"2",text:"world"},
      {id:"3",text:"third one"},
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
          fullName({firstName,lastName}){
              //root을 {firstName, lastName}으로 구조분해할당해서 받아온겅미
              return `${firstName} ${lastName}`},
      },//User
  };//resolvers
  
  const server = new ApolloServer({typeDefs, resolvers});
  
  server.listen().then(({url})=>{
      console.log(`Running on ${url}`);
  });
  