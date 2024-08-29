const fs = require("fs");
const { faker } = require("@faker-js/faker");

const firstUpperCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);

const generateData = ({ userLength, assetLength, taskLength, tagLength }) => {
  const users = Array.from({ length: userLength }, (_, id) => ({
    id: id + 1,
    name: faker.person.firstName(),
    avatar: faker.image.urlLoremFlickr({ width: 300, height: 300 }),
  }));

  const comments = [];
  const tasks = Array.from({ length: taskLength }, (_, taskId) => {
    const numComments = faker.number.int({ min: 1, max: 3 });

    const taskComments = Array.from({ length: numComments }, (_, commentId) => {
      const numMentions = faker.number.int({ min: 1, max: 3 });
      const mentionUsers = Array.from(
        { length: numMentions },
        () => users[Math.floor(Math.random() * users.length)].id
      );

      const comment = {
        id: comments.length + 1,
        userId: users[Math.floor(Math.random() * users.length)].id,
        comment: faker.company.buzzPhrase(),
        mentionUserIds: mentionUsers,
      };
      comments.push(comment);
      return comment;
    });

    return {
      id: taskId + 1,
      assetId: faker.number.int({ min: 1, max: assetLength }),
      name: `${firstUpperCase(
        faker.hacker.verb()
      )} ${faker.commerce.product()}`,
      notes: faker.commerce.productDescription(),
      commentIds: taskComments.map((comment) => comment.id),
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

generateData({ userLength: 10, assetLength: 3, taskLength: 10, tagLength: 5 });
