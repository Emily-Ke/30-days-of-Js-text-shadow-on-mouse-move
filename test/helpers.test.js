const formatTitle = (title, indentation, indicator) =>
  `${'\t'.repeat(indentation)}${
    indicator ? `${indicator} ` : ''
  }test for ${title}`;

const printResults = (title, results, indentation = 0) => {
  if (!results.find(test => test.status === 'failure')) {
    console.log(formatTitle(title, indentation, '✔️'));
  } else {
    console.log(formatTitle(title, indentation));
    results
      .filter(test => test.status === 'failure')
      .forEach(failedTest => {
        console.log(
          `${'\t'.repeat(indentation + 1)}FAILURE: ${failedTest.message}`
        );
      });
  }
};

const testRound = async () => {
  const roundDecimal = () => {
    const num = round(1.2345, 2);
    return num === 1.23
      ? { status: 'success' }
      : {
          status: 'failure',
          message: `Expected round(1.2345, 2) to return 1.23, but received ${num}`
        };
  };

  const roundInteger = () => {
    const num = round(123, 2);
    return num === 123
      ? { status: 'success' }
      : {
          status: 'failure',
          message: `Expected round(123, 2) to return 123, but received ${num}`
        };
  };

  const results = await Promise.all([roundDecimal(), roundInteger()]);
  printResults('round', results);
};

const testDebounce = async () => {
  const tests = [
    // it should not be called until after delay ms
    async () => {
      const delay = 10; //ms

      let endTimer = Date.now();
      const func = () => {
        endTimer = Date.now();
      };

      const debouncedFunc = debounce(func, delay);
      const startTimer = Date.now();
      debouncedFunc();

      await wait(10);

      const ellapsedTime = endTimer - startTimer;
      return ellapsedTime < delay
        ? {
            status: 'failure',
            message: `Expected function to be called after ${delay}ms, but it was called after ${ellapsedTime}ms`
          }
        : { status: 'success' };
    },

    // if no delay is provided, it should use the default
    async () => {
      let endTimer = Date.now();
      const func = () => {
        endTimer = Date.now();
      };

      const debouncedFunc = debounce(func);
      const startTimer = Date.now();
      debouncedFunc();

      await wait(20);

      const ellapsedTime = endTimer - startTimer;
      return ellapsedTime < 20
        ? {
            status: 'failure',
            message: `Expected function to be called after 20ms, but it was called after ${ellapsedTime}ms`
          }
        : { status: 'success' };
    },

    // if called more than once, within delay ms, fn should only run once
    async () => {
      const delay = 10;
      let count = 0;
      const func = () => {
        count++;
      };
      const debouncedFunc = debounce(func, delay);

      debouncedFunc();
      debouncedFunc();

      await wait(10);

      return count !== 1
        ? {
            status: 'failure',
            message: `Expected function to be called 1 time within ${delay}ms, but it was called ${count} times`
          }
        : { status: 'success' };
    },

    // arguments should get passed through to function
    async () => {
      const param1 = 'foo';
      const param2 = 'bar';

      let arg1 = '';
      let arg2 = '';

      const func = (a, b) => {
        arg1 = a;
        arg2 = b;
      };

      const debouncedFunc = debounce(func, 0);
      debouncedFunc(param1, param2);

      await wait(0);

      return arg1 !== param1 || arg2 !== param2
        ? {
            status: 'failure',
            message: `Expected function to be called with arguments (${param1}, ${param2}), but it was called with (${JSON.stringify(
              arg1
            )}, ${JSON.stringify(arg2)})`
          }
        : { status: 'success' };
    }
  ];

  const results = await Promise.all(tests.map(test => test()));
  printResults('debounce', results);
};

