Meteor.methods({
    findRecords: function (collectionName, selector, option) {
        collectionName = eval(collectionName);
        option = option == null ? {} : option;
        return collectionName.find(selector, option);
    }
});