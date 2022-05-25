import {ApolloServer, gql} from "apollo-server";
import fetch from "node-fetch";

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
        """
        fullName is the sum of firstName and lastName
        """
        fullName : String
    }
    
    """
    Tweet Object represents a resource for a Tweet.
    """
    type Tweet{
        id : ID!
        text : String!
        author : User
    }

    type Query{
        allUsers : [User!]!
        allTweets: [Tweet!]!
        tweet(id:ID!) : Tweet
        allMovies : [Movie!]!
        movie(id:String!) : Movie
    }
    
    type Mutation{
        postTweet(text:String!, userId:ID!) : Tweet!
        deleteTweet(id:ID!) : Boolean!
    }

    """
    from Rest API to GraphQL
    """
    type Movie{
        id : Int!
        url : String!
        imdb_code : String!
        title : String!
        title_english : String!
        title_long : String!
        slug : String!
        year : Int!
        rating : Float!
        runtime : Float!
        genres : [String]!
        summary : String
        description_full : String!
        synopsis : String
        yt_trailer_code : String!
        language : String!
        background_image : String!
        background_image_original : String!
        small_cover_image : String!
        medium_cover_image : String!
        large_cover_image : String!
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

        allMovies(){
            return fetch('https://yts.mx/api/v2/list_movies.json').then(res=>res.json()).then(json=>json.data.movies);
        },//allMovies 

        movie(_,{id}){
            return fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${id}`).then(res=>res.json()).then(json=>json.data.movie);
        },//movie
    },//Query
    
    Mutation :{
        postTweet(_,{text,userId}){
            const newTweet = {
                id : tweets.length + 1,
                text,
                userId};
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
