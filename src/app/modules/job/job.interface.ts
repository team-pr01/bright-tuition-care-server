import { ObjectId } from "mongoose";

export type TJobApplication = {
  tutor: ObjectId;
  appliedOn?: Date;
  status?: "pending" | "shortlisted" | "appointed" | "confirmed" | "rejected";
  selectedTutor?: ObjectId;
  rating?: number;
};
export type TJobs = {
  _id: string;
  jobId: string;
  title: string;
  salary: number;
  tuitionType: string;
  category: string;
  tutoringTime: string;
  tutoringDays: string;
  subjects: string;
  otherRequirements?: string;
  preferredTutorGender: "male" | "female" | "any";
  numberOfStudents: number;
  studentGender: "male" | "female" | "any";
  class: string;
  city: string;
  area: string;
  address: string;
  locationDirection: string;
  status?: "pending" | "live" | "closed" | "cancelled";
  applications: TJobApplication[];
};
