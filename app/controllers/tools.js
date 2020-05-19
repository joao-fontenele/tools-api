const logger = require('../utils/logger');
const Model = require('../models/tool');

class Controller {
  static async create(req, res) {
    try {
      const result = await Model.create(req.body);
      res.status(201).json(result);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ message: err.message });
    }
  }

  static async findOne(req, res) {
    const { id } = req.params;
    try {
      const model = await Model.findById({ _id: id });

      if (!model) {
        return res.status(404).send();
      }

      return res.json(model);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ message: err.message });
    }
  }

  static async find(req, res) {
    const {
      tags,
      limit,
      offset,
      sort,
    } = req.query;

    const filter = {};
    if (Array.isArray(tags) && tags.length) {
      // this is an OR filter. I.e., if the tool contains any of the tags,
      // it passes the filter
      filter.tags = { $in: tags };
    }

    try {
      const results = await Model.find(filter)
        .skip(offset)
        .limit(limit)
        .sort(sort);

      return res.json(results);
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ message: err.message });
    }
  }

  static async update(req, res) {
    const { id } = req.params;
    try {
      // TODO: handle __v changes when updating array changes
      const { n: affectedDocs } = await Model.updateOne({ _id: id }, req.body);

      if (affectedDocs) {
        return res.status(204).send();
      }

      return res.status(404).send();
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ message: err.message });
    }
  }

  static async delete(req, res) {
    const { id } = req.params;
    try {
      const { n } = await Model.deleteOne({ _id: id });

      if (n) {
        return res.status(204).send();
      }

      return res.status(404).send();
    } catch (err) {
      logger.error(err);
      return res.status(500).json({ message: err.message });
    }
  }
}


module.exports = Controller;
