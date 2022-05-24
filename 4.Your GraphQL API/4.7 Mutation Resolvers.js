// #4.7 Mutation Resolvers (09:11)
//Mutation에 대해서
//Query나 Mutation이나 같은데 그냥 인간이 편하라고 개념적으로 나눈거야..
{//[server.js]
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
        }
        
        type Mutation{
            postTweet(text:String!, userId:ID!) : Tweet!
            deleteTweet(id:ID!) : Boolean!
        }
    `;
    
    const resolvers = {
        Query : {
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
            },
        },//Mutation
    };//resolvers
    
    const server = new ApolloServer({typeDefs, resolvers});
    
    server.listen().then(({url})=>{
        console.log(`Running on ${url}`);
    });

//-------- :4000 --------------
mutation{
    postTweet(text:"I am Ironman",userId:"1"){
      id
      text
    }
}
// 쓰고 run 해보면
//결과  :
{
    "data": {
      "postTweet": {
        "id": "4",
        "text": "I am Ironman"
      }
    }
}

// 그리고 operation에 다시 확인해보자
{
    allTweets {
      id
      text
    }
}

//결과에서 추가된걸 확인 가능
//(실수로 run버튼 두번 눌러서 두번 추가됐음;)
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
        },
        {
          "id": "4",
          "text": "I am Ironman"
        },
        {
          "id": "5",
          "text": "I am Ironman"
        }
      ]
    }
  }
}//

//자동완성을 이용해서 해봅시다.
mutation($text: String!, $userId: ID!){
    postTweet(text: $text, userId: $userId) {
      text
      id
    }
}

//밑에 Variables창에서
{
    "text": "Hello World....",
    "userId": "111111"
}

/* -------------- 이제 트윗을 지우는것도 해보자 ----------- */
const resolvers = {
    Query : {
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


//:4000에서 일단 확인을 해보면 
{
    allTweets {
      id
      text
    }
}

//결과 : 
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

//그럼 실제 db에 없는 id가 4인 애를 지워보자
//Operation
mutation($deleteTweetId: ID!){
    deleteTweet(id: $deleteTweetId)
}

//Variables
{
    "deleteTweetId": "55"
}

//Run 한 결과
{
    "data": {
      "deleteTweet": false
    }
}

// 만일 Variables에서 
{
    "deleteTweetId": "1"
}
//결과
{
    "data": {
      "deleteTweet": true
    }
}
//하고 다시 확인해보면
//Operation
{
    allTweets {
      id
      text
    }
}
//Run
{
    "data": {
      "allTweets": [
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
//이렇게 지워진걸 확인 가능

