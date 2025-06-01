import Business, { type IBusiness } from '@business/src/models/business.model';

export const createBusiness = async (
  data: Partial<IBusiness>,
): Promise<IBusiness> => {
  const business = new Business(data);
  await business.save();
  return business;
};

export const getAllBusinesses = async (): Promise<IBusiness[]> => {
  return Business.find().lean() as Promise<IBusiness[]>;
};

export const getBusinessById = async (
  id: string,
): Promise<IBusiness | null> => {
  return Business.findById(id).lean() as Promise<IBusiness | null>;
};

export const updateBusiness = async (
  id: string,
  updates: Partial<IBusiness>,
): Promise<IBusiness | null> => {
  return Business.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteBusiness = async (id: string): Promise<IBusiness | null> => {
  return Business.findByIdAndDelete(id);
};
