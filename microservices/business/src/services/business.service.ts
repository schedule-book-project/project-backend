import Business from "../models/business.model";

export const createBusiness = async (data: any) => {
    const business = new Business(data);
    await business.save();
    return business;
};

export const getAllBusinesses = async () => {
    return Business.find().lean();
};

export const getBusinessById = async (id: string) => {
    return Business.findById(id).lean();
};

export const updateBusiness = async (id: string, updates: any) => {
    return Business.findByIdAndUpdate(id, updates, {new: true});
};

export const deleteBusiness = async (id: string) => {
    return Business.findByIdAndDelete(id);
};