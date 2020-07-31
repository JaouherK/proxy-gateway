import {InputValidationException} from "../exceptions/InputValidationException";
import {NotFoundException} from "../exceptions/NotFoundException";
import validator from 'validator';
import {Strategies} from "../models/Strategies";
import {Features} from "../models/Features";
import {FeaturesStrategies} from "../models/FeaturesStrategies";
import {StratOptions} from "../models/StratOptions";


export class FeaturesStrategiesHandler {

    public async deleteOne(featureId: string, strategyId: string): Promise<any> {
        if ((!validator.isUUID(featureId)) || (!validator.isUUID(strategyId))) {
            throw new InputValidationException('Invalid ID');
        }
        return FeaturesStrategies.destroy({where: {features_id: featureId, strategies_id: strategyId}});
    }

    /**
     * add/update Feature
     * @return {any}
     * @param apiData
     * @param url
     */
    public async addOrUpdate(apiData: any, url: string): Promise<any> {

        if ((!validator.isUUID(apiData.features_id)) || (!validator.isUUID(apiData.strategies_id))) {
            throw new InputValidationException('Invalid ID');
        }

        const c = await Strategies.findByPk(apiData.strategies_id, {
            include: [StratOptions]
        });

        const h = c?.options.map((item: any) => {
            return item.name;
        }) ?? [];

        // turn array to object while transiting the value to a key
        apiData.parameters = JSON.stringify(h.reduce(function (obj, v) {
            obj[v] = '';
            return obj;
        }, {}));

        await FeaturesStrategies.upsert(apiData);

        const response = await Features.findByPk(
            apiData.features_id,
            {
                include: [
                    {
                        model: Strategies,
                        attributes: ['id', 'name', 'description'],
                        through: {attributes: ["parameters"]}
                    }
                ],
                attributes: ['id', 'name', 'description', 'enabled']
            }
        );

        if (response === null) {
            throw new NotFoundException("An error occurred. Strategy not found");
        }

        return response;
    }
}
