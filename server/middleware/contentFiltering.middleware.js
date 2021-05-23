// get the query from the user which may include the type of property the user is searching for
// Initially extract the data from the database based on the price of the property
// Extract data based on the location of the search
// Extract the description of the the post of the array of data
// Enter the data in the content recommendation system
// map the data into an array based on recommendation

const ContentBasedRecommender = require("../utils/contentRecommendation");

const recommender = new ContentBasedRecommender({
  minScore: 0.1,
  maxSimilarDocuments: 100,
});

/**
 * recommend.
 *
 * @param {} data [Array of objects of information retrieved from the database of particular location]
 * @param {} req [object containing users preferences]
 */
const recommend = async (data, req) => {
  function stringify(value) {
    return value.facilities.join(",");
  }

  var promise = new Promise((resolve, reject) => {
    // let string1 = (req.facilities).join(",");
    // console.log(string1);
    const documents = [
      {
        id: "1",
        content: `${req.data.preferences.bedroom} bedroom, ${
          req.data.preferences.kitchen
        } kitchen, ${req.data.preferences.toilet} toilet,${
          req.data.preferences.livingRoom
        } livingRoom in ${req.data.location}. It is ${
          req.data.furnished
        }. Facilities like ${stringify(req.data)} are avialable`,
      },
    ];

    data.map((value) => {
      let string = stringify(value);

      documents.push({
        id: value.id,
        content: `${value.rooms.bedroom} bedroom, ${
          value.rooms.kitchen
        } kitchen, ${value.rooms.toilet} toilet, ${
          value.rooms.livingRoom
        } livingroom in ${value.location}. It is ${
          value.furnished
        } . Facilities like ${stringify(value)} are avialable`,
      });
    });
    resolve(documents);
  });
  promise
    .then((documents) => {
      recommender.train(documents);
    })
    .then(() => {
      const similarDocuments = recommender.getSimilarDocuments("1", 0, 10);
    });
  const documents = await promise;
  recommender.train(documents);
  return recommender.getSimilarDocuments("1", 0, 10);
};

module.exports = recommend;
