interface NestedObject extends Object {
  [key: string]: any;
}

const obj1: NestedObject = {
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

function deepEqual(actual: NestedObject, expected: NestedObject): string {
  function forEachProps(
    actual: NestedObject,
    expected: NestedObject,
    prevProp?: string,
    prevType?: string
  ): string {
    for (const prop in actual) {
      // Проверяем что свойство не находится в прототипе
      if (!actual.hasOwnProperty(prop)) {
        continue;
      }

      // Получаем тоже свойство в expected
      if (prop in expected) {
        // Сравниваем значения свойств. Если значения не равны, то возможно это объекты
        if (actual[prop] === expected[prop]) {
          continue;
        } else if (
          actual[prop] instanceof Object &&
          expected[prop] instanceof Object
        ) {
          // Проверяем если actual массив, то проверяем и expected и следом сравниваем их длину
          const isActualArray = Array.isArray(actual[prop]);
          const isExpectedArray = Array.isArray(expected[prop]);
          if (isActualArray) {
            if (
              !isExpectedArray ||
              actual[prop].length !== expected[prop].length
            ) {
              return "Error: " + (prevProp ? prevProp + "." + prop : prop);
            }
          }

          // Если объекты, то вызываем функцию рекурсивно передав текущие значения
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
        } else {
          // Если оба не объекты, то возвращаем ошибку
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
        }
      } else {
        // Если такого же свойства нету, то ошибка
        return "Error: " + (prevProp ? prevProp + "." + prop : prop);
      }
    }

    return "OK";
  }

  return forEachProps(actual, expected);
}

console.log(deepEqual(obj1, obj1));
// // OK
console.log(deepEqual(obj1, obj2));
// // Error: a.e.g[6].i
console.log(deepEqual(obj1, obj3));
// // Error: a.b
