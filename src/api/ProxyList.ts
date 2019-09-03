import {Proxies} from "../models/Proxies";
import {ProxyProcessData} from "./ProxyProcessData";
import {Resources} from "../models/Resources";
import {Namespaces} from "../models/Namespaces";
import {Methods} from "../models/Methods";
import {sequelize} from "../sequelize";
import {Consumers} from "../models/Consumers";
import {Keys} from "../models/Keys";

class ProxyList {

    constructor() {
        sequelize.addModels([Proxies]);
    }

    public static async getAllProxyMappings(): Promise<ProxyProcessData[]> {
        await Proxies.sync();
        await Namespaces.sync();
        await Resources.sync();
        await Methods.sync();
        const process = await Proxies.findAll({
            order: [
                ['order', 'DESC']
            ],
        });
        const arr: ProxyProcessData[] = [];
        process.forEach((value: any) => {
            const aux = new ProxyProcessData(
                value.id,
                value.namespacesId,
                value.namespace,
                value.url,
                value.endpointUrl,
                value.https,
                value.method,
                value.denyUpload,
                value.limit,
                value.authType,
                value.timeout,
                value.integrationType,
                value.mockResponseBody,
                value.mockResponseCode,
                value.mockResponseContent,
                value.order
            );
            arr.push(aux);
        });
        Consumers.sync();
        Keys.sync();
        return arr;
    }
}

export {ProxyList};
