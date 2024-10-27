import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('test-task');
    
    switch (req.method) {
      case 'POST':
        const bodyObject = JSON.parse(req.body);
        if (!bodyObject.task) {
          res.status(400).json({ error: "Task content is required" });
          return;
        }
        const result = await db.collection('tasks').insertOne(bodyObject);
        const newTask = { _id: result.insertedId, task: bodyObject.task }; 
        res.status(201).json({ status: 201, data: newTask });
        break;

      case 'GET':
        const tasks = await db.collection('tasks').find({}).toArray();
        res.status(200).json({ status: 200, data: tasks });
        break;

      case 'PUT':
        const { id, update } = JSON.parse(req.body);
        await db.collection('tasks').updateOne({ _id: new ObjectId(id) }, { $set: update });
        res.status(200).json({ status: 200, message: 'Task updated' });
        break;

      case 'DELETE':
        const { id: deleteId } = JSON.parse(req.body);
        await db.collection('tasks').deleteOne({ _id: new ObjectId(deleteId) });
        res.status(200).json({ status: 200, message: 'Task deleted' });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
}
