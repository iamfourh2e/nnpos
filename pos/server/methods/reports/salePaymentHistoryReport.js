Meteor.methods({
    posSalePaymentHistoryReport: function (arg) {
        if (!Meteor.userId()) {
            throw new Meteor.Error("not-authorized");
        }
        var data = {
            title: {},
            header: {},
            content: [{index: 'No Result'}],
            footer: {}
        };

        var params = {saleId: arg.saleId};
        /****** Title *****/
        data.title = Cpanel.Collection.Company.findOne();
        var header = {};
        header.saleId = arg.saleId;

        data.sale = Pos.Collection.Sales.findOne(arg.saleId);
        header.sale = data.sale;
        data.header = header;
        var payments = Pos.Collection.Payments.find(params);
        var content = [];
        var i = 1;
        if (payments.count() > 0) {
            payments.forEach(function (payment) {
                payment.order = i;
                payment.paymentDate = moment(payment.paymentDate).format('DD-MM-YY HH:mm');
                payment.dueAmount = numeral(payment.dueAmount).format('0,0.00');
                payment.balanceAmount = numeral(payment.balanceAmount).format('0,0.00');
                payment.dueAmount = numeral(payment.dueAmount).format('0,0.00');
                i++;
                content.push(payment);
            });
        }
        if (content.length > 0) {
            data.content = content;
        }
        return data
    }
});




