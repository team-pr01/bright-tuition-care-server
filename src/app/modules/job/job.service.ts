/* eslint-disable @typescript-eslint/no-explicit-any */
import { TJobs } from "./job.interface";
import { Job } from "./job.model";

type TJobFilters = {
  keyword?: string;
  tuitionType?: string;
  category?: string;
  studentGender?: "male" | "female" | "any";
  class?: string;
  city?: string;
  area?: string;
  tutoringDays?: string;
  preferredTutorGender?: "male" | "female" | "any";
};

// Add a new job
const addJob = async (payload: TJobs) => {
  const payloadData = {
    ...payload,
    title: `Need ${payload?.category} for ${payload?.class} Student`,
  };
  const result = await Job.create(payloadData);
  return result;
};

// Get all jobs (infinite scroll)
const getAllJobs = async (filters: TJobFilters = {}, skip = 0, limit = 10) => {
  const query: any = {};

  // Search on jobId or title
  if (filters.keyword) {
    query.$or = [
      { jobId: { $regex: filters.keyword, $options: "i" } },
      { title: { $regex: filters.keyword, $options: "i" } },
    ];
  }

  // Filters (all case-insensitive)
  if (filters.tuitionType)
    query.tuitionType = { $regex: `^${filters.tuitionType}$`, $options: "i" };
  if (filters.category)
    query.category = { $regex: `^${filters.category}$`, $options: "i" };
  if (filters.studentGender)
    query.studentGender = {
      $regex: `^${filters.studentGender}$`,
      $options: "i",
    };
  if (filters.class)
    query.class = { $regex: `^${filters.class}$`, $options: "i" };
  if (filters.city) query.city = { $regex: `^${filters.city}$`, $options: "i" };
  if (filters.area) query.area = { $regex: `^${filters.area}$`, $options: "i" };
  if (filters.tutoringDays)
    query.tutoringDays = { $regex: filters.tutoringDays, $options: "i" };
  if (filters.preferredTutorGender)
    query.preferredTutorGender = {
      $regex: `^${filters.preferredTutorGender}$`,
      $options: "i",
    };

  const [data, total] = await Promise.all([
    Job.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Job.countDocuments(query),
  ]);

  return {
    data,
    meta: {
      total,
      skip,
      limit,
      hasMore: skip + data.length < total, // useful for infinite scroll
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
