/* eslint-disable arrow-body-style */
const httpStatus = require('http-status');
const request = require('supertest');
const express = require('express');

const { allowOnly, accessLevels, userRoles } = require('../../utils/enums/userRoles');

describe('Test user roles and allow access', () => {
  let app;
  let router;

  describe('check admin access', () => {
    beforeAll(() => {
      app = express();

      app.use((req, res, next) => {
        req.user = {
          role: 'admin'
        };
        next();
      });

      router = express.Router();

      router.get('/testAdmin', allowOnly(accessLevels.admin), (req, res) => {
        res.status(200)
          .send('OK');
      });

      router.get('/testManager', allowOnly(accessLevels.manager), (req, res) => {
        res.status(200)
          .send('OK');
      });

      router.get('/testPolice', allowOnly(accessLevels.police), (req, res) => {
        res.status(200)
          .send('OK');
      });

      router.get('/testUser', allowOnly(accessLevels.user), (req, res) => {
        res.status(200)
          .send('OK');
      });

      app.use('/', router);
    });

    test('it should get access only to admin', async () => {
      await request(app)
        .get('/testAdmin')
        .expect(httpStatus.OK);
    });

    test('it should get access only to manager', async () => {
      await request(app)
        .get('/testManager')
        .expect(httpStatus.OK);
    });

    test('it should get access only to police', async () => {
      await request(app)
        .get('/testPolice')
        .expect(httpStatus.OK);
    });

    test('it should get access only to user', async () => {
      await request(app)
        .get('/testUser')
        .expect(httpStatus.OK);
    });
  });

  describe('check manager access', () => {
    beforeAll(() => {
      app = express();

      app.use((req, res, next) => {
        req.user = {
          role: 'manager'
        };
        next();
      });

      router = express.Router();

      router.get('/testAdmin', allowOnly(accessLevels.admin), (req, res) => {
        res.status(200)
          .send('OK');
      });

      router.get('/testManager', allowOnly(accessLevels.manager), (req, res) => {
        res.status(200)
          .send('OK');
      });

      router.get('/testPolice', allowOnly(accessLevels.police), (req, res) => {
        res.status(200)
          .send('OK');
      });

      router.get('/testUser', allowOnly(accessLevels.user), (req, res) => {
        res.status(200)
          .send('OK');
      });

      app.use('/', router);
    });

    test('it should get access to admin', async () => {
      await request(app)
        .get('/testAdmin')
        .expect(httpStatus.FORBIDDEN);
    });

    test('it should get access only to manager', async () => {
      await request(app)
        .get('/testManager')
        .expect(httpStatus.OK);
    });

    test('it should get access only to police', async () => {
      await request(app)
        .get('/testPolice')
        .expect(httpStatus.OK);
    });

    test('it should get access only to user', async () => {
      await request(app)
        .get('/testUser')
        .expect(httpStatus.OK);
    });
  });

  describe('check police access', () => {
    beforeAll(() => {
      app = express();

      app.use((req, res, next) => {
        req.user = {
          role: 'police'
        };
        next();
      });

      router = express.Router();

      router.get('/testAdmin', allowOnly(accessLevels.admin), (req, res) => {
        res.status(200)
          .send('OK');
      });

      router.get('/testManager', allowOnly(accessLevels.manager), (req, res) => {
        res.status(200)
          .send('OK');
      });

      router.get('/testPolice', allowOnly(accessLevels.police), (req, res) => {
        res.status(200)
          .send('OK');
      });

      router.get('/testUser', allowOnly(accessLevels.user), (req, res) => {
        res.status(200)
          .send('OK');
      });

      app.use('/', router);
    });

    test('it should get access only to admin', async () => {
      await request(app)
        .get('/testAdmin')
        .expect(httpStatus.FORBIDDEN);
    });

    test('it should get access only to manager', async () => {
      await request(app)
        .get('/testManager')
        .expect(httpStatus.FORBIDDEN);
    });

    test('it should get access only to police', async () => {
      await request(app)
        .get('/testPolice')
        .expect(httpStatus.OK);
    });

    test('it should get access only to user', async () => {
      await request(app)
        .get('/testUser')
        .expect(httpStatus.OK);
    });

    describe('check user access', () => {
      beforeAll(() => {
        app = express();

        app.use((req, res, next) => {
          req.user = {
            role: 'user'
          };
          next();
        });

        router = express.Router();

        router.get('/testAdmin', allowOnly(accessLevels.admin), (req, res) => {
          res.status(200)
            .send('OK');
        });

        router.get('/testManager', allowOnly(accessLevels.manager), (req, res) => {
          res.status(200)
            .send('OK');
        });

        router.get('/testPolice', allowOnly(accessLevels.police), (req, res) => {
          res.status(200)
            .send('OK');
        });

        router.get('/testUser', allowOnly(accessLevels.user), (req, res) => {
          res.status(200)
            .send('OK');
        });

        app.use('/', router);
      });

      test('it should get access only to admin', async () => {
        await request(app)
          .get('/testAdmin')
          .expect(httpStatus.FORBIDDEN);
      });

      test('it should get access only to manager', async () => {
        await request(app)
          .get('/testManager')
          .expect(httpStatus.FORBIDDEN);
      });

      test('it should get access only to police', async () => {
        await request(app)
          .get('/testPolice')
          .expect(httpStatus.FORBIDDEN);
      });

      test('it should get access only to user', async () => {
        await request(app)
          .get('/testUser')
          .expect(httpStatus.OK);
      });
    });

    describe('main checks', () => {
      beforeEach(() => {
        app = express();
        router = express.Router();
      });

      test('it should use string as role', async () => {
        app.use((req, res, next) => {
          req.user = {
            role: 'admin'
          };
          next();
        });

        router.get('/testAdmin', allowOnly(accessLevels.admin), (req, res) => {
          res.status(200)
            .send('OK');
        });

        app.use('/', router);

        await request(app)
          .get('/testAdmin')
          .expect(httpStatus.OK);
      });

      test('it should use enum as role', async () => {
        app.use((req, res, next) => {
          req.user = {
            role: userRoles.admin
          };
          next();
        });

        router.get('/testAdmin', allowOnly(accessLevels.admin), (req, res) => {
          res.status(200)
            .send('OK');
        });

        app.use('/', router);

        await request(app)
          .get('/testAdmin')
          .expect(httpStatus.OK);
      });

      test('it should use string as access level', async () => {
        app.use((req, res, next) => {
          req.user = {
            role: userRoles.admin
          };
          next();
        });

        router.get('/testAdmin', allowOnly('admin'), (req, res) => {
          res.status(200)
            .send('OK');
        });

        app.use('/', router);

        await request(app)
          .get('/testAdmin')
          .expect(httpStatus.OK);
      });

      test('it should use enum as access level', async () => {
        app.use((req, res, next) => {
          req.user = {
            role: userRoles.admin
          };
          next();
        });

        router.get('/testAdmin', allowOnly(userRoles.admin), (req, res) => {
          res.status(200)
            .send('OK');
        });

        app.use('/', router);

        await request(app)
          .get('/testAdmin')
          .expect(httpStatus.OK);
      });
    });
  });
});
