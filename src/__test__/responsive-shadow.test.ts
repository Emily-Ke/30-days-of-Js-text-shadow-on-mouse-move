const testResponsiveShadowTextClass = async () => {
  document.body.style.margin = '0px';
  const testConstructor = async () => {
    const tests = [
      (): TestResult => {
        const element = document.createElement('div');
        document.body.prepend(element);
        const shadowInterface = new ResponsiveShadowText(element, 10);

        let result: TestResult = { status: 'success' };
        if (shadowInterface.element !== element) {
          result = {
            status: 'failure',
            message: `Expected ResponsiveShadowText(element, 10) to have an element that references element, but instead has an element with value ${shadowInterface.element}`
          };
        } else if (shadowInterface.shadowRadius !== 10) {
          result = {
            status: 'failure',
            message: `Expected ResponsiveShadowText(element, 10) to have a shadowRadius of 10, but instead has radius of ${shadowInterface.shadowRadius}`
          };
        }
        shadowInterface.removeListener();
        element.remove();
        return result;
      },

      // default radius
      (): TestResult => {
        const element = document.createElement('p');
        document.body.prepend(element);
        const shadowInterface = new ResponsiveShadowText(element);

        let result: TestResult = { status: 'success' };
        if (shadowInterface.shadowRadius !== 6) {
          result = {
            status: 'failure',
            message: `Expected ResponsiveShadowText(element) to have a default shadowRadius of 6, but instead has radius of ${shadowInterface.shadowRadius}`
          };
        }
        shadowInterface.removeListener();
        element.remove();
        return result;
      }
    ];

    const results = await Promise.all(tests.map(test => test()));
    return { title: 'constructor', results };
  };

  const testCenterPoint = () => {
    const element = document.createElement('div');
    element.style.width = '300px';
    element.style.height = '100px';
    element.style.marginLeft = '10px';
    element.style.marginTop = '20px';

    document.body.prepend(element);

    const shadowInterface = new ResponsiveShadowText(element);

    const [centerX, centerY] = shadowInterface.centerPoint;

    let result: TestResult = { status: 'success' };
    if (centerX !== 160) {
      result = {
        status: 'failure',
        message: `Expected center point x of a 300px wide element with 10px margin left to be 160px, but received ${centerX}px`
      };
    } else if (centerY !== 70) {
      result = {
        status: 'failure',
        message: `Expected center point y of a 100px tall element with 20px margin top to be 70px, but received ${centerY}px`
      };
    }

    shadowInterface.removeListener();
    element.remove();
    return { title: 'centerPoint', results: [result] };
  };

  const testUpdateShadow = () => {
    const element = document.createElement('div');
    element.textContent = 'test';
    element.style.textShadow = '5px 5px 0 black';
    document.body.prepend(element);

    const shadowInterface = new ResponsiveShadowText(element);
    shadowInterface.updateShadow(-2, -3);

    const { textShadow } = element.style;

    let result: TestResult = { status: 'success' };
    if (!/ -2px -3px 0/.test(textShadow)) {
      result = {
        status: 'failure',
        message: `Expected updateShadow(-2, -3) to result in a text-shadow with "-2px -3px" for the h and v offsets, but received ${textShadow}`
      };
    }

    shadowInterface.removeListener();
    element.remove();
    return { title: 'updateShadow', results: [result] };
  };

  const testHandleMouseMove = async () => {
    const element = document.createElement('div');
    element.textContent = 'test';
    element.style.width = '300px';
    element.style.height = '100px';

    document.body.prepend(element);
    const shadowInterface = new ResponsiveShadowText(element, 10);

    const pattern = '-?\\d+(.\\d+)?(e-\\d+)?'; // positive or negative integers or decimal numers including scientific notation
    const re = new RegExp(`(?<h>${pattern})(px)? (?<v>${pattern})(px)?`);

    const mouseMoves = async (): Promise<TestResult> => {
      // move right of text
      const eventRight = new MouseEvent('mousemove', {
        clientX: 300,
        clientY: 50
      });

      document.dispatchEvent(eventRight);

      await wait(8);

      let { textShadow } = element.style;
      if (!textShadow) {
        return {
          status: 'failure',
          message: `Expected text shadow to exist after mouse move, but it does not.`
        };
      }
      let { h, v } = textShadow.match(re).groups;

      // h and v as numbers should be approximately correct
      let x = round(Number(h), 3);
      let y = round(Number(v), 3);

      if (x !== 10 || y !== 0) {
        return {
          status: 'failure',
          message: `Expected text shadow on 300px wide, 100px tall element to orient to mouse positioned at (300, 50) with approximate horizontal and vertical offsets [10, 0]px, but offsets were [${x}, ${y}]`
        };
      }

      // then move left of text
      const eventLeft = new MouseEvent('mousemove', {
        clientX: 0,
        clientY: 50
      });

      document.dispatchEvent(eventLeft);

      await wait(8);

      ({ textShadow } = element.style);
      if (!textShadow) {
        return {
          status: 'failure',
          message: `Expected text shadow to exist after mouse move, but it does not.`
        };
      }
      ({ h, v } = textShadow.match(re).groups);

      // h and v as numbers should be approximately correct
      x = round(Number(h), 3);
      y = round(Number(v), 3);

      if (x !== -10 || y !== 0) {
        return {
          status: 'failure',
          message: `Expected text shadow on 300px wide, 100px tall element to orient to mouse positioned at (0, 50) with horizontal and vertical offsets [-10, 0]px, but offsets were [${x}, ${y}]`
        };
      }

      // then move above text
      const eventTop = new MouseEvent('mousemove', {
        clientX: 150,
        clientY: 0
      });

      document.dispatchEvent(eventTop);

      await wait(8);

      ({ textShadow } = element.style);
      if (!textShadow) {
        return {
          status: 'failure',
          message: `Expected text shadow to exist after mouse move, but it does not.`
        };
      }
      ({ h, v } = textShadow.match(re).groups);

      // h and v as numbers should be approximately correct
      x = round(Number(h), 3);
      y = round(Number(v), 3);

      if (x !== 0 || y !== -10) {
        return {
          status: 'failure',
          message: `Expected text shadow on 300px wide, 100px tall element to orient to mouse positioned at (150, 0) with approximate horizontal and vertical offsets [0, -10]px, but offsets were [${x}, ${y}]`
        };
      }

      // then move below text
      const eventBottom = new MouseEvent('mousemove', {
        clientX: 150,
        clientY: 100
      });

      document.dispatchEvent(eventBottom);

      await wait(8);

      ({ textShadow } = element.style);
      if (!textShadow) {
        return {
          status: 'failure',
          message: `Expected text shadow to exist after mouse move, but it does not`
        };
      }
      ({ h, v } = textShadow.match(re).groups);

      // h and v as numbers should be approximately correct
      x = round(Number(h), 3);
      y = round(Number(v), 3);

      if (x !== 0 || y !== 10) {
        return {
          status: 'failure',
          message: `Expected text shadow on 300px wide, 100px tall element to orient to mouse positioned at (150, 100) with approximate horizontal and vertical offsets [0, 10]px, but offsets were [${x}, ${y}]`
        };
      }
      return { status: 'success' };
    };

    const results = [await mouseMoves()];
    shadowInterface.removeListener();
    element.remove();
    return { title: 'handleMouseMove', results };
  };

  const testRemoveListener = async () => {
    const element = document.createElement('div');
    document.body.prepend(element);
    const shadowInterface = new ResponsiveShadowText(element);
    shadowInterface.removeListener();

    const moveMouse = new MouseEvent('mousemove', {
      clientX: 10,
      clientY: 0
    });

    document.dispatchEvent(moveMouse);

    await wait(8);

    const { textShadow } = element.style;

    let result: TestResult = { status: 'success' };
    if (textShadow) {
      result = {
        status: 'failure',
        message: `Expected that a mousemove event to would not result in a text shadow, but received shadow: ${textShadow}`
      };
    }

    element.remove();
    return { title: 'removeListener', results: [result] };
  };

  const results: { title: string; results: TestResult[] }[] = [
    await testConstructor(),
    testCenterPoint(),
    testUpdateShadow(),
    await testHandleMouseMove(),
    await testRemoveListener()
  ];

  console.log('tests for ResponsiveShadowText class');
  results.forEach(({ title, results }) => {
    printResults(title, results, 1);
  });

  document.body.removeAttribute('style');
};

testResponsiveShadowTextClass();
