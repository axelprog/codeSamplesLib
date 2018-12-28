/* eslint-disable no-bitwise */
/* eslint no-multi-spaces: ["error", { ignoreEOLComments: true }] */

// binary user access roles
const userRoles = {
  user: 1,    // ...0001
  police: 2,  // ...0010
  manager: 4, // ...0100
  admin: 8    // ...1000
};

exports.userRoles = userRoles;

const accessLevels = {
  user: userRoles.admin | userRoles.manager | userRoles.police | userRoles.user,    // ...1111
  police: userRoles.admin | userRoles.manager | userRoles.police,                   // ...1110
  manager: userRoles.admin | userRoles.manager,                                     // ...1100
  admin: userRoles.admin                                                            // ...1000
};

exports.accessLevels = accessLevels;

exports.allowOnly = (accessLevel) => {
  function checkUserRole(req, res, next) {
    const role = (typeof req.user.role === 'string' || req.user.role instanceof String) ? userRoles[req.user.role] : req.user.role;
    const accessLevelChecked = (typeof accessLevel === 'string' || accessLevel instanceof String) ? accessLevels [accessLevel] : accessLevel;

    if (!(accessLevelChecked & role)) {
      res.sendStatus(403);
    } else {
      next();
    }
  }

  return checkUserRole;
};
