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
    e: 3,
  },
};

function deepEqual(actual: NestedObject, expected: NestedObject): string {
  // Вспомогательная функция для формирования пути к ошибке
  function getPath(
    currentPath: string | undefined,
    currentProp: string,
    isArray: boolean
  ) {
    if (isArray) {
      if (currentPath) {
        return currentPath + "." + currentProp + "[";
      }
      return currentProp + "[";
    } else if (currentPath && currentPath[currentPath?.length - 1] === "[") {
      return currentPath + currentProp + "]";
    } else {
      if (currentPath) {
        return currentPath + "." + currentProp;
      }
      return currentProp;
    }
  }

  function forEachProps(
    actual: NestedObject,
    expected: NestedObject,
    path?: string
  ): string {
    // Если ссылка одна, возвращаем сразу Ок
    if (actual === expected) {
      return "OK";
    }

    const actualKeys = Object.keys(actual);
    const expectedKeys = Object.keys(expected);

    // Сравниваем количество ключей
    if (actualKeys.length !== expectedKeys.length) {
      return "Error: " + path;
    }
    // И названия ключей
    if (actualKeys.toString() !== expectedKeys.toString()) {
      return "Error: " + path;
    }

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
              return "Error: " + getPath(path, prop, isActualArray);
            }
          }

          const newPath = getPath(path, prop, isActualArray);
          const result = forEachProps(actual[prop], expected[prop], newPath);

          if (result.includes("Error")) {
            return result;
          }

          continue;
        } else {
          // Если оба не объекты, то возвращаем ошибку
          return "Error: " + getPath(path, prop, false);
        }
      } else {
        // Если такого же свойства нету, то ошибка
        return "Error: " + getPath(path, prop, false);
      }
    }

    return "OK";
  }

  return forEachProps(actual, expected);
}

console.log(deepEqual(obj1, obj1));
// OK
console.log(deepEqual(obj1, obj2));
// Error: a.e.g[6].i
console.log(deepEqual(obj1, obj3));
// Error: a.b
