var posExchangeRateTPL = Template.pos_exchangeRate;
var posExchangeRateInsertTPL = Template.pos_exchangeRateInsert;
posExchangeRateUpdateTPL = Template.pos_exchangeRateUpdate;
posExchangeRateTPL.onRendered(function () {
    createNewAlertify("exchangeRate");
});
posExchangeRateTPL.events({
    'click #add-exchange-rate': function (e, t) {
        alertify.exchangeRate(fa('plus', 'Add New Exchange Rate'), renderTemplate(posExchangeRateInsertTPL));
    },
    'click .update': function (e, t) {
        var data = this;
        alertify.exchangeRate(fa('pencil', 'Update Existing Exchange Rate'), renderTemplate(posExchangeRateUpdateTPL, data));
    }
});
posExchangeRateTPL.helpers({
    selector: function () {
        return {branchId: Session.get('currentBranch')};
        //return {branchId:"002"}
    },
    currentExchangeRate: function () {
        var id = Cpanel.Collection.Setting.findOne().baseCurrency;
        return Pos.Collection.ExchangeRates.findOne({
            base: id,
            branchId: Session.get('currentBranch')
        }, {sort: {_id: -1}});
    },
    exchangeRates: function () {
        var id = Cpanel.Collection.Setting.findOne().baseCurrency;
        // return Pos.Collection.ExchangeRates.findOne({base:id},{sort:{_id:-1,createdAt:-1}});
        return Pos.Collection.ExchangeRates.find({branchId: Session.get('currentBranch')});
    },
    baseCurrency: function () {
        var id = Cpanel.Collection.Setting.findOne().baseCurrency;
        return Cpanel.Collection.Currency.findOne(id);
    },
    currencies: function () {
        var id = Cpanel.Collection.Setting.findOne().baseCurrency;
        return Cpanel.Collection.Currency.find({_id: {$ne: id}});
    }
});
posExchangeRateInsertTPL.helpers({
    /*currentExchangeRate:function(){
     var id = Cpanel.Collection.Setting.findOne().baseCurrency;
     return Pos.Collection.ExchangeRates.findOne({base:id},{sort:{_id:-1,createdAt:-1}});
     },*/
    baseCurrency: function () {
        var id = Cpanel.Collection.Setting.findOne().baseCurrency;
        return Cpanel.Collection.Currency.findOne(id);
    },
    currencies: function () {
        var id = Cpanel.Collection.Setting.findOne().baseCurrency;
        return Cpanel.Collection.Currency.find({_id: {$ne: id}});
    }
});
posExchangeRateInsertTPL.events({
    'change .to-currency-value': function (e) {
        if ($(e.currentTarget).val() == "") {
            $(e.currentTarget).val(0);
            $(e.currentTarget).focus();
            return false;
        }
    },
    'keypress .to-currency-value': function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ($(evt.currentTarget).val().indexOf('.') != -1) {
            if (charCode == 46) {
                return false;
            }
        }
        return !(charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57));
    },
    'click #save-exchange-rate': function () {
        var valid = true;
        $('.to-currency-value').each(function () {
            valid = $(this).val() != "";
            if (valid == false) {
                return false;
            }
        });

        //if ($('.to-currency-value').val() == "" ||) {
        if (!valid) {
            alertify.error("The value can't be empty.");
            return;
        }
        var exchangeRate = {};
        exchangeRate.base = $('#base-currency-id').val();
        exchangeRate.branchId = Session.get('currentBranch');
        exchangeRate.symbol = $('#base-currency-symbol').val();
        exchangeRate.rates = [];
        $('#to-currency-list tr').each(function () {
            exchangeRate.rates.push({
                toCurrencyId: $(this).find('.to-currency-id').val(),
                rate: parseFloat($(this).find('.to-currency-value').val()),
                symbol: $(this).find('.to-currency-symbol').val()
            });
        });
        Meteor.call('insertExchangeRate', exchangeRate, function (er, re) {
            if (er) {
                alertify.error(er.message);
            } else {
                alertify.success('ExchangeRate is set successful.');
                alertify.exchangeRate().close();
            }
        });

    }
});

posExchangeRateUpdateTPL.helpers({
    exchangeRate: function () {
        return ReactiveMethod.call('findOneRecord', 'Pos.Collection.ExchangeRates', {_id: this._id}, {});
    }
});
posExchangeRateInsertTPL.events({
    'change .to-currency-value': function (e) {
        if ($(e.currentTarget).val() == "") {
            $(e.currentTarget).val(0);
            $(e.currentTarget).focus();
            return false;
        }
    },
    'keypress .to-currency-value': function (evt) {
        var charCode = (evt.which) ? evt.which : evt.keyCode;
        if ($(evt.currentTarget).val().indexOf('.') != -1) {
            if (charCode == 46) {
                return false;
            }
        }
        return !(charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57));
    },
    'click #update-exchange-rate': function () {
        var valid = true;
        $('.to-currency-value').each(function () {
            valid = $(this).val() != "";
            if (valid == false) {
                return false;
            }
        });

        //if ($('.to-currency-value').val() == "" ||) {
        if (!valid) {
            alertify.error("The value can't be empty.");
            return;
        }
        var exchangeRate = {};
        exchangeRate.base = $('#base-currency-id').val();
        exchangeRate.branchId = Session.get('currentBranch');
        exchangeRate.symbol = $('#base-currency-symbol').val();
        exchangeRate.rates = [];
        $('#to-currency-list tr').each(function () {
            exchangeRate.rates.push({
                toCurrencyId: $(this).find('.to-currency-id').val(),
                rate: parseFloat($(this).find('.to-currency-value').val()),
                symbol: $(this).find('.to-currency-symbol').val()
            });
        });
        Meteor.call('insertExchangeRate', exchangeRate, function (er, re) {
            if (er) {
                alertify.error(er.message);
            } else {
                alertify.success('ExchangeRate is set successful.');
                alertify.exchangeRate().close();
            }
        });

    }
});



