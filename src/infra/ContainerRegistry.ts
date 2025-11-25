import { Container } from "inversify";
import KnexConfig from "../config/knex";
import AuthenticationController from "../controllers/AuthenticationController";
import BrandingController from "../controllers/BrandingController";
import EnterpriseController from "../controllers/EnterpriseController";
import FileController from "../controllers/FileController";
import GatewayPaymentsController from "../controllers/GatewayPaymentsController";
import ManifestController from "../controllers/ManifestController";
import PaymentsController from "../controllers/PaymentsController";
import PlanController from "../controllers/PlanController";
import PlanPriceController from "../controllers/PlanPriceController";
import RefreshTokenController from "../controllers/RefreshTokenController";
import SubscriptionController from "../controllers/SubscriptionController";
import UserController from "../controllers/UserController";
import KnexAuthenticationGateway from "../gateway/AuthenticationGateway/KnexAuthenticationGateway";
import KnexBrandingGateway from "../gateway/BrandingGateway/KnexBrandingGateway";
import KnexEnterpriseGateway from "../gateway/EnterpriseGateway/KnexEnterpriseGateway";
import BackBlazeFileGateway from "../gateway/FileGateway/BackBlazeServiceGateway";
import KnexManifestGateway from "../gateway/ManifestGateway/KnexManifestGateway";
import KnexPaymentsGateway from "../gateway/PaymentsGateway/KnexPaymentsGateway";
import KnexPlanGateway from "../gateway/PlanGateway/KnexPlanGateway";
import KnexPlanPriceGateway from "../gateway/PlanPriceGateway /KnexPlanPriceGateway";
import KnexRefreshTokenGateway from "../gateway/RefreshTokenGateway/KnexRefreshTokenGateway";
import KnexSubscriptionGateway from "../gateway/SubscriptionGateway/KnexSubscriptionGateway";
import KnexUserGateway from "../gateway/UserGateway/KnexUserGateway";
import BCryptAdapter from "./Encrypt/BCryptAdapter";
import AxiosAdapter from "./Http/AxiosAdapter";
import JsonWebTokenAdapter from "./JwtAssign/JsonWebTokenAdapter";
import CloudFlareAdapter from "./SubDomain/CloudFlareAdapter";
import VercelAdapter from "./SubDomain/VercelAdapter";

export const Registry = {
  UserGateway: Symbol.for("UserGateway"),
  UserController: Symbol.for("UserController"),
  AuthenticationGateway: Symbol.for("AuthenticationGateway"),
  AuthenticationController: Symbol.for("AuthenticationController"),
  JsonWebTokenAdapter: Symbol.for("JsonWebTokenAdapter"),
  BCryptAdapter: Symbol.for("BCryptAdapter"),
  CloudFlareAdapter: Symbol.for("CloudFlareAdapter"),
  HttpClient: Symbol.for("HttpClient"),
  AxiosAdapter: Symbol.for("AxiosAdapter"),
  SubDomain: Symbol.for("SubDomain"),
  BrandingGateway: Symbol.for("BrandingGateway"),
  BrandingController: Symbol.for("BrandingController"),
  ManifestGateway: Symbol.for("ManifestGateway"),
  ManifestController: Symbol.for("ManifestController"),
  FileGateway: Symbol.for("FileGateway"),
  FileController: Symbol.for("FileController"),
  PaymentsGateway: Symbol.for("PaymentsGateway"),
  PaymentsController: Symbol.for("PaymentsController"),
  PlanGateway: Symbol.for("PlanGateway"),
  PlanController: Symbol.for("PlanController"),
  PlanPriceGateway: Symbol.for("PlanPriceGateway"),
  PlanPriceController: Symbol.for("PlanPriceController"),
  SubscriptionGateway: Symbol.for("SubscriptionGateway"),
  SubscriptionController: Symbol.for("SubscriptionController"),
  VercelAdapter: Symbol.for("VercelAdapter"),
  RefreshTokenGateway: Symbol.for("RefreshTokenGateway"),
  RefreshTokenController: Symbol.for("RefreshTokenController"),
  GatewayPaymentsController: Symbol.for("GatewayPaymentsController"),
  KnexConfig: Symbol.for("KnexConfig"),
  EnterpriseGateway: Symbol.for("EnterpriseGateway"),
  EnterpriseController: Symbol.for("EnterpriseController"),
  BoxesGateway: Symbol.for("BoxesGateway"),
  BoxesController: Symbol.for("BoxesController"),
  FeedbackGateway: Symbol.for("FeedbackGateway"),
  FeedbackController: Symbol.for("FeedbackController"),
  BoxBrandingGateway: Symbol.for("BoxBrandingGateway"),
  BoxBrandingController: Symbol.for("BoxBrandingController"),
};

export const container = new Container();

container.bind(Registry.JsonWebTokenAdapter).toDynamicValue(() => {
  return new JsonWebTokenAdapter();
});

container.bind(Registry.BCryptAdapter).toDynamicValue(() => {
  return new BCryptAdapter();
});

container.bind(Registry.RefreshTokenGateway).toDynamicValue(() => {
  return new KnexRefreshTokenGateway(KnexConfig);
});

container.bind(Registry.RefreshTokenController).toDynamicValue((context) => {
  return new RefreshTokenController(
    context.container.get(Registry.RefreshTokenGateway),
    context.container.get(Registry.JsonWebTokenAdapter)
  );
});

