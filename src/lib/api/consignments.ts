import axios from "axios";
import type { BillingFormValues } from "@/lib/validations/billing";

export interface ConsignmentRecord extends BillingFormValues {
  _id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsignmentListParams {
  search?: string;
  paymentStatus?: string;
  segment?: string;
  page?: number;
  limit?: number;
}

export interface ConsignmentListResponse {
  success: boolean;
  message: string;
  data: ConsignmentRecord[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  errors?: unknown;
}

const BASE_URL = "/api/admin/consignments";

/** Extracts a human-readable message from an axios error, falling back to a generic one. */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string } | undefined)?.message ?? fallback;
  }
  return fallback;
}

/** Fetch a paginated, filterable list of consignments. */
export async function listConsignments(params: ConsignmentListParams = {}): Promise<ConsignmentListResponse> {
  const { data } = await axios.get<ConsignmentListResponse>(BASE_URL, { params });
  return data;
}

/** Fetch a single consignment by its Mongo id. */
export async function getConsignment(id: string): Promise<ConsignmentRecord> {
  const { data } = await axios.get<ApiResponse<ConsignmentRecord>>(`${BASE_URL}/${id}`);
  return data.data as ConsignmentRecord;
}

/** Fetch a single consignment by its human-readable consignment number. */
export async function getConsignmentByNumber(consignmentNumber: string): Promise<ConsignmentRecord | null> {
  try {
    const { data } = await axios.get<ApiResponse<ConsignmentRecord>>(
      `${BASE_URL}/number/${encodeURIComponent(consignmentNumber)}`
    );
    return (data.data as ConsignmentRecord) ?? null;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return null;
    throw error;
  }
}

/** Create a new consignment. */
export async function createConsignment(values: BillingFormValues): Promise<ConsignmentRecord> {
  const { data } = await axios.post<ApiResponse<ConsignmentRecord>>(`${BASE_URL}/create`, values);
  return data.data as ConsignmentRecord;
}

/** Replace an existing consignment's fields. */
export async function updateConsignment(id: string, values: BillingFormValues): Promise<ConsignmentRecord> {
  const { data } = await axios.put<ApiResponse<ConsignmentRecord>>(`${BASE_URL}/${id}`, values);
  return data.data as ConsignmentRecord;
}

/** Delete a consignment. */
export async function deleteConsignment(id: string): Promise<void> {
  await axios.delete(`${BASE_URL}/${id}`);
}