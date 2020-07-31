import {InputValidationException} from "../exceptions/InputValidationException";
import validator from 'validator';
import {StratOptions} from "../models/StratOptions";


export class StrategyOptionsHandler {

    public async deleteOne(id: string): Promise<any> {
        if (!validator.isUUID(id)) {
            throw new InputValidationException('Invalid ID');
        }
        return StratOptions.destroy({where: {id}});
    }
}
