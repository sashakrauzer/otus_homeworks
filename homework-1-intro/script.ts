const myObj = {
  name: 1,
  items: [
    {
      name: 2,
      items: [{ name: 3 }, { name: 4 }],
    },
    {
      name: 5,
      items: [
        {
          name: 6,
          items: [
            {
              name: 7,
              items: [{ name: 8, items: [{ name: 9, items: [{ name: 10 }] }] }],
            },
          ],
        },
      ],
    },
  ],
};

interface IInputObject {
  name: number;
  items?: IInputObject[];
}

function forEachObj(obj: IInputObject, prevCount?: number) {
  let count = prevCount || 0;

  if (obj.name) {
    count++;
    let output: string | null = null;

    if (count === 1) {
      output = String(obj.name);
    } else if (count === 2) {
      output = "├──" + " " + obj.name;
    } else {
      const spaces = count - 2;
      output = "│" + " ".repeat(spaces) + "└──" + " " + obj.name;
    }

    console.log(output);

    if (obj.items) {
      obj.items.forEach((item) => {
        forEachObj(item, count);
      });
    }
  }
}

forEachObj(myObj);
