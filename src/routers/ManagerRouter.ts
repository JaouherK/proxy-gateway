import {Router} from 'express';
import {ProxiesRouter} from "./Manager/ProxiesRouter";
import {NamespacesRouter} from "./Manager/NamespacesRouter";
import {ResourcesRouter} from "./Manager/ResourcesRouter";
import {MethodsRouter} from "./Manager/MethodsRouter";
import {UsersRouter} from "./Manager/UsersRouter";
import {ApiKeysRouter} from "./Manager/ApiKeysRouter";
import {ConsumersRouter} from './Manager/ConsumersRouter';
import {ConfigRouter} from "./Manager/ConfigRouter";
import {SwaggerDocsRouter} from "./SwaggerDocsRouter";
import {StrategiesRouter} from "./Manager/StrategiesRouter";
import {FeaturesRouter} from "./Manager/FeaturesRouter";
import {FeaturesStrategiesRouter} from "./Manager/FeaturesStrategiesRouter";

const router: Router = Router();

// advanced routing
router.use('/proxies', ProxiesRouter);
router.use('/namespaces', NamespacesRouter);
router.use('/resources', ResourcesRouter);
router.use('/methods', MethodsRouter);

// users management
router.use('/users', UsersRouter);
router.use('/keys', ApiKeysRouter);
router.use('/consumers', ConsumersRouter);
router.use('/config', ConfigRouter);

// feature flags
router.use('/strategies', StrategiesRouter);
router.use('/features', FeaturesRouter);
router.use('/feature-strategy', FeaturesStrategiesRouter);

// Docs endpoint
router.use("/docs", SwaggerDocsRouter);

export const ManagerRouter: Router = router;
