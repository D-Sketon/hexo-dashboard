import bcrypt from 'bcryptjs';

export class adminAuth {
  constructor(hexo) {
    this.name = 'adminAuth';

    function failedValidation(request, response) {
      const redirectUrl = hexo.config.root + 'admin/login';
      response.writeHead(303, { Location: redirectUrl });
      response.end();
    }

    function validateCredentials(executionScope, request, response, callback) {
      const config = hexo.config.admin;
      if (request.body.username === config.username &&
        bcrypt.compareSync(request.body.password, config.password_hash)) {
        executionScope.success({ name: request.body.user }, callback);
      } else {
        failedValidation(request, response);
      }
    }

    this.authenticate = function (request, response, callback) {
      if (request.body && request.body.username && request.body.password) {
        validateCredentials(this, request, response, callback);
      } else {
        failedValidation(request, response);
      }
    };
  }
}
