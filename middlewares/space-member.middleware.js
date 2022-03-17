/*
  DEMOS
  Copyright (C) 2022 Julian Alejandro Ortega Zepeda, Erik Ivanov Domínguez Rivera, Luis Ángel Meza Acosta
  This file is part of DEMOS.

  DEMOS is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  DEMOS is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

const httpStatus = require('http-status');
const SpaceRepository = require('../repositories/space.repository');
const MemberRepository = require('../repositories/member.repository');
const ApiError = require('../utils/ApiError');

const spaceMember = async (req, res, next) => {
  const { user } = req;
  const { spaceId } = req.params;

  const member = await MemberRepository.findByUserIdAndSpaceId(user.userId, spaceId);
  if (!member) {
    return next(new ApiError(httpStatus.BAD_REQUEST, 'This user is not member of this space'));
  }

  req.member = member;

  const space = await SpaceRepository.findById(spaceId);
  if (!space) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Space not found');
  }

  req.space = space;

  return next();
};

module.exports = spaceMember;
