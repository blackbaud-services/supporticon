export const toPromise = (f) =>
  function () {
    return new Promise((resolve, reject) => {
      const result = f.apply(null, Array.from(arguments));
      try {
        return result.then(resolve, reject); // promise.
      } catch (e) {
        if (e instanceof TypeError) {
          resolve(result); // resolve naked value.
        } else {
          reject(e); // pass unhandled exception to caller.
        }
      }
    });
  };
