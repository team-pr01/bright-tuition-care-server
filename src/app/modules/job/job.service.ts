/* eslint-disable @typescript-eslint/no-explicit-any */
import { TJobs } from "./job.interface";
import { Job } from "./job.model";

// Add a new job
const addJob = async (payload: TJobs) => {
  const payloadData = {
    ...payload,
    title: `Need ${payload?.category} for ${payload?.class} Student`,
  };
  const result = await Job.create(payloadData);
  return result;
};

// Get all jobs (infinite scroll ready)
const getAllJobs = async (keyword?: string, page = 1, limit = 10) => {
  const query: any = {};

  if (keyword) {
    query.$or = [
      { category: { $regex: keyword, $options: "i" } },
      { subjects: { $regex: keyword, $options: "i" } },
      { city: { $regex: keyword, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    Job.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Job.countDocuments(query),
  ]);

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get single job by ID
const getSingleJobById = async (jobId: string) => {
  const job = await Job.findById(jobId);
  return job;
};

// Update job by ID
const updateJob = async (jobId: string, payload: Partial<TJobs>) => {
  const updatedJob = await Job.findByIdAndUpdate(jobId, payload, { new: true });
  return updatedJob;
};

// Delete job by ID
const deleteJob = async (jobId: string) => {
  const deletedJob = await Job.findByIdAndDelete(jobId);
  return deletedJob;
};

export const JobServices = {
  addJob,
  getAllJobs,
  getSingleJobById,
  updateJob,
  deleteJob,
};
