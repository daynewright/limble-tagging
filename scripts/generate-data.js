const fs = require("fs");
const { faker } = require("@faker-js/faker");

const firstUpperCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const generateData = ({
  userLength,
  assetLength,
  taskLength,
  commentLength,
}) => {
  const users = Array.from({ length: userLength }, (_, id) => ({
    id: id + 1,
    name: faker.person.firstName(),
    avatar: faker.image.urlLoremFlickr({ width: 300, height: 300 }),
  }));

  const tasks = Array.from({ length: taskLength }, (_, taskId) => {
    return {
      id: taskId + 1,
      assetId: faker.number.int({ min: 1, max: assetLength }),
      name: `${firstUpperCase(
        faker.hacker.verb()
      )} ${faker.commerce.product()}`,
      notes: faker.commerce.productDescription(),
      commentIds: [
        faker.number.int({ min: 1, max: commentLength }),
        faker.number.int({ min: 1, max: commentLength - 1 }),
        faker.number.int({ min: 1, max: commentLength - 2 }),
      ],
      status: faker.helpers.arrayElement([
        "Ready",
        "In Progress",
        "Completed",
        "Paused",
      ]),
      description: faker.lorem.sentence(),
      assignedTo: users[Math.floor(Math.random() * users.length)].id,
      dueDate: faker.date.future().toISOString(),
    };
  });

  const comments = Array.from({ length: commentLength }, (_, id) => {
    const mentionUsers = Array.from(
      { length: 2 },
      () => users[Math.floor(Math.random() * users.length)].id
    );

    return {
      id: id + 1,
      userId: users[Math.floor(Math.random() * users.length)].id,
      comment: faker.company.buzzPhrase(),
      mentionUserIds: mentionUsers,
      taskId: tasks[Math.floor(Math.random() * tasks.length)].id,
    };
  });

  const assets = Array.from({ length: assetLength }, (_, id) => ({
    id: id + 1,
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    taskIds: tasks
      .filter((task) => task.assetId === id + 1)
      .map((task) => task.id),
  }));

  const data = {
    users,
    assets,
    tasks,
    comments,
  };

  fs.writeFileSync("db.json", JSON.stringify(data, null, 2));
};

generateData({
  userLength: 10,
  assetLength: 3,
  taskLength: 10,
  commentLength: 10,
});
