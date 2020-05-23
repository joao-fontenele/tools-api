const { Joi, celebrate, Segments } = require('celebrate');
const ToolsController = require('../controllers/tools');

const tags = Joi.array().items(Joi.string());

const updateToolSchema = {
  title: Joi.string(),
  description: Joi.string(),
  link: Joi.string().uri(),
  tags: Joi.array().items(Joi.string()),
  id: Joi.string(),
};

function setupRoutes(app) {
  app.post(
    '/tools',
    celebrate({
      [Segments.BODY]: {
        title: Joi.string().required(),
        description: Joi.string().required(),
        link: Joi.string().uri().required(),
        tags: tags.required(),
      },
    }),
    ToolsController.create,
  );
  app.put(
    '/tools/:id',
    celebrate({ [Segments.BODY]: updateToolSchema }),
    ToolsController.update,
  );
  app.patch(
    '/tools/:id',
    celebrate({ [Segments.BODY]: updateToolSchema }),
    ToolsController.update,
  );
  app.get(
    '/tools',
    celebrate({
      [Segments.QUERY]: {
        tags,
        sort: Joi.string().valid('title', '-title').default('title'),
        offset: Joi.number().greater(-1).default(0),
        limit: Joi.number().greater(0).default(50),
      },
    }),
    ToolsController.find,
  );
  app.get(
    '/tools/:id',
    ToolsController.findOne,
  );
  app.delete(
    '/tools/:id',
    ToolsController.delete,
  );

  return app;
}

module.exports = {
  setupRoutes,
};
