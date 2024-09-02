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
    id: `user-${id + 1}`,
    name: faker.person.firstName(),
    avatar: faker.image.urlPicsumPhotos({ height: 300, width: 300 }),
  }));

  const tasks = Array.from({ length: taskLength }, (_, taskId) => {
    return {
      id: `task-${taskId + 1}`,
      assetId: `asset-${faker.number.int({ min: 1, max: assetLength })}`,
      name: `${firstUpperCase(
        faker.hacker.verb()
      )} ${faker.commerce.product()}`,
      notes: faker.commerce.productDescription(),
      commentIds: [
        `comment-${faker.number.int({ min: 1, max: commentLength })}`,
        `comment-${faker.number.int({ min: 1, max: commentLength - 1 })}`,
        `comment-${faker.number.int({ min: 1, max: commentLength - 2 })}`,
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
      id: `comment-${id + 1}`,
      userId: users[Math.floor(Math.random() * users.length)].id,
      message: faker.company.buzzPhrase(),
      mentionUserIds: mentionUsers,
      taskId: tasks[Math.floor(Math.random() * tasks.length)].id,
    };
  });

  const assets = Array.from({ length: assetLength }, (_, id) => ({
    id: `asset-${id + 1}`,
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    taskIds: tasks
      .filter((task) => task.assetId === `asset-${id + 1}`)
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
  assetLength: 5,
  taskLength: 20,
  commentLength: 15,
});
