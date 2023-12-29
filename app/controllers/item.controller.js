const db = require("../models");
const { sendMail } = require("./mailer.controller");
const Item = db.items;
const Op = db.Sequelize.Op;

// Create and Save a new Item
exports.create = (req, res) => {
  // Validate request
  if (!req.body.amount) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
    return;
  }

  // Create a Item
  const item = {
    amount: req.body.amount,
    description: req.body.description,
    date: req.body.date,
    categoryId: req.body.categoryId,
  };

  // Save Item in the database
  Item.create(item)
    .then(data => {
      // send email here
      sendMail('recipient_email@example.com', 'Subject of your email', 'Content of your email');
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Item."
      });
    });
};

// Retrieve all Items from the database.
exports.findAll = (req, res) => {
  const amount = req.query.amount;
  var condition = amount ? { amount: { [Op.iLike]: `%${amount}%` } } : null;

  Item.findAll({ 
    attributes: ['id', 'amount', 'description', 'categoryId', 'date'],
    include: [{
      model: db.categories,
      attributes: ['name']
    }],
    where: condition })
    .then(data => {
      console.log("findAll data: ",data);
      // Process fetched items
      const itemsData = data.map(item => ({
        id: item.id,
        amount: item.amount,
        description: item.description,
        date: item.date,
        categoryId: item.categoryId,
        categoryName: item.category ? item.category.name : null // Access category name
      }));
      
      console.log("itemsData: ",itemsData);

      res.send(itemsData);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving items."
      });
    });
};

// Find a single Item with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Item.findByPk(id)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Item with id=" + id
      });
    });
};

// Update a Item by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Item.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Item was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Item with id=${id}. Maybe Item was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Item with id=" + id
      });
    });
};

// Delete a Item with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Item.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Item was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Item with id=${id}. Maybe Item was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Item with id=" + id
      });
    });
};

// Delete all Items from the database.
exports.deleteAll = (req, res) => {
  Item.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Items were deleted successfully!` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all items."
      });
    });
};

// find all published Item
exports.findAllPublished = (req, res) => {
  Item.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving items."
      });
    });
};