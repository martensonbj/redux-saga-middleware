export const requestImage = () => ({
  type: 'REQUEST_IMAGE'
});

// When we receive the image, update state and shut off the spinner
export const setImage = (data) => ({
  type: 'SET_IMAGE',
  data: {
    explanation: data.explanation,
    hdurl: data.hdurl,
    title: data.title
  }
});

// If something goes wrong, do something about it.
export const catchError = (error) => ({
  type: 'ERROR',
  error
});

// Update our initial action to do those things when the situation arises.
export const getImage = () => (
  dispatch => {
    dispatch(requestImage());
    return fetch('https://api.nasa.gov/planetary/apod?api_key=YOUR-API-KEY-HERE')
      .then(response => response.json())
      .then(json => {
        if (!json.error) {
          dispatch(setImage(json));
        } else {
          // eslint-disable-next-line
          throw { message: json.error.message, code: json.error.code };
        }
      })
      .catch(error => dispatch(catchError(error)));
  }
);
