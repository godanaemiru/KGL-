const Produce = require('../models/Produce');

// Add new produce to stock (Manager Only)
exports.addProduce = async (req, res) => {
  try {
    const newProduce = new Produce(req.body);
    await newProduce.save();
    res.status(201).json({ message: 'Produce procured successfully', produce: newProduce });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all produce (Useful for pre-populating prices for sales agents)
exports.getProduce = async (req, res) => {
  try {
    const produceList = await Produce.find();
    res.status(200).json(produceList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};