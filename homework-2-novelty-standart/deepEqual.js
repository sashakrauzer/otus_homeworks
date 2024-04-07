const obj1 = {
  a: {
    b: {
      c: [1, 3, { l: [1] }],
    },
    e: {
      f: 123,
      g: [1, 2, 3, 4, 5, 6, { i: "string" }],
    },
  },
};
const obj2 = {
  a: {
    b: {
      c: [1, 3, { l: [1] }],
    },
    e: {
      f: 123,
      g: [1, 2, 3, 4, 5, 6, { i: "string2" }],
    },
  },
};
const obj3 = {
  a: {
    b: 1,
  },
};

function deepEqual(actual, expected) {
  function forEachProps(actual, expected, prevProp, prevType) {
    for (const prop in actual) {
      if (!actual.hasOwnProperty(prop)) {
        continue;
      }

      const isActualArray = Array.isArray(actual[prop]);
      const isExpectedArray = Array.isArray(expected[prop]);
      if (isActualArray) {
        if (!isExpectedArray || actual[prop].length !== expected[prop].length) {
          return "Error: " + (prevProp ? prevProp + "." + prop : prop);
        }
      }

      if (prop in expected) {
        if (actual[prop] === expected[prop]) {
          continue;
        } else if (
          !(actual[prop] instanceof Object) &&
          !(expected[prop] instanceof Object)
        ) {
          let result = "Error: ";

          if (prevProp) {
            if (prevType === "array") {
              result += prevProp + "[" + prop + "]";
            } else {
              result += prevProp + "." + prop;
            }
          } else {
            result += prop;
          }
          1;
          return result;
        } else {
          let nextProp = "";
          if (prevProp) {
            if (prevType === "array") {
              nextProp += prevProp + "[" + prop + "]";
            } else {
              nextProp += prevProp + "." + prop;
            }
          } else {
            nextProp += prop;
          }

          const result = forEachProps(
            actual[prop],
            expected[prop],
            nextProp,
            isActualArray ? "array" : "object"
          );

          if (result.includes("Error")) {
            return result;
          }
          continue;
        }
      } else {
        return "Error: " + (prevProp ? prevProp + "." + prop : prop);
      }
    }

    return "OK";
  }

  forEachProps(actual, expected);

  console.log(forEachProps(actual, expected));
}

deepEqual(obj1, obj2);
// // OK
// deepEqual(obj1, obj2);
// // Error: a.b
deepEqual(obj1, obj3);
// // OK
