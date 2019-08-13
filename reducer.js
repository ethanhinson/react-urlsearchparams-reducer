/* eslint-disable no-case-declarations */

const initialState = {
  params: [],
};

/**
 * Turn the array of parameters into a search query.
 * @param params
 * @returns {*}
 */
const paramsToURLSearchParams = params => params.reduce((carry, { name, value }) => {
  carry.set(name, value);
  return carry;
}, new URLSearchParams());

/**
 * Use the name to ascertain if the parameter
 * accepts multiple values.
 * @param str
 * @returns {boolean | *}
 */
const isParamMultiple = str => str.endsWith('[]');

/**
 * Get the list of params by the name
 * @param paramName
 * @param params
 * @returns {*}
 */
const getParamsByName = (paramName, params) => params.filter(({ name }) => paramName.replace('[]', '') === name);

/**
 * Find a param by name and value.
 * @param paramName
 * @param paramValue
 * @param params
 * @returns {*}
 */
const findParam = (paramName, paramValue, params) => (
  params.findIndex(({ name, value }) => name === paramName && value === paramValue)
);

/**
 * Add a parameter to the list of params. Replace
 * params as needed.
 * @param newParam
 * @param params
 * @returns {*}
 */
const addParam = (newParam, params) => {
  const { name: newParamName, value: newParamValue } = newParam;
  const ind = findParam(newParamName, newParamValue, params);
  if (ind !== -1) {
    params.splice(ind, 1, newParam);
    return params;
  }

  if (isParamMultiple(newParamName)) {
    params.push(newParam);
    return params;
  }

  const existingParams = getParamsByName(newParamName, params);

  if (!existingParams.length) {
    params.push(newParam);
  }

  return params;
};

/**
 * Remove a specific parameter.
 * @param oldParam
 * @param params
 * @returns {*}
 */
const removeParam = (oldParam, params) => {
  const { name: oldParamName, value: oldParamValue } = oldParam;
  const ind = findParam(oldParamName, oldParamValue, params);
  if (ind !== -1) {
    params.splice(ind, 1);
  }
  return params;
};

/**
 * Main reducer for the advanced search state.
 * @param state
 * @param action
 * @returns {*}
 */
const reducer = (state, action) => {
  const { params } = state;
  const { type, param } = action;
  switch (type) {
    case 'ADD_PARAM':
      return {
        ...state,
        params: addParam(param, params),
      };
    case 'REMOVE_PARAM':
      return {
        ...state,
        params: removeParam(param, params),
      };
    case 'SET_PARAMS':
      return {
        ...state,
        params: param,
      };
    default:
      return state;
  }
};

export {
  reducer as default,
  initialState,
  paramsToURLSearchParams,
};
