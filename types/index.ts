import { Schema, model, Document, models, Types } from "mongoose";

export type User = {
    // _id?: string,
    name: string,
    email: string,
    password: string;
}

export interface Workspace {
  name: string;
  url: string;
  createdAt: Date;
}