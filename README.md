To perform CRUD operations on a MongoDB database in Next.js 13.4, you can follow the steps below:

1. Install the necessary dependencies:
   - MongoDB driver: `npm install mongodb`

2. Create a new folder called `api` inside the root directory of your Next.js project. This folder will contain the API routes.

3. Inside the `api` folder, create a new file called `db.js`. This file will handle the database connection. Add the following code:

```javascript
import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const dbName = 'your-database-name'; // Replace with your database name

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db(dbName);
  } catch (error) {
    console.error('Error connecting to MongoDB', error);
  }
}

export { connect, ObjectId };
```

Replace `your-database-name` with the name of your MongoDB database.

4. In your Next.js API route files (e.g., inside the `api` folder), you can now import the `connect` function and `ObjectId` from the `db.js` file to establish a connection to the MongoDB database and perform CRUD operations. Here's an example of a Next.js API route that demonstrates CRUD operations:

```javascript
import { connect, ObjectId } from '../api/db';

export default async function handler(req, res) {
  const db = await connect();

  if (req.method === 'GET') {
    // Retrieve all documents from a collection
    const collection = db.collection('your-collection-name');
    const documents = await collection.find().toArray();
    res.status(200).json(documents);
  } else if (req.method === 'POST') {
    // Insert a new document into a collection
    const { name, age } = req.body;
    const collection = db.collection('your-collection-name');
    const result = await collection.insertOne({ name, age });
    res.status(201).json(result.insertedId);
  } else if (req.method === 'PUT') {
    // Update a document in a collection
    const { id, name, age } = req.body;
    const collection = db.collection('your-collection-name');
    const result = await collection.updateOne({ _id: ObjectId(id) }, { $set: { name, age } });
    res.status(200).json(result.modifiedCount);
  } else if (req.method === 'DELETE') {
    // Delete a document from a collection
    const { id } = req.body;
    const collection = db.collection('your-collection-name');
    const result = await collection.deleteOne({ _id: ObjectId(id) });
    res.status(200).json(result.deletedCount);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
```

Replace `your-collection-name` with the name of your MongoDB collection.

In this example, the API route handles GET, POST, PUT, and DELETE requests. You can modify the code based on your specific requirements and perform the necessary CRUD operations on your MongoDB database.

Remember to replace the MongoDB connection string with your own connection string, which can be obtained from the MongoDB Atlas dashboard or by running MongoDB locally.

Note: Make sure your MongoDB server is running before starting your Next.js project.