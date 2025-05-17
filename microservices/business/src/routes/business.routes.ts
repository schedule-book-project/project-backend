import express from "express";
import {
    createBusiness,
    deleteBusiness,
    getAllBusinesses,
    getBusinessById,
    updateBusiness
} from "../services/business.service";
import { authenticate } from "@shared/middlewares/auth.middleware";
import asyncHandler from '../../../../shared/utils/asyncHandler';
import { businessValidation } from '../../../../shared/validations/validationSchemas';

const router = express.Router();

router.post(
  "/",
  authenticate,
  businessValidation,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const business = await createBusiness({ ...req.body, owner: (req as any).user.userId });
    res.status(201).json({ success: true, business });
  })
);

router.get("/", asyncHandler(async (_req: express.Request, res: express.Response) => {
  const businesses = await getAllBusinesses();
  res.status(200).json({ success: true, businesses });
}));

router.get("/:id", asyncHandler(async (req: express.Request, res: express.Response) => {
  const business = await getBusinessById(req.params.id);
  res.status(200).json({ success: true, business });
}));

router.put(
  "/:id",
  authenticate,
  businessValidation,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    const business = await updateBusiness(req.params.id, req.body);
    res.status(200).json({ success: true, business });
  })
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(async (req: express.Request, res: express.Response) => {
    await deleteBusiness(req.params.id);
    res.status(200).json({ success: true, message: "Business deleted" });
  })
);

export default router;
