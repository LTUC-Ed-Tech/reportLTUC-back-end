'use strict';

class CRUD {
    constructor(schema) {
        this.schema = schema
    }

    create(request) {
        let record = new this.schema(request)
        return record.save();
    }

    read(_id) {
        if (_id) {
            return this.schema.find({ _id })
        } else {
            return this.schema.find({})
        }
    }

    update(request, _id) {
        return this.schema.findByIdAndUpdate(_id, request, { new: true });
    }

    delete(_id) {
        return this.schema.findByIdAndDelete(_id)
    }

}

module.exports = CRUD;