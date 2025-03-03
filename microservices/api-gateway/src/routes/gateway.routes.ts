import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { services } from "../config/services.config";
import {authenticate} from "../../../../shared/middlewares/auth.middleware.ts";

const router = express.Router();

// Proxy for Admin Service
router.use("/admin", authenticate, createProxyMiddleware({ target: services.admin, changeOrigin: true }));

// Proxy for Business Service
router.use("/business", authenticate, createProxyMiddleware({ target: services.business, changeOrigin: true }));

// Proxy for Booking Service
router.use("/booking", authenticate, createProxyMiddleware({ target: services.booking, changeOrigin: true }));

// Proxy for Review Service
router.use("/review", authenticate, createProxyMiddleware({ target: services.review, changeOrigin: true }));

export default router;