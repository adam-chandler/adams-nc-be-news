const { expect } = require("chai");
const {
  formatDates,
  makeRefObj,
  formatComments
} = require("../db/utils/utils");

describe("formatDates", () => {
  it("Returns an empty array when given an empty array", () => {
    expect(formatDates([])).to.eql([]);
  });
  it("Returned array has different reference to input", () => {
    let input = [
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      }
    ];
    expect(formatDates(input)).to.not.equal(input);
  });
  it("Objects in array retain original keys", () => {
    let input = [
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      }
    ];
    expect(formatDates(input)[0]).to.have.all.keys(
      "title",
      "topic",
      "author",
      "body",
      "created_at"
    );
  });
  it("Returns a single item formatted correctly", () => {
    let input = [
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      }
    ];
    let expected = [
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: new Date(785420514171)
      }
    ];
    expect(formatDates(input)).to.eql(expected);
  });
  it("Returns an array of objects formatted correctly", () => {
    let input = [
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171
      },
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      },
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      }
    ];
    let expected = [
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: new Date(1037708514171)
      },
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: new Date(911564514171)
      },
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: new Date(785420514171)
      }
    ];
    expect(formatDates(input)).to.eql(expected);
  });
  it("Does not mutate original array", () => {
    let input = [
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171
      },
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      },
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      }
    ];
    let expected = [
      {
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: 1037708514171
      },
      {
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      },
      {
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      }
    ];
    formatDates(input);
    expect(input).to.eql(expected);
  });
});

describe("makeRefObj", () => {
  it("Returns an object", () => {
    expect(makeRefObj([])).to.be.an("object");
  });
  it("Returns an empty object when passed an empty array", () => {
    expect(makeRefObj([])).to.eql({});
  });
  it("Can create a reference for a single object in an array", () => {
    const input = [{ article_id: 1, title: "A" }];
    const expected = { A: 1 };
    expect(makeRefObj(input)).to.eql(expected);
  });
  it("Can create a reference for an array of objects in an array", () => {
    const input = [
      {
        article_id: 1,
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      },
      {
        article_id: 2,
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      }
    ];
    const expected = { A: 1, Z: 2 };
    expect(makeRefObj(input)).to.eql(expected);
  });
  it("Does not mutate original array", () => {
    const input = [
      {
        article_id: 1,
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      },
      {
        article_id: 2,
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      }
    ];
    const expected = [
      {
        article_id: 1,
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: 911564514171
      },
      {
        article_id: 2,
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: 785420514171
      }
    ];
    makeRefObj(input);
    expect(input).to.eql(expected);
  });
});

describe("formatComments", () => {
  it("Returns a new array", () => {
    const arr = [];
    const articleRef = {};
    expect(formatComments(arr, articleRef)).to.not.equal(arr);
  });
  it("Returns an empty array when given empty comments array", () => {
    expect(formatComments([], {})).to.eql([]);
  });
  it("Formats a single item in an array correctly", () => {
    const input1 = [
      {
        body: "I hate streaming noses",
        belongs_to: "Halalou",
        created_by: "icellusedkars",
        votes: 0,
        created_at: 1385210163389
      }
    ];
    const input2 = {
      Halalou: 1
    };
    const expected = [
      {
        body: "I hate streaming noses",
        article_id: 1,
        author: "icellusedkars",
        votes: 0,
        created_at: new Date(1385210163389)
      }
    ];
    expect(formatComments(input1, input2)).to.eql(expected);
  });
  it("Formats a single item in an array correctly", () => {
    const input1 = [
      {
        body: "I hate streaming noses",
        belongs_to: "Halalou",
        created_by: "icellusedkars",
        votes: 0,
        created_at: 1385210163389
      },
      {
        body: "I hate blocked noses",
        belongs_to: "Plantie",
        created_by: "SammyBoy",
        votes: 0,
        created_at: 1385210163311
      }
    ];
    const input2 = {
      Halalou: 1,
      Plantie: 5
    };
    const expected = [
      {
        body: "I hate streaming noses",
        article_id: 1,
        author: "icellusedkars",
        votes: 0,
        created_at: new Date(1385210163389)
      },
      {
        body: "I hate blocked noses",
        article_id: 5,
        author: "SammyBoy",
        votes: 0,
        created_at: new Date(1385210163311)
      }
    ];
    expect(formatComments(input1, input2)).to.eql(expected);
  });
  it("Does not mutate original array or reference obj", () => {
    const input1 = [
      {
        body: "I hate streaming noses",
        belongs_to: "Halalou",
        created_by: "icellusedkars",
        votes: 0,
        created_at: 1385210163389
      },
      {
        body: "I hate blocked noses",
        belongs_to: "Plantie",
        created_by: "SammyBoy",
        votes: 0,
        created_at: 1385210163311
      }
    ];
    const input2 = {
      Halalou: 1,
      Plantie: 5
    };
    const expected1 = [
      {
        body: "I hate streaming noses",
        belongs_to: "Halalou",
        created_by: "icellusedkars",
        votes: 0,
        created_at: 1385210163389
      },
      {
        body: "I hate blocked noses",
        belongs_to: "Plantie",
        created_by: "SammyBoy",
        votes: 0,
        created_at: 1385210163311
      }
    ];
    const expected2 = {
      Halalou: 1,
      Plantie: 5
    };
    formatComments(input1, input2);
    expect(input1).to.eql(expected1);
    expect(input2).to.eql(expected2);
  });
});
