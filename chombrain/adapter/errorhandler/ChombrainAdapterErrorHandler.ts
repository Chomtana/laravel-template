import ChombrainQueryAdapter from './../core/ChombrainQueryAdapter';

/**
 * @param err String or Null or Axios error response object
 */
export function handleError(err?: any, query?: ChombrainQueryAdapter) {
  console.log(err);
}