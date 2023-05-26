/* eslint-disable */
export type Schema = {
  'AuthUser': {
    plain: {
      'id': string;
      'type': 'ADMIN' | 'USER';
      'email': string;
      'password': string;
      'refreshToken': string;
    };
    nested: {
      'User': Schema['User']['plain'] & Schema['User']['nested'];
    };
    flat: {
      'User:id': string;
      'User:avatar': string;
    };
  };
  'Post': {
    plain: {
      'id': string;
      'content': string;
      'isPublished': boolean;
      'authorId': string;
      'createdAt': string;
      'updatedAt': string;
    };
    nested: {
      'author': Schema['User']['plain'] & Schema['User']['nested'];
    };
    flat: {
      'author:id': string;
      'author:avatar': string;
      'author:AuthUser:id': string;
      'author:AuthUser:type': 'ADMIN' | 'USER';
      'author:AuthUser:email': string;
      'author:AuthUser:password': string;
      'author:AuthUser:refreshToken': string;
    };
  };
  'User': {
    plain: {
      'id': string;
      'avatar': string;
    };
    nested: {
      'AuthUser': Schema['AuthUser']['plain'] & Schema['AuthUser']['nested'];
    };
    flat: {
      'AuthUser:id': string;
      'AuthUser:type': 'ADMIN' | 'USER';
      'AuthUser:email': string;
      'AuthUser:password': string;
      'AuthUser:refreshToken': string;
    };
  };
};
