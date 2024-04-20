const { ApolloServer } = require('@apollo/server')
const { expressMiddleware } = require( '@apollo/server/express4' );
const { ApolloServerPluginDrainHttpServer } = require( '@apollo/server/plugin/drainHttpServer' );
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const cors = require('cors')
const express = require('express')
const http  = require( 'http');
const typeDefs = require('./schema');
const resolvers = require('./resolver');
require("dotenv").config()

const start = async() => {
    const app = express()
    const httpServer = http.createServer(app);
    const schema = makeExecutableSchema({typeDefs,resolvers})

    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/',
        handleProtocols: p => {console.log(p)}
        // host : '0.0.0.0'
    });
    const wsListening = useServer({
        schema,
        onConnect : async (ctx) => {
          console.log('connected')
        },
        onDisconnect : () => {console.log('disconnected')}
    },wsServer);

    const apolloServer = new ApolloServer({
        schema,
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer }),
            {
                async serverWillStart() {
                  return {
                    async drainServer() {
                      await wsListening.dispose();
                    },
                  };
                },
            },
        ]
    })

    // apolloServer.applyMiddleware({app})
    // apolloServer.installSubsriptionHandlers(httpServer)

    await apolloServer.start()

    app.use(
        '/',
        cors(),
        express.json(),
        expressMiddleware(apolloServer),
    );

    httpServer.listen(process.env.PORT,() => {
      console.log(`🚀 Server is now running on http://localhost:${process.env.PORT}`)
  })

}

start()