container.bind(Registry.AuthenticationGateway).toDynamicValue((context) => {
  return new KnexAuthenticationGateway(
    KnexConfig,
    context.container.get(Registry.JsonWebTokenAdapter),
    context.container.get(Registry.BCryptAdapter),
    context.container.get(Registry.UserGateway),
    context.container.get(Registry.RefreshTokenGateway)
  );
});

container.bind(Registry.AuthenticationController).toDynamicValue((context) => {
  return new AuthenticationController(
    context.container.get(Registry.AuthenticationGateway)
  );
});

container.bind(Registry.UserGateway).toDynamicValue((context) => {
  return new KnexUserGateway(
    KnexConfig,
    context.container.get(Registry.BCryptAdapter),
    context.container.get(Registry.JsonWebTokenAdapter)
  );
});

container.bind(Registry.UserController).toDynamicValue((context) => {
  return new UserController(
    context.container.get(Registry.UserGateway),
    context.container.get(Registry.EnterpriseController),
    context.container.get(Registry.AuthenticationGateway)
  );
});

container.bind(Registry.EnterpriseGateway).toDynamicValue((context) => {
  return new KnexEnterpriseGateway(KnexConfig);
});

container.bind(Registry.EnterpriseController).toDynamicValue((context) => {
  return new EnterpriseController(
    context.container.get(Registry.EnterpriseGateway)
  );
});

container.bind(Registry.HttpClient).toDynamicValue(() => {
  return new AxiosAdapter();
});

container.bind(Registry.CloudFlareAdapter).toDynamicValue((context) => {
  return new CloudFlareAdapter(context.container.get(Registry.HttpClient));
});

container.bind(Registry.BrandingGateway).toDynamicValue((context) => {
  return new KnexBrandingGateway(KnexConfig);
});

container.bind(Registry.BrandingController).toDynamicValue((context) => {
  return new BrandingController(
    context.container.get(Registry.BrandingGateway)
  );
});

container.bind(Registry.FileGateway).toDynamicValue(() => {
  return new BackBlazeFileGateway();
});

container.bind(Registry.FileController).toDynamicValue((context) => {
  return new FileController(context.container.get(Registry.FileGateway));
});

container.bind(Registry.PaymentsGateway).toDynamicValue((context) => {
  return new KnexPaymentsGateway(KnexConfig);
});

container.bind(Registry.PaymentsController).toDynamicValue((context) => {
  return new PaymentsController(
    context.container.get(Registry.PaymentsGateway),
    context.container.get(Registry.SubscriptionGateway),
    context.container.get(Registry.PlanPriceGateway)
  );
});

container.bind(Registry.PlanGateway).toDynamicValue((context) => {
  return new KnexPlanGateway(KnexConfig);
});

container.bind(Registry.PlanController).toDynamicValue((context) => {
  return new PlanController(context.container.get(Registry.PlanGateway));
});

container.bind(Registry.PlanPriceGateway).toDynamicValue((context) => {
  return new KnexPlanPriceGateway(KnexConfig);
});

container.bind(Registry.PlanPriceController).toDynamicValue((context) => {
  return new PlanPriceController(
    context.container.get(Registry.PlanPriceGateway)
  );
});

container.bind(Registry.SubscriptionGateway).toDynamicValue((context) => {
  return new KnexSubscriptionGateway(KnexConfig);
});

container.bind(Registry.SubscriptionController).toDynamicValue((context) => {
  return new SubscriptionController(
    context.container.get(Registry.SubscriptionGateway)
  );
});

container.bind(Registry.ManifestGateway).toDynamicValue((context) => {
  return new KnexManifestGateway(KnexConfig);
});

container.bind(Registry.ManifestController).toDynamicValue((context) => {
  return new ManifestController(
    context.container.get(Registry.ManifestGateway)
  );
});

container.bind(Registry.VercelAdapter).toDynamicValue((context) => {
  return new VercelAdapter(context.container.get(Registry.HttpClient));
});

container.bind(Registry.GatewayPaymentsController).toDynamicValue((context) => {
  return new GatewayPaymentsController(
    context.container.get(Registry.SubscriptionGateway),
    context.container.get(Registry.PaymentsGateway)
  );
});

container.bind(Registry.KnexConfig).toDynamicValue(() => {
  return KnexConfig;
});

container.bind(Registry.BoxesGateway).toDynamicValue(() => {
  return new (require("../gateway/BoxesGateway/KnexBoxesGateway").KnexBoxesGateway)(
    container.get(Registry.KnexConfig)
  );
});

container.bind(Registry.BoxesController).toDynamicValue((context) => {
  const BoxesController = require("../controllers/BoxesController").default;
  return new BoxesController(container.get(Registry.KnexConfig));
});

container.bind(Registry.FeedbackGateway).toDynamicValue(() => {
  return new (require("../gateway/FeedbackGateway/KnexFeedbackGateway").KnexFeedbackGateway)(
    container.get(Registry.KnexConfig)
  );
});

container.bind(Registry.FeedbackController).toDynamicValue((context) => {
  const FeedbackController =
    require("../controllers/FeedbackController").default;
  return new FeedbackController(container.get(Registry.KnexConfig));
});

container.bind(Registry.BoxBrandingGateway).toDynamicValue(() => {
  return new (require("../gateway/BoxBrandingGateway/KnexBoxBrandingGateway").KnexBoxBrandingGateway)(
    container.get(Registry.KnexConfig)
  );
});

container.bind(Registry.BoxBrandingController).toDynamicValue((context) => {
  const BoxBrandingController =
    require("../controllers/BoxBrandingController").default;
  return new BoxBrandingController(container.get(Registry.BoxBrandingGateway));
});
