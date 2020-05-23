const get = require('lodash.get');
const omit = require('lodash.omit');
const Tool = require('../../../app/models/tool');

describe('/tools routes ', async function () {
  const baseRoute = '/tools';
  let tool = {};
  let id;

  beforeEach(async function () {
    tool = {
      title: 'A title',
      link: 'https://title.com',
      description: 'A tool description, etc',
      tags: ['tag1', 'tag2'],
    };
    const result = await Tool.create(tool);
    id = result._id.toString();
  });

  afterEach(async function () {
    await Tool.deleteMany();
  });

  describe('create route', function () {
    it('should save a new tool if all is correct', function () {
      return request(app)
        .post(baseRoute)
        .send(tool)
        .expect(201)
        .then((res) => {
          expect(res.headers['x-powered-by']).to.not.exist;
          const { id: thisId, ...rest } = res.body;
          expect(thisId).to.be.a.string;
          expect(rest).to.be.eql(tool);
        });
    });

    context('should return validation errors', function () {
      it('when title is not valid', function () {
        return request(app)
          .post(baseRoute)
          .send(omit(tool, 'title'))
          .expect(400)
          .then((res) => {
            expect(get(res, 'body.validation.keys')).to.include('title');
          });
      });

      it('when link is not valid', function () {
        tool.link = 'this is not a link';
        return request(app)
          .post(baseRoute)
          .send(tool)
          .expect(400)
          .then((res) => {
            expect(get(res, 'body.validation.keys')).to.include('link');
          });
      });

      it('when tool is not valid', function () {
        return request(app)
          .post(baseRoute)
          .send(omit(tool, 'description'))
          .expect(400)
          .then((res) => {
            expect(get(res, 'body.validation.keys')).to.include('description');
          });
      });

      it('when tags is not valid', function () {
        return request(app)
          .post(baseRoute)
          .send(omit(tool, 'tags'))
          .expect(400)
          .then((res) => {
            expect(res.headers['x-powered-by']).to.not.exist;
            expect(get(res, 'body.validation.keys')).to.include('tags');
          });
      });
    });
  });

  describe('update route', function () {
    it('should patch a tool if such a tool exists', function () {
      const updatedTitle = 'An updated title';
      return request(app)
        .put(`${baseRoute}/${id}`)
        .send({ title: updatedTitle })
        .expect(204)
        .then(async (res) => {
          expect(res.headers['x-powered-by']).to.not.exist;
          const { title } = (await Tool.findById(id)).toJSON();
          expect(title).to.be.equal(updatedTitle);
        });
    });

    it('should return not found when trying to update an invalid id', function () {
      const updatedTitle = 'An updated title';
      return request(app)
        .put(`${baseRoute}/5ec34ee7d75f3a3bab448567`)
        .send({ title: updatedTitle })
        .expect(404);
    });
  });

  describe('delete route', function () {
    it('should delete a tool if such a tool exists', function () {
      return request(app)
        .delete(`${baseRoute}/${id}`)
        .expect(204)
        .then(async (res) => {
          expect(res.headers['x-powered-by']).to.not.exist;
        });
    });

    it('should return not found when trying to delete an invalid id', function () {
      return request(app)
        .delete(`${baseRoute}/5ec34ee7d75f3a3bab448567`)
        .expect(404)
        .then(async (res) => {
          expect(res.headers['x-powered-by']).to.not.exist;
        });
    });
  });

  describe('find one route', function () {
    it('should get a tool if such a tool exists', function () {
      return request(app)
        .get(`${baseRoute}/${id}`)
        .expect(200)
        .then(async (res) => {
          expect(res.headers['x-powered-by']).to.not.exist;
          expect(res.body).to.be.eql({ id, ...tool });
        });
    });

    it('should return not found when trying to get an invalid id', function () {
      return request(app)
        .get(`${baseRoute}/5ec34ee7d75f3a3bab448567`)
        .expect(404)
        .then(async (res) => {
          expect(res.headers['x-powered-by']).to.not.exist;
        });
    });
  });

  describe('find route', function () {
    let tool2;

    beforeEach(async function () {
      tool2 = { ...tool, title: 'Hey this is a title', tags: ['tag3'] };
      await Tool.create(tool2);
    });

    context('with no params', function () {
      it('should return all the 2 current tools', function () {
        return request(app)
          .get(baseRoute)
          .expect(200)
          .then(async (res) => {
            expect(res.headers['x-powered-by']).to.not.exist;
            expect(res.body[0].id).to.be.a.string;
            expect(res.body[1].id).to.be.a.string;
            expect(omit(res.body[0], 'id')).to.be.eql(tool);
            expect(omit(res.body[1], 'id')).to.be.eql(tool2);
          });
      });
    });

    context('with pagination params', function () {
      it('should be able to fetch first page with offset=0 and limit=1', async function () {
        await request(app)
          .get(`${baseRoute}?offset=0&limit=1`)
          .expect(200)
          .then(async (res) => {
            expect(res.headers['x-powered-by']).to.not.exist;
            expect(res.body[0].id).to.be.a.string;
            expect(omit(res.body[0], 'id')).to.be.eql(tool);
          });
      });

      it('should be able to fetch second page with offset=1 and limit=1', async function () {
        return request(app)
          .get(`${baseRoute}?offset=1&limit=1`)
          .expect(200)
          .then(async (res) => {
            expect(res.headers['x-powered-by']).to.not.exist;
            expect(res.body[0].id).to.be.a.string;
            expect(omit(res.body[0], 'id')).to.be.eql(tool2);
          });
      });

      it('should return empty array when paginating out of bounds', async function () {
        return request(app)
          .get(`${baseRoute}?offset=2&limit=1`)
          .expect(200)
          .then(async (res) => {
            expect(res.headers['x-powered-by']).to.not.exist;
            expect(res.body).to.be.eql([]);
          });
      });
    });

    context('with filtering params', function () {
      it('should filter based on tags', function () {
        return request(app)
          .get(`${baseRoute}?tag=tag1`)
          .expect(200)
          .then(async (res) => {
            expect(res.headers['x-powered-by']).to.not.exist;
            expect(res.body[0].id).to.be.a.string;
            expect(omit(res.body[0], 'id')).to.be.eql(tool);
          });
      });

      it('should filter with OR from tags params', function () {
        return request(app)
          .get(`${baseRoute}?tag=tag1&tag=tag3`)
          .expect(200)
          .then(async (res) => {
            expect(res.headers['x-powered-by']).to.not.exist;
            expect(res.body[0].id).to.be.a.string;
            expect(res.body[1].id).to.be.a.string;
            expect(omit(res.body[0], 'id')).to.be.eql(tool);
            expect(omit(res.body[1], 'id')).to.be.eql(tool2);
          });
      });

      it('should return empty array when there is no tool that fill the search criteria', function () {
        return request(app)
          .get(`${baseRoute}?tag=tag5`)
          .expect(200)
          .then(async (res) => {
            expect(res.headers['x-powered-by']).to.not.exist;
            expect(res.body).to.be.eql([]);
          });
      });
    });

    context('with sorting params', function () {
      it('should sort by title ascending', function () {
        return request(app)
          .get(`${baseRoute}?sort=title`)
          .expect(200)
          .then(async (res) => {
            expect(res.headers['x-powered-by']).to.not.exist;
            expect(res.body[0].id).to.be.a.string;
            expect(res.body[1].id).to.be.a.string;
            expect(omit(res.body[0], 'id')).to.be.eql(tool);
            expect(omit(res.body[1], 'id')).to.be.eql(tool2);
          });
      });

      it('should sort by title descending', function () {
        return request(app)
          .get(`${baseRoute}?sort=-title`)
          .expect(200)
          .then(async (res) => {
            expect(res.headers['x-powered-by']).to.not.exist;
            expect(res.body[0].id).to.be.a.string;
            expect(res.body[1].id).to.be.a.string;
            expect(omit(res.body[1], 'id')).to.be.eql(tool);
            expect(omit(res.body[0], 'id')).to.be.eql(tool2);
          });
      });
    });
  });
});
