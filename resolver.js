const {PubSub, withFilter} = require('graphql-subscriptions')
require('dotenv').config

const pubsub = new PubSub()

const messages = []

const resolvers = { 
    Query : {
        messages : async (_,args) => {
            return messages.filter(e => e.room === args.room)
        }
    },
    Mutation : {
        addMessage : async(_,args) => {
            const newMessage = {
                from : {x : args.fromX,y : args.fromY},
                to : {x : args.toX,y : args.toY},
                room : args.room,
                color : args.color
            }
            messages.push(newMessage)
            pubsub.publish('MESSAGE_ADDED',{message : newMessage})
            return "success"
        }
    },
    Subscription : {
        message : {
            subscribe : withFilter(
                () => pubsub.asyncIterator(['MESSAGE_ADDED']),
                (payload,variables) => payload.message.room === variables.room
            )
        }
    }
}

module.exports = resolvers