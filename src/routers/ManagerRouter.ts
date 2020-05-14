import {Router} from 'express';
import {ProxiesRouter} from "./Manager/ProxiesRouter";
import {NamespacesRouter} from "./Manager/NamespacesRouter";
import {ResourcesRouter} from "./Manager/ResourcesRouter";
import {MethodsRouter} from "./Manager/MethodsRouter";
import {UsersRouter} from "./Manager/UsersRouter";
import {ApiKeysRouter} from "./Manager/ApiKeysRouter";
import {ConsumersRouter} from './Manager/ConsumersRouter';
import {ConfigRouter} from "./Manager/ConfigRouter";

const router: Router = Router();

// Admin routes
router.use('/proxies', ProxiesRouter);
router.use('/namespaces', NamespacesRouter);
router.use('/resources', ResourcesRouter);
router.use('/methods', MethodsRouter);
router.use('/users', UsersRouter);
router.use('/keys', ApiKeysRouter);
router.use('/consumers', ConsumersRouter);
router.use('/config', ConfigRouter);

export const ManagerRouter: Router = router;
