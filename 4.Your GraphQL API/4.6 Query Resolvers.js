// #4.6 Query Resolvers (11:36)
/* Arguments에 대해 배우자 */

// resolver 만들기

// resolver는 하나의 객체가 된다.

// [server.js]
const resolvers = {
    Query : {
        tweet(){
            console.log("I'm called")
            return null;}
    }
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url})=>{
    console.log(`Running on ${url}`);
});

// 하고 그 localhost:4000의 거기의 Operation에서

{
  tweet(id:"test"){
    text
  }
}

// 이거 치고 Run 해보면 cmd에 "I'm called"하고 뜨지

// 핑퐁으로 테스트하기 

type Query{
    allTweets: [Tweet!]!
    tweet(id:ID!) : Tweet
    ping:String!
}

const resolvers = {
    Query : {
        tweet(){
            console.log("I'm called")
            return null;},
        ping(){ return "pong..!";}
    }
};

// [:4000]에서
{
  tweet(id:"test"){
    text
  }
  ping
}
// 하면 결과로

{
  "data": {
    "tweet": null,
    "ping": "pong..!"
  }
}

// ------------
// 그러면 이제 Query의 allTweets의 Field를 위한 resolver를 구현해보자

// 일단 가짜 db 먼저 만들고.

// 잠깐
type Tweet{
        id : ID!
        text : String!
        author : User << 이렇게 바꿔놔
}

// -------------------
// [server.js]
import {ApolloServer, gql} from "apollo-server";

/* fakeDB */
const tweets = [
    {id:"1",text:"hello"},
    {id:"2",text:"world"},
    {id:"3",text:"third one"},
];//fakeDB

const typeDefs = gql`
    type User{
        id : ID!
        username : String!
        firstName : String!
        lastName : String
    }
    type Tweet{
        id : ID!
        text : String!
        author : User
    }

    type Query{
        allTweets: [Tweet!]!
        tweet(id:ID!) : Tweet
        ping:String!
    }
    
    type Mutation{
        postTweet(text:String!, userId:ID!) : Tweet
        deleteTweet(id:ID!) : Boolean
    }
`;

const resolvers = {
    Query : {
        allTweets(){return tweets;}
    }
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url})=>{
    console.log(`Running on ${url}`);
});


// ------[4000]--------
// 입력 :

{
  allTweets {
    id
    text
  }
}

결과 : 
{
  "data": {
    "allTweets": [
      {
        "id": "1",
        "text": "hello"
      },
      {
        "id": "2",
        "text": "world"
      },
      {
        
        "id": "3",
        "text": "third one"
      }
    ]
  }
}

// ==========================================
const resolvers = {
    Query : {
        allTweets(){return tweets;},
        
        tweet(root,args){
            //자동으로 받아오는 root을 무시하기 위해 앞에 항상 앞에 넣어줘야함..
            console.log(args);
            return null;
        },
    }
};

//4000에서 
{
  tweet(id: "1") {
    text
  }
}
// 해보면

//결과 :
{
  "data": {
    "tweet": null
  }
}
//cmd에 콘솔
{ id: '1' }

//그럼 args를 풀어서 id만 가져오자 

const resolvers = {
  Query : {
      allTweets(){return tweets;},

      tweet(_,{id}){
          return tweets.find(tweet=>tweet.id === id);
      },
  }//Query
};