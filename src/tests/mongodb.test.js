const mongoose = require('mongoose');
const connectStr = 'mongodb+srv://thhao:0nlLCeJmE8bC8gd4@cluster0.cmittl2.mongodb.net/shopDEV';

const TestSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model('Test', TestSchema);

describe('Mongoose Connection', () => {
  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(connectStr);
  })

  afterAll(async () => {
    await connection.disconnect();
  })

  it('should connect to mongose', () => {
    expect(mongoose.connection.readyState).toBe(1);
  })

  it('should save a document to the database', async () => {
    const user = new Test({ name: 'test' });
    await user.save();
    expect(user.isNew).toBe(false);
  })

  it('should find a document to the database', async () => {
    const user = await Test.findOne({ name: 'test' });
    expect(user).toBeDefined();
    expect(user.name).toBe('test');
  })
});