const testAngleBetweenTwoPoints = async () => {
  const RAD2TWO = Math.sqrt(2) / 2;

  const tests = [
    () => {
      const angle = angleBetweenTwoPoints([0, 0], [1, 0]) / Math.PI;
      return angle !== 0
        ? {
            status: 'failure',
            message: `Expected angle returned from ([0, 0], [1, 0]) to be 0, but received: ${angle}π`
          }
        : { status: 'success' };
    },

    () => {
      const angle = angleBetweenTwoPoints([0, 0], [RAD2TWO, RAD2TWO]) / Math.PI;
      return angle !== 0.25
        ? {
            status: 'failure',
            message: `Expected angle returned from ([0, 0], [√2 / 2, √2 / 2]) to be 0.25π, but received: ${angle}π`
          }
        : { status: 'success' };
    },

    () => {
      const angle = angleBetweenTwoPoints([0, 0], [0, 1]) / Math.PI;
      return angle !== 0.5
        ? {
            status: 'failure',
            message: `Expected angle returned from ([0, 0], [0, 1]) to be 0.5π, but received: ${angle}π`
          }
        : { status: 'success' };
    },

    () => {
      const angle =
        angleBetweenTwoPoints([0, 0], [-1 * RAD2TWO, RAD2TWO]) / Math.PI;
      return angle !== 0.75
        ? {
            status: 'failure',
            message: `Expected angle returned from ([0, 0], [-√2 / 2, √2 / 2]) to be 0.75π, but received: ${angle}π`
          }
        : { status: 'success' };
    },

    () => {
      const angle = angleBetweenTwoPoints([0, 0], [-1, 0]) / Math.PI;
      return angle !== 1
        ? {
            status: 'failure',
            message: `Expected angle returned from ([0, 0], [-1, 0]) to be 1π, but received: ${angle}π`
          }
        : { status: 'success' };
    },

    () => {
      const angle =
        angleBetweenTwoPoints([0, 0], [-1 * RAD2TWO, -1 * RAD2TWO]) / Math.PI;
      return angle !== -0.75
        ? {
            status: 'failure',
            message: `Expected angle returned from ([0, 0], [-√2 / 2, -√2 / 2]) to be -0.75π, but received: ${angle}π`
          }
        : { status: 'success' };
    },

    () => {
      const angle = angleBetweenTwoPoints([0, 0], [0, -1]) / Math.PI;
      return angle !== -0.5
        ? {
            status: 'failure',
            message: `Expected angle returned from ([0, 0], [0, -1]) to be -0.5π, but received: ${angle}π`
          }
        : { status: 'success' };
    },

    () => {
      const angle =
        angleBetweenTwoPoints([0, 0], [RAD2TWO, -1 * RAD2TWO]) / Math.PI;
      return angle !== -0.25
        ? {
            status: 'failure',
            message: `Expected angle returned from ([0, 0], [√2 / 2, -√2 / 2]) to be -0.25π, but received: ${angle}π`
          }
        : { status: 'success' };
    },

    () => {
      const angle = angleBetweenTwoPoints([100, 100], [0, 100]) / Math.PI;
      return angle !== 1
        ? {
            status: 'failure',
            message: `Expected angle returned from ([100, 100], [0, 100]) to be 1π, but received: ${angle}π`
          }
        : { status: 'success' };
    }
  ];

  const results = await Promise.all(tests.map(test => test()));
  printResults('angleBetweenTwoPoints', results);
};

const testSides = async () => {
  const test1 = () => {
    const angle = Math.PI / 6; // 30 deg
    const [x, y] = sides(angle, 6);
    const approximateX = round(x, 3);
    const approximateY = round(y, 3);

    if (approximateX !== 5.196) {
      return {
        status: 'failure',
        message: `Expected adjacent side returned from (π/6, 6) to be approximately 5.196 but received ${approximateX}`
      };
    }
    if (approximateY !== 3) {
      return {
        status: 'failure',
        message: `Expected opposite side returned from (π/6, 6) to be approximately 3, but received ${approximateY}`
      };
    }
    return { status: 'success' };
  };

  const test2 = () => {
    const angle = (5 * Math.PI) / 6; // 150 deg
    const [x, y] = sides(angle, 6);
    const approximateX = round(x, 3);
    const approximateY = round(y, 3);

    if (approximateX !== -5.196) {
      return {
        status: 'failure',
        message: `Expected adjacent side returned from (5π/6, 6) to be approximately -5.196 but received ${approximateX}`
      };
    }
    if (approximateY !== 3) {
      return {
        status: 'failure',
        message: `Expected opposite side returned from (5π/6, 6) to be approximately 3, but received ${approximateY}`
      };
    }
    return { status: 'success' };
  };

  const test3 = () => {
    const angle = (7 * Math.PI) / 6; // 210 deg
    const [x, y] = sides(angle, 6);
    const approximateX = round(x, 3);
    const approximateY = round(y, 3);

    if (approximateX !== -5.196) {
      return {
        status: 'failure',
        message: `Expected adjacent side returned from (7π/6, 6) to be approximately -5.196 but received ${approximateX}`
      };
    }
    if (approximateY !== -3) {
      return {
        status: 'failure',
        message: `Expected opposite side returned from (7π/6, 6) to be approximately -3, but received ${approximateY}`
      };
    }
    return { status: 'success' };
  };

  const test4 = () => {
    const angle = (11 * Math.PI) / 6; // 330 deg
    const [x, y] = sides(angle, 6);
    const approximateX = round(x, 3);
    const approximateY = round(y, 3);

    if (approximateX !== 5.196) {
      return {
        status: 'failure',
        message: `Expected adjacent side returned from (11π/6, 6) to be approximately 5.196 but received ${approximateX}`
      };
    }
    if (approximateY !== -3) {
      return {
        status: 'failure',
        message: `Expected opposite side returned from (11π/6, 6) to be approximately -3, but received ${approximateY}`
      };
    }
    return { status: 'success' };
  };

  const results = await Promise.all([test1(), test2(), test3(), test4()]);
  printResults('sides', results);
};

testRound();
testDebounce();
testAngleBetweenTwoPoints();
testSides();
