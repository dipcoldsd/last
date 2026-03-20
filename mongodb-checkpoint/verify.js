const { MongoClient } = require('mongodb');

async function run() {
  const uri = 'mongodb://localhost:27017';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB.");

    const db = client.db('contact');
    const collection = db.collection('contactlist');

    // Clear collection for fresh run
    await collection.deleteMany({});

    // Insert documents
    const docs = [
      { lastName: "Ben", firstName: "Moris", email: "ben@gmail.com", age: 26 },
      { lastName: "Kefi", firstName: "Seif", email: "kefi@gmail.com", age: 15 },
      { lastName: "Emilie", firstName: "brouge", email: "emilie.b@gmail.com", age: 40 },
      { lastName: "Alex", firstName: "brown", age: 4 },
      { lastName: "Denzel", firstName: "Washington", age: 3 }
    ];
    await collection.insertMany(docs);
    console.log("\n--- Inserted Contact List ---");

    // Display all
    const allContacts = await collection.find({}).toArray();
    console.log(allContacts);

    if (allContacts.length > 0) {
      // Display one by ID
      console.log("\n--- Display one person by ID ---");
      const onePerson = await collection.findOne({ _id: allContacts[0]._id });
      console.log(onePerson);
    }

    // Display age > 18
    console.log("\n--- Contacts with age > 18 ---");
    const over18 = await collection.find({ age: { $gt: 18 } }).toArray();
    console.log(over18);

    // Display age > 18 and name containing "ah"
    console.log('\n--- Contacts with age > 18 and name containing "ah" ---');
    const complexQuery = await collection.find({
      age: { $gt: 18 },
      $or: [ { firstName: /ah/i }, { lastName: /ah/i } ]
    }).toArray();
    console.log(complexQuery);

    // Change first name from "Seif" to "Anis"
    console.log('\n--- Updating Kefi Seif to Kefi Anis ---');
    await collection.updateOne(
      { lastName: "Kefi", firstName: "Seif" },
      { $set: { firstName: "Anis" } }
    );
    console.log("Updated.");

    // Delete aged < 5
    console.log('\n--- Deleting contacts under 5 ---');
    await collection.deleteMany({ age: { $lt: 5 } });
    console.log("Deleted.");

    // Display all
    console.log("\n--- Final Contacts List ---");
    const finalContacts = await collection.find({}).toArray();
    console.log(finalContacts);

  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

run();
