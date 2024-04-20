const typeDefs = `
type Position{
    x : Int!
    y : Int!
}
type Message{
    from : Position! 
    to : Position!
    color : String!
    room  : Int!
}
type Query{
    messages(
        room : Int!
    ) : [Message]
}
type Mutation{
    addMessage(
        fromX : Int!
        fromY : Int!
        toX : Int!
        toY : Int!
        room : Int!
        color : String!
    ):String
}
type Subscription{
    message(
        room : Int!
    ):Message
}
`

module.exports = typeDefs