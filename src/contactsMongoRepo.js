const { MongoClient, ObjectId } = require('mongodb');
const Contact = require('../src/Contact')


const url = process.env.MONGODB_URL;
// const client = new MongoClient(`mongodb+srv://${process.env.USR}:${process.env.PASS}@zarademo.2tuvbvy.mongodb.net/?retryWrites=true&w=majority`);
const client = new MongoClient(url);
// https://cloud.mongodb.com/v2/642342d7fa9bbf3de56df0be#/clusters


async function run() {
  await client.connect();
 
 return 'Connected to the MongoDB server test...';
}

run()
  .then(console.log)
  .catch(console.error);

const repo = {
  findAll: async () => {
    let contacts = [];
    const contactsColl = client.db('zarademo').collection('contacts');
    const cursor = contactsColl.find({});
    await cursor.forEach(doc => {
      const contact = new Contact(doc._id.toString(), doc.firstName, doc.lastName, doc.email, doc.notes,new Date(doc.date).toString());
      contacts.push(contact);
    });
    return contacts;
  },
  findById: async (uuid) => {
    const contactsColl = client.db('zarademo').collection('contacts');
    const filter = {
      '_id': new ObjectId(uuid)
    };
    const doc = await contactsColl.findOne(filter);
    return new Contact(doc._id.toString(), doc.firstName, doc.lastName, doc.email, doc.notes,new Date(doc.date).toString());
  },

  create: async (contact) => {
    const doc = {firstName : contact.firstName,
        lastName: contact.lastName, 
        email : contact.email, 
        notes: contact.notes,
        date: new Date().toString()
    };

    const contactsColl = client.db('zarademo').collection('contacts');
    const result = await contactsColl.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  },

  deleteById: async (uuid) => {
    const contactsColl = client.db('zarademo').collection('contacts');
    const filter = {
      '_id': new ObjectId(uuid)
    };
    const result = await contactsColl.deleteOne(filter);
    if (result.deletedCount === 1) {
      console.log("Successfully deleted a documents.");
    } else {
      console.log("No documents matched the query. Deleted 0 documents.");
    }
  },
  update: async (contact) => { 
    const contactsColl = client.db('zarademo').collection('contacts');
    const filter = {
      '_id': new ObjectId(contact.id)
    };
    const updateDoc = {
      $set: {
        firstName : contact.firstName,
        lastName: contact.lastName, 
        email : contact.email, 
        notes: contact.notes,
        date : contact.date
      }
    };
    const result = await contactsColl.updateOne(filter, updateDoc);
    console.log(`${result.matchedCount} docs matched the filter, updated ${result.modifiedCount} document(s)`);
  },
};

module.exports = repo;