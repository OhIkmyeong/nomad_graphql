// #4.11 Migrating from REST to GraphQL (09:58)

//https://yts.mx/api/v2/list_movies.json

// 저 사이트에서 콘솔창에 다음과 같이 쳐서 받아오기

/* Movies */
const movies = {
    "id": 42332,
    "url": "https:\/\/yts.mx\/movies\/checkered-flag-or-crash-1977",
    "imdb_code": "tt0075831",
    "title": "Checkered Flag or Crash",
    "title_english": "Checkered Flag or Crash",
    "title_long": "Checkered Flag or Crash (1977)",
    "slug": "checkered-flag-or-crash-1977",
    "year": 1977,
    "rating": 4.5,
    "runtime": 95,
    "genres": [
        "Adventure",
        "Comedy"
    ],
    "summary": "Race car driver Walkaway Madden signs up for the big Manilla 1000 off-road race through the Philippines jungle. The photojournalist C.C. Wainwright comes along for the ride.",
    "description_full": "Race car driver Walkaway Madden signs up for the big Manilla 1000 off-road race through the Philippines jungle. The photojournalist C.C. Wainwright comes along for the ride.",
    "synopsis": "Race car driver Walkaway Madden signs up for the big Manilla 1000 off-road race through the Philippines jungle. The photojournalist C.C. Wainwright comes along for the ride.",
    "yt_trailer_code": "",
    "language": "en",
    "mpa_rating": "",
    "background_image": "https:\/\/yts.mx\/assets\/images\/movies\/checkered_flag_or_crash_1977\/background.jpg",
    "background_image_original": "https:\/\/yts.mx\/assets\/images\/movies\/checkered_flag_or_crash_1977\/background.jpg",
    "small_cover_image": "https:\/\/yts.mx\/assets\/images\/movies\/checkered_flag_or_crash_1977\/small-cover.jpg",
    "medium_cover_image": "https:\/\/yts.mx\/assets\/images\/movies\/checkered_flag_or_crash_1977\/medium-cover.jpg",
    "large_cover_image": "https:\/\/yts.mx\/assets\/images\/movies\/checkered_flag_or_crash_1977\/large-cover.jpg",
    "state": "ok",
    "torrents": [
        {
            "url": "https:\/\/yts.mx\/torrent\/download\/A888BFFE3ADD85C221E898F1CEBFA732EFBE7AF4",
            "hash": "A888BFFE3ADD85C221E898F1CEBFA732EFBE7AF4",
            "quality": "720p",
            "type": "bluray",
            "seeds": 0,
            "peers": 0,
            "size": "851.72 MB",
            "size_bytes": 893093151,
            "date_uploaded": "2022-05-25 01:09:20",
            "date_uploaded_unix": 1653433760
        }
    ],
    "date_uploaded": "2022-05-25 01:09:20",
    "date_uploaded_unix": 1653433760
};//movies


//Object.keys(movies);
//하면 다음과 같이 받아올 수 있음
const movie_keys = ['id', 'url', 'imdb_code', 'title', 'title_english', 'title_long', 'slug', 'year', 'rating', 'runtime', 'genres', 'summary', 'description_full', 'synopsis', 'yt_trailer_code', 'language', 'mpa_rating', 'background_image', 'background_image_original', 'small_cover_image', 'medium_cover_image', 'large_cover_image', 'state', 'torrents', 'date_uploaded', 'date_uploaded_unix'];


/****
 * tweetql 폴더에서
 * npm i node-fetch  */

/* [server.js] */
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
        summary : String!
        description_full : String!
        synopsis : String!
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


/* [Operation] */
{
    allMovies{
      id
      title
      rating
      summary
    }
}


/* [server.js] */
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


/* [Operation] */
query ($movieId: String!) {
    movie(id: $movieId) {
      title
      summary
      small_cover_image
    }
}
/* [Variables] */
{ 
    "movieId": "41438"
}

/* 결과 */
{
    "data": {
      "movie": {
        "title": "The Execution",
        "summary": null,
        "small_cover_image": "https://yts.mx/assets/images/movies/the_execution_2021/small-cover.jpg"
      }
    }
}
